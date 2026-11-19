# Spatial datasets and analytical indicators

The dashboard supports `data/spatial/parish-boundary.geojson` and `data/spatial/hexagons.geojson`. Both should be GeoJSON FeatureCollections in longitude/latitude (EPSG:4326). If absent, the dashboard still builds, but spatial layers are unavailable.

For a spatial metric, add an entry in `config/metrics.yaml` with `type: spatial`, `spatial.hexagon_property`, optional `spatial.classification` (`equal_interval` or `quantile`) and `analysis.operation` (`sum`, `count`, `mean`, `min` or `max`). The property must exist on hexagon features and contain numeric values. Null is shown as missing, not zero.

**Important limitation:** This release aggregates *existing numeric properties* in the hexagon GeoJSON. It does not yet calculate point-in-polygon joins, line lengths, polygon intersections, raster zonal statistics, network accessibility or area-normalised density. Prepare those using QGIS or another GIS first, and document the method and CRS. For British area and distance calculations use a projected CRS such as EPSG:27700 before exporting display GeoJSON to EPSG:4326. Boundary-edge hexagons need special care when calculating rates or areas.

For spatial data updates, replace the GeoJSON files through GitHub's **Add file → Upload files** interface. Validate and inspect the published map after the workflow completes.
