import React, { useState, useEffect, createContext, useContext } from 'react';
import { toast } from 'react-toastify';
import io, { Socket } from 'socket.io-client';
import { IAuthContextData, IAuthProviderProps, IUser, IUserLogin } from '../interfaces/IAuth';
import { IPermission, IResource } from '../interfaces/IRole';

import api from '../services/api';

const AuthContext = createContext<IAuthContextData>({} as IAuthContextData);

function AuthProvider({ children }: IAuthProviderProps) {
  const [user, setUser] = useState<IUser | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [permissions, setPermissions] = useState<any | null>();
  const [loadingPermissions, setLoadingPermissions] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem('@SalesSystem:user') || '{}');
    const storedToken = sessionStorage.getItem('@SalesSystem:token');

    if (storedUser && storedToken) {
      console.log('render');
      if (socket?.connected) socket.disconnect();
      setSocket(
        io('http://localhost:7777', {
          query: { token: storedToken }
        })
      );

      setUser(storedUser);
      api.defaults.headers.Authorization = `Bearer ${storedToken}`;
    }

    setLoading(false);

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  const accessControl = async (action: string, resource: string): Promise<boolean> => {
    const response = await api.get('/profile');

    const { data: userData } = response.data;

    if (userData.role.isAdmin) {
      return true;
    }

    if (!userData.role.permissions) {
      return false;
    }

    return userData.role.permissions
      .map((permission: IPermission) => permission.resource.name === resource && permission.actions.includes(action))
      .some((granted: boolean) => granted);
  };

  useEffect(() => {
    if (!user) {
      setPermissions(null);
      setLoadingPermissions(false);
      return;
    }

    setLoadingPermissions(true);

    api.get(`/resource`, { params: { limit: 1000 } }).then(response => {
      const { data: resources } = response.data;

      const permissionsPromises = resources.map(async (resource: IResource) => {
        const actionsPromises = resource.availableActions.map(async action => {
          const permission = await accessControl(action, resource.name);

          return [action, permission];
        });

        const actions = Object.fromEntries(await Promise.all(actionsPromises));

        return [resource.name, actions];
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Promise.all(permissionsPromises).then((grants: any[]) => {
        console.log(Object.fromEntries(grants));
        setPermissions(Object.fromEntries(grants));
        setLoadingPermissions(false);
      });
    });
  }, [user]);

  const signIn = async ({ username, password }: IUserLogin) => {
    const {
      data: { data }
    } = await api.post('/auth', { username, password });

    sessionStorage.setItem('@SalesSystem:user', JSON.stringify(data.user));
    sessionStorage.setItem('@SalesSystem:token', data.token);

    api.defaults.headers.Authorization = `Bearer ${data.token}`;
    setUser(data.user);

    if (socket?.connected) socket.disconnect();
    setSocket(
      io('http://localhost:7777', {
        query: { token: data.token }
      })
    );
  };

  const signOut = () => {
    setUser(null);

    sessionStorage.clear();

    toast.success('Desconectado com sucesso!');
  };

  const signed = () => {
    if (user) {
      return true;
    }

    return false;
  };

  return (
    <AuthContext.Provider
      value={{ user, socket, signIn, signOut, signed, accessControl, loadingPermissions, permissions }}
    >
      {loading ? null : children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  return useContext(AuthContext);
}

export { AuthProvider, useAuth };
