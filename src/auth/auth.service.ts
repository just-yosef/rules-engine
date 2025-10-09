import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException, Req, Res, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUserRequiredProperties } from 'src/users/types';
import { IUserDocument, UserModel } from 'src/users/user.model';
import bcrypt from "bcrypt"
import { signJWT } from 'src/users/utils';
import type {
    Request,
    Response
} from 'express';
import ms, { StringValue } from 'ms';
import { UsersService } from 'src/users/users.service';
import { UnauthorizeException } from './exceptions/Unauthorize.exception';
import { EmailsService } from 'src/emails/emails.service';
import { EventService } from 'src/event/event.service';
import { setAuthCookies, setCookie } from './utils';
import { EventDto } from 'src/event/dtos/event.dto';
import { UserStatus } from 'src/event/users/types';
import { SessionService } from 'src/session/session.service';

import { extractUserInfo, getUserIP } from './helpers';
import { JWT_EXPIRESS_OPTIONS } from 'src/users/constants';
type signupBody = Pick<IUserRequiredProperties, "email" | "name" | "password">
type signinBody = Pick<IUserRequiredProperties, "email" | "password">

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(UserModel.name) private readonly User: Model<IUserDocument>,
        private readonly usersService: UsersService,
        private readonly emailService: EmailsService,
        private readonly eventService: EventService,
        private readonly sessionService: SessionService,
    ) { }

    async signup(data: signupBody) {
        try {
            const ip = await getUserIP();
            const { name, email, password } = data;
            const existingUser = await this.User.findOne({ email });
            if (existingUser) throw new BadRequestException('Email already Exists')
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await this.User.create({
                name,
                email,
                password: hashedPassword,
                ip
            });
            return user
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: error.message || "Unknown Error",
            }, HttpStatus.FORBIDDEN, {
                cause: error
            });
        }
    }

    async verifyActiveSession(userId: string) {
        const userSessions = await this.sessionService.getUserSessions(userId);
        if (userSessions.length > 1) {
            // remove all old sessions
            await this.sessionService.deleteSessionsByUserId(userId);
            // create new session
            const user = await this.usersService.findOne(userId)
            const ip = await getUserIP()
            const token = signJWT({ id: user._id, email: user.email, roles: user.roles, isVerify: user.isVerify }, {})
            const session = await this.sessionService.createSession({
                token,
                userId,
                ipAddress: ip,
                expiresAt: JWT_EXPIRESS_OPTIONS.expiresIn
            })
            return session
        }
    }

    async signin(dto: signinBody, req: Request, res: Response) {
        try {
            const { email, password } = dto;
            const user = await this.User.findOne({ email })
            if (!user) throw new NotFoundException('Invalid credentials')
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) throw new UnauthorizedException('Invalid email or password');
            const ip = await getUserIP()
            if (user.ip !== ip) {
                const country = await extractUserInfo(ip);
                await this.usersService.blockUser(user.email)
                const mail = { toEmail: user.email, message: `Someone In ${country.city} based in ${country.countryName} try to login with your account, we has suspend your account .. verify it and try to login again` }
                await this.emailService.sendEmail(mail);
                res.clearCookie("login-times")
                throw new BadRequestException("please check your email and try again")
            }
            const payload = { id: user._id, email: user.email, roles: user.roles, isVerify: user.isVerify };
            const token = signJWT(payload)
            const refreshToken = signJWT(payload, { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION! as StringValue })
            await this.sessionService.createSession({ token, userId: user._id, expiresAt: JWT_EXPIRESS_OPTIONS.expiresIn, ipAddress: ip })
            setAuthCookies(res, token, refreshToken);
            const mail = {
                message: `Your account has been created successfully. Please verify your email address to activate your account`,
                toEmail: user.email
            }
            const event: EventDto = {
                data: {
                    email,
                    userId: user._id,
                    status: user.status as UserStatus,
                }, service: "users", eventName: "user_logged_in"
            }
            await this.emailService.sendEmail(mail)
            await this.eventService.create(event);
            res.clearCookie("login-times")
            return {
                token,
                refreshToken,
                payload
            }
        } catch (error) {
            console.log(error);
        }
    }

    async signout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('jwt');
        res.clearCookie('refreshToken');
        res.clearCookie('login-times');
        return { message: 'Signed out successfully' };
    }
}
