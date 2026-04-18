import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Vibe {
  category: 'quote' | 'affirmation' | 'breathe' | 'selfcare';
  icon: string;
  categoryLabel: string;
  text: string;
  subtext?: string;
}

@Component({
  selector: 'app-positive-vibes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './positive-vibes.component.html',
  styleUrl: './positive-vibes.component.scss'
})
export class PositiveVibesComponent implements OnChanges {
  @Input() visible = false;
  @Output() closed = new EventEmitter<void>();

  vibe!: Vibe;
  animating = false;

  private vibes: Vibe[] = [
    // Quotes
    { category: 'quote', icon: '💬', categoryLabel: 'A gentle reminder', text: 'You are not behind. You are not broken. You are a human having a human day.' },
    { category: 'quote', icon: '💬', categoryLabel: 'A gentle reminder', text: 'Rest is not giving up. Rest is how you keep going.' },
    { category: 'quote', icon: '💬', categoryLabel: 'A gentle reminder', text: 'Not every day will feel good, and that is perfectly okay. Feelings are weather, not truth.' },
    { category: 'quote', icon: '💬', categoryLabel: 'A gentle reminder', text: 'You have survived 100% of your hard days so far. Today counts too.' },
    { category: 'quote', icon: '💬', categoryLabel: 'A gentle reminder', text: 'Small steps still move you forward. Even the tiniest step counts.' },
    { category: 'quote', icon: '💬', categoryLabel: 'A gentle reminder', text: 'Being gentle with yourself during hard days is not weakness — it is wisdom.' },
    { category: 'quote', icon: '💬', categoryLabel: 'A gentle reminder', text: 'You do not have to be productive right now. You just have to exist, and that is enough.' },
    { category: 'quote', icon: '💬', categoryLabel: 'A gentle reminder', text: 'Low energy days are your body asking to be taken care of. Listen to it.' },
    { category: 'quote', icon: '💬', categoryLabel: 'A gentle reminder', text: 'The fact that you noticed how you feel today — that is already self-awareness. That is growth.' },

    // Affirmations
    { category: 'affirmation', icon: '🌸', categoryLabel: 'Say this to yourself', text: 'I am allowed to have a hard day without it defining me.' },
    { category: 'affirmation', icon: '🌸', categoryLabel: 'Say this to yourself', text: 'I am doing my best, and my best is enough for today.' },
    { category: 'affirmation', icon: '🌸', categoryLabel: 'Say this to yourself', text: 'I deserve rest. I deserve kindness. Especially from myself.' },
    { category: 'affirmation', icon: '🌸', categoryLabel: 'Say this to yourself', text: 'I am more than my productivity. My worth is not my output.' },
    { category: 'affirmation', icon: '🌸', categoryLabel: 'Say this to yourself', text: 'This feeling is temporary. It will pass, just like all the others did.' },
    { category: 'affirmation', icon: '🌸', categoryLabel: 'Say this to yourself', text: 'I choose to be patient with myself today.' },
    { category: 'affirmation', icon: '🌸', categoryLabel: 'Say this to yourself', text: 'I am growing even when I cannot see it.' },

    // Breathing exercises
    { category: 'breathe', icon: '🌬️', categoryLabel: 'Try this — box breathing', text: 'Breathe in for 4 counts... Hold for 4... Breathe out for 4... Hold for 4.', subtext: 'Repeat 3–4 times. This activates your parasympathetic nervous system and tells your body it\'s safe. 💙' },
    { category: 'breathe', icon: '🌬️', categoryLabel: 'Try this — 4-7-8 breath', text: 'Breathe in for 4 counts... Hold for 7... Slowly breathe out for 8.', subtext: 'Do this 2–3 times. It\'s one of the fastest ways to calm your nervous system. 🌊' },
    { category: 'breathe', icon: '🌬️', categoryLabel: 'Try this — soft belly breath', text: 'Place one hand on your belly. Breathe in slowly and let your belly rise. Breathe out and let it fall.', subtext: 'No counting needed. Just breathe into your belly, not your chest, for 1 minute. 🌿' },

    // Self-care nudges
    { category: 'selfcare', icon: '✨', categoryLabel: 'One small thing you could do', text: 'Drink a full glass of water right now. Slowly. Just that.' },
    { category: 'selfcare', icon: '✨', categoryLabel: 'One small thing you could do', text: 'Step outside for 5 minutes. Or just open a window. Fresh air is free medicine.' },
    { category: 'selfcare', icon: '✨', categoryLabel: 'One small thing you could do', text: 'Put on one song that feels like a warm hug. Let yourself just listen.' },
    { category: 'selfcare', icon: '✨', categoryLabel: 'One small thing you could do', text: 'Lie down for 10 minutes. You do not have to fall asleep. Just let your body rest flat.' },
    { category: 'selfcare', icon: '✨', categoryLabel: 'One small thing you could do', text: 'Text one person you love. It can be just "hi, thinking of you." Connection heals.' },
    { category: 'selfcare', icon: '✨', categoryLabel: 'One small thing you could do', text: 'Make yourself something warm to drink. Hold the cup in both hands and just feel the warmth.' },
    { category: 'selfcare', icon: '✨', categoryLabel: 'One small thing you could do', text: 'Write down one thing — no matter how small — that went okay today. It exists, even now.' },
    { category: 'selfcare', icon: '✨', categoryLabel: 'One small thing you could do', text: 'Unclench your jaw. Drop your shoulders. Unclench your hands. Your body holds stress before you notice.' },
  ];

  private usedIndexes: Set<number> = new Set();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible']?.currentValue === true) {
      this.pickVibe();
    }
  }

  pickVibe(): void {
    if (this.usedIndexes.size >= this.vibes.length) {
      this.usedIndexes.clear();
    }
    let idx: number;
    do { idx = Math.floor(Math.random() * this.vibes.length); }
    while (this.usedIndexes.has(idx));
    this.usedIndexes.add(idx);
    this.vibe = this.vibes[idx];
  }

  next(): void {
    this.animating = true;
    setTimeout(() => {
      this.pickVibe();
      this.animating = false;
    }, 220);
  }

  close(): void {
    this.closed.emit();
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('vibes-overlay')) {
      this.close();
    }
  }

  getCategoryClass(): string {
    return this.vibe?.category ?? '';
  }
}

