import RedisManager from '../../classes/manager/redis.manager.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { getAllGameSessions } from '../../sessions/game.session.js';
import { createResponse } from '../../utils/response/createResponse.js';

const getRoomListHandler = async (socket, payload) => {
  const redis = RedisManager.getInstance();
  const rooms = JSON.parse(await redis.getHvals('room'));

  const responsePayload = {
    getRoomListResponse: {
      rooms: [rooms],
    },
  };

  socket.write(createResponse(PACKET_TYPE.GET_ROOM_LIST_RESPONSE, 0, responsePayload));
};

export default getRoomListHandler;
