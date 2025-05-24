// Basic three.js setup
let scene, camera, renderer, controls;
let particles, linesMesh;
const particleCount = 500; // Keep particle count modest for performance with line drawing
const particleSystem = new THREE.BufferGeometry();
const lineGeometry = new THREE.BufferGeometry();
const lineMaterial = new THREE.LineBasicMaterial({ vertexColors: true, blending: THREE.AdditiveBlending, transparent: true });
const maxLines = particleCount * 3; // Estimate max lines, can be tuned
const linePositions = new Float32Array(maxLines * 3 * 2); // Each line has 2 vertices, each vertex has 3 coords
const lineColors = new Float32Array(maxLines * 3 * 2);
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3); // For individual particle colors
const velocities = [];
const accelerations = [];
let mouse = new THREE.Vector2();
let averageSpeed = 0;

function init() {
    // Scene
    scene = new THREE.Scene();
    // scene.fog = new THREE.Fog(0x000000, 200, 700); // Optional fog for depth

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 300;

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Particles
    const particleMaterial = new THREE.PointsMaterial({
        size: 2,
        blending: THREE.AdditiveBlending,
        transparent: true,
        sizeAttenuation: true,
        vertexColors: true // Enable vertex colors
    });

    const initialColor = new THREE.Color(0xffffff);
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 500; // x
        positions[i3 + 1] = (Math.random() - 0.5) * 500; // y
        positions[i3 + 2] = (Math.random() - 0.5) * 500; // z

        colors[i3] = initialColor.r;
        colors[i3 + 1] = initialColor.g;
        colors[i3 + 2] = initialColor.b;

        velocities.push(new THREE.Vector3(
            (Math.random() - 0.5) * 0.5,
            (Math.random() - 0.5) * 0.5,
            (Math.random() - 0.5) * 0.5
        ));
        accelerations.push(new THREE.Vector3(0, 0, 0));
    }

    particleSystem.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleSystem.setAttribute('color', new THREE.BufferAttribute(colors, 3)); // Add color attribute
    particles = new THREE.Points(particleSystem, particleMaterial);
    scene.add(particles);

    // Lines
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));
    linesMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(linesMesh);

    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);
    // Handle mouse move
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('touchmove', onDocumentTouchMove, false);

    // OrbitControls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 50;
    controls.maxDistance = 700;
    controls.maxPolarAngle = Math.PI;


    // Initial call to animate
    animate();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onDocumentTouchStart( event ) {
    if ( event.touches.length === 1 ) {
        event.preventDefault();
        mouse.x = ( event.touches[0].pageX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.touches[0].pageY / window.innerHeight ) * 2 + 1;
    }
}

function onDocumentTouchMove( event ) {
    if ( event.touches.length === 1 ) {
        event.preventDefault();
        mouse.x = ( event.touches[0].pageX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.touches[0].pageY / window.innerHeight ) * 2 + 1;
    }
}


