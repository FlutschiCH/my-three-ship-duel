import * as THREE from 'three';
import { Carrier } from '../game/Carrier.js';
import { FighterJet } from '../game/FighterJet.js';

const LAYER_LEVELS = { sky: 20, sea: 0, sub: -20 };

class MovementSystem {
    constructor(scene, gridSize) {
        this.scene = scene;
        this.gridSize = gridSize;
        this.highlighters = [];
        this.activeHighlighters = [];
        this.validMoves = new Map(); // Using Map for quick lookups: 'x,z' -> {x, z}

        // Pre-create a pool of highlighter meshes
        const highlightGeometry = new THREE.PlaneGeometry(1, 1);
        const highlightMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x00ff00, 
            transparent: true, 
            opacity: 0.3, 
            side: THREE.DoubleSide 
        });
        for (let i = 0; i < 200; i++) {
            const highlighter = new THREE.Mesh(highlightGeometry, highlightMaterial);
            highlighter.rotation.x = -Math.PI / 2;
            highlighter.visible = false;
            this.highlighters.push(highlighter);
            this.scene.add(highlighter);
        }
    }

    showRangeFor(unit) {
        this.hideRange();

        if (unit instanceof Carrier) {
            this.showCarrierRange(unit);
        } else if (unit instanceof FighterJet) {
            this.showFighterJetRange(unit);
        }
    }

    showCarrierRange(unit) {
        const y = LAYER_LEVELS[unit.layer] + 0.05;

        

        for (let x = -unit.movementRange; x <= unit.movementRange; x++) {
            for (let z = -unit.movementRange; z <= unit.movementRange; z++) {
                if (x === 0 && z === 0) continue;

                const targetX = unit.startX + x;
                const targetZ = unit.startZ + z;

                // Check bounds
                if (targetX >= 0 && targetX < this.gridSize && targetZ >= 0 && targetZ < this.gridSize) {
                    const key = `${targetX},${targetZ}`;
                    this.validMoves.set(key, { x: targetX, z: targetZ });

                    const highlighter = this.highlighters.pop();
                    if (highlighter) {
                        highlighter.position.set(
                            targetX - (this.gridSize / 2) + 0.5,
                            y,
                            targetZ - (this.gridSize / 2) + 0.5
                        );
                        highlighter.visible = true;
                        this.activeHighlighters.push(highlighter);
                    }
                }
            }
        }
    }

    hideRange() {
        this.activeHighlighters.forEach(h => {
            h.visible = false;
            this.highlighters.push(h);
        });
        this.activeHighlighters = [];
        this.validMoves.clear();
    }

    showFighterJetRange(unit) {
        const y = LAYER_LEVELS[unit.layer] + 0.05;
        const carrierPos = { x: unit.carrier.gridX, z: unit.carrier.gridZ };
        const radius = unit.operationalRadius;

        for (let x = carrierPos.x - radius; x <= carrierPos.x + radius; x++) {
            for (let z = carrierPos.z - radius; z <= carrierPos.z + radius; z++) {
                if (x === unit.gridX && z === unit.gridZ) continue;

                const distance = Math.sqrt(Math.pow(x - carrierPos.x, 2) + Math.pow(z - carrierPos.z, 2));
                
                if (distance <= radius && x >= 0 && x < this.gridSize && z >= 0 && z < this.gridSize) {
                    const key = `${x},${z}`;
                    this.validMoves.set(key, { x, z });

                    const highlighter = this.highlighters.pop();
                    if (highlighter) {
                        highlighter.position.set(
                            x - (this.gridSize / 2) + 0.5,
                            y,
                            z - (this.gridSize / 2) + 0.5
                        );
                        highlighter.visible = true;
                        this.activeHighlighters.push(highlighter);
                    }
                }
            }
        }
    }

    isMoveValid(x, z) {
        return this.validMoves.has(`${x},${z}`);
    }
}

export { MovementSystem };