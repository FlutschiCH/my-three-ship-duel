import * as THREE from 'three';
import { Unit } from './Unit.js';

class Destroyer extends Unit {
    constructor() {
        // name, health, damage, layer
        super('Destroyer', 450, 50, 'sea');

        // Override mesh with a more appropriate placeholder
        const geometry = new THREE.BoxGeometry(0.8, 0.7, 3);
        const material = new THREE.MeshStandardMaterial({ color: 0x999999 }); // Grey
        this.mesh = new THREE.Mesh(geometry, material);
    }
}

export { Destroyer };