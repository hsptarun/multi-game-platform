# Multi-Game Platform

A full-stack web application featuring 4 daily puzzle games: Wordle, Spelling Bee, Crossword, and Sudoku. Built with React and Node.js/Express, with server-side puzzle generation ensuring all users get the same daily puzzles.

## 🎮 Games Included

### 1. **Wordle**
- Guess the 5-letter word in 6 tries
- Color-coded feedback (green = correct position, yellow = wrong position, gray = not in word)
- Virtual keyboard with letter status tracking
- Daily puzzle mode and random practice mode

### 2. **Spelling Bee**
- Create words from 7 letters (1 center letter + 6 outer letters)
- Words must be at least 4 letters and contain the center letter
- Find pangrams (words using all 7 letters) for bonus points
- Shuffle button to rearrange outer letters
- Score tracking with point system

### 3. **Crossword**
- Interactive 8x8 grid puzzle
- Click cells to input letters
- Separate panels for Across and Down clues
- Keyboard navigation support
- Check solution and reveal options

### 4. **Sudoku**
- Classic 9x9 Sudoku puzzle
- Medium difficulty level
- Visual highlighting for selected row/column/box
- Conflict detection showing errors in real-time
- Number pad for easy input
- Check solution feature

## 🚀 Features

- **Daily Puzzles**: New puzzles generated daily at midnight (same for all users)
- **Random Mode**: Practice with unlimited random puzzles for each game
- **Local Storage**: Game progress saved automatically
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Clean UI**: Modern, intuitive interface with smooth animations
- **Date-based Seeding**: Deterministic puzzle generation ensures consistency

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher)
- **npm** (v6 or higher)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/hsptarun/multi-game-platform.git
   cd multi-game-platform
   ```

2. **Install dependencies for all projects**
   ```bash
   npm run install-all
   ```

   This will install dependencies for:
   - Root project
   - Client (React app)
   - Server (Express API)

## 🏃‍♂️ Running the Application

### Development Mode (Recommended)

Run both client and server concurrently:
```bash
npm run dev
```

This will start:
- **Backend server** on `http://localhost:5000`
- **React frontend** on `http://localhost:3000`

The React app will automatically proxy API requests to the backend server.

### Run Client and Server Separately

**Start the server:**
```bash
npm run server
```

**Start the client (in a new terminal):**
```bash
npm run client
```

### Production Mode

1. **Build the React app:**
   ```bash
   npm run build
   ```

2. **Start the production server:**
   ```bash
   npm start
   ```

The server will serve the built React app on `http://localhost:5000`

## 📁 Project Structure

```
multi-game-platform/
├── client/                 # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Home.jsx           # Game selection dashboard
│   │   │   ├── Navigation.jsx     # Navigation bar
│   │   │   ├── Wordle.jsx         # Wordle game
│   │   │   ├── SpellingBee.jsx    # Spelling Bee game
│   │   │   ├── Crossword.jsx      # Crossword game
│   │   │   └── Sudoku.jsx         # Sudoku game
│   │   ├── App.jsx                # Main app with routing
│   │   ├── App.css                # Global styles
│   │   └── index.js               # React entry point
│   └── package.json
├── server/                 # Express backend
│   ├── routes/
│   │   ├── wordle.js              # Wordle API endpoints
│   │   ├── spellingBee.js         # Spelling Bee API endpoints
│   │   ├── crossword.js           # Crossword API endpoints
│   │   └── sudoku.js              # Sudoku API endpoints
│   ├── utils/
│   │   ├── wordList.js            # Word dictionaries
│   │   ├── puzzleGenerator.js    # Puzzle generation logic
│   │   └── dateHelper.js          # Date seeding utilities
│   ├── server.js                  # Express server
│   └── package.json
├── README.md
└── package.json            # Root package.json with scripts
```

## 🎯 API Endpoints

### Wordle
- `GET /api/wordle/daily` - Get today's Wordle puzzle
- `GET /api/wordle/random` - Get a random Wordle puzzle
- `POST /api/wordle/check` - Check a guess against the word

### Spelling Bee
- `GET /api/spelling-bee/daily` - Get today's Spelling Bee puzzle
- `GET /api/spelling-bee/random` - Get a random Spelling Bee puzzle

### Crossword
- `GET /api/crossword/daily` - Get today's Crossword puzzle
- `GET /api/crossword/random` - Get a random Crossword puzzle

### Sudoku
- `GET /api/sudoku/daily` - Get today's Sudoku puzzle
- `GET /api/sudoku/random` - Get a random Sudoku puzzle

## 🎲 How Puzzles Work

### Daily Puzzles
- Generated using **date-based seeding** (YYYY-MM-DD format)
- All users get the same puzzle on the same day
- Puzzles change at midnight (based on server time)
- Progress saved in browser's localStorage

### Random Puzzles
- Generated using timestamp-based seeds
- Different puzzle each time
- Perfect for practice
- No progress saving

## 🎮 How to Play

### Wordle
1. Type a 5-letter word using your keyboard or the virtual keyboard
2. Press Enter to submit
3. Green = correct letter in correct position
4. Yellow = correct letter in wrong position
5. Gray = letter not in word
6. You have 6 attempts to guess the word

### Spelling Bee
1. Click letters to form words (or type on keyboard)
2. Words must be at least 4 letters
3. Words must contain the center (yellow) letter
4. Click "Shuffle" to rearrange outer letters
5. Click "Enter" to submit
6. Find pangrams (words using all 7 letters) for bonus points!

### Crossword
1. Click a cell to select it
2. Type letters using your keyboard
3. Use arrow keys to navigate
4. Click the same cell twice to change direction (across/down)
5. Click "Check Solution" to verify your answers
6. Click "Show Solution" to reveal the answer

### Sudoku
1. Click a cell to select it
2. Enter numbers 1-9 using keyboard or number pad
3. Fill all cells with no conflicts
4. Red highlighting shows errors
5. Blue highlighting shows related cells
6. Click "Check Solution" when complete

## 💾 Local Storage

Game progress is automatically saved in your browser's localStorage:
- **Daily puzzles**: Progress saved per date
- **Random puzzles**: Not saved (new puzzle each time)
- Clear browser data to reset saved progress

## 🛠️ Technologies Used

### Frontend
- **React 18** - UI framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP requests
- **CSS3** - Styling with responsive design

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Wordle game inspired by Josh Wardle's original Wordle
- Spelling Bee game inspired by The New York Times Spelling Bee
- Classic puzzle games: Crossword and Sudoku

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

**Enjoy playing! 🎮**
