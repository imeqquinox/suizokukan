import './style.css'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three';

// Scene camera
const scene = new THREE.Scene(); 
scene.background = new THREE.Color(0x79b2e0);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); 
camera.position.z = 5; 

// Renderer
const renderer = new THREE.WebGLRenderer(); 
renderer.setSize(window.innerWidth, window.innerHeight); 
document.body.appendChild(renderer.domElement);

// Lights 
const light = new THREE.AmbientLight(0x404040);
scene.add(light);
const directionalLight = new THREE.DirectionalLight( 0xffffff, 5 );
directionalLight.position.x = 2;
scene.add(directionalLight);

// Load models
const loader = new GLTFLoader(); 

let objToRender; 
let donut;
let cone;
loader.load('/donut.glb', function (gltf) {
    donut = gltf.scene; 
    donut.position.set(0, 0, 0);
    donut.rotation.x = 0.785398;
    donut.rotation.z = -0.523599; 
    //scene.add(donut);
}, undefined, function (error) {
    console.error(error);
}); 
loader.load('/cone.glb', function (gltf) {
    cone = gltf.scene; 
    //scene.add(cone);
}, undefined, function (error) {
    console.log(error);
});

// Render function
function animate() {
    requestAnimationFrame(animate); 

    switch(objToRender) {
        case 'donut': 
            scene.add(donut); 
            break;
        case 'cone':
            scene.add(cone);
            break;
    }

    renderer.render(scene, camera); 
}

// UI button events
let tankBtns = document.getElementsByClassName('tank-btn');
Array.from(tankBtns).forEach(element => {
    element.addEventListener('click', changeTank);
});

function changeTank(e) {
    switch(e.target.name) {
        case 'tank1': 
            objToRender = 'donut';
            break;
        case 'tank2':
            objToRender = 'cone';
            break;
        case 'tank3':
            objToRender = 'cone';
            break;
    }
}

animate();