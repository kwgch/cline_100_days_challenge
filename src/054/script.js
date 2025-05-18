/* Self-Organizing Starlight simulation
   Author: ChatGPT (o3)
*/
const canvas = document.getElementById('galaxy');
const ctx     = canvas.getContext('2d');
let   W, H, dpr;

function resize() {
  dpr = window.devicePixelRatio || 1;
  W   = canvas.width  = innerWidth  * dpr;
  H   = canvas.height = innerHeight * dpr;
  ctx.scale(dpr, dpr);
}
addEventListener('resize', resize);
resize();

/* ---------- Parameters ---------- */
const N          = 2500;        // initial particle count
const PARTICLE_R = 1.5;
const G          = 0.08;        // gravity-like constant
const MERGE_D2   = 4;           // merge distance squared
const BH_RADIUS  = 30;          // visual radius of black-hole attractor
/* -------------------------------- */

class Particle {
  constructor(x, y, vx = 0, vy = 0, m = 1) {
    this.x = x;  this.y = y;
    this.vx = vx; this.vy = vy;
    this.m = m;
  }
  update(attractors) {
    for (const a of attractors) {
      const dx = a.x - this.x;
      const dy = a.y - this.y;
      const d2 = dx*dx + dy*dy + 0.01;
      const inv = 1 / Math.sqrt(d2);
      const f   = G * a.m * inv * inv; // inverse-square
      this.vx += dx * f;
      this.vy += dy * f;
    }
    this.x += this.vx;
    this.y += this.vy;
  }
}

let particles = [];
function init() {
  particles = [];
  const centerX = W / 2 / dpr, centerY = H / 2 / dpr;
  for (let i = 0; i < N; i++) {
    const angle = Math.random()*Math.PI*2;
    const rad   = Math.random()*150 + 20;
    const px = centerX + Math.cos(angle)*rad;
    const py = centerY + Math.sin(angle)*rad;
    const speed = Math.sqrt(G) * Math.sqrt(centerX/rad);
    const vx = -Math.sin(angle)*speed;
    const vy =  Math.cos(angle)*speed;
    particles.push(new Particle(px, py, vx, vy));
  }
}
init();

/* -------- Attractor (Black Hole) -------- */
const attractors = [{x: W/2/dpr, y: H/2/dpr, m: 80}];
let dragging = false;

canvas.addEventListener('pointerdown', e => {
  dragging = true;
  moveBH(e);
});
addEventListener('pointermove',  e => dragging && moveBH(e));
addEventListener('pointerup',    () => dragging = false);
function moveBH(e) {
  attractors[0].x = e.clientX;
  attractors[0].y = e.clientY;
}

/* -------- Zoom -------- */
let zoom = 1;
addEventListener('wheel', e => {
  e.preventDefault();
  zoom *= e.deltaY < 0 ? 1.1 : 0.9;
});

/* -------- Keyboard -------- */
let wire = false;
addEventListener('keydown', e => {
  if (e.key === 'w') wire = !wire;
  if (e.key === 'r') init();
});

/* -------- Main Loop -------- */
function step() {
  ctx.save();
  ctx.setTransform(zoom, 0, 0, zoom, 0, 0);
  ctx.clearRect(0, 0, innerWidth, innerHeight);

  // update & draw particles
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.update(attractors);
    // merge near neighbors (simple O(n²); fine for < 5k)
    for (let j = i - 1; j >= 0; j--) {
      const q = particles[j];
      const dx = p.x - q.x, dy = p.y - q.y;
      if (dx*dx + dy*dy < MERGE_D2) {
        q.m += p.m;
        q.vx = (q.vx + p.vx) / 2;
        q.vy = (q.vy + p.vy) / 2;
        particles.splice(i, 1);
        break;
      }
    }
  }

  // draw
  if (!wire) {
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, PARTICLE_R, 0, Math.PI*2);
      ctx.fill();
    }
    // attractor
    ctx.beginPath();
    ctx.arc(attractors[0].x, attractors[0].y, BH_RADIUS, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(80,80,255,0.1)';
    ctx.fill();
  } else {
    ctx.strokeStyle = '#0ff';
    ctx.beginPath();
    for (const p of particles) {
      ctx.moveTo(p.x, p.y);
      ctx.arc(p.x, p.y, PARTICLE_R, 0, Math.PI*2);
    }
    ctx.stroke();
  }
  ctx.restore();
  requestAnimationFrame(step);
}
step();
