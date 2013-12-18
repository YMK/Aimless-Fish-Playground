importScripts("../lib/requirejs/require.js");


require(
  {baseUrl: "./"},
  ["require", "../lib/kudoku", "sudokuUtils"],
  function (require, kudoku, sudoku) {
    var self = this;
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

    self.digHoles = function (board, number, x, y) {
      var oldVal = board[x][y],
        nexty = y + 1,
        nextx = x,
        nextnum = number - 1;

      if (number < 1) {
        return true;
      }

      if (nexty > 8) {
        nexty = 0;
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
      while (self.digHoles(board, nextnum, nextx, nexty) === false) {
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

      self.digHoles(board, 81, 0, 0);

      return {"board": board, "correctBoard": correctBoard};
    };

    self.generatePencils = function (board) {
      var pencils = [
        [[0], [0], [0], [0], [0], [0], [0], [0], [0]],
        [[0], [0], [0], [0], [0], [0], [0], [0], [0]],
        [[0], [0], [0], [0], [0], [0], [0], [0], [0]],
        [[0], [0], [0], [0], [0], [0], [0], [0], [0]],
        [[0], [0], [0], [0], [0], [0], [0], [0], [0]],
        [[0], [0], [0], [0], [0], [0], [0], [0], [0]],
        [[0], [0], [0], [0], [0], [0], [0], [0], [0]],
        [[0], [0], [0], [0], [0], [0], [0], [0], [0]],
        [[0], [0], [0], [0], [0], [0], [0], [0], [0]]
      ];

      return pencils;
    };

    addEventListener("message", function (event) {
      switch (event.data.command) {
      case "generate":
        var board = self.generate(10);
        postMessage(board);
        break;
      case "possibilities":
        var pencils = self.generatePencils(10);
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
