import gsap from "gsap";
import * as THREE from "three";
import * as Content from "./contentLoader.js";

const cameraBasePosition = new THREE.Vector3(30, 30, 30);
const cameraSkyPosition = new THREE.Vector3(30, 100, 30);
const cameraProjectsPosition = new THREE.Vector3(30, 60, 30);
const lookAtSkyPoint = new THREE.Vector3(0, 100, 0);
const lookAtGroundPoint = new THREE.Vector3(0, 0, 0);
const lookAtProjectsPoint = new THREE.Vector3(100, 0, 100);
const moreProjectsPoint = new THREE.Vector3(130, 0.1, 70);

export function fadeToPage(page) {
  const fadeOverlay = document.getElementById("fadeOverlay");
  fadeOverlay.style.opacity = "1";
  setTimeout(() => {
    window.location.href = `${page}.html`;
  }, 1000);
}

export function fadeToPageURL(url) {
  const fadeOverlay = document.getElementById("fadeOverlay");
  fadeOverlay.style.opacity = "1";
  setTimeout(() => {
    window.location.href = url;
  }, 1000);
}

export function lookUpToSky(camera, renderer, sceneState) {
  const lookAtGroundPoint = new THREE.Vector3(0, 0, 0);
  const lookAtSkyPoint = new THREE.Vector3(0, 100, 0);
  const cameraBasePositionY = 30;
  const cameraSkyPositionY = 100;

  let lookAtPoint = new THREE.Vector4(
    lookAtGroundPoint.x,
    lookAtGroundPoint.y,
    lookAtGroundPoint.z,
    cameraBasePositionY
  );

  document.getElementById("objectTitle")?.remove();
  sceneState.lookingAt = "sky";

  gsap.to(lookAtPoint, {
    x: lookAtSkyPoint.x,
    y: lookAtSkyPoint.y,
    z: lookAtSkyPoint.z,
    w: cameraSkyPositionY,
    duration: 1.3,
    ease: "back.in(1.0)",
    onUpdate: () => {
      camera.lookAt(lookAtPoint.x, lookAtPoint.y, lookAtPoint.z);
      camera.position.y = lookAtPoint.w;
      camera.updateProjectionMatrix();
      renderer.render(sceneState.scene, camera);
    },
    onComplete: () => {
      Content.loadAboutContent();
      sceneState.inAnimation = false;
    }
  });
}

export function lookAtProjectsPage(camera, renderer, sceneState) {
  const lookAtGroundPoint = new THREE.Vector3(0, 0, 0);
  const lookAtProjectsPoint = new THREE.Vector3(100, 0, 100);
  const cameraBasePositionY = 30;
  const cameraProjectsPositionY = 60;

  let lookAtPoint = new THREE.Vector4(
    lookAtGroundPoint.x,
    lookAtGroundPoint.y,
    lookAtGroundPoint.z,
    cameraBasePositionY
  );

  document.getElementById("objectTitle")?.remove();
  sceneState.lookingAt = "projects";

  gsap.to(lookAtPoint, {
    x: lookAtProjectsPoint.x,
    y: lookAtProjectsPoint.y,
    z: lookAtProjectsPoint.z,
    w: cameraProjectsPositionY,
    duration: 1.3,
    ease: "back.in(1.0)",
    onUpdate: () => {
      camera.lookAt(lookAtPoint.x, lookAtPoint.y, lookAtPoint.z);
      camera.position.y = lookAtPoint.w;
      camera.updateProjectionMatrix();
      renderer.render(sceneState.scene, camera);
    },
    onComplete: () => {
      Content.loadProjectsContent();
      sceneState.inAnimation = false;
    }
  });
}

export function goToMoreProjects(camera, renderer, sceneState) {
  const lookAtProjectsPoint = new THREE.Vector3(100, 0, 100);
  const moreProjectsPoint = new THREE.Vector3(130, 0.1, 70);
  const cameraBasePositionY = 30;

  let lookAtPoint = new THREE.Vector4(
    lookAtProjectsPoint.x,
    lookAtProjectsPoint.y,
    lookAtProjectsPoint.z,
    cameraBasePositionY
  );

  document.getElementById("objectTitle")?.remove();

  gsap.to(lookAtPoint, {
    x: moreProjectsPoint.x,
    y: moreProjectsPoint.y,
    z: moreProjectsPoint.z,
    duration: 1.3,
    ease: "power2.inOut",
    onUpdate: () => {
      camera.lookAt(lookAtPoint.x, lookAtPoint.y, lookAtPoint.z);
      camera.updateProjectionMatrix();
      renderer.render(sceneState.scene, camera);
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

      gsap.fromTo(
        values,
        { x: 100, y: camera.zoom },
        {
          x: 0,
          y: 10,
          duration: transitionTime,
          ease: "power2.in",
          onUpdate: () => {
            camera.zoom = values.y;
            camera.updateProjectionMatrix();
            document.getElementById("fadeOverlay").style.opacity = values.x.toString();
            renderer.render(sceneState.scene, camera);
          },
          onComplete: () => {
            window.location.href = "./projects.html";
            sceneState.inAnimation = false;
          }
        }
      );
    }
  });
}

export function lookBackDown(camera, renderer, sceneState) {
    if (!sceneState.inAnimation && (sceneState.lookingAt == "sky" || sceneState.lookingAt == "projects")) {
      console.log("eshfuishfiusr")
      sceneState.inAnimation = true;
  
      if (sceneState.lookingAt === "sky") {
        Content.unloadAboutContent();
        setTimeout(() => {
          const lookAtPoint = new THREE.Vector4(
            lookAtSkyPoint.x,
            lookAtSkyPoint.y,
            lookAtSkyPoint.z,
            cameraSkyPosition.y
          );
          sceneState.lookingAt = "ground";
  
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
              renderer.render(sceneState.scene, camera);
            },
            onComplete: () => {
              sceneState.inAnimation = false;
            },
          });
        }, 750);
      } 
      else if (sceneState.lookingAt === "projects") {
        Content.unloadProjectsContent();
        setTimeout(() => {
          const lookAtPoint = new THREE.Vector4(
            lookAtProjectsPoint.x,
            lookAtProjectsPoint.y,
            lookAtProjectsPoint.z,
            cameraProjectsPosition.y
          );
          sceneState.lookingAt = "ground";
  
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
              renderer.render(sceneState.scene, camera);
            },
            onComplete: () => {
              sceneState.inAnimation = false;
            },
          });
        }, 0);
      }
    }
    else {
      console.log("Waka waka");
    }
  }