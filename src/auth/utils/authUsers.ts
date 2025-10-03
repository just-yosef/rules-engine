import jwt from 'jsonwebtoken';

export function decodeUserFromToken(token: string) {
    try {
        const decoded = jwt.verify(token, process.env.COOKIE_SECRET!);
        return decoded;
    } catch (err) {
        throw new Error('Invalid or expired token');
    }
}
