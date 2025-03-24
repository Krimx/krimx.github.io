import { BasicMesh } from "./basicMesh";
import { Lamp } from "./lamp";

export function setupSceneObjects(scene, interactableMeshes, interactableObjects, isDarkMode) {
  setupCuldesac(scene, interactableMeshes, interactableObjects, isDarkMode);
}

function setupCuldesac(scene, interactableMeshes, interactableObjects, isDarkMode) {
  const culdesacScale = 65;
  new BasicMesh(scene, { filepath: "./recs/models/culdesac.glb" }, { x: 20, y: 0.001, z: 20 }, { x: 0, y: 0, z: 0 }, { x: culdesacScale, y: culdesacScale, z: culdesacScale }, { id: "culdesac" });

  const houseScale = 10;
  const modernHouse1 = new BasicMesh(scene, { filepath: "./recs/models/modernHouse1.glb" }, { x: -60, y: 0, z: 0 }, { x: 0, y: Math.PI - 0.25, z: 0 }, { x: houseScale, y: houseScale, z: houseScale }, { id: "modernHouse", title: "About", interactables: interactableMeshes });
  interactableObjects.push(modernHouse1);

  const cuteLilHouse = new BasicMesh(scene, { filepath: "./recs/models/cuteLilHouse.glb" }, { x: 0, y: 0, z: -61 }, { x: 0, y: Math.PI / 2 + 0.2, z: 0 }, { x: houseScale, y: houseScale, z: houseScale }, { id: "cuteLilHouse", title: "Projects", interactables: interactableMeshes });
  interactableObjects.push(cuteLilHouse);

  const forestScale = 2;
  new BasicMesh(scene, { filepath: "./recs/models/forest.glb" }, { x: -150, y: 10, z: -70 }, { x: 0, y: 0.5, z: 0 }, { x: forestScale, y: forestScale, z: forestScale }, { id: "forest", castShadow: false });

  placeSkills(scene);
  placeProjects(scene, interactableMeshes, interactableObjects);
  placeLinks(scene, interactableMeshes, interactableObjects);
  placeLamps(scene, isDarkMode);
}

function placeSkills(scene) {
  const skillScale = 4, skillHeight = -3;
  new BasicMesh(scene, { filepath: "./recs/models/skillStones/css.glb" }, { x: -48, y: skillHeight, z: -22 }, { x: 0, y: -0.5, z: 0 }, { x: skillScale, y: skillScale, z: skillScale }, { id: "css" });
  new BasicMesh(scene, { filepath: "./recs/models/skillStones/html.glb" }, { x: -37, y: skillHeight, z: -36 }, { x: 0, y: -0.8, z: 0 }, { x: skillScale, y: skillScale, z: skillScale }, { id: "html" });
  new BasicMesh(scene, { filepath: "./recs/models/skillStones/javascript.glb" }, { x: -23, y: skillHeight, z: -47 }, { x: 0, y: -1, z: 0 }, { x: skillScale, y: skillScale, z: skillScale }, { id: "js" });
  new BasicMesh(scene, { filepath: "./recs/models/skillStones/java.glb" }, { x: -58, y: skillHeight, z: 23 }, { x: 0, y: 0, z: 0 }, { x: skillScale, y: skillScale, z: skillScale }, { id: "java" });
  new BasicMesh(scene, { filepath: "./recs/models/skillStones/vscode.glb" }, { x: 20, y: skillHeight, z: -60 }, { x: 0, y: -1.5, z: 0 }, { x: skillScale, y: skillScale, z: skillScale }, { id: "vscode" });
  new BasicMesh(scene, { filepath: "./recs/models/skillStones/eclipse.glb" }, { x: 35, y: skillHeight, z: -59 }, { x: 0, y: -1.7, z: 0 }, { x: skillScale, y: skillScale, z: skillScale }, { id: "eclipse" });
}

function placeProjects(scene, interactableMeshes, interactableObjects) {
  const circuitsScale = 10;
  const circuits = new BasicMesh(scene, { filepath: "./recs/models/projects/circuits.glb" }, { x: 100, y: 0, z: 110 }, { x: 0, y: 3.4, z: 0 }, { x: circuitsScale, y: circuitsScale, z: circuitsScale }, { id: "circuits", title: "Circuits", interactables: interactableMeshes });
  interactableObjects.push(circuits);

  const gldScale = 7;
  const gld = new BasicMesh(scene, { filepath: "./recs/models/projects/green_light_district.glb" }, { x: 150, y: 0, z: 130 }, { x: 0, y: 4.0, z: 0 }, { x: gldScale, y: gldScale, z: gldScale }, { id: "gld", title: "The Green Light District", interactables: interactableMeshes });
  interactableObjects.push(gld);

  const moreScale = 10;
  const more = new BasicMesh(scene, { filepath: "./recs/models/projects/more.glb" }, { x: 130, y: 0.1, z: 70 }, { x: 0, y: 3.9, z: 0 }, { x: moreScale, y: moreScale, z: moreScale }, { id: "more", title: "More", interactables: interactableMeshes });
  interactableObjects.push(more);
}

function placeLinks(scene, interactableMeshes, interactableObjects) {
  const linksScale = 3;
  const github = new BasicMesh(scene, { filepath: "./recs/models/links/github.glb" }, { x: 12, y: 1.2, z: -35 }, { x: 0, y: 1.4, z: 0 }, { x: linksScale, y: linksScale, z: linksScale }, { id: "github", title: "Github", interactables: interactableMeshes, receiveShadow: true });
  interactableObjects.push(github);

  const instagram = new BasicMesh(scene, { filepath: "./recs/models/links/instagram.glb" }, { x: -30, y: 1.2, z: 10 }, { x: 0, y: 0, z: 0 }, { x: linksScale, y: linksScale, z: linksScale }, { id: "instagram", title: "Instagram", interactables: interactableMeshes, receiveShadow: true });
  interactableObjects.push(instagram);
}

function placeLamps(scene, isDarkMode) {
  new Lamp(scene, { x: -14, y: 0, z: -50 }, isDarkMode);
  new Lamp(scene, { x: -53, y: 0, z: 40 }, isDarkMode);
  new Lamp(scene, { x: -15, y: 0, z: 95 }, isDarkMode);
  new Lamp(scene, { x: 55, y: 0, z: 95 }, isDarkMode);
}