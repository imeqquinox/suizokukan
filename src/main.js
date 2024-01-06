import './style.css'
import * as THREE from 'three';

const scene = new THREE.Scene(); 
scene.background = new THREE.Color(0x79b2e0);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); 

const renderer = new THREE.WebGLRenderer(); 
renderer.setSize(window.innerWidth, window.innerHeight); 
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xb58551 });
const shape = new THREE.Mesh(geometry, material); 
scene.add(shape); 

camera.position.z = 5; 

function animate() {
    requestAnimationFrame(animate); 

    shape.rotation.x += 0.01; 
    shape.rotation.y += 0.01; 

    renderer.render(scene, camera); 
}

let tankBtns = document.getElementsByClassName('tank-btn');
Array.from(tankBtns).forEach(element => {
    element.addEventListener('click', changeTank);
});

function changeTank(e) {
    switch(e.target.name) {
        case 'tank1': 
            shape.geometry = new THREE.SphereGeometry(1);
            break;
        case 'tank2':
            shape.geometry = new THREE.BoxGeometry(1, 1, 1);
            break;
        case 'tank3':
            shape.geometry = new THREE.IcosahedronGeometry(1, 1);
            break;
    }
}

animate();