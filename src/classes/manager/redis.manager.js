import Redis from 'ioredis';
import { config } from '../../config/config.js';

class RedisManager {
  static #instance; // private
  constructor() {
    if (RedisManager.#instance) {
      return RedisManager.#instance;
    }

    this.redisClient = new Redis({
      host: config.redis.host,
      port: config.redis.port,
      password: config.redis.password,
    });

    RedisManager.#instance = this;
  }

  static getInstance() {
    if (!RedisManager.#instance) {
      new RedisManager();
    }

    return RedisManager.#instance;
  }

  async set(key, value, expire = null) {
    try {
      if (expire) {
        await this.redisClient.set(key, value, 'EX', expire);
      } else {
        await this.redisClient.set(key, value);
      }
      console.log(`Key "${key}"가 설정되었습니다.`);
    } catch (e) {
      console.error(e);
    }
  }

  async setHash(key, field, value) {
    try {
      await this.redisClient.hset(key, field, value);
    } catch (e) {
      console.error(e);
    }
  }

  async getHash(key, field) {
    try {
      const value = await this.redisClient.hget(key, field);
      // console.log(`Key "${key}"의 값:`, value);
      return JSON.parse(value);
    } catch (e) {
      console.error(e);
    }
  }

  async hashLength(key) {
    try {
      const length = await this.redisClient.hlen(key);
      console.log(`Key "${key}"의 길이:`, length);
      return length;
    } catch (e) {
      console.error(e);
    }
  }


  async getAllHash(key) {
    try {
      const getData = await this.redisClient.hgetall(key);
      if (Object.keys(getData).length > 0) {
        return getData;
      } else {
        return null;
      }
    } catch (e) {
      console.error(e);
    }
  }
  async getHkeys(key) {
    try {
      const result = await this.redisClient.hkeys(key);
      return JSON.parse(result);
    } catch(e) {
      console.error(e);
    }
  }
  async hExists(key, field) {
    try {
      const result = this.redisClient.hexists(key, field);
      return result;
    } catch(e) {
      console.error(e);
    }
  }
  async getHvals(key){
    try{
      const result = await this.redisClient.hvals(key);
      return result;
    }
    catch(e){
    }
  }
  //TODO: 해쉬 내부의 특정 값만 삭제할 수 있는 함수
  // hdel(room, 2), hlen(room) -> 필드 개수 길이
  async delHash(key, field){
    try{
        await this.redisClient.hdel(key, field);
    }
    catch(e){
        console.error(e)
    }
  }

  async get(key) {
    try {
      const value = await this.redisClient.get(key);
      console.log(`Key "${key}"의 값:`, value);
      return JSON.parse(value);
    } catch (e) {
      console.error(e);
    }
  }

  async del(key) {
    try {
      const result = await this.redisClient.del(key);
      console.log(`Key "${key}"가 삭제되었습니다.`);
      return result;
    } catch (e) {
      console.error(e);
    }
  }

  // channel: userData
  // message: winRecord, id {roomId : 1, userId : 1, }
  // 로비 서버에서 init 시? 또는 방이 생성되고?
  async publish(channel, message) {
    try {
      await this.redisClient.publish(channel, message);
    } catch (e) {
      console.error(e);
    }
  }

  // 게임 서버에서 init 시
  async subscribe(channel, callback) {
    try {
      await this.redisClient.subscribe(channel, callback);
    } catch (e) {
      console.error(e);
    }
  }

  // subscriber
  // 게임 서버에서 subscribe된 이벤트 발동
  onGameStart() {
    this.redisClient.on('message', (channel, message) => {
      // 게임 시작(세션 생성, 등등)
      console.log(`Received message: "${message}" from channel: "${channel}"`);
    });
  }

  disconnect() {
    this.redisClient.quit();
    console.log('레디스 연결 해제');
  }

}

export default RedisManager;
