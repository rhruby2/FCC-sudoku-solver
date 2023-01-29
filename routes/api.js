

'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    /**
     * Checks if value at specified coordinate is valid
     * 
     * @param {string} puzzle - sudoku puzzle string
     * @param {string} coordinate - coordinate in sudoku grid to check for valid value
     * @param {string} value - value to check for validity in sudoku grid
     * @return {
     *  {
     *    valid: Boolean,
     *    conflict: "row"|"column"|"region"
     *  }
     *  | { error: 'Invalid characters in puzzle' } - puzzle string contains values which are not numbers or periods
     *  | { error: 'Expected puzzle to be 81 characters long' }
     *  | { error: 'Required field(s) missing' } - OBJECT submitted to route is missing puzzle, coordinate, or value
     *  | { error: 'Invalid coordinate'} - submitted coordinate is out of bounds
     *  | { error: 'Invalid value' } - if submitted value is not between 1-9 inclusive
     * }
     */
    .post(({body: {puzzle, coordinate, value}}, res) => {
      ////console.log(puzzle, coordinate, value);
      try{
        //check for empty property values in returned req.body object
        if(!value || !coordinate || !puzzle){
          throw Error('Required field(s) missing');
        }
        
        //checks for valid 81 characters in puzzle string
        solver.validate(puzzle);

        //check for out of bounds coordinate
        //  coordinate is missing row or column OR coordinate contains extraneous data
        //  row is not between A-I inclusive
        //  column is not between 1-9 inclusive
        if(coordinate.length !== 2 | /[^a-iA-I]/.test(coordinate[0]) | /[^1-9]/.test(coordinate[1])){
          throw Error('Invalid coordinate');
        }

        //check if value is between 1 and 9 inclusive
        if(/[^1-9]/.test(value)){
          throw Error('Invalid value');
        }

      }catch(e){
        //console.log(`   ERROR: ${e.message}`);
        res.send({error: e.message});
      }

      coordinate = coordinate.toUpperCase();
      let row = coordinate.charCodeAt(0)-65 + 1;
      let column = coordinate[1];

      let conflicts = [];
      if(!solver.isRowPlacementValid(puzzle, row, column, null, value)){
        conflicts.push('row');
      }
      if(!solver.isColumnPlacementValid(puzzle,row,column, null, value)){
        conflicts.push('column');
      }
      if(!solver.isRegionPlacementValid(puzzle,row,column, null, value)){
        conflicts.push('region');
      }

      if(conflicts.length == 0){
        res.send({valid: true});
      } else {
        res.send({valid: false, conflict: conflicts});
      }
      ////console.log(`conflict: ${conflict}`);
    });
    
  app.route('/api/solve')
    /**
     * Attempts to solve a sudoku puzzle from passed puzzle string
     * 
     * @returns {
     *  { solution: String } - puzzle string was valid and able to be solved
     *  | { error: 'Required field missing' } - puzzle string missing from parameters
     *  | { error: 'Invalid characters in puzzle'} - puzzle string contains values which are not numbers or periods
     *  | { error: 'Expected puzzle to be 81 characters long' }
     *  | { error: 'Puzzle cannot be solved' } - if puzzle is invalid or cannot be solved
     * }
     */
    .post(({body:{puzzle}}, res) => {
      ////console.log(puzzle);

      try{
        //checks for valid 81 characters in puzzle string
        solver.validate(puzzle);
      }catch(e){
        //console.log(`   ERROR: ${e.message}`);
        res.send({error: e.message});
      }

      try{
        let result = solver.solve(puzzle);
        if(result){
          res.send({
            solution: result
          });
        }
      } catch(e){
        //console.log(`   ERROR: ${e.message}`);
        res.send({error: e.message});
      }
    });
};
