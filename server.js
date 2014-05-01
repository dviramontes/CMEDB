var restify = require('restify'),

server = restify.createServer({
    name: 'ClientErrorMonitoringDashboard',
    version: '0.0.1'
});

// embedded db
var nStore = require('nstore');

// init storage file
errors = nStore.new('data/errors.db', function(err) {
    if (err) throw err;
    console.log('data/errors.db initialized')
});

// middlewares
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.fullResponse());

// CORS
restify.CORS.ALLOW_HEADERS.push('accept');
restify.CORS.ALLOW_HEADERS.push('sid');
restify.CORS.ALLOW_HEADERS.push('lang');
restify.CORS.ALLOW_HEADERS.push('origin');
restify.CORS.ALLOW_HEADERS.push('withcredentials');
restify.CORS.ALLOW_HEADERS.push('x-requested-with');
server.use(restify.CORS());

server.post('/apperror', function(req,res,next){
	console.log(req.body);
	res.send('Error submitted')
	errors.save(null, req.body, function(){
		if(err) throw err;
		console.log('Error record saved')
	}) // null => autokey

});

// ROUTE FOR STATIC SERVER
// * 
// server.get(/.*/, restify.serveStatic({
//     'directory': './public',
//     'default': 'index.html'
// }));

server.listen(process.env.PORT || 3000, function() {
    console.log('%s listening at %s', server.name, server.url);
});