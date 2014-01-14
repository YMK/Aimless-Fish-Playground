/*jslint plusplus: true, indent: 2, maxerr: 500 */
/*global define, setTimeout, window, console */

define(['sudokuBoard', 'angular', 'sudokuUtils', 'jquery', 'boards'], function (Board, angular, sudoku, $, pantry) {
  'use strict';

  function SudokuController($scope, $routeParams, $location) {
    $scope.identity = angular.identity;
    if ($scope.info) {
      $scope.info.active = "sudoku";
      $scope.info.title = "Sudoku";
    }
    $scope.board = new Board();
    $scope.selectedRow = 0;
    $scope.selectedCol = 0;
    $scope.locks = {"generate": false};
    $scope.autoPencil = false;
    $scope.checked = false;
    $scope.incorrect = [];
    $scope.inProgress = {"generating": false};
    $scope.error = {"generating": false};
    $scope.rating = 0;
    $scope.rated = false;
    $scope.difficulties = [
      {name: "Very Easy", value: 15},
      {name: "Easy", value: 30},
      {name: "Medium", value: 40},
      {name: "Hard", value: 50},
      {name: "Very hard", value: 60}
    ];
    $scope.show = {"won": true};
    $scope.difficulty = $scope.difficulties[2];
    $scope.params = $routeParams || {};
    
    $scope.saveBoard = function () {
      $location.path("/sudoku/" + sudoku.utils.save($scope.board.getBoard()));
    };

    $scope.selectedCell = function () {
      return $scope.board.getCell($scope.selectedRow, $scope.selectedCol);
    };
    
    $scope.isOriginal = function (row, col) {
      if ($scope.board.getOrigBoard()[row][col] !== 0) {
        return true;
      }
    };

    $scope.selectedCellPencilMarks = function () {
      return $scope.board.getPencilMarks($scope.selectedRow, $scope.selectedCol);
    };

    $scope.checkBoard = function () {
      $scope.incorrect = $scope.getMistakes();
      return $scope.isCorrect();
    };

    $scope.getMistakes = function () {
      var mistakes = $scope.board.mistakes();
      return mistakes;
    };

    $scope.isCorrect = function () {
      var mistakes = $scope.getMistakes();
      for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
          if (mistakes[i][j] === 1) {
            return false;
          }
        }
      }
      
      return true;
    };

    $scope.won = function () {
      return $scope.board.isComplete() && $scope.isCorrect();
    };

    $scope.generate = function () {
      $scope.inProgress.generating = true;
      $scope.show.won = true;
      $scope.error.generating = "";
      $scope.board.generate($scope.difficulty.value, function (success) {
        if (success) {
          $scope.$apply($scope.inProgress.generating = false);
          if ($scope.autoPencil) {
            $scope.generatePencils();
          }
        }
      });

      setTimeout(function () {
        if ($scope.inProgress.generating) {
          $scope.error.generating = "Generation seems to be taking a while." +
                                    "Sometimes, sudoku can be very hard to " +
                                    "generate. Feel free to cancel and try " +
                                    "a new one.";
          $scope.$apply();
        }
      }, 2000);
    };
    
    $scope.autoGenerate = function () {
      if ($scope.autoPencil) {
        $scope.autoPencil = false;
        $scope.board.clearPencilMarks();
      } else {
        $scope.autoPencil = true;
        $scope.generatePencils();
      }
    };
    
    $scope.generatePencils = function () {
      $scope.board.generatePencilMarks(function (success) {
        if (success) {
          $scope.$apply();
        }
      });
    };

    $scope.cancelGeneration = function () {
      $scope.board.gworker.terminate();
      $scope.board.gworker = undefined;
      $scope.inProgress.generating = false;
    };

    $scope.solve = function () {
      $scope.board.solve(function () {
        $scope.$apply();
      });
      $scope.checkBoard();
    };

    $scope.reset = function () {
      $scope.board.reset();
      if ($scope.autoPencil) {
        $scope.generatePencils();
      }
    };

    $scope.clear = function () {
      $scope.board.clear();
    };

    $scope.check = function () {
      $scope.checked = true;
      $scope.checkBoard();
      window.setTimeout(function () {
        $scope.$apply($scope.checked = false);
      }, 1500);
      
    };

    $scope.setSelected = function (row, column) {
      $scope.selectedRow = row;
      $scope.selectedCol = column;
    };

    $scope.setValueOfCell = function (value) {
      var cellVal = $scope.board.getCell($scope.selectedRow, $scope.selectedCol),
        pencilMarks = $scope.board.getPencilMarks($scope.selectedRow, $scope.selectedCol);
      
      if (!$scope.autoPencil) {
        if (cellVal === value) {
          $scope.board.setCell($scope.selectedRow, $scope.selectedCol, 0);
        } else {
          if (!cellVal && pencilMarks.length === 0) {
            $scope.board.setCell($scope.selectedRow, $scope.selectedCol, value);
          } else if (pencilMarks.indexOf(value) > -1) {
            $scope.board.removePencilMark($scope.selectedRow, $scope.selectedCol, value);
            pencilMarks = $scope.board.getPencilMarks($scope.selectedRow, $scope.selectedCol);
            var index, num = 0;
            for (var i = 0; i < pencilMarks.length; i++) {
              if (pencilMarks.indexOf(i) > 0) {
                if (num === 0) {
                  index = i;
                }
                num++;
              }
            }
            if (num === 1) {
              $scope.board.removePencilMark($scope.selectedRow, $scope.selectedCol, index);
              $scope.board.setCell($scope.selectedRow, $scope.selectedCol, index);
            } else if (num === 0) {
              $scope.board.setCell($scope.selectedRow, $scope.selectedCol, value);
            }
          } else {
            $scope.board.addPencilMark($scope.selectedRow, $scope.selectedCol, value);
            if (cellVal !== 0) {
              $scope.board.addPencilMark($scope.selectedRow, $scope.selectedCol, cellVal);
              $scope.board.setCell($scope.selectedRow, $scope.selectedCol, 0);
            }
          }
        }
      } else {
        $('#test').fadeOut(100);
        if (cellVal === value) {
          $scope.board.setCell($scope.selectedRow, $scope.selectedCol, 0);
        } else {
          $scope.board.setCell($scope.selectedRow, $scope.selectedCol, value);
        }
        $scope.generatePencils();
      }
    };

    $scope.setUp = function () {
      $scope.board.generate(null, null, pantry[0].board);
    };

    $scope.undo = function () {
      $scope.board.undo();
    };

    $scope.redo = function () {
      $scope.board.redo();
    };

    $scope.hideWon = function () {
      $scope.show.won = false;
    };
    
    $scope.rate = function () {
      $scope.board.rate(function (e) {
        $scope.rating = e;
        $scope.rated = true;
        window.setTimeout(function () {
          $scope.$apply($scope.rated = false);
        }, 1500);
        $scope.$apply();
      });
    };
    
    if ($scope.params.board) {
      $scope.board.generate(null, null, sudoku.utils.load($scope.params.board));
    } else {
      $scope.setUp();
    }
  }

  SudokuController.$inject = ['$scope'];
  return SudokuController;
});