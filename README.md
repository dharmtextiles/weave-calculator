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

## Structure
    index.html            page markup
    css/style.css         styles
    js/app.js             application logic
    sw.js                 offline cache (service worker)
    manifest.webmanifest  installable-app metadata
    icons/                app icons
