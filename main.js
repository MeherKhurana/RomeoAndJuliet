import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 1, 0); // Set position to point from the top
scene.add(directionalLight);

// Create an ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);


// Load the model
const loader = new GLTFLoader();
loader.load(
    'model/scene.gltf',
    function (gltf) {
        const model = gltf.scene;
        scene.add(model);
        model.position.set(0, 0, 0);
        model.scale.set(0.015, 0.015, 0.015);
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        console.log('An error happened', error);
    }
);
let coolman; 
loader.load(
    'cool_man/scene.gltf',
    function (gltf) {
        coolman = gltf.scene;
        scene.add(coolman);
        coolman.position.set(800, 0, -300);
        coolman.scale.set(30, 30, 30);
        coolman.rotateY(-Math.PI / 2); 
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        console.log('An error happened', error);
    }
);
// Create pointer lock controls
const controls = new PointerLockControls(camera, document.body);

// Event listener to lock controls on click
document.addEventListener('click', () => {
    controls.lock();
});

// Keyboard event listeners
const keyboard = {};
document.addEventListener('keydown', (event) => {
    keyboard[event.key] = true;
});
document.addEventListener('keyup', (event) => {
    keyboard[event.key] = false;
});

// Set initial player position
const player = {
    position: new THREE.Vector3(480, 181, -250)
};
camera.position.copy(player.position);

let startTime = Date.now();
const transitionDuration = 2 * 60 ; // 2 minutes in milliseconds
const initialColor = new THREE.Color(0x00FFFF); // Neon blue
const targetColor = new THREE.Color(0x000000); // Black


// Movement speed
const movementSpeed = 1;

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Movement controls
    const direction = new THREE.Vector3();

    if (keyboard['a']) direction.z -= 0.001;
    if (keyboard['d']) direction.z += 0.001;
    if (keyboard['s']) direction.x -= 0.001;
    if (keyboard['w']) direction.x += 0.001;
    if (keyboard['e']) camera.position.y += movementSpeed;
    if (keyboard['r']) camera.position.y -= movementSpeed;

    // Normalize direction vector to ensure consistent speed in all directions
    direction.normalize();
    const coolManSpeed = 0.0002; // Adjust the speed as needed
    const coolManDirection = new THREE.Vector3(-1.5, 1, 0); // Move forward in the negative z-direction
    coolManDirection.normalize();
    const coolManMovement = coolManDirection.multiplyScalar(coolManSpeed);
    const duration = 15000; // 15 seconds in milliseconds
    let coolmanMoveInterval;
    
    // Function to move coolman
    function moveCoolMan() {
        coolman.position.add(coolManMovement);
    }
    
    // Function to stop coolman movement and set its position
    function stopCoolMan() {
        coolman.position.set(600, 130, -300);
        clearInterval(coolmanMoveInterval);
    }

    
    // Start moving coolman and track elapsed time
    let startTime = Date.now();
    coolmanMoveInterval = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime < duration) {
            moveCoolMan();
        } else {
            stopCoolMan();
        }
    }, coolManSpeed * 1000); // Adjusting to milliseconds
    
    
    

     // Calculate elapsed time
     const elapsedTime1 = Date.now() - startTime;
    
     // Calculate progress of transition
     const progress = Math.min(elapsedTime1 / transitionDuration, 1);
     

     // Interpolate background color
     const newColor = initialColor.clone().lerp(targetColor, progress);

     console.log(progress)

     renderer.setClearColor(newColor);
     
    // Apply movement to camera position
    camera.position.add(direction.multiplyScalar(movementSpeed));

    // Render scene
    renderer.render(scene, camera);
}

// Start animation loop
animate();
