# Setting up a parish from national GeoPackages

Put the two large source files **on your computer only** at:

```text
parish-pulse-data/data/spatial/parishes.gpkg
parish-pulse-data/data/spatial/hexagons.gpkg
```

Alternatively change `spatial.parish_source` and `spatial.hexagon_source` in `config/parish.yaml` to absolute paths or paths relative to the data repository. Do not commit the GPKGs.

From `parish-pulse-core`: `python -m pip install -e .` (in your virtual environment).

From `parish-pulse-data`: `parish-pulse setup --help` then `parish-pulse setup`.

The sample YAML uses `Census_Code` as the optional unique parish identifier field. If a name is ambiguous, inspect the GPKG and set `spatial.parish_id` to the **actual** Census_Code for your parish. `Census_Code` is not automatically assumed to be a particular value. If your name field is nonstandard, set `spatial.parish_name_column`.

Setup refuses to overwrite `parish-boundary.geojson` or `hexagons.geojson` by default, because the latter may have been enriched in QGIS. Back up first, then use `parish-pulse setup --force` if replacement is intentional.

Setup generates only `data/spatial/*.geojson`. Next run `parish-pulse validate --strict`, `parish-pulse build`, and `parish-pulse serve`. The national GPKGs are not needed in GitHub Actions.

Before publishing, replace `YOUR_USERNAME` in `requirements.txt` with the real public core repository owner.
