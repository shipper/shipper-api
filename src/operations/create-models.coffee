models = require('../data/models')
_      = require('lodash')
Q      = require('q')

keys = _.keys(models)
keys = _.where(keys, (key) ->
  if key is '$DataModel'
    return false
  model = models[key]
  if model['$hasRiakSchema'] not instanceof Function
    return false
  if not model['$hasRiakSchema']()
    return false
  return true
)

activate = (key, model) ->
  deferred = Q.defer()
  isActive = false
  schema = model.$getRiakSchema()
  schema.isActive()
  .then((active) ->
    isActive = active
  )
  .then( ->
    schema.put()
    .then( ->
      setTimeout( ->
        schema.$create(if isActive then 'update' else 'create')
        .then( ->
          schema.activate()
          .then(
            deferred.resolve
          )
        )
        .fail(deferred.reject)
      , 10000)
    )
  )
  .fail(deferred.reject)
  return deferred.promise

arg = process.argv[2]
if arg
  console.log("executing for #{arg}")
  keys = _.where(keys, (value) ->
    return value is arg
  )

pairs = _.map(keys, (key) ->
  return {
    model: models[key]
    key: key
  }
)

next = ->
  pair = pairs.pop()
  if not pair
    process.exit()
    return
  activate(pair.key, pair.model)
  .then(next)
  .fail( (error) ->
    console.log(error)
    console.log(error.stack)
    next
  )
next()