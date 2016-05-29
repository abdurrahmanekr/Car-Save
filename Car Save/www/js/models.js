var app = angular.module('starter.models',[])

app.factory("ActivityServ",function($cordovaSQLite) {
	///private herşeyi getir
	var allTodo = function() {
		var promise;
		var sql = "SELECT * FROM Todo WHERE statu='1'";
        var existValue = [];

        $cordovaSQLite.execute($db, sql).then(function(res) {
        	if (res.rows.length > 0)
                for(var i = 0; i < res.rows.length ; i++){
                    existValue.push({
			  			id : res.rows.item(i).id,
			  			name : res.rows.item(i).name,
			  			date : res.rows.item(i).date,
			  			car : res.rows.item(i).car,
			  			price : res.rows.item(i).price,
			  			statu : res.rows.item(i).statu,
			  			description : res.rows.item(i).description
            		});
                }
        });
        return existValue;
	};
	///Tüm todolar getiriliyor
	var selectAllTodo = function($scope) {
		var promise;
		var sql = "SELECT * FROM Todo WHERE statu='1'";
        var existValue = [];

	    $scope = $scope || $rootScope.$new();
        promise = $cordovaSQLite.execute($db, sql).then(function(res) {
        	if (res.rows.length > 0)
                for(var i = 0; i < res.rows.length ; i++){
                    existValue.push({
			  			id : res.rows.item(i).id,
			  			name : res.rows.item(i).name,
			  			date : res.rows.item(i).date,
			  			car : res.rows.item(i).car,
			  			price : res.rows.item(0).price,
			  			statu : res.rows.item(i).statu,
			  			description : res.rows.item(i).description
            		});
                }
            $scope.mesaj = res.rows.item;
            return existValue;
        });

		return promise;
	};
	///Bu silinmişleride getirir
	var selectAllDeletedTodo = function($scope) {
		var promise;
		var sql = "SELECT * FROM Todo";
        var existValue = [];

	    $scope = $scope || $rootScope.$new();
	    try
	    {
	        promise = $cordovaSQLite.execute($db, sql).then(function(res) {
	        	if (res.rows.length > 0)
	                for(var i = 0; i < res.rows.length ; i++){
	                    existValue.push({
				  			id : res.rows.item(i).id,
				  			name : res.rows.item(i).name,
				  			date : res.rows.item(i).date,
				  			car : res.rows.item(i).car,
				  			price : res.rows.item(0).price,
				  			statu : res.rows.item(i).statu,
				  			description : res.rows.item(i).description
	            		});
	                }
	            $scope.mesaj = res.rows.item;
	            return existValue;
	        });
	    }
	    catch(error)
	    {
	    	alert(error);
	    }

		return promise;
	};
	///Idye göre todo getirir 
	var resultIdTodo = function(id, $scope) {
		var promise;
		var sql = "SELECT * FROM Todo WHERE id="+id;
        var existValue = {};

	    $scope = $scope || $rootScope.$new();
        promise = $cordovaSQLite.execute($db, sql).then(function(res) {
        	if (res.rows.length > 0)
                    existValue = {
			  			id : res.rows.item(0).id,
			  			name : res.rows.item(0).name,
			  			date : res.rows.item(0).date,
			  			car : res.rows.item(0).car,
			  			price : res.rows.item(0).price,
			  			statu : res.rows.item(0).statu,
			  			description : res.rows.item(0).description
            		};
            $scope.mesaj = res.rows.item;
            return existValue;
        });

		return promise;
	};
	///Ekleme fonksiyonu
	var addResult = function (data) {
		///Todo tablosuna ekleme yapılıyor ile insert
		var sql = 'INSERT INTO Todo (name, description, car, price, date, statu) VALUES ("'+ data.name +'","'+ data.description +'","'+ data.car +'",'+ data.price +',"'+ data.date +'", "1")';
		try
		{
			$cordovaSQLite.execute($db, sql).then(function(result) {
	        	$scope.$error = result;
	        }, function(error) {
	        	$scope.$error = result;
	        });
		}
		catch (error)
		{
			alert(error);
		}

		return allTodo();
	};
	///Güncelleme fonksiyonu
	var updateResult = function(data) {
		var sql = "UPDATE Todo SET name='"+ data.name +"', description='"+ data.description +"', car='"+ data.car +"', price="+ data.price +", date='"+ data.date+"' WHERE id=" + data.id;
        try
        {
	        $cordovaSQLite.execute($db, sql).then(function(res) {
	        });
        }
        catch (error)
        {
        	alert(error);
        }
      	return allTodo();
	};
	///delete komutu yani statu değerini 2 yapar
	var deleteTodo = function (id, $scope) {
		var sql = "UPDATE Todo SET statu=\"2\" WHERE id=" + id;
		var existValue = "";
		var promise;

		$scope = $scope || $rootScope.$new();

        promise = $cordovaSQLite.execute($db, sql).then(function(res) {
			existValue = res;
			return existValue;
        });
      	
      	return promise;
	}

	return {
		single : resultIdTodo,
		all : selectAllTodo,
		add: addResult,
		update : updateResult,
		delete : deleteTodo,
		allDeleted : selectAllDeletedTodo
	}
});

