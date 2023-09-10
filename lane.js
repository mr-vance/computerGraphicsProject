import * as THREE from 'three';
import { Truck } from "./truck.js";
import { Car } from "./car.js";
import { Grass } from "./grass.js";
import { Three } from "./three.js";
import { Road } from "./road.js";


const laneTypes = ['car', 'truck', 'forest'];
const laneSpeeds = [2, 2.5, 3];
const columns = 17;
const zoom = 2;
const positionWidth = 45;
const boardWidth = positionWidth*columns;

export function Lane(index) {
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