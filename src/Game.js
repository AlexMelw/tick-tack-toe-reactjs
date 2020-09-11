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
        itemKey: initialLastIdentityIndex
      }],
      xIsNext: true,
      winnerCells: [],
      lastIdentityIndex: initialLastIdentityIndex
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
    const updatedIdentityIndex = this.state.lastIdentityIndex + 1;

    const currentGameState = {
      squares: squares,
      itemKey: updatedIdentityIndex
    };

    this.setState({ lastIdentityIndex: updatedIdentityIndex })

    this.setState({
      history: [...history, ...[currentGameState]],
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

    console.log('----------------------- RE-RENDERING CYCLE ----------------------');

    const moves = history.map((step, moveIndex) => {

      const desc = moveIndex
        ? `Go to move ${moveIndex}`
        : `Go to game start`;

      console.log(`Move index: ${moveIndex}`);
      console.log(`ID: ${step.itemKey}`);

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
            winnerCells={this.state.winnerCells}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}
