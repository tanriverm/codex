# Snake

Small dependency-free Snake implementation for this repo.

## Run locally

From `C:\GitHub\Repositories\codex\snake`:

```powershell
python -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).

## Manual verification

- Start the game with arrow keys or `WASD`.
- Confirm the snake moves one grid cell per tick and cannot reverse directly into itself.
- Eat food and confirm the score increments and the snake grows by one segment.
- Confirm food never appears on top of the snake.
- Hit a wall or the snake body and confirm game over is shown.
- Press `Space` to pause and resume.
- Press `Restart` and confirm the board, score, and status reset.
