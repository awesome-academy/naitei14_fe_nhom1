export interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  userId: string;
  isSeen: boolean;
  link?: string;
}

export type NotificationCreate = Omit<Notification, "id">;
