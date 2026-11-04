// Writes everything an AI agent or crawler reads, all from the `content` object in script.js:
// plain HTML inside index.html, /profile/, one page per project, /index.md, llms.txt, robots.txt and sitemap.xml.
// AI crawlers don't run JavaScript, so without this the page they fetch is empty.
// Run after changing content: node tools/build-agent-pages.mjs
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://joshwright22.github.io';
const EMAIL = 'joshwright0322@gmail.com';
const TODAY = new Date().toISOString().slice(0, 10);

const source = readFileSync(join(ROOT, 'script.js'), 'utf8');
const start = source.indexOf('const content = {');
const end = start + source.slice(start).search(/\n};\r?\n/);
const content = new Function(`${source.slice(start, end + 3)}; return content;`)();

const read = file => readFileSync(join(ROOT, file), 'utf8');
const write = (file, text) => {
    mkdirSync(dirname(join(ROOT, file)), { recursive: true });
    writeFileSync(join(ROOT, file), text);
};
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const slug = s => s.toLowerCase().replace(/'/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const ldJson = data => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;

const projects = content.projects.map(p => ({ ...p, slug: slug(p.title), url: `${SITE}/projects/${slug(p.title)}/` }));
// Only real placements count as awards: "Two-time Emmy-nominated studio" is the studio's, and agents mark that down
const won = p => /\bplaced\b|\bplace\b|highest scored/i.test(p.result);
const skills = [...new Set(content.stack.flatMap(s => s.tools))];  // adding every project tag read as keyword stuffing
const social = content.links.map(l => l.url);
const lead = 'Josh Wright is an AI engineer finishing a B.S. in Computer Science at Arizona State University in May 2027. He builds AI systems: motion tracking models and animation plugins at Pixel Pirate Studio, FIREFIGHTER, an open-source scheduler that lets AI coding agents share one computer, and games, including Trust No One, which placed #9 of 2,253 entries in the Brackeys Game Jam.';
const looking = 'New grad software engineering roles starting May 2027, especially machine learning, computer vision, graphics, animation tools, gameplay and R&D at animation studios.';

const person = {
    '@type': 'Person',
    '@id': `${SITE}/#josh`,
    name: 'Josh Wright',
    alternateName: 'Joshua Wright',
    url: `${SITE}/`,
    image: `${SITE}/assets/me-hero.jpg`,
    email: `mailto:${EMAIL}`,
    description: lead,
    jobTitle: 'Software Engineering Intern',
    worksFor: { '@type': 'Organization', name: 'Pixel Pirate Studio', url: 'https://getunomi.com/' },
    affiliation: { '@type': 'CollegeOrUniversity', name: 'Arizona State University', url: 'https://www.asu.edu/' },
    homeLocation: { '@type': 'Place', name: 'Tempe, Arizona' },
    hasOccupation: [{ '@type': 'Occupation', name: 'AI Engineer' }, { '@type': 'Occupation', name: 'Software Engineer' }],
    knowsAbout: skills,
    knowsLanguage: 'en',
    award: projects.filter(won).map(p => `${p.title}: ${p.result}`),
    sameAs: social
};

const profilePage = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: `${SITE}/`,
    dateModified: TODAY,
    mainEntity: person,
    hasPart: projects.map(p => ({ '@type': 'CreativeWork', name: p.title, url: p.url, description: p.result }))
};

/* ---------- Pieces of index.html ---------- */

const head = [
    `<link rel="canonical" href="${SITE}/">`,
    `<link rel="alternate" type="text/markdown" href="${SITE}/index.md">`,
    `<meta property="og:type" content="profile">`,
    `<meta property="og:title" content="Josh Wright - AI Engineer">`,
    `<meta property="og:description" content="${esc(lead)}">`,
    `<meta property="og:url" content="${SITE}/">`,
    `<meta property="og:image" content="${SITE}/assets/me-hero.jpg">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:site" content="@joshwright_dev">`,
    ldJson(profilePage)
].join('\n    ');

