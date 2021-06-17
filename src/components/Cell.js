import React from 'react';

export default class Cell extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: props.value,
            isGivenValue: props.value != 0, // we might need to change this if we 'reload' saved games
            isSelected: false,
            isRelated: false,
            isIncorrect: false     
        };

        //these are never going to change so I keep them outside the state
        this.board = props.board;
        this.rowIndex = props.rowIndex;
        this.colIndex = props.colIndex; 

        // This binding is necessary to make `this` work in the callback
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        // we let the board handle a click on the cell
        this.board.cellClicked(this, this.rowIndex, this.colIndex);
    }

    selected(val) {
        this.setState(state => ({
            isSelected: val
        }));
    }

    related(val) {
        this.setState(state => ({
            isRelated: val
        }));
    }

    value(val) {
        this.setState(state => ({
            value: val
        }));
    }
    
    // Empty cells internally are represented with 0,
    // but we do not want to display this to the user.
    getRenderValue = () => {
        return (this.state.value == 0) ? '' : this.state.value;
    }   
    
    getCellId = () => {
        return 'cell' + (this.state.rowIndex+1) + '-' + (this.state.colIndex+1);
    }   

    getClasses = () => {
        let classes = ['cell']; //all cells get the 'cell' class, and maybe additional:

        if (this.state.isGivenValue) classes.push('given');
        if (this.state.isSelected) classes.push('selected');
        if (this.state.isRelated) classes.push('related');
        if (this.state.isIncorrect) classes.push('wrong');
        
        return classes.join(' ');
    }

    render() {
        return (
            <td key={this.getCellId()} id={this.getCellId()} className={this.getClasses()} onClick={this.handleClick}>
               {this.getRenderValue()}
            </td>
        );
    }

}