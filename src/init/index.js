import testDBConnection from '../utils/db/testConnection.js';
import { loadCharacterPositionsFromDB } from './loadPositions.js';
import { loadProto } from './loadProtos.js';
import { loadCardTypes } from '../constants/cardDeck.js';

const initServer = async () => {
  try {
    await testDBConnection();
    await loadProto();
    await loadCharacterPositionsFromDB(); //로비서버 로딩 완료되면 스폰 위치 레디스에 업로드 
    // await loadCardDeckFromDB();
    // await loadCharactersFromDB();
    // await loadRolesFromDB()
    loadCardTypes(); // 카드덱 정보
    
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export default initServer;
