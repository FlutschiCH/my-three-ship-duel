import * as THREE from 'three';

// Layer Y positions - must match main.js
const LAYER_LEVELS = {
    sky: 20,
    sea: 0,
    sub: -20,
};

class Unit {
    constructor(name, health, damage, layer, onDestroy) {
        this.name = name;
        this.health = health;
        this.maxHealth = health;
        this.damage = damage;
        this.layer = layer; // 'sky', 'sea', or 'sub'
        this.isAlive = true;
        this.onDestroy = onDestroy;

        this.gridX = 0;
        this.gridZ = 0;

        // Create a placeholder mesh
        const geometry = new THREE.ConeGeometry(0.5, 1.5, 32);
        const material = new THREE.MeshStandardMaterial({ color: 0xffff00 });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotation.x = Math.PI / 2; // Point it forward
    }

    /**
     * Places the unit at the specified grid coordinates.
     * @param {number} x - The grid x-coordinate (0-39).
     * @param {number} z - The grid z-coordinate (0-39).
     * @param {number} gridSize - The total size of the grid (e.g., 40).
     */
    place(x, z, gridSize) {
        this.gridX = x;
        this.gridZ = z;

        // Convert grid coordinates to world coordinates
        const worldX = x - (gridSize / 2) + 0.5;
        const worldZ = z - (gridSize / 2) + 0.5;
        const worldY = LAYER_LEVELS[this.layer] + 0.75; // Position it on top of the grid

        this.mesh.position.set(worldX, worldY, worldZ);

        // If it's a carrier, set its starting position
        if (this.startX !== undefined) {
            this.startX = x;
            this.startZ = z;
        }
    }

    moveTo(x, z, gridSize) {
        this.gridX = x;
        this.gridZ = z;

        const worldX = x - (gridSize / 2) + 0.5;
        const worldZ = z - (gridSize / 2) + 0.5;
        const worldY = this.mesh.position.y;

        this.mesh.position.set(worldX, worldY, worldZ);
    }

    takeDamage(amount) {
        if (!this.isAlive) return;

        this.health = Math.max(0, this.health - amount);
        console.log(`${this.name} takes ${amount} damage, ${this.health} HP remaining.`);

        if (this.health === 0) {
            this.isAlive = false;
            console.log(`${this.name} has been destroyed!`);
            if (this.onDestroy) {
                this.onDestroy(this);
            }
                    }
        }
    }

export { Unit };