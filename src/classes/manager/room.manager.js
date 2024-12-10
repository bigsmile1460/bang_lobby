class RoomManager {
  constructor() {
    if (RoomManager.instance) {
      return RoomManager.instance;
    }

    this.availableIds = []; // 삭제된 ID를 추적
    this.nextId = 1; // 다음 생성될 방 ID

    RoomManager.instance = this; // 인스턴스를 저장
  }

  static getInstance() {
    if (!RoomManager.instance) {
      RoomManager.instance = new RoomManager();
    }
    return RoomManager.instance;
  }

  createRoom() {
    let roomId;
    if (this.availableIds.length > 0) {
      // 가장 작은 삭제된 ID를 재사용
      roomId = this.availableIds.shift();
    } else {
      // 새로운 ID를 생성
      roomId = this.nextId;
      this.nextId++;
    }
    return roomId;
  }

  deleteRoom(roomId) {
    if (roomId < this.nextId && !this.availableIds.includes(roomId)) {
      // 삭제된 ID를 리스트에 추가하고 정렬
      this.availableIds.push(roomId);
      this.availableIds.sort((a, b) => a - b); // 오름차순 정렬
    }
  }
}

export const roomManager = RoomManager.getInstance();
