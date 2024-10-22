import Game from "./game.js";

const cvs = document.getElementById("game-canvas");
const ctx = cvs.getContext("2d");

const CVS_WIDTH = 500;
const CVS_HEIGHT = 700;

let game = new Game(cvs, ctx, CVS_WIDTH, CVS_HEIGHT);

game.setup(cvs, ctx);