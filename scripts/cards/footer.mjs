import { svgDocument, seeded } from '../lib/svg.mjs';

const W = 1200;
const H = 96;

// A slow waveform that fades out towards both edges.
function wave(t) {
  const rand = seeded(42);
  const count = 96;
  const gap = W / count;
  const bars = [];
  for (let i = 0; i < count; i += 1) {
    const h = 6 + Math.round(rand() * 26);
    const dur = (0.9 + rand() * 1.2).toFixed(2);
    const delay = (-rand() * 2).toFixed(2);
    bars.push(`<rect class="bar" x="${(i * gap + gap / 2 - 2).toFixed(1)}" y="${24 - h / 2}" width="4" height="${h}" rx="2" style="animation-duration:${dur}s;animation-delay:${delay}s"/>`);
  }
  return bars.join('\n');
}

export default function footer(data, t) {
  const date = data.generatedAt.toLocaleDateString('pt-BR', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
  const style = `
.bar { transform-box: fill-box; transform-origin: center; animation: pulse 1.4s ease-in-out infinite alternate; }
@keyframes pulse { from { transform: scaleY(.3); } to { transform: scaleY(1); } }
`;
  const defs = `
<linearGradient id="brand" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${W}" y2="0">
  <stop offset="0" stop-color="${t.blue}" stop-opacity="0"/>
  <stop offset=".2" stop-color="${t.blue}"/>
  <stop offset=".8" stop-color="${t.purple}"/>
  <stop offset="1" stop-color="${t.purple}" stop-opacity="0"/>
</linearGradient>`;

  return svgDocument({
    width: W,
    height: H,
    title: 'Rodapé',
    desc: `Cards gerados a partir da API do GitHub em ${date}.`,
    style,
    defs,
    body: `<g fill="url(#brand)" opacity=".85" aria-hidden="true">${wave(t)}</g>
<text x="${W / 2}" y="82" text-anchor="middle" class="mono" font-size="14" fill="${t.muted}">feito com SVG, CSS e um pouco de carinho · atualizado automaticamente em ${date}</text>`,
  });
}
