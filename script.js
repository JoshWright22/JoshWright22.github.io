/* =============================================================
   Josh Wright — portfolio
   Content lives at the top; everything below renders and animates it.
   No dependencies.
   ============================================================= */

const content = {
    accent: '#0073e6',
    aboutH: 'Game Developer',
    aboutT: 'Hey I\'m Josh. I\'m a game developer and software engineer with a passion for creating interesting, fun experiences and solving problems for artists, developers, and end users. I have experience creating games and engineering systems in a variety of frameworks and in dynamic team environments. I\'m currently a student at Arizona State University studying Computer Science with a focus on Game Development, and I\'m always looking for new opportunities to learn and grow as a developer. Please let me know if you want to collaborate on a project, or if you have any questions about my work!',
    links: [
        { text: 'GitHub', url: 'https://github.com/JoshWright22' },
        { text: 'LinkedIn', url: 'https://www.linkedin.com/in/joshua-wright-a94143338/' },
        { text: 'Twitter', url: 'https://x.com/joshwright_dev' },
        { text: 'Instagram', url: 'https://www.instagram.com/joshwrightisoninsta/' },
        { text: 'YouTube', url: 'https://www.youtube.com/@JoshWright_Dev' }
    ],
    profileImg: 'assets/me-hero.jpg',
    marquee: ['Game Development', 'Systems Engineering', 'Gameplay Programming', 'Procedural Generation', 'Multiplayer Networking', 'Tools & Pipelines', 'Web Development'],
    stack: ['C#', '.NET', 'Python', 'C++', 'JavaScript', 'TypeScript', 'Node.js', 'Java', 'SQL', 'x86 Assembly', 'AI/ML Model Evaluation', 'LLM Benchmarking', 'Data Pipelines', 'Ollama', 'REST APIs', 'Client-Server Architecture', 'P2P Networking', 'State Synchronization', 'Steamworks API', 'Multiplayer Networking', 'Flask', 'Django', 'React', 'HTML/CSS', 'JSON', 'Docker', 'Microsoft Azure', 'Git', 'Unity', 'Unreal Engine', 'Godot', 'GDScript', 'HLSL', 'Procedural Generation', 'Game Design', 'Gameplay Programming', 'Level Design', 'Web Design', 'UI/UX Design', 'Team Leadership', 'Agile/Scrum', 'Debugging & Optimization'],
    projects: [
        {
            title: 'Trust No One',
            category: 'Game Development',
            date: 'August 2026',
            desc: 'I worked with a team of six as a designer, programmer, and writer on this psychedelic roguelike dungeon crawl, built in one week for the Brackeys Game Jam 2026.2. I balanced the encounters so all three core actions stay real decisions instead of one dominant strategy, and built thematic character builds where party members and upgrades carry their own depth and story arcs, which I wrote the dialogue for.',
            expertise: ['C#', 'Unity', 'Game Design', 'Gameplay Programming', 'Systems Design', 'Narrative Writing'],
            img: './assets/trust-no-one.webm',
            link: 'https://hozer347.itch.io/trust-no-one'
        },
        {
            title: 'AtOMoC SHeLiS',
            category: 'Game Development',
            date: 'August 2026',
            desc: 'I designed and built this chemistry-themed roguelike auto-battler solo, where you buy elements each round and connect them into a growing molecule that fights for you. It handles dozens of dynamic molecular combinations a run. I made it for the Club Club Jam Jam, which I also helped organize and run, and placed #12.',
            expertise: ['Godot', 'GDScript', 'Game Design', 'Gameplay Programming', 'Procedural Generation', 'Systems Design'],
            img: './assets/atomoc-shelis.webm',
            link: 'https://joshwright.itch.io/atomoc-shelis'
        },
        {
            title: 'Slush Rush',
            category: 'Game Development',
            date: 'June 2026',
            desc: 'I designed and implemented the core game mechanics while directing a small team through a one-week jam. I built polished, engaging gameplay systems under a tight deadline, and we placed top 15% in the jam.',
            expertise: ['Python', 'Godot', 'Team Leadership', 'Systems Design'],
            img: './assets/slush-rush.webm',
            link: 'https://joshwright.itch.io/slush-rush'
        },
        {
            title: 'Gob Spin',
            category: 'Game Development',
            date: 'June 2026',
            desc: 'I led a small team through the development of this one-week game jam entry, a physics-based action game where you play as a goblin who spins. I helped implement core systems and directed the gameplay design, and we placed top 5% in the jam.',
            expertise: ['C#', 'Unity', 'Physics Systems', 'Team Leadership'],
            img: './assets/gobspin.webm',
            link: 'https://hozer347.itch.io/gobspin'
        },
        {
            title: 'Game Dev Club Club Website',
            category: 'Web Development',
            date: '2026',
            desc: 'I worked with the team behind Game Dev Club Club, a global network of student game developers from over 70 university clubs. I bridged the design and website teams and built the Contact Us page, an interactive solar system where the sun opens a message form and each orbiting planet links to a platform.',
            expertise: ['React', 'JavaScript', 'Web Design', 'UI/UX Design'],
            img: './assets/gdcc-contact.webm',
            link: 'https://gamedevclubclub.com/'
        },
        {
            title: 'GRAV-AND-GO (ASU VGDC Game 2025-26)',
            category: 'Systems Engineering',
            date: '2025 - 2026',
            desc: 'I was worked on the Systems Team on the ASU VGDC yearly game. I architected a component-based movement system in C# so the rest of the team could build on it without stepping on each other, and tuned the physics controllers and collision logic to hold 90+ FPS on mid-range hardware.',
            expertise: ['C#', 'Unity', 'Physics Systems', 'Team Leadership', 'Git'],
            img: './assets/ezgif-1804722bd5a82cf8.webm',
            link: 'https://heatwave-studios.itch.io/grav-and-go'
        },
        {
            title: 'Anime Card Battler',
            category: 'Backend & Networking',
            date: '2024',
            desc: 'I built a networked multiplayer card game with a custom REST API for secure server requests and real-time game state synchronization between players.',
            expertise: ['REST APIs', 'Multiplayer Networking', 'C#', 'Node.js'],
            img: './assets/project3.webm',
            link: 'https://github.com/JoshWright22/animecardbattler'
        },
        {
            title: '3D Dungeon Game',
            category: 'Game Development',
            date: 'October 2025',
            desc: 'I explored 3D environment design and dungeon crawling mechanics, with procedurally laid out floors, focusing on level geometry and lighting throughout.',
            expertise: ['C#', 'Unity', 'Procedural Generation', 'Level Design'],
            img: './assets/project2.webm',
            link: 'https://github.com/JoshWright22/3dFungeonGame'
        }
    ]
};

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

