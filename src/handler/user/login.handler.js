import { Packets } from '../../init/loadProtos.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { findUserByEmail } from '../../db/user/user.db.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { config } from '../../config/config.js';
import bcrypt from 'bcrypt';
import User from '../../classes/model/user.class.js';
import jwt from 'jsonwebtoken';
import { socketManager } from '../../classes/manager/socketManager.js';
import RedisManager from '../../classes/manager/redis.manager.js';

export const loginHandler = async (socket, payload) => {
  const redis = RedisManager.getInstance();
  const { email, password } = payload.loginRequest;
  console.log(payload.loginRequest);

  socket.jwt = jwt.sign({ id: email }, config.jwt.SCRET_KEY, { noTimestamp: true });

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      const errorMessage = `${email}: 없는 email입니다.`;
      console.error(errorMessage);
      const errorResponse = {
        loginResponse: {
          success: false,
          message: errorMessage,
          token: '',
          myInfo: {},
          failCode: Packets.GlobalFailCode.AUTHENTICATION_FAILED,
        },
      };

      socket.write(createResponse(PACKET_TYPE.LOGIN_RESPONSE, 0, errorResponse));
      return;
    }

    //패스워드 확인
    if (!(await bcrypt.compare(password, user.password))) {
      const errorMessage = '비밀번호가 틀렸습니다.';
      console.error(errorMessage);
      const errorResponse = {
        loginResponse: {
          success: false,
          message: errorMessage,
          token: '',
          myInfo: {},
          failCode: Packets.GlobalFailCode.AUTHENTICATION_FAILED,
        },
      };

      socket.write(createResponse(PACKET_TYPE.LOGIN_RESPONSE, 0, errorResponse));
      return;
    }

    // 기존 세션에 있는 유저면 로그인 불가
    const loginedUser = await redis.getHash('user', socket.jwt);
    if (loginedUser) {
      const errorMessage = '이미 사용중인 아이디입니다.';
      console.error(errorMessage);
      const errorResponse = {
        loginResponse: {
          success: false,
          message: errorMessage,
          token: '',
          myInfo: {},
          failCode: Packets.GlobalFailCode.AUTHENTICATION_FAILED,
        },
      };

      socket.write(createResponse(PACKET_TYPE.LOGIN_RESPONSE, 0, errorResponse));
      return;
    }

    // 세션에 유저 추가
    const id = user.id;
    const nickname = user.nickname;
    const newUser = new User(id, nickname, socket);
    await redis.setHash('user', socket.jwt, JSON.stringify(newUser));
    
    socketManager.addSocket(socket.jwt, socket);

    //JWT가 레디스 키가 되고 유저의 정보들이 벨류로 들어가고.
    //JWT를 통해서 유저의 정보를 다시 불러올 수 있게
    const responsePayload = {
      loginResponse: {
        success: true,
        message: '로그인 성공',
        token: socket.jwt,
        myInfo: { id: id, nickname: nickname, character: {} },
        failCode: Packets.GlobalFailCode.NONE_FAILCODE,
      },
    };

    socket.write(createResponse(PACKET_TYPE.LOGIN_RESPONSE, 0, responsePayload));
    console.log('로그인 성공');
  } catch (err) {
    console.error(`로그인 에러: ${err}`);
  }
};
