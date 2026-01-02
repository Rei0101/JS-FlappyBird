import Bird from "./bird.js";
import Pipes from "./pipes.js";

export default class Game {
  constructor(cvs, ctx, GAME_WIDTH, GAME_HEIGHT) {
    this.cvs = cvs;
    this.ctx = ctx;

    this.loopIsRunning = false;

    this.pipesInterval = 3;
    this.flappingInterval = 0.5;
    this.deltaTime = 0;
    this.lastTime = 0;
    this.pipesElapsed = 0;
    this.flappingElapsed = 0;

    this.GAME_WIDTH = GAME_WIDTH;
    this.GAME_HEIGHT = GAME_HEIGHT;

    this.bird = new Bird(this);
    this.pipes = [];

    this.gameIsOver = true;

    this.points = 0;
  }

  setup() {
    this.cvs.addEventListener("click", this.onClick);

    if (!this.loopIsRunning){
      this.loopIsRunning = true;
      requestAnimationFrame(this.gameLoop);
    }
  }

  update(dt) {
    for (const pipePair of this.pipes) {
      if (
        this.areColliding(this.bird.hitbox, pipePair.topHitbox) ||
        this.areColliding(this.bird.hitbox, pipePair.botHitbox)
      ) {
        this.gameIsOver = true;
        return;
      }
      if (!pipePair.passed && this.bird.x > pipePair.x) {
        this.points++;
        pipePair.passed = true;
      }

      pipePair.update(dt);
    }

    this.bird.update(dt);
  }
  render(ctx) {
    ctx.clearRect(0, 0, this.GAME_WIDTH, this.GAME_HEIGHT);

    this.bird.render(ctx);

    this.pipes.forEach((pipePair) => pipePair.render(ctx));

    this.renderScore();
  }

  //! Has to be arrow function to preserve the right "this" (.bind() works too)
  gameLoop = (timestamp) => {
    if (!this.lastTime) this.lastTime = timestamp;
    this.deltaTime = timestamp - this.lastTime;
    this.lastTime = timestamp;

    const dt = this.deltaTime / 1000;

    this.accumulator = this.accumulator || 0;
    const FIXED_DT = 0.0167;

    this.accumulator += dt;

    while (this.accumulator >= FIXED_DT) {
      if (!this.gameIsOver) {
        this.update(FIXED_DT);
      }
      this.accumulator -= FIXED_DT;
    }

    if (this.gameIsOver) {
      this.renderGameOver();
    } else {
      this.flappingElapsed += dt;
      this.pipesElapsed += dt;

      if (this.flappingElapsed >= this.flappingInterval) {
        if (this.bird.currentImage === this.bird.imageUp) {
          this.bird.currentImage = this.bird.imageDown;
        } else {
          this.bird.currentImage = this.bird.imageUp;
        }
        this.flappingElapsed = 0;
      }
      if (this.pipesElapsed >= this.pipesInterval) {
        this.addPipePair();
        this.pipesElapsed = 0;
      }

      this.render(this.ctx);
    }

    requestAnimationFrame(this.gameLoop);
  };

  reset() {
    this.deltaTime = 0;
    this.lastTime = 0;
    this.pipesElapsed = 0;
    this.flappingElapsed = 0;

    this.bird.reset();

    this.pipes = [];

    this.points = 0;
  }

  addPipePair() {
    let pipePair = new Pipes(this);
    this.pipes.push(pipePair);
  }
  removePipePair(pipePair) {
    let index = this.pipes.indexOf(pipePair);
    if (index > -1) this.pipes.splice(index, 1);
  }

  //! Has to be arrow function to preserve the right "this" (.bind() works too)
  onClick = () => {
    if (this.gameIsOver) {
      this.gameIsOver = false;
      this.reset();
    } else this.bird.flapWings();
  };

  areColliding(bird, pipe) {
    return (
      bird.x < pipe.x + pipe.width &&
      bird.x + bird.width > pipe.x &&
      bird.y < pipe.y + pipe.height &&
      bird.y + bird.height > pipe.y - 30
    );
  }

  renderGameOver() {
    this.ctx.font = "25px Comic Sans MS";
    this.ctx.fillStyle = "orange";
    this.ctx.textAlign = "center";
    this.ctx.fillText(
      "Click anywhere to start!",
      this.GAME_WIDTH / 2,
      this.GAME_HEIGHT / 2
    );
  }
  renderScore() {
    this.ctx.font = "25px Comic Sans MS";
    this.ctx.fillStyle = "white";
    this.ctx.textAlign = "center";
    this.ctx.fillText(this.points, this.GAME_WIDTH / 2, this.GAME_HEIGHT / 5);
  }
}
