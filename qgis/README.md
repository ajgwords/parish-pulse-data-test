# QGIS

You can save a QGIS project file (`.qgz`) here for your parish if you use QGIS to manage hexagon data.

A project file remembers your layer styling, base maps, and attribute table settings — useful if you update hexagon data regularly.

## Suggested workflow

1. Open `data/spatial/hexagons.geojson` in QGIS
2. Add any styling you find useful
3. Save the project: **Project → Save As** → save to this folder as `parish-pulse.qgz`
4. Next time, open `qgis/parish-pulse.qgz` directly

## Note on CRS

The hexagons are stored in EPSG:4326 (WGS84) for web mapping. QGIS will display them correctly. When exporting back to GeoJSON after editing, ensure the output CRS remains EPSG:4326.

See [docs/gis.md](../docs/gis.md) for full editing and export instructions.
