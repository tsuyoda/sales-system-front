import React, { useState, useEffect, createContext, useContext } from 'react';
import { IAuthContextData, IAuthProviderProps } from '../interfaces/IAuth';
import { IUser, IUserLogin } from '../interfaces/IUser';
import api from '../services/api';

const AuthContext = createContext<IAuthContextData>({} as IAuthContextData);

function AuthProvider({ children }: IAuthProviderProps) {
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('@SalesSystem:user');
    const storedToken = localStorage.getItem('@SalesSystem:token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      api.defaults.headers.Authorization = `Bearer ${storedToken}`;
    }
  }, []);

  const signIn = async ({ username, password }: IUserLogin) => {
    const {
      data: { data }
    } = await api.post('/auth', { username, password });

    setUser(data.user);
    api.defaults.headers.Authorization = `Bearer ${data.token}`;

    localStorage.setItem('@SalesSystem:user', JSON.stringify(data.user));
    localStorage.setItem('@SalesSystem:token', data.token);
    localStorage.setItem('@SalesSystem:role', data.role.name);
  };

  const signOut = () => {
    setUser(null);

    localStorage.clear();
  };

  const signed = () => {
    const storedUser = localStorage.getItem('@SalesSystem:user');

    if (storedUser) {
      return true;
    }

    return false;
  };

  return <AuthContext.Provider value={{ user, signIn, signOut, signed }}>{children}</AuthContext.Provider>;
}

function useAuth() {
  return useContext(AuthContext);
}

export { AuthProvider, useAuth };
