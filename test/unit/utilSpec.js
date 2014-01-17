/*jslint plusplus: true, indent: 2, maxerr: 500 */
/*global define, describe, beforeEach, it, inject, expect */

define(['angular', 'ngmocks', 'sudokuUtils', 'sudokuBoard'], function (ng, mocks, utils, Board) {
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
    
    describe("Human Solving", function () {
      describe("Hidden single", function () {
        
        it("Returns empty list when nothing is unique", function () {
          expect(utils.utils.hiddenSingle([[1, 2], [1, 2, 3], [2, 3], [3]]).length).toEqual(0);
          expect(utils.utils.hiddenSingle([[1, 2], [1, 2, 3], [2, 3], [3]])).toEqual([]);
        });
        
        it("Returns object with the number of the array and the number that is unique when 1 number is only in 1 cell", function () {
          expect(utils.utils.hiddenSingle([[1, 2], [1, 2, 3], [2, 3], [3, 4]]).length).toEqual(1);
          expect(utils.utils.hiddenSingle([[1, 2], [1, 2, 3], [2, 3], [3, 4]])[0]).toEqual({index: 3, number: 4});
          expect(utils.utils.hiddenSingle([[1, 2], [1, 2, 3], [2, 3], [3, 5]]).length).toEqual(1);
          expect(utils.utils.hiddenSingle([[1, 2], [1, 2, 3], [2, 3], [3, 5]])[0]).toEqual({index: 3, number: 5});
          expect(utils.utils.hiddenSingle([[1, 2, 9], [1, 2, 3], [2, 3], [3]]).length).toEqual(1);
          expect(utils.utils.hiddenSingle([[1, 2, 9], [1, 2, 3], [2, 3], [3]])[0]).toEqual({index: 0, number: 9});
        });
      });
      
      describe("Naked Pair", function () {
        
        it("Returns no members and no not when no naked pair", function () {
          expect(utils.utils.nakedPair([[1, 2], [1, 2, 3], [2, 3]]).members.length).toEqual(0);
          expect(utils.utils.nakedPair([[1, 2], [1, 2, 3], [2, 3]]).not.length).toEqual(0);
        });
        
        it("Returns object with members that need to be removed, and not that shouldn't have things removed", function () {
          expect(utils.utils.nakedPair([[1, 2], [1, 2], [2, 3]]).members.length).toEqual(2);
          expect(utils.utils.nakedPair([[1, 2], [1, 2], [2, 3]]).not.length).toEqual(2);
          expect(utils.utils.nakedPair([[1, 2], [1, 2], [2, 3]]).members[0]).toEqual(1);
          expect(utils.utils.nakedPair([[1, 2], [1, 2], [2, 3]]).members[1]).toEqual(2);
          expect(utils.utils.nakedPair([[1, 2], [1, 2], [2, 3]]).not[0]).toEqual(0);
          expect(utils.utils.nakedPair([[1, 2], [1, 2], [2, 3]]).not[1]).toEqual(1);
          
          expect(utils.utils.nakedPair([[1, 2], [1, 2], [2, 3], [2, 3]]).members.length).toEqual(4);
          expect(utils.utils.nakedPair([[1, 2], [1, 2], [2, 3], [2, 3]]).not.length).toEqual(4);
          expect(utils.utils.nakedPair([[1, 2], [1, 2], [2, 3], [2, 3]]).members[0]).toEqual(1);
          expect(utils.utils.nakedPair([[1, 2], [1, 2], [2, 3], [2, 3]]).members[1]).toEqual(2);
          expect(utils.utils.nakedPair([[1, 2], [1, 2], [2, 3], [2, 3]]).members[2]).toEqual(2);
          expect(utils.utils.nakedPair([[1, 2], [1, 2], [2, 3], [2, 3]]).members[3]).toEqual(3);
          expect(utils.utils.nakedPair([[1, 2], [1, 2], [2, 3], [2, 3]]).not[0]).toEqual(0);
          expect(utils.utils.nakedPair([[1, 2], [1, 2], [2, 3], [2, 3]]).not[1]).toEqual(1);
          expect(utils.utils.nakedPair([[1, 2], [1, 2], [2, 3], [2, 3]]).not[2]).toEqual(2);
          expect(utils.utils.nakedPair([[1, 2], [1, 2], [2, 3], [2, 3]]).not[3]).toEqual(3);
        });
      });
      
      describe("Naked Triple", function () {
        
        it("Returns no members and no not when no naked triple", function () {
          expect(utils.utils.nakedTriple([[1, 2, 3], [1, 2, 3], [3, 4, 5]]).members.length).toEqual(0);
          expect(utils.utils.nakedTriple([[1, 2, 3], [1, 2, 3], [3, 4, 5]]).not.length).toEqual(0);
          
          expect(utils.utils.nakedTriple([[1, 2], [2, 3], [3, 4, 5]]).members.length).toEqual(0);
          expect(utils.utils.nakedTriple([[1, 2], [2, 3], [3, 4, 5]]).not.length).toEqual(0);
          
          expect(utils.utils.nakedTriple([[1, 5, 7, 8], [2, 5], [1, 5, 8, 9], [2, 7], []]).members.length).toEqual(0);
          expect(utils.utils.nakedTriple([[1, 5, 7, 8], [2, 5], [1, 5, 8, 9], [2, 7], []]).not.length).toEqual(0);
        });
        
        it("Returns object with members that need to be removed, and not that shouldn't have things removed", function () {
          expect(utils.utils.nakedTriple([[1, 2, 3], [1, 2, 3], [1, 2, 3], [2, 3, 4], [3, 6]]).members.length).toEqual(3);
          expect(utils.utils.nakedTriple([[1, 2, 3], [1, 2, 3], [1, 2, 3], [2, 3, 4], [3, 6]]).not.length).toEqual(3);
          expect(utils.utils.nakedTriple([[1, 2, 3], [1, 2, 3], [1, 2, 3], [2, 3, 4], [3, 6]]).members[0]).toEqual(1);
          expect(utils.utils.nakedTriple([[1, 2, 3], [1, 2, 3], [1, 2, 3], [2, 3, 4], [3, 6]]).members[1]).toEqual(2);
          expect(utils.utils.nakedTriple([[1, 2, 3], [1, 2, 3], [1, 2, 3], [2, 3, 4], [3, 6]]).members[2]).toEqual(3);
          expect(utils.utils.nakedTriple([[1, 2, 3], [1, 2, 3], [1, 2, 3], [2, 3, 4], [3, 6]]).not[0]).toEqual(0);
          expect(utils.utils.nakedTriple([[1, 2, 3], [1, 2, 3], [1, 2, 3], [2, 3, 4], [3, 6]]).not[1]).toEqual(1);
          
          expect(utils.utils.nakedTriple([[1, 2], [2, 3, 4], [2, 3, 4], [2, 3, 4], [5, 6, 7], [5, 6, 7], [5, 6, 7]]).members.length).toEqual(6);
          expect(utils.utils.nakedTriple([[1, 2], [2, 3, 4], [2, 3, 4], [2, 3, 4], [5, 6, 7], [5, 6, 7], [5, 6, 7]]).not.length).toEqual(6);
          expect(utils.utils.nakedTriple([[1, 2], [2, 3, 4], [2, 3, 4], [2, 3, 4], [5, 6, 7], [5, 6, 7], [5, 6, 7]]).members[0]).toEqual(2);
          expect(utils.utils.nakedTriple([[1, 2], [2, 3, 4], [2, 3, 4], [2, 3, 4], [5, 6, 7], [5, 6, 7], [5, 6, 7]]).members[1]).toEqual(3);
          expect(utils.utils.nakedTriple([[1, 2], [2, 3, 4], [2, 3, 4], [2, 3, 4], [5, 6, 7], [5, 6, 7], [5, 6, 7]]).members[2]).toEqual(4);
          expect(utils.utils.nakedTriple([[1, 2], [2, 3, 4], [2, 3, 4], [2, 3, 4], [5, 6, 7], [5, 6, 7], [5, 6, 7]]).not[0]).toEqual(1);
          expect(utils.utils.nakedTriple([[1, 2], [2, 3, 4], [2, 3, 4], [2, 3, 4], [5, 6, 7], [5, 6, 7], [5, 6, 7]]).not[1]).toEqual(2);
          expect(utils.utils.nakedTriple([[1, 2], [2, 3, 4], [2, 3, 4], [2, 3, 4], [5, 6, 7], [5, 6, 7], [5, 6, 7]]).not[2]).toEqual(3);
        });
        
        it("Works for triples that don't all have all 3 numbers", function () {
          expect(utils.utils.nakedTriple([[1, 2], [2, 4], [2, 3, 4], [2, 3, 4], [5, 6, 7], [5, 6, 7], [5, 6, 7]]).members.length).toEqual(6);
          expect(utils.utils.nakedTriple([[1, 2], [2, 4], [2, 3, 4], [2, 3, 4], [5, 6, 7], [5, 6, 7], [5, 6, 7]]).not.length).toEqual(6);
          expect(utils.utils.nakedTriple([[1, 2], [2, 4], [2, 3, 4], [2, 3, 4], [5, 6, 7], [5, 6, 7], [5, 6, 7]]).members[0]).toEqual(2);
          expect(utils.utils.nakedTriple([[1, 2], [2, 4], [2, 3, 4], [2, 3, 4], [5, 6, 7], [5, 6, 7], [5, 6, 7]]).members[1]).toEqual(4);
          expect(utils.utils.nakedTriple([[1, 2], [2, 4], [2, 3, 4], [2, 3, 4], [5, 6, 7], [5, 6, 7], [5, 6, 7]]).members[2]).toEqual(3);
          expect(utils.utils.nakedTriple([[1, 2], [2, 4], [2, 3, 4], [2, 3, 4], [5, 6, 7], [5, 6, 7], [5, 6, 7]]).not[0]).toEqual(1);
          expect(utils.utils.nakedTriple([[1, 2], [2, 4], [2, 3, 4], [2, 3, 4], [5, 6, 7], [5, 6, 7], [5, 6, 7]]).not[1]).toEqual(2);
          expect(utils.utils.nakedTriple([[1, 2], [2, 4], [2, 3, 4], [2, 3, 4], [5, 6, 7], [5, 6, 7], [5, 6, 7]]).not[2]).toEqual(3);
        });
        
        it("Even works for triples that don't all have only 2 numbers", function () {
          expect(utils.utils.nakedTriple([[1, 2], [2, 4], [3, 4], [2, 3, 4], [5, 6, 7], [5, 6, 7], [5, 6, 7]]).members.length).toEqual(6);
          expect(utils.utils.nakedTriple([[1, 2], [2, 4], [3, 4], [2, 3, 4], [5, 6, 7], [5, 6, 7], [5, 6, 7]]).not.length).toEqual(6);
          expect(utils.utils.nakedTriple([[1, 2], [2, 4], [3, 4], [2, 3, 4], [5, 6, 7], [5, 6, 7], [5, 6, 7]]).members[0]).toEqual(2);
          expect(utils.utils.nakedTriple([[1, 2], [2, 4], [3, 4], [2, 3, 4], [5, 6, 7], [5, 6, 7], [5, 6, 7]]).members[1]).toEqual(4);
          expect(utils.utils.nakedTriple([[1, 2], [2, 4], [3, 4], [2, 3, 4], [5, 6, 7], [5, 6, 7], [5, 6, 7]]).members[2]).toEqual(3);
          expect(utils.utils.nakedTriple([[1, 2], [2, 4], [3, 4], [2, 3, 4], [5, 6, 7], [5, 6, 7], [5, 6, 7]]).not[0]).toEqual(1);
          expect(utils.utils.nakedTriple([[1, 2], [2, 4], [3, 4], [2, 3, 4], [5, 6, 7], [5, 6, 7], [5, 6, 7]]).not[1]).toEqual(2);
          expect(utils.utils.nakedTriple([[1, 2], [2, 4], [3, 4], [2, 3, 4], [5, 6, 7], [5, 6, 7], [5, 6, 7]]).not[2]).toEqual(3);
        });
      });
      
      describe("Hidden Pair", function () {
        
        it("Returns no members and no not when no naked pair", function () {
          expect(utils.utils.hiddenPair([[1, 2], [4, 3], [2, 3]]).members.length).toEqual(0);
          expect(utils.utils.hiddenPair([[1, 2], [4, 3], [2, 3]]).not.length).toEqual(0);
          
          expect(utils.utils.hiddenPair([[1, 2], [1, 2, 3], [1, 4, 6]]).members.length).toEqual(0);
          expect(utils.utils.hiddenPair([[1, 2], [1, 2, 3], [1, 4, 6]]).not.length).toEqual(0);
        });
        
        it("Returns object with members that need to be removed, and not that shouldn't have things removed", function () {
          expect(utils.utils.hiddenPair([[1, 2], [1, 2, 3]]).members.length).toEqual(2);
          expect(utils.utils.hiddenPair([[1, 2], [1, 2, 3]]).not.length).toEqual(2);
          expect(utils.utils.hiddenPair([[1, 2], [1, 2, 3]]).members[0]).toEqual(1);
          expect(utils.utils.hiddenPair([[1, 2], [1, 2, 3]]).members[1]).toEqual(2);
          expect(utils.utils.hiddenPair([[1, 2], [1, 2, 3]]).not[0]).toEqual(0);
          expect(utils.utils.hiddenPair([[1, 2], [1, 2, 3]]).not[1]).toEqual(1);
          
          expect(utils.utils.hiddenPair([[1, 2], [1, 2, 3], [5, 6, 7]]).members.length).toEqual(2);
          expect(utils.utils.hiddenPair([[1, 2], [1, 2, 3], [5, 6, 7]]).not.length).toEqual(2);
          expect(utils.utils.hiddenPair([[1, 2], [1, 2, 3], [5, 6, 7]]).members[0]).toEqual(1);
          expect(utils.utils.hiddenPair([[1, 2], [1, 2, 3], [5, 6, 7]]).members[1]).toEqual(2);
          expect(utils.utils.hiddenPair([[1, 2], [1, 2, 3], [5, 6, 7]]).not[0]).toEqual(0);
          expect(utils.utils.hiddenPair([[1, 2], [1, 2, 3], [5, 6, 7]]).not[1]).toEqual(1);
        });
      });
      
      describe("Hidden Triple", function () {
        
        it("Returns no members and no not when no naked triple", function () {
          expect(utils.utils.hiddenTriple([[1, 2, 3], [1, 2, 3], [3, 4, 5]]).members.length).toEqual(0);
          expect(utils.utils.hiddenTriple([[1, 2, 3], [1, 2, 3], [3, 4, 5]]).not.length).toEqual(0);
          
          expect(utils.utils.hiddenTriple([[1, 2], [2, 3], [3, 4, 5]]).members.length).toEqual(0);
          expect(utils.utils.hiddenTriple([[1, 2], [2, 3], [3, 4, 5]]).not.length).toEqual(0);
          
          expect(utils.utils.hiddenTriple([[1, 5, 7, 8], [2, 5], [1, 5, 8, 9], [2, 7], []]).members.length).toEqual(0);
          expect(utils.utils.hiddenTriple([[1, 5, 7, 8], [2, 5], [1, 5, 8, 9], [2, 7], []]).not.length).toEqual(0);
          
          expect(utils.utils.hiddenTriple([[1, 2, 3], [1, 2, 3], [1, 2, 3, 4], [2, 3, 4], [3, 6]]).members.length).toEqual(0);
          expect(utils.utils.hiddenTriple([[1, 2, 3], [1, 2, 3], [1, 2, 3, 4], [2, 3, 4], [3, 6]]).not.length).toEqual(0);
        });
        
        it("Returns object with members that need to be removed, and not that shouldn't have things removed", function () {
          expect(utils.utils.hiddenTriple([[1, 2, 3], [1, 2, 3], [1, 2, 3, 4], [4], [5, 6]]).members.length).toEqual(3);
          expect(utils.utils.hiddenTriple([[1, 2, 3], [1, 2, 3], [1, 2, 3, 4], [4], [5, 6]]).not.length).toEqual(3);
          expect(utils.utils.hiddenTriple([[1, 2, 3], [1, 2, 3], [1, 2, 3, 4], [4], [5, 6]]).members[0]).toEqual(1);
          expect(utils.utils.hiddenTriple([[1, 2, 3], [1, 2, 3], [1, 2, 3, 4], [4], [5, 6]]).members[1]).toEqual(2);
          expect(utils.utils.hiddenTriple([[1, 2, 3], [1, 2, 3], [1, 2, 3, 4], [4], [5, 6]]).members[2]).toEqual(3);
          expect(utils.utils.hiddenTriple([[1, 2, 3], [1, 2, 3], [1, 2, 3, 4], [4], [5, 6]]).not[0]).toEqual(1);
          expect(utils.utils.hiddenTriple([[1, 2, 3], [1, 2, 3], [1, 2, 3, 4], [4], [5, 6]]).not[1]).toEqual(2);
          expect(utils.utils.hiddenTriple([[1, 2, 3], [1, 2, 3], [1, 2, 3, 4], [4], [5, 6]]).not[2]).toEqual(0);
          
          expect(utils.utils.hiddenTriple([[1, 9], [2, 3, 4], [2, 3, 4], [2, 3, 4], [5, 6, 7, 8, 9], [5, 6, 7], [5, 6, 7]]).members.length).toEqual(6);
          expect(utils.utils.hiddenTriple([[1, 9], [2, 3, 4], [2, 3, 4], [2, 3, 4], [5, 6, 7, 8, 9], [5, 6, 7], [5, 6, 7]]).not.length).toEqual(6);
          expect(utils.utils.hiddenTriple([[1, 9], [2, 3, 4], [2, 3, 4], [2, 3, 4], [5, 6, 7, 8, 9], [5, 6, 7], [5, 6, 7]]).members[0]).toEqual(2);
          expect(utils.utils.hiddenTriple([[1, 9], [2, 3, 4], [2, 3, 4], [2, 3, 4], [5, 6, 7, 8, 9], [5, 6, 7], [5, 6, 7]]).members[1]).toEqual(3);
          expect(utils.utils.hiddenTriple([[1, 9], [2, 3, 4], [2, 3, 4], [2, 3, 4], [5, 6, 7, 8, 9], [5, 6, 7], [5, 6, 7]]).members[2]).toEqual(4);
          expect(utils.utils.hiddenTriple([[1, 9], [2, 3, 4], [2, 3, 4], [2, 3, 4], [5, 6, 7, 8, 9], [5, 6, 7], [5, 6, 7]]).not[0]).toEqual(2);
          expect(utils.utils.hiddenTriple([[1, 9], [2, 3, 4], [2, 3, 4], [2, 3, 4], [5, 6, 7, 8, 9], [5, 6, 7], [5, 6, 7]]).not[1]).toEqual(3);
          expect(utils.utils.hiddenTriple([[1, 9], [2, 3, 4], [2, 3, 4], [2, 3, 4], [5, 6, 7, 8, 9], [5, 6, 7], [5, 6, 7]]).not[2]).toEqual(1);
        });
      });
    });
  });
  
});