;(function(){


  angular
    .module('app', [
      'ngRoute',
      'ngResource',
      'ui.router',
      'ui.bootstrap',
      'ngCookies'
    ])
    //states
    .config(
    [
      '$stateProvider', '$urlRouterProvider', '$httpProvider',
      function($stateProvider, $urlRouterProvider, $httpProvider) {
        $stateProvider
          .state('/', {
            url: '/',
            templateUrl: 'views/Home/index.html',
            controller: 'HomeController'
          })
          .state('scorer', {
            url: '/scorer',
            templateUrl: 'views/Score/scorer.html',
            controller: 'ScorerController'
          })
          .state('livescores', {
            url: '/livescores',
            templateUrl: 'views/Score/livescores.html',
            controller: 'LiveScoreController'
          });
        $urlRouterProvider.otherwise('/');



        //config CORS
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        $httpProvider.defaults.transformResponse.push(function(responseData){
          return responseData;
        });

      }
    ]
  )
})();