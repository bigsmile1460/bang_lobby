# 핸들러 생성 및 등록 방법

## 핸들러 생성

회원가입 핸들러를 예로 들자면

1. `src/handler/user/register.handler.js` 파일 생성 후 핸들러 함수 작성.
2. 매개변수로 해당 유저의 `socket`과 데이터가 담긴 `payload`를 전달받음.
3. 전달 받는 패킷 타입또한 해당 필드의 메세지 타입인 C2SRegisterRequest를 통해 확인할 수 있음.
4. 핸들러 등록은 `src/handler/index.js` 파일에 해당하는 패킷 타입을 키로 두고 맵핑

> 예시로 든 회원가입의 경우 `payload.registerRequest`로 해당 데이터를 받아올 수 있는데
> 해당하는 필드 이름은 `game.proto`의 GamePacket 메세지에서 확인할 수 있음.

## 핸들러 함수 예시

```javascript
export const registerHandler = (socket, payload) => {
  const { id, password, email } = payload.registerRequest;

  // 회원가입 처리

  // Response 생성
  const responsePayload = {
    registerResponse: {
      success: true,
      message: '회원가입 성공',
      failCode: GlobalFailCode.NONE_FAILCODE,
    },
  };

  socket.write(createResponse(PACKET_TYPE.REGISTER_RESPONSE, 0, responsePayload));
};
```

## 핸들러 맵핑 예시

```javascript
const hendlers = {
  // 회원가입 및 로그인
  [PACKET_TYPE.REGISTER_REQUEST]: { handler: registerHandler },
};
```

위와 같이 맵핑하면 onData에서 들어오는 PacketType에 맞춰서 해당 핸들러가 호출됨.
