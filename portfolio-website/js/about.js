import '../css/header.css'
import '../css/about.css'
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import {BasicMesh} from "./basicMesh";
import {BasicSun} from "./basicSun";

let scr = {
  width: window.innerWidth,
  height: window.innerHeight
};
let aspect = scr.width / scr.height;
let frustum = 40;
let hoveredID = "";
const cameraZoomTime = 500;
const cameraZoomAmount = 0.85;
const cameraZoomBase = 0.8;
let zooming = false;
let zoomTween = null;

//Raycaster stuff
const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

//Scene needs
const interactableMeshes = [];
const interactableObjects = [];
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

//Camera

const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
camera.position.set(0,0,60);
camera.aspect = aspect;
camera.updateProjectionMatrix();
camera.lookAt(0,0,0);
scene.add(camera);

//Renderer
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(scr.width, scr.height);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.setPixelRatio(2);

//Materials
const planetMat = new THREE.MeshStandardMaterial({
    color: 0x6783bc,
    roughness: 0.5,
    metalness: 0.1,
    // emissive: 0xffffff,
    // emissiveIntensity: 0.1
});

//Basic Objects
const planetSize = 10;
const planet = new BasicMesh (
    scene,
    {geometry: new THREE.SphereGeometry(1, 32, 32), material: planetMat},
    {x:0, y:0, z:0},
    {x:0, y:0, z:0},
    {x:planetSize, y:planetSize, z:planetSize},
    {castShadow: false, id: "planet"}
);

//Lights
const factor = 50;
const sunFrust = 1000;
const light = new THREE.PointLight(0x5506b3, 3000, 100, 2);
light.position.set(-30, -10, -15);
scene.add(light);



// gsap.fromTo(camera.rotation, {x:0, y:0, z:0}, {x:0, y:0, z: 6, duration: 8})

// camera.rotation.z = -3

let targetRotationZ = 0, currentRotationZ = 0;

//Render loop
function loop() {
    requestAnimationFrame(loop);
    renderer.clear();

//   controls.update();
    currentRotationZ += (targetRotationZ - currentRotationZ) * 0.1; // Adjust smoothing factor

    camera.rotation.z = -currentRotationZ;

    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
}
loop();

//Resize scene on window resize
window.addEventListener("resize", () => {
  scr.width = window.innerWidth;
  scr.height = window.innerHeight;

  aspect = scr.width / scr.height;
  camera.aspect = aspect;
  
  camera.updateProjectionMatrix();
  renderer.setSize(scr.width, scr.height);
  renderer.setPixelRatio(2);
})

//Code from chatgpt to find angle of mouse cursor relative to center of screen
window.addEventListener("mousemove", (event) => {
    const width = window.innerWidth;
    const height = window.innerHeight;
  
    // Convert cursor position to centered coordinates
    const x = event.clientX - width / 2;
    const y = -(event.clientY - height / 2);
  
    // Get the new target angle using atan2
    let newAngle = Math.atan2(y, x);
  
    // Compute shortest path to avoid sudden 360° jumps
    let delta = newAngle - targetRotationZ;
  
    // Handle crossing of the -π to π boundary smoothly
    delta = ((delta + Math.PI) % (2 * Math.PI)) - Math.PI;
  
    // Accumulate the continuous rotation
    targetRotationZ += delta;
});

//Code from chatgpt uses gsap to animate changing camera zoom amount
function zoomCamera(targetZoom, duration) {
  if (zoomTween) {
    zoomTween.kill(); // Stop the previous animation instantly
  }

  zoomTween = gsap.to(camera, {
    zoom: targetZoom,
    duration: duration / 1000, // gsap uses seconds
    onUpdate: () => {
      camera.updateProjectionMatrix();
    },
    onComplete: () => {
      zooming = false;
    }
  });

  zooming = true;
}

window.addEventListener("mouseup", () => {
  
})

function fadeToPage(page) {
  const fadeOverlay = document.getElementById("fadeOverlay");
      fadeOverlay.style.opacity = "1"; // Start fade to black
      setTimeout(() => {
        window.location.href = "" + page + ".html";
            }, 1000); // Match the transition time (1s)
  
}