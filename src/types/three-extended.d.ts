import * as THREE from 'three';

export interface ExtendedUserData {
    index?: number;
    edgeIdx?: number;
    id?: number;
}

export interface ExtendedMesh extends THREE.Mesh {
    userData: ExtendedUserData;
}

export interface ExtendedLine extends THREE.Line {
    userData: ExtendedUserData;
    material: THREE.LineBasicMaterial;
}

export interface TweenTask {
    obj: any;
    prop: string;
    start: number;
    target: number;
    duration: number;
    delay: number;
    elapsed: number;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            // we don't need this if we use THREE directly, 
            // but if we use @react-three/fiber we would.
            // Keeping it for future-proofing or removing if unused.
        }
    }
}
