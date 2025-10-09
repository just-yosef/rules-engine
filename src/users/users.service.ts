import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IUserDocument, UserModel } from './user.model';
import { Model } from 'mongoose';
import bcrypt from 'bcrypt';
import { UpdateUserDto } from './dtos';
import { randomBytes } from 'crypto';
import { EmailsService } from 'src/emails/emails.service';
import { UserInRequest } from './types';
import { getUserIP } from 'src/auth/helpers';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { CacheKeys } from 'src/auth/constants';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserModel.name) private readonly User: Model<IUserDocument>,
    private readonly emailsService: EmailsService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) { }

  async findAll() {
    const cacheKey = 'users_all';
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;
    const users = await this.User.find();
    const result = users.length ? users : { message: 'No Users' };
    await this.cacheManager.set(cacheKey, result, 300);
    return result;
  }

  async findOne(id: string): Promise<UserInRequest> {
    const cacheKey = `user_${id}`;
    const cached: UserInRequest | undefined = await this.cacheManager.get(cacheKey);
    if (cached) return cached;
    const user = await this.User.findById(id);
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    await this.cacheManager.set(cacheKey, user, 300);
    return user;
  }

  async findUserByName(email: string): Promise<UserInRequest | undefined> {
    const cacheKey = `${CacheKeys.userByEmail}${email}`;
    const cached = await this.cacheManager.get<UserInRequest>(cacheKey);
    if (cached) return cached;
    const user = await this.User.findOne({ email });
    if (!user) throw new NotFoundException(`User with name: ${email} not found`);
    await this.cacheManager.set(cacheKey, user, 300);
    return user;
  }

  async updateUser(id: string, dto: Partial<UpdateUserDto>) {
    const updateQuery: any = {};
    if (dto.password) updateQuery.password = await bcrypt.hash(dto.password, 10);
    if (dto.name) updateQuery.name = dto.name;
    if (dto.status) updateQuery.status = dto.status;
    const updateOps: any = { $set: updateQuery };
    if (dto.roles && dto.roles.length > 0)
      updateOps.$addToSet = { roles: { $each: dto.roles } };
    const updatedUser = await this.User.findByIdAndUpdate(id, updateOps, { new: true });
    if (!updatedUser) throw new NotFoundException('User not found');
    await this.cacheManager.del(CacheKeys.users);
    await this.cacheManager.del(`${CacheKeys.userById}${id}`);
    await this.cacheManager.del(`${CacheKeys.userByEmail}${updatedUser.email}`);
    return updatedUser;
  }

  async verifyOtp(id: string, user: UserInRequest) {
    if (!user?.otp) return { message: "You don't have an OTP" };
    if (id !== user.otp) throw new UnauthorizedException('Invalid OTP provided');
    const userIP = await getUserIP();
    const updatedUser = await this.User.findByIdAndUpdate(
      user._id,
      { isVerify: true, $unset: { otp: '' }, ip: userIP, status: 'active' },
      { new: true },
    );
    if (!updatedUser) throw new BadRequestException('Something went wrong while verifying user');
    await this.cacheManager.del(`user_${user._id}`);
    await this.cacheManager.del(`user_email_${updatedUser.email}`);
    await this.cacheManager.del('users_all');
    return `${updatedUser.email} has been activated`;
  }

  async verifyUserById(id: string) {
    const otp = randomBytes(4).toString('hex');
    const updatedUser = await this.User.findByIdAndUpdate(
      id,
      { status: 'pending', otp },
      { new: true },
    );
    if (!updatedUser) throw new BadRequestException('User not found or update failed');
    await this.emailsService.sendEmail({
      toEmail: updatedUser?.email || 'test@email.com',
      message: `please verify your email /verify/${otp}`,
    });
    await this.cacheManager.del(`user_${id}`);
    await this.cacheManager.del(`user_email_${updatedUser.email}`);
    await this.cacheManager.del('users_all');
    return { message: 'please check your email.', user: updatedUser };
  }

  async verifyEmail(userId: string) {
    const otp = randomBytes(4).toString('hex');
    const user = await this.User.findByIdAndUpdate(userId, { otp }, { new: true });
    if (!user) throw new BadRequestException('User not found');
    await this.emailsService.sendEmail({
      toEmail: user.email,
      message: `please verify your email /verify/${otp}`,
    });
    await this.cacheManager.del(`user_${userId}`);
    await this.cacheManager.del(`user_email_${user.email}`);
    await this.cacheManager.del('users_all');
    return 'Check Your Email And Verify It By Clicking Link';
  }

  async blockUser(email: string) {
    const user = await this.findUserByName(email) as UserInRequest;
    await this.updateUser(user._id!, { status: 'blocked' });
    return user;
  }

  async deleteAllUsers() {
    const result = await this.User.deleteMany({});
    await this.cacheManager.clear();
    return { message: `Deleted ${result.deletedCount} users successfully` };
  }
}
