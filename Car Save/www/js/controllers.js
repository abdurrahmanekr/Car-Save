var app = angular.module('starter.controllers', []);

app.controller('AppCtrl', function($rootScope, $timeout, $ionicModal, $scope, $ionicPlatform, $cordovaPrinter, ActivityServ, $cordovaSQLite, DateServ, $ionicPopup, PopupServ, LoadingServ) {
  	$scope.challange = [];
	$scope.openActivity = function (id) {
		try
		{
			ActivityServ.single(id, $scope).then(function(data) {
				var temp = 	"Açıklama : " + data.description +
							"<br />Tarih : " + data.date +
							"<br />Araba : " + data.car +
							"<br />Durumu : " + (data.statu=="1" ? "Aktif" : "Pasif");
		  		PopupServ.confirm(data.name, temp, "Tamam", "Düzenle").then(function(res) {
					if (res == "2") {
						$scope.openUpdateActivityModal(data);
					}
				});
			});
		}
		catch(error)
		{
			alert(error);
			PopupServ.confirm("Hata", "Bu etkilinlik Daha önceden silinmiş olabilir", "Tamam");
		}
	};
	$ionicModal.fromTemplateUrl('templates/addActivity.html', {
 	 	scope: $scope,
      	animation: 'slide-in-up'
    }).then(function(modal) {
    	$scope.modal = modal;
	});
	$ionicModal.fromTemplateUrl('templates/updateActivity.html', {
 	 	scope: $scope,
      	animation: 'slide-in-up'
    }).then(function(modal2) {
    	$scope.modalUp = modal2;
	});
	///update modal aç
	$scope.openUpdateActivityModal = function(data) {
		var time = new Date(data.date);
		$scope.time.minute.selected = time.getMinutes();
		$scope.time.hour.selected = time.getHours();
		$scope.time.date = time;

		$scope.addActivityData = {
			id : data.id,
			name : data.name,
			description : data.description,
			car : data.car,
			price : data.price,
			date : time
		};
		$scope.modalUp.show();
	}
	///update modal kapa
	$scope.closeUpdateActivityModal = function() {
		$scope.modalUp.hide();
	};
	///modal aç
	$scope.openAddActivityModal = function(time) {
		$scope.modal.show();
		$scope.selectedTime(time);
		$scope.addActivityData = {
			name : null,
			description : null,
			car : null,
			price : null,
			date : null
		};
	};
	///modal kapa
	$scope.closeAddActivityModal = function() {
		$scope.modal.hide();
	};
	///belirlenen değerler kadar dizi oluşturur
	$scope.range = function(min, max, step) {
	    step = step || 1;
    	var input = [];
	    for (var i = min; i <= max; i += step) {
	        input.push(i);
	    }
	    return input;
	};
	///Adamın seçtiği zaman
	$scope.time = {
		date : null,
		hour : {
			values : $scope.range(0,23),
			selected : 1
		},
		minute : {
			values : $scope.range(0,59),
			selected : 1
		}
	};
	///Eklenecek text dataları
	$scope.addActivityData = {
		name : null,
		description : null,
		car : null,
		price : null,
		date : null
	};

	///Adam zaman seçtiğinde 
	$scope.selectedTime = function (d) {
		var time = new Date();
		$scope.time.minute.selected = time.getMinutes();
		$scope.time.hour.selected = time.getHours();
		$scope.time.date = d;
	};
	///aktivite eklenmek istedğinde gerçekleşir
	var isNumeric = function isNumeric(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
	};
	$scope.addActivity = function () {
		///Girilenler boş kontrolü yapılıyor
		if ($scope.addActivityData.name == null || $scope.addActivityData.car == null || $scope.addActivityData.price == null) {
			var alertPopup = $ionicPopup.alert({
			     title: 'Eksik alan girdiniz!',
			     template: 'Lütfen (*) ile doldurulmuş alanlarını boş bırakmayın',
			     buttons: [{ text: 'Tamam',type : "button-royal" }]
		   	});
		}
		else if (!isNumeric($scope.addActivityData.price)) {
			var alertPopup = $ionicPopup.alert({
			     title: 'Geçersiz giriş!',
			     template: 'Lütfen para değerini sayısal olarak giriniz (,) kullanmayızın',
			     buttons: [{ text: 'Tamam',type : "button-royal" }]
		   	});
		}else{
			$scope.addActivityData.date = DateServ.add($scope);
			var data = ActivityServ.add($scope.addActivityData);
			$scope.challange = data;
			$scope.closeAddActivityModal();
			$rootScope.getStatistic();
			$rootScope.countAllTodo();
		}
	};
	$scope.updateActivity = function() {
		try
		{
			///Girilenler boş kontrolü yapılıyor
			if ($scope.addActivityData.name == null || $scope.addActivityData.car == null || $scope.addActivityData.price == null) {
				var alertPopup = $ionicPopup.alert({
				     title: 'Eksik alan girdiniz!',
				     template: 'Lütfen (*) ile doldurulmuş alanlarını boş bırakmayın',
				     buttons: [{ text: 'Tamam',type : "button-royal" }]
			   	});
			}
			else if (!isNumeric($scope.addActivityData.price)) {
				var alertPopup = $ionicPopup.alert({
				     title: 'Geçersiz giriş!',
				     template: 'Lütfen para değerini sayısal olarak giriniz (,) kullanmayızın',
				     buttons: [{ text: 'Tamam',type : "button-royal" }]
			   	});
			}else{
				$scope.addActivityData.date = DateServ.add($scope);
				var data = ActivityServ.update($scope.addActivityData);
				$scope.challange = data;
				$scope.closeUpdateActivityModal();
				$rootScope.getStatistic();
				$rootScope.countAllTodo();
			}
		}
		catch(error)
		{
			alert(error);
		}
	};
	$scope.removeActivity = function(id) {
		try
		{
			PopupServ.confirm("Uyarı!", "Bu etkilinliği silmek istiyor musunuz ?", "Sil", "Vazgeç").then(function(res) {
				if (res == "1") {
					try
					{
						ActivityServ.delete(id, $scope).then(function (res) {
							$scope.getAllTodo();
						});
					}
					catch(error)
					{
						alert(error);
					}
				}
			});
		}
		catch(error)
		{
			alert(error);
		}
	}
	$scope.$error = $error;
	///takvim değerleri
	$scope.onezoneDatepicker = {
	    date: new Date(), // MANDATORY                    
	    mondayFirst: true,
	    months:[ 'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık' ],
	    daysOfTheWeek: ["Paz","Pzt","Salı","Çar","Per","Cum","Cmt"],
	    startDate: "startDate",
	    endDate: "endDate",
	    disablePastDays: false,
	    disableSwipe: false,
	    disableWeekend: false,
	    disableDates: false,
	    disableDaysOfWeek: "disableDaysOfWeek",
	    showDatepicker: true,
	    showTodayButton: true,
	    calendarMode: true,
	    hideCancelButton: false,
	    hideSetButton: false,
	    highlights: "highlights",
	    callback: function(value){
	        $scope.openAddActivityModal(value);
	    }
	};
	$scope.getAllTodo = function () {
		//LoadingServ.show('Yükleniyor',true);
		ActivityServ.all($scope).then(function (res) {
  			$scope.challange = [];
  			
  			$timeout(function() {
  				$scope.challange = res;
				LoadingServ.hide();
  			});
  			
  		});
	};
	$ionicPlatform.ready(function() {
		try	
		{
	  		$scope.getAllTodo();
		}
		catch (error)
		{
			alert(error);			
		}
	});
});

