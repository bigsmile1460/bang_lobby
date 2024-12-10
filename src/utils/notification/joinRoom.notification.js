export const joinRoomNotification = (user) => {
  try {
    const responsePayload = {
      joinRoomNotification: {
        joinUser: {
          id: user.id,
          nickname: user.nickname,
          character: user.characterData,
        },
      },
    };

    return responsePayload;
  } catch (e) {
    console.error(e);
  }
};
