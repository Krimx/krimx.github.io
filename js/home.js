import '../css/header.css'
import '../css/home.css'
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import {BasicMesh} from "./basicMesh";
import {BasicSun} from "./basicSun";
import * as Content from "./contentLoader.js";

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
const cameraBasePosition = new THREE.Vector3(30,30,30);
const cameraSkyPosition = new THREE.Vector3(30,100,30);
const cameraProjectsPosition = new THREE.Vector3(30,60,30);
const lookAtSkyPoint = new THREE.Vector3(0,100,0);
const lookAtGroundPoint = new THREE.Vector3(0,0,0);
const lookAtProjectsPoint = new THREE.Vector3(100,0,100);
let cameraAngle = new THREE.Euler(0,0,0);
let lookingAt = "ground";
let hoveringOverCards = false;
const moreProjectsPoint = new THREE.Vector3(130, 0.1, 70);

//Raycaster stuff
const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

//Scene needs
const interactableMeshes = [];
const interactableObjects = [];
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x00000f);

//Camera
const camera = new THREE.OrthographicCamera(-frustum * aspect, frustum * aspect, frustum, -frustum / aspect, -50, 400);
// const camera = new THREE.PerspectiveCamera(90, scr.width / scr.height, 0.1, 500);
camera.position.set(cameraBasePosition.x, cameraBasePosition.y, cameraBasePosition.z);
camera.lookAt(0,0,0);
camera.zoom = cameraZoomBase;
camera.left = -frustum * aspect / camera.zoom;
camera.right = frustum * aspect / camera.zoom;
camera.top = frustum / camera.zoom;
camera.bottom = -frustum / camera.zoom;
camera.updateProjectionMatrix();
scene.add(camera);

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


setupCuldesac();

//Lights
const factor = 50;
const sunFrust = 1000;
const sun1 = new BasicSun(scene, {x:20  * factor, y:100 * factor, z:-20 * factor}, 0xFFFFEC, 1, sunFrust);
const sun2 = new BasicSun(scene, {x:19  * factor, y:100 * factor, z:-19 * factor}, 0xFFFFEC, 1, sunFrust);
const sun3 = new BasicSun(scene, {x:-5  * factor, y:100 * factor, z:5   * factor}, 0xFFFFEC, 2, sunFrust);
const sun4 = new BasicSun(scene, {x:-10 * factor, y:100 * factor, z:20  * factor}, 0xFFFFEC, 2, sunFrust);
const sun5 = new BasicSun(scene, {x:100 * factor, y:100 * factor, z:200  * factor}, 0xFFFFEC, .3, sunFrust);

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
      camera.left = -frustum * aspect / camera.zoom;
      camera.right = frustum * aspect / camera.zoom;
      camera.top = frustum / camera.zoom;
      camera.bottom = -frustum / camera.zoom;
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
  if (hoveredID == "modernHouse") {
    lookUpToSky();
  }
  if (hoveredID == "cuteLilHouse") {
    lookAtProjectsPage();
  }
  if (hoveredID == "circuits") {
    console.log("Passed");
  }
  if (hoveredID == "more") {
    goToMoreProjects();
  }
});

function fadeToPage(page) {
  const fadeOverlay = document.getElementById("fadeOverlay");
      fadeOverlay.style.opacity = "1"; // Start fade to black
      setTimeout(() => {
        window.location.href = "" + page + ".html";
            }, 1000); // Match the transition time (1s)
  
}

function lookUpToSky() {
  let lookAtPoint = new THREE.Vector4(lookAtGroundPoint.x, lookAtGroundPoint.y, lookAtGroundPoint.z, cameraBasePosition.y);
  document.getElementById("objectTitle").remove();
  lookingAt = "sky";
  gsap.to(lookAtPoint, {
    x: lookAtSkyPoint.x,
    y: lookAtSkyPoint.y,
    z: lookAtSkyPoint.z,
    w: cameraSkyPosition.y,
    duration: 1.3,
    ease: "back.in(1.0)",
    onUpdate: () => {
      camera.lookAt(lookAtPoint.x, lookAtPoint.y, lookAtPoint.z);
      camera.position.y = lookAtPoint.w;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    },
    onComplete: () => {
      Content.loadAboutContent();
    }
  });
}
window.lookBackDown = function() {
  if (lookingAt == "sky") {
    Content.unloadAboutContent();
    setTimeout(() => {
      let lookAtPoint = new THREE.Vector4(lookAtSkyPoint.x, lookAtSkyPoint.y, lookAtSkyPoint.z, cameraSkyPosition.y);
      lookingAt = "ground";
      gsap.to(lookAtPoint, {
        x: lookAtGroundPoint.x,
        y: lookAtGroundPoint.y,
        z: lookAtGroundPoint.z,
        w: cameraBasePosition.y,
        duration: 2,
        ease: "back.out(1.5)",
        onUpdate: () => {
          camera.lookAt(lookAtPoint.x, lookAtPoint.y, lookAtPoint.z);
          camera.position.y = lookAtPoint.w;
          camera.updateProjectionMatrix();
          renderer.render(scene, camera);
        }
      });
    }, 750);
  }
  else if (lookingAt == "projects") {
    Content.unloadProjectsContent();
    setTimeout(() => {
      let lookAtPoint = new THREE.Vector4(lookAtProjectsPoint.x, lookAtProjectsPoint.y, lookAtProjectsPoint.z, cameraProjectsPosition.y);
      lookingAt = "ground";
      gsap.to(lookAtPoint, {
        x: lookAtGroundPoint.x,
        y: lookAtGroundPoint.y,
        z: lookAtGroundPoint.z,
        w: cameraBasePosition.y,
        duration: 2,
        ease: "back.out(1.5)",
        onUpdate: () => {
          camera.lookAt(lookAtPoint.x, lookAtPoint.y, lookAtPoint.z);
          camera.position.y = lookAtPoint.w;
          camera.updateProjectionMatrix();
          renderer.render(scene, camera);
        }
      });
    }, 0);
  }
}

