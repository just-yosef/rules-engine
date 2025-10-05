import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, UserSchema } from 'src/users/user.model';
import { IsLoggedIn } from './guards';
import { UsersModule } from 'src/users/users.module';
import { IsAdmin } from './interceptors';
import { EventModule } from 'src/event/event.module';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }]),
    forwardRef(() => UsersModule),
    forwardRef(() => EventModule)

  ],
  providers: [AuthService, IsLoggedIn, IsAdmin,],
  controllers: [AuthController],

  exports: [IsAdmin]
})
export class AuthModule { }
