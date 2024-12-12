import RedisManager from '../classes/manager/redis.manager.js';
import { loadRoles } from '../db/game/game.db.js';

export const loadRolesFromDB = async () => {
  try {
    const redis = RedisManager.getInstance();
    const rows = await loadRoles();

    const roleTypes = rows.reduce((acc, { user_count, role_id, role_count }) => {
      if (!acc[user_count]) {
        acc[user_count] = new Array(role_count).fill(role_id); // role_count 만큼 미리 채우기
      } else {
        acc[user_count].push(...new Array(role_count).fill(role_id)); // 이미 존재하는 배열에 role 추가
      }

      return acc;
    }, {});
    await redis.set('roleTypes', JSON.stringify(roleTypes));
  } catch (e) {
    console.error('Error loading roles:', e);
    throw e;
  }
};
