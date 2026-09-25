import { svgDocument, card, esc, icon, compact } from '../lib/svg.mjs';

const W = 480;
const H = 230;

export default function stats(data, t) {
  const items = [
    { label: 'Contributions, last year', value: data.contributionsLastYear, icon: 'pulse', color: t.blue },
    { label: 'Commits, last year', value: data.commitsLastYear, icon: 'commit', color: t.purple },
    { label: 'Pull requests', value: data.pullRequests, icon: 'pullRequest', color: t.green },
    { label: 'Stars earned', value: data.stars, icon: 'star', color: t.yellow },
    { label: 'Public repositories', value: data.publicRepos, icon: 'repo', color: t.cyan },
    { label: 'Followers', value: data.followers, icon: 'person', color: t.orange },
  ];

  const cells = items
    .map((item, i) => {
      const x = 24 + (i % 2) * 226;
      const y = 68 + Math.floor(i / 2) * 52;
      return `<g class="fade-up" style="animation-delay:${(0.1 + i * 0.08).toFixed(2)}s">
  <rect x="${x}" y="${y}" width="36" height="36" rx="9" fill="${item.color}" fill-opacity=".14"/>
  ${icon(item.icon, x + 10, y + 10, 16, item.color)}
  <text x="${x + 48}" y="${y + 14}" font-size="12.5" fill="${t.muted}">${esc(item.label)}</text>
  <text x="${x + 48}" y="${y + 34}" font-size="20" font-weight="700" fill="${t.text}">${compact(item.value)}</text>
</g>`;
    })
    .join('\n');

  return svgDocument({
    width: W,
    height: H,
    title: 'GitHub stats',
    desc: items.map((i) => `${i.label}: ${i.value}`).join(', '),
    body: `${card(t, W, H)}
<text x="24" y="40" font-size="17" font-weight="600" fill="${t.text}">GitHub stats</text>
<text x="${W - 24}" y="40" text-anchor="end" class="mono" font-size="12.5" fill="${t.muted}">@${esc(data.login)}</text>
${cells}`,
  });
}
