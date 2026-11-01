/* The lamp's intro, shared by the site and lamp-editor.html.

   bake() works the motion out like a jump. The head carries most of the weight, so
   the centre of mass follows a true ballistic arc in the air, and it can only gain or
   lose speed while the base is on the floor: it sinks back, drives forward and up, and
   leaves already moving at the speed of the arc. On landing the base stops dead and the
   head carries that speed down into the squash.

   If assets/lamp-intro.json exists, it's the keyed version saved from the editor and it
   wins. Each key's ref says which reference frame it came from. Keys are { f, x, y, lean, hx, hy, aim }: x and y move the whole lamp in
   pixels from its resting spot, hx and hy place the head in bone lengths from the base. */

window.LampIntro = (() => {
    const HEAD_WEIGHT = 0.6;
    const PUSH_FRAMES = 5;
    const EASE_OFF_FRAMES = 4;
    const ABSORB_FRAMES = 7;
    const AFTER = 104;
    const BAKED_LAST_FRAME = 184;
    const LAST_FRAME = 184;
    const LIT_FRAME = 153;

    const SHAPES = {
        back: [-0.26, -0.46],
        squash: [-0.42, -0.52],
        recover: [-0.5, -0.78],
        launch: [-0.9, -1.38],
        stretch: [-1.02, -1.6],
        tuck: [-0.9, -1.2],
        reach: [-0.95, -1.5]
    };

    // up is the frame it leaves the floor and down the frame it lands, at 24fps.
    const HOPS = [
        { up: -8, down: 12, to: 300, height: 260 },
        { up: 38, down: 56, to: 120, height: 200 },
        { up: 80, down: 94, to: 0, height: 120 }
    ];

    const smooth = k => k * k * (3 - 2 * k);
    const lerp = (a, b, k) => a + (b - a) * k;
    const blend = (a, b, k) => ({ x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k) });
    const turn = (a, b, k) => a + Math.atan2(Math.sin(b - a), Math.cos(b - a)) * k;

    function hermite(p0, v0, p1, v1, k, frames) {
        const k2 = k * k;
        const k3 = k2 * k;
        return (2 * k3 - 3 * k2 + 1) * p0 + (k3 - 2 * k2 + k) * v0 * frames
            + (-2 * k3 + 3 * k2) * p1 + (k3 - k2) * v1 * frames;
    }

    const curve = (p0, v0, p1, v1, k, frames) => ({
        x: hermite(p0.x, v0.x, p1.x, v1.x, k, frames),
        y: hermite(p0.y, v0.y, p1.y, v1.y, k, frames)
    });

    function bake({ bone, entry, pointX, pointY, nameAim }) {
        const shape = name => ({ x: SHAPES[name][0] * bone, y: SHAPES[name][1] * bone });

        let fromX = entry;
        const hops = HOPS.map(hop => {
            const start = shape('launch');
            const end = shape('reach');
            const time = hop.down - hop.up;
            const fall = 8 * hop.height / (time * time);
            const c0 = { x: fromX + HEAD_WEIGHT * start.x, y: HEAD_WEIGHT * start.y };
            const c1 = { x: hop.to + HEAD_WEIGHT * end.x, y: HEAD_WEIGHT * end.y };
            const speed = {
                x: (c1.x - c0.x) / time,
                y: (c1.y - c0.y - 0.5 * fall * time * time) / time
            };
            const solved = {
                ...hop, fromX, time, fall, c0, speed,
                leave: { x: speed.x / HEAD_WEIGHT, y: speed.y / HEAD_WEIGHT },
                arrive: { x: speed.x, y: speed.y + fall * time }
            };
            fromX = hop.to;
            return solved;
        });

        function airborne(hop, frame) {
            const t = frame - hop.up;
            const half = hop.time / 2;
            // The arm keeps opening just after the floor drops away, which eases the
            // base into the air instead of snapping it up to full speed.
            let r;
            if (t < EASE_OFF_FRAMES) r = blend(shape('launch'), shape('stretch'), smooth(t / EASE_OFF_FRAMES));
            else if (t < half) r = blend(shape('stretch'), shape('tuck'), smooth((t - EASE_OFF_FRAMES) / (half - EASE_OFF_FRAMES)));
            else r = blend(shape('tuck'), shape('reach'), smooth((t - half) / half));
            const cx = hop.c0.x + hop.speed.x * t;
            const cy = hop.c0.y + hop.speed.y * t + 0.5 * hop.fall * t * t;
            return {
                x: cx - HEAD_WEIGHT * r.x,
                y: Math.min(0, cy - HEAD_WEIGHT * r.y),
                r,
                lean: lerp(-12, 7, t / hop.time) * Math.min(1, -Math.min(0, cy - HEAD_WEIGHT * r.y) / 40)
            };
        }

        function grounded(prev, next, frame) {
            const zero = { x: 0, y: 0 };
            const land = prev.down;
            if (frame < land + ABSORB_FRAMES) {
                return curve(shape('reach'), prev.arrive, shape('squash'), zero, (frame - land) / ABSORB_FRAMES, ABSORB_FRAMES);
            }
            if (!next) return shape('squash');

            const push = next.up - PUSH_FRAMES;
            const settled = land + ABSORB_FRAMES;
            const sink = push - 3;
            const rise = settled + (sink - settled) * 0.4;
            if (frame < rise) return blend(shape('squash'), shape('recover'), smooth((frame - settled) / (rise - settled)));
            if (frame < sink) return blend(shape('recover'), shape('back'), smooth((frame - rise) / (sink - rise)));
            if (frame < push) return shape('back');
            return curve(shape('back'), zero, shape('launch'), next.leave, (frame - push) / PUSH_FRAMES, PUSH_FRAMES);
        }

        // Head aim lags the body: it looks where it's going, then dips after each landing.
        const looks = [
            [0, 2.9], [12, 2.6], [16, 2.1], [24, 2.3], [33, 2.15], [38, 2.3], [43, 3],
            [56, 2.6], [60, 2.15], [68, 2.3], [75, 2.15], [80, 2.3], [84, 3],
            [94, 2.6], [98, 2.2], [104, 2.2], [111, -2.9], [117, -2.75], [122, -2.75],
            [128, -1.9], [142, -1.9], [148, -1.5], [160, nameAim], [168, nameAim], [BAKED_LAST_FRAME, nameAim]
        ];
        // Once it's done hopping it stands, settles and points, on plain poses.
        const stands = [
            [AFTER, -0.42, -0.52], [111, -0.6, -1.62], [117, -0.6, -1.42], [122, -0.6, -1.5],
            [142, -0.6, -1.5], [148, -0.45, -1.52], [160, pointX - 0.1, pointY + 0.06],
            [168, pointX, pointY], [BAKED_LAST_FRAME, pointX, pointY]
        ];

        const between = (table, frame) => {
            const i = table.findIndex(row => row[0] > frame);
            const b = table[i < 0 ? table.length - 1 : i];
            const a = table[Math.max(0, i - 1)];
            return { a, b, k: b[0] > a[0] ? smooth((frame - a[0]) / (b[0] - a[0])) : 0 };
        };

        const frames = [];
        for (let f = 0; f <= BAKED_LAST_FRAME; f++) {
            const hop = hops.find(h => f >= h.up && f < h.down);
            const prev = hops.filter(h => h.down <= f).pop();
            const next = hops.find(h => h.up > f);
            let row;
            if (hop) {
                row = airborne(hop, f);
            } else if (f < AFTER) {
                row = { x: prev.to, y: 0, r: grounded(prev, next, f), lean: 0 };
            } else {
                const { a, b, k } = between(stands, f);
                row = { x: 0, y: 0, r: { x: lerp(a[1], b[1], k) * bone, y: lerp(a[2], b[2], k) * bone }, lean: 0 };
            }
            const look = between(looks, f);
            row.aim = turn(look.a[1], look.b[1], look.k);
            frames.push(row);
        }
        return frames;
    }

    /* ---------- Hand keys ---------- */

    const EASES = {
        linear: k => k,
        smooth,
        in: k => k * k * k,
        out: k => 1 - (1 - k) ** 3,
        hold: () => 0
    };

    /* Spline keys: a curve through every key with no overshoot, so spacing stays progressive
       between poses. A key's shift moves single channels earlier or later than the key, so the
       parts of the lamp don't all hit a pose together: { aim: 2 } lands the head's rotation two
       frames late. A contact key breaks the curve for the base, because it really does stop dead
       there, and for the arm too: the head keeps its speed, so what the base loses at contact
       the arm has to take up on that same frame. */

    const CHANNELS = ['x', 'y', 'lean', 'hx', 'hy', 'aim'];
    const BROKEN = new Set(['x', 'y', 'lean', 'hx', 'hy']);

    function track(keys, channel) {
        const shifted = keys.map(key => ({
            f: key.f + (key.contact ? 0 : (key.shift && key.shift[channel]) || 0),
            value: key[channel],
            contact: key.contact
        })).sort((a, b) => a.f - b.f).filter((row, i, rows) => !i || row.f > rows[i - 1].f);
        if (channel === 'aim') {
            shifted.forEach((row, i) => {
                if (!i) return;
                const a = shifted[i - 1].value;
                row.value = a + Math.atan2(Math.sin(row.value - a), Math.cos(row.value - a));
            });
        }
        return shifted;
    }

    function tangents(rows, breaks) {
        const n = rows.length;
        const secant = [];
        for (let i = 0; i < n - 1; i++) secant.push((rows[i + 1].value - rows[i].value) / (rows[i + 1].f - rows[i].f));
        const open = i => i === 0 || i === n - 1 || (breaks && rows[i].contact);
        const shared = rows.map((_, i) => {
            if (open(i)) return null;
            const a = secant[i - 1];
            const b = secant[i];
            return a * b <= 0 ? 0 : 2 * a * b / (a + b);
        });
        const left = [];
        const right = [];
        for (let i = 0; i < n; i++) {
            if (shared[i] !== null) {
                left[i] = shared[i];
                right[i] = shared[i];
            }
        }
        const endSlope = (d, other) => {
            if (other === null || other === undefined) return d;
            const slope = 2 * d - other;
            return slope * d < 0 ? 0 : slope;
        };
        for (let i = 0; i < n; i++) {
            if (shared[i] !== null) continue;
            if (i < n - 1) right[i] = endSlope(secant[i], shared[i + 1]);
            if (i > 0) left[i] = endSlope(secant[i - 1], shared[i - 1]);
        }
        return { left, right };
    }

    function channelAt(rows, breaks, frame) {
        if (frame <= rows[0].f) return rows[0].value;
        const n = rows.length;
        if (frame >= rows[n - 1].f) return rows[n - 1].value;
        const i = rows.findIndex(row => row.f > frame) - 1;
        const { left, right } = tangents(rows, breaks);
        const span = rows[i + 1].f - rows[i].f;
        return hermite(rows[i].value, right[i], rows[i + 1].value, left[i + 1], (frame - rows[i].f) / span, span);
    }

    function splineAt(keys, frame) {
        const pose = { f: frame };
        CHANNELS.forEach(channel => {
            pose[channel] = channelAt(track(keys, channel), BROKEN.has(channel), frame);
        });
        return pose;
    }

    // One pose at any frame, reached from the key before it with that key's ease.
    function poseAt(keys, frame) {
        if (keys[0].type) return splineAt(keys, frame);
        const next = keys.findIndex(k => k.f > frame);
        if (next < 0) return { ...keys[keys.length - 1] };
        if (next === 0) return { ...keys[0] };
        const a = keys[next - 1];
        const b = keys[next];
        const e = (EASES[a.ease] || EASES.linear)((frame - a.f) / (b.f - a.f));
        const mix = name => lerp(a[name], b[name], e);
        return {
            f: frame, x: mix('x'), y: mix('y'), lean: mix('lean'),
            hx: mix('hx'), hy: mix('hy'), aim: turn(a.aim, b.aim, e)
        };
    }

    function framesFrom(data, bone) {
        const last = data.keys[data.keys.length - 1].f;
        const frames = [];
        for (let f = 0; f <= last; f++) {
            const pose = poseAt(data.keys, f);
            frames.push({ x: pose.x, y: pose.y, r: { x: pose.hx * bone, y: pose.hy * bone }, lean: pose.lean, aim: pose.aim });
        }
        return frames;
    }

    const readKeys = async name => {
        try {
            const reply = await fetch(`assets/lamp-intro${name}.json`, { cache: 'no-store' });
            return reply.ok ? await reply.json() : null;
        } catch {
            return null;
        }
    };

    // A version is its own file: ?lamp=b plays assets/lamp-intro-b.json. Each file carries its
    // own light-on frame, so the numbers below follow whichever one was loaded last.
    async function load(version) {
        const wanted = version || new URLSearchParams(window.location.search).get('lamp') || '';
        const data = (/^[a-z0-9]+$/.test(wanted) && await readKeys(`-${wanted}`)) || await readKeys('');
        if (data) {
            api.LAST_FRAME = data.keys[data.keys.length - 1].f;
            if (data.lit) api.LIT_FRAME = data.lit;
        }
        return data;
    }

    const api = { bake, poseAt, framesFrom, load, LAST_FRAME, LIT_FRAME };
    return api;
})();
