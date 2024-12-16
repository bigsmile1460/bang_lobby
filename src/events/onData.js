import { config } from '../config/config.js';
import { PACKET_TYPE } from '../constants/header.js';
import { getHandlerByPacketType } from '../handler/index.js';
import { Packets } from '../init/loadProtos.js';
import getPacketTypeName from '../utils/getPacketTypeName.js';

const ROOMSTATE_SIZE = config.header.ROOMSTATE_SIZE;
const ROOM_ID_SIZE = config.header.ROOM_ID_SIZE;
const PAYLOAD_ONEOF_CASE_SIZE = config.header.PAYLOAD_ONEOF_CASE_SIZE;
const VERSION_LENGTH_SIZE = config.header.VERSION_LENGTH_SIZE;
const SEQUENCE_SIZE = config.header.SEQUENCE_SIZE;
const PAYLOAD_LENGTH_SIZE = config.header.PAYLOAD_LENGTH_SIZE;

export const onData = (socket) => async (data) => {
  socket.buffer = Buffer.concat([socket.buffer, data]);

  const headerSize =
    ROOMSTATE_SIZE +
    ROOM_ID_SIZE +
    PAYLOAD_ONEOF_CASE_SIZE +
    VERSION_LENGTH_SIZE +
    SEQUENCE_SIZE +
    PAYLOAD_LENGTH_SIZE;

  while (socket.buffer.length >= headerSize) {
    // 2 byte로 읽어야함
    const roomState = socket.buffer.readUInt16BE(0);
    console.log(`RoomState: ${roomState}`);

    const roomIdOffset = ROOMSTATE_SIZE;
    // 4 bytes
    const roomId = socket.buffer.readUInt32BE(roomIdOffset);
    console.log(`RoomId: ${roomId}`);

    const payloadOneofCaseOffset = roomIdOffset + ROOM_ID_SIZE;
    const payloadOneofCase = socket.buffer.readUInt16BE(payloadOneofCaseOffset);
    console.log(`packetType: ${getPacketTypeName(payloadOneofCase)}`);

    const versionLengthOffset = payloadOneofCaseOffset + PAYLOAD_ONEOF_CASE_SIZE;
    const versionLength = socket.buffer.readUInt8(versionLengthOffset);

    const totalHeaderLength = headerSize + versionLength;

    // 전체 패킷이 준비될 때까지 반복하기 위해 break
    if (socket.buffer.length < totalHeaderLength) {
      break;
    }

    const versionOffset = versionLengthOffset + VERSION_LENGTH_SIZE;
    const version = socket.buffer.toString('utf-8', versionOffset, versionOffset + versionLength);
    console.log(`version: ${version}`);

    // TODO: 클라이언트 version 검증

    const sequenceOffset = versionOffset + versionLength;
    const sequence = socket.buffer.readUInt32BE(sequenceOffset);
    console.log(`sequence: ${sequence}`);

    const payloadLengthOffset = sequenceOffset + SEQUENCE_SIZE;
    const payloadLength = socket.buffer.readUInt32BE(payloadLengthOffset);

    // 패킷 전체 길이
    const packetLength = totalHeaderLength + payloadLength;

    // 현재 버퍼 길이가 총 패킷 길이보다 짧다면 모두 수신할 때까지 반복
    if (socket.buffer.length < packetLength) {
      break;
    }

    // NOTE: 이 아래로 실행 안됨

    const payload = socket.buffer.slice(totalHeaderLength, packetLength);
    // 남은 데이터(payloadLength를 초과)가 있다면 다시 버퍼에 넣어줌
    socket.buffer = socket.buffer.slice(packetLength);
    console.log(`payload: ${payload}`);

    try {
      const decodedPacket = Packets.GamePacket.decode(payload);
      console.log(`decoded payload: ${decodedPacket}`);
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
