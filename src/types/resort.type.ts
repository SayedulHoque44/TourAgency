import { Document } from 'mongoose';
import { Location } from './location.type';

export type Resort = {
  name: string;
  photoUrl: string;
  location: Location;
} & Document;
