import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const zoom = 12;

export function Chicken() {
    const chicken = new THREE.Group();
  
    // Load the glTF model
    const loader = new GLTFLoader();
    loader.load('RobotExpressive.glb', (gltf) => {
        // Scale and position the model as needed
        const model = gltf.scene;
        model.scale.set(zoom, zoom, zoom);
        
        // Rotate the model to face away from the camera
        model.rotation.y = Math.PI; // 180 degrees in radians
        model.rotation.x = Math.PI/2;
        
        // Adjust the model's position so it stands on the ground
        //const modelHeight = model.geometry.boundingBox.max.y * zoom;
        model.position.z = (20); // Adjust based on model's height
        
        chicken.add(model);
    });
  
    return chicken;  
}
