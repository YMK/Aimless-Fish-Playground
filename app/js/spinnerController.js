/*jslint plusplus: true, indent: 2, maxerr: 500 */
/*global define, setTimeout, window */

define(['angular', 'jquery'], function (angular, $) {
  'use strict';

  function SpinnerController($scope) {
    $scope.identity = angular.identity;
    $scope.info.active = "spinners";
    $scope.info.title = "CSS Spinners";
  }

  SpinnerController.$inject = ['$scope'];
  return SpinnerController;
});