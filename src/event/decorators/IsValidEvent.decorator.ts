import { registerDecorator, ValidationOptions, ValidationArguments } from "class-validator";
import { EventDto } from "../dtos/event.dto";
import { orderEvents, paymentEvents, userEvents } from "../constants";

export function IsValidEvent(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "isValidEvent",
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate(_: any, args: ValidationArguments) {
                    const { eventName, service } = args.object as EventDto;
                    if (orderEvents.includes(eventName) && service !== "orders") return false;
                    if (paymentEvents.includes(eventName) && service !== "payments") return false;
                    if (userEvents.includes(eventName) && service !== "users") return false;
                    return true;
                },
                defaultMessage(args: ValidationArguments) {
                    const { eventName, service } = args.object as EventDto;
                    return `eventName "${eventName}" does not match service "${service}"`;
                },
            },
        });
    };
}
