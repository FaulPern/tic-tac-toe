import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import barbotine from './img/Barbalib.png';
import barbibul from './img/Barbabright.png';

let winningMove;

function Square(props) {
  const winner = props.winner;
  return (
    <button
      style={{ backgroundColor: winner ? "lightgreen" : "white" }}
      className="square"
      onClick={props.onClick}
    >
      {props.value 
      && <img 
        src={props.value} 
        alt={props.value}
        width='90px' height='90px' />}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    const winner = winningMove && winningMove.includes(i);
    return (
      <Square
        winner={winner}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }
  renderGrid() {
    let table = [];
    let squareNumber = 0;
    // Outer loop to create parent
    for (let i = 0; i < 3; i++) {
      let children = [];
      //Inner loop to create children
      for (let j = 0; j < 3; j++) {
        children.push(
          <div key={squareNumber} style={{ display: "inline" }}>
            {this.renderSquare(squareNumber)}
          </div>
        );
        squareNumber++;
      }
      //Create the parent and add the children
      table.push(
        <div key={i} className="board-row">
          {children}
        </div>
      );
    }
    return table;
  }

  render() {
    return (
      <div className="board-grid">
        {this.renderGrid()}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      reversed: false
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? barbibul : barbotine;
    this.setState({
      history: history.concat([
        {
          squares: squares,
          squareNumber: i,
          xIsNext: !this.state.xIsNext
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    winningMove = [];
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  }

  sqToXYPos(i) {
    const pos = Array(2).fill(null);
    if (i >= 0 && i <= 2) {
      pos[0] = i + 1;
      pos[1] = 1;
      return "(col: " + pos[0] + ", row: " + pos[1] + ")";
    } else if (i >= 3 && i <= 5) {
      pos[0] = (i % 3) + 1;
      pos[1] = 2;
      return "(col: " + pos[0] + ", row: " + pos[1] + ")";
    } else if (i >= 6 && i <= 8) {
      pos[0] = (i % 6) + 1;
      pos[1] = 3;
      return "(col: " + pos[0] + ", row: " + pos[1] + ")";
    } else {
      return "";
    }
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    if (winner) {
    } else if (!current.squares.includes(null)) {
    } else {
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={i => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <button onClick={() => this.jumpTo(0)}>Recommencer</button>
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
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      winningMove = lines[i];
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
