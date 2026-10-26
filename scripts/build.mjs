import { readFile, readdir, mkdir, writeFile, copyFile, unlink } from 'node:fs/promises';
import { marked } from 'marked';

const site = JSON.parse(await readFile('site.json', 'utf8'));
const esc = (s = '') => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
function webUrl(value) {
  if (!value) return '';
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error(`Use an https:// address: ${value}`);
  return esc(url.href);
}
const name = site.name.trim() || 'Your name';
const intro = site.intro.trim() || 'Projects, notes, and things I’m learning.';
const footer = [
  site.github && `<a href="${webUrl(site.github)}">GitHub</a>`,
  site.linkedin && `<a href="${webUrl(site.linkedin)}">LinkedIn</a>`,
  site.email && `<a href="mailto:${esc(site.email)}">Email</a>`
].filter(Boolean).join('');
function page(title, body, prefix = './', lang = 'en', description = intro) {
  return `<!doctype html>
<html lang="${esc(lang)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${esc(description)}"><title>${esc(title)}</title><link rel="stylesheet" href="${prefix}assets/style.css"></head>
<body><a class="skip" href="#main">Skip to content</a><div class="page">${body}<footer>${footer}</footer></div></body></html>`;
}
const posts = [];
for (const file of await readdir('posts')) {
  if (!file.endsWith('.md')) continue;
  const source = (await readFile(`posts/${file}`, 'utf8')).replace(/\r\n/g, '\n');
  const match = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error(`Missing metadata: ${file}`);
  const meta = {};
  for (const line of match[1].split('\n')) {
    const split = line.indexOf(':');
    if (split < 1) continue;
    meta[line.slice(0, split).trim()] = line.slice(split + 1).trim().replace(/^(["'])(.*)\1$/, '$2');
  }
  if (meta.draft === 'true') continue;
  if (!meta.title || !/^\d{4}-\d{2}-\d{2}$/.test(meta.date) || Number.isNaN(Date.parse(meta.date))) throw new Error(`Check title/date: ${file}`);
  const slug = file.replace(/\.md$/, '');
  if (!/^[a-zA-Z0-9_-]+$/.test(slug)) throw new Error(`Use English letters, numbers and hyphens for filename: ${file}`);
  const html = marked.parse(match[2]);
  posts.push({ ...meta, slug, html });
}
posts.sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
await mkdir('dist/assets', { recursive: true });
await mkdir('dist/posts', { recursive: true });
// Remove only previously generated post HTML so deleted/draft posts disappear on rebuild.
for (const old of await readdir('dist/posts')) {
  if (/^[a-zA-Z0-9_-]+\.html$/.test(old)) await unlink(`dist/posts/${old}`);
}
await copyFile('assets/style.css', 'dist/assets/style.css');
await writeFile('dist/.nojekyll', '');
for (const post of posts) {
  await writeFile(`dist/posts/${post.slug}.html`, page(`${post.title} — ${name}`, `<header><a href="../index.html">${esc(name)}</a></header><main id="main"><h1>${esc(post.title)}</h1><time datetime="${esc(post.date)}">${esc(post.date)}</time><article>${post.html}</article><p><a href="../index.html#writing">← All writing</a></p></main>`, '../', post.lang || 'en', post.title));
}
const projectGroups = new Map();
for (const project of site.projects) {
  const category = project.category?.trim() || 'Other';
  if (!projectGroups.has(category)) projectGroups.set(category, []);
  projectGroups.get(category).push(project);
}
const projects = [...projectGroups].map(([category, items]) => `
  <div class="project-group" data-category="${esc(category.toLowerCase())}">
    <h3>${esc(category)}</h3>
    <ul class="plain projects">
      ${items.map(p => `
        <li>
          ${p.url
            ? `<a href="${webUrl(p.url)}">${esc(p.title)} <span aria-hidden="true">↗</span></a>`
            : `<span>${esc(p.title)}</span><span class="status">In progress</span>`
          }
          ${p.description
            ? `<span class="muted">${esc(p.description)}</span>`
            : ''
          }
        </li>
      `).join('')}
    </ul>
  </div>
`).join('');
const writing = posts.map(p => `<li><time datetime="${esc(p.date)}">${esc(p.date)}</time><a href="./posts/${p.slug}.html" lang="${esc(p.lang || 'en')}">${esc(p.title)}</a></li>`).join('');
await writeFile('dist/index.html', page(name, `<header><h1>${esc(name)}</h1>${site.role ? `<p>${esc(site.role)}</p>` : ''}<p class="intro">${esc(intro)}</p><nav aria-label="Main navigation"><a href="#about">About</a><a href="#projects">Projects</a><a href="#writing">Writing</a></nav></header><main id="main"><section id="about"><h2>About</h2><p>${esc(site.about.trim() || 'A short introduction goes here.')}</p></section><section id="projects"><h2>Projects</h2>${projects}</section><section id="writing"><h2>Writing</h2>${posts.length ? `<ul class="plain writing">${writing}</ul>` : '<p class="muted">No posts yet.</p>'}</section></main>`));
console.log(`Built dist/: homepage + ${posts.length} post(s).`);
