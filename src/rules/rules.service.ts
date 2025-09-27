import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RuleDto } from './dtos';
import { Rule } from './models';
@Injectable()
export class RulesService {
    constructor(
        @InjectModel(Rule.name) private Rule: Model<Rule>
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
            const rules = await this.Rule.find()
            return rules
        } catch (error) {
            throw new HttpException("Failed To Get Rules", HttpStatus.NOT_FOUND)
        }
    }
    async getRuleById(id: string) {
        try {
            const rule = await this.Rule.findById(id);
            console.log(rule);
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
            console.log(pattern);
            const rules = await this.Rule.find({
                eventName: { $regex: pattern }
            });
            console.log(rules);
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
