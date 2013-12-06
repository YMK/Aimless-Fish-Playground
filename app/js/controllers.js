'use strict';

var sudokuApp = angular.module('sudokuApp', []);

sudokuApp.controller('SudokuCtrl', function ($scope) {
  $scope.board = new Board();
  $scope.selectedRow = 0;
  $scope.selectedCol = 0;
  $scope.locks = {"generate": false};
  $scope.checked = false;
  $scope.incorrect = {"row": [], "col": [], "square": []};

  $scope.selectedCell = function () {
    return $scope.board.getCell($scope.selectedRow, $scope.selectedCol);
  };

  $scope.checkBoard = function () {
    var correct = $scope.board.correct();
    if (correct === true) {
      $scope.incorrect = {"row": [], "col": [], "square": []};
      return true;
    }
    $scope.incorrect = correct;
    return false;
  };

  $scope.won = function () {
    return $scope.checkBoard() && $scope.board.isComplete();
  };

  $scope.generate = function () {
    $scope.board.generate();
  };

  $scope.solve = function () {
    $scope.board.solve();
  };

  $scope.check = function () {
    $scope.checked = true;
    setTimeout(function () {
      $scope.checked = false;
    }, 500);
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




  $scope.setUp();
  firefoxFix();
});