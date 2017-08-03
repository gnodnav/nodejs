scotchApp.controller('TCController', function ($scope, $rootScope, $interval, $http, $localStorage) {
	$scope.cart = [];
	$scope.productType = 'Phone';
	$scope.time = new Date().toLocaleTimeString();
	$rootScope.numProductCart = 0;
	if ($localStorage)
		$rootScope.numProductCart = 0;
	else {
		$rootScope.numProductCart = localStorage.lenght;
		$scope.cart = localStorage;
	}
	$interval(function () { $scope.time = new Date().toLocaleTimeString(); }, 1000);
	$http({
		method: "GET",
		url: "/trangchu"
	}).then(function mySuccess(response) {
		$scope.products = response.data;
	}, function myError(response) {
		$scope.myWelcome = response.statusText;
	});
	var temp;
	$scope.addToCart = function (x) {
		// $scope.cart.push(x);
		// $rootScope.numProductCart +=1;
		// $localStorage = $scope.cart;
		// temp = x;
		// console.log($localStorage)
		swal("HEY", "Message", "warning")
	}
	$scope.continue = function () {
		$scope.cart.push(x);
		$rootScope.numProductCart += 1;
		$localStorage = $scope.cart;
	}
});
