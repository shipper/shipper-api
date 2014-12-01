var authenticate, models, self;

models = require('../../data/models');

authenticate = require('../../authenticate');

self = {
  registerRoutes: function(server) {
    server.post("/group/register", authenticate, self.register);
    return server.get("/group/register/generate", authenticate, self.generateRegister);
  },
  register: function(req, res, next) {},
  generateRegister: function(req, res, next) {}
};

module.exports = self;
