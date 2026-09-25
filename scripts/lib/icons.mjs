// Technology icons, embedded as data URIs because an SVG shown through <img>
// cannot load anything external.
//
// Most icons come from skillicons.dev. The ones it does not have are drawn
// as matching tiles from Simple Icons paths.

const SKILL = 'https://skillicons.dev/icons';
const SIMPLE = 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons';

// Tile colors match skillicons' own dark and light themes.
const TILE = { dark: '#242938', light: '#f4f2ed' };

const CUSTOM = {
  juce: { color: '#8dc63f' },
  expo: { color: { dark: '#ffffff', light: '#000020' } },
  wails: { color: '#df0000' },
  railway: { color: { dark: '#ffffff', light: '#0b0d0e' } },
  mariadb: { color: { dark: '#c0765a', light: '#003545' } },
  drizzle: { color: { dark: '#c5f74f', light: '#3c4a10' } },
};

const cache = new Map();

async function text(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`icon request failed: ${response.status} ${url}`);
  return response.text();
}

async function customTile(id, theme) {
  const source = await text(`${SIMPLE}/${id}.svg`);
  const d = source.match(/<path d="([^"]+)"/)?.[1];
  if (!d) throw new Error(`no path in simple-icons/${id}`);
  const { color } = CUSTOM[id];
  const fill = typeof color === 'string' ? color : color[theme];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><rect width="256" height="256" rx="60" fill="${TILE[theme]}"/><path transform="translate(52 52) scale(6.333)" d="${d}" fill="${fill}"/></svg>`;
}

export async function iconUri(id, theme) {
  const key = `${id}:${theme}`;
  if (!cache.has(key)) {
    const svg = id in CUSTOM ? await customTile(id, theme) : await text(`${SKILL}?i=${id}&theme=${theme}`);
    cache.set(key, `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`);
  }
  return cache.get(key);
}

// Resolves every id for both themes up front, so the renderers stay synchronous.
export async function loadIcons(ids, themes) {
  const table = {};
  for (const theme of themes) {
    table[theme] = {};
    await Promise.all(
      [...new Set(ids)].map(async (id) => {
        table[theme][id] = await iconUri(id, theme);
      }),
    );
  }
  return table;
}
