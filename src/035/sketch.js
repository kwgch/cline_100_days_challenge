let angle = 0;
let scalar = 70;
let boxSize;
const numBoxes = 128;
const fr = 30;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100);
  frameRate(fr);
}

function draw() {
  background(0);
  orbitControl();
  noFill();
  strokeWeight(2);

  rotateX(angle * 0.5);
  rotateY(angle * 0.7);
  rotateZ(angle * 1.1);

  for (let i = 0; i < numBoxes; i++) {
    const radius = scalar * i * 0.5;

    boxSize = map(sin(angle * 2 + i * 0.1), -1, 1, 10, 30);
    const hue = map(i, 0, numBoxes, 0, 360);
    const saturation = map(sin(angle + i * 0.05), -1, 1, 50, 100);
    const brightness = map(cos(angle * 0.5 + i * 0.05), -1, 1, 60, 100);
    stroke(hue, saturation, brightness);

    const x = cos(i * 1.1) * radius;
    const y = sin(i * 1.4) * radius;
    const z = sin(i * 0.6) * radius;

    push();
    translate(x, y, z);

    rotateX(angle * 0.6 + i * 0.02);
    rotateY(angle * 0.8 + i * 0.02);
    rotateZ(angle * 1.2 + i * 0.02);

    const boxScale = map(sin(angle * 0.7 + i * 0.1), -1, 1, 0.5, 1.5);
    scale(boxScale);

    box(boxSize*2);
    box(boxSize);
    box(boxSize/2);
    pop();
  }

  angle += 0.03;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
