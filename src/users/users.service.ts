import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException, } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IUserDocument, UserModel, } from "./user.model"
import { Model } from 'mongoose';
import bcrypt from "bcrypt"
import { CreateUserDto, UpdateUserDto, UpdateVerifyDto, } from './dtos';
import { randomBytes, } from "crypto"
import { EmailsService } from 'src/emails/emails.service';
import { UnauthorizeException } from 'src/auth/exceptions/Unauthorize.exception';
import { UserInRequest } from './types';
import { getUserIP } from 'src/auth/helpers';


@Injectable()
export class UsersService {
    constructor(
        @InjectModel(UserModel.name) private readonly User: Model<IUserDocument>,
        private readonly emailsService: EmailsService,
    ) { }
    async findAll() {
        const users = await this.User.find();
        return users.length ? users : { message: "No Users" }
    }
    async findOne(id: string) {
        const user = await this.User.findById(id);
        if (!user) throw new NotFoundException(`User with id ${id} not found`);
        return user;
    }

    async findUserByName(email: string) {
        try {
            const user = await this.User.findOne({ email })
            if (!user) {
                throw new NotFoundException(`User with name: ${email} not found`);
            }
            return user;
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }
    async updateUser(id: string, dto: Partial<UpdateUserDto>) {
        const updateQuery: any = {};
        if (dto.password) {
            updateQuery.password = await bcrypt.hash(dto.password, 10);
        }
        if (dto.name) updateQuery.name = dto.name;
        if (dto.status) updateQuery.status = dto.status;
        const updateOps: any = { $set: updateQuery };
        if (dto.roles && dto.roles.length > 0) {
            updateOps.$addToSet = { roles: { $each: dto.roles } };
        }
        const updatedUser = await this.User.findByIdAndUpdate(id, updateOps, {
            new: true,
        });
        if (!updatedUser) {
            throw new NotFoundException('User not found');
        }
        return updatedUser;
    }
    async verifyOtp(id: string, user: UserInRequest) {
        if (!user?.otp) {
            return { message: "You don't have an OTP" };
        }

        if (id !== user.otp) {
            throw new UnauthorizedException("Invalid OTP provided");
        }

        const userIP = await getUserIP();
        const updatedUser = await this.User.findByIdAndUpdate(
            user._id,
            {
                isVerify: true,
                $unset: { otp: "" },
                ip: userIP,
                status: "active",
            },
            { new: true },
        );

        if (!updatedUser) {
            throw new BadRequestException("Something went wrong while verifying user");
        }

        return `${updatedUser.email} has been activated`;
    }

    // Update By Id
    async verifyUserById(id: string) {
        const otp = randomBytes(4).toString("hex")
        const updatedUser = await this.User.findByIdAndUpdate(
            id,
            {
                status: "pending",
                otp
            },
            { new: true }
        );
        if (!updatedUser) {
            throw new BadRequestException("User not found or update failed");
        }
        await this.emailsService.sendEmail({ toEmail: updatedUser?.email || "test@email.com", message: `please verify your email /verify/${otp}` })

        return {
            message: `please check your email.`,
            user: updatedUser,
        };
    }


    // Update By Id (for logged in user)
    async verifyEmail(userId: string) {
        try {
            const otp = randomBytes(4).toString("hex")
            const user = await this.User.findByIdAndUpdate(userId, { otp }, { new: true });
            await this.emailsService.sendEmail({ toEmail: user?.email || "test@email.com", message: `please verify your email /verify/${otp}` })
            return `Check Your Email And Verify It By Clicking Link`
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async blockUser(email: string,) {
        const user = await this.findUserByName(email);
        await this.updateUser(user._id, { status: "blocked" })
        return user
    }

    async deleteAllUsers() {
        const result = await this.User.deleteMany({});
        return { message: `Deleted ${result.deletedCount} users successfully` };
    }
}
