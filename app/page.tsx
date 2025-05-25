'use client';

import { Grid } from '@/components/game/Grid';
import { CategorySelect } from '@/components/game/CategorySelect';
import { useGame } from '@/lib/context/GameContext';
import { useEffect, useState } from 'react';
import { generateGrid } from '@/lib/utils/gameUtils';
import type { GridCell, Word } from '@/lib/types/game';
import { LightBulbIcon } from '@heroicons/react/24/solid';

const sampleWords = ['DINGO', 'PANGOLIN', 'BULL', 'BASK'];

export default function Home() {
  const { state, dispatch } = useGame();
  const [showCategories, setShowCategories] = useState(true);

  useEffect(() => {
    if (!showCategories) {
      const { grid, placedWords } = generateGrid(sampleWords);
      
      const gameGrid: GridCell[][] = grid.map(row =>
        row.map(cell => ({
          ...cell,
          isSelected: false,
          isFound: false,
          isHint: false,
        }))
      );

      dispatch({ type: 'INIT_GAME', grid: gameGrid, words: placedWords });
      dispatch({ type: 'SET_HINTS', hints: 3 });
    }
  }, [showCategories, dispatch]);

  const handleCategorySelect = (categoryId: string) => {
    dispatch({ type: 'SET_CATEGORY', categoryId });
    setShowCategories(false);
  };

  if (showCategories) {
    return (
      <main className="game-container">
        <CategorySelect onSelect={handleCategorySelect} />
      </main>
    );
  }

  return (
    <main className="game-container">
      <Grid />
    </main>
  );
}
