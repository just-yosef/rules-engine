import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, UserSchema } from 'src/users/user.model';
import { IsAdmin } from './interceptors';
import { IsNeedRefreshToken } from './middlewares';
import { IsLoggedIn } from './guards';
import { UsersModule } from 'src/users/users.module';

@Module({
  providers: [AuthService, IsLoggedIn],
  controllers: [AuthController],
  imports: [MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }]),
  forwardRef(() => UsersModule)
  ],
})
export class AuthModule { }
