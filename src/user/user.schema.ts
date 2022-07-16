import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  userName: string;
  @Prop({ required: true })
  gender: string;
  @Prop({ required: true })
  password: string;
  @Prop({ required: true })
  age: number;
  @Prop({ required: true })
  favoriteFilms: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
