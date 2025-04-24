let t = 0;
let circles = [];
const MAX_CIRCLES = 200;
let tapMessage = "Tap to start";
let showTapMessage = true;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);
  textAlign(CENTER, CENTER);
  textSize(32);
}

function draw() {
  let B = blendMode;

  B(BLEND);
  background(0, 0.1);

  B(ADD);
  noFill();

  t += 0.005;

  if (showTapMessage) {
    B(BLEND);
    fill(255);
    text(tapMessage, width / 2, height / 2);
  }

  for (let i = circles.length - 1; i >= 0; i--) {
    const circleInfo = circles[i];
    const circleX = circleInfo.x;
    const circleY = circleInfo.y;
    const circleAge = t - circleInfo.createdAt;

    const tmp1 = noise(circleX / 200, circleY / 200, t) * 6 + t;
    const tmp2 = pow(tan(tmp1), 8);
    const circleSize = min(50, width / tmp2) * (1 + circleAge * 2); // Increased size and speed
    const alpha = map(circleAge, 0, 1, 1, 0); // Fade out over 1 second

    stroke(tmp1 * 360 % 360, 90, 100, tmp2 * alpha);

    circle(circleX, circleY, circleSize * 4);

    if (circleAge > 1 || circles.length > MAX_CIRCLES) {
      circles.shift();
    }
  }
}

function mousePressed() {
  if (showTapMessage) {
    showTapMessage = false;
  }
  const newCircle = {
    x: mouseX,
    y: mouseY,
    createdAt: t
  };
  circles.push(newCircle);

  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
