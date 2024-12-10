import { PACKET_TYPE } from '../../constants/header.js';
import { characterPositions } from '../../init/loadPositions.js';
import { Packets } from '../../init/loadProtos.js';
import { findGameById } from '../../sessions/game.session.js';
import { getUser } from '../../sessions/user.session.js';
import { gameStartNotification } from '../../utils/notification/gameStart.notification.js';
import { createResponse } from '../../utils/response/createResponse.js';

export const gameStartHandler = (socket, payload) => {
  // 현재 방, 해당 방의 유저들 정보
  const ownerUser = getUser(socket.jwt);
  const currentGame = findGameById(ownerUser.roomId);
  const inGameUsers = currentGame.users;

  if (currentGame.state !== Packets.RoomStateType.PREPARE) {
    const errorResponse = {
      gameStartResponse: {
        success: false,
        failCode: Packets.GlobalFailCode.INVALID_ROOM_STATE,
      },
    };

    socket.write(createResponse(PACKET_TYPE.GAME_START_RESPOSNE, 0, errorResponse));
  }

  const selectedPositions = new Set();
  while (true) {
    if (selectedPositions.size === inGameUsers.length) {
      break;
    }

    const randId = Math.floor(Math.random() * 20);
    selectedPositions.add(characterPositions[randId]); // 0부터 방의 20 길이까지의 랜덤
  }

  // 선택된 위치 정보는 JSON의 id고, 그걸 접속한 유저의 아이디로 치환
  const posArr = [...selectedPositions];
  for (let i = 0; i < inGameUsers.length; i++) {
    posArr[i].id = inGameUsers[i].id;
    // UPDATE: 초기 좌표 세팅
    inGameUsers[i].updatePosition(posArr[i].x, posArr[i].y);
  }

  // 게임 유저들 위치 정보 알림
  const notificationPayload = gameStartNotification(inGameUsers, posArr);
  inGameUsers.forEach((user) => {
    user.socket.write(createResponse(PACKET_TYPE.GAME_START_NOTIFICATION, 0, notificationPayload));
  });

  // 게임 시작 성공
  const responsePayload = {
    gameStartResponse: {
      success: true,
      failCode: Packets.GlobalFailCode.NONE_FAILCODE,
    },
  };

  //게임 상태 인게임으로 변경
  currentGame.state = Packets.RoomStateType.INAGAME;

  // 죽은 유저 체크
  currentGame.intervalManager.addDeathPlayer(currentGame);

  // 핑크 체크
  const isPink = currentGame.users.find(
    (user) => user.characterData.characterType === Packets.CharacterType.PINK,
  );
  if (isPink) {
    currentGame.intervalManager.addHandCardCheck(currentGame);
  }

  // 페이즈 시작
  currentGame.changePhase();

  socket.write(createResponse(PACKET_TYPE.GAME_START_RESPOSNE, 0, responsePayload));
};
