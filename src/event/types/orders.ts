
interface OrderItem {
    sku: string;
    qty: number;
    price: number;
}
type OrderStatus = 'created' | 'paid' | 'shipped' | 'cancelled' | 'failed'

interface OrderObject {
    orderId: number;
    userId: number;
    totalAmount: number;
    currency: string;
    items: OrderItem[];
    status: OrderStatus
    createdAt: string;
}

export type {
    OrderObject,
    OrderItem,
    OrderStatus
}