import jwt from "jsonwebtoken"
import type { JwtPayload, SignOptions, } from "jsonwebtoken"

export function signJWT(payload: any, options?: SignOptions) {
    return jwt.sign(payload, process.env.COOKIE_SECRET!, options)
}


export function verifyJWT(token: string) {
    return jwt.verify(token, process.env.COOKIE_SECRET!)
}

export function decodeJWT<T = JwtPayload>(token: string): T | null {
    try {
        const decoded = jwt.decode(token);
        return decoded as T;
    } catch (error) {
        console.error('Invalid JWT:', error);
        return null;
    }
}