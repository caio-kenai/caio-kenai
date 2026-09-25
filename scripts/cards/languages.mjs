import { svgDocument, card, esc } from '../lib/svg.mjs';

const W = 480;
const H = 230;
const BAR = { x: 24, y: 60, w: 432, h: 10 };

export default function languages(data, t, { top = 7, exclude = [] } = {}) {
  const all = data.languages.filter((l) => !exclude.includes(l.name));
  const total = all.reduce((sum, l) => sum + l.size, 0) || 1;
  const shown = all.slice(0, top).map((l) => ({ ...l, share: l.size / total }));
  const rest = 1 - shown.reduce((sum, l) => sum + l.share, 0);
  if (rest > 0.0005) shown.push({ name: 'Outras', color: t.faint, share: rest });

  // Segments grow from zero in sequence, like a meter filling up.
  let cursor = BAR.x;
  const segments = shown
    .map((l, i) => {
      const w = l.share * BAR.w;
      const segment = `<rect x="${cursor.toFixed(2)}" y="${BAR.y}" width="0" height="${BAR.h}" fill="${l.color ?? t.faint}">
  <animate attributeName="width" from="0" to="${w.toFixed(2)}" dur=".5s" begin="${(0.2 + i * 0.12).toFixed(2)}s" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines=".2 .7 .2 1"/>
</rect>`;
      cursor += w;
      return segment;
    })
    .join('\n');

  const legend = shown
    .map((l, i) => {
      const col = Math.floor(i / 4);
      const x = 24 + col * 226;
      const y = 108 + (i % 4) * 30;
      return `<g class="fade-up" style="animation-delay:${(0.3 + i * 0.07).toFixed(2)}s">
  <circle cx="${x + 5}" cy="${y - 4}" r="5" fill="${l.color ?? t.faint}"/>
  <text x="${x + 18}" y="${y}" font-size="14" fill="${t.text}">${esc(l.name)}</text>
  <text x="${x + 206}" y="${y}" text-anchor="end" class="mono" font-size="12.5" fill="${t.muted}">${(l.share * 100).toFixed(1)}%</text>
</g>`;
    })
    .join('\n');

  return svgDocument({
    width: W,
    height: H,
    title: 'Linguagens mais usadas',
    desc: shown.map((l) => `${l.name} ${(l.share * 100).toFixed(1)}%`).join(', '),
    defs: `<clipPath id="bar"><rect x="${BAR.x}" y="${BAR.y}" width="${BAR.w}" height="${BAR.h}" rx="5"/></clipPath>`,
    body: `${card(t, W, H)}
<text x="24" y="40" font-size="17" font-weight="600" fill="${t.text}">Linguagens mais usadas</text>
<text x="${W - 24}" y="40" text-anchor="end" font-size="12.5" fill="${t.muted}">por volume de código</text>
<rect x="${BAR.x}" y="${BAR.y}" width="${BAR.w}" height="${BAR.h}" rx="5" fill="${t.surfaceAlt}"/>
<g clip-path="url(#bar)">${segments}</g>
${legend}`,
  });
}
