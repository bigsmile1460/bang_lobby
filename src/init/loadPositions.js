import RedisManager from '../classes/manager/redis.manager.js';
import { loadLocations } from '../db/game/game.db.js';

export const loadCharacterPositionsFromDB = async () => {
  try {
    const positions = await loadLocations();
    const characterPositions = await positions.map((pos) => {
      return { id: pos.id, x: pos.x, y: pos.y };
    });
    const redis = RedisManager.getInstance();

    const loadedPosition = await redis.get('position')
    if (!loadedPosition){
      await redis.set(`position`, JSON.stringify(characterPositions));
    }
  
  } catch (err) {
    console.error(err);
  }
};
