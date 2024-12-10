import net from 'net';
import { onConnection } from './events/onConnection.js';
import { config } from './config/config.js';
import initServer from './init/index.js';

const server = net.createServer(onConnection);

const port = config.server.port;
const host = config.server.host;

try {
  await initServer();
  server.listen(port, host, () => console.log(`Listening on ${host}:${port}`));
} catch (err) {
  console.error(err);
  process.exit(1);
}
