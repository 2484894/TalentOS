export interface Notification {
  id: number;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface UnreadCount {
  unreadCount: number;
}

