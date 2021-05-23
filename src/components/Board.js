import React from 'react';
import Cell from './Cell';

export default class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            initialGame: "017030590000000403000006070120009050000402000060700021030600000901000000054020310", // we don't want to hardcode this here forever
            selectedCell: null
        };

        this.rows = []; // The board has 9 rows, with 9 Cells each
        this.cols = []; // The board has 9 columns, with 9 Cells each
        this.boxes = []; // these will be each of the 9 3x3 subgrids of the board

        // Initialize Rows
        for(let iterRows = 0; iterRows < 9; iterRows++) {
            let aRow = [];
            this.rows.push(aRow); 
        }    

        // Initialize Cols
        for(let iterCols = 0; iterCols < 9; iterCols++) {
            let aCol = [];
            this.cols.push(aCol); 
        }

        let counter = 0;
        for(let iterRows = 0; iterRows < 9; iterRows++) {
            for(let iterCols = 0; iterCols < 9; iterCols++) {
                let aCell = <Cell value={this.state.initialGame[counter++]} board={this} rowIndex={(iterRows)} colIndex={(iterCols)} />;
                this.rows[iterRows].push(aCell);
                this.cols[iterCols].push(aCell);
            }   
        }
    }

    cellClicked(cell, cellRowIndex, cellColIndex) {
        console.log("Cell clicked, yay!");

        if (this.state.selectedCell != null) this.state.selectedCell.selected(false);
        cell.selected(true);
        this.state.selectedCell = cell;

        console.log(cell);

        // we want to highlight all cells in the same
        // column / row / box as the selected cell
        for(let iterRowCells = 0; iterRowCells < 9; iterRowCells++) {
            if (iterRowCells != cellColIndex) { //we do not want to higlight the cell itself as 'related'
                console.log(this.rows[cellRowIndex][iterRowCells]);
                //this.rows[cellRowIndex][iterRowCells].selected(true);
            }
        }    

    }

    render() {
        let rowlist = this.rows.map((d, i) => {
            return <tr id={'row'+i}>{d}</tr>;
        });

        return (
            <table className="board">
                <tbody>{rowlist}</tbody>
            </table>
        );
    }
}