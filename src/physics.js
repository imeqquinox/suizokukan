import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';

let world;

export function initPhysics() {
    // Init world physics
    world = new CANNON.World({gravity: new CANNON.Vec3(0,-9.82, 0)});
    return world;
}

export function initPhysicsDebugger(scene, world) {
    let debugMeshes = []; 
    let isDebugging = false; 
    const cannonDebugger = new CannonDebugger(scene, world, {
        onInit(body, mesh) {
            debugMeshes.push(mesh);
        }
    });
    return { debugMeshes, isDebugging, cannonDebugger };
}

export function initTank1Walls() {
    // Store tank 1 wall position and sizes
    const wallOptions = [
        { size: new CANNON.Vec3(0.1, 1, 1), position: new CANNON.Vec3(-2, 1, 0) },
        { size: new CANNON.Vec3(0.1, 1, 1), position: new CANNON.Vec3(2, 1, 0) },
        { size: new CANNON.Vec3(2, 1, 0.1), position: new CANNON.Vec3(0, 1, 1) },
        { size: new CANNON.Vec3(2, 1, 0.1), position: new CANNON.Vec3(0, 1, -1) },
    ]

    wallOptions.forEach(option => {
        const wall = new CANNON.Body({
            shape: new CANNON.Box(option.size),
            type: CANNON.Body.STATIC
        });
        world.addBody(wall);
        wall.position.copy(option.position);
    })

    // Tank 1 base box
    const tank1BaseBody = new CANNON.Body({
        shape: new CANNON.Box(new CANNON.Vec3(2, 1, 1)),
        type: CANNON.Body.STATIC
    });
    world.addBody(tank1BaseBody);
    body.position.set(0, -1, 0);
}

export function createRockBodies() {

}