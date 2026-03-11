import * as THREE from 'three';
import { Unit } from './Unit.js';

class Carrier extends Unit {
    constructor() {
        // name, health, damage, layer
        super('Aircraft Carrier', 1000, 25, 'sea');
        this.movementRange = 4;
        this.startX = 0;
        this.startZ = 0;

        // Override mesh with a more appropriate placeholder
        const geometry = new THREE.BoxGeometry(1, 0.8, 5); // Long and flat
        const material = new THREE.MeshStandardMaterial({ color: 0xcccccc }); // Light grey
        this.mesh = new THREE.Mesh(geometry, material);
    }
}

export { Carrier };