const express = require('express');
const router = express.Router();
const { getDateString, getDateSeed } = require('../utils/dateHelper');
const { generateSpellingBee } = require('../utils/puzzleGenerator');

// Get daily Spelling Bee puzzle
router.get('/daily', (req, res) => {
  try {
    const dateString = getDateString();
    const seed = getDateSeed(dateString);
    
    const puzzle = generateSpellingBee(seed);
    
    res.json({
      date: dateString,
      centerLetter: puzzle.centerLetter,
      outerLetters: puzzle.outerLetters,
      validWords: puzzle.validWords,
      pangrams: puzzle.pangrams
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate Spelling Bee puzzle' });
  }
});

// Get random Spelling Bee puzzle
router.get('/random', (req, res) => {
  try {
    const randomSeed = Date.now();
    const puzzle = generateSpellingBee(randomSeed);
    
    res.json({
      centerLetter: puzzle.centerLetter,
      outerLetters: puzzle.outerLetters,
      validWords: puzzle.validWords,
      pangrams: puzzle.pangrams,
      mode: 'random'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate random Spelling Bee puzzle' });
  }
});

module.exports = router;
