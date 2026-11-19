# Configuration Reference

All configuration lives in two files in the `config/` folder.

---

## config/parish.yaml

### `parish` section

| Field | Required | Description |
|-------|----------|-------------|
| `name` | ✅ | Parish name — must match exactly what is in `parishes.gpkg` |
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
| `title` | `"[Parish] Parish Pulse"` | Page title shown in the header |
| `subtitle` | | Subtitle shown below the title |
| `accent_colour` | `"#2D7D46"` | Hex colour code for the site theme |

---

## config/metrics.yaml

A list of metrics. Each entry becomes one chart on the dashboard.

### Fields

| Field | Required | Description |
|-------|----------|-------------|
| `id` | ✅ | Unique identifier — letters, numbers, underscores only |
| `label` | ✅ | Chart title shown on the dashboard |
| `data_file` | ✅ | CSV filename in `data/metrics/` |
| `description` | | Short description shown below the chart title |
| `category` | | Groups charts on the dashboard (e.g. `Retail`, `Transport`) |
| `source` | | Data source name |
| `source_url` | | Link to the data source (optional) |

### Example

```yaml
metrics:

  - id: empty_shops
    label: "Empty Shops"
    description: "Number of vacant retail units in the parish."
    category: "Retail"
    data_file: "empty-shops.csv"
    source: "Parish survey"
    source_url: "https://www.example.com/"

  - id: bus_passengers
    label: "Bus Passengers"
    description: "Monthly bus passenger count at the main stop."
    category: "Transport"
    data_file: "bus-passengers.csv"
    source: "Bus operator data"
```

---

## After editing configuration

Always run `parish-pulse update` after changing either config file to rebuild the dashboard data:

```bash
uvx parish-pulse update
```
