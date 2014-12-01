var models, self, _;

models = require('../../data/models');

_ = require('lodash');

self = {
  registerRoutes: function(server) {
    server.get('/schema', self.fetch);
    server.get('/schema/:model', self.fetchSingle);
    return server.post('/schema/:model/validate', self.validate);
  },
  fetch: function(req, res) {
    var key, model, schema;
    schema = {};
    for (key in models) {
      if (!models.hasOwnProperty(key)) {
        continue;
      }
      if (key === '$DataModel') {
        continue;
      }
      model = models[key];
      if (!(model['$schema'] instanceof Object)) {
        continue;
      }
      schema[key] = model.$schema.schema;
    }
    return res.send(200, schema);
  },
  fetchSingle: function(req, res) {
    var model, schema;
    model = models[req.params.model];
    if (!model) {
      res.send(404, "No model " + req.params.model);
      return;
    }
    schema = model.$schema;
    if (!schema) {
      res.send(404, "No model " + req.params.model);
      return;
    }
    return res.send(200, schema.schema);
  },
  validate: function(req, res) {
    var form, model, schema;
    model = models[req.params.model];
    if (!model) {
      res.send(404, "No model " + req.params.model);
      return;
    }
    schema = model.$schema;
    if (!schema) {
      res.send(404, "No model " + req.params.model);
      return;
    }
    form = schema.validate(req.body);
    return res.send(200, {
      schema: schema.schema,
      form: form
    });
  }
};

module.exports = self;
