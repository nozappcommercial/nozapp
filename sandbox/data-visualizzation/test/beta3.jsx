import { useState, useEffect, useRef } from "react";
import * as THREE from "three";

const SHELL_RADIUS = [14, 66, 132];
const NODE_SIZE = [5.2, 3.0, 1.7];
const NODE_COLOR = ["#C0392B", "#C8952A", "#8A8A8A"];
const EDGE_COLOR = { thematic: "#C8952A", stylistic: "#5A7F9E", contrast: "#8B5E8B" };

const FILMS = [
    {
        id: "1", title: "DUNE", director: "Denis Villeneuve", year: 2021, shell: 0,
        themes: ["Destino e profezia", "Epica spaziale", "Potere politico"],
        synopsis: "Un giovane nobile si trova catapultato in un conflitto intergalattico per il controllo del pianeta più prezioso dell'universo."
    },
    {
        id: "2", title: "FIGHT CLUB", director: "David Fincher", year: 1999, shell: 0,
        themes: ["Crisi d'identità", "Critica al consumismo", "Mascolinità tossica"],
        synopsis: "Un impiegato insoddisfatto forma un club di lotta clandestino con un carismatico venditore di sapone."
    },
    {
        id: "3", title: "PARASITE", director: "Bong Joon-ho", year: 2019, shell: 0,
        themes: ["Lotta di classe", "Inganno", "Disuguaglianza"],
        synopsis: "Una famiglia povera si infiltra nella vita di una ricca famiglia di Seoul con conseguenze imprevedibili."
    },
    {
        id: "4", title: "BLADE RUNNER 2049", director: "Denis Villeneuve", year: 2017, shell: 1,
        themes: ["Identità artificiale", "Memoria", "Distopia"],
        synopsis: "Un nuovo replicante scopre un segreto sepolto che minaccia di sprofondare la società nel caos."
    },
    {
        id: "5", title: "THE LIGHTHOUSE", director: "Robert Eggers", year: 2019, shell: 1,
        themes: ["Isolamento", "Follia", "Potere e dominazione"],
        synopsis: "Due guardiani del faro vengono intrappolati su un'isola remota dalla tempesta e dalla follia."
    },
    {
        id: "6", title: "SNOWPIERCER", director: "Bong Joon-ho", year: 2013, shell: 1,
        themes: ["Rivoluzione", "Guerra di classe", "Sopravvivenza"],
        synopsis: "I sopravvissuti dell'apocalisse climatica vivono su un treno eterno divisi per classe sociale."
    },
    {
        id: "7", title: "MIDSOMMAR", director: "Ari Aster", year: 2019, shell: 1,
        themes: ["Lutto", "Rituale", "Comunità e appartenenza"],
        synopsis: "Una giovane coppia partecipa a un festival estivo svedese che nasconde oscuri segreti pagani."
    },
    {
        id: "8", title: "ARRIVAL", director: "Denis Villeneuve", year: 2016, shell: 1,
        themes: ["Linguaggio", "Tempo non lineare", "Perdita"],
        synopsis: "Una linguista viene reclutata per comunicare con alieni che hanno fatto visita alla Terra."
    },
    {
        id: "9", title: "OLDBOY", director: "Park Chan-wook", year: 2003, shell: 1,
        themes: ["Vendetta", "Memoria e trauma", "Destino"],
        synopsis: "Un uomo viene imprigionato per quindici anni senza spiegazione e poi improvvisamente rilasciato."
    },
    {
        id: "10", title: "HEREDITARY", director: "Ari Aster", year: 2018, shell: 1,
        themes: ["Trauma familiare", "Lutto", "Horror psicologico"],
        synopsis: "Dopo la morte della sua anziana madre, una famiglia scopre oscuri segreti genealogici."
    },
    {
        id: "11", title: "AMERICAN PSYCHO", director: "Mary Harron", year: 2000, shell: 1,
        themes: ["Consumismo", "Vacuità dell'élite", "Violenza"],
        synopsis: "Un banchiere di Wall Street mantiene una doppia vita come serial killer."
    },
    {
        id: "12", title: "ANNIHILATION", director: "Alex Garland", year: 2018, shell: 2,
        themes: ["Auto-distruzione", "Identità fluida", "L'ignoto"],
        synopsis: "Una biologa guida una spedizione in una zona misteriosa dove le leggi della natura non si applicano."
    },
    {
        id: "13", title: "THE WITCH", director: "Robert Eggers", year: 2015, shell: 2,
        themes: ["Puritanesimo", "Isolamento", "Il male ancestrale"],
        synopsis: "Una famiglia puritana nel 1630 affronta una forza malvagia che emerge dal bosco."
    },
    {
        id: "14", title: "BURNING", director: "Lee Chang-dong", year: 2018, shell: 2,
        themes: ["Ossessione", "Ambiguità morale", "Lotta di classe"],
        synopsis: "Un giovane diventa ossessionato da un misterioso uomo ricco che dice di bruciare serre."
    },
    {
        id: "15", title: "EX MACHINA", director: "Alex Garland", year: 2014, shell: 2,
        themes: ["Intelligenza artificiale", "Manipolazione", "Coscienza"],
        synopsis: "Un programmatore viene invitato a somministrare il test di Turing a una IA femminile."
    },
    {
        id: "16", title: "CACHÉ", director: "Michael Haneke", year: 2005, shell: 2,
        themes: ["Sorveglianza", "Colpa borghese", "Memoria rimossa"],
        synopsis: "Una famiglia borghese parigina riceve video sorveglianza anonimi della propria casa."
    },
    {
        id: "17", title: "ENEMY", director: "Denis Villeneuve", year: 2013, shell: 2,
        themes: ["Dualità", "Identità frammentata", "Controllo"],
        synopsis: "Un professore scopre di avere un sosia identico che vive una vita completamente diversa."
    },
    {
        id: "18", title: "THE HANDMAIDEN", director: "Park Chan-wook", year: 2016, shell: 2,
        themes: ["Inganno reciproco", "Desiderio", "Liberazione"],
        synopsis: "Una truffatrice viene assunta come cameriera per aiutare un impostore a sedurre un'ereditiera giapponese."
    },
];

