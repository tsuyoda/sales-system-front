import { toast } from 'react-toastify';

export class WebNotificationService {
  public permission = 'Notification' in window ? Notification.permission : 'denied';

  private hasNotification = 'Notification' in window;

  private icon = '../assets/logo.png';

  public requestPermission = () => {
    if (!this.hasNotification) {
      toast.error('Esse navegador não suporta notificações desktop');
    } else {
      Notification.requestPermission();
    }
  };

  public newNotification(title: string, description?: string, options?: NotificationOptions, onClick?: () => void) {
    if (this.hasNotification) {
      if (Notification?.permission === 'denied') return;
      const n = new Notification(title, {
        ...options,
        ...{ icon: this.icon, silent: true, body: description || '', tag: title, renotify: true }
      });
      if (onClick) n.onclick = onClick;
    }
  }
}

const webNotificationService = new WebNotificationService();
export default webNotificationService;
