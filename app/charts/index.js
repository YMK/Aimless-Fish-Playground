define(['require', 'angular', './chartsController'], function (require, ng, ctrl) {
  'use strict';
  var charts = ng.module('ymk.charts', ['ui.bootstrap.tooltip']);

  charts
    .controller('ChartsCtrl', ['$scope', ctrl])
    .config(function ($routeProvider) {
      $routeProvider.
        when('/charts', {
          templateUrl: 'charts/charts.html',
          controller: 'ChartsCtrl',
          controllerAs: 'charts'
        });
    });

  return charts;
});
