const zoom = 2;
const positionWidth = 45;
const columns = 17;
const boardWidth = positionWidth*columns;


export function Road() {
  const road = new THREE.Group();

  const createSection = color => new THREE.Mesh(
    new THREE.PlaneBufferGeometry( boardWidth*zoom, positionWidth*zoom ), 
    new THREE.MeshPhongMaterial( { color } )
  );

  const middle = createSection(0x454A59);
  middle.receiveShadow = true;
  road.add(middle);

  const left = createSection(0x393D49);
  left.position.x = - boardWidth*zoom;
  road.add(left);

  const right = createSection(0x393D49);
  right.position.x = boardWidth*zoom;
  road.add(right);

  return road;
}