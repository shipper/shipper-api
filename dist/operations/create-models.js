var Q, activate, arg, keys, models, next, pairs, _;

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

activate = function(key, model) {
  var deferred, isActive, schema;
  deferred = Q.defer();
  isActive = false;
  schema = model.$getRiakSchema();
  schema.isActive().then(function(active) {
    return isActive = active;
  }).then(function() {
    return schema.put().then(function() {
      return setTimeout(function() {
        return schema.$create(isActive ? 'update' : 'create').then(function() {
          return schema.activate().then(deferred.resolve);
        }).fail(deferred.reject);
      }, 10000);
    });
  }).fail(deferred.reject);
  return deferred.promise;
};

arg = process.argv[2];

if (arg) {
  console.log("executing for " + arg);
  keys = _.where(keys, function(value) {
    return value === arg;
  });
}

pairs = _.map(keys, function(key) {
  return {
    model: models[key],
    key: key
  };
});

next = function() {
  var pair;
  pair = pairs.pop();
  if (!pair) {
    process.exit();
    return;
  }
  return activate(pair.key, pair.model).then(next).fail(function(error) {
    console.log(error);
    console.log(error.stack);
    return next;
  });
};

next();
