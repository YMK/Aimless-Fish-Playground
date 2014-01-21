/*jslint vars: true, plusplus: true, indent: 2, maxerr: 500 */
/*global define, Worker */

define(['require', 'underscore'], function (require, _) {
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
      
      compare: function (board, original, dontAlwaysGiveArray) {
        var incorrect = [], any = false;

        for (var i = 0; i < 9; i++) {
          incorrect[i] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        }
        
        for (var col = 0; col < 9; col++) {
          for (var row = 0; row < 9; row++){
            if (board[col][row] !== 0 && original[col][row] !== 0 && board[col][row] !== original[col][row]) {
              incorrect[col][row] = 1;
              any = true;
            }
          }
        }
        if (any || !dontAlwaysGiveArray) {
          return incorrect;
        } else {
          return true;
        }
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
      }
    };
  }());

  return sudoku;
});