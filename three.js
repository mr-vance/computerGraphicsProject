const zoom = 2;
const threeHeights = [20,45,60];

export function Three() {
    const three = new THREE.Group();
  
    const trunk = new THREE.Mesh(
      new THREE.BoxBufferGeometry( 15*zoom, 15*zoom, 20*zoom ), 
      new THREE.MeshPhongMaterial( { color: 0x4d2926, flatShading: true } )
    );
    trunk.position.z = 10*zoom;
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    three.add(trunk);
  
    const height = threeHeights[Math.floor(Math.random()*threeHeights.length)];
  
    const crown = new THREE.Mesh(
      new THREE.BoxBufferGeometry( 30*zoom, 30*zoom, height*zoom ), 
      new THREE.MeshLambertMaterial( { color: 0x7aa21d, flatShading: true } )
    );
    crown.position.z = (height/2+20)*zoom;
    crown.castShadow = true;
    crown.receiveShadow = false;
    three.add(crown);
  
    return three;  
  }