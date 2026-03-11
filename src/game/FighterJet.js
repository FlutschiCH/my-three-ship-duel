import * as THREE from 'three';
import { Unit } from './Unit.js';

class FighterJet extends Unit {
    constructor(carrier) {
        // name, health, damage, layer
        super('Fighter Jet', 100, 150, 'sky');
        this.carrier = carrier; // Link to its carrier
        this.operationalRadius = 8;

        // Override mesh with a more appropriate placeholder
        const geometry = new THREE.ConeGeometry(0.5, 1.5, 8);
        const material = new THREE.MeshStandardMaterial({ color: 0xffffff }); // White/Silver
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotation.x = Math.PI / 2;
    }
}

export { FighterJet };