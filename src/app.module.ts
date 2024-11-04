import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { User, UserSchema } from './user/user.schema';
import { PostModule } from './post/post.module';


@Module({
  imports: [AuthModule,
    MongooseModule.forRoot('mongodb+srv://root:12345@cluster-1.zlhj2.mongodb.net/'),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PostModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
