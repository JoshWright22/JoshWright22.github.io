/* =============================================================
   Josh Wright — portfolio
   Content lives at the top; everything below renders and animates it.
   No dependencies. After changing content run node tools/build-agent-pages.mjs,
   which writes it into plain HTML for AI agents and crawlers.
   ============================================================= */

const content = {
    // Sky from assets/me.jpg. Mirrors --accent in style.css.
    accent: '#4776ca',
    aboutH: 'AI Engineer',
    aboutT: 'Hey, I\'m Josh. I\'m an AI engineer graduating from Arizona State University in May 2027 with a B.S. in Computer Science. I train and fine-tune models, write CUDA, build reinforcement learning agents and test what comes out against real benchmarks. At my internship at UNOMi I benchmarked 6 markerless motion capture pipelines, picked the one the team now uses, and made it 2.8x faster at the same accuracy. On my own I wrote a CUDA game simulator for Cambridge Battlecode and trained a PPO agent on it by self-play. I started out keyframing characters by hand, so animation is where I want to take AI research next. I still make games too, like Trust No One, which placed #9 out of 2,253 entries in the Brackeys Game Jam. If you\'re hiring or want to work on something together, reach out!',

    links: [
        { text: 'YouTube', url: 'https://www.youtube.com/@JoshWright_Dev' },
        { text: 'Twitter', url: 'https://x.com/joshwright_dev' },
        { text: 'Instagram', url: 'https://www.instagram.com/joshwrightisoninsta/' },
        { text: 'GitHub', url: 'https://github.com/JoshWright22' },
        { text: 'LinkedIn', url: 'https://www.linkedin.com/in/joshua-wright-a94143338/' }
    ],
    profileImg: 'assets/me-hero.jpg',
    marquee: ['Model Training', 'Fine-Tuning', 'PyTorch', 'CUDA', 'Reinforcement Learning', 'PPO', 'Self-Play', 'Computer Vision', 'Motion Capture', 'Forecasting', 'LLM Evaluation', 'AI Agents', 'Benchmarking', 'Azure GPUs', 'Python', 'C++', 'AI for Animation', 'Gameplay Systems'],
    // art is one of: net, graph, game, code.
    stack: [
        { title: 'AI / ML Engineering', what: 'I train models, make them faster and check them against real benchmarks. At UNOMi that means vision models for markerless motion capture, fine-tuned and hosted on Azure GPUs. On my own it means a CUDA simulator for training PPO agents by self-play, and forecasting models scored on GIFT-Eval. Next I want to do this research myself, focused on animation.', art: 'net', tools: ['PyTorch', 'CUDA', 'Python', 'Reinforcement Learning (PPO, Self-Play)', 'Model Fine-Tuning', 'Computer Vision', 'Time-Series Forecasting', 'LLM Evaluation', 'AI Agents (MCP)', 'Azure GPU Hosting', 'C++'] },
        { title: 'Animation Tools', what: 'I build the UNOMi plugins for Maya, Blender, Unreal and Cinema 4D, and I keyframe by hand.', art: 'graph', tools: ['Python', 'Plugin Development', 'Maya', 'Blender', 'Cinema 4D', 'Unreal Engine', 'Keyframe Animation'] },
        { title: 'Gameplay Systems', what: 'I build gameplay systems on hard deadlines, from combat and upgrades to procedural levels.', art: 'game', tools: ['C#', 'Unity', 'Godot', 'Unreal Engine', 'Procedural Generation', 'Multiplayer Networking'] },
        { title: 'Software Engineering', what: 'I can own a product end to end, from a C++ framework to the server and the cloud it runs on.', art: 'code', tools: ['C++', 'TypeScript', 'React', 'Docker', 'Microsoft Azure', 'AWS', 'Git', 'CI', 'Team Leadership', 'Agile Sprints'] }
    ],
    // To add a project, copy a block and put it where it belongs: the page order, numbers,
    // top bar and scroll all follow this list. A new group starts a new heading. short is
    // the top bar label and result is the one line pitch shown while the clip is in view.
    // img goes in assets/, and a .webm also needs a matching -poster.jpg. fit: 'contain' is
    // optional. A project with no clip needs a forecast instead, drawn as a plot of the real
    // forecast.
    projects: [
        {
            title: 'UNOMi', short: 'UNOMi', result: '2.8x faster motion capture, same accuracy',
            category: 'Software Engineering Internship',
            date: 'August 2026 - Present',
            desc: 'I\'m a software engineering intern at Pixel Pirate Studio, a two-time Emmy-nominated animation studio in Los Angeles. The studio makes UNOMi, which uses machine learning to generate 3D character animation. I work on the markerless motion capture coming in UNOMi 3D, which turns camera footage of a performer into animation. I benchmarked 6 markerless motion capture pipelines on real clips and picked the one the team now uses by default. Then I made it 2.8x faster at the same accuracy, which cut its estimated cloud GPU cost per video minute by 64%. I fine-tune the vision-to-motion models, which I host on Microsoft Azure. I also merged the 4 UNOMi plugins for Maya, Blender, Unreal Engine and Cinema 4D into one repo with CI. The internship runs through May 2027.',
            expertise: ['Computer Vision', 'Motion Capture', 'Model Fine-Tuning', 'Benchmarking', 'GPU Optimization', 'Microsoft Azure', 'Python', 'CI', 'Animation Tools'],
            img: './assets/unomi-tracking.webm',
            link: 'https://getunomi.com/3d-lip-sync/'
        },
        {
            title: 'nanoTSFM Forecasting', short: 'nanoTSFM', result: '17% lower error than the nanoTSFM record',
            category: 'Time-Series Forecasting',
            date: 'October 2026',
            desc: 'I trained an ensemble of five 13M-parameter PyTorch forecasting models for the open nanoTSFM benchmark. It scored 0.526 CRPS on GIFT-Eval\'s 97 unseen tasks, 17% lower error than the 0.632 nanoTSFM record. Those numbers are from my own runs over 2 seeds. The plot is one of its forecasts: the next 48 hours of a GIFT-Eval electricity series, with its quantile bands, against what actually happened.',
            expertise: ['PyTorch', 'Python', 'Time-Series Forecasting', 'Model Training', 'Ensembles', 'Evaluation'],
            // GIFT-Eval electricity/H, series MT_214: the last 5 days of context, then the 48 held-out
            // hours. q10..q90 are the trained ensemble's quantile forecasts for those hours.
            forecast: {
                label: 'GIFT-Eval electricity, hourly',
                history: [623, 580, 571, 577, 665, 681, 649, 644, 570, 608, 603, 598, 568, 572, 602, 623, 619, 628, 646, 650, 644, 652, 619, 667, 832, 829, 798, 643, 705, 883, 1005, 1097, 1345, 1606, 1661, 1642, 1638, 1610, 1574, 1566, 1653, 1751, 1841, 1760, 1701, 1648, 1572, 1487, 909, 747, 724, 589, 638, 811, 986, 1036, 1358, 1695, 1736, 1678, 1638, 1624, 1617, 1629, 1672, 1773, 1787, 1757, 1698, 1661, 1539, 1078, 717, 697, 624, 631, 697, 899, 1046, 1134, 1400, 1683, 1721, 1731, 1617, 1591, 1632, 1654, 1672, 1755, 1735, 1680, 1686, 1624, 1264, 828, 664, 624, 579, 606, 683, 863, 965, 1064, 1326, 1607, 1604, 1622, 1582, 1565, 1546, 1631, 1656, 1717, 1782, 1752, 1717, 1615, 1462, 1132],
                actual: [770, 753, 713, 586, 633, 817, 1003, 1059, 1334, 1661, 1628, 1645, 1604, 1663, 1662, 1640, 1618, 1714, 1791, 1720, 1724, 1634, 1505, 1034, 701, 656, 653, 656, 737, 913, 1024, 1127, 1314, 1587, 1670, 1677, 1684, 1637, 1632, 1629, 1644, 1605, 1488, 937, 659, 636, 626, 637],
                q10: [706, 585, 582, 556, 634, 794, 896, 1038, 1248, 1432, 1532, 1557, 1551, 1523, 1516, 1563, 1604, 1660, 1677, 1673, 1622, 1521, 1355, 1091, 754, 574, 570, 555, 601, 747, 865, 971, 1215, 1405, 1494, 1524, 1502, 1454, 1453, 1478, 1516, 1543, 1533, 1485, 1422, 1351, 1184, 942],
                q30: [761, 621, 606, 598, 658, 825, 940, 1068, 1312, 1542, 1632, 1617, 1593, 1568, 1563, 1598, 1654, 1719, 1749, 1712, 1673, 1633, 1454, 1150, 783, 608, 596, 582, 637, 811, 927, 1037, 1337, 1548, 1621, 1619, 1599, 1572, 1550, 1592, 1626, 1657, 1656, 1602, 1538, 1480, 1319, 1028],
                q50: [789, 647, 628, 611, 681, 855, 978, 1090, 1347, 1585, 1662, 1640, 1621, 1594, 1593, 1629, 1677, 1747, 1775, 1731, 1695, 1651, 1501, 1174, 811, 639, 621, 601, 653, 838, 972, 1077, 1391, 1649, 1697, 1684, 1666, 1621, 1604, 1633, 1688, 1726, 1729, 1650, 1595, 1549, 1389, 1095],
                q70: [809, 660, 652, 625, 693, 887, 1016, 1118, 1370, 1630, 1701, 1676, 1640, 1626, 1630, 1672, 1702, 1774, 1811, 1755, 1723, 1701, 1537, 1200, 844, 666, 635, 623, 672, 889, 1022, 1125, 1460, 1714, 1767, 1745, 1728, 1684, 1673, 1683, 1742, 1805, 1779, 1698, 1636, 1619, 1444, 1136],
                q90: [852, 705, 682, 662, 731, 950, 1081, 1196, 1435, 1692, 1774, 1741, 1697, 1698, 1701, 1727, 1765, 1841, 1867, 1794, 1745, 1727, 1583, 1269, 909, 712, 686, 670, 739, 960, 1106, 1201, 1597, 1845, 1922, 1841, 1826, 1806, 1811, 1831, 1898, 1936, 1925, 1831, 1760, 1728, 1551, 1253]
            }
        },
        {
            title: 'Trust No One', short: 'TNO', result: 'Placed #9 of 2,253 games',
            category: 'Game Development',
            date: 'August 2026',
            desc: 'I put together a team of six on Discord for the Brackeys Game Jam 2026.2 and we shipped this Unity game in one week. I led design and decided what made the cut. I also designed the core combat, programmed the party members and their upgrade systems in C#, drew some of the items and built the game\'s promo website. It placed #9 out of 2,253 entries and was the 14th most popular, and Brackeys mentioned it in their jam video.',
            expertise: ['Team Leadership', 'Project Planning', 'C#', 'Unity', 'Gameplay Programming', 'Systems Design'],
            img: './assets/trust-no-one.webm',
            link: 'https://hozer347.itch.io/trust-no-one'
        },
        {
            title: 'Cambridge Battlecode 2026', short: 'Battlecode', result: 'Mined 110,000 ladder matches, trained on 6M turns',
            category: 'Reinforcement Learning',
            date: 'October 2026',
            desc: 'I wrote a CUDA game simulator for Cambridge Battlecode 2026 and trained a recurrent PPO reinforcement learning agent on it by self-play. I also built a data pipeline over the 110,000 matches on the public ladder that pulls out the 20,000 strongest replays in 15 minutes, and trained GPU decision-tree models on 6 million game turns to drive the bot\'s choices. The clip is my submitted bot (blue) winning a local match 1,044 gems to 216, in the official visualiser.',
            expertise: ['CUDA', 'C++', 'Python', 'Reinforcement Learning', 'PPO', 'Self-Play', 'GPU Simulation', 'Data Pipelines', 'Decision Trees'],
            img: './assets/battlecode.webm'
        },
        {
            title: 'There\'s No Place Like 127.0.0.1', short: '127', result: 'Highest scored pitch at the AZ Game Cup',
            category: 'Game Development',
            date: 'September 2026',
            desc: 'I created and led the six person team that represented ASU at the AZ Game Cup 2026, directed the project, and gave the pitch that judges scored highest. We took 2nd place and $150 per team member, and this is an expanded version of what we built. I scoped the work so six people could actually finish in 48 hours, and I programmed the procedural generation that lays out a new set of upgrade floors every run.',
            expertise: ['Team Leadership', 'Project Planning', 'Pitching & Presenting', 'C#', 'Unity', 'Procedural Generation'],
            img: './assets/codee.webm',
            fit: 'contain',
            link: 'https://joshwright.itch.io/theres-no-place-like-127001'
        },
        {
            title: '3D Animation Reel', short: 'Reel', result: 'TV quality animation',
            category: '3D Animation',
            date: 'September 2025',
            desc: 'Every shot in this reel is hand keyframed on existing rigs. I made them to practice the 12 principles of animation, mostly posing, timing and weight. Doing this by hand is why I care how animation tools feel to use.',
            expertise: ['3D Animation', 'Keyframe Animation', 'Character Animation', 'Maya', 'Acting', '12 Principles of Animation'],
            img: './assets/animation.webm',
            link: 'https://vimeo.com/1035906176'
        },
        {
            title: 'Game Dev Club Club', short: 'GDCC', result: 'Created a club across 104 universities',
            category: 'Web Development',
            date: '2026',
            desc: 'I helped create Game Dev Club Club, a network of student developers from 104 university clubs, and I help run its events by planning what each one covers and coordinating organizers across schools. On the website I worked between the design and engineering teams and built the Contact Us page in React, an interactive solar system where the sun opens a message form and each orbiting planet links to a platform.',
            expertise: ['React', 'JavaScript', 'HTML/CSS', 'Cross-Functional Collaboration', 'Team Leadership', 'UI/UX Design'],
            img: './assets/gdcc-map.webm',
            link: 'https://gamedevclubclub.com/'
        },
        {
            title: 'AtOMoC SHeLiS', short: 'AtOMoC', result: 'Placed #12 of 150 games',
            category: 'Game Development',
            date: 'August 2026',
            desc: 'I designed and built this chemistry themed roguelike auto battler solo, where you buy elements each round and connect them into a growing molecule that fights for you. I made it for the Club Club Jam Jam, which I also helped organize and run, and it placed #12. Since the jam I have been turning playtest feedback into a roadmap and expanding it into a Steam release covering all 118 elements.',
            expertise: ['Godot', 'GDScript', 'Systems Design', 'Procedural Generation', 'Roadmapping', 'Playtesting & Iteration'],
            img: './assets/atomoc-shelis.webm',
            link: 'https://joshwright.itch.io/atomoc-shelis'
        },
        {
            title: 'Gob Spin', short: 'Gob', result: 'Placed #140 of 3,498 games',
            category: 'Game Development',
            date: 'June 2026',
            desc: 'I led a small team through this one week build, a physics based action game where you play as a goblin who spins. I directed the design, split the work across the team, and implemented core systems alongside them. We placed #140 out of 3,498 entries in The Very Serious Juniper Dev Game Jam.',
            expertise: ['Team Leadership', 'C#', 'Unity', 'Physics Systems', 'Gameplay Programming', 'Game Design'],
            img: './assets/gobspin.webm',
            link: 'https://hozer347.itch.io/gobspin'
        },
        {
            title: 'Slush Rush', short: 'Slush', result: 'Placed #69 of 434 games',
            category: 'Game Development',
            date: 'June 2026',
            desc: 'I designed and implemented the core mechanics while directing a small team through a one week build. I set the scope, decided early what to leave out, and shipped polished systems under a tight deadline. We placed #69 out of 434 entries in Comfy Jam: Summer.',
            expertise: ['Team Leadership', 'Project Planning', 'Python', 'Godot', 'Gameplay Programming', 'Systems Design'],
            img: './assets/slush-rush.webm',
            link: 'https://joshwright.itch.io/slush-rush'
        }
    ]
};

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

