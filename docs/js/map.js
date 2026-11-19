/* Parish Pulse — Map JS (Leaflet) */

const CONFIG_URL = 'config.json';
const HEX_URL = 'hexagons.geojson';
const BOUNDARY_URL = 'parish-boundary.geojson';
const DATA_URL = 'dashboard-data.json';

let map, hexLayer, boundaryLayer;
let hexData = null, dashData = null, configData = null;
let activeMetric = null;
const GREEN_SCHEMES = {
  green:  ['#e8f5e9','#a5d6a7','#4caf50','#2e7d32','#1b5e20'],
  blue:   ['#e3f2fd','#90caf9','#2196f3','#1565c0','#0d47a1'],
  amber:  ['#fff8e1','#ffe082','#ffc107','#e65100','#bf360c'],
  red:    ['#fce4ec','#f48fb1','#e91e63','#880e4f','#4a0030'],
  purple: ['#f3e5f5','#ce93d8','#9c27b0','#4a148c','#2a0a4f'],
  grey:   ['#f5f5f5','#bdbdbd','#9e9e9e','#616161','#212121'],
};

async function init() {
  // Load all data in parallel
  [configData, hexData, dashData] = await Promise.all([
    fetchJSON(CONFIG_URL),
    fetchJSON(HEX_URL),
    fetchJSON(DATA_URL),
  ]);

  // Apply accent colour
  const accent = configData?.dashboard?.accent_colour || '#2D7D46';
  document.documentElement.style.setProperty('--accent', accent);

  // Set page title
  const name = configData?.parish?.name || 'Parish';
  document.getElementById('map-page-title').textContent = `${name} Parish Pulse`;

  // Init Leaflet map
  const centre = configData?.map?.centre || [51.5, -2.0];
  const zoom   = configData?.map?.zoom   || 13;

  map = L.map('map', { center: centre, zoom });

  // Base map
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  }).addTo(map);

  // Parish boundary
  const boundaryData = await fetchJSON(BOUNDARY_URL);
  if (boundaryData) {
    boundaryLayer = L.geoJSON(boundaryData, {
      style: {
        color: accent, weight: 2.5, opacity: 0.9,
        fillOpacity: 0, dashArray: '6 4'
      }
    }).addTo(map);
    map.fitBounds(boundaryLayer.getBounds(), { padding: [20,20] });
  }

  // Build metric buttons sidebar
  buildSidebar();

  // Default: first spatial metric
  const firstSpatial = (dashData?.metrics || []).find(m => m.type === 'spatial');
  if (firstSpatial) showMetric(firstSpatial.id);
}

function buildSidebar() {
  const container = document.getElementById('metric-buttons');
  const spatialMetrics = (dashData?.metrics || []).filter(m => m.type === 'spatial');

  if (spatialMetrics.length === 0) {
    container.innerHTML = '<p style="font-size:0.8rem;color:var(--muted)">No spatial metrics defined.</p>';
    return;
  }

  for (const m of spatialMetrics) {
    const btn = document.createElement('button');
    btn.className = 'metric-btn';
    btn.dataset.id = m.id;
    btn.textContent = `${m.icon || ''} ${m.label}`;
    btn.addEventListener('click', () => showMetric(m.id));
    container.appendChild(btn);
  }
}

function escapeHTML(v) { return String(v ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c])); }

function showMetric(metricId) {
  activeMetric = metricId;

  // Update button states
  document.querySelectorAll('.metric-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.id === metricId);
  });

  const metric = (dashData?.metrics || []).find(m => m.id === metricId);
  if (!metric) return;

  const prop = getHexProperty(metricId);
  if (!prop) return;

  if (!hexData?.features) return;
  // Compute value range
  const values = (hexData?.features || []).map(f => f.properties[prop]).filter(v => typeof v === "number" && Number.isFinite(v));
  const maxVal = values.length ? Math.max(...values) : 1;
  const breaks = metric.breaks || [];

  // Update legend
  document.getElementById('legend-min').textContent = '0';
  document.getElementById('legend-max').textContent = maxVal;

  const scheme = configData?.map?.hexagon_colour_scheme || 'green';
  const colours = GREEN_SCHEMES[scheme] || GREEN_SCHEMES.green;
  document.getElementById('legend-bar').style.background =
    `linear-gradient(to right, ${colours[0]}, ${colours[colours.length-1]})`;

  // Remove old hex layer
  if (hexLayer) map.removeLayer(hexLayer);

  // Add new hex layer
  hexLayer = L.geoJSON(hexData, {
    style: feature => ({
      fillColor: getColour(feature.properties[prop], maxVal, colours, breaks),
      fillOpacity: 0.75,
      color: '#fff',
      weight: 0.8,
      opacity: 0.6
    }),
    onEachFeature: (feature, layer) => {
      const props = feature.properties;
      const val = props[prop] ?? null;
      const spatialMetrics = (dashData?.metrics || []).filter(m => m.type === 'spatial');

      let rows = spatialMetrics.map(m => {
        const p = getHexProperty(m.id);
        return `<tr><td>${escapeHTML(m.icon || '')} ${escapeHTML(m.label)}</td><td>${escapeHTML(props[p] ?? '—')} ${escapeHTML(m.unit || '')}</td></tr>`;
      }).join('');

      layer.bindPopup(`
        <div class="hex-popup">
          <h3>Hexagon ${escapeHTML(props.hex_id)}</h3>
          <table>${rows}</table>
          ${props.notes ? `<p style="margin-top:6px;font-size:0.75rem;color:var(--muted)">${escapeHTML(props.notes)}</p>` : ''}
        </div>
      `);

      layer.on('mouseover', e => {
        e.target.setStyle({ fillOpacity: 0.95, weight: 1.5 });
      });
      layer.on('mouseout', e => {
        if (!e.target.isPopupOpen()) {
          e.target.setStyle({ fillOpacity: 0.75, weight: 0.8 });
        }
      });
    }
  }).addTo(map);
}

function getHexProperty(metricId) {
  const m = (dashData?.metrics || []).find(m => m.id === metricId);
  // The hex property name stored in config at build time
  // Fall back to metric id for simple cases
  return m?.spatial?.hexagon_property || metricId;
}

function getColour(value, maxVal, colours, breaks = []) {
  if (value === null || value === undefined || !Number.isFinite(Number(value))) return "#cccccc";
  if (breaks.length) return colours[Math.min(colours.length-1, breaks.findIndex(b => Number(value) <= b) < 0 ? colours.length-1 : breaks.findIndex(b => Number(value) <= b))];
  if (value === 0 || maxVal === 0) return colours[0];
  const ratio = Math.min(value / maxVal, 1);
  const idx = Math.floor(ratio * (colours.length - 1));
  return colours[idx];
}

async function fetchJSON(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

init();
