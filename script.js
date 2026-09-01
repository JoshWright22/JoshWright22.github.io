/* =============================================================
   Josh Wright — portfolio
   Content lives at the top; everything below renders and animates it.
   No dependencies.
   ============================================================= */

const content = {
    // Sky from assets/me.jpg. Mirrors --accent in style.css.
    accent: '#4776ca',
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
    stack: ['C#', '.NET', 'Python', 'C++', 'JavaScript', 'TypeScript', 'Node.js', 'Java', 'SQL', 'x86 Assembly', 'AI/ML Model Evaluation', 'LLM Benchmarking', 'Data Pipelines', 'Ollama', 'REST APIs', 'Client-Server Architecture', 'P2P Networking', 'State Synchronization', 'Steamworks API', 'Multiplayer Networking', 'Flask', 'Django', 'React', 'HTML/CSS', 'JSON', 'Docker', 'Microsoft Azure', 'Git', 'Unity', 'Unreal Engine', 'Godot', 'GDScript', 'HLSL', 'Blender', 'Maya', 'Cinema 4D', '3D Modeling & Animation', 'Rigging', 'Plugin & Tool Development', 'Scripting Pipelines', 'Cross-Platform Testing', 'QA & Debugging', 'Real-Time Rendering', 'Procedural Generation', 'Game Design', 'Gameplay Programming', 'Level Design', 'Web Design', 'UI/UX Design', 'Team Leadership', 'Agile/Scrum', 'Debugging & Optimization'],
    projects: [
        {
            title: 'Trust No One',
            category: 'Game Development',
            date: 'August 2026',
            desc: 'I worked with a team of six as a designer, programmer, and writer on this psychedelic roguelike dungeon crawl, built in one week for the Brackeys Game Jam 2026.2, where it finished 14th most popular out of 2,291 entries, the top 0.6%. I balanced the combat so all three core actions are worth using, instead of one being the obvious best move every turn. I also designed the party members and upgrades so each one has its own build, personality, and story, and I wrote all the dialogue.',
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
            desc: 'I worked on the Systems Team on the ASU VGDC yearly game. I architected a component-based movement system in C# so the rest of the team could build on it without stepping on each other, and tuned the physics controllers and collision logic to hold 90+ FPS on mid-range hardware.',
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

    const profile = document.getElementById('profile-img');
    profile.src = content.profileImg;
    profile.dataset.lightbox = content.profileImg;
    profile.dataset.lightboxLabel = 'Josh Wright / ASU Computer Science';

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

        // Stills get a popup; clips play themselves in place and don't need one.
        // The button sits beside the link, so a tap on mobile is never an
        // ambiguous "expand or leave the site".
        const expand = isVideo ? '' : `
            <button type="button" class="media-expand"
                    data-lightbox="${proj.img}"
                    data-lightbox-label="${proj.title}"
                    aria-label="Expand ${proj.title}">⤢ Expand</button>`;

        // The button is a sibling of the anchor, not a child — nesting a
        // control inside a link is invalid and swallows the tap.
        const inner = proj.link
            ? `<a href="${proj.link}" target="_blank" rel="noopener" class="project-media-link" aria-label="${proj.title}, view project">${media}</a>`
            : `<div class="project-media-link">${media}</div>`;

        const mediaBlock = `<div class="project-media">${inner}${expand}</div>`;

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

    // Nothing downloads on load. A clip starts buffering once its card is near
    // the viewport, so it is ready by the time it scrolls in.
    if ('IntersectionObserver' in window) {
        const warm = new IntersectionObserver((entries, obs) => {
            entries.forEach(e => {
                if (!e.isIntersecting) return;
                e.target.preload = 'auto';
                e.target.load();
                obs.unobserve(e.target);
            });
        }, { rootMargin: '600px 0px' });
        videos.forEach(v => warm.observe(v));
    } else {
        videos.forEach(v => { v.preload = 'auto'; v.load(); });
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

    renderAbout();
    renderMarquee();
    renderStack();
    renderProjects(content.projects);

    initVideos();
    initPortraits();
    initLightbox();
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
