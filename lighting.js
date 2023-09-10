import * as THREE from 'three';

export const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);


export const initialDirLightPositionX = -100;
export const initialDirLightPositionY = -100;
export const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
dirLight.position.set(initialDirLightPositionX, initialDirLightPositionY, 200);
dirLight.castShadow = true;

dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
var d = 500;
dirLight.shadow.camera.left = - d;
dirLight.shadow.camera.right = d;
dirLight.shadow.camera.top = d;
dirLight.shadow.camera.bottom = - d;