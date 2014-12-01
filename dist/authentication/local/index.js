var LocalStrategy, UnauthorizedError, agent, bcrypt, self;

LocalStrategy = require('passport-local').Strategy;

agent = require('../../data/models/agent');

UnauthorizedError = require('restify').UnauthorizedError;

bcrypt = require('bcrypt');

self = {
  verify: function(username, password, done) {
    return agent.fetchBySecondary("username_bin", username, true).then(function(model) {
      var value;
      value = model.getValue();
      if (!value.password) {
        return done(new UnauthorizedError());
      }
      return bcrypt.compare(password, value.password, function(err, res) {
        if (!res) {
          return done(new UnauthorizedError());
        }
        return done(null, model);
      });
    }).fail(function() {
      return done(new UnauthorizedError());
    });
  },
  authenticate: null,
  setup: function(passport) {
    passport.use(new LocalStrategy(self.verify));
    return self.authenticate = passport.authenticate('local', {
      session: false
    });
  }
};

module.exports = self;
