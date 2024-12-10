import Game from '../classes/model/game.class.js';
import { gameSession } from './session.js';

export const addGameSession = (gameId, ownerId, name, maxUserNum) => {
  const session = new Game(gameId, ownerId, name, maxUserNum);
  gameSession.push(session);
  return session;
};

export const removeGameSession = (gameId) => {
  const index = gameSession.findIndex((game) => game.id === gameId);
  // 못 찾은 경우
  if (index === -1) {
    console.error('게임을 찾지 못했습니다.');
    return null;
  }

  const game = gameSession.splice(index, 1)[0];
  if (game) {
    game.release();
  }

  return game;
};

export const findGameById = (gameId) => {
  const index = gameSession.findIndex((game) => game.id === gameId);
  if (index !== -1) {
    return gameSession[index];
  }
};

export const joinGameSession = (gameId, user) => {
  const index = gameSession.findIndex((game) => game.id === gameId);
  // 못 찾은 경우
  if (index === -1) {
    console.error('게임을 찾지 못했습니다.');
    return null;
  }
  gameSession[index].users.push(user);

  return gameSession[index];
};

export const getAllGameSessions = () => {
  return gameSession;
};
