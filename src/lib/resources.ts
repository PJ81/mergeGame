import * as Const from "../const.js";

export default class Resource {
  constructor() { }

  loadImages(path: string[], callback: Function) {
    let idx = 0;
    const promises = [];
    path.forEach(f => promises.push(this.loadImage(`../img/${f}`)));
    Promise.all(promises).then((res) => {
      res.forEach(img => Const.IMAGES[idx++] = img);
    }).then(() => callback());
  }

  loadImage(url: string) {
    return new Promise((res) => {
      const img: HTMLImageElement = new Image();
      img.src = url;
      img.onload = () => res(img);
    });
  }
}