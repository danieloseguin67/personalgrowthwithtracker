# Google Drive Setup Guide 🌱

This guide walks you through connecting your Personal Growth Tracker to Google Drive so you can back up and restore your data.

---

## Prerequisites

- A Google account
- Access to [Google Cloud Console](https://console.cloud.google.com)

---

## Step 1 — Create a Google Cloud Project

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Click the **project dropdown** at the top left
3. Click **New Project**
4. Give it a name (e.g. `Personal Growth Tracker`)
5. Click **Create**
6. Make sure the new project is selected in the dropdown before continuing

---

## Step 2 — Enable the Google Drive API

1. In the left sidebar, go to **APIs & Services → Library**
2. Search for **Google Drive API**
3. Click on it, then click **Enable**

---

## Step 3 — Configure the OAuth Consent Screen

> This is what users see when they grant the app permission to access their Drive.

1. Go to **APIs & Services → OAuth consent screen**
2. Select **External** → click **Create**
3. Fill in the required fields:
   - **App name**: `Personal Growth Tracker`
   - **User support email**: your email address
   - **Developer contact email**: your email address
4. Click **Save and Continue**
5. On the **Scopes** page — click **Save and Continue** (no changes needed)
6. On the **Test users** page:
   - Click **+ Add Users**
   - Add your Google account email (e.g. `yourname@gmail.com`)
   - Click **Save and Continue**
7. Click **Back to Dashboard**

> ⚠️ While the app is in **Testing** mode, only the emails you added as test users can use Google Drive sync. This is fine for personal use.

---

## Step 4 — Create an OAuth 2.0 Client ID

1. Go to **APIs & Services → Credentials**
2. Click **+ Create Credentials** → **OAuth 2.0 Client ID**
3. Set **Application type** to **Web application**
4. Give it a name (e.g. `Growth Tracker Web Client`)
5. Under **Authorized JavaScript origins**, click **+ Add URI** and add:

   ```
   http://localhost:4200
   ```

   > If you have deployed the app to a domain, add that too, e.g. `https://yourdomain.com`

6. Leave **Authorized redirect URIs** empty
7. Click **Create**
8. A popup appears with your credentials — copy the **Client ID**

   It will look like:
   ```
   632572198795-xxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com
   ```

---

## Step 5 — Add the Client ID to the App

1. Open the app at [http://localhost:4200](http://localhost:4200)
2. Navigate to **Settings** (⚙️ in the nav)
3. Scroll to the **Google Drive Backup** section
4. Paste your Client ID into the **Google Client ID** field
5. Click **Save Settings**

---

## Step 6 — Use Google Drive Backup

### Upload your data to Drive

1. In Settings → Google Drive Backup, click **⬆️ Upload to Google Drive**
2. A Google sign-in popup will appear — sign in with your account
3. Grant the app permission to manage its own Drive files
4. You'll see: ✅ *Backup uploaded to Google Drive successfully!*

> The app saves a single file called `personal-growth-tracker-backup.json` in your Google Drive. It only has access to files it creates — it cannot read any other files in your Drive.

### Restore your data from Drive

1. Click **⬇️ Restore from Google Drive**
2. Sign in if prompted
3. You'll see: ✅ *Data restored from Google Drive successfully!*

---

## Troubleshooting

| Error | Cause | Fix |
|---|---|---|
| `Access blocked: Storagerelay URI is not allowed` | Client type is **Desktop app**, not **Web application** | Delete and recreate the client as **Web application** (Step 4) |
| `Error 403: access_denied` | Your email is not added as a test user | Add your email in OAuth consent screen → Test users (Step 3) |
| `Upload failed` / `Download failed` | Client ID not saved, or Drive API not enabled | Check Steps 2 and 5 |
| Sign-in popup blocked | Browser blocked the popup | Allow popups for `localhost:4200` in your browser settings |
| `No backup file found in Google Drive` | No backup has been uploaded yet | Run an upload first before trying to restore |

---

## Privacy & Security

- The app only requests the `drive.file` scope — it can **only access files it creates itself**, not any other files in your Drive.
- Your data never passes through any server — it goes directly from your browser to your Google Drive.
- The backup file (`personal-growth-tracker-backup.json`) is stored in your personal Drive and is only readable by you.

---

## Re-deploying to a Different Domain?

If you later host the app somewhere other than `localhost:4200`, go back to **Google Cloud Console → APIs & Services → Credentials**, edit your OAuth client, and add the new domain under **Authorized JavaScript origins**.
