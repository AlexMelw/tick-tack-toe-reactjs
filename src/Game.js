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
      stepNumber: 0,
      xIsNext: true,
      lastIdentityIndex: initialLastIdentityIndex
    };
  }

  handleClick(squareIndex) {

    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = [...current.squares];

    const winnerCells = this.state.history[this.state.history.length - 1].winnerCells;

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

    const moves = history.map((step, moveIndex) => {

      const desc = moveIndex
        ? `Go to move ${moveIndex}`
        : `Go to game start`;

      return (
        <li key={step.itemKey}>
          <button onClick={() => this.jumpTo(moveIndex)}>{desc}</button>
        </li>
      );
    })

    let status = gameResult
      ? `Winner: ${gameResult.winner}`
      : `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;

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
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}
