let particles = [];
// let nParticles = 300;
let nParticles = 128;
let angle = 0;
let t = 0;
let hammer;
let zoom = 1;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  background(0);
  for (let i = 0; i < nParticles; i++) {
    particles[i] = new Particle(random(0, width), random(0, height));
  }

  hammer = new Hammer(document.body);
  hammer.get('pinch').set({ enable: true });

  hammer.on('tap', (e) => {
    addForce(e.center.x - width/2, e.center.y - height/2, 500);
  });

  hammer.on('pan', (e) => {
    let force = createVector(e.deltaX, e.deltaY).mult(0.1);
    addForce(e.center.x - width/2, e.center.y - height/2, force.mag(), force);
  });

  hammer.on('pinch', (e) => {
    zoom += e.scale * -0.01;
    zoom = constrain(zoom, 0.5, 3);
  });
}

function draw() {
  background(0);
  scale(zoom);

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

function mouseWheel(e) {
  zoom += e.deltaY * -0.01;
  zoom = constrain(zoom, 0.5, 3);
}

function mouseDragged() {
  let force = createVector(mouseX - pmouseX, mouseY - pmouseY).mult(0.1);
  addForce(mouseX - width/2, mouseY - height/2, force.mag(), force);
}

function addForce(x, y, radius, force) {
    particles.forEach(p => {
        p.applyExternalForce(force, createVector(x,y), radius);
    });
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
