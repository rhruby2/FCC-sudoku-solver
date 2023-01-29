const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');

const puzzlesAndSolutions = require('../controllers/puzzle-strings.js');

suite('Unit Tests', () => {
    let solver = new Solver();

    suite('Input Puzzle String', () => {
        test('Logic handles a valid puzzle string of 81 characters', () => {
            let validPuzzleString = puzzlesAndSolutions[0][0];

            //if error is thrown from validate(), test will fail;
            assert.isTrue(solver.validate(validPuzzleString), "validate() should return true");
        })
        //validate() should throw Error
        test('Logic handles a puzzle string with invalid characters (not 1-9 or .)',() => {
            let invalidPuzzleString = "Z" + puzzlesAndSolutions[0][0].slice(1);

            try{
                solver.validate(invalidPuzzleString)
            } catch(e){
                //successfully threw error as expected
                return true;
            }

            assert.fail("validate() should throw Error");
        })
        //validate() should throw Error
        test('Logic handes a puzzle string that is not 81 characters in length',() => {
            let invalidPuzzleString = puzzlesAndSolutions[0][0].slice(1);

            try{
                solver.validate(invalidPuzzleString)
            } catch(e){
                //successfully threw error as expected
                return true;
            }

            assert.fail("validate() should throw Error");
        })
    })
    
     //(puzzleString, row, column, valueIndex, value)
     //returns: True | False
    suite('Character Placement',() => {
        let validPuzzleString = puzzlesAndSolutions[0][0];

        test('Logic handles a valid row placement',() => {
            //3 is valid for first puzzle string at A2 (=index 1);
            assert.isTrue(solver.isRowPlacementValid(validPuzzleString,null,null,1, 3),"Row placement should be valid");
        })
        test('Logic handles an invalid row placement',() => {
            //4 is an invalid row placement for first puzzle string at A2 (=index 1);
            assert.isFalse(solver.isRowPlacementValid(validPuzzleString,null,null,1, 4),"Row placement should be invalid");
            
        })
        test('Logic handles a valid column placement',() => {
            //3 is valid for first puzzle string at A2 (=index 1);
            assert.isTrue(solver.isColumnPlacementValid(validPuzzleString,null,null,1, 3),"Column placement should be valid");
        })
        test('Logic handles an invalid column placement',() => {
            //9 is an invalid column placement for first puzzle string at A2 (=index 1);
            assert.isFalse(solver.isColumnPlacementValid(validPuzzleString,null,null,1, 9),"Column placement should be invalid");
        })
        test('Logic handles a valid region (3x3 grid) placement',() => {
            //3 is valid for first puzzle string at A2 (=index 1);
            assert.isTrue(solver.isRegionPlacementValid(validPuzzleString,null,null,1, 3),"Region placement should be valid");
        })
        test('Logic handles an invalid region (3x3 grid) placement',() => {
            //2 is an invalid region placement for first puzzle string at A2 (=index 1);
            assert.isFalse(solver.isColumnPlacementValid(validPuzzleString,null,null,1, 9),"Region placement should be invalid");
        })
    })
    suite('Resulting Puzzle Strings', () => {
        test('Valid puzzle strings pass the Solver',() => {
            let validSolution = puzzlesAndSolutions[0][1];
            assert.isTrue(solver.allValid(validSolution),"allValid() should return true");
        })
        test('Invalid puzzle strings fail the Solver',() => {
            //invalidSolution[1] is "3" so a "3" at [0] should result in invalid placement
            let invalidSolution = "3" + puzzlesAndSolutions[0][1].slice(1);
            assert.isFalse(solver.allValid(invalidSolution),"allValid() should return false");
        })
        test('Solver returns the expected solution for an incomplete puzzle',() => {
            let inputPuzzle = puzzlesAndSolutions[0][0];
            let correctSolution = puzzlesAndSolutions[0][1];

            let result = solver.solve(inputPuzzle).join('');

            assert.equal(result, correctSolution, "algorithmic solution should match posted solution");       
        })
    })
});