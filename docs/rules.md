# Word Search Game Rules

## Game Grid
- 8x8 grid size optimized for mobile-first experience
- Maximum width of 430px for consistent mobile experience
- Letters are randomly placed and can be used in multiple words
- Words can be placed in four directions:
  - Horizontal (left to right)
  - Vertical (top to bottom)
  - Diagonal-right (top-left to bottom-right)
  - Diagonal-left (top-right to bottom-left)

## Word Categories
Available categories include:
- 90S
- AMERICA
- ASTRONOMY
- FASHION
- FOOD
- GAMES
- SCHOOL
- SUMMER
- TECH
- TV
- ANIMALS
- ART
- SPORTS
- SOCIAL
- MOVIES
- SONGS
- BRANDS
- SCIENCE
- COUNTRIES

## Gameplay Mechanics

### Word Selection
Players can find words using two methods:
1. Touch/Mouse Drag:
   - Press and drag across letters to form words
   - Visual feedback shows selected letters
   - Release to submit word

2. Tap/Click Selection:
   - Tap or click individual letters in sequence
   - Letters highlight as they're selected
   - Click last letter to submit word

### Hint System
- Each game starts with 3 hints
- Hints provide visual cues:
  - Blue highlight on hint letters
  - Pulsing animation to draw attention
- Using a hint reduces remaining hints by 1
- Hint counter displayed with lightbulb icon

### Scoring System
- Base Points: 10 points per word found
- Combo Bonus: +5 points for consecutive finds
  - First word: 10 points
  - Second consecutive word: 15 points
  - Third consecutive word: 20 points
- Bonus resets if no word is found

### Visual Feedback
- Selected letters: Yellow highlight
- Found words: Green highlight
- Hint letters: Blue highlight with pulse
- Word list shows found/unfound status
- Smooth animations for interactions

## Game Flow
1. Select a category from the 4x6 grid layout
2. Grid generates with hidden words
3. Find words through selection
4. Use hints if needed
5. Complete when all words found

## Technical Implementation
- Built with Next.js and TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- Touch and mouse event handling
- Mobile-first design with 430px max-width

## Accessibility Features
- High contrast color scheme
- Clear visual feedback
- Touch and mouse support
- Consistent mobile-first design
- Clear typography with optimized text sizes
- Proper spacing and padding for touch targets

## Tips for Success
1. Look for common word patterns
2. Start with shorter words
3. Use hints strategically
4. Practice speed-reading
5. Learn common word placements

Remember: The goal is to have fun while improving your word-finding skills! 