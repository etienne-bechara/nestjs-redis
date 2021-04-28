export interface RedisLockOptions {
  ttl?: number;
  retries?: number;
  timeout?: number;
  delay?: number;
}
