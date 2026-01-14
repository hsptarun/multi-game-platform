import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const games = [
    {
      name: 'Wordle',
      path: '/wordle',
      icon: '📝',
      description: 'Guess the 5-letter word in 6 tries',
      color: '#6aaa64'
    },
    {
      name: 'Spelling Bee',
      path: '/spelling-bee',
      icon: '🐝',
      description: 'Make words from 7 letters',
      color: '#f7da21'
    },
    {
      name: 'Crossword',
      path: '/crossword',
      icon: '📰',
      description: 'Solve the daily crossword puzzle',
      color: '#5a9fd4'
    },
    {
      name: 'Sudoku',
      path: '/sudoku',
      icon: '🔢',
      description: 'Fill the 9x9 grid with numbers',
      color: '#bb6bd9'
    }
  ];

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Welcome to Multi-Game Platform</h1>
        <p className="date">{currentDate}</p>
        <p className="subtitle">Choose a game to play today's puzzle</p>
      </div>

      <div className="games-grid">
        {games.map((game) => (
          <Link to={game.path} key={game.name} className="game-card">
            <div className="game-icon" style={{ backgroundColor: game.color }}>
              {game.icon}
            </div>
            <h2>{game.name}</h2>
            <p>{game.description}</p>
          </Link>
        ))}
      </div>

      <div className="home-footer">
        <p>New puzzles available daily at midnight!</p>
      </div>
    </div>
  );
}

export default Home;