/* ---------- Rendering ---------- */

function renderAbout() {
    document.getElementById('about-heading').textContent = content.aboutH;
    document.getElementById('about-text').textContent = content.aboutT;

    const profile = document.getElementById('profile-img');
    profile.src = content.profileImg;
    profile.dataset.lightbox = content.profileImg;
    profile.dataset.lightboxLabel = 'Josh Wright / ASU Computer Science';

    document.getElementById('primary-links-container').innerHTML = content.links.map(l => `
        <a class="link-row" href="${l.url}" target="_blank" rel="noopener">
            <span>${l.text}</span><span class="arrow">↗</span>
        </a>`).join('');

    document.getElementById('footer-socials').innerHTML = content.links.map(l =>
        `<a class="footer-link" href="${l.url}" target="_blank" rel="noopener">${l.text} ↗</a>`).join('') +
        '<a class="footer-link" href="/profile/">Plain text profile ↗</a>';
}

/* The track is duplicated so the -50% translate loop is seamless. */
function renderMarquee() {
    const track = document.getElementById('marquee-track');
    const half = content.marquee
        .map(t => `<span>${t}</span><span class="sep"></span>`).join('');
    track.innerHTML = half + half;
}

function renderStack() {
    const art = {
        graph: `<svg class="art-graph" viewBox="0 0 320 240" aria-hidden="true">
            <path class="art-curve" d="M44 176 C100 176 110 56 165 56 S236 170 276 96"/>
            <line class="art-handle" x1="44" y1="176" x2="100" y2="176"/><circle class="art-handle-end" cx="100" cy="176" r="3"/><line class="art-handle" x1="165" y1="56" x2="110" y2="56"/><circle class="art-handle-end" cx="110" cy="56" r="3"/><line class="art-handle" x1="165" y1="56" x2="220" y2="56"/><circle class="art-handle-end" cx="220" cy="56" r="3"/><line class="art-handle" x1="276" y1="96" x2="236" y2="170"/><circle class="art-handle-end" cx="236" cy="170" r="3"/><rect class="art-key" x="40" y="172" width="8" height="8"/><rect class="art-key" x="161" y="52" width="8" height="8"/><rect class="art-key" x="272" y="92" width="8" height="8"/>
            <line class="art-head" x1="0" y1="19" x2="0" y2="221"/><circle class="art-rider" r="6"/></svg>`,
        net: '<canvas class="art-net" aria-hidden="true"></canvas>',
        game: `<svg viewBox="0 0 320 240" aria-hidden="true">
            <clipPath id="art-safe"><rect x="26" y="19" width="268" height="202"/></clipPath>
            <g clip-path="url(#art-safe)">
                <line class="art-floor" x1="26" y1="186" x2="294" y2="186"/>
                <rect class="art-coin" x="-7" y="62" width="14" height="14"/><text class="art-plus" x="124" y="60">+1</text><rect class="art-bit art-bit--0" x="96" y="65" width="6" height="6"/><rect class="art-bit art-bit--1" x="96" y="65" width="6" height="6"/><rect class="art-bit art-bit--2" x="96" y="65" width="6" height="6"/><rect class="art-bit art-bit--3" x="96" y="65" width="6" height="6"/><rect class="art-bit art-bit--4" x="96" y="65" width="6" height="6"/><rect class="art-bit art-bit--5" x="96" y="65" width="6" height="6"/><rect class="art-bit art-bit--6" x="96" y="65" width="6" height="6"/><rect class="art-bit art-bit--7" x="96" y="65" width="6" height="6"/>
                <rect class="art-spike" x="0" y="160" width="26" height="26"/>
                <rect class="art-spike art-spike--late" x="0" y="160" width="26" height="26"/>
                <rect class="art-hero" x="84" y="154" width="32" height="32"/>
            </g></svg>`,
        code: `<svg viewBox="0 0 320 240" aria-hidden="true">
            <path class="art-link" d="M160 72 C160 104 70 100 70 138"/><path class="art-link" d="M160 72 C160 104 160 100 160 138"/><path class="art-link" d="M160 72 C160 104 250 100 250 138"/>
            <g class="art-dispatch"><rect x="122" y="32" width="76" height="40" rx="6"/></g>
            <g class="art-store" style="--slot:2;transform-origin:70px 200px"><ellipse cx="70" cy="150" rx="34" ry="10"/><rect class="art-job" style="--slot:2;offset-path:path('M160 66 C160 104 70 100 70 172')" x="-8" y="-8" width="16" height="16" rx="2"/><path d="M36 150 a34 10 0 0 0 68 0 v40 a34 10 0 0 1 -68 0 z"/></g><g class="art-store" style="--slot:1;transform-origin:160px 200px"><ellipse cx="160" cy="150" rx="34" ry="10"/><rect class="art-job" style="--slot:1;offset-path:path('M160 66 C160 104 160 100 160 172')" x="-8" y="-8" width="16" height="16" rx="2"/><path d="M126 150 a34 10 0 0 0 68 0 v40 a34 10 0 0 1 -68 0 z"/></g><g class="art-store" style="--slot:0;transform-origin:250px 200px"><ellipse cx="250" cy="150" rx="34" ry="10"/><rect class="art-job" style="--slot:0;offset-path:path('M160 66 C160 104 250 100 250 172')" x="-8" y="-8" width="16" height="16" rx="2"/><path d="M216 150 a34 10 0 0 0 68 0 v40 a34 10 0 0 1 -68 0 z"/></g></svg>`
    };
    const shots = content.stack.map(({ title, what, art: drawing, tools }, i) => `
        <article class="shot${i ? '' : ' shot--lead'}" style="--d:${i * 110}ms">
            <div class="shot-picture">
                <div class="shot-frame">${art[drawing] || ''}</div>
            </div>
            <div class="shot-text">
                <h3 class="shot-title">${title}</h3>
                <p class="shot-what">${what}</p>
                <p class="shot-tools">${tools.join(' / ')}</p>
            </div>
        </article>`).join('');
    document.getElementById('stack-tags').innerHTML = `<div class="board">${shots}</div>`;
}

