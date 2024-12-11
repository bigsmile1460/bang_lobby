import RedisManager from '../classes/manager/redis.manager.js';
import { onData } from './onData.js';
import { onEnd } from './onEnd.js';
import { onError } from './onError.js';

export const onConnection = (socket) => {
  console.log(`Client connected from ${socket.remoteAddress}:${socket.remotePort}`);

  socket.buffer = Buffer.alloc(0);

  
  // 클라이언트 연결 시 소켓 정보 추출
  const clientInfo = {
    address: socket.remoteAddress,
    port: socket.remotePort,
    jwt: socket.jwt, // 고유 식별자
  };
  const redis = RedisManager.getInstance();
  // Redis에 소켓 정보 저장
  // TODO: 확인로직이 필요함
  redis.set(clientInfo.jwt, JSON.stringify(clientInfo));


  socket.on('data', onData(socket));
  socket.on('end', onEnd(socket));
  socket.on('error', onError(socket));
};
