import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { GrowthEntry } from '../../models/growth-entry.model';

interface DaySummary {
  date: string;
  label: string;
  entry: GrowthEntry | undefined;
}

@Component({
  selector: 'app-weekly-summary',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './weekly-summary.component.html',
  styleUrl: './weekly-summary.component.scss'
})
export class WeeklySummaryComponent implements OnInit {
  weekStart = '';
  weekStartDate!: Date;
  today = '';
  entries: GrowthEntry[] = [];
  days: DaySummary[] = [];

  avgEnergy = 0;
  avgConfidence = 0;
  totalGratitude = 0;
  totalBoundaries = 0;
  totalLearning = 0;
  daysLogged = 0;

  allGratitude: string[] = [];
  allBoundaries: string[] = [];
  allLearning: string[] = [];

  summaryMessage = '';

  private messages = [
    "You showed up this week — that's everything. 🌱",
    "Whatever you managed this week is enough. Rest now. 🌙",
    "Growth isn't linear. Look how far you've come already. ✨",
    "You learned, felt, and kept going. That counts. 💙",
    "Your wins this week don't need to be big to matter. 🌸",
    "You set boundaries this week. That's strength, not selfishness. 🛡️",
    "Every day you showed up with honesty — that's the real work. 🍃",
    "You're not behind. You're exactly where you need to be. 🌤"
  ];

  constructor(private storage: StorageService) {}

  ngOnInit(): void {
    this.today = this.storage.getTodayString();
    this.weekStart = this.storage.getWeekStart();
    this.weekStartDate = new Date(this.weekStart + 'T00:00:00');
    this.entries = this.storage.getEntriesForWeek(this.weekStart);

    this.buildDays();
    this.computeStats();
    this.collectItems();
    this.pickMessage();
  }

  private buildDays(): void {
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    for (let i = 0; i < 7; i++) {
      const d = new Date(this.weekStartDate);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      this.days.push({
        date: dateStr,
        label: dayNames[i],
        entry: this.entries.find(e => e.date === dateStr)
      });
    }
  }

  private computeStats(): void {
    this.daysLogged = this.entries.length;
    if (this.entries.length === 0) return;
    this.avgEnergy = +(this.entries.reduce((s, e) => s + e.energy, 0) / this.entries.length).toFixed(1);
    this.avgConfidence = +(this.entries.reduce((s, e) => s + e.confidence, 0) / this.entries.length).toFixed(1);
    this.totalGratitude = this.entries.reduce((s, e) => s + e.gratitude.length, 0);
    this.totalBoundaries = this.entries.reduce((s, e) => s + e.boundariesSet.length, 0);
    this.totalLearning = this.entries.reduce((s, e) => s + e.learningMoments.length, 0);
  }

  private collectItems(): void {
    this.allGratitude = this.entries.flatMap(e => e.gratitude);
    this.allBoundaries = this.entries.flatMap(e => e.boundariesSet);
    this.allLearning = this.entries.flatMap(e => e.learningMoments);
  }

  private pickMessage(): void {
    const day = this.weekStartDate.getDay();
    this.summaryMessage = this.messages[day % this.messages.length];
  }

  getMoodEmoji(mood: GrowthEntry['mood']): string {
    const map: Record<string, string> = {
      great: '✨', good: '😊', okay: '🌤', low: '🌧', 'rest-day': '🛌'
    };
    return map[mood] ?? '—';
  }

  getWeekRange(): string {
    const end = new Date(this.weekStartDate);
    end.setDate(end.getDate() + 6);
    const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return `${this.weekStartDate.toLocaleDateString('en-US', opts)} – ${end.toLocaleDateString('en-US', opts)}`;
  }

  energyBarWidth(v: number): string { return `${v * 10}%`; }
}

