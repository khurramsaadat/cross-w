export type Position = {
  row: number;
  col: number;
};

export type Direction = 
  | 'horizontal'
  | 'vertical'
  | 'diagonal-right'
  | 'diagonal-left';

export type Word = {
  word: string;
  startPos: Position;
  direction: Direction;
  found?: boolean;
};

export type GridCell = {
  letter: string;
  position: Position;
  isSelected: boolean;
  isFound: boolean;
  isHint: boolean;
  foundColor?: string;
};

export type Category = {
  id: string;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  icon: string;
  color: string;
  words: string[];
};

export type GameState = {
  grid: GridCell[][];
  words: Word[];
  score: number;
  hintsRemaining: number;
  selectedCells: Position[];
  foundWords: string[];
  category: Category | null;
}; 