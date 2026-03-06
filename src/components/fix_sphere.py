import re

with open('SemanticSphere.tsx', 'r') as f:
    code = f.read()

# 1. Add React state
code = code.replace(
    "const mounted = useRef(false);",
    "const mounted = useRef(false);\n    const [selectedFilm, setSelectedFilm] = React.useState<FilmNode | null>(null);\n    const [selectedEdges, setSelectedEdges] = React.useState<any[]>([]);"
)

# 2. Keydown listener
old_keydown = """        window.addEventListener('keydown', e => {
            if (!navContext) return;
            if (e.key === 'ArrowUp') document.getElementById('btn-up').click();
            if (e.key === 'ArrowDown') document.getElementById('btn-down').click();
            if (e.key === 'ArrowLeft') document.getElementById('btn-left').click();
            if (e.key === 'ArrowRight') document.getElementById('btn-right').click();
            if (e.key === 'Escape') closePanel();
        });"""

new_keydown = """        window.addEventListener('keydown', e => {
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
        });"""
code = code.replace(old_keydown, new_keydown)

# 3. closePanel
old_closePanel = """        function closePanel() {
            document.getElementById('panel').classList.remove('visible');
            document.getElementById('nav-controls').classList.remove('visible');
            document.getElementById('breadcrumb').classList.remove('visible');"""

new_closePanel = """        function closePanel() {
            setSelectedFilm(null);
            document.getElementById('nav-controls')?.classList.remove('visible');
            document.getElementById('breadcrumb')?.classList.remove('visible');"""
code = code.replace(old_closePanel, new_closePanel)

# 4. showPanel
old_showPanel_regex = r"        function showPanel\(nodeIndex: number\) \{[\s\S]*?(?=        function closePanel)"
match = re.search(old_showPanel_regex, code)
if match:
    new_showPanel = """        function showPanel(nodeIndex: number) {
            const film = FILMS[nodeIndex];
            const connEdges = EDGES.filter(e => e.from === nodeIndex || e.to === nodeIndex);
            const edgeData = connEdges.map(e => {
                const oid = e.from === nodeIndex ? e.to : e.from;
                return { id: e.from+'-'+e.to, type: e.type, film: FILMS[oid] };
            });
            setSelectedFilm(film);
            setSelectedEdges(edgeData);
        }

"""
    code = code[:match.start()] + new_showPanel + code[match.end():]

# 5. JSX returned at bottom
old_jsx_regex = r"            \{\/\* Info Panel \*\/\}[\s\S]*?(?=        \<\/div\>\n    \);\n\})"
jsx_match = re.search(old_jsx_regex, code)

new_jsx = """            {/* Info Panel -> React State */}
            {selectedFilm && (
                <div id="panel" className="visible">
                    <button id="panel-close" onClick={() => { setSelectedFilm(null); dispatchEvent(new Event('closeSpherePanel')); }}>×</button>
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
                                <span style={{opacity:.6, fontFamily:'Fragment_Mono', letterSpacing:'1px', textTransform:'uppercase', fontSize:'10px'}}>{selectedFilm.dir}</span>
                                <span style={{opacity:.3, margin:'0 8px'}}>|</span>
                                <span style={{opacity:.5, fontFamily:'Fragment_Mono', letterSpacing:'1px'}}>{selectedFilm.year}</span>
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
"""

if jsx_match:
    code = code[:jsx_match.start()] + new_jsx + code[jsx_match.end():]

with open('SemanticSphere.tsx', 'w') as f:
    f.write(code)