app.controller('MenuCtrl', function($scope, $rootScope, StatisticServ, $ionicPlatform) {
	$rootScope.countMenu = 0;
	$rootScope.countAllTodo = function () {
		StatisticServ.countAllTodo($rootScope).then(function (res) {
			$rootScope.countMenu = res;
		});
	};
	$ionicPlatform.ready(function() {
		try
		{
			$rootScope.countAllTodo();
		}
		catch(error)
		{
			alert(error);		
		}
	});
});

app.controller('StatisticCtrl', function($scope, $rootScope, LoadingServ, StatisticServ) {
	$scope.countAllTodo = 0;
	$scope.priceAllTodo = 0;
	$scope.week = 0;
	$scope.weekPrice = 0;
	$scope.month = 0;
	$scope.monthPrice = 0;
	$scope.year = 0;
	$scope.yearPrice = 0;
	$rootScope.getStatistic = function () {
		try
		{
			StatisticServ.countAllTodo($scope).then(function (res) {
				$scope.countAllTodo = res;
			});

			StatisticServ.totalAllPrice($scope).then(function (res) {
				$scope.priceAllTodo = res;
			});
			///hafta
			StatisticServ.countListTodo($scope, 7).then(function (res) {
				$scope.week = res;
			});

			StatisticServ.priceListTodo($scope, 7).then(function (res) {
				$scope.weekPrice = res;
			});
			///ay
			StatisticServ.countListTodo($scope, 28).then(function (res) {
				$scope.month = res;
			});

			StatisticServ.priceListTodo($scope, 28).then(function (res) {
				$scope.monthPrice = res;
			});
			///yıl
			StatisticServ.countListTodo($scope, 365).then(function (res) {
				$scope.year = res;
			});

			StatisticServ.priceListTodo($scope, 365).then(function (res) {
				$scope.yearPrice = res;
			});
		}
		catch(error)
		{
			alert(error);
		}
	};
	$rootScope.getStatistic();
});

