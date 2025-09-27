import { Actions, RuleStatus } from "src/rules/types";

export const RuleStatusArray: RuleStatus[] = [
    'active',
    'inactive',
    'draft',
    'archived',
];

export const ActionsArray: Actions[] = [
    'sendEmail',
    'sendSMS',
    'sendPush',
    'updateStatus',
    'applyDiscount',
    'addTag',
    'callWebhook',
    'sendToSlack',
    'generateReport',
    'queueJob',
    'retryPayment',
    'blockUser',
    'alertAdmin',
    'lockTransaction',
];


export const events = [
    'user_registered'
    , 'user_logged_in'
    , 'user_updated'
    , 'user_deleted'
    , 'order_created'
    , 'order_updated'
    , 'order_paid'
    , 'order_failed'
    , 'order_shipped'
    , 'order_cancelled'
    , 'payment_initiated'
    , 'payment_success'
    , 'payment_failed'
    , 'refund_requested'
    , 'refund_processed']
