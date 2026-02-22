const content = {
    accent: '#0073e6',
    hero: 'ENGINEERING<br><span style="color:#0073e6">SYSTEMS</span>',
    aboutH: 'Software/AI Engineer',
    aboutT: 'Building scalable solutions and optimizing AI workflows. Junior at ASU with a focus on C# and Python development.',
    links: [
        { text: 'GitHub ↗', url: 'https://github.com/JoshWright22' },
        { text: 'LinkedIn ↗', url: 'https://www.linkedin.com/in/joshua-wright-a94143338/' },
        { text: 'Twitter ↗', url: 'https://twitter.com/yourhandle' }
    ],
    profileImg: 'assets/me.jpg',
    stack: ['C#', '.NET', 'Python', 'Git', 'SQL', 'Azure', 'Java', 'C++', 'Javascript', 'HTML/CSS'],
    projects: [
        {
            title: 'ASU VGDC Game 2025-26',
            desc: 'Collaborated with the Systems Team to integrate core mechanics including physics-based forces and player movement.',
            img: 'assets/ezgif-1804722bd5a82cf8.webm',
            link: 'https://github.com/GDCASU/VGDC-Game-2025-26'
        },
        {
            title: 'Anime Card Battler',
            desc: 'A networked multiplayer card game utilizing a custom REST API for secure server requests and game state synchronization.',
            img: 'assets/project3.webm',
            link: 'https://github.com/JoshWright22/animecardbattler'
        },
        {
            title: '3D Dungeon Game',
            desc: 'An exploration of 3D environment design and dungeon crawling mechanics. Developed with a focus on level geometry and lighting.',
            img: 'assets/project2.webm',
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

        const mediaHTML = isVideo
            ? `<video muted loop playsinline class="project-video" onmouseenter="this.play()" onmouseleave="this.pause()">
                <source src="${proj.img}" type="video/webm">
               </video>`
            : `<div class="project-image" style="background-image: url('${proj.img}');"></div>`;

        container.innerHTML += `
            <div class="grid-section">
                <div class="grid-block" style="grid-column: 1 / 3;">
                    <div class="project-wrapper">
                        <span class="label">02.${index + 1} / Project</span>
                        <h2 class="dynamic-proj-title">${proj.title}</h2>
                        ${mediaHTML}
                        <div class="project-meta-row">
                            <p class="dynamic-proj-desc">${proj.desc}</p>
                            ${linkHTML}
                        </div>
                    </div>
                </div>
            </div>`;
    });
}

function initPage() {
    const root = document.documentElement;

    // Set Engineering Colors
    root.style.setProperty('--bg', '#1a1a1a');
    root.style.setProperty('--text', '#ffffff');
    root.style.setProperty('--border', '#333333');
    root.style.setProperty('--accent', content.accent);

    // Update Text & Images
    document.getElementById('hero-title').innerHTML = content.hero;
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
}

window.onload = initPage;