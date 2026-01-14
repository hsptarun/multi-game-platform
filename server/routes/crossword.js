const express = require('express');
const router = express.Router();
const { getDateString, getDateSeed } = require('../utils/dateHelper');
const { generateCrossword } = require('../utils/puzzleGenerator');

// Get daily Crossword puzzle
router.get('/daily', (req, res) => {
  try {
    const dateString = getDateString();
    const seed = getDateSeed(dateString);
    
    const puzzle = generateCrossword(seed);
    
    res.json({
      date: dateString,
      grid: puzzle.grid,
      solution: puzzle.solution,
      clues: puzzle.clues
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate Crossword puzzle' });
  }
});

// Get random Crossword puzzle
router.get('/random', (req, res) => {
  try {
    const randomSeed = Date.now();
    const puzzle = generateCrossword(randomSeed);
    
    res.json({
      grid: puzzle.grid,
      solution: puzzle.solution,
      clues: puzzle.clues,
      mode: 'random'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate random Crossword puzzle' });
  }
});

module.exports = router;
