const express = require('express');
const router = express.Router();
const { getDateString, getDateSeed } = require('../utils/dateHelper');
const { generateSudoku } = require('../utils/puzzleGenerator');

// Get daily Sudoku puzzle
router.get('/daily', (req, res) => {
  try {
    const dateString = getDateString();
    const seed = getDateSeed(dateString);
    
    const { puzzle, solution } = generateSudoku(seed);
    
    res.json({
      date: dateString,
      puzzle,
      solution,
      difficulty: 'medium'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate Sudoku puzzle' });
  }
});

// Get random Sudoku puzzle
router.get('/random', (req, res) => {
  try {
    const randomSeed = Date.now();
    const { puzzle, solution } = generateSudoku(randomSeed);
    
    res.json({
      puzzle,
      solution,
      difficulty: 'medium',
      mode: 'random'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate random Sudoku puzzle' });
  }
});

module.exports = router;
