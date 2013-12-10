'use strict';

define(['require', 'angular', 'sudokuController'], function (require, ng, sudokuController) {

  var experimentControllers = ng.module('experimentControllers', []);

  experimentControllers.controller('SudokuCtrl', sudokuController);
  return experimentControllers;
});