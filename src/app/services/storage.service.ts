import { Injectable } from '@angular/core';
import { GrowthEntry, AppSettings } from '../models/growth-entry.model';

const ENTRIES_KEY = 'pgt_entries';
const SETTINGS_KEY = 'pgt_settings';

@Injectable({ providedIn: 'root' })
export class StorageService {

  private defaultSettings: AppSettings = {
    remindersEnabled: false,
    reminderTime: '20:00',
    reminderDays: [1, 2, 3, 4, 5],
    googleClientId: '',
    theme: 'sage',
    notificationsPermission: 'default'
  };

  // ── Entries ──────────────────────────────────────────────────────────────

  getAllEntries(): GrowthEntry[] {
    const raw = localStorage.getItem(ENTRIES_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  getEntryByDate(date: string): GrowthEntry | undefined {
    return this.getAllEntries().find(e => e.date === date);
  }

  getEntriesForWeek(weekStart: string): GrowthEntry[] {
    const start = new Date(weekStart);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    return this.getAllEntries().filter(e => {
      const d = new Date(e.date);
      return d >= start && d <= end;
    });
  }

  getEntriesForDateRange(startDate: string, endDate: string): GrowthEntry[] {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return this.getAllEntries().filter(e => {
      const d = new Date(e.date);
      return d >= start && d <= end;
    }).sort((a, b) => a.date.localeCompare(b.date));
  }

  saveEntry(entry: GrowthEntry): void {
    const entries = this.getAllEntries();
    const idx = entries.findIndex(e => e.id === entry.id);
    if (idx >= 0) {
      entries[idx] = entry;
    } else {
      entries.push(entry);
    }
    localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
  }

  deleteEntry(id: string): void {
    const entries = this.getAllEntries().filter(e => e.id !== id);
    localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
  }

  // ── Settings ─────────────────────────────────────────────────────────────

  getSettings(): AppSettings {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...this.defaultSettings, ...JSON.parse(raw) } : { ...this.defaultSettings };
  }

  saveSettings(settings: AppSettings): void {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }

  // ── Import / Export ───────────────────────────────────────────────────────

  exportData(): string {
    return JSON.stringify({
      entries: this.getAllEntries(),
      settings: this.getSettings(),
      exportedAt: new Date().toISOString(),
      version: '1.0'
    }, null, 2);
  }

  importData(json: string): boolean {
    const data = JSON.parse(json);
    if (!data.entries || !Array.isArray(data.entries)) {
      throw new Error('Invalid data format');
    }
    localStorage.setItem(ENTRIES_KEY, JSON.stringify(data.entries));
    if (data.settings) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(data.settings));
    }
    return true;
  }

  generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }

  getTodayString(): string {
    return new Date().toISOString().split('T')[0];
  }

  getWeekStart(date: Date = new Date()): string {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday start
    d.setDate(diff);
    return d.toISOString().split('T')[0];
  }
}
