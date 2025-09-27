import { IsNumber, IsString, IsIn } from "class-validator";
import { type PaymentObject } from "../types";
import type { PaymentMethods, PaymentStatus } from "../types/event";
import { paymentStats } from "../constants";

type Payment = Pick<
    PaymentObject,
    "amount" | "currency" | "method" | "orderId" | "status" | "userId"
>;

export class PaymentDto implements Payment {
    @IsIn(["credit_card", "paypal", "bank_transfer"], {
        message: "Payment method must be one of: credit_card, paypal, or bank_transfer",
    })
    @IsString({ message: "Payment method must be a string" })
    method: PaymentMethods;
    @IsNumber({}, { message: "Payment ID must be a number" })
    paymentId: number;
    @IsNumber({}, { message: "Order ID must be a number" })
    orderId: number;
    @IsNumber({}, { message: "Amount must be a number" })
    amount: number;
    @IsString({ message: "User ID must be a string" })
    userId: string;
    @IsString({ message: "Currency must be a string (e.g., USD, EUR)" })
    currency: string;
    @IsIn(paymentStats, {
        message: `Status must be one of: ${paymentStats.join(", ")}`,
    })
    status: PaymentStatus;
}
