# Keeping Your Dashboard Updated

## After editing a metric CSV

```bash
uvx parish-pulse update
git add data/metrics/ web/dashboard-data.json
git commit -m "Update metrics data"
git push
```

## After editing hexagon data in your GIS

```bash
uvx parish-pulse update
git add data/spatial/hexagons.geojson web/dashboard-data.json
git commit -m "Update hexagon data"
git push
```

## Recording a snapshot

Snapshots record the most recent value from each metric CSV at a point in time. They are optional — useful for tracking change at key moments (e.g. after a survey, after an event).

```bash
uvx parish-pulse snapshot
# or with a label:
uvx parish-pulse snapshot --label "After Christmas survey"
# or backdated:
uvx parish-pulse snapshot --date 2025-06-01 --label "Mid-year"
```

Then rebuild and push:

```bash
uvx parish-pulse update
git add data/historical/snapshots.json web/dashboard-data.json
git commit -m "Add snapshot"
git push
```

## Changing your parish configuration

If you change `config/parish.yaml` or `config/metrics.yaml`:

```bash
uvx parish-pulse update
git add config/ web/
git commit -m "Update configuration"
git push
```

If you change the parish name or need to regenerate the boundary and hexagons, re-run setup:

```bash
uvx parish-pulse setup
uvx parish-pulse update
git add data/spatial/ web/
git commit -m "Regenerate parish boundary and hexagons"
git push
```

## Upgrading the tool

Nothing to do. `uvx parish-pulse` always fetches the latest published version automatically. Your config and data files are never modified by an upgrade.

If a new version adds new optional config fields, the tool will use sensible defaults. Breaking changes are documented in the [core changelog](https://github.com/parish-pulse/parish-pulse/blob/main/CHANGELOG.md).
