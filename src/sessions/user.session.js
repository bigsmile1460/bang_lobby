import RedisManager from '../classes/manager/redis.manager.js';

const redis = RedisManager.getInstance();
export const addUser = async (key,user) => {
  await redis.setUser(key, user);
}; 

export const removeUser = async (key) => {
  await redis.delUser(key);
};

export const findUserById = async (key) => {
  return await redis.getUser(key)
};

export const getUser = async (key) => {
  return await redis.getUser(key)
};

/////////////////// redis 변경 전
// export const addUser = (user) => {
//   userSession.push(user);
// };

// export const removeUser = (socket) => {
//   const index = userSession.findIndex((user) => user.socket === socket);
//   // 못 찾은 경우
//   if (index === -1) {
//     console.error('유저를 찾지 못했습니다.');
//     return null;
//   }

//   return userSession.splice(index, 1)[0];
// };

// export const findUserById = (id) => {
//   return userSession.find((user) => user.id === id);
// };

// export const getUserBySocket = (socket) => {
//   return userSession.find((user) => user.socket === socket);
// };
