angular
  .module('app')
/**
 * Home Controller
 */
  .controller('HomeController',
  [
    '$scope', '$rootScope', '$state',
    function($scope, $rootScope, $state) {
      $scope.user = { username : ""};
      $rootScope.successMsg = false;
      $rootScope.errorMsg = false;
      $rootScope.errors = [];
      $rootScope.isScorerCss = true;

    }
  ]
);