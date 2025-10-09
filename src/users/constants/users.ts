import { StringValue } from "ms";

export const USER_ROLES = ["admin", "user", "guest", "child"] as const;
export type UserRole = typeof USER_ROLES[number];
export const USER_STATUS = ["active", "pending", "blocked"] as const;
export type UserStatus = typeof USER_STATUS[number];
export const USER_SEGMENTS = [
    "new_user",
    "loyal_customer",
    "vip",
    "churned",
    "guest"
] as const;
export type UserSegment = typeof USER_SEGMENTS[number];


export const USER_VALIDATION_MESSAGES = {
    EMAIL_REQUIRED: "Email is required and must be valid.",
    PASSWORD_REQUIRED: "Password is required and must be at least 6 characters.",
    ROLE_INVALID: `Role must be one of: ${USER_ROLES.join(", ")}`,
    STATUS_INVALID: `Status must be one of: ${USER_STATUS.join(", ")}`,
    SEGMENT_INVALID: `Segment must be one of: ${USER_SEGMENTS.join(", ")}`
};
export const JWT_EXPIRESS_OPTIONS = { expiresIn: process.env.TOKEN_EXPIRATION! as StringValue }
export const PASSWORD_MIN_LENGTH = 6;
export const MAX_FAILED_LOGIN_ATTEMPTS = 5;
export const JWT_ACCESS_EXPIRES_IN = '15m';
export const JWT_REFRESH_EXPIRES_IN = '7d';
