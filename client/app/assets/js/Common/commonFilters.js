angular
  .module('app')
  //combine name
  .filter('displayPlayerName', function() {
    return function(player) {
      return player.first_name + " " + player.last_name;
    }
  });