import {BasicMesh} from "./basicMesh";
import {BasicSun} from "./basicSun";

class Lamp {
    constructor(scene, location = {x:0,y:0,z:0}, active = true) {
        const scale = 2.5;
        const lamp = new BasicMesh(
            scene,
            {filepath: "./recs/models/lamp.glb"},
            {x: location.x, y: location.y, z: location.z},
            {x: 0, y: 0, z: 0},
            {x:scale, y:scale, z:scale},
            {id: "lamp", receiveShadow: true}
          );

        if (active) {
            const light = new BasicSun(scene, {x:location.x, y:location.y + scale, z:location.z}, 0xFFFFEE, .6, 100);
        }

    }
}

export {Lamp};