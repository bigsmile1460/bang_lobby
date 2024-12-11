import { findGameById, getAllGameSessions, joinGameSession } from '../../sessions/game.session.js';
import { getUser } from '../../sessions/user.session.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { joinRoomNotification } from '../../utils/notification/joinRoom.notification.js';
import { Packets } from '../../init/loadProtos.js';
import RedisManager from '../../classes/manager/redis.manager.js';
import { socketManager } from '../../classes/manager/SocketManager.js';

export const joinRoomHandler = async (socket, payload) => {
  const redis = RedisManager.getInstance();
  const { roomId } = payload.joinRoomRequest;

  const joinUser = await getUser(socket.jwt);
  if (!joinUser) {
    const errorResponsePayload = {
      joinRoomResponse: {
        success: false,
        room: null,
        failCode: Packets.GlobalFailCode.JOIN_ROOM_FAILED,
      },
    };

    socket.write(createResponse(PACKET_TYPE.JOIN_ROOM_RESPONSE, 0, errorResponsePayload));
    return;
  }

  const room = await redis.getHash('room', roomId);

  if (isFullRoom(room)) {
    const errorResponsePayload = {
      joinRoomResponse: {
        success: false,
        room: null,
        failCode: Packets.GlobalFailCode.JOIN_ROOM_FAILED,
      },
    };

    socket.write(createResponse(PACKET_TYPE.JOIN_ROOM_RESPONSE, 0, errorResponsePayload));
    return;
  }

  if (isGamingRoom(room)) {
    const errorResponsePayload = {
      joinRoomResponse: {
        success: false,
        room: null,
        failCode: Packets.GlobalFailCode.JOIN_ROOM_FAILED,
      },
    };

    socket.write(createResponse(PACKET_TYPE.JOIN_ROOM_RESPONSE, 0, errorResponsePayload));
    return;
  }

  joinUser.roomId = roomId;

  room.users.push(joinUser);
  await redis.setHash('room', roomId, JSON.stringify(room));

  // 방 안의 모든 유저에게 해당 유저 join 알림
  
  await room.users.forEach((user) => {
    const response = joinRoomNotification(joinUser);
    try {
      const socket = socketManager.getSocket(user.socket.jwt);
      if (socket && !socket.destroyed) {
        socket.write(createResponse(PACKET_TYPE.JOIN_ROOM_NOTIFICATION, 0, response));
      } else {
        console.log('Socket not available or already closed.');
      }
    } catch (error) {
      console.error(error);
    }
  });

  const responsePayload = {
    joinRoomResponse: {
      success: true,
      room: room,
      failCode: Packets.GlobalFailCode.NONE_FAILCODE,
    },
  };

  socket.write(createResponse(PACKET_TYPE.JOIN_ROOM_RESPONSE, 0, responsePayload));
};

export const joinRandomRoomHandler = (socket, payload) => {
  const joinUser = getUser(socket.jwt);
  if (!joinUser) {
    const errorResponsePayload = {
      joinRandomRoomResponse: {
        success: false,
        room: null,
        failCode: Packets.GlobalFailCode.JOIN_ROOM_FAILED,
      },
    };

    socket.write(createResponse(PACKET_TYPE.JOIN_RANDOM_ROOM_RESPONSE, 0, errorResponsePayload));
    return;
  }

  const rooms = getAllGameSessions();
  //풀방 빼고 다시 랜덤
  const filteredRoom = rooms.filter((room) => !room.isFullRoom());
  if (filteredRoom.length === 0) {
    const errorResponsePayload = {
      joinRandomRoomResponse: {
        success: false,
        room: null,
        failCode: Packets.GlobalFailCode.ROOM_NOT_FOUND,
      },
    };

    socket.write(createResponse(PACKET_TYPE.JOIN_RANDOM_ROOM_RESPONSE, 0, errorResponsePayload));
    return;
  }

  const roomId = Math.floor(Math.random() * filteredRoom.length) + 1;

  joinUser.roomId = roomId;
  const room = joinGameSession(roomId, joinUser);
  // 방 안의 모든 유저에게 해당 유저 join 알림
  const notificationResponse = joinRoomNotification(joinUser);
  room.users.forEach((user) => {
    user.socket.write(createResponse(PACKET_TYPE.JOIN_ROOM_NOTIFICATION, 0, notificationResponse));
  });

  const responsePayload = {
    joinRandomRoomResponse: {
      success: true,
      room: room,
      failCode: Packets.GlobalFailCode.NONE_FAILCODE,
    },
  };

  socket.write(createResponse(PACKET_TYPE.JOIN_RANDOM_ROOM_RESPONSE, 0, responsePayload));
};

const isFullRoom = (room) => {
  return parseInt(room.users.length) >= parseInt(room.maxUserNum) ? true : false;
};

const isGamingRoom = (room) => {
  return room.state !== Packets.RoomStateType.WAIT;
};
