import GameLoop from "./GameLoop.js";

const canvas = document.querySelector("#canvas");

/**
 * @type {CanvasRenderingContext2D}
 */
const context = canvas.getContext("2d");

/**
 * @type {HTMLButtonElement}
 */
const startButton = document.querySelector("#start");

/**
 * @type {HTMLButtonElement}
 */
const stopButton = document.querySelector("#stop");

const ENGINE_IMPULSE = 5; // px / frame ^ 2
const MANEUVER_TRUSTER_IMPULSE = 0.001; // rad / frame ^ 2

const rocket = {
  leftMT: false,
  rightMT: false,
  engine: false,

  rotation: 0, // rad

  velocity: new DOMPoint(), 
  yawMoment: 0, // rad / frame
};

/**
 * 
 * @param {DOMPoint} v1 
 * @param {DOMPoint} v2 
 * 
 * @returns {DOMPoint}
 */
function vector2DSum(v1, v2) {
  return new DOMPoint(v1.x + v2.x, v1.y + v2.y);
}

function render() {
  const { width, height } = context.canvas;
  context.reset();

  context.fillStyle = "red";
  context.fillText(rocket.rotation, 20, 20);

  context.setTransform(
    Math.cos(rocket.rotation),
    Math.sin(rocket.rotation),
    -Math.sin(rocket.rotation),
    Math.cos(rocket.rotation),
    width / 2,
    height / 2
  );

  renderRocket();
}

function renderRocket() {
  context.fillStyle = "blue";
  context.fillRect(-10, -30, 20, 60);

  context.fillStyle = "yellow";
  context.beginPath();
  context.ellipse(0, -20, 3, 3, 0, 0, 2 * Math.PI);
  context.fill();

  context.fillStyle = "red";

  if (rocket.engine) {
    context.beginPath();
    context.ellipse(0, 40, 6, 6, 0, 0, 2 * Math.PI);
    context.fill();
  }

  if (rocket.leftMT) {
    context.beginPath();
    context.ellipse(-20, -20, 6, 6, 0, 0, 2 * Math.PI);
    context.fill();
  }

  if (rocket.rightMT) {
    context.beginPath();
    context.ellipse(20, -20, 6, 6, 0, 0, 2 * Math.PI);
    context.fill();
  }
}

const gameLoop = new GameLoop(() => {
  if (rocket.leftMT) {
    rocket.yawMoment += MANEUVER_TRUSTER_IMPULSE;
  }

  if (rocket.rightMT) {
    rocket.yawMoment -= MANEUVER_TRUSTER_IMPULSE;
  }

  if (rocket.engine) {
    
  }

  rocket.rotation += rocket.yawMoment;

  render();
});

startButton.addEventListener("click", () => gameLoop.start());
stopButton.addEventListener("click", () => gameLoop.stop());

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp") {
    rocket.engine = true;
  }

  if (event.key === "ArrowLeft") {
    rocket.leftMT = true;
  }

  if (event.key === "ArrowRight") {
    rocket.rightMT = true;
  }
});

document.addEventListener("keyup", (event) => {
  if (event.key === "ArrowUp") {
    rocket.engine = false;
  }

  if (event.key === "ArrowLeft") {
    rocket.leftMT = false;
  }

  if (event.key === "ArrowRight") {
    rocket.rightMT = false;
  }
});
