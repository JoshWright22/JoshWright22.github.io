const content = {
    accent: '#0073e6',
    hero: '',
    aboutH: 'Software & Game Developer',
    aboutT: 'Designing and building games and software with other talented people. Focused on building fun, polished experiences that people actually want to play and use. Senior at ASU and always open to collaborating on something interesting.',
    links: [
        { text: 'GitHub ↗', url: 'https://github.com/JoshWright22' },
        { text: 'LinkedIn ↗', url: 'https://www.linkedin.com/in/joshua-wright-a94143338/' },
        { text: 'Twitter ↗', url: 'https://x.com/joshwright_dev' },
        { text: 'YouTube ↗', url: 'https://www.youtube.com/@JoshWright_Dev' }
    ],
    profileImg: 'assets/me.jpg',
    stack: ['C#', 'Unity', 'GDScript', 'Godot', 'Java', 'Python', 'JavaScript', 'HTML/CSS', 'HLSL', 'REST APIs', 'Multiplayer Networking', 'Procedural Generation', 'Git', 'SQL', '.NET', 'JSON', 'Game Design', 'Gameplay Programming', 'Level Design', 'UI/UX Design', 'Web Design', 'Team Leadership'],
    projects: [
        {
            title: 'Slush Rush',
            desc: 'Designed and implemented core game mechanics while directing a small team. Built polished, engaging gameplay systems for this game jam entry. Placed top 15% in the jam.',
            img: './assets/slush-rush.webm',
            link: 'https://joshwright.itch.io/slush-rush'
        },
        {
            title: 'Gob Spin',
            desc: 'Led a small team through the development of this one week game jam entry. A physics-based action game where you play as a goblin who spins, helped implement systems and directed gameplay design. Placed top 5% in the jam.',
            img: './assets/gobspin.webm',
            link: 'https://hozer347.itch.io/gobspin'
        },
        {
            title: 'Game Dev Club Club Website',
            desc: 'Worked with the team behind Game Dev Club Club, a global network of student game developers from over 70 university clubs. Bridged the design and website teams and developed the design for the Contact Us page, an interactive solar system where the sun opens a message form and each orbiting planet links to a platform.',
            img: './assets/gdcc-contact.webm',
            link: 'https://gamedevclubclub.com/'
        },
        {
            title: 'GRAV-AND-GO (ASU VGDC Game 2025-26)',
            desc: 'Collaborated with the Systems Team to integrate core mechanics including physics-based forces and player movement.',
            img: './assets/ezgif-1804722bd5a82cf8.webm',
            link: 'https://heatwave-studios.itch.io/grav-and-go'
        },
        {
            title: 'Anime Card Battler',
            desc: 'A networked multiplayer card game utilizing a custom REST API for secure server requests and game state synchronization.',
            img: './assets/project3.webm',
            link: 'https://github.com/JoshWright22/animecardbattler'
        },
        {
            title: '3D Dungeon Game',
            desc: 'An exploration of 3D environment design and dungeon crawling mechanics. Developed with a focus on level geometry and lighting.',
            img: './assets/project2.webm',
            link: 'https://github.com/JoshWright22/3dFungeonGame'
        }
    ]
};

function renderProjects(projects) {
    const container = document.getElementById('projects-container');
    if (!container) return;
    container.innerHTML = '';

    projects.forEach((proj, index) => {
        const isVideo = proj.img.endsWith('.webm') || proj.img.endsWith('.mp4');
        const linkHTML = proj.link ? `<a href="${proj.link}" target="_blank" class="project-link">VIEW PROJECT ↗</a>` : '';

        // Still frame shown until the video itself is ready, so cards never flash black.
        // Convention: foo.webm -> foo-poster.jpg (override per project with `poster`).
        const poster = proj.poster || proj.img.replace(/\.(webm|mp4)$/, '-poster.jpg');

        const mediaHTML = isVideo
            ? `<video muted loop playsinline preload="none" poster="${poster}" class="project-video" onmouseenter="this.play().catch(() => {})" onmouseleave="this.pause()">
                <source src="${proj.img}" type="video/webm">
               </video>`
            : `<div class="project-image" style="background-image: url('${proj.img}');"></div>`;

        // Clicking the media opens the project too, same as the VIEW PROJECT button
        const mediaBlock = proj.link
            ? `<a href="${proj.link}" target="_blank" class="project-media-link" aria-label="${proj.title} — view project">${mediaHTML}</a>`
            : mediaHTML;

        container.innerHTML += `
            <div class="grid-section">
                <div class="grid-block" style="grid-column: 1 / 3;">
                    <div class="project-wrapper">
                        <span class="label">02.${index + 1} / Project</span>
                        <h2 class="dynamic-proj-title">${proj.title}</h2>
                        ${mediaBlock}
                        <div class="project-meta-row">
                            <p class="dynamic-proj-desc">${proj.desc}</p>
                            ${linkHTML}
                        </div>
                    </div>
                </div>
            </div>`;
    });
}

/* Nothing downloads on page load. Once a card gets close to the viewport its clip
   starts buffering, so it is ready to play the moment the user hovers. */
function warmVideosOnApproach() {
    const videos = document.querySelectorAll('.project-video');
    if (!('IntersectionObserver' in window)) {
        videos.forEach(v => { v.preload = 'auto'; v.load(); });
        return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const video = entry.target;
            video.preload = 'auto';
            video.load();
            obs.unobserve(video);
        });
    }, { rootMargin: '400px 0px' }); // start early, before the card is on screen

    videos.forEach(v => observer.observe(v));
}

function initPage() {
    const root = document.documentElement;

    // Set Engineering Colors
    root.style.setProperty('--bg', '#1a1a1a');
    root.style.setProperty('--text', '#ffffff');
    root.style.setProperty('--border', '#333333');
    root.style.setProperty('--accent', content.accent);

    // Update Text & Images
    if (document.getElementById('hero-title')) {
        document.getElementById('hero-title').innerHTML = content.hero;
    }
    document.getElementById('about-heading').innerText = content.aboutH;
    document.getElementById('about-text').innerText = content.aboutT;
    document.getElementById('profile-img').src = content.profileImg;

    // Update Links
    const linkContainer = document.getElementById('primary-links-container');
    if (linkContainer) {
        linkContainer.innerHTML = content.links.map(link => `
            <a href="${link.url}" target="_blank" class="nav-link">
                ${link.text}
            </a>
        `).join('');
    }

    // Update Tech Stack
    const stackContainer = document.getElementById('stack-tags');
    if (stackContainer) {
        stackContainer.innerHTML = content.stack.map(s => `<span class="skills-tag">${s}</span>`).join('');
    }

    renderProjects(content.projects);
    warmVideosOnApproach();

    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        document.querySelectorAll('.project-video').forEach(v => v.play());
    }
}

window.onload = initPage;