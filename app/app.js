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
    "underscore": "../lib/underscore/underscore-min",
    "d3": "../lib/d3/d3",
    "d3-array": "../lib/d3-array/build/d3-array",
    "d3-collection": "../lib/d3-collection/build/d3-collection",
    "d3-color": "../lib/d3-color/build/d3-color",
    "d3-dispatch": "../lib/d3-dispatch/build/d3-dispatch",
    "d3-dsv": "../lib/d3-dsv/build/d3-dsv",
    "d3-ease": "../lib/d3-ease/build/d3-ease",
    "d3-format": "../lib/d3-format/build/d3-format",
    "d3-interpolate": "../lib/d3-interpolate/build/d3-interpolate",
    "d3-path": "../lib/d3-path/build/d3-path",
    "d3-random": "../lib/d3-random/build/d3-random",
    "d3-request": "../lib/d3-request/build/d3-request",
    "d3-scale": "../lib/d3-scale/build/d3-scale",
    "d3-selection": "../lib/d3-selection/build/d3-selection",
    "d3-shape": "../lib/d3-shape/build/d3-shape",
    "d3-time": "../lib/d3-time/build/d3-time",
    "d3-time-format": "../lib/d3-time-format/build/d3-time-format",
    "d3-timer": "../lib/d3-timer/build/d3-timer",
    "d3-transition": "../lib/d3-transition/build/d3-transition",
    "d3fc": "../lib/d3fc"
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
    },
    "d3": {
      exports: "d3"
    },
    "d3fc": ['d3']
  }
});

define(['require', 'jquery',
        'angular', 'ngroute', 'ngtouch',
        'ngbootstrap', 'ngbootstrap-tpls',
        'bootstrap.collapse',
        'sudoku/index',
        'spinners/index',
        'pkmn/index',
        'charts/index'
      ], function (require, $, ng) {
  'use strict';

  var experimentApp = ng.module('experimentApp', [
    'ngRoute', 'ngTouch', 'ui.bootstrap',
    'ymk.sudoku',
    'ymk.spinners',
    'ymk.pkmn',
    'ymk.charts'
  ]);

  experimentApp.controller('MainCtrl', function ($scope) {
    $scope.info = {
      "title": "Html 5 Experiments",
      "active": ""
    };
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
