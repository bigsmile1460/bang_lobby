import { PACKET_TYPE } from '../../constants/header.js';
import { Packets } from '../../init/loadProtos.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { createUser, findUserByEmail } from '../../db/user/user.db.js';
import bcrypt from 'bcrypt';
import Joi from 'joi';

export const registerHandler = async (socket, payload) => {
  const { email, nickname, password } = payload.registerRequest;

  try {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      nickname: Joi.string().alphanum().min(4).max(8).required(),
      password: Joi.string().min(4).max(20).required(),
    });

    const validation = schema.validate({ email, nickname, password });
    const validationError = validation.error;
    if (validationError) {
      const errorMessage = '검증오류';
      const errorResponse = {
        registerResponse: {
          success: false,
          message: errorMessage,
          failCode: Packets.GlobalFailCode.AUTHENTICATION_FAILED,
        },
      };
      socket.write(createResponse(PACKET_TYPE.REGISTER_RESPONSE, 0, errorResponse));
      return;
    }

    const existedUser = await findUserByEmail(email);
    // 중복된 유저가 있다면
    if (existedUser) {
      // 에러 응답 처리
      const errorMessage = '이미 있는 유저입니다.';
      const errorResponse = {
        registerResponse: {
          success: false,
          message: errorMessage,
          failCode: Packets.GlobalFailCode.AUTHENTICATION_FAILED,
        },
      };
      socket.write(createResponse(PACKET_TYPE.REGISTER_RESPONSE, 0, errorResponse));
      return;
    }

    // 회원가입 처리
    const hashedPW = await bcrypt.hash(password, 10);

    await createUser(email, hashedPW, nickname);
    // 응답 생성
    const responsePayload = {
      registerResponse: {
        success: true,
        message: '회원가입 성공',
        failCode: Packets.GlobalFailCode.NONE_FAILCODE,
      },
    };

    socket.write(createResponse(PACKET_TYPE.REGISTER_RESPONSE, 0, responsePayload));
  } catch (err) {
    console.error(`검증오류: ${err}`);
  }
};
