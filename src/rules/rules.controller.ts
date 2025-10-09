import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { RulesService } from './rules.service';
import { RuleDto } from './dtos';
import { HaveRequiredRoles, IsLoggedIn } from 'src/auth/guards';
import { Roles } from 'src/auth/decorators';
import type { Request } from 'express';

@UseGuards(IsLoggedIn)
@Controller('rules')
export class RulesController {
    constructor(private rulesService: RulesService) { }
    @Roles("admin")
    @UseGuards(HaveRequiredRoles)
    @Post()
    async createRule(@Body() rule: RuleDto) {
        return this.rulesService.createRule(rule)
    }
    @Get()
    async getAllRules(@Req() req: Request,@Query("name") name?: string) {
    
        if (name) {
            return this.rulesService.getRuleByName(name)
        }
        return this.rulesService.getRules()
    }
    @Roles("admin")
    @Post("/add-many")
    async createManyRules(@Body() rules: RuleDto[]) {
        return this.rulesService.createManyRules(rules)
    }

    @Get(":ruleId")
    async getRuleById(@Param("ruleId") ruleId: string) {
        return this.rulesService.getRuleById(ruleId)
    }

    @Roles("admin")
    @Delete(":ruleId")
    async deleteRuleById(@Param("ruleId") ruleId: string) {
        return this.rulesService.deleteRule(ruleId)
    }

    @Roles("admin")
    @Patch(":ruleId")
    async updateRule(@Param("ruleId") ruleId: string, @Body() data: RuleDto) {
        return this.rulesService.updateRule(ruleId, data)
    }

}
