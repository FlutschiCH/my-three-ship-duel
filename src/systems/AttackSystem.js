import * as THREE from 'three';

const LAYER_LEVELS = { sky: 20, sea: 0, sub: -20 };

class AttackSystem {
    constructor(scene, gridSize, gameManager) {
        this.scene = scene;
        this.gridSize = gridSize;
        this.gameManager = gameManager;
        this.highlighters = [];
        this.activeHighlighters = [];
        this.validTargets = new Map(); // 'x,z' -> unit

        const highlightGeometry = new THREE.PlaneGeometry(1, 1);
        const highlightMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xff0000, 
            transparent: true, 
            opacity: 0.4, 
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

    showRangeFor(unit, allUnits) {
        this.hideRange();
        const attackRadius = 5; // Simple radius for now for all units

        allUnits.forEach(target => {
            // Cannot target own units
            if (target.name === unit.name) return;

            const distance = Math.sqrt(Math.pow(target.gridX - unit.gridX, 2) + Math.pow(target.gridZ - unit.gridZ, 2));
            if (distance <= attackRadius) {
                const key = `${target.gridX},${target.gridZ}`;
                this.validTargets.set(key, target);
                const highlighter = this.highlighters.pop();
                if (highlighter) {
                    highlighter.position.set(
                        target.gridX - (this.gridSize / 2) + 0.5,
                        LAYER_LEVELS[target.layer] + 0.06, // Slightly above movement markers
                        target.gridZ - (this.gridSize / 2) + 0.5
                    );
                    highlighter.visible = true;
                    this.activeHighlighters.push(highlighter);
                }
            }
        });
    }

    hideRange() {
        this.activeHighlighters.forEach(h => {
            h.visible = false;
            this.highlighters.push(h);
        });
        this.activeHighlighters = [];
        this.validTargets.clear();
    }

    getTargetAt(x, z) {
        return this.validTargets.get(`${x},${z}`);
    }

    executeAttack(attacker, target) {
        console.log(`${attacker.name} attacks ${target.name}!`);
        target.takeDamage(attacker.damage);
                this.gameManager.checkWinLossConditions(target);
    }
}

export { AttackSystem };