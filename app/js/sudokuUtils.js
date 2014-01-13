/*jslint vars: true, plusplus: true, indent: 2, maxerr: 500 */
/*global define, Worker */

define(['require'], function (require) {
  var sudoku = {};

  sudoku.utils = (function () {
    return {
      correct: function (board) {
        var row, col, cell, rowNum, colNum, read = [], col3, row3,
          incorrect = {"row": [], "col": [], "square": []};

        // Check rows
        for (rowNum = 0; rowNum < board.length; rowNum++) {
          read = [];
          row = board[rowNum];
          for (colNum = 0; colNum < row.length; colNum++) {
            cell = row[colNum];
            if (read.indexOf(cell) >= 0 && cell !== 0) {
              incorrect.row.push(rowNum);
            }
            read.push(cell);
          }
        }

        // Check columns
        for (colNum = 0; colNum < board.length; colNum++) {
          read = [];
          for (rowNum = 0; rowNum < board.length; rowNum++) {
            cell = board[rowNum][colNum];
            if (read.indexOf(cell) >= 0 && cell !== 0) {
              incorrect.col.push(colNum);
            }
            read.push(cell);
          }
        }

        // Check squares
        for (row3 = 0; row3 < board.length; row3 = row3 + 3) {
          for (col3 = 0; col3 < board.length; col3 = col3 + 3) {
            read = [];
            for (rowNum = row3; rowNum < row3 + 3; rowNum++) {
              for (colNum = col3; colNum < col3 + 3; colNum++) {
                cell = board[rowNum][colNum];
                if (read.indexOf(cell) >= 0 && cell !== 0) {
                  incorrect.square.push(colNum);
                }
                read.push(cell);
              }
            }
          }
        }
        if (incorrect.row.length > 0 || incorrect.col.length > 0 || incorrect.square.length > 0) {
          return incorrect;
        }
        return true;
      },
      
      save: function (board) {
        var string = "";
        for (var i = 0; i < board.length; i++) {
          for (var j = 0; j < board.length; j++) {
            if (board[i][j] === 0) {
              string = string + ".";
            } else  {
              string = string + board[i][j];
            }
          }
        }
        return string;
      },
      
      load: function (saved) {
        var board = [[], [], [], [], [], [], [], [], []];
        
        if (saved.length !== 81) {
          return false;
        }
        
        for (var i = 0; i < 9; i++) {
          var temp = [];
          for (var j = 0; j < 9; j++) {
            if (saved.slice((i * 9) + j, (i * 9) + j + 1) === ".") {
              temp.push(0);
            } else {
              temp.push(Number(saved.slice((i * 9) + j, (i * 9) + j + 1)));
            }
          }
          board[i] = temp;
        }
        
        return board;
      },
      
      humanSolve: function (pencils) {
        var solved = false,
            board = [[],[],[],[],[],[],[],[]],
            givenUp = false;
        
        for (var i = 0; i < 9; i++) {
          board[i] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        }
        
        while (!solved && !givenUp) {
          var x, y;
          
          for (x = 0; x < 9; x++) {
            for (y = 0; y < 9; y++) {
              
            }
          }
          
          for (x = 0; x < 9; x++) {
            for (y = 0; y < 9; y++) {
              // Check if board is done
              solved = true;
              if (pencils[x][y].length > 1) {
                solved = false;
              }
            }
          }
        }
        
        if (givenUp) {
          return false;
        }
        
        for (var row = 0; row < 9; row++) {
          for (var col = 0; col < 0; col ++) {
            board[row][col] = pencils[row][col][0];
          }
        }
        
        return board;
      },
    
      hiddenSingle: function (array) {
        
        for (var i = 0; i < 9; i++) {
          for (var j = 0; j < array[i].length; j++) {
            var found = false;
            for (var k = 0; j < 8; k++) {
              if (array[k].indexOf(array[i][j]) > -1){
                found = true;
              }
            }
            if (!found) {
              var temp = array[i][j];
              array[i] = [temp];
            }
          }
        }
      },
      
      nakedPair: function (array) {
        
      },
      
      nakedTriple: function (array) {
        
      },
      
      hiddenPair: function (array) {
        
      },
      
      hiddenTriple: function (array) {
        
      }
    };
  }());

  return sudoku;
});