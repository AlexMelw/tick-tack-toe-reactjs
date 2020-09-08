import React from 'react';
import { default as styled } from 'styled-components';
import './App.css';

function App() {

  return (<Game />);
}

export default App;

const StyledSquareButton = styled.button`

    background-color: ${props => props.isStrike ? "rgba(76, 227, 0, 1)" : "inherit"};
    color: ${props => props.isStrike ? "rgba(255, 255, 255, 1)" : "inherit"};

    ${props => props.isStrike && "text-shadow: 0px 0px 2px rgba(150, 150, 150, 1); "}
`;

function Square(props) {

  const isStrike = props.winnerCells.some(x => x === props.index);

  return (
    <StyledSquareButton
      className="square"
      isStrike={isStrike}
      onClick={props.onClick}>

      {props.value}
    </StyledSquareButton>
  );
}

class Board extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      squares: new Array(9).fill(null),
      xIsNext: true,
      winnerCells: []
    };
  }

  handleClick(squareIndex) {

    const squares = [...this.state.squares];

    const isSquareAlreadyActioned = squares[squareIndex];
    if (isSquareAlreadyActioned || this.state.winnerCells.length === 3) {

      return;
    }

    squares[squareIndex] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext
    });

    const gameResult = calculateWinner(squares);

    if (gameResult) {
      this.setState({
        winnerCells: gameResult.cells
      });
    }
  }

  renderSquare(i) {

    return (
      <Square
        value={this.state.squares[i]}
        index={i}
        winnerCells={this.state.winnerCells}
        onClick={() => this.handleClick(i)} />
    );
  }

  render() {

    const gameResult = calculateWinner(this.state.squares);
    let status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;

    if (gameResult) {
      status = `Winner: ${gameResult.winner}`;
    }

    return (
      <div>
        <div className="status">
          {status}
        </div>

        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>

        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>

        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>

      </div>
    );
  }
}

class Game extends React.Component {

  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {

  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        cells: line
      };
    }
  }

  return null;
}

// ========================================
