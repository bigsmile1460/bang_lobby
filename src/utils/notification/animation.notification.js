import { PACKET_TYPE } from '../../constants/header.js';
import { createResponse } from '../response/createResponse.js';

export const animationNotification = (users, animationUser, animationType) => {
  try {
    const responsePayload = {
      animationNotification: {
        userId: animationUser.id,
        animationType: animationType,
      },
    };

    users.forEach((user) => {
      user.socket.write(createResponse(PACKET_TYPE.ANIMATION_NOTIFICATION, 0, responsePayload));
    });
  } catch (e) {
    console.error(e);
  }
};
