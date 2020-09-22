import React from 'react';
import { Square } from "./Square";

export class Board extends React.Component {

  renderSquare(i) {

    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        index={i}
        winnerCells={this.props.winnerCells}
        onClick={() => this.props.onClick(i)} />
    );
  }

  render() {

    // let board = ``;

    // for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
      
      // for (let columnIndex = 0; columnIndex < 3; columnIndex++) {
      //   this.renderSquare(3 * rowIndex + columnIndex)
      // }

      // const rowCells = [0, 1, 2].map(columnIndex => this.renderSquare(3 * rowIndex + columnIndex));

      // board += `
      //   <div className="board-row">
      //     ${rowCells}
      //   </div>
      // `;
    // }

    const board = [0, 1, 2].map(rowIndex => {

        const rowCells = [0, 1, 2].map(columnIndex => this.renderSquare(3 * rowIndex + columnIndex));

        return (
          <div key={rowIndex} className="board-row">
            {rowCells}
          </div>
        )
      });

    return (
      <div>
        {board}
      </div>
    );
  }
}
