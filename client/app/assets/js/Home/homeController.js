angular
  .module('app')
/**
 * Home Controller
 */
  .controller('HomeController',
  [
    '$scope', '$rootScope', '$state', 'PubSub',
    function($scope, $rootScope, $state, PubSub) {
      $scope.user = { username : ""};
      $rootScope.successMsg = false;
      $rootScope.errorMsg = false;
      $rootScope.errors = [];
      $rootScope.isScorerCss = true;

      PubSub.submitData(
        'MatchResult',
        {
          "matchId": 123,
          "_resultId": 1234
        },
        onMatchResultCreate
      );

      var onMatchResultCreate = function(data){
        console.log(data);
      };

    }
  ]
);