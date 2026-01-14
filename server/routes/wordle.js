const express = require('express');
const router = express.Router();
const { getDateString, getDateSeed, SeededRandom } = require('../utils/dateHelper');
const { fiveLetterWords } = require('../utils/wordList');

// Get daily Wordle puzzle
router.get('/daily', (req, res) => {
  try {
    const dateString = getDateString();
    const seed = getDateSeed(dateString);
    const random = new SeededRandom(seed);
    
    const wordIndex = random.nextInt(0, fiveLetterWords.length - 1);
    const word = fiveLetterWords[wordIndex].toUpperCase();
    
    res.json({
      date: dateString,
      word: word,
      maxGuesses: 6
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate Wordle puzzle' });
  }
});

// Get random Wordle puzzle
router.get('/random', (req, res) => {
  try {
    const randomSeed = Date.now();
    const random = new SeededRandom(randomSeed);
    
    const wordIndex = random.nextInt(0, fiveLetterWords.length - 1);
    const word = fiveLetterWords[wordIndex].toUpperCase();
    
    res.json({
      word: word,
      maxGuesses: 6,
      mode: 'random'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate random Wordle puzzle' });
  }
});

// Check guess
router.post('/check', (req, res) => {
  try {
    const { guess, word } = req.body;
    
    if (!guess || !word) {
      return res.status(400).json({ error: 'Guess and word are required' });
    }
    
    const upperGuess = guess.toUpperCase();
    const upperWord = word.toUpperCase();
    
    if (upperGuess.length !== 5) {
      return res.status(400).json({ error: 'Guess must be 5 letters' });
    }
    
    const result = [];
    const wordLetters = upperWord.split('');
    const guessLetters = upperGuess.split('');
    
    // First pass: mark correct positions
    const used = Array(5).fill(false);
    for (let i = 0; i < 5; i++) {
      if (guessLetters[i] === wordLetters[i]) {
        result[i] = 'correct';
        used[i] = true;
      }
    }
    
    // Second pass: mark present letters
    for (let i = 0; i < 5; i++) {
      if (result[i] !== 'correct') {
        let found = false;
        for (let j = 0; j < 5; j++) {
          if (!used[j] && guessLetters[i] === wordLetters[j]) {
            result[i] = 'present';
            used[j] = true;
            found = true;
            break;
          }
        }
        if (!found) {
          result[i] = 'absent';
        }
      }
    }
    
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check guess' });
  }
});

module.exports = router;
