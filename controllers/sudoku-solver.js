class Node {
  constructor(data){
    this.data = data;
    this.next = null;
    this.previous = null;
  }
}

class LinkedList {
  constructor(head=null){
    this.head = head;
  }
}

/**
 * Note: 
 * puzzleString parameter is passed as a string while solve() uses a string [].
 * Using string [] variable for modification as strings are immutable, so modifying them would create copies each time.
 * Therefore, placement checking functions need to handle string as well as string[].
 * As long as they use string or string [] parameter as read-only, accessing elements in either is the same, and there should be no issue.
 * 
 */
class SudokuSolver {
  /**
   * Prints puzzle to console in readable sudoku-like format
   * @param {string | string []} puzzle 
   */
  printPuzzle(puzzle){
    let msg = [];
    for(let i = 0; i<puzzle.length; i++){
      if(i !== 0 && i%9 === 0){
        msg.push('\n');
      }
      msg.push(puzzle[i]);
    }

    console.log('  ' + msg.join('  '));
  }

  getIndex(row, column){
    return ((row-1) * 9) + (column-1);
  }

  getRow(index){
    return Math.floor(index/9) + 1;
  }

  getColumn(index){
    return index%9 + 1;
  }

  /**
   * Validate all placements in puzzle before submitting solution
   * @param {string []} puzzle 
   */
  allValid(puzzle) {
    console.log("TESTING ALL VALID...");
    let valid = true;
    
    /*
    return puzzle.every((value, i, puzzle) => {
      return this.isValidPlacement(puzzle, i, value);
    })
    */

    for(let i = 0; i < puzzle.length; i++){
      if( !this.isValidPlacement(puzzle, i, puzzle[i]) ){
        console.log(`${puzzle[i]} IS NOT VALID AT ${i}`);
        valid = false;
      }
    }
    return valid;
  }

  /**
   * Wrapper to check for all validity regarding row, column, region placement
   * 
   * @param {string | string[]} puzzle 
   * @param {number} currIndex 
   * @param {string} value 
   * @returns 
   */
  isValidPlacement(puzzle, currIndex, value){
    let isRowPlacementValid = this.isRowPlacementValid(puzzle, null, null, currIndex, value);
    let isColumnPlacementValid = this.isColumnPlacementValid(puzzle, null, null, currIndex, value);
    let isRegionPlacementValid = this.isRegionPlacementValid(puzzle, null, null, currIndex, value);

    return isRowPlacementValid && isColumnPlacementValid && isRegionPlacementValid;
  }

