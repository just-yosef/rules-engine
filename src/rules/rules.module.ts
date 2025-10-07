import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { RulesController } from './rules.controller';
import { RulesService } from './rules.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Rule, RuleSchema } from './models';
import { MongooseConfigService } from 'src/db.config';
import { IsNeedRefreshToken } from 'src/auth/middlewares';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Rule.name, schema: RuleSchema, },]), UsersModule],
  controllers: [RulesController],
  providers: [RulesService, MongooseConfigService]
})
export class RulesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IsNeedRefreshToken).forRoutes("*")
  }
}
