var authentication, restify, routes, server;

restify = require('restify');

routes = require('./routes');

authentication = require('./authentication');

server = restify.createServer({
  name: "Shipper API",
  version: "0.0.1"
});

server.use(restify.acceptParser(server.acceptable));

server.use(restify.queryParser());

server.use(restify.bodyParser());

server.use(restify.CORS());

server.use(authentication.middleware());

routes.registerRoutes(server);

server.listen(2301, function() {
  return console.log('%s listening at %s', server.name, server.url);
});
