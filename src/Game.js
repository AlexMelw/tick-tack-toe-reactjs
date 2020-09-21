import React from 'react';
import { Board } from './Board';
import { calculateWinner } from "./calculateWinner";
// import { v4 as uuid } from 'uuid';

export class Game extends React.Component {

  constructor(props) {
    super(props);

    const initialLastIdentityIndex = 1;

    this.state = {
      history: [{
        squares: new Array(9).fill(null),
        itemKey: initialLastIdentityIndex,
        winnerCells: [],
      }],
      sortDirection: 'asc',
      stepNumber: 0,
      xIsNext: true,
      lastIdentityIndex: initialLastIdentityIndex
    };
  }

  handleClick(squareIndex) {

    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = [...current.squares];

    const winnerCells = this.state.history[this.state.stepNumber].winnerCells;

    const isSquareAlreadyActioned = squares[squareIndex];
    if (isSquareAlreadyActioned || winnerCells.length === 3) {

      return;
    }

    squares[squareIndex] = this.state.xIsNext ? 'X' : 'O';
    const updatedIdentityIndex = this.state.lastIdentityIndex + 1;

    const currentGameState = {
      squares: squares,
      itemKey: updatedIdentityIndex,
      winnerCells: []
    };

    const newHistory = [...history, currentGameState];
    this.setState({
      lastIdentityIndex: updatedIdentityIndex,
      stepNumber: newHistory.length - 1,
      history: newHistory,
      xIsNext: !this.state.xIsNext
    }, () => {
      const gameResult = calculateWinner(squares);

      const penultHistoryIndex = this.state.history.length - 1;

      if (gameResult) {
        this.setState({

          history: this.state.history
            .slice(0, penultHistoryIndex)
            .concat([{
              ...this.state.history[penultHistoryIndex],
              winnerCells: gameResult.cells,
            }])
        });
      }
    });
  }

  jumpTo(step) {

    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {

    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const gameResult = calculateWinner(current.squares);

    // console.log('----------------------- RE-RENDERING CYCLE ----------------------');

    const moves = history.map((step) => {

      const sortedMoveIndex = step.itemKey - 1;

      const desc = step.itemKey !== 1
        ? `Go to move ${sortedMoveIndex}`
        : `Go to game start`;

      const jumpToMoveIndex = this.state.sortDirection === 'asc' 
        ? step.itemKey - 1
        : this.state.history.length - step.itemKey

      return (
        <li key={sortedMoveIndex}>
          <button onClick={() => this.jumpTo(jumpToMoveIndex)}>{desc}</button>
        </li>
      );
    })

    let status;

    if (current.itemKey === 10 && current.winnerCells.length !== 3) {

      status = "DRAW (no one won)";
    } else {

      status = gameResult
        ? `Winner: ${gameResult.winner}`
        : `Next player: ${this.state.xIsNext ? 'X' : 'O'}`
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winnerCells={this.state.history[this.state.stepNumber].winnerCells}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">

          <div>
            <strong>{status}</strong>
          </div>

          <div className="order-toggler">
            <button onClick={(e) => this.sortMoves('asc')}>Sort Ascending</button>
            <button onClick={(e) => this.sortMoves('desc')}>Sort Descending</button>
          </div>

          <ol>{moves}</ol>
        </div>
      </div>
    );
  }

  sortMoves = (direction = 'asc') => {

    const coef = direction === 'asc' ? 1 : -1;
    const sortedHistory = this.state.history.splice(0).sort((a, b) => (a.itemKey - b.itemKey) * coef);

    this.setState({
      history: sortedHistory,
      sortDirection: direction,
    });
  }
}
