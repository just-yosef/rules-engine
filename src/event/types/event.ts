import { EventType, ServicesType } from "src/rules/types";


type UserEventTypes =
    "user_registered" |
    "user_logged_in" |
    "user_updated" |
    "user_deleted";
type OrderEventTypes =
    "order_created" |
    "order_updated" |
    "order_paid" |
    "order_failed" |
    "order_shipped" |
    "order_cancelled"
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
    segment?: "vip" | "regular" | "new"
    status: 'active' | 'inactive' | 'banned';
}

export interface OrderItem {
    sku: string;
    qty: number;
    price: number;
}

export interface OrderObject {
    orderId: number;
    userId: number;
    totalAmount: number;
    currency: string;
    items: OrderItem[];
    status: 'created' | 'paid' | 'shipped' | 'cancelled' | 'failed';
    createdAt: string;
}

export interface PaymentObject {
    paymentId: number;
    orderId: number;
    userId: number;
    amount: number;
    currency: string;
    method: 'credit_card' | 'paypal' | 'bank_transfer';
    status: 'initiated' | 'success' | 'failed' | 'refunded';
    retryCount?: number;
    transactionId?: string;
}
// Commit
// feat(rules): Finish Rules Service And Controller
// feat(DB): Connecting MongoDb Database
export interface ProductObject {
    productId: number;
    sku: string;
    name: string;
    stockLevel: number;
    warehouse: string;
    status: 'in_stock' | 'out_of_stock' | 'reserved';
}