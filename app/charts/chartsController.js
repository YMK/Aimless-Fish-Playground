/*jslint plusplus: true, indent: 2, maxerr: 500 */
/*global define, setTimeout, window */

define(['angular', 'd3fc', 'd3', './initialChart'], function (angular, fc, d3, initialChart) {
  'use strict';

  function ChartsController($scope) {

    $scope.info.active = "charts";
    $scope.info.title = "Charts";
    $scope.test = "Welcome to the ChartShow";

    initialChart();
  }

  ChartsController.$inject = ['$scope'];
  return ChartsController;
});
