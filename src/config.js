var appConfig = {
	getSocket : function(){
		return io.connect(host);
	},
	getData : function(file){
		return serv + "get/" + file + ".php";
	},
	setCookie : function(cname, cvalue, hours) {
		var d = new Date();
		d.setTime(d.getTime() + (1*hours*60*60*1000));
		var expires = "expires="+d.toUTCString();
		document.cookie = cname + "=" + cvalue + "; " + expires;
	},
	getCookie : function (cname) {
		var name = cname + "=";
		var ca = document.cookie.split(';');
		for(var i=0; i<ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1);
			if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
		}
		return "";
	},
};

