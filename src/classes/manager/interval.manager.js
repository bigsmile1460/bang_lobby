class IntervalManager {
  constructor() {
    this.intervals = new Map();
  }

  addInterval(id, callback, interval, eventName) {
    if (!this.intervals.has(id)) {
      this.intervals.set(id, new Map());
    }

    this.intervals.get(id).set(eventName, setInterval(callback, interval));
  }


  removeInterval(id, eventName) {
    const intervals = this.intervals.get(id);
    if (intervals && intervals.has(eventName)) {
      clearInterval(intervals.get(eventName));
      intervals.delete(eventName);
      console.log(`[CANCEL EVENT] ${id}: ${eventName} 취소됨.`);
      return;
    }
    console.log(`[NOT FOUND] ${id}: ${eventName}을 찾을 수 없음`);
  }

  clearAll() {
    this.intervals.forEach((userIntervals) => {
      userIntervals.forEach((intervalId) => {
        clearInterval(intervalId);
      });
    });

    this.intervals.clear();
  }
}

export default IntervalManager;
