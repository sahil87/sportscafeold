angular
  .module('app')
  .factory('Team',function($resource) {
    return $resource('http://localhost:3000/v1.0/teams/:id', { id: '@_id' }, {
      update: {
        method: 'PUT' // this method issues a PUT request
      }
    }, {
      stripTrailingSlashes: false
    });
  });