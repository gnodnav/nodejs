scotchApp.controller('TKController', function ($scope, $http, $location, $localStorage, $routeParams) {
	$scope.itemsPerPage = 8;
	$scope.pagedItems = [];
	$scope.currentPage = 0;
	$scope.hideForm = true;
	$scope.hideFormUpdate = true;
	$scope.editHide = true;
	$scope.hideBtn = true;
	
	if ($routeParams.n)
		$scope.swProductTable = $routeParams.n
	else
		$scope.swProductTable = 'sanpham';

	if ($localStorage.userName === "") {
		$location.path("/taikhoan");
	} else {
		$scope.userCurrent = $localStorage.userName;
		$location.path("/dashboard");
		if ($routeParams.n)
			$location.update_path(`/dashboard/${$routeParams.n}`);
		if ($routeParams.num)
			$location.update_path(`/dashboard/${$routeParams.n}/table/${$routeParams.num}`);
	}
	$scope.logOut = function () {
		$localStorage.userName = "";
		$location.path("/taikhoan");
	}
	$scope.submitForm = function () {
		var data = {
			event: "login",
			username: $scope.username,
			password: $scope.password
		};
		$http.post('/events', JSON.stringify(data))
			.then(function (response) {
				if (response.data) {
					if (response.data == "TRUE") {
						$localStorage.userName = data.username;
						$scope.userCurrent = data.username;
						$location.path(`/dashboard`);

					} else {
						alert("Incorrect username or password.");
						$scope.username = "";
						$scope.password = "";
					}
				}
			}, function (response) {
				console.log(response.statusText);
			});
	}
	$http({
		method: "GET",
		url: "/trangchu"
	}).then(function mySuccess(response) {
		$scope.products = response.data;
		$scope.parsePage($scope.products);
	}, function myError(response) {
		$scope.myWelcome = response.statusText;
	});
	
	$scope.parsePage = function (data) {
		var numPage = data.length / $scope.itemsPerPage + 1;
		for (var i = 0; i < numPage - 2; i++) {
			$scope.pagedItems.push(data.splice(0, $scope.itemsPerPage));
		}
		$scope.pagedItems.push(data.splice(0, data.length));

		if ($routeParams.num)
			$scope.currentPage = parseInt($routeParams.num, 10) - 1;
	}
	$scope.arrNumPage = function (numPage) {
		var pageNum = [];
		for (var i = 0; i < numPage; i++) {
			pageNum.push(i);
		}
		return pageNum;
	}
	$scope.prevPage = function () {
		if ($scope.currentPage > 0) {
			$scope.currentPage--;
			$location.update_path(`dashboard/${this.swProductTable}/table/${this.currentPage + 1}`);

		}
	};
	$scope.nextPage = function () {
		if ($scope.currentPage < $scope.pagedItems.length - 1) {
			$scope.currentPage++;
			$location.update_path(`dashboard/${this.swProductTable}/table/${this.currentPage + 1}`);
		}
	};
	$scope.setPage = function () {
		$scope.currentPage = this.n;
		$location.update_path(`dashboard/${this.swProductTable}/table/${this.currentPage + 1}`);
	};
	$scope.tableProduct = function () {
		$scope.swProductTable = 'sanpham';
		$location.update_path(`dashboard/sanpham`);
	}
	$scope.tableUpload = function () {
		$scope.swProductTable = 'upload';
		$location.update_path(`dashboard/upload`);
	}
	$scope.tableCustomer = function name() {
		$scope.swProductTable = 'khachhang';
		$location.update_path(`dashboard/khachhang`);
	}
});
scotchApp.controller('uploadFile', ['Upload', '$window', '$scope', 'Notification', function (Upload, $window, $scope, Notification) {
	var vm = this;
	$scope.productType = "Phone";
	vm.submit = function () { //function to call on form submit
		if (vm.upload_form.file.$valid) { //check if from is valid
			vm.upload(vm.file); //call upload function
		}
	}
	vm.upload = function (file) {
		Upload.upload({
			url: 'http://localhost:8000/upload', //webAPI exposed to upload the file
			data: {
				file: file,
				name: $scope.productName,
				price: $scope.productPrice,
				description: $scope.productDescription,
				type: $scope.productType
			} //pass file as data, should be user ng-model
		}).then(function (resp) { //upload function returns a promise
			if (resp.data.error_code === 0) { //validate success
				Notification({ message: `Bạn đã thêm ${$scope.productName}`, title: 'Thông báo', delay: 2000 });
				$scope.productName = '';
				$scope.productPrice = '';
				$scope.productDescription = '';
				vm.file = null;
			} else {
				$window.alert('an error occured');
			}
		}, function (resp) { //catch error
			console.log('Error status: ' + resp.status);
			$window.alert('Error status: ' + resp.status);
		}, function (evt) {
			console.log(evt);
			var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
			console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
			vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
		});
	};
}]);

