agent       = require('./agent')
consumer    = require('./consumer')
facility    = require('./facility')
group       = require('./group')
iso3166_1   = require('./iso3166_1')
iso3166_2   = require('./iso3166_2')
item        = require('./item')
note        = require('./note')
order_item  = require('./order_item')
schema      = require('./schema')
send_order  = require('./send_order')
serial_scan = require('./serial_scan')
store_order = require('./store_order')

localServer = null

self =
  registerRoutes: (server) ->
    localServer = server
    agent       .registerRoutes(server)
    consumer    .registerRoutes(server)
    facility    .registerRoutes(server)
    group       .registerRoutes(server)
    iso3166_1   .registerRoutes(server)
    iso3166_2   .registerRoutes(server)
    item        .registerRoutes(server)
    note        .registerRoutes(server)
    order_item  .registerRoutes(server)
    schema      .registerRoutes(server)
    send_order  .registerRoutes(server)
    serial_scan .registerRoutes(server)
    store_order .registerRoutes(server)
    server.get("/routes", self.routes)

  routes: ( req, res ) ->
    r = {}
    for key of localServer.router.routes
      if not localServer.router.routes.hasOwnProperty(key)
        continue
      k = []
      for val in localServer.router.routes[key]
        k.push(val.spec.path)
      r[key] = k
    res.send(200, r)

module.exports = self

