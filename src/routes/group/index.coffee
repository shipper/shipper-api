models       = require( '../../data/models' )
authenticate = require( '../../authenticate' )

self =
  registerRoutes: (server) ->
    server.post("/group/register", authenticate, self.register)
    server.get("/group/register/generate", authenticate, self.generateRegister)


  register: ( req, res, next ) ->

  generateRegister: ( req, res, next ) ->



module.exports = self