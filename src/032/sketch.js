// --- グローバル変数 ---
let colorTimer = 0;
let angle = 0; // 4次元回転用

// インタラクション用
let rotationX = 0; // X軸回転（ユーザー操作）
let rotationY = 0; // Y軸回転（ユーザー操作）
let prevMouseX, prevMouseY;
let isDragging = false;
let pressStartX, pressStartY;

// ズーム用
let scaleFactor;
let minScale = 50;
let maxScale = 2000;
let prevPinchDist = null;

// 4次元座標点
let points4D = [
  [-1, -1, -1, -1], [1, -1, -1, -1], [1, 1, -1, -1], [-1, 1, -1, -1],
  [-1, -1, 1, -1], [1, -1, 1, -1], [1, 1, 1, -1], [-1, 1, 1, -1],
  [-1, -1, -1, 1], [1, -1, -1, 1], [1, 1, -1, 1], [-1, 1, -1, 1],
  [-1, -1, 1, 1], [1, -1, 1, 1], [1, 1, 1, 1], [-1, 1, 1, 1]
];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  scaleFactor = min(width, height) * 0.3;
  frameRate(30);
  imageMode(CENTER);
}

function draw() {
  background(0);

  // ユーザー操作による回転
  rotateX(rotationX);
  rotateY(rotationY);

  // 4次元投影と描画
  angle += 0.01; // 4次元回転は自動
  let projected3D = [];
  for (let i = 0; i < points4D.length; i++) {
    let projected = project4DTo3D(points4D[i], 2);
    projected3D.push(projected);
  }

  strokeWeight(3);

  // 辺の接続
  for (let i = 0; i < 16; i++) {
    for (let j = i + 1; j < 16; j++) {
      let diff = 0;
      for (let k = 0; k < 4; k++) {
        if (points4D[i][k] !== points4D[j][k]) diff++;
      }
      if (diff === 1) {
        connectPoints(projected3D, i, j);
      }
    }
  }

  // 色タイマー更新
  colorTimer += 0.02;
}

// --- イベントハンドラ ---
// タッチ・マウスプレス
function touchStarted() { handlePress(); }
function mousePressed() { handlePress(); }
function handlePress() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    isDragging = true;
    prevMouseX = mouseX;
    prevMouseY = mouseY;
    pressStartX = mouseX;
    pressStartY = mouseY;
  }
}

// タッチ・マウスムーブ
function touchMoved() {
  // ピンチズーム（2本指）
  if (touches.length === 2) {
    let d = dist(touches[0].x, touches[0].y, touches[1].x, touches[1].y);
    if (prevPinchDist !== null) {
      let diff = d - prevPinchDist;
      scaleFactor = constrain(scaleFactor + diff, minScale, maxScale);
    }
    prevPinchDist = d;
    // ドラッグ操作は無効化
    return false;
  } else {
    prevPinchDist = null;
    handleDrag();
  }
}
function mouseDragged() { handleDrag(); }
function handleDrag() {
  if (isDragging) {
    let dx = mouseX - prevMouseX;
    let dy = mouseY - prevMouseY;
    rotationY += dx * 0.005;
    rotationX -= dy * 0.005;
    prevMouseX = mouseX;
    prevMouseY = mouseY;
  }
}

// タッチ・マウスリリース
function touchEnded() { handleRelease(); prevPinchDist = null; }
function mouseReleased() { handleRelease(); }
function handleRelease() {
  if (isDragging) {
    let distMoved = dist(mouseX, mouseY, pressStartX, pressStartY);
    if (distMoved < 10) {
      colorTimer = 0; // タップ時に色タイマーリセット
    }
    isDragging = false;
  }
}

// PC: マウスホイールでズーム
function mouseWheel(event) {
  let factor = event.delta > 0 ? 0.95 : 1.05;
  scaleFactor = constrain(scaleFactor * factor, minScale, maxScale);
  return false; // ページスクロール抑制
}

// ウィンドウリサイズ
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // ズーム倍率は維持
}

// --- 4次元→3次元投影 ---
function project4DTo3D(point4D, w) {
  // 4次元回転（XW平面）
  let c = cos(angle);
  let s = sin(angle);
  let x = point4D[0] * c - point4D[3] * s;
  let y = point4D[1];
  let z = point4D[2];
  let w_ = point4D[0] * s + point4D[3] * c;

  // 3次元への射影
  let distance = 2;
  let factor = scaleFactor / (distance - w_);
  return createVector(x * factor, y * factor, z * factor);
}

// --- 辺の描画 ---
function connectPoints(points, i, j) {
  stroke(
    color(
      max((255 * sin(i + colorTimer)), 100),
      max((255 * sin(j + colorTimer)), 100),
      max((255 * sin(1 + i + j + colorTimer)), 100),
      200
    )
  );
  line(points[i].x, points[i].y, points[i].z, 
    points[j].x, points[j].y, points[j].z);

  noFill();
  box(
    points[i].x, 
    points[i].y, 
    points[i].z, 
    );
  box(
    points[j].x, 
    points[j].y, 
    points[j].z, 
  );
}
