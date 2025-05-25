import type { Direction, Position, Word, GridCell } from '../types/game';

const GRID_SIZE = 8;
const DIRECTIONS: Direction[] = ['horizontal', 'vertical', 'diagonal-right', 'diagonal-left'];

export function createEmptyGrid(size: number = GRID_SIZE): GridCell[][] {
  return Array(size).fill(null).map((_, row) =>
    Array(size).fill(null).map((_, col) => ({
      letter: '',
      position: { row, col },
      isSelected: false,
      isFound: false,
      isHint: false,
      foundColor: undefined
    }))
  );
}

export function getRandomLetter(): string {
  return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
}

export function isValidPosition(pos: Position, direction: Direction, wordLength: number): boolean {
  switch (direction) {
    case 'horizontal':
      return pos.col + wordLength <= GRID_SIZE;
    case 'vertical':
      return pos.row + wordLength <= GRID_SIZE;
    case 'diagonal-right':
      return pos.col + wordLength <= GRID_SIZE && pos.row + wordLength <= GRID_SIZE;
    case 'diagonal-left':
      return pos.col - wordLength >= -1 && pos.row + wordLength <= GRID_SIZE;
    default:
      return false;
  }
}

export function getNextPosition(pos: Position, direction: Direction): Position {
  switch (direction) {
    case 'horizontal':
      return { row: pos.row, col: pos.col + 1 };
    case 'vertical':
      return { row: pos.row + 1, col: pos.col };
    case 'diagonal-right':
      return { row: pos.row + 1, col: pos.col + 1 };
    case 'diagonal-left':
      return { row: pos.row + 1, col: pos.col - 1 };
  }
}

export function placeWord(grid: GridCell[][], word: string, startPos: Position, direction: Direction): boolean {
  if (!isValidPosition(startPos, direction, word.length)) return false;

  // Check if word can be placed
  let currentPos = startPos;
  for (let i = 0; i < word.length; i++) {
    const cell = grid[currentPos.row][currentPos.col];
    if (cell.letter !== '' && cell.letter !== word[i]) {
      return false;
    }
    currentPos = getNextPosition(currentPos, direction);
  }

  // Place the word
  currentPos = startPos;
  for (let i = 0; i < word.length; i++) {
    grid[currentPos.row][currentPos.col].letter = word[i];
    currentPos = getNextPosition(currentPos, direction);
  }

  return true;
}

export function generateGrid(words: string[]): { grid: GridCell[][], placedWords: Word[] } {
  const grid = createEmptyGrid();
  const placedWords: Word[] = [];

  // Sort words by length (longest first)
  words.sort((a, b) => b.length - a.length);

  for (const word of words) {
    let placed = false;
    let attempts = 0;
    const maxAttempts = 100;

    while (!placed && attempts < maxAttempts) {
      const direction = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
      const startPos = {
        row: Math.floor(Math.random() * GRID_SIZE),
        col: Math.floor(Math.random() * GRID_SIZE),
      };

      if (placeWord(grid, word, startPos, direction)) {
        placedWords.push({
          word,
          startPos,
          direction,
          found: false,
        });
        placed = true;
      }

      attempts++;
    }
  }

  // Fill empty cells with random letters
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col].letter === '') {
        grid[row][col].letter = getRandomLetter();
      }
    }
  }

  return { grid, placedWords };
}

export function calculateScore(foundWords: string[], consecutiveFinds: number): number {
  const baseScore = foundWords.length * 10;
  const bonusScore = consecutiveFinds > 1 ? (consecutiveFinds - 1) * 5 : 0;
  return baseScore + bonusScore;
} 