const projectLink = proj => proj.link
    ? `<a class="project-link" href="${proj.link}" target="_blank" rel="noopener">${proj.linkText || 'View product'} ↗</a>`
    : '';

/* A real forecast, drawn in: the days before, the model's 48 hours with its 10-90% and
   30-70% bands, then what actually happened. */
function forecastPanel(f) {
    const past = f.history.length;
    const hours = past + f.actual.length;
    const all = [...f.history, ...f.actual, ...f.q10, ...f.q90];
    const lo = Math.min(...all), hi = Math.max(...all);
    const W = 640, H = 300;
    const x = i => (i / (hours - 1) * W).toFixed(1);
    const y = v => (H - 6 - (v - lo) / (hi - lo) * (H - 12)).toFixed(1);
    // Forecast lines start from the last known hour so they join the history.
    const join = vals => [f.history[past - 1], ...vals];
    const path = (vals, from) => vals.map((v, i) => `${i ? 'L' : 'M'}${x(from + i)} ${y(v)}`).join('');
    // Along the low edge, then back along the high edge.
    const band = (low, high) => path(join(low), past - 1) +
        join(high).map((v, i) => `L${x(past - 1 + i)} ${y(v)}`).reverse().join('') + 'Z';
    const now = x(past - 1);
    const split = (now / W * 100).toFixed(1);
    return `
        <div class="project-panel project-panel--plot" role="img" aria-label="Forecast plot, ${f.label}: the model's 48 hour forecast with its quantile bands, against the actual values.">
            <div class="pa-art">
                <span class="fc-tag" style="left:0">${f.label}</span>
                <span class="fc-tag fc-tag--next" style="left:${split}%">48 h forecast</span>
                <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true">
                    <rect class="fc-future" x="${now}" y="0" width="${(W - now).toFixed(1)}" height="${H}"/>
                    <line class="fc-now" x1="${now}" y1="0" x2="${now}" y2="${H}"/>
                    <path class="fc-band" d="${band(f.q10, f.q90)}"/>
                    <path class="fc-band fc-band--inner" d="${band(f.q30, f.q70)}"/>
                    <path class="fc-line fc-history" pathLength="1" d="${path(f.history, 0)}"/>
                    <path class="fc-line fc-mid" pathLength="1" d="${path(join(f.q50), past - 1)}"/>
                    <path class="fc-line fc-actual" pathLength="1" d="${path(join(f.actual), past - 1)}"/>
                </svg>
            </div>
            <div class="fc-legend">
                <span class="fc-key fc-key--history">History</span>
                <span class="fc-key fc-key--mid">Forecast</span>
                <span class="fc-key fc-key--band">Quantile bands</span>
                <span class="fc-key fc-key--actual">Actual</span>
            </div>
        </div>`;
}

