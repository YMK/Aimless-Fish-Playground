/*jslint vars: true, plusplus: true, indent: 2, maxerr: 500 */
/*global require, define, document, top, window, FastClick */

require.config({
  urlArgs: "bust=" + (new Date()).getTime(),
  paths: {
    "angular": "../lib/angular/angular",
    "ngroute": "../lib/angular-route/angular-route",
    "ngtouch": "../lib/angular-touch/angular-touch.min",
    "ngbootstrap": "../lib/angular-bootstrap/ui-bootstrap.min",
    "ngbootstrap-tpls": "../lib/angular-bootstrap/ui-bootstrap-tpls.min",
    "jquery": "../lib/jquery/dist/jquery",
    "bootstrap.modal": "../lib/bootstrap/js/modal",
    "bootstrap.collapse": "../lib/bootstrap/js/collapse",
    "kudoku": "../lib/kudoku",
    "sheetrock": "../lib/jquery-sheetrock/src/jquery.sheetrock",
    "underscore": "../lib/underscore/underscore-min"
  },

  shim: {
    "angular": {
      exports: "angular"
    },
    "ngtouch": ['angular'],
    "ngbootstrap": ['angular'],
    "ngbootstrap-tpls": ['angular'],
    "ngroute": ['angular'],
    "bootstrap.modal": ['jquery'],
    "bootstrap.collapse": ['jquery'],
    "sudokuUtils": {
      exports: "sudoku"
    },
    "underscore": {
      exports: "_"
    }
  }
});

define(['require', 'jquery',
        'angular', 'ngroute', 'ngtouch',
        'ngbootstrap', 'ngbootstrap-tpls',
        'bootstrap.collapse',
        'sudoku/index',
        'spinners/index',
        'pkmn/index'
      ], function (require, $, ng) {
  'use strict';

  var experimentApp = ng.module('experimentApp', [
    'ngRoute', 'ngTouch', 'ui.bootstrap',
    'ymk.sudoku',
    'ymk.spinners',
    'ymk.pkmn'
  ]);

  experimentApp.controller('MainCtrl', function ($scope) {
    $scope.info = {
      "title": "Html 5 Experiments",
      "active": ""
    };
  });

  experimentApp.config(function ($routeProvider, $locationProvider) {
    $routeProvider.
      when('/sudoku/:board', {
        templateUrl: 'sudoku/sudoku.html',
        controller: 'SudokuCtrl',
        controllerAs: 'sudoku'
      }).
      when('/sudoku', {
        templateUrl: 'sudoku/sudoku.html',
        controller: 'SudokuCtrl',
        controllerAs: 'sudoku'
      }).
      when('/draftlocke', {
        templateUrl: 'pkmn/pkmn.html',
        controller: 'PkmnCtrl',
        controllerAs: 'pkmn'
      }).
      when('/spinners', {
        templateUrl: 'spinners/spinners.html',
        controller: 'SpinnerCtrl',
        controllerAs: 'spinners'
      }).
      otherwise({
        redirectTo: '/sudoku'
      });
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

  FastClick.attach(document.body);
});
