import { svgDocument, esc } from '../lib/svg.mjs';

const W = 1200;
const H = 250;
const GAP = 24;
const TILE_W = (W - GAP * 2) / 3;

export default function about(config, t, icons) {
  const tiles = config.about
    .map((tile, i) => {
      const x = i * (TILE_W + GAP);
      const accent = t[tile.accent];
      const delay = 0.1 + i * 0.15;
      const iconRow = tile.icons
        .map((id, k) => `<image class="pop" style="animation-delay:${(delay + 0.35 + k * 0.08).toFixed(2)}s" href="${icons[id]}" x="${x + 28 + k * 54}" y="${H - 74}" width="44" height="44"/>`)
        .join('\n');
      return `<g class="fade-up" style="animation-delay:${delay.toFixed(2)}s">
  <rect x="${x + 1}" y="1" width="${TILE_W - 2}" height="${H - 2}" rx="18" fill="${t.surface}" stroke="url(#ring${i})" stroke-width="1.5"/>
  <circle class="glow" cx="${x + TILE_W - 40}" cy="30" r="70" fill="${accent}" opacity=".16" filter="url(#soft)" style="animation-delay:${-i * 1.3}s"/>
  <rect x="${x + 28}" y="30" width="6" height="22" rx="3" fill="${accent}"/>
  <text x="${x + 44}" y="48" font-size="20" font-weight="700" fill="${t.text}">${esc(tile.title)}</text>
  ${tile.text.map((line, k) => `<text x="${x + 28}" y="${86 + k * 23}" font-size="16" fill="${t.muted}">${esc(line)}</text>`).join('\n  ')}
  ${iconRow}
</g>`;
    })
    .join('\n');

  // Each tile border is a gradient that slowly spins, like a conic border.
  const rings = config.about
    .map(
      (tile, i) => `<linearGradient id="ring${i}" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0" stop-color="${t[tile.accent]}"/>
  <stop offset=".45" stop-color="${t.border}"/>
  <stop offset="1" stop-color="${t[tile.accent]}" stop-opacity=".2"/>
  <animateTransform attributeName="gradientTransform" type="rotate" values="0 .5 .5;360 .5 .5" dur="${8 + i * 2}s" repeatCount="indefinite"/>
</linearGradient>`,
    )
    .join('\n');

  return svgDocument({
    width: W,
    height: H,
    title: 'Sobre mim',
    desc: config.about.map((a) => `${a.title}: ${a.text.join(' ')}`).join(' '),
    style: `
.pop { opacity: 0; transform-box: fill-box; transform-origin: center; animation: pop .5s cubic-bezier(.3,1.5,.5,1) forwards; }
@keyframes pop { from { opacity: 0; transform: scale(.6); } to { opacity: 1; transform: none; } }
.glow { animation: breathe 5s ease-in-out infinite alternate; transform-box: fill-box; transform-origin: center; }
@keyframes breathe { from { transform: scale(.8); } to { transform: scale(1.25); } }
`,
    defs: `${rings}
<filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="28"/></filter>`,
    body: tiles,
  });
}
