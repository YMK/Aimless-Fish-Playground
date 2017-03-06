/*jslint plusplus: true, indent: 2, maxerr: 500 */
/*global define, setTimeout, window */

define(['angular', 'd3fc', 'd3', './initialChart', './lineChart'], function (angular, fc, d3, initialChart, lineChart) {
  'use strict';

  function ChartsController($scope) {

    $scope.info.active = "charts";
    $scope.info.title = "Charts";
    $scope.test = "Welcome to the ChartShow";

    initialChart();
    lineChart();
  }

  ChartsController.$inject = ['$scope'];
  return ChartsController;
});
