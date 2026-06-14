import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { APP_INTERCEPTOR } from "@nestjs/core"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AppController } from "./app.controller"
import { AuthModule } from "./auth/auth.module"
import { ResponseTimeInterceptor } from "./common/interceptors/response-time.interceptor"
import { buildTypeOrmOptions } from "./config/typeorm.config"
import { EntriesModule } from "./entries/entries.module"
import { RedisModule } from "./redis/redis.module"
import { UsersModule } from "./users/users.module"

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useFactory: buildTypeOrmOptions }),
    RedisModule,
    UsersModule,
    AuthModule,
    EntriesModule,
  ],
  controllers: [AppController],
  providers: [{ provide: APP_INTERCEPTOR, useClass: ResponseTimeInterceptor }],
})
export class AppModule {}
