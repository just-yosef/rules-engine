import jwt from "jsonwebtoken"
import type { SignOptions, } from "jsonwebtoken"
export function signJWT(payload: any, options?: SignOptions) {
    return jwt.sign(payload, process.env.COOKIE_SECRET!, options)
}


export function verifyJWT(token: string) {
    return jwt.verify(token, process.env.COOKIE_SECRET!)
}