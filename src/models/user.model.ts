import bcrypt from 'bcrypt';
import mongoose, { Schema, model } from 'mongoose';
import validator from 'validator';
import { UserModelInterface } from '../interfaces/user.interface';
import { User } from '../types/user.type';
export const userSchema = new Schema<User>(
  {
    name: {
      type: String,
      required: true,
    },
    photoUrl: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    role: {
      enum: ['user', 'admin'],
      default: 'user',
      type: String,
      required: true,
    },
    bookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
      },
    ],
    payments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// -----Register user
// userSchema er bitore manually akta register fn banacci call kre user krar jonno, and ata jar schema te create kra hbe sei model e create krte hbe,
userSchema.statics.register = async function (
  name,
  photoUrl,
  email,
  password,
  address,
  phoneNumber
): Promise<User> {
  // jodi agula na dey tahole error diye reject kri dibe
  if (!name || !photoUrl || !email || !password) {
    throw new Error('Must fill name, photoUrl, email and password');
  }

  // existing email - ekhane this dici karon model diye use krte hy schema but amra direct use krteci schema er bitore tai setar bitorei thakate this diye seta sei object kei referece krteci.
  const existingUser = await this.findOne({ email });

  // email already registared kina seta check krteci.
  if (existingUser) {
    throw new Error('Email already in use');
  }

  // validate email
  if (!validator.isEmail(email)) {
    throw new Error('Invalid email');
  }

  // is strong password
  if (!validator.isStrongPassword(password)) {
    throw new Error(
      'Password must be strong and include a combination of letters, numbers, and special characters.'
    );
  }

  // create salt 10 ta layer create krbe
  const salt = await bcrypt.genSalt(10);

  // encrypt password/hash
  const hash = await bcrypt.hash(password, salt);

  // create user
  const user = await this.create({
    name,
    photoUrl,
    email,
    password: hash,
    address,
    phoneNumber,
  });

  return user;
};

// -----Login user
userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw new Error('Must fill email and password');
  }

  // find user
  const user = await this.findOne({ email });

  if (!user) {
    throw new Error('Incorrect email or password'); //stratagy
  }
  // checking password
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new Error('Incorrect email or password');
  }

  return user;
};

const UserModel = model<User, UserModelInterface>('User', userSchema); //UserModelInterface jodi na create kre ekhane dukaitam tahole user.controal e use kra jaitona error dito

export default UserModel;
