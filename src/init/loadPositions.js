import { loadLocations } from '../db/game/game.db.js';

export let characterPositions = null;

export const loadCharacterPositionsFromDB = async () => {
  const positions = await loadLocations();
  characterPositions = positions.map((pos) => {
    return { id: pos.id, x: pos.x, y: pos.y };
  });
};
