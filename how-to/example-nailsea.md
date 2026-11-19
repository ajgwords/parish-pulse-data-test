# Example: Schools in Nailsea Parish

This document walks through a complete example of how Parish Pulse tracks the number of schools in Nailsea parish — from finding the data, through QGIS, to the live dashboard.

Nailsea is a town in North Somerset, England, with a population of around 16,000. The parish has a mix of primary, secondary, and SEN schools.

---

## What we're tracking

We want to know:
1. **Total schools** — how many schools are in the parish, and has this changed?
2. **Where they are** — which hexagon cells contain schools?
3. **What type** — primary, secondary, or SEN?

This requires both a **spatial metric** (to show on the map) and a **non-spatial metric** (to show the total as a number over time).

In Parish Pulse, we use the hexagon layer for the spatial data, and a CSV for the historical totals.

---

## Step 1: Find the data

The Department for Education's [Get Information About Schools](https://get-information-schools.service.gov.uk/) (GIAS) service lists every school in England, including its address and postcode.

1. Go to [get-information-schools.service.gov.uk](https://get-information-schools.service.gov.uk)
2. Click **Search** → **Download**
3. Download the "Open Data" extract as a CSV
4. Filter rows where the `LA (name)` column contains "North Somerset"
5. Further filter where the postcode starts with `BS48` (Nailsea's postcode area)

This gives us a shortlist of schools. Cross-reference with Google Maps to confirm each school is inside the parish boundary.

For Nailsea in 2025, we found:

| School | Type | Postcode | Notes |
|--------|------|----------|-------|
| Nailsea School | Secondary | BS48 1QE | Main secondary school |
| Scotch Horn Primary | Primary | BS48 2DB | |
| Golden Valley Primary | Primary | BS48 1NG | |
| Christ Church CE Primary | Primary | BS48 1RQ | |
| Tickenham Road Primary | Primary | BS48 1SH | |
| Ravenswood School | SEN | BS48 2HZ | Special educational needs |

Total: 6 schools (4 primary, 1 secondary, 1 SEN).

---

## Step 2: Configure the metric

In `config/metrics.yaml`, the schools metric is defined as:

```yaml
- id: schools_total
  label: "Total Schools"
  description: >
    Total number of schools of all types within the parish boundary.
  category: "Education"
  type: spatial
  unit: "schools"
  data_file: "education.csv"
  spatial:
    hexagon_property: "schools_count"
    aggregate: sum
  display: all
  icon: "🏫"
  source: "Department for Education (GIAS)"
  source_url: "https://get-information-schools.service.gov.uk/"
```

Note `type: spatial` — this means the metric will appear on the map. The `hexagon_property: "schools_count"` tells Parish Pulse which column in `hexagons.geojson` to read.

---

## Step 3: Set up the hexagon grid

Running `python scripts/setup.py` generates the hexagon grid with a `schools_count` column added to every hexagon, defaulting to `0`.

The setup script creates hexagons approximately 250m across, covering the whole parish. Nailsea's parish generates around 47 hexagons.

---

## Step 4: Assign schools to hexagons in QGIS

Now we need to edit the hexagon layer to say which cells contain schools.

### Open the project

1. Open QGIS
2. Open `qgis/parish-pulse.qgz`
3. You'll see the hexagon grid overlaid on Nailsea

### Locate each school

Using the OSM base map, find where each school is located.

For each school:
1. Press `I` to select the Identify tool
2. Click on the hexagon that contains the school
3. Note the `hex_id` (e.g. `H002`)

### Edit the hexagon

1. Press `Ctrl+E` to enable editing
2. Click on the hexagon
3. In the attributes panel, find `schools_count` and type the number of schools in that hexagon
4. Also update `primary_count`, `secondary_count`, `sen_count` as appropriate
5. Add a note in the `notes` field: e.g. `"Nailsea School + Scotch Horn Primary"`

### Result after editing

| hex_id | schools_count | primary_count | secondary_count | sen_count | notes |
|--------|---------------|---------------|-----------------|-----------|-------|
| H001 | 0 | 0 | 0 | 0 | |
| H002 | 2 | 1 | 1 | 0 | Nailsea School + Scotch Horn Primary |
| H003 | 1 | 1 | 0 | 0 | Golden Valley Primary |
| H004 | 1 | 0 | 0 | 1 | Ravenswood School |
| H005 | 2 | 2 | 0 | 0 | Tickenham Road + Christ Church CE |
| ... all others | 0 | 0 | 0 | 0 | |

Total across all hexagons: `schools_count` = **6**

5. Press `Ctrl+S` to save. The `hexagons.geojson` file is updated automatically.

---

## Step 5: Update the historical CSV

Open `data/metrics/education.csv` and add today's figures:

```
date,schools_total,primary_count,secondary_count,sen_count,notes
2025-01-01,6,4,1,1,Initial baseline recorded from DfE register
```

---

## Step 6: Take a snapshot and rebuild

```bash
uv run scripts/snapshot.py --label "January 2025 Baseline"
uv run scripts/update_dashboard.py
```

The snapshot script:
- Reads `hexagons.geojson` and sums `schools_count` → gets **6**
- Records this in `data/historical/snapshots.json`

The update script:
- Reads the snapshot history
- Reads the CSV history
- Writes `web/dashboard-data.json` for the frontend

---

## Step 7: What it looks like on the dashboard

On the dashboard homepage, the schools metric card shows:

```
🏫 Total Schools
6 schools
→ no change  (or ↑1 if a school opened since last snapshot)
Source: Department for Education
```

If schools is set as the `featured_metric` in `config/parish.yaml`, it appears in the hero section at the top of the page.

On the map page, selecting "Total Schools" colours the hexagons green by school count — darker cells have more schools, lighter (or empty) cells have none.

---

## Step 8: Recording a change — new school opens

In June 2025, a new primary school — Youngwood Lane Primary — opens in the parish.

**Update QGIS:**
1. Open the hexagon that contains the new school
2. Increment `schools_count` from 0 to 1 (or add 1 to an existing count)
3. Increment `primary_count` by 1
4. Update the `notes` field
5. Save

**Update the CSV:**
```
2025-06-01,7,5,1,1,New primary school opened - Youngwood Lane Primary
```

**Record the change:**
```bash
uv run scripts/snapshot.py --label "June 2025 — new school opened"
uv run scripts/update_dashboard.py
git add . && git commit -m "Add new school: Youngwood Lane Primary" && git push
```

Now the dashboard shows:

```
🏫 Total Schools
7 schools
↑1 since last snapshot
```

The history chart also shows the step from 6 to 7 with the date.

---

## Summary

The key steps for any spatial metric are:

1. **Find your data** — open data sources, council records, or your own survey
2. **Define the metric** in `config/metrics.yaml`
3. **Edit hexagons** in QGIS to assign values to cells
4. **Update the CSV** if you want parish-wide totals with history
5. **Snapshot and rebuild** to update the dashboard
6. **Commit and push** to publish

The same approach works for any spatial metric — bus stops, green spaces, parking bays, community facilities, and more.
