RiakSchema = require('../lib/schema')

schema = new RiakSchema("send_order")

schema.addField(name: "items.key", type: 'string', indexed: 'true', stored: 'true', multiValued: 'false')
schema.addField(name: "location.key", type: 'string', indexed: 'true', stored: 'true', multiValued: 'false')

schema.addFieldType(name: 'string', 'class': 'solr.StrField', sortMissingLast: 'true' )

schema.addDynamicField()

module.exports = schema