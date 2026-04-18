import { Injectable } from '@angular/core';
import { AppSettings } from '../models/growth-entry.model';

@Injectable({ providedIn: 'root' })
export class ReminderService {

  private timerId: ReturnType<typeof setInterval> | null = null;

  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) return 'denied';
    return Notification.requestPermission();
  }

  scheduleReminders(settings: AppSettings): void {
    this.clearReminders();
    if (!settings.remindersEnabled) return;

    // Check every minute whether it's time to show a notification
    this.timerId = setInterval(() => {
      const now = new Date();
      const day = now.getDay();
      const hhmm = now.toTimeString().slice(0, 5);

      if (settings.reminderDays.includes(day) && hhmm === settings.reminderTime) {
        this.showNotification();
      }
    }, 60_000);
  }

  clearReminders(): void {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  private showNotification(): void {
    if (Notification.permission !== 'granted') return;
    new Notification('🌱 Personal Growth Tracker', {
      body: "How are you feeling today? Take a moment to check in with yourself.",
      icon: '/favicon.ico',
      tag: 'pgt-daily-reminder'
    });
  }
}

