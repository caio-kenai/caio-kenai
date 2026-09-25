import { svgDocument, esc, icon, wrap, relativeTime, compact } from '../lib/svg.mjs';

const W = 480;
const H = 220;
const LOGO = { x: 24, y: 26, size: 76 };

// Dark label on bright accents, white on deep ones.
function ink(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.55 ? '#0d1117' : '#ffffff';
}

export default function project(repo, entry, t, { now, logo, icons }) {
  const accent = entry.accent;
  const lines = wrap(entry.summary, 58, 2);
  const release = repo.latestRelease?.tagName;
  const badge = release ?? 'em desenvolvimento';
  const badgeW = Math.round(badge.length * 7 + 34);
  const textX = LOGO.x + LOGO.size + 20;

  const iconRow = entry.icons
    .map((id, i) => `<image href="${icons[id]}" x="${24 + i * 34}" y="${H - 50}" width="26" height="26"/>`)
    .join('\n');

  const style = `
.shine { animation: shine 5s ease-in-out infinite; }
@keyframes shine { 0% { transform: translateX(-160px); } 60%, 100% { transform: translateX(${W + 160}px); } }
.halo { animation: halo 3.2s ease-in-out infinite alternate; transform-box: fill-box; transform-origin: center; }
@keyframes halo { from { transform: scale(.85); opacity: .35; } to { transform: scale(1.15); opacity: .7; } }
.logo { opacity: 0; transform-box: fill-box; transform-origin: center; animation: pop .6s cubic-bezier(.3,1.5,.5,1) .05s forwards; }
@keyframes pop { from { opacity: 0; transform: scale(.6) rotate(-8deg); } to { opacity: 1; transform: none; } }
.arrow { animation: nudge 1.6s ease-in-out infinite; }
@keyframes nudge { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(4px); } }
`;

  const defs = `
<clipPath id="edge"><rect width="${W}" height="${H}" rx="14"/></clipPath>
<clipPath id="logoClip"><rect x="${LOGO.x}" y="${LOGO.y}" width="${LOGO.size}" height="${LOGO.size}" rx="20"/></clipPath>
<linearGradient id="sweep" x1="0" y1="0" x2="1" y2="0">
  <stop offset="0" stop-color="#ffffff" stop-opacity="0"/>
  <stop offset=".5" stop-color="#ffffff" stop-opacity=".85"/>
  <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
</linearGradient>
<linearGradient id="cta" x1="0" y1="0" x2="1" y2="0">
  <stop offset="0" stop-color="${accent}"/><stop offset="1" stop-color="${accent}" stop-opacity=".7"/>
</linearGradient>
<filter id="soft" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="16"/></filter>`;

  const cta = { w: 124, h: 32, x: W - 24 - 124, y: H - 53 };

  return svgDocument({
    width: W,
    height: H,
    title: repo.name,
    desc: `${entry.summary} ${repo.stargazerCount} estrelas${release ? `, versão ${release}` : ''}.`,
    style,
    defs,
    body: `<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="14" fill="${t.surface}" stroke="${t.border}"/>
<g clip-path="url(#edge)">
  <circle cx="${W - 30}" cy="10" r="90" fill="${accent}" opacity=".12" filter="url(#soft)"/>
  <rect width="${W}" height="4" fill="${accent}"/>
  <rect class="shine" x="0" width="140" height="4" fill="url(#sweep)" opacity=".7"/>
</g>
<circle class="halo" cx="${LOGO.x + LOGO.size / 2}" cy="${LOGO.y + LOGO.size / 2}" r="${LOGO.size / 2}" fill="${accent}" filter="url(#soft)"/>
<g class="logo"><image href="${logo}" x="${LOGO.x}" y="${LOGO.y}" width="${LOGO.size}" height="${LOGO.size}" clip-path="url(#logoClip)" preserveAspectRatio="xMidYMid meet"/></g>
<g class="fade-up" style="animation-delay:.1s">
  <text x="${textX}" y="${LOGO.y + 30}" font-size="22" font-weight="800" fill="${t.text}">${esc(repo.name)}</text>
  ${icon('star', textX, LOGO.y + 46, 14, t.yellow)}
  <text x="${textX + 20}" y="${LOGO.y + 58}" font-size="13.5" font-weight="600" fill="${t.text}">${compact(repo.stargazerCount)}</text>
  <rect x="${textX + 44}" y="${LOGO.y + 42}" width="${badgeW}" height="22" rx="11" fill="${release ? t.green : t.orange}" fill-opacity=".14"/>
  ${icon('tag', textX + 54, LOGO.y + 46, 13, release ? t.green : t.orange)}
  <text x="${textX + 72}" y="${LOGO.y + 57}" font-size="12" font-weight="600" fill="${release ? t.green : t.orange}">${esc(badge)}</text>
</g>
<g class="fade-up" style="animation-delay:.2s">
  ${lines.map((l, i) => `<text x="24" y="${128 + i * 22}" font-size="15" fill="${t.muted}">${esc(l)}</text>`).join('\n  ')}
</g>
<g class="fade-up" style="animation-delay:.3s">
  ${iconRow}
  <text x="${24 + entry.icons.length * 34 + 4}" y="${H - 32}" font-size="12" fill="${t.muted}">atualizado ${relativeTime(repo.pushedAt, now)}</text>
  <rect x="${cta.x}" y="${cta.y}" width="${cta.w}" height="${cta.h}" rx="16" fill="url(#cta)"/>
  <text x="${cta.x + 18}" y="${cta.y + 21}" font-size="13.5" font-weight="700" fill="${ink(accent)}">Ver projeto</text>
  <path class="arrow" d="M${cta.x + 98} ${cta.y + 11} l5 5 -5 5 M${cta.x + 92} ${cta.y + 16} h10" fill="none" stroke="${ink(accent)}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</g>`,
  });
}
