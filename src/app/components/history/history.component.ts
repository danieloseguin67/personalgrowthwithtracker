import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { GrowthEntry } from '../../models/growth-entry.model';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistoryComponent implements OnInit {
  entries: GrowthEntry[] = [];
  expanded: Set<string> = new Set();
  confirmDeleteId: string | null = null;

  constructor(private storage: StorageService) {}

  ngOnInit(): void {
    this.loadEntries();
  }

  private loadEntries(): void {
    this.entries = this.storage.getAllEntries()
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  toggle(id: string): void {
    if (this.expanded.has(id)) {
      this.expanded.delete(id);
    } else {
      this.expanded.add(id);
    }
  }

  isExpanded(id: string): boolean {
    return this.expanded.has(id);
  }

  confirmDelete(id: string): void {
    this.confirmDeleteId = id;
  }

  cancelDelete(): void {
    this.confirmDeleteId = null;
  }

  deleteEntry(id: string): void {
    this.storage.deleteEntry(id);
    this.confirmDeleteId = null;
    this.loadEntries();
  }

  getMoodEmoji(mood: GrowthEntry['mood']): string {
    const map: Record<string, string> = {
      great: '✨', good: '😊', okay: '🌤', low: '🌧', 'rest-day': '🛌'
    };
    return map[mood] ?? '🌱';
  }

  formatDate(dateStr: string): string {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }
}

