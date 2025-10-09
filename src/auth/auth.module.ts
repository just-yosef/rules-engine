import { forwardRef, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, UserSchema } from 'src/users/user.model';
import { IsLoggedIn } from './guards';
import { UsersModule } from 'src/users/users.module';
import { ExecludePassword, IsAdmin } from './interceptors';
import { EventModule } from 'src/event/event.module';
import { EmailsModule } from 'src/emails/emails.module';
import { SessionModule } from 'src/session/session.module';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }]),
    forwardRef(() => UsersModule),
    forwardRef(() => EventModule),
    EmailsModule,
    SessionModule
  ],
  providers: [AuthService, IsLoggedIn, IsAdmin, ExecludePassword],
  controllers: [AuthController],
  exports: [IsAdmin]
})
export class AuthModule {

}
