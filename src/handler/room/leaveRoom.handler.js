import { PACKET_TYPE } from '../../constants/header.js';
import leaveRoomNotification from '../../utils/notification/leaveRoom.nofitication.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { Packets } from '../../init/loadProtos.js';
import RedisManager from '../../classes/manager/redis.manager.js';
import { socketManager } from '../../classes/manager/socketManager.js';

export const leaveRoomHandler = async (socket, payload) => {
  try {
    const redis = RedisManager.getInstance();
    const leaveUser = await redis.getHash('user', socket.jwt);
    const roomId = leaveUser.roomId;
    const room = await redis.getHash('room', leaveUser.roomId);
    //방장이 나갔을 경우
    if (leaveUser.id === room.ownerId) {
      const responsePayload = {
        leaveRoomResponse: {
          success: true,
          failCode: Packets.GlobalFailCode.NONE_FAILCODE,
        },
      };
      for (let i = 0; i < room.users.length; i++) {
        const user = room.users[i];
        try {
          user.roomId = null;
          await redis.setHash('user', user.socket.jwt, JSON.stringify(user));
          const socket = socketManager.getSocket(user.socket.jwt);
          if (socket && !socket.destroyed) {
            console.log(`${user.nickname}에게 노티 전달`);
            socket.write(createResponse(PACKET_TYPE.LEAVE_ROOM_RESPONSE, 0, responsePayload));
          } else {
            console.log('Socket not available or already closed.');
          }
        } catch (error) {
          console.error(error);
        }
      }

      await redis.delHash('room', roomId);
      return;
    }
    // 방장 아닌 사람이 나갔을 때
    leaveUser.roomId = null;
    await redis.setHash('user', leaveUser.socket.jwt, JSON.stringify(leaveUser));

    const leaveIndex = room.users.findIndex((u) => u.id === leaveUser.id);
    if (leaveIndex !== -1) {
      room.users.splice(leaveIndex, 1);
    }
    await redis.setHash('room', roomId, JSON.stringify(room));

    const payload = leaveRoomNotification(leaveUser);

    for (let i = 0; i < room.users.length; i++) {
      const user = room.users[i];
      try {
        const socket = socketManager.getSocket(user.socket.jwt);
        if (socket && !socket.destroyed) {
          socket.write(createResponse(PACKET_TYPE.LEAVE_ROOM_NOTIFICATION, 0, payload));
        } else {
          console.log('Socket not available or already closed.22');
        }
      } catch (error) {
        console.error(error);
      }
    }

    const responsePayload = {
      leaveRoomResponse: {
        success: true,
        failCode: Packets.GlobalFailCode.NONE_FAILCODE,
      },
    };

    socket.write(createResponse(PACKET_TYPE.LEAVE_ROOM_RESPONSE, 0, responsePayload));
  } catch (err) {
    console.error(err);
  }
};