let userOS = "";
async function getOS() {
  if (navigator.userAgentData) {
      const data = await navigator.userAgentData.getHighEntropyValues(["platform"]);
      return data.platform.toLowerCase().includes("mac") ? "macOS" :
             data.platform.toLowerCase().includes("win") ? "Windows" : "Unknown";
  } else {
      return getOSFallback(); // Fallback for older browsers
  }
}

getOS().then(os => userOS = os);

let rotation = 0;
let rotationSpeed = 0.1;
let rotationInvert = 1;
window.addEventListener("wheel", (event) => {
  rotateCardWheel();
});

document.addEventListener("DOMContentLoaded", () => {
  cardWheelSetup();
});

function cardWheelSetup() {
  const parent = document.querySelector(".card-wheel");
  const children = document.querySelectorAll(".wheel-item");

  const parentSize = parent.clientWidth; // Parent's width/height (since it's a circle)
  const parentRadius = parentSize / 2;  // Parent's radius
  const radius = parentRadius - 25;     // Distance from center to child (adjust for better spacing)
  const angleStep = (2 * Math.PI) / children.length; // Equal spacing for children

  children.forEach((child, index) => {
      const angle = angleStep * index; // Calculate angle for each child
      const x = parentRadius + radius * Math.cos(angle) - child.clientWidth / 2;
      const y = parentRadius + radius * Math.sin(angle) - child.clientHeight / 2;

      child.style.left = `${x}px`;
      child.style.top = `${y}px`;

      const rotation = angle * (180 / Math.PI);

      child.style.transform = "rotate(" + rotation + "deg)";
  });

  const wheel = document.querySelector(".card-wheel");

  wheel.addEventListener("mouseenter", () => {
      hoveringOverCards = true;
  });

  wheel.addEventListener("mouseleave", () => {
    hoveringOverCards = false;
  });
}

function rotateCardWheel() {
  if (lookingAt == "sky" && hoveringOverCards) {
    if (userOS == "macOS") rotationInvert = -1;
    rotation += event.deltaY * rotationSpeed * rotationInvert;
    if (rotation >= 360) rotation -= 360;
    if (rotation <= -360) rotation += 360;
    document.getElementById("card-wheel").style.transform = "rotate(" + rotation + "deg)";
  }
}

function setupCuldesac() {
  const culdesacScale = 65;
  const culdesac = new BasicMesh(
    scene,
    {filepath: "./recs/models/culdesac.glb"},
    {x: 20, y: 0.001, z: 20},
    {x: 0, y: 0, z: 0},
    {x:culdesacScale, y:culdesacScale, z:culdesacScale},
    {id: "culdesac"}
  );

  const houseScale = 10;
  const modernHouse1 = new BasicMesh(
    scene,
    {filepath: "./recs/models/modernHouse1.glb"},
    // {x:-23, y:0, z:-20},
    {x:-60, y:0, z:0},
    {x:0, y:Math.PI - .25, z:0},
    {x:houseScale, y:houseScale, z:houseScale},
    {id: "modernHouse", title: "About", interactables: interactableMeshes}
  );
  interactableObjects.push(modernHouse1);
  
  const cuteLilHouse = new BasicMesh(
    scene,
    {filepath: "./recs/models/cuteLilHouse.glb"},
    // {x:-23, y:0, z:-20},
    {x:0, y:0, z:-61},
    {x:0, y:Math.PI / 2 + .2, z:0},
    {x:houseScale, y:houseScale, z:houseScale},
    {id: "cuteLilHouse", title: "Projects", interactables: interactableMeshes}
  );
  interactableObjects.push(cuteLilHouse);
  
  const forestScale = 2;
  const forest = new BasicMesh(
    scene,
    {filepath: "./recs/models/forest.glb"},
    {x:-150, y:10, z:-70},
    {x:0, y:.5, z:0},
    {x:forestScale, y:forestScale, z:forestScale},
    {id: "forest"}
  );

  placeSkills();
  placeProjects();
}

