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
      }
    };
  }());

  return sudoku;
});