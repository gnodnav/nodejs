scotchApp.controller('KHController', function ($scope, $http, $location, $routeParams, Notification, SweetAlert) {
	$scope.itemsPerPage = 8;
	$scope.pagedItems = [];
	$scope.currentPage = 0;
	$scope.hideForm = true;
	$scope.hideFormUpdate = true;
	$scope.editHide = true;
	$scope.hideBtn = true;
	$http({
		method: "GET",
		url: "/khachhang"
	}).then(function mySuccess(response) {
		$scope.names = response.data;
		$scope.parsePage($scope.names);
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
	$scope.orderByMe = function (x) {
		$scope.myOrderBy = x;
	}
	$scope.arrNumPage = function (numPage) {
		var pageNum = [];
		for (var i = 0; i < numPage; i++) {
			pageNum.push(i);
		}
		return pageNum;
	}
	$scope.submitForm = function () {
		var data = {
			event: "insert",
			name: $scope.newName,
			country: $scope.newCountry
		}
		if (data.name != null && data.country != null) {
			$http.post("/events", data)
				.then(function mySuccess(response) {
					$scope.newCountry = "";
					$scope.newName = "";
					$scope.pagedItems[$scope.currentPage].unshift(data);
					Notification({ message: `Bạn đã thêm ${data.name}`, title: 'Thông báo', delay: 2000 });
				}, function (response) {
					console.log(response.statusText);
					SweetAlert.swal(`Thất bại`);
				});
		}
	}
	$scope.removeCustomer = function (x) {
		var pageCurrent = $scope.pagedItems[$scope.currentPage];
		var data = {
			event: "delete",
			name: pageCurrent[pageCurrent.indexOf(x)].name,
			country: pageCurrent[pageCurrent.indexOf(x)].country
		}
		$http.post("/events", JSON.stringify(data))
			.then(function mySuccess(response) {
				$scope.pagedItems[$scope.currentPage].splice($scope.pagedItems[$scope.currentPage].indexOf(x), 1);
				if ($scope.pagedItems[$scope.currentPage].length == 0) {
					$scope.pagedItems.splice($scope.currentPage, 1);
				}
				Notification({ message: `Bạn đã xóa ${data.name}`, title: 'Thông báo', delay: 2000 });
			}, function (response) {
				console.log(response.statusText);
				SweetAlert.swal(`Thất bại`);
			});
	}
	var index;
	$scope.getItem = function (x) {
		index = x;
		$scope.activeBtn = x;
		$scope.kaka = { 'color': '#4CB748' };
		$scope.nameUpdate = x.name;
		$scope.countryUpdate = x.country;
	}
	$scope.updateCustomer = function () {
		if (!index) index = $scope.pagedItems[$scope.currentPage][0];
		var data = {
			event: "update",
			nameUpdate: $scope.nameUpdate,
			countryUpdate: $scope.countryUpdate,
			nameCurrent: $scope.pagedItems[$scope.currentPage][$scope.pagedItems[$scope.currentPage].indexOf(index)].name,
			countryCurrent: $scope.pagedItems[$scope.currentPage][$scope.pagedItems[$scope.currentPage].indexOf(index)].country
		}

		$http.post("/events", JSON.stringify(data))
			.then(function mySuccess(response) {
				$scope.pagedItems[$scope.currentPage][$scope.pagedItems[$scope.currentPage].indexOf(index)].name = $scope.nameUpdate;
				$scope.pagedItems[$scope.currentPage][$scope.pagedItems[$scope.currentPage].indexOf(index)].country = $scope.countryUpdate;
				Notification({ message: `Bạn đã sửa ${data.nameUpdate}`, title: 'Thông báo', delay: 2000 });
				$scope.nameUpdate = '';
				$scope.countryUpdate = '';
			}, function (response) {
				console.log(response.statusText);
				SweetAlert.swal(`Thất bại`);
			});
	}
	$scope.delete = function () {
		$scope.editHide = false;
		$scope.icon = false;
		$scope.hideFormUpdate = true;
		$scope.hideForm = true;
		$scope.deleteStyle = { 'color': '#4CB748' };
		$scope.editStyle = { 'color': '#0C4CA1' };
		$scope.addStyle = { 'color': '#0C4CA1' };
	}
	$scope.edit = function () {
		$scope.editHide = false;
		$scope.icon = true;
		$scope.hideFormUpdate = false;
		$scope.hideForm = true;
		$scope.editStyle = { 'color': '#4CB748' };
		$scope.deleteStyle = { 'color': '#0C4CA1' };
		$scope.addStyle = { 'color': '#0C4CA1' };
	}
	$scope.add = function () {
		$scope.editHide = true;
		$scope.hideForm = false;
		$scope.hideFormUpdate = true;
		$scope.addStyle = { 'color': '#4CB748' };
		$scope.editStyle = { 'color': '#0C4CA1' };
		$scope.deleteStyle = { 'color': '#0C4CA1' };
	}
	$scope.funHideBtn = function () {
		$scope.editHide = true;
		$scope.icon = true;
		$scope.hideFormUpdate = true;
		$scope.hideForm = true;
		$scope.hideBtn = ($scope.hideBtn == true) ? false : true;

	}
	$scope.confirm = function (x) {
		SweetAlert.swal({
			title: `Bạn có chắc muốn xóa ${x.NAME}?`, //Bold text
			text: "Dữ liệu sẽ bị xóa khỏi database	", //light text
			type: "warning", //type -- adds appropiriate icon
			showCancelButton: true, // displays cancel btton
			confirmButtonColor: "#0C4CA1",
			confirmButtonText: "Tôi chắc chắn!",
			closeOnConfirm: true, //do not close popup after click on confirm, usefull when you want to display a subsequent popup
			closeOnCancel: true,
			customClass: 'modal-swal'

		}, function (isConfirm) { //Function that triggers on user action.
			if (isConfirm) {
				$scope.removeCustomer(x);
			}
		});
	}
});
