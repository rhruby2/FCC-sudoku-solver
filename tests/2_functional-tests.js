const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
    suite('POST request to /api/solve', () => {
        test('Solve a puzzle with valid puzzle string', () => {
            assert.fail('test not completed')
        })
        test('Solve a puzzle with missing puzzle string', () => {
            assert.fail('test not completed')
        })
        test('Solve a puzzle with invalid characters', () => {
            assert.fail('test not completed')
        })
        test('Solve a puzzle with incorrect length', () => {
            assert.fail('test not completed')
        })
        test('Solve a puzzle that cannot be solved', () => {
            assert.fail('test not completed')
        })
    })
    suite('POST request to /api/check', () => {
        test('Check a puzzle placement with all fields', () => {
            assert.fail('test not completed')
        })
        test('Check a puzzle placement with single placement conflict', () => {
            assert.fail('test not completed')
        })
        test('Check a puzzle placement with multiple placement conflicts', () => {
            assert.fail('test not completed')
        })
        test('Check a puzzle placement with all placement conflicts', () => {
            assert.fail('test not completed')
        })
        test('Check a puzzle placement with missing required fields', () => {
            assert.fail('test not completed')
        })
        test('Check a puzzle placement with invalid characters', () => {
            assert.fail('test not completed')
        })
        test('Check a puzzle placement with incorrect length', () => {
            assert.fail('test not completed')
        })
        test('Check a puzzle placement with invalid placement coordinate', () => {
            assert.fail('test not completed')
        })
        test('Check a puzzle placement with invalid placement value', () => {
            assert.fail('test not completed')
        })
    })
});

