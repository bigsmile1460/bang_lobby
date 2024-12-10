const positionUpdateNotification = (users) => {
  try {
    const responsePayload = {
      positionUpdateNotification: {
        characterPositions: users.map((user) => {
          return { id: user.id, x: user.getX(), y: user.getY() };
        }),
      },
    };

    return responsePayload;
  } catch (e) {
    console.error(e);
  }
};

export default positionUpdateNotification;
