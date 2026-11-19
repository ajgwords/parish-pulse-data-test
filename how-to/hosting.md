# Hosting on GitHub Pages

## Basic setup

After your first `git push`:

1. Go to your repository on GitHub
2. Click **Settings → Pages**
3. Under "Build and deployment":
   - Source: **Deploy from a branch**
   - Branch: **main**, Folder: **/web**
4. Click **Save**

Your site will be live within a few minutes at:
```
https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/
```

> Updates after each push take about 1 minute to appear. Hard-refresh (Ctrl+Shift+R) if you see old content.

---

## How the map loads GeoJSON files

The map page (`map.html`) loads `hexagons.geojson` and `parish-boundary.geojson` using relative paths (`../data/spatial/`). This works when serving from the `web/` subfolder because the path resolves back to the root of your repository.

If you change the folder structure, update the paths in `map.html` accordingly.

---

## Automated rebuild (GitHub Actions)

The repository includes `.github/workflows/publish.yml`, which runs `parish-pulse update` automatically on every push and commits the rebuilt `dashboard-data.json`. This means you only need to push your data changes — the tool does the rest.

To enable it, make sure GitHub Actions is enabled for your repository (it is by default for public repos).

---

## Custom domain

To use `dashboard.yourparish.gov.uk` instead of `username.github.io/repo`:

1. Add a CNAME record with your DNS provider:
   ```
   dashboard.yourparish.gov.uk → YOUR-USERNAME.github.io
   ```
2. In GitHub → Settings → Pages → Custom domain, enter your subdomain
3. Tick **Enforce HTTPS**

DNS changes can take up to 48 hours to propagate.

---

## Making the dashboard the root URL

If you want `https://username.github.io/repo/` (without `/web/`) to load the dashboard, set the Pages source folder to `/ (root)` instead of `/web`. You'll then need to move or copy the files accordingly, or use the GitHub Actions workflow in this repo which publishes the `web/` folder to a separate `gh-pages` branch and serves from its root.
