import { svgDocument, esc, icon, seeded } from '../lib/svg.mjs';

const W = 1200;
const H = 340;

const TERM = { x: 640, y: 36, w: 510, h: 268 };
const LINE_H = 24;
const CHAR_W = 9; // 15px monospace advance, used only to pace the typing
const TYPE_SPEED = 0.055; // seconds per character

// Typewriter effect: a clip rect grows one character at a time (SMIL keeps it
// working inside <img>, where scripts never run). The last step jumps far past
// the text so wider fallback fonts are never cut off.
function typedLine(id, x, y, text, begin) {
  const steps = text.length;
  const values = Array.from({ length: steps }, (_, i) => i * CHAR_W).concat(TERM.w);
  const dur = Math.max(steps * TYPE_SPEED, 0.1);
  return {
    clip: `<clipPath id="${id}"><rect x="${x}" y="${y - 17}" height="${LINE_H}" width="0">
      <animate attributeName="width" values="${values.join(';')}" dur="${dur.toFixed(2)}s" begin="${begin.toFixed(2)}s" calcMode="discrete" fill="freeze"/>
    </rect></clipPath>`,
    end: begin + dur,
  };
}

function appear(begin) {
  return `<set attributeName="opacity" to="1" begin="${begin.toFixed(2)}s" fill="freeze"/>`;
}

function equalizer(t, x, baseline, count) {
  const rand = seeded(7);
  const bars = [];
  for (let i = 0; i < count; i += 1) {
    const h = 10 + Math.round(rand() * 34);
    const dur = (0.7 + rand() * 0.9).toFixed(2);
    const delay = (-rand() * 2).toFixed(2);
    bars.push(
      `<rect class="bar" x="${x + i * 14}" y="${baseline - h}" width="8" height="${h}" rx="3" fill="url(#bars)" style="animation-duration:${dur}s;animation-delay:${delay}s"/>`,
    );
  }
  return bars.join('\n');
}

