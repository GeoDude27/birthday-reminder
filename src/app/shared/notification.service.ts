import { Injectable } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private notification: NzNotificationService) {}

  showSuccess(message: string): void {
    this.notification.success('Success', message);
  }

  showError(message: string): void {
    this.notification.error('Error', message);
  }
}
