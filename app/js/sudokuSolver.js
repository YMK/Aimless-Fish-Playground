/*jslint plusplus: true, indent: 2, maxerr: 500 */
/*global setTimeout, importScripts, require, sudoku_solver, addEventListener, postMessage */

importScripts("../lib/requirejs/require.js");

require(
  {baseUrl: "./"},
  ["require", "../lib/kudoku", "sudokuUtils"],
  function (require, kudoku, sudoku) {
    "use strict";
    var self = this || {};
    self.solver = sudoku_solver();
    self.utils = sudoku.utils;

    self.correct = function (board) {
      return self.utils.correct(board);
    };

    self.fillRestOfBoard = function (board) {
      var solstr, solarr, row, column,
        array = [],
        tempBoard = [];

      for (row = 0; row < 9; row++) {
        array = array.concat(board[row].slice(0));
      }

      array = array.toString().replace(/,/g, "").replace(/0/g, ".");
      solarr = self.solver(array, 1);

      for (row = 0; row < 9; row++) {
        for (column = 0; column < 9; column++) {
          board[row][column] = solarr[0][row * 9 + column];
        }
      }

      return board;
    };

    self.numberOfSolutionsMaxTwo = function (board) {
      var solstr, solarr, row, column,
        array = [],
        tempBoard = [];

      for (row = 0; row < 9; row++) {
        array = array.concat(board[row].slice(0));
      }

      array = array.toString().replace(/,/g, "").replace(/0/g, ".");
      solarr = self.solver(array, 2);

      return solarr.length;
    };

    self.digHoles = function (board, number, x, y, mult) {
      var nextmult, oldVal = board[x][y],
        nexty = y,
        nextx = x,
        nextnum = number - 1;

      nexty = mult ? nexty - 1 : nexty + 1;

      if (number < 1) {
        return true;
      }

      if (nexty > 8) {
        nexty = mult ? 8 : 0;
        nextmult = !mult;
        nextx++;
        if (nextx > 8) {
          return true;
        }
      }

      board[x][y] = 0;
      if (self.numberOfSolutionsMaxTwo(board) !== 1) {
        board[x][y] = oldVal;
        return false;
      }
      while (self.digHoles(board, nextnum, nextx, nexty, mult) === false) {
        nexty++;
        if (nexty > 8) {
          nexty = 0;
          nextx++;
          if (nextx > 8) {
            return true;
          }
        }
      }
      return true;
    };

    self.generate = function (numberToRemove) {
      var row, col, cell,
        correctBoard = [],
        board = [[], [], [], [], [], [], [], [], []],
        difficulty = 10;

      for (row = 0; row < 9; row++) {
        for (col = 0; col < 9; col++) {
          board[row][col] = 0;
        }
      }

      for (cell = 0; cell < 12; cell++) {
        row = Math.floor((Math.random() * 9));
        col = Math.floor((Math.random() * 9));
        board[row][col] = Math.floor((Math.random() * 9) + 1);
        if (!self.correct(board) || self.numberOfSolutionsMaxTwo(board) < 1) {
          board[row][col] = 0;
          cell--;
        }
      }
      self.fillRestOfBoard(board);

      for (row = 0; row < 9; row++) {
        correctBoard[row] = board[row].slice(0);
      }

      self.digHoles(board, 81, 0, 0, false);

      return {"board": board, "correctBoard": correctBoard};
    };

    self.generatePencils = function (board) {
      var pencils = [
        [[0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0]],
        [[0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0]],
        [[0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0]],
        [[0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0]],
        [[0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0]],
        [[0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0]],
        [[0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0]],
        [[0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0]],
        [[0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0],  
         [0, 0, 0, 0, 0, 0, 0, 0, 0]],
      ];
      
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
                pencils[i][j][possibilities[a]] = 1;
              }
            }
          }
        }
      }

      return pencils;
    };

    addEventListener("message", function (event) {
      var board, pencils;
      switch (event.data.command) {
      case "generate":
        board = self.generate(10);
        postMessage(board);
        break;
      case "possibilities":
        pencils = self.generatePencils(event.data.board);
        postMessage(pencils);
        break;
      case "correct":
        postMessage(self.correct(event.data.board));
        break;
      case "solve":
        postMessage(self.fillRestOfBoard(event.data.board));
        break;
      }
    });

    postMessage("Ready");
  }
);
