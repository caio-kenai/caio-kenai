import { svgDocument, card, esc, icon, compact } from '../lib/svg.mjs';
import { streaks } from '../lib/github.mjs';

const W = 1000;
const H = 270;
const CHART = { x: 28, y: 98, w: 944, h: 124 };
const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

// Catmull-Rom through the weekly totals, converted to cubic Béziers, so the
// curve passes through every real data point.
function smoothPath(points) {
  if (points.length < 2) return '';
  let d = `M${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    // Clamp control points so the curve never dips below the baseline.
    const floor = CHART.y + CHART.h;
    c1[1] = Math.min(c1[1], floor);
    c2[1] = Math.min(c2[1], floor);
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

function formatDay(iso) {
  const [, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTHS[m - 1].toLowerCase()}`;
}

export default function activity(data, t) {
  const weeks = data.weeks;
  const max = Math.max(...weeks, 1);
  const step = CHART.w / (weeks.length - 1);
  // Square-root scale keeps quiet weeks visible next to a burst; the peak
  // label still reports the real number.
  const scale = (v) => Math.sqrt(v / max);
  const points = weeks.map((v, i) => [CHART.x + i * step, CHART.y + CHART.h - scale(v) * CHART.h]);
  const line = smoothPath(points);
  const area = `${line} L${CHART.x + CHART.w} ${CHART.y + CHART.h} L${CHART.x} ${CHART.y + CHART.h} Z`;

  const peakIndex = weeks.indexOf(max);
  const [px, py] = points[peakIndex];

  const { current, longest, best } = streaks(data.days);
  const kpis = [
    { label: 'Sequência atual', value: `${current} ${current === 1 ? 'dia' : 'dias'}`, icon: 'flame', color: t.orange },
    { label: 'Maior sequência', value: `${longest} ${longest === 1 ? 'dia' : 'dias'}`, icon: 'trophy', color: t.yellow },
    { label: 'Dia mais ativo', value: `${best.contributionCount} em ${formatDay(best.date)}`, icon: 'calendar', color: t.cyan },
  ];

  const kpiMarkup = kpis
    .map((k, i) => {
      const x = 470 + i * 172;
      return `<g class="fade-up" style="animation-delay:${(0.15 + i * 0.1).toFixed(2)}s">
  <rect x="${x}" y="26" width="34" height="34" rx="9" fill="${k.color}" fill-opacity=".14"/>
  ${icon(k.icon, x + 9, 35, 16, k.color)}
  <text x="${x + 44}" y="39" font-size="12" fill="${t.muted}">${esc(k.label)}</text>
  <text x="${x + 44}" y="58" font-size="16" font-weight="700" fill="${t.text}">${esc(k.value)}</text>
</g>`;
    })
    .join('\n');

  // Month ticks at the first week of each month.
  const ticks = [];
  let lastMonth = -1;
  data.weekStarts.forEach((iso, i) => {
    const month = Number(iso.split('-')[1]) - 1;
    if (month !== lastMonth && i > 0) {
      ticks.push(`<text x="${points[i][0].toFixed(1)}" y="${CHART.y + CHART.h + 24}" text-anchor="middle" font-size="12" fill="${t.muted}">${MONTHS[month]}</text>`);
    }
    lastMonth = month;
  });

  const grid = [0.25, 0.5, 0.75, 1]
    .map((f) => {
      const y = CHART.y + CHART.h - f * CHART.h;
      return `<path d="M${CHART.x} ${y.toFixed(1)}H${CHART.x + CHART.w}" stroke="${t.border}" stroke-dasharray="3 5"/>`;
    })
    .join('\n');

  const style = `
.line { stroke-dasharray: 1; stroke-dashoffset: 1; animation: draw 2.2s cubic-bezier(.4,.1,.2,1) .3s forwards; }
@keyframes draw { to { stroke-dashoffset: 0; } }
.area { opacity: 0; animation: show 1s ease 1.6s forwards; }
.peak { opacity: 0; animation: show .4s ease 2.4s forwards; }
@keyframes show { to { opacity: 1; } }
`;

  const defs = `
<linearGradient id="stroke" x1="0" y1="0" x2="1" y2="0">
  <stop offset="0" stop-color="${t.blue}"/><stop offset="1" stop-color="${t.purple}"/>
</linearGradient>
<linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="${t.purple}" stop-opacity=".32"/><stop offset="1" stop-color="${t.blue}" stop-opacity="0"/>
</linearGradient>`;

  return svgDocument({
    width: W,
    height: H,
    title: 'Atividade no último ano',
    desc: `${data.contributionsLastYear} contribuições no último ano. Sequência atual de ${current} dias, maior sequência de ${longest} dias, semana mais ativa com ${max} contribuições.`,
    style,
    defs,
    body: `${card(t, W, H)}
<text x="28" y="44" font-size="17" font-weight="600" fill="${t.text}">Atividade no último ano</text>
<text x="28" y="66" font-size="13" fill="${t.muted}"><tspan fill="${t.text}" font-weight="700">${compact(data.contributionsLastYear)}</tspan> contribuições, somadas por semana</text>
${kpiMarkup}
${grid}
<path class="area" d="${area}" fill="url(#fill)"/>
<path class="line" d="${line}" pathLength="1" fill="none" stroke="url(#stroke)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
<g class="peak">
  <circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="5" fill="${t.purple}" fill-opacity=".35">
    <animate attributeName="r" values="5;13;5" dur="2.4s" repeatCount="indefinite"/>
    <animate attributeName="fill-opacity" values=".35;0;.35" dur="2.4s" repeatCount="indefinite"/>
  </circle>
  <circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="4.5" fill="${t.surface}" stroke="${t.purple}" stroke-width="2.5"/>
  <text x="${Math.min(px, CHART.x + CHART.w - 60).toFixed(1)}" y="${(py - 14).toFixed(1)}" text-anchor="middle" class="mono" font-size="12" fill="${t.text}">${max} na semana</text>
</g>
${ticks.join('\n')}`,
  });
}
