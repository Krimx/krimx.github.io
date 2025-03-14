import * as THREE from "three";

class BasicSun {
    constructor(scene, pos = {x:0, y:0, z:0}, color, int, frust, settings = {shadowBias: null, shadowRadius: null}) {
        this.color = color;
        this.pos = pos;

        this.sun = new THREE.DirectionalLight(color, int);

        this.sun.shadow.mapSize.width = 4096;
        this.sun.shadow.mapSize.height = 4096;

        this.sun.shadow.camera.left = -frust;
        this.sun.shadow.camera.right = frust;
        this.sun.shadow.camera.top = frust;
        this.sun.shadow.camera.bottom = -frust;

        this.sun.shadow.camera.near = 0.5;
        this.sun.shadow.camera.far = 10000;
        
        if (settings.shadowBias != null) this.sun.shadow.bias = settings.shadowBias
        else this.sun.shadow.bias = -0.0001; // Fine-tune based on artifacts

        if (settings.shadowRadius != null) this.sun.shadow.radius = settings.shadowRadius
        else this.sun.shadow.radius = 4; // Default is 1, increase for more blur
        

        this.sun.position.set(this.pos.x, this.pos.y, this.pos.z);
        this.sun.lookAt(0,0,0);
        this.sun.castShadow = true;

        scene.add(this.sun);
    }
}

export {BasicSun};