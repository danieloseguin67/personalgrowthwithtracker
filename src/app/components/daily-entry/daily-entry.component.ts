import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GrowthEntry } from '../../models/growth-entry.model';
import { StorageService } from '../../services/storage.service';
import { PositiveVibesComponent } from '../positive-vibes/positive-vibes.component';
import { LevelLabelPipe } from '../../pipes/level-label.pipe';

@Component({
  selector: 'app-daily-entry',
  standalone: true,
  imports: [CommonModule, FormsModule, PositiveVibesComponent, LevelLabelPipe],
  templateUrl: './daily-entry.component.html',
  styleUrl: './daily-entry.component.scss'
})
export class DailyEntryComponent implements OnInit {
  today = '';
  entry!: GrowthEntry;
  isEdit = false;
  saved = false;
  vibesVisible = false;

  newGratitude = '';
  newBoundary = '';
  newLearning = '';

  moods: { value: GrowthEntry['mood']; label: string; emoji: string }[] = [
    { value: 'great', label: 'Great', emoji: '✨' },
    { value: 'good', label: 'Good', emoji: '😊' },
    { value: 'okay', label: 'Okay', emoji: '🌤' },
    { value: 'low', label: 'Low', emoji: '🌧' },
    { value: 'rest-day', label: 'Rest Day', emoji: '🛌' },
  ];

  constructor(private storage: StorageService, private router: Router) {}

  ngOnInit(): void {
    this.today = this.storage.getTodayString();
    const existing = this.storage.getEntryByDate(this.today);
    if (existing) {
      this.entry = { ...existing, gratitude: [...existing.gratitude], boundariesSet: [...existing.boundariesSet], learningMoments: [...existing.learningMoments] };
      this.isEdit = true;
    } else {
      this.resetEntry();
    }
  }

  private resetEntry(): void {
    this.entry = {
      id: this.storage.generateId(),
      date: this.today,
      energy: 5,
      confidence: 5,
      gratitude: [],
      boundariesSet: [],
      learningMoments: [],
      notes: '',
      mood: 'okay',
      createdAt: new Date().toISOString()
    };
  }

  addGratitude(): void {
    const val = this.newGratitude.trim();
    if (val && this.entry.gratitude.length < 5) {
      this.entry.gratitude.push(val);
      this.newGratitude = '';
    }
  }

  removeGratitude(i: number): void { this.entry.gratitude.splice(i, 1); }

  addBoundary(): void {
    const val = this.newBoundary.trim();
    if (val && this.entry.boundariesSet.length < 5) {
      this.entry.boundariesSet.push(val);
      this.newBoundary = '';
    }
  }

  removeBoundary(i: number): void { this.entry.boundariesSet.splice(i, 1); }

  addLearning(): void {
    const val = this.newLearning.trim();
    if (val && this.entry.learningMoments.length < 5) {
      this.entry.learningMoments.push(val);
      this.newLearning = '';
    }
  }

  removeLearning(i: number): void { this.entry.learningMoments.splice(i, 1); }

  onKeyEnterGratitude(event: Event): void {
    const ke = event as KeyboardEvent;
    if (ke.key === 'Enter') { ke.preventDefault(); this.addGratitude(); }
  }
  onKeyEnterBoundary(event: Event): void {
    const ke = event as KeyboardEvent;
    if (ke.key === 'Enter') { ke.preventDefault(); this.addBoundary(); }
  }
  onKeyEnterLearning(event: Event): void {
    const ke = event as KeyboardEvent;
    if (ke.key === 'Enter') { ke.preventDefault(); this.addLearning(); }
  }

  setMood(mood: GrowthEntry['mood']): void {
    this.entry.mood = mood;
    if (mood === 'low' || mood === 'rest-day') {
      setTimeout(() => this.vibesVisible = true, 400);
    }
  }

  onEnergyChange(): void {
    if (this.entry.energy <= 3 && this.entry.confidence <= 3) {
      this.vibesVisible = true;
    }
  }

  energyLevels: { value: number; emoji: string; label: string; desc: string }[] = [
    { value: 2,  emoji: '🪫', label: 'Empty',  desc: 'Drained and foggy — hard to start anything' },
    { value: 4,  emoji: '😴', label: 'Low',    desc: 'Getting by, but everything feels heavy' },
    { value: 6,  emoji: '⚡', label: 'Steady', desc: 'Functional and okay — neither up nor down' },
    { value: 8,  emoji: '🌟', label: 'Good',   desc: 'Feeling alert and capable today' },
    { value: 10, emoji: '🚀', label: 'High',   desc: 'Clear, driven — fully in my element' },
  ];

  confidenceLevels: { value: number; emoji: string; label: string; desc: string }[] = [
    { value: 2,  emoji: '🌫️', label: 'Shaky',    desc: 'Self-doubt is loud — hard to trust myself' },
    { value: 4,  emoji: '🌱', label: 'Uncertain', desc: 'A bit wobbly, second-guessing things' },
    { value: 6,  emoji: '🌤️', label: 'Steady',    desc: 'I know what I\'m doing most of the time' },
    { value: 8,  emoji: '💪', label: 'Capable',   desc: 'I trust myself and feel grounded today' },
    { value: 10, emoji: '✨', label: 'Solid',     desc: 'Confident and clear — fully in my own corner' },
  ];

  setEnergy(value: number): void {
    this.entry.energy = value;
    if (value <= 3 && this.entry.confidence <= 3) {
      this.vibesVisible = true;
    }
  }

  setConfidence(value: number): void {
    this.entry.confidence = value;
    if (this.entry.energy <= 3 && value <= 3) {
      this.vibesVisible = true;
    }
  }

  openVibes(): void {
    this.vibesVisible = true;
  }

  closeVibes(): void {
    this.vibesVisible = false;
  }

  save(): void {
    this.storage.saveEntry(this.entry);
    this.saved = true;
    setTimeout(() => this.router.navigate(['/dashboard']), 1200);
  }
}

