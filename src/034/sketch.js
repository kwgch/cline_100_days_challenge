let particles = [];
let nParticles = 256;
let angle = 0;
let t = 0;
let zoom = 1;
let canvas;

let initialTouchDistance = null;
let initialZoom = 1;
let initialTouchX = 0;
let initialTouchY = 0;

let mouseIsPressed = false;
let previousMouseX = 0;
let previousMouseY = 0;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  background(0);
  for (let i = 0; i < nParticles; i++) {
    particles[i] = new Particle(random(0, width), random(0, height));
  }

  canvas.elt.addEventListener('touchstart', touchStartHandler);
  canvas.elt.addEventListener('touchmove', touchMoveHandler);
  canvas.elt.addEventListener('touchend', touchEndHandler);
  canvas.elt.addEventListener('touchcancel', touchEndHandler);

  canvas.elt.addEventListener('mousedown', mouseDownHandler);
  canvas.elt.addEventListener('mousemove', mouseMoveHandler);
  canvas.elt.addEventListener('mouseup', mouseUpHandler);
  canvas.elt.addEventListener('mousewheel', mouseWheelHandler);
}

function draw() {
  background(0);
  translate(width / 2, height / 2);
  scale(zoom);
  translate(-width / 2, -height / 2);

  for (let i = 0; i < nParticles; i++) {
    let px = map(sin(t), -1, 1, -1, 1);
    let py = map(cos(t), -1, 1, -1, 1);
    particles[i].update(px, py);
    particles[i].display();
  }
  t += 0.01;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function addForce(x, y, radius, force) {
    particles.forEach(p => {
        p.applyExternalForce(force, createVector(x,y), radius);
    });
}

function touchStartHandler(e) {
  e.preventDefault();
  if (e.touches.length === 2) {
    initialTouchDistance = dist(e.touches[0].clientX, e.touches[0].clientY, e.touches[1].clientX, e.touches[1].clientY);
    initialZoom = zoom;
  } else if (e.touches.length === 1) {
    initialTouchX = e.touches[0].clientX;
    initialTouchY = e.touches[0].clientY;
    addForce(e.touches[0].clientX, e.touches[0].clientY, 50);
  }
}

function touchMoveHandler(e) {
  e.preventDefault();
  if (e.touches.length === 2) {
    const currentTouchDistance = dist(e.touches[0].clientX, e.touches[0].clientY, e.touches[1].clientX, e.touches[1].clientY);
    zoom = initialZoom + (currentTouchDistance - initialTouchDistance) * 0.01;
    zoom = constrain(zoom, 0.5, 3);
  } else if (e.touches.length === 1) {
    let force = createVector(e.touches[0].clientX - initialTouchX, e.touches[0].clientY - initialTouchY).mult(0.1);
    addForce(e.touches[0].clientX, e.touches[0].clientY, force.mag(), force);
  }
}

function touchEndHandler(e) {
  e.preventDefault();
  initialTouchDistance = null;
}

function mouseDownHandler(e) {
  mouseIsPressed = true;
  previousMouseX = e.clientX;
  previousMouseY = e.clientY;
}

function mouseMoveHandler(e) {
  if (mouseIsPressed) {
    let force = createVector(e.clientX - previousMouseX, e.clientY - previousMouseY).mult(0.1);
    addForce(e.clientX, e.clientY, force.mag(), force);
    previousMouseX = e.clientX;
    previousMouseY = e.clientY;
  }
}

function mouseUpHandler(e) {
  mouseIsPressed = false;
}

function mouseWheelHandler(e) {
  zoom += e.deltaY * -0.01;
  zoom = constrain(zoom, 0.5, 3);
}

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.size = random(3, 10) * min(width, height) / 600;
    this.hue = random(0,360);
  }

  applyExternalForce(force, position, radius) {
      let d = p5.Vector.dist(this.pos, position);
      if (d < radius) {
          let intensity = map(d, 0, radius, 1, 0);
          if (force) {
            this.acc.add(force.copy().mult(intensity));
          } else {
            this.acc.add(createVector(0,0).mult(intensity));
          }
      }
  }

  update(px, py) {
    let angle = noise(this.pos.x * px * 0.01, 
                      this.pos.y * py * 0.01) * TWO_PI * 4;
    this.acc.set(cos(angle), sin(angle));
    this.vel.add(this.acc);
    this.vel.limit(2);
    this.pos.add(this.vel);

    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.y < 0) this.pos.y = height;
    if (this.pos.y > height) this.pos.y = 0;
  }

  display() {
    stroke(this.hue % 360, 100, 100, 50);
    noFill()
    strokeWeight(3)
    ellipse(this.pos.x, this.pos.y, this.size);
    this.hue += 0.1;
  }
}
