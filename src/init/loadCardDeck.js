import RedisManager from '../classes/manager/redis.manager.js';
import { loadCards } from '../db/game/game.db.js';

export const loadCardDeckFromDB = async () => {
  try {
    const redis = RedisManager.getInstance();
    const rows = await loadCards();
    const cardDeck = [];
    rows.forEach(({ card_type_id, count }) => {
      for (let i = 0; i < count; i++) {
        cardDeck.push(card_type_id);
      }
    });
    const loadedCardDeck = await redis.get('cardDeck')
    if (!loadedCardDeck){
      await redis.set('cardDeck', JSON.stringify(cardDeck));
    }

  } catch (e) {
    console.error(e);
  }
};
