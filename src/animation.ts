import Animal from "./animal.js";
import * as Const from "./const.js";

export default class Anim {
  running: boolean;
  back: boolean;
  animal: Animal;
  size: number;

  constructor(animal: Animal) {
    this.animal = animal;
    this.size = 0;
    this.running = true;
    this.back = false;
  }

  update(dt: number) {
    if (this.back) {
      this.size -= Const.SHRINK_SPEED * dt;
      if (this.size < Const.SPRITE_SIZE) {
        this.size = Const.SPRITE_SIZE;
        this.running = false;
      }
      return;
    }
    this.size += Const.GROW_SPEED * dt;
    if (this.size > Const.MAX_SIZE) this.back = true;
  }
}