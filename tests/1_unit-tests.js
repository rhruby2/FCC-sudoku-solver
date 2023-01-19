const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');

const puzzlesAndSolutions = require('../controllers/puzzle-strings.js');

suite('Unit Tests', () => {
    test('Logic handles a valid puzzle string of 81 characters', () => {
        assert.fail("test not completed");
    })
    test('Logic handles a puzzle string with invalid characters (not 1-9 or .)',() => {
        assert.fail("test not completed");
    })
    test('Logic handes a puzzle string that is not 81 characters in length',() => {
        assert.fail("test not completed");
    })
    test('Logic handles a valid row placement',() => {
        assert.fail("test not completed");
    })
    test('Logic handles an invalid row placement',() => {
        assert.fail("test not completed");
    })
    test('Logic handles a valid column placement',() => {
        assert.fail("test not completed");
    })
    test('Logic handles an invalid column placement',() => {
        assert.fail("test not completed");
    })
    test('Logic handles a valid region (3x3 grid) placement',() => {
        assert.fail("test not completed");
    })
    test('Logic handles an invalid region (3x3 grid) placement',() => {
        assert.fail("test not completed");
    })
    test('Valid puzzle strings pass the solver',() => {
        assert.fail("test not completed");
    })
    test('Invalid puzzle strings fail the solver',() => {
        assert.fail("test not completed");
    })
    test('Solver returns the expected solution for an incomplete puzzle',() => {
        assert.fail("test not completed");
    })
});
