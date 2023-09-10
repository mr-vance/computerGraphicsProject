export const distance = 500;
export const camera = new THREE.OrthographicCamera( window.innerWidth/-2, window.innerWidth/2, window.innerHeight / 2, window.innerHeight / -2, 0.1, 10000 );


camera.rotation.x = 50*Math.PI/180;
camera.rotation.y = 20*Math.PI/180;
camera.rotation.z = 10*Math.PI/180;


export const initialCameraPositionY = -Math.tan(camera.rotation.x)*distance;
export const initialCameraPositionX = Math.tan(camera.rotation.y)*Math.sqrt(distance**2 + initialCameraPositionY**2);
camera.position.y = initialCameraPositionY;
camera.position.x = initialCameraPositionX;
camera.position.z = distance;

// Create a boolean flag to track the camera view
export var isTopView = false;

// Function to toggle between top view and default view
export function toggleCameraView() {
  if (isTopView) {
    // Switch to the default view
    camera.rotation.x = 50 * Math.PI / 180;
    camera.rotation.y = 20 * Math.PI / 180;
    camera.rotation.z = 10 * Math.PI / 180;
    const initialCameraPositionY = -Math.tan(camera.rotation.x) * distance;
    const initialCameraPositionX = Math.tan(camera.rotation.y) * Math.sqrt(distance ** 2 + initialCameraPositionY ** 2);
    camera.position.y = initialCameraPositionY;
    camera.position.x = initialCameraPositionX;
    camera.position.z = distance;
    isTopView = false;
  } else {
    // Switch to the top view
    camera.rotation.x = 0;
    camera.rotation.y = 0;
    camera.rotation.z = 0;
    camera.position.set(0, 0, 500); // You can adjust the top view camera position as needed
    isTopView = true;
  }
}
