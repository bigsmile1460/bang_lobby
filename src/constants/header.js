export const ROOMSTATE_SIZE = 1;
export const ROOM_ID_SIZE = 4;
export const PAYLOAD_ONEOF_CASE_SIZE = 2;
export const VERSION_LENGTH_SIZE = 1;
export const SEQUENCE_SIZE = 4;
export const PAYLOAD_LENGTH_SIZE = 4;

export const PACKET_TYPE = {
  REGISTER_REQUEST: 1,
  REGISTER_RESPONSE: 2,
  LOGIN_REQUEST: 3,
  LOGIN_RESPONSE: 4,

  CREATE_ROOM_REQUEST: 5,
  CREATE_ROOM_RESPONSE: 6,
  GET_ROOM_LIST_REQUEST: 7,
  GET_ROOM_LIST_RESPONSE: 8,

  JOIN_ROOM_REQUEST: 9,
  JOIN_ROOM_RESPONSE: 10,
  JOIN_RANDOM_ROOM_REQUEST: 11,
  JOIN_RANDOM_ROOM_RESPONSE: 12,
  JOIN_ROOM_NOTIFICATION: 13,

  LEAVE_ROOM_REQUEST: 14,
  LEAVE_ROOM_RESPONSE: 15,
  LEAVE_ROOM_NOTIFICATION: 16,

  GAME_PREPARE_REQUEST: 17,
  GAME_PREPARE_RESPONSE: 18,
  GAME_PREPARE_NOTIFICATION: 19,

  GAME_START_REQUEST: 20,
  GAME_START_RESPOSNE: 21,
  GAME_START_NOTIFICATION: 22,

  POSITION_UPDATE_REQUEST: 23,
  POSITION_UPDATE_NOTIFICATION: 24,

  USE_CARD_REQUEST: 25,
  USE_CARD_RESPONSE: 26,

  // 카드 사용 후(USE_CARD_REQUEST) 후 모두에게 사용 알림
  USE_CARD_NOTIFICATION: 27,
  EQUIP_CARD_NOTIFICATION: 28,
  CARD_EFFECT_NOTIFICATION: 29,

  FLEA_MARKET_NOTIFICATION: 30,

  FLEA_MARKET_PICK_REQUEST: 31,
  FLEA_MARKET_PICK_RESPONSE: 32,

  USER_UPDATE_NOTIFICATION: 33,

  PHASE_UPDATE_NOTIFICATION: 34,
  REACTION_REQUEST: 35,
  REACTION_RESPONSE: 36,

  DESTROY_CARD_REQUEST: 37,
  DESTROY_CARD_RESPONSE: 38,
  GAME_END_NOTIFICATION: 39,

  CARD_SELECT_REQUEST: 40,
  CARD_SELECT_RESPONSE: 41,

  PASS_DEBUFF_REQUEST: 42,
  PASS_DEBUFF_RESPONSE: 43,

  WARNING_NOTIFICATION: 44,
  ANIMATION_NOTIFICATION: 45,
};
