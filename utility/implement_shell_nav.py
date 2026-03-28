import re

with open('SemanticSphere.tsx', 'r') as f:
    code = f.read()

# 1. Imports
if "ShellNavigator" not in code:
    code = code.replace(
        "import * as THREE from 'three';",
        "import * as THREE from 'three';\nimport ShellNavigator, { ShellLevel } from './sphere/ShellNavigator';"
    )

# 2. Add React State
state_code = """    const [selectedEdges, setSelectedEdges] = React.useState<any[]>([]);
    
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
    }, [activeShell]);"""

code = code.replace("    const [selectedEdges, setSelectedEdges] = React.useState<any[]>([]);", state_code)

# 3. Inject sphereApi logic inside the main useEffect SETUP
setup_start = "        // ═══════════════════════════════════════════════════════════\n        // THREE SETUP"

api_logic = """
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

        // Initialize camera to Shell 0 z-index instead of 11
        camera.position.z = 3;
"""
code = code.replace(setup_start, api_logic + setup_start)

# 4. Integrate tweens into render loop
render_start = "            t += .01;"
render_logic = """            t += .01;
            
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
"""
code = code.replace(render_start, render_logic)

# 5. Add ShellNavigator to JSX
jsx_start = "            {/* Breadcrumb */}"
jsx_logic = """            <ShellNavigator 
                activeShell={activeShell} 
                onShellChange={setActiveShell} 
                isAnimating={isAnimating} 
            />

            {/* Breadcrumb */}"""
code = code.replace(jsx_start, jsx_logic)

with open('SemanticSphere.tsx', 'w') as f:
    f.write(code)
