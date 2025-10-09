import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RuleDto } from './dtos';
import { Rule } from './models';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
@Injectable()
export class RulesService {
    constructor(
        @InjectModel(Rule.name) private Rule: Model<Rule>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) { }
    async createRule(data: RuleDto) {
        try {
            const newRule = await this.Rule.create(data);
            return newRule
        } catch (error) {
            throw new HttpException("Failed To Create Rule", HttpStatus.BAD_REQUEST)
        }
    }
    async getRules() {
        try {
            const cachedRules = await this.cacheManager.get('rules');
            if (cachedRules) return cachedRules
            const rules = await this.Rule.find();
            await this.cacheManager.set('rules', rules);
            return rules;
        } catch (error) {
            throw new HttpException('Failed to get rules', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getRuleById(id: string) {
        try {
            const rule = await this.Rule.findById(id);
            if (!rule) {
                throw new HttpException("Rule Not Found", HttpStatus.NOT_FOUND);
            }
            return rule;
        } catch (error) {
            throw new HttpException("Failed To Get Rule", HttpStatus.NOT_FOUND);
        }
    }
    async getRuleByName(name: string) {
        try {
            const pattern = new RegExp(name, 'gi');
            const rules = await this.Rule.find({
                eventName: { $regex: pattern }
            });
            if (!rules || rules.length === 0) {
                throw new HttpException("No Rules Found With This Name", HttpStatus.NOT_FOUND);
            }
            return rules;
        } catch (error) {
            console.log(error);

            throw new HttpException("Failed To Get Rule By Name", HttpStatus.BAD_REQUEST);
        }
    }

    async updateRule(id: string, data: Partial<RuleDto>) {
        try {
            const updatedRule = await this.Rule.findByIdAndUpdate(id, data, { new: true });
            if (!updatedRule) {
                throw new HttpException("Rule Not Found", HttpStatus.NOT_FOUND);
            }
            return updatedRule;
        } catch (error) {
            throw new HttpException("Failed To Update Rule", HttpStatus.BAD_REQUEST);
        }
    }

    async deleteRule(id: string) {
        try {
            const deletedRule = await this.Rule.findByIdAndDelete(id);
            if (!deletedRule) {
                throw new HttpException("Rule Not Found", HttpStatus.NOT_FOUND);
            }
            return { message: "Rule Deleted Successfully" };
        } catch (error) {
            throw new HttpException("Failed To Delete Rule", HttpStatus.BAD_REQUEST);
        }
    }
    async createManyRules(data: RuleDto[]) {
        try {
            const newRules = await this.Rule.insertMany(data, { ordered: true });
            return newRules;
        } catch (error) {
            console.error(error);
            throw new HttpException("Failed To Create Multiple Rules", HttpStatus.BAD_REQUEST);
        }
    }
}
