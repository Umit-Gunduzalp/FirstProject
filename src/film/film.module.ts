import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { FilmController } from './film.controller';
import { FilmSchema } from './film.schema';
import { FilmService } from './film.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Film', schema: FilmSchema }])],
  controllers: [FilmController],
  providers: [FilmService],
  exports: [FilmService],
})
export class FilmModule {}
