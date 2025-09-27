
import { IsString, IsIn } from "class-validator"
import { ActionsArray, RuleStatusArray, events } from "../constants";
import type { Actions, Rule, RuleStatus } from "src/rules/types"

export class RuleDto implements Rule {
    @IsIn(events)
    @IsString({ message: "Please Enter Event Name", })
    eventName: string;
    @IsString()
    @IsIn(ActionsArray)
    action: Actions;
    @IsString()
    condition: string;
    @IsIn(RuleStatusArray)
    @IsString()
    status: RuleStatus;
}
