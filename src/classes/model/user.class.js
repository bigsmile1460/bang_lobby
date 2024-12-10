import { Packets } from '../../init/loadProtos.js';
import CharacterData from './characterData.class.js';
import Position from './position.class.js';

// TODO: 완성
class User {
  constructor(id, nickname, socket) {
    // proto가 수정되었고, 따로 세션에서 해당 id를 발급해주는 식으로 처리, getUserByNickName 대신 getUserById를 사용 가능
    this.id = id;
    this.nickname = nickname;
    this.socket = socket;

    this.characterData = new CharacterData();

    this.position = new Position();
    this.lastUpdateTime = Date.now();
    this.roomId = null;
    this.maxHp = null;

    this.maxBbangCount = 0;
    this.damage = 1;
  }

  // getStateTargetUserId() {
  //   return this.characterData.stateInfo.stateTargetUserId;
  // }

  releaseUser() {
    this.characterData = new CharacterData();
    this.position = new Position();
    this.roomId = null;
    this.maxHp = null;
    this.maxBbangCount = 0;
    this.damage = 1;
  }

  isAlive() {
    return this.characterData.alive;
  }

  equipWepon(weapon) {
    switch (weapon) {
      case Packets.CardType.HAND_GUN:
        this.characterData.bbangCount -= 1;
        this.maxBbangCount -= 1;
        break;
      case Packets.CardType.DESERT_EAGLE:
        this.damage = 2;
        break;
      case Packets.CardType.AUTO_RIFLE:
        this.characterData.bbangCount -= 10;
        this.maxBbangCount -= 10;
        break;
      case Packets.CardType.SNIPER_GUN:
        break;
    }
    this.setWeapon(weapon);
  }

  unequipWepon() {
    switch (this.characterData.weapon) {
      case Packets.CardType.HAND_GUN:
        this.characterData.bbangCount += 1;
        this.maxBbangCount += 1;
        break;
      case Packets.CardType.DESERT_EAGLE:
        this.damage = 1;
        break;
      case Packets.CardType.AUTO_RIFLE:
        this.characterData.bbangCount += 10;
        this.maxBbangCount += 10;
        break;
      case Packets.CardType.SNIPER_GUN:
        break;
    }
    this.setWeapon(0);
  }

  overHandedCount() {
    return this.characterData.handCardsCount - this.characterData.hp;
  }

  resetBbangCount() {
    this.characterData.bbangCount = this.maxBbangCount;
  }

  canUseBbang() {
    // true를 반환했을때 빵 가능
    return (
      0 >= this.characterData.bbangCount && this.characterData.bbangCount >= this.maxBbangCount
    );
  }

  setMaxBbangCount(count) {
    this.maxBbangCount = count;
  }

  updatePosition(x, y) {
    this.position.x = x;
    this.position.y = y;
  }

  getX() {
    return this.position.x;
  }

  getY() {
    return this.position.y;
  }

  setCharacterType(characterType) {
    this.characterData.characterType = characterType;
  }

  setCharacterRoleType(roleType) {
    this.characterData.roleType = roleType;
  }
  // 캐릭터 설정
  setCharacter(characterType) {
    switch (characterType) {
      case Packets.CharacterType.RED:
        this.characterData.characterType = characterType;
        this.characterData.bbangCount = -40;
        this.characterData.hp = 4;
        this.setMaxBbangCount(-40); // max치 빵야 횟수 설정
        break;
      case Packets.CharacterType.SHARK:
        this.characterData.characterType = characterType;
        this.characterData.bbangCount = 0;
        this.characterData.hp = 4;
        this.setMaxBbangCount(-1);
        break;
      case Packets.CharacterType.MALANG:
        this.characterData.characterType = characterType;
        this.characterData.bbangCount = 0;
        this.characterData.hp = 4;
        this.setMaxBbangCount(-1);
        break;
      case Packets.CharacterType.FROGGY:
        this.characterData.characterType = characterType;
        this.characterData.bbangCount = 0;
        this.characterData.hp = 4;
        this.setMaxBbangCount(-1);
        break;
      case Packets.CharacterType.PINK:
        this.characterData.characterType = characterType;
        this.characterData.bbangCount = 0;
        this.characterData.hp = 4;
        this.setMaxBbangCount(-1);
        break;
      // 물안경군 캐릭터 특성은 클라에서 처리
      case Packets.CharacterType.SWIM_GLASSES:
        this.characterData.characterType = characterType;
        this.characterData.bbangCount = 0;
        this.characterData.hp = 4;
        this.setMaxBbangCount(-1);
        break;
      case Packets.CharacterType.MASK:
        this.characterData.characterType = characterType;
        this.characterData.bbangCount = 0;
        this.characterData.hp = 4;
        this.setMaxBbangCount(-1);
        break;
      // 공룡이 캐릭터 특성은 클라에서 처리
      case Packets.CharacterType.DINOSAUR:
        this.characterData.characterType = characterType;
        this.characterData.bbangCount = 0;
        this.characterData.hp = 3;
        this.setMaxBbangCount(-1);
        break;
      case Packets.CharacterType.PINK_SLIME:
        this.characterData.characterType = characterType;
        this.characterData.bbangCount = 0;
        this.characterData.hp = 3;
        this.setMaxBbangCount(-1);
        break;
    }
  }

