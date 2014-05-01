'use strict';

angular.module('clienterrordashboard', ['ngRoute'])
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'index.html',
                controller: 'MainCtrl'
            });
    })
    .service('API', function($http) {
        return {
            getErrors: function(num) {
                return $http.get("/geterrors/" + num).then(function(response) {
                    if (response.data.error) {
                        return null;
                    } else {
                        return response.data;
                    }
                });
            }
        }
    })
    .controller('MainCtrl', function($scope, $http, API) {

        API.getErrors(5).then(function(data) {
            $scope.data = data;
        });

        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
        
    });
