BearerStrategy        = require( 'passport-http-bearer' ).Strategy
jwt                   = require( 'jsonwebtoken' )
{ UnauthorizedError } = require( 'restify')
env                   = require( '../../env' )
agent                 = require( '../../data/models/agent' )
Q                     = require( 'q' )

self =
  authenticate: null
  verify: (token, next) ->
    if not token
      return next(new UnauthorizedError())
    jwt.verify(token, env.getJWTKey(), (err) ->
      if err
        return next(new UnauthorizedError())
      obj = jwt.decode(token)
      # TODO add expire check
      agent.fetch(obj.key)
      .then( ( model ) ->
        next(null, model)
      )
      .fail( ->
        next(new UnauthorizedError())
      )
    )
  generate: (user) ->
    if user not instanceof Object
      return Q.reject("User not an object")
    key = undefined
    if user["getKey"] instanceof Function
      key = user["getKey"]()
    else if typeof user["key"] is "string"
      key = user[key]
    if key is undefined
      return Q.reject("Could not find key")
    return Q.resolve(jwt.sign({ key: key, sign_time: Date.now() }, env.getJWTKey() ))
  setup: (passport) ->
    passport.use(new BearerStrategy(
      self.verify
    ))
    self.authenticate = passport.authenticate(
      'bearer',
      {
        session: no
      }
    )

module.exports = self