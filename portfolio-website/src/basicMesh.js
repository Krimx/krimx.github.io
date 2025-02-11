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
            if (params.interactables) params.interactables.push(this.mesh);
            scene.add(this.mesh);
        }

        //GLTF handles meshes differently due to how its loading is asynchronous and what it pushes to interactables is not the same as what it puches when it is just a normal geometry
        //When looking at the mesh in your object, make sure to check accordingly if what you are checking is gltf or what is loaded in the above block of code
        //I will be making improvements to this class as time goes on so check with me for any important updates (ill let you know but point still stands)

        //if a filepath is clarified, load a mesh from the .glb file (MUST BE .glb!!!!!!!)
        if (meshStuff.filepath != null) {
            const loader = new GLTFLoader();
            loader.load(meshStuff.filepath, (gltf) => {
                this.mesh = gltf.scene;
                scene.add(this.mesh);
                this.initializeMeshProperties(pos, rot, scale, params);
                
                if (params.interactables != null) {
                    // Ensure all child meshes store a reference to this parent object
                    gltf.scene.traverse((child) => {
                        if (child.isMesh) {
                            params.interactables.push(child);
                            child.userData.parentObject = this.mesh; // Attach reference to BasicMesh instance

                            // Enable shadows on all sub-meshes
                            child.castShadow = params.castShadow !== undefined ? params.castShadow : true;
                            child.receiveShadow = params.receiveShadow !== undefined ? params.receiveShadow : true;

                            console.log(this.id);
                            console.log(`Mesh: ${child.name}, CastShadow: ${child.castShadow}, ReceiveShadow: ${child.receiveShadow}`);
                            console.log("-------");
                        }
                    });

                    // console.log("Loaded Mesh:", this.mesh);
                    // console.log("Updated Interactable Meshes:", params.interactables);
                }

                // console.log("Passed");
                // console.log(this.mesh);
                // console.log("-------------");
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
    getScreenPosition(camera, renderer, pixelRatio = {ratio:1}) {
        const vector = new THREE.Vector3();
        this.mesh.getWorldPosition(vector);
        vector.project(camera);
    
        // Use window.innerWidth and window.innerHeight instead of renderer.domElement.width
        const widthHalf = window.innerWidth / 2;
        const heightHalf = window.innerHeight / 2;
    
        return {
            x: (vector.x * widthHalf) + widthHalf,
            y: -(vector.y * heightHalf) + heightHalf
        };
    }
    
    //This too
    getHighestScreenPixel(camera, renderer) {
        const bbox = new THREE.Box3().setFromObject(this.mesh);
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
    
        points.forEach(point => {
            const screenPos = point.clone().project(camera);
    
            // Use window.innerWidth and window.innerHeight instead of renderer.domElement dimensions
            const x = (screenPos.x * 0.5 + 0.5) * window.innerWidth;
            const y = (1 - (screenPos.y * 0.5 + 0.5)) * window.innerHeight; 
    
            if (y < highestY) {
                highestY = y;
                highestPixel = { x, y };
            }
        });
    
        return highestPixel;
    }
}

export {BasicMesh};