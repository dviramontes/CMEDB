/*global angular, module*/

'use strict';

angular.module('clienterrordashboard-main', ['ngRoute'])
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'index.html',
                controller: 'MainCtrl'
            });
    })
    .factory('socket', function(socketFactory) {
        return socketFactory();
    })
    .service('API', function($http) {
        return {
            getErrors: function(num) {
                return $http.get("http://0.0.0.0:3000/geterrors").then(function(response) {
                    if (response.data.error) {
                        return null;
                    } else {
                        return response.data;
                    }
                });
            },
	        logSize: function () {
		        return $http.get("http://0.0.0.0:3000/logsize").then(function(response) {
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
            console.log(data);
            $scope.data = data;
        });
		API.logSize().then(function(data) {
			console.log(data);
			$scope.logsize = data;
		});

    });
