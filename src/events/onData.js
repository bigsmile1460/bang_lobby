import { config } from '../config/config.js';
import { PACKET_TYPE } from '../constants/header.js';
import { getHandlerByPacketType } from '../handler/index.js';
import { Packets } from '../init/loadProtos.js';
import getPacketTypeName from '../utils/getPacketTypeName.js';

const PAYLOAD_ONEOF_CASE_SIZE = config.header.PAYLOAD_ONEOF_CASE_SIZE;
const VERSION_LENGTH_SIZE = config.header.VERSION_LENGTH_SIZE;
const SEQUENCE_SIZE = config.header.SEQUENCE_SIZE;
const PAYLOAD_LENGTH_SIZE = config.header.PAYLOAD_LENGTH_SIZE;

export const onData = (socket) => async (data) => {
  socket.buffer = Buffer.concat([socket.buffer, data]);

  const headerSize =
    PAYLOAD_ONEOF_CASE_SIZE + VERSION_LENGTH_SIZE + SEQUENCE_SIZE + PAYLOAD_LENGTH_SIZE;

  while (socket.buffer.length >= headerSize) {
    const payloadOneofCase = socket.buffer.readUInt16BE(0);
    const versionLength = socket.buffer.readUInt8(PAYLOAD_ONEOF_CASE_SIZE);
    const totalHeaderLength = headerSize + versionLength;

    // 전체 패킷이 준비될 때까지 반복하기 위해 break
    if (socket.buffer.length < totalHeaderLength) {
      break;
    }

    const versionOffset = PAYLOAD_ONEOF_CASE_SIZE + VERSION_LENGTH_SIZE;
    const version = socket.buffer.toString('utf-8', versionOffset, versionOffset + versionLength);

    // TODO: 클라이언트 version 검증

    const sequenceOffset = versionOffset + versionLength;
    const sequence = socket.buffer.readUInt32BE(sequenceOffset);

    const payloadLengthOffset = sequenceOffset + SEQUENCE_SIZE;
    const payloadLength = socket.buffer.readUInt32BE(payloadLengthOffset);

    // 패킷 전체 길이
    const packetLength = totalHeaderLength + payloadLength;

    // 현재 버퍼 길이가 총 패킷 길이보다 짧다면 모두 수신할 때까지 반복
    if (socket.buffer.length < packetLength) {
      break;
    }

    const payload = socket.buffer.slice(totalHeaderLength, packetLength);
    // 남은 데이터(payloadLength를 초과)가 있다면 다시 버퍼에 넣어줌
    socket.buffer = socket.buffer.slice(packetLength);

    try {
      const decodedPacket = Packets.GamePacket.decode(payload);
      const handler = getHandlerByPacketType(payloadOneofCase);
      if (handler) {
        const t0 = performance.now();
        await handler(socket, decodedPacket);
        const t1 = performance.now();
        if (payloadOneofCase !== PACKET_TYPE.POSITION_UPDATE_REQUEST) {
          console.log(
            `Handle ${getPacketTypeName(payloadOneofCase)} took ${t1 - t0} milliseconds.`,
          );
        }
      }
    } catch (err) {
      console.error(err);
    }
  }
};
