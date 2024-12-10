import { PACKET_TYPE } from '../../constants/header.js';
import { addGameSession, joinGameSession } from '../../sessions/game.session.js';
import { getUser } from '../../sessions/user.session.js';
import CustomError from '../../utils/error/customError.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { Packets } from '../../init/loadProtos.js';
import { roomManager } from '../../classes/manager/room.manager.js';

export const createRoomHandler = async (socket, payload) => {
  const { name, maxUserNum } = payload.createRoomRequest;
  const user = getUser(socket.jwt);
  if (!user) {
    throw new CustomError(`유저를 찾을 수 없음`);
  }

  const ownerId = user.id;
  try {
    // RoomManager를 사용하여 새로운 방 ID 생성
    const roomId = roomManager.createRoom();

    const gameSession = addGameSession(roomId, ownerId, name, maxUserNum);

    if (!gameSession) {
      const errorResponsePayload = {
        createRoomResponse: {
          success: false,
          room: {},
          failCode: Packets.GlobalFailCode.CREATE_ROOM_FAILED,
        },
      };
      socket.write(createResponse(PACKET_TYPE.CREATE_ROOM_RESPONSE, 0, errorResponsePayload));
    }
    user.roomId = roomId;
    const gameJoinSession = joinGameSession(roomId, user);

    const payloadResponse = {
      createRoomResponse: {
        success: true,
        room: {
          id: gameJoinSession.id,
          ownerId: gameSession.ownerId,
          name: gameJoinSession.name,
          maxUserNum: gameJoinSession.maxUserNum,
          state: Packets.RoomStateType.WAIT,
          users: gameJoinSession.users,
        },
        failCode: Packets.GlobalFailCode.NONE_FAILCODE,
      },
    };
    socket.write(createResponse(PACKET_TYPE.CREATE_ROOM_RESPONSE, 0, payloadResponse));
  } catch (err) {
    console.error(`방 만들기 실패: ${err}`);
  }
};
