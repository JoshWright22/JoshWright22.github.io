const content = {
    dev: {
        accent: '#0073e6',
        hero: 'ENGINEERING<br><span style="color:#0073e6">SYSTEMS</span>',
        aboutH: 'Software/AI Engineer',
        aboutT: 'Building scalable solutions and optimizing AI workflows. Junior at ASU with a focus on C# and Python development.',
        linkText: 'GitHub ↗',
        linkUrl: 'https://github.com/JoshWright22',
        profileImg: 'assets/me.jpg', // Updated path
        stack: ['C#', '.NET', 'Python', 'Azure', 'Git', 'SQL'],
        btn: 'SWITCH TO JOSH_ART',
        projects: [
            {
                title: 'ASU VGDC Game 2025-26',
                desc: 'Collaborated with the Systems Team to integrate core mechanics including physics-based forces and player movement.',
                img: 'assets/ezgif-1804722bd5a82cf8.webm', // Make sure to add this image to your assets folder!
                link: 'https://github.com/GDCASU/VGDC-Game-2025-26'
            }
        ]
    },
    art: {
        accent: '#ff4d6d',
        hero: 'CRAFTING<br><span style="color:#ff4d6d">VISUALS</span>',
        aboutH: '3D Artist & Animator',
        aboutT: 'Crafting immersive environments and 3D assets. Experienced in Blender and Maya.',
        linkText: 'ArtStation ↗',
        linkUrl: 'https://joshwrightart.artstation.com',
        profileImg: 'assets/your-dev-photo.jpg', // Update this when you add art photo
        stack: ['Blender', 'Autodesk Maya', 'ZBrush', 'Substance', 'Animation'],
        btn: 'SWITCH TO JOSH_DEV',
        projects: [
            {
                title: 'Atmospheric Environment',
                desc: 'A deep-dive into lighting and texture work using Blender Cycles.',
                img: 'assets/dev-project-1.jpg', // Update this when you add art image
                link: ''
            },
            {
                title: 'Atmospheric Environment',
                desc: 'A deep-dive into lighting and texture work using Blender Cycles.',
                img: 'assets/dev-project-1.jpg', // Update this when you add art image
                link: ''
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
            </div>
        `;
    });
}

function updatePage() {
    // isArt = false (Engineering) -> content.dev
    // isArt = true (Art) -> content.art
    const data = isArt ? content.art : content.dev;
    const root = document.documentElement;

    // --- COLOR SWAP LOGIC ---
    if (isArt) {
        // ART MODE: White Theme
        root.style.setProperty('--bg', '#ffffff');
        root.style.setProperty('--text', '#1a1a1a');
        root.style.setProperty('--border', '#e5e5e5');
    } else {
        // ENGINEERING MODE: Black Theme (Default)
        root.style.setProperty('--bg', '#1a1a1a');
        root.style.setProperty('--text', '#ffffff');
        root.style.setProperty('--border', '#333333');
    }

    // Update the Accent Color (Blue for Dev, Pink for Art)
    root.style.setProperty('--accent', data.accent);

    // --- TEXT & IMAGE UPDATES ---
    document.getElementById('hero-title').innerHTML = data.hero;
    document.getElementById('about-heading').innerText = data.aboutH;
    document.getElementById('about-text').innerText = data.aboutT;
    document.getElementById('toggle-btn').innerText = data.btn;
    document.getElementById('profile-img').src = data.profileImg;

    const pLink = document.getElementById('primary-link');
    if (pLink) {
        pLink.innerText = data.linkText;
        pLink.href = data.linkUrl;
    }

    // Update Stack Tags
    const stackContainer = document.getElementById('stack-tags');
    if (stackContainer) {
        stackContainer.innerHTML = '';
        data.stack.forEach(s => {
            stackContainer.innerHTML += `<span class="skills-tag">${s}</span>`;
        });
    }

    // Render Projects
    renderProjects(data.projects);
}

function toggleMode() {
    isArt = !isArt;
    updatePage();
}

window.onload = updatePage;