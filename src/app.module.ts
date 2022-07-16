import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { FilmModule } from './film/film.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      'mongodb+srv://admin:T5PmrlSqTnX5O1Xi@cluster0.tr9n43m.mongodb.net/UmitMovieDb?retryWrites=true&w=majority',
    ),
    AuthModule,
    UserModule,
    FilmModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
