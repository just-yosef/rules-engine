import { Module } from '@nestjs/common';
import { RulesController } from './rules.controller';
import { RulesService } from './rules.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Rule, RuleSchema } from './models';
import { MongooseConfigService } from 'src/db.config';

@Module({
  imports: [MongooseModule.forFeature([{ name: Rule.name, schema: RuleSchema, },])],
  controllers: [RulesController],
  providers: [RulesService, MongooseConfigService]
})
export class RulesModule { }
