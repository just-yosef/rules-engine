
import { Type } from "class-transformer";
import { IsIn, IsNotEmptyObject, IsString, ValidateNested, } from "class-validator";
import type { Event, PaymentObject, UserObject } from "../types";
import { events } from "src/rules/constants";
import { UserDto } from "./user.dto";
import { OrderDto } from "./order.dto";
import { PaymentDto } from "./payment.dto";
import { OrderObject } from "src/types";
import { IsValidEvent } from "../decorators"
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
    @IsValidEvent()
    service: string

    @IsNotEmptyObject()
    @ValidateNested()
    @Type((c) => {
        const object = c?.object as EventDto;
        switch (object.service) {
            case "users":
                return UserDto
            case "orders":
                return OrderDto
            case "payments":
                return PaymentDto
            default:
                return Object
        }
    })
    data: UserDto | OrderDto | PaymentDto
}
