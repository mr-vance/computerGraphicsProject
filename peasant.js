// Load the FBX model and animations
const loader = new THREE.FBXLoader();
let character; // This will hold the loaded FBX character

loader.load('lady/idle.fbx', (fbx) => {
  character = fbx;

  // Set up animations (assuming you have 'idle' and 'running' animations)
  const mixer = new THREE.AnimationMixer(character);
  const idleAction = mixer.clipAction(fbx.animations.find((clip) => clip.name === 'idle'));
  const runningAction = mixer.clipAction(fbx.animations.find((clip) => clip.name === 'running'));

  // Add the character to the scene
  scene.add(character);

  // Play the idle animation by default
  idleAction.play();

  // Function to switch to the running animation
  function playRunningAnimation() {
    idleAction.stop();
    runningAction.play();
  }

  // Function to switch to the idle animation
  function playIdleAnimation() {
    runningAction.stop();
    idleAction.play();
  }

  // Example: Switch to running animation when needed
  document.getElementById('runButton').addEventListener('click', () => {
    playRunningAnimation();
  });

  // Example: Switch to idle animation when needed
  document.getElementById('idleButton').addEventListener('click', () => {
    playIdleAnimation();
  });

  // Animation update function
  function animateCharacter() {
    mixer.update(deltaTime); // Update the animation mixer
    // Other character-related updates
  }

  // Render loop
  function animate(timestamp) {
    requestAnimationFrame(animate);
    animateCharacter(); // Update character animations
    renderer.render(scene, camera);
  }

  // Start the animation loop
  animate();
});
