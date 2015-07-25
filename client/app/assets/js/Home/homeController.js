angular
  .module('app')
/**
 * Home Controller
 */
  .controller('HomeController',
  [
    '$scope', '$rootScope', '$state', '$stateParams', 'PubSub', 'Match', 'ngToast',
    function($scope, $rootScope, $state, $stateParams, PubSub, Match, ngToast) {
      $scope.user = { username : ""};
      $rootScope.successMsg = false;
      $rootScope.errorMsg = false;
      $rootScope.errors = [];
      $rootScope.isScorerCss = true;

      $scope.matches = Match.query();

      $scope.match = null;

      $scope.events = [{_id: 1, name: 'Empty Raid', code: 'ER'}, {_id: 2, name: 'Successful Raid', code: 'SR'}, {_id: 3, name: 'Successful Tackle', code: 'ST'}];

      //game object
      $scope.gameData = {
          raidNo:1,
          raider: null,
          defender: null,
          event: null,
          _raiderId: null,
          raiderPlayer: null,
          touches: [],
          _tackledBy: []
      };

      $scope.nextRaid = function(raider, defender){
          $scope.gameData.raider = null;
          $scope.gameData.defender = null;

          $scope.gameData.raider = raider;
          $scope.gameData.defender = defender;
          $scope.gameData.raidNo += 1;

          $scope.gameData.event = null;
          $scope.gameData._raiderId = null;
          $scope.gameData.raiderPlayer = null;
          $scope.gameData.touches = [];
          $scope.gameData._tackledBy = [];
      };

      //load match data
      $rootScope.loadMatchData = function(){
        Match.get({id: '55ad4e19b6c83bce21524621'})
            .$promise
            .then(function(match){
                $scope.match = match;
                $scope.gameData.raider = match._teamA;
                $scope.gameData.defender = match._teamB;

                if(match.lastRaid == undefined || match.lastRaid == false){
                  $scope.gameData.raidNo = 1;
                } else {
                  $scope.gameData.raidNo = match.lastRaid.raidNum +1;
                }
                console.log($scope.match);
            });

      };

      $rootScope.loadMatchData();

      //set event
      $scope.setEvent = function(event){
        $scope.gameData.event = event;
      };

      //set raider
      $scope.setRaider = function(player){

          $scope.gameData.raiderPlayer = player;
          $scope.gameData._raiderId = player._id;
      };

      //set touche
      $scope.setTouch = function(player){
          if($scope.gameData._raiderId == null){
            console.log("No raider");
            ngToast.create({
              className: 'warning',
              content: 'Select a raider!',
              dismissOnTimeout: true,
              timeout: 4000,
              dismissButton: true
            });
          } else {
            if($scope.gameData._tackledBy.length){
              $scope.gameData.touches = [];
            } else {
              if($scope.gameData.touches.indexOf(player._id) == -1){
                $scope.gameData.touches.push(player._id);
              } else {
                $scope.gameData.touches.splice($scope.gameData.touches.indexOf(player._id), 1);
              }
            }



          }

      };

      //set touche
      $scope.setTackle = function(player){
          if($scope.gameData._raiderId == null){
            console.log("No raider");
            ngToast.create({
              className: 'warning',
              content: 'Select a raider!',
              dismissOnTimeout: true,
              timeout: 4000,
              dismissButton: true
            });
          } else {
            $scope.gameData.touches = [];
            if($scope.gameData._tackledBy.indexOf(player._id) == -1){
              $scope.gameData._tackledBy.push(player._id);
            } else {
              $scope.gameData._tackledBy.splice($scope.gameData._tackledBy.indexOf(player._id), 1);
            }


          }

      };

      //handle submit
      $scope.handleFormSubmit = function() {
          console.log($scope.gameData);
          var touches = {};
          var _tackledBy = {};

          if($scope.gameData._raiderId == null){
            console.log("No raider");
            ngToast.create({
              className: 'warning',
              content: 'Select raider!',
              dismissOnTimeout: true,
              timeout: 4000,
              dismissButton: true
            });
          } else {
            if($scope.gameData._tackledBy.length){
              $scope.gameData.touches = [];
              touches = {};
              _tackledBy = $scope.gameData._tackledBy;
              $scope.gameData.raidResult = 'ST';
            } else if($scope.gameData.touches.length){
              _tackledBy = {};
              $scope.gameData._tackledBy = "";
              $scope.gameData.raidResult = 'SR';
              touches = $scope.gameData.touches;
            } else {
              touches = {};
              _tackledBy = {};
              $scope.gameData.raidResult = 'ER';
            }

            var inputObj = {
              _matchId: "55ad4e19b6c83bce21524621",
              raidNum: $scope.gameData.raidNo,
              raidResult: $scope.gameData.raidResult,
              _raiderTeam: $scope.gameData.raider._id,
              _raiderId: $scope.gameData._raiderId,
              touches: touches,
              _tackledBy: _tackledBy,
              _dataEntryPerson: "559f732811c8a50e1456913d"
            };
            PubSub.submitData('submitResult', inputObj, onMatchResultCreate);

            ngToast.create({
              className: 'info',
              content: 'Score have been submitted successfully!',
              dismissOnTimeout: true,
              timeout: 4000,
              dismissButton: true
            });



            $scope.nextRaid($scope.gameData.defender, $scope.gameData.raider);
          }
          

      };

      $scope.Raid;

      

      var onMatchResultCreate = function(data){
        console.log(data);
      };

    }
  ]
);