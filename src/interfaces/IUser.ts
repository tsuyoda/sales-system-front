export interface IRole {
  _id: string;
  name: string;
  description: string;
}

export interface IUser {
  _id: string;
  name: string;
  fullName: string;
  email: string;
  role: IRole;
  createdAt: string;
}

export interface IUserFilter {
  user_search_type: string;
  user_search_text: string;
  user_search_rule: string[];
}

export interface IUserFilterParams {
  email?: string;
  name?: string;
  role?: {
    name?: string[];
  };
  page?: number;
  limit?: number;
}
