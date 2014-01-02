/*jslint plusplus: true, indent: 2, maxerr: 500 */
/*global define, setTimeout, window */

define(['angular', 'jquery'], function (angular, $) {
  'use strict';

  function PkmnController($scope, $http) {
    $scope.identity = angular.identity;
    $scope.test = "test";
    $scope.gens = [1, 2, 3, 4, 5, 6];
    $scope.gen = 6;
    $scope.pkmn = [];
    $scope.selected = [];
    $scope.allowLeg = true;
    $scope.ss = "https://docs.google.com/a/10people.co.uk/spreadsheet/ccc?key=0Avn9MFfjzXYodDF5MWRZQVA3MGVnaXF6R1dYRlJoTVE#gid=0";

    $scope.setUp = function () {
      $http({
        url: "http://cors.io/spreadsheets.google.com/feeds/list/0Avn9MFfjzXYodDF5MWRZQVA3MGVnaXF6R1dYRlJoTVE/od6/public/values?alt=json",
        method: "GET"
      }).success(function (data) {
        $scope.pkmn = data.feed.entry;
      });
    };
    
    $scope.pick = function () {
      $scope.selected = [];
      for (var i = 0; i < 6; i++) {
        var index = Math.floor((Math.random()*718));
        if (!$scope.allowLeg && $scope.pkmn[index].gsx$legendary.$t !== "") {
          i--;
        } else {
          $scope.selected.push($scope.pkmn[index]);
        }
      }
    };
    
    $scope.setUp();
  }

  PkmnController.$inject = ['$scope'];
  return PkmnController;
});