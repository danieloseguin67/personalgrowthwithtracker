import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface PraiseType {
  id: string;
  emoji: string;
  label: string;
  subject: string;
  body: (recipientName: string) => string;
}

@Component({
  selector: 'app-send-vibe',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './send-vibe.component.html',
  styleUrl: './send-vibe.component.scss'
})
export class SendVibeComponent implements OnChanges {
  @Input() visible = false;
  @Output() closed = new EventEmitter<void>();

  senderName = '';
  recipientName = '';
  recipientEmail = '';
  selectedPraiseId = '';
  customMessage = '';
  step: 'pick' | 'compose' = 'pick';
  sent = false;

  praiseTypes: PraiseType[] = [
    {
      id: 'appreciate',
      emoji: '🙏',
      label: 'I appreciate you',
      subject: 'Just wanted you to know — I appreciate you',
      body: (name) =>
        `Hey ${name},\n\nI just wanted to take a moment to tell you how much I appreciate you.\n\nYou might not always hear it, but the way you show up — for yourself, for the people around you — it really means something. I notice it, and I'm grateful for it.\n\nThank you for being you. 💛\n\nWith warmth,`
    },
    {
      id: 'proud',
      emoji: '🌟',
      label: "I'm proud of you",
      subject: "I'm genuinely proud of you",
      body: (name) =>
        `Hey ${name},\n\nI've been thinking about you and I just want to say — I'm really proud of you.\n\nThe effort you put in, the way you keep going even when things are hard — it doesn't go unnoticed. You're doing better than you think.\n\nKeep going. I'm cheering for you. 🌟\n\nWith love,`
    },
    {
      id: 'inspire',
      emoji: '✨',
      label: 'You inspire me',
      subject: 'You inspire me more than you know',
      body: (name) =>
        `Hey ${name},\n\nI just had to tell you — you inspire me.\n\nThe way you live, think, and care about things genuinely makes me want to be better too. You probably don't realise the ripple effect you have on the people around you.\n\nThank you for that. ✨\n\nWith admiration,`
    },
    {
      id: 'smile',
      emoji: '😊',
      label: 'You make me smile',
      subject: 'You make my day brighter',
      body: (name) =>
        `Hey ${name},\n\nJust a little note to say — you make me smile. 😊\n\nThinking of you today and wanted to send some warmth your way. Hope your day is as good as you make mine.\n\nSending you good vibes,`
    },
    {
      id: 'strongerthanuthink',
      emoji: '💪',
      label: 'You are stronger than you think',
      subject: "You're stronger than you think",
      body: (name) =>
        `Hey ${name},\n\nI know things haven't been easy lately, and I just want you to hear this: you are so much stronger than you give yourself credit for.\n\nThe fact that you keep going, keep trying, keep caring — that takes real courage. Don't forget that.\n\nI believe in you. 💪\n\nWith care,`
    },
    {
      id: 'grateful',
      emoji: '💌',
      label: 'I am grateful for you',
      subject: 'Grateful to have you in my life',
      body: (name) =>
        `Hey ${name},\n\nI've been thinking about how glad I am that you're in my life.\n\nYou bring something really special and I don't want to take that for granted. So I'm saying it out loud: I'm grateful for you. 💌\n\nWith a full heart,`
    },
    {
      id: 'checkin',
      emoji: '🫂',
      label: 'Just checking in on you',
      subject: 'Thinking of you — just checking in',
      body: (name) =>
        `Hey ${name},\n\nNo agenda here — just thinking of you and wanted to check in.\n\nHow are you really doing? I hope things are okay. And if they're not, that's okay too. I'm here. 🫂\n\nTake care of yourself,`
    },
    {
      id: 'collaboration',
      emoji: '🤝',
      label: 'Great collaboration',
      subject: 'That collaboration was something special',
      body: (name) =>
        `Hey ${name},\n\nI just wanted to say — working with you is genuinely great.\n\nThe way you bring your ideas, listen to others, and make the work better together — that's not something you find everywhere. Our collaboration makes a real difference and I don't want that to go unsaid.\n\nThank you for that. 🤝\n\nWith appreciation,`
    },
    {
      id: 'madeday',
      emoji: '☀️',
      label: 'Thanks for making my day great',
      subject: 'You made my day — thank you',
      body: (name) =>
        `Hey ${name},\n\nI just wanted to reach out and say — you made my day today.\n\nIt might have been something small you said or did, but it landed in exactly the right way. Those moments matter more than you know.\n\nThank you for being the kind of person who brightens things up. ☀️\n\nWith a smile,`
    },
    {
      id: 'teammate',
      emoji: '🏅',
      label: 'Thanks for being a great teammate',
      subject: 'Grateful to have you as a teammate',
      body: (name) =>
        `Hey ${name},\n\nI just wanted to take a moment to say how much I value having you as a teammate.\n\nYou show up, you support, you care about doing things well — and that lifts the whole team. It doesn't go unnoticed, even when it might feel like it does.\n\nSeriously, thank you. Having you on the team makes a real difference. 🏅\n\nWith respect and gratitude,`
    },
    {
      id: 'hardwork',
      emoji: '🔥',
      label: 'Your hard work paid off',
      subject: 'Your hard work really showed — thank you',
      body: (name) =>
        `Hey ${name},\n\nI just wanted to say — the effort you've been putting in has not gone unnoticed.\n\nWhat you delivered took real dedication, and the results speak for themselves. That kind of commitment to doing things well is rare, and it makes everything around you better.\n\nThank you for going above and beyond. 🔥\n\nWith admiration,`
    },
    {
      id: 'problemsolver',
      emoji: '💡',
      label: 'You solved that brilliantly',
      subject: 'That was a brilliant solution — well done',
      body: (name) =>
        `Hey ${name},\n\nI've been thinking about how you handled that problem and I just had to reach out.\n\nThe way you approached it — calmly, creatively, effectively — was genuinely impressive. You made something difficult look straightforward, and that's a real skill.\n\nThank you for bringing that clarity when it was needed most. 💡\n\nWith appreciation,`
    },
  ];

  get selectedPraise(): PraiseType | undefined {
    return this.praiseTypes.find(p => p.id === this.selectedPraiseId);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible']?.currentValue === true) {
      this.reset();
    }
  }

  selectPraise(id: string): void {
    this.selectedPraiseId = id;
  }

  toCompose(): void {
    if (!this.selectedPraiseId) return;
    const greeting = this.recipientName.trim() || 'there';
    this.customMessage = this.selectedPraise!.body(greeting);
    this.step = 'compose';
  }

  send(): void {
    const praise = this.selectedPraise!;
    const signOff = this.senderName.trim() || 'A friend';
    const subject = encodeURIComponent(praise.subject);
    const body = encodeURIComponent(
      this.customMessage + '\n' + signOff
    );
    const email = encodeURIComponent(this.recipientEmail.trim());
    const mailto = `mailto:${email}?subject=${subject}&body=${body}`;
    window.location.href = mailto;
    this.sent = true;
    setTimeout(() => this.close(), 2000);
  }

  back(): void {
    this.step = 'pick';
  }

  close(): void {
    this.closed.emit();
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('send-vibe-overlay')) {
      this.close();
    }
  }

  private reset(): void {
    this.senderName = '';
    this.recipientName = '';
    this.recipientEmail = '';
    this.selectedPraiseId = '';
    this.customMessage = '';
    this.step = 'pick';
    this.sent = false;
  }
}

