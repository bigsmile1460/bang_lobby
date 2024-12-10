const equipCardNotification = (cardType, cardUsingUserId) => {
  try {
    const responsePayload = {
      equipCardNotification: {
        cardType: cardType,
        userId: cardUsingUserId,
      },
    };

    return responsePayload;
  } catch (e) {
    console.error(e);
  }
};

export default equipCardNotification;