function animate() {
    requestAnimationFrame(animate);

    // Update particle positions
    const currentPositions = particleSystem.attributes.position.array;
    const currentColors = particleSystem.attributes.color.array;
    const interactionRadius = 50; // Radius for attraction
    const repulsionRadius = 15;  // Radius for repulsion
    const attractionStrength = 0.002;
    const repulsionStrength = 0.05;
    const centerAttractionStrength = 0.0005;
    const mouseInteractionStrength = 0.1;
    const mouseInteractionRadius = 100;
    const fractalConnectionDistance = 30; // Max distance to connect lines
    const fractalVelocityThreshold = 0.3; // Max velocity to form connection

    let totalSpeed = 0;
    let lineIdx = 0;

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const particle_i_pos = new THREE.Vector3(currentPositions[i3], currentPositions[i3 + 1], currentPositions[i3 + 2]);

        // Attraction to center
        const directionToCenter = new THREE.Vector3().sub(particle_i_pos).normalize().multiplyScalar(centerAttractionStrength);
        accelerations[i].add(directionToCenter);
        
        // Mouse interaction
        // Project mouse to a plane at z=0 for interaction
        const mouseWorldPos = new THREE.Vector3(mouse.x, mouse.y, 0.5);
        mouseWorldPos.unproject(camera);
        const direction = mouseWorldPos.sub(camera.position).normalize();
        const distanceToPlane = -camera.position.z / direction.z;
        const mousePlanePos = camera.position.clone().add(direction.multiplyScalar(distanceToPlane));
        
        const vecToMouse = new THREE.Vector3().subVectors(mousePlanePos, particle_i_pos);
        // For simplicity, let's make mouse interaction primarily in XY plane, ignore Z for mouse position
        vecToMouse.z = 0; 
        const distToMouse = vecToMouse.length();

        if (distToMouse < mouseInteractionRadius && distToMouse > 0) {
            // Attract to mouse
            const mouseForce = vecToMouse.normalize().multiplyScalar(mouseInteractionStrength * (1 - distToMouse / mouseInteractionRadius));
            accelerations[i].add(mouseForce);
        }


        for (let j = 0; j < particleCount; j++) {
            if (i === j) continue;

            const j3 = j * 3;
            const particle_j_pos = new THREE.Vector3(currentPositions[j3], currentPositions[j3 + 1], currentPositions[j3 + 2]);
            const distanceVec = new THREE.Vector3().subVectors(particle_j_pos, particle_i_pos);
            const distance = distanceVec.length();

            if (distance < repulsionRadius && distance > 0) { // Repulsion
                const repulsionForce = distanceVec.normalize().multiplyScalar(-repulsionStrength / (distance * 0.5 + 0.1)); // Stronger when closer
                accelerations[i].add(repulsionForce);
            } else if (distance < interactionRadius && distance > repulsionRadius) { // Attraction
                const attractionForce = distanceVec.normalize().multiplyScalar(attractionStrength);
                accelerations[i].add(attractionForce);
            }
        }

        // Limit acceleration
        accelerations[i].clampLength(0, 0.2); // Increased max acceleration slightly

        velocities[i].add(accelerations[i]);
        // Limit speed
        velocities[i].clampLength(0, 1.5); // Reduced max speed slightly for more clumping

        currentPositions[i3] += velocities[i].x;
        currentPositions[i3 + 1] += velocities[i].y;
        currentPositions[i3 + 2] += velocities[i].z;

        // Reset acceleration for next frame
        accelerations[i].set(0, 0, 0);

        // Boundary conditions (bounce off walls)
        const boundary = 280; // Slightly larger than initial spread
        if (Math.abs(currentPositions[i3]) > boundary) {
            velocities[i].x *= -0.7; // Dampen on bounce
            currentPositions[i3] = Math.sign(currentPositions[i3]) * boundary;
        }
        if (Math.abs(currentPositions[i3 + 1]) > boundary) {
            velocities[i].y *= -0.7;
            currentPositions[i3 + 1] = Math.sign(currentPositions[i3 + 1]) * boundary;
        }
        if (Math.abs(currentPositions[i3 + 2]) > boundary) {
            velocities[i].z *= -0.7;
            currentPositions[i3 + 2] = Math.sign(currentPositions[i3 + 2]) * boundary;
        }
        
        // Dampen velocity slightly to prevent runaway speeds and encourage settling
        velocities[i].multiplyScalar(0.98);
        totalSpeed += velocities[i].length();

        // Fractal line connections
        if (velocities[i].length() < fractalVelocityThreshold) {
            for (let j = i + 1; j < particleCount; j++) { // Check with subsequent particles to avoid duplicates and self-connect
                if (velocities[j].length() < fractalVelocityThreshold) {
                    const j3 = j * 3;
                    const p1 = new THREE.Vector3(currentPositions[i3], currentPositions[i3+1], currentPositions[i3+2]);
                    const p2 = new THREE.Vector3(currentPositions[j3], currentPositions[j3+1], currentPositions[j3+2]);
                    const dist = p1.distanceTo(p2);

                    if (dist < fractalConnectionDistance && lineIdx < maxLines -1 ) {
                        const lIdx6 = lineIdx * 6; // 2 vertices * 3 coords
                        linePositions[lIdx6 + 0] = p1.x;
                        linePositions[lIdx6 + 1] = p1.y;
                        linePositions[lIdx6 + 2] = p1.z;
                        linePositions[lIdx6 + 3] = p2.x;
                        linePositions[lIdx6 + 4] = p2.y;
                        linePositions[lIdx6 + 5] = p2.z;
                        lineIdx++;
                    }
                }
            }
        }
    }
    averageSpeed = totalSpeed / particleCount;

    // Feedback loop: Adjust color based on average speed for particles and lines
    const baseColor = new THREE.Color(0x0077ff); // Blueish
    const highSpeedColor = new THREE.Color(0xff4400); // Reddish
    const phaseTransitionColor = new THREE.Color(0xffee00); // Yellowish for transition
    
    let lerpFactor = averageSpeed / 1.5; // Normalize speed (adjust 1.5 as needed)
    let finalColor;

    if (averageSpeed > 1.2) { // "High energy" phase
        finalColor = highSpeedColor;
    } else if (averageSpeed < 0.3 && lineIdx > particleCount * 0.1) { // "Settled / Connected" phase - more lines forming
        finalColor = phaseTransitionColor.clone().lerp(baseColor, lineIdx / (particleCount * 0.5)); // Transition to base as more lines form
    } else { // "Normal" phase
        finalColor = baseColor.clone().lerp(highSpeedColor, Math.min(lerpFactor, 1.0));
    }


    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        currentColors[i3] = finalColor.r;
        currentColors[i3 + 1] = finalColor.g;
        currentColors[i3 + 2] = finalColor.b;
    }
     // Set line colors (can be same as particles or different)
    for (let i = 0; i < lineIdx; i++) {
        const i6 = i * 6;
        lineColors[i6 + 0] = finalColor.r * 0.8; // Slightly dimmer lines
        lineColors[i6 + 1] = finalColor.g * 0.8;
        lineColors[i6 + 2] = finalColor.b * 0.8;
        lineColors[i6 + 3] = finalColor.r * 0.8;
        lineColors[i6 + 4] = finalColor.g * 0.8;
        lineColors[i6 + 5] = finalColor.b * 0.8;
    }


    particleSystem.attributes.position.needsUpdate = true;
    particleSystem.attributes.color.needsUpdate = true;

    lineGeometry.attributes.position.needsUpdate = true;
    lineGeometry.attributes.color.needsUpdate = true;
    lineGeometry.setDrawRange(0, lineIdx * 2); // Only draw active lines

    // The following camera movement code is now handled by OrbitControls
    // camera.lookAt(scene.position);
    // camera.position.x = Math.sin(Date.now() * 0.0001) * 300;
    // camera.position.z = Math.cos(Date.now() * 0.0001) * 300 + 150; // Keep it a bit further
    // particles.rotation.x += 0.0005;
    // particles.rotation.y += 0.0005;

    controls.update(); // only required if controls.enableDamping or controls.autoRotate are set to true

    renderer.render(scene, camera);
}

// Initialize
init();