/* Panels only move while they are on screen. */
function initPanels() {
    const panels = document.querySelectorAll('.project-panel');
    if (!('IntersectionObserver' in window)) {
        panels.forEach(p => p.classList.add('is-on'));
        return;
    }
    const obs = new IntersectionObserver(entries => entries.forEach(e =>
        e.target.classList.toggle('is-on', e.isIntersecting)), { threshold: 0.2 });
    panels.forEach(p => obs.observe(p));
}

function renderProjects(projects) {
    const container = document.getElementById('projects-container');
    if (!container) return;

    document.getElementById('work-count').textContent =
        `${String(projects.length).padStart(2, '0')} projects`;

    container.innerHTML = projects.map((proj, i) => {
        const num = String(i + 1).padStart(2, '0');
        const isVideo = /\.(webm|mp4)$/.test(proj.img || '');

        const groupSize = projects.filter(p => p.group === proj.group).length;
        const heading = proj.group && proj.group !== (projects[i - 1] || {}).group
            ? `<h3 class="work-group"><span class="mono">${proj.group}</span><span class="mono muted">${String(groupSize).padStart(2, '0')}</span></h3>`
            : '';

        // Still frame shown until the video is ready, so cards never flash black.
        // Convention: foo.webm -> foo-poster.jpg (override per project with `poster`).
        const poster = proj.poster || (proj.img || '').replace(/\.(webm|mp4)$/, '-poster.jpg');

        // Ultrawide clips opt into `fit: 'contain'` so the whole frame shows
        // instead of the sides being cropped to 16:9.
        const fit = proj.fit === 'contain' ? ' is-contained' : '';

        const media = !proj.img ? forecastPanel(proj.forecast)
            : isVideo
            ? `<video muted loop playsinline preload="none" data-poster="${poster}" class="project-video${fit}">
                   <source src="${proj.img}" type="video/${proj.img.endsWith('.mp4') ? 'mp4' : 'webm'}">
               </video>`
            : `<div class="project-image" style="background-image:url('${proj.img}')"></div>`;

        // Stills get a popup; clips play themselves in place and don't need one.
        // The button sits beside the link, so a tap on mobile is never an
        // ambiguous "expand or leave the site".
        const expand = isVideo || !proj.img ? '' : `
            <button type="button" class="media-expand"
                    data-lightbox="${proj.img}"
                    data-lightbox-label="${proj.title}"
                    aria-label="Expand ${proj.title}">⤢ Expand</button>`;

        // The button is a sibling of the anchor, not a child — nesting a
        // control inside a link is invalid and swallows the tap.
        const inner = proj.link
            ? `<a href="${proj.link}" target="_blank" rel="noopener" class="project-media-link" aria-label="${proj.title}, ${(proj.linkText || 'View product').toLowerCase()}">${media}</a>`
            : `<div class="project-media-link">${media}</div>`;

        const mediaBlock = `<div class="project-media">${inner}${expand}</div>`;

        const tags = (proj.expertise || [])
            .map(s => `<span class="tag">${s}</span>`).join('');

        const link = projectLink(proj);

        return heading + `
        <article class="project" id="project-${i + 1}" data-short="${proj.short || proj.title}" data-result="${proj.result || ''}" data-reveal>
            <div class="project-head">
                <span class="mono project-num">${num}</span>
                <span class="mono muted">${proj.category || 'Project'}</span>
                <span class="mono muted">${proj.date || ''}</span>
            </div>
            <h3 class="project-title">${proj.title}</h3>
            ${proj.result ? '<div class="pitch-slot"></div>' : ''}
            <div class="project-body">
                ${mediaBlock}
                <div class="project-side">
                    <p class="project-desc">${proj.desc}</p>
                    <div class="project-tags">${tags}</div>
                    ${link}
                </div>
            </div>
        </article>`;
    }).join('');
}

