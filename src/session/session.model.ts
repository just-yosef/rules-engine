import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Session {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ required: true })
    token: string;

    @Prop()
    ipAddress?: string;

    @Prop()
    userAgent?: string;

    @Prop({ type: Date })
    expiresAt?: Date;

    @Prop()
    location?: string;
}

export type SessionDocument = Session & Document;
export const SessionSchema = SchemaFactory.createForClass(Session);
