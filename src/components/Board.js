import React from 'react';
import Cell from './Cell';
import * as logic from '../core-logic/sudoku_core.js';

export default class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            initialGame: props.initialGame
        };

        this.sudokuGrid = logic.constructSudokuGrid(this.state.initialGame);
        this.sudokuBoxes = logic.extractBoxesFromGrid(this.sudokuGrid);
        this.rawRows = []; // This will hold the actual <Cell ../> definitions to render

        this.selectedCell = null;
        this.relatedCells = [];

        // Initialize Raw Rows
        for(let iterRows = 0; iterRows < 9; iterRows++) {
            let aRow = [];
            this.rawRows.push(aRow); 
        }

        for(let iterRows = 0; iterRows < 9; iterRows++) {
            for(let iterCols = 0; iterCols < 9; iterCols++) {
                let cellRef = React.createRef();
                let sudokuCell = this.sudokuGrid[iterRows][iterCols];
                sudokuCell.display = cellRef;
                let aCell = <Cell ref={cellRef} value={sudokuCell.value} board={this} rowIndex={(iterRows)} colIndex={(iterCols)} />;

                this.rawRows[iterRows].push(aCell);
            }   
        }   
    }

    cellClicked(cell, cellRowIndex, cellColIndex) {
        console.log("Cell clicked, yay!");

        this.clearCellHighlights();

        cell.selected(true);
        this.selectedCell = this.sudokuGrid[cellRowIndex][cellColIndex];

        console.log(cell);
        
        // we want to highlight all cells in the same
        // column / row / box as the selected cell
        this.relatedCells = [
            ...new Set([
            ...logic.getRelatedRowCells(this.sudokuGrid, cellRowIndex, cellColIndex),
            ...logic.getRelatedColCells(this.sudokuGrid, cellRowIndex, cellColIndex),
            ...logic.getRelatedBoxCells(this.sudokuBoxes, cellRowIndex, cellColIndex)
            ])
        ];
        
        for (const val of this.relatedCells) {
            console.log("Hello");
            val.display.current.related(true);
        }

        // If the selected cell is not empty, we also want to highlight the
        // same number across the board (all 1s, or all 2s, etc)

    }

    clearCellHighlights() {
        while (this.relatedCells.length > 0) {
            let cell = this.relatedCells.pop();
            cell.display.current.selected(false);
            cell.display.current.related(false);
        }
    }

    handleInput(input) {
        if (this.selectedCell != null) {
            this.selectedCell.value = input;
            this.selectedCell.display.current.value(input);
        }
    }

    render() {
        let rowlist = this.rawRows.map((d, i) => {
            return <tr key={'row'+i}>{d}</tr>;
        });

        return (
            <div className="container">
                <table className="board">
                    <tbody>{rowlist}</tbody>
                </table>
                <div className="inputBar">
                    <button type="button" onClick={() => this.handleInput(1)}>1</button>
                    <button type="button" onClick={() => this.handleInput(2)}>2</button>
                    <button type="button" onClick={() => this.handleInput(3)}>3</button>
                    <button type="button" onClick={() => this.handleInput(4)}>4</button>
                    <button type="button" onClick={() => this.handleInput(5)}>5</button>
                    <button type="button" onClick={() => this.handleInput(6)}>6</button>
                    <button type="button" onClick={() => this.handleInput(7)}>7</button>
                    <button type="button" onClick={() => this.handleInput(8)}>8</button>
                    <button type="button" onClick={() => this.handleInput(9)}>9</button>
                </div>
            </div>
        );
    }
}