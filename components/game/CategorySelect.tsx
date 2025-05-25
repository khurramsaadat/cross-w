'use client';

import { motion } from 'framer-motion';

export type Category = {
  id: string;
  name: string;
  icon: string;
  gradient: string;
};

export const categories: Category[] = [
  {
    id: '90s',
    name: '90S',
    icon: 'I❤️',
    gradient: 'from-lime-400 to-lime-500'
  },
  {
    id: 'america',
    name: 'AMERICA',
    icon: '🗺️',
    gradient: 'from-red-400 to-orange-500'
  },
  {
    id: 'astronomy',
    name: 'ASTRONOMY',
    icon: '🌌',
    gradient: 'from-purple-400 to-blue-500'
  },
  {
    id: 'fashion',
    name: 'FASHION',
    icon: '👠',
    gradient: 'from-pink-400 to-rose-500'
  },
  {
    id: 'food',
    name: 'FOOD',
    icon: '🍽️',
    gradient: 'from-red-400 to-pink-500'
  },
  {
    id: 'games',
    name: 'GAMES',
    icon: '🎮',
    gradient: 'from-blue-400 to-indigo-500'
  },
  {
    id: 'school',
    name: 'SCHOOL',
    icon: '🎓',
    gradient: 'from-orange-400 to-amber-500'
  },
  {
    id: 'summer',
    name: 'SUMMER',
    icon: '🕶️',
    gradient: 'from-teal-400 to-emerald-500'
  },
  {
    id: 'tech',
    name: 'TECH',
    icon: '🖱️',
    gradient: 'from-cyan-400 to-blue-500'
  },
  {
    id: 'tv',
    name: 'TV',
    icon: '📺',
    gradient: 'from-violet-400 to-purple-500'
  },
  {
    id: 'animals',
    name: 'ANIMALS',
    icon: '🐠',
    gradient: 'from-fuchsia-400 to-pink-500'
  },
  {
    id: 'art',
    name: 'ART',
    icon: '🎨',
    gradient: 'from-blue-400 to-indigo-500'
  },
  {
    id: 'sports',
    name: 'SPORTS',
    icon: '⚽',
    gradient: 'from-rose-400 to-pink-500'
  },
  {
    id: 'social',
    name: 'SOCIAL',
    icon: '📱',
    gradient: 'from-amber-400 to-orange-500'
  },
  {
    id: 'movies',
    name: 'MOVIES',
    icon: '🎬',
    gradient: 'from-lime-400 to-green-500'
  },
  {
    id: 'songs',
    name: 'SONGS',
    icon: '🎵',
    gradient: 'from-red-400 to-orange-500'
  },
  {
    id: 'brands',
    name: 'BRANDS',
    icon: '👑',
    gradient: 'from-blue-400 to-indigo-500'
  },
  {
    id: 'science',
    name: 'SCIENCE',
    icon: '⚛️',
    gradient: 'from-pink-400 to-rose-500'
  },
  {
    id: 'countries',
    name: 'COUNTRIES',
    icon: '🌍',
    gradient: 'from-blue-400 to-cyan-500'
  }
];

interface CategorySelectProps {
  onSelect: (categoryId: string) => void;
}

export function CategorySelect({ onSelect }: CategorySelectProps) {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-bold text-white mb-8">Select Category</h1>
      <div className="category-grid">
        {categories.map((category) => (
          <motion.button
            key={category.id}
            className={`category-card bg-gradient-to-br ${category.gradient}`}
            onClick={() => onSelect(category.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{category.name}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
} 