const EDGES = [
    { from: "1", to: "4", type: "stylistic", label: "Villeneuve: epica visiva e spaziale" },
    { from: "1", to: "8", type: "thematic", label: "Destino e profezia come motori narrativi" },
    { from: "1", to: "17", type: "stylistic", label: "Villeneuve: identità frammentata" },
    { from: "1", to: "12", type: "thematic", label: "L'ignoto come forza trasformativa" },
    { from: "2", to: "11", type: "thematic", label: "Critica al consumismo e all'élite" },
    { from: "2", to: "5", type: "contrast", label: "Isolamento interiore vs. fisico" },
    { from: "2", to: "16", type: "thematic", label: "La violenza come rivelazione del sé" },
    { from: "3", to: "6", type: "thematic", label: "La guerra di classe come thriller" },
    { from: "3", to: "9", type: "stylistic", label: "Cinema coreano: tensione silenziosa" },
    { from: "3", to: "14", type: "thematic", label: "Ambiguità morale nella lotta di classe" },
    { from: "3", to: "18", type: "stylistic", label: "Park Chan-wook: inganno e rivincita" },
    { from: "4", to: "15", type: "thematic", label: "Coscienza artificiale e umanità" },
    { from: "4", to: "8", type: "stylistic", label: "Villeneuve: solitudine e grandiosità" },
    { from: "5", to: "13", type: "stylistic", label: "Eggers: folklore e terrore cosmico" },
    { from: "7", to: "10", type: "stylistic", label: "Aster: il dolore come porta verso l'orrore" },
    { from: "9", to: "18", type: "stylistic", label: "Park Chan-wook: vendetta come tragedia" },
    { from: "12", to: "15", type: "stylistic", label: "Garland: scienza e dissoluzione del sé" },
    { from: "14", to: "16", type: "thematic", label: "Sorveglianza e colpa borghese" },
    { from: "6", to: "14", type: "thematic", label: "Classi sociali e ambiguità morale" },
    { from: "10", to: "13", type: "thematic", label: "Eredità familiare e oscurità" },
    { from: "17", to: "12", type: "thematic", label: "Identità che si decompone" },
    { from: "8", to: "12", type: "contrast", label: "L'ignoto salva vs. l'ignoto dissolve" },
];

