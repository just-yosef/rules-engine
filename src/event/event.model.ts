import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument, SchemaTypes } from "mongoose";
import { events } from "src/rules/constants";
import { UserObject, OrderObject, PaymentObject } from "./types";
@Schema()
export class Event {
    @Prop({
        type: String,
        required: true,
        validate: {
            validator: function (val: string) {
                return events.includes(val)
            },
            message: `Value Is Must Be [${events.map((event) => event + ",")}]`,
        },
    })
    eventName: string
    @Prop({ type: String, required: true })
    service: string;
    @Prop({ type: SchemaTypes.Mixed })
    data: UserObject | OrderObject | PaymentObject;
}
export type EventDocument = HydratedDocument<Event>


export const EventModel = SchemaFactory.createForClass(Event)