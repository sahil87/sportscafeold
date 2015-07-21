angular
  .module('app')
  .factory('Raid',function($resource) {
    return $resource('http://localhost:3000/v1.0/raids/:id', { id: '@_id' }, {
      update: {
        method: 'PUT' // this method issues a PUT request
      }
    }, {
      stripTrailingSlashes: false
    });
  });