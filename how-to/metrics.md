# Adding and Managing Metrics

## Types of metrics

**Spatial** — has a location; shown on the map and totalled on the dashboard. Edit values in QGIS.

**Non-spatial** — a parish-wide figure; shown on the dashboard only. Edit values in CSV files.

---

## Defining a metric in metrics.yaml

Add an entry to the `metrics:` list in `config/metrics.yaml`.

### Spatial example

```yaml
- id: playgrounds
  label: "Playgrounds"
  description: "Publicly accessible children's playgrounds."
  category: "Community"
  type: spatial
  unit: "playgrounds"
  data_file: "community.csv"
  spatial:
    hexagon_property: "playground_count"
    aggregate: sum
  display: all
  icon: "🛝"
  source: "Your Council"
```

### Non-spatial example

```yaml
- id: satisfaction_score
  label: "Community Satisfaction"
  description: "Average score (1–10) from the annual survey."
  category: "Community"
  type: non-spatial
  unit: "/ 10"
  data_file: "community.csv"
  display: chart
  icon: "😊"
  source: "Annual Parish Survey"
```

---

## Creating the CSV file

```
# Parish Pulse — Community metrics
# Updated: 2025-01-01
#
date,satisfaction_score,notes
2024-01-01,7.2,Annual survey — 156 respondents
2025-01-01,7.8,Annual survey — 203 respondents
```

- Lines starting with `#` are ignored
- `date` column is required (YYYY-MM-DD)
- The most recent row is used as the current value
- Multiple metrics from the same file = extra columns, same format

---

## Adding a spatial metric property to hexagons

After adding a new spatial metric to `metrics.yaml`, re-run setup **only if** you haven't added data yet:

```bash
uvx parish-pulse setup
```

> ⚠️ This resets all hexagon values to 0. Back up `hexagons.geojson` first if you have existing data.

Alternatively, add the column in QGIS (Attribute Table → Field Calculator → Create new field).

---

## Updating metric values

**Non-spatial:** add a row to the CSV, then:
```bash
uvx parish-pulse snapshot
uvx parish-pulse update
git add . && git commit -m "Update metrics" && git push
```

**Spatial:** edit in QGIS, save, then the same three commands above.

---

## The display field

| Value | Dashboard card | History chart | Map layer |
|-------|:-:|:-:|:-:|
| `number` | ✅ | | |
| `chart`  | ✅ | ✅ | |
| `map`    | ✅ | | ✅ |
| `all`    | ✅ | ✅ | ✅ |
