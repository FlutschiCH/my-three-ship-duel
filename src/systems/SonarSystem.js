import * as THREE from 'three';

class SonarSystem {
    constructor(scene, allUnits) {
        this.scene = scene;
        this.allUnits = allUnits;
        this.sonarEffect = null;
    }

    ping(originUnit) {
        const sonarRadius = 8; // 20% of 40x40 grid
        console.log(`${originUnit.name} activates sonar!`);

        // Create visual effect
        const geometry = new THREE.CylinderGeometry(sonarRadius, sonarRadius, 40, 64, 1, true);
        const material = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        });
        this.sonarEffect = new THREE.Mesh(geometry, material);
        this.sonarEffect.position.set(originUnit.mesh.position.x, 0, originUnit.mesh.position.z);
        this.scene.add(this.sonarEffect);

        // Find and reveal units within the radius
        this.allUnits().forEach(unit => {
            if (unit === originUnit) return;

            const distance = Math.sqrt(Math.pow(unit.gridX - originUnit.gridX, 2) + Math.pow(unit.gridZ - originUnit.gridZ, 2));
            if (distance <= sonarRadius) {
                console.log(`Sonar detected: ${unit.name} at (${unit.gridX}, ${unit.gridZ})`);
                // For now, we just log. Later this will make hidden units visible.
                // Add a temporary highlight to detected units
                if(unit.mesh.material.emissive) { // Check if it's a selectable unit
                    unit.mesh.material.emissive.setHex(0xffff00); // Yellow highlight
                    setTimeout(() => {
                        unit.mesh.material.emissive.setHex(0x000000); // Remove highlight
                    }, 2000);
                }
            }
        });

        // Remove the visual effect after a delay
        setTimeout(() => {
            this.scene.remove(this.sonarEffect);
            this.sonarEffect = null;
        }, 1500);
    }
}

export { SonarSystem };