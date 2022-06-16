import Animal from "./animals.js";
import Anim from "./animation.js";
import * as Const from "./const.js";
import Game from "./lib/game.js";
import Resource from "./lib/resources.js";
import * as ANIMALS from "./objects.js";
import Particles from "./particles.js";

let t = 0;

class Merge extends Game {
  field: Array<Anim>;
  particles: Array<Particles>;
  next: HTMLButtonElement;
  selection: Anim;
  spawnTime: number;
  timeExtra: number;
  timer: number;
  object: number;
  gridX: number;
  gridY: number;
  mouseX: number;
  mouseY: number;
  current: Animal;
  currentIdx: number;

  constructor() {
    super();
    this.ctx.strokeStyle = "white";

    this.particles = new Array(5);
    for (let z = 0; z < 5; z++) {
      this.particles[z] = new Particles();
    }

    this.field = new Array(Const.MAX_OBJ);
    this.reset();

    this.canvas.addEventListener("mousedown", (ev) => { this.mouseDown(ev) });
    this.canvas.addEventListener("mousemove", (ev) => { this.mouseMove(ev) });
    this.canvas.addEventListener("mouseleave", (ev) => { this.mouseLeave(ev) });
    this.canvas.addEventListener("mouseup", (ev) => { this.mouseUp(ev) });

    this.next = document.createElement("button");
    this.next.innerText = "Action";
    this.next.addEventListener("click", () => this.click());
    document.body.appendChild(this.next);

    const res = new Resource();
    res.loadImages(["sprites.png"], () => {
      this.reset();
      this.loop();
    });
  }

  reset() {
    for (let y = 0; y < Const.MAX_OBJ; y++)
      this.field[y] = null;

    this.currentIdx = 0;
    this.current = ANIMALS.ANIMALS[this.currentIdx];

    const a1 = new Anim(0), a2 = new Anim(0);
    this.timer = this.object = 0;
    this.timeExtra = 1;
    this.field[0] = a1;
    this.field[1] = a2;
    this.spawnTime = 5;
    this.selection = null;
  }

  startParticles(x: number, y: number) {
    for (let z = 0; z < this.particles.length; z++) {
      if (!this.particles[z].alive) {
        this.particles[z].start(x, y);
        return;
      }
    }
  }

  click() {
    //if (++t >= Objects.OBJECTS.length) t = 0;
    /*
    this.timeExtra += 0.35;
    if (this.timeExtra >= this.spawnTime * .55) this.timeExtra = this.spawnTime * .55;*/
  }

  mouseDown(ev: MouseEvent) {
    const m = Const.GRID_SIZE + Const.MARGIN;
    this.gridX = Math.floor((ev.clientX - this.canvas.offsetLeft) / m);
    this.gridY = Math.floor((ev.clientY - this.canvas.offsetTop) / m);
    if (this.field[this.gridX + Const.FIELD_X * this.gridY] === null) return;
    this.selection = this.field[this.gridX + Const.FIELD_X * this.gridY];
    this.field[this.gridX + Const.FIELD_X * this.gridY] = null;
    this.mouseX = ev.clientX - this.canvas.offsetLeft - Const.HALF_SPRITE;
    this.mouseY = ev.clientY - this.canvas.offsetTop - Const.HALF_SPRITE;
  }

  mouseMove(ev: MouseEvent) {
    if (this.selection === null) return;
    this.mouseX = ev.clientX - this.canvas.offsetLeft - Const.HALF_SPRITE;
    this.mouseY = ev.clientY - this.canvas.offsetTop - Const.HALF_SPRITE;
  }

  mouseLeave(ev: MouseEvent) {
    if (this.selection === null) return;
    this.field[this.gridX + Const.FIELD_X * this.gridY] = this.selection;
    this.selection = null;
  }

  mouseUp(ev: MouseEvent) {
    let m = Const.GRID_SIZE + Const.MARGIN,
      x = Math.floor((ev.clientX - this.canvas.offsetLeft) / m),
      y = Math.floor((ev.clientY - this.canvas.offsetTop) / m);
    if (this.field[x + Const.FIELD_X * y] === null) {
      this.field[x + Const.FIELD_X * y] = this.selection;
    } else if (this.field[x + Const.FIELD_X * y].object === this.selection.object) {
      this.merge(x, y);
    } else {
      this.field[this.gridX + Const.FIELD_X * this.gridY] = this.field[x + Const.FIELD_X * y];
      this.field[x + Const.FIELD_X * y] = this.selection;
    }
    this.selection = null;
  }

  spawn() {
    for (let s = 0; s < Const.MAX_OBJ; s++) {
      if (this.field[s] === null) {
        this.field[s] = new Anim(this.object);
        return;
      }
    }
  }

  merge(x: number, y: number) {
    this.startParticles(x * Const.GRID_SIZE + Const.MARGIN * x + Const.HALF_SPRITE, y * Const.GRID_SIZE + Const.MARGIN * y + Const.HALF_SPRITE);
    this.field[x + Const.FIELD_X * y] = null;
    this.field[x + Const.FIELD_X * y] = new Anim(++this.selection.object);
    this.spawnTime += .01;
  }

  drawSprite(spr: number, x: number, y: number, size: number) {
    let startX = spr * Const.GRID_ORG, startY = 0;
    while (startX >= Const.IMAGES[0].width) {
      startX -= Const.IMAGES[0].width;
      startY++;
    }
    let gp = (Const.GRID_SIZE >> 1) - (size >> 1);
    startY *= Const.GRID_ORG;
    this.ctx.drawImage(Const.IMAGES[0], startX + 1, startY + 1, Const.SPRITE_ORG, Const.SPRITE_ORG, x + gp, y + gp, size, size);
  }

  drawGrid() {
    this.ctx.beginPath();
    for (let y = 0; y < Const.FIELD_Y; y++) {
      for (let x = 0; x < Const.FIELD_X; x++) {
        this.ctx.rect(x * Const.GRID_SIZE + Const.MARGIN * x, y * Const.GRID_SIZE + Const.MARGIN * y, Const.SPRITE_SIZE, Const.SPRITE_SIZE);
      }
    }
    this.ctx.stroke();
  }

  update(dt: number) {
    this.timer += (dt * this.timeExtra);
    this.timeExtra -= dt;
    if (this.timeExtra < 1) this.timeExtra = 1;

    console.log(this.timeExtra, dt);

    if (this.timer >= this.spawnTime) {
      this.spawn();
      this.timer = 0;
    }

    this.field.forEach(a => {
      if (a && a.running) a.update(dt);
    });

    this.particles.forEach(p => {
      if (p.alive) p.update(dt);
    });
  }

  draw() {
    //this.drawSprite(Objects.OBJECTS[t].image, 50, 50, 128);
    this.drawGrid();
    let o: Anim, x: number, y: number;
    for (let p = 0; p < Const.MAX_OBJ; p++) {
      o = this.field[p];
      if (!o) continue;
      x = p % Const.FIELD_X; y = Math.floor(p / Const.FIELD_X);
      this.drawSprite(o.object, x * Const.GRID_SIZE + Const.MARGIN * x, y * Const.GRID_SIZE + Const.MARGIN * y, o.size);
    }

    if (this.selection) {
      this.drawSprite(this.selection.object, this.mouseX, this.mouseY, Const.SPRITE_SIZE);
    }

    this.particles.forEach(p => {
      if (p.alive) p.draw(this.ctx);
    });
  }
}

new Merge();
