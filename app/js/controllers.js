define(['require', 'angular', 'sudokuController', 'pkmnController'], function (require, ng, sudokuController, pkmnController) {
  'use strict';
  var experimentControllers = ng.module('experimentControllers', []);

  experimentControllers.controller('MainCtrl', function ($scope) {
    $scope.info = {
      "title": "Html 5 Experiments",
      "active": ""
    };
  });
  experimentControllers.controller('SudokuCtrl', ['$scope', '$routeParams', sudokuController]);
  experimentControllers.controller('PkmnCtrl', ['$scope', '$http', pkmnController]);
  // Add any other controllers needed in the same way, after adding
  // the files to the requirejs line above.
  return experimentControllers;
});