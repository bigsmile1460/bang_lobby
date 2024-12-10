import { PACKET_TYPE } from '../constants/header.js';

const PACKET_TYPE_NAME = Object.entries(PACKET_TYPE).reduce((acc, [key, value]) => {
  acc[value] = key;
  return acc;
}, {});

const getPacketTypeName = (packetType) => {
  return PACKET_TYPE_NAME[packetType] || 'Unknown packet type';
};

export default getPacketTypeName;
