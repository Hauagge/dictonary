import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { Job, Queue, RedisOptions, Worker } from "bullmq"
import { FavoritesService } from "./favorites.service"

export const FAVORITES_QUEUE = "favorites"

interface FavoriteJob {
  userId: string
  word: string
}

@Injectable()
export class FavoritesQueueService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(FavoritesQueueService.name)
  private queue: Queue<FavoriteJob> | null = null
  private worker: Worker<FavoriteJob> | null = null

  constructor(
    private readonly config: ConfigService,
    private readonly favorites: FavoritesService,
  ) {}

  onModuleInit(): void {
    const url = this.config.get<string>("REDIS_URL")
    if (!url) {
      this.logger.log("REDIS_URL nao definida, favoritos persistidos de forma sincrona")
      return
    }

    const base = this.parseRedisUrl(url)

    this.queue = new Queue(FAVORITES_QUEUE, {
      connection: { ...base, maxRetriesPerRequest: 1, enableOfflineQueue: false },
    })
    this.worker = new Worker<FavoriteJob>(
      FAVORITES_QUEUE,
      (job: Job<FavoriteJob>) => this.favorites.add(job.data.userId, job.data.word),
      { connection: { ...base, maxRetriesPerRequest: null } },
    )
    this.worker.on("failed", (job, error) => {
      this.logger.error(`Falha ao persistir favorito ${job?.id}: ${error.message}`)
    })
  }

  async enqueueAdd(userId: string, word: string): Promise<void> {
    if (!this.queue) {
      await this.favorites.add(userId, word)
      return
    }
    try {
      await this.queue.add(
        "add",
        { userId, word },
        { attempts: 3, backoff: { type: "exponential", delay: 1000 }, removeOnComplete: true, removeOnFail: 100 },
      )
    } catch {
      await this.favorites.add(userId, word)
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.worker?.close().catch(() => undefined)
    await this.queue?.close().catch(() => undefined)
  }

  private parseRedisUrl(url: string): RedisOptions {
    const parsed = new URL(url)
    const db = parsed.pathname.slice(1)
    return {
      host: parsed.hostname,
      port: Number(parsed.port) || 6379,
      username: parsed.username || undefined,
      password: parsed.password || undefined,
      db: db ? Number(db) : undefined,
      tls: parsed.protocol === "rediss:" ? {} : undefined,
    }
  }
}
