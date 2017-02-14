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

const React = require('react');
const ReactDOM = require('react-dom');

require('./sass/styles.scss');

import {Component} from 'react';

class BoardCell extends Component<any,any> {
    render() {
        let status = this.props.val === "X" ? "alive" : "dead";
        return <div className={"board-cell " + status}>&nbsp;</div>
    }
    shouldComponentUpdate(nextProps, nextState) {
        return this.props.val != nextProps.val;
    }
}

class BoardRow extends Component<any,any> {
    render() {
        let j: number = 1;
        
        let cells = this.props.cells.map(cell =>  { 
            j++;
            return <BoardCell key={this.props.rowNumber + "_" + j} val={cell}/>; 
        });
        return (
            <div className="board-row">
                {cells}
            </div>
        );
    }
}

class GameBoard extends Component<any,any> {
    game: GameOfLife;
    
    render() {        
        let i = 1;
        let rows = this.props.board.map(row => 
            { 
               i++;
              
               return <BoardRow key={i} rowNumber={i} cells={row} />
            });
        return (
            <div>
                {rows}
            </div>
        );
    }
}

class GameControlButton extends Component<any, any> {
    render() {
        return <button onClick={this.props.onClick}>{this.props.text}</button>;
    }
}

class GameOfLife extends Component<any,any> {
    height: number;
    width: number;
    constructor() {
        super();
        
        this.height = 11;
        this.width = 38;

        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
        this.clear = this.clear.bind(this); 
        this.getNextGeneration = this.getNextGeneration.bind(this);   
    }

    setupBoard(): string[][] {
        let board: string[][] = new Array(this.height);
        let count: number = 0;
        for (let i = 0; i < this.height; i++) {
            board[i] = new Array(this.width);
            for (let j = 0; j < this.width; j++) {
               board[i][j] = Math.round(Math.random()) === 1 ? "X" : ""; //assign alive and dead cells
               count++;
            }
        }
        return board;
    }

    getNextGeneration() {
        //loop through rows
        //loop through cells
        debugger;
        let newBoard = this.state.board.slice();

        for (let rowIndex: number = 0; rowIndex < newBoard.length; rowIndex++) {
           for (let colIndex: number = 0; colIndex < newBoard[rowIndex].length; colIndex++) {
                let n = 0; //number of live neighbors
                
                let neighbors:boolean[] = new Array(8);
                    
                neighbors[0] = this.isNeighborAlive(rowIndex - 1, colIndex - 1, newBoard); //top left
                neighbors[1] = this.isNeighborAlive(rowIndex - 1, colIndex, newBoard);
                neighbors[2] = this.isNeighborAlive(rowIndex - 1, colIndex + 1, newBoard); //top right
                neighbors[3] = this.isNeighborAlive(rowIndex, colIndex + 1, newBoard); //center right
                                
                neighbors[4] = this.isNeighborAlive(rowIndex + 1, colIndex, newBoard); //bottom left
                neighbors[5] = this.isNeighborAlive(rowIndex + 1, colIndex, newBoard); //bottom center
                neighbors[6] = this.isNeighborAlive(rowIndex + 1, colIndex + 1, newBoard); //bottom right
                neighbors[7] = this.isNeighborAlive(rowIndex, colIndex - 1, newBoard); //center left

                let alive = neighbors.filter(i => {
                    return i === true;
                });
                
                let cell:string = this.getNewValue(alive.length, newBoard[rowIndex][colIndex]);
                newBoard[rowIndex][colIndex] = cell;
            }
        }

        this.setState({board: newBoard, generationCount: this.state.generationCount + 1 });
    }
    getNewValue(length:number, currentValue:string) : string {        
        switch(length) {
            case 0: //fewer than two live = dies
            case 1:                    
                return "";             
            case 2: //dead cells can only comeback when it has 3 neighbors so the cell is already alive
                return currentValue;
            case 3: //two or three live = lives
                return "X";
            default: //more than three = dies
                return "";
        }
    }
    isNeighborAlive(rowIndex:number, colIndex:number, board: string[][]): boolean {
       return board[rowIndex] !== undefined 
                            && board[rowIndex][colIndex] !== undefined 
                            && board[rowIndex][colIndex] === "X";
    }
    componentDidUpdate() {
        if (this.state.running) {
            requestAnimationFrame(this.getNextGeneration);            
        }
    }
    componentWillMount() {
        this.state = { board: this.setupBoard(), running: false, generationCount: 0}
    }
    start() {
        this.setState({ generationCount: 1, running: true });
    }
    clear() {
        this.setState({ board: this.setupBoard(), generationCount: 0, running: false });
    }
    stop() {
        this.setState({ running: false });
    }
    render() {
        return (
            <div>
                <GameBoard board={this.state.board}/>
                Generation Number: {this.state.generationCount}
                <GameControlButton onClick={this.start} text="Start"/>
                <GameControlButton onClick={this.stop} text="Stop"/>
                <GameControlButton onClick={this.clear} text="Clear"/>
            </div>
        );
    }
}
	
ReactDOM.render(<GameOfLife/>, document.getElementById("gameBoard"));