/* ---------- Rendering ---------- */

function renderAbout() {
    document.getElementById('about-heading').textContent = content.aboutH;
    document.getElementById('about-text').textContent = content.aboutT;
    document.getElementById('profile-img').src = content.profileImg;

    document.getElementById('primary-links-container').innerHTML = content.links.map(l => `
        <a class="link-row" href="${l.url}" target="_blank" rel="noopener">
            <span>${l.text}</span><span class="arrow">↗</span>
        </a>`).join('');

    document.getElementById('footer-socials').innerHTML = content.links.map(l =>
        `<a class="footer-link" href="${l.url}" target="_blank" rel="noopener">${l.text} ↗</a>`).join('');
}

/* The track is duplicated so the -50% translate loop is seamless. */
function renderMarquee() {
    const track = document.getElementById('marquee-track');
    const half = content.marquee
        .map(t => `<span>${t}</span><span class="sep">✳</span>`).join('');
    track.innerHTML = half + half;
}

function renderStack() {
    document.getElementById('stack-tags').innerHTML =
        content.stack.map(s => `<span class="tag">${s}</span>`).join('');
}

function renderProjects(projects) {
    const container = document.getElementById('projects-container');
    if (!container) return;

    document.getElementById('work-count').textContent =
        `${String(projects.length).padStart(2, '0')} projects`;

    container.innerHTML = projects.map((proj, i) => {
        const num = String(i + 1).padStart(2, '0');
        const isVideo = /\.(webm|mp4)$/.test(proj.img);

        // Still frame shown until the video is ready, so cards never flash black.
        // Convention: foo.webm -> foo-poster.jpg (override per project with `poster`).
        const poster = proj.poster || proj.img.replace(/\.(webm|mp4)$/, '-poster.jpg');

        const media = isVideo
            ? `<video muted loop playsinline preload="none" poster="${poster}" class="project-video">
                   <source src="${proj.img}" type="video/${proj.img.endsWith('.mp4') ? 'mp4' : 'webm'}">
               </video>`
            : `<div class="project-image" style="background-image:url('${proj.img}')"></div>`;

        const mediaBlock = proj.link
            ? `<a href="${proj.link}" target="_blank" rel="noopener" class="project-media-link" aria-label="${proj.title}, view project">${media}</a>`
            : `<div class="project-media-link">${media}</div>`;

        const tags = (proj.expertise || [])
            .map(s => `<span class="tag">${s}</span>`).join('');

        const link = proj.link
            ? `<a class="project-link" href="${proj.link}" target="_blank" rel="noopener">View project ↗</a>`
            : '';

        return `
        <article class="project" data-reveal>
            <div class="project-head">
                <span class="mono project-num">${num}</span>
                <span class="mono muted">${proj.category || 'Project'}</span>
                <span class="mono muted">${proj.date || ''}</span>
            </div>
            <h3 class="project-title">${proj.title}</h3>
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

/* ---------- Video: buffer on approach, play on hover ---------- */

function initVideos() {
    const videos = [...document.querySelectorAll('.project-video')];
    if (!videos.length) return;

    // Nothing downloads on load. A clip starts buffering once its card is near
    // the viewport, so it is ready the moment the pointer arrives.
    if ('IntersectionObserver' in window) {
        const warm = new IntersectionObserver((entries, obs) => {
            entries.forEach(e => {
                if (!e.isIntersecting) return;
                e.target.preload = 'auto';
                e.target.load();
                obs.unobserve(e.target);
            });
        }, { rootMargin: '400px 0px' });
        videos.forEach(v => warm.observe(v));
    } else {
        videos.forEach(v => { v.preload = 'auto'; v.load(); });
    }

    if (isTouch) {
        // No hover on touch: play whatever is on screen, pause the rest.
        if (!('IntersectionObserver' in window)) {
            videos.forEach(v => v.play().catch(() => { }));
            return;
        }
        const play = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) e.target.play().catch(() => { });
                else e.target.pause();
            });
        }, { threshold: 0.35 });
        videos.forEach(v => play.observe(v));
        return;
    }

    videos.forEach(v => {
        const card = v.closest('.project-media-link') || v;
        card.addEventListener('mouseenter', () => v.play().catch(() => { }));
        card.addEventListener('mouseleave', () => v.pause());
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
        hour12: false, timeZone: 'America/Phoenix'
    });

    const tick = () => {
        const t = fmt.format(new Date()) + ' MST';
        targets.forEach(el => el.textContent = t);
    };
    tick();
    setInterval(tick, 1000);
}

/* ---------- Preloader ---------- */

function runLoader(done) {
    const loader = document.getElementById('loader');
    const count = document.getElementById('loader-count');
    const fill = document.getElementById('loader-fill');

    if (reduceMotion) {
        loader.remove();
        done();
        return;
    }

    document.body.classList.add('loading');

    let n = 0;
    const timer = setInterval(() => {
        // Uneven steps read as real loading rather than a linear sweep.
        n = Math.min(100, n + Math.random() * 9 + 3);
        const v = Math.floor(n);
        count.textContent = String(v).padStart(3, '0');
        fill.style.width = v + '%';

        if (n < 100) return;
        clearInterval(timer);
        setTimeout(() => {
            loader.classList.add('done');
            document.body.classList.remove('loading');
            done();
            setTimeout(() => loader.remove(), 1200);
        }, 320);
    }, 90);
}

/* ---------- Boot ---------- */

function init() {
    document.documentElement.style.setProperty('--accent', content.accent);
    document.getElementById('year').textContent = new Date().getFullYear();

    renderAbout();
    renderMarquee();
    renderStack();
    renderProjects(content.projects);

    initVideos();
    initReveal();
    initNav();
    initClock();

    runLoader(() => document.body.classList.add('ready'));
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
