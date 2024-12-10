import { Packets } from '../../init/loadProtos.js';
import CharacterStateInfoData from './characterStateInfoData.class.js';

class CharacterData {
  constructor() {
    this.characterType = Packets.CharacterType.NONE_CHARACTER;
    this.roleType = Packets.RoleType.NONE_ROLE;
    this.hp = 0;
    this.weapon = 0;
    this.stateInfo = new CharacterStateInfoData(); // CharacterStateInfoData Object
    this.equips = []; // int32
    this.debuffs = []; // int32
    // 가능하면 Map으로 관리하는 것이 좋음. 카드 찾을 때 O(1)과 O(n)의 차이
    this.handCards = new Map(); // CardData Object
    this.bbangCount = 0;
    this.handCardsCount = 0;
    this.alive = true;
  }
  // CardData를 이용하여 handCards 관련 매서드 고려
}

export default CharacterData;