/* ---------- Video: buffer on approach, play while on screen ---------- */

function initVideos() {
    const videos = [...document.querySelectorAll('.project-video')];
    if (!videos.length) return;

    const card = v => v.closest('.project-media') || v;

    // The lightbox pauses the page behind it; this flag keeps the observer
    // from restarting clips while the popup is open.
    const blocked = () => document.body.classList.contains('lightbox-open');

    // Which clip is meant to be running. start()/stop() only state intent;
    // the accent mark below follows what the element actually does.
    let current = null;

    function start(v) {
        if (blocked()) return;
        current = v;
        const p = v.play();
        if (p && p.catch) p.catch(() => {
            // Warming a clip with load() aborts its first play(). Once it has
            // data, try again — but only if it is still the chosen one.
            v.addEventListener('canplay', () => {
                if (current === v && !blocked()) v.play().catch(() => { });
            }, { once: true });
        });
    }

    function stop(v) {
        if (current === v) current = null;
        v.pause();
    }

    // Driving the class off real play/pause events means it can never claim a
    // clip is running when the browser quietly refused to start it.
    videos.forEach(v => {
        v.addEventListener('play', () => card(v).classList.add('is-playing'));
        v.addEventListener('pause', () => card(v).classList.remove('is-playing'));
    });

    // Posters wait until the hero photo is in, so they don't slow it down.
    // A card near the screen gets its poster straight away.
    const showPoster = v => {
        if (!v.dataset.poster) return;
        v.poster = v.dataset.poster;
        delete v.dataset.poster;
    };
    (window.siteWarm || Promise.resolve()).then(() => videos.forEach(showPoster));

    // Nothing downloads on load. A clip starts buffering once its card is near
    // the viewport, so it is ready by the time it scrolls in.
    if ('IntersectionObserver' in window) {
        const warm = new IntersectionObserver((entries, obs) => {
            entries.forEach(e => {
                if (!e.isIntersecting) return;
                showPoster(e.target);
                e.target.preload = 'auto';
                e.target.load();
                obs.unobserve(e.target);
            });
        }, { rootMargin: '600px 0px' });
        videos.forEach(v => warm.observe(v));
    } else {
        videos.forEach(v => { showPoster(v); v.preload = 'auto'; v.load(); });
    }

    // Autoplaying video is motion: if the visitor asked for less of it, clips
    // stay on their poster until deliberately hovered or opened.
    if (reduceMotion) {
        videos.forEach(v => {
            const c = card(v);
            c.addEventListener('mouseenter', () => start(v));
            c.addEventListener('mouseleave', () => stop(v));
        });
        return;
    }

    if (!('IntersectionObserver' in window)) {
        videos.forEach(v => { v.muted = true; v.playsInline = true; });
        start(videos[0]);
        return;
    }

    // Autoplay on scroll, but only ever one clip at a time: the one nearest
    // the middle of the viewport wins and every other clip is paused. Muted +
    // playsinline is what makes this allowed on mobile.
    const visible = new Set();

    function nearestToCentre() {
        const mid = window.innerHeight / 2;
        let best = null;
        let bestGap = Infinity;
        visible.forEach(v => {
            const r = v.getBoundingClientRect();
            const gap = Math.abs((r.top + r.bottom) / 2 - mid);
            if (gap < bestGap) { bestGap = gap; best = v; }
        });
        return best;
    }

    let hovered = null;

    // The single source of truth for what is playing. Everything else just
    // changes the inputs and calls this.
    function sync() {
        const winner = blocked() ? null : (hovered || nearestToCentre());
        videos.forEach(v => { if (v !== winner) stop(v); });
        if (winner) start(winner);
    }

    const play = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) visible.add(e.target);
            else visible.delete(e.target);
        });
        sync();
    }, { threshold: 0.28, rootMargin: '-6% 0px -6% 0px' });

    videos.forEach(v => {
        v.muted = true;
        v.playsInline = true;
        play.observe(v);
    });

    // The observer only fires when a clip crosses the threshold, so scrolling
    // between two clips that are both on screen needs its own re-check.
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => { ticking = false; sync(); });
    }, { passive: true });

    // Hover overrides the pick on desktop, so pointing at a clip plays that
    // one and pauses whatever the scroll position had chosen.
    if (!isTouch) {
        videos.forEach(v => {
            const c = card(v);
            c.addEventListener('mouseenter', () => { hovered = v; sync(); });
            c.addEventListener('mouseleave', () => { hovered = null; sync(); });
        });
    }

    // A backgrounded tab keeps decoding otherwise.
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) videos.forEach(stop);
        else sync();
    });

    // Nothing plays behind the popup; on close the winner is recomputed.
    document.addEventListener('lightbox:open', () => videos.forEach(stop));
    document.addEventListener('lightbox:close', sync);

    return { videos, start, stop };
}

