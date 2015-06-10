(function(Ractive, $){
	var app = window.appConfig; 
	//  Socket connection to enable real-time communication with other clients
	// var socket = app.getSocket();
	// Initiaze Dynamic Data binding
	// For more info look into http://www.ractivejs.org/ Online	
	var ractive = new Ractive({
		el : '#wsRactive', 
		template : "#template",
		data: {
		}
	});

	// Handler of Ractive functions
	ractive.on({
		handleSampleClick : handleSampleClick
	});

	function handleSampleClick(){
		console.log("Click is Handle");
	}
	// Socket Handler
	// socket.on('toClient', function(data){
	// 	console.dir(data);
	// });
(function() {
	console.log("Done");
})();

})(Ractive, $);