DataModel  = require('../lib/model')
riak       = require('./riak')
schema     = require('./schema')

module.exports = DataModel.define("serial_scan", "serial_scan", schema, riak)