export interface IUser {
  id: string;
  name: string;
  email: string;
}

export interface IUserLogin {
  username: string;
  password: string;
}

export interface IAuthContextData {
  user: IUser | null;
  signIn({ username, password }: IUserLogin): Promise<void>;
  signOut(): void;
  signed(): boolean;
}

export interface IAuthProviderProps {
  children: React.ReactNode;
}
