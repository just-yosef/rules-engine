import { BadRequestException, Injectable, NotFoundException, } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IUserDocument, UserModel, } from "./user.model"
import { Model } from 'mongoose';
import bcrypt from "bcrypt"
import { UpdateUserDto, UpdateVerifyDto, } from './dtos';
import { randomBytes, } from "crypto"
import { EmailsService } from 'src/emails/emails.service';
import { UnauthorizeException } from 'src/auth/exceptions/Unauthorize.exception';

@Injectable()
export class UsersService {
    constructor(@InjectModel(UserModel.name) private readonly User: Model<IUserDocument>, private readonly emailsService: EmailsService) { }
    async findAll() {
        const users = await this.User.find();
        return users.length ? users : { message: "No Users" }
    }
    async findOne(id: string) {
        const user = await this.User.findById(id).lean()
        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
        return user;
    }
    async updateUser(id: string, dto: UpdateUserDto) {
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
    async verifyOtp(id: string, user: IUserDocument) {
        if (!user?.otp) return { message: "You Dont Have Otp" }
        if (user.otp && id !== user.otp) throw new UnauthorizeException("Please Verify Your Email With Your Own Data");
        const updatedUser = await this.User.findByIdAndUpdate(user._id, { isVerify: true, $unset: { otp: "" } }, { new: true });
        return `${updatedUser?.email} has been activated` || "Something Went Wrong"
    }
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
}