/* ---------- Portraits: whatever is on screen is the selected one ----------
   Same rule the clips follow, so scrolling is what drives the page on a
   phone and on a desktop alike: the portrait you are looking at comes up
   in color behind the sky frame, and drops back out as it leaves.
   ------------------------------------------------------------------------ */

function initPortraits() {
    const shots = [...document.querySelectorAll('.hero-portrait img, #profile-img')];
    if (!shots.length) return;

    // The hero frame is a wrapper, so the class has to land on both.
    const mark = (el, on) => {
        el.classList.toggle('is-onscreen', on);
        const frame = el.closest('.hero-portrait');
        if (frame) frame.classList.toggle('is-onscreen', on);
    };

    if (!('IntersectionObserver' in window)) {
        shots.forEach(el => mark(el, true));
        return;
    }

    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => mark(e.target, e.isIntersecting));
    }, { threshold: 0.35, rootMargin: '-8% 0px -8% 0px' });

    shots.forEach(el => obs.observe(el));
}

/* ---------- Lightbox ----------
   One popup, reused. Opened by anything carrying [data-lightbox]:
   the two portraits and the expand button on every project card.
   Closes on the button, the backdrop, Escape, back-gesture history,
   or a downward swipe — the last one is what phones expect.
   ------------------------------------------------------------- */

