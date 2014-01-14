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
      
      if(solarr.length === 0){
        return board;
      }

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

    self.rate = function (board) {
      return self.utils.rate(board);
    };
    
    self.generatePencils = function (board) {
      return this.utils.generatePencils(board);
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
        postMessage(self.utils.humanSolve(event.data.board));
        break;
      case "rate":
        postMessage(self.rate(event.data.board));
        break;
      }
    });

    postMessage("Ready");
  }
);
