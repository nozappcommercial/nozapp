// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable */
"use client";
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './sphere.css';

export default function SemanticSphere() {
    const containerRef = useRef<HTMLDivElement>(null);
    const mounted = useRef(false);

    useEffect(() => {
        if (mounted.current) return;
        mounted.current = true;

        // Wrap the original script inside this effect
        // ═══════════════════════════════════════════════════════════
        // DATA
        // ═══════════════════════════════════════════════════════════
        const FILMS = [
            { id: 0, title: "Solaris", year: 1972, dir: "Tarkovsky", shell: 0, tags: ["contemplazione", "spazio-tempo", "identità"], poster: ["#0d1b35", "#1a3a6b", "#2d5a8e"] },
            { id: 1, title: "Mulholland Drive", year: 2001, dir: "Lynch", shell: 0, tags: ["sogno", "doppio", "noir psichico"], poster: ["#1a0a20", "#4a1060", "#7a2090"] },
            { id: 2, title: "Stalker", year: 1979, dir: "Tarkovsky", shell: 0, tags: ["zona", "fede", "vuoto"], poster: ["#0a1a10", "#1a3a20", "#2a5a30"] },
            { id: 3, title: "Annihilation", year: 2018, dir: "Garland", shell: 1, tags: ["confine realtà", "corpo", "area X"], poster: ["#051a15", "#0d3a28", "#1a5a3a"] },
            { id: 4, title: "Lost Highway", year: 1997, dir: "Lynch", shell: 1, tags: ["identità fluida", "colpa", "mistero"], poster: ["#100508", "#2a0d15", "#4a1525"] },
            { id: 5, title: "2001: Odissea", year: 1968, dir: "Kubrick", shell: 1, tags: ["evoluzione", "silenzio", "monolito"], poster: ["#030308", "#08081a", "#10102a"] },
            { id: 6, title: "Inland Empire", year: 2006, dir: "Lynch", shell: 1, tags: ["meta-narrazione", "dissociazione"], poster: ["#150515", "#2a0a2a", "#3a1040"] },
            { id: 7, title: "The Mirror", year: 1975, dir: "Tarkovsky", shell: 1, tags: ["memoria", "sogno", "madre"], poster: ["#1a1208", "#3a2810", "#5a3e18"] },
            { id: 8, title: "Blade Runner 2049", year: 2017, dir: "Villeneuve", shell: 2, tags: ["post-umano", "solitudine"], poster: ["#0a0d18", "#1a2035", "#2a3050"] },
            { id: 9, title: "Persona", year: 1966, dir: "Bergman", shell: 2, tags: ["doppio", "silenzio", "maschera"], poster: ["#121212", "#252525", "#383838"] },
            { id: 10, title: "Holy Motors", year: 2012, dir: "Carax", shell: 2, tags: ["metamorfosi", "recitazione"], poster: ["#0d0a18", "#1e1530", "#2e2045"] },
            { id: 11, title: "Under the Skin", year: 2013, dir: "Glazer", shell: 2, tags: ["alieno", "corpo", "predazione"], poster: ["#050a10", "#0a1825", "#103035"] },
            { id: 12, title: "Eraserhead", year: 1977, dir: "Lynch", shell: 2, tags: ["angoscia", "industriale"], poster: ["#080808", "#141414", "#202020"] },
            { id: 13, title: "The Lighthouse", year: 2019, dir: "Eggers", shell: 2, tags: ["follia", "isolamento"], poster: ["#0a0a08", "#181810", "#252518"] },
            { id: 14, title: "Picnic at Hanging Rock", year: 1975, dir: "Weir", shell: 2, tags: ["mistero", "natura", "scomparsa"], poster: ["#0d1808", "#1a2e10", "#28421a"] },
            { id: 15, title: "Enter the Void", year: 2009, dir: "Noé", shell: 2, tags: ["morte", "bardo", "coscienza"], poster: ["#08050d", "#150d20", "#201030"] },
            { id: 16, title: "Sátántangó", year: 1994, dir: "Tarr", shell: 2, tags: ["tempo", "desolazione"], poster: ["#0a0a08", "#151510", "#201e18"] },
            { id: 17, title: "Memoria", year: 2021, dir: "Weerasethakul", shell: 2, tags: ["suono", "amnesia"], poster: ["#050d10", "#0d1e22", "#152e35"] },
            { id: 18, title: "A Ghost Story", year: 2017, dir: "Lowery", shell: 2, tags: ["lutto", "tempo", "casa"], poster: ["#0d0808", "#1e1010", "#2e1818"] },
            { id: 19, title: "Seconds", year: 1966, dir: "Frankenheimer", shell: 2, tags: ["identità nuova", "orrore borghese"], poster: ["#080d08", "#101810", "#182518"] },
            // Extra test data
            { id: 20, title: "The Tree of Life", year: 2011, dir: "Malick", shell: 0, tags: ["grazia", "natura", "cosmo"], poster: ["#1e251a", "#324029", "#4b603d"] },
            { id: 21, title: "Synecdoche, New York", year: 2008, dir: "Kaufman", shell: 0, tags: ["morte", "rappresentazione", "tempo"], poster: ["#1f1b24", "#302a3a", "#4a415a"] },
            { id: 22, title: "The Truman Show", year: 1998, dir: "Weir", shell: 1, tags: ["falsa realtà", "libero arbitrio"], poster: ["#0d1a26", "#173048", "#244b70"] },
            { id: 23, title: "Paprika", year: 2006, dir: "Kon", shell: 1, tags: ["sogno lucido", "inconscio", "tecnologia"], poster: ["#331414", "#5a2222", "#873232"] },
            { id: 24, title: "Midsommar", year: 2019, dir: "Aster", shell: 1, tags: ["luce", "setta", "liberazione"], poster: ["#2d2b1f", "#4a4732", "#736e4f"] },
            { id: 25, title: "Perfect Blue", year: 1997, dir: "Kon", shell: 1, tags: ["doppio", "ossessione", "internet"], poster: ["#141624", "#202640", "#2e3a63"] },
            { id: 26, title: "Brazil", year: 1985, dir: "Gilliam", shell: 2, tags: ["burocrazia", "fuga", "distopia"], poster: ["#212121", "#383838", "#595959"] },
            { id: 27, title: "The Matrix", year: 1999, dir: "Wachowski", shell: 2, tags: ["simulazione", "risveglio", "scelta"], poster: ["#0f2613", "#17401d", "#22632b"] },
            { id: 28, title: "Donnie Darko", year: 2001, dir: "Kelly", shell: 2, tags: ["viaggio nel tempo", "adolescenza", "destino"], poster: ["#1a1d26", "#2a3245", "#3c4866"] },
            { id: 29, title: "A Clockwork Orange", year: 1971, dir: "Kubrick", shell: 2, tags: ["libera scelta", "condizionamento", "violenza"], poster: ["#331b14", "#5c3022", "#8c4832"] },
            { id: 30, title: "The Master", year: 2012, dir: "Anderson", shell: 2, tags: ["trauma", "culto", "dipendenza"], poster: ["#263333", "#3a5050", "#547575"] },
            { id: 31, title: "Beau Is Afraid", year: 2023, dir: "Aster", shell: 2, tags: ["ansia", "senso di colpa", "odissea"], poster: ["#33252a", "#523740", "#78505e"] },
            { id: 32, title: "Her", year: 2013, dir: "Jonze", shell: 2, tags: ["amore virtuale", "solitudine", "evoluzione"], poster: ["#331f24", "#5c333a", "#8c4e58"] },
            { id: 33, title: "Fight Club", year: 1999, dir: "Fincher", shell: 2, tags: ["doppio", "alienazione", "distruzione"], poster: ["#262621", "#424237", "#636353"] },
            { id: 34, title: "Black Swan", year: 2010, dir: "Aronofsky", shell: 2, tags: ["perfezione", "paranoia", "doppio"], poster: ["#1a1a1a", "#2e2e2e", "#454545"] },
            { id: 35, title: "Ex Machina", year: 2014, dir: "Garland", shell: 2, tags: ["coscienza", "macchina", "inganno"], poster: ["#1a2a33", "#294452", "#3b6378"] },
            { id: 36, title: "Interstellar", year: 2014, dir: "Nolan", shell: 2, tags: ["spazio", "tempo", "amore"], poster: ["#0f141a", "#1b2530", "#2b3b4d"] },
            { id: 37, title: "Arrival", year: 2016, dir: "Villeneuve", shell: 2, tags: ["linguaggio", "tempo ciclico", "memoria"], poster: ["#212826", "#364541", "#526b64"] },
            { id: 38, title: "Vortex", year: 2021, dir: "Noé", shell: 2, tags: ["morte", "decadimento", "frammentazione"], poster: ["#2e2424", "#4a3838", "#6b5050"] },
            { id: 39, title: "High Life", year: 2018, dir: "Denis", shell: 2, tags: ["buco nero", "riproduzione", "isolamento"], poster: ["#141a2e", "#24325c", "#384f94"] },
        ];

        const EDGES = [
            { from: 0, to: 3, type: "thematic", label: "Affinità tematica — confine realtà" },
            { from: 0, to: 5, type: "thematic", label: "Affinità tematica — silenzio cosmico" },
            { from: 0, to: 2, type: "stylistic", label: "Evoluzione stilistica — Tarkovsky" },
            { from: 0, to: 7, type: "stylistic", label: "Evoluzione stilistica — tempo liquido" },
            { from: 0, to: 17, type: "contrast", label: "Contrasto narrativo — suono vs visione" },
            { from: 1, to: 4, type: "stylistic", label: "Evoluzione stilistica — Lynch-verse" },
            { from: 1, to: 6, type: "stylistic", label: "Evoluzione stilistica — meta-Lynch" },
            { from: 1, to: 12, type: "thematic", label: "Affinità tematica — inconscio industriale" },
            { from: 1, to: 9, type: "thematic", label: "Affinità tematica — il doppio" },
            { from: 1, to: 19, type: "thematic", label: "Affinità tematica — identità sostituita" },
            { from: 2, to: 16, type: "thematic", label: "Affinità tematica — attesa e desolazione" },
            { from: 2, to: 13, type: "contrast", label: "Contrasto narrativo — isolamento" },
            { from: 2, to: 14, type: "contrast", label: "Contrasto narrativo — zona proibita" },
            { from: 3, to: 11, type: "thematic", label: "Affinità tematica — corpo alieno" },
            { from: 3, to: 8, type: "stylistic", label: "Evoluzione stilistica — sci-fi contemplativo" },
            { from: 4, to: 12, type: "stylistic", label: "Evoluzione stilistica — early Lynch" },
            { from: 5, to: 8, type: "stylistic", label: "Evoluzione stilistica — odissea visiva" },
            { from: 5, to: 15, type: "thematic", label: "Affinità tematica — coscienza oltre la morte" },
            { from: 6, to: 10, type: "thematic", label: "Affinità tematica — identità performativa" },
            { from: 7, to: 18, type: "thematic", label: "Affinità tematica — lutto e tempo" },
            { from: 9, to: 10, type: "contrast", label: "Contrasto narrativo — maschera vs metamorfosi" },
            { from: 11, to: 15, type: "thematic", label: "Affinità tematica — corpo-coscienza" },
            { from: 13, to: 16, type: "contrast", label: "Contrasto narrativo — ritmo del tempo" },
            // ↓ arco diretto pillar(0)→shell-2: Solaris→Blade Runner 2049
            //   (skip shell-1: nessun nodo intermedio su questo path)
            { from: 0, to: 8, type: "contrast", label: "Contrasto narrativo — contemplazione vs distopia" },
        ];

        const ECFG = {
            thematic: { from: 0x78272e, to: 0xb58c2a, base: .6 },
            stylistic: { from: 0xb58c2a, to: 0x3b8b9e, base: .5 },
            contrast: { from: 0x3b8b9e, to: 0x225560, base: .3 },
        };
        const NCFG = [
            { color: 0x78272e, size: .15, glow: .22 }, // shell 0
            { color: 0xb58c2a, size: .11, glow: .12 }, // shell 1
            { color: 0x3b8b9e, size: .08, glow: .08 }, // shell 2
        ];

        // ═══════════════════════════════════════════════════════════
        // THREE SETUP
        // ═══════════════════════════════════════════════════════════
        const canvas = document.getElementById('c');
        const W = () => window.innerWidth, H = () => window.innerHeight;
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
        renderer.setSize(W(), H());
        renderer.setClearColor(0xf8f8ee, 1);

        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0xf8f8ee, .032);
        const camera = new THREE.PerspectiveCamera(48, W() / H(), .1, 500);
        camera.position.set(0, 0, 11);

        const RADII = [1.35, 2.8, 4.4];

        // Shell wireframes (disabled per request)
        /*
        const shellAlpha = [.10, .07, .05];
        RADII.forEach((r, i) => {
            const m = new THREE.Mesh(
                new THREE.SphereGeometry(r, 26, 16),
                new THREE.MeshBasicMaterial({ color: 0x160a0c, wireframe: true, transparent: true, opacity: shellAlpha[i] * 0.4 })
            );
            m.raycast = () => { };
            scene.add(m);
        });
        */

        const group = new THREE.Group();
        scene.add(group);

        // Fibonacci positions on each shell
        function fibPos(idx, total, R) {
            const phi = Math.PI * (3 - Math.sqrt(5));
            const y = 1 - (idx / Math.max(total - 1, 1)) * 2;
            const r = Math.sqrt(Math.max(0, 1 - y * y));
            const th = phi * idx;
            return new THREE.Vector3(Math.cos(th) * r * R, y * R, Math.sin(th) * r * R);
        }
        const byShell = [[], [], []];
        FILMS.forEach(f => byShell[f.shell].push(f));
        const positions = new Array(FILMS.length);
        byShell.forEach((films, s) => films.forEach((f, i) => {
            positions[f.id] = fibPos(i, films.length, RADII[s]);
        }));

        // Nodes
        const nodeMeshes = [], glowMeshes = [];
        FILMS.forEach(f => {
            const cfg = NCFG[f.shell], pos = positions[f.id];
            const core = new THREE.Mesh(
                new THREE.SphereGeometry(cfg.size, 20, 14),
                new THREE.MeshBasicMaterial({ color: cfg.color })
            );
            core.position.copy(pos);
            core.userData.filmId = f.id;
            group.add(core); nodeMeshes.push(core);

            const gl = new THREE.Mesh(
                new THREE.SphereGeometry(cfg.size * 3.5, 16, 12),
                new THREE.MeshBasicMaterial({ color: cfg.color, transparent: true, opacity: cfg.glow, blending: THREE.NormalBlending })
            );
            gl.position.copy(pos); gl.raycast = () => { };
            group.add(gl); glowMeshes.push(gl);
        });

        // Edges
        const edgeLines = [];
        function buildEdge(a, b, cfg) {
            const mid = a.clone().add(b).multiplyScalar(.5);
            mid.add(mid.clone().normalize().multiplyScalar(a.distanceTo(b) * .3));
            const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
            const pts = curve.getPoints(50);
            const pos3 = [], cols = [];
            const cA = new THREE.Color(cfg.from), cB = new THREE.Color(cfg.to), tmp = new THREE.Color();
            pts.forEach((p, i) => {
                pos3.push(p.x, p.y, p.z);
                tmp.lerpColors(cA, cB, i / (pts.length - 1));
                cols.push(tmp.r, tmp.g, tmp.b);
            });
            const geo = new THREE.BufferGeometry();
            geo.setAttribute('position', new THREE.Float32BufferAttribute(pos3, 3));
            geo.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
            return new THREE.Line(geo, new THREE.LineBasicMaterial({
                vertexColors: true, transparent: true, opacity: cfg.base, blending: THREE.NormalBlending
            }));
        }
        EDGES.forEach((e, i) => {
            const l = buildEdge(positions[e.from], positions[e.to], ECFG[e.type]);
            l.userData.edgeIdx = i; group.add(l); edgeLines.push(l);
        });

        // Stars
        const spts = [];
        for (let i = 0; i < 400; i++) {
            const th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1), r = 6 + Math.random() * 8;
            spts.push(Math.sin(ph) * Math.cos(th) * r, Math.sin(ph) * Math.sin(th) * r, Math.cos(ph) * r);
        }
        const sGeo = new THREE.BufferGeometry();
        sGeo.setAttribute('position', new THREE.Float32BufferAttribute(spts, 3));
        scene.add(new THREE.Points(sGeo, new THREE.PointsMaterial({ color: 0x160a0c, size: .014, transparent: true, opacity: .25 })));

        // ═══════════════════════════════════════════════════════════
        // LABELS
        // ═══════════════════════════════════════════════════════════
        const labelsDiv = document.getElementById('labels');
        const labelEls = [];
        FILMS.forEach(f => {
            const d = document.createElement('div');
            d.className = `node-label label-${['pillar', 'primary', 'secondary'][f.shell]}`;
            d.innerHTML = `<div class="label-title" id="lt-${f.id}">${f.title}</div>`;
            labelsDiv.appendChild(d);
            labelEls.push(d);
        });

        function updateLabels(hov, sel) {
            const tmp = new THREE.Vector3();
            FILMS.forEach(f => {
                const el = labelEls[f.id], lt = document.getElementById(`lt-${f.id}`);
                const p = positions[f.id].clone().applyEuler(group.rotation);
                tmp.copy(p).project(camera);
                el.style.left = (tmp.x * .5 + .5) * W() + 'px';
                el.style.top = (-.5 * tmp.y + .5) * H() + 'px';
                el.style.transform = `translate(-50%,calc(-50% - ${NCFG[f.shell].size * 85 + 10}px))`;

                const behind = tmp.z > 1;
                let op = 0;
                if (sel !== null) {
                    const active = navContext && navContext.visible.has(f.id);
                    op = active ? (f.id === sel ? 1 : .75) : 0;
                } else if (hov !== null) {
                    op = connectedTo(hov).has(f.id) ? (f.id === hov ? 1 : .7) : 0;
                } else {
                    op = .22;
                }
                el.style.opacity = behind ? 0 : op;
                lt.classList.toggle('active', f.id === sel);
            });
        }

        // ═══════════════════════════════════════════════════════════
        // GRAPH HELPERS
        // ═══════════════════════════════════════════════════════════
        function connectedTo(id) {
            const s = new Set([id]);
            EDGES.forEach(e => { if (e.from === id) s.add(e.to); if (e.to === id) s.add(e.from); });
            return s;
        }
        function edgesOf(id) {
            return EDGES.reduce((a, e, i) => { if (e.from === id || e.to === id) a.push(i); return a; }, []);
        }
        // neighbors on specific shell(s)
        function neighbors(id, shells) {
            const res = [];
            EDGES.forEach(e => {
                if (e.from === id && (shells === null || shells.includes(FILMS[e.to].shell))) res.push(e.to);
                if (e.to === id && (shells === null || shells.includes(FILMS[e.from].shell))) res.push(e.from);
            });
            return [...new Set(res)];
        }

        // ═══════════════════════════════════════════════════════════
        // NAVIGATION STATE
        // ═══════════════════════════════════════════════════════════
        // navContext: { current, parent, siblings, siblingIndex, children, visible(Set), stack }
        let navContext = null;
        let hoveredId = null;

        function buildNavContext(filmId, parent = null, siblings = null, sibIdx = 0, stack = []) {
            const film = FILMS[filmId];
            const shell = film.shell;

            // Siblings: (same-shell children of parent) UNION (direct same-shell neighbors of filmId)
            // The union ensures lateral edges (e.g. Under the Skin <-> Enter the Void) are
            // reachable with <-/-> even when they don't share the same parent.
            let sibs;
            if (siblings !== null) {
                sibs = siblings;
            } else {
                let baseSibs;
                if (parent !== null) {
                    baseSibs = neighbors(parent, [shell]);
                } else {
                    baseSibs = FILMS.filter(f => f.shell === 0).map(f => f.id);
                }
                const lateral = neighbors(filmId, [shell]).filter(id => !baseSibs.includes(id));
                sibs = [...new Set([...baseSibs, ...lateral])];
            }
            const idx = siblings !== null ? sibIdx : sibs.indexOf(filmId);

            // Children: ALL connected nodes on any shell deeper than current
            // (handles direct pillar→shell-2 edges, no depth restriction)
            const children = neighbors(filmId, null).filter(id => FILMS[id].shell > shell);
            children.sort((a, b) => FILMS[a].shell - FILMS[b].shell); // nearest shell first

            // Visible set: current + parent + siblings + children
            const visible = new Set([filmId]);
            if (parent !== null) visible.add(parent);
            sibs.forEach(s => visible.add(s));
            children.forEach(c => visible.add(c));

            return { current: filmId, parent, siblings: sibs, siblingIndex: idx, children, visible, stack };
        }

        function applyNavContext(ctx) {
            navContext = ctx;
            const { current, parent, siblings, siblingIndex, children, visible } = ctx;

            // Reset all
            FILMS.forEach((f, i) => {
                nodeMeshes[i].material.color.setHex(NCFG[f.shell].color);
                glowMeshes[i].material.opacity = NCFG[f.shell].glow;
            });
            edgeLines.forEach((l, i) => { l.material.opacity = ECFG[EDGES[i].type].base; });

            // Dim everything not in visible
            FILMS.forEach((f, i) => {
                if (!visible.has(i)) {
                    nodeMeshes[i].material.color.setHex(0xe0ddd5);
                    glowMeshes[i].material.opacity = .01;
                }
            });
            edgeLines.forEach((l, i) => {
                const e = EDGES[i];
                const bothVis = visible.has(e.from) && visible.has(e.to);
                const isActive = (e.from === current || e.to === current);
                l.material.opacity = isActive ? ECFG[e.type].base * 2.8 : bothVis ? ECFG[e.type].base * .8 : .01;
            });

            // Highlight current
            const cfg = NCFG[FILMS[current].shell];
            const c = new THREE.Color(cfg.color);
            nodeMeshes[current].material.color.copy(c.clone().multiplyScalar(0.7));
            glowMeshes[current].material.opacity = .45;

            updateNavButtons(ctx);
            updateBreadcrumb(ctx);
            showPanel(current);
        }

        // ─── Nav buttons ────────────────────────────────────────────
        function updateNavButtons(ctx) {
            const { siblings, siblingIndex, parent, children } = ctx;
            const nc = document.getElementById('nav-controls');
            nc.classList.add('visible');

            // ↑ = outward (deeper/children) — pillars are center, expand outward
            // ↓ = inward  (back to parent/center)
            document.getElementById('btn-up').disabled = children.length === 0;
            document.getElementById('btn-down').disabled = parent === null;
            document.getElementById('btn-left').disabled = siblingIndex <= 0;
            document.getElementById('btn-right').disabled = siblingIndex >= siblings.length - 1;

            const ctr = document.getElementById('nav-counter');
            if (siblings.length > 1) {
                ctr.textContent = `${siblingIndex + 1} / ${siblings.length}`;
            } else { ctr.textContent = ''; }
        }

        // ↑ = outward — go deeper (children)
        document.getElementById('btn-up').addEventListener('click', () => {
            if (!navContext || navContext.children.length === 0) return;
            const { current, children, stack } = navContext;
            const newStack = [...stack, { parent: navContext.parent, siblings: navContext.siblings, siblingIndex: navContext.siblingIndex }];
            const firstChild = children[0];
            const firstShell = FILMS[firstChild].shell;
            const sameLevelSibs = children.filter(id => FILMS[id].shell === firstShell);
            animatePanel('up', () => applyNavContext(buildNavContext(firstChild, current, sameLevelSibs, 0, newStack)));
        });

        // ↓ = inward — go back to parent
        document.getElementById('btn-down').addEventListener('click', () => {
            if (!navContext || navContext.parent === null) return;
            const { parent, stack } = navContext;
            const prev = stack.length ? stack[stack.length - 1] : null;
            const newStack = stack.slice(0, -1);
            animatePanel('down', () => applyNavContext(buildNavContext(parent, prev ? prev.parent : null, prev ? prev.siblings : null, prev ? prev.siblingIndex : 0, newStack)));
        });

        document.getElementById('btn-left').addEventListener('click', () => {
            if (!navContext) return;
            const { siblings, siblingIndex, parent, stack } = navContext;
            if (siblingIndex <= 0) return;
            const newIdx = siblingIndex - 1;
            const newId = siblings[newIdx];
            animatePanel('left', () => applyNavContext(buildNavContext(newId, parent, siblings, newIdx, stack)));
        });

        document.getElementById('btn-right').addEventListener('click', () => {
            if (!navContext) return;
            const { siblings, siblingIndex, parent, stack } = navContext;
            if (siblingIndex >= siblings.length - 1) return;
            const newIdx = siblingIndex + 1;
            const newId = siblings[newIdx];
            animatePanel('right', () => applyNavContext(buildNavContext(newId, parent, siblings, newIdx, stack)));
        });

        // Breadcrumb
        function updateBreadcrumb(ctx) {
            const bc = document.getElementById('breadcrumb');
            const { stack, current } = ctx;
            if (stack.length === 0) {
                bc.classList.remove('visible');
                return;
            }
            bc.classList.add('visible');
            // Rebuild breadcrumb showing path
            // stack items have parent ids we can trace back... simplified: show shell labels
            const shellNames = ['Pilastri', 'Affinità', 'Scoperta'];
            const currentShell = FILMS[current].shell;
            let html = '';
            for (let i = 0; i < currentShell; i++) {
                html += `<span class="bc-item">${shellNames[i]}</span><span class="bc-sep">›</span>`;
            }
            html += `<span class="bc-current">${shellNames[currentShell]}</span>`;
            bc.innerHTML = html;
        }

        // ─── Panel animation ────────────────────────────────────────
        // dir: 'left'|'right'|'up'|'down'
        // The panel exits in `dir` direction, new content enters from the opposite side.
        function animatePanel(dir, callback) {
            const panel = document.getElementById('panel');
            // exit
            panel.style.transition = 'opacity 120ms ease, transform 120ms ease';
            const exitMap = { left: 'translateX(-18px)', right: 'translateX(18px)', up: 'translateY(-14px)', down: 'translateY(14px)' };
            const enterMap = { left: 'translateX(18px)', right: 'translateX(-18px)', up: 'translateY(14px)', down: 'translateY(-14px)' };
            panel.style.opacity = '0';
            panel.style.transform = exitMap[dir];
            setTimeout(() => {
                callback(); // updates content
                panel.style.transition = 'none';
                panel.style.opacity = '0';
                panel.style.transform = enterMap[dir];
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        panel.style.transition = 'opacity 160ms ease, transform 160ms ease';
                        panel.style.opacity = '1';
                        panel.style.transform = 'none';
                    });
                });
            }, 130);
        }

        // ─── Panel & Poster ─────────────────────────────────────────
        function showPanel(id) {
            const film = FILMS[id];
            const panel = document.getElementById('panel');

            // Poster
            const posterImg = document.getElementById('poster-img');
            const posterBg = document.getElementById('poster-bg');
            if (film.posterUrl) {
                if (posterImg) {
                    posterImg.setAttribute('src', film.posterUrl);
                    posterImg.style.display = 'block';
                }
                if (posterBg) posterBg.style.display = 'none';
            } else {
                if (posterImg) posterImg.style.display = 'none';
                if (posterBg) {
                    posterBg.style.display = 'block';
                    const colors = film.poster;
                    posterBg.style.background = `radial-gradient(ellipse at 30% 40%,${colors[2]} 0%,${colors[1]} 40%,${colors[0]} 100%)`;
                }
            }

            if (document.getElementById('poster-eyebrow')) {
                document.getElementById('poster-eyebrow')!.textContent = ['★ PILASTRO', '◆ AFFINITÀ', '· SCOPERTA'][film.shell];
            }
            document.getElementById('poster-title')!.textContent = film.title;
            document.getElementById('poster-meta').textContent = `${film.year}  ·  ${film.dir}`;

            // Badge
            const badgeClasses = ['p-badge-pillar', 'p-badge-primary', 'p-badge-secondary'];
            const badgeLabels = ['Pilastro del gusto', 'Affinità diretta', 'Scoperta laterale'];
            document.getElementById('p-badge').innerHTML =
                `<div class="p-badge ${badgeClasses[film.shell]}">${badgeLabels[film.shell]}</div>`;

            // Tags
            document.getElementById('p-tags').innerHTML = film.tags.map(t => `<div class="p-tag">${t}</div>`).join('');

            // Connections
            const connEdges = EDGES.filter(e => e.from === id || e.to === id);
            const connLabel = document.getElementById('conn-section-label');
            const connEl = document.getElementById('p-conns');
            if (connEdges.length) {
                connLabel.textContent = 'Connessioni editoriali';
                const dotColor = ['var(--ember)', 'var(--gold)', 'var(--cold)'];
                connEl.innerHTML = connEdges.map(e => {
                    const oid = e.from === id ? e.to : e.from;
                    const o = FILMS[oid];
                    return `<div class="p-conn">
        <div class="p-conn-dot" style="background:${dotColor[o.shell]}"></div>
        <span>${o.title}</span>
        <span class="p-conn-type">· ${e.type}</span>
      </div>`;
                }).join('');
            } else {
                connLabel.textContent = ''; connEl.innerHTML = '';
            }

            panel.classList.add('visible');
        }

        function closePanel() {
            document.getElementById('panel').classList.remove('visible');
            document.getElementById('nav-controls').classList.remove('visible');
            document.getElementById('breadcrumb').classList.remove('visible');
            navContext = null;
            // Reset visuals
            FILMS.forEach((f, i) => {
                nodeMeshes[i].material.color.setHex(NCFG[f.shell].color);
                glowMeshes[i].material.opacity = NCFG[f.shell].glow;
            });
            edgeLines.forEach((l, i) => { l.material.opacity = ECFG[EDGES[i].type].base; });
        }

        document.getElementById('panel-close').addEventListener('click', closePanel);

        // ═══════════════════════════════════════════════════════════
        // MOUSE
        // ═══════════════════════════════════════════════════════════
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        let isDown = false, isDragging = false, lastXY = { x: 0, y: 0 }, vel = { x: 0, y: 0 };

        function getHit(x, y) {
            mouse.x = (x / W()) * 2 - 1; mouse.y = -(y / H()) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            const hits = raycaster.intersectObjects(nodeMeshes);
            return hits.length ? hits[0].object.userData.filmId : null;
        }

        window.addEventListener('mousemove', e => {
            if (isDown) {
                const dx = e.clientX - lastXY.x, dy = e.clientY - lastXY.y;
                if (Math.abs(dx) + Math.abs(dy) > 2) isDragging = true;
                vel.x = dy * .006; vel.y = dx * .006;
                group.rotation.x += vel.x; group.rotation.y += vel.y;
            } else if (!navContext) {
                const hit = getHit(e.clientX, e.clientY);
                if (hit !== hoveredId) {
                    hoveredId = hit;
                    if (hit !== null) {
                        // Hover highlight
                        const conn = connectedTo(hit);
                        FILMS.forEach((f, i) => {
                            if (conn.has(i)) {
                                nodeMeshes[i].material.color.setHex(NCFG[f.shell].color);
                                nodeMeshes[i].material.color.multiplyScalar(i === hit ? 0.8 : 0.9);
                                glowMeshes[i].material.opacity = NCFG[f.shell].glow * (i === hit ? 3 : 1.8);
                            } else {
                                nodeMeshes[i].material.color.setHex(0xe0ddd5);
                                glowMeshes[i].material.opacity = .008;
                            }
                        });
                        const eids = edgesOf(hit);
                        edgeLines.forEach((l, i) => {
                            l.material.opacity = eids.includes(i) ? ECFG[EDGES[i].type].base * 2.5 : .02;
                        });
                        canvas.style.cursor = 'pointer';
                    } else {
                        FILMS.forEach((f, i) => {
                            nodeMeshes[i].material.color.setHex(NCFG[f.shell].color);
                            glowMeshes[i].material.opacity = NCFG[f.shell].glow;
                        });
                        edgeLines.forEach((l, i) => { l.material.opacity = ECFG[EDGES[i].type].base; });
                        canvas.style.cursor = 'grab';
                    }
                }
            }
            lastXY = { x: e.clientX, y: e.clientY };
        });

        window.addEventListener('mousedown', e => {
            isDown = true; isDragging = false;
            lastXY = { x: e.clientX, y: e.clientY }; vel = { x: 0, y: 0 };
            document.body.classList.add('dragging');
        });

        window.addEventListener('mouseup', e => {
            isDown = false;
            document.body.classList.remove('dragging');
            if (!isDragging) {
                const hit = getHit(e.clientX, e.clientY);
                if (hit !== null) {
                    hoveredId = null;
                    // If we have a navContext and click on a visible node → navigate to it
                    if (navContext && navContext.visible.has(hit) && hit !== navContext.current) {
                        // Determine relation
                        if (navContext.children.includes(hit)) {
                            // Go deeper (outward) — animate up
                            const { current, children, stack } = navContext;
                            const newStack = [...stack, { parent: navContext.parent, siblings: navContext.siblings, siblingIndex: navContext.siblingIndex }];
                            const hitShell = FILMS[hit].shell;
                            const sameLevelSibs = children.filter(id => FILMS[id].shell === hitShell);
                            animatePanel('up', () => applyNavContext(buildNavContext(hit, current, sameLevelSibs, sameLevelSibs.indexOf(hit), newStack)));
                        } else if (navContext.siblings.includes(hit)) {
                            const { siblings, parent, stack } = navContext;
                            const newIdx = siblings.indexOf(hit);
                            const dir = newIdx > navContext.siblingIndex ? 'right' : 'left';
                            animatePanel(dir, () => applyNavContext(buildNavContext(hit, parent, siblings, newIdx, stack)));
                        } else if (hit === navContext.parent) {
                            document.getElementById('btn-down').click();
                        }
                    } else {
                        // Fresh selection
                        const film = FILMS[hit];
                        const sibs = FILMS.filter(f => f.shell === film.shell).map(f => f.id);
                        applyNavContext(buildNavContext(hit, null, sibs, sibs.indexOf(hit), []));
                    }
                } else {
                    if (navContext) closePanel();
                }
            }
        });

        window.addEventListener('wheel', e => {
            e.preventDefault();
            camera.position.z = Math.max(5, Math.min(18, camera.position.z + e.deltaY * .012));
        }, { passive: false });

        // Keyboard navigation — mirrors button logic (↑=outward, ↓=inward)
        window.addEventListener('keydown', e => {
            if (!navContext) return;
            if (e.key === 'ArrowUp') document.getElementById('btn-up').click();
            if (e.key === 'ArrowDown') document.getElementById('btn-down').click();
            if (e.key === 'ArrowLeft') document.getElementById('btn-left').click();
            if (e.key === 'ArrowRight') document.getElementById('btn-right').click();
            if (e.key === 'Escape') closePanel();
        });

        // ═══════════════════════════════════════════════════════════
        // RENDER LOOP
        // ═══════════════════════════════════════════════════════════
        let t = 0;
        function animate() {
            requestAnimationFrame(animate);
            t += .01;
            // Auto-rotate when idle
            if (!isDown && !navContext && !hoveredId) {
                group.rotation.y += .0016; group.rotation.x += .0003;
            }
            if (!isDown) {
                vel.x *= .93; vel.y *= .93;
                if (!navContext && !hoveredId) {
                    group.rotation.x += vel.x; group.rotation.y += vel.y;
                }
            }
            // Pillar pulse
            if (!navContext && !hoveredId) {
                FILMS.forEach((f, i) => {
                    if (f.shell === 0) {
                        glowMeshes[i].material.opacity = NCFG[0].glow * (1 + Math.sin(t * 2 + i * 1.4) * .35);
                    }
                });
            }
            // Active shimmer
            if (navContext) {
                edgesOf(navContext.current).forEach(i => {
                    const base = ECFG[EDGES[i].type].base;
                    edgeLines[i].material.opacity = base * (2.6 + Math.sin(t * 4 + i) * .35);
                });
            }
            updateLabels(hoveredId, navContext ? navContext.current : null);
            renderer.render(scene, camera);
        }
        animate();

        window.addEventListener('resize', () => {
            camera.aspect = W() / H(); camera.updateProjectionMatrix();
            renderer.setSize(W(), H());
        });

        // Auto cleanup on unmount
        return () => {
            window.removeEventListener('resize', () => { });
            window.removeEventListener('mousemove', () => { });
            window.removeEventListener('mousedown', () => { });
            window.removeEventListener('mouseup', () => { });
            window.removeEventListener('wheel', () => { });
            window.removeEventListener('keydown', () => { });
            if (document.getElementById('canvas-container')) {
                document.getElementById('canvas-container').innerHTML = '';
            }
            mounted.current = false;
        };
    }, []);

    return (
        <div ref={containerRef} className="sphere-wrapper w-full h-full relative" style={{ background: 'var(--bg)', color: 'var(--text)', overflow: 'hidden', height: '100vh', width: '100vw' }}>
            <canvas id="c"></canvas>
            <div className="vignette"></div>
            <div id="labels"></div>

            <header>
                <div>
                    <div className="brand">Editorial Graph</div>
                    <div className="title">La <em>Sfera</em> Semantica</div>
                </div>
                <div className="hints">
                    TRASCINA · ruota &nbsp;·&nbsp; SCROLL · zoom<br />
                    CLICK · seleziona nodo<br />
                    ↑↓ · cambia livello &nbsp;·&nbsp; ←→ · stesso livello
                </div>
            </header>

            <div className="shells-legend">
                <div className="shell-item">
                    <div className="shell-dot" style={{ background: "var(--ember)", }}></div>Shell I — Pilastri
                </div>
                <div className="shell-item">
                    <div className="shell-dot" style={{ background: "var(--gold)", }}></div>Shell II — Affinità
                </div>
                <div className="shell-item">
                    <div className="shell-dot" style={{ background: "var(--cold)", }}></div>Shell III — Scoperta
                </div>
            </div>

            {/* Breadcrumb */}
            <div id="breadcrumb"></div>

            {/* Navigation */}
            <div id="nav-controls">
                <button className="nav-btn" id="btn-up" disabled title="Esplora verso l'esterno">↑</button>
                <div className="nav-row">
                    <button className="nav-btn" id="btn-left" disabled title="Film precedente">←</button>
                    <button className="nav-btn" id="btn-down" disabled title="Torna verso il centro">↓</button>
                    <button className="nav-btn" id="btn-right" disabled title="Film successivo">→</button>
                </div>
                <div className="nav-counter" id="nav-counter"></div>
            </div>

            {/* Info Panel */}
            <div id="panel">
                <button id="panel-close">×</button>
                <div id="panel-poster">
                    <img id="poster-img" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, display: 'none' }} alt="" />
                    <div className="poster-bg" id="poster-bg"></div>
                    <div className="poster-overlay"></div>
                    <div className="poster-content">
                        <div className="poster-eyebrow" id="poster-eyebrow"></div>
                        <div className="poster-film-title" id="poster-title"></div>
                        <div className="poster-film-meta" id="poster-meta"></div>
                    </div>
                </div>
                <div className="panel-body">
                    <div id="p-badge"></div>
                    <div className="p-section">Temi editoriali</div>
                    <div className="p-tags" id="p-tags"></div>
                    <div className="p-section" id="conn-section-label"></div>
                    <div className="p-conns" id="p-conns"></div>
                </div>
            </div>


        </div>
    );
}
