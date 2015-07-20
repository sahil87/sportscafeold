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

      $scope.handleFormSubmit = function() {
        var inputObj = {
          _matchId: "123456",
          _resultId: "123456",
          _raiderTeam: "123456",
          _raiderId: "123456",
          touches: ['123', '123'],
          _tackledBy: "123456",
          _dataEntryPerson: "123456"
        };
          console.log(inputObj);
          PubSub.submitData(
            'MatchResult',
            {
              "matchId": 123,
              "_resultId": 1234
            },
            onMatchResultCreate
          );

      }

      $scope.Raid;

      

      var onMatchResultCreate = function(data){
        console.log(data);
      };

    }
  ]
);