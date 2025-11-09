import IORedis from 'ioredis';

const redisUrl = process.env.REDIS_URL;

// Only create connection if Redis URL is provided
export const connection = redisUrl 
  ? new IORedis(redisUrl, { 
      maxRetriesPerRequest: 1,
      retryStrategy: () => null // Don't retry if connection fails
    })
  : null as any; // Fallback for when Redis is not available






