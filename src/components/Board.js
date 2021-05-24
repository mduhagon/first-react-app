import React from 'react';
import Cell from './Cell';

export default class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            initialGame: "017030590000000403000006070120009050000402000060700021030600000901000000054020310", // we don't want to hardcode this here forever
            selectedCell: null
        };

        this.rawRows = []; // This will hold the actual <Cell ../> definitions to render
        this.rows = []; // The board has 9 rows, with 9 Cells each (here we use a ref to the Cell)
        this.cols = []; // The board has 9 columns, with 9 Cells each (here we use a ref to the Cell)
        this.boxes = {}; // these will be each of the 9 3x3 subgrids of the board (here we use a ref to the Cell)

        // Initialize Raw Rows
        for(let iterRows = 0; iterRows < 9; iterRows++) {
            let aRow = [];
            this.rawRows.push(aRow); 
        }

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
                let cellRef = React.createRef();
                let aCell = <Cell ref={cellRef} value={this.state.initialGame[counter++]} board={this} rowIndex={(iterRows)} colIndex={(iterCols)} />;
                this.rows[iterRows].push(cellRef);
                this.cols[iterCols].push(cellRef);

                this.rawRows[iterRows].push(aCell);
            }   
        }

        // Initialize the 'boxes'
        // they will be in a dictionary with keys like this:
        // box_0_0 / box_0_1 / box_0_2 / box_1_0 / .... / box_2_2
        // the elements on the box are 'flattened' into an array
        // (we do not maintain rows/cols in it)
        for(let iterRows = 0; iterRows < 3; iterRows++) {
            for(let iterCols = 0; iterCols < 3; iterCols++) {
                let boxKey = 'box_' + iterRows + '_' + iterCols;
                this.boxes[boxKey] = this.getBoxSubArray(iterRows, iterCols);
            }
        }        
    }

    getBoxSubArray(boxRow, boxCol) {
        let subArray = [];

        let rowStart = boxRow * 3;
        let colStart = boxCol * 3;
        let rowEnd = rowStart + 3;
        let colEnd = colStart + 3;

        for(let iterRows = rowStart; iterRows < rowEnd; iterRows++) {
            for(let iterCols = colStart; iterCols < colEnd; iterCols++) {
                subArray.push(this.rows[iterRows][iterCols]);
            }    
        }    

        return subArray;
    }

    cellClicked(cell, cellRowIndex, cellColIndex) {
        console.log("Cell clicked, yay!");

        this.clearCellHighlights();

        cell.selected(true);
        this.state.selectedCell = cell;

        console.log(cell);
        
        // we want to highlight all cells in the same
        // column / row / box as the selected cell

        // highlight row
        for(let iterRowCells = 0; iterRowCells < 9; iterRowCells++) {
            this.rows[cellRowIndex][iterRowCells].current.related(true);
        }
        
        // highlight col
        for(let iterColCells = 0; iterColCells < 9; iterColCells++) {
            this.cols[cellColIndex][iterColCells].current.related(true);
        }

        // highlight box
        let boxIndex = this.getBoxIndex(cellRowIndex, cellColIndex);
        console.log("Box index: ", boxIndex);
        let boxArray = this.boxes[boxIndex];
        for (let index = 0; index < boxArray.length; index++) {
            boxArray[index].current.related(true);
        }

        // If the selected cell is not empty, we also want to highlight the
        // same number across the board (all 1s, or all 2s, etc)
        if (cell.state.value != 0) {
            let toHighlight = cell.state.value;
            for(let iterRowCells = 0; iterRowCells < 9; iterRowCells++) {
                for(let iterColCells = 0; iterColCells < 9; iterColCells++) {
                    if (this.rows[iterRowCells][iterColCells].current.state.value == toHighlight) {
                        this.rows[iterRowCells][iterColCells].current.selected(true);
                    }
                }
            }        
        }
    }

    clearCellHighlights() {
        for(let iterRowCells = 0; iterRowCells < 9; iterRowCells++) {
            for(let iterColCells = 0; iterColCells < 9; iterColCells++) {
                this.rows[iterRowCells][iterColCells].current.selected(false);
                this.rows[iterRowCells][iterColCells].current.related(false);
            }    
        }    
    }

    // given a cell, retuns which box it belongs to,    
    // the boxIndex can be used as an index / key for this.boxes
    getBoxIndex(cellRowIndex, cellColIndex) {
        let rowBoxIdx = (cellRowIndex/3>>0);
        let colBoxIdx = (cellColIndex/3>>0);
        return 'box_' + rowBoxIdx + '_' + colBoxIdx;
    }

    render() {
        let rowlist = this.rawRows.map((d, i) => {
            return <tr key={'row'+i}>{d}</tr>;
        });

        return (
            <table className="board">
                <tbody>{rowlist}</tbody>
            </table>
        );
    }
}