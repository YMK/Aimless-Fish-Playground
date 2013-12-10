'use strict';

define(['require', 'angular', 'sudokuController'], function (require, ng, sudokuController) {

  var experimentControllers = ng.module('experimentControllers', []);

  experimentControllers.controller('SudokuCtrl', sudokuController);
  // Add any other controllers needed in the same way, after adding
  // the files to the requirejs line above.
  return experimentControllers;
});