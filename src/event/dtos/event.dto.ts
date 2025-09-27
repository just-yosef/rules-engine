
import { Type } from "class-transformer";
import {
    IsIn,
    IsNotEmptyObject,
    IsString,
    ValidateNested
} from "class-validator";


import { Event, OrderObject, PaymentObject, UserObject } from "../types";
import { events } from "src/rules/constants";

export class dataObjectDTO {
    data: UserObject | OrderObject | PaymentObject;
}


export class EventDto {
    @IsIn(events, {
        message: `Event Must Be One Of [ ${events.map(e => e)} ]`
    })
    @IsString({ message: "Event Name Is Required Please Fill it" })
    eventName: string
    @IsIn(["users", "orders", "payments"], {
        message: "Service must be one of: users, orders, payments"
    })
    service: string

    @IsNotEmptyObject()
    @Type(() => dataObjectDTO)
    data: UserObject | OrderObject | PaymentObject
}
