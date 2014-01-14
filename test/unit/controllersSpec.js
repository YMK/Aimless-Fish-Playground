/*jslint plusplus: true, indent: 2, maxerr: 500 */
/*global define, describe, beforeEach, it, inject, expect */

define(['angular', 'ngmocks', 'sudokuController'], function (ng, mocks, controller) {
  'use strict';
  
  describe('Sudoku controller', function () {
    var scope, ctrl;

    beforeEach(inject(function ($rootScope, $controller) {
      scope = $rootScope.$new();
      ctrl = $controller(controller, { $scope: scope});
    }));


    it('should create "board" model with 10 by 10', function () {
      expect(scope.board.getBoard().length).toBe(9);
      expect(scope.board.getBoard()[0].length).toBe(9);
    });

  });
//
//  describe('Checker', function () {
//    var scope, ctrl;
//
//    beforeEach(inject(function ($rootScope, $controller) {
//      scope = $rootScope.$new();
//      ctrl = $controller(controller, { $scope: scope});
//    }));
//
//    describe('Rows', function () {
//
//      it('Returns true when fine', function () {
//
//        scope.board.setBoard([
//          [1, 2, 3, 4, 5, 6, 7, 8, 9],
//          [4, 5, 6, 7, 8, 9, 1, 2, 3],
//          [7, 8, 9, 1, 2, 3, 4, 5, 6],
//          [2, 3, 4, 5, 6, 7, 8, 9, 1],
//          [5, 6, 7, 8, 9, 1, 2, 3, 4],
//          [8, 9, 1, 2, 3, 4, 5, 6, 7],
//          [3, 4, 5, 6, 7, 8, 9, 1, 2],
//          [6, 7, 8, 9, 1, 2, 3, 4, 5],
//          [9, 1, 2, 3, 4, 5, 6, 7, 8]
//        ]);
//        expect(scope.checkBoard()).toBe(true);
//      });
//
//      it('Returns false when not fine', function () {
//
//        scope.board.setBoard([
//          [1, 2, 3, 4, 1, 5, 6, 7, 9],
//          [4, 5, 6, 7, 8, 9, 1, 2, 3],
//          [7, 8, 9, 3, 2, 6, 4, 5, 10]
//        ]);
//        expect(scope.checkBoard()).not.toBe(true);
//
//
//        scope.board.setBoard([
//          [1, 2, 3, 4, 8, 5, 6, 7, 9],
//          [4, 5, 6, 7, 3, 9, 1, 2, 3],
//          [7, 8, 9, 3, 2, 6, 4, 5, 10]
//        ]);
//        expect(scope.checkBoard()).not.toBe(true);
//      });
//
//    });
//
//    describe('Columns', function () {
//
//      it('Returns true when fine', function () {
//
//        scope.board.setBoard([
//          [1, 2, 3, 4, 5, 6, 7, 8, 9],
//          [4, 5, 6, 7, 8, 9, 1, 2, 3],
//          [7, 8, 9, 1, 2, 3, 4, 5, 6],
//          [2, 3, 4, 5, 6, 7, 8, 9, 1],
//          [5, 6, 7, 8, 9, 1, 2, 3, 4],
//          [8, 9, 1, 2, 3, 4, 5, 6, 7],
//          [3, 4, 5, 6, 7, 8, 9, 1, 2],
//          [6, 7, 8, 9, 1, 2, 3, 4, 5],
//          [9, 1, 2, 3, 4, 5, 6, 7, 8]
//        ]);
//        expect(scope.checkBoard()).toBe(true);
//      });
//
//      it('Returns false when not fine', function () {
//
//        scope.board.setBoard([
//          [1],
//          [4],
//          [1],
//          [3],
//          [6],
//          [9],
//          [2],
//          [5],
//          [8]
//        ]);
//        expect(scope.checkBoard()).not.toBe(true);
//
//
//        scope.board.setBoard([
//          [1],
//          [4],
//          [7],
//          [3],
//          [6],
//          [1],
//          [2],
//          [5],
//          [8]
//        ]);
//        expect(scope.checkBoard()).not.toBe(true);
//      });
//
//    });
//
//    describe('Squares', function () {
//
//      it('Returns true when fine', function () {
//
//        scope.board.setBoard([
//          [1, 2, 3, 4, 5, 6, 7, 8, 9],
//          [4, 5, 6, 7, 8, 9, 1, 2, 3],
//          [7, 8, 9, 1, 2, 3, 4, 5, 6],
//          [2, 3, 4, 5, 6, 7, 8, 9, 1],
//          [5, 6, 7, 8, 9, 1, 2, 3, 4],
//          [8, 9, 1, 2, 3, 4, 5, 6, 7],
//          [3, 4, 5, 6, 7, 8, 9, 1, 2],
//          [6, 7, 8, 9, 1, 2, 3, 4, 5],
//          [9, 1, 2, 3, 4, 5, 6, 7, 8]
//        ]);
//        expect(scope.checkBoard()).toBe(true);
//      });
//
//      it('Returns false when not fine', function () {
//
//        scope.board.setBoard([
//          [1, 2, 3],
//          [4, 3, 6],
//          [7, 8, 9]
//        ]);
//        expect(scope.checkBoard()).not.toBe(true);
//      });
//
//    });
//
//  });
//
//  describe('Won', function () {
//    var scope, ctrl;
//
//    beforeEach(inject(function ($rootScope, $controller) {
//      scope = $rootScope.$new();
//      ctrl = $controller(controller, { $scope: scope});
//    }));
//
//    it('Returns true when fine', function () {
//      scope.board.setBoard([
//        [1, 2, 3, 4, 5, 6, 7, 8, 9],
//        [4, 5, 6, 7, 8, 9, 1, 2, 3],
//        [7, 8, 9, 1, 2, 3, 4, 5, 6],
//        [2, 3, 4, 5, 6, 7, 8, 9, 1],
//        [5, 6, 7, 8, 9, 1, 2, 3, 4],
//        [8, 9, 1, 2, 3, 4, 5, 6, 7],
//        [3, 4, 5, 6, 7, 8, 9, 1, 2],
//        [6, 7, 8, 9, 1, 2, 3, 4, 5],
//        [9, 1, 2, 3, 4, 5, 6, 7, 8]
//      ]);
//      expect(scope.won()).toBe(true);
//    });
//
//    it('Returns false when something is empty', function () {
//
//      scope.board.setBoard([
//        [1, 2, 3, 4, 5, 6, 7, 8, 9],
//        [4, 5, 6, 7, 8, 9, 1, 2, 3],
//        [7, 8, 9, 1, 0, 3, 4, 5, 6],
//        [2, 3, 4, 5, 6, 7, 8, 9, 1],
//        [5, 6, 7, 8, 9, 1, 2, 3, 4],
//        [8, 9, 1, 2, 3, 4, 5, 6, 7],
//        [3, 4, 5, 6, 7, 8, 9, 1, 2],
//        [6, 7, 8, 9, 1, 2, 3, 4, 5],
//        [9, 1, 2, 3, 4, 5, 6, 7, 8]
//      ]);
//      expect(scope.won()).toBe(false);
//    });
//
//  });

});