'use client';

import { motion } from 'framer-motion';
import { useGame } from '@/lib/context/GameContext';
import type { Position, Word } from '@/lib/types/game';
import { useState, useEffect } from 'react';
import { LightBulbIcon } from '@heroicons/react/24/solid';
import { categories, Category } from './CategorySelect';

export function Grid() {
  const { state, dispatch } = useGame();
  const [isDragging, setIsDragging] = useState(false);
  const [touchStart, setTouchStart] = useState<Position | null>(null);
  const [selectedWord, setSelectedWord] = useState('');
  const [lastFoundWord, setLastFoundWord] = useState('');

  const category = categories.find((c: Category) => c.id === state.categoryId);

  const handleHintClick = () => {
    if (state.hints <= 0) return;
    
    // Find a random unfound word
    const unfoundWords = state.words.filter(word => !state.foundWords.includes(word.word));
    if (unfoundWords.length === 0) return;
    
    const randomWord = unfoundWords[Math.floor(Math.random() * unfoundWords.length)];
    
    // Calculate the positions for the first three letters
    const positions: Position[] = [];
    let currentPos = randomWord.startPos;
    
    for (let i = 0; i < 3 && i < randomWord.word.length; i++) {
      positions.push(currentPos);
      currentPos = getNextPosition(currentPos, randomWord.direction);
    }
    
    // Update the grid to show hints
    const newGrid = state.grid.map(row =>
      row.map(cell => ({
        ...cell,
        isHint: positions.some(pos => 
          pos.row === cell.position.row && pos.col === cell.position.col
        )
      }))
    );
    
    dispatch({ type: 'USE_HINT', grid: newGrid });
    
    // Clear hints after 2 seconds
    setTimeout(() => {
      const clearedGrid = state.grid.map(row =>
        row.map(cell => ({
          ...cell,
          isHint: false
        }))
      );
      dispatch({ type: 'UPDATE_GRID', grid: clearedGrid });
    }, 2000);
  };

  const getNextPosition = (pos: Position, direction: string): Position => {
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
  };

  const getCellsInLine = (start: Position, end: Position, direction: string): Position[] => {
    const cells: Position[] = [];
    let current = { ...start };
    
    // Calculate steps needed based on direction
    const rowDiff = end.row - start.row;
    const colDiff = end.col - start.col;
    const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff));
    
    // Always include the starting position
    cells.push({ ...current });
    
    // Add cells in sequence based on direction
    for (let i = 0; i <= steps; i++) {
      switch (direction) {
        case 'horizontal':
          current = { row: start.row, col: start.col + i };
          break;
        case 'vertical':
          current = { row: start.row + i, col: start.col };
          break;
        case 'diagonal-right':
          current = { row: start.row + i, col: start.col + i };
          break;
        case 'diagonal-left':
          current = { row: start.row + i, col: start.col - i };
          break;
      }
      
      // Only add valid cells within grid bounds
      if (current.row >= 0 && current.row < state.grid.length &&
          current.col >= 0 && current.col < state.grid[0].length) {
        cells.push({ ...current });
      }
    }
    
    return [...new Set(cells.map(cell => JSON.stringify(cell)))]
      .map(cell => JSON.parse(cell));
  };

  const getDirection = (start: Position, end: Position): string => {
    const rowDiff = end.row - start.row;
    const colDiff = end.col - start.col;
    
    if (Math.abs(rowDiff) === Math.abs(colDiff)) return colDiff > 0 ? 'diagonal-right' : 'diagonal-left';
    if (Math.abs(rowDiff) > Math.abs(colDiff)) return 'vertical';
    return 'horizontal';
  };

  const handleCellInteraction = (position: Position) => {
    if (!touchStart) {
      // Start new selection
      setTouchStart(position);
      dispatch({ type: 'CLEAR_SELECTION' }); // Clear any previous selection
      dispatch({ type: 'SELECT_CELL', position });
      setSelectedWord(state.grid[position.row][position.col].letter);
      return;
    }

    // Calculate direction based on touch start and current position
    const direction = getDirection(touchStart, position);
    
    // Get all cells in the line based on direction
    const cellsInLine = getCellsInLine(touchStart, position, direction);
    
    // Clear previous selection and add all cells in line
    dispatch({ type: 'CLEAR_SELECTION' });
    cellsInLine.forEach(pos => {
      dispatch({ type: 'SELECT_CELL', position: pos });
    });
    
    // Update selected word
    const word = cellsInLine
      .map(pos => state.grid[pos.row][pos.col].letter)
      .join('');
    setSelectedWord(word);
  };

  const handleTouchStart = (position: Position) => {
    setIsDragging(true);
    setTouchStart(position);
    handleCellInteraction(position);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;

    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (element?.getAttribute('data-cell')) {
      const [row, col] = element.getAttribute('data-cell')!.split(',').map(Number);
      handleCellInteraction({ row, col });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setTouchStart(null);
    
    // Check if the selected word exists in our word list and is not already found
    const wordExists = state.words.some(word => word.word === selectedWord);
    if (wordExists && !state.foundWords.includes(selectedWord)) {
      setLastFoundWord(selectedWord);
      dispatch({ type: 'CHECK_WORD' });
    } else {
      dispatch({ type: 'CLEAR_SELECTION' });
    }
    
    setSelectedWord('');
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging]);

  if (!state.grid.length) {
    return (
      <div>
        <section className="game-header-section">
          <div className="flex items-center justify-between w-full">
            <div className="category-name-display">
              <span className="category-icon mr-2">{category?.icon}</span>
              <span>{category?.name || 'Loading...'}</span>
            </div>
            <div className="hint-counter" onClick={handleHintClick}>
              <LightBulbIcon className="hint-counter-icon" />
              <span className="hint-counter-number">{state.hints}</span>
            </div>
          </div>
        </section>
        <section className="game-word-section" />
        <section className="game-grid-section">
          <div className="game-grid-container">
            <div className="game-grid animate-pulse">
              {Array.from({ length: 64 }).map((_, i) => (
                <div key={i} className="game-cell opacity-50" />
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <section className="game-header-section">
        <div className="flex items-center justify-between w-full">
          <div className="category-name-display">
            <span className="category-icon mr-2">{category?.icon}</span>
            <span>{category?.name || 'Loading...'}</span>
          </div>
          <div className="hint-counter" onClick={handleHintClick}>
            <LightBulbIcon className="hint-counter-icon" />
            <span className="hint-counter-number">{state.hints}</span>
          </div>
        </div>
      </section>

      <section className="game-word-section">
        {selectedWord && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="selected-word-display"
          >
            {selectedWord}
          </motion.div>
        )}
      </section>

      <section className="game-grid-section">
        <div className="game-grid-container">
          <div className="game-grid">
            {state.grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <motion.button
                  key={`${rowIndex}-${colIndex}`}
                  data-cell={`${rowIndex},${colIndex}`}
                  className={`game-cell
                    ${cell.isSelected ? 'game-cell-selected' : ''}
                    ${cell.isFound ? cell.foundColor || 'game-cell-found' : ''}
                    ${cell.isHint ? 'game-cell-hint' : ''}
                  `}
                  onTouchStart={() => handleTouchStart({ row: rowIndex, col: colIndex })}
                  onClick={() => handleCellInteraction({ row: rowIndex, col: colIndex })}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {cell.letter}
                </motion.button>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="game-words-section">
        <div className="word-list">
          <div className="word-list-grid">
            {state.words.map((word: Word) => {
              const foundInfo = state.foundWordsInfo.find(info => info.word === word.word);
              return (
                <motion.div
                  key={word.word}
                  className={`word-item ${
                    foundInfo ? foundInfo.color : 'word-item-unfound'
                  }`}
                  initial={false}
                  animate={{
                    scale: foundInfo ? 1 : 0.95,
                    opacity: foundInfo ? 1 : 0.7
                  }}
                >
                  {word.word}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
} 