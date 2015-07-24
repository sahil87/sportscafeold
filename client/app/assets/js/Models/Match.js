angular
  .module('app')
  .factory('Match',function($resource) {
    return $resource(
      'http://localhost:3000/v1.0/matches/:id',
      {
        id: '@_id'
      },
      {
        update: {
          method: 'PUT' // this method issues a PUT request
        },
        fullScore: {
          url: 'http://localhost:3000/v1.0/matches/:id/fullscore',
          method: 'GET' // this method issues a GET request
        }
      },
      {
        stripTrailingSlashes: false
      }
    );
  });