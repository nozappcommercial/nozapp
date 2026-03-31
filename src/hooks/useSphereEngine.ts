"use client";
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { FilmNode, FilmEdge } from '../components/SemanticSphere';
import { ShellLevel } from '../components/sphere/ShellNavigator';
import { connectedTo, edgesOf, buildNavContext, NavContext } from '../lib/graph/traversal';
import { TweenTask, ExtendedMesh, ExtendedLine } from '@/types/three-extended';

interface UseSphereEngineProps {
    files: FilmNode[];
    edges: FilmEdge[];
    activeShell: ShellLevel;
    setActiveShell: (shell: ShellLevel) => void;
    setSelectedFilm: (film: FilmNode | null) => void;
    setSelectedEdges: (edges: any[]) => void;
    setPanelMinimized: (minimized: boolean) => void;
    setIsAnimating: (animating: boolean) => void;
    labelRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
    titleRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
}

export function useSphereEngine({
    files,
    edges,
    activeShell,
    setActiveShell,
    setSelectedFilm,
    setSelectedEdges,
    setPanelMinimized,
    setIsAnimating,
    labelRefs,
    titleRefs
}: UseSphereEngineProps) {
    const mounted = useRef(false);
    const sphereApi = useRef<{ setShell: (shell: number) => void } | null>(null);
    const activeShellRef = useRef<number>(activeShell);

    // Sync activeShellRef with prop
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
    }, [activeShell, setIsAnimating]);

    useEffect(() => {
        if (mounted.current) return;
        if (files.length === 0) return; 
        mounted.current = true;

        const FILMS = files;
        const EDGES = edges;

        const ECFG: Record<string, { from: number; to: number; base: number }> = {
            thematic: { from: 0x78272e, to: 0xb58c2a, base: .6 },
            stylistic: { from: 0xb58c2a, to: 0x3b8b9e, base: .5 },
            contrast: { from: 0x3b8b9e, to: 0x225560, base: .3 },
        };

        const NCFG = [
            { color: 0x78272e, size: .05, glow: .10 }, // shell 0
            { color: 0xb58c2a, size: .0075, glow: .02 }, // shell 1
            { color: 0x3b8b9e, size: .0037, glow: .01 }, // shell 2
        ];

        const targetCameraZ = { value: 2.2 }; 
        const camTarget = new THREE.Vector3(0, 0, 2.6);
        const lookTarget = new THREE.Vector3(0, 0, 0);
        const TWEEN_TASKS: TweenTask[] = []; 
        
        let navContext: any = null; 
        let hoveredId: number | null = null; 
        let isDown = false; 
        let isDragging = false; 
        let lastXY = { x: 0, y: 0 }; 
        let vel = { x: 0, y: 0 }; 
        
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        function addTween(obj: any, prop: string, target: number, duration: number, delay = 0) {
            TWEEN_TASKS.push({
                obj, prop, start: obj[prop], target,
                duration, delay, elapsed: 0
            });
        }

        sphereApi.current = {
            setShell: (shell: number) => {
                const zTargets: Record<number, number> = { 0: 2.2, 1: 4.2, 2: 6.5 };
                targetCameraZ.value = zTargets[shell];

                FILMS.forEach((f, i) => {
                    const isCurrentShell = f.shell === shell;
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

                    let targetScale = 1;
                    if (shell === 0) {
                        targetScale = 1;
                    } else if (shell === 1) {
                        if (f.shell === 1) targetScale = 5.0; // Ingrandisci Affinità
                        else if (f.shell === 0) targetScale = 0.3; // Rimpicciolisci Pilastri
                    } else if (shell === 2) {
                        if (f.shell === 2) targetScale = 10.0; // Ingrandisci Scoperta
                        else if (f.shell === 1) targetScale = 2.0; // Affinità media
                        else if (f.shell === 0) targetScale = 0.15; // Pilastri piccolissimi
                    }

                    if (shouldShow) {
                        const baseDelay = isCurrentShell ? f.shell * 300 : 0;
                        const individualDelay = isCurrentShell ? i * 5 : 0;
                        const delay = baseDelay + individualDelay;
                        
                        const finalGlow = isCurrentShell ? targetOp : 0;
                        const finalBase = isCurrentShell ? targetBaseOp : 0.15;

                        addTween(glowMeshes[i].material as THREE.MeshBasicMaterial, 'opacity', finalGlow, 600, delay);
                        addTween(nodeMeshes[i].material as THREE.MeshBasicMaterial, 'opacity', finalBase, 600, delay);
                        
                        addTween(nodeMeshes[i].scale, 'x', targetScale, 600, delay);
                        addTween(nodeMeshes[i].scale, 'y', targetScale, 600, delay);
                        addTween(nodeMeshes[i].scale, 'z', targetScale, 600, delay);
                        addTween(glowMeshes[i].scale, 'x', targetScale, 600, delay);
                        addTween(glowMeshes[i].scale, 'y', targetScale, 600, delay);
                        addTween(glowMeshes[i].scale, 'z', targetScale, 600, delay);
                    } else {
                        addTween(glowMeshes[i].material as THREE.MeshBasicMaterial, 'opacity', 0, 400, 0);
                        addTween(nodeMeshes[i].material as THREE.MeshBasicMaterial, 'opacity', 0, 400, 0);
                    }
                });

                edgeLines.forEach((l, i) => {
                    const e = EDGES[i];
                    const v1 = FILMS[e.from].shell <= shell;
                    const v2 = FILMS[e.to].shell <= shell;
                    const targetBase = (v1 && v2) ? ECFG[e.type].base * 0.8 : 0;
                    addTween(l.material, 'opacity', targetBase, 500, 0);
                });
            }
        };

        const canvas = document.getElementById('c') as HTMLCanvasElement | null;
        if (!canvas) return;

        const W = () => window.innerWidth, H = () => window.innerHeight;
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
        renderer.setSize(W(), H());
        renderer.setClearColor(0x000000, 0);
        
        canvas.style.touchAction = 'none';
        canvas.style.userSelect = 'none';
        (canvas.style as any).webkitUserSelect = 'none';
        (canvas.style as any).webkitTouchCallout = 'none';

        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0xc8b89a, .004);
        const camera = new THREE.PerspectiveCamera(48, W() / H(), .1, 500);
        camera.position.set(0, 0, 2.6);

        const RADII = [1.1, 2.6, 5.6];
        const SHELL_DISTANCES = [3.4, 7.5, 14.0];

        const group = new THREE.Group();
        scene.add(group);

        function fibPos(idx: number, total: number, R: number) {
            const phi = Math.PI * (3 - Math.sqrt(5));
            const y = 1 - (idx / Math.max(total - 1, 1)) * 2;
            const r = Math.sqrt(Math.max(0, 1 - y * y));
            const th = phi * idx;
            return new THREE.Vector3(Math.cos(th) * r * R, y * R, Math.sin(th) * r * R);
        }
        const byShell: FilmNode[][] = [[], [], []];
        FILMS.forEach((f, index) => {
            (f as any)._index = index;
            byShell[f.shell].push(f)
        });
        const positions: THREE.Vector3[] = new Array(FILMS.length);
        byShell.forEach((films, s) => films.forEach((f: any, i) => {
            if (f._index !== undefined) {
                positions[f._index] = fibPos(i, films.length, RADII[s]);
            }
        }));

        const nodeMeshes: ExtendedMesh[] = [], glowMeshes: ExtendedMesh[] = [];
        FILMS.forEach((f: any, index) => {
            const cfg = NCFG[f?.shell] || NCFG[2]; 
            const pos = positions[index] || new THREE.Vector3(0, 0, 0);
            const initVisible = f.shell === 0;
            
            const core = new THREE.Mesh(
                new THREE.SphereGeometry(cfg.size, 20, 14),
                new THREE.MeshBasicMaterial({ color: cfg.color, transparent: true, opacity: initVisible ? 1 : 0 })
            ) as ExtendedMesh;
            core.position.copy(pos);
            core.userData.index = index;
            group.add(core); nodeMeshes.push(core);

            const gl = new THREE.Mesh(
                new THREE.SphereGeometry(cfg.size * 3.5, 16, 12),
                new THREE.MeshBasicMaterial({ color: cfg.color, transparent: true, opacity: initVisible ? cfg.glow : 0, blending: THREE.NormalBlending })
            ) as ExtendedMesh;
            gl.position.copy(pos);
            gl.userData.index = index; 
            group.add(gl); glowMeshes.push(gl);
        });

        const edgeLines: ExtendedLine[] = [];
        function buildEdge(a: THREE.Vector3, b: THREE.Vector3, cfg: { from: number; to: number; base: number }) {
            const mid = a.clone().add(b).multiplyScalar(.5);
            mid.add(mid.clone().normalize().multiplyScalar(a.distanceTo(b) * .3));
            const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
            const pts = curve.getPoints(50);
            
            const pos3: number[] = [], cols: number[] = [];
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
            })) as ExtendedLine;
        }
        EDGES.forEach((e, i) => {
            const l = buildEdge(positions[e.from], positions[e.to], ECFG[e.type]);
            l.userData.edgeIdx = i; group.add(l); edgeLines.push(l);
        });

        function updateLabels(hov: number | null, sel: number | null) {
            const tmp = new THREE.Vector3();
            const currentShell = activeShellRef.current;
            
            FILMS.forEach((f, index) => {
                const el = labelRefs.current[index];
                const lt = titleRefs.current[index];
                if (!el || !lt) return;
                
                const isCurrentShell = f.shell === currentShell;
                if (!isCurrentShell && f.id !== sel) {
                    if (el.style.opacity !== "0") el.style.opacity = "0";
                    return;
                }

                const p = positions[index].clone().applyEuler(group.rotation);
                tmp.copy(p).project(camera);
                
                const behind = tmp.z > 1;
                if (behind) {
                    if (el.style.opacity !== "0") el.style.opacity = "0";
                    return;
                }

                const screenX = (tmp.x * .5 + .5) * W();
                const screenY = (-.5 * tmp.y + .5) * H();
                
                const isOverHeader = screenY < 120;
                if (isOverHeader && f.id !== sel) {
                    if (el.style.opacity !== "0") el.style.opacity = "0";
                    return;
                }

                el.style.left = screenX + 'px';
                el.style.top = screenY + 'px';

                const currentScale = nodeMeshes[index].scale.y;
                const offset = (NCFG[f.shell].size * currentScale * 100) + 8;
                el.style.transform = `translate(-50%,calc(-50% - ${offset}px))`;

                let op = 0;
                if (sel !== null) {
                    const active = navContext && navContext.visible.has(f.id);
                    if (index === sel || f.id === sel) {
                        op = 1;
                    } else {
                        op = active ? 0.75 : 0;
                    }
                } else if (hov !== null) {
                    op = (f.id === hov) ? 1 : (connectedTo(hov, EDGES).has(f.id) ? 0.7 : 0.05);
                } else {
                    op = .22;
                }
                
                el.style.opacity = op.toString();
                if (f.id === sel) lt.classList.add('active');
                else lt.classList.remove('active');
            });
        }

        function applyNavContext(ctx: NavContext) {
            navContext = ctx;
            const { current, visible } = ctx;

            FILMS.forEach((f, i) => {
                const nodeMat = nodeMeshes[i].material as THREE.MeshBasicMaterial;
                const glowMat = glowMeshes[i].material as THREE.MeshBasicMaterial;

                if (visible.has(i)) {
                    nodeMat.color.setHex(NCFG[f.shell].color);
                    nodeMat.opacity = 1;
                    glowMat.opacity = NCFG[f.shell].glow;
                } else {
                    nodeMat.color.setHex(0xe0ddd5);
                    nodeMat.opacity = 0.15;
                    glowMat.opacity = .008;
                }
            });
            
            edgeLines.forEach((l, i) => {
                const e = EDGES[i];
                const bothVis = visible.has(e.from) && visible.has(e.to);
                const isActive = (e.from === current || e.to === current);
                const baseOpacity = ECFG[e.type].base;
                l.material.opacity = isActive ? baseOpacity * 2.8 : bothVis ? baseOpacity * .8 : .01;
            });

            const cfg = NCFG[FILMS[current].shell];
            const c = new THREE.Color(cfg.color);
            (nodeMeshes[current].material as THREE.MeshBasicMaterial).color.copy(c.clone().multiplyScalar(0.7));
            (glowMeshes[current].material as THREE.MeshBasicMaterial).opacity = .45;

            updateNavButtons(ctx);
            updateBreadcrumb(ctx);
            showPanel(current);
        }

        function updateNavButtons(ctx: NavContext) {
            const { siblings, siblingIndex, parent, children } = ctx;
            const nc = document.getElementById('nav-controls');
            if (nc) nc.classList.add('visible');

            const btnUp = document.getElementById('btn-up') as HTMLButtonElement | null;
            const btnDown = document.getElementById('btn-down') as HTMLButtonElement | null;
            const btnLeft = document.getElementById('btn-left') as HTMLButtonElement | null;
            const btnRight = document.getElementById('btn-right') as HTMLButtonElement | null;

            if (btnUp) btnUp.disabled = children.length === 0;
            if (btnDown) btnDown.disabled = parent === null;
            if (btnLeft) btnLeft.disabled = siblings.length <= 1;
            if (btnRight) btnRight.disabled = siblings.length <= 1;

            const ctr = document.getElementById('nav-counter');
            if (ctr) {
                if (siblings.length > 1) {
                    ctr.textContent = `${siblingIndex + 1} / ${siblings.length}`;
                } else { ctr.textContent = ''; }
            }
        }

        const handleUp = () => {
            if (!navContext || !navContext.children || navContext.children.length === 0) return;
            const { current, children, stack } = navContext;
            const newStack = [...stack, { parent: navContext.parent, siblings: navContext.siblings, siblingIndex: navContext.siblingIndex }];
            const firstChild = children[0];
            if (firstChild === undefined) return;

            const firstShell = FILMS[firstChild].shell;
            const sameLevelSibs = children.filter((idx: number) => FILMS[idx].shell === firstShell);
            animatePanel('up', () => applyNavContext(buildNavContext(firstChild, current, sameLevelSibs, 0, newStack, FILMS, EDGES)));
        };

        const handleDown = () => {
            if (!navContext || navContext.parent === null) return;
            const { parent, stack } = navContext;
            const prev = stack.length ? stack[stack.length - 1] : null;
            const newStack = stack.slice(0, -1);
            animatePanel('down', () => applyNavContext(buildNavContext(parent, prev ? prev.parent : null, prev ? prev.siblings : null, prev ? prev.siblingIndex : 0, newStack, FILMS, EDGES)));
        };

        const handleLeft = () => {
            if (!navContext) return;
            const { siblings, siblingIndex, parent, stack } = navContext;
            const newIdx = (siblingIndex - 1 + siblings.length) % siblings.length;
            const newId = siblings[newIdx];
            animatePanel('left', () => applyNavContext(buildNavContext(newId, parent, siblings, newIdx, stack, FILMS, EDGES)));
        };

        const handleRight = () => {
            if (!navContext) return;
            const { siblings, siblingIndex, parent, stack } = navContext;
            const newIdx = (siblingIndex + 1) % siblings.length;
            const newId = siblings[newIdx];
            animatePanel('right', () => applyNavContext(buildNavContext(newId, parent, siblings, newIdx, stack, FILMS, EDGES)));
        };

        document.getElementById('btn-up')?.addEventListener('click', handleUp);
        document.getElementById('btn-down')?.addEventListener('click', handleDown);
        document.getElementById('btn-left')?.addEventListener('click', handleLeft);
        document.getElementById('btn-right')?.addEventListener('click', handleRight);

        function updateBreadcrumb(ctx: NavContext) {
            const bc = document.getElementById('breadcrumb');
            if (!bc) return;
            const { stack, current } = ctx;
            if (stack.length === 0) {
                bc.classList.remove('visible');
                return;
            }
             bc.classList.add('visible');
            const shellNames = ['Pilastri', 'Affinità', 'Scoperta'];
            const currentShell = FILMS[current].shell;
            let html = '';
            for (let i = 0; i < currentShell; i++) {
                html += `<span class="bc-item">${shellNames[i]}</span><span class="bc-sep">›</span>`;
            }
            html += `<span class="bc-current">${shellNames[currentShell]}</span>`;
            bc.innerHTML = html;
        }

        function animatePanel(dir: 'left' | 'right' | 'up' | 'down', callback: () => void) {
            const panel = document.getElementById('panel');
            if (!panel) return;
            if (panel.classList.contains('minimized')) {
                callback();
                return;
            }

            const exitMap: Record<string, string> = {
                left:  'translate(-50%, -50%) translateX(calc(-1 * var(--panel-slide-x)))',
                right: 'translate(-50%, -50%) translateX(var(--panel-slide-x))',
                up:    'translate(-50%, -50%) translateY(calc(-1 * var(--panel-slide-y)))',
                down:  'translate(-50%, -50%) translateY(var(--panel-slide-y))'
            };
            const enterMap: Record<string, string> = {
                left:  'translate(-50%, -50%) translateX(var(--panel-slide-x))',
                right: 'translate(-50%, -50%) translateX(calc(-1 * var(--panel-slide-x)))',
                up:    'translate(-50%, -50%) translateY(var(--panel-slide-y))',
                down:  'translate(-50%, -50%) translateY(calc(-1 * var(--panel-slide-y)))'
            };

            panel.style.transition = 'opacity 0.2s ease, transform 0.2s cubic-bezier(0.2, 0, 0.2, 1)';
            panel.style.opacity = '0';
            panel.style.transform = exitMap[dir];
            
            setTimeout(() => {
                callback(); 
                panel.style.transition = 'none';
                panel.style.opacity = '0';
                panel.style.transform = enterMap[dir];
                
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        panel.style.transition = 'opacity 0.3s ease, transform 0.35s cubic-bezier(0.2, 0, 0.2, 1)';
                        panel.style.opacity = '1';
                        panel.style.transform = ''; 
                    });
                });
            }, 200);
        }

        function showPanel(nodeIndex: number) {
            const film = FILMS[nodeIndex];
            const connEdges = EDGES.filter(e => e.from === nodeIndex || e.to === nodeIndex);
            const edgeData = connEdges.map(e => {
                const oid = e.from === nodeIndex ? e.to : e.from;
                return { id: e.from + '-' + e.to, type: e.type, film: FILMS[oid] };
            });
            setSelectedFilm(film);
            setSelectedEdges(edgeData);

            const headerVertical = document.querySelector('header[class*="headerVertical"]');
            if (headerVertical) {
                headerVertical.classList.add('header-hidden-right');
            }
        }

        function closePanel() {
            setPanelMinimized(false);
            setSelectedFilm(null);
            document.getElementById('nav-controls')?.classList.remove('visible');
            document.getElementById('breadcrumb')?.classList.remove('visible');
            navContext = null;
            
            const headerVertical = document.querySelector('header[class*="headerVertical"]');
            if (headerVertical) {
                headerVertical.classList.remove('header-hidden-right');
            }

            FILMS.forEach((f, i) => {
                const nodeMat = nodeMeshes[i].material as THREE.MeshBasicMaterial;
                const glowMat = glowMeshes[i].material as THREE.MeshBasicMaterial;
                nodeMat.color.setHex(NCFG[f.shell].color);
                glowMat.opacity = NCFG[f.shell].glow;
            });
            edgeLines.forEach((l, i) => { l.material.opacity = ECFG[EDGES[i].type].base; });
        }

        window.addEventListener('closeSpherePanel', closePanel);

        function getHit(x: number, y: number) {
            mouse.x = (x / W()) * 2 - 1; mouse.y = -(y / H()) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            const hits = raycaster.intersectObjects([...nodeMeshes, ...glowMeshes]);
            const visibleHit = hits.find(h => ((h.object as THREE.Mesh).material as THREE.Material).opacity > 0);
            return visibleHit ? visibleHit.object.userData.index as number : null;
        }

        const handleMouseDown = (e: MouseEvent) => {
            if ((e.target as HTMLElement).tagName !== 'CANVAS') return;
            isDown = true; isDragging = false;
            lastXY = { x: e.clientX, y: e.clientY }; vel = { x: 0, y: 0 };
            document.body.classList.add('dragging');
        };

        const handleMouseUp = (e: MouseEvent) => {
            isDown = false;
            document.body.classList.remove('dragging');
            if (!isDragging) {
                const hit = getHit(e.clientX, e.clientY);
                if (hit !== null) {
                    hoveredId = null;
                    if (navContext && navContext.visible.has(hit) && hit !== navContext.current) {
                        if (navContext.children.includes(hit)) {
                            const { current, children, stack } = navContext;
                            const newStack = [...stack, { parent: navContext.parent, siblings: navContext.siblings, siblingIndex: navContext.siblingIndex }];
                            const hitShell = FILMS[hit].shell;
                            const sameLevelSibs = children.filter((id: number) => FILMS[id].shell === hitShell);
                            animatePanel('up', () => applyNavContext(buildNavContext(hit, current, sameLevelSibs, sameLevelSibs.indexOf(hit), newStack, FILMS, EDGES)));
                        } else if (navContext.siblings.includes(hit)) {
                            const { siblings, parent, stack } = navContext;
                            const newIdx = siblings.indexOf(hit);
                            const dir = newIdx > navContext.siblingIndex ? 'right' : 'left';
                            animatePanel(dir, () => applyNavContext(buildNavContext(hit, parent, siblings, newIdx, stack, FILMS, EDGES)));
                        } else if (hit === navContext.parent) {
                            (document.getElementById('btn-down') as HTMLButtonElement | null)?.click();
                        }
                    } else {
                        const film = FILMS[hit];
                        const sibs = FILMS
                            .map((f, i) => f.shell === film.shell ? i : -1)
                            .filter((idx: number) => idx !== -1);

                        applyNavContext(buildNavContext(hit, null, sibs, sibs.indexOf(hit), [], FILMS, EDGES));
                    }
                } else {
                    if ((e.target as HTMLElement).tagName === 'CANVAS' && navContext) closePanel();
                }
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            hoveredId = getHit(e.clientX, e.clientY);
            if (isDown) {
                isDragging = true;
                const dx = e.clientX - lastXY.x;
                const dy = e.clientY - lastXY.y;
                group.rotation.y += dx * 0.005;
                group.rotation.x += dy * 0.005;
                vel = { x: dy * 0.002, y: dx * 0.002 };
                lastXY = { x: e.clientX, y: e.clientY };
            }
        };

        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mousemove', handleMouseMove);

        let initialPinchDistance: number | null = null;
        let scrollLocked = false;
        
        const handleTouchStart = (e: TouchEvent) => {
            if ((e.target as HTMLElement).tagName === 'CANVAS') {
                e.preventDefault();
                if (e.touches.length === 1) {
                    const t = e.touches[0];
                    isDown = true; isDragging = false;
                    lastXY = { x: t.clientX, y: t.clientY }; vel = { x: 0, y: 0 };
                }
            }
            if (e.touches.length === 2) {
                const t1 = e.touches[0];
                const t2 = e.touches[1];
                initialPinchDistance = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
            }
        };

        const handleTouchEnd = (e: TouchEvent) => {
            if (e.touches.length < 2) initialPinchDistance = null;
            if (e.touches.length === 0) {
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
                                const sameLevelSibs = children.filter((id: number) => FILMS[id].shell === hitShell);
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
                            const sibs = FILMS.map((f, i) => f.shell === film.shell ? i : -1).filter((id: number) => id !== -1);
                            applyNavContext(buildNavContext(hit, null, sibs, sibs.indexOf(hit), [], FILMS, EDGES));
                        }
                    } else if (navContext) {
                        if ((e.target as HTMLElement).tagName === 'CANVAS') {
                            closePanel();
                        }
                    }
                }
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if ((e.target as HTMLElement).tagName === 'CANVAS') {
                e.preventDefault();
            }
            if (e.touches.length === 2) {
                const t1 = e.touches[0];
                const t2 = e.touches[1];
                const currentDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
                if (initialPinchDistance !== null && !navContext && !scrollLocked) {
                    const delta = currentDist - initialPinchDistance;
                    if (Math.abs(delta) > 40) { 
                        if (delta > 0 && activeShellRef.current > 0) {
                            activeShellRef.current -= 1; 
                            setActiveShell(activeShellRef.current as ShellLevel);
                            scrollLocked = true;
                            setTimeout(() => { scrollLocked = false; }, 800);
                        } else if (delta < 0 && activeShellRef.current < 2) {
                            activeShellRef.current += 1; 
                            setActiveShell(activeShellRef.current as ShellLevel);
                            scrollLocked = true;
                            setTimeout(() => { scrollLocked = false; }, 800);
                        }
                        initialPinchDistance = currentDist;
                    }
                }
            } else if (isDown && e.touches.length === 1) {
                const t = e.touches[0];
                const dx = t.clientX - lastXY.x;
                const dy = t.clientY - lastXY.y;
                if (Math.abs(dx) > 2 || Math.abs(dy) > 2) isDragging = true;
                group.rotation.y += dx * 0.006;
                group.rotation.x += dy * 0.006;
                vel = { x: dy * 0.002, y: dx * 0.002 };
                lastXY = { x: t.clientX, y: t.clientY };
            }
        };

        window.addEventListener('touchstart', handleTouchStart, { passive: false });
        window.addEventListener('touchend', handleTouchEnd);
        window.addEventListener('touchmove', handleTouchMove, { passive: false });

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') { closePanel(); return; }
            if (!navContext) {
                if (e.key === 'ArrowDown' && activeShellRef.current < 2) {
                    e.preventDefault();
                    activeShellRef.current += 1;
                    setActiveShell(activeShellRef.current as ShellLevel);
                }
                if (e.key === 'ArrowUp' && activeShellRef.current > 0) {
                    e.preventDefault();
                    activeShellRef.current -= 1;
                    setActiveShell(activeShellRef.current as ShellLevel);
                }
                return;
            }
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
            if (e.key === 'ArrowUp') document.getElementById('btn-up')?.click();
            if (e.key === 'ArrowDown') document.getElementById('btn-down')?.click();
            if (e.key === 'ArrowLeft') document.getElementById('btn-left')?.click();
            if (e.key === 'ArrowRight') document.getElementById('btn-right')?.click();
        };

        window.addEventListener('keydown', handleKeyDown);

        let t = 0;
        function animate() {
            requestAnimationFrame(animate);
            t += .01;

            if (navContext && navContext.current !== null) {
                const idx = navContext.current;
                const worldPos = new THREE.Vector3();
                nodeMeshes[idx].getWorldPosition(worldPos);
                const dir = worldPos.clone().normalize();
                const orbitRadii = [3.4, 7.5, 14.0];
                const orbitRadius = orbitRadii[FILMS[idx].shell] + 0.8;
                camTarget.copy(dir).multiplyScalar(orbitRadius);
                lookTarget.lerp(worldPos, 0.06);
            } else {
                camTarget.set(0, 0, SHELL_DISTANCES[activeShellRef.current]);
                lookTarget.set(0, 0, 0);
            }

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

            if (!isDown && !navContext && !hoveredId) {
                const rotSpeed = 0.0016 + activeShellRef.current * 0.0005;
                group.rotation.y += rotSpeed;
                group.rotation.x += 0.0002 + activeShellRef.current * 0.0001;
            }
            if (!isDown) {
                vel.x *= .93; vel.y *= .93;
                group.rotation.x += vel.x; group.rotation.y += vel.y;
            }

            if (!navContext && !hoveredId) {
                FILMS.forEach((f, i) => {
                    if (f.shell === 0 && activeShellRef.current === 0) {
                        (glowMeshes[i].material as THREE.MeshBasicMaterial).opacity = NCFG[0].glow * (1 + Math.sin(t * 2 + i * 1.4) * .35);
                    }
                });
            }
            if (navContext) {
                edgesOf(navContext.current, EDGES).forEach(i => {
                    const base = ECFG[EDGES[i].type].base;
                    (edgeLines[i].material as THREE.LineBasicMaterial).opacity = base * (2.6 + Math.sin(t * 4 + i) * .35);
                });
            }

            updateLabels(hoveredId, navContext ? navContext.current : null);
            renderer.render(scene, camera);
        }
        animate();

        const handleResize = () => {
            camera.aspect = W() / H(); camera.updateProjectionMatrix();
            renderer.setSize(W(), H());
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchend', handleTouchEnd);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('closeSpherePanel', closePanel);
            
            document.getElementById('btn-up')?.removeEventListener('click', handleUp);
            document.getElementById('btn-down')?.removeEventListener('click', handleDown);
            document.getElementById('btn-left')?.removeEventListener('click', handleLeft);
            document.getElementById('btn-right')?.removeEventListener('click', handleRight);

            // Correct Three.js Disposal
            nodeMeshes.forEach(m => {
                m.geometry.dispose();
                innerDisposeMaterial(m.material);
                group.remove(m);
            });
            glowMeshes.forEach(m => {
                m.geometry.dispose();
                innerDisposeMaterial(m.material);
                group.remove(m);
            });
            edgeLines.forEach(l => {
                l.geometry.dispose();
                innerDisposeMaterial(l.material);
                group.remove(l);
            });

            renderer.dispose();
            scene.clear();
            
            mounted.current = false;
        };

        function innerDisposeMaterial(mat: THREE.Material | THREE.Material[]) {
            if (Array.isArray(mat)) {
                mat.forEach(m => m.dispose());
            } else {
                mat.dispose();
            }
        }
    }, [files, edges]); // Re-init engine if data changes to ensure stability
}
