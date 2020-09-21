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

    const coef = this.state.sortDirection === 'asc' ? 1 : -1;

    const moves = history.map((step, moveIndex) => {

      const isAsc = this.state.sortDirection === 'asc';

      let description;
      let sortedMoveIndex;

      if (isAsc) {

        sortedMoveIndex = moveIndex;
        description = moveIndex === 0 ? `Go to game start` : `Go to move ${sortedMoveIndex}`;
      } else {

        sortedMoveIndex = this.state.history.length - 1 - moveIndex;
        description = moveIndex === this.state.history.length - 1 ? `Go to game start` : `Go to move ${sortedMoveIndex}`;
      }

      return (
        <li key={sortedMoveIndex}>
          <button onClick={() => this.jumpTo(sortedMoveIndex)}>{description}</button>
        </li>
      );
    })

    let status = "DRAW (no one won)";

    if (current.itemKey !== 10 || current.winnerCells.length === 3) {

      status = gameResult
        ? `Winner: ${gameResult.winner}`
        : `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
    }

    const winnerCells = this.state.history[this.state.stepNumber].winnerCells;

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winnerCells={winnerCells}
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

    this.setState({
      sortDirection: direction,
    });
  }
}
