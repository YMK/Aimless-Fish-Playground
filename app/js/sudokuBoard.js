function Board() {
  var self = this;
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

Board.prototype.correct = function () {
  var row, col, cell, rowNum, colNum, read = [], col3, row3,
    incorrect = {"row": [], "col": [], "square": []};

  // Check rows
  for (rowNum = 0; rowNum < this.board.length; rowNum++) {
    read = [];
    row = this.board[rowNum];
    for (colNum = 0; colNum < row.length; colNum++) {
      cell = row[colNum];
      if (read.indexOf(cell) >= 0 && cell !== 0) {
        incorrect.row.push(rowNum);
      }
      read.push(cell);
    }
  }

  // Check columns
  for (colNum = 0; colNum < this.board.length; colNum++) {
    read = [];
    for (rowNum = 0; rowNum < this.board.length; rowNum++) {
      cell = this.board[rowNum][colNum];
      if (read.indexOf(cell) >= 0 && cell !== 0) {
        incorrect.col.push(colNum);
      }
      read.push(cell);
    }
  }

  // Check squares
  for (row3 = 0; row3 < this.board.length; row3 = row3 + 3) {
    for (col3 = 0; col3 < this.board.length; col3 = col3 + 3) {
      read = [];
      for (rowNum = row3; rowNum < row3 + 3; rowNum++) {
        for (colNum = col3; colNum < col3 + 3; colNum++) {
          cell = this.board[rowNum][colNum];
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

Board.prototype.generate = function (numberToRemove) {
  var numbers = [], row, column,
    found = false, difficulty = 10;

  for (column = 0; column < 9; column++) {
    for (row = 0; row < 9; row++) {
      this.board[column][row] = 0;
      numbers[row + column * 9] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    }
  }

  for (column = 0; column < 9; column++) {
    for (row = 0; row < 9; row++) {
      found = false;
      while (numbers[row + column * 9].length > 0 && !found) {
        var rnd = Math.floor(Math.random() * numbers[row + column * 9].length);
        var num = numbers[row + column * 9].splice(rnd, 1);
        this.board[column][row] = num[0];
        if (this.correct() === true) {
          found = true;
        } else {
          this.board[column][row] = 0;
          found = false;
        }
      }

      if (!found) {
        this.generate(numberToRemove);
        return;
      }
    }
  }


  for (row = 0; row < 9; row++) {
    this.correctBoard[row] = this.board[row].slice(0);
  }

  for (difficulty = numberToRemove; difficulty > 0; difficulty--) {
    var rndRow, rndCol;

    rndRow = Math.floor(Math.random() * 9);
    rndCol = Math.floor(Math.random() * 9);
    if (this.board[rndCol][rndRow] === 0) {
      difficulty++;
    }
    this.board[rndCol][rndRow] = 0;
  }

  for (row = 0; row < 9; row++) {
    this.originalBoard[row] = this.board[row].slice(0);
  }
};

Board.prototype.undo = function () {
  var array = [], i, temp = this.cache.pop(), redo = [];

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
  var row;
  for (row = 0; row < 9; row++) {
    this.board[row] = this.correctBoard[row].slice(0);
  }
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


function firefoxFix() {

  if (/firefox/.test(window.navigator.userAgent.toLowerCase())) {
    var tds = document.getElementsByTagName('td'),
      style = '<style>'
        + 'td { padding: 0 !important; }'
        + 'td:hover::before, td:hover::after { background-color: transparent !important; }'
        + '</style>',
      index;

    for (index = 0; index < tds.length; index++) {
      tds[index].innerHTML = '<div class="ff-fix">' + tds[index].innerHTML + '</div>';
    }

    document.head.insertAdjacentHTML('beforeEnd', style);
  }

}