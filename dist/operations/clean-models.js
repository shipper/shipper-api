var Q, arg, keys, models, next, _;

models = require('../data/models');

_ = require('lodash');

Q = require('q');

keys = _.keys(models);

keys = _.where(keys, function(key) {
  var model;
  if (key === '$DataModel') {
    return false;
  }
  model = models[key];
  if (!(model['$hasRiakSchema'] instanceof Function)) {
    return false;
  }
  if (!model['$hasRiakSchema']()) {
    return false;
  }
  return true;
});

arg = process.argv[2];

if (arg) {
  keys = _.where(keys, function(value) {
    return value === arg;
  });
}

next = function() {
  var key, model;
  key = keys.pop();
  if (!key) {
    process.exit(0);
    return;
  }
  console.log(key);
  model = models[key];
  return model.fetchKeys().then(function(ks) {
    var n;
    n = function() {
      var k;
      k = ks.pop();
      if (!k) {
        return next();
      }
      console.log("" + k);
      return model.remove(k).then(n).fail(function(err) {
        console.log(err);
        return n();
      });
    };
    return n();
  }).fail(function(err) {
    console.log(err);
    return next();
  });
};

next();
