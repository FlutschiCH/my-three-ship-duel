import * as THREE from 'three';

const SHIP_WIDTH = 0.8;
const SHIP_HEIGHT = 0.5;

class Ship {
    constructor(size, color = 0x8B4513) {
        this.size = size;
        this.color = color;
        this.hits = 0;
        this.occupiedCells = []; // Stores grid coordinates like [{x, z}, ...]

        const shipBody = new THREE.Group();

        // Create the main hull of the ship
        const geometry = new THREE.BoxGeometry(SHIP_WIDTH, SHIP_HEIGHT, this.size);
        const material = new THREE.MeshStandardMaterial({ color: this.color });
        const hull = new THREE.Mesh(geometry, material);
        shipBody.add(hull);

        // Store the mesh group
        this.mesh = shipBody;
    }

    hit() {
        this.hits++;
    }

    isSunk() {
        return this.hits >= this.size;
    }

    /**
     * Sets the position of the ship on the grid.
     * @param {number} x - The grid x-coordinate (0-9).
     * @param {number} z - The grid z-coordinate (0-9).
     * @param {string} orientation - 'horizontal' or 'vertical'.
     */
    place(x, z, orientation = 'horizontal') {
        // Convert grid coordinates to world coordinates
        // Grid center is at (0,0), so we offset by half the grid size
        const worldX = x - 4.5;
        const worldZ = z - 4.5;

        this.mesh.position.set(worldX, SHIP_HEIGHT / 2, worldZ);
        this.occupiedCells = [];

        if (orientation === 'horizontal') {
            this.mesh.rotation.y = 0;
            // Adjust position to center the ship on the squares
            this.mesh.position.z += (this.size - 1) * 0.5;
            for (let i = 0; i < this.size; i++) {
                this.occupiedCells.push({ x: x, z: z + i });
            }
        } else { // vertical
            this.mesh.rotation.y = Math.PI / 2;
            // Adjust position to center the ship on the squares
            this.mesh.position.x -= (this.size - 1) * 0.5;
            for (let i = 0; i < this.size; i++) {
                this.occupiedCells.push({ x: x + i, z: z });
            }
        }
    }
}

export { Ship };