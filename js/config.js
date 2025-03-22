import * as THREE from "three";

export const cameraConfig = {
  basePosition: new THREE.Vector3(30, 30, 30),
  zoomBase: 0.8,
  zoomAmount: 0.85,
  zoomTime: 500,
};

export const frustumConfig = {
  frustum: 40,
  near: -50,
  far: 400,
};

export const screenConfig = {
  width: window.innerWidth,
  height: window.innerHeight,
};

export const lightConfig = {
  factor: 50,
  sunColor: 0xFFFFEC,
  sunFrust: 1000,
};