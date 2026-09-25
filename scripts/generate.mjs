// Renders every profile card in a dark and a light variant.
//
//   GITHUB_TOKEN=... node scripts/generate.mjs [outDir]
//
// The workflow publishes the output directory to the `output` branch, which
// the README references through <picture> elements.

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import config from './profile.config.mjs';
import { fetchProfile } from './lib/github.mjs';
import { loadIcons } from './lib/icons.mjs';
import { themes } from './lib/svg.mjs';
import header from './cards/header.mjs';
import about from './cards/about.mjs';
import stack from './cards/stack.mjs';
import stats from './cards/stats.mjs';
import languages from './cards/languages.mjs';
import activity from './cards/activity.mjs';
import project from './cards/project.mjs';
import footer from './cards/footer.mjs';

const outDir = process.argv[2] ?? 'dist';
const MIME = { '.png': 'image/png', '.svg': 'image/svg+xml' };

async function dataUri(path) {
  const bytes = await readFile(path);
  return `data:${MIME[extname(path)]};base64,${bytes.toString('base64')}`;
}

const iconIds = [
  ...config.heroIcons,
  ...config.about.flatMap((a) => a.icons),
  ...Object.values(config.stack).flat(),
  ...config.featured.flatMap((f) => f.icons),
];

const [data, icons] = await Promise.all([
  fetchProfile(config.login, config.featured.map((f) => f.repo)),
  loadIcons(iconIds, Object.keys(themes)),
]);

const cards = {
  header: (t) => header(config, t, icons[t.name]),
  about: (t) => about(config, t, icons[t.name]),
  stats: (t) => stats(data, t),
  languages: (t) => languages(data, t, config.languages),
  activity: (t) => activity(data, t),
  footer: (t) => footer(data, t),
};

for (const [row, ids] of Object.entries(config.stack)) {
  cards[`stack-${row}`] = (t) => stack(ids, t, icons[t.name], row);
}

for (const entry of config.featured) {
  const repo = data.featured[entry.repo];
  if (!repo) {
    console.warn(`skipping ${entry.repo}: repository not found or not visible to this token`);
    continue;
  }
  const logo = await dataUri(entry.logo);
  cards[`project-${entry.repo.toLowerCase()}`] = (t) =>
    project(repo, entry, t, { now: data.generatedAt, logo, icons: icons[t.name] });
}

await mkdir(outDir, { recursive: true });

const files = [];
for (const [name, render] of Object.entries(cards)) {
  for (const theme of Object.values(themes)) {
    const file = `${name}-${theme.name}.svg`;
    await writeFile(join(outDir, file), render(theme));
    files.push({ name, theme: theme.name, file });
  }
}

// Local preview only; GitHub never serves this page.
const WIDE = ['header', 'about', 'activity', 'footer'];
const preview = Object.values(themes)
  .map(
    (theme) => `<section style="background:${theme.bg};padding:32px;display:grid;gap:16px;grid-template-columns:repeat(2,minmax(0,1fr))">
${files
  .filter((f) => f.theme === theme.name)
  .map((f) => {
    if (f.name.startsWith('stack-')) return `<div style="grid-column:1/-1"><img src="${f.file}" alt="${f.name}" height="40"></div>`;
    return `<img src="${f.file}" alt="${f.name}" style="width:100%;${WIDE.includes(f.name) ? 'grid-column:1/-1' : ''}">`;
  })
  .join('\n')}
</section>`,
  )
  .join('\n');
await writeFile(
  join(outDir, 'preview.html'),
  `<!doctype html><meta charset="utf-8"><title>Profile cards</title><body style="margin:0;max-width:1000px">${preview}</body>`,
);

console.log(`rendered ${files.length} files into ${outDir}/`);
