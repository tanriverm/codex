export const GRID_SIZE = 16;
export const INITIAL_DIRECTION = "right";
export const TICK_MS = 140;

const OFFSETS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const OPPOSITES = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

export function createInitialState(random = Math.random) {
  const snake = [
    { x: 2, y: 8 },
    { x: 1, y: 8 },
    { x: 0, y: 8 },
  ];

  return {
    gridSize: GRID_SIZE,
    snake,
    direction: INITIAL_DIRECTION,
    pendingDirection: INITIAL_DIRECTION,
    food: createFood(snake, GRID_SIZE, random),
    score: 0,
    status: "idle",
  };
}

export function queueDirection(state, nextDirection) {
  if (!OFFSETS[nextDirection]) {
    return state;
  }

  const blockedDirection = OPPOSITES[state.direction];
  if (nextDirection === blockedDirection && state.snake.length > 1) {
    return state;
  }

  return { ...state, pendingDirection: nextDirection };
}

export function tick(state, random = Math.random) {
  if (
    state.status === "idle" ||
    state.status === "game-over" ||
    state.status === "paused"
  ) {
    return state;
  }

  const direction = state.pendingDirection;
  const offset = OFFSETS[direction];
  const head = state.snake[0];
  const nextHead = { x: head.x + offset.x, y: head.y + offset.y };

  if (isOutOfBounds(nextHead, state.gridSize)) {
    return { ...state, direction, status: "game-over" };
  }

  const ateFood = positionsMatch(nextHead, state.food);
  const trimmedSnake = ateFood ? state.snake : state.snake.slice(0, -1);

  if (trimmedSnake.some((segment) => positionsMatch(segment, nextHead))) {
    return { ...state, direction, status: "game-over" };
  }

  const snake = [nextHead, ...trimmedSnake];
  const score = ateFood ? state.score + 1 : state.score;

  return {
    ...state,
    snake,
    score,
    direction,
    food: ateFood ? createFood(snake, state.gridSize, random) : state.food,
    status: "running",
  };
}

export function togglePause(state) {
  if (state.status === "game-over" || state.status === "idle") {
    return state;
  }

  return {
    ...state,
    status: state.status === "paused" ? "running" : "paused",
  };
}

export function createFood(snake, gridSize, random = Math.random) {
  const openCells = [];

  for (let y = 0; y < gridSize; y += 1) {
    for (let x = 0; x < gridSize; x += 1) {
      const occupied = snake.some((segment) => segment.x === x && segment.y === y);
      if (!occupied) {
        openCells.push({ x, y });
      }
    }
  }

  if (openCells.length === 0) {
    return snake[0];
  }

  const index = Math.floor(random() * openCells.length);
  return openCells[index];
}

export function isOutOfBounds(position, gridSize) {
  return (
    position.x < 0 ||
    position.y < 0 ||
    position.x >= gridSize ||
    position.y >= gridSize
  );
}

export function positionsMatch(a, b) {
  return a.x === b.x && a.y === b.y;
}
