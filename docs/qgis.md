# Using QGIS with Parish Pulse

QGIS is a free, open-source GIS application that you use to:

- View and edit your hexagon grid on a map
- Assign metric values to each hexagon cell
- Add point, line, or polygon data for spatial context
- Export updated hexagon data back to GeoJSON for the dashboard

Download QGIS at [qgis.org](https://qgis.org) — it is free and works on Windows, Mac, and Linux.

---

## Opening the project

Parish Pulse includes a pre-configured QGIS project at `qgis/parish-pulse.qgz`.

1. Open QGIS
2. Go to **Project → Open**
3. Navigate to the `qgis/` folder in your Parish Pulse fork
4. Open `parish-pulse.qgz`

This will load:
- Your parish boundary layer (from `data/spatial/parish-boundary.geojson`)
- Your hexagon grid (from `data/spatial/hexagons.geojson`)
- An OpenStreetMap base map (requires an internet connection)

> **First time?** If QGIS asks to locate the data files, click **Browse** and point it to your `data/spatial/` folder.

---

## Understanding the attribute table

Each hexagon has **properties** (attributes) that store your metric values. To see them:

1. Right-click the **hexagons** layer in the Layers panel
2. Click **Open Attribute Table**

You will see columns like:

| hex_id | row | col | schools_count | primary_count | bus_stops | notes |
|--------|-----|-----|---------------|---------------|-----------|-------|
| H0001  | 0   | 0   | 0             | 0             | 1         |       |
| H0002  | 0   | 1   | 2             | 1             | 3         | Nailsea School |

Each column corresponds to a metric defined in `config/metrics.yaml`.

---

## Editing hexagon values

### Method 1: Edit individual hexagons (recommended for small changes)

1. Click the **pencil icon** (Toggle Editing) in the toolbar or press **Ctrl+E**
2. Click the **Identify Features** tool (the information icon, or press **I**)
3. Click on any hexagon on the map
4. A panel appears on the right showing that hexagon's attributes
5. Click on any value to edit it
6. Click **OK**
7. When finished, click the pencil icon again and choose **Save**

### Method 2: Edit in the attribute table (for many changes at once)

1. Open the Attribute Table (right-click layer → Open Attribute Table)
2. Click the pencil icon to enable editing
3. Click on any cell to edit it
4. Press **Enter** to move to the next row
5. Close the table and save when done

### Method 3: Field Calculator (for computed values)

Useful when you want to assign values based on a formula or another dataset.

1. Open the Attribute Table
2. Click **Field Calculator** (abacus icon, or **Ctrl+I**)
3. Choose "Update existing field"
4. Select the field to update (e.g. `schools_count`)
5. Write an expression, e.g. `0` to reset all, or a computed value
6. Click OK

---

## Importing point data (e.g. school locations)

If you have a CSV or GeoJSON file of school locations, you can use QGIS to count how many fall in each hexagon and write the total back to the hexagon layer.

### Step 1: Add your points layer

1. Go to **Layer → Add Layer → Add Delimited Text Layer**
2. Browse to your CSV (e.g. a schools CSV with latitude/longitude columns)
3. Set X field = `longitude`, Y field = `latitude`
4. Set CRS to EPSG:4326 (WGS 84)
5. Click **Add**

Your schools will appear as points on the map.

### Step 2: Count points in hexagons

1. Go to **Vector → Analysis Tools → Count Points in Polygon**
2. Set:
   - Polygons: `hexagons`
   - Points: your schools layer
   - Count field name: `schools_count` (or whatever property name you want to update)
3. Click **Run**

QGIS creates a new temporary layer with the count in each hexagon.

### Step 3: Join back to your hexagon file

If you want to update the original `hexagons.geojson` file:

1. Right-click the result layer → **Export → Save Features As**
2. Format: GeoJSON
3. File: `data/spatial/hexagons.geojson` (overwrite the existing file)
4. CRS: EPSG:4326

---

## Saving and exporting back to Parish Pulse

After editing hexagon values in QGIS, you need to save the file back to GeoJSON format that Parish Pulse uses.

### If you edited the GeoJSON directly (recommended):

When you save in QGIS (Ctrl+S or the save button after editing), changes are written directly to `data/spatial/hexagons.geojson`. No export step is needed.

### If QGIS saved a copy or a new layer:

1. Right-click the layer → **Export → Save Features As**
2. Format: **GeoJSON**
3. File name: browse to `data/spatial/hexagons.geojson` and overwrite
4. CRS: **EPSG:4326 — WGS 84**
5. Click **OK**

---

## Updating the dashboard after QGIS edits

After saving your hexagon edits, run the dashboard update script:

```bash
uv run scripts/snapshot.py
uv run scripts/update_dashboard.py
```

Then commit and push to GitHub to publish the updated data:

```bash
git add data/spatial/hexagons.geojson data/historical/snapshots.json web/dashboard-data.json
git commit -m "Update hexagon data: added school counts"
git push
```

---

## Tips for working with hexagons

**Use the Notes column.** The `notes` attribute on each hexagon is shown in the popup on the map. Use it to record what's in that cell — e.g. "Nailsea School + Scotch Horn Primary".

**Styling by value.** To colour hexagons by a metric value in QGIS:
1. Double-click the hexagons layer to open Layer Properties
2. Go to **Symbology**
3. Change the drop-down from "Single Symbol" to **Graduated**
4. Set the Value field to e.g. `schools_count`
5. Click **Classify** and choose a colour ramp
6. Click **OK**

**Snapping.** Hexagons share edges. When drawing new layers on top, enable snapping (Project → Snapping Options) so your points and lines align to hexagon edges correctly.

---

## Common issues

**"Layer CRS does not match project CRS"**
Set the project CRS to EPSG:4326 (right-click the CRS indicator at the bottom right).

**Hexagons appear in the wrong location**
Check that your `parish-boundary.geojson` is in WGS84 (latitude/longitude), not a projected system. Re-export from your source with EPSG:4326 if needed.

**Changes not showing in the dashboard**
Make sure you ran `python scripts/update_dashboard.py` and committed the updated `hexagons.geojson` and `dashboard-data.json` files to GitHub.
