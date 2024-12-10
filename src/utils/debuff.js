import { getStateContained, getStateNormal } from '../constants/stateType.js';
import { Packets } from '../init/loadProtos.js';
import { animationNotification } from './notification/animation.notification.js';

// 페이즈 전환시 25퍼 확률로 감옥가는 로직
export const prisonLogic = (inGameUsers) => {
  try {
    const prisonUsers = inGameUsers.filter((user) =>
      user.characterData.debuffs.includes(Packets.CardType.CONTAINMENT_UNIT),
    );

    prisonUsers.forEach((user) => {
      if (user.characterData.stateInfo.state === Packets.CharacterStateType.CONTAINED) {
        user.setCharacterState(getStateNormal());
        user.characterData.debuffs = user.characterData.debuffs.filter(
          (debuff) => debuff !== Packets.CardType.CONTAINMENT_UNIT,
        );
      } else if (!(Math.random() < 0.25)) {
        user.setCharacterState(getStateContained());
        console.log('감옥발동');
      } else {
        console.log('감옥 미발동 디버프 삭제');
        user.characterData.debuffs = user.characterData.debuffs.filter(
          (debuff) => debuff !== Packets.CardType.CONTAINMENT_UNIT,
        );
      }
    });
  } catch (err) {
    console.error(err);
  }
};

// 위성 타겟 로직
export const satelliteLogic = (inGameUsers) => {
  try {
    const satelliteUser = inGameUsers.find((user) =>
      user.characterData.debuffs.includes(Packets.CardType.SATELLITE_TARGET),
    );

    if (satelliteUser) {
      // 3퍼센트 확률로 hp 3 감소
      if (Math.random() < 0.03) {
        satelliteUser.decreaseHp(3);
        // 현재 유저에서 디버프 제거
        satelliteUser.characterData.debuffs = satelliteUser.characterData.debuffs.filter(
          (debuff) => debuff !== Packets.CardType.SATELLITE_TARGET,
        );
        animationNotification(
          inGameUsers,
          satelliteUser,
          Packets.AnimationType.SATELLITE_TARGET_ANIMATION,
        );
      } else {
        // 3% 확률 실패 시 디버프를 다음 유저에게 이동
        const currentIndex = inGameUsers.indexOf(satelliteUser);
        const nextIndex = (currentIndex + 1) % inGameUsers.length;
        const nextUser = inGameUsers[nextIndex];

        // 현재 유저에서 디버프 제거
        satelliteUser.characterData.debuffs = satelliteUser.characterData.debuffs.filter(
          (debuff) => debuff !== Packets.CardType.SATELLITE_TARGET,
        );

        // 다음 유저에게 디버프 추가
        nextUser.characterData.debuffs.push(Packets.CardType.SATELLITE_TARGET);
      }
    }
  } catch (err) {
    console.error(err);
  }
};
