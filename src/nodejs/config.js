module.exports = function(app, io, express, port){
	var path = require("path");

	// Set .html as the default template extension
	app.set('view engine', 'html');

	// Initialize the ejs template engine
	app.engine('html', require('ejs').renderFile);

	// Tell express where it can find the templates
	app.set('views', path.join(__dirname, '../www'));

	app.use(express.static(path.join(__dirname, '../www'))); 

	app.get('/', function(req, res){
		res.render('index');
	});

	console.log('Application is running on ' + port);
};