import * as THREE from 'three';
import { FighterJet } from '../game/FighterJet.js';

const LAYER_LEVELS = { sky: 20, sea: 0, sub: -20 };

class InteractionManager {
    constructor(camera, renderer, allUnits, playerFleet, gameManager, movementSystem, attackSystem, onSelectCallback) {
        this.camera = camera;
        this.renderer = renderer;
        this.allUnits = allUnits;
        this.playerFleet = playerFleet;
        this.gameManager = gameManager;
        this.movementSystem = movementSystem;
        this.attackSystem = attackSystem;
        this.onSelectCallback = onSelectCallback; // Callback to update UI

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.selectedUnit = null;

        this.renderer.domElement.addEventListener('click', this.onClick.bind(this), false);
    }

    onClick(event) {
        if (!this.gameManager.isPlayerTurn()) return;

        this.raycaster.setFromCamera(this.mouse, this.camera);

        // 1. Check for unit intersection first
        const clickableUnits = this.allUnits.map(unit => unit.mesh);
        const unitIntersects = this.raycaster.intersectObjects(clickableUnits);

        if (unitIntersects.length > 0) {
            const clickedUnit = this.allUnits.find(unit => unit.mesh === unitIntersects[0].object);
            if (clickedUnit) {
                // If a friendly unit is clicked
                if (this.playerFleet.includes(clickedUnit)) {
                    if (this.selectedUnit !== clickedUnit) {
                        this.selectUnit(clickedUnit);
                    } else {
                        this.deselectUnit();
                    }
                } 
                // If an enemy unit is clicked
                else if (this.selectedUnit) {
                    const target = this.attackSystem.getTargetAt(clickedUnit.gridX, clickedUnit.gridZ);
                    if (target) {
                        if (this.gameManager.spendAP(1)) {
                            this.attackSystem.executeAttack(this.selectedUnit, target);
                            this.onSelectCallback(this.selectedUnit, true); // Force UI refresh
                            this.deselectUnit();
                        }
                    }
                }
                return; // Stop processing here
            }
        }

        // 2. If no unit was clicked, check for grid intersection (for movement)
        if (this.selectedUnit) {
            const layerY = LAYER_LEVELS[this.selectedUnit.layer];
            const gridPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -layerY);
            const intersectionPoint = new THREE.Vector3();
            this.raycaster.ray.intersectPlane(gridPlane, intersectionPoint);

            const gridX = Math.floor(intersectionPoint.x + 40 / 2);
            const gridZ = Math.floor(intersectionPoint.z + 40 / 2);

            if (this.movementSystem.isMoveValid(gridX, gridZ)) {
                if (this.gameManager.spendAP(1)) {
                    this.selectedUnit.moveTo(gridX, gridZ, 40);
                    this.deselectUnit(); // Deselect after moving
                }
                return;
            }
        }

        // 3. If nothing was clicked, deselect
        this.deselectUnit();

        // Calculate mouse position in normalized device coordinates
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        
    }

    selectUnit(unit) {
        if (this.selectedUnit) {
            this.removeHighlight(this.selectedUnit);
        }

        this.selectedUnit = unit;
        this.addHighlight(this.selectedUnit);
        this.movementSystem.showRangeFor(this.selectedUnit);
        this.attackSystem.showRangeFor(this.selectedUnit, this.allUnits);
        this.onSelectCallback(this.selectedUnit);
    }

    deselectUnit() {
        if (this.selectedUnit) {
            this.removeHighlight(this.selectedUnit);
            this.movementSystem.hideRange();
            this.attackSystem.hideRange();
            this.selectedUnit = null;
            this.onSelectCallback(null);
        }
    }

    addHighlight(unit) {
        const material = unit.mesh.material;
        if (material) {
            material.emissive.setHex(0x00ff00);
        }
    }

    removeHighlight(unit) {
        const material = unit.mesh.material;
        if (material) {
            material.emissive.setHex(0x000000);
        }
    }
}

export { InteractionManager };