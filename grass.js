import * as THREE from 'three';

const zoom = 2;
const positionWidth = 45;
const columns = 17;
const boardWidth = positionWidth*columns;

export function Grass() {
    const grass = new THREE.Group();
  
    const createSection = color => new THREE.Mesh(
      new THREE.BoxGeometry( boardWidth*zoom, positionWidth*zoom, 3*zoom ), 
      new THREE.MeshPhongMaterial( { color } )
    );
  
    const middle = createSection(0xbaf455);
    middle.receiveShadow = true;
    grass.add(middle);
  
    const left = createSection(0x99C846);
    left.position.x = - boardWidth*zoom;
    grass.add(left);
  
    const right = createSection(0x99C846);
    right.position.x = boardWidth*zoom;
    grass.add(right);
  
    grass.position.z = 1.5*zoom;
    return grass;
  }