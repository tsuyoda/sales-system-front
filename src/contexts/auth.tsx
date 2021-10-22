import React, { useState, useEffect, createContext, useContext } from 'react';
import { toast } from 'react-toastify';
import { IAuthContextData, IAuthProviderProps, IUser, IUserLogin } from '../interfaces/IAuth';
import { IPermission, IResource } from '../interfaces/IRole';

import api from '../services/api';

const AuthContext = createContext<IAuthContextData>({} as IAuthContextData);

function AuthProvider({ children }: IAuthProviderProps) {
  const [user, setUser] = useState<IUser | null>(null);
  const [permissions, setPermissions] = useState<any | null>();
  const [loadingPermissions, setLoadingPermissions] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem('@SalesSystem:user') || '{}');
    const storedToken = sessionStorage.getItem('@SalesSystem:token');

    if (storedUser && storedToken) {
      setUser(storedUser);
      api.defaults.headers.Authorization = `Bearer ${storedToken}`;
    }

    setLoading(false);
  }, []);

  const accessControl = async (action: string, resource: string): Promise<boolean> => {
    const response = await api.get('user/my_profile');

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

    api.get(`/resource`).then(response => {
      const { data: resources } = response.data;

      const permissionsPromises = resources.map(async (resource: IResource) => {
        const actionsPromises = resource.availableActions.map(async action => {
          const permission = await accessControl(action, resource.name);

          return [action, permission];
        });

        const actions = Object.fromEntries(await Promise.all(actionsPromises));

        return [resource.name, actions];
      });

      Promise.all(permissionsPromises).then((grants: any[]) => {
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
    <AuthContext.Provider value={{ user, signIn, signOut, signed, accessControl, loadingPermissions, permissions }}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  return useContext(AuthContext);
}

export { AuthProvider, useAuth };
