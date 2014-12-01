models = require( '../../data/models' )
_      = require( 'lodash' )

self =
  registerRoutes: (server) ->
    server.get('/schema', self.fetch)
    server.get('/schema/:model', self.fetchSingle)
    server.post('/schema/:model/validate', self.validate)

  fetch: (req, res) ->
    schema = {}
    for key of models
      if not models.hasOwnProperty(key)
        continue
      if key is '$DataModel'
        continue
      model = models[key]
      if model['$schema'] not instanceof Object
        continue
      schema[key] = model.$schema.schema
    res.send(200, schema)

  fetchSingle: (req, res) ->
    model = models[req.params.model]
    if not model
      res.send(404, "No model #{req.params.model}")
      return
    schema = model.$schema
    if not schema
      res.send(404, "No model #{req.params.model}")
      return
    res.send(200, schema.schema)

  validate: (req, res) ->
    model = models[req.params.model]
    if not model
      res.send(404, "No model #{req.params.model}")
      return
    schema = model.$schema
    if not schema
      res.send(404, "No model #{req.params.model}")
      return
    form = schema.validate(req.body)
    res.send(200, {
      schema: schema.schema
      form: form
    })


module.exports = self
