import { Packets } from '../init/loadProtos.js';

const seconds = 5000;

export const getStateNormal = () => {
  return {
    currentState: Packets.CharacterStateType.NONE_CHARACTER_STATE,
    nextState: Packets.CharacterStateType.NONE_CHARACTER_STATE,
    nextStateAt: Date.now(),
    targetUserId: 0,
  };
};

export const getStateBbangShooter = (targetUser) => {
  return {
    currentState: Packets.CharacterStateType.BBANG_SHOOTER,
    nextState: Packets.CharacterStateType.NONE_CHARACTER_STATE,
    nextStateAt: Date.now() + seconds,
    targetUserId: targetUser,
  };
};

export const getStateBbangTarget = (targetUser) => {
  return {
    currentState: Packets.CharacterStateType.BBANG_TARGET,
    nextState: Packets.CharacterStateType.NONE_CHARACTER_STATE,
    nextStateAt: Date.now() + seconds,
    targetUserId: targetUser,
  };
};

export const getStateBigBbangShooter = (targetUser) => {
  return {
    currentState: Packets.CharacterStateType.BIG_BBANG_SHOOTER,
    nextState: Packets.CharacterStateType.NONE_CHARACTER_STATE,
    nextStateAt: Date.now() + seconds,
    targetUserId: targetUser,
  };
};

export const getStateBigBbangTarget = (targetUser) => {
  return {
    currentState: Packets.CharacterStateType.BIG_BBANG_TARGET,
    nextState: Packets.CharacterStateType.NONE_CHARACTER_STATE,
    nextStateAt: Date.now() + seconds,
    targetUserId: targetUser,
  };
};

export const getStateDeathInitShooter = (targetUser) => {
  return {
    currentState: Packets.CharacterStateType.DEATH_MATCH_STATE,
    nextState: Packets.CharacterStateType.DEATH_MATCH_TURN_STATE,
    nextStateAt: Date.now() + seconds,
    targetUserId: targetUser,
  };
};

export const getStateDeathInitTarget = (targetUser) => {
  return {
    currentState: Packets.CharacterStateType.DEATH_MATCH_TURN_STATE,
    nextState: Packets.CharacterStateType.DEATH_MATCH_STATE,
    nextStateAt: Date.now() + seconds,
    targetUserId: targetUser,
  };
};

export const getStateDeathMatchShooter = (User) => {
  return {
    currentState: Packets.CharacterStateType.DEATH_MATCH_STATE,
    nextState: Packets.CharacterStateType.NONE_CHARACTER_STATE,
    nextStateAt: Date.now() + seconds,
    targetUserId: User.characterData.stateInfo.stateTargetUserId,
  };
};

export const getStateDeathMatchTarget = (User) => {
  return {
    currentState: Packets.CharacterStateType.DEATH_MATCH_TURN_STATE,
    nextState: Packets.CharacterStateType.NONE_CHARACTER_STATE,
    nextStateAt: Date.now() + seconds,
    targetUserId: User.characterData.stateInfo.stateTargetUserId,
  };
};

export const getStateDeathMatchEnd = (targetUser) => {
  return {
    currentState: Packets.CharacterStateType.DEATH_MATCH_STATE,
    nextState: Packets.CharacterStateType.NONE_CHARACTER_STATE,
    nextStateAt: Date.now() + seconds,
    targetUserId: targetUser,
  };
};

export const getStatefleaMarketWait = () => {
  return {
    currentState: Packets.CharacterStateType.FLEA_MARKET_WAIT,
    nextState: Packets.CharacterStateType.FLEA_MARKET_TURN,
    nextStateAt: Date.now(),
    targetUserId: 0,
  };
};

export const getStatefleaMarketTurnEnd = () => {
  return {
    currentState: Packets.CharacterStateType.FLEA_MARKET_TURN,
    nextState: Packets.CharacterStateType.NONE_CHARACTER_STATE,
    nextStateAt: Date.now() + seconds,
    targetUserId: 0,
  };
};

export const getStatefleaMarketTurnOver = () => {
  return {
    currentState: Packets.CharacterStateType.FLEA_MARKET_WAIT,
    nextState: Packets.CharacterStateType.NONE_CHARACTER_STATE,
    nextStateAt: Date.now() + seconds,
    targetUserId: 0,
  };
};

export const getStateAbsorbing = (user) => {
  return {
    currentState: Packets.CharacterStateType.ABSORBING,
    nextState: Packets.CharacterStateType.NONE_CHARACTER_STATE,
    nextStateAt: Date.now(),
    targetUserId: user,
  };
};

export const getStateAbsorbTarget = (user) => {
  return {
    currentState: Packets.CharacterStateType.ABSORB_TARGET,
    nextState: Packets.CharacterStateType.NONE_CHARACTER_STATE,
    nextStateAt: Date.now(),
    targetUserId: user,
  };
};

export const getStateHallucinating = (user) => {
  return {
    currentState: Packets.CharacterStateType.HALLUCINATING,
    nextState: Packets.CharacterStateType.NONE_CHARACTER_STATE,
    nextStateAt: Date.now(),
    targetUserId: user,
  };
};

export const getStateHallucinationTarget = (user) => {
  return {
    currentState: Packets.CharacterStateType.HALLUCINATION_TARGET,
    nextState: Packets.CharacterStateType.NONE_CHARACTER_STATE,
    nextStateAt: Date.now(),
    targetUserId: user,
  };
};

export const getStateContained = () => {
  return {
    currentState: Packets.CharacterStateType.CONTAINED,
    nextState: Packets.CharacterStateType.NONE_CHARACTER_STATE,
    nextStateAt: Date.now(),
    targetUserId: 0,
  };
};

export const getStateGuerrillaShooter = (targetUser) => {
  return {
    currentState: Packets.CharacterStateType.GUERRILLA_SHOOTER,
    nextState: Packets.CharacterStateType.NONE_CHARACTER_STATE,
    nextStateAt: Date.now() + seconds,
    targetUserId: targetUser,
  };
};

export const getStateGuerrillaTarget = (targetUser) => {
  return {
    currentState: Packets.CharacterStateType.GUERRILLA_TARGET,
    nextState: Packets.CharacterStateType.NONE_CHARACTER_STATE,
    nextStateAt: Date.now() + seconds,
    targetUserId: targetUser,
  };
};
