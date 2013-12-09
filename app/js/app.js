'use strict';

/* App Module */
var experimentApp = angular.module('experimentApp', [
  'ngRoute',
  'experimentControllers'
]);

experimentApp.config(
  function ($routeProvider, $locationProvider) {
    $routeProvider.
      when('/app/sudoku', {
        templateUrl: 'partials/sudoku.html',
        controller: 'SudokuCtrl',
        controllerAs: 'sudoku'
      }).
      when('/app/something', {
        templateUrl: 'partials/something.html',
        controller: 'SudokuCtrl',
        controllerAs: 'something'
      }).
      otherwise({
        redirectTo: '/app/sudoku'
      });

      $locationProvider.html5Mode(true);
  });
