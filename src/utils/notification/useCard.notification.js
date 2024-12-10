const useCardNotification = (cardType, cardUsingUserId, targetUserId = 0) => {
  try {
    const responsePayload = {
      useCardNotification: {
        cardType: cardType,
        userId: cardUsingUserId,
        targetUserId: targetUserId,
      },
    };

    return responsePayload;
  } catch (e) {
    console.error(e);
  }
};

export default useCardNotification;
