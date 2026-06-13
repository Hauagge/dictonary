import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AppController } from "./app.controller"
import { buildTypeOrmOptions } from "./config/typeorm.config"

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useFactory: buildTypeOrmOptions }),
  ],
  controllers: [AppController],
})
export class AppModule {}
