import { svgDocument, esc, icon } from '../lib/svg.mjs';

const W = 1200;
const H = 400;
const WIN = { x: 690, y: 64, w: 430, h: 272 };
const LOOP = 7; // seconds of the cursor/click loop inside the mock browser

// Rotating role carousel: each phrase owns a slice of one shared loop.
function roles(t, list) {
  const total = list.length * 3;
  const slice = 100 / list.length;
  const style = `@keyframes role { 0% { opacity: 0; transform: translateY(14px); } 4%, ${(slice - 5).toFixed(1)}% { opacity: 1; transform: none; } ${slice.toFixed(1)}%, 100% { opacity: 0; transform: translateY(-14px); } }
.role { opacity: 0; animation: role ${total}s cubic-bezier(.2,.7,.2,1) infinite; }`;
  const markup = list
    .map((text, i) => `<text class="role" x="72" y="272" font-size="30" font-weight="600" fill="${t.text}" style="animation-delay:${i * 3}s">${esc(text)}</text>`)
    .join('\n');
  return { style, markup };
}

// Mini web page that assembles itself, then a cursor keeps clicking around.
function browser(t) {
  const { x, y, w, h } = WIN;
  const cx = x + 22;
  const top = y + 52;
  const at = (s) => `style="animation-delay:${s}s"`;
  const bar = (bx, by, bw, bh, fill, delay) =>
    `<rect class="pop" ${at(delay)} x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="${bh / 2}" fill="${fill}"/>`;

  const cards = [0, 1, 2]
    .map((i) => {
      const kx = cx + i * 132;
      const ky = top + 118;
      return `<g class="pop" ${at(1.3 + i * 0.18)}>
  <rect x="${kx}" y="${ky}" width="120" height="84" rx="12" fill="${t.surfaceAlt}" stroke="${t.border}"/>
  <rect x="${kx + 12}" y="${ky + 12}" width="26" height="26" rx="8" fill="${[t.blue, t.purple, t.cyan][i]}" fill-opacity=".85"/>
  <rect x="${kx + 12}" y="${ky + 48}" width="84" height="8" rx="4" fill="${t.faint}"/>
  <rect x="${kx + 12}" y="${ky + 63}" width="56" height="8" rx="4" fill="${t.faint}" opacity=".7"/>
  <g clip-path="url(#card${i})"><rect class="shimmer" x="${kx}" y="${ky}" width="60" height="84" fill="url(#skeleton)" style="animation-delay:${i * 0.2}s"/></g>
</g>`;
    })
    .join('\n');

  const btn = { x: cx, y: top + 70, w: 112, h: 30 };
  const toggle = { x: x + w - 70, y: top + 4, w: 44, h: 22 };
  const clickA = [btn.x + btn.w / 2, btn.y + btn.h / 2 + 4];
  const clickB = [toggle.x + toggle.w / 2, toggle.y + toggle.h / 2];
  const rest = [x + w - 60, y + h - 40];
  const path = `M${rest[0]} ${rest[1]} Q${clickA[0] + 120} ${clickA[1] + 90} ${clickA[0]} ${clickA[1]} Q${clickA[0] + 140} ${clickB[1] - 30} ${clickB[0]} ${clickB[1]} Q${rest[0] + 30} ${(clickB[1] + rest[1]) / 2} ${rest[0]} ${rest[1]}`;
  const begin = 2.2;
  const loop = `dur="${LOOP}s" begin="${begin}s" repeatCount="indefinite"`;

  const ripple = ([px, py], k) => {
    const times = `0;${k};${(k + 0.08).toFixed(2)};1`;
    return `<circle cx="${px}" cy="${py}" r="0" fill="none" stroke="${t.text}" stroke-width="2" opacity="0">
    <animate attributeName="r" values="0;0;18;18" keyTimes="${times}" ${loop}/>
    <animate attributeName="opacity" values="0;.7;0;0" keyTimes="${times}" ${loop}/>
  </circle>`;
  };

  return `
<g class="pop" ${at(0.15)}>
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="${t.surface}" fill-opacity=".88" stroke="url(#edge)" stroke-width="1.5" filter="url(#shadow)"/>
</g>
<g class="pop" ${at(0.25)}>
  <circle cx="${x + 20}" cy="${y + 20}" r="5.5" fill="${t.red}"/>
  <circle cx="${x + 38}" cy="${y + 20}" r="5.5" fill="${t.yellow}"/>
  <circle cx="${x + 56}" cy="${y + 20}" r="5.5" fill="${t.green}"/>
  <rect x="${x + w / 2 - 70}" y="${y + 10}" width="140" height="20" rx="10" fill="${t.surfaceAlt}"/>
  <text x="${x + w / 2}" y="${y + 24}" text-anchor="middle" class="mono" font-size="11.5" fill="${t.muted}">kenai.site</text>
</g>
<path d="M${x} ${y + 40}h${w}" stroke="${t.border}"/>
<circle class="pop" ${at(0.45)} cx="${cx + 10}" cy="${top + 15}" r="10" fill="url(#brand)"/>
${bar(cx + 28, top + 11, 60, 8, t.faint, 0.5)}
<g class="pop" ${at(0.6)}>
  <rect x="${toggle.x}" y="${toggle.y}" width="${toggle.w}" height="${toggle.h}" rx="11" fill="${t.faint}">
    <animate attributeName="fill" values="${t.faint};${t.faint};${t.purple};${t.purple};${t.faint}" keyTimes="0;.52;.56;.96;1" ${loop}/>
  </rect>
  <circle cx="${toggle.x + 11}" cy="${toggle.y + 11}" r="8" fill="#ffffff">
    <animate attributeName="cx" values="${toggle.x + 11};${toggle.x + 11};${toggle.x + 33};${toggle.x + 33};${toggle.x + 11}" keyTimes="0;.52;.56;.96;1" ${loop}/>
  </circle>
</g>
${bar(cx, top + 38, 250, 14, 'url(#brand)', 0.75)}
${bar(cx, top + 60, 180, 8, t.faint, 0.9)}
<g class="pop" ${at(1.05)}>
  <rect x="${btn.x}" y="${btn.y + 4}" width="${btn.w}" height="${btn.h}" rx="15" fill="url(#brand)">
    <animate attributeName="opacity" values="1;1;.6;1;1" keyTimes="0;.24;.27;.32;1" ${loop}/>
  </rect>
  <text x="${btn.x + btn.w / 2}" y="${btn.y + 24}" text-anchor="middle" font-size="12.5" font-weight="700" fill="#ffffff">Ver projetos</text>
</g>
${cards}
${ripple(clickA, 0.24)}
${ripple(clickB, 0.52)}
<g opacity="0">
  <set attributeName="opacity" to="1" begin="${begin}s" fill="freeze"/>
  <path d="M0 0 L0 17 L4.6 12.8 L7.6 19.4 L10.4 18.1 L7.5 11.7 L13.4 11.4 Z" fill="${t.text}" stroke="${t.bg}" stroke-width="1.4" stroke-linejoin="round">
    <animateMotion path="${path}" keyPoints="0;.33;.33;.66;.66;1;1" keyTimes="0;.2;.3;.48;.6;.85;1" calcMode="spline" keySplines=".4 0 .2 1;0 0 1 1;.4 0 .2 1;0 0 1 1;.4 0 .2 1;0 0 1 1" ${loop}/>
  </path>
</g>`;
}

