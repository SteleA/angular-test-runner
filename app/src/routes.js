angular.module('angularApp').config(function($routeProvider) {
  $routeProvider

  .when('/', {
    templateUrl: 'src/home/home.tpl.html',
    controller: 'HomeCtrl',
    controllerAs: 'vm'
  })

  .otherwise('/');

});
