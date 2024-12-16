import RedisManager from '../classes/manager/redis.manager.js';
import { leaveRoomHandler } from '../handler/room/leaveRoom.handler.js';
import { Packets } from '../init/loadProtos.js';

export const onEnd = (socket) => async () => {
  const redis = RedisManager.getInstance();
  try {
    console.log(`Client disconnected from ${socket.remoteAddress}:${socket.remotePort}`);
    const user = await redis.getHash('user', socket.jwt);
    
    if (!user) {
      return;
    }

    if (!user.roomId) {
      await redis.delHash('user', socket.jwt);
      return;
    }

    const room = await redis.getHash('room', user.roomId);
    if (!room) {
      await redis.delHash('user', socket.jwt);
      return;
    }

    if (room.state === Packets.RoomStateType.WAIT) {
      //게임 시작 전
      await leaveRoomHandler(socket, null);
    }
    if (room.state === Packets.RoomStateType.PREPARE) {
      // 게임 세팅 중
      // 방 안에서 유저의 hp를 0으로 변경
      const userIndex = room.users.findIndex((leaveUser) => leaveUser.id === user.id)
      user.characterData.hp = 0;
      //재접속 구현 전까지는 게임을 종료
      room.users[userIndex] = user;
      
      await redis.setHash('room', room.id, room);
    }
    // if (currentGame.state === Packets.RoomStateType.INAGAME) {
    //   //인 게임
    //   user.setHp(0);
    // }
    await redis.delHash('user', socket.jwt);
    
  } catch (e) {
    await redis.delHash('user', socket.jwt);

    console.error(e);
  }
};
