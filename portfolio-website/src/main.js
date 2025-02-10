import './style.css'
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
const cameraZoomAmount = 1.05;
let zooming = false;
let zoomTween = null;

//Raycaster stuff
const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

//Scene needs
const interactableMeshes = [];
const interactableObjects = [];
const scene = new THREE.Scene();

//Camera
const camera = new THREE.OrthographicCamera(-frustum * aspect,frustum * aspect,frustum,-frustum, 0.1, 150);
// const camera = new THREE.PerspectiveCamera(90, scr.width / scr.height, 0.1, 500);
camera.position.set(30,30,30);
camera.lookAt(0,0,0);
camera.updateProjectionMatrix();
scene.add(camera);

//Renderer
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(scr.width, scr.height);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.setPixelRatio(2);

//OrbitControls used for panning
const minPan = new THREE.Vector3(-1000,0,-1000);
const maxPan = new THREE.Vector3(1000,0,1000);
const _v = new THREE.Vector3(); 

const controls = new OrbitControls(camera, renderer.domElement);
controls.mouseButtons.LEFT = THREE.MOUSE.PAN;
controls.enableZoom = false;
controls.enableRotate = false;

controls.addEventListener('change',(event)=>{
  _v.copy(controls.target);
  controls.target.clamp(minPan,maxPan);
  _v.sub(controls.target);
  camera.position.sub(_v);
})

//Materials
const grassMat = new THREE.MeshStandardMaterial({
  color: "#75d327",
  roughness: 0.9,
  side: THREE.DoubleSide,
});
const blockMat = new THREE.MeshStandardMaterial({
  color: "#27d3c9",
  roughness: 0.1,
  side: THREE.DoubleSide,
});

//Basic Objects
const ground = new BasicMesh(
  scene,
  {geometry: new THREE.PlaneGeometry(1,1), material: grassMat},
  {x:0, y:0, z:0},
  {x:-Math.PI / 2, y:0, z:0},
  {x:1000, y:1000, z:1},
  {castShadow: false, id: "ground"}
);

//Custom Meshes
// const roadScale = 10;
// const road = new BasicMesh(
//   scene,
//   {filepath: "/recs/road.glb"},
//   {x:0, y:1, z:0},
//   {x:0, y:0, z:0},
//   {x:roadScale, y:roadScale, z:roadScale},
//   {id: "road"}
// );

const houseScale = 10;
const modernHouse1 = new BasicMesh(
  scene,
  {filepath: "/recs/modern.glb"},
  // {x:-23, y:0, z:-20},
  {x:0, y:0, z:0},
  {x:0, y:Math.PI, z:0},
  {x:houseScale, y:houseScale, z:houseScale},
  {id: "modernHouse", title: "AHHHHHHHHHHHH", interactables: interactableMeshes}
);
interactableObjects.push(modernHouse1);
console.log("modernHouse1:", modernHouse1);
console.log("interactableMeshes:", interactableMeshes);

//Lights
const factor = 50;
const sun1 = new BasicSun(scene, {x:20 * factor, y:100 * factor, z:-20 * factor}, 0xFFFFEC, 1, 20);
const sun2 = new BasicSun(scene, {x:19 * factor, y:100 * factor, z:-19 * factor}, 0xFFFFEC, 1, 20);
const sun3 = new BasicSun(scene, {x:-5 * factor, y:100 * factor, z:5   * factor}, 0xFFFFEC, 2, 20);

//Render loop
function loop() {
  requestAnimationFrame(loop);
  controls.update();

  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
}
loop();

//Resize scene on window resize
window.addEventListener("resize", () => {
  scr.width = window.innerWidth;
  scr.height = window.innerHeight;

  aspect = scr.width / scr.height;

  camera.left = -frustum * aspect;
  camera.right = frustum * aspect;
  camera.top = frustum;
  camera.bottom = -frustum;
  
  camera.updateProjectionMatrix();
  renderer.setSize(scr.width, scr.height);
})

//Mouse raycasting bs
window.addEventListener("mousemove", (event) => {
  // Convert Mouse Position to Normalized Device Coordinates (-1 to +1)
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Perform Raycasting
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(interactableMeshes, false);

  //Change cursor if hovering over an interactable
  if (intersects.length > 0) {
    document.body.style.cursor = "pointer";
    hoveredID = "";
  }
  if (intersects.length == 0) {
    hoveredID = "";
  }

  //Iterate over all interactable obejcts to do stuff accoding to given conditions
  interactableObjects.forEach(obj => {
    //Check if custom mesh or not by checking if there is userdata (there wont be userdata if it is a standard geometry)
    if (obj.mesh.userData) {
      //If no interactables, run some resets (could be optimized but there wont be that much to iterate over)
      if (intersects.length == 0) {
        document.body.style.cursor = "default"; // Reset cursor
        obj.hideTitle();
        zoomCamera(hoveredID == "" ? 1 : cameraZoomAmount, cameraZoomTime);
      }
      else {
        //If there is something being hovered but its not this one, run some resets
        if (intersects[0].object.userData.parentObject != obj.mesh) {
          obj.hideTitle();
          zoomCamera(hoveredID == "" ? 1 : cameraZoomAmount, cameraZoomTime);
        }
        else {
          //If cursor is hovering over this one, do stuff accordingly
          obj.showTitle(obj.getScreenPosition(camera, renderer).x, obj.getHighestScreenPixel(camera, renderer).y);
          hoveredID = obj.id;
          zoomCamera(hoveredID == "" ? 1 : cameraZoomAmount, cameraZoomTime);
        }
      }
    }
    else {
      //If no interactables, run some resets (could be optimized but there wont be that much to iterate over)
      if (intersects.length == 0) {
        document.body.style.cursor = "default"; // Reset cursor
        obj.hideTitle();
        zoomCamera(hoveredID == "" ? 1 : cameraZoomAmount, cameraZoomTime);
      }
      else {
        //If there is something being hovered but its not this one, run some resets
        if (intersects[0].object != obj.mesh) {
          obj.hideTitle();
          zoomCamera(hoveredID == "" ? 1 : cameraZoomAmount, cameraZoomTime);
        }
        else {
          //If cursor is hovering over this one, do stuff accordingly
          obj.showTitle(obj.getScreenPosition(camera, renderer).x, obj.getHighestScreenPixel(camera, renderer).y, {ratio: renderer.pixelRatio});
          hoveredID = obj.id;
          zoomCamera(hoveredID == "" ? 1 : cameraZoomAmount, cameraZoomTime);
        }
      }
    }

    console.log(hoveredID);
    
  });

  //Dont ask, i need to keep it for later. If i forget to remove it and it stays commented out, dw abt it
  // if (intersects.length == 0) hoveredID = ""; 
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