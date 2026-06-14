import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AppController } from "./app.controller"
import { AuthModule } from "./auth/auth.module"
import { buildTypeOrmOptions } from "./config/typeorm.config"
import { EntriesModule } from "./entries/entries.module"
import { UsersModule } from "./users/users.module"

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useFactory: buildTypeOrmOptions }),
    UsersModule,
    AuthModule,
    EntriesModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
