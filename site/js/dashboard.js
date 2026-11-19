/* Parish Pulse — Dashboard JS */

const DATA_URL = 'dashboard-data.json';
let cfg = null;
let historyChart = null;

async function init() {
  try {
    const res = await fetch(DATA_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    cfg = await res.json();
  } catch (e) {
    document.getElementById('last-updated-text').textContent =
      'Could not load dashboard data. Check the latest GitHub Actions publishing run.';
    console.error(e);
    return;
  }

  applyBranding();
  renderHero();
  renderMetrics();
  renderChartSection();
}

function applyBranding() {
  const p = cfg.parish;
  const d = cfg.dashboard || {};
  const accent = d.accent_colour || '#2D7D46';

  document.documentElement.style.setProperty('--accent', accent);
  // Light version: blend with white at 10%
  document.documentElement.style.setProperty('--accent-light', hexToRgba(accent, 0.08));

  document.title = d.title || `${p.name} Parish Pulse`;
  setText('dashboard-title', d.title || `${p.name} Parish Pulse`);
  setText('dashboard-subtitle', d.subtitle || `Community metrics for ${p.name}`);

  if (p.contact_email) {
    setText('footer-contact', `Contact: ${p.contact_email}`);
  }

  if (cfg.generated) {
    const dt = new Date(cfg.generated).toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' });
    setText('last-updated-text', `Last updated: ${dt}`);
  }
}

function renderHero() {
  const d = cfg.dashboard || {};
  const featuredId = d.featured_metric;
  const metric = cfg.metrics.find(m => m.id === featuredId) || cfg.metrics[0];
  if (!metric) return;

  setText('hero-label', metric.icon ? `${metric.icon}  ${metric.label}` : metric.label);
  setText('hero-value', formatValue(metric.current_value));
  setText('hero-unit', metric.unit);
  setText('hero-description', metric.description || '');

  const changeEl = document.getElementById('hero-change');
  if (metric.change !== null && metric.change !== undefined) {
    const sign = metric.change > 0 ? '+' : '';
    changeEl.textContent = `${sign}${metric.change} since last snapshot`;
    changeEl.style.display = 'inline-block';
  } else {
    changeEl.style.display = 'none';
  }
}

function renderMetrics() {
  const container = document.getElementById('metrics-container');
  container.innerHTML = '';

  // Group by category
  const categories = {};
  for (const m of cfg.metrics) {
    const cat = m.category || 'Other';
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(m);
  }

  for (const [cat, metrics] of Object.entries(categories)) {
    const section = document.createElement('section');
    section.className = 'category-section';

    const title = document.createElement('h2');
    title.className = 'section-title';
    title.textContent = cat;
    section.appendChild(title);

    const grid = document.createElement('div');
    grid.className = 'metric-grid';

    for (const m of metrics) {
      grid.appendChild(makeMetricCard(m));
    }

    section.appendChild(grid);
    container.appendChild(section);
  }
}

function escapeHTML(v) { return String(v ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c])); }
function safeURL(url) { try { const u = new URL(url); return ["https:","http:"].includes(u.protocol) ? u.href : ""; } catch { return ""; } }
function makeMetricCard(m) {
  const card = document.createElement('div');
  card.className = 'metric-card';

  const icon = m.icon ? `<div class="metric-card-icon">${escapeHTML(m.icon)}</div>` : '';
  const change = renderChange(m.change);
  const source = m.source
    ? `<div class="metric-card-source">Source: ${safeURL(m.source_url) ? `<a href="${escapeHTML(safeURL(m.source_url))}" target="_blank" rel="noopener noreferrer">${escapeHTML(m.source)}</a>` : escapeHTML(m.source)}</div>`
    : '';

  card.innerHTML = `
    ${icon}
    <div class="metric-card-label">${escapeHTML(m.label)}</div>
    <div class="metric-card-value">${formatValue(m.current_value)}</div>
    <div class="metric-card-unit">${escapeHTML(m.unit)}</div>
    ${change}
    ${source}
  `;
  return card;
}

function renderChange(change) {
  if (change === null || change === undefined) return '';
  const sign = change > 0 ? '+' : '';
  const cls = change > 0 ? 'change-up' : change < 0 ? 'change-down' : 'change-none';
  const arrow = change > 0 ? '↑' : change < 0 ? '↓' : '→';
  return `<div class="metric-card-change ${cls}">${arrow} ${sign}${change}</div>`;
}

function renderChartSection() {
  // Build list of metrics that have history arrays
  const chartable = cfg.metrics.filter(m =>
    m.history && m.history.length > 1
  );
  if (chartable.length === 0) return;

  const section = document.getElementById('chart-section');
  section.style.display = '';

  const select = document.getElementById('chart-metric-select');
  select.innerHTML = '';
  for (const m of chartable) {
    const opt = document.createElement('option');
    opt.value = m.id;
    opt.textContent = `${m.icon || ''} ${m.label}`;
    select.appendChild(opt);
  }

  select.addEventListener('change', () => drawChart(chartable.find(m => m.id === select.value)));
  drawChart(chartable[0]);
}

function drawChart(metric) {
  const ctx = document.getElementById('history-chart').getContext('2d');
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#2D7D46';

  const labels = metric.history.map(h => formatDate(h.date));
  const values = metric.history.map(h => h.value);

  if (historyChart) historyChart.destroy();
  historyChart = new Chart(ctx, {
    type: ['line','bar','pie'].includes(metric.chart_type) ? metric.chart_type : 'line',
    data: {
      labels,
      datasets: [{
        label: metric.label,
        data: values,
        borderColor: accent,
        backgroundColor: hexToRgba(accent, 0.1),
        tension: 0.3,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: accent
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.parsed.y} ${metric.unit}`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { font: { family: 'Segoe UI, system-ui, sans-serif' } }
        },
        x: {
          ticks: { font: { family: 'Segoe UI, system-ui, sans-serif' } }
        }
      }
    }
  });
}

// ── Utilities ──

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function formatValue(v) {
  if (v === null || v === undefined) return '—';
  if (typeof v === 'number') return v.toLocaleString('en-GB');
  return v;
}

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
}

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${alpha})`;
}

init();
