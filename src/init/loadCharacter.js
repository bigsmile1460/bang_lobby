import RedisManager from '../classes/manager/redis.manager.js';
import { loadCharacters } from '../db/game/game.db.js';

export const loadCharactersFromDB = async () => {
  try {
    const redis = RedisManager.getInstance();
    const rows = await loadCharacters();
    const characterList = rows.map((row) => ({
      type: row.id,
    }));

    const loadedCharacterList = await redis.get('characterList')
    if (!loadedCharacterList){
      await redis.set(`characterList`, JSON.stringify(characterList));
    }
  } catch (e) {
    console.error(e);
  }
};
