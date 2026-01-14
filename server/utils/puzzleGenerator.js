const { SeededRandom } = require('./dateHelper');
const { spellingBeeWords } = require('./wordList');

// Sudoku generation
function generateSudoku(seed) {
  const random = new SeededRandom(seed);
  
  // Create a solved Sudoku grid
  const grid = Array(9).fill(0).map(() => Array(9).fill(0));
  
  // Fill the grid
  fillGrid(grid, random);
  
  // Create puzzle by removing numbers (medium difficulty: ~40 removed)
  const puzzle = grid.map(row => [...row]);
  let removed = 0;
  const target = 40;
  
  while (removed < target) {
    const row = random.nextInt(0, 8);
    const col = random.nextInt(0, 8);
    if (puzzle[row][col] !== 0) {
      puzzle[row][col] = 0;
      removed++;
    }
  }
  
  return { puzzle, solution: grid };
}

function fillGrid(grid, random) {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        const shuffled = random.shuffle(numbers);
        for (let num of shuffled) {
          if (isValid(grid, row, col, num)) {
            grid[row][col] = num;
            if (fillGrid(grid, random)) {
              return true;
            }
            grid[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function isValid(grid, row, col, num) {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === num) return false;
  }
  
  // Check column
  for (let x = 0; x < 9; x++) {
    if (grid[x][col] === num) return false;
  }
  
  // Check 3x3 box
  const startRow = row - row % 3;
  const startCol = col - col % 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[i + startRow][j + startCol] === num) return false;
    }
  }
  
  return true;
}

// Crossword generation
function generateCrossword(seed) {
  const random = new SeededRandom(seed);
  const size = 8;
  
  // Simple word list for crossword
  const words = [
    { word: 'HELLO', clue: 'A greeting' },
    { word: 'WORLD', clue: 'Our planet' },
    { word: 'GAMES', clue: 'Activities for fun' },
    { word: 'PUZZLE', clue: 'Brain teaser' },
    { word: 'CODE', clue: 'Programming instructions' },
    { word: 'WORD', clue: 'Unit of language' },
    { word: 'PLAY', clue: 'Have fun' },
    { word: 'BRAIN', clue: 'Thinking organ' },
    { word: 'SOLVE', clue: 'Find the answer' },
    { word: 'LOGIC', clue: 'Reasoning' },
    { word: 'DAILY', clue: 'Every day' },
    { word: 'CROSS', clue: 'Intersect' }
  ];
  
  const grid = Array(size).fill(null).map(() => Array(size).fill('#'));
  const solution = Array(size).fill(null).map(() => Array(size).fill('#'));
  const acrossClues = [];
  const downClues = [];
  
  // Place words in grid (simplified version)
  let clueNumber = 1;
  
  // Across word 1
  const word1 = words[random.nextInt(0, words.length - 1)];
  let row = 2;
  let col = 1;
  for (let i = 0; i < word1.word.length && col + i < size; i++) {
    solution[row][col + i] = word1.word[i];
    grid[row][col + i] = '';
  }
  acrossClues.push({ number: clueNumber++, clue: word1.clue, row, col });
  
  // Down word 1
  const word2 = words[random.nextInt(0, words.length - 1)];
  row = 1;
  col = 3;
  for (let i = 0; i < word2.word.length && row + i < size; i++) {
    solution[row + i][col] = word2.word[i];
    grid[row + i][col] = '';
  }
  downClues.push({ number: clueNumber++, clue: word2.clue, row, col });
  
  // Across word 2
  const word3 = words[random.nextInt(0, words.length - 1)];
  row = 5;
  col = 2;
  for (let i = 0; i < word3.word.length && col + i < size; i++) {
    solution[row][col + i] = word3.word[i];
    grid[row][col + i] = '';
  }
  acrossClues.push({ number: clueNumber++, clue: word3.clue, row, col });
  
  return {
    grid,
    solution,
    clues: { across: acrossClues, down: downClues }
  };
}

// Spelling Bee generation
function generateSpellingBee(seed) {
  const random = new SeededRandom(seed);
  
  // Common letter combinations
  const letterSets = [
    { center: 'e', outer: ['a', 'r', 't', 'i', 'n', 'o'] },
    { center: 'a', outer: ['n', 't', 'i', 'o', 'r', 's'] },
    { center: 'i', outer: ['n', 't', 'a', 'o', 'r', 'c'] },
    { center: 'o', outer: ['n', 't', 'a', 'i', 'r', 'd'] },
    { center: 't', outer: ['a', 'r', 'e', 'i', 'n', 'o'] },
    { center: 'n', outer: ['a', 'r', 't', 'i', 'o', 'e'] },
    { center: 'r', outer: ['a', 't', 'e', 'i', 'n', 'o'] },
    { center: 's', outer: ['a', 't', 'e', 'i', 'n', 'o'] },
    { center: 'l', outer: ['a', 't', 'e', 'i', 'n', 'o'] },
    { center: 'c', outer: ['a', 't', 'e', 'i', 'n', 'o'] }
  ];
  
  const selectedSet = letterSets[seed % letterSets.length];
  const centerLetter = selectedSet.center;
  const outerLetters = selectedSet.outer;
  const allLetters = [centerLetter, ...outerLetters];
  
  // Find valid words
  const validWords = spellingBeeWords.filter(word => {
    if (word.length < 4) return false;
    if (!word.includes(centerLetter)) return false;
    return word.split('').every(letter => allLetters.includes(letter));
  });
  
  // Find pangrams (words using all letters)
  const pangrams = validWords.filter(word => {
    const uniqueLetters = [...new Set(word.split(''))];
    return uniqueLetters.length === 7;
  });
  
  return {
    centerLetter,
    outerLetters,
    validWords,
    pangrams
  };
}

module.exports = { generateSudoku, generateCrossword, generateSpellingBee };
