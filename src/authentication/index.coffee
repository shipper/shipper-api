passport = require( 'passport' )
local    = require( './local')
bearer   = require( './bearer')

local.setup(passport)
bearer.setup(passport)

self =
   Local: local
   Bearer: bearer
   authenticate: bearer.authenticate
   middleware: ->
     return passport.initialize()


module.exports = self