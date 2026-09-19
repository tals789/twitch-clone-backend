import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createClient } from "redis";

export type RedisClient = ReturnType<typeof createClient>

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly redis!: RedisClient

  constructor(private readonly config: ConfigService) {    
    this.redis = createClient({ url: config.getOrThrow<string>('REDIS_URL') })
    
    this.redis.on('error', (err) => console.error(err))
  }

  getClient(): RedisClient {
    return this.redis
  }

  async set(
    key: string,
    value: string,
    ttlSeconds?: number,
  ): Promise<string | null> {
    if (ttlSeconds !== undefined) {
      return await this.redis.set(key, value, {
        EX: ttlSeconds,
      });
    }

    return await this.redis.set(key, value);
  }

  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  async del(key: string): Promise<number> {
    return await this.redis.del(key);
  }

  async exists(key: string): Promise<boolean> {
    return (await this.redis.exists(key)) === 1;
  }

  async ping(): Promise<string> {
    return this.redis.ping();
  }

  async keys(template: string): Promise<string[]> {
    return await this.redis.keys(template)
  }

  async onModuleInit() {
    if (!this.redis.isOpen) {
      await this.redis.connect()
    }
  }

  async onModuleDestroy() {
    if (this.redis.isOpen) {
      await this.redis.quit()
    }
  }
}