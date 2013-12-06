'use strict';

/* jasmine specs for controllers go here */
describe('Sudoku controllers', function () {

  describe('Sudoku controller', function () {

    beforeEach(module('sudokuApp'));

    it('should create "board" model with 10 by 10', inject(function ($controller) {
      var scope = {},
        ctrl = $controller('SudokuCtrl', {$scope: scope});

      expect(scope.board.getBoard().length).toBe(9);
      expect(scope.board.getBoard()[0].length).toBe(9);
    }));

  });

  describe('Checker', function () {

    describe('Rows', function () {

      beforeEach(module('sudokuApp'));

      it('Returns true when fine', inject(function ($controller) {
        var scope = {},
          ctrl = $controller('SudokuCtrl', {$scope: scope});

        scope.board.setBoard([
          [1, 2, 3, 4, 5, 6, 7, 8, 9],
          [4, 5, 6, 7, 8, 9, 1, 2, 3],
          [7, 8, 9, 1, 2, 3, 4, 5, 6],
          [2, 3, 4, 5, 6, 7, 8, 9, 1],
          [5, 6, 7, 8, 9, 1, 2, 3, 4],
          [8, 9, 1, 2, 3, 4, 5, 6, 7],
          [3, 4, 5, 6, 7, 8, 9, 1, 2],
          [6, 7, 8, 9, 1, 2, 3, 4, 5],
          [9, 1, 2, 3, 4, 5, 6, 7, 8]
        ]);
        expect(scope.checkBoard()).toBe(true);
      }));

      it('Returns false when not fine', inject(function ($controller) {
        var scope = {},
          ctrl = $controller('SudokuCtrl', {$scope: scope});

        scope.board.setBoard([
          [1, 2, 3, 4, 1, 5, 6, 7, 9],
          [4, 5, 6, 7, 8, 9, 1, 2, 3],
          [7, 8, 9, 3, 2, 6, 4, 5, 10]
        ]);
        expect(scope.checkBoard()).not.toBe(true);


        scope.board.setBoard([
          [1, 2, 3, 4, 8, 5, 6, 7, 9],
          [4, 5, 6, 7, 3, 9, 1, 2, 3],
          [7, 8, 9, 3, 2, 6, 4, 5, 10]
        ]);
        expect(scope.checkBoard()).not.toBe(true);
      }));

    });

    describe('Columns', function () {

      beforeEach(module('sudokuApp'));

      it('Returns true when fine', inject(function ($controller) {
        var scope = {},
          ctrl = $controller('SudokuCtrl', {$scope: scope});

        scope.board.setBoard([
          [1, 2, 3, 4, 5, 6, 7, 8, 9],
          [4, 5, 6, 7, 8, 9, 1, 2, 3],
          [7, 8, 9, 1, 2, 3, 4, 5, 6],
          [2, 3, 4, 5, 6, 7, 8, 9, 1],
          [5, 6, 7, 8, 9, 1, 2, 3, 4],
          [8, 9, 1, 2, 3, 4, 5, 6, 7],
          [3, 4, 5, 6, 7, 8, 9, 1, 2],
          [6, 7, 8, 9, 1, 2, 3, 4, 5],
          [9, 1, 2, 3, 4, 5, 6, 7, 8]
        ]);
        expect(scope.checkBoard()).toBe(true);
      }));

      it('Returns false when not fine', inject(function ($controller) {
        var scope = {},
          ctrl = $controller('SudokuCtrl', {$scope: scope});

        scope.board.setBoard([
          [1],
          [4],
          [1],
          [3],
          [6],
          [9],
          [2],
          [5],
          [8]
        ]);
        expect(scope.checkBoard()).not.toBe(true);


        scope.board.setBoard([
          [1],
          [4],
          [7],
          [3],
          [6],
          [1],
          [2],
          [5],
          [8]
        ]);
        expect(scope.checkBoard()).not.toBe(true);
      }));

    });

    describe('Squares', function () {

      beforeEach(module('sudokuApp'));

      it('Returns true when fine', inject(function ($controller) {
        var scope = {},
          ctrl = $controller('SudokuCtrl', {$scope: scope});

        scope.board.setBoard([
          [1, 2, 3, 4, 5, 6, 7, 8, 9],
          [4, 5, 6, 7, 8, 9, 1, 2, 3],
          [7, 8, 9, 1, 2, 3, 4, 5, 6],
          [2, 3, 4, 5, 6, 7, 8, 9, 1],
          [5, 6, 7, 8, 9, 1, 2, 3, 4],
          [8, 9, 1, 2, 3, 4, 5, 6, 7],
          [3, 4, 5, 6, 7, 8, 9, 1, 2],
          [6, 7, 8, 9, 1, 2, 3, 4, 5],
          [9, 1, 2, 3, 4, 5, 6, 7, 8]
        ]);
        expect(scope.checkBoard()).toBe(true);
      }));

      it('Returns false when not fine', inject(function ($controller) {
        var scope = {},
          ctrl = $controller('SudokuCtrl', {$scope: scope});

        scope.board.setBoard([
          [1, 2, 3],
          [4, 3, 6],
          [7, 8, 9]
        ]);
        expect(scope.checkBoard()).not.toBe(true);
      }));

    });

  });

  describe('Won', function () {

    beforeEach(module('sudokuApp'));

    it('Returns true when fine', inject(function ($controller) {
      var scope = {},
        ctrl = $controller('SudokuCtrl', {$scope: scope});

      scope.board.setBoard([
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [4, 5, 6, 7, 8, 9, 1, 2, 3],
        [7, 8, 9, 1, 2, 3, 4, 5, 6],
        [2, 3, 4, 5, 6, 7, 8, 9, 1],
        [5, 6, 7, 8, 9, 1, 2, 3, 4],
        [8, 9, 1, 2, 3, 4, 5, 6, 7],
        [3, 4, 5, 6, 7, 8, 9, 1, 2],
        [6, 7, 8, 9, 1, 2, 3, 4, 5],
        [9, 1, 2, 3, 4, 5, 6, 7, 8]
      ]);
      expect(scope.won()).toBe(true);
    }));

    it('Returns false when something is empty', inject(function ($controller) {
      var scope = {},
        ctrl = $controller('SudokuCtrl', {$scope: scope});

      scope.board.setBoard([
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [4, 5, 6, 7, 8, 9, 1, 2, 3],
        [7, 8, 9, 1, 0, 3, 4, 5, 6],
        [2, 3, 4, 5, 6, 7, 8, 9, 1],
        [5, 6, 7, 8, 9, 1, 2, 3, 4],
        [8, 9, 1, 2, 3, 4, 5, 6, 7],
        [3, 4, 5, 6, 7, 8, 9, 1, 2],
        [6, 7, 8, 9, 1, 2, 3, 4, 5],
        [9, 1, 2, 3, 4, 5, 6, 7, 8]
      ]);
      expect(scope.won()).toBe(false);
    }));

  });

});
