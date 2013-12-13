'use strict';
require.config({
  paths: {
    "angular": "../lib/angular/angular",
    "ngroute": "../lib/angular-route/angular-route",
    "jquery": "../lib/jquery/jquery",
    "bootstrap.modal": "../lib/bootstrap/js/modal",
    "bootstrap.collapse": "../lib/bootstrap/js/collapse"
  },

  shim: {
    "angular": {
      exports: "angular"
    },
    "ngroute": ['angular'],
    "bootstrap.modal": ['jquery'],
    "bootstrap.collapse": ['jquery']
  }
});

define(['require',
        'angular', 'ngroute',
        'bootstrap.modal', 'bootstrap.collapse',
        'controllers'], function (require, ng) {
  var experimentApp = ng.module('experimentApp', [
    'ngRoute',
    'experimentControllers'
  ]);

  experimentApp.config(function ($routeProvider, $locationProvider) {
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