function placeSkills() {
  const skillScale = 4;
  const skillHeight = -3
  const css = new BasicMesh(
    scene,
    {filepath: "./recs/models/skillStones/css.glb"},
    {x: -48, y: skillHeight, z: -22},
    {x: 0, y: -.5, z: 0},
    {x:skillScale, y:skillScale, z:skillScale},
    {id: "css"}
  );

  const html = new BasicMesh(
    scene,
    {filepath: "./recs/models/skillStones/html.glb"},
    {x: -37, y: skillHeight, z: -36},
    {x: 0, y: -.8, z: 0},
    {x:skillScale, y:skillScale, z:skillScale},
    {id: "html"}
  );

  const js = new BasicMesh(
    scene,
    {filepath: "./recs/models/skillStones/javascript.glb"},
    {x: -23, y: skillHeight, z: -47},
    {x: 0, y: -1, z: 0},
    {x:skillScale, y:skillScale, z:skillScale},
    {id: "js"}
  );

  const java = new BasicMesh(
    scene,
    {filepath: "./recs/models/skillStones/java.glb"},
    {x: -58, y: skillHeight, z: 23},
    {x: 0, y: 0, z: 0},
    {x:skillScale, y:skillScale, z:skillScale},
    {id: "java"}
  );

  const vscode = new BasicMesh(
    scene,
    {filepath: "./recs/models/skillStones/vscode.glb"},
    {x: 20, y: skillHeight, z: -60},
    {x: 0, y:-1.5, z: 0},
    {x:skillScale, y:skillScale, z:skillScale},
    {id: "vscode"}
  );

  const eclipse = new BasicMesh(
    scene,
    {filepath: "./recs/models/skillStones/eclipse.glb"},
    {x: 35, y: skillHeight, z: -59},
    {x: 0, y:-1.7, z: 0},
    {x:skillScale, y:skillScale, z:skillScale},
    {id: "eclipse"}
  );
}

function placeProjects() {
  const circuitsScale = 10;
  const circuits = new BasicMesh(
    scene,
    {filepath: "./recs/models/projects/circuits.glb"},
    {x: 100, y: 0, z: 110},
    {x: 0, y: 3.4, z: 0},
    {x:circuitsScale, y:circuitsScale, z:circuitsScale},
    {id: "circuits", title: "Circuits", interactables: interactableMeshes}
  );
  interactableObjects.push(circuits);
  
  const moreScale = 10;
  const more = new BasicMesh(
    scene,
    {filepath: "./recs/models/projects/more.glb"},
    {x: moreProjectsPoint.x, y: moreProjectsPoint.y, z: moreProjectsPoint.z},
    {x: 0, y: 3.9, z: 0},
    {x:moreScale, y:moreScale, z:moreScale},
    {id: "more", title: "More", interactables: interactableMeshes}
  );
  interactableObjects.push(more);
}

function lookAtProjectsPage () {
  let lookAtPoint = new THREE.Vector4(lookAtGroundPoint.x, lookAtGroundPoint.y, lookAtGroundPoint.z, cameraBasePosition.y);
  document.getElementById("objectTitle").remove();
  lookingAt = "projects";

  const targetQuaternion = new THREE.Quaternion();
  targetQuaternion.setFromEuler(new THREE.Euler(0, Math.PI, 0));

  // Animate the camera’s quaternion
  gsap.to(lookAtPoint, {
    x: lookAtProjectsPoint.x,
    y: lookAtProjectsPoint.y,
    z: lookAtProjectsPoint.z,
    w: cameraProjectsPosition.y,
    duration: 1.3,
    ease: "back.in(1.0)",
    onUpdate: () => {
      camera.lookAt(lookAtPoint.x, lookAtPoint.y, lookAtPoint.z);
      camera.position.y = lookAtPoint.w;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    },
    onComplete: () => {
      Content.loadProjectsContent();
    }
  });
}

function goToMoreProjects() {
  let lookAtPoint = new THREE.Vector4(lookAtProjectsPoint.x, lookAtProjectsPoint.y, lookAtProjectsPoint.z, cameraBasePosition.y);
  document.getElementById("objectTitle").remove();

  gsap.to(lookAtPoint, {
    x: moreProjectsPoint.x,
    y: moreProjectsPoint.y,
    z: moreProjectsPoint.z,
    duration: 1.3,
    ease: "power2.inOut",
    onUpdate: () => {
      camera.lookAt(lookAtPoint.x, lookAtPoint.y, lookAtPoint.z);
    }
  });
  gsap.to(camera.position, {
    x: moreProjectsPoint.x,
    z: moreProjectsPoint.z,
    duration: 1.3,
    ease: "power2.inOut",
    onComplete: () => {
      const transitionTime = 0.9;
      let values = new THREE.Vector2(camera.zoom, 100);
      gsap.fromTo(values, 
        {
        x: 100,
        y: camera.zoom
        },
        {
        x: 0,
        y: 10,
        duration: transitionTime,
        ease: "power2.in",
        onUpdate: () => {
          camera.zoom = values.y;
          document.getElementById("fadeOverlay").style.opacity = "" + values.x;
        },
        onComplete: () => {
          window.location.href = "projects.html";
        }
      })
    }
  });
}