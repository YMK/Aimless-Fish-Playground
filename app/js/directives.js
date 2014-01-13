define(['require', 'angular', 'jquery'], function (require, ng, $) {
  'use strict';
  ng.module( 'custom.sudoku', [ 'ui.bootstrap.tooltip' ] )
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
  }).directive('bluring', function () {
    return {
      link: function (scope, element) {
        $(element).on('click', '*', function (e) {
          if(!$(e.target).is("td") && !$(e.target).is("span")) {
            $('#test').fadeOut(300);
          }
        });
      }
    };
  });
});