angular
  .module('app')
/**
 * Home Controller
 */
  .controller('HomeController',
  [
    '$scope', '$rootScope', '$state', '$stateParams', 'PubSub', 'Match',
    function($scope, $rootScope, $state, $stateParams, PubSub, Match) {
      $scope.user = { username : ""};
      $rootScope.successMsg = false;
      $rootScope.errorMsg = false;
      $rootScope.errors = [];
      $rootScope.isScorerCss = true;

      $scope.matches = Match.query();




      $scope.handleFormSubmit = function() {
          var inputObj = {
            _matchId: "123456",
            _raiderTeam: "123456",
            _raiderId: "123456",
            touches: ['123', '123'],
            _tackledBy: "123456",
            _dataEntryPerson: "123456"
          };
          PubSub.submitData('submitResult', inputObj, onMatchResultCreate);
      }

      $scope.Raid;

      

      var onMatchResultCreate = function(data){
        console.log(data);
      };

    }
  ]
);