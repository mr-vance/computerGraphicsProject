import { Texture } from "./texture.js";
import { Wheel } from "./wheel.js";

const zoom = 2;

const vechicleColors = [0xa52523, 0xbdb638, 0x78b14b];
const carFrontTexture = new Texture(40,80,[{x: 0, y: 10, w: 30, h: 60 }]);
const carBackTexture = new Texture(40,80,[{x: 10, y: 10, w: 30, h: 60 }]);
const carRightSideTexture = new Texture(110,40,[{x: 10, y: 0, w: 50, h: 30 }, {x: 70, y: 0, w: 30, h: 30 }]);
const carLeftSideTexture = new Texture(110,40,[{x: 10, y: 10, w: 50, h: 30 }, {x: 70, y: 10, w: 30, h: 30 }]);

  
  export function Car() {
    const car = new THREE.Group();
    const color = vechicleColors[Math.floor(Math.random() * vechicleColors.length)];
    
    const main = new THREE.Mesh(
      new THREE.BoxBufferGeometry( 60*zoom, 30*zoom, 15*zoom ), 
      new THREE.MeshPhongMaterial( { color, flatShading: true } )
    );
    main.position.z = 12*zoom;
    main.castShadow = true;
    main.receiveShadow = true;
    car.add(main)
    
    const cabin = new THREE.Mesh(
      new THREE.BoxBufferGeometry( 33*zoom, 24*zoom, 12*zoom ), 
      [
        new THREE.MeshPhongMaterial( { color: 0xcccccc, flatShading: true, map: carBackTexture } ),
        new THREE.MeshPhongMaterial( { color: 0xcccccc, flatShading: true, map: carFrontTexture } ),
        new THREE.MeshPhongMaterial( { color: 0xcccccc, flatShading: true, map: carRightSideTexture } ),
        new THREE.MeshPhongMaterial( { color: 0xcccccc, flatShading: true, map: carLeftSideTexture } ),
        new THREE.MeshPhongMaterial( { color: 0xcccccc, flatShading: true } ), // top
        new THREE.MeshPhongMaterial( { color: 0xcccccc, flatShading: true } ) // bottom
      ]
    );
    cabin.position.x = 6*zoom;
    cabin.position.z = 25.5*zoom;
    cabin.castShadow = true;
    cabin.receiveShadow = true;
    car.add( cabin );
    
    const frontWheel = new Wheel();
    frontWheel.position.x = -18*zoom;
    car.add( frontWheel );
  
    const backWheel = new Wheel();
    backWheel.position.x = 18*zoom;
    car.add( backWheel );
  
    car.castShadow = true;
    car.receiveShadow = false;
    
    return car;  
  }