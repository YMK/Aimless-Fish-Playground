/*jslint plusplus: true, indent: 2, maxerr: 500 */
/*global define, describe, beforeEach, it, inject, expect */

define(['angular', 'ngmocks', 'sudoku/sudokuUtils', 'sudoku/sudokuBoard'], function (ng, mocks, utils, Board) {
  'use strict';
  describe("Sudoku Utils", function () {
    describe("Save", function () {
      it("Should return a string with 81 numbers", function () {
        expect(utils.utils.save([[0, 0, 0, 0, 0, 0, 0, 0, 0],
                                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                                [0, 0, 0, 0, 0, 0, 0, 0, 0]]).length).toEqual(81);
      });

      it("Returns a string with each number starting from 0,0 and going through the array, row by row.", function () {
        expect(utils.utils.save([[1, 2, 3, 0, 0, 0, 0, 0, 0],
                                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                                [0, 0, 0, 0, 0, 0, 0, 0, 9]])).toEqual("123.............................................................................9");
      });
    });

    describe("Load", function () {
      it("Should fail with < 81 numbers", function () {
        expect(utils.utils.load("012345678")).toEqual(false);
        expect(utils.utils.load("01234567890123456789012345678901234567890123456789012345")).toEqual(false);
        expect(utils.utils.load("012345678901234567890123456789")).toEqual(false);
        expect(utils.utils.load("01234567890123456789012345678901234567890123456789012345678901234567890123456789")).toEqual(false);
      });

      it("Should fail with > 81 numbers", function () {
        expect(utils.utils.load("0123456789012345678901234567890123456789012345678901234567890123456789012345678901")).toEqual(false);
        expect(utils.utils.load("012345678901234567890123456789012345678901234567890123456789012345678901234567890123")).toEqual(false);
        expect(utils.utils.load("0123456789012345678901234567890123456789012345678901234567890123456789012345678901343454567567")).toEqual(false);
      });

      it("Returns a 9x9 array when given exactly 81 numbers", function () {
        expect(utils.utils.load("123456789123456789123456789123456789123456789123456789123456789123456789123456789").length).toEqual(9);
        expect(utils.utils.load("123456789123456789123456789123456789123456789123456789123456789123456789123456789")[0].length).toEqual(9);
      });

      it("Returns each array in the array with 9 numbers, starting at the beginning", function () {
        var test = utils.utils.load("000000000000000000000000000000000000000000000000000000000000000000000000000000000");
        for(var i = 0; i < 9; i++) {
          for(var j = 0; j < 9; j++) {
            expect(test[i][j]).toEqual(0);
          }
        }
      });

      it("Does them in the right order", function () {
        var test = utils.utils.load("123456789000000000000000000000000000000000000000000000000000000000000000000000000");
        for(var i = 1; i < 10; i++) {
          expect(test[0][i - 1]).toEqual(i);
        }
        test = utils.utils.load("000000000000000000000000000000000000000000000000000000000000000000000000123456789");
        for(i = 1; i < 10; i++) {
          expect(test[8][i - 1]).toEqual(i);
        }
      });
    });

    describe("Correct", function () {

    });
  });

});
