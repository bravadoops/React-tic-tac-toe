import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}   
  
class Board extends React.Component {



    renderSquare(i) {
        // use this.props instead of this.state to receive props from parent componet
        return <Square 
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
             />;
    }
  
    render() {
      return (
        <div>
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
    constructor(props) {
        super(props);
        this.state = {
            history: [{squares: Array(9).fill(null)}],
            stepNumber: 0,
            xNext: true,
            position: [{rl: Array(2).fill(null)}],
        };
    }

    handleClick(i) {
        
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        // deep copy instead of mutating 
        // if mutate, every click will change history array (history lose)
        const squares = current.squares.slice();
        // if winner exist or the square has been occupaid
        if (calculateWinner(squares) || squares[i]) return;
        squares[i] = this.state.xNext ? 'X' : 'O';
        // copy new squares
        const ListToPosition = [
            [1, 1],
            [1, 2],
            [1, 3],
            [2, 1],
            [2, 2],
            [2, 3],
            [3, 1],
            [3, 2],
            [3, 3],
        ];
        const position = this.state.position.slice(0, this.state.stepNumber + 1);
        this.setState({
            // connect current squares to history array
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xNext: !this.state.xNext,
            
            position: position.concat([{
                rl: ListToPosition[i]
            }]),
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xNext: (step % 2) === 0,
        });
    }

    render() {

        const history = this.state.history;
        const current = history[this.state.stepNumber];
        // calculate  winner by squares
        const winner = calculateWinner(current.squares);
        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xNext ? 'X': 'O');
        }
        // map history to moves
        const position = this.state.position;
        const moves = (history, position).map((value, i) => {
            const { rl } = value;
            console.log(rl)
            const desc = (i ?
              'Go to move #' + rl :
              'Go to game start') ;
            //   '(' + ListToPosition[i] + ')';
            return (
              <li key={i}>
                <button onClick={() => this.jumpTo(i)}>{desc}</button>{rl}

              </li>
            );
          });


        const positions = position.map((p, i) => {
            const { rl } = p;
            if (rl == Array(2).fill(null)) return;
            return (
                <li key={i}>
                    {rl[0]},{rl[1]}
                </li>
            );  
        });
        

        return (
        <div className="game">
            <div className="game-board">
            <Board 
                squares={current.squares}
                onClick={(i) => {this.handleClick(i)}}
            />
            </div>
            <div className="game-info">
            <div>{status}</div>
            <div style={{display: "flex", flexDirection:"row"}}>
                <div><ol>{moves}</ol></div>
                <div><ol>{positions}</ol></div>
            </div>
            </div>
        </div>
        );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );

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
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }
  
  