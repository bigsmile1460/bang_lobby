import { leaveRoomHandler } from '../handler/room/leaveRoom.handler.js';
import { Packets } from '../init/loadProtos.js';
import { findGameById } from '../sessions/game.session.js';
import { getUser, removeUser } from '../sessions/user.session.js';

export const onEnd = (socket) => () => {
  try {
    console.log(`Client disconnected from ${socket.remoteAddress}:${socket.remotePort}`);
    const user = getUser(socket.jwt);

    if (!user){
      return;
    }

    if (!user.roomId) {
      removeUser(socket.jwt);
      return;
    }

    const currentGame = findGameById(user.roomId);
    if (!currentGame) {
      removeUser(socket.jwt);
      return;
    }

    if (currentGame.state === Packets.RoomStateType.WAIT) {
      //게임 시작 전
      leaveRoomHandler(socket);
    }
    if (currentGame.state === Packets.RoomStateType.PREPARE) {
      //게임 세팅 중
      setTimeout(() => {
        user.setHp(0);
        removeUser(socket.jwt);
      }, 5000);
      return;
    }
    if (currentGame.state === Packets.RoomStateType.INAGAME) {
      //인 게임
      user.setHp(0);
    }

    removeUser(socket.jwt);
  } catch (e) {
    removeUser(socket.jwt);
    console.error(e);
  }
};
