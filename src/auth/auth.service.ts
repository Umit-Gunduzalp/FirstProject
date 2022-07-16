import { ExistingUserDTO } from './../user/dtos/existing-user.dto';
import { UserDetails } from './../user/interfaces/user-details.interface';
import { Injectable, HttpStatus, HttpException } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { NewUserDTO } from 'src/user/dtos/new-user.dto';

import { UserService } from './../user/user.service';
import { FilmService } from './../film/film.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private filmService: FilmService,
    private jwtService: JwtService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async register(user: Readonly<NewUserDTO>): Promise<UserDetails | any> {
    const { userName, gender, password, repassword, age, favoriteFilms } = user;

    const existingUser = await this.userService.findByUserName(userName);

    if (password != repassword)
      throw new HttpException(
        'Password and repassword must be the same!',
        HttpStatus.BAD_REQUEST,
      );

    if (existingUser)
      throw new HttpException(
        'An account with that user name already exists!',
        HttpStatus.CONFLICT,
      );

    let uncheckedFilms: string[] = [];

    for (let index = 0; index < favoriteFilms.length; index++) {
      const filmId = favoriteFilms[index];
      if (!(await this.filmService.checkFilmId(filmId))) {
        uncheckedFilms.push(filmId);
      }
    }

    if (uncheckedFilms.length > 0) {
      throw new HttpException(
        'No movies found with this IDs! (' + uncheckedFilms.join(', ') + ')',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await this.hashPassword(password);

    const newUser = await this.userService.create(
      userName,
      gender,
      hashedPassword,
      age,
      favoriteFilms,
    );
    return this.userService._getUserDetails(newUser);
  }

  async doesPasswordMatch(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async validateUser(
    userName: string,
    password: string,
  ): Promise<UserDetails | null> {
    const user = await this.userService.findByUserName(userName);
    const doesUserExist = !!user;

    if (!doesUserExist) return null;

    const doesPasswordMatch = await this.doesPasswordMatch(
      password,
      user.password,
    );

    if (!doesPasswordMatch) return null;

    return this.userService._getUserDetails(user);
  }

  async login(
    existingUser: ExistingUserDTO,
  ): Promise<{ token: string } | null> {
    const { userName, password } = existingUser;
    const user = await this.validateUser(userName, password);

    if (!user)
      throw new HttpException('Credentials invalid!', HttpStatus.UNAUTHORIZED);

    const jwt = await this.jwtService.signAsync({ user });
    return { token: jwt };
  }

  async verifyJwt(jwt: string): Promise<{ exp: number }> {
    try {
      const { exp } = await this.jwtService.verifyAsync(jwt);
      return { exp };
    } catch (error) {
      throw new HttpException('Invalid JWT', HttpStatus.UNAUTHORIZED);
    }
  }
}
