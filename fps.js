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
   * @param {Vec2} b
   */
  add(b) {
    let a = this;
    return new Vec2(a.x + b.x, a.y + b.y);
  }
  /**
   *
   * @param {Vec2} b
   */
  sub(b) {
    let a = this;
    return new Vec2(a.x - b.x, a.y - b.y);
  }
  copy() {
    return new Vec2(this.x, this.y);
  }
  mult(s) {
    return new Vec2(s * this.x, s * this.y);
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
    return new Ray2(begin, end.sub(begin));
  }
  // 線分の始点
  get begin() {
    return this.pos;
  }
  // 線分の終点
  get end() {
    return this.pos.add(this.way);
  }
  intersection(r2) {
    let r1 = this;
    if (abs(r1.way.x) < 0.01) r1.way.x = 0.01;
    if (abs(r2.way.x) < 0.01) r2.way.x = 0.01;
    let t1 = r1.way.y / r1.way.x;
    let t2 = r2.way.y / r2.way.x;
    let x1 = r1.pos.x;
    let x2 = r2.pos.x;
    let y1 = r1.pos.y;
    let y2 = r2.pos.y;
    let sx = (t1 * x1 - t2 * x2 - y1 + y2) / (t1 - t2);
    let sy = t1 * (sx - x1) + y1;
    if (
      sx > min(r1.begin.x, r1.end.x) &&
      sx < max(r1.begin.x, r1.end.x) &&
      sx > min(r2.begin.x, r2.end.x) &&
      sx < max(r2.begin.x, r2.end.x)
    ) {
      return new Vec2(sx, sy);
    }
    else {
      return null;
    }
  }
}
class Player {
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
  stroke("white");
  let walls = [
    Ray2.with2p(new Vec2(50,50), new Vec2(100,300)),
    Ray2.with2p(new Vec2(100,300), new Vec2(250,200)),
    Ray2.with2p(new Vec2(250, 200), new Vec2(50, 50)),
  ];
  for (let wall of walls) {
    line(wall.begin.x, wall.begin.y, wall.end.x, wall.end.y);
  }

  // プレイヤー描画
  stroke("yellow");
  strokeWeight(24);
  point(player.pos.x, player.pos.y);

  // 視界の向き変更
  if (keyIsDown(LEFT_ARROW)) player.angle -= PI / 60;
  if (keyIsDown(RIGHT_ARROW)) player.angle += PI / 60;

  // プレイヤーの視界描画
  let fov = PI / 2;
  let centerAngle = player.angle;
  let leftAngle = player.angle - fov / 2;
  let rightAngle = player.angle + fov / 2;
  for (let angle = leftAngle; angle < rightAngle; angle += fov / 10) {
    strokeWeight(2);
    let pWay = new Ray2(
      player.pos.copy(),
      new Vec2(cos(angle), sin(angle)).mult(100) //三角関数の値域が１なので100倍
    );
    line(pWay.begin.x, pWay.begin.y, pWay.end.x, pWay.end.y);

    // すべての壁との交点を求める
    for (let wall of walls) {
      let hitPos = pWay.intersection(wall);
      if (hitPos) {
        strokeWeight(10);
        point(hitPos.x, hitPos.y);

      }
    }
  }
}

function touchMoved(event) {
  player.pos.x = event.clientX;
  player.pos.y = event.clientY;
}
