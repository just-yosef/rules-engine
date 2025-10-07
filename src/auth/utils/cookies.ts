import { Response } from 'express';
import ms, { StringValue } from 'ms';

export function setAuthCookies(
    res: Response,
    token: string,
    refreshToken: string
) {
    setJwtCookie(res, token);
    setRefreshTokenCookie(res, refreshToken);
}

export function setJwtCookie(res: Response, token: string) {
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: ms(process.env.TOKEN_EXPIRATION! as StringValue),
    });
}

export function setRefreshTokenCookie(res: Response, refreshToken: string) {
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: ms(process.env.REFRESH_TOKEN_EXPIRATION! as StringValue),
    });
}

export function setCookie(res: Response, value: string, key: string, expiresIn: number) {
    res.cookie(key, value, {
        httpOnly: true,
        maxAge: expiresIn,
    });
}
