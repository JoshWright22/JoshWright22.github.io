/* Hand-key the lamp's intro: pose it on any frame, scrub, play it back, save it to
   assets/lamp-intro.json. The site plays that file instead of the physics version. */

(() => {
    const SVG_NS = 'http://www.w3.org/2000/svg';
    const STORE = 'lamp-intro-keys-v6';
    const NOTES = 'lamp-intro-notes-v6';
    const REF_SETTINGS = 'lamp-intro-reference';
    const FPS = 24;
    const FLOOR_Y = 788;
    const UNDO_LIMIT = 200;
    const SPIN_REACH = 92;
    const ROOT_X = 864;
    const BONE = 170;
    // The story poses of the shot, and how each one eases into the next: the takeoff
    // slows to the top of the arc and the top speeds up to the landing.
    const STORY = [
        [0, 'in'], [12, 'out'], [19, 'smooth'], [24, 'smooth'], [30, 'smooth'], [33, 'in'],
        [38, 'out'], [47, 'in'], [56, 'out'], [63, 'smooth'], [67, 'smooth'], [73, 'smooth'], [75, 'in'],
        [80, 'out'], [87, 'in'], [94, 'out'], [101, 'smooth'], [104, 'out'], [111, 'smooth'], [117, 'smooth'],
        [122, 'smooth'], [128, 'smooth'], [142, 'smooth'], [148, 'out'], [160, 'smooth'], [168, 'smooth'], [184, 'smooth']
    ];
    const NAME_AIM = Math.atan2(-120, -330);
    // One kind per box on the Pose to Pose sheet, in the colours it uses. Step is the sheet's pass.
    const KIND = {
        pose: { colour: '#ff5a4d', step: 1 },
        antic: { colour: '#c98bff', step: 1 },
        'bd-a': { colour: '#5aa7ff', step: 2 },
        'bd-b': { colour: '#f05a9d', step: 3 },
        mid: { colour: '#a07bd6', step: 4 },
        'ease-out': { colour: '#5aa7ff', step: 5, small: true },
        'ease-in': { colour: '#f05a9d', step: 5, small: true },
        hold: { colour: '#ffa6d2', step: 6 },
        nudge: { colour: '#7a7a7a', step: 7, small: true }
    };
    const OLD_KINDS = { breakdown: 'bd-a', ease: 'ease-out' };
    const STEP_KIND = { 1: 'pose', 2: 'bd-a', 3: 'bd-b', 4: 'mid', 5: 'ease-out', 6: 'hold', 7: 'bd-a' };
    const STEP_HINT = {
        1: 'Story poses stepped. Check contrast: shape, size, twist, position. Antics go the opposite way.',
        2: 'Breakdown 1, biased to pose A: the closer to A, the snappier. Lead part first, on an arc.',
        3: 'Breakdown 2, biased to pose B: the closer to B, the snappier. Drag parts follow, some overshoot B.',
        4: 'Middle breakdown: tween 50 between the two breakdowns. This is the fastest frame.',
        5: 'Ease outs next to A, ease ins next to B. Each one breaks the body up a little more.',
        6: 'Moving hold: the last ease in, so a held pose stays alive.',
        7: 'Red bars are hitches: spacing shrinks, then grows, with no cause. Tween gives a straight line, drag it into an arc.'
    };
    const CHANNELS = ['x', 'y', 'lean', 'hx', 'hy', 'aim'];

    const stage = document.getElementById('stage');
    const timeline = document.getElementById('timeline');
    const status = document.getElementById('status');
    const ease = document.getElementById('ease');
    const leanInput = document.getElementById('lean');
    const readout = document.getElementById('readout');

    let keys = [];
    let notes = [];
    let history = [];
    let place = 0;
    let frame = 0;
    let playing = false;
    let playFrom = 0;
    let playStart = 0;
    let speed = 1;
    let onion = true;
    let clipboard = null;
    const saveHandles = {};
    let version = '';
    let versions = [];
    let drag = null;
    let step = 7;
    let spacingOf = 'head';
    let refSeek = null;

    const el = (name, attrs, parent) => {
        const node = document.createElementNS(SVG_NS, name);
        Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
        parent.appendChild(node);
        return node;
    };

    /* ---------- Data ---------- */

    function seedKeys() {
        const baked = LampIntro.bake({
            bone: BONE,
            entry: 1440 - ROOT_X + 260,
            pointX: -0.85,
            pointY: -0.98,
            nameAim: NAME_AIM
        });
        return STORY.map(([f, easeOut]) => {
            const row = baked[f];
            return {
                f, x: row.x, y: row.y, lean: row.lean,
                hx: row.r.x / BONE, hy: row.r.y / BONE, aim: row.aim, ease: easeOut
            };
        });
    }

    // Step 1 shows the poses stepped, like blocking. Later steps add each kind of key in turn.
    const visibleKeys = () => (step >= 7 ? keys : keys.filter(k => (KIND[k.type] || KIND.pose).step <= step));

    function poseOf(f) {
        const list = visibleKeys();
        if (step > 1) return LampIntro.poseAt(list, f);
        const held = [...list].reverse().find(k => k.f <= f) || list[0];
        return { ...held, f };
    }

    const withKinds = list => list.map(k => ({ ...k, type: OLD_KINDS[k.type] || k.type }));

    const lastFrame = () => Math.max(LampIntro.LAST_FRAME, keys[keys.length - 1].f);
    const keyAt = f => keys.find(k => k.f === f);
    const round = v => Math.round(v * 1000) / 1000;

    function store() {
        localStorage.setItem(`${STORE}-${version}`, JSON.stringify(keys));
        localStorage.setItem(`${NOTES}-${version}`, JSON.stringify(notes));
    }

    // Every finished edit lands here, which is what makes it one undo step.
    function remember() {
        const snapshot = JSON.stringify({ keys, notes });
        if (snapshot !== history[place]) {
            history = history.slice(0, place + 1);
            history.push(snapshot);
            if (history.length > UNDO_LIMIT) history.shift();
            place = history.length - 1;
        }
        store();
    }

    function restore(step) {
        const target = place + step;
        if (target < 0 || target >= history.length) return;
        place = target;
        ({ keys, notes } = JSON.parse(history[place]));
        store();
        render();
        status.textContent = step < 0 ? 'Undid the last change' : 'Redid the change';
    }

    function renderNotes() {
        const list = document.getElementById('notes');
        list.replaceChildren();
        notes.forEach(note => {
            const row = document.createElement('button');
            row.textContent = `f ${note.f}: ${note.text}`;
            row.title = 'Go to this frame. Shift-click to delete.';
            row.addEventListener('click', e => {
                if (e.shiftKey) {
                    notes = notes.filter(n => n !== note);
                    remember();
                    render();
                } else {
                    goTo(note.f);
                }
            });
            list.append(row);
        });
    }

    function addNote() {
        const f = Math.round(frame);
        const text = window.prompt(`What's wrong at frame ${f}?`);
        if (!text) return;
        notes.push({ f, text });
        notes.sort((a, b) => a.f - b.f);
        remember();
        render();
    }

    async function copyNotes() {
        const text = notes.map(n => `f${n.f}: ${n.text}`).join('\n');
        await navigator.clipboard.writeText(text);
        status.textContent = 'Notes copied. Paste them in the chat.';
    }

    // Any edit lands on a key at this frame, making one from the current pose if needed.
    function currentKey() {
        const f = Math.round(frame);
        let key = keyAt(f);
        if (!key) {
            const pose = poseOf(f);
            key = { f, type: STEP_KIND[step], ...Object.fromEntries(CHANNELS.map(c => [c, pose[c]])) };
            keys.push(key);
            keys.sort((a, b) => a.f - b.f);
        }
        return key;
    }

    /* ---------- Drawing ---------- */

    function solve(pose) {
        const root = { x: ROOT_X + pose.x, y: FLOOR_Y + pose.y };
        const hx = pose.hx * BONE;
        const hy = pose.hy * BONE;
        const reach = Math.min(Math.max(Math.hypot(hx, hy), BONE * 0.4), BONE * 1.96);
        const heading = Math.atan2(hy, hx);
        const angle = heading + Math.acos(reach / (2 * BONE));
        const elbow = { x: root.x + Math.cos(angle) * BONE, y: root.y + Math.sin(angle) * BONE };
        const forearm = Math.atan2(root.y + hy - elbow.y, root.x + hx - elbow.x);
        const hand = { x: elbow.x + Math.cos(forearm) * BONE, y: elbow.y + Math.sin(forearm) * BONE };
        return { root, elbow, hand };
    }

    function lampLayer(cls) {
        const group = el('g', { class: cls }, stage);
        return {
            group,
            base: el('path', { class: 'part', d: 'M-42 12 L-30 0 L30 0 L42 12 Z' }, group),
            upper: el('line', { class: 'bone' }, group),
            lower: el('line', { class: 'bone' }, group),
            elbow: el('circle', { class: 'joint', r: 6 }, group),
            head: (() => {
                const head = el('g', {}, group);
                el('path', { class: 'part', d: 'M-10 -9 L6 -13 L32 -30 L32 30 L6 13 L-10 9 Z' }, head);
                el('path', { class: 'bulb', d: 'M32 -14 A16 16 0 0 1 32 14 Z' }, head);
                return head;
            })()
        };
    }

    function drawLamp(layer, pose) {
        const { root, elbow, hand } = solve(pose);
        layer.group.setAttribute('transform', `rotate(${pose.lean} ${root.x} ${root.y})`);
        layer.base.setAttribute('transform', `translate(${root.x} ${root.y})`);
        [[layer.upper, root, elbow], [layer.lower, elbow, hand]].forEach(([line, a, b]) => {
            line.setAttribute('x1', a.x);
            line.setAttribute('y1', a.y);
            line.setAttribute('x2', b.x);
            line.setAttribute('y2', b.y);
        });
        layer.elbow.setAttribute('cx', elbow.x);
        layer.elbow.setAttribute('cy', elbow.y);
        layer.head.setAttribute('transform', `translate(${hand.x} ${hand.y}) rotate(${pose.aim * 180 / Math.PI}) scale(1.4)`);
    }

    /* ---------- Stage ---------- */

    el('rect', { class: 'ghost-photo', x: 1124, y: 265, width: 258, height: 258 }, stage);
    const ghost = el('text', { class: 'ghost-name', x: 58, y: 360 }, stage);
    ghost.textContent = 'JOSH';
    const ghost2 = el('text', { class: 'ghost-name', x: 58, y: 515 }, stage);
    ghost2.textContent = 'WRIGHT';
    el('line', { class: 'floor', x1: 0, y1: FLOOR_Y + 12, x2: 1440, y2: FLOOR_Y + 12 }, stage);

    const arcHead = el('path', { class: 'arc' }, stage);
    const arcDots = el('path', { class: 'arc-dots' }, stage);
    const onionBack = [lampLayer('onion'), lampLayer('onion')];
    const onionNext = [lampLayer('onion onion--next')];
    const lamp = lampLayer('');
    const aimLine = el('line', { class: 'arc' }, stage);
    const baseCtrl = el('rect', { class: 'ctrl ctrl--base', width: 120, height: 30, rx: 4 }, stage);
    const headCtrl = el('rect', { class: 'ctrl ctrl--head', width: 46, height: 46 }, stage);
    const aimCtrl = el('circle', { class: 'ctrl ctrl--aim', r: 14 }, stage);
    const spinCtrl = el('circle', { class: 'ctrl ctrl--spin', r: 12 }, stage);
    const spinLine = el('line', { class: 'arc' }, stage);

    function renderStage() {
        const pose = poseOf(frame);
        drawLamp(lamp, pose);

        const show = onion && !playing;
        [[onionBack[0], -4], [onionBack[1], -2], [onionNext[0], 2]].forEach(([layer, offset]) => {
            layer.group.style.display = show ? '' : 'none';
            if (show) drawLamp(layer, poseOf(Math.max(0, frame + offset)));
        });

        const { root, hand } = solve(pose);
        headCtrl.setAttribute('x', hand.x - 23);
        headCtrl.setAttribute('y', hand.y - 23);
        baseCtrl.setAttribute('x', root.x - 60);
        baseCtrl.setAttribute('y', root.y - 18);
        const aimX = hand.x + Math.cos(pose.aim) * 130;
        const aimY = hand.y + Math.sin(pose.aim) * 130;
        aimCtrl.setAttribute('cx', aimX);
        aimCtrl.setAttribute('cy', aimY);
        aimLine.setAttribute('x1', hand.x);
        aimLine.setAttribute('y1', hand.y);
        aimLine.setAttribute('x2', aimX);
        aimLine.setAttribute('y2', aimY);

        // The rotate handle sits on a stalk off the base and turns with the lamp.
        const tilt = (pose.lean - 90) * Math.PI / 180;
        const spinX = root.x + Math.cos(tilt) * SPIN_REACH;
        const spinY = root.y + Math.sin(tilt) * SPIN_REACH;
        spinCtrl.setAttribute('cx', spinX);
        spinCtrl.setAttribute('cy', spinY);
        spinLine.setAttribute('x1', root.x);
        spinLine.setAttribute('y1', root.y);
        spinLine.setAttribute('x2', spinX);
        spinLine.setAttribute('y2', spinY);

        // The path of the head over the whole shot, so the arcs are easy to check.
        let d = '';
        let ticks = '';
        for (let f = 0; f <= lastFrame(); f += 1) {
            const p = solve(poseOf(f)).hand;
            d += `${f ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
            ticks += `M${p.x.toFixed(1)} ${p.y.toFixed(1)}h0`;
        }
        arcHead.setAttribute('d', d);
        arcDots.setAttribute('d', ticks);
    }

    /* ---------- Timeline ---------- */

    const context = timeline.getContext('2d');

    const frameX = f => 24 + f / lastFrame() * (timeline.clientWidth - 48);
    const xFrame = x => Math.max(0, Math.min(lastFrame(), Math.round((x - 24) / (timeline.clientWidth - 48) * lastFrame())));

    const curveOf = () => (spacingOf.startsWith('curve-') ? spacingOf.slice(6) : null);

    // One channel against time, so a pop in a single axis is easy to see.
    function drawCurve(height) {
        const channel = curveOf();
        if (!channel) return;
        const values = [];
        for (let f = 0; f <= lastFrame(); f += 1) values.push(poseOf(f)[channel]);
        const low = Math.min(...values);
        const span = Math.max(...values) - low || 1;
        context.strokeStyle = '#7ba6e8';
        context.lineWidth = 1.5;
        context.beginPath();
        values.forEach((value, f) => {
            const y = height - 3 - (value - low) / span * 40;
            if (f) context.lineTo(frameX(f), y);
            else context.moveTo(frameX(f), y);
        });
        context.stroke();
    }

    // Rotations are unrolled onto a line, so the same test works for them.
    function spacingSample(pose) {
        if (spacingOf === 'aim') return { x: pose.aim * 100, y: 0 };
        if (spacingOf === 'lean') return { x: pose.lean, y: 0 };
        const { root, hand } = solve(pose);
        if (spacingOf === 'base') return root;
        const turn = pose.lean * Math.PI / 180;
        const dx = hand.x - root.x;
        const dy = hand.y - root.y;
        return { x: root.x + dx * Math.cos(turn) - dy * Math.sin(turn), y: root.y + dx * Math.sin(turn) + dy * Math.cos(turn) };
    }

    function renderTimeline() {
        const ratio = window.devicePixelRatio || 1;
        const width = timeline.clientWidth;
        const height = timeline.clientHeight;
        if (timeline.width !== Math.round(width * ratio)) {
            timeline.width = Math.round(width * ratio);
            timeline.height = Math.round(height * ratio);
        }
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        context.clearRect(0, 0, width, height);
        context.font = '10px monospace';

        for (let f = 0; f <= lastFrame(); f += 1) {
            const major = f % 24 === 0;
            const mid = f % 6 === 0;
            context.fillStyle = major ? '#8a8a8a' : '#333';
            const size = major ? 16 : mid ? 10 : 5;
            context.fillRect(Math.round(frameX(f)), 0, 1, size);
            if (major) context.fillText(String(f), frameX(f) + 3, 26);
        }

        const current = keyAt(Math.round(frame));
        visibleKeys().forEach(key => {
            const x = frameX(key.f);
            const kind = KIND[key.type] || KIND.pose;
            const size = kind.small ? 3 : 5;
            context.fillStyle = kind.colour;
            context.beginPath();
            context.moveTo(x, 42 - size - 3);
            context.lineTo(x + size, 42);
            context.lineTo(x, 42 + size + 3);
            context.lineTo(x - size, 42);
            context.fill();
            if (key === current) {
                context.strokeStyle = '#fdfdfd';
                context.lineWidth = 2;
                context.stroke();
            }
            if (key.contact) {
                context.fillStyle = '#fdfdfd';
                context.fillRect(x - 1, 51, 3, 3);
            }
        });

        // Spacing per frame, in translation or rotation. It should keep growing or keep
        // shrinking, so a red bar is a hitch between keys.
        const points = [];
        for (let f = 0; f <= lastFrame(); f += 1) points.push(spacingSample(poseOf(f)));
        const speeds = curveOf() ? [] : points.map((p, f) => (f ? Math.hypot(p.x - points[f - 1].x, p.y - points[f - 1].y) : 0));
        drawCurve(height);
        const biggest = Math.max(1, ...speeds);
        const contacts = new Set(visibleKeys().filter(k => k.contact).map(k => k.f));
        speeds.forEach((speed, f) => {
            if (!f) return;
            const prev = speeds[f - 1];
            const next = speeds[f + 1];
            const dip = next !== undefined && f > 1 && speed < prev * 0.9 && speed < next * 0.9 && Math.min(prev, next) > 3;
            const a = points[f - 1];
            const b = points[f];
            const c = points[f + 1] || b;
            const before = points[f - 2] || a;
            const sameWay = (a.x - before.x) * (c.x - b.x) + (a.y - before.y) * (c.y - b.y) > 0;
            const landing = contacts.has(f) || contacts.has(f - 1) || contacts.has(f + 1);
            const hitch = dip && sameWay && !landing;
            context.fillStyle = hitch ? '#ff4d5a' : '#3d5a8c';
            const size = speed / biggest * 34;
            context.fillRect(frameX(f) - 1, height - size, 2.5, size);
        });

        context.fillStyle = '#ffd23f';
        context.fillRect(Math.round(frameX(LampIntro.LIT_FRAME)) - 1, 28, 3, 28);
        context.fillText('light', frameX(LampIntro.LIT_FRAME) + 4, 34);

        context.fillStyle = '#ff4d5a';
        notes.forEach(note => context.fillRect(frameX(note.f) - 3, 53, 7, 7));

        context.fillStyle = '#fdfdfd';
        context.fillRect(Math.round(frameX(frame)), 0, 1, height);
    }

    function render() {
        renderStage();
        renderTimeline();
        const key = keyAt(Math.round(frame));
        readout.textContent = `f ${Math.round(frame)} / ${(frame / FPS).toFixed(2)}s${key ? ' key' : ''}`;
        const source = document.getElementById('source');
        if (document.activeElement !== source) source.value = key ? key.ref || '' : '';
        source.disabled = !key;
        renderShift(key);
        syncReference();
        renderNotes();
        const pose = poseOf(frame);
        leanInput.value = pose.lean;
        ease.disabled = !key;
        if (key) ease.value = key.type || 'pose';
        document.getElementById('contact').classList.toggle('on', Boolean(key && key.contact));
    }

    function goTo(f) {
        frame = Math.max(0, Math.min(lastFrame(), f));
        render();
    }

    /* ---------- Playback ---------- */

    function stopPlaying() {
        playing = false;
        frame = Math.round(frame);
        document.getElementById('play').classList.remove('on');
        render();
    }

    function tick(now) {
        if (!playing) return;
        frame = playFrom + (now - playStart) / 1000 * FPS * speed;
        if (frame >= lastFrame()) {
            playFrom = 0;
            playStart = now;
            frame = 0;
        }
        renderStage();
        renderTimeline();
        readout.textContent = `f ${Math.round(frame)} / ${(frame / FPS).toFixed(2)}s`;
        syncReference();
        requestAnimationFrame(tick);
    }

    function togglePlay() {
        if (playing) {
            stopPlaying();
            return;
        }
        playing = true;
        playFrom = frame >= lastFrame() ? 0 : frame;
        playStart = performance.now();
        document.getElementById('play').classList.add('on');
        requestAnimationFrame(tick);
    }

    /* ---------- Dragging ---------- */

    function stagePoint(e) {
        const point = new DOMPoint(e.clientX, e.clientY).matrixTransform(stage.getScreenCTM().inverse());
        return { x: point.x, y: point.y };
    }

    [[headCtrl, 'head'], [aimCtrl, 'aim'], [baseCtrl, 'base'], [spinCtrl, 'spin']].forEach(([node, name]) => {
        node.addEventListener('pointerdown', e => {
            if (playing) stopPlaying();
            const start = stagePoint(e);
            const key = currentKey();
            drag = { name, node, start, x: key.x, y: key.y };
            node.classList.add('active');
            node.setPointerCapture(e.pointerId);
        });
    });

    window.addEventListener('pointermove', e => {
        if (!drag) return;
        const point = stagePoint(e);
        const key = currentKey();
        if (drag.name === 'base') {
            key.x = round(drag.x + point.x - drag.start.x);
            key.y = round(Math.min(0, drag.y + point.y - drag.start.y));
        }
        if (drag.name === 'head') {
            key.hx = round((point.x - ROOT_X - key.x) / BONE);
            key.hy = round((point.y - FLOOR_Y - key.y) / BONE);
        }
        if (drag.name === 'spin') {
            const { root } = solve(key);
            const angle = Math.atan2(point.y - root.y, point.x - root.x) * 180 / Math.PI + 90;
            key.lean = Math.round(((angle + 540) % 360) - 180);
        }
        if (drag.name === 'aim') {
            const { hand } = solve(key);
            key.aim = round(Math.atan2(point.y - hand.y, point.x - hand.x));
        }
        render();
    });

    window.addEventListener('pointerup', () => {
        if (!drag) return;
        drag.node.classList.remove('active');
        drag = null;
        remember();
    });

    let scrubbing = false;
    timeline.addEventListener('pointerdown', e => {
        if (playing) stopPlaying();
        scrubbing = true;
        timeline.setPointerCapture(e.pointerId);
        goTo(xFrame(e.offsetX));
    });
    timeline.addEventListener('pointermove', e => {
        if (scrubbing) goTo(xFrame(e.offsetX));
    });
    timeline.addEventListener('pointerup', () => {
        scrubbing = false;
    });

    /* ---------- Commands ---------- */

    function stepKey(direction) {
        const f = Math.round(frame);
        const shown = visibleKeys();
        const list = direction < 0 ? [...shown].reverse() : shown;
        const target = list.find(k => (direction < 0 ? k.f < f : k.f > f));
        if (target) goTo(target.f);
    }

    function nudgeLean(amount) {
        currentKey().lean += amount;
        remember();
        render();
    }

    // Tween machine: places this key between the keys of the passes before it, so a small
    // number sits near the key before, for snappy spacing away from it. It works in both
    // translation and rotation and gives a straight line: drag it into an arc afterward.
    function tween(amount) {
        const f = Math.round(frame);
        const main = visibleKeys().filter(k => k.f !== f);
        const before = [...main].reverse().find(k => k.f < f);
        const after = main.find(k => k.f > f);
        if (!before || !after) return;
        const key = currentKey();
        ['x', 'y', 'hx', 'hy', 'lean'].forEach(c => {
            key[c] = round(before[c] + (after[c] - before[c]) * amount);
        });
        key.aim = round(before.aim + Math.atan2(Math.sin(after.aim - before.aim), Math.cos(after.aim - before.aim)) * amount);
        if (!key.ref) key.ref = `tween ${Math.round(amount * 100)}: ${before.ref || `f ${before.f}`} to ${after.ref || `f ${after.f}`}`;
        remember();
        render();
    }

    function setKey() {
        currentKey();
        remember();
        render();
    }

    function deleteKey() {
        const key = keyAt(Math.round(frame));
        if (!key || key.f === 0 || keys.length < 3) return;
        keys = keys.filter(k => k !== key);
        remember();
        render();
    }

    function copyPose() {
        const pose = poseOf(frame);
        clipboard = Object.fromEntries(CHANNELS.map(c => [c, pose[c]]));
        status.textContent = `Copied pose from f ${Math.round(frame)}`;
    }

    function pastePose() {
        if (!clipboard) return;
        Object.assign(currentKey(), clipboard);
        remember();
        render();
    }

    const versionName = () => (versions.find(v => v.id === version) || {}).name;

    const payload = () => JSON.stringify({ fps: FPS, spline: true, lit: LampIntro.LIT_FRAME, name: versionName(), notes, keys: keys.map(k => {
        const clean = { f: k.f, type: k.type || 'pose' };
        if (k.ref) clean.ref = k.ref;
        if (k.contact) clean.contact = true;
        if (k.shift && Object.keys(k.shift).length) clean.shift = k.shift;
        CHANNELS.forEach(c => {
            clean[c] = round(k[c]);
        });
        return clean;
    }) }, null, 1);

    const fileName = () => (version ? `lamp-intro-${version}.json` : 'lamp-intro.json');

    function download() {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(new Blob([payload()], { type: 'application/json' }));
        link.download = fileName();
        link.click();
        status.textContent = 'Downloaded. Put it in assets/ next to the other site files.';
    }

    // Asks for the file once, then saves straight over it, so a refresh shows the change.
    async function save() {
        if (!window.showSaveFilePicker) {
            download();
            return;
        }
        try {
            const saveHandle = saveHandles[version] || await window.showSaveFilePicker({
                suggestedName: fileName(),
                types: [{ description: 'JSON', accept: { 'application/json': ['.json'] } }]
            });
            saveHandles[version] = saveHandle;
            const writable = await saveHandle.createWritable();
            await writable.write(payload());
            await writable.close();
            status.textContent = `Saved ${new Date().toLocaleTimeString()}. Refresh the site to see it.`;
        } catch (error) {
            if (error.name !== 'AbortError') status.textContent = `Save failed: ${error.message}`;
        }
    }

    const on = (id, fn) => document.getElementById(id).addEventListener('click', fn);
    on('play', togglePlay);
    on('prev', () => stepKey(-1));
    on('next', () => stepKey(1));
    on('set', setKey);
    on('del', deleteKey);
    on('copy', copyPose);
    on('paste', pastePose);
    on('note', addNote);
    on('undo', () => restore(-1));
    document.querySelectorAll('[data-tween]').forEach(button => {
        button.addEventListener('click', () => tween(Number(button.dataset.tween)));
    });
    on('contact', () => {
        const key = currentKey();
        key.contact = !key.contact;
        remember();
        render();
    });
    document.getElementById('step').addEventListener('change', e => {
        step = Number(e.target.value);
        renderHint();
        render();
    });
    document.getElementById('spacing').addEventListener('change', e => {
        spacingOf = e.target.value;
        render();
    });
    document.getElementById('source').addEventListener('input', e => {
        const key = keyAt(Math.round(frame));
        if (!key) return;
        key.ref = e.target.value;
        store();
        syncReference();
    });
    document.getElementById('source').addEventListener('change', remember);
    on('redo', () => restore(1));
    on('copynotes', copyNotes);
    on('save', save);
    on('download', download);
    on('onion', e => {
        onion = !onion;
        e.target.classList.toggle('on', onion);
        render();
    });
    on('speed', e => {
        speed = speed === 1 ? 0.5 : speed === 0.5 ? 0.25 : 1;
        e.target.textContent = `Speed ${speed * 100}%`;
        if (playing) {
            playFrom = frame;
            playStart = performance.now();
        }
    });
    on('import', () => document.getElementById('file').click());
    on('reset', async () => {
        if (!window.confirm('Replace your work with the saved site file?')) return;
        const file = await LampIntro.load(version);
        if (!file) return;
        keys = withKinds(file.keys);
        remember();
        render();
    });

    document.getElementById('file').addEventListener('change', async e => {
        const [file] = e.target.files;
        if (!file) return;
        keys = withKinds(JSON.parse(await file.text()).keys);
        remember();
        render();
    });

    ease.addEventListener('change', () => {
        currentKey().type = ease.value;
        remember();
        render();
    });

    leanInput.addEventListener('input', () => {
        currentKey().lean = Number(leanInput.value);
        remember();
        render();
    });

    /* ---------- Reference: a video off disk beside the lamp. Nothing is uploaded or saved. ---------- */

    const refPanel = document.getElementById('refpanel');
    const refVideo = document.getElementById('refvideo');
    const refInfo = document.getElementById('refinfo');
    const refName = document.getElementById('refname');
    const refOffset = document.getElementById('refoffset');

    function renderHint() {
        document.getElementById('hint').textContent = `${STEP_HINT[step]} Drag red = head, yellow circle = aim, yellow box = base, green dot = rotate. [ ] nudges rotation. Arrows step a frame. Any drag sets a key. N marks a problem.`;
    }

    function saveRefSettings() {
        localStorage.setItem(REF_SETTINGS, JSON.stringify({ name: refName.value, offset: Number(refOffset.value) || 0 }));
    }

    // Shows the source frame of the last key from this video and runs on from there at 24 fps.
    function syncReference() {
        if (!refVideo.src) return;
        const name = refName.value.trim().replace(/\W/g, '');
        const pattern = name ? new RegExp(`^${name}\\s+(\\d+)`) : null;
        const f = Math.round(frame);
        const key = pattern && [...keys].reverse().find(k => k.f <= f && pattern.test(k.ref || ''));
        const target = key
            ? Number(key.ref.match(pattern)[1]) + f - key.f
            : f + (Number(refOffset.value) || 0);
        if (target === refSeek) return;
        refSeek = target;
        refVideo.currentTime = Math.max(0, target / FPS);
        refInfo.textContent = `Reference frame ${target} at 24 fps${key ? ` (from f ${key.f}: ${key.ref})` : ''}`;
    }

    on('refload', () => document.getElementById('reffile').click());
    document.getElementById('reffile').addEventListener('change', e => {
        const [file] = e.target.files;
        if (!file) return;
        refVideo.src = URL.createObjectURL(file);
        refPanel.hidden = false;
        refSeek = null;
        refInfo.textContent = file.name;
        render();
    });
    [refName, refOffset].forEach(input => input.addEventListener('input', () => {
        saveRefSettings();
        refSeek = null;
        syncReference();
    }));

    window.addEventListener('keydown', e => {
        if (e.target.tagName === 'INPUT' && e.target.type !== 'range' && !(e.ctrlKey || e.metaKey)) return;
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
            e.preventDefault();
            save();
            return;
        }
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
            e.preventDefault();
            restore(e.shiftKey ? 1 : -1);
            return;
        }
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
            e.preventDefault();
            restore(1);
            return;
        }
        if (e.target.tagName === 'SELECT' || e.ctrlKey || e.metaKey) return;
        const actions = {
            ' ': togglePlay,
            ArrowLeft: () => goTo(Math.round(frame) - 1),
            ArrowRight: () => goTo(Math.round(frame) + 1),
            ',': () => stepKey(-1),
            '.': () => stepKey(1),
            s: setKey,
            x: deleteKey,
            c: copyPose,
            v: pastePose,
            o: () => document.getElementById('onion').click(),
            n: addNote,
            '[': () => nudgeLean(-2),
            ']': () => nudgeLean(2)
        };
        const action = actions[e.key];
        if (!action) return;
        e.preventDefault();
        action();
    });

    window.addEventListener('resize', renderTimeline);

    /* ---------- Shift: one channel early or late against its key ---------- */

    document.querySelectorAll('[data-shift]').forEach(input => {
        input.addEventListener('input', () => {
            const key = keyAt(Math.round(frame));
            if (!key) return;
            const channel = input.dataset.shift;
            key.shift = { ...key.shift };
            if (Number(input.value)) key.shift[channel] = Number(input.value);
            else delete key.shift[channel];
            store();
            render();
        });
        input.addEventListener('change', remember);
    });

    function renderShift(key) {
        document.querySelectorAll('[data-shift]').forEach(input => {
            input.disabled = !key || Boolean(key.contact);
            if (document.activeElement !== input) input.value = (key && key.shift && key.shift[input.dataset.shift]) || '';
        });
    }

    /* ---------- Versions: each one keeps its own file and its own saved work ---------- */

    async function openVersion(id) {
        version = id;
        const stored = localStorage.getItem(`${STORE}-${version}`);
        const saved = stored ? JSON.parse(stored) : null;
        const file = await LampIntro.load(version);
        keys = withKinds(saved || (file && file.keys) || seedKeys());
        notes = JSON.parse(localStorage.getItem(`${NOTES}-${version}`) || 'null') || (file && file.notes) || [];
        history = [JSON.stringify({ keys, notes })];
        place = 0;
        frame = Math.min(frame, lastFrame());
        status.textContent = versionName() || '';
    }

    document.getElementById('version').addEventListener('change', async e => {
        if (playing) stopPlaying();
        await openVersion(e.target.value);
        render();
    });

    /* ---------- Start: your saved work first, then the site's file, then physics ---------- */

    (async () => {
        const list = await fetch('assets/lamp-versions.json', { cache: 'no-store' }).then(r => (r.ok ? r.json() : null)).catch(() => null);
        versions = list ? list.versions : [];
        const picker = document.getElementById('version');
        versions.forEach(v => picker.add(new Option(`${v.id.toUpperCase()}: ${v.name}`, v.id)));
        const asked = new URLSearchParams(window.location.search).get('lamp');
        const start = versions.some(v => v.id === asked) ? asked : (list && list.active) || '';
        picker.value = start;
        await openVersion(start);
        const reference = JSON.parse(localStorage.getItem(REF_SETTINGS) || 'null') || { name: 'film', offset: 0 };
        refName.value = reference.name;
        refOffset.value = reference.offset;
        renderHint();
        render();
    })();
})();