app.controller('SettingCtrl', function($scope) {
	$scope.setUser = {
		name : "",
		password : "",
		newPassword : ""
	};
	$scope.updateSetting = function (data) {
		if (data.name=="" || data.password == "" || data.newPassword == "") {
			console.log("biri boş");
		}else{
			console.log(data);
		}
	};
});

app.controller('ActivitiesCtrl', function($scope, ActivityServ, LoadingServ, DateServ, $ionicModal, $timeout, PopupServ, StatisticServ) {
	$scope.challange = [];
	$scope.activites = 0;
	$scope.deletedActivites = 0;
	try
	{
		StatisticServ.countAllTodo($scope).then(function  (res) {
			$scope.activites = res;
		});
		StatisticServ.countDeletedActivity($scope).then(function  (res) {
			$scope.deletedActivites = res;
		});
	}
	catch(error)
	{
		alert(error);
	}
	$scope.range = function(min, max, step) {
	    step = step || 1;
    	var input = [];
	    for (var i = min; i <= max; i += step) {
	        input.push(i);
	    }
	    return input;
	};
	$ionicModal.fromTemplateUrl('templates/updateActivity.html', {
 	 	scope: $scope,
      	animation: 'slide-in-up'
    }).then(function(modal2) {
    	$scope.modalUp = modal2;
	});
	var isNumeric = function isNumeric(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
	};
	$scope.time = {
		date : null,
		hour : {
			values : $scope.range(0,23),
			selected : 1
		},
		minute : {
			values : $scope.range(0,59),
			selected : 1
		}
	};
	$scope.openActivity = function (id) {
		try
		{
			ActivityServ.single(id, $scope).then(function(data) {
				var temp = 	"Açıklama : " + data.description +
							"<br />Tarih : " + data.date +
							"<br />Araba : " + data.car +
							"<br />Durumu : " + (data.statu=="1" ? "Aktif" : "Pasif");
		  		PopupServ.confirm(data.name, temp, "Tamam", "Düzenle").then(function(res) {
					if (res == "2") {
						$scope.openUpdateActivityModal(data);
					}
				});
			});
		}
		catch(error)
		{
			alert(error);
			PopupServ.confirm("Hata", "Bu etkilinlik daha önceden silinmiş olabilir", "Tamam");
		}
	};
	$scope.openUpdateActivityModal = function(data) {
		var time = new Date(data.date);
		$scope.time.minute.selected = time.getMinutes();
		$scope.time.hour.selected = time.getHours();
		$scope.time.date = time;

		$scope.addActivityData = {
			id : data.id,
			name : data.name,
			description : data.description,
			car : data.car,
			price : data.price,
			date : new Date(data.date)
		};
		$scope.modalUp.show();
	};
	$scope.closeUpdateActivityModal = function() {
		$scope.modalUp.hide();
	};
	$scope.updateActivity = function() {
		try
		{
			///Girilenler boş kontrolü yapılıyor
			if ($scope.addActivityData.name == null || $scope.addActivityData.car == null || $scope.addActivityData.price == null) {
				var alertPopup = $ionicPopup.alert({
				     title: 'Eksik alan girdiniz!',
				     template: 'Lütfen (*) ile doldurulmuş alanlarını boş bırakmayın',
				     buttons: [{ text: 'Tamam',type : "button-royal" }]
			   	});
			}
			else if (!isNumeric($scope.addActivityData.price)) {
				var alertPopup = $ionicPopup.alert({
				     title: 'Geçersiz giriş!',
				     template: 'Lütfen para değerini sayısal olarak giriniz (,) kullanmayızın',
				     buttons: [{ text: 'Tamam',type : "button-royal" }]
			   	});
			}else{
				$scope.addActivityData.date = DateServ.add($scope);
				var data = ActivityServ.update($scope.addActivityData);
				$scope.challange = data;
				$scope.closeUpdateActivityModal();
			}
		}
		catch(error)
		{
			alert(error);
		}
	};
	$scope.removeActivity = function(id) {
		try
		{
			PopupServ.confirm("Uyarı!", "Bu etkilinliği silmek istiyor musunuz ?", "Sil", "Vazgeç").then(function(res) {
				if (res == "1") {
					try
					{
						ActivityServ.delete(id, $scope).then(function (res) {
							$scope.getAllTodo();
						});
					}
					catch(error)
					{
						alert(error);
					}
				}
			});
		}
		catch(error)
		{
			alert(error);
		}
	};
	$scope.getAllTodo = function () {
		LoadingServ.show('Yükleniyor',true);
		ActivityServ.allDeleted($scope).then(function (res) {
  			$scope.challange = [];
  			
  			$timeout(function() {
  				$scope.challange = res;
				LoadingServ.hide();
  			});
  			
  		});
	};
	$scope.getAllTodo();
});