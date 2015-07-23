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

      $scope.events = [{_id: 1, name: 'Empty Raid'}, {_id: 2, name: 'Successful Raid'}, {_id: 3, name: 'Successful Tackle'}];

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
          if($scope.gameData.event == null){
            console.log("No event");
            ngToast.create({
              className: 'warning',
              content: '<a href="#" class="">Select an event!</a>',
              dismissOnTimeout: true,
              timeout: 4000,
              dismissButton: true
            });
          }

          $scope.gameData.raiderPlayer = player;
          $scope.gameData._raiderId = player._id;
      };

      //set touche
      $scope.setTouch = function(player){
          if($scope.gameData.event == null){
            console.log("No event");
            ngToast.create({
              className: 'warning',
              content: '<a href="#" class="">Select an event!</a>',
              dismissOnTimeout: true,
              timeout: 4000,
              dismissButton: true
            });
          }
          $scope.gameData.touches.push(player._id);
      };

      //set touche
      $scope.setTackle = function(player){
          $scope.gameData._tackledBy.push(player._id);
      };

      //handle submit
      $scope.handleFormSubmit = function() {
          console.log($scope.gameData);
          if($scope.gameData.event == null){
            console.log("No event");
            ngToast.create({
              className: 'warning',
              content: '<a href="#" class="">Select an event!</a>',
              dismissOnTimeout: true,
              timeout: 4000,
              dismissButton: true
            });
            return;
          }
          if($scope.gameData._raiderId == null){
            console.log("No event");
            ngToast.create({
              className: 'warning',
              content: '<a href="#" class="">Select raider!</a>',
              dismissOnTimeout: true,
              timeout: 4000,
              dismissButton: true
            });
            return;
          }

          if($scope.gameData.event._id == 1){
              $scope.gameData.touches = [];
              $scope.gameData._tackledBy = "";
              $scope.gameData.raidResult = 'ER';
          }
          if($scope.gameData.event._id == 2){
              //$scope.gameData.touches = [];
              $scope.gameData._tackledBy = "";
              $scope.gameData.raidResult = 'SR';
          }
          if($scope.gameData.event._id == 3){
              $scope.gameData.touches = [];
              //$scope.gameData._tackledBy = [];
              $scope.gameData.raidResult = 'ST';
          }
          
          var inputObj = {
              _matchId: "55ad4e19b6c83bce21524621",
              raidResult: $scope.gameData.raidResult,
              _raiderTeam: $scope.gameData.raider._id,
              _raiderId: $scope.gameData._raiderId,
              touches: $scope.gameData.touches,
              _tackledBy: $scope.gameData._tackledBy,
              _dataEntryPerson: "559f732811c8a50e1456913d"
          };
          PubSub.submitData('submitResult', inputObj, onMatchResultCreate);



          $scope.nextRaid($scope.gameData.defender, $scope.gameData.raider);
      };

      $scope.Raid;

      

      var onMatchResultCreate = function(data){
        console.log(data);
      };

    }
  ]
);