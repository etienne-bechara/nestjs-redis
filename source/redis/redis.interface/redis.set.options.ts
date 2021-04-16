export interface RedisSetOptions {
  skip?: 'IF_EXIST' | 'IF_NOT_EXIST';
  ttl?: number;
  keepTtl?: boolean;
}
