const content = {
    accent: '#0073e6',
    hero: '',
    aboutH: 'Game Developer',
    aboutT: 'Hey I\'m Josh. I\'m a game developer and software engineer with a passion for creating interesting, fun experiences and solving problems for artists, developers, and end users. I have experience creating games and engineering systems in a variety of frameworks and in dynamic team environments. I\'m currently a student at Arizona State University studying Computer Science with a focus on Game Development, and I\'m always looking for new opportunities to learn and grow as a developer. Please let me know if you want to collaborate on a project, or if you have any questions about my work!',
    links: [
        { text: 'GitHub ↗', url: 'https://github.com/JoshWright22' },
        { text: 'LinkedIn ↗', url: 'https://www.linkedin.com/in/joshua-wright-a94143338/' },
        { text: 'Twitter ↗', url: 'https://x.com/joshwright_dev' },
        { text: 'YouTube ↗', url: 'https://www.youtube.com/@JoshWright_Dev' }
    ],
    profileImg: 'assets/me.jpg',
    stack: ['C#', '.NET', 'Python', 'C++', 'JavaScript', 'TypeScript', 'Node.js', 'Java', 'SQL', 'x86 Assembly', 'AI/ML Model Evaluation', 'LLM Benchmarking', 'Data Pipelines', 'Ollama', 'REST APIs', 'Client-Server Architecture', 'P2P Networking', 'State Synchronization', 'Steamworks API', 'Multiplayer Networking', 'Flask', 'Django', 'React', 'HTML/CSS', 'JSON', 'Docker', 'Microsoft Azure', 'Git', 'Unity', 'Unreal Engine', 'Godot', 'GDScript', 'HLSL', 'Procedural Generation', 'Game Design', 'Gameplay Programming', 'Level Design', 'Web Design', 'UI/UX Design', 'Team Leadership', 'Agile/Scrum', 'Debugging & Optimization'],
    projects: [
        {
            title: 'AtOMoC SHeLiS',
            category: 'Game Development',
            desc: 'I designed and built this chemistry-themed roguelike auto-battler solo, where you buy elements each round and connect them into a growing molecule that fights for you. It handles dozens of dynamic molecular combinations a run. I made it for the Club Club Jam Jam, which I also helped organize and run, and placed #12.',
            expertise: ['Godot', 'GDScript', 'Game Design', 'Gameplay Programming', 'Procedural Generation', 'Systems Design'],
            img: './assets/atomoc-shelis.webm',
            link: 'https://joshwright.itch.io/atomoc-shelis'
        },
        {
            title: 'Slush Rush',
            category: 'Game Development',
            desc: 'I designed and implemented the core game mechanics while directing a small team through a one-week jam. I built polished, engaging gameplay systems under a tight deadline, and we placed top 15% in the jam.',
            expertise: ['Python', 'Godot', 'Team Leadership', 'Systems Design'],
            img: './assets/slush-rush.webm',
            link: 'https://joshwright.itch.io/slush-rush'
        },
        {
            title: 'Gob Spin',
            category: 'Game Development',
            desc: 'I led a small team through the development of this one-week game jam entry, a physics-based action game where you play as a goblin who spins. I helped implement core systems and directed the gameplay design, and we placed top 5% in the jam.',
            expertise: ['C#', 'Unity', 'Physics Systems', 'Team Leadership'],
            img: './assets/gobspin.webm',
            link: 'https://hozer347.itch.io/gobspin'
        },
        {
            title: 'Game Dev Club Club Website',
            category: 'Web Development',
            desc: 'I worked with the team behind Game Dev Club Club, a global network of student game developers from over 70 university clubs. I bridged the design and website teams and built the Contact Us page, an interactive solar system where the sun opens a message form and each orbiting planet links to a platform.',
            expertise: ['React', 'JavaScript', 'Web Design', 'UI/UX Design'],
            img: './assets/gdcc-contact.webm',
            link: 'https://gamedevclubclub.com/'
        },
        {
            title: 'GRAV-AND-GO (ASU VGDC Game 2025-26)',
            category: 'Systems Engineering',
            desc: 'I was Systems Lead on the ASU VGDC team game. I architected a component-based movement system in C# so the rest of the team could build on it without stepping on each other, and tuned the physics controllers and collision logic to hold 90+ FPS on mid-range hardware.',
            expertise: ['C#', 'Unity', 'Physics Systems', 'Team Leadership', 'Git'],
            img: './assets/ezgif-1804722bd5a82cf8.webm',
            link: 'https://heatwave-studios.itch.io/grav-and-go'
        },
        {
            title: 'Anime Card Battler',
            category: 'Backend & Networking',
            desc: 'I built a networked multiplayer card game with a custom REST API for secure server requests and real-time game state synchronization between players.',
            expertise: ['REST APIs', 'Multiplayer Networking', 'C#', 'Node.js'],
            img: './assets/project3.webm',
            link: 'https://github.com/JoshWright22/animecardbattler'
        },
        {
            title: '3D Dungeon Game',
            category: 'Game Development',
            desc: 'I explored 3D environment design and dungeon crawling mechanics, with procedurally laid out floors, focusing on level geometry and lighting throughout.',
            expertise: ['C#', 'Unity', 'Procedural Generation', 'Level Design'],
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
            ? `<a href="${proj.link}" target="_blank" class="project-media-link" aria-label="${proj.title} - view project">${mediaHTML}</a>`
            : mediaHTML;

        const expertiseHTML = proj.expertise && proj.expertise.length
            ? `<div class="project-expertise">${proj.expertise.map(s => `<span class="skills-tag">${s}</span>`).join('')}</div>`
            : '';

        container.innerHTML += `
            <div class="grid-section">
                <div class="grid-block" style="grid-column: 1 / 3;">
                    <div class="project-wrapper">
                        <span class="label">02.${index + 1} / ${proj.category || 'Project'}</span>
                        <h2 class="dynamic-proj-title">${proj.title}</h2>
                        ${mediaBlock}
                        <div class="project-meta-row">
                            <p class="dynamic-proj-desc">${proj.desc}</p>
                            ${linkHTML}
                        </div>
                        ${expertiseHTML}
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