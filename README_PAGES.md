
# Product Information Hub — GitHub Pages bundle

## Quick start
```bash
npm install
npm run dev
```
Open http://localhost:5173

## Deploy to GitHub Pages
1) Create a repo named **Product_Dashboard** (or rename vite `base` if you choose a different repo name).
2) Upload this folder (or push via git) to **main**.
3) Ensure `.github/workflows/pages.yml` exists (included).
4) On GitHub → **Settings → Pages** → Source: **GitHub Actions**.
5) Push any change → the site publishes to:
```
https://<your-username>.github.io/Product_Dashboard/
```

### If you use a different repo name
Edit `vite.config.ts` and set:
```ts
base: '/<your-repo-name>/'
```
then commit to main.
