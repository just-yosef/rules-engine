import { Injectable, NotFoundException, } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IUserDocument, UserModel, } from "./user.model"
import { Model } from 'mongoose';
import bcrypt from "bcrypt"
import { UpdateUserDto } from './dtos';
@Injectable()
export class UsersService {
    constructor(@InjectModel(UserModel.name) private readonly User: Model<IUserDocument>) { }
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


}
