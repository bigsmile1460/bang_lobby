import phaseTime from '../../constants/phaseTime.js';
import { characterPositions } from '../../init/loadPositions.js';
import { Packets } from '../../init/loadProtos.js';
import { prisonLogic, satelliteLogic } from '../debuff.js';

export const phaseUpdateNotification = (game) => {
  try {
    const inGameUsers = game.getAliveUsers();
    // 낮인 경우만 위치가 다시 셔플돼서 updatePosition
    // 밤에는 현재 위치
    if (game.currentPhase === Packets.PhaseType.DAY) {
      // 랜덤 위치 뽑기
      const selectedPositions = new Set();
      while (true) {
        if (selectedPositions.size === inGameUsers.length) {
          break;
        }
        const randId = Math.floor(Math.random() * 20);
        selectedPositions.add(characterPositions[randId]);
      }

      // 선택된 위치 정보는 JSON의 id고, 그걸 접속한 유저의 아이디로 치환
      const posArr = [...selectedPositions];
      for (let i = 0; i < inGameUsers.length; i++) {
        posArr[i].id = inGameUsers[i].id;
        // UPDATE: 초기 좌표 세팅
        inGameUsers[i].updatePosition(posArr[i].x, posArr[i].y);
      }

      // 낮이 시작되면 카드 버려주기(어차피 hp보다 적거나 같으면 안버리면 됨)
      inGameUsers.forEach((user) => {
        const userOverHandedCount = user.overHandedCount();

        if (userOverHandedCount > 0) {
          for (let i = 0; i < userOverHandedCount; i++) {
            // 오버한 갯수만큼 랜덤하게 손패 삭제
            const randomCard = user.selectRandomHandCard();
            user.removeHandCard(randomCard); // <- randomCard 값이 안읽히는 것 같음
          }
        }
      });

      // 빵야 카운트 리셋, 카드 두 개씩 주기
      inGameUsers.forEach((user) => {
        const gainCards = game.deck.splice(0, 2);
        gainCards.forEach((card) => user.addHandCard(card));
        user.resetBbangCount();
      });

      // 감옥 로직
      prisonLogic(inGameUsers);
      // 위성 로직
      satelliteLogic(inGameUsers);
    }

    const time = Date.now() + phaseTime[game.currentPhase];
    console.log(Date.now());
    const responsePayload = {
      phaseUpdateNotification: {
        phaseType: game.currentPhase,
        nextPhaseAt: time,
        characterPositions: inGameUsers.map((user) => {
          return { id: user.id, x: user.getX(), y: user.getY() };
        }),
      },
    };

    return responsePayload;
  } catch (e) {
    console.error(e);
  }
};