  /**
   * Validates value in specified row. Checks for duplicate value.
   * 
   * @param {string | string[]} puzzleString 
   * @param {string} row 
   * @param {string} column - not used, but signifier for overloading
   * @param {number} valueIndex
   * @param {string} value 
   * 
   * @returns {Boolean}
   */
  isRowPlacementValid(puzzleString, row, column, valueIndex, value) {
    if(valueIndex === null) valueIndex = this.getIndex(row, column);
    if(row === null) row = this.getRow(valueIndex);
    if(column === null) column = this.getColumn(valueIndex);

    let startingRowIndex = (row-1) * 9;

    for(let i = 0; i < 9; i++){
      let currIndex = startingRowIndex + i;

      //skip over index where value is placed for check
      if(currIndex !== valueIndex){
        if(puzzleString[currIndex] == value){
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Validates value in specified column
   * 
   * @param {string | string[]} puzzleString 
   * @param {string} row 
   * @param {string} column 
   * @param {string} valueIndex
   * @param {string} value 
   * 
   * @returns {Boolean}
   */
  isColumnPlacementValid(puzzleString, row, column, valueIndex, value) {
    if(valueIndex  === null) valueIndex = this.getIndex(row, column);
    if(row  === null) row = this.getRow(valueIndex);
    if(column  === null) column = this.getColumn(valueIndex);

    let startingColIndex = column - 1;
    //console.log(`starting column index: ${startingColIndex}`);

    for(let i = 0; i < 9; i++){
      let currIndex = startingColIndex + (i * 9);
      
      //skip over index where value is placed for check
      if(currIndex !== valueIndex){
        //check for duplicate
        if(puzzleString[currIndex] == value){
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Validates value in region that contains row and column parameters
   * 
   * Region is (R,C) starting at 1, like row or column
   * 
   * @param {string | string[]} puzzleString 
   * @param {string} row 
   * @param {string} column 
   * @param {string} valueIndex
   * @param {string} value 
   * 
   * @returns {Boolean}
   */
  isRegionPlacementValid(puzzleString, row, column, valueIndex, value) {
    if(valueIndex === null) valueIndex = this.getIndex(row, column);
    if(row === null) row = this.getRow(valueIndex);
    if(column === null) column = this.getColumn(valueIndex);

    let regionRow = Math.floor((row-1)/3) + 1;
    let regionColumn = Math.floor((column-1)/3) + 1;
    //console.log(`region (R,C): (${regionRow},${regionColumn})`);

    //find top left index of region
    let topLeftIndex = ( (regionRow-1) * 3 * 9 ) + ( (regionColumn-1) * 3 );
    //console.log(`top left index: ${topLeftIndex}`);
    
    //loop through region
    for(let i = 0; i < 9; i++){
      let currIndex = topLeftIndex + i;
      //shift to corresponding rows
      if(i>=3){ currIndex += 6; }
      if(i>=6){ currIndex += 6; }

      //skip over index where value is placed for check
      if(currIndex !== valueIndex){
        //check for duplicate
        if(puzzleString[currIndex] == value){
          return false;
        }
      }

    }
    return true;
  }

  solve(puzzleString) {
    const ALGORITHM = 1;

    let result;

    if(ALGORITHM === 1){
      result = this.backtrackingAlgorithm(puzzleString);
    }

    console.log('FINAL result');
    console.log(result);

    if(result.msg === "Success"){
      if(this.allValid(result.result)){
        console.log("ALL VALID");
        return result.result;
      }else {
        console.log("NOT ALL VALID");
        return result.result;
      }
    }
  }

  backtrackingAlgorithm(puzzleString){
    let initial = puzzleString.split("");
    let fixed = initial.map((char) => {
      return char !== ".";
    });
    console.log(fixed);

    for(let i = 0; i < initial.length; i++){
      //combine fixed values from puzzleString into inital array
      if(fixed[i]){
        initial[i] = puzzleString[i];
      }
      //"." placeholders become 0
      if(initial[i] === "."){
        initial[i] = "0";
      }
    }

    console.log('initial');
    console.log(initial);
    
    return this.backtrackingAlgorithmHelper(initial, fixed);
  }

  /**
   * NOTE: tail recursion not supported in JavaScript, therefore stack limits will be reached
   * 
   * @param {string[]} result - array to be modified with results from puzzle solving algorithm
   * @param {Boolean[]} fixed - array that holds indexes of fixed, initial values in puzzleString 
   * @param {number} currIndex 
   * @param {boolean} backtrack - defines iteration direction. If true, will iterate towards front of array.
   * @returns 
   */
  /*
  backtrackingAlgorithmHelper(result, fixed, currIndex=0, backtrack=false){
    //1. find next non-fixed index or finish
    //continue searching if current value is fixed AND have not reached beginning or end of puzzle
    while(fixed[currIndex] && currIndex < result.length && currIndex > -1){
      backtrack ? currIndex-- : currIndex++;
    }
    backtrack = false;

    
    //ENDING CASE - finished solve
    if(currIndex >= result.length) {
      console.log('FINAL PUZZLE');
      this.printPuzzle(result);
      return {msg: "Success", result: result};
    }
    //ENDING CASE - unsolvable
    if(currIndex < 0) return {msg: "Unsolvable"};


    //clear all non-fixed numbers in result after current position
    for( let i = currIndex+1; i<result.length; i++){
      if(!fixed[i]){
        result[i] = "0";
      }
    }
    //try new value
    result[currIndex] = ( Number(result[currIndex]) + 1 ).toString();
    //keep trying values until valid or all not valid
    while(!this.isValidPlacement(result, currIndex, result[currIndex]) && Number(result[currIndex]) <= 9){
      result[currIndex] = ( Number(result[currIndex]) + 1 ).toString();
    }

    //if valid, recurse forward, (greater than 9 would signify backtracking needed)
    if(Number(result[currIndex]) <= 9) {
      if(currIndex == 0) {
        console.log(`valid ${result[currIndex]} at ${currIndex}`);
        this.printPuzzle(result);
      }
      return this.backtrackingAlgorithmHelper(result, fixed, ++currIndex, false);
    } else {
      // BACKTRACK //
      //console.log(`backtracking from ${currIndex}`);
      return this.backtrackingAlgorithmHelper(result, fixed, --currIndex, true);
    }
  }
  */
  backtrackingAlgorithmHelper(result, fixed, currIndex=0, backtrack=false){
    //Note: while breaks on ENDING CASE returns
    while(true){
      //1. find next non-fixed index or finish iterating
      //continue searching if current value is fixed AND have not reached beginning or end of puzzle
      while(fixed[currIndex] && currIndex < result.length && currIndex > -1){
        backtrack ? currIndex-- : currIndex++;
      }
      backtrack = false;

      //ENDING CASE - finished solve
      if(currIndex >= result.length) {
        console.log('FINAL PUZZLE');
        this.printPuzzle(result);
        return {msg: "Success", result: result};
      }
      //ENDING CASE - unsolvable
      if(currIndex < 0) return {msg: "Unsolvable"};

      //clear all non-fixed numbers in result after current position
      for( let i = currIndex+1; i<result.length; i++){
        if(!fixed[i]){
          result[i] = "0";
        }
      }
      //try new value
      result[currIndex] = ( Number(result[currIndex]) + 1 ).toString();
      //keep trying values until valid or all not valid
      while(!this.isValidPlacement(result, currIndex, result[currIndex]) && Number(result[currIndex]) <= 9){
        result[currIndex] = ( Number(result[currIndex]) + 1 ).toString();
      }

      //if valid, recurse forward, (greater than 9 would signify backtracking needed)
      if(Number(result[currIndex]) <= 9) {
        //console.log(`valid at ${currIndex}`);
        //return this.backtrackingAlgorithmHelper(result, fixed, ++currIndex, false);
        ++currIndex;
        backtrack = false;
      } else {
        // BACKTRACK //
        //console.log(`backtracking from ${currIndex}`);
        //return this.backtrackingAlgorithmHelper(result, fixed, --currIndex, true);
        --currIndex;
        backtrack = true;
      }
    } // end while
  }
}

module.exports = SudokuSolver;

