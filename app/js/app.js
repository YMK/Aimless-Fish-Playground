require.config({
  paths: {
    "angular": "../lib/angular/angular",
    "ngroute": "../lib/angular-route/angular-route",
    "jquery": "../lib/jquery/jquery",
    "bootstrap.modal": "../lib/bootstrap/js/modal",
    "bootstrap.collapse": "../lib/bootstrap/js/collapse",
    "kudoku": "../lib/kudoku"
  },

  shim: {
    "angular": {
      exports: "angular"
    },
    "ngroute": ['angular'],
    "bootstrap.modal": ['jquery'],
    "bootstrap.collapse": ['jquery'],
    "sudokuUtils": {
      exports: "sudoku"
    }
  }
});

define(['require',
        'angular', 'ngroute',
        'bootstrap.modal', 'bootstrap.collapse',
        'controllers'], function (require, ng) {
  'use strict';
  var experimentApp = ng.module('experimentApp', [
    'ngRoute',
    'experimentControllers'
  ]);

  experimentApp.config(function ($routeProvider, $locationProvider) {
    $routeProvider.
      when('/sudoku', {
        templateUrl: 'partials/sudoku.html',
        controller: 'SudokuCtrl',
        controllerAs: 'sudoku'
      }).
      when('/something', {
        templateUrl: 'partials/something.html',
        controller: 'SudokuCtrl',
        controllerAs: 'something'
      }).
      otherwise({
        redirectTo: '/sudoku'
      });

//    $locationProvider.html5Mode(true);
  });

  ng.bootstrap(document, ['experimentApp']);

  var html = document.getElementsByTagName('html')[0];
  html.setAttribute('ng-app', 'app');
  html.dataset.ngApp = 'app';

  if (top !== window) {
    top.postMessage({
      type: 'loadamd'
    }, '*');
  }
});
