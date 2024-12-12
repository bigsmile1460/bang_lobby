import testDBConnection from '../utils/db/testConnection.js';
import { loadCharacterPositionsFromDB } from './loadPositions.js';
import { loadProto } from './loadProtos.js';
import { loadCardDeckFromDB } from './loadCardDeck.js';
import { loadCharactersFromDB } from './loadCharacter.js';
import { loadRolesFromDB } from './loadRoles.js';
const initServer = async () => {
  try {
    await testDBConnection();
    await loadProto();
    await loadCharacterPositionsFromDB(); //로비서버 로딩 완료되면 스폰 위치 레디스에 업로드
    await loadCardDeckFromDB();
    await loadCharactersFromDB();
    await loadRolesFromDB();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export default initServer;
