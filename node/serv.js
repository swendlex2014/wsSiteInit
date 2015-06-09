var request = require('request');
var Q = require('q');
var serverPath = "http://serverpath";

module.exports = {
	post: function(file, data, callback) {
		var deferred = Q.defer();
		request.post(
			serverPath + 'post/' + file + '.php',
			{ form : data },
			function (error, response, body) {
				if (!error && response.statusCode == 200) {
					deferred.resolve(body);
				} else
				deferred.reject("Post Return an error: " + body);
			});
		deferred.promise.nodeify(callback);
		return deferred.promise;
	},

	samplePost : function(data, callback){
		var deferred = Q.defer();
		this.post('new', {data : data}).then(function(data){
			deferred.resolve(data);
		})
		deferred.promise.nodeify(callback);
		return deferred.promise;
	},
};