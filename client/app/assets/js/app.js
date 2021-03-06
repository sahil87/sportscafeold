;(function(){


  angular
    .module('app', [
      'ngRoute',
      'ngResource',
      'ui.router',
      'ui.bootstrap',
      'ngCookies',
      'ngToast'
    ])
    .factory('APILogin', [function() {
      var sessionInjector = {
        request: function(config) {
          config.headers['api_key'] = "sportscafe";
          config.headers['api_secret'] = "sportsTMZaFam59d@F9c#V1G9UEL17)Odzcafe";
          config.headers['Authorization'] = "Basic c3BvcnRzY2FmZTpzcG9ydHNUTVphRmFtNTlkQEY5YyNWMUc5VUVMMTcpT2R6Y2FmZQ==";
          return config;
        }
      };
      return sessionInjector;
    }])
    //states
    .config(
    [
      '$stateProvider', '$urlRouterProvider', '$httpProvider',
      function($stateProvider, $urlRouterProvider, $httpProvider) {
        $stateProvider
          .state('/', {
            url: '/',
            templateUrl: 'views/Score/scorer.html',
            controller: 'HomeController'
          })
          .state('scorer', {
            url: '/scorer',
            templateUrl: 'views/Score/scorer.html',
            controller: 'HomeController'
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

        $httpProvider.interceptors.push('APILogin');

      }
    ]
  )
})();