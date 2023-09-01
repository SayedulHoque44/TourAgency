import { Document } from 'mongoose';
import { Booking } from './booking.type';
import { User } from './user.type';

export type Payment = {
  user: User;
  booking: Booking;
} & Document;
