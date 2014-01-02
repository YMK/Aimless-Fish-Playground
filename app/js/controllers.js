define(['require', 'angular', 'sudokuController', 'pkmnController'], function (require, ng, sudokuController, pkmnController) {
  'use strict';
  var experimentControllers = ng.module('experimentControllers', []);

  experimentControllers.controller('SudokuCtrl', sudokuController);
  experimentControllers.controller('PkmnCtrl', ['$scope', '$http', pkmnController]);
  // Add any other controllers needed in the same way, after adding
  // the files to the requirejs line above.
  return experimentControllers;
});