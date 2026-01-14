import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Crossword() {
  const [puzzle, setPuzzle] = useState(null);
  const [userGrid, setUserGrid] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [direction, setDirection] = useState('across');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState('daily');
  const [showSolution, setShowSolution] = useState(false);

  useEffect(() => {
    loadPuzzle('daily');
  }, []);

  const loadPuzzle = async (puzzleMode) => {
    setLoading(true);
    try {
      const endpoint = puzzleMode === 'daily' ? '/api/crossword/daily' : '/api/crossword/random';
      const response = await axios.get(endpoint);
      setPuzzle(response.data);
      setMode(puzzleMode);
      setShowSolution(false);

      // Initialize user grid
      const grid = response.data.grid.map(row => row.map(cell => cell === '#' ? '#' : ''));

      // Load saved state for daily puzzle
      if (puzzleMode === 'daily') {
        const savedState = localStorage.getItem(`crossword-${response.data.date}`);
        if (savedState) {
          setUserGrid(JSON.parse(savedState));
        } else {
          setUserGrid(grid);
        }
      } else {
        setUserGrid(grid);
      }

      setSelectedCell(null);
      setMessage('');
    } catch (error) {
      console.error('Error loading puzzle:', error);
      setMessage('Failed to load puzzle. Please try again.');
    }
    setLoading(false);
  };

  const handleCellClick = (row, col) => {
    if (userGrid[row][col] === '#') return;

    if (selectedCell && selectedCell.row === row && selectedCell.col === col) {
      setDirection(prev => prev === 'across' ? 'down' : 'across');
    } else {
      setSelectedCell({ row, col });
    }
  };

  const handleKeyPress = (e) => {
    if (!selectedCell) return;

    const { row, col } = selectedCell;

    if (/^[a-zA-Z]$/.test(e.key)) {
      const newGrid = userGrid.map(r => [...r]);
      newGrid[row][col] = e.key.toUpperCase();
      setUserGrid(newGrid);

      // Save state for daily puzzle
      if (mode === 'daily' && puzzle.date) {
        localStorage.setItem(`crossword-${puzzle.date}`, JSON.stringify(newGrid));
      }

      // Move to next cell
      moveToNextCell();
    } else if (e.key === 'Backspace') {
      const newGrid = userGrid.map(r => [...r]);
      newGrid[row][col] = '';
      setUserGrid(newGrid);

      // Save state
      if (mode === 'daily' && puzzle.date) {
        localStorage.setItem(`crossword-${puzzle.date}`, JSON.stringify(newGrid));
      }

      moveToPreviousCell();
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      navigateCell(e.key);
    }
  };

  const moveToNextCell = () => {
    const { row, col } = selectedCell;
    let newRow = row;
    let newCol = col;

    if (direction === 'across') {
      newCol++;
      while (newCol < userGrid[0].length && userGrid[newRow][newCol] === '#') {
        newCol++;
      }
      if (newCol >= userGrid[0].length) return;
    } else {
      newRow++;
      while (newRow < userGrid.length && userGrid[newRow][newCol] === '#') {
        newRow++;
      }
      if (newRow >= userGrid.length) return;
    }

    setSelectedCell({ row: newRow, col: newCol });
  };

  const moveToPreviousCell = () => {
    const { row, col } = selectedCell;
    let newRow = row;
    let newCol = col;

    if (direction === 'across') {
      newCol--;
      while (newCol >= 0 && userGrid[newRow][newCol] === '#') {
        newCol--;
      }
      if (newCol < 0) return;
    } else {
      newRow--;
      while (newRow >= 0 && userGrid[newRow][newCol] === '#') {
        newRow--;
      }
      if (newRow < 0) return;
    }

    setSelectedCell({ row: newRow, col: newCol });
  };

  const navigateCell = (key) => {
    const { row, col } = selectedCell;
    let newRow = row;
    let newCol = col;

    switch (key) {
      case 'ArrowRight':
        newCol = Math.min(col + 1, userGrid[0].length - 1);
        break;
      case 'ArrowLeft':
        newCol = Math.max(col - 1, 0);
        break;
      case 'ArrowDown':
        newRow = Math.min(row + 1, userGrid.length - 1);
        break;
      case 'ArrowUp':
        newRow = Math.max(row - 1, 0);
        break;
      default:
        return;
    }

    if (userGrid[newRow][newCol] !== '#') {
      setSelectedCell({ row: newRow, col: newCol });
    }
  };

  const checkSolution = () => {
    let correct = 0;
    let total = 0;

    for (let i = 0; i < userGrid.length; i++) {
      for (let j = 0; j < userGrid[i].length; j++) {
        if (userGrid[i][j] !== '#' && puzzle.solution[i][j] !== '#') {
          total++;
          if (userGrid[i][j] === puzzle.solution[i][j]) {
            correct++;
          }
        }
      }
    }

    if (correct === total) {
      setMessage('🎉 Congratulations! Puzzle solved!');
    } else {
      setMessage(`${correct} / ${total} correct`);
    }
    setTimeout(() => setMessage(''), 3000);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedCell, userGrid, direction]);

  if (loading) {
    return <div className="game-container"><div className="loading">Loading puzzle...</div></div>;
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>Crossword</h1>
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

      <div className="crossword-container">
        <div className="crossword-main">
          <div className="crossword-grid">
            {userGrid.map((row, i) => (
              <div key={i} className="crossword-row">
                {row.map((cell, j) => (
                  <div
                    key={j}
                    className={`crossword-cell ${cell === '#' ? 'blocked' : ''} ${
                      selectedCell && selectedCell.row === i && selectedCell.col === j ? 'selected' : ''
                    }`}
                    onClick={() => handleCellClick(i, j)}
                  >
                    {showSolution && cell !== '#' ? puzzle.solution[i][j] : cell}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="crossword-controls">
            <button onClick={checkSolution}>Check Solution</button>
            <button onClick={() => setShowSolution(!showSolution)}>
              {showSolution ? 'Hide' : 'Show'} Solution
            </button>
          </div>
        </div>

        <div className="crossword-clues">
          <div className="clues-section">
            <h3>Across</h3>
            {puzzle.clues.across.map((clue, i) => (
              <div key={i} className="clue">
                <strong>{clue.number}.</strong> {clue.clue}
              </div>
            ))}
          </div>
          <div className="clues-section">
            <h3>Down</h3>
            {puzzle.clues.down.map((clue, i) => (
              <div key={i} className="clue">
                <strong>{clue.number}.</strong> {clue.clue}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Crossword;
