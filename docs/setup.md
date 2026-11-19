# Setup Guide

This guide walks through every step from a fresh fork to a live dashboard.

**Time required:** 30–60 minutes, depending on how quickly you can obtain your boundary data.

---

## Prerequisites

- A free [GitHub account](https://github.com/join)
- [uv](https://docs.astral.sh/uv/) installed (see below)
- [Git](https://git-scm.com/downloads) or [GitHub Desktop](https://desktop.github.com/)
- QGIS or ArcGIS (for adding spatial data to hexagons — optional but recommended)

---

## Step 1: Install uv

uv is a fast Python package manager that handles your Python version and all dependencies in one tool. You do not need to install Python separately.

**macOS / Linux:**
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

**Windows (PowerShell):**
```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

Restart your terminal after installing. Verify it worked:
```bash
uvx --version
```

Full documentation: [docs.astral.sh/uv](https://docs.astral.sh/uv/)

---

## Step 2: Fork and clone

1. Go to [github.com/parish-pulse/parish-pulse-data](https://github.com/parish-pulse/parish-pulse-data)
2. Click **Fork** (top right)
3. Name your fork, e.g. `nailsea-parish-pulse`
4. Click **Create fork**

Then clone it to your computer:

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
cd YOUR-REPO-NAME
```

---

## Step 3: Obtain the source GeoPackage files

You need two files, placed in `data/spatial/`:

### parishes.gpkg

UK parish boundaries in EPSG:27700. Obtain from:

- **ONS Open Geography Portal** (recommended): [geoportal.statistics.gov.uk](https://geoportal.statistics.gov.uk) — search for "Parish Boundaries" and download as GeoPackage
- **Ordnance Survey Open Data**: [osdatahub.os.uk/downloads/open](https://osdatahub.os.uk/downloads/open) — Boundary-Line product

### hexagons.gpkg

A 250m hexagon grid covering UK parishes in EPSG:27700. This file is supplied separately by the Parish Pulse project — check the [releases page](https://github.com/parish-pulse/parish-pulse-data/releases) for a download link.

> **These files are large and are excluded from Git** (listed in `.gitignore`). They live only on your computer and are used once during setup.

---

## Step 4: Configure your parish

Open `config/parish.yaml` in any text editor and fill in the required fields:

```yaml
parish:
  name: "Nailsea"              # Must match exactly what's in parishes.gpkg
  local_authority: "North Somerset Council"
  county: "Somerset"
  description: "A short description shown on the dashboard."

dashboard:
  title: "Nailsea Parish Dashboard"
  accent_colour: "#2D7D46"
```

The `name` field must match the parish name in the GeoPackage exactly. If setup can't find your parish, it will show a list of example values from the file to help you find the right spelling.

---

## Step 5: Configure your metrics

Open `config/metrics.yaml`. There is one example entry. Edit it to match your data, and add more entries for each metric you want to track:

```yaml
metrics:
  - id: empty_shops
    label: "Empty Shops"
    description: "Number of empty shops in the parish."
    category: "Retail"
    data_file: "empty-shops.csv"
    source: "Parish survey"
```

See [docs/data-format.md](data-format.md) for the expected CSV format.

---

## Step 6: Add your metric CSVs

Place your CSV files in `data/metrics/`. See [docs/data-format.md](data-format.md).

The example CSV (`data/metrics/example.csv`) shows the expected format:

```
Date, Number of empty shops, Notes
2024-06-01, 6, Mainly on High Street
2024-12-01, 5,
```

---

## Step 7: Run setup

From inside your repository folder:

```bash
uvx parish-pulse setup
```

`uvx` downloads the tool automatically on first run (no separate install step).

You should see output like:

```
════════════════════════════════════════
  Parish Pulse — Setup
════════════════════════════════════════

── Step 1: Finding 'Nailsea' in parishes.gpkg ──
  ✓ Found parish: Nailsea

── Step 2: Selecting hexagons that intersect the parish ──
  ✓ Selected 47 hexagons

── Step 3: Reprojecting to WGS84 (EPSG:4326) ──
  ✓ Reprojected

── Step 4: Writing GeoJSON files ──
  ✓ data/spatial/parish-boundary.geojson
  ✓ data/spatial/hexagons.geojson

── Step 5: Writing web/config.json ──
  ✓ Map centre auto-detected: [51.4268, -2.7592]
  ✓ web/config.json

✅  Setup complete for Nailsea parish!
```

---

## Step 8: Add data to your hexagons (optional)

If you want to display spatial data on the map, open `data/spatial/hexagons.geojson` in QGIS or ArcGIS and add attribute columns. See [docs/gis.md](gis.md).

---

## Step 9: Build the dashboard

```bash
uvx parish-pulse update
```

Preview it locally:

```bash
uvx parish-pulse serve
```

Open [http://localhost:8000](http://localhost:8000) in your browser.

---

## Step 10: Publish

```bash
git add .
git commit -m "Initial Parish Pulse setup"
git push
```

On GitHub:
1. Go to **Settings → Pages**
2. Source: **Deploy from a branch**
3. Branch: **main**, Folder: **/ (root)** or **/web** depending on your setup
4. Click **Save**

Your dashboard will be live within a few minutes at:
```
https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/
```

See [docs/hosting.md](hosting.md) for GitHub Pages configuration details.
