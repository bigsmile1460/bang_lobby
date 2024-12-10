const leaveRoomNotification = (user) => {
  try {
    const responsePayload = {
      leaveRoomNotification: { userId: user.id },
    };

    return responsePayload;
  } catch (e) {
    console.error(e);
  }
};

export default leaveRoomNotification;