app.factory("DateServ", function () {
	var result = function(scope) {
		var y = new Date(scope.time.date);
		var h = scope.time.hour.selected;
		var m = scope.time.minute.selected;
		h = parseInt(h/10) == 0 ? ("0" + String(h)) : h;
		m = parseInt(m/10) == 0 ? ("0" + String(m)) : m;
		//string parse
		var year = y.getUTCFullYear();
		var month = (y.getMonth()+1);
		month = parseInt(month/10)==0 ? ("0" + String(month)) : month;
		var day = y.getDate();
		day = parseInt(day/10)==0 ? ("0" + String(day)) : day;
		//string parse

		var date = year + "-" + month + "-" + day;
		var datetime = h + ":" + m + ":00";
		var parseDate = date + " " + datetime;
		return parseDate;
	};
	///date to işlenebilecek date
	var parseDate = function  (date) {
		//yıl ay gün
		var year = date.getUTCFullYear();
		var month = (date.getMonth()+1);
		month = parseInt(month/10)==0 ? ("0" + String(month)) : month;
		var day = date.getDate();
		day = parseInt(day/10)==0 ? ("0" + String(day)) : day;
		///saat dakika
		var h = date.getHours();
		h = parseInt(h/10) == 0 ? ("0" + String(h)) : h;
		var m = date.getMinutes();
		m = parseInt(m/10) == 0 ? ("0" + String(m)) : m;

		var dateExist = year + "-" + month + "-" + day;
		var datetimeExist = h + ":" + m + ":00";
		return dateExist + " " + datetimeExist;
	}

	return {
		add : result,
		parseDate : parseDate
	};
});

app.factory("PopupServ",function ($ionicPopup) {
	var result = function 	(t, c, b1, b2) {
		var b2 = b2 || null;
		var e;
		if (b2 == null)
			$ionicPopup.alert({
			    title: t,
			    template: c,
			    buttons: [
			    	{ 
			    		text: b1,
		    			type : "button-dark",
	    				onTap : function(a) {
	    					e = "1";
			    		}
			    	}
			    ]
			});
		else
			$ionicPopup.alert({
			    title: t,
			    template: c,
			    buttons: [
			    	{
			    		text: b1,
			    		type : "button-dark",
			    		onTap : function(a) {
	    					e = "1";
			    		}
			    	},
			    	{ 
			    		text: b2,
			    		type : "button-balanced",
			    		onTap : function(a) {
	    					e = "2";
			    		}
			    	}
		    	]
			});

		return e;
	};
	var confirm = function 	(t, c, b1, b2) {
		var b2 = b2 || null;
		var e;
		if (b2 == null)
			return $ionicPopup.confirm({
			    title: t,
			    template: c,
			    buttons: [
			    	{ 
			    		text: b1,
		    			type : "button-dark",
	    				onTap : function(a) {
	    					e = "1";
			    		}
			    	}
			    ]
			}).then(function() {
				return e;
			});
		else
			return $ionicPopup.confirm({
			    title: t,
			    template: c,
			    buttons: [
			    	{
			    		text: b1,
			    		type : "button-dark",
			    		onTap : function(a) {
	    					e = "1";
			    		}
			    	},
			    	{ 
			    		text: b2,
			    		type : "button-balanced",
			    		onTap : function(a) {
	    					e = "2";
			    		}
			    	}
		    	]
			}).then(function() {
				return e;
			});
	};
	return {
		open : result,
		confirm : confirm
	};
});

app.factory('LoadingServ',function ($ionicLoading) {
	return{
		show : function(e,w) {
			w = (w == true) ? '<ion-spinner icon="lines"/>' : '';
		  	$ionicLoading.show({
			    template: '<p>'+e+'</p>'+w,
			    animation: 'fade-in',
			    transclude: true,
    			replace: true,
			    showBackdrop: true,
			    maxWidth: 200,
			    showDelay: 0
		  	});
		},
		hide : function () {
			$ionicLoading.hide();
		}

	}
})

