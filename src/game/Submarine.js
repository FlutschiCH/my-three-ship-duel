import * as THREE from 'three';
import { Unit } from './Unit.js';

class Submarine extends Unit {
    constructor() {
        // name, health, damage, layer
                super('Submarine', 300, 75, 'sub');
        this.sonarUsed = false;

        // Override mesh with a more appropriate placeholder
        const geometry = new THREE.CapsuleGeometry(0.4, 2.5, 4, 16);
        const material = new THREE.MeshStandardMaterial({ color: 0x333355 }); // Dark navy
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotation.x = Math.PI / 2;
    }

    useSonar() {
        this.sonarUsed = true;
        }
}

export { Submarine };