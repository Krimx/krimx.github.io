import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

class BasicMesh {
    constructor(scene, meshStuff = {geometry: null, material: null, filepath: null}, pos = {x:0, y:0, z:0}, rot = {x:0, y:0, z:0}, scale = {x:1, y:1, z:1}, params = {interactables: [], castShadow: true, receiveShadow: true, title: "", id:""}) {
        
        //geometry and materials in meshStuff shouldn't be use if filepath is set and vice versa
        if (meshStuff.geometry != null) this.geo = meshStuff.geometry.clone();
        if (meshStuff.material != null) this.mat = meshStuff.material.clone();
        if (meshStuff.geometry != null && meshStuff.material != null) {
            this.mesh = new THREE.Mesh(this.geo, this.mat);
            this.initializeMeshProperties(pos, rot, scale, params);
            scene.add(this.mesh);
        }

        //if a filepath is clarified, load a mesh from the .glb file (MUST BE .glb!!!!!!!)
        if (meshStuff.filepath != null) {
            const loader = new GLTFLoader();
            loader.load(meshStuff.filepath, (gltf) => {
                this.mesh = gltf.scene;
                scene.add(this.mesh);
                this.initializeMeshProperties(pos, rot, scale, params);
                console.log(this.mesh.scale);
            });
        }
    }

    //Helper function for initializing mesh properties used after mesh is available
    initializeMeshProperties(pos, rot, scale, params) {
        this.pos = pos;
        this.rot = rot;
        this.scale = scale;
    
        this.mesh.position.set(this.pos.x, this.pos.y, this.pos.z);
        this.mesh.rotation.set(this.rot.x, this.rot.y, this.rot.z);
        this.mesh.scale.set(this.scale.x, this.scale.y, this.scale.z);
    
        this.mesh.receiveShadow = params.receiveShadow !== undefined ? params.receiveShadow : true;
        this.mesh.castShadow = params.castShadow !== undefined ? params.castShadow : true;
    
        this.showingTitle = false;
    
        if (params.interactables) params.interactables.push(this.mesh);
    
        this.title = params.title || "";
        this.id = params.id || "";
    }

    setCastShadow(cast) {
        this.mesh.castShadow = cast;
    }
    setReceiveShadow(receive) {
        this.mesh.receiveShadow = receive;
    }

    setPos(x,y,z) {
        this.pos.x = x;
        this.pos.y = y;
        this.pos.z = z;
        this.mesh.position.set(this.pos.x, this.pos.y, this.pos.z);
    }

    setScale(x,y,z) {
        this.scale.x = x;
        this.scale.y = y;
        this.scale.z = z;
        this.mesh.scale.set(this.scale.x, this.scale.y, this.scale.z);
    }

    setRot(x,y,z) {
        this.rot.x = x;
        this.rot.y = y;
        this.rot.z = z;
        this.mesh.rotation.set(this.rot.x, this.rot.y, this.rot.z);
    }

    //Used for hovering over to display what it is
    showTitle(x,y) {
        if (!this.showingTitle) {
            const text = document.createElement("h1");
            text.textContent = this.title;
            text.id = "objectTitle";
            text.className = "objectTitle";
            text.style.position = "absolute";
            text.style.left = x.toString() + "px";
            text.style.top = y.toString() + "px";
            this.showingTitle = true;
    
            document.body.appendChild(text);
        }
    }

    //Hides the title
    hideTitle() {
        if (this.showingTitle) {
            const element = document.getElementById("objectTitle");
            if (element != null) element.remove();
            this.showingTitle = false;
        }
    }

    //This function came directly from ChatGPT. I don't know how it works. I don't wanna know how it works.
    getScreenPosition(camera, renderer) {
      // Get the mesh's world position
      const vector = new THREE.Vector3();
      this.mesh.getWorldPosition(vector);
    
      // Project the position into normalized device coordinates (NDC)
      vector.project(camera);
    
      // Convert NDC to screen coordinates
      const widthHalf = renderer.domElement.width / 2;
      const heightHalf = renderer.domElement.height / 2;
    
      return {
          x: (vector.x * widthHalf) + widthHalf,  // Convert from -1 to 1 range to pixel space
          y: -(vector.y * heightHalf) + heightHalf  // Invert Y because screen coordinates are flipped
      };
    }
    
    //This too
    getHighestScreenPixel(camera, renderer) {
      // Compute the bounding box of the mesh
      const bbox = new THREE.Box3().setFromObject(this.mesh);
    
      // Get the 8 corner points of the bounding box
      const points = [
          new THREE.Vector3(bbox.min.x, bbox.min.y, bbox.min.z),
          new THREE.Vector3(bbox.min.x, bbox.min.y, bbox.max.z),
          new THREE.Vector3(bbox.min.x, bbox.max.y, bbox.min.z),
          new THREE.Vector3(bbox.min.x, bbox.max.y, bbox.max.z),
          new THREE.Vector3(bbox.max.x, bbox.min.y, bbox.min.z),
          new THREE.Vector3(bbox.max.x, bbox.min.y, bbox.max.z),
          new THREE.Vector3(bbox.max.x, bbox.max.y, bbox.min.z),
          new THREE.Vector3(bbox.max.x, bbox.max.y, bbox.max.z),
      ];
    
      let highestY = Infinity;
      let highestPixel = { x: 0, y: 0 };
    
      // Convert each point to screen space
      points.forEach(point => {
          const screenPos = point.clone().project(camera);
    
          // Convert NDC (-1 to 1) to screen pixels
          const x = (screenPos.x * 0.5 + 0.5) * renderer.domElement.width;
          const y = (1 - (screenPos.y * 0.5 + 0.5)) * renderer.domElement.height; // Invert Y
    
          // Check if this is the highest pixel (smallest y-value in screen space)
          if (y < highestY) {
              highestY = y;
              highestPixel = { x, y };
          }
      });
    
      return highestPixel;
    }
}

export {BasicMesh};