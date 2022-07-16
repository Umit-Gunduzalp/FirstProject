import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model, ObjectId } from 'mongoose';
import { FilmDetails } from './film-details.interface';

import { FilmDocument } from './film.schema';

@Injectable()
export class FilmService {
  constructor(
    @InjectModel('Film') private readonly filmModel: Model<FilmDocument>,
  ) {}

  _getFilmDetails(films: FilmDocument[]): FilmDetails[] {
    let result: FilmDetails[] = [];

    films.forEach((film) => {
      result.push({
        id: film._id,
        name: film.name,
      });
    });

    return result;
  }

  async getList(): Promise<FilmDetails[] | null> {
    const films = await this.filmModel.find().exec();
    if (!films) return null;
    return this._getFilmDetails(films);
  }

  async checkFilmId(id: string): Promise<boolean | null> {
    const film = await this.filmModel.findById(id).exec();
    return film != null;
  }
}
