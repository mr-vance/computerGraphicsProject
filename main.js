import * as THREE from 'three';
import { Chicken } from "./chicken.js";
import { Lane } from "./lane.js";
import * as cameraModule from "./camera.js"
import * as lightingModule from "./lighting.js"


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


const stepTime = 200; 
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
lightingModule.dirLight.target = chicken;
scene.add(lightingModule.dirLight);
scene.add(lightingModule.hemiLight)


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

  lightingModule.dirLight.position.x = lightingModule.initialDirLightPositionX;
  lightingModule.dirLight.position.y = lightingModule.initialDirLightPositionY;
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


document.querySelector("#retry").addEventListener("click", () => {
  lanes.forEach(lane => scene.remove( lane.mesh ));
  initaliseValues();
  endDOM.style.visibility = 'hidden';
});


window.addEventListener("keydown", event => {
  if (event.key === 'ArrowUp') {
    // up arrow
    move('forward');
  }
  else if (event.key === "Escape" || event.key === "Esc") {
    toggleModal();
  }
  else if (event.key === 'ArrowDown') {
    // down arrow
    move('backward');
  }
  else if(event.key === "c" || event.key === "C"){
    cameraModule.toggleCameraView();
  }
  else if (event.key === 'ArrowLeft') {
    // left arrow
    move('left');
  }
  else if (event.key === 'ArrowRight') {
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
    var positionY = currentLane*positionWidth*zoom + moveDeltaDistance;
    switch(moves[0]) {
      case 'forward': {
        cameraModule.camera.position.y = cameraModule.initialCameraPositionY + positionY; 
        lightingModule.dirLight.position.y = lightingModule.initialDirLightPositionY + positionY; 
        chicken.position.y = positionY; // initial chicken position is 0

        chicken.position.z = jumpDeltaDistance;
        break;
      }
      case 'backward': {
        positionY = currentLane*positionWidth*zoom - moveDeltaDistance
        cameraModule.camera.position.y = cameraModule.initialCameraPositionY + positionY;
        lightingModule.dirLight.position.y = lightingModule.initialDirLightPositionY + positionY; 
        chicken.position.y = positionY;

        chicken.position.z = jumpDeltaDistance;
        break;
      }
      case 'left': {
        const positionX = (currentColumn*positionWidth+positionWidth/2)*zoom -boardWidth*zoom/2 - moveDeltaDistance;
        cameraModule.camera.position.x = cameraModule.initialCameraPositionX + positionX;     
        lightingModule.dirLight.position.x = lightingModule.initialDirLightPositionX + positionX; 
        chicken.position.x = positionX; // initial chicken position is 0
        chicken.position.z = jumpDeltaDistance;
        break;
      }
      case 'right': {
        const positionX = (currentColumn*positionWidth+positionWidth/2)*zoom -boardWidth*zoom/2 + moveDeltaDistance;
        cameraModule.camera.position.x = cameraModule.initialCameraPositionX + positionX;       
        lightingModule.dirLight.position.x = lightingModule.initialDirLightPositionX + positionX;
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