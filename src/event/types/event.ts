import { EventType } from "src/rules/types";
import { UserSegment, UserStatus } from "../users/types";
import { OrderStatus, } from "./index";

type OrderEventTypes =
    "order_created" |
    "order_updated" |
    "order_paid" |
    "order_failed" |
    "order_shipped" |
    "order_cancelled"
type UserEventTypes =
    "user_registered" |
    "user_logged_in" |
    "user_updated" |
    "user_deleted";

type PaymentEventTypes =
    "payment_initiated" | "payment_success" | "payment_failed" | "refund_requested" | "refund_processed"

interface ContextType {
    systemDate: Date;
    ip: string
}
export interface Event<
    T extends EventType = EventType,
> {
    event: T extends UserEventTypes ? UserEventTypes : T extends OrderEventTypes ? OrderEventTypes : PaymentEventTypes;
    service: T extends UserEventTypes ? "users" : T extends OrderEventTypes ? "orders" : "payments"
    data: T extends UserEventTypes ? UserObject : T extends OrderEventTypes ? OrderObject : PaymentObject
    context?: ContextType
}
export interface UserObject {
    userId: string;
    email: string;
    phone?: string;
    name?: string;
    age?: number;
    segment?: UserSegment
    status: UserStatus
}

export interface OrderObject {
    orderId: number;
    userId: string;
    products: ProductObject[];
    currency: string;
    status: OrderStatus;
    createdAt: Date;
    updatedAt?: Date;
    shippingAddress?: string;
    billingAddress?: string;
    notes?: string;
}

export type PaymentStatus = 'initiated' | 'success' | 'failed' | 'refunded';
export type PaymentMethods = 'credit_card' | 'paypal' | 'bank_transfer'

export interface PaymentObject {
    paymentId: number;
    orderId: number;
    userId: string;
    amount: number;
    currency: string;
    method: PaymentMethods
    status: PaymentStatus
    retryCount?: number;
    transactionId?: string;
}
type ProductStatus = 'in_stock' | 'out_of_stock' | 'reserved'

export interface ProductObject {
    productId: number;
    sku: string;
    name: string;
    stockLevel: number;
    warehouse: string;
    status: ProductStatus;
}