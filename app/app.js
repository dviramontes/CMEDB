/*global angular, module*/

'use strict';

angular.module('clienterrordashboard', [ 'ngRoute','clienterrordashboard-main','templates' ])
  .config(function ($routeProvider) {
    $routeProvider
      .otherwise({
        redirectTo: '/'
      });
  });