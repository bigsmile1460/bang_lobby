import { Packets } from '../init/loadProtos.js';

export const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const setUpGame = async (roleTypes, cardDeck, characterList, room) => {
  // roleType 배분
  const roleTypeClone = shuffle(roleTypes[room.users.length]);
  console.log('roleType shuffle', Date.now());
  const deck = shuffle(cardDeck);
  console.log('deck shuffle', Date.now());
  const shuffledCharacter = shuffle(characterList).splice(0, room.users.length);
  console.log('character shuffle', Date.now());

  // 병렬 처리로 사용자 데이터 초기화
  const userTasks = room.users.map((user, index) => {
    console.log(user.nickname, 'card shuffle', Date.now());
    // 사용자별 카드 배분
    const start = index * user.characterData.hp;
    const end = start + user.characterData.hp;
    const gainCards = deck.slice(start, end);
    console.log(user.nickname, 'setup start', Date.now())
    console.log('card add hand', Date.now());
    gainCards.forEach((card) => user.addHandCard(card));

    // 캐릭터 및 역할 할당
    user.setCharacterRoleType(roleTypeClone[index]);
    console.log('roletype setup', Date.now());
    user.setCharacter(shuffledCharacter[index].type);
    console.log('character setup', Date.now());

    // 역할에 따른 추가 작업
    if (user.characterData.roleType === Packets.RoleType.TARGET) {
      user.increaseHp();
    }

    return Promise.resolve(); // 비동기 처리 유지
  });

  // 모든 작업 완료까지 대기
  await Promise.all(userTasks);
  console.log('users task finish', Date.now());
  // 덱 업데이트
  room.deck = deck.slice(room.users.length * room.users[0].characterData.hp);

  // // 카드 배분
  // for (const user of room.users) {
  //   const gainCards = deck.splice(0, user.characterData.hp);
  //   for (const card of gainCards) {
  //     user.addHandCard(card);
  //   }
  // }

  // // 덱 업데이트
  // room.deck = deck;

  // for (let i = 0; i < room.users.length; i++) {
  //   const user = room.users[i];
  //   user.setCharacterRoleType(shuffledRoleType[i]);
  //   if (user.characterData.roleType === Packets.RoleType.TARGET) {
  //     user.increaseHp();
  //   }
  // }

  // // 캐릭터 배분
  // for (let i = 0; i < room.users.length; i++) {
  //   const user = room.users[i];
  //   user.setCharacter(shuffledCharacter[i].type);
  // }
};
