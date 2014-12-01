var agent, consumer, facility, group, iso3166_1, iso3166_2, item, localServer, note, order_item, schema, self, send_order, serial_scan, store_order;

agent = require('./agent');

consumer = require('./consumer');

facility = require('./facility');

group = require('./group');

iso3166_1 = require('./iso3166_1');

iso3166_2 = require('./iso3166_2');

item = require('./item');

note = require('./note');

order_item = require('./order_item');

schema = require('./schema');

send_order = require('./send_order');

serial_scan = require('./serial_scan');

store_order = require('./store_order');

localServer = null;

self = {
  registerRoutes: function(server) {
    localServer = server;
    agent.registerRoutes(server);
    consumer.registerRoutes(server);
    facility.registerRoutes(server);
    group.registerRoutes(server);
    iso3166_1.registerRoutes(server);
    iso3166_2.registerRoutes(server);
    item.registerRoutes(server);
    note.registerRoutes(server);
    order_item.registerRoutes(server);
    schema.registerRoutes(server);
    send_order.registerRoutes(server);
    serial_scan.registerRoutes(server);
    store_order.registerRoutes(server);
    return server.get("/routes", self.routes);
  },
  routes: function(req, res) {
    var k, key, r, val, _i, _len, _ref;
    r = {};
    for (key in localServer.router.routes) {
      if (!localServer.router.routes.hasOwnProperty(key)) {
        continue;
      }
      k = [];
      _ref = localServer.router.routes[key];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        val = _ref[_i];
        k.push(val.spec.path);
      }
      r[key] = k;
    }
    return res.send(200, r);
  }
};

module.exports = self;
