export const SQL_QUERIES = {
  LOAD_LOCATIONS: 'SELECT * FROM SpawnLocation',
  LOAD_CARDS: 'SELECT card_type, count FROM card_deck ORDER BY card_type;',
  LOAD_ROLES: 'SELECT rd.user_count, r.id AS role_id, rd.role_count FROM role_distribution rd JOIN roles r ON rd.role_id = r.id ORDER BY rd.user_count, r.id;',
  LOAD_CHARACTERS: 'SELECT id, type FROM characters ORDER BY id;',
};
