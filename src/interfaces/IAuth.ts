export interface IUser {
  id: string;
  name: string;
  email: string;
}

export interface IUserLogin {
  username: string;
  password: string;
}

export interface IAuthPermissions {
  [key: string]: {
    [key: string]: boolean;
  };
}

export interface IAuthContextData {
  user: IUser | null;
  loadingPermissions: boolean;
  permissions: any;
  signIn({ username, password }: IUserLogin): Promise<void>;
  signOut(): void;
  signed(): boolean;
  accessControl(action: string, resource: string): Promise<boolean>;
}

export interface IAuthProviderProps {
  children: React.ReactNode;
}
