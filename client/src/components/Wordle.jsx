import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Wordle() {
  const [puzzle, setPuzzle] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameStatus, setGameStatus] = useState('playing'); // playing, won, lost
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState('daily'); // daily or random

  const MAX_GUESSES = 6;
  const WORD_LENGTH = 5;

  useEffect(() => {
    loadPuzzle('daily');
  }, []);

  const loadPuzzle = async (puzzleMode) => {
    setLoading(true);
    try {
      const endpoint = puzzleMode === 'daily' ? '/api/wordle/daily' : '/api/wordle/random';
      const response = await axios.get(endpoint);
      setPuzzle(response.data);
      setMode(puzzleMode);
      
      // Load saved state for daily puzzle
      if (puzzleMode === 'daily') {
        const savedState = localStorage.getItem(`wordle-${response.data.date}`);
        if (savedState) {
          const state = JSON.parse(savedState);
          setGuesses(state.guesses);
          setGameStatus(state.gameStatus);
          if (state.gameStatus !== 'playing') {
            setMessage(state.gameStatus === 'won' ? '🎉 Congratulations! You won!' : '😔 Game Over!');
          }
        }
      } else {
        // Reset for random mode
        setGuesses([]);
        setGameStatus('playing');
        setMessage('');
      }
    } catch (error) {
      console.error('Error loading puzzle:', error);
      setMessage('Failed to load puzzle. Please try again.');
    }
    setLoading(false);
  };

  const handleKeyPress = (key) => {
    if (gameStatus !== 'playing') return;

    if (key === 'ENTER') {
      submitGuess();
    } else if (key === 'BACKSPACE') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (currentGuess.length < WORD_LENGTH && /^[A-Z]$/.test(key)) {
      setCurrentGuess(prev => prev + key);
    }
  };

  const submitGuess = async () => {
    if (currentGuess.length !== WORD_LENGTH) {
      setMessage('Word must be 5 letters');
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    try {
      const response = await axios.post('/api/wordle/check', {
        guess: currentGuess,
        word: puzzle.word
      });

      const newGuess = {
        word: currentGuess,
        result: response.data.result
      };

      const newGuesses = [...guesses, newGuess];
      setGuesses(newGuesses);
      setCurrentGuess('');

      // Check win condition
      if (currentGuess === puzzle.word) {
        setGameStatus('won');
        setMessage('🎉 Congratulations! You won!');
        saveGameState(newGuesses, 'won');
      } else if (newGuesses.length >= MAX_GUESSES) {
        setGameStatus('lost');
        setMessage(`😔 Game Over! The word was ${puzzle.word}`);
        saveGameState(newGuesses, 'lost');
      }
    } catch (error) {
      console.error('Error checking guess:', error);
      setMessage('Error checking guess. Please try again.');
      setTimeout(() => setMessage(''), 2000);
    }
  };

  const saveGameState = (guessesData, status) => {
    if (mode === 'daily' && puzzle.date) {
      localStorage.setItem(`wordle-${puzzle.date}`, JSON.stringify({
        guesses: guessesData,
        gameStatus: status
      }));
    }
  };

  const getCellColor = (status) => {
    switch (status) {
      case 'correct': return '#6aaa64';
      case 'present': return '#c9b458';
      case 'absent': return '#787c7e';
      default: return '#ffffff';
    }
  };

  const getKeyboardColor = (letter) => {
    let status = 'unused';
    guesses.forEach(guess => {
      guess.word.split('').forEach((l, i) => {
        if (l === letter) {
          if (guess.result[i] === 'correct') {
            status = 'correct';
          } else if (guess.result[i] === 'present' && status !== 'correct') {
            status = 'present';
          } else if (status === 'unused') {
            status = 'absent';
          }
        }
      });
    });
    return getCellColor(status);
  };

  if (loading) {
    return <div className="game-container"><div className="loading">Loading puzzle...</div></div>;
  }

  const keyboard = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
  ];

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>Wordle</h1>
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

      {message && <div className="message">{message}</div>}

      <div className="wordle-board">
        {[...Array(MAX_GUESSES)].map((_, i) => (
          <div key={i} className="wordle-row">
            {[...Array(WORD_LENGTH)].map((_, j) => {
              const guess = guesses[i];
              const letter = guess ? guess.word[j] : (i === guesses.length ? currentGuess[j] : '');
              const status = guess ? guess.result[j] : '';
              
              return (
                <div
                  key={j}
                  className={`wordle-cell ${status}`}
                  style={{
                    backgroundColor: status ? getCellColor(status) : '#ffffff',
                    color: status ? '#ffffff' : '#000000',
                    borderColor: letter && !status ? '#878a8c' : '#d3d6da'
                  }}
                >
                  {letter}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="keyboard">
        {keyboard.map((row, i) => (
          <div key={i} className="keyboard-row">
            {row.map(key => (
              <button
                key={key}
                className={`key ${key.length > 1 ? 'wide-key' : ''}`}
                onClick={() => handleKeyPress(key)}
                style={{
                  backgroundColor: key.length === 1 ? getKeyboardColor(key) : '#818384',
                  color: guesses.some(g => g.word.includes(key)) ? '#ffffff' : '#000000'
                }}
              >
                {key === 'BACKSPACE' ? '⌫' : key}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Wordle;
