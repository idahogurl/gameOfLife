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
        let status = this.props.val === "A" ? "alive" : this.props.val === "D" ? "dead" : "edge";
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
        return <button onClick={this.props.onClick} id={this.props.text.toLowerCase()}>{this.props.text}</button>;
    }
}

class GameOfLife extends Component<any,any> {
    height: number;
    width: number;
    fps: number;
    frameCount: number;
    requestId: any;
    constructor() {
        super();
        
        this.height = 30;
        this.width = 50;
        
        this.height += 2; //add 2 for edge cells
        this.width += 2;
        
        this.fps = 15;

        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
        this.clear = this.clear.bind(this); 
        this.getNextGeneration = this.getNextGeneration.bind(this);
        this.draw = this.draw.bind(this);
    }
    setupRandomBoard(): string[][] {
        debugger;
        
        let board: string[][] = new Array(this.height);
        
        for (let row = 0; row < this.height; row++) {
            board[row] = new Array(this.width);
            for (let col = 0; col < this.width; col++) {
                if (row === 0 || row === this.height - 1 || col === 0 || col === this.width - 1) {
                    board[row][col] = "E";
                } else {
                    board[row][col] = Math.round(Math.random()) === 1 ? "A" : "D"; //assign alive and dead cells
                }
            }
        }
        return board;
    }
    getNextGeneration() {
        //loop through rows
        //loop through cells
        debugger;
        let tempBoard = this.state.board.slice();

        for (let row = 1; row < tempBoard.length - 1; row++) {
           for (let col = 1; col < tempBoard[row].length - 1; col++) {
                let n = 0; //number of live neighbors
                
                //if (newBoard[row][col] !== "E") {
                let neighbors:boolean[] = new Array(8);
                    
                    neighbors[0] = this.isNeighborAlive(row - 1, col - 1, tempBoard); //top left
                    neighbors[1] = this.isNeighborAlive(row - 1, col, tempBoard);
                    neighbors[2] = this.isNeighborAlive(row - 1, col + 1, tempBoard); //top right
                    neighbors[3] = this.isNeighborAlive(row, col + 1, tempBoard); //center right
                                    
                    neighbors[4] = this.isNeighborAlive(row + 1, col, tempBoard); //bottom left
                    neighbors[5] = this.isNeighborAlive(row + 1, col, tempBoard); //bottom center
                    neighbors[6] = this.isNeighborAlive(row + 1, col + 1, tempBoard); //bottom right
                    neighbors[7] = this.isNeighborAlive(row, col - 1, tempBoard); //center left

                    let alive = neighbors.filter(i => {
                        return i === true;
                    });
                    
                    let cell:string = this.getNewValue(alive.length, tempBoard[row][col]);
                    tempBoard[row][col] = cell;
                }
            //}
        }

        this.setState({board: tempBoard, generationCount: this.state.generationCount + 1 });
    }
    getNewValue(length:number, currentValue:string) : string {        
        switch(length) {
            case 0: //dies
            case 1:                    
                return "D";             
            case 2: //stays the same
                return currentValue;
            case 3: //lives or born
                return "A";
            default: //more than three = dies
                return "D";
        }
    }
    isNeighborAlive(rowIndex:number, colIndex:number, board: string[][]): boolean {
       return board[rowIndex] !== undefined 
                            && board[rowIndex][colIndex] !== undefined 
                            && board[rowIndex][colIndex] === "A";
    }    
    draw() {
        let self = this;
        setTimeout(function() {
            requestAnimationFrame(self.getNextGeneration);
            // Drawing code goes here
        }, 1000 / this.fps);
    }
    componentDidUpdate() {
        if (this.state.running ) {
            this.draw();            
        }
    }
    componentWillMount() {
        this.state = { board: this.setupRandomBoard(), running: false, generationCount: 0}
    }
    start(e) {
        e.target.blur();

        this.setState({ generationCount: 1, running: true });        
    }
    clear(e) {
        e.target.blur();

        this.setState({ board: this.setupRandomBoard(), generationCount: 0, running: false });        
    }
    stop(e) {
        e.target.blur();

        cancelAnimationFrame(this.requestId);
        this.setState({ running: false });
    }
    render() {
        return (
            <div>
                <div className="row no-gutters align-items-center">
                    <div className="col-xs-3"><h1>Game of Life</h1></div>
                    <div className="col-xs-9">&nbsp;&nbsp;by John Conway</div>
                </div>
                <div className="row no-gutters">
                    <div className="col"><GameBoard board={this.state.board}/></div>
                </div>
                <div id="controls" className="row row-eq-height align-items-center no-gutters">
                     <div className="col-xs-6">
                        <GameControlButton onClick={this.start} text="Start"/>
                        <GameControlButton onClick={this.stop} text="Stop"/>
                        <GameControlButton onClick={this.clear} text="Clear"/>
                    </div>
                    <div className="col-xs-6">
                        <h4>Generation: {this.state.generationCount}</h4>
                    </div>
                </div>
            </div>
        );
    }
}
	
ReactDOM.render(<GameOfLife/>, document.getElementById("gameBoard"));