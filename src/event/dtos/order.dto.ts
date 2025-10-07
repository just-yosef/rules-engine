import {
    IsEnum,
    IsNumber,
    IsString,
    IsArray,
    ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { OrderItemDto } from "./index";
export class OrderDto {
    @IsNumber()
    orderId: number;

    @IsNumber()
    userId: number;

    @IsNumber()
    totalAmount: number;

    @IsString()
    currency: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[];

    @IsEnum(["created", "paid", "shipped", "cancelled", "failed"], {
        message: "status must be one of: created, paid, shipped, cancelled, failed",
    })
    status: "created" | "paid" | "shipped" | "cancelled" | "failed";

    @IsString()
    createdAt: string;
}
