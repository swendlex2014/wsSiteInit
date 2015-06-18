(function(Ractive, $){
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

	(function() {
		console.log("Done");
		$.app.init();
	})();

})(Ractive, $);