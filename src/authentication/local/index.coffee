LocalStrategy         = require( 'passport-local' ).Strategy
agent                 = require( '../../data/models/agent' )
{ UnauthorizedError } = require( 'restify')
bcrypt                = require( 'bcrypt' )

self =
  verify: (username, password, done) ->
    agent.fetchBySecondary("username_bin", username, true)
    .then(( model ) ->
      value = model.getValue()
      if not value.password
        return done(new UnauthorizedError())
      bcrypt.compare(password, value.password, (err, res) ->
        if not res
          return done(new UnauthorizedError())
        done(null, model)
      )
    )
    .fail(->
      done(new UnauthorizedError())
    )
  authenticate: null
  setup: (passport) ->
    passport.use(new LocalStrategy(
      self.verify
    ))
    self.authenticate = passport.authenticate(
      'local',
      {
        session: no
      }
    )

module.exports = self