/*jslint plusplus: true, indent: 2, maxerr: 500 */
/*global define, setTimeout, window */

define(['angular', 'jquery'], function (angular, $) {
  'use strict';

  function PkmnController($scope, $http) {
    $scope.identity = angular.identity;
    $scope.info.active = "pkmn";
    $scope.info.title = "DraftLocke Generator";
    $scope.test = "test";
    $scope.gens = [1, 2, 3, 4, 5, 6];
    $scope.selectedGens = [1, 2, 3, 4, 5, 6];
    $scope.pkmn = [];
    $scope.selected = [];
    $scope.allowLeg = false;
    $scope.allowDupes = true;
    
    $scope.selectGen = function (gen) {
      var index = $scope.selectedGens.indexOf(gen);
      if (index > -1 ) {
        $scope.selectedGens.splice(index, 1);
      } else {
        $scope.selectedGens.push(gen);
      }
    };

    $scope.setUp = function () {
      $http({
        url: "https://spreadsheets.google.com/feeds/list/0Avn9MFfjzXYodDF5MWRZQVA3MGVnaXF6R1dYRlJoTVE/od6/public/values?alt=json-in-script&callback=JSON_CALLBACK",
        method: "JSONP"
      }).success(function (data) {
        $scope.pkmn = data.feed.entry;
      });
    };
    
    $scope.pick = function () {
      $scope.selected = [];
      for (var i = 0; i < 6; i++) {
        var index = Math.floor((Math.random()*718));
        if ((!$scope.allowLeg && $scope.pkmn[index].gsx$legendary.$t !== "") ||
           ($scope.selectedGens.indexOf(Number($scope.pkmn[index].gsx$gen.$t)) < 0) ||
           (!$scope.allowDupes && $scope.selected.indexOf($scope.pkmn[index]) > -1)) {
          i--;
        } else {
          $scope.selected.push($scope.pkmn[index]);
          $scope.pkmn[$scope.pkmn[index].gsx$no.$t - 1].sprite = "http://pokeapi.co/media/img/" + $scope.pkmn[index].gsx$no.$t + ".png";
//          $scope.getSprite($scope.pkmn[index].gsx$no.$t, function (img, id) {
//            $scope.pkmn[id - 1].sprite = img;
//          });
        }
      }
    };
    
    $scope.getSprite = function (id, callback) {
      $http({
        url: "http://pokeapi.co/api/v1/sprite/" + id + "?callback=JSON_CALLBACK",
        method: "JSONP"
      }).success(function (data) {
        callback("http://pokeapi.co" + data.image, data.id);
      });
    };
    
    $scope.setUp();
  }

  PkmnController.$inject = ['$scope'];
  return PkmnController;
});