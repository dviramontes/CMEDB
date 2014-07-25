var restify = require('restify'),
    moment = require('moment'),
    bytes = require('bytes'),
	chalk = require('chalk'),
	fs = require('fs'),
    server = restify.createServer({
        name: 'ClientErrorMonitoringDashboard',
        version: '0.0.1'
    });

// embedded db
var Datastore = require('nedb'),
    db = new Datastore({
        filename: 'data/errors.db',
        autoload: true
    })

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
//restify.CORS.ALLOW_HEADERS.push('withcredentials');
restify.CORS.ALLOW_HEADERS.push('x-requested-with');

//server.use(restify.CORS({
//    origins: ['https://clients.spectraseis.com'],   // defaults to ['*']
//    credentials: false                  // defaults to false
//    //headers: ['x-foo']                 // sets expose-headers
//}))

server.post('/', function(req, res, next) {
    res.send('Error submitted')
    var ip = req.headers['x-real-ip']
    var payload = req.body;
    console.log(chalk.red(ip))
    payload.ip = ip;
    payload.date = moment().format('MMMM Do YYYY, h:mm:ss a')
    payload.userAgent = req.headers['user-agent'];
    db.insert(payload, function(err, key) { // null => autokey
        if (err) throw err;
        // console.log('Error record saved', key)
        console.log('Error record saved')
    })
});

server.get('/geterrors', function(req, res, next) {
    // var number = req.params.number;
    db.find({}, function(err, errors) {
        res.json(errors);
    });
});

server.get('/logsize', function (req, res, next) {
	var stats = fs.statSync("data/errors.db")
	console.log( "logsize :: " + bytes(stats['size']))
	res.send(bytes(stats['size']))
})

server.listen(process.env.PORT || 3000, function() {
    console.log('%s listening at %s', server.name, server.url);
});

// ROUTE FOR STATIC SERVER
// * 
// server.get(/.*/, restify.serveStatic({
//     'directory': './public',
//     'default': 'index.html'
// }));