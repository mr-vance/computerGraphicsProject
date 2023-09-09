import { Car } from "./car.js";
import { Wheel } from "./wheel.js";
import * as textureModule from "./texture.js"
import * as cameraModule from "./camera.js"



const counterDOM = document.getElementById('counter');  
const endDOM = document.getElementById('end'); 
const scene = new THREE.Scene();

// Define a variable to track the game's pause state
let isGamePaused = false;

const modal = document.getElementById("myModal");

// Function to toggle the modal's visibility
function toggleModal() {
    modal.style.display = isGamePaused ? "none" : "block";
    isGamePaused = !isGamePaused;
}

const zoom = 2;

const chickenSize = 15;

const positionWidth = 45;
const columns = 17;
const boardWidth = positionWidth*columns;

const stepTime = 200; // Miliseconds it takes for the chicken to take a step forward, backward, left or right

let lanes;
let currentLane;
let currentColumn;


let previousTimestamp;
let startMoving;
let moves;
let stepStartTimestamp;


const generateLanes = () => [-9,-8,-7,-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6,7,8,9].map((index) => {
  const lane = new Lane(index);
  lane.mesh.position.y = index*positionWidth*zoom;
  scene.add( lane.mesh );
  return lane;
}).filter((lane) => lane.index >= 0);

const addLane = () => {
  const index = lanes.length;
  const lane = new Lane(index);
  lane.mesh.position.y = index*positionWidth*zoom;
  scene.add(lane.mesh);
  lanes.push(lane);
}

const chicken = new Chicken();
scene.add( chicken );

const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
scene.add(hemiLight)

const initialDirLightPositionX = -100;
const initialDirLightPositionY = -100;
const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
dirLight.position.set(initialDirLightPositionX, initialDirLightPositionY, 200);
dirLight.castShadow = true;
dirLight.target = chicken;
scene.add(dirLight);

dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
var d = 500;
dirLight.shadow.camera.left = - d;
dirLight.shadow.camera.right = d;
dirLight.shadow.camera.top = d;
dirLight.shadow.camera.bottom = - d;

// var helper = new THREE.CameraHelper( dirLight.shadow.camera );
// var helper = new THREE.CameraHelper( camera );
// scene.add(helper)

const backLight = new THREE.DirectionalLight(0x000000, .4);
backLight.position.set(200, 200, 50);
backLight.castShadow = true;
scene.add(backLight)

const laneTypes = ['car', 'truck', 'forest'];
const laneSpeeds = [2, 2.5, 3];
const vechicleColors = [0xa52523, 0xbdb638, 0x78b14b];
const threeHeights = [20,45,60];

const initaliseValues = () => {
  lanes = generateLanes()

  currentLane = 0;
  currentColumn = Math.floor(columns/2);

  previousTimestamp = null;

  startMoving = false;
  moves = [];
  stepStartTimestamp;

  chicken.position.x = 0;
  chicken.position.y = 0;

  cameraModule.camera.position.y = cameraModule.initialCameraPositionY;
  cameraModule.camera.position.x = cameraModule.initialCameraPositionX;

  dirLight.position.x = initialDirLightPositionX;
  dirLight.position.y = initialDirLightPositionY;
}

initaliseValues();

const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true
});

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


function Truck() {
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

function Three() {
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

function Chicken() {
  const chicken = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.BoxBufferGeometry( chickenSize*zoom, chickenSize*zoom, 20*zoom ), 
    new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } )
  );
  body.position.z = 10*zoom;
  body.castShadow = true;
  body.receiveShadow = true;
  chicken.add(body);

  const rowel = new THREE.Mesh(
    new THREE.BoxBufferGeometry( 2*zoom, 4*zoom, 2*zoom ), 
    new THREE.MeshLambertMaterial( { color: 0xF0619A, flatShading: true } )
  );
  rowel.position.z = 21*zoom;
  rowel.castShadow = true;
  rowel.receiveShadow = false;
  chicken.add(rowel);

  return chicken;  
}

