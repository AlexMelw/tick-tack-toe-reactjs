import React from 'react';
import { Board } from './Board';
import { calculateWinner } from "./calculateWinner";

export class Game extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      history: [{
        squares: new Array(9).fill(null)
      }],
      xIsNext: true,
      winnerCells: []
    };
  }

  handleClick(squareIndex) {

    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = [...current.squares];

    const isSquareAlreadyActioned = squares[squareIndex];
    if (isSquareAlreadyActioned || this.state.winnerCells.length === 3) {

      return;
    }

    squares[squareIndex] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: [...history, ...[ { squares: squares } ]],
      xIsNext: !this.state.xIsNext
    });

    const gameResult = calculateWinner(squares);

    if (gameResult) {
      this.setState({
        winnerCells: gameResult.cells
      });
    }
  }

  render() {

    const history = this.state.history;
    const current = history[history.length - 1];
    const gameResult = calculateWinner(current.squares);

    let status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;

    if (gameResult) {
      status = `Winner: ${gameResult.winner}`;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winnerCells={this.state.winnerCells}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol></ol>
        </div>
      </div>
    );
  }
}
