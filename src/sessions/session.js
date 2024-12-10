// 나중에 Redis로 사용할 수도 있음
// 저장할 때 key: `game:${currentGame.id}`, value: currentGame
// 원본객체로 복원할 때 Object.assign(Game, game)
// 아니면 class-transformer <--- 라이브러리
export const gameSession = [];
export const userSession = [];
