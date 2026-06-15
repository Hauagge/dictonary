import "dotenv/config"
import "reflect-metadata"
import { DataSource, DataSourceOptions } from "typeorm"
import { buildTypeOrmOptions } from "./typeorm.config"

const options = {
  ...(buildTypeOrmOptions() as DataSourceOptions),
  synchronize: false,
}

export const AppDataSource = new DataSource(options)
