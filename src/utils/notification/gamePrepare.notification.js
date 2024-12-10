import { Packets } from '../../init/loadProtos.js';

/**
 *
 * @param {Game} room
 * @param {User} me
 * @returns
 */
export const gamePrepareNotification = (room, me) => {
  try {
    const responsePayload = {
      gamePrepareNotification: {
        room: {
          id: room.id,
          ownerId: room.ownerId,
          name: room.name,
          maxUserNum: room.maxUserNum,
          state: Packets.RoomStateType.PREPARE,
          users: room.users.map((user) => {
            if (user.id !== me.id) {
              const otherUser = user.makeRawObject();
              otherUser.character.handCards = [];
              if (otherUser.character.roleType !== Packets.RoleType.TARGET) {
                otherUser.character.roleType = Packets.RoleType.NONE_ROLE;
              }
              return otherUser;
            }

            // 본인인 경우 그대로
            return user.makeRawObject();
          }),
        },
      },
    };

    return responsePayload;
  } catch (e) {
    console.error(e);
  }
};