function Road() {
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

function Grass() {
  const grass = new THREE.Group();

  const createSection = color => new THREE.Mesh(
    new THREE.BoxBufferGeometry( boardWidth*zoom, positionWidth*zoom, 3*zoom ), 
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

function Lane(index) {
  this.index = index;
  this.type = index <= 0 ? 'field' : laneTypes[Math.floor(Math.random()*laneTypes.length)];

  switch(this.type) {
    case 'field': {
      this.type = 'field';
      this.mesh = new Grass();
      break;
    }
    case 'forest': {
      this.mesh = new Grass();

      this.occupiedPositions = new Set();
      this.threes = [1,2,3,4].map(() => {
        const three = new Three();
        let position;
        do {
          position = Math.floor(Math.random()*columns);
        }while(this.occupiedPositions.has(position))
          this.occupiedPositions.add(position);
        three.position.x = (position*positionWidth+positionWidth/2)*zoom-boardWidth*zoom/2;
        this.mesh.add( three );
        return three;
      })
      break;
    }
    case 'car' : {
      this.mesh = new Road();
      this.direction = Math.random() >= 0.5;

      const occupiedPositions = new Set();
      this.vechicles = [1,2,3].map(() => {
        const vechicle = new Car();
        let position;
        do {
          position = Math.floor(Math.random()*columns/2);
        }while(occupiedPositions.has(position))
          occupiedPositions.add(position);
        vechicle.position.x = (position*positionWidth*2+positionWidth/2)*zoom-boardWidth*zoom/2;
        if(!this.direction) vechicle.rotation.z = Math.PI;
        this.mesh.add( vechicle );
        return vechicle;
      })

      this.speed = laneSpeeds[Math.floor(Math.random()*laneSpeeds.length)];
      break;
    }
    case 'truck' : {
      this.mesh = new Road();
      this.direction = Math.random() >= 0.5;

      const occupiedPositions = new Set();
      this.vechicles = [1,2].map(() => {
        const vechicle = new Truck();
        let position;
        do {
          position = Math.floor(Math.random()*columns/3);
        }while(occupiedPositions.has(position))
          occupiedPositions.add(position);
        vechicle.position.x = (position*positionWidth*3+positionWidth/2)*zoom-boardWidth*zoom/2;
        if(!this.direction) vechicle.rotation.z = Math.PI;
        this.mesh.add( vechicle );
        return vechicle;
      })

      this.speed = laneSpeeds[Math.floor(Math.random()*laneSpeeds.length)];
      break;
    }
  }
}

document.querySelector("#retry").addEventListener("click", () => {
  lanes.forEach(lane => scene.remove( lane.mesh ));
  initaliseValues();
  endDOM.style.visibility = 'hidden';
});



document.getElementById('forward').addEventListener("click", () => move('forward'));

document.getElementById('backward').addEventListener("click", () => move('backward'));

document.getElementById('left').addEventListener("click", () => move('left'));

document.getElementById('right').addEventListener("click", () => move('right'));

window.addEventListener("keydown", event => {
    if (event.keyCode == '38') {
      // up arrow
      move('forward');
    }
    else if (event.key === "Escape" || event.key === "Esc") {
      toggleModal();
    }
    else if (event.keyCode == '40') {
      // down arrow
      move('backward');
    }
    else if(event.key === "C" || event.key === "c"){
      toggleCameraView();
    }
    else if (event.keyCode == '37') {
      // left arrow
      move('left');
    }
    else if (event.keyCode == '39') {
      // right arrow
      move('right');
    }
});

// Add event listeners for the resume and quit buttons
const resumeButton = document.getElementById("resumeBtn");
const quitButton = document.getElementById("quitBtn");

quitButton.addEventListener("click", function () {
  // Redirect to index.html when quitting the game
  window.location.href = "index.html";
});

resumeButton.addEventListener("click", function () {
  // Hide the modal to resume the game without affecting game state
  modal.style.display = "none";
});

function move(direction) {
  const finalPositions = moves.reduce((position,move) => {
    if(move === 'forward') return {lane: position.lane+1, column: position.column};
    if(move === 'backward') return {lane: position.lane-1, column: position.column};
    if(move === 'left') return {lane: position.lane, column: position.column-1};
    if(move === 'right') return {lane: position.lane, column: position.column+1};
  }, {lane: currentLane, column: currentColumn})

  if (direction === 'forward') {
    if(lanes[finalPositions.lane+1].type === 'forest' && lanes[finalPositions.lane+1].occupiedPositions.has(finalPositions.column)) return;
    if(!stepStartTimestamp) startMoving = true;
    addLane();
  }
  else if (direction === 'backward') {
    if(finalPositions.lane === 0) return;
    if(lanes[finalPositions.lane-1].type === 'forest' && lanes[finalPositions.lane-1].occupiedPositions.has(finalPositions.column)) return;
    if(!stepStartTimestamp) startMoving = true;
  }
  else if (direction === 'left') {
    if(finalPositions.column === 0) return;
    if(lanes[finalPositions.lane].type === 'forest' && lanes[finalPositions.lane].occupiedPositions.has(finalPositions.column-1)) return;
    if(!stepStartTimestamp) startMoving = true;
  }
  else if (direction === 'right') {
    if(finalPositions.column === columns - 1 ) return;
    if(lanes[finalPositions.lane].type === 'forest' && lanes[finalPositions.lane].occupiedPositions.has(finalPositions.column+1)) return;
    if(!stepStartTimestamp) startMoving = true;
  }
  moves.push(direction);
}

let topViewCameraPosition = new THREE.Vector3(0, 0, 500); // Initialize the top view camera position


function animate(timestamp) {
  requestAnimationFrame( animate );

  if(!previousTimestamp) previousTimestamp = timestamp;
  const delta = timestamp - previousTimestamp;
  previousTimestamp = timestamp;

  // Animate cars and trucks moving on the lane
  lanes.forEach(lane => {
    if(lane.type === 'car' || lane.type === 'truck') {
      const aBitBeforeTheBeginingOfLane = -boardWidth*zoom/2 - positionWidth*2*zoom;
      const aBitAfterTheEndOFLane = boardWidth*zoom/2 + positionWidth*2*zoom;
      lane.vechicles.forEach(vechicle => {
        if(lane.direction) {
          vechicle.position.x = vechicle.position.x < aBitBeforeTheBeginingOfLane ? aBitAfterTheEndOFLane : vechicle.position.x -= lane.speed/16*delta;
        }else{
          vechicle.position.x = vechicle.position.x > aBitAfterTheEndOFLane ? aBitBeforeTheBeginingOfLane : vechicle.position.x += lane.speed/16*delta;
        }
      });
    }
  });

  if(startMoving) {
    stepStartTimestamp = timestamp;
    startMoving = false;
  }

  if(stepStartTimestamp) {
    const moveDeltaTime = timestamp - stepStartTimestamp;
    const moveDeltaDistance = Math.min(moveDeltaTime/stepTime,1)*positionWidth*zoom;
    const jumpDeltaDistance = Math.sin(Math.min(moveDeltaTime/stepTime,1)*Math.PI)*8*zoom;
    switch(moves[0]) {
      case 'forward': {
        const positionY = currentLane*positionWidth*zoom + moveDeltaDistance;
        cameraModule.camera.position.y = cameraModule.initialCameraPositionY + positionY; 
        dirLight.position.y = initialDirLightPositionY + positionY; 
        chicken.position.y = positionY; // initial chicken position is 0

        chicken.position.z = jumpDeltaDistance;
        break;
      }
      case 'backward': {
        positionY = currentLane*positionWidth*zoom - moveDeltaDistance
        cameraModule.camera.position.y = cameraModule.initialCameraPositionY + positionY;
        dirLight.position.y = cameraModule.initialDirLightPositionY + positionY; 
        chicken.position.y = positionY;

        chicken.position.z = jumpDeltaDistance;
        break;
      }
      case 'left': {
        const positionX = (currentColumn*positionWidth+positionWidth/2)*zoom -boardWidth*zoom/2 - moveDeltaDistance;
        cameraModule.camera.position.x = cameraModule.initialCameraPositionX + positionX;     
        dirLight.position.x = initialDirLightPositionX + positionX; 
        chicken.position.x = positionX; // initial chicken position is 0
        chicken.position.z = jumpDeltaDistance;
        break;
      }
      case 'right': {
        const positionX = (currentColumn*positionWidth+positionWidth/2)*zoom -boardWidth*zoom/2 + moveDeltaDistance;
        cameraModule.camera.position.x = cameraModule.initialCameraPositionX + positionX;       
        dirLight.position.x = initialDirLightPositionX + positionX;
        chicken.position.x = positionX; 

        chicken.position.z = jumpDeltaDistance;
        break;
      }
    }
    // Once a step has ended
    if(moveDeltaTime > stepTime) {
      switch(moves[0]) {
        case 'forward': {
          currentLane++;
          counterDOM.innerHTML = currentLane;    
          break;
        }
        case 'backward': {
          currentLane--;
          counterDOM.innerHTML = currentLane;    
          break;
        }
        case 'left': {
          currentColumn--;
          break;
        }
        case 'right': {
          currentColumn++;
          break;
        }
      }
      moves.shift();
      // If more steps are to be taken then restart counter otherwise stop stepping
      stepStartTimestamp = moves.length === 0 ? null : timestamp;
    }
  }


  if (cameraModule.isTopView) {
    // Update the top view camera position to follow the chicken
    topViewCameraPosition.x = chicken.position.x;
    topViewCameraPosition.y = chicken.position.y;

    // Set the camera position to the updated top view camera position
    cameraModule.camera.position.copy(topViewCameraPosition);

    // Look at the chicken
    cameraModule.camera.lookAt(chicken.position);
  }

  // Render the grass before rendering the chicken
  renderer.render(scene, cameraModule.camera);

  if (!cameraModule.isTopView) {
    // If not in top view, render the chicken again after rendering the grass
    renderer.render(scene, cameraModule.camera);
  }

  
  // Hit test
  if(lanes[currentLane].type === 'car' || lanes[currentLane].type === 'truck') {
    const chickenMinX = chicken.position.x - chickenSize*zoom/2;
    const chickenMaxX = chicken.position.x + chickenSize*zoom/2;
    const vechicleLength = { car: 60, truck: 105}[lanes[currentLane].type]; 
    lanes[currentLane].vechicles.forEach(vechicle => {
      const carMinX = vechicle.position.x - vechicleLength*zoom/2;
      const carMaxX = vechicle.position.x + vechicleLength*zoom/2;
      if(chickenMaxX > carMinX && chickenMinX < carMaxX) {
        endDOM.style.visibility = 'visible';
      }
    });

  }
  renderer.render( scene, cameraModule.camera );	
}

requestAnimationFrame( animate );