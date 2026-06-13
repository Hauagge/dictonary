import { TypeOrmModuleOptions } from "@nestjs/typeorm"
import { Favorite } from "../favorites/entities/favorite.entity"
import { History } from "../history/entities/history.entity"
import { Word } from "../entries/entities/word.entity"
import { User } from "../users/entities/user.entity"

export function buildTypeOrmOptions(): TypeOrmModuleOptions {
  const synchronize =
    process.env.DB_SYNCHRONIZE !== undefined
      ? process.env.DB_SYNCHRONIZE === "true"
      : process.env.NODE_ENV !== "production"

  const entities = [User, Word, History, Favorite]

  if (process.env.DATABASE_URL) {
    return {
      type: "postgres",
      url: process.env.DATABASE_URL,
      entities,
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
    synchronize,
  }
}
