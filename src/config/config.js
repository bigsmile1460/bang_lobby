import {
  CLIENT_VERSION,
  DB1_HOST,
  DB1_NAME,
  DB1_PASSWORD,
  DB1_PORT,
  DB1_USER,
  DB2_HOST,
  DB2_NAME,
  DB2_PASSWORD,
  DB2_PORT,
  DB2_USER,
  HOST,
  JWT_SECRET_KEY,
  PORT,
  REDIS_HOST,
  REDIS_NAME,
  REDIS_PASSWORD,
  REDIS_PORT
} from '../constants/env.js';
import {
  PAYLOAD_LENGTH_SIZE,
  PAYLOAD_ONEOF_CASE_SIZE,
  SEQUENCE_SIZE,
  VERSION_LENGTH_SIZE,
} from '../constants/header.js';

export const config = {
  server: {
    port: PORT,
    host: HOST,
  },
  client: {
    version: CLIENT_VERSION,
  },
  header: {
    PAYLOAD_ONEOF_CASE_SIZE,
    VERSION_LENGTH_SIZE,
    SEQUENCE_SIZE,
    PAYLOAD_LENGTH_SIZE,
  },
  database: {
    USER_DB: {
      name: DB1_NAME,
      user: DB1_USER,
      password: DB1_PASSWORD,
      host: DB1_HOST,
      port: DB1_PORT,
    },
    GAME_DB: {
      name: DB2_NAME,
      user: DB2_USER,
      password: DB2_PASSWORD,
      host: DB2_HOST,
      port: DB2_PORT,
    },
  },
  jwt: {
    SCRET_KEY: JWT_SECRET_KEY,
  },
  redis: {
    host: REDIS_HOST,
    port: REDIS_PORT,
    name: REDIS_NAME,
    password: REDIS_PASSWORD,
  }
};
