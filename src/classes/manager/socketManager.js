import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../../constants/env.js'
class SocketManager {
  constructor() {
    this.sockets = new Map(); // 고유 ID를 키로 사용
  }
  
  tokenVerify(token) {
    return jwt.verify(token, JWT_SECRET_KEY);
  }
  addSocket(token, socket) {
    const userId = this.tokenVerify(token).id;
    this.sockets.set(userId, socket);
  }

  getSocket(token) {
    const userId = this.tokenVerify(token).id;
    return this.sockets.get(userId);
  }

  removeSocket(token) {
    const userId = this.tokenVerify(token).id;
    const socket = this.sockets.get(userId);
    if (socket) {
      socket.destroy(); // 소켓 닫기
      this.sockets.delete(userId);
    }
  }
  //JWT를 이용해서 재연결하는 메서드 생성
  reconnectSocket(token, newSocket) {
    try {
      // JWT 검증
      const userId = this.tokenVerify(token).id;

      // 기존 소켓이 있는지 확인
      const existingSocket = this.getSocket(userId);

      if (existingSocket) {
        // 기존 소켓을 닫고 새 소켓으로 교체
        console.log(`Reconnecting socket for user: ${userId}`);
        this.removeSocket(userId);
      }

      // 새로운 소켓 추가
      this.addSocket(userId, newSocket);
      console.log(`Socket reconnected for user: ${userId}`);
    } catch (err) {
      console.error('Invalid JWT token:', err.message);
      newSocket.destroy(); // 잘못된 토큰일 경우 소켓 종료
    }
  }
}

// 소켓 매니저 생성
export const socketManager = new SocketManager();