  setHp(hp) {
    this.characterData.hp = hp;
  }

  increaseHp() {
    if (this.characterData.hp >= this.maxHp) {
      return false;
    }

    this.characterData.hp += 1;
    return true;
  }

  decreaseHp(damage = 1) {
    this.characterData.hp -= damage;
    if (this.characterData.hp < 0) {
      this.characterData.hp = 0;
    }
  }

  setWeapon(weapon) {
    this.characterData.weapon = weapon;
  }

  getCharacterState() {
    return this.characterData.stateInfo.state;
  }

  setCharacterStateType(characterStateType) {
    this.characterData.stateInfo.state = characterStateType;
  }

  setNextCharacterStateType(characterNextStateType) {
    this.characterData.stateInfo.nextState = characterNextStateType;
  }

  setNextStateAt(nextStateAt) {
    this.characterData.stateInfo.nextStateAt = nextStateAt;
  }

  setStateTargetUserId(stateTargetUserId) {
    this.characterData.stateInfo.stateTargetUserId = stateTargetUserId;
  }

  addEquip(equip) {
    if (this.characterData.equips.includes(equip) || this.characterData.equips.length >= 4) {
      return false;
    }
    this.characterData.equips.push(equip);
    return true;
  }

  addDebuff(debuff) {
    this.characterData.debuffs.push(debuff);
  }

  addHandCard(addCard) {
    this.characterData.handCards.set(addCard, (this.characterData.handCards.get(addCard) || 0) + 1);
    this.increaseHandCardsCount();
  }

  // 있으면 해당 카드의 count를 없으면 0를 반환함
  findCard(cardType) {
    return this.characterData.handCards.get(cardType) || 0;
  }

  selectRandomHandCard() {
    const handCards = this.getHandCardsToArray();
    const randomIndex = Math.floor(Math.random() * handCards.length);
    return handCards[randomIndex].type; // cardType
  }

  removeHandCard(usingCard) {
    const count = this.characterData.handCards.get(usingCard);
    if (count === 1) {
      this.characterData.handCards.delete(usingCard);
    } else {
      this.characterData.handCards.set(usingCard, count - 1);
    }

    this.decreaseHandCardsCount();
  }

  removeEquipCard(equip) {
    const index = this.characterData.equips.findIndex((card) => card === equip);

    if (index !== -1) {
      this.characterData.equips.splice(index, 1);
    }
  }

  removeDebuffCard(debuff) {
    const index = this.characterData.debuffs.findIndex((element) => element === debuff);
    if (index !== -1) {
      this.characterData.debuffs.splice(index, 1);
    }
  }

  hasShieldCard() {
    const shieldCard = this.characterData.handCards.get(Packets.CardType.SHIELD);

    return shieldCard ? true : false;
  }

  hasBbangCard() {
    const bbangCard = this.characterData.handCards.get(Packets.CardType.BBANG);

    return bbangCard ? true : false;
  }

  getHandCardsCount() {
    return this.characterData.handCardsCount;
  }

  increaseBbangCount() {
    this.characterData.bbangCount += 1;
  }

  decreaseBbangCount() {
    this.characterData.bbangCount -= 1;
  }

  increaseHandCardsCount() {
    this.characterData.handCardsCount += 1;
  }

  decreaseHandCardsCount() {
    this.characterData.handCardsCount -= 1;
  }

  setCharacterState(state) {
    const { currentState, nextState, nextStateAt, targetUserId } = state;

    this.characterData.stateInfo.state = currentState;
    this.characterData.stateInfo.nextState = nextState;
    this.characterData.stateInfo.nextStateAt = nextStateAt;
    this.characterData.stateInfo.stateTargetUserId = targetUserId;
  }

  getHandCardsToArray() {
    const result = Array.from(this.characterData.handCards.entries(), ([key, value]) => ({
      type: key,
      count: value,
    }));
    return result;
  }

  makeRawObject() {
    return {
      id: this.id,
      nickname: this.nickname,
      character: {
        characterType: this.characterData.characterType,
        roleType: this.characterData.roleType,
        hp: this.characterData.hp,
        weapon: this.characterData.weapon,
        alive: this.characterData.alive,
        stateInfo: {
          state: this.characterData.stateInfo.state,
          nextState: this.characterData.stateInfo.nextState,
          nextStateAt: this.characterData.stateInfo.nextStateAt,
          stateTargetUserId: this.characterData.stateInfo.stateTargetUserId,
        },
        equips: this.characterData.equips,
        debuffs: this.characterData.debuffs,
        handCards: this.getHandCardsToArray(),
        bbangCount: this.characterData.bbangCount,
        handCardsCount: this.characterData.handCardsCount,
      },
    };
  }
}

export default User;
