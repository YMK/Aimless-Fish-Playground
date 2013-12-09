'use strict';

var experimentControllers = angular.module('experimentControllers', []);

experimentControllers.controller('SudokuCtrl', function ($scope, $timeout) {
  $scope.board = new Board();
  $scope.selectedRow = 0;
  $scope.selectedCol = 0;
  $scope.locks = {"generate": false};
  $scope.checked = false;
  $scope.incorrect = {"row": [], "col": [], "square": []};
  $scope.difficulties = [
    {name: "Very Easy", value: 15},
    {name: "Easy", value: 30},
    {name: "Medium", value: 40},
    {name: "Hard", value: 60},
    {name: "Very hard", value: 70}
  ];
  $scope.difficulty = $scope.difficulties[1];

  $scope.selectedCell = function () {
    return $scope.board.getCell($scope.selectedRow, $scope.selectedCol);
  };

  $scope.checkBoard = function () {
    $scope.incorrect = $scope.getMistakes();
    return $scope.isCorrect();
  };

  $scope.getMistakes = function () {
    var correct = $scope.board.correct(),
      mistakes = {"row": [], "col": [], "square": []};
    if (correct === true) {
      return mistakes;
    }
    return correct;
  };

  $scope.isCorrect = function () {
    var mistakes = $scope.getMistakes();
    if (mistakes.row.length === 0 &&
        mistakes.col.length === 0 &&
        mistakes.square.length === 0) {
      return true;
    }
    return false;
  };

  $scope.won = function () {
    return $scope.board.isComplete() && $scope.isCorrect();
  };

  $scope.generate = function () {
    $scope.board.generate($scope.difficulty.value);
  };

  $scope.solve = function () {
    $scope.board.solve();
    $scope.checkBoard();
  };

  $scope.reset = function () {
    $scope.board.reset();
  };

  $scope.check = function () {
    $scope.checked = true;
    $timeout(function () {
      $scope.checked = false;
    }, 1500);
  };

  $scope.setSelected = function (row, column) {
    $scope.selectedRow = row;
    $scope.selectedCol = column;
  };

  $scope.setValueOfCell = function (value) {
    if ($scope.board.getCell($scope.selectedRow, $scope.selectedCol) === value) {
      $scope.board.setCell($scope.selectedRow, $scope.selectedCol, 0);
    } else {
      $scope.board.setCell($scope.selectedRow, $scope.selectedCol, value);
    }
  };

  $scope.setUp = function () {
    $scope.generate();
  };

  $scope.undo = function () {
    $scope.board.undo();
  };

  $scope.redo = function () {
    $scope.board.redo();
  };




  $scope.setUp();
  window.firefoxFix();
});