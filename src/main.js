import './style.css'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';

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

let currentModel; 
let donut;
let cone;
let ball;
loader.load('/donut.glb', function(gltf) {
    donut = gltf.scene; 
    donut.position.set(0, 0, 0);
    donut.rotation.x = 0.785398;
    donut.rotation.z = -0.523599; 
    currentModel = donut;
    scene.add(currentModel);
}, undefined, function(error) {
    console.error(error);
}); 
loader.load('/cone.glb', function(gltf) {
    cone = gltf.scene; 
}, undefined, function(error) {
    console.log(error);
});
loader.load('/ball.glb', function(gltf) {
    ball = gltf.scene; 
}, undefined, function(error) {
    console.error(error);
});
 
// Phyiscs world
const world = new CANNON.World({gravity: new CANNON.Vec3(0,-9.82, 0)});
const sphereBody = new CANNON.Body({
    mass: 2.5, 
    shape: new CANNON.Sphere(1)
});

const mouse = new THREE.Vector2();
const intersectionPoint = new THREE.Vector3();
const planeNormal = new THREE.Vector3(); 
const plane = new THREE.Plane();
const raycaster = new THREE.Raycaster();
// Mouse position for raycast 
window.addEventListener('mousemove', function(e) {
    mouse.x = (e.clientX / this.window.innerWidth) * 2 - 1; 
    mouse.y = -(e.clientY / this.window.innerHeight) * 2 + 1;
    planeNormal.copy(camera.position).normalize(); 
    plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position); 
    raycaster.setFromCamera(mouse, camera); 
    raycaster.ray.intersectPlane(plane, intersectionPoint);
});

const sphereGeo = new THREE.SphereGeometry(0.125, 30, 30);
const sphereMat = new THREE.MeshStandardMaterial({
    color: 0xFFEA00, 
    metalness: 0, 
    roughness: 0
});
const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
// On screen click add ball with phyics
window.addEventListener('click', function(e) {
    sphereBody.velocity.set(0, 0, 0);
    sphereBody.position.copy(intersectionPoint);
    world.addBody(sphereBody);

    scene.add(sphereMesh);
    sphereMesh.position.copy(intersectionPoint);
})

// Render function
function animate() {
    requestAnimationFrame(animate); 

    sphereMesh.position.copy(sphereBody.position);
    sphereMesh.quaternion.copy(sphereBody.quaternion);

    world.fixedStep();
    renderer.render(scene, camera); 
}

// UI button events
let tankBtns = document.getElementsByClassName('tank-btn');
Array.from(tankBtns).forEach(element => {
    element.addEventListener('click', changeTank);
});

function changeTank(e) {
    scene.remove(currentModel);

    switch(e.target.name) {
        case 'tank1': 
            currentModel = donut;
            break;
        case 'tank2':
            currentModel = cone;
            break;
        case 'tank3':
            currentModel = ball;
            break;
    }

    scene.add(currentModel);
}

animate();