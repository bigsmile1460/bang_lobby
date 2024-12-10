import { Packets } from '../../init/loadProtos.js';
import userUpdateNotification from './userUpdate.notification.js';

export const deadCheck = (game) => {
  try {
    const deathUsers = game.users.filter((user) => user.characterData.hp === 0);
    if (deathUsers) {
      for (let i = 0; i < deathUsers.length; i++) {
        if (deathUsers[i].characterData.alive) {
          deathUsers[i].characterData.alive = false;
          characterTypeGetCard(game, deathUsers[i]);
        }
      }
    }
  } catch (e) {
    console.error(e);
  }
};

//캐릭터 특성 - 마스크
const characterTypeGetCard = (game, deathUser) => {
  const maskUser = game.users.find(
    (user) => user.characterData.characterType === Packets.CharacterType.MASK,
  );

  if (!maskUser) {
    userUpdateNotification(game.users);
    return;
  }
  const deathUserHandCards = deathUser.getHandCardsToArray();
  const handCardsLength = deathUserHandCards.length;
  const deathUserEquips = deathUser.characterData.equips;
  const equipCardsLength = deathUserEquips.length;
  if (deathUser.characterData.weapon !== 0) {
    maskUser.addHandCard(deathUser.characterData.weapon);
  }
  for (let i = 0; i < equipCardsLength; i++) {
    maskUser.addHandCard(deathUserEquips[i]);
  }

  for (let i = 0; i < handCardsLength; i++) {
    for (let j = 0; j < deathUserHandCards[i].count; j++) {
      maskUser.addHandCard(deathUserHandCards[i].type);
    }
  }
  userUpdateNotification(game.users);
};
