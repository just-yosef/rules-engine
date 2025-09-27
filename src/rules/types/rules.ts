export interface Rule {
    eventName: string;
    condition: string;
    action: Actions;
    status: RuleStatus;
}
export type ServicesType = "payments" | "orders" | "users"
export type Actions =
    | 'sendEmail'
    | 'sendSMS'
    | 'sendPush'
    | 'updateStatus'
    | 'applyDiscount'
    | 'addTag'
    | 'callWebhook'
    | 'sendToSlack'
    | 'generateReport'
    | 'queueJob'
    | 'retryPayment'
    | 'blockUser'
    | 'alertAdmin'
    | 'lockTransaction';
export type RuleStatus = 'active' | 'inactive' | 'draft' | 'archived';

export type EventType =
    // User Events
    | 'user_registered'
    | 'user_logged_in'
    | 'user_updated'
    | 'user_deleted'

    // Order Events
    | 'order_created'
    | 'order_updated'
    | 'order_paid'
    | 'order_failed'
    | 'order_shipped'
    | 'order_cancelled'

    // Payment Events
    | 'payment_initiated'
    | 'payment_success'
    | 'payment_failed'
    | 'refund_requested'
    | 'refund_processed'
