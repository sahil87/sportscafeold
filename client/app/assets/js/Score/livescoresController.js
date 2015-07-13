angular
  .module('app')
/**
 * LiveScoreController
 */
  .controller('LiveScoreController',
  [
    '$scope', '$rootScope', '$state',
    function($scope, $rootScope, $state) {
      $scope.user = { username : ""};
      $rootScope.successMsg = false;
      $rootScope.errorMsg = false;
      $rootScope.errors = [];

      $rootScope.isScorerCss = false;

    }
  ]
);