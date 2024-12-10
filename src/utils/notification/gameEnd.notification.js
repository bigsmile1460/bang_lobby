import { PACKET_TYPE } from '../../constants/header.js';
import { Packets } from '../../init/loadProtos.js';
import { createResponse } from '../response/createResponse.js';
import { removeGameSession } from '../../sessions/game.session.js';
import { roomManager } from '../../classes/manager/room.manager.js';
import { saveRecord } from '../../db/record/record.db.js';

export const gameEndNotification = async (room) => {
  try {
    const survivor = [];
    room.users.forEach((user) => {
      if (user.characterData.hp > 0) {
        // 생존자 확인
        survivor.push({ id: user.id, role: user.characterData.roleType });
      }
    });

    const isTarget = survivor.find((user) => user.role === Packets.RoleType.TARGET);
    const isBodyguard = survivor.find((user) => user.role === Packets.RoleType.BODYGUARD);
    const isHitman = survivor.find((user) => user.role === Packets.RoleType.HITMAN);
    const isPsychopath = survivor.find((user) => user.role === Packets.RoleType.PSYCHOPATH);

    let responsePayload;

    let winners = null;
    if (!isTarget && !isBodyguard && !isHitman) {
      //싸이코패스 승리
      winners = room.users.filter(
        (user) => user.characterData.roleType === Packets.RoleType.PSYCHOPATH,
      );
      const winnerIds = winners.map((user) => user.id);
      responsePayload = {
        gameEndNotification: {
          winners: winnerIds,
          winType: Packets.WinType.PSYCHOPATH_WIN,
        },
      };
    } else if (!isHitman && !isPsychopath) {
      //타겟 & 보디가드 승리
      winners = room.users.filter(
        (user) =>
          user.characterData.roleType === Packets.RoleType.TARGET ||
          user.characterData.roleType === Packets.RoleType.BODYGUARD,
      );
      const winnerIds = winners.map((user) => user.id);
      responsePayload = {
        gameEndNotification: {
          winners: winnerIds,
          winType: Packets.WinType.TARGET_AND_BODYGUARD_WIN,
        },
      };
    } else if (!isTarget) {
      //히트맨 승리
      winners = room.users.filter(
        (user) => user.characterData.roleType === Packets.RoleType.HITMAN,
      );
      const winnerIds = winners.map((user) => user.id);
      responsePayload = {
        gameEndNotification: {
          winners: winnerIds,
          winType: Packets.WinType.HITMAN_WIN,
        },
      };
    }

    if (responsePayload) {
      // 기록 저장
      const losers = room.users.filter((user) => !winners.some((winner) => winner.id === user.id));
      winners.forEach(async (winner) => {
        await saveRecord(winner.id, true, winner.characterData.roleType);
      });

      losers.forEach(async (loser) => {
        await saveRecord(loser.id, false, loser.characterData.roleType);
      });

      roomManager.deleteRoom(room.id);
      room.users.forEach((user) => {
        user.releaseUser()
        user.socket.write(createResponse(PACKET_TYPE.GAME_END_NOTIFICATION, 0, responsePayload));
      });

      removeGameSession(room.id);
    }
  } catch (e) {
    console.error(e);
  }
};
