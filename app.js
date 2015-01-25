var fs = require('fs');
var server = require('http').createServer(function(req, res) {
	res.writeHead(200, {'Content-Type':'text/html'});
	var output = fs.readFileSync('./index.html', 'utf-8');
});
