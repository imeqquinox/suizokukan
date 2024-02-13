import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function initScene() {
    // Create scene 
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x79b2e0);

    // Create camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Create renderer 
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Create controls 
    const controls = new OrbitControls(camera, renderer.domElement);

    // Create lights 
    const light = new THREE.AmbientLight(0x404040); 
    scene.add(light);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
    directionalLight.position.x = 2;
    directionalLight.position.z = 2;
    scene.add(directionalLight);

    return { scene, camera, renderer, controls }; 
}

function resizeScene(renderer, camera) {
    // Update size of renderer and aspect ratio of camera
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight; 
    camera.updateProjectionMatrix();
}

// Handle resizing 
window.addEventListener('resize', function() {
    const { renderer, camera } = initScene();
    resizeScene(renderer, camera);
})