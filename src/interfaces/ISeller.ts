import { IUser } from './IUser';

export interface ISeller {
  _id: string;
  comission: number;
  maxDiscount: number;
  user: IUser;
}
