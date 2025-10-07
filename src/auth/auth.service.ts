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
import { extractUserInfo, getUserIP } from './helpers';
type signupBody = Pick<IUserRequiredProperties, "email" | "name" | "password">
type signinBody = Pick<IUserRequiredProperties, "email" | "password">

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(UserModel.name) private readonly User: Model<IUserDocument>,
        private readonly usersService: UsersService,
        private readonly emailService: EmailsService,
        private readonly eventService: EventService,

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
            await user.save();
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

    async signin(dto: signinBody, req: Request, res: Response) {
        let loginTimes = req.cookies["login-times"] || 0;
        setCookie(res, ++loginTimes + "", "login-times", ms('10m'))
        if (loginTimes >= 10) {
            const user = await this.usersService.findUserByName(dto.email)
            await this.usersService.blockUser(user.email);
            await this.emailService.sendEmail({
                message: "Sorry You Try To Break Our DB, But Your Account Has Suspneded, Call Our Help Center",
                toEmail: user.email
            })
            throw new BadRequestException("Your Account Has Been Suspended")
        }
        const { email, password } = dto;
        const user = await this.User.findOne({ email })
        if (user?.status === "blocked") throw new BadRequestException("Your Account Has Been Blocked Please Call Help Center To Unblock, Thanks!")
        if (!user) throw new NotFoundException('Invalid credentials')
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }
        const ip = await getUserIP()
        if (user.ip !== ip) {
            const country = await extractUserInfo(ip);
            await this.usersService.blockUser(user.email)
            const mail = { toEmail: user.email, message: `Someone In ${country.city} based in ${country.countryName} try to login with your account, we has suspend your account .. verify it and try to login again` }
            await this.emailService.sendEmail(mail);
            throw new BadRequestException("please check your email and try again")
        }
        const payload = { id: user._id, email: user.email, roles: user.roles, isVerify: user.isVerify };
        const token = signJWT(payload, { expiresIn: process.env.TOKEN_EXPIRATION! as StringValue })
        const refreshToken = signJWT(payload, { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION! as StringValue })
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
        console.log("User Logged In And Event Created");

        return {
            token,
            refreshToken,
            payload
        }
    }

    async signout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('jwt');
        res.clearCookie('refreshToken');
        res.clearCookie('login-times');
        return { message: 'Signed out successfully' };
    }
}
