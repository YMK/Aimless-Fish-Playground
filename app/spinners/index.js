define(['require', 'angular', './spinnerController', 'jquery'], function (require, ng, ctrl, $) {
  'use strict';
  var spinners = ng.module('ymk.spinners', ['ui.bootstrap.tooltip']);

  spinners.controller('SpinnerCtrl', ['$scope', ctrl]);

  return spinners;
});
