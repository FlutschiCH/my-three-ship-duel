import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Carrier } from './game/Carrier.js';
import { Submarine } from './game/Submarine.js';
import { Destroyer } from './game/Destroyer.js';
import { FighterJet } from './game/FighterJet.js';
import { UIManager } from './ui/UIManager.js';
import { InteractionManager } from './systems/InteractionManager.js';
import { GameManager } from './systems/GameManager.js';
import { MovementSystem } from './systems/MovementSystem.js';
import { AttackSystem } from './systems/AttackSystem.js';
import { SonarSystem } from './systems/SonarSystem.js';

// --- Core Setup ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a2a3a);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(30, 30, 30);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#game-canvas'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// --- Controls & Lighting ---
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
directionalLight.position.set(20, 40, 30);
scene.add(directionalLight);

// --- Game Board Setup ---
const gridSize = 40;
const gridDivisions = 40;
const SKY_LEVEL = 20;
const SEA_LEVEL = 0;
const SUB_LEVEL = -20;

function createGrid(level, color) {
    const gridHelper = new THREE.GridHelper(gridSize, gridDivisions, color, color);
    gridHelper.position.y = level;
    scene.add(gridHelper);
}

createGrid(SKY_LEVEL, 0x87CEEB);
createGrid(SEA_LEVEL, 0x006994);
createGrid(SUB_LEVEL, 0x00008B);

// --- Game Objects ---
const playerFleet = [];
const opponentFleet = [];

// Create and place the fleet
function onUnitDestroyed(unit) {
    // Create ghost mesh
    const ghostMaterial = new THREE.MeshStandardMaterial({
        color: 0xaaaaFF,
        transparent: true,
        opacity: 0.3
    });
    unit.mesh.material = ghostMaterial;

    // Remove from active unit lists
    const playerIndex = playerFleet.indexOf(unit);
    if (playerIndex > -1) playerFleet.splice(playerIndex, 1);

    const opponentIndex = opponentFleet.indexOf(unit);
    if (opponentIndex > -1) opponentFleet.splice(opponentIndex, 1);
}

const playerCarrier = new Carrier(() => onUnitDestroyed(playerCarrier));
playerCarrier.place(18, 5, gridSize);
playerFleet.push(playerCarrier);

const playerSub = new Submarine(() => onUnitDestroyed(playerSub));
playerSub.place(22, 8, gridSize);
playerFleet.push(playerSub);

const destroyer1 = new Destroyer(() => onUnitDestroyed(destroyer1));
destroyer1.place(16, 6, gridSize);
playerFleet.push(destroyer1);

const destroyer2 = new Destroyer(() => onUnitDestroyed(destroyer2));
destroyer2.place(20, 4, gridSize);
playerFleet.push(destroyer2);

const jet1 = new FighterJet(playerCarrier, () => onUnitDestroyed(jet1));
jet1.place(18, 4, gridSize);
playerFleet.push(jet1);

const jet2 = new FighterJet(playerCarrier, () => onUnitDestroyed(jet2));
jet2.place(18, 6, gridSize);
playerFleet.push(jet2);

// Add all fleet meshes to the scene
playerFleet.forEach(unit => scene.add(unit.mesh));

// Create and place the opponent's fleet
const opponentCarrier = new Carrier(() => onUnitDestroyed(opponentCarrier));
opponentCarrier.place(18, 34, gridSize);
opponentCarrier.mesh.material.color.set(0xff6666); // Reddish color
opponentFleet.push(opponentCarrier);

const opponentSub = new Submarine(() => onUnitDestroyed(opponentSub));
opponentSub.place(15, 30, gridSize);
opponentSub.mesh.material.color.set(0xff6666);
opponentFleet.push(opponentSub);

opponentFleet.forEach(unit => scene.add(unit.mesh));

const allUnits = [...playerFleet, ...opponentFleet];

// --- Game Management ---
const uiManager = new UIManager(); // Must be created before GameManager

const gameManager = new GameManager((newState) => {
    // This is the onStateChange callback
    uiManager.updateHUD(newState);
});

uiManager.gameManager = gameManager; // Provide gameManager reference to UI
uiManager.sonarSystem = sonarSystem; // Provide sonarSystem reference to UI

const movementSystem = new MovementSystem(scene, gridSize);
const attackSystem = new AttackSystem(scene, gridSize, gameManager);
const sonarSystem = new SonarSystem(scene, () => [...playerFleet, ...opponentFleet]);

const interactionManager = new InteractionManager(
    camera,
    renderer,
    () => [...playerFleet, ...opponentFleet], // Pass a function to get all current units
    playerFleet,
    gameManager,
    movementSystem,
    attackSystem,
    (unit) => { // This is the onSelectCallback
        uiManager.updateUnitDetails(unit);
    }
);

gameManager.startTurn(); // Kick off the game

// --- Animation Loop ---
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

// Remove the global click listener, it's now handled by InteractionManager

// --- Event Listeners ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();