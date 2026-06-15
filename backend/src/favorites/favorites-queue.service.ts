import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { Job, Queue, RedisOptions, Worker } from "bullmq"
import { FavoritesService } from "./favorites.service"

export const FAVORITES_QUEUE = "favorites"

const FOREIGN_KEY_VIOLATION = "23503"

type FavoriteAction = "add" | "remove"

interface FavoriteJob {
  action: FavoriteAction
  userId: string
  word: string
}

export function isForeignKeyViolation(error: unknown): boolean {
  const candidate = error as { code?: string; driverError?: { code?: string } }
  return candidate?.code === FOREIGN_KEY_VIOLATION || candidate?.driverError?.code === FOREIGN_KEY_VIOLATION
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
    // concurrency 1 garante ordem FIFO: o add e o remove da mesma palavra
    // sao processados na ordem em que foram enfileirados (sem race de toggle).
    this.worker = new Worker<FavoriteJob>(
      FAVORITES_QUEUE,
      (job: Job<FavoriteJob>) => this.process(job),
      { connection: { ...base, maxRetriesPerRequest: null }, concurrency: 1 },
    )
    this.worker.on("failed", (job, error) => {
      this.logger.error(`Falha ao persistir favorito ${job?.id}: ${error.message}`)
    })
  }

  enqueueAdd(userId: string, word: string): Promise<void> {
    return this.enqueue("add", userId, word)
  }

  enqueueRemove(userId: string, word: string): Promise<void> {
    return this.enqueue("remove", userId, word)
  }

  private async enqueue(action: FavoriteAction, userId: string, word: string): Promise<void> {
    if (!this.queue) {
      await this.run(action, userId, word)
      return
    }
    try {
      await this.queue.add(
        action,
        { action, userId, word },
        { attempts: 3, backoff: { type: "exponential", delay: 1000 }, removeOnComplete: true, removeOnFail: 100 },
      )
    } catch {
      await this.run(action, userId, word)
    }
  }

  private async process(job: Job<FavoriteJob>): Promise<void> {
    const { action, userId, word } = job.data
    try {
      await this.run(action, userId, word)
    } catch (error) {
      if (isForeignKeyViolation(error)) {
        this.logger.warn(`Favorito ignorado: usuario ${userId} nao existe mais`)
        return
      }
      throw error
    }
  }

  private run(action: FavoriteAction, userId: string, word: string): Promise<void> {
    return action === "add"
      ? this.favorites.add(userId, word)
      : this.favorites.remove(userId, word)
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