app.factory('StatisticServ',function ($cordovaSQLite, DateServ) {
	///toplam oluşturulan aktivite sayısı
	var countActivity = function ($scope) {
		var sql = "SELECT COUNT(id) AS count FROM Todo";
		var existValue = 0;
		var promise;

		$scope = $scope || $rootScope.$new();
		
		promise = $cordovaSQLite.execute($db, sql).then(function(res) {
			existValue = res.rows.item(0).count;
			return existValue;
		});

		return promise;
	};
	///deleted akticiteler
	var countDeletedActivity = function ($scope) {
		var sql = "SELECT COUNT(id) AS count FROM Todo WHERE statu='2'";
		var existValue = 0;
		var promise;

		$scope = $scope || $rootScope.$new();
		
		promise = $cordovaSQLite.execute($db, sql).then(function(res) {
			existValue = res.rows.item(0).count;
			return existValue;
		});

		return promise;
	};
	///toplam kazanılan para
	var totalPriceActivity = function ($scope) {
		var sql = "SELECT SUM(price) AS price FROM Todo";
		var existValue = 0;
		var promise;

		$scope = $scope || $rootScope.$new();
		
		promise = $cordovaSQLite.execute($db, sql).then(function(res) {
			existValue = res.rows.item(0).price;
			return existValue;
		});

		return promise;
	};
	///lite istatisliği
	var countListTodo = function ($scope, pullTime) {
		var now = new Date();
		var date = DateServ.parseDate(now);
		now.setDate(now.getDate()-pullTime);
		//yıl ay gün
		/*var year = now.getUTCFullYear();
		var month = (now.getUTCMonth()+1);
		month = parseInt(month/10)==0 ? ("0" + String(month)) : month;
		var day = now.getUTCDate()+1;
		day = parseInt(day/10) == 0 ? ("0" + String(day)) : day;
		///saat dakika
		var h = now.getHours();
		h = parseInt(h/10) == 0 ? ("0" + String(h)) : h;
		var m = now.getMinutes();
		m = parseInt(m/10) == 0 ? ("0" + String(m)) : m;

		var dateExist = year + "-" + month + "-" + day;
		var datetimeExist = h + ":" + m + ":00";
		var parseDate =  dateExist + " " + datetimeExist;*/
		
		var parseDate = DateServ.parseDate(now);

		var sql = "SELECT COUNT(id) AS count FROM Todo " + 
				  "WHERE DATETIME(date) BETWEEN DATETIME('"+ parseDate +"') AND DATETIME('"+ date +"')";
		var existValue = 0;
		var promise;

		$scope = $scope || $rootScope.$new();
		
		promise = $cordovaSQLite.execute($db, sql).then(function(res) {
			existValue = res.rows.item(0).count;
			return existValue;
		}, function (res) {
			return res;
		});

		return promise;
	};
	///liste parası
	var priceListTodo = function ($scope, pullTime) {
		var now = new Date();
		var date = DateServ.parseDate(now);
		now.setDate(now.getDate()-pullTime);
		//yıl ay gün
		/*var year = now.getUTCFullYear();
		var month = (now.getUTCMonth()+1);
		month = parseInt(month/10)==0 ? ("0" + String(month)) : month;
		var day = now.getUTCDate()+1;
		day = parseInt(day/10) == 0 ? ("0" + String(day)) : day;
		///saat dakika
		var h = now.getHours();
		h = parseInt(h/10) == 0 ? ("0" + String(h)) : h;
		var m = now.getMinutes();
		m = parseInt(m/10) == 0 ? ("0" + String(m)) : m;

		var dateExist = year + "-" + month + "-" + day;
		var datetimeExist = h + ":" + m + ":00";
		var parseDate =  dateExist + " " + datetimeExist;*/
		var parseDate = DateServ.parseDate(now);

		var sql = "SELECT SUM(price) AS price FROM Todo " + 
				  "WHERE DATETIME(date) BETWEEN DATETIME('"+ parseDate +"') AND DATETIME('"+ date +"')";
		var existValue = 0;
		var promise;

		$scope = $scope || $rootScope.$new();
		
		promise = $cordovaSQLite.execute($db, sql).then(function(res) {
			existValue = res.rows.item(0).price;
			return existValue;
		}, function (res) {
			return res;
		});

		return promise;
	};
	return {
		countAllTodo : countActivity,
		totalAllPrice : totalPriceActivity,
		countListTodo : countListTodo,
		priceListTodo : priceListTodo,
		countDeletedActivity : countDeletedActivity
	};
});