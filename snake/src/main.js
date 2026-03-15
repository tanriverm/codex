import {
  GRID_SIZE,
  TICK_MS,
  createInitialState,
  positionsMatch,
  queueDirection,
  tick,
  togglePause,
} from "./game.js";

const board = document.querySelector("#board");
const scoreValue = document.querySelector("#score");
const statusText = document.querySelector("#status");
const pauseButton = document.querySelector("#pause-button");
const restartButton = document.querySelector("#restart-button");
const directionButtons = document.querySelectorAll("[data-direction]");

let state = createInitialState();
let intervalId = null;

const KEY_TO_DIRECTION = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  w: "up",
  a: "left",
  s: "down",
  d: "right",
};

buildBoard();
syncPauseButton();
render();
startLoop();

document.addEventListener("keydown", (event) => {
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;

  if (key === " ") {
    event.preventDefault();
    state = togglePause(state);
    syncPauseButton();
    render();
    return;
  }

  const direction = KEY_TO_DIRECTION[key];
  if (!direction) {
    return;
  }

  event.preventDefault();
  state = queueDirection(state, direction);
  if (state.status === "idle") {
    state = { ...state, status: "running" };
  }
  render();
});

pauseButton.addEventListener("click", () => {
  state = togglePause(state);
  syncPauseButton();
  render();
});

restartButton.addEventListener("click", restartGame);

directionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state = queueDirection(state, button.dataset.direction);
    if (state.status === "idle") {
      state = { ...state, status: "running" };
    }
    render();
  });
});

function buildBoard() {
  const cells = [];
  for (let index = 0; index < GRID_SIZE * GRID_SIZE; index += 1) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.setAttribute("role", "gridcell");
    cells.push(cell);
  }
  board.replaceChildren(...cells);
}

function startLoop() {
  intervalId = window.setInterval(() => {
    state = tick(state);
    syncPauseButton();
    render();
  }, TICK_MS);
}

function restartGame() {
  state = createInitialState();
  syncPauseButton();
  render();
}

function syncPauseButton() {
  pauseButton.textContent = state.status === "paused" ? "Resume" : "Pause";
}

function render() {
  const cells = board.children;

  for (let y = 0; y < GRID_SIZE; y += 1) {
    for (let x = 0; x < GRID_SIZE; x += 1) {
      const index = y * GRID_SIZE + x;
      const cell = cells[index];
      cell.className = "cell";

      if (positionsMatch(state.food, { x, y })) {
        cell.classList.add("cell--food");
      }

      const segmentIndex = state.snake.findIndex((segment) =>
        positionsMatch(segment, { x, y }),
      );

      if (segmentIndex >= 0) {
        cell.classList.add("cell--snake");
        if (segmentIndex === 0) {
          cell.classList.add("cell--head");
        }
      }
    }
  }

  scoreValue.textContent = String(state.score);
  statusText.textContent = getStatusMessage();
}

function getStatusMessage() {
  if (state.status === "idle") {
    return "Press any arrow key or WASD to begin.";
  }

  if (state.status === "paused") {
    return "Game paused. Press space or Resume to continue.";
  }

  if (state.status === "game-over") {
    return "Game over. Press Restart to play again.";
  }

  return "Eat the food and avoid the walls or yourself.";
}

window.addEventListener("beforeunload", () => {
  if (intervalId !== null) {
    window.clearInterval(intervalId);
  }
});
