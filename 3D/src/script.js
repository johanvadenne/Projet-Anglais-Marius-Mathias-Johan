import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff); // Blanc

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(5, 2, -40);



// Renderer
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('webgl') });
renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI / 2;
controls.minDistance = 1;
controls.maxDistance = 20;


// Loaders
const gltfLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('node_modules/three/addons/loaders/draco/');
gltfLoader.setDRACOLoader(dracoLoader);

// Model and Animation
let ratModel;
let mixer;

// Après le chargement du modèle dans gltfLoader.load

gltfLoader.load('test_rat.glb', (gltf) => {
    ratModel = gltf.scene;
    mixer = new THREE.AnimationMixer(ratModel);

    // Charger toutes les animations du fichier GLB
    gltf.animations.forEach((clip) => {
        const action = mixer.clipAction(clip);
        action.play();
    });

    // Position, rotation, et échelle du modèle
    ratModel.position.set(0, 0, 0); // Définir la position du modèle
    ratModel.rotation.set(0, Math.PI / 2, 0); // Définir la rotation du modèle
    ratModel.scale.set(1, 1, 1); // Définir l'échelle du modèle (1, 1, 1) signifie pas de changement d'échelle

    scene.add(ratModel);
});

// Boutons pour contrôler l'animation
const playButton = document.getElementById('playButton');
const pauseButton = document.getElementById('pauseButton');
const resetButton = document.getElementById('resetButton');

// Écouteurs d'événements pour les boutons
playButton.addEventListener('click', playAnimation);
pauseButton.addEventListener('click', pauseAnimation);
resetButton.addEventListener('click', resetAnimation);

function playAnimation() {
    if (mixer) {
        mixer.timeScale = 1.0; // Réglez le facteur de vitesse du mixer à 1 (vitesse normale)
        mixer.unPauseAllAction(); // Reprendre toutes les actions du mixer
    }
}

function pauseAnimation() {
    if (mixer) {
        mixer.timeScale = 0.0; // Réglez le facteur de vitesse du mixer à 0 (pause)
    }
}

function resetAnimation() {
    if (mixer) {
        mixer.setTime(0); // Remettez le temps du mixer à 0 pour réinitialiser l'animation
    }
}

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(0,2,0);
scene.add(pointLight);

function animate() {
    requestAnimationFrame(animate);

    // Mettez à jour l'animation
    if (mixer) {
        mixer.update(0.01); // Ajustez le temps en fonction de la vitesse de votre animation
    }

    // Mettez à jour les contrôles de la caméra
    controls.update();

    renderer.render(scene, camera);
}


// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);

// Start the animation loop
animate();