const lightbox = (() => {
    let root, stage, caption, closeBtn, inner;
    let lastFocus = null;
    let open = false;
    // close() pops the history entry show() pushed. That popstate is async, so
    // without this flag a close-then-reopen would be shut again by the pop of
    // the *previous* entry landing after the new one opened.
    let popping = false;

    function build() {
        root = document.createElement('div');
        root.className = 'lightbox';
        root.setAttribute('role', 'dialog');
        root.setAttribute('aria-modal', 'true');
        root.setAttribute('aria-hidden', 'true');
        root.innerHTML = `
            <div class="lightbox-inner">
                <button class="lightbox-close" type="button" aria-label="Close">✕</button>
                <div class="lightbox-stage"></div>
                <div class="lightbox-caption mono">
                    <span class="name"></span>
                    <span class="hint muted">Esc / tap outside to close</span>
                </div>
            </div>`;
        document.body.appendChild(root);

        inner = root.querySelector('.lightbox-inner');
        stage = root.querySelector('.lightbox-stage');
        caption = root.querySelector('.lightbox-caption .name');
        closeBtn = root.querySelector('.lightbox-close');

        closeBtn.addEventListener('click', close);
        // Only a click on the backdrop itself, not on the media inside it.
        root.addEventListener('click', e => {
            if (e.target === root || e.target === inner) close();
        });
        document.addEventListener('keydown', e => {
            if (open && e.key === 'Escape') close();
        });

        initSwipe();
    }

    // Drag down past a threshold to dismiss; anything shorter snaps back.
    function initSwipe() {
        let startY = null;
        let dy = 0;

        inner.addEventListener('touchstart', e => {
            if (e.touches.length !== 1) return;
            startY = e.touches[0].clientY;
            dy = 0;
            root.classList.add('dragging');
        }, { passive: true });

        inner.addEventListener('touchmove', e => {
            if (startY === null) return;
            dy = e.touches[0].clientY - startY;
            if (dy < 0) dy = 0;
            inner.style.transform = `translateY(${dy}px)`;
            root.style.opacity = String(Math.max(0.25, 1 - dy / 420));
        }, { passive: true });

        inner.addEventListener('touchend', () => {
            root.classList.remove('dragging');
            inner.style.transform = '';
            root.style.opacity = '';
            if (dy > 110) close();
            startY = null;
        });
    }

    function show(src, { label = '' } = {}) {
        if (!root) build();

        stage.innerHTML = `<img src="${src}" alt="${label}">`;
        const image = stage.querySelector('img');
        const ready = () => stage.classList.remove('is-loading');
        stage.classList.toggle('is-loading', !image.complete);
        image.addEventListener('load', ready, { once: true });
        image.addEventListener('error', ready, { once: true });
        caption.textContent = label;

        lastFocus = document.activeElement;
        open = true;
        document.body.classList.add('lightbox-open');
        root.setAttribute('aria-hidden', 'false');
        // Flush the closed state before flipping the class, otherwise a freshly
        // built element goes straight to open with no transition to run.
        void root.offsetWidth;
        root.classList.add('open');
        closeBtn.focus({ preventScroll: true });

        // Give the phone back-gesture something to pop instead of leaving.
        history.pushState({ lightbox: true }, '');

        document.dispatchEvent(new CustomEvent('lightbox:open'));
    }

    function close(fromPop) {
        if (!open) return;
        open = false;
        root.classList.remove('open');
        root.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('lightbox-open');

        // Empty it after the fade so the image does not vanish mid-transition.
        setTimeout(() => { if (!open) stage.innerHTML = ''; }, 420);

        if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
        if (!fromPop && history.state && history.state.lightbox) {
            popping = true;
            history.back();
        }

        // The observer will not fire again on its own, so the cards behind
        // need an explicit nudge to pick back up.
        document.dispatchEvent(new CustomEvent('lightbox:close'));
    }

    window.addEventListener('popstate', () => {
        // Our own back() — already closed, so swallow it.
        if (popping) { popping = false; return; }
        if (open) close(true);
    });

    return { show, close, isOpen: () => open };
})();

