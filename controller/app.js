var scotchApp = angular.module('scotchApp', ['ui-notification', 'oitozero.ngSweetAlert', 'ngRoute', 'ngFileUpload', 'ngAnimate', 'ngStorage', 'ngLocationUpdate']);
scotchApp.config(function ($routeProvider) {
	$routeProvider
		// route for the home page
		.when('/', {
			templateUrl: 'templates/trangchu.html',
			controller: 'TCController'
		})
		.when('/trangchu', {
			templateUrl: 'templates/trangchu.html',
			controller: 'TCController'
		})
		// route for the about page
		.when('/khachhang', {
			templateUrl: 'templates/khachhang.html',
			controller: 'KHController'
		})
		// .when('/khachhang/:num', {
		// 	templateUrl: 'templates/khachhang.html',
		// 	controller: 'KHController'
		// })
		// route for the contact page
		.when('/hopdong', {
			templateUrl: 'templates/hopdong.html',
			controller: 'HDController'
		})
		.when('/taikhoan', {
			templateUrl: 'templates/taikhoan.html',
			controller: 'TKController'
		})
		.when('/dashboard', {
			templateUrl: 'templates/dashboard/index.html',
			controller: 'TKController'
		})
		.when('/dashboard/:n', {
			templateUrl: 'templates/dashboard/index.html',
			controller: 'TKController'
		})
		.when('/dashboard/:n/table/:num', {
			templateUrl: 'templates/dashboard/index.html',
			controller: 'TKController'
		})
	/*.when('/dashboard/sanpham/:num', {
		templateUrl: 'templates/dashboard/index.html',
		controller: 'TKController'
	})*/

});