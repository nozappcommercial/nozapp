// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable */
"use client";
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import ShellNavigator, { ShellLevel } from './sphere/ShellNavigator';
import './sphere.css';
import { connectedTo, edgesOf, buildNavContext } from '../lib/graph/traversal';
import { upsertMovieInteraction, InteractionType } from '@/app/actions/movies';

/**
 * SEMANTIC SPHERE COMPONENT
 * -------------------------
 * This is the core visualization engine of the application. It uses Three.js to render
 * a 3D graph of interconnected films organized into "shells" (concentric levels of abstraction).
 */


export interface FilmNode {
    id: number;
    title: string;
    year: number;
    dir: string;
    shell: number;
    tags: string[];
    poster?: string[];
    poster_url?: string | null;
    interaction?: 'seen' | 'liked' | 'ignored';
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
    
    // UI State for the movie detail panel
    const [selectedFilm, setSelectedFilm] = React.useState<FilmNode | null>(null);
    const [selectedEdges, setSelectedEdges] = React.useState<any[]>([]);
    const [panelVisible, setPanelVisible] = React.useState(false);
    const [panelMinimized, setPanelMinimized] = React.useState(false);
    
    // Feedback state (Seen, Liked, Ignored) - persisted in Supabase
    const [nodeInteractions, setNodeInteractions] = React.useState<Record<number, InteractionType | undefined>>({});

    // Sync interactions from props
    useEffect(() => {
        const initialMap: Record<number, InteractionType | undefined> = {};
        files.forEach(f => {
            if (f.interaction) initialMap[f.id] = f.interaction;
        });
        setNodeInteractions(initialMap);
    }, [files]);

    const handleInteraction = async (filmId: number, type: InteractionType) => {
        const currentType = nodeInteractions[filmId];
        const newType = currentType === type ? null : type; // Toggle if clicking same

        // Optimistic update
        setNodeInteractions(prev => ({
            ...prev,
            [filmId]: newType || undefined
        }));

        try {
            await upsertMovieInteraction(filmId, newType);
        } catch (err) {
            console.error("Failed to update interaction", err);
            // Rollback on error
            setNodeInteractions(prev => ({
                ...prev,
                [filmId]: currentType
            }));
        }
    };

    // State for the currently active shell (0, 1, or 2)
    const [activeShell, setActiveShell] = React.useState<ShellLevel>(0);
    // Ref to keep track of the active shell inside the Three.js animation loop
    const activeShellRef = useRef(0);
    // State to manage animation lock during shell transitions
    const [isAnimating, setIsAnimating] = React.useState(false);
    
    // API exposed by the internal Three.js loop to the React component
    const sphereApi = useRef<any>(null);

    // References to DOM elements for 2D labels that overlay the 3D scene
    const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
    const titleRefs = useRef<(HTMLDivElement | null)[]>([]);

