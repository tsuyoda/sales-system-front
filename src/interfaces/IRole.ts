import { IOption } from './IForm';

export interface IRoleFilterForm {
  role_name: string;
  role_resource: IOption;
  role_actions: IOption[];
}

export interface IRoleParams {
  page: number;
  limit: number;
}

export interface IRoleEditForm {
  role_name: string;
  resources: {
    actions: boolean[];
  }[];
}

export interface IResource {
  _id: string;
  name: string;
  translatedName: string;
  availableActions: string[];
}

export interface IPermission {
  actions: string[];
  resource: IResource;
}

export interface IRole {
  _id: string;
  name: string;
  description?: string;
  isAdmin?: boolean;
  permissions: IPermission[];
  createdAt: string;
}
