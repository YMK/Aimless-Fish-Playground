/*jslint plusplus: true, indent: 2, maxerr: 500 */
/*global define, setTimeout, window, Worker */

define(['./sudokuBoard', 'angular', './sudokuUtils', 'jquery', './boards'], function (Board, angular, sudoku, $, pantry) {
  'use strict';

  function SudokuController($scope, $routeParams, $location) {
    var NUMBER_OF_WEB_WORKERS = 5;

    $scope.identity = angular.identity;
    if ($scope.info) {
      $scope.info.active = "sudoku";
      $scope.info.title = "Sudoku";
    }
    $scope.board = new Board();
    $scope.selectedRow = 1;
    $scope.messages = [];
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
      {name: "Very Easy", value: 0},
      {name: "Easy", value: 1},
      {name: "Medium", value: 2},
      {name: "Hard", value: 3},
      {name: "Very hard", value: 4}
    ];
    $scope.show = {"won": true};
    $scope.difficulty = $scope.difficulties[2];
    $scope.params = $routeParams || {};

    $scope.boardCache = [[], [], [], [], []];
    $scope.workers = {};

    $scope.createWebWorker = function (i) {
      $scope.workers[i] = new Worker("sudoku/sudokuWebWorker.js");
      $scope.workers[i].addEventListener("message", function (e) {
        if (e.data === "Ready") {
          $scope.workers[i].postMessage({"command": "generateLots"});
        } else {
          if (e.data.rating === 0) {
            $scope.boardCache[0].push(e.data);
          } else if (e.data.rating < 0) {
            $scope.boardCache[4].push(e.data);
          } else if (e.data.rating < 30) {
            $scope.boardCache[1].push(e.data);
          } else if (e.data.rating < 40) {
            $scope.boardCache[2].push(e.data);
          } else if (e.data.rating >= 40) {
            $scope.boardCache[3].push(e.data);
          }
        }
      });
    };

    for (var i = 0; i < NUMBER_OF_WEB_WORKERS; i++) {
      $scope.createWebWorker(i);
    }

    $scope.setDifficulty = function (x) {
      $scope.difficulty = $scope.difficulties[x];
    };

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

      if ($scope.boardCache[$scope.difficulty.value].length > 0) {
        $scope.board.newGame($scope.boardCache[$scope.difficulty.value].pop());
        $scope.inProgress.generating = false;
      } else {
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
      }
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

    $scope.humanSolve = function () {
      $scope.messages = [];
      $scope.board.humanSolve(
        function (success, messages) {
          if (success) {
            $scope.$apply($scope.messages = messages);
          }
        },
        function (message) {
          $scope.$apply($scope.messages.shift(message));
        }
      );
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
      $scope.board.generate(null, null, pantry[1].board);
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
        if (e !== false) {
          if (e === 0) {
            $scope.rating = "Very Easy";
          } else if (e < 0) {
            $scope.rating = "Very Hard";
          } else if (e < 30) {
            $scope.rating = "Easy";
          } else if (e < 40) {
            $scope.rating = "Medium";
          } else if (e >= 40) {
            $scope.rating = "Hard";
          }
          $scope.rated = true;
          window.setTimeout(function () {
            $scope.$apply($scope.rated = false);
          }, 1500);
          $scope.$apply();
        }
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
