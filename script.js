const content = {
    dev: {
        accent: '#0073e6',
        hero: 'ENGINEERING<br><span style="color:#0073e6">SYSTEMS</span>',
        aboutH: 'Software/AI Engineer',
        aboutT: 'Building scalable solutions and optimizing AI workflows. Junior at ASU with a focus on C# and Python development.',
        links: [
            { text: 'Youtube ↗', url: '' },
            { text: 'Twitter ↗', url: '' },
            { text: 'GitHub ↗', url: 'https://github.com/JoshWright22' },

            { text: 'LinkedIn ↗', url: 'https://www.linkedin.com/in/joshua-wright-a94143338/' }
        ],
        profileImg: 'assets/me.jpg',
        stack: ['C#', '.NET', 'Python', 'Git', 'SQL', 'Azure', 'Java', 'C++', 'Javascript', 'HTML/CSS'],
        btn: 'SWITCH TO JOSH_ART',
        projects: [
            {
                title: 'ASU VGDC Game 2025-26',
                desc: 'Collaborated with the Systems Team to integrate core mechanics including physics-based forces and player movement.',
                img: 'assets/ezgif-1804722bd5a82cf8.webm',
                link: 'https://github.com/GDCASU/VGDC-Game-2025-26'
            },
            {
                title: 'Anime Card Battler',
                desc: 'A networked multiplayer card game utilizing a custom REST API for secure server requests and game state synchronization. Features a scalable architecture for card-effect triggers and real-time combat data handling.',
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
    },
    art: {
        accent: '#ff4d6d',
        hero: 'CRAFTING<br><span style="color:#ff4d6d">VISUALS</span>',
        aboutH: '2D Artist & 3D Animator',
        aboutT: 'I love to draw and animate. I have a passion for art, and I’m always looking for new ways to challenge myself and grow as an artist.',
        links: [
            { text: 'YouTube ↗', url: 'https://youtube.com/@yourchannel' },
            { text: 'Twitter ↗', url: 'https://twitter.com/yourhandle' },
            { text: 'ArtStation ↗', url: 'https://joshwrightart.artstation.com' }
            
            
        ],
        profileImg: 'assets/me.jpg',
        stack: ['Blender', 'Autodesk Maya', 'ZBrush', 'Substance Painter', 'After Effects', 'Procreate'],
        btn: 'SWITCH TO JOSH_DEV',
        projects: [
            {
                title: 'Digital Concept Gallery',
                desc: 'A collection of 2D character designs and environmental concept art exploring light, shadow, and color theory.',
                img: 'assets/projects/2d-concepts.jpg',
                link: 'https://joshwrightart.artstation.com/albums/concepts'
            },
            {
                title: '3D Animation Reel',
                desc: 'Highlighting my expertise in character movement, physics-based simulations, and expressive facial rigging.',
                img: 'assets/projects/animation-thumb.jpg',
                link: 'https://youtube.com/watch?v=yourreel'
            },
            {
                title: 'Environmental Assets',
                desc: 'Game-ready 3D assets optimized for performance, from high-poly sculpting to PBR texturing.',
                img: 'assets/projects/3d-assets.jpg',
                link: 'https://joshwrightart.artstation.com/albums/3d'
            }
        ]
    }
};

let isArt = false;

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

function updatePage() {
    const data = isArt ? content.art : content.dev;
    const root = document.documentElement;

    // 1. UPDATE BODY CLASS (Crucial for CSS overrides)
    if (isArt) {
        document.body.classList.add('art-mode');
        root.style.setProperty('--bg', '#ffffff');
        root.style.setProperty('--text', '#1a1a1a');
        root.style.setProperty('--border', '#e5e5e5');
    } else {
        document.body.classList.remove('art-mode');
        root.style.setProperty('--bg', '#1a1a1a');
        root.style.setProperty('--text', '#ffffff');
        root.style.setProperty('--border', '#333333');
    }

    root.style.setProperty('--accent', data.accent);

    // 2. TEXT & IMAGE UPDATES
    document.getElementById('hero-title').innerHTML = data.hero;
    document.getElementById('about-heading').innerText = data.aboutH;
    document.getElementById('about-text').innerText = data.aboutT;
    document.getElementById('toggle-btn').innerText = data.btn;
    document.getElementById('profile-img').src = data.profileImg;

    // 3. MULTIPLE LINKS UPDATE
    const linkContainer = document.getElementById('primary-links-container');
    if (linkContainer) {
        linkContainer.innerHTML = data.links.map(link => `
            <a href="${link.url}" target="_blank" class="nav-link">
                ${link.text}
            </a>
        `).join(''); // Uses map/join for cleaner string concatenation
    }

    // 4. STACK TAGS UPDATE
    const stackContainer = document.getElementById('stack-tags');
    if (stackContainer) {
        stackContainer.innerHTML = data.stack.map(s => `<span class="skills-tag">${s}</span>`).join('');
    }

    renderProjects(data.projects);
}

function toggleMode() {
    isArt = !isArt;
    updatePage();
}

window.onload = updatePage;