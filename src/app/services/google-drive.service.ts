import { Injectable } from '@angular/core';

const DRIVE_API = 'https://www.googleapis.com/drive/v3';
const UPLOAD_API = 'https://www.googleapis.com/upload/drive/v3';
const FILE_NAME = 'personal-growth-tracker-backup.json';
const SCOPE = 'https://www.googleapis.com/auth/drive.file';

declare const google: any;

@Injectable({ providedIn: 'root' })
export class GoogleDriveService {

  private accessToken: string | null = null;
  private clientId: string = '';

  setClientId(id: string): void {
    this.clientId = id;
  }

  isSignedIn(): boolean {
    return !!this.accessToken;
  }

  async signIn(): Promise<void> {
    if (!this.clientId) throw new Error('Google Client ID not configured. Please add it in Settings.');
    return new Promise((resolve, reject) => {
      const client = google.accounts.oauth2.initTokenClient({
        client_id: this.clientId,
        scope: SCOPE,
        callback: (response: any) => {
          if (response.error) {
            reject(new Error(response.error));
          } else {
            this.accessToken = response.access_token;
            resolve();
          }
        }
      });
      client.requestAccessToken();
    });
  }

  signOut(): void {
    if (this.accessToken) {
      google.accounts.oauth2.revoke(this.accessToken);
      this.accessToken = null;
    }
  }

  async uploadData(jsonData: string): Promise<void> {
    if (!this.accessToken) await this.signIn();

    // Find existing file to update
    const existingId = await this.findExistingFile();

    const blob = new Blob([jsonData], { type: 'application/json' });
    const metadata = { name: FILE_NAME, mimeType: 'application/json' };

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', blob);

    const url = existingId
      ? `${UPLOAD_API}/files/${existingId}?uploadType=multipart`
      : `${UPLOAD_API}/files?uploadType=multipart`;

    const method = existingId ? 'PATCH' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { Authorization: `Bearer ${this.accessToken}` },
      body: form
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'Upload failed');
    }
  }

  async downloadData(): Promise<string> {
    if (!this.accessToken) await this.signIn();

    const fileId = await this.findExistingFile();
    if (!fileId) throw new Error('No backup file found in Google Drive.');

    const response = await fetch(`${DRIVE_API}/files/${fileId}?alt=media`, {
      headers: { Authorization: `Bearer ${this.accessToken}` }
    });

    if (!response.ok) throw new Error('Download failed');
    return response.text();
  }

  private async findExistingFile(): Promise<string | null> {
    const q = encodeURIComponent(`name='${FILE_NAME}' and trashed=false`);
    const response = await fetch(`${DRIVE_API}/files?q=${q}&fields=files(id,name)`, {
      headers: { Authorization: `Bearer ${this.accessToken}` }
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.files?.length > 0 ? data.files[0].id : null;
  }
}

