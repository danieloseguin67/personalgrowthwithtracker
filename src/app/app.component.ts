import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './components/nav/nav.component';
import { StorageService } from './services/storage.service';
import { ReminderService } from './services/reminder.service';
import { GoogleDriveService } from './services/google-drive.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Personal Growth Tracker';

  constructor(
    private storage: StorageService,
    private reminder: ReminderService,
    private drive: GoogleDriveService
  ) {}

  ngOnInit(): void {
    const settings = this.storage.getSettings();
    this.drive.setClientId(settings.googleClientId);
    if (settings.remindersEnabled) {
      this.reminder.scheduleReminders(settings);
    }
  }
}

