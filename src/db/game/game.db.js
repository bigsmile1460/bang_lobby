import pools from '../database.js';
import { SQL_QUERIES } from './game.queries.js';

export const loadLocations = async () => {
  const [rows] = await pools.GAME_DB.query(SQL_QUERIES.LOAD_LOCATIONS);

  return rows;
};

export const loadCards = async () => {
  const [rows] = await pools.GAME_DB.query(SQL_QUERIES.LOAD_CARDS);
  return rows;
};

export const loadRoles = async () => {
  const [rows] = await pools.GAME_DB.query(SQL_QUERIES.LOAD_ROLES);
  return rows;
};

export const loadCharacters = async () => {
  const [rows] = await pools.GAME_DB.query(SQL_QUERIES.LOAD_CHARACTERS);
  return rows;
};