import '../css/header.css'
import '../css/style.css'
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
const lookAtTarget = new THREE.Vector3(0,100,0);
const lookAtGroundRotation = new THREE.Vector3(-.785, .615, .524);
const lookAtSkyRotation = new THREE.Vector3(1.166, .375, -.707);

//Raycaster stuff
const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

//Scene needs
const interactableMeshes = [];
const interactableObjects = [];
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

//Camera
const camera = new THREE.OrthographicCamera(-frustum * aspect, frustum * aspect, frustum, -frustum, 0.1, 200);
// const camera = new THREE.PerspectiveCamera(90, scr.width / scr.height, 0.1, 500);
camera.position.set(30,30,30);
// camera.rotation.set(lookAtSkyRotation.x, lookAtSkyRotation.y, lookAtSkyRotation.z);
camera.lookAt(0,0,0);
camera.zoom = cameraZoomBase;
camera.left = -frustum * aspect / camera.zoom;
camera.right = frustum * aspect / camera.zoom;
camera.top = frustum * aspect;
camera.bottom = -frustum / aspect;
camera.updateProjectionMatrix();
scene.add(camera);
console.log(camera.rotation);

//Renderer
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(scr.width, scr.height);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setPixelRatio(2);

//OrbitControls used for panning
const minPan = new THREE.Vector3(-1000,0,-1000);
const maxPan = new THREE.Vector3(1000,0,1000);
const _v = new THREE.Vector3(); 

//Materials
const grassMat = new THREE.MeshStandardMaterial({
  color: "#75d327",
  roughness: 0.9,
  side: THREE.DoubleSide,
});

//Basic Objects
const ground = new BasicMesh(
  scene,
  {geometry: new THREE.PlaneGeometry(1,1), material: grassMat},
  {x:0, y:0, z:0},
  {x:-Math.PI / 2, y:0, z:0},
  {x:1000, y:1000, z:1},
  {castShadow: false, id: "ground", receiveShadow: true}
);

const houseScale = 10;
const modernHouse1 = new BasicMesh(
  scene,
  {filepath: "./recs/models/modernHouse1.glb"},
  // {x:-23, y:0, z:-20},
  {x:0, y:0, z:0},
  {x:0, y:Math.PI, z:0},
  {x:houseScale, y:houseScale, z:houseScale},
  {id: "modernHouse", title: "About", interactables: interactableMeshes}
);
interactableObjects.push(modernHouse1);

const cuteLilHouse = new BasicMesh(
  scene,
  {filepath: "./recs/models/cuteLilHouse.glb"},
  // {x:-23, y:0, z:-20},
  {x:20, y:0, z:-46},
  {x:0, y:Math.PI / 2, z:0},
  {x:houseScale, y:houseScale, z:houseScale},
  {id: "cuteLilHouse", title: "Projects", interactables: interactableMeshes}
);
interactableObjects.push(cuteLilHouse);

const joovieScale = 4;
const joovie = new BasicMesh(
  scene,
  {filepath: "./recs/models/joovie.glb"},
  {x:20, y:6, z:0},
  {x:0, y:0, z:0},
  {x:joovieScale, y:joovieScale, z:joovieScale},
  {id: "joovie"}
);

//Lights
const factor = 50;
const sunFrust = 1000;
const sun1 = new BasicSun(scene, {x:20  * factor, y:100 * factor, z:-20 * factor}, 0xFFFFEC, 1, sunFrust);
const sun2 = new BasicSun(scene, {x:19  * factor, y:100 * factor, z:-19 * factor}, 0xFFFFEC, 1, sunFrust);
const sun3 = new BasicSun(scene, {x:-5  * factor, y:100 * factor, z:5   * factor}, 0xFFFFEC, 2, sunFrust);
const sun4 = new BasicSun(scene, {x:-10 * factor, y:100 * factor, z:20  * factor}, 0xFFFFEC, 2, sunFrust);

//Render loop
function loop() {
  requestAnimationFrame(loop);
  renderer.clear();

  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
}
loop();

//Resize scene on window resize
window.addEventListener("resize", () => {
  scr.width = window.innerWidth;
  scr.height = window.innerHeight;

  aspect = scr.width / scr.height;

  camera.left = -frustum * aspect / camera.zoom;
  camera.right = frustum * aspect / camera.zoom;
  camera.top = frustum / camera.zoom;
  camera.bottom = -frustum / camera.zoom / aspect;
  
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
        zoomCamera(hoveredID == "" ? cameraZoomBase : cameraZoomAmount, cameraZoomTime);
      }
      else {
        //If there is something being hovered but its not this one, run some resets
        if (intersects[0].object.userData.parentObject != obj.mesh) {
          obj.hideTitle();
          zoomCamera(hoveredID == "" ? cameraZoomBase : cameraZoomAmount, cameraZoomTime);
        }
        else {
          //If cursor is hovering over this one, do stuff accordingly
          obj.showTitle(obj.getScreenPosition(camera, renderer).x, obj.getHighestScreenPixel(camera, renderer).y);
          hoveredID = obj.id;
          zoomCamera(hoveredID == "" ? cameraZoomBase : cameraZoomAmount, cameraZoomTime);
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

window.addEventListener("mouseup", () => {
  //Makes camera look up into sky when about house is clicked
  let lookAtPoint = new THREE.Vector4(0,0,0,30);
  if (hoveredID == "modernHouse") {
    document.getElementById("objectTitle").remove();
    gsap.to(lookAtPoint, {
      x: 0,
      y: 100,
      z: 0,
      w: 70,
      duration: 2,
      ease: "back.in(1.5)",
      onUpdate: () => {
        camera.lookAt(lookAtPoint.x, lookAtPoint.y, lookAtPoint.z);
        camera.position.y = lookAtPoint.w;
        camera.updateProjectionMatrix();
        renderer.render(scene, camera);
      }
    });
  }
  if (hoveredID == "cuteLilHouse") {
    // fadeToPage("projects");
  }
});

function fadeToPage(page) {
  const fadeOverlay = document.getElementById("fadeOverlay");
      fadeOverlay.style.opacity = "1"; // Start fade to black
      setTimeout(() => {
        window.location.href = "" + page + ".html";
            }, 1000); // Match the transition time (1s)
  
}