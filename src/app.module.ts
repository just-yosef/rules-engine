import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService, } from "@nestjs/config"
import { RulesModule } from './rules/rules.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './db.config';
import { EventModule } from './event/event.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EmailsModule } from './emails/emails.module';
import { IsNeedRefreshToken } from './auth/middlewares';
import { SessionModule } from './session/session.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CacheInterceptor, CacheModule } from "@nestjs/cache-manager"

@Module({
  imports: [
    RulesModule,
    EventModule,
    CacheModule.register({
      isGlobal: true,
      ttl: 300_000
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useClass: MongooseConfigService
    }),

    UsersModule,
    AuthModule,
    EmailsModule,
    SessionModule,
  ],
  controllers: [AppController,],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IsNeedRefreshToken).forRoutes("*")
  }
}
