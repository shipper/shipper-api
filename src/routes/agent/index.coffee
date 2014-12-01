models                = require( '../../data/models' )
authentication        = require( '../../authentication' )
authenticate          = require( '../../authenticate')
{ UnauthorizedError } = require( 'restify' )
AgentModel            = models.AgentModel
bcypt                 = require( 'bcrypt' )
util                  = require( '../../util' )

self =
  registerRoutes: (server) ->
    server.get('/agent', authenticate, self.fetch)
    server.put('/agent', authenticate, self.update)
    server.put('/agent/password', authenticate, self.updatePassword)
    server.post('/agent/login', authenticate.Local, self.login)
    server.post('/agent/register', self.register)

  userSafeUser: ( value ) ->
    util.filter(value, [
      'name'
      'type'
      'role'
      'username'
      'location'
      'features'
      'facilities'
    ])

  fetch: ( req, res ) ->
    res.send(200, self.userSafeUser(
      req.user.getValue()
    ))

  update: ( req, res, next ) ->
    body = util.filter(req.body, [
      'name'
      'username'
    ])
    user = req.user
    value = user.getValue()
    for key of body
      if not body.hasOwnProperty(key)
        continue
      value[key] = body[key] or value[key]
    user.setValue(value)
    user.save()
    .then( ->
      res.send(200, self.userSafeUser(
        user.getValue()
      ))
    )
    .fail( ( error ) ->
      next(error)
    )

  updatePassword: ( req, res, next ) ->
    password = req.body.password
    password_confirm = req.body.password_confirm
    password_old = req.body.password_old
    if password isnt password_confirm
      return res.send(400, {
        message: "Passwords do not match"
      })
    user = req.user
    value = user.getValue()
    bcypt.compare(password_old, value.password, ( err, reply ) ->
      if err or not reply
        return res.send(400, {
          message: "Password not correct"
        })
      bcypt.hash(password, 10, ( err, hash ) ->
        if err
          return next(err)
        value.password = hash
        user.setValue(value)
        user.save()
        .then((model) ->
          return res.send(200, self.userSafeUser(
            model.getValue()
          ))
        )
        .fail(next)
      )
    )

  login: ( req, res, next ) ->
    authentication.Bearer.generate(req.user)
    .then( ( token ) ->
      res.send(200, {
        token: token
        user: self.userSafeUser(
          req.user.getValue()
        )
      })
    )
    .fail((error) ->
      next(new UnauthorizedError())
    )

  register: ( req, res, next ) ->
    name = req.body.name
    username = req.body.username
    password = req.body.password
    code = req.body.code

    if not username
      return res.send(400)
    if not password
      return res.send(400)

    bcypt.hash(password, 10, (err, hash) ->
      model = AgentModel.create({
        name: name or username
        username: username
        password: hash
      })
      model.save()
      .then( (model)->
        authentication.Bearer.generate(model)
        .then( ( token ) ->
          res.send(200, {
            token: token
            register_group: true
          })
        )
        .fail(->
          next(new UnauthorizedError())
        )
      )
      .fail(->
        res.send(400)
      )
    )







module.exports = self