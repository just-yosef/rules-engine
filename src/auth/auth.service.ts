import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException, Req, Res, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomBytes } from 'crypto';
import { Model } from 'mongoose';
import { IUserRequiredProperties } from 'src/users/types';
import { IUserDocument, UserModel } from 'src/users/user.model';
import bcrypt from "bcrypt"
import { signJWT } from 'src/users/utils';
import type {
    Request,
    Response
} from 'express';
import { StringValue } from 'ms';
type signupBody = Pick<IUserRequiredProperties, "email" | "name" | "password">
type signinBody = Pick<IUserRequiredProperties, "email" | "password">

@Injectable()
export class AuthService {
    constructor(@InjectModel(UserModel.name) private readonly User: Model<IUserDocument>) { }

    async signup(data: signupBody) {
        try {
            const { name, email, password } = data;
            const existingUser = await this.User.findOne({ email });
            if (existingUser) throw new BadRequestException('Email already Exists')
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await this.User.create({
                name,
                email,
                password: hashedPassword,
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

    async signin(dto: signinBody) {
        try {
            const { email, password } = dto;
            const user = await this.User.findOne({ email }).lean();
            if (!user) {
                throw new NotFoundException('Invalid credentials');
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new UnauthorizedException('Invalid email or password');
            }
            const payload = { id: user._id, email: user.email };
            const token = signJWT(payload, { expiresIn: process.env.TOKEN_EXPIRATION! as StringValue })
            const refreshToken = signJWT(payload, { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION! as StringValue })
            return {
                token,
                refreshToken,
                user
            }
        } catch (error) {
            throw new HttpException(error, 400, { cause: error.message })
        }
    }

    async signout(@Res({ passthrough: true }) res: Response, @Req() req: Request) {
        res.clearCookie('jwt');
        res.clearCookie('refreshToken');

        return { message: 'Signed out successfully' };
    }
}
