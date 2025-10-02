import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, UserSchema } from 'src/users/user.model';
import { IsAdmin } from './interceptors';
import { IsNeedRefreshToken } from './middlewares';
import { IsLoggedIn } from './guards';

@Module({
  providers: [AuthService, IsLoggedIn],
  controllers: [AuthController],
  imports: [MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }])],
})
export class AuthModule { }
