import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { StorageService } from '../../services/storage.service';
import { GrowthEntry } from '../../models/growth-entry.model';
import { PositiveVibesComponent } from '../positive-vibes/positive-vibes.component';
import { SendVibeComponent } from '../send-vibe/send-vibe.component';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, PositiveVibesComponent, SendVibeComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('lineCanvas') lineCanvas!: ElementRef<HTMLCanvasElement>;

  today = '';
  todayEntry: GrowthEntry | undefined;
  weekEntries: GrowthEntry[] = [];
  recentEntries: GrowthEntry[] = [];

  weekStart = '';
  avgEnergy = 0;
  avgConfidence = 0;
  totalGratitude = 0;
  totalBoundaries = 0;
  totalLearning = 0;
  daysLogged = 0;

  encouragingMessage = '';
  private chart: Chart | null = null;

  private messages = [
    "You're doing enough. Growth doesn't have to be loud. 🌿",
    "Rest is productivity too. Your nervous system thanks you. 💙",
    "Every small step counts. You showed up — that's what matters. 🌱",
    "Being aware of yourself is already growth. 🌸",
    "You don't have to be perfect. You just have to keep going at your own pace. ✨",
    "Your journey is yours alone. Comparison steals joy. 🍃",
    "It's okay to have a low day. That's human. You're human. 🌤",
    "Boundaries are self-care. Every 'no' you said was a gift to yourself. 🛡️",
    "Learning from life is the gentlest kind of growth. 📖",
    "You don't need to earn rest. You deserve it just by existing. 🌙"
  ];

  constructor(private storage: StorageService) {}

  ngOnInit(): void {
    this.today = this.storage.getTodayString();
    this.weekStart = this.storage.getWeekStart();
    this.todayEntry = this.storage.getEntryByDate(this.today);
    this.weekEntries = this.storage.getEntriesForWeek(this.weekStart);
    this.recentEntries = this.storage.getEntriesForDateRange(
      this.getDateDaysAgo(13), this.today
    ).slice(-7);

    this.computeWeekStats();
    this.pickEncouragingMessage();
  }

  ngAfterViewInit(): void {
    if (this.recentEntries.length > 0) {
      this.buildChart();
    }
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  private computeWeekStats(): void {
    const entries = this.weekEntries;
    this.daysLogged = entries.length;
    if (entries.length === 0) return;
    this.avgEnergy = +(entries.reduce((s, e) => s + e.energy, 0) / entries.length).toFixed(1);
    this.avgConfidence = +(entries.reduce((s, e) => s + e.confidence, 0) / entries.length).toFixed(1);
    this.totalGratitude = entries.reduce((s, e) => s + e.gratitude.length, 0);
    this.totalBoundaries = entries.reduce((s, e) => s + e.boundariesSet.length, 0);
    this.totalLearning = entries.reduce((s, e) => s + e.learningMoments.length, 0);
  }

  private pickEncouragingMessage(): void {
    const day = new Date().getDay();
    this.encouragingMessage = this.messages[day % this.messages.length];
  }

  private buildChart(): void {
    const labels = this.recentEntries.map(e => {
      const d = new Date(e.date + 'T00:00:00');
      return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    });

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Energy',
            data: this.recentEntries.map(e => e.energy),
            borderColor: '#7cb9a8',
            backgroundColor: 'rgba(124,185,168,0.12)',
            fill: true,
            tension: 0.4,
            pointRadius: 5,
            pointHoverRadius: 7
          },
          {
            label: 'Confidence',
            data: this.recentEntries.map(e => e.confidence),
            borderColor: '#b39ddb',
            backgroundColor: 'rgba(179,157,219,0.12)',
            fill: true,
            tension: 0.4,
            pointRadius: 5,
            pointHoverRadius: 7
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { min: 0, max: 10, grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { stepSize: 2 } },
          x: { grid: { display: false } }
        },
        plugins: {
          legend: { position: 'top' },
          tooltip: { mode: 'index', intersect: false }
        }
      }
    };

    this.chart = new Chart(this.lineCanvas.nativeElement, config);
  }

  getMoodEmoji(mood: GrowthEntry['mood']): string {
    const map: Record<string, string> = {
      great: '✨', good: '😊', okay: '🌤', low: '🌧', 'rest-day': '🛌'
    };
    return map[mood] ?? '🌱';
  }

  vibesVisible = false;

  openVibes(): void {
    this.vibesVisible = true;
  }

  closeVibes(): void {
    this.vibesVisible = false;
  }

  sendVibeVisible = false;

  openSendVibe(): void {
    this.sendVibeVisible = true;
  }

  closeSendVibe(): void {
    this.sendVibeVisible = false;
  }

  private getDateDaysAgo(days: number): string {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString().split('T')[0];
  }

  formatDate(dateStr: string): string {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }
}

