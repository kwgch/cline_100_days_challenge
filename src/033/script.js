const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size to fill the screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game variables
let organisms = [];
let food = [];

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  static random() {
    return new Vector(Math.random() * 2 - 1, Math.random() * 2 - 1).normalize();
  }

  clone() {
    return new Vector(this.x, this.y);
  }

  add(v) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  subtract(v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  multiply(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  divide(scalar) {
    this.x /= scalar;
    this.y /= scalar;
    return this;
  }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize() {
    const len = this.length();
    if (len !== 0) {
      this.divide(len);
    }
    return this;
  }

  distanceTo(v) {
    return Math.hypot(this.x - v.x, this.y - v.y);
  }
}

// 構文チェック用バリデーター
class DNAValidator {
  static isValid(code) {
    try {
      new Function('context', code);
      return true;
    } catch {
      return false;
    }
  }
}

// Organism class
class Organism {
  static NEXT_ID = 1;

  constructor(x, y, config = {}) {
    this.id = Organism.NEXT_ID++;
    this.position = new Vector(x, y);
    this.velocity = Vector.random();
    this.energy = config.energy || 100;
    this.dna = this.sanitizeDNA(config.dna || DEFAULT_DNA);
    this.herdId = config.herdId || this.id;
    this.lineage = config.lineage ? [...config.lineage, this.id] : [this.id];
    this.age = 0;
    this.state = 'alive'; // alive, dying, dead
    this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
  }

  // 修正箇所1: サニタイズ処理の正規表現を修正
  sanitizeDNA(code) {
    // console.log(`Original DNA: ${code}`);
    // 許可する文字に数学記号を追加（-, *, +）
    const safeCode = code.replace(/[^a-zA-Z0-9_{}();<>!=&|*+/\-.\s]/g, '');
    // console.log(`Sanitized DNA: ${safeCode}`);
    
    return safeCode;
  }

  update(world) {
    if (this.state !== 'alive') return;

    const context = {
      energy: this.energy,
      hunt: () => this.hunt(world),
      move: (dx, dy) => this.move(dx, dy),
      reproduce: () => this.reproduce(world),
      Math: Object.freeze({
        random: Math.random,
        floor: Math.floor,
        sqrt: Math.sqrt
      })
    };

    try {
      // const safeCode = `'use strict'; (function() { ${this.dna} })();`;
      const safeCode = `(function() { ${this.dna} })();`;

      new Function('context', safeCode).call(this, context);
    } catch (e) {
      // console.warn(`DNA実行エラー: ${e.message}`);
      // console.log(`dna: ${this.dna}`);
      this.dna = DEFAULT_DNA; // デフォルトコードにリセット
    }
    
    this.energy = Math.max(0, this.energy - 0.5);
    if (this.energy <= 0) {
      this.state = 'dead';
      // console.log(`Organism ${this.id} has died due to energy depletion.`);
    }
  }

  move(dx, dy) {
    this.position.add(new Vector(dx, dy));
    this.position.x = Math.max(0, Math.min(this.position.x, canvas.width));
    this.position.y = Math.max(0, Math.min(this.position.y, canvas.height));
  }

  // 捕食対象検索ロジック
  hunt(world) {
    const neighbors = world.getNeighbors(this.position, 100);
    const targets = neighbors.filter(o => 
      o.state === 'alive' && 
      o.herdId !== this.herdId &&
      this.position.distanceTo(o.position) < 20
    );

    if (targets.length > 0) {
      const target = targets[Math.floor(Math.random() * targets.length)];
      target.state = 'dead';
      this.energy = Math.min(100, this.energy + 50);
      world.removeOrganism(target);
    }
  }


  reproduce(world) {
    if (world.organisms.length > 256) return;
    if (this.energy >= 80) {
      this.energy -= 40;
      const child = new Organism(this.position.x + Math.random() * 10 - 5, this.position.y + Math.random() * 10 - 5, {
        dna: this.mutateDNA(this.dna),
        herdId: this.herdId,
        lineage: this.lineage
      });
      world.addOrganism(child);
    }
  }

  // 突然変異処理の改善
  mutateDNA(code) {
    let mutated = code.split('').map(c => {
      if (Math.random() < 0.3) {
        const newChar = String.fromCharCode(c.charCodeAt(0) + 
          Math.floor(Math.random() * 3 - 1));
        return '(){};'.includes(c) ? c : newChar; // 構文文字は変更しない
      }
      return c;
    }).join('');

    // バリデーション失敗時は元のコードを保持
    return DNAValidator.isValid(mutated) ? mutated : code;
  }

  draw() {
    if (this.state !== 'alive') return;
    
    // 群れごとの色設定
    // console.log(`Organism ${this.id} herdId: ${this.herdId}`);
    // const hue = parseInt((this.herdId + '').slice(0,8), 16) % 360;
    const hue = this.herdId * 16;
    ctx.fillStyle = `hsla(${hue}, 70%, 50%, 0.8)`;
    // ctx.fillStyle = `hsla(${hue}, 50%, 70%, 0.8)`;
    
    // 円形描画（パフォーマンス改善）
    ctx.beginPath();
    ctx.arc(
      this.position.x, 
      this.position.y, 
      Math.sqrt(this.energy*(canvas.width/30)), 0, Math.PI * 2
    );
    ctx.fill();
  }
}

// World class
class World {
  constructor() {
    this.organisms = [];
  }

  addOrganism(organism) {
    this.organisms.push(organism);
  }

  removeOrganism(organism) {
    this.organisms = this.organisms.filter(o => o !== organism);
  }

  getNeighbors(position, radius) {
    return this.organisms.filter(organism => {
      const distance = Math.sqrt(Math.pow(organism.position.x - position.x, 2) + Math.pow(organism.position.y - position.y, 2));
      return distance <= radius;
    });
  }

  findClosestOrganism(organism) {
    // console.log(`Organism ${organism.id} is looking for closest organism`);
    let closest = null;
    // let closestDistance = Infinity;
    let closestDistance = 16;
    this.organisms.forEach(other => {
      if (other !== organism && other.state === 'alive') {
        const distance = Math.sqrt(Math.pow(organism.position.x - other.position.x, 2) + Math.pow(organism.position.y - other.position.y, 2));
        // console.log(`Organism ${organism.id} distance to ${other.id}: ${distance}`);
        if (distance < closestDistance) {
          closest = other;
          closestDistance = distance;
        }
      }
    });
    return closest;
  }
}

  const DEFAULT_DNA = `
  if (context.energy < 30) {
    context.hunt();
  } else {
    const dx = (context.Math.random() * 2 - 1) * 8;
    const dy = (context.Math.random() * 2 - 1) * 8;
    context.move(dx, dy);
  }
  if (context.energy > 90) {context.reproduce();}
  `;

// 画面リサイズ対応
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// タップで生物追加
canvas.addEventListener('click', (e) => {
  if (world.organisms.length < 256) {
    // console.log(`Organism added at (${x}, ${y})`);
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    world.addOrganism(new Organism(x, y, { dna: DEFAULT_DNA }));
  }
});

// Create initial organisms
const world = new World();
for (let i = 0; i < 8; i++) {
  const organism = new Organism(Math.random() * canvas.width, Math.random() * canvas.height, { dna: DEFAULT_DNA });
  world.addOrganism(organism);
  organisms.push(organism);
}

const fps = 20;

// Game loop
function gameLoop() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update and draw organisms
  world.organisms.forEach(organism => {
    organism.update(world);
    organism.draw();
  });

  world.organisms = world.organisms.filter(organism => organism.state === 'alive');

  // Request next frame
  // requestAnimationFrame(gameLoop);
  setTimeout(() => {
    requestAnimationFrame(gameLoop);
  }, 1000 / fps);
}

// Start game loop
gameLoop();
