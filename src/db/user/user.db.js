import pools from '../database.js';
import { SQL_QUERIES } from './user.queries.js';

export const createUser = async (email, password, nickname) => {
  await pools.USER_DB.query(SQL_QUERIES.CREATE_USER, [email, password, nickname]);
};

export const findUserByEmail = async (email) => {
  const [rows] = await pools.USER_DB.query(SQL_QUERIES.FIND_USER_BY_EMAIL, [email]);

  return rows[0];
};
