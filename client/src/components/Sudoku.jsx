import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Sudoku() {
  const [puzzle, setPuzzle] = useState(null);
  const [userGrid, setUserGrid] = useState([]);
  const [initialGrid, setInitialGrid] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState('daily');
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    loadPuzzle('daily');
  }, []);

  const loadPuzzle = async (puzzleMode) => {
    setLoading(true);
    try {
      const endpoint = puzzleMode === 'daily' ? '/api/sudoku/daily' : '/api/sudoku/random';
      const response = await axios.get(endpoint);
      setPuzzle(response.data);
      setMode(puzzleMode);
      setInitialGrid(response.data.puzzle.map(row => [...row]));

      // Load saved state for daily puzzle
      if (puzzleMode === 'daily') {
        const savedState = localStorage.getItem(`sudoku-${response.data.date}`);
        if (savedState) {
          setUserGrid(JSON.parse(savedState));
        } else {
          setUserGrid(response.data.puzzle.map(row => [...row]));
        }
      } else {
        setUserGrid(response.data.puzzle.map(row => [...row]));
      }

      setSelectedCell(null);
      setMessage('');
      setErrors([]);
    } catch (error) {
      console.error('Error loading puzzle:', error);
      setMessage('Failed to load puzzle. Please try again.');
    }
    setLoading(false);
  };

  const handleCellClick = (row, col) => {
    if (initialGrid[row][col] !== 0) return;
    setSelectedCell({ row, col });
  };

  const handleNumberInput = (num) => {
    if (!selectedCell) return;
    const { row, col } = selectedCell;

    if (initialGrid[row][col] !== 0) return;

    const newGrid = userGrid.map(r => [...r]);
    newGrid[row][col] = num;
    setUserGrid(newGrid);

    // Save state for daily puzzle
    if (mode === 'daily' && puzzle.date) {
      localStorage.setItem(`sudoku-${puzzle.date}`, JSON.stringify(newGrid));
    }

    // Check for conflicts
    checkConflicts(newGrid);
  };

  const checkConflicts = (grid) => {
    const newErrors = [];

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] !== 0) {
          const num = grid[row][col];

          // Check row
          for (let c = 0; c < 9; c++) {
            if (c !== col && grid[row][c] === num) {
              newErrors.push(`${row}-${col}`);
              newErrors.push(`${row}-${c}`);
            }
          }

          // Check column
          for (let r = 0; r < 9; r++) {
            if (r !== row && grid[r][col] === num) {
              newErrors.push(`${row}-${col}`);
              newErrors.push(`${r}-${col}`);
            }
          }

          // Check 3x3 box
          const boxRow = Math.floor(row / 3) * 3;
          const boxCol = Math.floor(col / 3) * 3;
          for (let r = boxRow; r < boxRow + 3; r++) {
            for (let c = boxCol; c < boxCol + 3; c++) {
              if ((r !== row || c !== col) && grid[r][c] === num) {
                newErrors.push(`${row}-${col}`);
                newErrors.push(`${r}-${c}`);
              }
            }
          }
        }
      }
    }

    setErrors([...new Set(newErrors)]);
  };

  const checkSolution = () => {
    let allFilled = true;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (userGrid[i][j] === 0) {
          allFilled = false;
          break;
        }
      }
      if (!allFilled) break;
    }

    if (!allFilled) {
      setMessage('Puzzle not complete!');
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    if (errors.length > 0) {
      setMessage('There are errors in your solution!');
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    // Check against solution
    let correct = true;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (userGrid[i][j] !== puzzle.solution[i][j]) {
          correct = false;
          break;
        }
      }
      if (!correct) break;
    }

    if (correct) {
      setMessage('🎉 Congratulations! Puzzle solved correctly!');
    } else {
      setMessage('Solution is incorrect. Keep trying!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const clearCell = () => {
    if (!selectedCell) return;
    const { row, col } = selectedCell;

    if (initialGrid[row][col] !== 0) return;

    const newGrid = userGrid.map(r => [...r]);
    newGrid[row][col] = 0;
    setUserGrid(newGrid);

    // Save state
    if (mode === 'daily' && puzzle.date) {
      localStorage.setItem(`sudoku-${puzzle.date}`, JSON.stringify(newGrid));
    }

    checkConflicts(newGrid);
  };

  const handleKeyPress = (e) => {
    if (!selectedCell) return;

    if (e.key >= '1' && e.key <= '9') {
      handleNumberInput(parseInt(e.key));
    } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
      clearCell();
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      navigateCell(e.key);
    }
  };

  const navigateCell = (key) => {
    const { row, col } = selectedCell;
    let newRow = row;
    let newCol = col;

    switch (key) {
      case 'ArrowRight':
        newCol = (col + 1) % 9;
        break;
      case 'ArrowLeft':
        newCol = (col - 1 + 9) % 9;
        break;
      case 'ArrowDown':
        newRow = (row + 1) % 9;
        break;
      case 'ArrowUp':
        newRow = (row - 1 + 9) % 9;
        break;
      default:
        return;
    }

    setSelectedCell({ row: newRow, col: newCol });
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCell, userGrid]);

  if (loading) {
    return <div className="game-container"><div className="loading">Loading puzzle...</div></div>;
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>Sudoku</h1>
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

      <div className="sudoku-container">
        <div className="sudoku-grid">
          {userGrid.map((row, i) => (
            <div key={i} className="sudoku-row">
              {row.map((cell, j) => {
                const isInitial = initialGrid[i][j] !== 0;
                const isSelected = selectedCell && selectedCell.row === i && selectedCell.col === j;
                const hasError = errors.includes(`${i}-${j}`);
                const isInBox = selectedCell && 
                  Math.floor(selectedCell.row / 3) === Math.floor(i / 3) &&
                  Math.floor(selectedCell.col / 3) === Math.floor(j / 3);
                const isInRowCol = selectedCell && (selectedCell.row === i || selectedCell.col === j);

                return (
                  <div
                    key={j}
                    className={`sudoku-cell ${isInitial ? 'initial' : ''} ${isSelected ? 'selected' : ''} 
                      ${hasError ? 'error' : ''} ${isInBox ? 'highlight-box' : ''} ${isInRowCol ? 'highlight-line' : ''}
                      ${j % 3 === 2 && j !== 8 ? 'border-right' : ''} ${i % 3 === 2 && i !== 8 ? 'border-bottom' : ''}`}
                    onClick={() => handleCellClick(i, j)}
                  >
                    {cell !== 0 ? cell : ''}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="sudoku-controls">
          <div className="number-pad">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <button key={num} onClick={() => handleNumberInput(num)}>
                {num}
              </button>
            ))}
          </div>
          <div className="action-buttons">
            <button onClick={clearCell}>Clear</button>
            <button onClick={checkSolution}>Check Solution</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sudoku;
