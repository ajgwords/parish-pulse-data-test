# Configuration Reference

All configuration for the tool lives in two files in the `config/` folder.

---

## config/parish.yaml

### `parish` section

| Field | Required | Description |
|-------|----------|-------------|
| `name` | YES | Parish name — must match exactly what is in `parishes.gpkg` |
| `local_authority` | | District or unitary council — used to disambiguate if two parishes share a name |
| `name_column` | | Column name in `parishes.gpkg` holding the parish name. Auto-detected if not set. |
| `county` | | County or region — shown on the dashboard |
| `description` | | Short description shown on the dashboard |
| `website` | | Parish council website URL (optional) |

### `map` section

| Field | Default | Description |
|-------|---------|-------------|
| `centre` | auto | `[latitude, longitude]` — starting map position. Auto-detected from boundary centroid if blank. |
| `zoom` | `13` | Starting zoom (10 = county, 13 = town, 15 = street) |

### `dashboard` section

| Field | Default | Description |
|-------|---------|-------------|
| `title` | `"[Parish] Parish Dashboard"` | Page title shown in the header |
| `subtitle` | | Subtitle shown below the title |
| `accent_colour` | `#2D7D46"` | Hex colour code for the site theme |


### `spatial` section

| Field | Default | Description |
|-------|---------|-------------|
| `?` | `"?` | ? |
| `?` | | ? |
| `?` | | ? |
---

## config/metrics.yaml

A list of metrics. Each entry becomes one chart on the dashboard.

### Fields

| Field | Required | Description |
|-------|----------|-------------|
| `id` | YES | Unique identifier — letters, numbers, underscores only |
| `label` | YES | Chart title shown on the dashboard |
| `description` | | Short description shown below the chart title |
| `category` | | Groups charts on the dashboard (e.g. `Retail`, `Transport`) |
| `chart_type` | | one of `bar`or `line` |
| `unit` | | base unit that is being charted |
| `data_file` | YES | CSV filename in `data/metrics/` |
| `source` | | Data source name |

### Example

```yaml
metrics:

  - id: empty_shops
    label: Empty shops (illustrative)
    description: Example indicator — replace with your own observations.
    category: Retail
    chart_type: bar
    unit: shops
    data_file: shops.csv
    source: Example data (not a real survey)

  - id: health_test
    label: Number of surgeries (illustrative)
    description: Example indicator — replace with your own observations.
    category: Health
    chart_type: line
    unit: surgeries
    data_file: health.csv
    source: Example data (not a real survey)
```

---

## After editing configuration

Always run `parish-pulse update` after changing either config file to rebuild the dashboard data.