const links = content.links.map(l => `<a class="link-row" href="${l.url}">${esc(l.text)}</a>`).join('');
const socials = content.links.map(l => `<a class="footer-link" href="${l.url}">${esc(l.text)}</a>`).join('');
const workList = projects.map(p => `<article><h3><a href="/projects/${p.slug}/">${esc(p.title)}</a></h3><p>${esc(p.category)}, ${esc(p.date)}. ${esc(p.result)}.</p><p>${esc(p.desc)}</p><p>${esc(p.expertise.join(', '))}</p><p><a href="${p.link}">View product</a></p></article>`).join('');
const stackList = content.stack.map(s => `<article><h3>${esc(s.title)}</h3><p>${esc(s.what)}</p><p>${esc(s.tools.join(' / '))}</p></article>`).join('');

function fill(html, id, text) {
    const open = `<!-- agent:${id} -->`, close = `<!-- /agent:${id} -->`;
    const from = html.indexOf(open), to = html.indexOf(close);
    if (from < 0 || to < 0) throw new Error(`index.html is missing the ${id} markers`);
    return html.slice(0, from + open.length) + text + html.slice(to);
}

let index = read('index.html');
for (const [id, text] of Object.entries({
    head: `\n    ${head}\n    `,
    'about-heading': esc(content.aboutH),
    'about-text': esc(content.aboutT),
    links,
    work: workList,
    stack: stackList,
    socials: `${socials}<a class="footer-link" href="/profile/">Plain text profile</a>`
})) index = fill(index, id, text);
write('index.html', index);

/* ---------- Plain pages ---------- */

const page = ({ title, description, path, body, data }) => `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}">
    <link rel="canonical" href="${SITE}${path}">
    <meta property="og:type" content="website">
    <meta property="og:title" content="${esc(title)}">
    <meta property="og:description" content="${esc(description)}">
    <meta property="og:url" content="${SITE}${path}">
    <meta property="og:image" content="${SITE}/assets/me-hero.jpg">
    <link rel="icon" type="image/jpeg" href="/assets/me.jpg">
    <style>
        body { max-width: 720px; margin: 0 auto; padding: 48px 24px; font: 17px/1.6 system-ui, sans-serif; color: #1b2230; }
        h1 { line-height: 1.2; }
        h2 { margin-top: 2em; }
        a { color: ${content.accent}; }
    </style>
    ${ldJson(data)}
</head>

<body>
    <main>
${body}
    </main>
</body>

</html>
`;

const projectFacts = p => `<ul>
            <li>${won(p) ? 'Result' : 'Highlight'}: ${esc(p.result)}</li>
            <li>Type: ${esc(p.category)}</li>
            <li>Date: ${esc(p.date)}</li>
            <li>Skills: ${esc(p.expertise.join(', '))}</li>
            <li>Link: <a href="${p.link}">${esc(p.link)}</a></li>
        </ul>`;

rmSync(join(ROOT, 'projects'), { recursive: true, force: true });
for (const p of projects) {
    write(`projects/${p.slug}/index.html`, page({
        title: `${p.title}: ${p.result} | Josh Wright`,
        description: p.desc.slice(0, 155).replace(/\s\S*$/, ''),
        path: `/projects/${p.slug}/`,
        data: {
            '@context': 'https://schema.org',
            '@type': p.category === 'Game Development' ? 'VideoGame' : 'CreativeWork',
            name: p.title,
            description: p.desc,
            url: p.url,
            sameAs: p.link,
            keywords: p.expertise.join(', '),
            creator: { '@id': `${SITE}/#josh`, '@type': 'Person', name: 'Josh Wright', url: `${SITE}/` }
        },
        body: `        <p><a href="/">Josh Wright</a> / <a href="/profile/">Profile</a></p>
        <h1>${esc(p.title)}</h1>
        <p><strong>${esc(p.result)}.</strong> Project by <a href="/profile/">Josh Wright</a>.</p>
        <p>${esc(p.desc)}</p>
        ${projectFacts(p)}`
    }));
}

