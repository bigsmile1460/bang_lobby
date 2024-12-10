import { Packets } from '../../init/loadProtos.js';
import userUpdateNotification from './userUpdate.notification.js';

export const pinkCheck = (game) => {
  try {
    // 핑크군 로직 추가 -> 손에 카드가 0장이 되면 1장 얻음
    const characterPink = game.users.find(
      (user) => user.characterData.characterType === Packets.CharacterType.PINK,
    );
    if (characterPink) {
      if (characterPink.characterData.handCardsCount === 0) {
        const card = game.deck.shift();
        characterPink.addHandCard(card);
        userUpdateNotification(game.users);
      }
    }
  } catch (e) {
    console.error(e);
  }
};
