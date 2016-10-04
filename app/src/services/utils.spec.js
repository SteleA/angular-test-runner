'use strict';

(function(){

  describe('Service: Utils', function (){
    var utils;

    beforeEach(module('angularApp'));

    beforeEach(angular.mock.inject(function(Utils){
      utils = Utils;
    }));

    describe('randomNumber fn', function(){
      it('should get a number between 0-10', function(){
        var randomNumber = utils.randomNumber(10);
        expect(randomNumber).toMatch(/\d{1,}/);
        expect(randomNumber).toBeGreaterThan(-1);
        expect(randomNumber).toBeLessThan(11);
      });
    });
    describe('getRandomItemFromArray fn', function(){
      it('get a random item from array', function(){
        var
          array = [1,2,3,4,5,6,7,8,9,10],
          randomItem = utils.getRandomItemFromArray(array),
          isInArray = array.indexOf(randomItem) > -1;

        expect(isInArray).toBe(true);
      });
    });


  });
}());
