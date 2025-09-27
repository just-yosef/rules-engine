import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService, } from "@nestjs/config"
import { RulesModule } from './rules/rules.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './db.config';
import { EventModule } from './event/event.module';


@Module({
  imports: [
    RulesModule,
    EventModule,

    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useClass: MongooseConfigService
    }),
  ],
  controllers: [AppController,],
  providers: [AppService],
})
export class AppModule {
}
