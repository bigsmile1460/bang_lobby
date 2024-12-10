import phaseTime from '../../constants/phaseTime.js';
import { Packets } from '../../init/loadProtos.js';

export const gameStartNotification = (users, characterPositions) => {
  try {
    const responsePayload = {
      gameStartNotification: {
        gameState: {
          phaseType: Packets.PhaseType.DAY,
          nextPhaseAt: Date.now() + phaseTime[Packets.PhaseType.DAY],
        },
        users: users.map((user) => {
          return user.makeRawObject();
        }),
        characterPositions: characterPositions,
      },
    };

    return responsePayload;
  } catch (e) {
    console.error(e);
  }
};
