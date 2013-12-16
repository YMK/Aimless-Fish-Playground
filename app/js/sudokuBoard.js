define(['require', 'kudoku'], function (require, Solver) {

  function Board() {
    var self = this,
      row,
      column;

    self.solver = sudoku_solver();
    self.board = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    self.pencilMarks = [[], [], [], [], [], [], [], [], []];
    for (row = 0; row < 9; row++) {
      for (column = 0; column < 9; column++) {
        self.pencilMarks[row][column] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      }
    }
    self.correctBoard = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    self.originalBoard = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    self.cache = [];
    self.futurecache = [];
  }

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
    var val = this.pencilMarks[row][col][num];
    if (val) {
      this.pencilMarks[row][col][num] = 0;
    } else {
      this.pencilMarks[row][col][num] = 1;
    }
  };

  Board.prototype.getPencilMarks = function (row, col) {
    return this.pencilMarks[row][col];
  };

  Board.prototype.getAllPencilMarks = function () {
    return this.pencilMarks;
  };

  Board.prototype.correct = function (board) {
    var row, col, cell, rowNum, colNum, read = [], col3, row3,
      incorrect = {"row": [], "col": [], "square": []};

    if (board === undefined) {
      board = this.board;
    }

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
  };

  Board.prototype.findFirstEmptyCell = function (board) {
    var row, col;
    for (row = 0; row < 9; row++) {
      for (col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          return row * 10 + col;
        }
      }
    }

    return false;
  };

  Board.prototype.fillRestOfBoard = function (board) {
    var solstr, solarr, row, column,
      array = [],
      tempBoard = [];

    for (row = 0; row < 9; row++) {
      array = array.concat(board[row].slice(0));
    }

    array = array.toString().replace(/,/g,"").replace(/0/g, ".");
    solarr = this.solver(array, 1);

    for (row = 0; row < 9; row++) {
      for (column = 0; column < 9; column++) {
        board[row][column] = solarr[0][row * 9 + column];
      }
    }

    return board;
  };

  Board.prototype.numberOfSolutionsMaxTwo = function (board) {
    var solstr, solarr, row, column,
      array = [],
      tempBoard = [];

    for (row = 0; row < 9; row++) {
      array = array.concat(board[row].slice(0));
    }

    array = array.toString().replace(/,/g,"").replace(/0/g, ".");
    solarr = this.solver(array, 2);

    return solarr.length;
  };

  Board.prototype.numberOfSolutions = function (testboard) {
    var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9],
      cell,
      col,
      row,
      count = 0,
      board = [];

    for (row = 0; row < 9; row++) {
      board[row] = testboard[row].slice(0);
    }

    cell = this.findFirstEmptyCell(board);
    if (cell === false) {
      return count;
    }

    col = String(cell).substring(String(cell).length - 1);
    row = (cell - col) / 10;

    while (numbers.length > 0) {
      board[row][col] = numbers.pop();
      if (this.correct(board) === true) {
        if (this.findFirstEmptyCell(board) === false) {
          count++;
        } else {
          count += this.numberOfSolutions(board);
        }
      }
    }
    board[row][col] = 0;
    return count;
  };

  Board.prototype.digHoles = function (board, number, x, y) {
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
    if (this.numberOfSolutionsMaxTwo(board) !== 1) {
      board[x][y] = oldVal;
      return false;
    }
    while (this.digHoles(board, nextnum, nextx, nexty) === false) {
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

  Board.prototype.generate = function (numberToRemove) {
    var row, col, cell, difficulty = 10;

    for (row = 0; row < 9; row++) {
      for (col = 0; col < 9; col++) {
        this.board[row][col] = 0;
      }
    }

    for (cell = 0; cell < 12; cell++) {
      row = Math.floor((Math.random() * 9));
      col = Math.floor((Math.random() * 9));
      this.board[row][col] = Math.floor((Math.random() * 9) + 1);
      if (!this.correct() || this.numberOfSolutionsMaxTwo(this.board) < 1) {
        this.board[row][col] = 0;
        cell--;
      }
    }
    this.fillRestOfBoard(this.board);

    for (row = 0; row < 9; row++) {
      this.correctBoard[row] = this.board[row].slice(0);
    }

    this.digHoles(this.board, 81, 0, 0);

    for (row = 0; row < 9; row++) {
      this.originalBoard[row] = this.board[row].slice(0);
    }


    for (row = 0; row < 9; row++) {
      for (col = 0; col < 9; col++) {
        this.pencilMarks[row][col] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      }
    }


    this.cache = [];
    this.futurecache = [];
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

  Board.prototype.setBoard = function (board) {
    this.board = board;
  };

  Board.prototype.getBoard = function (board) {
    return this.board;
  };

  Board.prototype.solve = function () {
    var tempBoard = [],
      row;

    for (row = 0; row < 9; row++) {
      tempBoard[row] = this.board[row].slice(0);
    }

    if (this.correct() === true) {
      this.fillRestOfBoard(this.board);
      return true;
    }
    return false;
  };

  Board.prototype.reset = function () {
    var row;
    for (row = 0; row < 9; row++) {
      this.board[row] = this.originalBoard[row].slice(0);
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