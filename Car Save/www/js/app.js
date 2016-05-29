//burada ana değişkenler tanımlarnıyor db bağlantısı ve hataları göstermek için
var app = angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers', 'onezone-datepicker', 'starter.models']);
var $db = null; 
var $error;

app.run(function($ionicPlatform, $cordovaSQLite) {
    $ionicPlatform.ready(function() {
        
        if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }

        try 
        {
            $error = "Şu anda Bir Sıkıntı yok Ne güzel";
            $db = $cordovaSQLite.openDB({name:"nextflow.db",location:'default'});
            ///User
            $cordovaSQLite.execute($db, "CREATE TABLE IF NOT EXISTS User (id INTEGER, name VARCHAR(255),password VARCHAR(255))");
            ///Todo
            $cordovaSQLite.execute($db, "CREATE TABLE IF NOT EXISTS Todo (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), description VARCHAR(255), car VARCHAR(255), price INTEGER, date VARCHAR(20), statu VARCHAR(2))");
        }
        catch (error)
        {
            $error = "Veri Tabanına Bağlanırken Sorun Oluştu Tekrar Deneyiniz. Sorun : "+error;
            alert($error);
        } 
    });
})
app.config(function($stateProvider, $urlRouterProvider) {
  	$stateProvider
    .state('app', {
    	url: '/app',
	    abstract: true,
	    templateUrl: 'templates/menu.html',
	    controller: 'MenuCtrl'
  	})
  	.state('app.dash', {
	    url: '/dash',
	    templateUrl : 'templates/dash.html',
	    controller: 'AppCtrl'
  	})
    .state('app.setting', {
        url: '/setting',
        templateUrl : 'templates/setting.html',
        controller: 'SettingCtrl'
    })
    .state('app.statistic', {
        url: '/statistic',
        templateUrl : 'templates/statistic.html',
        controller: 'StatisticCtrl'
    })
    .state('app.activities', {
        url: '/activities',
        templateUrl : 'templates/activities.html',
        controller: 'ActivitiesCtrl'
    })
  	$urlRouterProvider.otherwise('/app/dash');
});