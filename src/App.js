import './App.css';
import Board from './components/Board';
import * as logic from './core-logic/sudoku_core.js';

function App() {
  return (
    <div className="App">
      <Board initialGame={logic.getInitialGame()} />
    </div>
  );
}

export default App;
