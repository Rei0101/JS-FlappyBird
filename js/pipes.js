export default class Pipes {
  #x;
  constructor(game) {
    this.game = game;

    this.startPoint = 500;

    this.gap = 200;

    this.#x = this.startPoint;
    this.topY = Math.random() * (this.game.GAME_HEIGHT - this.gap);
    this.botY = this.topY + this.gap;

    this.width = 75;
    this.topHeight = this.topY;
    this.botHeight = this.game.GAME_HEIGHT - this.botY;

    this.velocity = 2.7;

    this.passed = false;
  }

  get x() {
    return this.#x;
  }
  set x(v) {
    if (v + this.width < 0) this.game.removePipe(this);
    else this.#x = v;
  }

  get topHitbox() {
    return {
      x: this.x,
      y: 0,
      width: this.width,
      height: this.topHeight,
    };
  }
  get botHitbox() {
    return {
      x: this.x,
      y: this.botY,
      width: this.width,
      height: this.botHeight,
    };
  }

  update() {
    this.x -= this.velocity;
  }
  renderTopPipe(ctx) {
    ctx.fillStyle = "green";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.fillRect(this.x, 0, this.width, this.topHeight);
    ctx.strokeRect(this.x, -3, this.width, this.topHeight);

    ctx.fillStyle = "darkgreen";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.fillRect(this.x - 5, this.topY - 30, this.width + 10, 30);
    ctx.strokeRect(this.x - 5, this.topY - 30, this.width + 10, 30);
  }
  renderBotPipe(ctx) {
    ctx.fillStyle = "green";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.fillRect(this.x, this.botY, this.width, this.botHeight);
    ctx.strokeRect(this.x, this.botY, this.width, this.botHeight + 3);

    ctx.fillStyle = "darkgreen";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.fillRect(this.x - 5, this.botY - 30, this.width + 10, 30);
    ctx.strokeRect(this.x - 5, this.botY - 30, this.width + 10, 30);
  }
  render(ctx) {
    this.renderTopPipe(ctx);
    this.renderBotPipe(ctx);
  }

  reset() {
    this.x = this.startPoint;
    this.topY = Math.random() * (this.game.GAME_HEIGHT - this.gap);
    this.botY = this.topY + this.gap;

    this.topHeight = this.topY;
    this.botHeight = this.game.GAME_HEIGHT - this.botY;
  }
}
