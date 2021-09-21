import { IUser, IUserLogin } from './IUser';

export interface IAuthContextData {
  user: IUser | null;
  signIn({ username, password }: IUserLogin): Promise<void>;
  signOut(): void;
  signed(): boolean;
}

export interface IAuthProviderProps {
  children: React.ReactNode;
}
