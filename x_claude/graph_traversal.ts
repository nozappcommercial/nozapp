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

export interface NavContext {
    current: number;
    parent: number | null;
    siblings: number[];
    siblingIndex: number;
    children: number[];
    visible: Set<number>;
    stack: any[];
}

export function connectedTo(id: number, edges: FilmEdge[]): Set<number> {
    const s = new Set([id]);
    edges.forEach(e => {
        if (e.from === id) s.add(e.to);
        if (e.to === id) s.add(e.from);
    });
    return s;
}

export function edgesOf(id: number, edges: FilmEdge[]): number[] {
    return edges.reduce((a, e, i) => {
        if (e.from === id || e.to === id) a.push(i);
        return a;
    }, [] as number[]);
}

export function neighbors(id: number, shells: number[] | null, films: FilmNode[], edges: FilmEdge[]): number[] {
    const res: number[] = [];
    edges.forEach(e => {
        if (e.from === id && (shells === null || shells.includes(films[e.to].shell))) res.push(e.to);
        if (e.to === id && (shells === null || shells.includes(films[e.from].shell))) res.push(e.from);
    });
    return Array.from(new Set(res));
}

export function buildNavContext(
    filmIndex: number,
    parent: number | null = null,
    siblings: number[] | null = null,
    sibIdx: number = 0,
    stack: any[] = [],
    films: FilmNode[],
    edges: FilmEdge[]
): NavContext {
    const film = films[filmIndex];
    if (!film) {
        throw new Error(`Film with index ${filmIndex} not found`);
    }
    const shell = film.shell;

    let sibs: number[];
    if (siblings !== null) {
        sibs = siblings;
    } else {
        let baseSibs: number[];
        if (parent !== null) {
            baseSibs = neighbors(parent, [shell], films, edges);
        } else {
            // Find all films mapped directly to shell 0
            baseSibs = [];
            films.forEach((f, i) => {
                if (f.shell === 0) baseSibs.push(i);
            });
        }
        const lateral = neighbors(filmIndex, [shell], films, edges).filter(id => !baseSibs.includes(id));
        sibs = Array.from(new Set([...baseSibs, ...lateral]));
    }
    const idx = siblings !== null ? sibIdx : sibs.indexOf(filmIndex);

    const children = neighbors(filmIndex, null, films, edges).filter(id => films[id] && films[id].shell > shell);
    children.sort((a, b) => films[a].shell - films[b].shell);

    const visible = new Set([filmIndex]);
    if (parent !== null) visible.add(parent);
    sibs.forEach(s => visible.add(s));
    children.forEach(c => visible.add(c));
    connectedTo(filmIndex, edges).forEach(n => visible.add(n));

    return { current: filmIndex, parent, siblings: sibs, siblingIndex: idx, children, visible, stack };
}
