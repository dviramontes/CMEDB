/*global angular, module*/

'use strict';

angular.module('clienterrordashboard', [ 'ngRoute','clienterrordashboard-main'])
  .config(function ($routeProvider) {
    $routeProvider
      .otherwise({
        redirectTo: '/'
      });
  });