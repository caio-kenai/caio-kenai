import { svgDocument } from '../lib/svg.mjs';

const SIZE = 48;
const GAP = 10;

// One row of the tech stack table: icons pop in one after another.
export default function stack(ids, t, icons, label) {
  const width = ids.length * SIZE + (ids.length - 1) * GAP;
  const body = ids
    .map(
      (id, i) =>
        `<image class="pop" style="animation-delay:${(0.05 + i * 0.07).toFixed(2)}s" href="${icons[id]}" x="${i * (SIZE + GAP)}" y="0" width="${SIZE}" height="${SIZE}"><title>${id}</title></image>`,
    )
    .join('\n');

  return svgDocument({
    width,
    height: SIZE,
    title: label,
    desc: ids.join(', '),
    style: `
.pop { opacity: 0; transform-box: fill-box; transform-origin: center; animation: pop .45s cubic-bezier(.3,1.5,.5,1) forwards; }
@keyframes pop { from { opacity: 0; transform: scale(.5) translateY(6px); } to { opacity: 1; transform: none; } }
`,
    body,
  });
}
