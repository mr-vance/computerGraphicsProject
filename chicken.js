import * as THREE from 'three';

const zoom = 2;
const chickenSize = 15;

export function Chicken() {
    const chicken = new THREE.Group();
  
    const body = new THREE.Mesh(
      new THREE.BoxGeometry( chickenSize*zoom, chickenSize*zoom, 20*zoom ), 
      new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } )
    );
    body.position.z = 10*zoom;
    body.castShadow = true;
    body.receiveShadow = true;
    chicken.add(body);
  
    const rowel = new THREE.Mesh(
      new THREE.BoxGeometry( 2*zoom, 4*zoom, 2*zoom ), 
      new THREE.MeshLambertMaterial( { color: 0xF0619A, flatShading: true } )
    );
    rowel.position.z = 21*zoom;
    rowel.castShadow = true;
    rowel.receiveShadow = false;
    chicken.add(rowel);
  
    return chicken;  
  }