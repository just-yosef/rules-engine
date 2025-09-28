import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IUserDocument, UserModel, } from "./user.model"
import { Model } from 'mongoose';
import bcrypt from "bcrypt"
import { randomBytes } from 'crypto';
import { IUserRequiredProperties } from './types';
import { signJWT } from './utils';
type signupBody = Pick<IUserRequiredProperties, "email" | "name" | "password">
type signinBody = Pick<IUserRequiredProperties, "email" | "password">
@Injectable()
export class UsersService {
    constructor(@InjectModel(UserModel.name) private readonly User: Model<IUserDocument>) { }
    async findAll() {
        const users = await this.User.find();
        console.log(randomBytes(16).toString("hex"));
        return users.length ? users : { message: "No Users" }
    }
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
            return user;
        } catch (error) {
            console.log(error);
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
            const user = await this.User.findOne({ email });
            if (!user) {
                throw new NotFoundException('Invalid credentials');
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new UnauthorizedException('Invalid email or password');
            }
            const payload = { id: user._id, email: user.email };
            const token = signJWT(payload, { expiresIn: "24h"})
            const refreshToken = signJWT(payload, { expiresIn: "7d"})
            return {
                token,
                refreshToken,
                user
            }
        } catch (error) {
            throw new HttpException(error, 400, { cause: error.message })
        }
    }

}
