import { config } from '../../config/config.js';
import { Packets } from '../../init/loadProtos.js';

const createHeader = (payloadOneofCase, sequence, payloadLength) => {
  const payloadOneofCaseBuffer = Buffer.alloc(config.header.PAYLOAD_ONEOF_CASE_SIZE);
  payloadOneofCaseBuffer.writeUInt16BE(payloadOneofCase, 0);

  const versionBuffer = Buffer.from(config.client.version);

  const versionLengthBuffer = Buffer.alloc(config.header.VERSION_LENGTH_SIZE);
  versionLengthBuffer.writeUInt8(versionBuffer.length, 0);

  const seqeunceBuffer = Buffer.alloc(config.header.SEQUENCE_SIZE);
  seqeunceBuffer.writeUint32BE(sequence, 0);

  const payloadLengthBuffer = Buffer.alloc(config.header.PAYLOAD_LENGTH_SIZE);
  payloadLengthBuffer.writeUInt32BE(payloadLength, 0);

  return Buffer.concat([
    payloadOneofCaseBuffer,
    versionLengthBuffer,
    versionBuffer,
    seqeunceBuffer,
    payloadLengthBuffer,
  ]);
};

export const createResponse = (payloadOneofCase, sequence, payload) => {
  const payloadBuffer = Packets.GamePacket.encode(Packets.GamePacket.create(payload)).finish();
  const header = createHeader(payloadOneofCase, sequence, payloadBuffer.length);

  return Buffer.concat([header, payloadBuffer]);
};
