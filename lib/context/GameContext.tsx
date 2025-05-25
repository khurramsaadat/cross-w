'use client';

import { createContext, useContext, useReducer } from 'react';
import type { Position, GridCell, Word } from '@/lib/types/game';

type FoundWordInfo = {
  word: string;
  cells: Position[];
  color: string;
};

type GameState = {
  grid: GridCell[][];
  selectedCells: Position[];
  foundWords: string[];
  foundWordsInfo: FoundWordInfo[];
  words: Word[];
  categoryId: string;
  hints: number;
  score: number;
};

type GameAction =
  | { type: 'SELECT_CELL'; position: Position }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'CHECK_WORD' }
  | { type: 'USE_HINT'; grid: GridCell[][] }
  | { type: 'UPDATE_GRID'; grid: GridCell[][] }
  | { type: 'SET_HINTS'; hints: number }
  | { type: 'SET_CATEGORY'; categoryId: string }
  | { type: 'INIT_GAME'; grid: GridCell[][]; words: Word[] }
  | { type: 'RESET_GAME' };

const HIGHLIGHT_COLORS = [
  'bg-yellow-300',   // Yellow
  'bg-blue-400',     // Blue
  'bg-green-400',    // Green
  'bg-purple-400',   // Purple
  'bg-pink-400',     // Pink
  'bg-orange-400',   // Orange
];

const initialState: GameState = {
  grid: [],
  selectedCells: [],
  foundWords: [],
  foundWordsInfo: [],
  words: [],
  categoryId: '',
  hints: 3,
  score: 0
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SELECT_CELL': {
      const newSelectedCells = [...state.selectedCells, action.position];
      
      // Update grid to show selection
      const newGrid = state.grid.map(row =>
        row.map(cell => ({
          ...cell,
          isSelected: newSelectedCells.some(
            pos => pos.row === cell.position.row && pos.col === cell.position.col
          ) || cell.isSelected // Keep existing selections
        }))
      );

      return {
        ...state,
        grid: newGrid,
        selectedCells: newSelectedCells,
      };
    }

    case 'CLEAR_SELECTION': {
      const newGrid = state.grid.map(row =>
        row.map(cell => ({
          ...cell,
          isSelected: false,
          // Preserve found state and color
          isFound: cell.isFound,
          foundColor: cell.foundColor
        }))
      );
      return {
        ...state,
        grid: newGrid,
        selectedCells: [],
      };
    }

    case 'CHECK_WORD': {
      const selectedWord = state.selectedCells
        .map(pos => state.grid[pos.row][pos.col].letter)
        .join('');

      // Find matching word in any direction
      const foundWord = state.words.find(word => {
        if (word.word !== selectedWord) return false;

        // Get all cells for this word
        const wordCells = getWordCells(word, state.grid.length);
        
        // Check if selected cells match word cells in order
        if (wordCells.length !== state.selectedCells.length) return false;
        
        // Check first and last cell positions match
        const firstCell = wordCells[0];
        const firstSelected = state.selectedCells[0];
        const lastCell = wordCells[wordCells.length - 1];
        const lastSelected = state.selectedCells[state.selectedCells.length - 1];

        return (
          (firstCell.row === firstSelected.row && firstCell.col === firstSelected.col &&
           lastCell.row === lastSelected.row && lastCell.col === lastSelected.col) ||
          (firstCell.row === lastSelected.row && firstCell.col === lastSelected.col &&
           lastCell.row === firstSelected.row && lastCell.col === firstSelected.col)
        );
      });

      if (foundWord && !state.foundWords.includes(foundWord.word)) {
        // Assign a color for this found word
        const colorIndex = state.foundWords.length % HIGHLIGHT_COLORS.length;
        const color = HIGHLIGHT_COLORS[colorIndex];

        // Mark cells as found with the assigned color
        const newGrid = state.grid.map(row =>
          row.map(cell => {
            const isInWord = state.selectedCells.some(
              pos => pos.row === cell.position.row && pos.col === cell.position.col
            );
            return {
              ...cell,
              isFound: isInWord ? true : cell.isFound,
              foundColor: isInWord ? color : cell.foundColor,
              isSelected: false
            };
          })
        );

        return {
          ...state,
          grid: newGrid,
          foundWords: [...state.foundWords, foundWord.word],
          selectedCells: [],
          score: state.score + 10
        };
      }

      // Clear selection if word not found
      return {
        ...state,
        grid: state.grid.map(row =>
          row.map(cell => ({
            ...cell,
            isSelected: false,
            // Preserve found state and color
            isFound: cell.isFound,
            foundColor: cell.foundColor
          }))
        ),
        selectedCells: []
      };
    }

    case 'USE_HINT':
      if (state.hints <= 0) return state;
      return {
        ...state,
        grid: action.grid,
        hints: state.hints - 1,
      };
    case 'UPDATE_GRID':
      return {
        ...state,
        grid: action.grid,
      };
    case 'SET_HINTS':
      return {
        ...state,
        hints: action.hints,
      };
    case 'SET_CATEGORY':
      return {
        ...state,
        categoryId: action.categoryId,
      };
    case 'INIT_GAME':
      return {
        ...state,
        grid: action.grid,
        words: action.words,
        selectedCells: [],
        foundWords: [],
        foundWordsInfo: [],
      };
    case 'RESET_GAME':
      return initialState;
    default:
      return state;
  }
}

const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
} | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

// Helper function to get all cells for a word based on its placement
function getWordCells(word: Word, gridSize: number): Position[] {
  const cells: Position[] = [];
  let current = { ...word.startPos };

  for (let i = 0; i < word.word.length; i++) {
    cells.push({ ...current });
    
    // Get next position based on direction
    current = getNextPosition(current, word.direction);
    
    // Break if we go outside grid bounds
    if (current.row < 0 || current.row >= gridSize || 
        current.col < 0 || current.col >= gridSize) break;
  }

  return cells;
}

function getNextPosition(pos: Position, direction: string): Position {
  switch (direction) {
    case 'horizontal':
      return { row: pos.row, col: pos.col + 1 };
    case 'vertical':
      return { row: pos.row + 1, col: pos.col };
    case 'diagonal-right':
      return { row: pos.row + 1, col: pos.col + 1 };
    case 'diagonal-left':
      return { row: pos.row + 1, col: pos.col - 1 };
    default:
      return pos;
  }
} 