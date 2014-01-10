/*jslint plusplus: true, indent: 2, maxerr: 500 */
/*global define, Worker */

define(['require', 'sudokuUtils'], function (require, sudoku) {
  'use strict';
  function Board() {
    var self = this,
      row,
      column;

    self.utils = sudoku.utils;
    self.board = [];
    self.correctBoard = [];
    self.originalBoard = [];
    self.pencilMarks = [[], [], [], [], [], [], [], [], []];
    for (row = 0; row < 9; row++) {
      self.board[row] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      self.originalBoard[row] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      self.correctBoard[row] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      for (column = 0; column < 9; column++) {
        self.pencilMarks[row][column] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      }
    }
    self.cache = [];
    self.futurecache = [];
  }

  Board.prototype.correct = function () {
    return this.utils.correct(this.board);
  };

  Board.prototype.setCell = function (row, column, number) {
    var array = [], i;
    for (i = this.board.length - 1; i >= 0; i--) {
      array.push(this.board[i].slice(0));
    }
    this.cache.push(array);
    this.board[row][column] = number;
  };

  Board.prototype.getCell = function (row, column) {
    return this.board[row][column];
  };

  Board.prototype.addPencilMark = function (row, col, num) {
    this.pencilMarks[row][col][num] = 1;
  };
  
  Board.prototype.removePencilMark = function (row, col, num) {
    this.pencilMarks[row][col][num] = 0;
  };

  Board.prototype.getPencilMarks = function (row, col) {
    return this.pencilMarks[row][col];
  };

  Board.prototype.getAllPencilMarks = function () {
    return this.pencilMarks;
  };

  Board.prototype.undo = function () {
    var array = [], i, temp = this.cache.pop(), redo = [];

    if (temp === undefined) {
      return;
    }

    for (i = this.board.length - 1; i >= 0; i--) {
      redo.push(this.board[i].slice(0));
    }
    this.futurecache.push(redo);
    for (i = temp.length - 1; i >= 0; i--) {
      array.push(temp[i].slice(0));
    }
    this.board = array;
  };

  Board.prototype.redo = function () {
    var array = [], i, temp = this.futurecache.pop(), undo = [];

    if (temp === undefined) {
      return;
    }

    for (i = this.board.length - 1; i >= 0; i--) {
      undo.push(this.board[i].slice(0));
    }
    this.cache.push(undo);
    for (i = temp.length - 1; i >= 0; i--) {
      array.push(temp[i].slice(0));
    }
    this.board = array;
  };

  Board.prototype.generate = function (difficulty, callback) {
    var col, row,
      self = this;

    if (self.gworker !== undefined) {
      callback(false);
    } else {

      self.gworker = new Worker("js/sudokuSolver.js");
      self.gworker.addEventListener("message", function (e) {
        if (e.data === "Ready") {
          self.gworker.postMessage({"command": "generate"});
          return;
        }
        self.board = e.data.board;
        self.correctBoard = e.data.correctBoard;
        for (row = 0; row < 9; row++) {
          self.originalBoard[row] = self.board[row].slice(0);
        }
        self.gworker.terminate();
        self.gworker = undefined;
        callback(true);
      });

      this.cache = [];
      this.futurecache = [];
      for (row = 0; row < 9; row++) {
        for (col = 0; col < 9; col++) {
          self.pencilMarks[row][col] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        }
      }

    }
  };

  Board.prototype.generatePencilMarks = function (callback) {
    var col, row,
      self = this;

    if (self.gworker !== undefined) {
      callback(false);
    } else {
      self.gworker = new Worker("js/sudokuSolver.js");
      self.gworker.addEventListener("message", function (e) {
        if (e.data === "Ready") {
          self.gworker.postMessage({"command": "possibilities",
                                    "board": self.board});
          return;
        }
        self.pencilMarks = e.data;
        self.gworker.terminate();
        self.gworker = undefined;
        callback(true);
      });
    }
  };

  Board.prototype.setBoard = function (board) {
    this.board = board;
  };

  Board.prototype.getBoard = function (board) {
    return this.board;
  };
  
  Board.prototype.getOrigBoard = function (board) {
    return this.originalBoard;
  };

  Board.prototype.solve = function (callback) {
    var self = this;

    if (self.sworker !== undefined || !self.correct()) {
      return;
    }

    self.sworker = new Worker("js/sudokuSolver.js");
    self.sworker.addEventListener("message", function (e) {
      if (e.data === "Ready") {
        self.sworker.postMessage({"command": "solve", "board": self.board});
        return;
      }
      self.board = e.data;
      self.sworker.terminate();
      self.sworker = undefined;
      callback(true);
    });
  };

  Board.prototype.reset = function () {
    var row, col;
    for (row = 0; row < 9; row++) {
      this.board[row] = this.originalBoard[row].slice(0);
    }
    
    for (row = 0; row < 9; row++) {
      for (col = 0; col < 9; col++) {
        this.pencilMarks[row][col] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      }
    }
  };

  Board.prototype.clear = function () {
    var row, col;
    for (row = 0; row < 9; row++) {
      this.board[row] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    }
    
    for (row = 0; row < 9; row++) {
      this.originalBoard[row] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    }
    
    
    for (row = 0; row < 9; row++) {
      for (col = 0; col < 9; col++) {
        this.pencilMarks[row][col] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      }
    }
  };

  Board.prototype.isComplete = function () {
    var rowNum, colNum, row, cell;

    for (rowNum = 0; rowNum < this.board.length; rowNum++) {
      row = this.board[rowNum];
      for (colNum = 0; colNum < row.length; colNum++) {
        cell = row[colNum];
        if (cell === 0) {
          return false;
        }
      }
    }

    return true;
  };

  return Board;
});