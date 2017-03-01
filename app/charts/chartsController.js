/*jslint plusplus: true, indent: 2, maxerr: 500 */
/*global define, setTimeout, window */

define(['angular'], function (angular) {
  'use strict';

  function ChartsController($scope) {

    $scope.info.active = "charts";
    $scope.info.title = "Charts";
    $scope.test = "Welcome to the ChartShow";
  }

  ChartsController.$inject = ['$scope'];
  return ChartsController;
});
