define(['require', 'angular', './sudokuController', 'jquery'], function (require, ng, ctrl, $) {
  'use strict';
  var sudoku = ng.module('ymk.sudoku', ['ui.bootstrap.tooltip']);

  sudoku
    .controller('SudokuCtrl', ['$scope', '$routeParams', '$location', ctrl])
      .directive( 'sudoku', function () {
      return {
        restrict: 'AE',
        replace: true,
        scope: true,
        link: function (scope, element, attrs) {
          var shown = false;
          $(element).click(function (e) {
            var el = $('#test'),
              x = $(element).offset().left + $(element).width() / 2,
              y = $(element).offset().top + $(element).height() / 2;
            el.fadeOut(1, function () {
              el.css( {
                position:"absolute",
                top: y - el.height()/2 + 14,
                left: x - el.width()/2 + 9
              }).fadeIn(300);
            });
          });
        }
      };
    })
    .directive('bluring', function () {
      return {
        link: function (scope, element) {
          $(element).on('click', '*', function (e) {
            if(!$(e.target).is("td") && !$(e.target).is("span")) {
              $('#test').fadeOut(300);
            }
          });
        }
      };
    })
    .config(function ($routeProvider) {
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
        otherwise({
          redirectTo: '/sudoku'
        });
    });

  return sudoku;
});
