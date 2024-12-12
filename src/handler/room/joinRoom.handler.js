import { PACKET_TYPE } from '../../constants/header.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { joinRoomNotification } from '../../utils/notification/joinRoom.notification.js';
import { Packets } from '../../init/loadProtos.js';
import RedisManager from '../../classes/manager/redis.manager.js';
import { socketManager } from '../../classes/manager/SocketManager.js';

export const joinRoomHandler = async (socket, payload) => {
  const redis = RedisManager.getInstance();
  const { roomId } = payload.joinRoomRequest;

  const joinUser = await redis.getHash('user', socket.jwt);
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
  await redis.setHash('user', joinUser.socket.jwt, JSON.stringify(joinUser));
  room.users.push(joinUser);
  room.usersNum += 1;
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

export const joinRandomRoomHandler = async (socket, payload) => {
  const redis = RedisManager.getInstance();
  const joinUser = await redis.getHash('user', socket.jwt);
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

  const roomData = await redis.getHvals('room');
  const rooms = roomData.map((data) => JSON.parse(data));

  //풀방 빼고 다시 랜덤
  const filteredRoom = rooms.filter((room) => !isFullRoom(room));
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

  const roomIndex = Math.floor(Math.random() * filteredRoom.length);

  const room = filteredRoom[roomIndex];

  const roomId = room.id;

  joinUser.roomId = roomId;
  await redis.setHash('user', joinUser.socket.jwt, JSON.stringify(joinUser));
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
