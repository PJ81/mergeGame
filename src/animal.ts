export default class Animal {
  image: number;
  next: number;
  nextGen: number;

  constructor(i: number, n: number, g: number) {
    this.image = i;
    this.next = n;
    this.nextGen = g;
  }
}