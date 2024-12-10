import testDBConnection from '../utils/db/testConnection.js';
import { loadCharacterPositionsFromDB } from './loadPositions.js';
import { loadProto } from './loadProtos.js';
import { loadCardTypes } from '../constants/cardDeck.js';

const initServer = async () => {
  try {
    await testDBConnection();
    await loadProto();
    await loadCharacterPositionsFromDB();
    loadCardTypes();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export default initServer;
