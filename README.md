# Dharm Textiles – Weave Costing

A browser-based fabric costing calculator (warp/weft costing, GLM/GSM, profit, peg plan, drawing, lattice, job sheets, PDF export). Pure static site: no build step, no server.

## Run locally
Open `index.html` in a browser, or serve the folder:

    python3 -m http.server 8000   # then visit http://localhost:8000

## Deploy on GitHub Pages
1. Create a repository and push these files to the `main` branch.
2. In the repo go to **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. The included workflow (`.github/workflows/pages.yml`) publishes the site on every push.
   Your app will be at `https://<username>.github.io/<repo>/`.

## Install as an app
Open the published URL in Chrome/Edge/Safari and choose **Install app / Add to Home Screen**. It works offline after the first visit (PDF export and scan/OCR features still need internet for their libraries).

## Updating
After changing files, bump `VERSION` in `sw.js` so installed copies refresh.

## Data & privacy
All data is saved in the user's own browser (localStorage / IndexedDB). Nothing is uploaded. Use the in-app **Backup / Restore** to move data between devices. Data is per-browser and per-site address.

## Google Drive auto-sync (optional)
Menu → **☁ Google Drive sync**. Data is stored in a hidden app folder in the user's own Drive (scope `drive.appdata`; it never appears in My Drive and no other Drive files are visible).

One-time setup (needs a free Google Cloud project):
1. console.cloud.google.com → create a project → **APIs & Services → Library → enable "Google Drive API"**.
2. **OAuth consent screen**: External, add scope `https://www.googleapis.com/auth/drive.appdata`, add your Google account(s) as Test users.
3. **Credentials → Create OAuth client ID → Web application**. *Authorized JavaScript origins*: `https://<username>.github.io` (and `http://localhost:8000` for local tests).
4. Put the Client ID in `js/config.js` (`window.DHARM_GOOGLE_CLIENT_ID = '...'`) so every device has it, or paste it in the sync dialog.
5. On each device open the app → Menu → Google Drive sync → **Connect**, using the same Google account.

Behaviour: uploads ~4 s after each change, checks for other devices' changes every 90 s and when the app is opened. Saved qualities merge by name (latest save wins, deletions propagate). Sign-in lasts ~1 hour; afterwards the next click/keystroke renews it silently (browser-only apps cannot hold longer-lived tokens). Device clocks should be roughly correct.

## Structure
    index.html            page markup
    css/style.css         styles
    js/app.js             application logic
    js/drive-sync.js      Google Drive sync
    js/config.js          optional Google Client ID
    sw.js                 offline cache (service worker)
    manifest.webmanifest  installable-app metadata
    icons/                app icons
