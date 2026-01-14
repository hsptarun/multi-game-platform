import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SpellingBee() {
  const [puzzle, setPuzzle] = useState(null);
  const [currentWord, setCurrentWord] = useState('');
  const [foundWords, setFoundWords] = useState([]);
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState('daily');
  const [shuffledOuter, setShuffledOuter] = useState([]);

  useEffect(() => {
    loadPuzzle('daily');
  }, []);

  const loadPuzzle = async (puzzleMode) => {
    setLoading(true);
    try {
      const endpoint = puzzleMode === 'daily' ? '/api/spelling-bee/daily' : '/api/spelling-bee/random';
      const response = await axios.get(endpoint);
      setPuzzle(response.data);
      setMode(puzzleMode);
      setShuffledOuter([...response.data.outerLetters]);

      // Load saved state for daily puzzle
      if (puzzleMode === 'daily') {
        const savedState = localStorage.getItem(`spelling-bee-${response.data.date}`);
        if (savedState) {
          const state = JSON.parse(savedState);
          setFoundWords(state.foundWords);
          setScore(state.score);
        } else {
          setFoundWords([]);
          setScore(0);
        }
      } else {
        setFoundWords([]);
        setScore(0);
      }
      setCurrentWord('');
      setMessage('');
    } catch (error) {
      console.error('Error loading puzzle:', error);
      setMessage('Failed to load puzzle. Please try again.');
    }
    setLoading(false);
  };

  const addLetter = (letter) => {
    setCurrentWord(prev => prev + letter.toLowerCase());
  };

  const deleteLetter = () => {
    setCurrentWord(prev => prev.slice(0, -1));
  };

  const shuffleLetters = () => {
    const shuffled = [...shuffledOuter];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setShuffledOuter(shuffled);
  };

  const submitWord = () => {
    if (!puzzle) return;

    // Validation
    if (currentWord.length < 4) {
      setMessage('Word must be at least 4 letters');
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    if (!currentWord.includes(puzzle.centerLetter)) {
      setMessage('Word must contain the center letter');
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    const allLetters = [puzzle.centerLetter, ...puzzle.outerLetters];
    const validLetters = currentWord.split('').every(letter => allLetters.includes(letter));
    if (!validLetters) {
      setMessage('Word contains invalid letters');
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    if (foundWords.includes(currentWord)) {
      setMessage('Already found!');
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    if (puzzle.validWords.includes(currentWord)) {
      const newFoundWords = [...foundWords, currentWord];
      const isPangram = puzzle.pangrams.includes(currentWord);
      const points = currentWord.length === 4 ? 1 : currentWord.length + (isPangram ? 7 : 0);
      const newScore = score + points;

      setFoundWords(newFoundWords);
      setScore(newScore);
      setMessage(isPangram ? '🎉 Pangram! +' + points : '✓ Good! +' + points);
      setCurrentWord('');

      // Save state for daily puzzle
      if (mode === 'daily' && puzzle.date) {
        localStorage.setItem(`spelling-bee-${puzzle.date}`, JSON.stringify({
          foundWords: newFoundWords,
          score: newScore
        }));
      }

      setTimeout(() => setMessage(''), 2000);
    } else {
      setMessage('Not in word list');
      setTimeout(() => setMessage(''), 2000);
    }
  };

  if (loading) {
    return <div className="game-container"><div className="loading">Loading puzzle...</div></div>;
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>Spelling Bee</h1>
        <div className="game-controls">
          <button 
            onClick={() => loadPuzzle('daily')}
            className={mode === 'daily' ? 'active' : ''}
          >
            Daily Puzzle
          </button>
          <button 
            onClick={() => loadPuzzle('random')}
            className={mode === 'random' ? 'active' : ''}
          >
            Random Puzzle
          </button>
        </div>
      </div>

      <div className="spelling-bee-container">
        <div className="score-section">
          <div className="score">Score: {score}</div>
          <div className="words-found">Words: {foundWords.length} / {puzzle.validWords.length}</div>
        </div>

        {message && <div className="message">{message}</div>}

        <div className="current-word-display">
          {currentWord || 'Start typing...'}
        </div>

        <div className="honeycomb">
          <div className="hex-row">
            <div className="hex-cell" onClick={() => addLetter(shuffledOuter[0])}>
              {shuffledOuter[0]?.toUpperCase()}
            </div>
            <div className="hex-cell" onClick={() => addLetter(shuffledOuter[1])}>
              {shuffledOuter[1]?.toUpperCase()}
            </div>
          </div>
          <div className="hex-row">
            <div className="hex-cell" onClick={() => addLetter(shuffledOuter[2])}>
              {shuffledOuter[2]?.toUpperCase()}
            </div>
            <div className="hex-cell center" onClick={() => addLetter(puzzle.centerLetter)}>
              {puzzle.centerLetter.toUpperCase()}
            </div>
            <div className="hex-cell" onClick={() => addLetter(shuffledOuter[3])}>
              {shuffledOuter[3]?.toUpperCase()}
            </div>
          </div>
          <div className="hex-row">
            <div className="hex-cell" onClick={() => addLetter(shuffledOuter[4])}>
              {shuffledOuter[4]?.toUpperCase()}
            </div>
            <div className="hex-cell" onClick={() => addLetter(shuffledOuter[5])}>
              {shuffledOuter[5]?.toUpperCase()}
            </div>
          </div>
        </div>

        <div className="bee-controls">
          <button onClick={deleteLetter}>Delete</button>
          <button onClick={shuffleLetters}>Shuffle</button>
          <button onClick={submitWord} className="submit-btn">Enter</button>
        </div>

        <div className="found-words">
          <h3>Found Words:</h3>
          <div className="word-list">
            {foundWords.map((word, i) => (
              <span key={i} className={puzzle.pangrams.includes(word) ? 'pangram' : ''}>
                {word}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpellingBee;
