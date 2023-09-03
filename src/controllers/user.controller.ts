import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { handleError } from '../errors/handle.error';
import JWTTokenManager from '../manager/jwt_token.manager';
import UserModel from '../models/user.model';

const jwtTokenManager = new JWTTokenManager();

export default class UserController {
  constructor() {}

  //   -----------Register
  public async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, photoUrl, email, password, address, phoneNumber } =
        req.body;

      await Promise.resolve().then(async () => {
        const user = await UserModel.register(
          // UserModelInterface na create krle register ata error dito
          name,
          photoUrl,
          email,
          password,
          address,
          phoneNumber
        );

        const token = jwtTokenManager.createToken(user._id);

        res.status(200).json({ user, token });
      });
    } catch (error: unknown) {
      await handleError(error, res);
    }
  }

  //   ---------Login
  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      await Promise.resolve().then(async () => {
        const user = await UserModel.login(email, password); // UserModelInterface na create krle login ata error dito

        const token = jwtTokenManager.createToken(user._id);

        res.status(200).json({ user, token });
      });
    } catch (error) {
      await handleError(error, res);
    }
  }

  public async getAnUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?._id;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      if (id !== userId?.toString()) {
        res.status(403).json({ message: 'Forbidden' });
        return;
      }

      await Promise.resolve().then(async () => {
        const user = await UserModel.findById(id);

        res.status(200).json(user);
      });
    } catch (error) {
      await handleError(error, res);
    }
  }

  public async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      await Promise.resolve().then(async () => {
        const users = await UserModel.find({});

        res.status(200).json(users);
      });
    } catch (error) {
      await handleError(error, res);
    }
  }
}
