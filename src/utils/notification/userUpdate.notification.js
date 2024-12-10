import { PACKET_TYPE } from '../../constants/header.js';
import { createResponse } from '../response/createResponse.js';

const userUpdateNotification = (users) => {
  try{
    const responsePayload = {
      userUpdateNotification: {
        user: users.map((user) => {
          // TODO: 바뀐 애들만 보내기
          return user.makeRawObject();
        }),
      },
    };
  
    users.forEach((user) => {
      user.socket.write(createResponse(PACKET_TYPE.USER_UPDATE_NOTIFICATION, 0, responsePayload));
    });
  
  }
  catch(e){
    console.error(e)
  }
};

export default userUpdateNotification;
