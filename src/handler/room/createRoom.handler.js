import { PACKET_TYPE } from '../../constants/header.js';
import { getUser } from '../../sessions/user.session.js';
import CustomError from '../../utils/error/customError.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { Packets } from '../../init/loadProtos.js';
import RedisManager from '../../classes/manager/redis.manager.js';
import Game from '../../classes/model/game.class.js';

export const createRoomHandler = async (socket, payload) => {
  const { name, maxUserNum } = payload.createRoomRequest;
  const user = await getUser(socket.jwt);

  if (!user) {
    throw new CustomError(`유저를 찾을 수 없음`);
  }
  const redis = RedisManager.getInstance();
  const ownerId = user.id;
  try {
    // RoomManager를 사용하여 새로운 방 ID 생성
    let roomId = await redis.hashLength('room') + 1; 
    let roomExists = await redis.hExists('room',roomId);
    while(roomExists){
      roomId += 1;
      roomExists = await redis.hExists('room',roomId);
    }
    const newGame = new Game(roomId, ownerId, name, maxUserNum, user);
    await redis.setHash('room', roomId, JSON.stringify(newGame)); 
    user.roomId = roomId;
    
    const payloadResponse = {
      createRoomResponse: {
        success: true,
        room: {
          id: roomId,
          ownerId: ownerId,
          name: name,
          maxUserNum: maxUserNum,
          state: Packets.RoomStateType.WAIT,
          users: [user],
        },
        failCode: Packets.GlobalFailCode.NONE_FAILCODE,
      },
    };
    socket.write(createResponse(PACKET_TYPE.CREATE_ROOM_RESPONSE, 0, payloadResponse));
  } catch (err) {
    console.error(`방 만들기 실패: ${err}`);
  }
};
