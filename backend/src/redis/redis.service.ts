import { Injectable, Logger, OnModuleDestroy } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import Redis from "ioredis"

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name)
  private client: Redis | null = null
  private available = false
  private readonly ttl: number

  constructor(config: ConfigService) {
    this.ttl = Number(config.get("CACHE_TTL") || 86400)
    const url = config.get<string>("REDIS_URL")

    if (!url) {
      this.logger.log("REDIS_URL nao definida, cache desativado")
      return
    }

    this.client = new Redis(url, {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      retryStrategy: (times) => (times > 3 ? null : Math.min(times * 200, 1000)),
    })
    this.client.on("ready", () => {
      this.available = true
    })
    this.client.on("error", () => {
      this.available = false
    })
    this.client.on("end", () => {
      this.available = false
    })
    this.client.connect().catch(() => {
      this.available = false
    })
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.client || !this.available) {
      return null
    }
    try {
      const raw = await this.client.get(key)
      return raw ? (JSON.parse(raw) as T) : null
    } catch {
      return null
    }
  }

  async set(key: string, value: unknown, ttlSeconds = this.ttl): Promise<void> {
    if (!this.client || !this.available) {
      return
    }
    try {
      await this.client.set(key, JSON.stringify(value), "EX", ttlSeconds)
    } catch {
      return
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.client) {
      try {
        await this.client.quit()
      } catch {
        return
      }
    }
  }
}
