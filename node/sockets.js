module.exports = function(app, io, express, port){
	var connection = 0;
	var serv = require('./serv.js');
	io.on('connect', function(socket){
		console.log("Number of Connection: " + (++connection));
		socket.on('disconnect', function(data){
			console.log("Number of Connection: " + (--connection));
		});

		socket.on('newExaminee', function(data, callback){
			// Do something

			// Notify the sender
			callback("OK");
		});
	});
};