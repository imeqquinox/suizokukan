import './style.css'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';

// Scene camera
const scene = new THREE.Scene(); 
scene.background = new THREE.Color(0x79b2e0);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); 
camera.position.z = 5; 

// Renderer
const renderer = new THREE.WebGLRenderer(); 
renderer.setSize(window.innerWidth, window.innerHeight); 
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);

// Lights 
const light = new THREE.AmbientLight(0x404040);
scene.add(light);
const directionalLight = new THREE.DirectionalLight( 0xffffff, 5 );
directionalLight.position.x = 2;
directionalLight.position.z = 2;
scene.add(directionalLight);

// Phyiscs world
const world = new CANNON.World({gravity: new CANNON.Vec3(0,-9.82, 0)});
// Physics debugger
const cannonDebugger = new CannonDebugger(scene, world);

// Load models
const loader = new GLTFLoader(); 

let rocksModels = [];
for (let i = 0; i < 5; i++) {
    loader.load('/rocks/rock' + (i + 1) +'.glb', function(gltf) {
        // Scale imported models down
        gltf.scene.scale.set(0.1, 0.1, 0.1);
        rocksModels[i] = gltf.scene;
    }, undefined, function(error) {
        console.error(error);
    })
}

let currentModel; 
let tank1;
loader.load('/tank1.glb', function(gltf) {
    // Glass material
    gltf.scene.traverse((child) => {
        if (child.isMesh) {
            child.material = new THREE.MeshPhysicalMaterial({
                color: 0xffffff,
                roughness: 0,
                metalness: 0,
                transmission:  1.0, // Set to  1.0 for full transparency
                reflectivity:  0.8, // Controls the strength of the refraction effect
                opacity:  0.0, // Should be  1.0 when transmission is non-zero
                ior:  1.45, // Index of Refraction, adjust to match the glass you want to mimic
                thickness:  0.01, // Adjust as needed for the thickness of your glass
            });
        }
    })

    gltf.scene.scale.set(0.5, 0.5, 0.5);
    tank1 = gltf.scene;
    currentModel = tank1;
    scene.add(currentModel);
    
    // Physics bodies
    const leftWall = new CANNON.Body({
        shape: new CANNON.Box(new CANNON.Vec3(0.1, 1, 1)),
        type: CANNON.Body.STATIC
    });
    const rightWall = new CANNON.Body({
        shape: new CANNON.Box(new CANNON.Vec3(0.1, 1, 1)),
        type: CANNON.Body.STATIC
    });
    const frontWall = new CANNON.Body({
        shape: new CANNON.Box(new CANNON.Vec3(2, 1, 0.1)),
        type: CANNON.Body.STATIC
    });
    const backWall = new CANNON.Body({
        shape: new CANNON.Box(new CANNON.Vec3(2, 1, 0.1)),
        type: CANNON.Body.STATIC
    });
    // Position bodies 
    world.addBody(leftWall);
    world.addBody(rightWall);
    world.addBody(frontWall);
    world.addBody(backWall);
    leftWall.position.set(-2, 1, 0);
    rightWall.position.set(2, 1, 0);
    frontWall.position.set(0, 1, 1);
    backWall.position.set(0, 1, -1);

}, undefined, function(error) {
    console.error(error);
});
// Tank base
loader.load('tankBase1.glb', function(gltf) {
    gltf.scene.scale.set(0.5, 0.5, 0.5);
    scene.add(gltf.scene);

    const body = new CANNON.Body({
        shape: new CANNON.Box(new CANNON.Vec3(2, 1, 1)),
        type: CANNON.Body.STATIC
    });
    world.addBody(body);
    body.position.set(0, -1, 0);
}, undefined, function(error) {
    console.error(error);
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

const rocks = [];
const rockBodies = []; 
// On screen click add balls with phyics
window.addEventListener('click', function(e) {
    // Don't spawn balls on UI buttons
    if (e.target.className == 'tank-btn' || e.target.className == 'dropDown-btn')
        return;

    const rockBody = new CANNON.Body({
        mass: 2.5, 
        shape: new CANNON.Sphere(0.062)
    });
    rockBody.position.copy(intersectionPoint);
    rockBodies.push(rockBody);
    world.addBody(rockBodies[rockBodies.length - 1]);
    
    const rockMesh = rocksModels[Math.floor(Math.random() * 5)].clone();
    rockMesh.position.copy(intersectionPoint);
    rocks.push(rockMesh);
    scene.add(rocks[rocks.length - 1]);
})

function isObjectOutsideCameraView(mesh, camera) {
    let frustum = new THREE.Frustum();
    let projScreenMatrix = new THREE.Matrix4();
    projScreenMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    frustum.setFromProjectionMatrix(projScreenMatrix); 
    return !frustum.intersectsObject(mesh); 
}

// Render function
function animate() {
    requestAnimationFrame(animate); 

    for (let i = 0; i < rocks.length; i++) {
        if (rocks[i] && rockBodies[i]) {
            rocks[i].position.copy(rockBodies[i].position);
            rocks[i].quaternion.copy(rockBodies[i].quaternion);
            
            //Object has fallen, remove from array
            if (isObjectOutsideCameraView(rocks[i].children[0], camera)) {
                rocks.splice(i, 1);
                rockBodies.splice(i, 1);
            }
        }
    }

    world.fixedStep();
    cannonDebugger.update();
    controls.update();
    renderer.render(scene, camera); 
}

window.toggleDropDown = function(dropdown) { 
    let dropdowns = document.getElementsByClassName('dropdown-content');

    for (let i = 0; i < dropdowns.length; i++) {
        dropdowns[i].classList.remove('show');
    }

    document.getElementById(dropdown).classList.toggle('show');
}

// Close dropdown
window.onclick = function(e) {
    if (!e.target.matches('.dropDown-btn')) {
        let dropdowns = document.getElementsByClassName('dropdown-content');
        for (let i = 0; i < dropdowns.length; i++) {
            let openDropdown = dropdowns[i]; 
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

// UI button events
let tankBtns = document.getElementsByClassName('tank-btn');
Array.from(tankBtns).forEach(element => {
    element.addEventListener('click', changeTank);
});

function changeTank(e) {
    // scene.remove(currentModel);

    // switch(e.target.name) {
    //     case 'tank1': 
    //         currentModel = tank1;
    //         break;
    //     case 'tank2':
    //         currentModel = cone;
    //         break;
    //     case 'tank3':
    //         currentModel = ball;
    //         break;
    // }

    // scene.add(currentModel);
}

animate();