import RedisManager from '../classes/manager/redis.manager.js';

const redis = RedisManager.getInstance();
export const addUser = async (key, user) => {
  await redis.setHash('user', key, JSON.stringify(user));
};

export const removeUser = async (key) => {
  await redis.delHash('user',key);
};

export const findUserById = async (key) => {
  return await redis.getHash('user',key);
};

export const getUser = async (key) => {
  return await redis.getHash('user', key);
};
