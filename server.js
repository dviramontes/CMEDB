var restify = require('restify'),

    server = restify.createServer({
        name: 'ClientErrorMonitoringDashboard',
        version: '0.0.1'
    });

// embedded db
var Datastore = require('nedb'),
    db = new Datastore({
        filename: 'data/errors.db',
        autoload: true
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

server.post('/apperror', function(req, res, next) {
    console.log(req.headers['user-agent']);
    res.send('Error submitted')
    var payload = req.body;
    payload.date = new Date();
    payload.userAgent= req.headers['user-agent'];
    db.insert(payload, function(err, key) { // null => autokey
        if (err) throw err;
        console.log('Error record saved', key)
    })
});

server.get('/geterrors', function(req, res, next) {
    // var number = req.params.number;
    db.find({}, function(err, errors){
    	res.json(errors);
    });
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
