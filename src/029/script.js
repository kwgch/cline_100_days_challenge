// 3D Metaball Interactive Visualizer
// Requirements: Three.js and GSAP must be loaded via CDN in index.html

// === Color Family Utilities ===
function randomInt(a, b) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

// Define color families as base HSL values
const COLOR_FAMILIES = [
  { name: "blue",    h: 200, s: 80, l: 55, spread: 20 },
  { name: "green",   h: 130, s: 70, l: 55, spread: 20 },
  { name: "pink",    h: 320, s: 70, l: 65, spread: 20 },
  { name: "orange",  h: 35,  s: 90, l: 60, spread: 15 },
  { name: "purple",  h: 260, s: 60, l: 60, spread: 20 },
  { name: "teal",    h: 170, s: 60, l: 55, spread: 15 },
  { name: "yellow",  h: 50,  s: 90, l: 60, spread: 15 }
];

// Pick a random color family for this session
const colorFamily = COLOR_FAMILIES[randomInt(0, COLOR_FAMILIES.length - 1)];

// Generate a random color in the selected family (returns THREE.Color)
function randomFamilyColor() {
  const h = (colorFamily.h + randomInt(-colorFamily.spread, colorFamily.spread) + 360) % 360;
  const s = Math.max(40, Math.min(100, colorFamily.s + randomInt(-10, 10)));
  const l = Math.max(35, Math.min(80, colorFamily.l + randomInt(-10, 10)));
  const color = new THREE.Color();
  color.setHSL(h / 360, s / 100, l / 100);
  return color;
}

// === Scene Setup ===
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x181c20);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 18);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.domElement.style.touchAction = 'none';
document.body.appendChild(renderer.domElement);

// === Metaball Parameters ===
const METABALL_COUNT = window.innerWidth < 600 ? 6 : 10;
const METABALL_MIN_RADIUS = 1.2;
const METABALL_MAX_RADIUS = 2.1;

// === Metaball Creation ===
const metaballs = [];
const metaballColors = [];

for (let i = 0; i < METABALL_COUNT; i++) {
  const radius = Math.random() * (METABALL_MAX_RADIUS - METABALL_MIN_RADIUS) + METABALL_MIN_RADIUS;
  const color = randomFamilyColor();
  metaballColors.push(color.clone());

  const geometry = new THREE.SphereGeometry(radius, 32, 32);
  const material = new THREE.MeshPhongMaterial({
    color: color,
    shininess: 80,
    transparent: true,
    opacity: 0.92
  });
  const mesh = new THREE.Mesh(geometry, material);

  mesh.position.set(
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10
  );

  scene.add(mesh);
  metaballs.push(mesh);
}

// === Lighting ===
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
directionalLight.position.set(10, 10, 20);
scene.add(directionalLight);

// === Fluffy Movement Per Ball ===
function animateBall(i) {
  const ball = metaballs[i];
  const target = {
    x: (Math.random() - 0.5) * 10,
    y: (Math.random() - 0.5) * 10,
    z: (Math.random() - 0.5) * 10
  };
  gsap.to(ball.position, {
    x: target.x,
    y: target.y,
    z: target.z,
    duration: 2.5 + Math.random() * 2,
    ease: "sine.inOut",
    onComplete: () => animateBall(i)
  });
}

// Start continuous movement for each metaball
metaballs.forEach((_, i) => animateBall(i));

// === Raycaster for Interaction ===
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function getPointer(event) {
  if (event.touches && event.touches.length > 0) {
    pointer.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
  } else {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }
}

// === Tap/Click Feedback ===
function handlePointerDown(event) {
  getPointer(event);
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(metaballs);

  if (intersects.length > 0) {
    const obj = intersects[0].object;
    const origColor = obj.material.color.clone();
    const newColor = randomFamilyColor();
    gsap.to(obj.material.color, {
      r: newColor.r,
      g: newColor.g,
      b: newColor.b,
      duration: 0.18,
      yoyo: true,
      repeat: 1,
      onComplete: () => obj.material.color.copy(origColor)
    });
    gsap.to(obj.scale, {
      x: 1.25,
      y: 1.25,
      z: 1.25,
      duration: 0.13,
      yoyo: true,
      repeat: 1,
      ease: "power1.inOut"
    });
  }
}

// === Drag/Swipe to Rotate Scene ===
let isDragging = false;
let lastX = 0, lastY = 0;
let targetRotationX = 0, targetRotationY = 0;
let currentRotationX = 0, currentRotationY = 0;

function onPointerDown(event) {
  isDragging = true;
  if (event.touches && event.touches.length > 0) {
    lastX = event.touches[0].clientX;
    lastY = event.touches[0].clientY;
  } else {
    lastX = event.clientX;
    lastY = event.clientY;
  }
}

function onPointerMove(event) {
  if (!isDragging) return;
  let clientX, clientY;
  if (event.touches && event.touches.length > 0) {
    clientX = event.touches[0].clientX;
    clientY = event.touches[0].clientY;
  } else {
    clientX = event.clientX;
    clientY = event.clientY;
  }
  const deltaX = clientX - lastX;
  const deltaY = clientY - lastY;
  lastX = clientX;
  lastY = clientY;

  targetRotationY += deltaX * 0.008;
  targetRotationX += deltaY * 0.008;
  targetRotationX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, targetRotationX));
}

function onPointerUp() {
  isDragging = false;
}

// === Event Listeners ===
renderer.domElement.addEventListener('pointerdown', onPointerDown, { passive: false });
renderer.domElement.addEventListener('pointermove', onPointerMove, { passive: false });
renderer.domElement.addEventListener('pointerup', onPointerUp, { passive: false });
renderer.domElement.addEventListener('pointerleave', onPointerUp, { passive: false });
renderer.domElement.addEventListener('touchstart', onPointerDown, { passive: false });
renderer.domElement.addEventListener('touchmove', onPointerMove, { passive: false });
renderer.domElement.addEventListener('touchend', onPointerUp, { passive: false });
renderer.domElement.addEventListener('click', handlePointerDown, { passive: false });
renderer.domElement.addEventListener('touchstart', handlePointerDown, { passive: false });

// Prevent scrolling on mobile
renderer.domElement.addEventListener('touchmove', e => e.preventDefault(), { passive: false });

// === Responsive Resize ===
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// === Animation Loop ===
function animate() {
  currentRotationX += (targetRotationX - currentRotationX) * 0.12;
  currentRotationY += (targetRotationY - currentRotationY) * 0.12;
  scene.rotation.x = currentRotationX;
  scene.rotation.y = currentRotationY;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();