// Technology bubbles floating around the browser, each on its own rhythm.
function orbit(t, icons) {
  const spots = [
    [648, 34, 5.2, 0],
    [1094, 26, 6.1, -1.2],
    [1136, 180, 4.8, -2.4],
    [1068, 318, 5.6, -0.6],
    [858, 332, 6.4, -3],
    [640, 258, 5, -1.8],
  ];
  return icons
    .slice(0, spots.length)
    .map((href, i) => {
      const [x, y, dur, delay] = spots[i];
      return `<g class="float" style="animation-duration:${dur}s;animation-delay:${delay}s">
  <g class="pop" style="animation-delay:${(0.5 + i * 0.12).toFixed(2)}s">
    <rect x="${x - 6}" y="${y - 6}" width="60" height="60" rx="18" fill="${t.surface}" fill-opacity=".92" stroke="${t.border}" filter="url(#shadow)"/>
    <image href="${href}" x="${x + 2}" y="${y + 2}" width="44" height="44"/>
  </g>
</g>`;
    })
    .join('\n');
}

export default function header(config, t, icons) {
  const carousel = roles(t, config.roles);
  const dark = t.name === 'dark';

  const style = `
.pop { opacity: 0; transform-box: fill-box; transform-origin: center; animation: pop .55s cubic-bezier(.3,1.4,.5,1) forwards; }
@keyframes pop { from { opacity: 0; transform: scale(.85) translateY(10px); } to { opacity: 1; transform: none; } }
.float { animation: float 5s ease-in-out infinite alternate; }
@keyframes float { from { transform: translateY(-7px); } to { transform: translateY(7px); } }
.blob { animation: drift 16s ease-in-out infinite alternate; }
@keyframes drift { from { transform: translate(0, 0); } to { transform: translate(60px, 30px); } }
.shimmer { animation: sweep 2.4s ease-in-out infinite; }
@keyframes sweep { from { transform: translateX(-70px); } to { transform: translateX(140px); } }
.dot { animation: ping 2s ease-out infinite; transform-box: fill-box; transform-origin: center; }
@keyframes ping { 0% { transform: scale(1); opacity: .6; } 100% { transform: scale(2.8); opacity: 0; } }
.underline { animation: grow 1s cubic-bezier(.2,.7,.2,1) .5s both; transform-box: fill-box; transform-origin: left; }
@keyframes grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
${carousel.style}
`;

  const cardClips = [0, 1, 2]
    .map((i) => `<clipPath id="card${i}"><rect x="${WIN.x + 22 + i * 132}" y="${WIN.y + 170}" width="120" height="84" rx="12"/></clipPath>`)
    .join('');

  const defs = `
<linearGradient id="brand" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0" stop-color="${t.blue}"/><stop offset="1" stop-color="${t.purple}"/>
</linearGradient>
<linearGradient id="shine" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="520" y2="0" spreadMethod="repeat">
  <stop offset="0" stop-color="${t.blue}"/>
  <stop offset=".35" stop-color="${t.purple}"/>
  <stop offset=".65" stop-color="${t.cyan}"/>
  <stop offset="1" stop-color="${t.blue}"/>
  <animateTransform attributeName="gradientTransform" type="translate" from="0 0" to="520 0" dur="7s" repeatCount="indefinite"/>
</linearGradient>
<linearGradient id="edge" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0" stop-color="${t.blue}" stop-opacity=".8"/>
  <stop offset=".5" stop-color="${t.border}"/>
  <stop offset="1" stop-color="${t.purple}" stop-opacity=".8"/>
</linearGradient>
<linearGradient id="skeleton" x1="0" y1="0" x2="1" y2="0">
  <stop offset="0" stop-color="#ffffff" stop-opacity="0"/>
  <stop offset=".5" stop-color="#ffffff" stop-opacity="${dark ? '.08' : '.6'}"/>
  <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
</linearGradient>
<radialGradient id="fade" cx=".62" cy=".45" r=".6">
  <stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/>
</radialGradient>
<mask id="dotMask"><rect width="${W}" height="${H}" fill="url(#fade)"/></mask>
<pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse">
  <circle cx="2" cy="2" r="1.2" fill="${t.muted}" opacity=".5"/>
</pattern>
<filter id="blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="70"/></filter>
<filter id="shadow" x="-30%" y="-30%" width="160%" height="170%">
  <feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="#000" flood-opacity="${dark ? '.45' : '.12'}"/>
</filter>
<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 .6 0"/></filter>
<clipPath id="frame"><rect width="${W}" height="${H}" rx="20"/></clipPath>
${cardClips}`;

  const body = `
<g clip-path="url(#frame)">
  <rect width="${W}" height="${H}" fill="${t.bg}"/>
  <g filter="url(#blur)" opacity="${dark ? '.5' : '.35'}">
    <circle class="blob" cx="260" cy="80" r="200" fill="${t.blue}"/>
    <circle class="blob" cx="900" cy="360" r="220" fill="${t.purple}" style="animation-direction:alternate-reverse;animation-duration:19s"/>
    <circle class="blob" cx="1100" cy="40" r="140" fill="${t.cyan}" style="animation-duration:13s"/>
  </g>
  <rect width="${W}" height="${H}" fill="url(#dots)" mask="url(#dotMask)"/>
  <rect width="${W}" height="${H}" filter="url(#grain)" opacity=".05"/>
</g>
<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="20" fill="none" stroke="${t.border}"/>

<g class="fade-up" style="animation-delay:.05s">
  <rect x="72" y="66" width="178" height="30" rx="15" fill="${t.surface}" fill-opacity=".85" stroke="${t.border}"/>
  <circle class="dot" cx="92" cy="81" r="4.5" fill="${t.green}"/>
  <circle cx="92" cy="81" r="4.5" fill="${t.green}"/>
  <text x="106" y="86" font-size="13.5" fill="${t.text}">${esc(config.location)} · Brasil</text>
</g>
<g class="fade-up" style="animation-delay:.15s"><text x="72" y="146" font-size="24" fill="${t.muted}">${esc(config.greeting)}</text></g>
<g class="fade-up" style="animation-delay:.25s"><text x="68" y="218" font-size="76" font-weight="800" letter-spacing="-2" fill="url(#shine)">${esc(config.name)}</text></g>
<rect class="underline" x="72" y="232" width="120" height="5" rx="2.5" fill="url(#brand)"/>
${carousel.markup}
<g class="fade-up" style="animation-delay:.45s" font-size="16" fill="${t.muted}">
  ${icon('briefcase', 72, 309, 16, t.muted)}
  <text x="96" y="322">Hoje na <tspan fill="${t.text}" font-weight="600">${esc(config.company)}</tspan></text>
</g>

${browser(t)}
${orbit(t, config.heroIcons.map((id) => icons[id]))}`;

  return svgDocument({
    width: W,
    height: H,
    title: `${config.name}, ${config.roles[0]}`,
    desc: `${config.greeting} ${config.name}. ${config.roles.join('. ')}. ${config.location}.`,
    style,
    defs,
    body,
  });
}
