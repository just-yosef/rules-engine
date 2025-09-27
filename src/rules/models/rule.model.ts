import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose"
import { HydratedDocument } from "mongoose";
import type { Actions, RuleStatus } from "src/rules/types";


export type RuleDocument = HydratedDocument<Rule>

@Schema()
export class Rule {
    @Prop({ unique: true, })
    eventName: string;

    @Prop()
    condition: string;

    @Prop()
    action: Actions

    @Prop()
    status: RuleStatus
}

export const RuleSchema = SchemaFactory.createForClass(Rule);
