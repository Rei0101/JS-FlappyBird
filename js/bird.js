export default class Bird {
  #y;
  constructor(game) {
    this.game = game;

    this.isFlapping = false;

    this.imageUp = new Image();
    this.imageUp.src = this.game.BIRD_IMAGE_UP;

    this.imageDown = new Image();
    this.imageDown.src = this.game.BIRD_IMAGE_DOWN;

    this.currentImage = this.imageUp;

    this.x = this.game.GAME_WIDTH / 2 - 50;
    this.#y = this.game.GAME_HEIGHT / 2 - 70;

    this.width = this.game.BIRD_WIDTH;
    this.height = this.game.BIRD_HEIGHT;

    this.velocity = 0;
  }

  get y() {
    return this.#y;
  }
  set y(v) {
    if (v > this.game.GAME_HEIGHT || v < 0 - this.height)
      this.game.gameIsOver = true;
    else this.#y = v;
  }

  get hitbox() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }

  update(dt) {
    this.fall(dt);
  }

  render(ctx) {
    ctx.drawImage(this.currentImage, this.x, this.y, this.width, this.height);
  }

  reset() {
    this.x = this.game.GAME_WIDTH / 2 - 50;
    this.#y = this.game.GAME_HEIGHT / 2 - 70;

    this.velocity = 0;
  }

  fall(dt) {
    this.velocity += this.game.GRAVITY * dt;
    this.y += this.velocity * dt;
  }

  flapWings() {
    this.velocity = -300;
  }
}
