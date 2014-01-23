/*jslint plusplus: true, indent: 2, maxerr: 500 */
/*global setTimeout, importScripts, require, sudoku_solver, addEventListener, postMessage */

importScripts("../lib/requirejs/require.js");
require.config({
  paths: {
    "angular": "../lib/angular/angular",
    "ngroute": "../lib/angular-route/angular-route",
    "ngtouch": "../lib/angular-touch/angular-touch.min",
    "ngbootstrap": "../lib/angular-bootstrap/ui-bootstrap.min",
    "ngbootstrap-tpls": "../lib/angular-bootstrap/ui-bootstrap-tpls.min",
    "jquery": "../lib/jquery/jquery",
    "bootstrap.modal": "../lib/bootstrap/js/modal",
    "bootstrap.collapse": "../lib/bootstrap/js/collapse",
    "kudoku": "../lib/kudoku",
    "sheetrock": "../lib/jquery-sheetrock/src/jquery.sheetrock",
    "underscore": "../lib/underscore/underscore-min"
  },

  shim: {
    "angular": {
      exports: "angular"
    },
    "ngtouch": ['angular'],
    "ngbootstrap": ['angular'],
    "ngbootstrap-tpls": ['angular'],
    "ngroute": ['angular'],
    "bootstrap.modal": ['jquery'],
    "bootstrap.collapse": ['jquery'],
    "sudokuUtils": {
      exports: "sudoku"
    },
    "underscore": {
      exports: "_"
    }
  }
});

require(
  {baseUrl: "./"},
  ["require", "../lib/kudoku", "sudokuUtils", "sudokuSolver"],
  function (require, kudoku, sudoku, Solver) {
    "use strict";
    var self = this || {};
    self.solver = sudoku_solver();
    self.utils = sudoku.utils;
    self.running = true;

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

    self.rate = function (board, original) {
      var solver = new Solver(board, original);
      return solver.rate(board, original);
    };

    self.humanSolve = function (board, original, messages) {
      var solver = new Solver(board, original);
      return solver.humanSolve({
        board: board,
        correct: original,
        rate: false,
        messageCallback: function (message) {
          messages.push(message);
        }
      });
    };
    
    self.generateLots = function () {
      while (true) {
        postMessage(self.generate(10));
      }
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
      case "humanSolve":
        var messages = [],
            finalBoard = self.humanSolve(event.data.board, event.data.original, messages);
        postMessage({message: "finished", board: finalBoard, messages: messages});
        break;
      case "solve":
        postMessage(self.fillRestOfBoard(event.data.board));
        break;
      case "rate":
        postMessage(self.rate(event.data.board, event.data.original));
        break;
      case "generateLots":
        self.generateLots();
        break;
      }
    });

    postMessage("Ready");
  }
);
