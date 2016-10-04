angular.module('angularApp').factory('Utils', function(){
   var fn = {
    randomNumber: randomNumber,
    getRandomItemFromArray: getRandomItemFromArray
  };

  return fn;

  function getRandomItemFromArray(array) {
    var randomNumber = fn.randomNumber(array.length-1);
    return array[randomNumber];
  }
  function randomNumber(number) {
    return Math.round(Math.random()*number);
  }

});