function initLightbox() {
    const triggers = [...document.querySelectorAll('[data-lightbox]')];

    // Fetched up front, so opening one is instant.
    triggers.forEach(t => {
        new Image().src = t.dataset.lightbox;
    });

    // These open a dialog, so they need to behave like controls: reachable by
    // keyboard and announced as buttons, not decorative images.
    triggers.forEach(t => {
        if (t.tagName === 'IMG') {
            t.tabIndex = 0;
            t.setAttribute('role', 'button');
        }
    });

    // There is no hover on a phone, so a tap is what "selected" means there.
    // The class drives the same color + sky frame that a mouse hover does.
    function select(trigger) {
        document.querySelectorAll('.is-selected')
            .forEach(el => el.classList.remove('is-selected'));
        trigger.classList.add('is-selected');
        const frame = trigger.closest('.hero-portrait');
        if (frame) frame.classList.add('is-selected');
    }

    function open(trigger) {
        select(trigger);
        lightbox.show(trigger.dataset.lightbox, {
            label: trigger.dataset.lightboxLabel || ''
        });
    }

    document.addEventListener('click', e => {
        const trigger = e.target.closest('[data-lightbox]');
        if (!trigger) return;
        e.preventDefault();
        open(trigger);
    });

    document.addEventListener('keydown', e => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        const trigger = e.target.closest && e.target.closest('[data-lightbox]');
        if (!trigger) return;
        e.preventDefault();
        open(trigger);
    });
}

/* ---------- Scroll reveal ---------- */

function initReveal() {
    const items = document.querySelectorAll('[data-reveal]');
    if (reduceMotion || !('IntersectionObserver' in window)) {
        items.forEach(el => el.classList.add('in'));
        return;
    }
    const obs = new IntersectionObserver((entries, o) => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            e.target.classList.add('in');
            o.unobserve(e.target);
        });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    items.forEach(el => obs.observe(el));
}

/* ---------- Nav: hide on scroll down, mark the current section ---------- */

function initNav() {
    const nav = document.getElementById('nav');
    const links = [...document.querySelectorAll('[data-nav]')];
    const sections = links
        .map(a => document.querySelector(a.getAttribute('href')))
        .filter(Boolean);

    let last = window.scrollY;
    let ticking = false;

    function onScroll() {
        const y = window.scrollY;
        nav.classList.toggle('hidden', y > last && y > 400);
        last = y;

        // Whichever section straddles a third of the way down the viewport wins.
        const mark = y + window.innerHeight / 3;
        let current = null;
        sections.forEach(s => {
            if (s.offsetTop <= mark) current = s.id;
        });
        links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(onScroll);
    }, { passive: true });
}

/* ---------- Clocks ---------- */

function initClock() {
    const targets = [document.getElementById('nav-clock'), document.getElementById('footer-clock')]
        .filter(Boolean);
    if (!targets.length) return;

    const fmt = new Intl.DateTimeFormat('en-US', {
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: true, timeZone: 'America/Phoenix'
    });

    const tick = () => {
        const t = fmt.format(new Date());
        targets.forEach(el => el.textContent = t);
    };
    tick();
    setInterval(tick, 1000);
}

/* ---------- Boot ---------- */

function init() {
    document.documentElement.style.setProperty('--accent', content.accent);

    renderAbout();
    renderMarquee();
    renderStack();
    renderProjects(content.projects);

    initVideos();
    initPanels();
    initPortraits();
    initLightbox();
    initReveal();
    initNav();
    initClock();

    // The bar holds until the heavy setup is done, but never more than a few seconds.
    const cap = new Promise(resolve => setTimeout(resolve, 6000));
    Promise.race([window.siteWarm || Promise.resolve(), cap])
        .then(() => window.siteLoader.finish(() => document.body.classList.add('ready')));
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
