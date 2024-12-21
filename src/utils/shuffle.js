import { Packets } from '../init/loadProtos.js';

export const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const setUpGame = (roleTypes, cardDeck, characterList, room) => {
  // roleType 배분
  const deck = cardDeck;
  const roleTypeClone = shuffle(roleTypes[room.users.length]);
  const shuffledCharacter = shuffle(characterList).splice(0, room.users.length);

  // 사용자별 작업을 순차적으로 실행
  for (const [index, user] of room.users.entries()) {
    // 캐릭터 및 역할 할당
    user.setCharacter(shuffledCharacter[index].type);
    user.setCharacterRoleType(roleTypeClone[index]);

    // 역할에 따른 추가 작업
    if (user.characterData.roleType === Packets.RoleType.TARGET) {
      user.characterData.hp += 1;
    }
    user.maxHp = user.characterData.hp;

    // 사용자별 카드 배분
    const gainCards = deck.splice(0, user.characterData.hp);
    for (const card of gainCards) {
      user.addHandCard(card);
    }
  }

  return false;
};
