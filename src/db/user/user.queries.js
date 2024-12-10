export const SQL_QUERIES = {
  CREATE_USER: 'INSERT INTO User (email, password, nickname) VALUES (?, ?, ?)',
  FIND_USER_BY_EMAIL: 'SELECT * FROM User WHERE email = ?',
};
