/**
 * @param x;
 * @param y;
 */
class Vec2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  /**
   *
   * @param {Vec2} b
   */
  add(b) {
    let a = this;
    return new Vec2(a.x+b.x, a.y+b.y);
  }
  /**
   *
   * @param {Vec2} b
   */
  sub(b) {
    let a = this;
    return new Vec2(a.x-b.x, a.y-b.y);
  }
}
class Ray2 {
  /**
   *
   * @param {Vec2} pos
   * @param {Vec2} way
   */
  constructor(pos, way) {
    this.pos = pos;
    this.way = way;
  }
  /**
   * 始点の位置ベクトルと方向ベクトル... ...の代わりに2点から線分を作る
   * @param {Vec2} begin
   * @param {Vec2} end
   */
  static with2p(begin, end) {
    return new Ray2(begin, end.sub(begin))
  }
  // 線分の始点
  get begin() {
    return this.pos;
  }
  // 線分の終点
  get end() {
    return this.pos.add(this.way);
  }
}class Player {
  constructor() {
    this.pos = new Vec2(0, 0);
    this.angle = 0;
  }
}

let player;

function setup() {
  createCanvas(640, 360);

  player = new Player();
  player.pos = new Vec2(100, 200);
  player.angle = PI / 4;
}

function draw() {
  background(60);
  strokeWeight(3);
  stroke('white');
  let walls = [
    Ray2.with2p(new Vec2(50,50), new Vec2(100,300)),
    Ray2.with2p(new Vec2(100,300), new Vec2(250,200)),
    Ray2.with2p(new Vec2(250,200), new Vec2(50,50)),
  ]
  for (let wall of walls) {
    line(wall.begin.x, wall.begin.y, wall.end.x, wall.end.y);
  }

  // プレイヤー描画
  stroke('yellow');
  strokeWeight(24);
  point(player.pos.x, player.pos.y);
}

function touchMoved(event) {
  player.pos.x = event.clientX;
  player.pos.y = event.clientY;
}