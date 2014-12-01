DataModel  = require('../lib/model')
riak       = require('./riak')
schema     = require('./schema')

module.exports = DataModel.define("store_order", "store_order", schema, riak)