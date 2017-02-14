/*
User Story: When I first arrive at the game, it will randomly generate a board and start playing.

User Story: I can start and stop the board.

User Story: I can set up the board.

User Story: I can clear the board.

User Story: When I press start, the game will play out.

User Story: Each time the board changes, I can see how many generations have gone by.

Hint: Here's an explanation of Conway's Game of Life from John Conway himself: https://www.youtube.com/watch?v=E8kUJL04ELA

Hint: Here's an overview of Conway's Game of Life with rules for your reference: https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life

Any live cell with fewer than two live neighbours dies, as if caused by underpopulation.
Any live cell with two or three live neighbours lives on to the next generation.
Any live cell with more than three live neighbours dies, as if by overpopulation.
Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
*/
"use strict";
const React = require('react');
const ReactDOM = require('react-dom');
require('./sass/styles.scss');
const react_1 = require("react");
class GameOfLife extends react_1.Component {
    constructor() {
        super();
        this.height = 5;
        this.width = 5;
    }
    setupBoard() {
        let board = new Array(this.height);
        for (let i = 0; i < this.height; i++) {
            board[i] = new Array(this.width);
            for (let j = 0; j < this.width; j++) {
                board[i][j] = Math.round(Math.random()) === 1 ? "X" : ""; //assign alive and dead cells
            }
        }
        return board;
    }
    getNextGeneration() {
        //loop through rows
        //loop through cells
        let newBoard = this.state.board.slice();
        for (let rowIndex = 0; rowIndex < this.height; rowIndex++) {
            for (let colIndex = 0; colIndex < this.width; colIndex++) {
                let n = 0; //number of live neighbors
                //get above, left, right and bottom neighbor
                for (let x = -1; x <= 1; x++) {
                    for (let y = -1; y <= 1; y++) {
                        if (newBoard[x] !== undefined && newBoard[x][y] !== undefined && newBoard[x][y] === "X") {
                            //check if cell exists and is alive
                            n++;
                        }
                    }
                }
                let cell = newBoard[rowIndex][colIndex];
                switch (n) {
                    case 0: //fewer than two live = dies
                    case 1:
                        cell = "";
                        break;
                    case 2:
                        break;
                    case 3:
                        cell = "X";
                    default:
                        cell = "";
                        break;
                }
                newBoard[rowIndex][colIndex] = cell;
            }
        }
        this.setState({ board: newBoard });
    }
    componentWillMount() {
        this.state = { board: this.setupBoard() };
    }
    start() {
    }
    clear() {
    }
    stop() {
    }
    render() {
    }
}
class GameOfLifeBoard extends react_1.Component {
    render() {
        let i = -1;
        let rows = this.props.board.map(row => {
            let j = -1;
            let cells = row.map(cell => {
                j++;
                let status = cell === "X" ? "alive" : "dead";
                return (React.createElement("div", { key: i + "_" + j, className: status + " col-xs-2" }, "\u00A0"));
            });
            i++;
            return (React.createElement("div", { key: i, className: "row board-row" }, cells));
        });
        return (React.createElement("div", null, rows));
    }
}
ReactDOM.render(React.createElement(GameOfLifeBoard, null), document.getElementById("gameBoard"));
