import pools from '../database.js';
import { SQL_QUERIES } from './game.queries.js';

export const loadLocations = async () => {
  const [rows] = await pools.GAME_DB.query(SQL_QUERIES.LOAD_LOCATIONS);

  return rows;
};
