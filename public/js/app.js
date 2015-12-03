var app = angular.module('RealDemo', ['ui.router', 'angular-loading-bar', 'ui.bootstrap', 'uiGmapgoogle-maps', 'ngAnimate'])
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
app.controller('MapController', ['$scope', 'homes', 'googleAPI', '$stateParams', '$state', function($scope, homes, googleAPI, $stateParams, $state){
	$scope.locale = $stateParams.locale
	$scope.locations = function(val){
		return googleAPI.getLocations(val).then(function(res){
			console.log(res.data)
			return res.data.results.map(function(data){
				return data.formatted_address
			})
		})
	}

	$scope.getHomes = function(){
		var address = $scope.address.replace(/ /g, "-");
		address = address.replace(/,/g, "");
		console.log(address)
		$state.go('map', {locale: address})
	}
	$scope.closeHomeInfo = function(){
		$scope.home = undefined
	}
	$scope.getAllHomes = function(address){
		homes.getHomes(address).then(
			function(res){
				$scope.homes = res.data.map(function(item){
					var location = {}
					location.id = item.id
					location.latitude = item.lat
					location.longitude = item.lng
					location.title = item.street
					return location
				})
				console.log($scope.homes)
			}, 
			function(err){
				console.log(err)
			})
	}

	$scope.showTitle = function(a,b,c){
		$scope.map.center.latitude = c.latitude
		$scope.map.center.longitude = c.longitude
		$scope.map.zoom = 16
		homes.getHome(c.id).then(function(res){
			$scope.home = res.data[0]
		})
		console.log(c)
	}
	$scope.getLocationInfo = function(){
		var address = $scope.locale.replace(/-/g, " ");
		googleAPI.getLocations(address).then(function(res){
			$scope.geoLocation = res.data.results[0].geometry.location
			$scope.bounds = res.data.results[0].geometry.bounds
			$scope.getAllHomes(address);
			$scope.map = { 
				center: 
				{ 
					latitude: $scope.geoLocation.lat, 
					longitude: $scope.geoLocation.lng 
				},
				bounds: 
				{
					northeast: 
					{
						latitude: $scope.bounds.northeast.lat,
						longitude: $scope.bounds.northeast.lng
					},
					southwest: 
					{
						latitude: $scope.bounds.southwest.lat,
						longitude: $scope.bounds.southwest.lng
					},
				},
				zoom: 10 };
			console.log(res.data.results[0].geometry.location)
		}, function(err){
			console.log(err)
		})
	}
	$scope.refresh = function(){
		$scope.map.center = { latitude: $scope.geoLocation.lat, longitude: $scope.geoLocation.lng }
	}
	$scope.getLocationInfo()
}])
app.factory('homes', ['$http', function($http){
	var o = {}
	o.getHomes = function(address){
		return $http.get('/api/homes/address/' + address)
	}
	o.getHome = function(id){
		return $http.get('/api/homes/id/' + id)
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