import { plainToInstance } from 'class-transformer';
import RedisManager from '../../classes/manager/redis.manager.js';
import { socketManager } from '../../classes/manager/SocketManager.js';
import Game from '../../classes/model/game.class.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { Packets } from '../../init/loadProtos.js';
import { gamePrepareNotification } from '../../utils/notification/gamePrepare.notification.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { setUpGame } from '../../utils/shuffle.js';
import User from '../../classes/model/user.class.js';
import CharacterData from '../../classes/model/characterData.class.js';

export const gamePrepareHandler = async (socket, payload) => {
  try {
    const redis = RedisManager.getInstance();
    const ownerUser = await redis.getHash('user', socket.jwt);
    // 방장 존재 여부
    if (!ownerUser) {
      const errorResponse = {
        gamePrepareResponse: {
          success: false,
          failCode: Packets.GlobalFailCode.NOT_ROOM_OWNER,
        },
      };

      socket.write(createResponse(PACKET_TYPE.GAME_PREPARE_RESPONSE, 0, errorResponse));
      return;
    }

    // 게임 존재 여부
    const roomData = await redis.getHash('room', ownerUser.roomId);
    let users = [];
    roomData.users.forEach((user, i) => {
      user.characterData.handCards = new Map(Object.entries(user.characterData.handCards));
      user.characterData = plainToInstance(CharacterData, user.characterData);
      users.push(plainToInstance(User, user));
    });
    const room = plainToInstance(Game, roomData);
    room.users = users;
    // const inGameUsers = room.users;
    if (!room) {
      const errorResponse = {
        gamePrepareResponse: {
          success: false,
          failCode: Packets.GlobalFailCode.INVALID_ROOM_STATE,
        },
      };
      socket.write(createResponse(PACKET_TYPE.GAME_PREPARE_RESPONSE, 0, errorResponse));
      return;
    }

    room.gameStart();

    room.deck = setUpGame(room.users);

    

    // Notification에서 보내면 안되는 것: 본인이 아닌 handCards, target을 제외한 roleType
    // 카드 배분은 정상적으로 하고, 보내지만 않기
    // 방 유저에게 알림

    room.users.forEach((user) => {
      try {
        user.maxHp = user.characterData.hp;
        const notificationPayload = gamePrepareNotification(room, user);
        const socket = socketManager.getSocket(user.socket.jwt);
        if (socket && !socket.destroyed) {
          socket.write(
            createResponse(PACKET_TYPE.GAME_PREPARE_NOTIFICATION, 0, notificationPayload),
          );
        } else {
          console.log('Socket not available or already closed.');
        }
      } catch (error) {
        console.error(error);
      }
    });
    await redis.setHash('room', room.id, room); // 방 정보 업데이트
    //TODO: pub -> 게임서버 인메모리로?
    const preparePayload = {
      gamePrepareResponse: {
        success: true,
        failCode: Packets.GlobalFailCode.NONE_FAILCODE,
      },
    };

    socket.write(createResponse(PACKET_TYPE.GAME_PREPARE_RESPONSE, 0, preparePayload));
  } catch (err) {
    console.error(err);
  }
};
