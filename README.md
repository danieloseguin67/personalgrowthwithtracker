# 🌱 Personal Growth Tracker

A thoughtful daily wellness and personal growth web app built with Angular 19. Track your energy, confidence, mood, gratitude, boundaries, and learning moments — with gentle nudges, positive vibes, and a way to spread kindness to the people around you.

---

## Features

### Daily Entry
Log how you're doing each day with a set of warm, human-centred inputs:

- **Mood picker** — choose from a range of mood states (great, good, okay, low, rest day)
- **Energy level** — 5-card descriptor picker (e.g. "Running on fumes" → "Fully charged")
- **Confidence level** — 5-card descriptor picker (e.g. "Quietly doubting" → "Unstoppable")
- **Gratitude** — free-text field to note what you're grateful for today
- **Boundaries** — reflect on whether you held your boundaries
- **Learning moment** — capture something you learned or noticed about yourself

### Dashboard
Your personal overview at a glance:

- Trend chart for energy and confidence over time (powered by Chart.js)
- Quick access to **Get some good vibes** and **Send a praise**

### History
Browse your past daily entries in a clean, scannable list.

### Weekly Summary
A rolled-up view of your week — mood patterns, average energy/confidence, and highlights from your notes.

### Positive Vibes Modal
When you're having a low-energy or low-mood day, a gentle modal appears with an uplifting message. Contains 28 hand-written items across 4 categories:

- 💬 Quotes
- 🌟 Affirmations
- 🌬️ Breathing prompts
- 🫶 Self-care nudges

Shuffles through items so you get something fresh each time.

### Send a Praise ✉️
Send a kind, heartfelt message to someone in your life via email. Choose from 12 praise types, personalise with their name and yours, preview the message, then open it directly in your email app.

**Praise types include:**

| | |
|---|---|
| 💛 | I appreciate you |
| 🌟 | I'm proud of you |
| ✨ | You inspire me |
| 😊 | You make me smile |
| 💪 | You're stronger than you think |
| 🙏 | I'm grateful for you |
| 🫂 | Just checking in on you |
| 🤝 | Great collaboration |
| ☀️ | Thanks for making my day great |
| 🏅 | Thanks for being a great teammate |
| 🔥 | Your hard work paid off |
| 💡 | You solved that brilliantly |

### Settings
- Connect Google Drive to back up your data
- Manage local storage
- Clear all data

---

## Tech Stack

| | |
|---|---|
| Framework | Angular 19 (standalone components) |
| Styling | SCSS with custom design tokens |
| Charts | Chart.js |
| Auth | Google Identity Services (OAuth 2.0) |
| Storage | localStorage + optional Google Drive backup |
| Fonts | DM Sans + DM Serif Display (Google Fonts) |

---

## Design Tokens

The app uses a consistent set of CSS custom properties:

| Token | Value |
|---|---|
| `--sage` | `#7cb9a8` |
| `--lavender` | `#b39ddb` |
| `--amber` | `#f4a261` |
| `--ocean` | `#5ba4cf` |

Each colour also has `-light` and `-pale` variants for backgrounds and hover states.

---

## Getting Started

### Prerequisites
- Node.js 18+
- Angular CLI 19

### Install & Run

```bash
git clone <your-repo-url>
cd personalGrowthTracker
npm install
ng serve
```

Open [http://localhost:4200](http://localhost:4200) in your browser.

### Build for Production

```bash
ng build
```

Output will be in `dist/personal-growth-tracker/`.

---

## Google Drive Backup (Optional)

To enable Drive sync, you'll need a Google Cloud project with the Drive API enabled and an OAuth 2.0 Client ID. See [GOOGLE_DRIVE_SETUP.md](GOOGLE_DRIVE_SETUP.md) for step-by-step instructions.

---

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── daily-entry/       # Daily mood, energy, gratitude form
│   │   ├── dashboard/         # Overview + charts
│   │   ├── history/           # Past entries list
│   │   ├── nav/               # Navigation bar
│   │   ├── positive-vibes/    # Uplifting messages modal
│   │   ├── send-vibe/         # Send praise via email modal
│   │   ├── settings/          # App settings + Drive backup
│   │   └── weekly-summary/    # Weekly rolled-up view
│   ├── models/                # TypeScript interfaces
│   ├── pipes/                 # Custom pipes (e.g. LevelLabelPipe)
│   └── services/              # Data, storage, and Drive services
└── styles.scss                # Global styles and design tokens
```

---

## Philosophy

This app is built around the idea that small, consistent reflections — done gently and without pressure — lead to meaningful personal growth over time. There's no streaks, no scores, no judgement. Just a quiet space to check in with yourself.

