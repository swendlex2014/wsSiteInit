var SERVER_PORT = 7777;
var APP_HOST = "http://localhost:" + SERVER_PORT;
var LIVE_HOST1 = "http://books.wspecs.com";
var LIVE_HOST2 = "";
var REMOVE_SERVER = "http://servone.wspecs.com/books/";
var DESTINATION = "www";
var SOURCE = "src";
var NODE = "node";

module.exports = {
	SERVER_PORT : SERVER_PORT,
	APP_HOST : APP_HOST,
	LIVE_HOST : [LIVE_HOST1, APP_HOST, LIVE_HOST2],
	REMOVE_SERVER : REMOVE_SERVER,
	DESTINATION : DESTINATION,
	SOURCE : SOURCE,
	NODE : NODE
}