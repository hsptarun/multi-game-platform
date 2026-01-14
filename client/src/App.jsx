import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Wordle from './components/Wordle';
import SpellingBee from './components/SpellingBee';
import Crossword from './components/Crossword';
import Sudoku from './components/Sudoku';
import Navigation from './components/Navigation';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/wordle" element={<Wordle />} />
          <Route path="/spelling-bee" element={<SpellingBee />} />
          <Route path="/crossword" element={<Crossword />} />
          <Route path="/sudoku" element={<Sudoku />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
