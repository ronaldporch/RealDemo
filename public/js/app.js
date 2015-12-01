var app = angular.module('RealDemo', ['ui.router', 'angular-loading-bar', 'ui.bootstrap'])
app.config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider){
	$urlRouterProvider.otherwise('/')
	$stateProvider
		.state('home', {
			url: '/',
			templateUrl: 'partials/home.html',
			controller: 'HomeController'
		})
}])
app.controller('HomeController', ['$scope', function($scope){
	$scope.name = "Ronald"
}])