const asked = [
    ['Who is Josh Wright?', lead],
    ['What roles is Josh Wright looking for?', looking],
    ['Where does Josh Wright work now?', projects[0].desc.replace(/\bI'm\b/g, 'Josh is').replace(/\bI (also )?([a-z][\w-]*)/g, (_m, also, verb) => `Josh ${also || ''}${verb}s`)],
    ['Where did Josh Wright go to school?', 'Arizona State University, B.S. in Computer Science, graduating May 2027. Josh is based in Tempe, Arizona.']
];

const skillGroups = content.stack.map(s => `<li><strong>${esc(s.title)}:</strong> ${esc(s.tools.join(', '))}</li>`).join('\n            ');
write('profile/index.html', page({
    title: 'Josh Wright - Software Engineer, New Grad May 2027 | Profile',
    description: lead,
    path: '/profile/',
    data: { ...profilePage, url: `${SITE}/profile/` },
    body: `        <p><a href="/">Portfolio</a></p>
        <h1>Josh Wright: software engineer for animation, graphics and AI tools</h1>
${asked.map(([q, a]) => `        <h2>${esc(q)}</h2>\n        <p>${esc(a)}</p>`).join('\n')}
        <h2>What has Josh Wright built?</h2>
        <ul>
            ${projects.map(p => `<li><a href="/projects/${p.slug}/">${esc(p.title)}</a>: ${esc(p.result)} (${esc(p.date)})</li>`).join('\n            ')}
        </ul>
        <h2>What are Josh Wright's skills?</h2>
        <ul>
            ${skillGroups}
        </ul>
        <h2>How do I contact Josh Wright?</h2>
        <p>Email <a href="mailto:${EMAIL}">${EMAIL}</a>. Resume: <a href="/assets/Josh_Wright_Resume.pdf">${SITE}/assets/Josh_Wright_Resume.pdf</a>. Work authorization: US citizen, no sponsorship needed.</p>
        <ul>
            ${content.links.map(l => `<li><a href="${l.url}">${esc(l.text)}</a></li>`).join('\n            ')}
        </ul>`
}));

/* ---------- Markdown and discovery files ---------- */

const markdown = `# Josh Wright

> ${lead}

Looking for: ${looking}

Email: ${EMAIL}
Location: Tempe, Arizona
${content.links.map(l => `${l.text}: ${l.url}`).join('\n')}

## About

${content.aboutT}

## Skills

${content.stack.map(s => `- ${s.title}: ${s.tools.join(', ')}`).join('\n')}

## Work

${projects.map(p => `### ${p.title}

${p.result}. ${p.category}, ${p.date}.

${p.desc}

Skills: ${p.expertise.join(', ')}
Page: ${p.url}
Link: ${p.link}`).join('\n\n')}
`;
write('index.md', markdown);
write('llms-full.txt', markdown);

write('llms.txt', `# Josh Wright

> ${lead}

Looking for: ${looking}
Contact: ${EMAIL}

## Profile

- [Profile](${SITE}/profile/): roles wanted, current work, education, skills and contact
- [Full profile as markdown](${SITE}/index.md): everything on the site in one file

## Projects

${projects.map(p => `- [${p.title}](${p.url}): ${p.result}`).join('\n')}

## Elsewhere

${content.links.map(l => `- [${l.text}](${l.url})`).join('\n')}
`);

const bots = ['OAI-SearchBot', 'ChatGPT-User', 'GPTBot', 'Claude-SearchBot', 'Claude-User', 'ClaudeBot', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot-Extended', 'CCBot'];
write('robots.txt', `# Agents are welcome here. Start with /profile/ or /index.md.
User-agent: *
Allow: /
Disallow: /lamp-editor.html

${bots.map(b => `User-agent: ${b}`).join('\n')}
Allow: /
Disallow: /lamp-editor.html

Sitemap: ${SITE}/sitemap.xml
`);

const urls = ['/', '/profile/', ...projects.map(p => `/projects/${p.slug}/`)];
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `    <url><loc>${SITE}${u}</loc><lastmod>${TODAY}</lastmod></url>`).join('\n')}
</urlset>
`);

console.log(`built ${urls.length} pages`);
