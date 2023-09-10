import { Wheel } from "./wheel.js";
import * as textureModule from "./texture.js"

const vechicleColors = [0xa52523, 0xbdb638, 0x78b14b];
const zoom = 2;

export function Truck() {
    const truck = new THREE.Group();
    const color = vechicleColors[Math.floor(Math.random() * vechicleColors.length)];
  
  
    const base = new THREE.Mesh(
      new THREE.BoxBufferGeometry( 100*zoom, 25*zoom, 5*zoom ), 
      new THREE.MeshLambertMaterial( { color: 0xb4c6fc, flatShading: true } )
    );
    base.position.z = 10*zoom;
    truck.add(base)
  
    const cargo = new THREE.Mesh(
      new THREE.BoxBufferGeometry( 75*zoom, 35*zoom, 40*zoom ), 
      new THREE.MeshPhongMaterial( { color: 0xb4c6fc, flatShading: true } )
    );
    cargo.position.x = 15*zoom;
    cargo.position.z = 30*zoom;
    cargo.castShadow = true;
    cargo.receiveShadow = true;
    truck.add(cargo)
  
    const cabin = new THREE.Mesh(
      new THREE.BoxBufferGeometry( 25*zoom, 30*zoom, 30*zoom ), 
      [
        new THREE.MeshPhongMaterial( { color, flatShading: true } ), // back
        new THREE.MeshPhongMaterial( { color, flatShading: true, map: textureModule.truckFrontTexture } ),
        new THREE.MeshPhongMaterial( { color, flatShading: true, map: textureModule.truckRightSideTexture } ),
        new THREE.MeshPhongMaterial( { color, flatShading: true, map: textureModule.truckLeftSideTexture } ),
        new THREE.MeshPhongMaterial( { color, flatShading: true } ), // top
        new THREE.MeshPhongMaterial( { color, flatShading: true } ) // bottom
      ]
    );
    cabin.position.x = -40*zoom;
    cabin.position.z = 20*zoom;
    cabin.castShadow = true;
    cabin.receiveShadow = true;
    truck.add( cabin );
  
    const frontWheel = new Wheel();
    frontWheel.position.x = -38*zoom;
    truck.add( frontWheel );
  
    const middleWheel = new Wheel();
    middleWheel.position.x = -10*zoom;
    truck.add( middleWheel );
  
    const backWheel = new Wheel();
    backWheel.position.x = 30*zoom;
    truck.add( backWheel );
  
    return truck;  
  }