    // Effect to handle changes in the active shell
    useEffect(() => {
        activeShellRef.current = activeShell;
        if (sphereApi.current) {
            setIsAnimating(true);
            sphereApi.current.setShell(activeShell);

            // Flash overlay trigger
            const flash = document.getElementById('shell-flash');
            if (flash) {
                flash.style.opacity = '1';
                setTimeout(() => { flash.style.opacity = '0'; }, 150);
            }

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

        // ═══════════════════════════════════════════════════════════
        // NODE DIMENSIONS
        // ═══════════════════════════════════════════════════════════

        const NCFG = [
            { color: 0x78272e, size: .05, glow: .10 }, // shell 0
            { color: 0xb58c2a, size: .0075, glow: .02 }, // shell 1
            { color: 0x3b8b9e, size: .0037, glow: .01 }, // shell 2
        ];


        let targetCameraZ = 2.2; // Starts at shell 0
        const camTarget = new THREE.Vector3(0, 0, 2.6);
        const lookTarget = new THREE.Vector3(0, 0, 0);
        const TWEEN_TASKS: any[] = []; // Custom tweening engine
        
        // INTERACTION STATE
        // -----------------
        let navContext: any = null; // Tracks current navigation depth/path
        let hoveredId: number | null = null; // Currently hovered node index
        let isDown = false; // Mouse/Touch press state
        let isDragging = false; // Whether the user is currently rotating the sphere
        let lastXY = { x: 0, y: 0 }; // Last recorded pointer position for momentum
        let vel = { x: 0, y: 0 }; // Current rotational velocity
        
        // THREE.js HELPERS
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();


        function addTween(obj, prop, target, duration, delay = 0) {
            TWEEN_TASKS.push({
                obj, prop, start: obj[prop], target,
                duration, delay, elapsed: 0
            });
        }

        sphereApi.current = {
            /**
             * Transition between shells (0: Pillars, 1: Affinity, 2: Discovery)
             * Updates node visibility, glow intensity, and camera position.
             */
            setShell: (shell: number) => {
                const zTargets = { 0: 2.2, 1: 4.2, 2: 6.5 };
                targetCameraZ = zTargets[shell];

                FILMS.forEach((f, i) => {
                    const isCurrentShell = f.shell === shell;

                    // Show current shell nodes PLUS nodes from previous shells (as muted cores)
                    // Shell 2 nodes are special: only shown if connected to selection.
                    let shouldShow = f.shell <= shell;
                    
                    if (shell === 2 && f.shell === 2) {
                        if (navContext) {
                            const conns = connectedTo(navContext.current, EDGES);
                            if (!conns.has(i)) shouldShow = false;
                        } else {
                            shouldShow = false;
                        }
                    }

                    const targetOp = NCFG[f.shell].glow;
                    const targetBaseOp = 1;

                    if (shouldShow) {
                        const baseDelay = isCurrentShell ? f.shell * 300 : 0;
                        const individualDelay = isCurrentShell ? i * 5 : 0;
                        const delay = baseDelay + individualDelay;
                        
                        // Current shell gets glow; previous shells (f.shell < shell) stay as muted cores (opacity 0.15)
                        const finalGlow = isCurrentShell ? targetOp : 0;
                        const finalBase = isCurrentShell ? targetBaseOp : 0.15;

                        addTween(glowMeshes[i].material, 'opacity', finalGlow, 600, delay);
                        addTween(nodeMeshes[i].material, 'opacity', finalBase, 600, delay);
                    } else {
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
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
        renderer.setSize(W(), H());
        renderer.setClearColor(0x000000, 0);

        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0xc8b89a, .004);
        const camera = new THREE.PerspectiveCamera(48, W() / H(), .1, 500);
        camera.position.set(0, 0, 2.6);

        const RADII = [1.1, 2.6, 5.6];
        const SHELL_DISTANCES = [3.4, 7.5, 14.0];

        // Shell wireframes to help understand dimensions (Commented per user request)
        /*
        RADII.forEach((r, i) => {
            const geo = new THREE.SphereGeometry(r, 64, 32);
            const mat = new THREE.MeshBasicMaterial({ color: NCFG[i].color, wireframe: true, transparent: true, opacity: 0.05 });
            const s = new THREE.Mesh(geo, mat);
            scene.add(s);
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
        // Map films to their calculated positions based on shell radius
        byShell.forEach((films, s) => films.forEach((f: any, i) => {
            if (f._index !== undefined) {
                positions[f._index] = fibPos(i, films.length, RADII[s]);
            }
        }));

        // NODES CONSTRUCTION
        // ------------------
        // We create two meshes for each film: a 'core' (solid sphere) and a 'glow' (larger, semi-transparent).
        const nodeMeshes: THREE.Mesh[] = [], glowMeshes: THREE.Mesh[] = [];
        FILMS.forEach((f: any, index) => {
            const cfg = NCFG[f?.shell] || NCFG[2]; // Fallback to shell 2 
            const pos = positions[index] || new THREE.Vector3(0, 0, 0);
            const initVisible = f.shell === 0;
            
            // The solid core of the node
            const core = new THREE.Mesh(
                new THREE.SphereGeometry(cfg.size, 20, 14),
                new THREE.MeshBasicMaterial({ color: cfg.color, transparent: true, opacity: initVisible ? 1 : 0 })
            );
            core.position.copy(pos);
            core.userData.index = index;
            group.add(core); nodeMeshes.push(core);

            // The soft glow surrounding the node
            const gl = new THREE.Mesh(
                new THREE.SphereGeometry(cfg.size * 3.5, 16, 12),
                new THREE.MeshBasicMaterial({ color: cfg.color, transparent: true, opacity: initVisible ? cfg.glow : 0, blending: THREE.NormalBlending })
            );
            gl.position.copy(pos);
            gl.userData.index = index; // Allow raycasting on glow
            group.add(gl); glowMeshes.push(gl);
        });

        // EDGES CONSTRUCTION
        // ------------------
        // Edges use Quadratic Bezier curves to create smooth, curved connections between nodes.
        const edgeLines = [];
        function buildEdge(a, b, cfg) {
            const mid = a.clone().add(b).multiplyScalar(.5);
            // Push mid-point slightly outwards for curvature
            mid.add(mid.clone().normalize().multiplyScalar(a.distanceTo(b) * .3));
            const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
            const pts = curve.getPoints(50);
            
            // Build geometry with vertex colors for gradients
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

        // Space visuals removed per user request

        // 2D UI LABELS
        // -----------
        /**
         * Updates the 2D labels position by projecting 3D node coordinates to screen space.
         * Adjusts visibility/opacity based on hover/selection state and depth.
         */
        function updateLabels(hov: number | null, sel: number | null) {
            const tmp = new THREE.Vector3();
            FILMS.forEach((f, index) => {
                const el = labelRefs.current[index];
                const lt = titleRefs.current[index];
                if (!el || !lt) return;
                const p = positions[index].clone().applyEuler(group.rotation);
                tmp.copy(p).project(camera);
                el.style.left = (tmp.x * .5 + .5) * W() + 'px';
                el.style.top = (-.5 * tmp.y + .5) * H() + 'px';

                // Hide labels in the header area (top 100px)
                const yPos = (-.5 * tmp.y + .5) * H();
                const isOverHeader = yPos < 100;

                // Adjust label offset: use smaller multiplier for smaller nodes
                const offset = NCFG[f.shell].size * 100 + 8;
                el.style.transform = `translate(-50%,calc(-50% - ${offset}px))`;
                // Only show labels for the shell we are currently viewing
                const isCurrentShell = f.shell === activeShellRef.current;

                const behind = tmp.z > 1;
                let op = 0;
                // Hide labels if we're hovering over the header
                // OR if the node does not belong to the currently active shell (we only want the muted core visible)
                if (isOverHeader || !isCurrentShell) { 
                    op = 0;
                } else if (sel !== null) {
                    const active = navContext && navContext.visible.has(f.id);
                    // Selected node is ALWAYS visible regardless of depth/behind
                    if (index === sel) { // Fixed: removed database ID mismatch
                        op = 1;
                    } else {
                        op = active && !behind ? 0.75 : 0;
                    }
                } else if (hov !== null) {
                    op = (f.id === hov) ? 1 : (connectedTo(hov, EDGES).has(f.id) ? 0.7 : 0.05);
                } else {
                    op = .22;
                }
                el.style.opacity = behind ? "0" : op.toString();
                if (f.id === sel) {
                    lt.classList.add('active');
                } else {
                    lt.classList.remove('active');
                }
            });
        }

        // NAVIGATION CONTEXT (Selection Logic)
        // ------------------------------------
        /**
         * Applies the active navigation context (current node, parent, children, siblings).
         * Highlights the selected path and dims irrelevant nodes.
         */
        function applyNavContext(ctx) {
            navContext = ctx;
            const { current, parent, siblings, siblingIndex, children, visible } = ctx;

            // Reveal connected nodes (any shell), dim everything else
            FILMS.forEach((f, i) => {
                if (visible.has(i)) {
                    nodeMeshes[i].material.color.setHex(NCFG[f.shell].color);
                    nodeMeshes[i].material.opacity = 1;
                    glowMeshes[i].material.opacity = NCFG[f.shell].glow;
                } else {
                    nodeMeshes[i].material.color.setHex(0xe0ddd5);
                    nodeMeshes[i].material.opacity = 0.15;
                    glowMeshes[i].material.opacity = .008;
                }
            });
            edgeLines.forEach((l, i) => { l.material.opacity = ECFG[EDGES[i].type].base; });
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
            document.getElementById('btn-left').disabled = siblings.length <= 1;
            document.getElementById('btn-right').disabled = siblings.length <= 1;

            const ctr = document.getElementById('nav-counter');
            if (siblings.length > 1) {
                ctr.textContent = `${siblingIndex + 1} / ${siblings.length}`;
            } else { ctr.textContent = ''; }
        }

        // ↑ = outward — go deeper (children)
        document.getElementById('btn-up').addEventListener('click', () => {
            if (!navContext || !navContext.children || navContext.children.length === 0) return;
            const { current, children, stack } = navContext;
            const newStack = [...stack, { parent: navContext.parent, siblings: navContext.siblings, siblingIndex: navContext.siblingIndex }];
            const firstChild = children[0];
            if (firstChild === undefined) return;

            const firstShell = FILMS[firstChild].shell;
            const sameLevelSibs = children.filter(idx => FILMS[idx].shell === firstShell); // Use idx
            animatePanel('up', () => applyNavContext(buildNavContext(firstChild, current, sameLevelSibs, 0, newStack, FILMS, EDGES)));
        });

        // ↓ = inward — go back to parent
        document.getElementById('btn-down').addEventListener('click', () => {
            if (!navContext || navContext.parent === null) return;
            const { parent, stack } = navContext;
            const prev = stack.length ? stack[stack.length - 1] : null;
            const newStack = stack.slice(0, -1);
            animatePanel('down', () => applyNavContext(buildNavContext(parent, prev ? prev.parent : null, prev ? prev.siblings : null, prev ? prev.siblingIndex : 0, newStack, FILMS, EDGES)));
        });

        document.getElementById('btn-left').addEventListener('click', () => {
            if (!navContext) return;
            const { siblings, siblingIndex, parent, stack } = navContext;
            const newIdx = (siblingIndex - 1 + siblings.length) % siblings.length;
            const newId = siblings[newIdx];
            animatePanel('left', () => applyNavContext(buildNavContext(newId, parent, siblings, newIdx, stack, FILMS, EDGES)));
        });

        document.getElementById('btn-right').addEventListener('click', () => {
            if (!navContext) return;
            const { siblings, siblingIndex, parent, stack } = navContext;
            const newIdx = (siblingIndex + 1) % siblings.length;
            const newId = siblings[newIdx];
            animatePanel('right', () => applyNavContext(buildNavContext(newId, parent, siblings, newIdx, stack, FILMS, EDGES)));
        });

        // BREADCRUMB UPDATE
        // -----------------
        /**
         * Updates the navigation path displayed at the top of the screen.
         * Shows the progression between shells (e.g., Pilastri › Affinità).
         */
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

        // PANEL ANIMATIONS
        // ----------------
        /**
         * Orchestrates the transition of the movie detail panel.
         * When switching between films, the panel slides out in one direction
         * and slides in from the opposite side with the new content.
         */
        function animatePanel(dir, callback) {
            const panel = document.getElementById('panel');
            // exit
            panel.style.transition = 'opacity 120ms ease, transform 120ms ease';
            const exitMap = {
                left:  'translateY(-50%) translateX(-18px)',
                right: 'translateY(-50%) translateX(18px)',
                up:    'translateY(calc(-50% - 14px))',
                down:  'translateY(calc(-50% + 14px))'
            };
            const enterMap = {
                left:  'translateY(-50%) translateX(18px)',
                right: 'translateY(-50%) translateX(-18px)',
                up:    'translateY(calc(-50% + 14px))',
                down:  'translateY(calc(-50% - 14px))'
            };
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
                        panel.style.transform = 'translateY(-50%)';
                    });
                });
            }, 130);
        }

        // PANEL VISIBILITY
        // ----------------
        function showPanel(nodeIndex: number) {
            const film = FILMS[nodeIndex];
            const connEdges = EDGES.filter(e => e.from === nodeIndex || e.to === nodeIndex);
            const edgeData = connEdges.map(e => {
                const oid = e.from === nodeIndex ? e.to : e.from;
                return { id: e.from + '-' + e.to, type: e.type, film: FILMS[oid] };
            });
            setPanelVisible(false);
            setSelectedFilm(film);
            setSelectedEdges(edgeData);
            requestAnimationFrame(() => requestAnimationFrame(() => setPanelVisible(true)));

            // Hide vertical header to not overlap with panel
            const headerVertical = document.querySelector('header[class*="headerVertical"]');
            if (headerVertical) {
                headerVertical.classList.add('header-hidden-right');
            }
        }

        function closePanel() {
            setPanelVisible(false);
            setPanelMinimized(false);
            setSelectedFilm(null);
            document.getElementById('nav-controls')?.classList.remove('visible');
            document.getElementById('breadcrumb')?.classList.remove('visible');
            navContext = null;
            
            // Show vertical header
            const headerVertical = document.querySelector('header[class*="headerVertical"]');
            if (headerVertical) {
                headerVertical.classList.remove('header-hidden-right');
            }

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
        // RAYCASTING (Hit Detection)
        // --------------------------
        /**
         * Determines which node is under the mouse cursor.
         * Raycasts into the scene and checks for intersections with node/glow meshes.
         */
        function getHit(x, y) {
            mouse.x = (x / W()) * 2 - 1; mouse.y = -(y / H()) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            // Intersect both nodes and glows to increase hit area (better UX)
            const hits = raycaster.intersectObjects([...nodeMeshes, ...glowMeshes]);
            const visibleHit = hits.find(h => h.object.material.opacity > 0);
            return visibleHit ? visibleHit.object.userData.index : null;
        }

        let scrollAccum = 0;
        const SCROLL_THRESHOLD = 80;
        let scrollLocked = false;

        // SCROLL INTERACTION
        // -------------------
        /**
         * Navigates between shells (0, 1, 2) using the mouse wheel.
         * Includes thresholding and locking to prevent rapid accidental switching.
         */
        window.addEventListener('wheel', e => {
            if (navContext) return; // locked while a film is selected
            const rect = canvas.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dist = Math.sqrt((e.clientX - cx) ** 2 + (e.clientY - cy) ** 2);
            const activeRadius = Math.min(rect.width, rect.height) * 0.45;

            if (dist < activeRadius && rect.bottom > 0) {
                e.preventDefault();
                if (scrollLocked) return;
                scrollAccum += e.deltaY;
                if (scrollAccum > SCROLL_THRESHOLD) {
                    scrollAccum = 0;
                    if (activeShellRef.current < 2) {
                        activeShellRef.current += 1;
                        setActiveShell(activeShellRef.current);
                        scrollLocked = true;
                        setTimeout(() => { scrollLocked = false; }, 800);
                    }
                } else if (scrollAccum < -SCROLL_THRESHOLD) {
                    scrollAccum = 0;
                    if (activeShellRef.current > 0) {
                        activeShellRef.current -= 1;
                        setActiveShell(activeShellRef.current);
                        scrollLocked = true;
                        setTimeout(() => { scrollLocked = false; }, 800);
                    }
                }
            }
        }, { passive: false });

        // CLICK / MOUSE DOWN INTERACTION
        // -----------------------------
        /**
         * Handles single clicks to select nodes or navigate through the graph.
         * Differentiates between dragging (rotation) and clicking (selection).
         */
        window.addEventListener('mousedown', e => {
            // Ignore events that don't originate from the 3D canvas (e.g., feedback buttons)
            if ((e.target as HTMLElement).tagName !== 'CANVAS') return;
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
                        // Determine relation (child, sibling, or parent) and animate transition
                        if (navContext.children.includes(hit)) {
                            // Go deeper (outward) — animate up
                            const { current, children, stack } = navContext;
                            const newStack = [...stack, { parent: navContext.parent, siblings: navContext.siblings, siblingIndex: navContext.siblingIndex }];
                            const hitShell = FILMS[hit].shell;
                            const sameLevelSibs = children.filter(id => FILMS[id].shell === hitShell);
                            animatePanel('up', () => applyNavContext(buildNavContext(hit, current, sameLevelSibs, sameLevelSibs.indexOf(hit), newStack, FILMS, EDGES)));
                        } else if (navContext.siblings.includes(hit)) {
                            // Switch to sibling node — animate left/right
                            const { siblings, parent, stack } = navContext;
                            const newIdx = siblings.indexOf(hit);
                            const dir = newIdx > navContext.siblingIndex ? 'right' : 'left';
                            animatePanel(dir, () => applyNavContext(buildNavContext(hit, parent, siblings, newIdx, stack, FILMS, EDGES)));
                        } else if (hit === navContext.parent) {
                            // Go back to parent — animate down
                            document.getElementById('btn-down').click();
                        }
                    } else {
                        // First-level node selection
                        const film = FILMS[hit];
                        const sibs = FILMS
                            .map((f, i) => f.shell === film.shell ? i : -1)
                            .filter(idx => idx !== -1);

                        applyNavContext(buildNavContext(hit, null, sibs, sibs.indexOf(hit), [], FILMS, EDGES));
                    }
                } else {
                    // Clicking background closes the panel
                    // Fixed: ensure we are clicking on the canvas, not UI elements
                    if ((e.target as HTMLElement).tagName === 'CANVAS' && navContext) closePanel();
                }
            }
        });

        window.addEventListener('mousemove', e => {
            hoveredId = getHit(e.clientX, e.clientY);
            if (isDown) {
                isDragging = true;
                const dx = e.clientX - lastXY.x;
                const dy = e.clientY - lastXY.y;

                // Direct rotation during drag
                group.rotation.y += dx * 0.005;
                group.rotation.x += dy * 0.005;

                vel = { x: dy * 0.002, y: dx * 0.002 };
                lastXY = { x: e.clientX, y: e.clientY };
            }
        });

        // ─── TOUCH SUPPORT ───
        let touchStartShellY = 0;
        window.addEventListener('touchstart', e => {
            const t = e.touches[0];
            isDown = true; isDragging = false;
            lastXY = { x: t.clientX, y: t.clientY }; vel = { x: 0, y: 0 };
            touchStartShellY = t.clientY;
        }, { passive: false });

        window.addEventListener('touchend', e => {
            isDown = false;
            if (!isDragging) {
                const t = e.changedTouches[0];
                const hit = getHit(t.clientX, t.clientY);
                if (hit !== null) {
                    if (navContext && navContext.visible.has(hit) && hit !== navContext.current) {
                        if (navContext.children.includes(hit)) {
                            const { current, children, stack } = navContext;
                            const newStack = [...stack, { parent: navContext.parent, siblings: navContext.siblings, siblingIndex: navContext.siblingIndex }];
                            const hitShell = FILMS[hit].shell;
                            const sameLevelSibs = children.filter(id => FILMS[id].shell === hitShell);
                            animatePanel('up', () => applyNavContext(buildNavContext(hit, current, sameLevelSibs, sameLevelSibs.indexOf(hit), newStack, FILMS, EDGES)));
                        } else if (navContext.siblings.includes(hit)) {
                            const { siblings, parent, stack } = navContext;
                            const newIdx = siblings.indexOf(hit);
                            const dir = newIdx > navContext.siblingIndex ? 'right' : 'left';
                            animatePanel(dir, () => applyNavContext(buildNavContext(hit, parent, siblings, newIdx, stack, FILMS, EDGES)));
                        } else if (hit === navContext.parent) {
                            document.getElementById('btn-down')?.click();
                        }
                    } else {
                        const film = FILMS[hit];
                        const sibs = FILMS.map((f, i) => f.shell === film.shell ? i : -1).filter(idx => idx !== -1);
                        applyNavContext(buildNavContext(hit, null, sibs, sibs.indexOf(hit), [], FILMS, EDGES));
                    }
                } else if (navContext) {
                    closePanel();
                }
            }
        });

        window.addEventListener('touchmove', e => {
            if (isDown) {
                const t = e.touches[0];
                const dx = t.clientX - lastXY.x;
                const dy = t.clientY - lastXY.y;

                if (Math.abs(dx) > 2 || Math.abs(dy) > 2) isDragging = true;

                group.rotation.y += dx * 0.006;
                group.rotation.x += dy * 0.006;

                vel = { x: dy * 0.002, y: dx * 0.002 };
                lastXY = { x: t.clientX, y: t.clientY };

                // Shell switching via vertical swipe (if no film selected)
                if (!navContext && !scrollLocked) {
                    const deltaY = t.clientY - touchStartShellY;
                    if (Math.abs(deltaY) > 100) {
                        if (deltaY < 0 && activeShellRef.current < 2) {
                            activeShellRef.current += 1;
                            setActiveShell(activeShellRef.current);
                            scrollLocked = true;
                            setTimeout(() => { scrollLocked = false; }, 800);
                        } else if (deltaY > 0 && activeShellRef.current > 0) {
                            activeShellRef.current -= 1;
                            setActiveShell(activeShellRef.current);
                            scrollLocked = true;
                            setTimeout(() => { scrollLocked = false; }, 800);
                        }
                        touchStartShellY = t.clientY;
                    }
                }
            }
        }, { passive: false });

        // KEYBOARD NAVIGATION
        // -------------------
        /**
         * Allows navigating the sphere using arrow keys and Escape.
         * Mirrors the onscreen button logic.
         */
        window.addEventListener('keydown', e => {
            if (e.key === 'Escape') { closePanel(); return; }

            if (!navContext) {
                // Shell switching via keyboard when no film is focused
                if (e.key === 'ArrowDown' && activeShellRef.current < 2) {
                    e.preventDefault();
                    activeShellRef.current += 1;
                    setActiveShell(activeShellRef.current);
                }
                if (e.key === 'ArrowUp' && activeShellRef.current > 0) {
                    e.preventDefault();
                    activeShellRef.current -= 1;
                    setActiveShell(activeShellRef.current);
                }
                return;
            }

            // Map arrow keys to navigation buttons
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
            if (e.key === 'ArrowUp') document.getElementById('btn-up')?.click();
            if (e.key === 'ArrowDown') document.getElementById('btn-down')?.click();
            if (e.key === 'ArrowLeft') document.getElementById('btn-left')?.click();
            if (e.key === 'ArrowRight') document.getElementById('btn-right')?.click();
        });

        // 3D RENDER LOOP
        // --------------
        let t = 0;
        /**
         * The core animation function called on every frame via requestAnimationFrame.
         * Handles camera movement, physics-based rotation, tweening, and shimmer effects.
         */
        function animate() {
            requestAnimationFrame(animate);
            t += .01;

            // 1. Camera Movement Logic
            if (navContext && navContext.current !== null) {
                // When a node is selected, anchor the camera to face it
                const idx = navContext.current;
                const worldPos = new THREE.Vector3();
                nodeMeshes[idx].getWorldPosition(worldPos);
                
                const dir = worldPos.clone().normalize();
                const orbitRadii = [3.4, 7.5, 14.0];
                const orbitRadius = orbitRadii[FILMS[idx].shell] + 0.8;
                camTarget.copy(dir).multiplyScalar(orbitRadius);
                lookTarget.lerp(worldPos, 0.06);
            } else {
                // Default view centered on the sphere
                camTarget.set(0, 0, SHELL_DISTANCES[activeShellRef.current]);
                lookTarget.set(0, 0, 0);
            }

            // 2. Camera Smoothing (Slerp-style interpolation)
            if (navContext && navContext.current !== null) {
                const currentDir = camera.position.clone().normalize();
                const targetDir = camTarget.clone().normalize();
                const slerpedDir = currentDir.clone().lerp(targetDir, 0.035).normalize();
                const currentRadius = camera.position.length();
                const targetRadius = camTarget.length();
                const newRadius = currentRadius + (targetRadius - currentRadius) * 0.035;
                camera.position.copy(slerpedDir.multiplyScalar(newRadius));
            } else {
                camera.position.lerp(camTarget, 0.035);
            }
            camera.lookAt(lookTarget);

            // 3. Process Custom Tweens (Opacity/Transforms)
            for (let i = TWEEN_TASKS.length - 1; i >= 0; i--) {
                const task = TWEEN_TASKS[i];
                if (task.delay > 0) {
                    task.delay -= 16.6; 
                    continue;
                }
                task.elapsed += 16.6;
                const progress = Math.min(task.elapsed / task.duration, 1);
                const ease = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
                task.obj[task.prop] = task.start + (task.target - task.start) * ease;

                if (progress >= 1) TWEEN_TASKS.splice(i, 1);
            }

            // 4. Physics & Momentum (Inertia after drag)
            if (!isDown && !navContext && !hoveredId) {
                // Automatic slow rotation when idle
                const rotSpeed = 0.0016 + activeShellRef.current * 0.0005;
                group.rotation.y += rotSpeed;
                group.rotation.x += 0.0002 + activeShellRef.current * 0.0001;
            }
            if (!isDown) {
                // Friction for drag momentum
                vel.x *= .93; vel.y *= .93;
                group.rotation.x += vel.x; group.rotation.y += vel.y;
            }

            // 5. Visual "Breathe" / Shimmer Effects
            if (!navContext && !hoveredId) {
                // Pulse pillars (shell 0) only if they are the active shell
                FILMS.forEach((f, i) => {
                    if (f.shell === 0 && activeShellRef.current === 0) {
                        glowMeshes[i].material.opacity = NCFG[0].glow * (1 + Math.sin(t * 2 + i * 1.4) * .35);
                    }
                });
            }
            if (navContext) {
                // Shimmer active connections
                edgesOf(navContext.current, EDGES).forEach(i => {
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
            mounted.current = false;
        };
    }, []);

    return (
        <div id="sphere-canvas-container" className="main-sphere-wrapper" style={{ overflow: 'hidden', height: '100%', width: '100%', position: 'absolute', top: 0, left: 0, background: 'radial-gradient(ellipse 80% 70% at 50% 50%, #faf7f2 0%, #f0ebe0 30%, #e4ddd0 55%, #d8cfc0 75%, #ccc2b0 100%)' }}>
            <canvas id="c" style={{ position: 'absolute', inset: 0, zIndex: 0 }} />

            <div id="labels" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }}>
                {files.map((f, i) => (
                    <div
                        key={f.id}
                        ref={(el) => { labelRefs.current[i] = el; }}
                        className={`node-label label-${['pillar', 'primary', 'secondary'][f.shell]}`}
                    >
                        <div
                            className="label-title"
                            id={`lt-${i}`}
                            ref={(el) => { titleRefs.current[i] = el; }}
                        >
                            {f.title}
                        </div>
                    </div>
                ))}
            </div>

            <div id="shell-flash" style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                background: 'radial-gradient(ellipse at center, rgba(248,244,238,0.65) 0%, transparent 65%)',
                opacity: 0, transition: 'opacity 0.5s ease', zIndex: 5
            }} />

            <header className="sphere-header" style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
                <div className="sh-left">
                    <div className="sh-logo">SFERA <em>SEMANTICA</em></div>
                    <div className="sh-hint">SCROLL · cambia shell</div>
                </div>
                <div className="hints">
                    TRASCINA · ruota &nbsp;·&nbsp; SCROLL · zoom<br />
                    CLICK · seleziona nodo<br />
                    ↑↓ · cambia livello &nbsp;·&nbsp; ←→ · stesso livello
                </div>
            </header>



            <div style={{ position: 'absolute', left: 28, top: '50%', transform: 'translateY(-50%)', zIndex: 10, display: 'flex', flexDirection: 'column', gap: 8, transformOrigin: 'left center' }}>
                <div style={{ transform: 'scale(0.82)', transformOrigin: 'left center' }}>
                    <ShellNavigator
                        activeShell={activeShell}
                        onShellChange={setActiveShell}
                        isAnimating={isAnimating}
                    />
                </div>
            </div>

            {/* Breadcrumb */}
            <div id="breadcrumb" style={{ position: 'absolute' }}></div>

            {/* Navigation */}
            <div id="nav-controls" style={{ position: 'absolute' }}>
                <button className="nav-btn" id="btn-up" disabled title="Esplora verso l'esterno">↑</button>
                <div className="nav-row">
                    <button className="nav-btn" id="btn-left" disabled title="Film precedente">←</button>
                    <button className="nav-btn" id="btn-down" disabled title="Torna verso il centro">↓</button>
                    <button className="nav-btn" id="btn-right" disabled title="Film successivo">→</button>
                </div>
                <div className="nav-counter" id="nav-counter"></div>
            </div>

            {/* Info Panel -> React State */}
            {selectedFilm && panelMinimized && (
                <div id="panel-dock" className="panel-dock-visible" style={{ position: 'absolute' }}>
                    <button className="dock-expand-btn" onClick={() => setPanelMinimized(false)}>↑</button>
                    <span className="dock-title">{selectedFilm.title}</span>
                    <div className="dock-actions">
                        {(['seen', 'liked', 'ignored'] as InteractionType[]).map((type) => {
                            const btnLabel = { seen: 'Visto', liked: 'Mi Piace', ignored: 'Ignora' }[type];
                            const isActive = nodeInteractions[selectedFilm.id] === type;
                            return (
                                <button
                                    key={type}
                                    className={`dock-feedback-btn ${isActive ? 'active' : ''}`}
                                    onClick={() => handleInteraction(selectedFilm.id, type)}
                                >
                                    {btnLabel}
                                </button>
                            );
                        })}
                    </div>
                    <button className="dock-close-btn" onClick={() => {
                        setPanelMinimized(false);
                        setSelectedFilm(null);
                        window.dispatchEvent(new Event('closeSpherePanel'));
                    }}>×</button>
                </div>
            )}

            {selectedFilm && (
                <div 
                    id="panel" 
                    className={panelVisible && !panelMinimized ? 'visible' : ''} 
                    style={{ position: 'absolute' }}
                >
                    {/* Full Card Poster Background */}
                    <img id="panel-poster-full"
                        src={selectedFilm.poster_url || '/placeholder.jpg'}
                        alt=""
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
                    />
                    
                    {/* Frosted Glass Content Overlay */}
                    <div className="panel-glass-content">
                        <button id="panel-minimize" onClick={() => setPanelMinimized(true)}>↓</button>
                        <button id="panel-close" onClick={() => { setPanelMinimized(false); setPanelVisible(false); setSelectedFilm(null); window.dispatchEvent(new Event('closeSpherePanel')); }}>×</button>
                        
                        <div className="pg-header">
                            <div className="p-badge-container">
                                <div className={`p-badge p-badge-${['pillar', 'primary', 'secondary'][selectedFilm.shell]}`}>
                                    {['Pilastro del gusto', 'Affinità diretta', 'Scoperta laterale'][selectedFilm.shell]}
                                </div>
                            </div>
                            <div className="poster-film-title" id="poster-title">{selectedFilm.title}</div>
                            <div className="poster-film-meta" id="poster-meta">
                                <span style={{ opacity: .7, fontFamily: 'Fragment Mono, monospace', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '10px' }}>{selectedFilm.dir}</span>
                                <span style={{ opacity: .4, margin: '0 8px' }}>|</span>
                                <span style={{ opacity: .6, fontFamily: 'Fragment Mono, monospace', letterSpacing: '1px' }}>{selectedFilm.year}</span>
                            </div>
                        </div>

                        <div className="pg-body">
                            <div className="p-section">Temi editoriali</div>
                            <div className="p-tags" id="p-tags">
                                {selectedFilm.tags.map((t: string) => <div key={t} className="p-tag">{t}</div>)}
                            </div>
                            
                            {selectedEdges.length > 0 && (
                                <>
                                    <div className="p-section">Connessioni editoriali</div>
                                    <div className="p-conns">
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
                            
                            {/* Actions */}
                            <div className="p-feedback-actions">
                                {[
                                    { type: 'seen' as InteractionType, label: 'Visto', title: 'L\'ho visto' },
                                    { type: 'liked' as InteractionType, label: 'Mi Piace', title: 'Mi è piaciuto' },
                                    { type: 'ignored' as InteractionType, label: 'Ignora', title: 'Non mi interessa' }
                                ].map((btn) => {
                                    const isActive = selectedFilm && nodeInteractions[selectedFilm.id] === btn.type;
                                    return (
                                        <button 
                                            key={btn.type}
                                            className={`feedback-btn ${isActive ? 'active' : ''}`}
                                            title={btn.title} 
                                            onClick={() => selectedFilm && handleInteraction(selectedFilm.id, btn.type)}
                                        >
                                            {btn.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
