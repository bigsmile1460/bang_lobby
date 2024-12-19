import RedisManager from '../classes/manager/redis.manager.js';
import { Packets } from '../init/loadProtos.js';

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const setUpGame = async (room) => {
  const redis = RedisManager.getInstance();

  // roleTypes, cardDeck, characterList를 동기적으로 가져오기
  const roleTypes = await redis.get('roleTypes');
  const cardDeck = await redis.get('cardDeck');
  const characterList = await redis.get('characterList');

  // roleType 배분
  const roleTypeClone = roleTypes[room.users.length];
  const shuffledRoleType = shuffle(roleTypeClone); // shuffle이 비동기 함수가 아니므로 await 제거
  
  for (const user of room.users) {
    user.setCharacterRoleType(shuffledRoleType[i]);
    if (user.characterData.roleType === Packets.RoleType.TARGET) {
      user.increaseHp();
    }
  }

  // 캐릭터 배분
  const shuffledCharacter = shuffle(characterList).splice(0, room.users.length);
  for (const user of room.users) {
    user.setCharacter(shuffledCharacter[i].type);
  }

  // 카드 덱 셔플
  const deck = shuffle(cardDeck);

  // 카드 배분
  for (const user of room.users) {
    const gainCards = deck.splice(0, user.characterData.hp);
    for (const card of gainCards) {
      user.addHandCard(card);
    }
  }

  // 덱 업데이트
  room.deck = deck;
};