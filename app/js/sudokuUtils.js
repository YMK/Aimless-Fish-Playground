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
      
      compare: function (board, original) {
        var incorrect = [];

        for (var i = 0; i < 9; i++) {
          incorrect[i] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        }
        
        for (var col = 0; col < 9; col++) {
          for (var row = 0; row < 9; row++){
            if (board[col][row] !== 0 && board[col][row] !== original[col][row]) {
              incorrect[col][row] = 1;
            }
          }
        }
        
        return incorrect;
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
      
      generatePencils: function (board) {
        var row, column, pencils = [[], [], [], [], [], [], [], [], []];
        for (row = 0; row < 9; row++) {
          for (column = 0; column < 9; column++) {
            pencils[row][column] = [];
          }
        }
        
        for (var i = 0; i < 9; i++) {
          for (var j = 0; j < 9; j++){
            var cell = board[i][j];
            if (cell === 0) {
              var possibilities = [1, 2, 3, 4, 5, 6, 7, 8, 9],
                  not = [];
              for (var k = (j + 1) % 9; k !== j; k = (k + 1) % 9) {
                if (board[i][k] > 0){
                  not.push(board[i][k]);
                }
              }
              for (k = (i + 1) % 9; k !== i; k = (k + 1) % 9) {
                if (board[k][j] > 0){
                  not.push(board[k][j]);
                }
              }
              var x = 0, y = 0;
              if (i > 5) {
                x = 6;
              } else if (i > 2) {
                x = 3;
              }
              if (j > 5) {
                y = 6;
              } else if (j > 2) {
                y = 3;
              }
              for (k = (((i + 1) % 3) + x); k !== i; k = ((k + 1) % 3) + x) {
                for (var l = (((j + 1) % 3) + y); l !== j; l = ((l + 1) % 3) + y) {
                  if (board[k][l] > 0){
                    not.push(board[k][l]);
                  }
                }
              }            
              
              for (var a = 0; a < possibilities.length; a++) {
                if (not.indexOf(possibilities[a]) === -1) {
                  pencils[i][j].push(possibilities[a]);
                }
              }
            }
          }
        }
        
        return pencils;
      },
      
      humanSolve: function (board, rate) {
        var solved = false,
            givenUp = false,
            rating = 0,
            pencils = sudoku.utils.generatePencils(board);
        
        while (!solved && !givenUp) {
          var x, y, lastrating = rating;
          
          // Check for each cell, and pass it through to remove singles (which sets the cell if there is only 1 pencil)
          for (x = 0; x < 9; x++) {
            for (y = 0; y < 9; y++) {
              rating = rating + this.removeSingles(board, pencils, x, y);
            }
          }
          
          // Check if board is done. It's only done if nothing is 0
          for (x = 0; x < 9; x++) {
            for (y = 0; y < 9; y++) {
              solved = true;
              if (board[x][y] === 0) {
                solved = false;
              }
            }
          }
          
          // If we haven't done anything this time around, then we won't ever solve it. Give up,
          if (rating === lastrating) {
            givenUp = true;
          }
        }
        
        // Return the final rating or board, depending on what is requested
        if (rate) {
          return rating;
        } else {
          return board;
        }
      },
      
      rate: function (board) {
        return this.humanSolve(board, true);
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
        
      },
      
      removeSingles: function (board, pencils, x, y) {
        var index, x2, y2, rating = 0;
        if (board[x][y] === 0 && pencils[x][y].length === 1) {
          board[x][y] = pencils[x][y][0];
          rating++;
          
          for (x2 = (x + 1) % 9; x2 !== x; x2 = (x2 + 1) % 9) {
            index = pencils[x2][y].indexOf(pencils[x][y][0]);
            if (index > -1){
              pencils[x2][y].splice(index, 1);
              rating = rating + this.removeSingles(board, pencils, x2, y);
            }
          }
          
          for (y2 = (y + 1) % 9; y2 !== y; y2 = (y2 + 1) % 9) {
            index = pencils[x][y2].indexOf(pencils[x][y][0]);
            if (index > -1){
              pencils[x][y2].splice(index, 1);
              rating = rating + this.removeSingles(board, pencils, x, y2);
            }
          }
          
          var a = 0, b = 0;
          if (x > 5) {
            a = 6;
          } else if (x > 2) {
            a = 3;
          }
          if (y > 5) {
            b = 6;
          } else if (y > 2) {
            b = 3;
          }
          for (x2 = (((x + 1) % 3) + a); x2 !== x; x2 = ((x2 + 1) % 3) + a) {
            for (y2 = (((y + 1) % 3) + b); y2 !== y; y2 = ((y2 + 1) % 3) + b) {
              index = pencils[x2][y2].indexOf(pencils[x][y][0]);
              if (index > -1){
                pencils[x2][y2].splice(index, 1);
                rating = rating + this.removeSingles(board, pencils, x2, y2);
              }
            }
          }  
        }
        
        return rating;
      }
    };
  }());

  return sudoku;
});