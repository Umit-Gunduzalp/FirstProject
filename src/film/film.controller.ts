import { FilmService } from './film.service';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { FilmDetails } from './film-details.interface';
import { ObjectId } from 'mongoose';
import { JwtGuard } from './../auth/guards/jwt.guard';

@Controller('film')
@UseGuards(JwtGuard)
export class FilmController {
  constructor(private filmService: FilmService) {}

  @Get('getFilms')
  getFilms(): Promise<FilmDetails[] | null> {
    return this.filmService.getList();
  }
}
