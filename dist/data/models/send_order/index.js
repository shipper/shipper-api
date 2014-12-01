var DataModel, riak, schema;

DataModel = require('../lib/model');

riak = require('./riak');

schema = require('./schema');

module.exports = DataModel.define("send_order", "send_order", schema, riak);
