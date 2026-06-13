export interface LevelConfig {
  level: number;
  squaresCount: number;
  attempts: number;
  gridColumns: number;
  gridRows: number;
}

export function calculateGridSize(squareCount: number): { columns: number; rows: number } {
  if (squareCount === 1) return { columns: 1, rows: 1 };
  if (squareCount === 2) return { columns: 2, rows: 1 };
  if (squareCount === 3) return { columns: 3, rows: 1 };
  if (squareCount <= 4) return { columns: 2, rows: 2 };
  if (squareCount <= 6) return { columns: 3, rows: 2 };
  if (squareCount <= 9) return { columns: 3, rows: 3 };
  if (squareCount <= 12) return { columns: 4, rows: 3 };
  if (squareCount <= 16) return { columns: 4, rows: 4 };
  if (squareCount <= 20) return { columns: 5, rows: 4 };
  if (squareCount <= 25) return { columns: 5, rows: 5 };
  if (squareCount <= 30) return { columns: 6, rows: 5 };
  if (squareCount <= 36) return { columns: 6, rows: 6 };
  if (squareCount <= 42) return { columns: 7, rows: 6 };
  if (squareCount <= 49) return { columns: 7, rows: 7 };
  if (squareCount <= 56) return { columns: 8, rows: 7 };
  if (squareCount <= 64) return { columns: 8, rows: 8 };
  if (squareCount <= 72) return { columns: 9, rows: 8 };
  if (squareCount <= 81) return { columns: 9, rows: 9 };
  if (squareCount <= 90) return { columns: 10, rows: 9 };
  return { columns: 10, rows: 10 };
}

export function generateLevel(level: number): LevelConfig {
  const squaresCount = level;

  let attempts: number;
  if (level === 1) {
    attempts = 1;
  } else {
    attempts = level - 1;
  }

  const { columns, rows } = calculateGridSize(squaresCount);

  return {
    level,
    squaresCount,
    attempts,
    gridColumns: columns,
    gridRows: rows,
  };
}

export function generateCorrectSquareIndex(squaresCount: number): number {
  return Math.floor(Math.random() * squaresCount);
}
