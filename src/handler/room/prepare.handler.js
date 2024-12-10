import { cardDeck } from '../../constants/cardDeck.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { Packets } from '../../init/loadProtos.js';
import { findGameById } from '../../sessions/game.session.js';
import { getUser } from '../../sessions/user.session.js';
import { gamePrepareNotification } from '../../utils/notification/gamePrepare.notification.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { shuffle, shuffledCharacter, shuffledRoleType } from '../../utils/shuffle.js';

export const gamePrepareHandler = (socket, payload) => {
  try {
    const ownerUser = getUser(socket.jwt);
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
    const currentGame = findGameById(ownerUser.roomId);
    const inGameUsers = currentGame.users;
    if (!currentGame) {
      const errorResponse = {
        gamePrepareResponse: {
          success: false,
          failCode: Packets.GlobalFailCode.INVALID_ROOM_STATE,
        },
      };
      socket.write(createResponse(PACKET_TYPE.GAME_PREPARE_RESPONSE, 0, errorResponse));
      return;
    }

    currentGame.gameStart();

    shuffledCharacter(inGameUsers);
    shuffledRoleType(inGameUsers);

    const deck = shuffle(cardDeck);

    // 카드 배분
    inGameUsers.forEach((user) => {
      const gainCards = deck.splice(0, user.characterData.hp);
      gainCards.forEach((card) => user.addHandCard(card));
      // WARN: Test code
      // user.characterData.handCards = [
      // { type: Packets.CardType.BIG_BBANG, count: 2 },
      //   { type: Packets.CardType.ABSORB, count: 2 },
      // { type: Packets.CardType.HALLUCINATION, count: 2 },
      // { type: Packets.CardType.SHIELD, count: 2 },
      //   { type: Packets.CardType.FLEA_MARKET, count: 1 },
      //   { type: Packets.CardType.AUTO_RIFLE, count: 1 },
      //   { type: Packets.CardType.GUERRILLA, count: 1 },
      //   { type: Packets.CardType.CALL_119, count: 1 },
      //   { type: Packets.CardType.HAND_GUN, count: 1 },
      //   { type: Packets.CardType.DESERT_EAGLE, count: 1 },
      //   { type: Packets.CardType.LASER_POINTER, count: 1 },
      //   { type: Packets.CardType.RADAR, count: 1 },
      //   { type: Packets.CardType.AUTO_SHIELD, count: 1 },
      //   { type: Packets.CardType.CONTAINMENT_UNIT, count: 1 },
      //   { type: Packets.CardType.SATELLITE_TARGET, count: 1 },
      //   { type: Packets.CardType.BOMB, count: 1 },
      // ];
      // user.characterData.handCardsCount = 4;
    });

    // 유저들한테 손패 나눠주고 게임 객체에 덱 저장
    currentGame.deck = deck;

    // Notification에서 보내면 안되는 것: 본인이 아닌 handCards, target을 제외한 roleType
    // 카드 배분은 정상적으로 하고, 보내지만 않기
    // 방 유저에게 알림
    inGameUsers.forEach((user) => {
      user.maxHp = user.characterData.hp;
      const notificationPayload = gamePrepareNotification(currentGame, user);
      user.socket.write(
        createResponse(PACKET_TYPE.GAME_PREPARE_NOTIFICATION, 0, notificationPayload),
      );
    });

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
