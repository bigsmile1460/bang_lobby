import { createResponse } from '../../utils/response/createResponse.js';
import phaseTime from '../../constants/phaseTime.js';
import { Packets } from '../../init/loadProtos.js';
import { phaseUpdateNotification } from '../../utils/notification/phaseUpdate.notification.js';
import userUpdateNotification from '../../utils/notification/userUpdate.notification.js';
import EventManager from '../manager/event.manager.js';
import IntervalManager from '../manager/interval.manager.js';
import { PACKET_TYPE } from '../../constants/header.js';

// 1. 방 === 게임 <--- 기존 강의나 전 팀플에서 썼던 game세션과 game 클래스 같이 써도 되지않을까?
// IntervalManager 게임 세션별로 하나씩 두고 얘가 낮밤 관리하게
class Game {
  constructor(id, ownerId, name, maxUserNum) {
    this.id = id;
    this.ownerId = ownerId;
    this.name = name; // 방제목
    this.maxUserNum = maxUserNum;

    // WAIT, PREPARE, INAGAME
    this.state = Packets.RoomStateType.WAIT;
    this.users = [];
    this.usersNum = 0;
    this.fleaMarketUsers = [];

    this.deck = [];
    this.fleaMarketDeck = [];

    this.currentPhase = Packets.PhaseType.DAY;
    this.nextPhase = Packets.PhaseType.END;

    // this.eventQueue = [];
    this.events = new EventManager();
    this.intervalManager = new IntervalManager();
    this.events.init();
  }

  release() {
    this.intervalManager.clearAll();
    this.events.clearAll();
    this.intervalManager = null;
    this.events.eventEmitter = null;
    this.events = null;
  }

  getAliveUsers() {
    return this.users.filter((user) => user.isAlive());
  }

  returnCardToDeck(cardType) {
    this.deck.push(cardType);
    console.log(this.deck);
  }

  changePhase() {
    const time = phaseTime[this.currentPhase];

    this.intervalManager.removeInterval(this.id, 'gameChangePhase');
    this.intervalManager.addInterval(
      this.id,
      () => {
        try {
          const tmp = this.currentPhase;
          this.currentPhase = this.nextPhase;
          this.nextPhase = tmp;
          const responseNotification = phaseUpdateNotification(this);
          this.users.forEach((user) => {
            user.socket.write(
              createResponse(PACKET_TYPE.PHASE_UPDATE_NOTIFICATION, 0, responseNotification),
            );
          });
          userUpdateNotification(this.users);
          this.changePhase();
        } catch (err) {
          console.error(err);
        }
      },
      time,
      'gameChangePhase',
    );
  }

  isFullRoom() {
    return parseInt(this.users.length) >= parseInt(this.maxUserNum) ? true : false;
  }

  isGamingRoom() {
    return this.state !== Packets.RoomStateType.WAIT;
  }

  addUser(user) {
    if (this.users.length >= this.maxUserNum) {
      console.error('방이 꽉 찼습니다.');
      return;
    }

    this.users.push(user);
  }

  findInGameUserById(userId) {
    return this.users.find((user) => user.id === userId);
  }

  findInGameUserByState(state) {
    return this.users.find((user) => user.characterData.stateInfo.state === state);
  }

  removeUser(user) {
    const index = this.users.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      this.users.splice(index, 1);
    }
  }

  removeUserFromFleaMarket() {
    // const index = this.fleaMarketUsers.findIndex((u) => u.id === user.id);
    // if (index !== -1) {
    // }
    this.fleaMarketUsers.splice(0, 1);
  }

  removeCardFromFleaMarketDeck() {
    this.fleaMarketDeck.splice(0, 1);
  }

  gameStart() {
    this.state = Packets.RoomStateType.PREPARE;
    this.intervalManager.addGameEndNotification(this);
  }
}

export default Game;
