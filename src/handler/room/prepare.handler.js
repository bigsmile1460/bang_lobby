import { plainToInstance } from 'class-transformer';
import RedisManager from '../../classes/manager/redis.manager.js';
import { socketManager } from '../../classes/manager/socketManager.js';
import Game from '../../classes/model/game.class.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { Packets } from '../../init/loadProtos.js';
import { gamePrepareNotification } from '../../utils/notification/gamePrepare.notification.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { shuffle } from '../../utils/shuffle.js';
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

    // await setUpGame(roleTypes, cardDeck, characterList, room);
///////////////////////////////////////
  const roleTypeClone = shuffle(roleTypes[room.users.length]);
  console.log(`roleTypeClone 셔플 끝 roleTypeClone : ${roleTypeClone} date:`,Date.now());
  const deck = shuffle(cardDeck);
  console.log(`deck 셔플 끝 deck : ${deck}`,Date.now());
  const shuffledCharacter = shuffle(characterList).splice(0, room.users.length);
  console.log(`shuffledCharacter 셔플 끝 shuffledCharacter : ${shuffledCharacter} date:`,Date.now());
  

  // 병렬 처리로 사용자 데이터 초기화
  const userTasks = room.users.map((user, index) => {
    // 사용자별 카드 배분
    const start = index * user.characterData.hp;
    const end = start + user.characterData.hp;
    const gainCards = deck.slice(start, end);
    gainCards.forEach((card) => user.addHandCard(card));

    // 캐릭터 및 역할 할당
    user.setCharacterRoleType(roleTypeClone[index]);
    user.setCharacter(shuffledCharacter[index].type);

    // 역할에 따른 추가 작업
    if (user.characterData.roleType === Packets.RoleType.TARGET) {
      user.increaseHp();
    }
    console.log(`${index}번째 userTasks 끝 :`, Date.now());
  
    return Promise.resolve(); // 비동기 처리 유지
  });

  // 덱 업데이트
  room.deck = deck.slice(room.users.length * room.users[0].characterData.hp);
  console.log(`덱 업데이트 끝 room.deck : ${room.deck}`, Date.now());

///////////////////////////////////////
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
    console.log(`room.gameStart() 시작`, Date.now());
    
    // Notification에서 보내면 안되는 것: 본인이 아닌 handCards, target을 제외한 roleType
    // 카드 배분은 정상적으로 하고, 보내지만 않기
    // 방 유저에게 알림

      // 모든 작업 완료까지 대기
    await Promise.all(userTasks);
  
    setTimeout(async ()=>{
      for (const user of room.users) {
        try {
          user.maxHp = user.characterData.hp;
          const notificationPayload = gamePrepareNotification(room, user);
          const socket = socketManager.getSocket(user.socket.jwt);
  
          if (socket && !socket.destroyed) {
            console.log(`notification ${notificationPayload} :`,Date.now())
            socket.write(
              createResponse(PACKET_TYPE.GAME_PREPARE_NOTIFICATION, 0, notificationPayload),
            );
          } else {
            console.log('Socket not available or already closed.');
          }
        } catch (error) {
          console.error(error);
        }
      }
  
      // await redis.setHash('room', room.id, JSON.stringify(room)); // 방 정보 업데이트
      console.dir(room,{ depth: null })
      await redis.publish('lobby', JSON.stringify(room));
      //게임서버에서 받으면 set데이터를 올리고 get으로 True/false
      // TCP ack 4byte seq 집어넣어서 확인한다.
  
      const preparePayload = {
        gamePrepareResponse: {
          success: true,
          failCode: Packets.GlobalFailCode.NONE_FAILCODE,
        },
      };
      console.log(`gamePrepareResponse ${preparePayload}:`,Date.now())
      socket.write(createResponse(PACKET_TYPE.GAME_PREPARE_RESPONSE, 0, preparePayload));
  
      //prepare를 다 보내고 나면 socketManager, socket에서 삭제
  
      for (const user of room.users) {
        socketManager.removeSocket(user.socket.jwt);
      }
    },1000)
    
  } catch (err) {
    console.error(err);
  }
}
