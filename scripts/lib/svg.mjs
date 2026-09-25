// Shared SVG building blocks: themes, escaping, text helpers and icons.

export const themes = {
  dark: {
    name: 'dark',
    bg: '#0d1117',
    surface: '#161b22',
    surfaceAlt: '#1c2230',
    border: '#30363d',
    text: '#e6edf3',
    muted: '#8b949e',
    faint: '#484f58',
    blue: '#7aa2f7',
    purple: '#bb9af7',
    cyan: '#7dcfff',
    green: '#9ece6a',
    orange: '#ff9e64',
    red: '#f7768e',
    yellow: '#e0af68',
  },
  light: {
    name: 'light',
    bg: '#ffffff',
    surface: '#f6f8fa',
    surfaceAlt: '#eef1f6',
    border: '#d0d7de',
    text: '#1f2328',
    muted: '#59636e',
    faint: '#c4ccd6',
    blue: '#2e7de9',
    purple: '#9854f1',
    cyan: '#007197',
    green: '#587539',
    orange: '#b15c00',
    red: '#e5395b',
    yellow: '#8c6c3e',
  },
};

export const SANS = `'Segoe UI', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Arial, sans-serif`;
export const MONO = `ui-monospace, SFMono-Regular, 'SF Mono', 'Cascadia Code', Menlo, Consolas, 'Liberation Mono', monospace`;

