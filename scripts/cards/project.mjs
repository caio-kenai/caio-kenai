import { svgDocument, card, esc, icon, wrap, relativeTime, compact } from '../lib/svg.mjs';

const W = 480;
const H = 210;
const CHIP_CHAR_W = 7.3;

function chips(t, items, x, y, accent) {
  let cursor = x;
  return items
    .map((label) => {
      const w = Math.round(label.length * CHIP_CHAR_W + 18);
      const chip = `<rect x="${cursor}" y="${y}" width="${w}" height="24" rx="12" fill="${accent}" fill-opacity=".12" stroke="${accent}" stroke-opacity=".35"/>
<text x="${cursor + w / 2}" y="${y + 16}" text-anchor="middle" class="mono" font-size="12" fill="${t.text}">${esc(label)}</text>`;
      cursor += w + 8;
      return chip;
    })
    .join('\n');
}

export default function project(repo, entry, t, now) {
  const accent = entry.accent;
  const lines = wrap(entry.summary, 66, 3);
  const release = repo.latestRelease?.tagName;
  const badge = release ?? 'in development';
  const badgeW = Math.round(badge.length * CHIP_CHAR_W + 34);
  const stars = compact(repo.stargazerCount);
  const starsX = W - 24 - badgeW - 14;

  const footer = [];
  let fx = 24;
  if (repo.primaryLanguage) {
    footer.push(`<circle cx="${fx + 5}" cy="186" r="5" fill="${repo.primaryLanguage.color ?? t.faint}"/>
<text x="${fx + 16}" y="190" font-size="12.5" fill="${t.muted}">${esc(repo.primaryLanguage.name)}</text>`);
    fx += 16 + repo.primaryLanguage.name.length * 7 + 20;
  }
  if (repo.licenseInfo?.spdxId && repo.licenseInfo.spdxId !== 'NOASSERTION') {
    footer.push(`${icon('law', fx, 178, 13, t.muted)}
<text x="${fx + 19}" y="190" font-size="12.5" fill="${t.muted}">${esc(repo.licenseInfo.spdxId)}</text>`);
    fx += 19 + repo.licenseInfo.spdxId.length * 7 + 20;
  }
  footer.push(`<text x="${W - 24}" y="190" text-anchor="end" font-size="12.5" fill="${t.muted}">updated ${relativeTime(repo.pushedAt, now)}</text>`);

  const style = `
.shine { animation: shine 5s ease-in-out infinite; }
@keyframes shine { 0% { transform: translateX(-160px); } 60%, 100% { transform: translateX(${W + 160}px); } }
`;

  const defs = `
<clipPath id="edge"><rect width="${W}" height="${H}" rx="12"/></clipPath>
<linearGradient id="sweep" x1="0" y1="0" x2="1" y2="0">
  <stop offset="0" stop-color="#ffffff" stop-opacity="0"/>
  <stop offset=".5" stop-color="#ffffff" stop-opacity=".85"/>
  <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
</linearGradient>`;

  return svgDocument({
    width: W,
    height: H,
    title: repo.name,
    desc: `${entry.summary} Built with ${entry.tech.join(', ')}. ${repo.stargazerCount} stars${release ? `, latest release ${release}` : ''}.`,
    style,
    defs,
    body: `${card(t, W, H)}
<g clip-path="url(#edge)">
  <rect width="${W}" height="4" fill="${accent}"/>
  <rect class="shine" x="0" width="140" height="4" fill="url(#sweep)" opacity=".7"/>
</g>
<g class="fade-up">
  ${icon('repo', 24, 30, 18, accent)}
  <text x="52" y="45" font-size="19" font-weight="700" fill="${t.text}">${esc(repo.name)}</text>
  ${icon('star', starsX - stars.length * 8 - 22, 32, 15, t.yellow)}
  <text x="${starsX}" y="45" text-anchor="end" font-size="14" font-weight="600" fill="${t.text}">${stars}</text>
  <rect x="${W - 24 - badgeW}" y="26" width="${badgeW}" height="26" rx="13" fill="${release ? t.green : t.orange}" fill-opacity=".14"/>
  ${icon('tag', W - 24 - badgeW + 10, 32, 14, release ? t.green : t.orange)}
  <text x="${W - 24 - badgeW + 30}" y="44" class="mono" font-size="12" fill="${release ? t.green : t.orange}">${esc(badge)}</text>
</g>
<g class="fade-up" style="animation-delay:.12s">
  ${lines.map((l, i) => `<text x="24" y="${82 + i * 21}" font-size="14" fill="${t.muted}">${esc(l)}</text>`).join('\n  ')}
</g>
<g class="fade-up" style="animation-delay:.24s">${chips(t, entry.tech, 24, 136, accent)}</g>
<path d="M24 166H${W - 24}" stroke="${t.border}"/>
<g class="fade-up" style="animation-delay:.34s">${footer.join('\n')}</g>`,
  });
}
