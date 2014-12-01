DataModel  = require('../lib/model')
riak       = require('./riak')
schema     = require('./schema')

module.exports = DataModel.define("order_item", "order_item", schema, riak)