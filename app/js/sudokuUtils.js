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
      
      compare: function (board, original) {
        var incorrect = [];

        for (var i = 0; i < 9; i++) {
          incorrect[i] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        }
        
        for (var col = 0; col < 9; col++) {
          for (var row = 0; row < 9; row++){
            if (board[col][row] !== 0 && original[col][row] !== 0 && board[col][row] !== original[col][row]) {
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
          var x, y, i, j, lastrating = rating, simple = true;
          
          // Check for each cell, and pass it through to remove singles (which sets the cell if there is only 1 pencil)
          while (simple) {
            var simplerating = rating;
            for (x = 0; x < 9; x++) {
              for (y = 0; y < 9; y++) {
                rating = rating + this.removeSingles(board, pencils, x, y);
              }
            }
            if (simplerating === rating) {
              simple = false;
            }
          }
          
          // Send each row to hidden singles
          for (x = 0; x < 9; x++) {
            var rowSingles = this.hiddenSingle(pencils[x]);
            for (var l = 0; l < rowSingles.length; l++) {
              pencils[x][rowSingles[l].index] = [rowSingles[l].number];
              rating = rating + (this.removeSingles(board, pencils, x, rowSingles[l].index) * 1.5);
            }
          }
          
          // Send each column to hidden singles
          for (y = 0; y < 9; y++) {
            var colSingles, columns = [];
            
            for (x = 0; x < 9; x++) {
              columns.push(board[x][y]);
            }
            
            colSingles = this.hiddenSingle(columns);
            for (var m = 0; m < colSingles.length; m++) {
              pencils[colSingles[m].index][y] = [colSingles[m].number];
              rating = rating + (this.removeSingles(board, pencils, colSingles[m].index, y) * 1.5);
            }
          }          
          
          // Send each box to hidden singles
          for (i = 0; i < 9; i = i + 3) {
            for (j = 0; j < 9; j = j + 3) {
              var boxSingles, box = [];
              
              for (x = i; x < i + 3; x++) {
                for (y = j; y < j + 3; y++) {
                  box.push(pencils[x][y]);
                }
              }
              
              boxSingles = this.hiddenSingle(box);
              for (var n = 0; n < boxSingles.length; n++) {
                var index = boxSingles[n].index;
                pencils[Math.floor(index/3)+i][(index%3)+j] = [boxSingles[n].number];
                rating = rating + (this.removeSingles(board, pencils, Math.floor(index/3)+i, (index%3)+j) * 1.5);
              } 
            }
          }
          
          // Send each row to naked pairs
          for (x = 0; x < 9; x++) {
            var row = pencils[x], rowPairs = this.nakedPair(row);
            for (var o = 0; o < rowPairs.members.length; o++) {
              for (var p = 0; p < pencils[x].length; p++) {
                if (rowPairs.not.indexOf(p) === -1) {
                  var rpindex = pencils[x][p].indexOf(rowPairs.members[o]);
                  if (rpindex > -1) {
                    pencils[x][p].splice(rpindex, 1);
                    rating = rating + (this.removeSingles(board, pencils, x, p) * 1.5);
                  }
                }
              }
            }
          }
          
          // Send each column to naked pairs
          for (y = 0; y < 9; y++) {
            var colPairs, cols = [];
            
            for (x = 0; x < 9; x++) {
              cols.push(pencils[x][y]);
            }
            
            colPairs = this.nakedPair(cols);
            
            for (var q = 0; q < colPairs.members.length; q++) {
              for (var r = 0; r < cols.length; r++) {
                if (colPairs.not.indexOf(r) === -1) {
                  var cpindex = pencils[r][y].indexOf(colPairs.members[q]);
                  if (cpindex > -1) {
                    pencils[r][y].splice(cpindex, 1);
                    rating = rating + (this.removeSingles(board, pencils, r, y) * 1.5);
                  }
                }
              }
            }
          }
          
          // Send each box to naked pairs
          for (i = 0; i < 9; i = i + 3) {
            for (j = 0; j < 9; j = j + 3) {
              var boxPairs, pbox = [];
              
              for (x = i; x < i + 3; x++) {
                for (y = j; y < j + 3; y++) {
                  pbox.push(pencils[x][y]);
                }
              }
              
              boxPairs = this.nakedPair(pbox);
              for (var w = 0; w < boxPairs.members.length; w++) {
                for (var z = 0; z < pbox.length; z++){
                  if (boxPairs.not.indexOf(z) === -1) {
                    var bpindex = pencils[Math.floor(z/3)+i][(z%3)+j].indexOf(boxPairs.members[w]);
                    if (bpindex > -1) {
                      pencils[Math.floor(z/3)+i][(z%3)+j].splice(bpindex, 1);
                      rating = rating + (this.removeSingles(board, pencils, Math.floor(z/3)+i, (z%3)+j) * 1.5);
                    }
                  }
                }
              } 
            }
          }
          
          // Send each row to naked triples
          for (x = 0; x < 9; x++) {
            var trow = pencils[x], rowTriples = this.nakedTriple(trow);
            for (var s = 0; s < rowTriples.members.length; s++) {
              for (var t = 0; t < pencils[x].length; t++) {
                if (rowTriples.not.indexOf(t) === -1) {
                  var rtindex = pencils[x][t].indexOf(rowTriples.members[s]);
                  if (rtindex > -1) {
                    pencils[x][t].splice(rtindex, 1);
                    rating = rating + (this.removeSingles(board, pencils, x, t) * 1.5);
                  }
                }
              }
            }
          }
          
          // Send each column to naked triples
          for (y = 0; y < 9; y++) {
            var colTriples, col = [];
            
            for (x = 0; x < 9; x++) {
              col.push(pencils[x][y]);
            }
            
            colTriples = this.nakedTriple(col);
            
            for (var u = 0; u < colTriples.members.length; u++) {
              for (var v = 0; v < col.length; v++) {
                if (colTriples.not.indexOf(v) === -1) {
                  var ctindex = pencils[v][y].indexOf(colTriples.members[u]);
                  if (ctindex > -1) {
                    pencils[v][y].splice(ctindex, 1);
                    rating = rating + (this.removeSingles(board, pencils, v, y) * 1.5);
                  }
                }
              }
            }
          }
          
          // Send each box to naked triples
          for (i = 0; i < 9; i = i + 3) {
            for (j = 0; j < 9; j = j + 3) {
              var boxTriples, tbox = [];
              
              for (x = i; x < i + 3; x++) {
                for (y = j; y < j + 3; y++) {
                  tbox.push(pencils[x][y]);
                }
              }
              
              boxTriples = this.nakedPair(tbox);
              for (var w1 = 0; w1 < boxTriples.members.length; w1++) {
                for (var z1 = 0; z1 < tbox.length; z1++){
                  if (boxTriples.not.indexOf(z1) === -1) {
                    var btindex = pencils[Math.floor(z1/3)+i][(z1%3)+j].indexOf(boxTriples.members[w1]);
                    if (btindex > -1) {
                      pencils[Math.floor(z1/3)+i][(z1%3)+j].splice(btindex, 1);
                      rating = rating + (this.removeSingles(board, pencils, Math.floor(z1/3)+i, (z1%3)+j) * 1.5);
                    }
                  }
                }
              } 
            }
          }
          
          // Check if board is done. It's only done if nothing is 0
          solved = true;
          for (x = 0; x < 9; x++) {
            for (y = 0; y < 9; y++) {
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
        var rating, defaultNum = 0;
        
        for (var x = 0; x < 9; x++) {
          for (var y = 0; y < 9; y++) {
            if (board[x][y] > 0) {
              defaultNum++;
            }
          }
        }
        
        rating = this.humanSolve(board, true);
        rating = (rating + defaultNum) - 81;
        
        return rating;
      },
    
      hiddenSingle: function (array) {
        var uniques = [];
        for (var i = 0; i < array.length; i++) {
          for (var j = 0; j < array[i].length; j++) {
            var found = false;
            for (var k = (i + 1) % array.length; k !== i; k = (k + 1) % array.length) {
              if (array[k].indexOf(array[i][j]) > -1){
                found = true;
              }
            }
            if (!found) {
              uniques.push({index: i, number: array[i][j]});
            }
          }
        }
        
        return uniques;
      },
      
      nakedPair: function (array) {
        var pairs = {}, pairMembers = {members: [], not: []};
        for (var i = 0; i < array.length; i++) {
          if (array[i].length === 2) {
            if (pairs[array[i]]) {
              pairs[array[i]].push(i);
            } else {
              pairs[array[i]] = [i];
            }
          }
        }
        for (var p in pairs) {
          if (pairs[p].length > 1) {
            var temp = p.split(",");
            for (var j = 0; j < temp.length; j++) {
              pairMembers.members.push(Number(temp[j]));
            }
            for (var k = 0; k < pairs[p].length; k++) {
              pairMembers.not.push(pairs[p][k]);
            }
          }
        }
        return pairMembers;
      },
      
      nakedTriple: function (array) {
        var triples = {}, tripleMembers = {members: [], not: []};
        for (var i = 0; i < array.length; i++) {
          for (var j = i + 1; j < array.length; j++) {
            for (var k = j + 1; k < array.length; k++) {
              if (_.union(array[i], array[j], array[k]).length === 3 && 
                  !_.isEmpty(array[k]) && !_.isEmpty(array[j]) && !_.isEmpty(array[i])) {
                triples[_.union(array[i], array[j], array[k])] = [i, j, k];
              }
            }
          }
        }
        
        for (var p in triples) {
          var temp = p.split(",");
          for (var l = 0; l < temp.length; l++) {
            tripleMembers.members.push(Number(temp[l]));
          }
          for (var m = 0; m < triples[p].length; m++) {
            tripleMembers.not.push(triples[p][m]);
          }
        }
        return tripleMembers;
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