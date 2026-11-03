/* The site as an animation timeline: a graph that runs in from off screen and
   joins one curve threaded down the page, a top bar that works as the timeline,
   and a lamp in the hero that hands you its rig. */

(() => {
    const SVG_NS = 'http://www.w3.org/2000/svg';
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

    // Lets the browser draw a frame between pieces of setup, so the loader never stalls.
    const nextTask = () => new Promise(resolve => setTimeout(resolve));
    const loading = () => document.body.classList.contains('loading');

    // The loader holds until the heavy setup is done, so none of it lands mid-animation.
    let warmDone;
    window.siteWarm = new Promise(resolve => {
        warmDone = resolve;
    });

    const TICK_TARGET = 12;
    const PROJECT_GAP = 28;
    // Opening timings in ms, one set per ?intro= letter. The name always waits for the lamp;
    // name here only applies on phones, which have no lamp.
    const INTROS = {
        a: { bar: 200, banner: 500, curves: 900, name: 900, draw: 2000, lamp: 2900 },
        b: { bar: 0, banner: 300, curves: 600, name: 600, draw: 2000, lamp: 2600 },
        c: { bar: 0, banner: 200, curves: 400, name: 400, draw: 1400, lamp: 1800 },
        d: { bar: 0, banner: 700, curves: 1100, name: 1100, draw: 1900, lamp: 3000 }
    };
    const INTRO = INTROS[new URLSearchParams(location.search).get('intro')] || INTROS.a;
    const CURVE_DELAY = INTRO.curves;
    const DRAW_TIME = INTRO.draw;
    ['bar', 'banner', 'curves', 'name', 'draw'].forEach(part => {
        document.documentElement.style.setProperty(`--t-${part}`, `${INTRO[part]}ms`);
    });
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.classList.add('intro-name-lit');
    }
    const GRAPH_LOOP = 2800;
    const HANDLE_LENGTH = 64;
    const BOUNCE_TIME = 460;
    const LANDING_TIME = 84;
    const SETTLE_TIME = 360;
    const HOP_CLEARANCE = 12;
    const WORD_MARGIN = 20;
    const BALL_REST = 9.5;
    const NAV_TEXT = 11.2;
    const PHONE_HOP = 14;
    const THREAD_SPACING = 760;
    const THREAD_SWINGS = [0.14, 0.82, 0.3, 0.92, 0.08, 0.68, 0.2, 0.88];

    // Keys are [x, y, slope] as fractions of the field. Both curves start off
    // screen. One leaves off the right, the other drops into the page thread.
    const HERO_MAIN = [[-0.08, 0.82, 0], [0.24, 0.2, 0], [0.5, 0.7, -0.4], [0.8, 0.28, 0]];
    const LIGHT = '#bcd3f5';
    const PHOTO_ROWS = 40;
    const OUTLINE_FLIGHT = 1500;
    const PHOTO_START = 1100;
    const PHOTO_ROW = 28;
    const LINE_FLIGHT = 800;
    const PHOTO_FADE = 400;
    const TAG_STEP = 26;
    // The lamp is drawn in a space this tall and scaled to fit the hero, so the lamp, its
    // light and its rig always keep their proportions. Its keys are written for this size.
    const LAMP_HERO = 800;
    const ELBOW_SWING = 0.16;
    const LAMP_BONE = 170;
    const LAMP_BASE = 0.6;
    // How far left of the lamp the curve's low key sits, so the end aim lands on it at any size.
    const LAMP_KEY_REACH = 144;
    const LAMP_ENTRY_GAP = 160;
    const LAMP_FULL_WIDTH = 1440;
    const LAMP_KEY_DROP = 240;
    // Fits the lamp to the hero by height, or by width when the window is narrow.
    const LAMP_MIN_WIDTH = 1000;
    const lampView = (width, height) => Math.min(height / LAMP_HERO, width / LAMP_MIN_WIDTH);
    const BEAM = 'M44 -30 L900 -300 L900 300 L44 30 Z';
    const HERO_ALT = [[-0.08, 0.3, 1], [0.3, 0.8, 0], [0.62, 0.22, 0], [1.08, 0.66, 0.3]];

    function el(name, attrs, parent) {
        const node = document.createElementNS(SVG_NS, name);
        Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
        parent.appendChild(node);
        return node;
    }

    function svgLayer(className) {
        const svg = document.createElementNS(SVG_NS, 'svg');
        svg.setAttribute('class', className);
        svg.setAttribute('aria-hidden', 'true');
        return svg;
    }

    // Works out each key's real control points, then draws the curve through them.
    // A key marked vertical is entered straight down, so the thread picks up cleanly.
    function withHandles(keys) {
        keys.slice(1).forEach((b, i) => {
            const a = keys[i];
            const third = (b.x - a.x) / 3;
            a.out = { x: a.x + third, y: a.y + a.slope * third };
            b.in = b.vertical
                ? { x: b.x, y: b.y - 170 }
                : { x: b.x - third, y: b.y - b.slope * third };
        });
        return keys;
    }

    function toPath(keys) {
        return keys.slice(1).reduce((d, b, i) => (
            `${d} C ${keys[i].out.x} ${keys[i].out.y} ${b.in.x} ${b.in.y} ${b.x} ${b.y}`
        ), `M ${keys[0].x} ${keys[0].y}`);
    }

    function drawHandles(key, parent, radius = 3) {
        [key.in, key.out].filter(Boolean).forEach(point => {
            const length = Math.hypot(point.x - key.x, point.y - key.y);
            const scale = Math.min(1, HANDLE_LENGTH / Math.max(1, length));
            const x = key.x + (point.x - key.x) * scale;
            const y = key.y + (point.y - key.y) * scale;
            el('line', { class: 'curve-handle', x1: key.x, y1: key.y, x2: x, y2: y }, parent);
            el('circle', { class: 'curve-handle-end', cx: x, cy: y, r: radius }, parent);
        });
    }

    function drawKey(key, parent) {
        drawHandles(key, parent);
        el('rect', { class: 'curve-key', x: key.x - 4, y: key.y - 4, width: 8, height: 8 }, parent);
    }

    /* ---------- Hero graph ---------- */

    function drawHero(svg, join) {
        const { width, height } = svg.getBoundingClientRect();
        if (!width || !height) return;
        svg.replaceChildren();
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

        const toKeys = (shape, shift) => shape.map(([x, y, slope]) => ({
            x: x * width,
            y: (y + shift) * height,
            slope: slope * height / width
        }));

        // Horizontal rules only, so nothing runs vertically through the name.
        for (let i = 1; i < 4; i++) {
            const y = height * i / 4;
            el('line', { class: 'curve-grid', x1: 0, y1: y, x2: width, y2: y }, svg);
        }

        const shape = toKeys(HERO_MAIN, 0);
        const scale = lampView(width, height);
        shape[2].x = LAMP_BASE * width - LAMP_KEY_REACH * scale;
        shape[2].y = height - LAMP_KEY_DROP * scale;
        const main = withHandles([...shape, { x: join.x, y: join.y, slope: 0, vertical: true }]);
        const alt = withHandles(toKeys(HERO_ALT, 0.04));
        const altPath = el('path', { class: 'curve-line curve-line--alt', d: toPath(alt), pathLength: 1 }, svg);
        const mainPath = el('path', { class: 'curve-line', d: toPath(main), pathLength: 1 }, svg);

        // The ends are off screen or belong to the thread, so only inner keys get markers.
        const reveal = (keys, path, lag) => keys.forEach(key => {
            const group = el('g', { class: 'curve-mark' }, svg);
            group.style.transitionDelay = `${CURVE_DELAY + lag + DRAW_TIME * alongPath(path, key)}ms`;
            drawKey(key, group);
        });
        reveal(alt.slice(1, -1), altPath, 250);
        reveal(main.slice(1, -1), mainPath, 0);
    }

    // How far along a path a point sits, from 0 to 1.
    function alongPath(path, point) {
        const total = path.getTotalLength();
        let best = 0;
        let nearest = Infinity;
        for (let i = 0; i <= 40; i++) {
            const p = path.getPointAtLength(total * i / 40);
            const gap = Math.hypot(p.x - point.x, p.y - point.y);
            if (gap < nearest) {
                nearest = gap;
                best = i / 40;
            }
        }
        return best;
    }

    /* ---------- Desk lamp: drops in, then hands over a rig to pose with IK ---------- */

    function addLamp(hero) {
        const svg = svgLayer('lamp');
        hero.prepend(svg);
        const lampData = LampIntro.load();

        const defs = el('defs', {}, svg);
        const fade = el('linearGradient', { id: 'lamp-beam', x1: 0, y1: 0, x2: 1, y2: 0 }, defs);
        el('stop', { offset: 0, 'stop-color': LIGHT, 'stop-opacity': 0.34 }, fade);
        el('stop', { offset: 1, 'stop-color': LIGHT, 'stop-opacity': 0 }, fade);

        const body = el('g', {}, svg);
        const beam = el('path', { class: 'lamp-beam', d: BEAM, fill: 'url(#lamp-beam)' }, body);

        // A second beam over the type, multiplied, so the letters themselves take the light.
        const glowLayer = svgLayer('lamp-glow');
        hero.append(glowLayer);
        const glowDefs = el('defs', {}, glowLayer);
        const glowFade = el('linearGradient', { id: 'lamp-glow', gradientUnits: 'userSpaceOnUse', x1: 44, y1: 0, x2: 900, y2: 0 }, glowDefs);
        el('stop', { offset: 0.08, 'stop-color': '#ffffff' }, glowFade);
        el('stop', { offset: 0.16, 'stop-color': LIGHT }, glowFade);
        el('stop', { offset: 0.72, 'stop-color': LIGHT }, glowFade);
        el('stop', { offset: 1, 'stop-color': '#ffffff' }, glowFade);
        const glow = el('path', { d: BEAM, fill: 'url(#lamp-glow)' }, glowLayer);

        const base = el('path', { class: 'lamp-part' }, body);
        const upper = el('line', { class: 'lamp-bone' }, body);
        const upperStrut = el('line', { class: 'lamp-strut' }, body);
        const lower = el('line', { class: 'lamp-bone' }, body);
        const lowerStrut = el('line', { class: 'lamp-strut' }, body);
        const joints = [0, 1, 2].map(() => el('circle', { class: 'lamp-joint', r: 6 }, body));
        const head = el('g', { class: 'lamp-head' }, body);
        el('path', { class: 'lamp-part', d: 'M-10 -9 L6 -13 L32 -30 L32 30 L6 13 L-10 9 Z' }, head);
        el('path', { class: 'lamp-bulb', d: 'M32 -14 A16 16 0 0 1 32 14 Z' }, head);

        // Control curves sit in their own layer above the hero text so they stay
        // grabbable, coloured the way a Maya rig usually is. Script moves the
        // outer group and CSS sweeps the inner curve in, so the two never fight.
        const rigLayer = svgLayer('rig-layer');
        hero.append(rigLayer);
        const rig = el('g', { class: 'rig' }, rigLayer);
        // detail is the part that isn't the outline, like a crosshair or arrows. It draws
        // itself on after the outline's line has landed.
        const curve = (cls, d, delay, detail) => {
            const group = el('g', {}, rig);
            if (detail) el('path', { class: `rig-curve rig-detail ${cls}`, d: detail, pathLength: 1 }, group);
            const path = el('path', { class: `rig-curve ${cls}`, d, pathLength: 1 }, group);
            path.style.setProperty('--delay', `${delay}ms`);
            return group;
        };
        const ring = r => `M${-r} 0 A${r} ${r} 0 1 1 ${r} 0 A${r} ${r} 0 1 1 ${-r} 0`;
        const arrow = (x, y, dx, dy) => `M${x} ${y} L${x + dx * 18} ${y + dy * 18} M${x + dx * 18 - dy * 7 - dx * 7} ${y + dy * 18 - dx * 7 - dy * 7} L${x + dx * 18} ${y + dy * 18} L${x + dx * 18 + dy * 7 - dx * 7} ${y + dy * 18 + dx * 7 - dy * 7}`;

        const rootCtrl = curve('rig-yellow', 'M-62 -14 H62 V14 H-62 Z', 0, `${arrow(-62, 0, -1, 0)} ${arrow(62, 0, 1, 0)}`);
        const elbowRing = curve('rig-blue', ring(21), 220);
        const poleLine = el('line', { class: 'rig-link' }, rig);
        const poleCtrl = curve('rig-blue', 'M0 -15 L15 0 L0 15 L-15 0 Z', 430, 'M0 -15 V15 M-15 0 H15');
        const aimLine = el('line', { class: 'rig-link rig-link--aim' }, rig);
        const aimCtrl = curve('rig-yellow', ring(16), 540, 'M-25 0 H25 M0 -25 V25');
        const ikCtrl = curve('rig-red', 'M-26 -26 H26 V26 H-26 Z', 650);
        const label = el('text', { class: 'rig-label' }, rig);

        const POLE_REACH = 96;
        const ROOT_LIFT = 2;
        const controls = { ik: ikCtrl, aim: aimCtrl, root: rootCtrl, pole: poleCtrl };
        const NAMES = { ik: 'ik_ctrl', aim: 'aim_ctrl', root: 'root_ctrl', pole: 'pole_vector' };

        let box = { width: 0, height: 0 };
        let baseFraction = LAMP_BASE;
        let view = 1;
        let root = { x: 0, y: 0 };
        let bone = 0;
        let swing = null;
        let tip = null;
        let goal = null;
        let hand = { x: 0, y: 0 };
        let elbow = { x: 0, y: 0 };
        let pole = { x: 0, y: 0 };
        let poleTarget = null;
        let shift = { x: 0, y: 0 };
        let lean = 0;
        const stiffness = 0.045;
        const damping = 0.8;
        let velocity = { x: 0, y: 0 };
        let aim = -2.2;
        let aimGoal = -2.2;
        let aimTarget = null;
        let aimMoved = false;
        let spin = 0;
        let side = 1;
        let bend = 1;
        let started = 0;
        let keys = [];
        let handKeys = null;
        let flying = 0;
        let stage = 'waiting';
        let dragging = null;
        let raf = 0;

        const spots = new Map();
        const SLIDE_TIME = 1200;

        const place = (group, x, y, angle = 0) => {
            spots.set(group, { x, y });
            group.setAttribute('transform', `translate(${x} ${y}) rotate(${angle * 180 / Math.PI})`);
        };

        function strut(line, a, b, offset) {
            const len = Math.max(1, Math.hypot(b.x - a.x, b.y - a.y));
            const nx = -(b.y - a.y) / len * offset;
            const ny = (b.x - a.x) / len * offset;
            line.setAttribute('x1', a.x + nx);
            line.setAttribute('y1', a.y + ny);
            line.setAttribute('x2', b.x + nx);
            line.setAttribute('y2', b.y + ny);
        }

        const link = (line, a, b) => strut(line, a, b, 0);

        // The only limits are the floor and how far the two bones reach.
        function limit(target) {
            const y = Math.min(target.y, root.y - bone * 0.3);
            const dx = target.x - root.x;
            const dy = y - root.y;
            const scale = Math.min(1, bone * 1.96 / Math.max(1, Math.hypot(dx, dy)));
            return { x: root.x + dx * scale, y: root.y + dy * scale };
        }

        function pose() {
            const dx = tip.x - root.x;
            const dy = tip.y - root.y;
            const reach = clamp(Math.hypot(dx, dy), bone * 0.4, bone * 1.96);
            const heading = Math.atan2(dy, dx);
            const fold = Math.acos(reach / (2 * bone));

            // The pole picks which way the elbow folds, unless that goes through the floor.
            if (poleTarget) {
                const cross = dx * (poleTarget.y - root.y) - dy * (poleTarget.x - root.x);
                side = cross > 0 ? 1 : -1;
            }
            // In the intro the elbow holds its side, or it would flip as the head crosses the base.
            bend = stage === 'intro' ? 1 : Math.sin(heading + side * fold) * bone > -6 ? -side : side;

            // Flat and rigid, so the elbow has two sides. It swings across rather than snapping,
            // and the head rides out a little as it does, because the bones can't shorten.
            swing = swing === null ? bend : swing + (bend - swing) * ELBOW_SWING;
            if (Math.abs(bend - swing) < 0.002) swing = bend;
            const angle = heading + fold * swing;
            elbow = { x: root.x + Math.cos(angle) * bone, y: root.y + Math.sin(angle) * bone };
            const forearm = Math.atan2(tip.y - elbow.y, tip.x - elbow.x);
            hand = { x: elbow.x + Math.cos(forearm) * bone, y: elbow.y + Math.sin(forearm) * bone };

            body.setAttribute('transform', `translate(${shift.x} ${shift.y}) rotate(${lean} ${root.x} ${root.y})`);
            strut(upper, root, elbow, 0);
            strut(upperStrut, root, elbow, 6);
            strut(lower, elbow, hand, 0);
            strut(lowerStrut, elbow, hand, 6);
            [root, elbow, hand].forEach((p, i) => {
                joints[i].setAttribute('cx', p.x);
                joints[i].setAttribute('cy', p.y);
            });

            const turn = `translate(${hand.x} ${hand.y}) rotate(${aim * 180 / Math.PI})`;
            head.setAttribute('transform', `${turn} scale(1.4)`);
            beam.setAttribute('transform', turn);
            glow.setAttribute('transform', turn);

            const midX = (root.x + hand.x) / 2;
            const midY = (root.y + hand.y) / 2;
            const out = Math.max(1, Math.hypot(elbow.x - midX, elbow.y - midY));
            pole = poleTarget || {
                x: elbow.x + (elbow.x - midX) / out * POLE_REACH,
                y: elbow.y + (elbow.y - midY) / out * POLE_REACH
            };

            place(rootCtrl, root.x, root.y - ROOT_LIFT);
            place(elbowRing, elbow.x, elbow.y);
            place(poleCtrl, pole.x, pole.y);
            link(poleLine, elbow, pole);
            place(ikCtrl, hand.x, hand.y);
            if (aimTarget) {
                place(aimCtrl, aimTarget.x, aimTarget.y);
                link(aimLine, hand, aimTarget);
            }

            const shown = dragging || svg.dataset.hot;
            if (shown) {
                const at = { ik: hand, aim: aimTarget, root: { x: root.x, y: root.y - ROOT_LIFT }, pole }[shown];
                label.textContent = NAMES[shown];
                label.setAttribute('x', at.x + 34);
                label.setAttribute('y', at.y - 26);
            }
            label.style.display = shown ? '' : 'none';
        }

        const standing = () => limit({ x: root.x - bone * 0.5, y: root.y - bone * 1.5 });

        function pointAtName() {
            const name = document.querySelector('.hero-title').getBoundingClientRect();
            const frame = hero.getBoundingClientRect();
            const target = limit({ x: root.x - bone * 0.85, y: root.y - bone * 0.98 });
            aimGoal = Math.atan2(
                name.top + name.height / 2 - frame.top - target.y,
                name.left + name.width * 0.7 - frame.left - target.x
            );
            return target;
        }

        const contours = new Map();
        function sampleContour(contour) {
            if (!contours.has(contour)) {
                const probe = el('path', { d: contour }, defs);
                const outline = probe.getTotalLength();
                const samples = [];
                for (let i = 0; i <= 64; i++) {
                    const p = probe.getPointAtLength(outline * i / 64);
                    samples.push({ x: p.x, y: p.y });
                }
                probe.remove();
                contours.set(contour, { outline, samples });
            }
            return contours.get(contour);
        }
        const CONTROL_SHAPES = ['M-62 -14 H62 V14 H-62 Z', ring(21), 'M0 -15 L15 0 L0 15 L-15 0 Z', ring(16)];

        // Each control arrives as a plain line: it runs in along a bezier from off
        // screen, wraps itself round the control's outline, then the control takes over.
        function flyIn(control, contour, from, cls, delay) {
            if (reduceMotion) {
                control.classList.add('is-drawn');
                return;
            }
            flying++;
            const spot = spots.get(control);
            control.style.opacity = 0;

            const { outline, samples } = sampleContour(contour);
            const points = samples.map(p => ({ x: spot.x + p.x, y: spot.y + p.y }));

            const first = points[0];
            const c1 = { x: from.x, y: first.y - 240 };
            const c2 = { x: first.x + (from.x - first.x) * 0.3, y: first.y };
            const trace = points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
            const line = el('path', {
                class: `rig-line ${cls}`,
                d: `M ${from.x} ${from.y} C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${first.x} ${first.y} ${trace}`
            }, rig);

            const total = line.getTotalLength();
            line.style.strokeDasharray = `${outline} ${total + outline}`;
            const run = line.animate(
                [{ strokeDashoffset: outline }, { strokeDashoffset: outline - total }],
                { duration: SLIDE_TIME, delay, easing: 'cubic-bezier(0.45, 0, 0.2, 1)', fill: 'both' }
            );
            run.onfinish = () => {
                control.style.opacity = '';
                control.classList.add('is-drawn');
                line.remove();
                flying--;
            };
        }

        // The aim control starts on the hero curve's low key, by the name.
        const curveKey = () => ({ x: LAMP_BASE * box.width - LAMP_KEY_REACH, y: box.height - LAMP_KEY_DROP });

        function finishIntro() {
            stage = 'rigged';
            buildOut();
            aimTarget = curveKey();
            pose();
            poleTarget = { ...pole };
            pose();

            flyIn(rootCtrl, CONTROL_SHAPES[0], { x: -120, y: box.height - 40 }, 'rig-yellow', 0);
            flyIn(elbowRing, CONTROL_SHAPES[1], { x: box.width + 120, y: 90 }, 'rig-blue', 150);
            flyIn(poleCtrl, CONTROL_SHAPES[2], { x: box.width + 120, y: box.height * 0.5 }, 'rig-blue', 300);
            flyIn(aimCtrl, CONTROL_SHAPES[3], { x: -120, y: 60 }, 'rig-yellow', 450);
            flyIn(ikCtrl, 'M-26 -26 H26 V26 H-26 Z', { x: box.width * 0.5, y: -120 }, 'rig-red', 600);
            rigLayer.classList.add('is-rigged');
        }

        function introKeys() {
            const name = pointAtName();
            if (handKeys) {
                // The hops close the same frames in less distance on a narrow window, so the
                // lamp comes on screen at the same moment everywhere.
                const frames = LampIntro.framesFrom(handKeys, bone);
                const needed = box.width - root.x + LAMP_ENTRY_GAP;
                const start = frames[0].x;
                const stretch = box.width >= LAMP_FULL_WIDTH ? Math.max(1, needed / start) : needed / start;
                return frames.map(key => ({ ...key, x: key.x * stretch }));
            }
            return LampIntro.bake({
                    bone,
                    entry: box.width - root.x + 260,
                    pointX: (name.x - root.x) / bone,
                    pointY: (name.y - root.y) / bone,
                    nameAim: aimGoal
                });
        }

        function lightUp() {
            svg.classList.add('is-lit');
            document.body.classList.add('lamp-lit');
        }

        function playIntro(now) {
            // A frame's timestamp can land just before the intro's start time.
            const frame = Math.max(0, (now - started) / (1000 / 24));
            if (frame >= keys.length - 1) {
                const last = keys[keys.length - 1];
                shift = { x: 0, y: 0 };
                lean = 0;
                tip = { x: root.x + last.r.x, y: root.y + last.r.y };
                goal = { ...tip };
                velocity = { x: 0, y: 0 };
                aim = last.aim;
                aimGoal = last.aim;
                spin = 0;
                lightUp();
                finishIntro();
                return;
            }

            const a = keys[Math.floor(frame)];
            const b = keys[Math.floor(frame) + 1];
            const k = frame - Math.floor(frame);
            const mix = (from, to) => from + (to - from) * k;

            shift = { x: mix(a.x, b.x), y: mix(a.y, b.y) };
            lean = mix(a.lean, b.lean);
            tip = { x: root.x + mix(a.r.x, b.r.x), y: root.y + mix(a.r.y, b.r.y) };
            goal = { ...tip };
            velocity = { x: 0, y: 0 };
            aim = a.aim + Math.atan2(Math.sin(b.aim - a.aim), Math.cos(b.aim - a.aim)) * k;
            aimGoal = aim;
            spin = 0;

            if (frame >= LampIntro.LIT_FRAME) lightUp();
        }

        function settled() {
            return stage === 'rigged' && !dragging
                && Math.hypot(goal.x - tip.x, goal.y - tip.y) < 0.05
                && Math.hypot(velocity.x, velocity.y) < 0.05
                && Math.abs(spin) < 0.0005
                && swing === bend;
        }

        function frame(now) {
            raf = 0;
            if (stage === 'intro') {
                playIntro(now);
                pose();
                raf = requestAnimationFrame(frame);
                return;
            }

            // A spring rather than an ease, so it overshoots and settles.
            velocity.x = (velocity.x + (goal.x - tip.x) * stiffness) * damping;
            velocity.y = (velocity.y + (goal.y - tip.y) * stiffness) * damping;
            tip = { x: tip.x + velocity.x, y: tip.y + velocity.y };

            if (aimTarget) aimGoal = Math.atan2(aimTarget.y - hand.y, aimTarget.x - hand.x);
            const delta = Math.atan2(Math.sin(aimGoal - aim), Math.cos(aimGoal - aim));
            spin = (spin + delta * 0.07) * 0.76;
            aim += spin;
            pose();

            if (!settled()) raf = requestAnimationFrame(frame);
        }

        const wake = () => {
            if (!raf) raf = requestAnimationFrame(frame);
        };

        const pointerAt = e => {
            const rect = hero.getBoundingClientRect();
            return { x: (e.clientX - rect.left) / view, y: (e.clientY - rect.top) / view };
        };

        const keepAboveBanner = point => ({
            x: clamp(point.x, 0, box.width),
            y: clamp(point.y, 30, box.height - 26)
        });

        const near = (a, b, range) => Math.hypot(a.x - b.x, a.y - b.y) < range;

        const grabAt = point => {
            if (stage !== 'rigged' || flying) return null;
            if (near(point, aimTarget, 30)) return 'aim';
            if (near(point, pole, 26)) return 'pole';
            if (near(point, hand, 42)) return 'ik';
            const onRoot = Math.abs(point.x - root.x) < 88 && Math.abs(point.y - root.y + ROOT_LIFT) < 22;
            return onRoot ? 'root' : null;
        };

        const highlight = name => {
            if (svg.dataset.hot === (name || undefined)) return;
            if (name) svg.dataset.hot = name; else delete svg.dataset.hot;
            Object.entries(controls).forEach(([key, node]) => node.classList.toggle('is-hot', key === name));
            pose();
        };

        window.addEventListener('pointermove', e => {
            if (e.pointerType === 'touch') return;
            const point = pointerAt(e);

            if (dragging === 'ik') goal = limit(point);
            if (dragging === 'aim') {
                aimTarget = keepAboveBanner(point);
                aimMoved = true;
            }
            if (dragging === 'pole') poleTarget = keepAboveBanner(point);
            if (dragging === 'root') {
                const slide = clamp(point.x, 90, box.width - 60) - root.x;
                baseFraction = (root.x + slide) / box.width;
                placeBase();
                tip = { x: tip.x + slide, y: tip.y };
                goal = limit({ x: goal.x + slide, y: goal.y });
                if (poleTarget) poleTarget = keepAboveBanner({ x: poleTarget.x + slide, y: poleTarget.y });
            }

            const over = dragging || grabAt(point);
            highlight(over);
            hero.style.cursor = dragging ? 'grabbing' : over ? 'grab' : '';
        }, { passive: true });

        // The rig sits under the hero text, so grabs are hit-tested here instead.
        window.addEventListener('pointerdown', e => {
            if (e.button !== 0) return;
            dragging = grabAt(pointerAt(e));
            if (!dragging) return;
            e.preventDefault();
            e.stopPropagation();
            document.body.classList.add('lamp-dragging');
            wake();
            window.addEventListener('click', ev => {
                ev.stopPropagation();
                ev.preventDefault();
            }, { capture: true, once: true });
        }, true);

        window.addEventListener('pointerup', () => {
            dragging = null;
            document.body.classList.remove('lamp-dragging');
            hero.style.cursor = '';
        });

        function placeBase() {
            root = { x: baseFraction * box.width, y: box.height - 12 };
            base.setAttribute('d', `M${root.x - 42} ${root.y + 12} L${root.x - 30} ${root.y} L${root.x + 30} ${root.y} L${root.x + 42} ${root.y + 12} Z`);
        }

        async function begin() {
            if (stage !== 'waiting') return;
            stage = 'loading';
            handKeys = await lampData;
            if (reduceMotion) {
                goal = pointAtName();
                tip = { ...goal };
                svg.classList.add('is-lit');
                document.body.classList.add('lamp-lit');
                aim = aimGoal;
                pose();
                finishIntro();
                return;
            }
            keys = introKeys();
            stage = 'intro';
            shift = { x: keys[0].x, y: keys[0].y };
            started = performance.now();
            wake();
        }

        const layout = () => {
            const real = hero.getBoundingClientRect();
            view = lampView(real.width, real.height);
            box = { width: real.width / view, height: real.height / view };
            svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
            rigLayer.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
            glowLayer.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
            bone = LAMP_BONE;
            const before = root;
            placeBase();
            // The base moved with the window, so the rest of the rig moves with it, at once.
            const moved = { x: root.x - before.x, y: root.y - before.y };
            const carry = point => point && { x: point.x + moved.x, y: point.y + moved.y };
            tip = carry(tip);
            goal = carry(goal);
            poleTarget = carry(poleTarget);
            aimTarget = aimMoved ? carry(aimTarget) : aimTarget && curveKey();
            if (!tip) {
                goal = standing();
                tip = { ...goal };
                shift = { x: box.width, y: 0 };
            } else {
                goal = limit(goal);
            }
            pose();
            wake();
        };

        if ('ResizeObserver' in window) new ResizeObserver(layout).observe(hero);

        // The loader adds .ready to the body once it lifts.
        if (document.body.classList.contains('ready')) begin();
        new MutationObserver((_, watcher) => {
            if (!document.body.classList.contains('ready')) return;
            watcher.disconnect();
            setTimeout(begin, INTRO.lamp);
        }).observe(document.body, { attributes: true, attributeFilter: ['class'] });

        const warm = () => {
            CONTROL_SHAPES.forEach(sampleContour);
            return lampData;
        };

        return { layout, warm };
    }

    /* ---------- Page thread ---------- */

    // A big bezier that keeps swinging across the page below the billboard. Every
    // key has vertical handles, so the curve only ever moves down the page.
    function buildThread(svg) {
        // Measured with the curve collapsed, or its own old height props the page open.
        svg.replaceChildren();
        svg.style.height = '0';
        const width = document.documentElement.clientWidth;
        const height = document.documentElement.scrollHeight;
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
        svg.style.height = `${height}px`;

        const span = Math.min(110, window.innerHeight / 7);
        const billboard = document.querySelector('.marquee');
        const below = billboard.offsetTop + billboard.offsetHeight;
        const startX = width - Math.max(10, parseFloat(getComputedStyle(document.querySelector('.section')).paddingLeft) / 2);

        // Straight down behind the billboard, then the swings start.
        const start = { x: startX, y: billboard.offsetTop - span * 1.2 };
        const keys = [start, { x: startX, y: below + 40 }];
        let i = 0;
        while (keys[keys.length - 1].y < height - THREAD_SPACING * 1.2) {
            const y = keys[keys.length - 1].y + THREAD_SPACING;
            keys.push({ x: THREAD_SWINGS[i % THREAD_SWINGS.length] * width, y });
            i++;
        }
        keys.push({ x: THREAD_SWINGS[i % THREAD_SWINGS.length] * width, y: height - 14 });

        let d = `M ${start.x} ${start.y} L ${keys[1].x} ${keys[1].y}`;
        for (let k = 2; k < keys.length; k++) {
            const a = keys[k - 1];
            const b = keys[k];
            const pull = (b.y - a.y) * 0.42;
            a.out = { x: a.x, y: a.y + pull };
            b.in = { x: b.x, y: b.y - pull };
            d += ` C ${a.out.x} ${a.out.y} ${b.in.x} ${b.in.y} ${b.x} ${b.y}`;
        }

        el('path', { class: 'thread-track', d }, svg);
        const line = el('path', { class: 'thread-line', d }, svg);
        const marked = keys.slice(2);
        const nodes = marked.map(k => {
            const node = el('g', { class: 'thread-node' }, svg);
            drawHandles(k, node);
            el('rect', { class: 'thread-key', x: k.x - 4, y: k.y - 4, width: 8, height: 8 }, node);
            return node;
        });
        const head = el('circle', { class: 'thread-head', r: 5 }, svg);

        // The path only ever moves down, so a table of y against length finds the
        // point level with the viewport without searching the curve every frame.
        const total = line.getTotalLength();
        const table = [];
        for (let n = 0; n <= 160; n++) {
            const at = total * n / 160;
            table.push({ at, y: line.getPointAtLength(at).y });
        }
        line.style.strokeDasharray = total;
        return { line, head, nodes, keys, marked, total, table };
    }

    // Each project's pitch pops off the curve while its clip is in view.
    let pitchWatcher = null;
    const pitchesSeen = new Set();

    let placeRun = 0;
    function placeResults(thread) {
        const run = ++placeRun;
        const layer = document.getElementById('result-layer') || (() => {
            const made = document.createElement('div');
            made.id = 'result-layer';
            made.className = 'result-layer';
            document.body.append(made);
            return made;
        })();
        layer.replaceChildren();
        if (pitchWatcher) pitchWatcher.disconnect();

        // Out as soon as it's on screen, and once out it stays, through any rebuild too.
        pitchWatcher = new IntersectionObserver((entries, watcher) => entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-on');
            pitchesSeen.add(entry.target.lastChild.textContent);
            watcher.unobserve(entry.target);
        }));

        const page = node => {
            const r = node.getBoundingClientRect();
            return { left: r.left, right: r.right, top: r.top + window.scrollY, bottom: r.bottom + window.scrollY };
        };
        const width = document.documentElement.clientWidth;
        const placeOne = project => {
            const text = project.dataset.result;
            const media = project.querySelector('.project-media');
            if (!text || !media) return;
            const node = document.createElement('div');
            node.className = 'result';
            node.innerHTML = '<i></i><span></span>';
            node.lastChild.textContent = text;
            layer.append(node);
            // A project still waiting to fade in sits lower than it will end up.
            const rise = new DOMMatrix(getComputedStyle(project).transform).m42;
            const settled = node => {
                const r = page(node);
                return { ...r, top: r.top - rise, bottom: r.bottom - rise };
            };
            // A phone has room in the gap under the title. The label runs along the gap, and
            // the key sits on its top edge where the line crosses it.
            if (window.matchMedia('(max-width: 720px)').matches) {
                const y = settled(project.querySelector('.pitch-slot')).top;
                const at = thread.line.getPointAtLength(lengthAtY(thread.table, y));
                const margin = settled(project.querySelector('.project-title')).left;
                const label = node.lastChild;
                node.classList.add('result--top');
                label.style.maxWidth = `${width - margin * 2}px`;
                const left = clamp(at.x - label.offsetWidth + 16, margin, width - margin - label.offsetWidth);
                node.style.top = `${y}px`;
                node.style.left = `${left}px`;
                node.style.setProperty('--key', `${at.x - left}px`);
                if (pitchesSeen.has(text)) {
                    node.classList.add('is-on', 'is-still');
                } else {
                    pitchWatcher.observe(node);
                }
                return;
            }

            const box = settled(project);
            const clip = settled(media);
            const words = [...project.querySelectorAll('.project-head, .project-title, .project-desc, .project-tags, .project-link')].map(settled);
            const blocks = [clip, ...words];

            // The key sits on a stretch of line that's showing. Its label may cover the clip, not text.
            const find = (top, bottom) => {
                const { offsetWidth: w, offsetHeight: h } = node;
                const middle = (clip.top + clip.bottom) / 2;
                let best = null;
                for (let y = top; y <= bottom; y += 10) {
                    const at = thread.line.getPointAtLength(lengthAtY(thread.table, y));
                    const hidden = blocks.some(b => at.x > b.left - 10 && at.x < b.right + 10 && at.y > b.top - 10 && at.y < b.bottom + 10);
                    if (hidden) continue;
                    [1, -1].forEach(side => {
                        const left = side > 0 ? at.x : at.x - w;
                        const clear = left > 12 && left + w < width - 12 && !words.some(b => left - 10 < b.right && left + w + 10 > b.left && at.y - h / 2 - 10 < b.bottom && at.y + h / 2 + 10 > b.top);
                        const off = Math.abs(at.y - middle);
                        if (clear && (!best || off < best.off)) best = { off, at, side };
                    });
                }
                return best;
            };
            const near = [clip.top, clip.bottom + 40];
            const wide = [box.top - 100, box.bottom + 160];
            let best = find(...near) || find(...wide);
            if (!best) {
                node.classList.add('result--wrap');
                best = find(...near) || find(...wide);
            }
            if (!best) {
                node.remove();
                return;
            }
            node.style.top = `${best.at.y}px`;
            node.style.left = `${best.at.x}px`;
            if (best.side < 0) node.classList.add('result--left');
            if (pitchesSeen.has(text)) {
                node.classList.add('is-on', 'is-still');
            } else {
                pitchWatcher.observe(node);
            }
        };

        const projects = [...document.querySelectorAll('.project[data-result]')];
        if (!loading()) {
            projects.forEach(placeOne);
            return Promise.resolve();
        }
        // A newer placement takes over, so an old one stops where it is.
        return (async () => {
            for (const project of projects) {
                if (run !== placeRun) return;
                placeOne(project);
                await nextTask();
            }
        })();
    }

    function lengthAtY(table, y) {
        let lo = 0;
        let hi = table.length - 1;
        while (hi - lo > 1) {
            const mid = (lo + hi) >> 1;
            if (table[mid].y < y) lo = mid; else hi = mid;
        }
        const a = table[lo];
        const b = table[hi];
        const t = b.y > a.y ? clamp((y - a.y) / (b.y - a.y), 0, 1) : 0;
        return a.at + (b.at - a.at) * t;
    }

    function updateThread(thread) {
        const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const progress = clamp(window.scrollY / scrollable, 0, 1);
        const y = window.scrollY + window.innerHeight * (0.62 + 0.38 * progress);
        const at = reduceMotion ? thread.total : lengthAtY(thread.table, y);
        thread.line.style.strokeDashoffset = thread.total - at;
        const point = thread.line.getPointAtLength(at);
        thread.head.setAttribute('cx', point.x);
        thread.head.setAttribute('cy', point.y);
        thread.nodes.forEach((node, i) => node.classList.toggle('passed', thread.marked[i].y <= point.y));
    }

    /* ---------- Top bar timeline ---------- */

    function buildTimeline() {
        const nav = document.getElementById('nav');
        const links = nav.querySelector('.nav-links');

        // Every project gets its own short label, in page order between About and Stack.
        const about = links.querySelector('[href="#about"]');
        [...document.querySelectorAll('.project[id]')].reverse().forEach(project => {
            const link = document.createElement('a');
            link.href = `#${project.id}`;
            link.textContent = project.dataset.short;
            link.title = project.querySelector('.project-title').textContent;
            about.after(link);
        });
        const anchors = [...links.querySelectorAll('a')];

        const brand = document.createElement('a');
        brand.className = 'nav-brand';
        brand.href = '#top';
        brand.textContent = 'Josh Wright';
        nav.prepend(brand);

        const track = document.createElement('div');
        track.className = 'nav-track';
        links.replaceWith(track);
        track.append(links);

        const ruler = svgLayer('nav-ruler');
        track.prepend(ruler);
        const rulerPath = el('path', {}, ruler);

        const makeKey = () => {
            const key = document.createElement('span');
            key.className = 'nav-key';
            key.setAttribute('aria-hidden', 'true');
            track.append(key);
            return key;
        };
        // Each key knows its link, so CSS can hide a key whenever its word is hidden.
        const diamonds = anchors.map(a => {
            const key = makeKey();
            key.dataset.for = a.getAttribute('href');
            return key;
        });
        const homeKey = makeKey();
        homeKey.classList.add('passed');

        const playhead = document.createElement('span');
        playhead.className = 'nav-playhead';
        playhead.setAttribute('aria-hidden', 'true');
        track.append(playhead);

        const multiples = [0, 1, 2].map(() => {
            const copy = document.createElement('span');
            copy.className = 'nav-multiple';
            copy.setAttribute('aria-hidden', 'true');
            track.append(copy);
            return copy;
        });

        const ball = document.createElement('span');
        ball.className = 'nav-ball';
        ball.setAttribute('aria-hidden', 'true');
        track.append(ball);

        return {
            nav, brand, track, ruler, rulerPath, anchors, diamonds, homeKey, startTick: 0, endTick: 1, peak: 1, playhead, ball, multiples,
            ticks: 1, width: 1, keyTicks: [], labels: [], scrollMax: 1, x: 0, ballX: 0, ballGoal: 0, ballY: 0, ground: 0, groundTarget: 0, airborne: false, hopStart: 0, landedAt: -1000, lastScroll: -1000, raf: 0
        };
    }

    // Ticks are drawn edge to edge at whole pixels, and every key uses the same
    // positions, so a key can only ever land on a tick.
    // Where a link stops. Projects have different padding above them, so they line up
    // on their own heading to land the same distance under the bar.
    function landingTop(target, navHeight) {
        const project = target.matches('.project');
        let node = project ? target.querySelector('.project-head') : target;
        // Offsets, not the box on screen: a project still waiting to fade in sits lower.
        let top = 0;
        while (node) {
            top += node.offsetTop;
            node = node.offsetParent;
        }
        return top - navHeight - (project ? PROJECT_GAP : 0);
    }

    const tickX = (t, tick) => Math.round(tick * (t.width - 1) / t.ticks) + 0.5;

    const tickAt = (t, scroll) => t.startTick + Math.round(clamp(scroll / t.scrollMax, 0, 1) * (t.endTick - t.startTick));

    // A key sits where its section lands in the scroll, so distance on the bar is
    // distance to scroll. Labels shuffle apart if two keys land close together.
    function layoutTimeline(t) {
        t.width = t.track.clientWidth;
        const height = t.track.clientHeight;
        t.scrollMax = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        // Everything in the bar is sized from its text, so it all scales together.
        const unit = parseFloat(getComputedStyle(t.nav).fontSize) / NAV_TEXT;
        t.ticks = Math.max(1, Math.round(t.width / (TICK_TARGET * unit)));

        // The timeline starts on the name's key, which sits on the tick nearest the name.
        // Measured against the track, because the bar may still be sliding in.
        const trackLeft = t.track.getBoundingClientRect().left;
        const name = t.brand.getBoundingClientRect();
        t.startTick = Math.round((name.left - trackLeft + name.width / 2) / (t.width - 1) * t.ticks);
        t.homeKey.style.left = `${tickX(t, t.startTick)}px`;

        const lastLink = t.anchors[t.anchors.length - 1];
        const lastMid = t.width - 14 - lastLink.offsetWidth / 2;
        t.endTick = Math.round(lastMid / (t.width - 1) * t.ticks);

        t.ruler.setAttribute('viewBox', `0 0 ${t.width} ${height}`);
        let d = '';
        for (let i = 0; i <= t.ticks; i++) {
            const size = (i % 5 ? 4 : 8) * unit;
            d += `M${tickX(t, i)} ${height - size}V${height}`;
        }
        t.rulerPath.setAttribute('d', d);

        // On a phone the ruler is just scroll progress, with the links in a plain row above it.
        if (window.matchMedia('(max-width: 720px)').matches) {
            t.startTick = 0;
            t.endTick = t.ticks;
            t.keyTicks = [];
            t.labels = [];
            t.peak = PHONE_HOP * unit;
            return;
        }

        t.keyTicks = t.anchors.map(a => {
            const target = landingTop(document.querySelector(a.getAttribute('href')), t.nav.offsetHeight);
            return tickAt(t, target);
        });
        t.keyTicks[t.keyTicks.length - 1] = t.endTick;
        t.diamonds.forEach((key, i) => {
            key.style.left = `${tickX(t, t.keyTicks[i])}px`;
        });

        const gap = 14;
        const sizes = t.anchors.map(a => a.offsetWidth);
        const lefts = t.keyTicks.map((tick, i) => tickX(t, tick) - sizes[i] / 2);
        lefts.forEach((left, i) => {
            const min = i ? lefts[i - 1] + sizes[i - 1] + gap : name.right - trackLeft + gap;
            lefts[i] = Math.max(left, min);
        });
        for (let i = lefts.length - 1; i >= 0; i--) {
            const max = i === lefts.length - 1 ? t.width - gap - sizes[i] : lefts[i + 1] - gap - sizes[i];
            lefts[i] = Math.min(lefts[i], max);
        }
        t.anchors.forEach((a, i) => {
            a.style.left = `${lefts[i]}px`;
        });

        // Where the ball can stand: on top of the text in the bar, otherwise on the ruler.
        const frame = t.track.getBoundingClientRect();
        t.labels = [...t.anchors, t.brand].map(a => {
            const box = a.getBoundingClientRect();
            return {
                left: box.left - frame.left - 4,
                right: box.right - frame.left + 4,
                rise: frame.bottom - box.top - BALL_REST * unit
            };
        });
        t.peak = Math.max(...t.labels.map(l => l.rise)) + HOP_CLEARANCE * unit;
    }

    // Hops while the page scrolls. When the scroll stops it finishes the hop it's
    // on, lands with a single stretch and stays down.
    function placeBall(t, now) {
        // Trails the playhead, so it catches up after the scroll stops.
        const lastX = t.ballX;
        const lastY = t.ballY;
        t.ballX += (t.ballGoal - t.ballX) * 0.08;
        // In the air it plans ahead for the word it's coming up on. Once down it needs
        // to be over the word itself, or it would stop on nothing.
        const margin = t.airborne ? WORD_MARGIN : 0;
        const on = t.labels.find(l => t.ballX >= l.left - margin && t.ballX <= l.right + margin);
        t.groundTarget = on ? on.rise : 0;
        t.ground += (t.groundTarget - t.ground) * 0.22;

        let lift = 0;
        if (t.airborne) {
            const ms = now - t.hopStart;
            if (ms >= BOUNCE_TIME) {
                if (now - t.lastScroll < 120) {
                    // Touches down between hops, so every landing gets its squash.
                    t.landedAt = now;
                    t.hopStart = now + LANDING_TIME;
                } else {
                    t.airborne = false;
                    t.landedAt = now;
                }
            } else if (ms > 0) {
                lift = 1 - Math.abs(2 * ms / BOUNCE_TIME - 1) ** 3;
            }
        }
        t.ballY = t.ground + lift * (t.peak - t.ground);

        const dx = t.ballX - lastX;
        const dy = lastY - t.ballY;
        const moved = Math.hypot(dx, dy);

        const sinceLanding = now - t.landedAt;
        if (sinceLanding < (t.airborne ? LANDING_TIME : SETTLE_TIME)) {
            let sx = 1.4;
            let sy = 0.6;
            if (sinceLanding >= LANDING_TIME) {
                const k = (sinceLanding - LANDING_TIME) / (SETTLE_TIME - LANDING_TIME);
                const wobble = (1 - k) ** 2 * Math.sin(k * Math.PI * 2.5) * 0.26;
                sx = 1 - wobble * 0.7;
                sy = 1 + wobble;
            }
            t.ball.style.transform = `translate(${t.ballX}px, ${-t.ballY}px) scale(${sx}, ${sy})`;
            t.multiples.forEach(copy => {
                copy.style.opacity = 0;
            });
            return;
        }

        // On fast frames it becomes a smear: several solid copies on screen at once,
        // spaced along the path it just covered. The stretch follows that path too.
        const angle = Math.atan2(dy, dx);
        // Only a real hop stretches or smears, not a layout change moving the ball.
        const stretch = t.airborne ? Math.min(0.32, moved / 26) : 0;
        t.ball.style.transform = `translate(${t.ballX}px, ${-t.ballY}px) rotate(${angle}rad) scale(${1 + stretch}, ${1 - stretch * 0.6})`;

        const fast = t.airborne && moved > 3;
        t.multiples.forEach((copy, i) => {
            copy.style.opacity = fast ? 1 : 0;
            if (!fast) return;
            const back = (i + 1) * 1.1;
            copy.style.transform = `translate(${t.ballX - dx * back}px, ${-(t.ballY - dy * back)}px) scale(${1 - (i + 1) * 0.16})`;
        });
    }

    // The window changed size under it, so it goes straight to its spot in the new layout.
    function snapBall(t) {
        if (t.airborne) return;
        t.ballX = t.ballGoal;
        const on = t.labels.find(l => t.ballX >= l.left && t.ballX <= l.right);
        t.groundTarget = on ? on.rise : 0;
        t.ground = t.groundTarget;
        t.ballY = t.ground;
        t.ball.style.transform = `translate(${t.ballX}px, ${-t.ballY}px)`;
    }

    function bounceBall(t) {
        if (reduceMotion) return;
        const now = performance.now();
        t.lastScroll = now;
        if (!t.airborne) {
            t.airborne = true;
            t.hopStart = now;
        }
        if (t.raf) return;
        const step = time => {
            placeBall(t, time);
            const moving = t.airborne
                || time - t.landedAt < SETTLE_TIME
                || Math.abs(t.groundTarget - t.ground) > 0.2
                || Math.abs(t.ballGoal - t.ballX) > 0.3;
            t.raf = moving ? requestAnimationFrame(step) : 0;
        };
        t.raf = requestAnimationFrame(step);
    }

    function updateTimeline(t) {
        const raw = tickAt(t, window.scrollY);
        const snap = t.keyTicks.find(key => Math.abs(key - raw) <= 1);
        const tick = snap === undefined ? raw : snap;
        t.x = tickX(t, tick);

        // Parked on a section's key, the ball heads for that section's word.
        const parked = t.keyTicks.indexOf(tick);
        // A key whose label is hidden on this screen has no word to head for.
        const word = parked >= 0 && t.anchors[parked].offsetWidth ? t.labels[parked] : null;
        t.ballGoal = word ? (word.left + word.right) / 2 : t.x;
        if (tick === t.startTick) {
            const home = t.labels[t.labels.length - 1];
            if (home) t.ballGoal = (home.left + home.right) / 2;
        }
        t.playhead.style.transform = `translateX(${t.x}px)`;
        t.diamonds.forEach((key, i) => key.classList.toggle('passed', t.keyTicks[i] <= tick));

        // The current word is the last key the playhead has reached.
        let current = -1;
        t.keyTicks.forEach((key, i) => {
            if (key <= tick) current = i;
        });
        t.anchors.forEach((a, i) => a.classList.toggle('active', i === current));
        placeBall(t, performance.now());
    }

    /* ---------- Skills: rows come in one after another ---------- */

    function addSkills() {
        const sheet = document.getElementById('stack-tags');
        if (reduceMotion || !('IntersectionObserver' in window)) {
            sheet.classList.add('played');
            return;
        }
        const obs = new IntersectionObserver((entries, o) => {
            if (!entries.some(e => e.isIntersecting)) return;
            sheet.classList.add('played');
            o.disconnect();
        }, { rootMargin: '0px 0px -15% 0px' });
        obs.observe(sheet);
    }

    /* ---------- Graph panel: the dot rides the curve exactly under the playhead ---------- */

    function addGraphPlayhead() {
        const graph = document.querySelector('.art-graph');
        if (!graph) return;
        const curve = graph.querySelector('.art-curve');
        const head = graph.querySelector('.art-head');
        const rider = graph.querySelector('.art-rider');
        const total = curve.getTotalLength();
        const table = [];
        for (let i = 0; i <= 80; i++) {
            const point = curve.getPointAtLength(total * i / 80);
            table.push(point);
        }
        const from = table[0].x;
        const to = table[table.length - 1].x;

        const place = x => {
            let lo = 0;
            let hi = table.length - 1;
            while (hi - lo > 1) {
                const mid = (lo + hi) >> 1;
                if (table[mid].x < x) lo = mid; else hi = mid;
            }
            const a = table[lo];
            const b = table[hi];
            const k = b.x > a.x ? (x - a.x) / (b.x - a.x) : 0;
            head.setAttribute('transform', `translate(${x} 0)`);
            rider.setAttribute('cx', x);
            rider.setAttribute('cy', a.y + (b.y - a.y) * k);
        };
        place(from + (to - from) * 0.45);
        if (reduceMotion) return;

        let visible = false;
        let raf = 0;
        const tick = now => {
            raf = 0;
            if (!visible) return;
            // Scrubs forward and back, slowing into each end rather than cutting to the start.
            const k = (1 - Math.cos(now / GRAPH_LOOP * Math.PI)) / 2;
            place(from + (to - from) * k);
            raf = requestAnimationFrame(tick);
        };
        new IntersectionObserver(entries => {
            visible = entries[entries.length - 1].isIntersecting;
            if (visible && !raf) raf = requestAnimationFrame(tick);
        }).observe(graph);
    }

    /* ---------- Neural net: cel-style layer cards with a ball hopping node to node ---------- */

    function addNeuralNet() {
        const canvas = document.querySelector('.art-net');
        if (!canvas) return;
        const context = canvas.getContext('2d');

        const INK = '#0a0a0a';
        const CARDS = ['#2f5ba8', '#4776ca', '#7ba6e8', '#bcd3f5'];
        const SPACING = 0.72;
        const CARD = 0.62;
        const HOP = 620;
        const CONTACT = 70;
        const LIFT = 42;
        const SAFE = 0.82;
        const shapes = [[2, 2], [3, 3], [3, 3], [2, 2]];

        const layers = shapes.map(([rows, cols], l) => {
            const nodes = [];
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    nodes.push({
                        layer: l,
                        x: (l - (shapes.length - 1) / 2) * SPACING,
                        y: (r - (rows - 1) / 2) * 0.42,
                        z: (c - (cols - 1) / 2) * 0.42
                    });
                }
            }
            return nodes;
        });
        const links = [];
        layers.slice(1).forEach((layer, l) => {
            layer.forEach((b, i) => {
                const from = layers[l];
                links.push([from[i % from.length], b], [from[(i + 2) % from.length], b]);
            });
        });

        // The ball's route: forward through every layer, then back again.
        const route = [
            layers[0][0], layers[1][4], layers[2][2], layers[3][3],
            layers[2][7], layers[1][1], layers[0][3], layers[1][7], layers[2][4], layers[3][0], layers[2][1], layers[1][3]
        ];

        const place = (p, angle) => {
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            const x = p.x * cos + p.z * sin;
            const z = -p.x * sin + p.z * cos;
            const depth = 3 / (3 - z * 0.6);
            return { x: x * depth, y: (p.y + z * 0.22) * depth, depth };
        };

        const cardCorners = l => {
            const x = (l - (shapes.length - 1) / 2) * SPACING;
            return [[-CARD, -CARD], [CARD, -CARD], [CARD, CARD], [-CARD, CARD]].map(([y, z]) => ({ x, y, z }));
        };

        const angleAt = now => {
            // Eases out to each side and hangs there before swinging back.
            const swing = Math.sin(now / 5200);
            return 0.75 + swing * (1.5 - 0.5 * swing * swing) * 0.3;
        };

        let width = 0;
        let height = 0;
        let unit = 1;
        let midX = 0;
        let midY = 0;

        // Measures the net over its whole swing, so it fills the guides at any frame size
        // and can never poke out of them.
        const fit = () => {
            const ratio = window.devicePixelRatio || 1;
            const box = canvas.getBoundingClientRect();
            width = box.width;
            height = box.height;
            canvas.width = Math.round(width * ratio);
            canvas.height = Math.round(height * ratio);
            context.setTransform(ratio, 0, 0, ratio, 0, 0);

            const seen = [];
            for (let i = 0; i <= 24; i++) {
                const angle = 0.75 + (i / 24 - 0.5) * 2 * 0.3;
                shapes.forEach((_, l) => cardCorners(l).forEach(p => seen.push(place(p, angle))));
            }
            const xs = seen.map(p => p.x);
            const ys = seen.map(p => p.y);
            const left = Math.min(...xs);
            const right = Math.max(...xs);
            const top = Math.min(...ys);
            const bottom = Math.max(...ys);
            unit = Math.min(width * SAFE / (right - left), (height * SAFE - LIFT) / (bottom - top));
            midX = width / 2 - (left + right) / 2 * unit;
            midY = height / 2 - (top + bottom) / 2 * unit + LIFT / 2;
        };

        const project = (p, angle) => {
            const s = place(p, angle);
            return { x: midX + s.x * unit, y: midY + s.y * unit, depth: s.depth };
        };

        const draw = now => {
            const angle = angleAt(now);
            const size = Math.max(4, unit * 0.045);
            const step = Math.floor(now / HOP);
            const into = (now % HOP);
            const from = route[step % route.length];
            const to = route[(step + 1) % route.length];

            context.clearRect(0, 0, width, height);
            context.lineJoin = 'round';

            // Cards back to front, flat colour with an ink outline, like painted cels.
            const order = shapes.map((_, l) => l).sort((a, b) => place(cardCorners(a)[0], angle).depth - place(cardCorners(b)[0], angle).depth);
            order.forEach(l => {
                context.beginPath();
                cardCorners(l).forEach((p, i) => {
                    const q = project(p, angle);
                    context[i ? 'lineTo' : 'moveTo'](q.x, q.y);
                });
                context.closePath();
                context.globalAlpha = 0.2;
                context.fillStyle = CARDS[l];
                context.fill();
                context.globalAlpha = 1;
                context.lineWidth = 2;
                context.strokeStyle = CARDS[l];
                context.stroke();
            });

            context.lineWidth = 1.5;
            context.strokeStyle = 'rgba(253, 253, 253, 0.2)';
            context.setLineDash([3, 5]);
            context.beginPath();
            links.forEach(([a, b]) => {
                const p = project(a, angle);
                const q = project(b, angle);
                context.moveTo(p.x, p.y);
                context.lineTo(q.x, q.y);
            });
            context.stroke();
            context.setLineDash([]);

            // Nodes squash when the ball lands, then ring back to round.
            const sinceHit = into;
            const ringOut = Math.exp(-sinceHit / 120) * Math.cos(sinceHit / 38);
            // Far to near, so closer nodes sit on top, with the white landed node over them all.
            const nearest = [...layers.flat()].sort((a, b) => {
                if (a === from) return 1;
                if (b === from) return -1;
                return place(a, angle).depth - place(b, angle).depth;
            });
            nearest.forEach(node => {
                const p = project(node, angle);
                const hit = node === from ? ringOut : 0;
                const rx = size * p.depth * (1 + hit * 0.55);
                const ry = size * p.depth * (1 - hit * 0.4);
                context.beginPath();
                context.ellipse(p.x, p.y + hit * 2, rx, ry, 0, 0, Math.PI * 2);
                context.fillStyle = node === from ? '#fdfdfd' : CARDS[node.layer];
                context.fill();
                context.lineWidth = 2;
                context.strokeStyle = INK;
                context.stroke();
            });

            // The ball: a squashed beat on the node, then a fast, stretched hop on an arc.
            const start = project(from, angle);
            const end = project(to, angle);
            const radius = size * 1.15;
            const rest = radius + size * 0.6;
            let x = start.x;
            let y = start.y - rest;
            let sx = 1.4;
            let sy = 0.62;
            let tilt = 0;
            if (into > CONTACT) {
                const k = (into - CONTACT) / (HOP - CONTACT);
                const arc = 1 - Math.abs(2 * k - 1) ** 2.4;
                const speed = Math.abs(2 * k - 1) ** 3;
                x = start.x + (end.x - start.x) * k;
                const line = start.y + (end.y - start.y) * k - rest;
                y = line - arc * Math.max(LIFT, Math.abs(end.x - start.x) * 0.5);
                sx = 1 - speed * 0.3;
                sy = 1 + speed * 0.5;
                tilt = (k < 0.5 ? -1 : 1) * Math.atan2(end.x - start.x, Math.max(LIFT, Math.abs(end.x - start.x) * 0.5) * 2) * speed;
            }
            context.save();
            context.translate(x, y + radius * (1 - sy));
            context.rotate(tilt);
            context.beginPath();
            context.ellipse(0, 0, radius * sx, radius * sy, 0, 0, Math.PI * 2);
            context.fillStyle = '#fdfdfd';
            context.fill();
            context.lineWidth = 2.5;
            context.strokeStyle = INK;
            context.stroke();
            context.restore();
        };

        fit();
        draw(HOP * 0.5);
        new ResizeObserver(() => {
            fit();
            draw(performance.now());
        }).observe(canvas);
        if (reduceMotion) return;

        let visible = false;
        let raf = 0;
        const tick = now => {
            raf = 0;
            if (!visible) return;
            draw(now);
            raf = requestAnimationFrame(tick);
        };
        new IntersectionObserver(entries => {
            visible = entries[entries.length - 1].isIntersecting;
            if (visible && !raf) raf = requestAnimationFrame(tick);
        }).observe(canvas);
    }

    /* ---------- About photos: colour comes in as they scroll onto the screen ---------- */

    function addPhotoHighlight() {
        const photos = [...document.querySelectorAll('.about-photos img')];
        if (!('IntersectionObserver' in window)) {
            photos.forEach(photo => photo.classList.add('is-onscreen'));
            return;
        }
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => e.target.classList.toggle('is-onscreen', e.isIntersecting));
        }, { threshold: 0.35 });
        photos.forEach(photo => obs.observe(photo));
    }

    /* ---------- In-page links scroll without touching the URL ---------- */

    function keepUrlClean() {
        if (location.hash) history.replaceState(null, '', location.pathname + location.search);

        document.addEventListener('click', e => {
            const link = e.target.closest('a[href^="#"]');
            if (!link) return;
            const id = link.getAttribute('href');
            const section = id === '#top' ? null : document.querySelector(id);
            if (id !== '#top' && !section) return;
            e.preventDefault();
            const nav = document.getElementById('nav').offsetHeight;
            let top = section ? landingTop(section, nav) : 0;
            if (id === '#contact') top = document.documentElement.scrollHeight;
            window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
        });
    }

    /* ---------- Hero type ---------- */

    // Wraps each letter so it can animate on its own. Words stay whole so lines still wrap,
    // and --i carries on from start, so a name on two lines runs as one sequence.
    function splitLetters(node, start = 0) {
        const text = node.textContent;
        let i = start;
        node.setAttribute('aria-label', text);
        node.replaceChildren(...text.split(' ').flatMap((word, w) => {
            const box = document.createElement('span');
            box.className = 'word';
            box.setAttribute('aria-hidden', 'true');
            [...word].forEach(letter => {
                const span = document.createElement('span');
                span.className = `ltr ltr-${i}`;
                span.style.setProperty('--i', i++);
                span.textContent = letter;
                box.append(span);
            });
            return w ? [' ', box] : [box];
        }));
        return i;
    }

    /* ---------- Hero tag ---------- */

    // A letter's real outline, read off a canvas by walking round the edge of its pixels.
    // Points are in px from the letter's left edge and baseline.
    const glyphs = new Map();
    function traceGlyph(letter, style) {
        const key = `${letter}|${style.fontWeight}|${style.fontSize}|${style.fontFamily}`;
        if (!glyphs.has(key)) glyphs.set(key, readGlyph(letter, style));
        return glyphs.get(key);
    }

    function warmGlyphs() {
        const style = getComputedStyle(document.querySelector('.hero-tag'));
        document.querySelectorAll('.hero-tag .ltr').forEach(letter => {
            traceGlyph(letter.firstChild.textContent.toUpperCase(), style);
        });
    }

    function readGlyph(letter, style) {
        const size = parseFloat(style.fontSize);
        const scale = 4;
        const pad = 8;
        const canvas = document.createElement('canvas');
        canvas.width = Math.ceil(size * 1.6 * scale) + pad * 2;
        canvas.height = Math.ceil(size * 1.6 * scale) + pad * 2;
        const context = canvas.getContext('2d', { willReadFrequently: true });
        context.font = `${style.fontWeight} ${size * scale}px ${style.fontFamily}`;
        const base = Math.round(size * 1.2 * scale) + pad;
        context.fillText(letter, pad, base);
        const { width } = canvas;
        const { data } = context.getImageData(0, 0, width, canvas.height);
        const solid = (x, y) => x >= 0 && y >= 0 && x < width && y < canvas.height && data[(y * width + x) * 4 + 3] > 127;

        let start = -1;
        for (let n = 0; n < width * canvas.height && start < 0; n++) {
            if (data[n * 4 + 3] > 127) start = n;
        }
        if (start < 0) return [];
        const around = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
        const first = { x: start % width, y: Math.floor(start / width) };
        const path = [first];
        let at = first;
        let facing = 6;
        for (let guard = 0; guard < 20000; guard++) {
            let turned = -1;
            for (let k = 0; k < 8; k++) {
                const d = (facing + 6 + k) % 8;
                if (solid(at.x + around[d][0], at.y + around[d][1])) {
                    turned = d;
                    break;
                }
            }
            if (turned < 0) break;
            at = { x: at.x + around[turned][0], y: at.y + around[turned][1] };
            facing = turned;
            if (at.x === first.x && at.y === first.y) break;
            path.push(at);
        }
        const skip = Math.max(1, Math.floor(path.length / 72));
        const points = path.filter((_, i) => i % skip === 0).map(p => ({ x: (p.x - pad) / scale, y: (p.y - base) / scale }));
        points.push(points[0]);
        return points;
    }

    function addTagOutlines() {
        document.querySelectorAll('.hero-tag .ltr').forEach(letter => {
            const outline = svgLayer('ltr-draw');
            const text = el('text', { x: 0, y: '50%', 'dominant-baseline': 'central' }, outline);
            text.textContent = letter.textContent.toUpperCase();
            letter.append(outline);
        });
    }

    // One line, like the rig's: it flies in from off screen, then traces the shape it's for.
    function flyLine(layer, from, points, delay, done, { stays = false, duration = LINE_FLIGHT } = {}) {
        const start = points[0];
        let outline = 0;
        points.forEach((p, i) => {
            if (i) outline += Math.hypot(p.x - points[i - 1].x, p.y - points[i - 1].y);
        });
        const trace = points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
        // Bowed sideways off the straight path, each line to whichever side keeps it curving in.
        const dx = start.x - from.x;
        const dy = start.y - from.y;
        const bow = from.bow;
        const c1 = { x: from.x + dx * 0.25 - dy * bow, y: from.y + dy * 0.25 + dx * bow };
        const c2 = { x: start.x - dx * 0.3, y: start.y - dy * 0.3 };
        const line = el('path', {
            d: `M ${from.x} ${from.y} C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${start.x} ${start.y} ${trace}`
        }, layer);
        const total = line.getTotalLength();
        line.style.strokeDasharray = `${outline} ${total + outline}`;
        line.animate(
            [{ strokeDashoffset: outline }, { strokeDashoffset: outline - total }],
            { duration, delay, easing: stays ? 'cubic-bezier(0.3, 0, 0.6, 1)' : 'cubic-bezier(0.45, 0, 0.2, 1)', fill: 'both' }
        ).finished.finally(() => {
            if (!stays) line.remove();
            done();
        });
    }

    // Runs as the lamp's rig comes in: lines fly in and draw the tag and the photo.
    let builtOut = false;
    function buildOut() {
        if (builtOut) return;
        builtOut = true;
        const hero = document.querySelector('.hero');
        const letters = [...document.querySelectorAll('.hero-tag .ltr')];
        const mask = document.querySelector('.hero-portrait-mask');
        const land = letter => letter.classList.add('is-drawn');
        const finishPhoto = () => {
            document.documentElement.classList.add('photo-in');
            const rows = document.querySelectorAll('.photo-strip');
            rows.forEach(row => {
                row.getAnimations().forEach(run => {
                    if (row.offsetParent) run.commitStyles();
                });
                row.classList.add('is-done');
            });
            document.querySelectorAll('.hero-portrait .tag-fly').forEach(lines => lines.classList.add('is-done'));
            setTimeout(() => {
                rows.forEach(row => row.remove());
                document.querySelectorAll('.hero-portrait .tag-fly').forEach(lines => lines.remove());
            }, PHOTO_FADE);
        };
        // Scrolled past the hero there's nothing to watch, so it just finishes.
        if (reduceMotion || window.scrollY > hero.offsetHeight) {
            letters.forEach(land);
            finishPhoto();
            return;
        }

        // Each set of lines is drawn inside what it builds, so it scales and moves with it.
        // The clip keeps them to the hero, so none can cross the sections below.
        const frame = hero.getBoundingClientRect();
        const flyLayer = (host, id) => {
            const rect = host.getBoundingClientRect();
            const svg = svgLayer('tag-fly');
            svg.setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`);
            host.append(svg);
            const origin = { x: rect.left - frame.left, y: rect.top - frame.top };
            const clip = el('clipPath', { id }, el('defs', {}, svg));
            el('rect', { x: -origin.x, y: -origin.y, width: frame.width, height: frame.height }, clip);
            return { group: el('g', { 'clip-path': `url(#${id})` }, svg), origin };
        };

        // Spread round all four sides of the screen. The golden ratio keeps neighbours apart.
        const offScreen = i => {
            const margin = 140;
            const wide = frame.width + margin * 2;
            const tall = window.innerHeight + margin * 2;
            let along = ((i * 0.618034) % 1) * (wide + tall) * 2;
            const bow = i % 2 ? 0.35 : -0.35;
            const top = -margin - frame.top;
            if (along < wide) return { x: along - margin, y: top, bow };
            along -= wide;
            if (along < tall) return { x: wide - margin, y: top + along, bow };
            along -= tall;
            if (along < wide) return { x: wide - margin - along, y: top + tall, bow };
            return { x: -margin, y: top + tall - (along - wide), bow };
        };

        const from = (i, origin) => {
            const point = offScreen(i);
            return { x: point.x - origin.x, y: point.y - origin.y, bow: point.bow };
        };

        const tag = document.querySelector('.hero-tag');
        const tagLines = flyLayer(tag, 'tag-lines');
        const style = getComputedStyle(tag);
        const metrics = document.createElement('canvas').getContext('2d');
        metrics.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
        const { fontBoundingBoxAscent: ascent, fontBoundingBoxDescent: descent } = metrics.measureText('H');
        letters.forEach((letter, i) => {
            const box = letter.getBoundingClientRect();
            const left = box.left - frame.left - tagLines.origin.x;
            const baseline = box.top - frame.top - tagLines.origin.y + (box.height - ascent - descent) / 2 + ascent;
            const points = traceGlyph(letter.firstChild.textContent.toUpperCase(), style)
                .map(p => ({ x: left + p.x, y: baseline + p.y }));
            if (!points.length) {
                land(letter);
                return;
            }
            flyLine(tagLines.group, from(i, tagLines.origin), points, i * TAG_STEP, () => land(letter));
        });

        const photoLines = flyLayer(mask.parentElement, 'photo-lines');
        const box = mask.getBoundingClientRect();
        const x = box.left - frame.left - photoLines.origin.x;
        const y = box.top - frame.top - photoLines.origin.y;
        const edge = box.width;
        const corners = [{ x, y }, { x: x + edge, y }, { x: x + edge, y: y + edge }, { x, y: y + edge }];
        flyLine(photoLines.group, from(letters.length, photoLines.origin), [...corners, corners[0]], 0, () => {}, { stays: true, duration: OUTLINE_FLIGHT });

        // Each row of the photo gets a line of its own, and the row shows as the line sweeps it.
        const rows = [...document.querySelectorAll('.photo-strip')];
        let waiting = rows.length;
        rows.forEach((row, i) => {
            const forwards = i % 2 === 0;
            const rowY = y + (i + 0.5) * edge / rows.length;
            const ends = [{ x, y: rowY }, { x: x + edge, y: rowY }];
            const delay = PHOTO_START + i * PHOTO_ROW;
            flyLine(photoLines.group, from(letters.length + 4 + i, photoLines.origin), forwards ? ends : ends.reverse(), delay, () => {
                waiting--;
                if (!waiting) finishPhoto();
            });
            // A hair of overlap, so no seam shows between neighbouring rows.
            const top = Math.max(0, i * 100 / rows.length - 0.2);
            const bottom = Math.max(0, 100 - (i + 1) * 100 / rows.length - 0.2);
            row.animate(
                [{ clipPath: `inset(${top}% ${forwards ? '100%' : '0%'} ${bottom}% ${forwards ? '0%' : '100%'})` }, { clipPath: `inset(${top}% 0% ${bottom}% 0%)` }],
                { duration: LINE_FLIGHT * 0.3, delay: delay + LINE_FLIGHT * 0.7, easing: 'ease-out', fill: 'both' }
            );
        });
    }

    /* ---------- Hero photo ---------- */

    // Thin rows of the photo, each hidden until the line drawing it arrives. Each row is a
    // full copy of the photo clipped by percentages, so it scales with the window.
    function addPhotoRows() {
        const mask = document.querySelector('.hero-portrait-mask');
        if (!mask || reduceMotion) return;
        const image = mask.querySelector('img');
        for (let i = 0; i < PHOTO_ROWS; i++) {
            const row = document.createElement('span');
            row.className = 'photo-strip';
            const copy = document.createElement('img');
            copy.src = image.currentSrc || image.src;
            copy.alt = '';
            row.append(copy);
            mask.append(row);
        }
    }

    /* ---------- Text plates ---------- */

    // Wraps text so its background follows each line's real length. A plate the size of the
    // whole block would hide the curves in the empty space beside short lines.
    function hugText() {
        document.querySelectorAll('.project-title, .project-desc, .about-heading, .about-text, .shot-title, .shot-what, .shot-tools').forEach(block => {
            const hug = document.createElement('span');
            hug.className = 'hug';
            hug.append(...block.childNodes);
            block.append(hug);
        });
    }

    /* ---------- About ---------- */

    // The photo runs from the top of the heading to the bottom of the links. It's square,
    // so its width changes how the text wraps: a few passes let the two settle.
    function fitAboutPhoto() {
        const photo = document.getElementById('profile-img');
        const heading = document.getElementById('about-heading');
        const links = document.getElementById('primary-links-container');
        if (!photo || !heading || !links) return;
        photo.style.width = '';
        if (window.matchMedia('(max-width: 1000px)').matches) return;
        for (let pass = 0; pass < 3; pass++) {
            photo.style.width = `${links.offsetTop + links.offsetHeight - heading.offsetTop}px`;
        }
    }

    /* ---------- Boot ---------- */

    async function init() {
        [...document.querySelectorAll('.hero-title .line-in')].reduce((at, line) => splitLetters(line, at), 0);
        splitLetters(document.querySelector('.hero-tag'));
        addPhotoRows();
        hugText();
        addTagOutlines();
        // The name's letters each keep to their own box until they've landed.
        document.querySelectorAll('.hero-title .ltr').forEach(letter => {
            const slot = document.createElement('span');
            slot.className = 'slot';
            letter.replaceWith(slot);
            slot.append(letter);
        });

        const hero = document.querySelector('.hero');
        const heroSvg = svgLayer('curve-field curve-field--hero');
        hero.prepend(heroSvg);
        const lamp = addLamp(hero);

        const threadSvg = svgLayer('thread');
        document.body.prepend(threadSvg);

        addSkills();
        keepUrlClean();
        addGraphPlayhead();
        addPhotoHighlight();
        addNeuralNet();
        const timeline = buildTimeline();

        let thread;

        const update = () => {
            updateThread(thread);
            updateTimeline(timeline);
        };

        // Under the loader the pitch placement waits for the layout to settle, so it runs once.
        let placed = false;
        let placing = Promise.resolve();
        // Under the loader a rebuild runs in pieces, so the loader keeps moving.
        let piecesRun = 0;
        const rebuildInPieces = async settled => {
            const run = ++piecesRun;
            fitAboutPhoto();
            await nextTask();
            const built = buildThread(threadSvg);
            await nextTask();
            if (run !== piecesRun) return placing;
            thread = built;
            drawHero(heroSvg, thread.keys[0]);
            await nextTask();
            if (run !== piecesRun) return placing;
            if (lamp) lamp.layout();
            layoutTimeline(timeline);
            if (settled) {
                placing = placeResults(thread);
                placed = true;
            }
            update();
            snapBall(timeline);
            return placing;
        };
        const rebuild = (settled = true) => {
            if (loading()) return rebuildInPieces(settled);
            fitAboutPhoto();
            thread = buildThread(threadSvg);
            drawHero(heroSvg, thread.keys[0]);
            if (lamp) lamp.layout();
            layoutTimeline(timeline);
            if (settled) {
                placing = placeResults(thread);
                placed = true;
            }
            update();
            snapBall(timeline);
            return placing;
        };
        await rebuild(!loading());

        // The ball starts the page sitting on the name, or on whichever key the page opens at.
        timeline.ballX = timeline.ballGoal;
        const opening = timeline.labels.find(l => timeline.ballX >= l.left && timeline.ballX <= l.right);
        timeline.ground = opening ? opening.rise : 0;
        update();

        // Late images and videos change the page height, which moves every stop.
        let pending = 0;
        let resizing = 0;
        let lastAsk = performance.now();
        let lastHeight = document.body.scrollHeight;
        let lastWidth = window.innerWidth;
        const schedule = () => {
            clearTimeout(pending);
            lastAsk = performance.now();
            pending = setTimeout(() => {
                pending = 0;
                const height = document.body.scrollHeight;
                // Mobile address bars fire resize without changing the layout.
                if (height === lastHeight && window.innerWidth === lastWidth) return;
                lastHeight = height;
                lastWidth = window.innerWidth;
                rebuild();
            }, 200);
            // Everything but the slow pitch placement follows the window, but a full rebuild costs
            // a long frame, and rebuilding on every frame of a zoom made the page stutter. So it
            // follows at most every 150 ms. Under the loader nobody can see it, so only the settled rebuild runs.
            if (resizing || document.body.classList.contains('loading')) return;
            resizing = setTimeout(() => requestAnimationFrame(() => {
                resizing = 0;
                rebuild(false);
            }), 150);
        };
        window.addEventListener('resize', schedule);
        document.fonts.ready.then(schedule);
        if ('ResizeObserver' in window) new ResizeObserver(schedule).observe(document.body);

        // Fonts and the hero photo change the layout, so the warm-up waits for them
        // and then for the rebuilds they cause to stop.
        const photo = document.querySelector('.hero-portrait img');
        const quiet = () => new Promise(resolve => {
            const check = () => (!pending && performance.now() - lastAsk > 300 ? resolve() : setTimeout(check, 100));
            check();
        });
        Promise.all([
            document.fonts.ready,
            photo && photo.decode ? photo.decode().catch(() => {}) : null
        ])
            .then(quiet)
            .then(() => (placed ? placing : rebuild()))
            .then(() => {
                warmGlyphs();
                return lamp && lamp.warm();
            })
            .catch(() => {})
            .then(() => warmDone());

        let ticking = false;
        window.addEventListener('scroll', () => {
            bounceBall(timeline);
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                ticking = false;
                update();
            });
        }, { passive: true });
    }

    const start = () => setTimeout(init);
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
