var app = angular.module('RealDemo', ['ui.router', 'angular-loading-bar', 'ui.bootstrap', 'uiGmapgoogle-maps'])
app.config(['$urlRouterProvider', '$stateProvider', 'uiGmapGoogleMapApiProvider', function($urlRouterProvider, $stateProvider,uiGmapGoogleMapApiProvider){
	$urlRouterProvider.otherwise('/')
	$stateProvider
		.state('home', {
			url: '/',
			templateUrl: 'partials/home.html',
			controller: 'HomeController'
		})
		.state('map', {
			url: '/homes/:locale',
			templateUrl: 'partials/map.html',
			controller: 'MapController'
		})
	uiGmapGoogleMapApiProvider.configure({
		v: '3.20',
		libraries: 'weather, geometry, visualization'
	});
}])
app.controller('HomeController', ['$scope', 'homes', 'googleAPI', '$state', function($scope, homes, googleAPI, $state){
	$scope.name = "Ronald"
	$scope.address = ""
	$scope.locations = function(val){
		console.log(val)
		return googleAPI.getLocations(val).then(function(res){
			console.log(res.data)
			return res.data.results.map(function(item){
				return item.formatted_address;
			})
		}, function(err){
			console.log(err)
		})
	}
	$scope.getHomes = function(){
		var address = $scope.address.replace(/ /g, "-");
		address = address.replace(/,/g, "");
		console.log(address)
		$state.go('map', {locale: address})
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
app.controller('MapController', ['$scope', 'homes', 'googleAPI', '$stateParams', function($scope, homes, googleAPI, $stateParams){
	$scope.locale = $stateParams.locale
	$scope.getLocationInfo = function(){
		var address = $scope.locale.replace(/-/g, " ");
		googleAPI.getLocations(address).then(function(res){
			console.log(res.data)
		}, function(err){
			console.log(err)
		})
	}
	$scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };
	$scope.getLocationInfo()
}])
app.factory('homes', ['$http', function($http){
	var o = {}
	o.getHomes = function(address){
		return $http.get('/api/homes/' + address)
	}
	return o
}])
app.factory('googleAPI', ['$http', function($http){
	var o = {}
	o.getLocations = function(val){
		return $http.get('//maps.googleapis.com/maps/api/geocode/json', {
			params: {
				address: val,
				sensor: false
			}
		})
	}
	return o
}])