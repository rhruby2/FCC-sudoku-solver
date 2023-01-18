

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
     *  | { error: 'Invalid characters in puzzle' } - puzzle string contrains values which are not numbers or periods
     *  | { error: 'Expected puzzle to be 81 characters long' }
     *  | { error: 'Required field(s) missing' } - OBJECT submitted to route is missing puzzle, coordinate, or value
     *  | { error: 'Invalid coordinate'} - submitted coordinate is out of bounds
     *  | { error: 'Invalid value' } - if submitted value is not between 1-9 inclusive
     * }
     */
    .post(({body: {puzzle, coordinate, value}}, res) => {
      console.log(puzzle, coordinate, value);

      try{
        //check for empty property values in returned req.body object
        if(!value || !coordinate || !puzzle){
          throw Error('Required field(s) missing');
        }
        //check for exact puzzle length
        if(puzzle.length != 81){
          throw Error('Expected puzzle to be 81 characters long');
        }
        //check for invalid characters in puzzle string (not numbers or periods)
        if(/[^\.\d]/.test(puzzle) ){
          throw Error('Invalid characters in puzzle');
        }
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
        console.log(`   ERROR: ${e.message}`);
        res.send({error: e.message});
      }

      coordinate = coordinate.toUpperCase();
      let row = coordinate.charCodeAt(0)-65 + 1;
      let column = coordinate[1];

      let conflict = [];
      if(!solver.isRowPlacementValid(puzzle, row, column, null, value)){
        conflict.push('row');
      }
      if(!solver.isColumnPlacementValid(puzzle,row,column, null, value)){
        conflict.push('column');
      }
      if(!solver.isRegionPlacementValid(puzzle,row,column, null, value)){
        conflict.push('region');
      }

      if(conflict.length == 0){
        res.send({valid: true});
      } else {
        res.send({valid: false, conflict: conflict.join(', ')});
      }
      console.log(`conflict: ${conflict}`);



    });
    
  app.route('/api/solve')
    .post(({body:{puzzle}}, res) => {
      console.log(puzzle);

      let result = solver.solve(puzzle);
      if(result){
        res.send({
          solution: result
        });
      }
    });
};
