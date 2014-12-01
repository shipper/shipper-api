_ = require('lodash')

self =
  filter: ( object, keys ) ->
    if not _.isPlainObject(object)
      return object
    if not _.isArray(keys)
      return object
    res = {}
    for key in keys
      if not object.hasOwnProperty(key)
        continue
      res[key] = _.cloneDeep(object[key])
    return res


module.exports = self