import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Ship } from './Ship.js';
import { GameManager } from './GameManager.js';

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB); // Sky blue background

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 18, 12); // Positioned to see both grids

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.update();

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// --- Game Setup ---
const gridSize = 10;
const gridDivisions = 10;

const playerGridOffset = new THREE.Vector3(-11, 0, 0);
const opponentGridOffset = new THREE.Vector3(11, 0, 0);

const PLAYER_SHIP_COLOR = 0x446699; // A blueish color for the player
const OPPONENT_SHIP_COLOR = 0x8B4513; // This won't be visible anyway

// Function to create a grid and water plane at a specific offset
function createBoard(offset) {
    const gridHelper = new THREE.GridHelper(gridSize, gridDivisions);
    gridHelper.position.copy(offset);
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);

    const waterGeometry = new THREE.PlaneGeometry(gridSize, gridSize);
    const waterMaterial = new THREE.MeshStandardMaterial({ color: 0x006994, transparent: true, opacity: 0.8 });
    const waterPlane = new THREE.Mesh(waterGeometry, waterMaterial);
    waterPlane.rotation.x = -Math.PI / 2;
    waterPlane.position.copy(offset);
    scene.add(waterPlane);
    return waterPlane;
}

const playerWaterPlane = createBoard(playerGridOffset);
const opponentWaterPlane = createBoard(opponentGridOffset);

// Create and place ships for both players
const playerShips = [
    new Ship(5, PLAYER_SHIP_COLOR), new Ship(4, PLAYER_SHIP_COLOR), new Ship(3, PLAYER_SHIP_COLOR), new Ship(3, PLAYER_SHIP_COLOR), new Ship(2, PLAYER_SHIP_COLOR)
];
const opponentShips = [
    new Ship(5, OPPONENT_SHIP_COLOR), new Ship(4, OPPONENT_SHIP_COLOR), new Ship(3, OPPONENT_SHIP_COLOR), new Ship(3, OPPONENT_SHIP_COLOR), new Ship(2, OPPONENT_SHIP_COLOR)
];

// Simple placement for now
playerShips[0].place(0, 1, 'horizontal');
playerShips[1].place(2, 5, 'vertical');
playerShips[2].place(8, 2, 'horizontal');
playerShips[3].place(5, 8, 'vertical');
playerShips[4].place(1, 8, 'horizontal');

opponentShips[0].place(1, 1, 'vertical');
opponentShips[1].place(3, 4, 'horizontal');
opponentShips[2].place(7, 0, 'vertical');
opponentShips[3].place(6, 8, 'horizontal');
opponentShips[4].place(9, 4, 'vertical');

// Offset ship meshes to their correct grids
playerShips.forEach(ship => {
    ship.mesh.position.add(playerGridOffset);
    scene.add(ship.mesh);
});

// Add opponent ships to the scene but make them invisible
opponentShips.forEach(ship => {
    ship.mesh.position.add(opponentGridOffset);
    ship.mesh.visible = false; // The core of the game!
    scene.add(ship.mesh);
});

const playerGameManager = new GameManager(playerShips);
const opponentGameManager = new GameManager(opponentShips);

// --- Player Interaction ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const selectorGeometry = new THREE.PlaneGeometry(1, 1);
const selectorMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0.5, side: THREE.DoubleSide });
const selectorMesh = new THREE.Mesh(selectorGeometry, selectorMaterial);
selectorMesh.rotation.x = -Math.PI / 2;
selectorMesh.position.y = 0.02;
selectorMesh.visible = false;
scene.add(selectorMesh);

const gridObjects = [playerWaterPlane, opponentWaterPlane];
let currentGridPosition = { x: -1, z: -1 };

const hitMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
const missMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
const markerGeometry = new THREE.SphereGeometry(0.25, 16, 8);

function handleInteraction(event, isClick) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(gridObjects);

    if (intersects.length > 0) {
        const intersection = intersects[0];
        const point = intersection.point;
        const offset = intersection.object === playerWaterPlane ? playerGridOffset : opponentGridOffset;
        
        // Only allow interaction with the opponent's grid
        if (intersection.object === opponentWaterPlane) {
            const gridX = Math.floor(point.x - offset.x + gridSize / 2);
            const gridZ = Math.floor(point.z - offset.z + gridSize / 2);

            if (gridX >= 0 && gridX < gridSize && gridZ >= 0 && gridZ < gridSize) {
                selectorMesh.visible = true;
                selectorMesh.position.x = gridX - (gridSize / 2) + 0.5 + offset.x;
                selectorMesh.position.z = gridZ - (gridSize / 2) + 0.5 + offset.z;
                currentGridPosition = { x: gridX, z: gridZ };

                if (isClick) {
                    const result = opponentGameManager.fireAt(currentGridPosition.x, currentGridPosition.z);
                    if (result) {
                        const material = result.result === 'hit' ? hitMaterial : missMaterial;
                        const marker = new THREE.Mesh(markerGeometry, material);
                        marker.position.set(selectorMesh.position.x, 0.2, selectorMesh.position.z);
                        scene.add(marker);

                        // If the hit sunk a ship, reveal it
                        if (result.result === 'hit' && result.ship.isSunk()) {
                            result.ship.mesh.visible = true;
                            result.ship.mesh.material.color.set(0x333333); // Set to dark grey
                        }
                    }
                }
            } else {
                selectorMesh.visible = false;
            }
        } else {
            selectorMesh.visible = false;
        }
    } else {
        selectorMesh.visible = false;
    }
}

window.addEventListener('mousemove', (e) => handleInteraction(e, false));
window.addEventListener('click', (e) => handleInteraction(e, true));

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

// Handle window resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();