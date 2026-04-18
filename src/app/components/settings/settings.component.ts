import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../services/storage.service';
import { GoogleDriveService } from '../../services/google-drive.service';
import { ReminderService } from '../../services/reminder.service';
import { AppSettings } from '../../models/growth-entry.model';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {
  settings!: AppSettings;
  driveStatus = '';
  driveError = '';
  driveLoading = false;
  importError = '';
  importSuccess = '';
  settingsSaved = false;

  dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  constructor(
    private storage: StorageService,
    private drive: GoogleDriveService,
    private reminder: ReminderService
  ) {}

  ngOnInit(): void {
    this.settings = this.storage.getSettings();
    this.drive.setClientId(this.settings.googleClientId);
  }

  isDaySelected(day: number): boolean {
    return this.settings.reminderDays.includes(day);
  }

  toggleDay(day: number): void {
    const idx = this.settings.reminderDays.indexOf(day);
    if (idx >= 0) {
      this.settings.reminderDays.splice(idx, 1);
    } else {
      this.settings.reminderDays.push(day);
    }
  }

  async toggleReminders(): Promise<void> {
    if (this.settings.remindersEnabled) {
      const perm = await this.reminder.requestPermission();
      this.settings.notificationsPermission = perm;
      if (perm !== 'granted') {
        this.settings.remindersEnabled = false;
      }
    } else {
      this.reminder.clearReminders();
    }
  }

  saveSettings(): void {
    this.drive.setClientId(this.settings.googleClientId);
    this.storage.saveSettings(this.settings);
    this.reminder.scheduleReminders(this.settings);
    this.settingsSaved = true;
    setTimeout(() => this.settingsSaved = false, 2500);
  }

  async uploadToDrive(): Promise<void> {
    this.driveError = '';
    this.driveStatus = '';
    this.driveLoading = true;
    this.drive.setClientId(this.settings.googleClientId);
    try {
      const data = this.storage.exportData();
      await this.drive.uploadData(data);
      this.driveStatus = '✅ Backup uploaded to Google Drive successfully!';
    } catch (e: any) {
      this.driveError = `Upload failed: ${e.message}`;
    } finally {
      this.driveLoading = false;
    }
  }

  async downloadFromDrive(): Promise<void> {
    this.driveError = '';
    this.driveStatus = '';
    this.driveLoading = true;
    this.drive.setClientId(this.settings.googleClientId);
    try {
      const json = await this.drive.downloadData();
      this.storage.importData(json);
      this.driveStatus = '✅ Data restored from Google Drive successfully!';
    } catch (e: any) {
      this.driveError = `Download failed: ${e.message}`;
    } finally {
      this.driveLoading = false;
    }
  }

  downloadLocal(): void {
    const data = this.storage.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `growth-tracker-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  triggerFileInput(): void {
    document.getElementById('file-import')?.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.importError = '';
    this.importSuccess = '';
    if (!input.files?.length) return;
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        this.storage.importData(e.target?.result as string);
        this.importSuccess = '✅ Data imported successfully!';
        this.settings = this.storage.getSettings();
      } catch {
        this.importError = 'Invalid file format. Please use a file exported from this app.';
      }
    };
    reader.readAsText(file);
    input.value = '';
  }

  clearAllData(): void {
    if (confirm('This will permanently delete ALL your entries and settings. This cannot be undone. Are you sure?')) {
      localStorage.clear();
      this.settings = this.storage.getSettings();
      this.driveStatus = '';
      this.importSuccess = '';
    }
  }
}

