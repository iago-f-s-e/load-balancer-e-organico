import Redis from 'ioredis';
import * as Config from '@src/config';

export const redisConnection = new Redis(Config.REDIS_URI, {
  connectTimeout: Config.REDIS_TIMEOUT
});
