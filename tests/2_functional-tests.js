const chai = require("chai");
const chaiHttp = require('chai-http');
const puzzlesAndSolutions = require("../controllers/puzzle-strings");
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);


suite('Functional Tests', () => {
    suite('POST request to /api/solve', () => {
        test('Solve a puzzle with valid puzzle string', () => {
            chai.request(server)
                .post('/api/solve')
                .send({
                    'puzzle': puzzlesAndSolutions[0][0]
                })
                .end((err,{body:{solution}}) => {
                    assert.equal(solution.join(''), puzzlesAndSolutions[0][1]);
                })
        })
        test('Solve a puzzle with missing puzzle string', () => {
            chai.request(server)
                .post('/api/solve')
                .send({
                    'puzzle': ""
                })
                .end((err,res) => {
                    assert.exists(res.body.error);
                })
        })
        test('Solve a puzzle with invalid characters', () => {
            chai.request(server)
                .post('/api/solve')
                .send({
                    'puzzle': "Z" + puzzlesAndSolutions[0][1].slice(1)
                })
                .end((err,res) => {
                    assert.exists(res.body.error);
                })
        })
        test('Solve a puzzle with incorrect length', () => {
            chai.request(server)
                .post('/api/solve')
                .send({
                    'puzzle': puzzlesAndSolutions[0][1].slice(1)
                })
                .end((err,res) => {
                    assert.exists(res.body.error);
                })
        })
        test('Solve a puzzle that cannot be solved', () => {
            chai.request(server)
                .post('/api/solve')
                .send({
                    'puzzle': "115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37."
                })
                .end((err,res) => {
                    assert.exists(res.body.error);
                })
        })
    })
    suite('POST request to /api/check', () => {
        //all fields correct
        test('Check a puzzle placement with all fields', () => {
            chai.request(server)
                .post('/api/check')
                .send({
                    'puzzle': puzzlesAndSolutions[0][0],
                    'coordinate': 'A2',
                    'value': 3
                })
                .end((err,res) => {
                    assert.exists(res.body.valid);
                    assert.isTrue(res.body.valid, "value should be valid");
                })
        })
        test('Check a puzzle placement with single placement conflict', () => {
            chai.request(server)
                .post('/api/check')
                .send({
                    'puzzle': puzzlesAndSolutions[0][0],
                    'coordinate': 'A2',
                    'value': 8
                })
                .end((err,res) => {
                    //console.log(res.body);
                    assert.exists(res.body.valid);
                    assert.isFalse(res.body.valid, "value should be invalid at row");
                    assert.exists(res.body.conflict);
                    assert.equal(res.body.conflict.length, 1, "value should only have one conflict");
                })
        })
        test('Check a puzzle placement with multiple placement conflicts', () => {
            chai.request(server)
                .post('/api/check')
                .send({
                    'puzzle': puzzlesAndSolutions[0][0],
                    'coordinate': 'A2',
                    'value': 1
                })
                .end((err,res) => {
                    assert.exists(res.body.valid);
                    assert.isFalse(res.body.valid, "value should be invalid at row");
                    assert.exists(res.body.conflict);
                    assert.equal(res.body.conflict.length, 2, "value should only have two conflicts");
                })
        })
        test('Check a puzzle placement with all placement conflicts', () => {
            chai.request(server)
                .post('/api/check')
                .send({
                    'puzzle': puzzlesAndSolutions[0][0],
                    'coordinate': 'A2',
                    'value': 2
                })
                .end((err,res) => {
                    assert.exists(res.body.valid);
                    assert.isFalse(res.body.valid, "value should be invalid at row");
                    assert.exists(res.body.conflict);
                    assert.equal(res.body.conflict.length, 3, "value should only have all three conflicts");
                })
        })
        test('Check a puzzle placement with missing required fields', () => {
            chai.request(server)
                .post('/api/check')
                .send({
                    'puzzle': puzzlesAndSolutions[0][0],
                    'coordinate': 'A2'
                })
                .end((err,res) => {
                    assert.exists(res.body.error, "should return error property because of missing value field");
                })
        })
        test('Check a puzzle placement with invalid characters', () => {
            chai.request(server)
                .post('/api/check')
                .send({
                    'puzzle': "Z" + puzzlesAndSolutions[0][0].slice(1),
                    'coordinate': 'A2',
                    'value': "2"
                })
                .end((err,res) => {
                    assert.exists(res.body.error, "should return error property because of invalid puzzle character");
                })
        })
        test('Check a puzzle placement with incorrect length', () => {
            chai.request(server)
                .post('/api/check')
                .send({
                    'puzzle': puzzlesAndSolutions[0][0].slice(1),
                    'coordinate': 'A2',
                    'value': "3"
                })
                .end((err,res) => {
                    assert.exists(res.body.error, "should return error property because of invalid puzzle length");
                })
        })
        test('Check a puzzle placement with invalid placement coordinate', () => {
            chai.request(server)
                .post('/api/check')
                .send({
                    'puzzle': puzzlesAndSolutions[0][0],
                    'coordinate': 'Z2',
                    'value': "3"
                })
                .end((err,res) => {
                    assert.exists(res.body.error, "should return error property because of invalid coordinate");
                })
        })
        test('Check a puzzle placement with invalid placement value', () => {
            chai.request(server)
                .post('/api/check')
                .send({
                    'puzzle': puzzlesAndSolutions[0][0],
                    'coordinate': 'A2',
                    'value': "Z"
                })
                .end((err,res) => {
                    assert.exists(res.body.error, "should return error property because of invalid value");
                })
        })
    })
});

