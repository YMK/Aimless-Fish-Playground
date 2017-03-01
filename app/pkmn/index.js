define(['require', 'angular', './pkmnController', 'jquery'], function (require, ng, ctrl, $) {
  'use strict';
  var pkmn = ng.module('ymk.pkmn', ['ui.bootstrap.tooltip']);

  pkmn.controller('PkmnCtrl', ['$scope', '$http', '$sce', ctrl]);

  return pkmn;
});
