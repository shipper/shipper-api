var BearerStrategy, Q, UnauthorizedError, agent, env, jwt, self;

BearerStrategy = require('passport-http-bearer').Strategy;

jwt = require('jsonwebtoken');

UnauthorizedError = require('restify').UnauthorizedError;

env = require('../../env');

agent = require('../../data/models/agent');

Q = require('q');

self = {
  authenticate: null,
  verify: function(token, next) {
    if (!token) {
      return next(new UnauthorizedError());
    }
    return jwt.verify(token, env.getJWTKey(), function(err) {
      var obj;
      if (err) {
        return next(new UnauthorizedError());
      }
      obj = jwt.decode(token);
      return agent.fetch(obj.key).then(function(model) {
        return next(null, model);
      }).fail(function() {
        return next(new UnauthorizedError());
      });
    });
  },
  generate: function(user) {
    var key;
    if (!(user instanceof Object)) {
      return Q.reject("User not an object");
    }
    key = void 0;
    if (user["getKey"] instanceof Function) {
      key = user["getKey"]();
    } else if (typeof user["key"] === "string") {
      key = user[key];
    }
    if (key === void 0) {
      return Q.reject("Could not find key");
    }
    return Q.resolve(jwt.sign({
      key: key,
      sign_time: Date.now()
    }, env.getJWTKey()));
  },
  setup: function(passport) {
    passport.use(new BearerStrategy(self.verify));
    return self.authenticate = passport.authenticate('bearer', {
      session: false
    });
  }
};

module.exports = self;
