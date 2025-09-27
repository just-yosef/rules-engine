import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { RulesService } from './rules.service';
import { RuleDto } from './dtos';
@Controller('rules')
export class RulesController {
    constructor(private rulesService: RulesService) { }
    @Post()
    async createRule(@Body() rule: RuleDto) {
        return this.rulesService.createRule(rule)
    }
    @Get()
    async getAllRules(@Query("name") name?: string) {
        if (name) {
            return this.rulesService.getRuleByName(name)
        }
        return this.rulesService.getRules()
    }
    @Post("/add-many")
    async createManyRules(@Body() rules: RuleDto[]) {
        return this.rulesService.createManyRules(rules)
    }

    @Get(":ruleId")
    async getRuleById(@Param("ruleId") ruleId: string) {
        return this.rulesService.getRuleById(ruleId)
    }

    @Delete(":ruleId")
    async deleteRuleById(@Param("ruleId") ruleId: string) {
        return this.rulesService.deleteRule(ruleId)
    }
    @Patch(":ruleId")
    async updateRule(@Param("ruleId") ruleId: string, @Body() data: RuleDto) {
        return this.rulesService.updateRule(ruleId, data)
    }

}
