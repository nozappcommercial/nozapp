import { test, expect, describe } from 'vitest';
import { buildNavContext, connectedTo, edgesOf, neighbors, FilmNode, FilmEdge } from './traversal';

describe('Graph Traversal Module', () => {
    const mockFilms: FilmNode[] = [
        { id: 0, title: 'Film A (Pillar)', shell: 0, year: 2000, dir: 'Dir A', tags: [] },
        { id: 1, title: 'Film B (Pillar)', shell: 0, year: 2001, dir: 'Dir B', tags: [] },
        { id: 2, title: 'Film C (Shell 1)', shell: 1, year: 2002, dir: 'Dir C', tags: [] },
        { id: 3, title: 'Film D (Shell 1)', shell: 1, year: 2003, dir: 'Dir D', tags: [] },
        { id: 4, title: 'Film E (Shell 2)', shell: 2, year: 2004, dir: 'Dir E', tags: [] },
    ];

    const mockEdges: FilmEdge[] = [
        { from: 0, to: 2, type: 'thematic', label: 'E1' }, // A <-> C
        { from: 1, to: 3, type: 'stylistic', label: 'E2' }, // B <-> D
        { from: 2, to: 3, type: 'contrast', label: 'E3' }, // C <-> D (lateral)
        { from: 2, to: 4, type: 'thematic', label: 'E4' }, // C <-> E
    ];

    test('connectedTo returns all neighbors', () => {
        const connectedC = connectedTo(2, mockEdges);
        expect(connectedC.has(0)).toBe(true);
        expect(connectedC.has(3)).toBe(true);
        expect(connectedC.has(4)).toBe(true);
        expect(connectedC.has(1)).toBe(false);
    });

    test('edgesOf returns all connected edge indices', () => {
        const edgeIndices = edgesOf(2, mockEdges);
        expect(edgeIndices).toEqual([0, 2, 3]);
    });

    test('neighbors with specified shell filters correctly', () => {
        // Neighbors of C (2) on Shell 1
        const nShell1 = neighbors(2, [1], mockFilms, mockEdges);
        expect(nShell1).toEqual([3]);

        // Neighbors of C (2) on Shell 2
        const nShell2 = neighbors(2, [2], mockFilms, mockEdges);
        expect(nShell2).toEqual([4]);

        // Neighbors of C (2) on any shell
        const nAny = neighbors(2, null, mockFilms, mockEdges);
        expect(nAny.sort()).toEqual([0, 3, 4]);
    });

    test('buildNavContext constructs correct state for Pillar node', () => {
        const ctx = buildNavContext(0, null, null, 0, [], mockFilms, mockEdges);
        
        expect(ctx.current).toBe(0);
        expect(ctx.parent).toBe(null);
        // Siblings should be all Shell 0 nodes + any lateral connections
        expect(ctx.siblings).toEqual([0, 1]); // Node 0 and Node 1 are both Shell 0
        expect(ctx.children).toEqual([2]); // Connected to Node 2 (Shell 1)
        expect(ctx.visible.has(0)).toBe(true);
        expect(ctx.visible.has(1)).toBe(true);
        expect(ctx.visible.has(2)).toBe(true);
    });

    test('buildNavContext constructs correct state for Shell 1 node', () => {
        // Navigating from Pillar A (0) to Shell 1 C (2)
        const parent = 0;
        const previousSiblings = [0, 1];
        const ctx = buildNavContext(2, parent, [2, 3], 0, [{parent: null, siblings: previousSiblings, siblingIndex: 0}], mockFilms, mockEdges);
        
        expect(ctx.current).toBe(2);
        expect(ctx.parent).toBe(0);
        expect(ctx.siblings).toEqual([2, 3]);
        expect(ctx.children).toEqual([4]);
        
        // Visibility should include current, parent, siblings, children, and all direct neighbors
        expect(ctx.visible.has(2)).toBe(true); // Current
        expect(ctx.visible.has(0)).toBe(true); // Parent
        expect(ctx.visible.has(3)).toBe(true); // Sibling
        expect(ctx.visible.has(4)).toBe(true); // Child
    });
});
