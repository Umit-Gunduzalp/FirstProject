import { UserService } from './user.service';
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { UserDetails } from './interfaces/user-details.interface';
import { PersonDetails } from './interfaces/person-details.interface';
import { JwtGuard } from './../auth/guards/jwt.guard';
import { User } from './user.decorator';

@Controller('user')
@UseGuards(JwtGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('getUser')
  getUser(@Query('id') id: string): Promise<UserDetails | null> {
    return this.userService.findById(id);
  }

  @Get('getPeopleByFavoriteFilms')
  getPeopleByFavoriteFilms(@User() user): Promise<PersonDetails[] | null> {
    return this.userService.findByFavoriteFilmIds(user.id, user.favoriteFilms);
  }
}
