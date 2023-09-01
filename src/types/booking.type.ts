import { Document } from 'mongoose';
import { Payment } from './payment.type';
import { TourPackage } from './tour_package.type';
import { User } from './user.type';

export type Booking = {
  user: User;
  tourPackage: TourPackage;
  payment: Payment;
} & Document;
