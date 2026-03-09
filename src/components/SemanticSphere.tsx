// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable */
"use client";
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import ShellNavigator, { ShellLevel } from './sphere/ShellNavigator';
import './sphere.css';

export interface FilmNode {
    id: number;
    title: string;
    year: number;
    dir: string;
    shell: number;
    tags: string[];
    poster?: string[];
    poster_url?: string | null;
}

export interface FilmEdge {
    from: number;
    to: number;
    type: string;
    label: string;
}

interface SemanticSphereProps {
    files?: FilmNode[];
    edges?: FilmEdge[];
}

export default function SemanticSphere({ files = [], edges = [] }: SemanticSphereProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mounted = useRef(false);
    const [selectedFilm, setSelectedFilm] = React.useState<FilmNode | null>(null);
    const [selectedEdges, setSelectedEdges] = React.useState<any[]>([]);

    // Shell Navigation State
    const [activeShell, setActiveShell] = React.useState<ShellLevel>(0);
    const [isAnimating, setIsAnimating] = React.useState(false);
    const sphereApi = useRef<any>(null);

    useEffect(() => {
        if (sphereApi.current) {
            setIsAnimating(true);
            sphereApi.current.setShell(activeShell);
            setTimeout(() => setIsAnimating(false), 1000); // lock nav during transition
        }
    }, [activeShell]);

    useEffect(() => {
        if (mounted.current) return;
        if (files.length === 0) return; // wait for data or skip if empty
        mounted.current = true;

        // Wrap the original script inside this effect
        // ═══════════════════════════════════════════════════════════
        // DATA
        // ═══════════════════════════════════════════════════════════
        const FILMS = files;
        const EDGES = edges;

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


        let targetCameraZ = 3; // Starts at shell 0
        const TWEEN_TASKS: any[] = []; // Custom tweening engine

        function addTween(obj, prop, target, duration, delay = 0) {
            TWEEN_TASKS.push({
                obj, prop, start: obj[prop], target,
                duration, delay, elapsed: 0
            });
        }

        sphereApi.current = {
            setShell: (shell: number) => {
                const zTargets = { 0: 3, 1: 5.5, 2: 8.5 };
                targetCameraZ = zTargets[shell];

                FILMS.forEach((f, i) => {
                    const isVisible = f.shell <= shell;
                    const isCurrentShell = f.shell === shell;

                    // If moving forward to Shell 2, only show nodes connected to selected Shell 1
                    let shouldShow = isVisible;
                    if (shell === 2 && f.shell === 2) {
                        if (navContext) {
                            // Only show if connected to navContext.current
                            const conns = connectedTo(navContext.current);
                            if (!conns.includes(i)) shouldShow = false;
                        } else {
                            // If no focused node, show none or all? Let's show all for now, or maybe none.
                            // Rules: "Mostrare solo i nodi Shell 2 collegati al film selezionato in Shell 1."
                            // If none selected, don't show Shell 2 nodes.
                            shouldShow = false;
                        }
                    }

                    const targetOp = shouldShow ? NCFG[f.shell].glow : 0;
                    const targetBaseOp = shouldShow ? 1 : 0; // for nodeMeshes

                    if (shouldShow && glowMeshes[i].material.opacity === 0) {
                        // Fade IN (Staggered)
                        const delay = isCurrentShell ? i * 20 : 0; // 20ms stagger (80 is too slow for 100 nodes)
                        addTween(glowMeshes[i].material, 'opacity', targetOp, 600, delay);
                        addTween(nodeMeshes[i].material, 'opacity', targetBaseOp, 600, delay);
                    } else if (!shouldShow && glowMeshes[i].material.opacity > 0) {
                        // Fade OUT
                        addTween(glowMeshes[i].material, 'opacity', 0, 400, 0);
                        addTween(nodeMeshes[i].material, 'opacity', 0, 400, 0);
                    }
                });

                // Hide/show edges
                edgeLines.forEach((l, i) => {
                    const e = EDGES[i];
                    const v1 = FILMS[e.from].shell <= shell;
                    const v2 = FILMS[e.to].shell <= shell;
                    const targetBase = (v1 && v2) ? ECFG[e.type].base * 0.8 : 0;
                    addTween(l.material, 'opacity', targetBase, 500, 0);
                });
            }
        };

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
        // Initialize camera to Shell 0 z-index instead of 11
        camera.position.set(0, 0, 3);

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
        FILMS.forEach((f, index) => {
            // we attach the index to the film object temporarily to use it later
            (f as any)._index = index;
            byShell[f.shell].push(f)
        });
        const positions = new Array(FILMS.length);
        byShell.forEach((films, s) => films.forEach((f: any, i) => {
            if (f._index !== undefined) {
                positions[f._index] = fibPos(i, films.length, RADII[s]);
            }
        }));

        // Nodes
        const nodeMeshes: THREE.Mesh[] = [], glowMeshes: THREE.Mesh[] = [];
        FILMS.forEach((f: any, index) => {
            const cfg = NCFG[f?.shell] || NCFG[2]; // Fallback to shell 2 
            const pos = positions[index] || new THREE.Vector3(0, 0, 0);
            const core = new THREE.Mesh(
                new THREE.SphereGeometry(cfg.size, 20, 14),
                new THREE.MeshBasicMaterial({ color: cfg.color })
            );
            core.position.copy(pos);
            core.userData.index = index;
            group.add(core); nodeMeshes.push(core);

            const gl = new THREE.Mesh(
                new THREE.SphereGeometry(cfg.size * 3.5, 16, 12),
                new THREE.MeshBasicMaterial({ color: cfg.color, transparent: true, opacity: cfg.glow, blending: THREE.NormalBlending })
            );
            gl.position.copy(pos);
            gl.userData.index = index; // Allow raycasting on glow
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
        if (labelsDiv) labelsDiv.innerHTML = ''; // Ensure no ghost labels from React Strict Mode double-invocations
        const labelEls = new Array(FILMS.length);
        FILMS.forEach((f, index) => {
            const d = document.createElement('div');
            d.className = `node-label label-${['pillar', 'primary', 'secondary'][f.shell]}`;
            d.innerHTML = `<div class="label-title" id="lt-${index}">${f.title}</div>`;
            labelsDiv!.appendChild(d);
            labelEls[index] = d;
        });

        function updateLabels(hov: number | null, sel: number | null) {
            const tmp = new THREE.Vector3();
            FILMS.forEach((f, index) => {
                const el = labelEls[index], lt = document.getElementById(`lt-${index}`);
                if (!el || !lt) return;
                const p = positions[index].clone().applyEuler(group.rotation);
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

            // Visible set: current + parent + siblings + children + all direct neighbors
            const visible = new Set([filmId]);
            if (parent !== null) visible.add(parent);
            sibs.forEach(s => visible.add(s));
            children.forEach(c => visible.add(c));
            connectedTo(filmId).forEach(n => visible.add(n));

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
            const sameLevelSibs = children.filter(idx => FILMS[idx].shell === firstShell); // Use idx
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
        function showPanel(nodeIndex: number) {
            const film = FILMS[nodeIndex];
            const connEdges = EDGES.filter(e => e.from === nodeIndex || e.to === nodeIndex);
            const edgeData = connEdges.map(e => {
                const oid = e.from === nodeIndex ? e.to : e.from;
                return { id: e.from + '-' + e.to, type: e.type, film: FILMS[oid] };
            });
            setSelectedFilm(film);
            setSelectedEdges(edgeData);
        }

        function closePanel() {
            setSelectedFilm(null);
            document.getElementById('nav-controls')?.classList.remove('visible');
            document.getElementById('breadcrumb')?.classList.remove('visible');
            navContext = null;
            // Reset visuals
            FILMS.forEach((f, i) => {
                nodeMeshes[i].material.color.setHex(NCFG[f.shell].color);
                glowMeshes[i].material.opacity = NCFG[f.shell].glow;
            });
            edgeLines.forEach((l, i) => { l.material.opacity = ECFG[EDGES[i].type].base; });
        }

        window.addEventListener('closeSpherePanel', closePanel);

        // ═══════════════════════════════════════════════════════════
        // MOUSE
        // ═══════════════════════════════════════════════════════════
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        let isDown = false, isDragging = false, lastXY = { x: 0, y: 0 }, vel = { x: 0, y: 0 };

        function getHit(x, y) {
            mouse.x = (x / W()) * 2 - 1; mouse.y = -(y / H()) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            // Intersect both nodes and glows to increase hit area
            const hits = raycaster.intersectObjects([...nodeMeshes, ...glowMeshes]);
            return hits.length ? hits[0].object.userData.index : null; // Return index
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
            const rect = canvas.getBoundingClientRect();

            // Calculate distance from the actual center of the 3D canvas on the screen
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dist = Math.sqrt(Math.pow(e.clientX - cx, 2) + Math.pow(e.clientY - cy, 2));

            // Circular active area: 45% of the canvas smallest dimension
            const activeRadius = Math.min(rect.width, rect.height) * 0.45;

            // Only zoom and prevent scrolling if the mouse is hovering over the actual sphere
            // And if the sphere is still somewhat visible on the screen
            if (dist < activeRadius && rect.bottom > 0) {
                e.preventDefault();
                camera.position.z = Math.max(5, Math.min(18, camera.position.z + e.deltaY * .012));
            }
        }, { passive: false });

        // Keyboard navigation — mirrors button logic (↑=outward, ↓=inward)
        window.addEventListener('keydown', e => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
            }
            if (e.key === 'Escape') {
                closePanel();
            }
            if (!navContext) return;
            if (e.key === 'ArrowUp') document.getElementById('btn-up')?.click();
            if (e.key === 'ArrowDown') document.getElementById('btn-down')?.click();
            if (e.key === 'ArrowLeft') document.getElementById('btn-left')?.click();
            if (e.key === 'ArrowRight') document.getElementById('btn-right')?.click();
        });

        // ═══════════════════════════════════════════════════════════
        // RENDER LOOP
        // ═══════════════════════════════════════════════════════════
        let t = 0;
        function animate() {
            requestAnimationFrame(animate);
            t += .01;

            // Camera dolly lerp
            camera.position.z += (targetCameraZ - camera.position.z) * 0.05;

            // Custom tweens
            for (let i = TWEEN_TASKS.length - 1; i >= 0; i--) {
                const task = TWEEN_TASKS[i];
                if (task.delay > 0) {
                    task.delay -= 16.6; // approx 1 frame at 60fps
                    continue;
                }
                task.elapsed += 16.6;
                const progress = Math.min(task.elapsed / task.duration, 1);
                // easeInOutQuad
                const ease = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
                task.obj[task.prop] = task.start + (task.target - task.start) * ease;

                if (progress >= 1) TWEEN_TASKS.splice(i, 1);
            }

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
            const labelsDiv = document.getElementById('labels');
            if (labelsDiv) labelsDiv.innerHTML = '';
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

            <ShellNavigator
                activeShell={activeShell}
                onShellChange={setActiveShell}
                isAnimating={isAnimating}
            />

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

            {/* Info Panel -> React State */}
            {selectedFilm && (
                <div id="panel" className="visible">
                    <button id="panel-close" onClick={() => { setSelectedFilm(null); window.dispatchEvent(new Event('closeSpherePanel')); }}>×</button>
                    <div id="panel-poster">
                        <img id="poster-img"
                            src={selectedFilm.poster_url || '/placeholder.jpg'}
                            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
                            alt=""
                        />
                        <div className="poster-bg" id="poster-bg"></div>
                        <div className="poster-overlay"></div>
                        <div className="poster-content">
                            <div className="poster-eyebrow" id="poster-eyebrow"></div>
                            <div className="poster-film-title" id="poster-title">{selectedFilm.title}</div>
                            <div className="poster-film-meta" id="poster-meta">
                                <span style={{ opacity: .6, fontFamily: 'Fragment_Mono', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '10px' }}>{selectedFilm.dir}</span>
                                <span style={{ opacity: .3, margin: '0 8px' }}>|</span>
                                <span style={{ opacity: .5, fontFamily: 'Fragment_Mono', letterSpacing: '1px' }}>{selectedFilm.year}</span>
                            </div>
                        </div>
                    </div>
                    <div className="panel-body">
                        <div id="p-badge">
                            <div className={`p-badge p-badge-${['pillar', 'primary', 'secondary'][selectedFilm.shell]}`}>
                                {['Pilastro del gusto', 'Affinità diretta', 'Scoperta laterale'][selectedFilm.shell]}
                            </div>
                        </div>
                        <div className="p-section">Temi editoriali</div>
                        <div className="p-tags" id="p-tags">
                            {selectedFilm.tags.map((t: string) => <div key={t} className="p-tag">{t}</div>)}
                        </div>
                        {selectedEdges.length > 0 && (
                            <>
                                <div className="p-section" id="conn-section-label">Connessioni editoriali</div>
                                <div className="p-conns" id="p-conns">
                                    {selectedEdges.map((e: any) => (
                                        <div key={e.id} className="p-conn">
                                            <div className="p-conn-dot" style={{ background: ['var(--ember)', 'var(--gold)', 'var(--cold)'][e.film.shell] }}></div>
                                            <span>{e.film.title}</span>
                                            <span className="p-conn-type">· {e.type}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
