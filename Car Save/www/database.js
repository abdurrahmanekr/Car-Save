/* User Table */
CREATE TABLE IF NOT EXISTS User (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), sur_name VARCHAR(255), password VARCHAR(255), birth VARCHAR(20), birth VARCHAR(20))
{
	id : 1,
	name : "Murtaza",
	sur_name : "Yağcı",
	password : "asdfghjkluytreasdfhr",
	birth : "1975-1-30",
	date : ""
}
/* Todo Table */
CREATE TABLE IF NOT EXISTS Todo (id INTEGER PRIMARY KEY AUTOINCREMENT, title VARCHAR(255), car VARCHAR(255), price INTEGER, date VARCHAR(20), author INTEGER)

{
	id : 1,
	title : "Yıkama",
	car : "Renault Clio",
	price : 15,
	date : "1975-1-30",
	author : 1
}

/* Activity Todo Table */
CREATE TABLE IF NOT EXISTS Activity (id INTEGER PRIMARY KEY, status VARCHAR(1))
{
	id : 1,
	status : 1 // 1 için aktif 2 için pasif
}

/* Deleted Todo Table */
CREATE TABLE IF NOT EXISTS Todo (id INTEGER PRIMARY KEY AUTOINCREMENT, title VARCHAR(255), car VARCHAR(255), price INTEGER, date VARCHAR(20), author INTEGER)
{
	id : 1,
	title : "Yıkama",
	car : "Renault Clio",
	price : 15,
	date : "1975-1-30",
	author : 1
}

a = new Date();

var d = a.getFullYear() + "-" + (a.getMonth()+1) + "-" + (a.getDay()+1);
alert(d);
var date_test = new Date(d + " 11:23:00");
alert(date_test);