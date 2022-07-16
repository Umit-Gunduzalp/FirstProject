import { Inject, Injectable, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model, ObjectId } from 'mongoose';
import { PersonDetails } from './interfaces/person-details.interface';
import { UserDetails } from './interfaces/user-details.interface';

import { UserDocument } from './user.schema';

import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  _getUserDetails(user: UserDocument): UserDetails {
    return {
      id: user._id,
      userName: user.userName,
      gender: user.gender,
      age: user.age,
      favoriteFilms: user.favoriteFilms,
    };
  }

  _getPeopleDetails(people: UserDocument[]): PersonDetails[] {
    let result: PersonDetails[] = [];

    people.forEach((person) => {
      result.push({
        id: person._id,
        userName: person.userName,
        gender: person.gender,
        age: person.age,
      });
    });

    return result;
  }

  async findByUserName(userName: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ userName }).exec();
  }

  async findById(id: string): Promise<UserDetails | null> {
    const user = await this.userModel.findById(id).exec();
    if (!user) return null;
    return this._getUserDetails(user);
  }

  async findByFavoriteFilmIds(
    userId: string,
    filmIds: string[],
  ): Promise<PersonDetails[] | null> {
    const people = await this.userModel
      .find({ _id: { $ne: userId }, favoriteFilms: { $in: filmIds } })
      .exec();
    if (!people) return null;
    return this._getPeopleDetails(people);
  }

  async create(
    userName: string,
    gender: string,
    hashedPassword: string,
    age: number,
    favoriteFilms: string[],
  ): Promise<UserDocument> {
    const newUser = new this.userModel({
      userName,
      gender,
      password: hashedPassword,
      age,
      favoriteFilms,
    });
    return newUser.save();
  }
}
