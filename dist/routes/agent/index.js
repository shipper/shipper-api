var AgentModel, UnauthorizedError, authenticate, authentication, bcypt, models, self, util;

models = require('../../data/models');

authentication = require('../../authentication');

authenticate = require('../../authenticate');

UnauthorizedError = require('restify').UnauthorizedError;

AgentModel = models.AgentModel;

bcypt = require('bcrypt');

util = require('../../util');

self = {
  registerRoutes: function(server) {
    server.get('/agent', authenticate, self.fetch);
    server.put('/agent', authenticate, self.update);
    server.put('/agent/password', authenticate, self.updatePassword);
    server.post('/agent/login', authenticate.Local, self.login);
    return server.post('/agent/register', self.register);
  },
  userSafeUser: function(value) {
    return util.filter(value, ['name', 'type', 'role', 'username', 'location', 'features', 'facilities']);
  },
  fetch: function(req, res) {
    return res.send(200, self.userSafeUser(req.user.getValue()));
  },
  update: function(req, res, next) {
    var body, key, user, value;
    body = util.filter(req.body, ['name', 'username']);
    user = req.user;
    value = user.getValue();
    for (key in body) {
      if (!body.hasOwnProperty(key)) {
        continue;
      }
      value[key] = body[key] || value[key];
    }
    user.setValue(value);
    return user.save().then(function() {
      return res.send(200, self.userSafeUser(user.getValue()));
    }).fail(function(error) {
      return next(error);
    });
  },
  updatePassword: function(req, res, next) {
    var password, password_confirm, password_old, user, value;
    password = req.body.password;
    password_confirm = req.body.password_confirm;
    password_old = req.body.password_old;
    if (password !== password_confirm) {
      return res.send(400, {
        message: "Passwords do not match"
      });
    }
    user = req.user;
    value = user.getValue();
    return bcypt.compare(password_old, value.password, function(err, reply) {
      if (err || !reply) {
        return res.send(400, {
          message: "Password not correct"
        });
      }
      return bcypt.hash(password, 10, function(err, hash) {
        if (err) {
          return next(err);
        }
        value.password = hash;
        user.setValue(value);
        return user.save().then(function(model) {
          return res.send(200, self.userSafeUser(model.getValue()));
        }).fail(next);
      });
    });
  },
  login: function(req, res, next) {
    return authentication.Bearer.generate(req.user).then(function(token) {
      return res.send(200, {
        token: token,
        user: self.userSafeUser(req.user.getValue())
      });
    }).fail(function(error) {
      return next(new UnauthorizedError());
    });
  },
  register: function(req, res, next) {
    var code, name, password, username;
    name = req.body.name;
    username = req.body.username;
    password = req.body.password;
    code = req.body.code;
    if (!username) {
      return res.send(400);
    }
    if (!password) {
      return res.send(400);
    }
    return bcypt.hash(password, 10, function(err, hash) {
      var model;
      model = AgentModel.create({
        name: name || username,
        username: username,
        password: hash
      });
      return model.save().then(function(model) {
        return authentication.Bearer.generate(model).then(function(token) {
          return res.send(200, {
            token: token,
            register_group: true
          });
        }).fail(function() {
          return next(new UnauthorizedError());
        });
      }).fail(function() {
        return res.send(400);
      });
    });
  }
};

module.exports = self;
