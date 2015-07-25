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

      $rootScope.score = {
        _teamA: 0,
        _teamB: 0,
        raiders: []
      };



      $scope.loadFullScore = function(){
        $rootScope.score = {
          _teamA: 0,
          _teamB: 0,
          raiders: []
        };
        Match.fullScore({id: '55ad4e19b6c83bce21524621'})
          .$promise
          .then(function(match){

            console.log(match);

            if(match.raids != undefined && match.raids.length > 0){
              angular.forEach(match.raids, function(raid, index){
                if(angular.equals(raid._raiderTeam, match._teamA._id)){
                  if(angular.equals(raid.raidResult, 'ST')){
                    $rootScope.score._teamB += 1;
                  } else if(angular.equals(raid.raidResult, 'SR')){
                    $rootScope.score._teamA += raid.touches.length;
                  } else {

                  }
                }
                if(angular.equals(raid._raiderTeam, match._teamB._id)){
                  if(angular.equals(raid.raidResult, 'ST')){
                    $rootScope.score._teamA += 1;
                  } else if(angular.equals(raid.raidResult, 'SR')){
                    $rootScope.score._teamB += raid.touches.length;
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
        var score = $rootScope.score;
        if(angular.equals(res._raiderTeam, $scope.match._teamA._id)){
          if(angular.equals(res.raidResult, 'ST')){
            score._teamB += 1;
          } else if(angular.equals(res.raidResult, 'SR')){
            score._teamA += res.touches.length;
          } else {

          }
        }
        if(angular.equals(res._raiderTeam, $scope.match._teamB._id)){
          if(angular.equals(res.raidResult, 'ST')){
            score._teamA += 1;
          } else if(angular.equals(res.raidResult, 'SR')){
            score._teamB += res.touches.length;
          } else {

          }
        }
        $rootScope.score = score;
        $scope.loadFullScore();
        console.log($rootScope.score);
        console.log(res);
      });

    }
  ]
);