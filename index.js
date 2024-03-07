import GameLoop from "./GameLoop.js";
import { scalarMultiplication } from "./geometry.js";

const canvas = document.querySelector("#canvas");
const { width, height } = canvas;

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

const ENGINE_IMPULSE = 0.5; // px / sec ** 2
const MANEUVER_TRUSTER_IMPULSE = 0.4; // rad / sec ** 2
const GRAVITY = 0.25; // px / sec ** 2

const rocket = {
  leftMT: false,
  rightMT: false,
  engine: false,

  position: new DOMPoint(width / 2, height / 2),
  rotation: -Math.PI / 2, // rad

  velocity: new DOMPoint(),
  yawMoment: 0, // rad / sec
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

/**
 *@param {number} time 
 * @param {DOMPoint} orientation
 */
function render(time, orientation) {
  context.reset();

  context.fillStyle = "red";
  context.fillText(time, 20, 20);

  context.setTransform(
    orientation.x,
    orientation.y,
    -orientation.y,
    orientation.x,
    rocket.position.x,
    rocket.position.y
  );

  renderRocket();

  context.resetTransform();
  context.translate(rocket.position.x, rocket.position.y);

  const scaledVelocity = scalarMultiplication(rocket.velocity, 30);

  context.beginPath();
  context.strokeStyle = "red";
  context.moveTo(0, 0);
  context.lineTo(scaledVelocity.x, scaledVelocity.y);
  context.stroke();
}

function renderRocket() {
  context.fillStyle = "blue";
  context.fillRect(-30, -10, 60, 20);

  context.fillStyle = "yellow";
  context.beginPath();
  context.ellipse(20, 0, 3, 3, 0, 0, 2 * Math.PI);
  context.fill();

  context.fillStyle = "red";

  if (rocket.engine) {
    context.beginPath();
    context.ellipse(-40, 0, 6, 6, 0, 0, 2 * Math.PI);
    context.fill();
  }

  if (rocket.leftMT) {
    context.beginPath();
    context.ellipse(20, -20, 6, 6, 0, 0, 2 * Math.PI);
    context.fill();
  }

  if (rocket.rightMT) {
    context.beginPath();
    context.ellipse(20, 20, 6, 6, 0, 0, 2 * Math.PI);
    context.fill();
  }
}

const gameLoop = new GameLoop((time) => {
  const orientation = new DOMPoint(
    Math.cos(rocket.rotation),
    Math.sin(rocket.rotation)
  );

  const frameTimePerSecond = time / 1000;

  if (rocket.leftMT) {
    rocket.yawMoment += MANEUVER_TRUSTER_IMPULSE * frameTimePerSecond;
  }

  if (rocket.rightMT) {
    rocket.yawMoment -= MANEUVER_TRUSTER_IMPULSE * frameTimePerSecond;
  }

  if (rocket.engine) {
    const acceleration = scalarMultiplication(orientation, ENGINE_IMPULSE * frameTimePerSecond);
    rocket.velocity = vector2DSum(rocket.velocity, acceleration);
  }

  rocket.velocity = vector2DSum(rocket.velocity, new DOMPoint(0, GRAVITY * frameTimePerSecond));
  rocket.rotation += rocket.yawMoment * frameTimePerSecond;

  const newPosition = vector2DSum(rocket.position, rocket.velocity);

  newPosition.x = newPosition.x < 0 ? width - newPosition.x : newPosition.x % width;
  newPosition.y = newPosition.y < 0 ? height - newPosition.y : newPosition.y % height;

  rocket.position = newPosition;

  render(time, orientation);
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