export default function header(config, t) {
  const clips = [];
  const lines = [];
  let clock = 0.6;
  let y = TERM.y + 58;
  const textX = TERM.x + 22;

  config.terminal.forEach((entry, i) => {
    const typed = typedLine(`type${i}`, textX + 18, y, entry.cmd, clock);
    clips.push(typed.clip);
    lines.push(`<g opacity="0">${appear(clock - 0.05)}
      <text x="${textX}" y="${y}" class="mono" font-size="15" font-weight="700" fill="${t.green}">$</text>
      <text x="${textX + 18}" y="${y}" class="mono" font-size="15" fill="${t.text}" clip-path="url(#type${i})">${esc(entry.cmd)}</text>
    </g>`);
    clock = typed.end + 0.25;
    y += LINE_H;

    lines.push(`<g opacity="0">${appear(clock)}
      <text x="${textX}" y="${y}" class="mono" font-size="15" xml:space="preserve" fill="${t[entry.color] ?? t.text}">${esc(entry.out)}</text>
    </g>`);
    clock += 0.45;
    y += LINE_H;
  });

  const cursor = `<g opacity="0">${appear(clock)}
    <text x="${textX}" y="${y}" class="mono" font-size="15" font-weight="700" fill="${t.green}">$</text>
    <rect class="cursor" x="${textX + 18}" y="${y - 14}" width="9" height="18" fill="${t.text}"/>
  </g>`;

  const style = `
.bar { transform-box: fill-box; transform-origin: 50% 100%; animation: eq 1.2s ease-in-out infinite alternate; }
@keyframes eq { 0% { transform: scaleY(.25); } 100% { transform: scaleY(1); } }
.cursor { animation: blink 1s steps(1) infinite; }
@keyframes blink { 50% { opacity: 0; } }
.glow { animation: drift 14s ease-in-out infinite alternate; transform-box: fill-box; transform-origin: center; }
@keyframes drift { from { transform: translate(0, 0) scale(1); } to { transform: translate(40px, 12px) scale(1.12); } }
.intro-1 { animation-delay: .05s; } .intro-2 { animation-delay: .2s; } .intro-3 { animation-delay: .35s; } .intro-4 { animation-delay: .5s; }
`;

  const defs = `
<linearGradient id="brand" x1="0" y1="0" x2="1" y2="0">
  <stop offset="0" stop-color="${t.blue}"/><stop offset="1" stop-color="${t.purple}"/>
</linearGradient>
<linearGradient id="bars" gradientUnits="userSpaceOnUse" x1="64" y1="0" x2="456" y2="0">
  <stop offset="0" stop-color="${t.blue}"/><stop offset="1" stop-color="${t.purple}"/>
</linearGradient>
<radialGradient id="glowA"><stop offset="0" stop-color="${t.blue}" stop-opacity=".28"/><stop offset="1" stop-color="${t.blue}" stop-opacity="0"/></radialGradient>
<radialGradient id="glowB"><stop offset="0" stop-color="${t.purple}" stop-opacity=".24"/><stop offset="1" stop-color="${t.purple}" stop-opacity="0"/></radialGradient>
<pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
  <path d="M32 0H0V32" fill="none" stroke="${t.border}" stroke-width="1" opacity=".45"/>
</pattern>
<clipPath id="frame"><rect width="${W}" height="${H}" rx="16"/></clipPath>
${clips.join('\n')}`;

  const tracks = config.tracks.join('  ·  ');

  const body = `
<g clip-path="url(#frame)">
  <rect width="${W}" height="${H}" fill="${t.bg}"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  <circle class="glow" cx="220" cy="80" r="360" fill="url(#glowA)"/>
  <circle class="glow" cx="1040" cy="300" r="380" fill="url(#glowB)" style="animation-direction:alternate-reverse"/>
</g>
<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="16" fill="none" stroke="${t.border}"/>

<g class="fade-up intro-1"><text x="64" y="96" class="mono" font-size="16" fill="${t.blue}">~/${esc(config.login)}</text></g>
<g class="fade-up intro-2"><text x="62" y="164" font-size="64" font-weight="700" fill="url(#brand)" letter-spacing="-1.5">${esc(config.name)}</text></g>
<g class="fade-up intro-3">
  <text x="64" y="206" font-size="22" font-weight="600" fill="${t.text}">${esc(config.role)}<tspan fill="${t.muted}" font-weight="400">  ·  ${esc(tracks)}</tspan></text>
</g>
<g class="fade-up intro-4" font-size="15" fill="${t.muted}">
  ${icon('briefcase', 64, 229, 16, t.muted)}
  <text x="88" y="242">${esc(config.company)}</text>
  ${icon('location', 330, 229, 16, t.muted)}
  <text x="354" y="242">${esc(config.location)}</text>
</g>
<g aria-hidden="true">${equalizer(t, 64, 300, 28)}</g>

<g class="fade-up intro-2">
  <rect x="${TERM.x}" y="${TERM.y}" width="${TERM.w}" height="${TERM.h}" rx="12" fill="${t.surface}" stroke="${t.border}"/>
  <path d="M${TERM.x} ${TERM.y + 34}h${TERM.w}" stroke="${t.border}"/>
  <circle cx="${TERM.x + 20}" cy="${TERM.y + 17}" r="6" fill="${t.red}"/>
  <circle cx="${TERM.x + 40}" cy="${TERM.y + 17}" r="6" fill="${t.yellow}"/>
  <circle cx="${TERM.x + 60}" cy="${TERM.y + 17}" r="6" fill="${t.green}"/>
  <text x="${TERM.x + TERM.w / 2}" y="${TERM.y + 22}" text-anchor="middle" class="mono" font-size="13" fill="${t.muted}">${esc(config.login)}@github: ~</text>
</g>
${lines.join('\n')}
${cursor}`;

  return svgDocument({
    width: W,
    height: H,
    title: `${config.name}, ${config.role}`,
    desc: `${config.role} working on ${tracks}. ${config.terminal.map((l) => l.out).join('. ')}.`,
    style,
    defs,
    body,
  });
}