function fibonacciPoints(count, radius) {
    if (count === 1) return [new THREE.Vector3(0, radius * 0.5, 0)];
    const pts = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
        const y = 1 - (i / (count - 1)) * 2;
        const r = Math.sqrt(Math.max(0, 1 - y * y));
        const theta = golden * i;
        pts.push(new THREE.Vector3(Math.cos(theta) * r * radius, y * radius, Math.sin(theta) * r * radius));
    }
    return pts;
}

function lerp(a, b, t) { return a + (b - a) * t; }

export default function SemanticSphere() {
    const mountRef = useRef(null);
    const overlayRef = useRef(null);
    const ctrlRef = useRef(null);

    const [selectedFilm, setSelectedFilm] = useState(null);
    const [panelOpen, setPanelOpen] = useState(false);
    const [shellLevel, setShellLevel] = useState(0);

    useEffect(() => {
        const el = mountRef.current;
        const overlay = overlayRef.current;
        const W = el.clientWidth, H = el.clientHeight;

        /* ── Scene ── */
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(58, W / H, 0.1, 2000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(W, H);
        el.appendChild(renderer.domElement);

        /* ── Lights ── */
        scene.add(new THREE.AmbientLight(0xfaf5ee, 0.75));
        const sun = new THREE.DirectionalLight(0xffffff, 0.95);
        sun.position.set(70, 90, 50);
        scene.add(sun);
        const fill = new THREE.DirectionalLight(0xffeedd, 0.35);
        fill.position.set(-50, -30, -40);
        scene.add(fill);

        /* ── Positions ── */
        const byShell = [[], [], []];
        FILMS.forEach(f => byShell[f.shell].push(f));
        const filmPos = new Map();
        byShell.forEach((films, sh) => {
            const pts = fibonacciPoints(films.length, SHELL_RADIUS[sh]);
            films.forEach((f, i) => filmPos.set(f.id, pts[i].clone()));
        });

        /* ── Nodes ── */
        const nodeMap = new Map();
        const allMeshes = [];

        FILMS.forEach(film => {
            const pos = filmPos.get(film.id);
            const geo = new THREE.SphereGeometry(NODE_SIZE[film.shell], 22, 22);
            const color = new THREE.Color(NODE_COLOR[film.shell]);
            const mat = new THREE.MeshPhongMaterial({
                color, emissive: color.clone().multiplyScalar(0.08),
                transparent: true, opacity: film.shell === 0 ? 1 : 0.04, shininess: 55,
            });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.copy(pos);
            mesh.userData = { id: film.id, shell: film.shell };
            scene.add(mesh);
            allMeshes.push(mesh);

            const lbl = document.createElement("div");
            lbl.style.cssText = `
        position:absolute;pointer-events:none;
        font-family:'Courier New',monospace;font-size:10px;font-weight:700;
        letter-spacing:2.8px;text-transform:uppercase;color:#1A1612;
        white-space:nowrap;background:rgba(246,242,235,0.85);
        padding:2px 7px;border:1px solid rgba(30,22,18,0.15);
        opacity:0;transition:opacity 0.35s;transform:translate(-50%,-145%);
        backdrop-filter:blur(5px);
      `;
            lbl.textContent = film.title;
            overlay.appendChild(lbl);
            nodeMap.set(film.id, { mesh, film, labelEl: lbl });
        });

        /* ── Edges ── */
        const edgeLines = [];
        EDGES.forEach(edge => {
            const fp = filmPos.get(edge.from), tp = filmPos.get(edge.to);
            if (!fp || !tp) return;
            const geo = new THREE.BufferGeometry().setFromPoints([fp, tp]);
            const mat = new THREE.LineBasicMaterial({
                color: new THREE.Color(EDGE_COLOR[edge.type] || "#aaa"),
                transparent: true, opacity: 0.12,
            });
            const line = new THREE.Line(geo, mat);
            line.userData = { from: edge.from, to: edge.to, type: edge.type, label: edge.label };
            scene.add(line);
            edgeLines.push(line);
        });

        /* ── Camera state ── */
        const sph = { theta: 0.4, phi: 1.28, radius: 90 };
        const tgt = { theta: 0.4, phi: 1.28, radius: 90 };

        /* ── Interaction ── */
        let isDragging = false, dragStart = { x: 0, y: 0 };
        let hoveredId = null, selectedId = null, autoRotate = true;
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        let raf, prevShell = 0;

        ctrlRef.current = {
            reset() {
                selectedId = null;
                autoRotate = true;
            }
        };

        /* ── Animate ── */
        const animate = () => {
            raf = requestAnimationFrame(animate);

            if (autoRotate && !isDragging && !selectedId) tgt.theta += 0.0022;

            sph.theta = lerp(sph.theta, tgt.theta, 0.055);
            sph.phi = lerp(sph.phi, tgt.phi, 0.055);
            sph.radius = lerp(sph.radius, tgt.radius, 0.044);

            camera.position.set(
                sph.radius * Math.sin(sph.phi) * Math.sin(sph.theta),
                sph.radius * Math.cos(sph.phi),
                sph.radius * Math.sin(sph.phi) * Math.cos(sph.theta)
            );
            camera.lookAt(0, 0, 0);

            /* shell level */
            const curShell = sph.radius < 105 ? 0 : sph.radius < 188 ? 1 : 2;
            if (curShell !== prevShell) { prevShell = curShell; setShellLevel(curShell); }

            const r = sph.radius;
            const cw = el.clientWidth, ch = el.clientHeight;

            /* nodes */
            nodeMap.forEach(({ mesh, film, labelEl }) => {
                const fid = film.id, fsh = film.shell;
                let op;
                if (fsh === 0) op = 1;
                else if (fsh === 1) op = Math.min(1, Math.max(0.03, (r - 78) / 52));
                else op = Math.min(0.75, Math.max(0, (r - 158) / 52));
                if (fid === hoveredId || fid === selectedId) op = 1;

                mesh.material.opacity = lerp(mesh.material.opacity, op, 0.09);
                const ts = fid === hoveredId ? 1.38 : fid === selectedId ? 1.22 : 1;
                mesh.scale.setScalar(lerp(mesh.scale.x, ts, 0.13));

                /* label projection */
                const showLbl = fsh === 0 || (fsh === 1 && r > 112);
                if (showLbl || fid === selectedId) {
                    const v = mesh.position.clone().project(camera);
                    if (v.z > -1 && v.z < 1) {
                        const sx = ((v.x + 1) / 2) * cw;
                        const sy = ((-v.y + 1) / 2) * ch;
                        labelEl.style.left = sx + "px";
                        labelEl.style.top = sy + "px";
                        labelEl.style.opacity = String(Math.min(1, op + 0.15));
                        labelEl.style.color = fid === selectedId ? NODE_COLOR[fsh] : "#1A1612";
                        labelEl.style.borderColor = fid === selectedId ? NODE_COLOR[fsh] : "rgba(30,22,18,0.15)";
                        labelEl.style.zIndex = fid === selectedId ? "5" : "1";
                    } else { labelEl.style.opacity = "0"; }
                } else { labelEl.style.opacity = "0"; }
            });

            /* edges */
            edgeLines.forEach(line => {
                const { from, to } = line.userData;
                const fsh = Math.max(FILMS.find(f => f.id === from)?.shell || 0, FILMS.find(f => f.id === to)?.shell || 0);
                let base = 0.17;
                if (fsh === 1) base = Math.min(0.17, Math.max(0.01, (r - 82) / 48 * 0.17));
                if (fsh === 2) base = Math.min(0.13, Math.max(0, (r - 162) / 48 * 0.13));
                let target = base;
                if (selectedId) {
                    target = (from === selectedId || to === selectedId) ? 0.9 : 0.02;
                }
                line.material.opacity = lerp(line.material.opacity, target, 0.075);
            });

            renderer.render(scene, camera);
        };
        animate();

        /* ── Events ── */
        const cvs = renderer.domElement;

        const onMove = e => {
            const rect = cvs.getBoundingClientRect();
            const cx = e.clientX - rect.left, cy = e.clientY - rect.top;
            if (isDragging) {
                tgt.theta += (e.clientX - dragStart.x) * 0.006;
                tgt.phi = Math.max(0.22, Math.min(2.92, tgt.phi - (e.clientY - dragStart.y) * 0.003));
                dragStart = { x: e.clientX, y: e.clientY };
                return;
            }
            mouse.x = (cx / cw) * 2 - 1;
            mouse.y = -(cy / ch) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            const hit = raycaster.intersectObjects(allMeshes);
            const nid = hit.length ? hit[0].object.userData.id : null;
            if (nid !== hoveredId) { hoveredId = nid; cvs.style.cursor = nid ? "pointer" : "grab"; }
        };

        const onDown = e => {
            isDragging = true; dragStart = { x: e.clientX, y: e.clientY };
            cvs.style.cursor = "grabbing";
        };

        const onUp = e => {
            const moved = Math.abs(e.clientX - dragStart.x) + Math.abs(e.clientY - dragStart.y);
            isDragging = false;
            cvs.style.cursor = hoveredId ? "pointer" : "grab";
            if (moved < 5) {
                if (hoveredId) {
                    const { film, mesh } = nodeMap.get(hoveredId);
                    selectedId = hoveredId;
                    autoRotate = false;
                    const pos = mesh.position;
                    const dist = pos.length();
                    tgt.theta = Math.atan2(pos.x, pos.z);
                    tgt.phi = Math.max(0.22, Math.min(2.92, Math.acos(Math.max(-1, Math.min(1, pos.y / Math.max(dist, 0.01))))));
                    tgt.radius = Math.max(36, dist * 1.6 + 12);
                    setSelectedFilm(film);
                    setPanelOpen(true);
                } else {
                    selectedId = null; autoRotate = true;
                    setSelectedFilm(null); setPanelOpen(false);
                }
            }
        };

        const onWheel = e => {
            e.preventDefault();
            tgt.radius = Math.max(36, Math.min(290, tgt.radius + e.deltaY * 0.27));
        };

        const onResize = () => {
            const nw = el.clientWidth, nh = el.clientHeight;
            camera.aspect = nw / nh; camera.updateProjectionMatrix();
            renderer.setSize(nw, nh);
        };

        cvs.addEventListener("mousemove", onMove);
        cvs.addEventListener("mousedown", onDown);
        cvs.addEventListener("mouseup", onUp);
        cvs.addEventListener("wheel", onWheel, { passive: false });
        window.addEventListener("resize", onResize);
        cvs.style.cursor = "grab";

        return () => {
            cancelAnimationFrame(raf);
            cvs.removeEventListener("mousemove", onMove);
            cvs.removeEventListener("mousedown", onDown);
            cvs.removeEventListener("mouseup", onUp);
            cvs.removeEventListener("wheel", onWheel);
            window.removeEventListener("resize", onResize);
            renderer.dispose();
            if (el.contains(cvs)) el.removeChild(cvs);
            nodeMap.forEach(({ labelEl }) => { if (overlay.contains(labelEl)) overlay.removeChild(labelEl); });
        };
    }, []);

    const getConnections = film => !film ? [] :
        EDGES.filter(e => e.from === film.id || e.to === film.id).map(e => {
            const oid = e.from === film.id ? e.to : e.from;
            const other = FILMS.find(f => f.id === oid);
            return other ? { film: other, type: e.type, label: e.label } : null;
        }).filter(Boolean);

    const shellMeta = [
        { label: "I TUOI PILASTRI", color: "#C0392B" },
        { label: "CONNESSIONI", color: "#C8952A" },
        { label: "SCOPERTE", color: "#8A8A8A" },
    ];
    const edgeTypeName = { thematic: "tematico", stylistic: "stilistico", contrast: "contrasto" };
    const edgeDot = { thematic: "#C8952A", stylistic: "#5A7F9E", contrast: "#8B5E8B" };

    return (
        <div style={{
            width: "100%", height: "100vh", position: "relative", overflow: "hidden",
            background: "radial-gradient(ellipse at 48% 42%, #F6F2EA 0%, #E4DDD2 52%, #CFC9BC 100%)"
        }}>

            {/* Canvas mount */}
            <div ref={mountRef} style={{ position: "absolute", inset: 0 }} />

            {/* Labels overlay */}
            <div ref={overlayRef} style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />

            {/* Title */}
            <div style={{
                position: "absolute", top: 22, left: 26, zIndex: 10,
                fontFamily: "'Courier New',monospace", userSelect: "none"
            }}>
                <span style={{ fontSize: 16.5, color: "#2A2420", letterSpacing: 0.5 }}>La </span>
                <span style={{ fontSize: 16.5, color: "#C0392B", fontStyle: "italic" }}>Sfera</span>
                <span style={{ fontSize: 16.5, color: "#2A2420", letterSpacing: 0.5 }}> Semantica</span>
            </div>

            {/* Hint */}
            <div style={{
                position: "absolute", top: 20, right: 24, zIndex: 10, textAlign: "right",
                fontFamily: "'Courier New',monospace", fontSize: 9, color: "rgba(42,36,32,0.4)",
                letterSpacing: 2, lineHeight: 2, userSelect: "none"
            }}>
                <div>TRASCINA · ruota</div>
                <div>SCROLL · zoom</div>
                <div>CLICK · seleziona</div>
            </div>

            {/* Shell indicator */}
            <div style={{
                position: "absolute", bottom: 22, left: 24, zIndex: 10,
                display: "flex", alignItems: "center", gap: 12,
                fontFamily: "'Courier New',monospace", userSelect: "none"
            }}>
                <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                    {shellMeta.map((s, i) => (
                        <div key={i} style={{
                            width: shellLevel === i ? 9 : 7, height: shellLevel === i ? 9 : 7,
                            borderRadius: "50%",
                            background: shellLevel >= i ? s.color : "rgba(42,36,32,0.18)",
                            boxShadow: shellLevel === i ? `0 0 7px ${s.color}88` : "none",
                            transition: "all 0.5s",
                        }} />
                    ))}
                </div>
                <span style={{ fontSize: 9, letterSpacing: 2.2, color: "rgba(42,36,32,0.5)", textTransform: "uppercase" }}>
                    {shellMeta[shellLevel].label}
                </span>
            </div>

            {/* Legend */}
            <div style={{
                position: "absolute", bottom: 56, left: 24, zIndex: 10,
                fontFamily: "'Courier New',monospace", fontSize: 8.5, letterSpacing: 1.5,
                color: "rgba(42,36,32,0.4)", display: "flex", flexDirection: "column", gap: 5, userSelect: "none"
            }}>
                {Object.entries(edgeDot).map(([type, color]) => (
                    <div key={type} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <div style={{ width: 18, height: 1.5, background: color, opacity: 0.85, borderRadius: 1 }} />
                        <span style={{ textTransform: "uppercase" }}>{edgeTypeName[type]}</span>
                    </div>
                ))}
            </div>

            {/* Detail panel */}
            <div style={{
                position: "absolute", right: 0, top: 0, bottom: 0, width: 284,
                background: "rgba(248,244,238,0.97)",
                backdropFilter: "blur(18px)",
                borderLeft: "1px solid rgba(42,36,32,0.1)",
                transform: panelOpen ? "translateX(0)" : "translateX(100%)",
                transition: "transform 0.42s cubic-bezier(0.16,1,0.3,1)",
                zIndex: 30, overflowY: "auto",
                fontFamily: "'Courier New',monospace",
                boxShadow: "-8px 0 32px rgba(0,0,0,0.06)",
            }}>
                {selectedFilm && (
                    <div style={{ padding: "32px 24px 40px" }}>
                        {/* Close */}
                        <button onClick={() => {
                            if (ctrlRef.current) ctrlRef.current.reset();
                            setPanelOpen(false);
                            setTimeout(() => setSelectedFilm(null), 420);
                        }} style={{
                            position: "absolute", top: 14, right: 16,
                            background: "none", border: "none", cursor: "pointer",
                            color: "rgba(42,36,32,0.35)", fontSize: 14,
                            fontFamily: "inherit", padding: 4,
                        }}>✕</button>

                        {/* Badge */}
                        <div style={{
                            display: "inline-block", fontSize: 7.5, letterSpacing: 2.8,
                            padding: "3px 9px", marginBottom: 16,
                            border: `1px solid ${NODE_COLOR[selectedFilm.shell]}`,
                            color: NODE_COLOR[selectedFilm.shell], textTransform: "uppercase",
                        }}>
                            {selectedFilm.shell === 0 ? "Pilastro del Gusto"
                                : selectedFilm.shell === 1 ? "Connessione Diretta"
                                    : "Scoperta Avanzata"}
                        </div>

                        {/* Title */}
                        <div style={{
                            fontSize: 19, fontWeight: 800, letterSpacing: 3.5,
                            color: "#1A1612", lineHeight: 1.15, marginBottom: 5
                        }}>
                            {selectedFilm.title}
                        </div>
                        <div style={{
                            fontSize: 9.5, letterSpacing: 1.8, color: "rgba(42,36,32,0.5)",
                            marginBottom: 20, textTransform: "uppercase"
                        }}>
                            {selectedFilm.director} · {selectedFilm.year}
                        </div>

                        <div style={{ width: 36, height: 1, background: "rgba(42,36,32,0.18)", marginBottom: 18 }} />

                        {/* Synopsis */}
                        <p style={{
                            fontSize: 11, lineHeight: 1.75, color: "rgba(42,36,32,0.68)",
                            marginBottom: 22, letterSpacing: 0.2, margin: "0 0 22px"
                        }}>
                            {selectedFilm.synopsis}
                        </p>

                        {/* Themes */}
                        <div style={{
                            fontSize: 8, letterSpacing: 2.5, color: "rgba(42,36,32,0.38)",
                            textTransform: "uppercase", marginBottom: 10
                        }}>Temi editoriali</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 24 }}>
                            {selectedFilm.themes.map(t => (
                                <span key={t} style={{
                                    fontSize: 8.5, letterSpacing: 1, padding: "3px 8px",
                                    background: "rgba(42,36,32,0.06)", color: "rgba(42,36,32,0.65)",
                                    textTransform: "uppercase"
                                }}>{t}</span>
                            ))}
                        </div>

                        {/* Connections */}
                        <div style={{
                            fontSize: 8, letterSpacing: 2.5, color: "rgba(42,36,32,0.38)",
                            textTransform: "uppercase", marginBottom: 13
                        }}>Connessioni editoriali</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                            {getConnections(selectedFilm).map(({ film, type, label }) => (
                                <div key={film.id} style={{
                                    borderLeft: `2px solid ${edgeDot[type]}`, paddingLeft: 11,
                                }}>
                                    <div style={{
                                        fontSize: 9.5, fontWeight: 700, letterSpacing: 2,
                                        color: "#1A1612", marginBottom: 3
                                    }}>{film.title}</div>
                                    <div style={{
                                        fontSize: 8.5, letterSpacing: 0.5, color: "rgba(42,36,32,0.48)",
                                        lineHeight: 1.55
                                    }}>{label}</div>
                                    <div style={{
                                        fontSize: 7.5, letterSpacing: 1.5, color: edgeDot[type],
                                        textTransform: "uppercase", marginTop: 3
                                    }}>{edgeTypeName[type]}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}