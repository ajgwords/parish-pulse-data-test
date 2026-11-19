# data/spatial/

Place the two source GeoPackage files here before running `parish-pulse setup`:

| File | Description |
|------|-------------|
| `parishes.gpkg` | UK parish boundaries (EPSG:27700). Provided separately — see docs/setup.md for sources. |
| `hexagons.gpkg` | UK 250m hexagon grid (EPSG:27700). Provided separately — see docs/setup.md for sources. |

Running `parish-pulse setup` will create two output files here:

| File | Description |
|------|-------------|
| `parish-boundary.geojson` | Your parish boundary in WGS84 — used as the map outline |
| `hexagons.geojson` | Hexagons intersecting your parish in WGS84 — open this in your GIS to add data |

## Important

- The `.gpkg` files are large and should **not** be committed to GitHub.
  They are listed in `.gitignore` by default.
- The generated `.geojson` files **should** be committed — they are what
  the dashboard reads.
- When editing `hexagons.geojson` in QGIS or ArcGIS, always save back to
  EPSG:4326 (WGS84). Do not change the coordinate system.
