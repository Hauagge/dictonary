import { join } from "path"
import { TypeOrmModuleOptions } from "@nestjs/typeorm"
import { FavoriteEntity } from "../favorites/entities/favorite.entity"
import { HistoryEntity } from "../history/entities/history.entity"
import { WordEntity } from "../entries/entities/word.entity"
import { UserEntity } from "../users/entities/user.entity"

export function buildTypeOrmOptions(): TypeOrmModuleOptions {
  const synchronize =
    process.env.DB_SYNCHRONIZE !== undefined
      ? process.env.DB_SYNCHRONIZE === "true"
      : process.env.NODE_ENV !== "production"

  const entities = [UserEntity, WordEntity, HistoryEntity, FavoriteEntity]
  // Resolve em .ts (ts-node/CLI) e em .js (dist em producao).
  const migrations = [join(__dirname, "..", "migrations", "*{.ts,.js}")]

  if (process.env.DATABASE_URL) {
    return {
      type: "postgres",
      url: process.env.DATABASE_URL,
      entities,
      migrations,
      synchronize,
    }
  }

  return {
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 5432),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities,
    migrations,
    synchronize,
  }
}
