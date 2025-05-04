const fr = 30;

let camAngleX = 0;
let camAngleY = 0;
let camZoom = 1.0;
let prevMouseX = 0;
let prevMouseY = 0;
let prevPinchDist = 0;
let isDragging = false;
let initialDistance = 500; // 適当な初期距離

function setup() {
  frameRate(fr);
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {
  background(0);

  // カメラ制御
  translate(0, 0, -initialDistance * camZoom);
  rotateX(camAngleX);
  rotateY(camAngleY);

  // 既存のアニメーション
//   rotateX(frameCount * 0.01);
//   rotateY(frameCount * 0.01);
//   rotateZ(frameCount * 0.01);

  let numPoints = 100;
  let radius = 200;
  let angleStep = TWO_PI / numPoints;

  push();
  noFill();
  stroke(random(0, 50),
         random(100-(camAngleX*100), 150+(camAngleX*100)),
         random(200-(camAngleY*100), 255+(camAngleY*100))
        );
  strokeWeight(2);
  beginShape();

  w = 50;
  for (let i = 0; i <= numPoints; i++) {
    let angle = i * angleStep;
    let x = radius * cos(angle);
    let y = radius * sin(angle);
    let z = 30 * tan(i * 0.1 + frameCount * 0.05);

    vertex(x + w, y,     z);
    vertex(x,     y + w, z);
    vertex(x + w, y + w, z);
  }
  endShape(CLOSE);
  pop();
}

// タッチ開始
function touchStarted() {
  prevMouseX = mouseX;
  prevMouseY = mouseY;

  if (touches.length === 1) {
    isDragging = true;
  } else if (touches.length === 2) {
    prevPinchDist = dist(touches[0].x, touches[0].y, touches[1].x, touches[1].y);
    isDragging = false;
  }
  return false; // prevent default
}

// タッチ移動
function touchMoved() {
  event.preventDefault();

  if (touches.length === 1 && isDragging) {
    let deltaX = mouseX - prevMouseX;
    let deltaY = mouseY - prevMouseY;

    camAngleY += deltaX * 0.005;
    camAngleX += deltaY * 0.005;

    prevMouseX = mouseX;
    prevMouseY = mouseY;
  } else if (touches.length === 2) {
    const currentDist = dist(touches[0].x, touches[0].y, touches[1].x, touches[1].y);
    camZoom *= currentDist / prevPinchDist;
    prevPinchDist = currentDist;
  }
  return false; // prevent default
}

// タッチ終了
function touchEnded() {
  isDragging = false;
  prevPinchDist = 0;
  return false; // prevent default
}

// マウス押下
function mousePressed() {
  prevMouseX = mouseX;
  prevMouseY = mouseY;
  isDragging = true;
}

// マウスドラッグ
function mouseDragged() {
  if (isDragging) {
    let deltaX = mouseX - prevMouseX;
    let deltaY = mouseY - prevMouseY;

    camAngleY += deltaX * 0.005;
    camAngleX += deltaY * 0.005;

    prevMouseX = mouseX;
    prevMouseY = mouseY;
  }
}

// マウス離し
function mouseReleased() {
  isDragging = false;
}

// マウスホイール
function mouseWheel(event) {
  camZoom *= (1 - event.delta * 0.001);
  camZoom = constrain(camZoom, 0.1, 5); // ズーム制限
  return false; // prevent default
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
