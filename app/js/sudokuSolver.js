/*jslint plusplus: true, indent: 2, maxerr: 500 */
/*global define, Worker */

define(['require', 'sudokuUtils', 'underscore'], function (require, sudoku, _) {
  'use strict';
  function Solver(board, correct) {
    var self = this;
    
    self.board = board;
    self.correct = correct;
    self.rating = 0;
  }

  Solver.prototype.humanSolve = function (args) {
    var self = this,
        board = self.board,
        rate = args.rate || false,
        correct = self.correct,
        messageCallback = args.messageCallback || function (arg) {},
        solved = false,
        givenUp = false,
        rating = 0,
        pencils = sudoku.utils.generatePencils(board);
    
    while (!solved && !givenUp) {
      var row, column, i, j, lastrating = rating, simple = true;
      
      // Check for each cell, and pass it through to remove singles (which sets the cell if there is only 1 pencil)
      while (simple) {
        var simplerating = rating;
        for (row = 0; row < 9; row++) {
          for (column = 0; column < 9; column++) {
            rating = rating + self.removeSingles(board, pencils, row, column, messageCallback);
          }
        }
        if (simplerating === rating) {
          simple = false;
        }
      }
      
      // Send each row to hidden singles
      for (row = 0; row < 9; row++) {
        var rowSingles = self.utils.hiddenSingle(pencils[row]);
        for (var l = 0; l < rowSingles.length; l++) {
          if (pencils[row][rowSingles[l].index].length > 1) {
            messageCallback("Cell " + rowSingles[l].index + "," + row + " is the only cell in row " + row + " that can be " + rowSingles[l].number);
            pencils[row][rowSingles[l].index] = [rowSingles[l].number];
            rating = rating + (self.removeSingles(board, pencils, row, rowSingles[l].index, messageCallback) * 1.5);
          }
        }
      }
      
      // Send each column to hidden singles
      for (column = 0; column < 9; column++) {
        var colSingles, columns = [];
        
        for (row = 0; row < 9; row++) {
          columns.push(board[row][column]);
        }
        
        colSingles = self.utils.hiddenSingle(columns);
        for (var m = 0; m < colSingles.length; m++) {
          if (pencils[colSingles[m].index][column].length > 1) {
            messageCallback("Cell " + column + "," + colSingles[m].index + " is the only cell in row " + colSingles[m].index + " that can be " + colSingles[m].number);
            pencils[colSingles[m].index][column] = [colSingles[m].number];
            rating = rating + (self.removeSingles(board, pencils, colSingles[m].index, column, messageCallback) * 1.5);
          }
        }
      }
      
      // Send each box to hidden singles
      for (i = 0; i < 9; i = i + 3) {
        for (j = 0; j < 9; j = j + 3) {
          var boxSingles, box = [];
          
          for (row = i; row < i + 3; row++) {
            for (column = j; column < j + 3; column++) {
              box.push(pencils[row][column]);
            }
          }
          
          boxSingles = self.utils.hiddenSingle(box);
          for (var n = 0; n < boxSingles.length; n++) {
            var index = boxSingles[n].index, xcol = Math.floor(index/3)+i, yrow = (index%3)+j;
            if (pencils[xcol][yrow].length > 1) {
              messageCallback("Cell " + yrow + "," + xcol + " is the only cell in the box that can be " + boxSingles[n].number);
              pencils[Math.floor(index/3)+i][(index%3)+j] = [boxSingles[n].number];
              rating = rating + (self.removeSingles(board, pencils, Math.floor(index/3)+i, (index%3)+j, messageCallback) * 1.5);
            }
          } 
        }
      }
      
      // Send each row to naked pairs
      for (row = 0; row < 9; row++) {
        var nrow = pencils[row], rowPairs = self.utils.nakedPair(nrow);
        for (var o = 0; o < rowPairs.members.length; o++) {
          for (var p = 0; p < pencils[row].length; p++) {
            if (rowPairs.not.indexOf(p) === -1) {
              var rpindex = pencils[row][p].indexOf(rowPairs.members[o]);
              if (rpindex > -1) {
                messageCallback("Remove " + rowPairs.members[o] + " from " + p + "," + row);
                pencils[row][p].splice(rpindex, 1);
                rating = rating + (self.removeSingles(board, pencils, row, p, messageCallback) * 1.5);
              }
            }
          }
        }
      }
      
      // Send each column to naked pairs
      for (column = 0; column < 9; column++) {
        var colPairs, cols = [];
        
        for (row = 0; row < 9; row++) {
          cols.push(pencils[row][column]);
        }
        
        colPairs = self.utils.nakedPair(cols);
        
        for (var q = 0; q < colPairs.members.length; q++) {
          for (var r = 0; r < cols.length; r++) {
            if (colPairs.not.indexOf(r) === -1) {
              var cpindex = pencils[r][column].indexOf(colPairs.members[q]);
              if (cpindex > -1) {
                messageCallback("Remove " + colPairs.members[q] + " from " + column + "," + r);
                pencils[r][column].splice(cpindex, 1);
                rating = rating + (self.removeSingles(board, pencils, r, column, messageCallback) * 1.5);
              }
            }
          }
        }
      }
      
      // Send each box to naked pairs
      for (i = 0; i < 9; i = i + 3) {
        for (j = 0; j < 9; j = j + 3) {
          var boxPairs, pbox = [];
          
          for (row = i; row < i + 3; row++) {
            for (column = j; column < j + 3; column++) {
              pbox.push(pencils[row][column]);
            }
          }
          
          boxPairs = self.utils.nakedPair(pbox);
          for (var w = 0; w < boxPairs.members.length; w++) {
            for (var z = 0; z < pbox.length; z++){
              if (boxPairs.not.indexOf(z) === -1) {
                var bpindex = pencils[Math.floor(z/3)+i][(z%3)+j].indexOf(boxPairs.members[w]);
                if (bpindex > -1) {
                  messageCallback("Remove " + boxPairs.members[w] + " from " + (z%3)+j + "," + Math.floor(z/3)+i);
                  pencils[Math.floor(z/3)+i][(z%3)+j].splice(bpindex, 1);
                  rating = rating + (self.removeSingles(board, pencils, Math.floor(z/3)+i, (z%3)+j, messageCallback) * 1.5);
                }
              }
            }
          } 
        }
      }
      
      // Send each row to naked triples
      for (row = 0; row < 9; row++) {
        var trow = pencils[row], rowTriples = self.utils.nakedTriple(trow);
        for (var s = 0; s < rowTriples.members.length; s++) {
          for (var t = 0; t < pencils[row].length; t++) {
            if (rowTriples.not.indexOf(t) === -1) {
              var rtindex = pencils[row][t].indexOf(rowTriples.members[s]);
              if (rtindex > -1) {
                messageCallback("Remove " + rowTriples.members[s] + " from " + t + "," + row);
                pencils[row][t].splice(rtindex, 1);
                rating = rating + (self.removeSingles(board, pencils, row, t, messageCallback) * 1.5);
              }
            }
          }
        }
      }
      
      // Send each column to naked triples
      for (column = 0; column < 9; column++) {
        var colTriples, col = [];
        
        for (row = 0; row < 9; row++) {
          col.push(pencils[row][column]);
        }
        
        colTriples = self.utils.nakedTriple(col);
        
        for (var u = 0; u < colTriples.members.length; u++) {
          for (var v = 0; v < col.length; v++) {
            if (colTriples.not.indexOf(v) === -1) {
              var ctindex = pencils[v][column].indexOf(colTriples.members[u]);
              if (ctindex > -1) {
                messageCallback("Remove " + colTriples.members[u] + " from " + column + "," + v);
                pencils[v][column].splice(ctindex, 1);
                rating = rating + (self.removeSingles(board, pencils, v, column, messageCallback) * 1.5);
              }
            }
          }
        }
      }
      
      // Send each box to naked triples
      for (i = 0; i < 9; i = i + 3) {
        for (j = 0; j < 9; j = j + 3) {
          var boxTriples, tbox = [];
          
          for (row = i; row < i + 3; row++) {
            for (column = j; column < j + 3; column++) {
              tbox.push(pencils[row][column]);
            }
          }
          
          boxTriples = self.utils.nakedTriple(tbox);
          for (var w1 = 0; w1 < boxTriples.members.length; w1++) {
            for (var z1 = 0; z1 < tbox.length; z1++){
              if (boxTriples.not.indexOf(z1) === -1) {
                var btindex = pencils[Math.floor(z1/3)+i][(z1%3)+j].indexOf(boxTriples.members[w1]);
                if (btindex > -1) {
                  messageCallback("Remove " + boxTriples.members[w1] + " from " + (z1%3)+j + "," + Math.floor(z1/3)+i);
                  pencils[Math.floor(z1/3)+i][(z1%3)+j].splice(btindex, 1);
                  rating = rating + (self.removeSingles(board, pencils, Math.floor(z1/3)+i, (z1%3)+j, messageCallback) * 1.5);
                }
              }
            }
          } 
        }
      }
      
      // Send each row to hidden pairs
      for (row = 0; row < 9; row++) {
        var hrow = pencils[row], rowHPairs = self.utils.hiddenPair(hrow);
        for (var p1 = 0; p1 < pencils[row].length; p1++) {
          if (rowHPairs.not.indexOf(p1) > -1) {
            pencils[row][p1] = [];
            for (var o1 = 0; o1 < rowHPairs.members.length; o1++) {
              pencils[row][p1].push(rowHPairs.members[o1]);
            }
          }
        }
      }
      
      // Send each column to hidden pairs
      for (column = 0; column < 9; column++) {
        var colHPairs, colh = [];
        
        for (row = 0; row < 9; row++) {
          colh.push(pencils[row][column]);
        }
        
        colHPairs = self.utils.hiddenPair(colh);
        
        for (var r1 = 0; r1 < colh.length; r1++) {
          if (colHPairs.not.indexOf(r1) > -1) {
            pencils[r1][column] = [];
            for (var q1 = 0; q1 < colHPairs.members.length; q1++) {
              pencils[r1][column].push(colHPairs.members[q1]);
            }
          }
        }
      }
      
      // Send each box to hidden pairs
      for (i = 0; i < 9; i = i + 3) {
        for (j = 0; j < 9; j = j + 3) {
          var boxHPairs, hbox = [];
          
          for (row = i; row < i + 3; row++) {
            for (column = j; column < j + 3; column++) {
              hbox.push(pencils[row][column]);
            }
          }
          
          boxHPairs = self.utils.hiddenPair(hbox);
          for (var z2 = 0; z2 < hbox.length; z2++){
            if (boxHPairs.not.indexOf(z2) > -1) {
              pencils[Math.floor(z2/3)+i][(z2%3)+j] = [];
              for (var w2 = 0; w2 < boxHPairs.members.length; w2++) {
                pencils[Math.floor(z2/3)+i][(z2%3)+j].push(boxHPairs.members[w2]);
              }
            }
          }
        }
      }
      
      // Send each row to hidden triples
      for (row = 0; row < 9; row++) {
        var htrow = pencils[row], rowHTriples = self.utils.hiddenTriple(htrow);
        for (var t1 = 0; t1 < pencils[row].length; t1++) {
          if (rowHTriples.not.indexOf(t1) > -1) {
            pencils[row][t1] = [];
            for (var s1 = 0; s1 < rowHTriples.members.length; s1++) {
              pencils[row][t1].push(rowHTriples.members[s1]);
            }
          }
        }
      }
      
      // Send each column to hidden triples
      for (column = 0; column < 9; column++) {
        var colHTriples, colht = [];
        
        for (row = 0; row < 9; row++) {
          colht.push(pencils[row][column]);
        }
        
        colHTriples = self.utils.hiddenTriple(colht);
        
        for (var v1 = 0; v1 < colht.length; v1++) {
          if (colHTriples.not.indexOf(v1) > -1) {
            pencils[v1][column] = [];
            for (var u1 = 0; u1 < colHTriples.members.length; u1++) {
              pencils[v1][column].push(colHTriples.members[u1]);
            }
          }
        }
      }
      
      // Send each box to hidden triples
      for (i = 0; i < 9; i = i + 3) {
        for (j = 0; j < 9; j = j + 3) {
          var boxHTriples, thbox = [];
          
          for (row = i; row < i + 3; row++) {
            for (column = j; column < j + 3; column++) {
              thbox.push(pencils[row][column]);
            }
          }
          
          boxHTriples = self.utils.hiddenTriple(thbox);
          for (var z3 = 0; z3 < thbox.length; z3++) {
            if (boxHTriples.not.indexOf(z3) > -1) {
              pencils[Math.floor(z3/3)+i][(z3%3)+j] = [];
              for (var w3 = 0; w3 < boxHTriples.members.length; w3++) {
                pencils[Math.floor(z3/3)+i][(z3%3)+j].push(boxHTriples.members[w3]);
              }
            }
          } 
        }
      }
      
      // Check if board is done. It's only done if nothing is 0
      solved = true;
      for (row = 0; row < 9; row++) {
        for (column = 0; column < 9; column++) {
          if (board[row][column] === 0) {
            solved = false;
          }
        }
      }
      
      // If we haven't done anything this time around, we need to try guessing
      if (!solved && rating === lastrating) {
        // Send each row to naked pairs and guess one
        rating = self.rowGuess(pencils, board, correct, rating, messageCallback);
      
        // If we still haven't done anything, there ain't no way we solving this. Give up
        if (rating === lastrating) {
          messageCallback("Nothing else I can do. Either unsolvable, or something I don't have rules for.");
          givenUp = true;
        }
      }
    }
    
    if (solved) {
      messageCallback("Solved.");
    }
    
    // Return the final rating or board, depending on what is requested
    if (rate) {
      return rating;
    } else {
      return board;
    }
  };
        
  Solver.prototype.rate = function (board, original) {
    var self = this;
    var rating, defaultNum = 0;
    
    for (var x = 0; x < 9; x++) {
      for (var y = 0; y < 9; y++) {
        if (board[x][y] > 0) {
          defaultNum++;
        }
      }
    }
    
    rating = self.humanSolve({board: board, 
                              correct: original,
                              rate: true});
    rating = (rating + defaultNum) - 81;
    
    return rating;
  };
  
  Solver.prototype.rowGuess = function (pencils, board, original, rating, messageCallback) {
    var i, self = this;
    for (i = 0; i < 9; i++) {
      var row = pencils[i], rowPairs = self.utils.nakedPair(row);
      for (var j = 0; j < pencils[i].length; j++) {
        if (rowPairs.not.indexOf(j) > -1) {
          board[i][j] = pencils[i][j][0];
          if (sudoku.utils.compare(board, original, true) === true) {
            pencils[i][j] = [board[i][j]];
            board[i][j] = 0;
            rating = rating + (self.removeSingles(board, pencils, i, j, messageCallback) * 2);
            return rating;
          } else {
            board[i][j] = pencils[i][j][1];
            if (sudoku.utils.compare(board, original, true) === true) {
              pencils[i][j] = [board[i][j]];
              board[i][j] = 0;
              rating = rating + (self.removeSingles(board, pencils, i, j, messageCallback) * 2);
              return rating;
            }
          }
        }
      }
    }
    return rating;
  };
  
  Solver.prototype.removeSingles = function (board, pencils, x, y, messageCallback) {
    var index, x2, y2, rating = 0, self = this;
    if (board[x][y] === 0 && pencils[x][y].length === 1) {
      messageCallback("Cell " + y + "," + x + " can only be " + pencils[x][y][0]);
      board[x][y] = pencils[x][y][0];
      rating++;
      
      for (x2 = (x + 1) % 9; x2 !== x; x2 = (x2 + 1) % 9) {
        index = pencils[x2][y].indexOf(pencils[x][y][0]);
        if (index > -1){
          pencils[x2][y].splice(index, 1);
          rating = rating + self.removeSingles(board, pencils, x2, y, messageCallback);
        }
      }
      
      for (y2 = (y + 1) % 9; y2 !== y; y2 = (y2 + 1) % 9) {
        index = pencils[x][y2].indexOf(pencils[x][y][0]);
        if (index > -1){
          pencils[x][y2].splice(index, 1);
          rating = rating + self.removeSingles(board, pencils, x, y2, messageCallback);
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
            rating = rating + self.removeSingles(board, pencils, x2, y2, messageCallback);
          }
        }
      }  
    }
    
    return rating;
  };
  
  // Utility functions for finding out information, they don't actually change anything
  
  Solver.prototype.utils = {};
  
  Solver.prototype.utils.hiddenSingle = function (array) {
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
  };
  
  Solver.prototype.utils.nakedPair = function (array) {
    var pairs = {}, pairMembers = {members: [], not: []};
    for (var i = 0; i < array.length; i++) {
      for (var j = i + 1; j < array.length; j++) {
        if (_.union(array[i], array[j]).length === 2 && 
            array[j].length > 1 && array[i].length > 1) {
          pairs[_.union(array[i], array[j])] = [i, j];
        }
      }
    }
    for (var p in pairs) {
      if (pairs[p].length > 1) {
        var temp = p.split(",");
        for (var j2 = 0; j2 < temp.length; j2++) {
          pairMembers.members.push(Number(temp[j2]));
        }
        for (var k = 0; k < pairs[p].length; k++) {
          pairMembers.not.push(pairs[p][k]);
        }
      }
    }
    return pairMembers;
  };
  
  Solver.prototype.utils.nakedTriple = function (array) {
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
  };
  
  Solver.prototype.utils.hiddenPair = function (array) {
    var pairs = {}, pairMembers = {members: [], not: []};
    for (var i = 0; i < array.length; i++) {
      for (var j = i + 1; j < array.length; j++) {
        var common = _.intersection(array[i], array[j]);
        if (common.length === 2) {
          var unique = true;
          for (var k = 0; k < array.length; k++) {
            if (k !== i && k !== j && _.intersection(common, array[k]).length > 0) {
              unique = false;
            }
          }
          if (unique) {
            pairs[common] = [i, j];
          }
        }
      }
    }
    for (var p in pairs) {
      if (pairs[p].length > 1) {
        var temp = p.split(",");
        for (var j2 = 0; j2 < temp.length; j2++) {
          pairMembers.members.push(Number(temp[j2]));
        }
        for (var k2 = 0; k2 < pairs[p].length; k2++) {
          pairMembers.not.push(pairs[p][k2]);
        }
        break;
      }
    }
    return pairMembers;
  };
  
  Solver.prototype.utils.hiddenTriple = function (array) {
    var pairs = {}, pairMembers = {members: [], not: []};
    for (var i = 0; i < array.length; i++) {
      for (var j = i + 1; j < array.length; j++) {
        for (var k = 0; k < array.length; k++) {
          var common = _.intersection(array[i], array[j], array[k]);
          if (common.length === 3) {
            var unique = true;
            for (var l = 0; l < array.length; l++) {
              if (l !== i && l !== j && l !== k && _.intersection(common, array[l]).length > 0) {
                unique = false;
              }
            }
            if (unique) {
              pairs[common] = [i, j, k];
            }
          }
        }
      }
    }
    for (var p in pairs) {
      if (pairs[p].length > 1) {
        var temp = p.split(",");
        for (var j2 = 0; j2 < temp.length; j2++) {
          pairMembers.members.push(Number(temp[j2]));
        }
        for (var k2 = 0; k2 < pairs[p].length; k2++) {
          pairMembers.not.push(pairs[p][k2]);
        }
        break;
      }
    }
    return pairMembers;
  };
    
  return Solver;
});