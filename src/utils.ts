import type { Grid } from "./types";

export const getSquare = (grid: Grid, lin: number, col: number) => {
  return grid.squares[lin + col * 9];
};

const isPossible = (grid: Grid, value: number, lin: number, col: number) => {
  // Check column
  for (let i = 0; i < 9; i++) {
    if (i !== lin && getSquare(grid, i, col).value === value) return false;
  }

  // Check line
  for (let i = 0; i < 9; i++) {
    if (i !== col && getSquare(grid, lin, i).value === value) return false;
  }

  // Check square
  const topLeftLin = Math.floor(lin / 3) * 3;
  const topLeftCol = Math.floor(col / 3) * 3;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (getSquare(grid, topLeftLin + i, topLeftCol + j).value === value)
        return false;
    }
  }

  return true;
};

const addNotesForSquare = (grid: Grid, lin: number, col: number) => {
  for (let i = 1; i <= 9; i++) {
    if (isPossible(grid, i, lin, col)) {
      getSquare(grid, lin, col).notes.push(i);
    }
  }
};

export const addNotes = (grid: Grid) => {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const square = getSquare(grid, i, j);
      if (square.value === 0) {
        square.notes = [];
        addNotesForSquare(grid, i, j);
      }
    }
  }
};

export const solveOneStep = (grid: Grid) => {
  addNotes(grid);

  let changed = false;

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const square = getSquare(grid, i, j);
      if (square.notes.length === 1) {
        console.log(i, j);
        square.value = square.notes[0];
        square.solved = true;
        changed = true;
      }
    }
  }

  return changed;
};

export const solve = (grid: Grid) => {
  for (let i = 0; i < 9 * 9; i++) {
    if (!solveOneStep(grid)) return;
  }
};
