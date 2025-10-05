import { forwardRef, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, UserSchema } from "./user.model";
import { IsNeedRefreshToken } from 'src/auth/middlewares';
import { AuthModule } from 'src/auth/auth.module';
import { EmailsModule } from 'src/emails/emails.module';
import { RateLimiterModule } from 'nestjs-rate-limiter';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }]),
    forwardRef(() => AuthModule),
    EmailsModule,
    RateLimiterModule.register({
      type: 'Memory',
      points: 5,
      duration: 10,
      blockDuration: 60
    })
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IsNeedRefreshToken).forRoutes({
      path: 'users/*',
      method: RequestMethod.ALL,
    });
  }
}
