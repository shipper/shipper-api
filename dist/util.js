var self, _;

_ = require('lodash');

self = {
  filter: function(object, keys) {
    var key, res, _i, _len;
    if (!_.isPlainObject(object)) {
      return object;
    }
    if (!_.isArray(keys)) {
      return object;
    }
    res = {};
    for (_i = 0, _len = keys.length; _i < _len; _i++) {
      key = keys[_i];
      if (!object.hasOwnProperty(key)) {
        continue;
      }
      res[key] = _.cloneDeep(object[key]);
    }
    return res;
  }
};

module.exports = self;
