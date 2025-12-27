export default class Bird {
  #y;
  constructor(game) {
    this.game = game;

    this.imageUp = new Image();
    this.imageUp.src = "../images/fb_up.png";

    this.imageDown = new Image();
    this.imageDown.src = "../images/fb_down.png";

    this.currentImage = this.imageUp; // Start with the "up" image

    this.x = this.game.GAME_WIDTH / 2 - 50;
    this.#y = this.game.GAME_HEIGHT / 2 - 70;

    this.width = 50;
    this.height = 40;

    this.gravity = 0.45;
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

  update() {
    this.fall();
  }
  render(ctx) {
    ctx.drawImage(this.currentImage, this.x, this.y, this.width, this.height);
  }

  reset() {
    this.x = this.game.GAME_WIDTH / 2 - 70;
    this.#y = this.game.GAME_HEIGHT / 2 - 70;

    this.gravity = 0.45;
    this.velocity = 0;
  }

  fall() {
    this.velocity += this.gravity;
    this.y += this.velocity;
  }

  flapWings() {
    this.velocity = -8.5;
    this.y += this.velocity;
  }
}
