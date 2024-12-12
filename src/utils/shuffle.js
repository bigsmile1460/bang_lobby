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

  const roleTypes = await redis.get('roleTypes');
  const cardDeck = await redis.get('cardDeck');
  const characterList = await redis.get('characterList');

  
  // roleType 배분
  const roleTypeClone = roleTypes[room.users.length];
  const shuffledRoleType = shuffle(roleTypeClone);
  room.users.forEach((user, i) => {
    user.setCharacterRoleType(shuffledRoleType[i]);
    if (user.characterData.roleType === Packets.RoleType.TARGET) {
      user.increaseHp();
    }
  });

  // 캐릭터 배분
  const shuffledCharacter = shuffle(characterList).splice(0, room.users.length);
  room.users.forEach((user, i) => {
    user.setCharacter(shuffledCharacter[i].type);
  });

  const deck = shuffle(cardDeck);

  // 카드 배분
  room.users.forEach((user) => {
    const gainCards = deck.splice(0, user.characterData.hp);
    gainCards.forEach((card) => user.addHandCard(card));
  });
  room.deck = deck;
};
