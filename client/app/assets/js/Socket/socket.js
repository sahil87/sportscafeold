'use strict';
angular.module('app')

//Here LoopBackAuth service must be provided as argument for authenticating the user
  .factory('socket', ['$rootScope', function ($rootScope) {
    var socket = io.connect('http://localhost:3000');
    console.log("socket created");


    //return client socket object
    return socket;
  }]);  