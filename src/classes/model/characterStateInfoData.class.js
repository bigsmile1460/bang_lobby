import { Packets } from '../../init/loadProtos.js';

class CharacterStateInfoData {
  constructor() {
    this.prevState = Packets.CharacterStateType.NONE_CHARACTER_STATE;
    this.state = Packets.CharacterStateType.NONE_CHARACTER_STATE;
    this.nextState = Packets.CharacterStateType.NONE_CHARACTER_STATE;
    this.nextStateAt = 0;
    this.stateTargetUserId = 0;
  }
}

export default CharacterStateInfoData;