const ENTITIES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const esc = (value) => String(value).replace(/[&<>"']/g, (c) => ENTITIES[c]);

export function compact(n) {
  if (n < 1000) return String(n);
  const value = n < 10000 ? (n / 1000).toFixed(1) : String(Math.round(n / 1000));
  return value.replace(/\.0$/, '') + 'k';
}

// Greedy word wrap by character budget; the last kept line gets an ellipsis
// when the text does not fit in `maxLines`.
export function wrap(text, maxChars, maxLines = Infinity) {
  const lines = [];
  let line = '';
  for (const word of text.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    kept[maxLines - 1] = kept[maxLines - 1].replace(/\s*\S*$/, '') + '…';
    return kept;
  }
  return lines;
}

// Deterministic pseudo-random sequence, so every run renders the same art.
export function seeded(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 2 ** 32;
  };
}

export function relativeTime(iso, now = new Date()) {
  const days = Math.floor((now - new Date(iso)) / 86_400_000);
  if (days <= 0) return 'hoje';
  if (days === 1) return 'ontem';
  if (days < 30) return `há ${days} dias`;
  const months = Math.floor(days / 30);
  if (months < 12) return months === 1 ? 'há 1 mês' : `há ${months} meses`;
  const years = Math.floor(days / 365);
  return years === 1 ? 'há 1 ano' : `há ${years} anos`;
}

// Octicons (MIT, GitHub) on a 16x16 grid.
export const icons = {
  repo: 'M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z',
  star: 'M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z',
  commit: 'M11.93 8.5a4.002 4.002 0 0 1-7.86 0H.75a.75.75 0 0 1 0-1.5h3.32a4.002 4.002 0 0 1 7.86 0h3.32a.75.75 0 0 1 0 1.5Zm-1.43-.75a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z',
  pullRequest: 'M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z',
  pulse: 'M6 2c.306 0 .582.187.696.471L10 10.731l1.304-3.26A.751.751 0 0 1 12 7h3.25a.75.75 0 0 1 0 1.5h-2.742l-1.812 4.528a.751.751 0 0 1-1.392 0L6 4.77 4.696 8.03A.75.75 0 0 1 4 8.5H.75a.75.75 0 0 1 0-1.5h2.742l1.812-4.529A.751.751 0 0 1 6 2Z',
  person: 'M10.561 8.073a6.005 6.005 0 0 1 3.432 5.142.75.75 0 1 1-1.498.07 4.5 4.5 0 0 0-8.99 0 .75.75 0 0 1-1.498-.07 6.004 6.004 0 0 1 3.431-5.142 3.999 3.999 0 1 1 5.123 0ZM10.5 5a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z',
  tag: 'M1 7.775V2.75C1 1.784 1.784 1 2.75 1h5.025c.464 0 .91.184 1.238.513l6.25 6.25a1.75 1.75 0 0 1 0 2.474l-5.026 5.026a1.75 1.75 0 0 1-2.474 0l-6.25-6.25A1.752 1.752 0 0 1 1 7.775Zm1.5 0c0 .066.026.13.073.177l6.25 6.25a.25.25 0 0 0 .354 0l5.025-5.025a.25.25 0 0 0 0-.354l-6.25-6.25a.25.25 0 0 0-.177-.073H2.75a.25.25 0 0 0-.25.25ZM6 5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z',
  flame: 'M9.533.753V.752c.217 2.385 1.463 3.626 2.653 4.81C13.37 6.74 14.498 7.863 14.498 10c0 3.5-3 6-6.5 6S1.5 13.512 1.5 10c0-1.298.536-2.56 1.425-3.286.376-.308.862 0 1.035.454C4.46 8.487 5.581 8.419 6 8c.282-.282.341-.811-.003-1.5C4.34 3.187 7.035.75 8.77.146c.39-.137.726.194.763.607ZM7.998 14.5c2.832 0 5-1.98 5-4.5 0-1.463-.68-2.19-1.879-3.383l-.036-.037c-1.013-1.008-2.3-2.29-2.834-4.434-.322.256-.63.579-.864.953-.432.696-.621 1.58-.046 2.73.473.947.67 2.284-.278 3.232-.61.61-1.545.84-2.403.633a2.79 2.79 0 0 1-1.436-.874A3.198 3.198 0 0 0 3 10c0 2.53 2.164 4.5 4.998 4.5Z',
  location: 'm12.596 11.596-3.535 3.536a1.5 1.5 0 0 1-2.122 0l-3.535-3.536a6.5 6.5 0 1 1 9.192-9.192 6.5 6.5 0 0 1 0 9.192Zm-1.06-8.132v-.001a5 5 0 1 0-7.072 7.072L8 14.07l3.536-3.534a5 5 0 0 0 0-7.072ZM8 9a2 2 0 1 1-.001-3.999A2 2 0 0 1 8 9Z',
  briefcase: 'M6.75 0h2.5C10.216 0 11 .784 11 1.75V3h3.25c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0 1 14.25 15H1.75A1.75 1.75 0 0 1 0 13.25v-8.5C0 3.784.784 3 1.75 3H5V1.75C5 .784 5.784 0 6.75 0ZM3.5 9.5a3.49 3.49 0 0 1-2-.627v4.377c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V8.873a3.49 3.49 0 0 1-2 .627Zm-1.75-5a.25.25 0 0 0-.25.25V6a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V4.75a.25.25 0 0 0-.25-.25H1.75ZM9.5 3V1.75a.25.25 0 0 0-.25-.25h-2.5a.25.25 0 0 0-.25.25V3Z',
  trophy: 'M3.217 6.962A3.75 3.75 0 0 1 0 3.25v-.5C0 1.784.784 1 1.75 1h1.356c.228-.585.796-1 1.462-1h6.864c.647 0 1.227.397 1.462 1h1.356c.966 0 1.75.784 1.75 1.75v.5a3.75 3.75 0 0 1-3.217 3.712 5.014 5.014 0 0 1-2.771 3.117l.144 1.446c.005.05.03.12.114.204.086.087.217.17.373.227.283.103.618.274.89.568.285.308.467.72.467 1.226v.75h1.25a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5H4v-.75c0-.505.182-.918.468-1.226.272-.294.606-.465.889-.568.139-.048.266-.126.373-.227.084-.085.109-.153.114-.204l.144-1.446a5.015 5.015 0 0 1-2.77-3.117ZM4.5 1.568V5.5a3.5 3.5 0 1 0 7 0V1.568a.068.068 0 0 0-.068-.068H4.568a.068.068 0 0 0-.068.068Zm2.957 8.902-.12 1.204c-.093.925-.858 1.47-1.467 1.691a.766.766 0 0 0-.3.176c-.037.04-.07.093-.07.21v.75h5v-.75c0-.117-.033-.17-.07-.21a.766.766 0 0 0-.3-.176c-.609-.221-1.374-.766-1.466-1.69l-.12-1.204a5.064 5.064 0 0 1-1.087 0ZM13 2.5v2.872a2.25 2.25 0 0 0 1.5-2.122v-.5a.25.25 0 0 0-.25-.25H13Zm-10 0H1.75a.25.25 0 0 0-.25.25v.5c0 .98.626 1.813 1.5 2.122Z',
  calendar: 'M4.75 0a.75.75 0 0 1 .75.75V2h5V.75a.75.75 0 0 1 1.5 0V2h1.25c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 13.25 16H2.75A1.75 1.75 0 0 1 1 14.25V3.75C1 2.784 1.784 2 2.75 2H4V.75A.75.75 0 0 1 4.75 0ZM2.5 7.5v6.75c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25V7.5Zm10.75-4H2.75a.25.25 0 0 0-.25.25V6h11V3.75a.25.25 0 0 0-.25-.25Z',
  law: 'M8.75.75V2h.985c.304 0 .603.08.867.231l1.29.736c.038.022.08.033.124.033h2.234a.75.75 0 0 1 0 1.5h-.427l2.111 4.692a.75.75 0 0 1-.154.838l-.53-.53.529.531-.001.002-.002.002-.006.006-.006.005-.01.01-.045.04c-.21.176-.441.327-.686.45C14.556 10.78 13.88 11 13 11a4.498 4.498 0 0 1-2.023-.454 3.544 3.544 0 0 1-.686-.45l-.045-.04-.016-.015-.006-.006-.004-.004v-.001a.75.75 0 0 1-.154-.838L12.178 4.5h-.162c-.305 0-.604-.079-.868-.231l-1.29-.736a.245.245 0 0 0-.124-.033H8.75V13h2.5a.75.75 0 0 1 0 1.5h-6.5a.75.75 0 0 1 0-1.5h2.5V3.5h-.984a.245.245 0 0 0-.124.033l-1.289.737c-.265.15-.564.23-.869.23h-.162l2.112 4.692a.75.75 0 0 1-.154.838l-.53-.53.529.531-.001.002-.002.002-.006.006-.016.015-.045.04c-.21.176-.441.327-.686.45C4.556 10.78 3.88 11 3 11a4.498 4.498 0 0 1-2.023-.454 3.544 3.544 0 0 1-.686-.45l-.045-.04-.016-.015-.006-.006-.004-.004v-.001a.75.75 0 0 1-.154-.838L2.178 4.5H1.75a.75.75 0 0 1 0-1.5h2.234a.249.249 0 0 0 .125-.033l1.288-.737c.265-.15.564-.23.869-.23h.984V.75a.75.75 0 0 1 1.5 0Zm2.945 8.477c.285.135.718.273 1.305.273s1.02-.138 1.305-.273L13 6.327Zm-10 0c.285.135.718.273 1.305.273s1.02-.138 1.305-.273L3 6.327Z',
};

export function icon(name, x, y, size, fill) {
  const scale = size / 16;
  return `<path transform="translate(${x} ${y}) scale(${scale})" d="${icons[name]}" fill="${fill}"/>`;
}

// Every card shares the same frame: accessible title, theme-aware styles and
// a reduced-motion escape hatch.
export function svgDocument({ width, height, title, desc = '', style = '', defs = '', body }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="t d">
<title id="t">${esc(title)}</title>
<desc id="d">${esc(desc)}</desc>
<style>
text { font-family: ${SANS}; }
.mono { font-family: ${MONO}; }
.fade-up { opacity: 0; animation: fade-up .6s cubic-bezier(.2,.7,.2,1) forwards; }
@keyframes fade-up { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
${style}
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; opacity: 1 !important; } }
</style>
<defs>${defs}</defs>
${body}
</svg>
`;
}

export function card(t, width, height) {
  return `<rect x=".5" y=".5" width="${width - 1}" height="${height - 1}" rx="12" fill="${t.surface}" stroke="${t.border}"/>`;
}
