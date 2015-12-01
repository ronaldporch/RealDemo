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
app.controller('HomeController', ['$scope', 'homes', function($scope, homes){
	$scope.name = "Ronald"
	$scope.address = ""
	$scope.getHomes = function(){
		var address = $scope.address.replace(/ /g, "-");
		address = address.replace(/,/g, "");
		console.log(address)
		homes.getHomes(address).then(
			function(res){
				console.log(res.data)
				$scope.homes = res.data
			}, 
			function(err){
				console.log(err)
			})
	}
}])
app.factory('homes', ['$http', function($http){
	var o = {}
	o.getHomes = function(address){
		return $http.get('/api/homes/' + address)
	}
	return o
}])