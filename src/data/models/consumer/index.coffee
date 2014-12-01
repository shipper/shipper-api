DataModel  = require('../lib/model')
riak       = require('./riak')
schema     = require('./schema')

module.exports = DataModel.define("consumer", "consumer", schema, riak)