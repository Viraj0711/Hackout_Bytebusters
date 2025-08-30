import toast from 'react-hot-toast';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

class NotificationService {
  private notifications: Notification[] = [];
  private listeners: ((notifications: Notification[]) => void)[] = [];

  // Toast notifications
  success(message: string, title?: string) {
    toast.success(message);
    this.addNotification('success', title || 'Success', message);
  }

  error(message: string, title?: string) {
    toast.error(message);
    this.addNotification('error', title || 'Error', message);
  }

  warning(message: string, title?: string) {
    toast(message, { icon: '⚠️' });
    this.addNotification('warning', title || 'Warning', message);
  }

  info(message: string, title?: string) {
    toast(message, { icon: 'ℹ️' });
    this.addNotification('info', title || 'Info', message);
  }

  // Persistent notifications
  private addNotification(type: Notification['type'], title: string, message: string) {
    const notification: Notification = {
      id: Date.now().toString(),
      type,
      title,
      message,
      timestamp: new Date(),
      read: false
    };
    
    this.notifications.unshift(notification);
    this.notifications = this.notifications.slice(0, 50); // Keep only recent 50
    this.notifyListeners();
  }

  getNotifications(): Notification[] {
    return this.notifications;
  }

  markAsRead(id: string) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.notifyListeners();
    }
  }

  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.notifyListeners();
  }

  deleteNotification(id: string) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notifyListeners();
  }

  clearAll() {
    this.notifications = [];
    this.notifyListeners();
  }

  subscribe(listener: (notifications: Notification[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.notifications));
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }
}

export const notificationService = new NotificationService();