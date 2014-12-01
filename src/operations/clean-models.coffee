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

arg = process.argv[2]
if arg
  keys = _.where(keys, (value) ->
    return value is arg
  )

next = ->
  key = keys.pop()
  if not key
    process.exit(0)
    return
  console.log(key)
  model = models[key]
  model.fetchKeys()
  .then( ( ks ) ->
    n = ->
      k = ks.pop()
      if not k
        return next()
      console.log("#{k}")
      model.remove(k)
      .then(n)
      .fail( (err) ->
        console.log(err)
        n()
      )
    n()
  )
  .fail( (err) ->
    console.log(err)
    next()
  )

next()