import * as Const from "./const.js";

class Particle {
  posX: number;
  posY: number;
  dirX: number;
  dirY: number;
  size: number;
  alpha: number;
  angle: number;
  spd: number;
  alive: boolean;

  constructor() {
    this.alive = false;
  }
}

export default class Particles {
  particles: Array<Particle>;
  alive: boolean;
  speed: number;

  constructor() {
    this.alive = false;
    this.particles = new Array(Const.PARTICLES_COUNT);
    for (let z = 0; z < Const.PARTICLES_COUNT; z++) {
      this.particles[z] = new Particle();
    }
  }

  start(x: number, y: number) {
    this.alive = true;
    let s: number, spd: number;
    this.particles.forEach(p => {
      p.alive = true;
      p.alpha = 1;
      p.angle = 0;
      s = Math.floor(Math.random() * 3);
      switch (s) {
        case 0: p.size = 22; break;
        case 1: p.size = 16; break;
        case 2: p.size = 12; break;
      }
      s = Math.random() * Const.TWO_PI;
      p.spd = Math.random() * 2 + 1;
      p.dirX = Math.cos(s);
      p.dirY = Math.sin(s);
      p.posX = x;
      p.posY = y;
    });
  }

  update(dt: number) {
    this.alive = false;
    this.particles.forEach(p => {
      if (p.alive) {
        this.alive = true;
        p.posX += p.dirX * p.spd;
        p.posY += p.dirY * p.spd;
        p.spd -= dt * 2;
        if (p.dirX > 0) p.angle += dt;
        else p.angle -= dt;
        p.alpha -= dt;
        if (p.alpha < 0) p.alive = false;
      }
    });
  }

  draw(ctx: CanvasRenderingContext2D) {
    let s: number, px: number;
    this.particles.forEach(p => {
      if (p.alive) {
        switch (p.size) {
          case 22: px = 651; break;
          case 16: px = 675; break;
          case 12: px = 695; break;
        }
        s = p.size >> 1;
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.posX + s, p.posY + s);
        ctx.rotate(p.angle);
        ctx.drawImage(Const.IMAGES[0], px, 912, p.size, p.size, -s, -s, p.size, p.size);
        ctx.restore();
      }
    });
  }
}
