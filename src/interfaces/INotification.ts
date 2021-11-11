export interface INotification {
  _id: string;
  title: string;
  description: string;
  type: string;
  viewed: boolean;
  user: string;
  redirect?: string;
  createdAt: string;
}

export interface INotificationParams {
  user?: string;
  viewed?: boolean;
  page?: number;
  limit?: number;
  sort?: string;
}
