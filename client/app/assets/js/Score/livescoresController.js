angular
  .module('app')
/**
 * LiveScoreController
 */
  .controller('LiveScoreController',
  [
    '$scope', '$rootScope', '$state', '$stateParams', 'PubSub', 'Match', 'ngToast',
    function($scope, $rootScope, $state, $stateParams, PubSub, Match, ngToast) {
      $scope.user = { username : ""};
      $rootScope.successMsg = false;
      $rootScope.errorMsg = false;
      $rootScope.errors = [];

      $rootScope.isScorerCss = false;


      $scope.match = null;

      $scope.score = {
        _teamA: 0,
        _teamB: 0,
        raiders: []
      };



      $scope.loadFullScore = function(){
        Match.fullScore({id: '55ad4e19b6c83bce21524621'})
          .$promise
          .then(function(match){

            console.log(match);

            if(match.raids != undefined && match.raids.length > 0){
              angular.forEach(match.raids, function(raid, index){
                if(angular.equals(raid._raiderTeam, match._teamA._id)){
                  if(angular.equals(raid.raidResult, 'ST')){
                    $scope.score._teamB += 1;
                  } else if(angular.equals(raid.raidResult, 'SR')){
                    $scope.score._teamA += raid.touches.length;
                  } else {

                  }
                }
                if(angular.equals(raid._raiderTeam, match._teamB._id)){
                  if(angular.equals(raid.raidResult, 'ST')){
                    $scope.score._teamA += 1;
                  } else if(angular.equals(raid.raidResult, 'SR')){
                    $scope.score._teamB += raid.touches.length;
                  } else {

                  }
                }
              });
            }

            $scope.match = match;
          });
      };

      $scope.loadFullScore();


      PubSub.getData('55ad4e19b6c83bce21524621', function(res){
        console.log(res);
      });

    }
  ]
);