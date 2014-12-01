var DataModel, riak, schema;

DataModel = require('../lib/model');

riak = require('./riak');

schema = require('./schema');

module.exports = DataModel.define("contact", "contact", schema, riak);
