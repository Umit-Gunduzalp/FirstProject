import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';

export type FilmDocument = Film & Document;

@Schema()
export class Film {
  @Prop({ required: true })
  name: string;
}

export const FilmSchema = SchemaFactory.createForClass(Film);
