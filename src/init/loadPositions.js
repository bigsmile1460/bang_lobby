import RedisManager from '../classes/manager/redis.manager.js';
import { loadLocations } from '../db/game/game.db.js';

export const loadCharacterPositionsFromDB = async () => {
  try {
    const positions = await loadLocations();
    const characterPositions = positions.map((pos) => {
      return { id: pos.id, x: pos.x, y: pos.y };
    });
    const redis = RedisManager.getInstance();
    await redis.set(`position`, JSON.stringify(characterPositions));
    // await redis.set(`position`, characterPositions);
  
  } catch (err) {
    console.error(err);
  }
};
