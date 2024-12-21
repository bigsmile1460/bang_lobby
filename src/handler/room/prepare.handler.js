import { plainToInstance } from 'class-transformer';
import RedisManager from '../../classes/manager/redis.manager.js';
import { socketManager } from '../../classes/manager/socketManager.js';
import Game from '../../classes/model/game.class.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { Packets } from '../../init/loadProtos.js';
import { gamePrepareNotification } from '../../utils/notification/gamePrepare.notification.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { setUpGame, shuffle } from '../../utils/shuffle.js';
import User from '../../classes/model/user.class.js';
import CharacterData from '../../classes/model/characterData.class.js';

export const gamePrepareHandler = async (socket, payload) => {
  try {
    const redis = RedisManager.getInstance();
    const ownerUser = await redis.getHash('user', socket.jwt);
    const roleTypes = await redis.get('roleTypes');
    const cardDeck = await redis.get('cardDeck');
    const characterList = await redis.get('characterList');
    const roomData = await redis.getHash('room', ownerUser.roomId);
    const shuffleCardDeck = shuffle(cardDeck);
    roomData.deck = shuffleCardDeck;
    console.log('원본 덱 : ', roomData.deck);
    
    let isRunning = true;
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

    let users = [];
    for (const user of roomData.users) {
      user.characterData.handCards = new Map(Object.entries(user.characterData.handCards));
      user.characterData = plainToInstance(CharacterData, user.characterData);
      users.push(plainToInstance(User, user));
    }
    const room = plainToInstance(Game, roomData);

    
    
    room.users = users;
    
    

    
    isRunning = setUpGame(roleTypes, shuffleCardDeck, characterList, room);
  

    // 이후 작업 실행
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

    room.state = Packets.RoomStateType.PREPARE;

    while (true) {
      console.log('isRunning');
      if (isRunning) {
        await new Promise((resolve) => setTimeout(resolve, 100)); // 1초 대기
      } else {
        for (const user of room.users) {
          try {
            const notificationPayload = gamePrepareNotification(room, user);
            const userSocket = await socketManager.getSocket(user.socket.jwt);
            console.log(`${user.nickname}의 카드:`,user.characterData.handCards);
            if (userSocket && !userSocket.destroyed) {
              await userSocket.write(
                createResponse(PACKET_TYPE.GAME_PREPARE_NOTIFICATION, 0, notificationPayload),
              );
              if (room.ownerId !== user.id) {
                socketManager.removeSocket(user.socket.jwt);
              }
            } else {
              console.log('Socket not available or already closed.');
            }
          } catch (error) {
            console.error('Error notifying user:', error);
          }
        }
        
        await redis.publish('lobby', JSON.stringify(room));

        const preparePayload = {
          gamePrepareResponse: {
            success: true,
            failCode: Packets.GlobalFailCode.NONE_FAILCODE,
          },
        };
        await socket.write(createResponse(PACKET_TYPE.GAME_PREPARE_RESPONSE, 0, preparePayload));

        socket.destroy();

        break;
      }
    }


  } catch (err) {
    console.error(err);
  }
};
