var DataModel, riak, schema;

DataModel = require('../lib/model');

riak = require('./riak');

schema = require('./schema');

module.exports = DataModel.define("ad_hoc_item", "ad_hoc_item", schema, riak);
