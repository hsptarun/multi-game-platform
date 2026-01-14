import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navigation() {
  const location = useLocation();

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          🎮 Multi-Game Platform
        </Link>
        <div className="nav-links">
          <Link 
            to="/wordle" 
            className={location.pathname === '/wordle' ? 'active' : ''}
          >
            Wordle
          </Link>
          <Link 
            to="/spelling-bee" 
            className={location.pathname === '/spelling-bee' ? 'active' : ''}
          >
            Spelling Bee
          </Link>
          <Link 
            to="/crossword" 
            className={location.pathname === '/crossword' ? 'active' : ''}
          >
            Crossword
          </Link>
          <Link 
            to="/sudoku" 
            className={location.pathname === '/sudoku' ? 'active' : ''}
          >
            Sudoku
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
