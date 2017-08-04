scotchApp.controller('TKController', function ($scope, $http, $location, $localStorage, $routeParams, Notification) {
	$scope.itemsPerPage = 8;
	$scope.pagedItems = [];
	$scope.currentPage = 0;
	$scope.confirm = true;
	$scope.Form = true;
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
	$scope.tableChangePass = function () {
		$scope.swProductTable = 'doimatkhau';
		$location.update_path(`dashboard/doimatkhau`);
	}
	$scope.changePassword = function () {
		var data = {
			event: 'changepassword',
			user: $localStorage.userName,
			currentPass: this.curPass,
			newPass: this.newPass
		}
		$http.post('/events', JSON.stringify(data))
			.then(function (response) {
				if (response.data) {
					if (response.data.error_code == 0) {
						Notification({ message: `Bạn đã đổi mật khẩu ${data.user}`, title: 'Thông báo', delay: 2000 });
						$rootScope.curPass = '';
						this.newPass = '';
						this.confirmPass = '';
					} else if (response.data.error_code == 3) {
						this.curPass = '';
						swal(`Mật Khẩu Cũ Không Đúng`);
					}
					else {
						swal(`Thất bại`);
					}
				}
			}, function (response) {
				console.log(response.statusText);
				swal(`Thất bại`);
			});
	}
	$scope.submitFormRegister = function () {
		var data = {
			event: "register",
			username: $scope.register_username,
			password: $scope.register_password,
			email :$scope.register_email,
			type : 'mod'
		};
		$http.post('/events', JSON.stringify(data))
			.then(function (response) {
				if (response.data) {
					if (response.data.error_code == 0) {
						$scope.Form = true;
						Notification({ message: `Đăng ký thành công`, title: 'Thông báo', delay: 2000 });
					} else {
						console.log(response.data.err_desc)
					}
				}
			}, function (response) {
				console.log(response.statusText);
			});
	}
});

