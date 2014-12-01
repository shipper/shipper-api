RiakSchema = require('../lib/schema')

schema = new RiakSchema("order_item")

schema.addField(name: "item.key", type: 'string', indexed: 'true', stored: 'true', multiValued: 'false')
schema.addField(name: "serial_scans.key", type: 'string', indexed: 'true', stored: 'true', multiValued: 'true')
schema.addField(name: "reference", type: 'string', indexed: 'true', stored: 'true', multiValued: 'false')
schema.addField(name: "purchase_number", type: 'string', indexed: 'true', stored: 'true', multiValued: 'false')
schema.addField(name: "notes.key", type: 'string', indexed: 'true', stored: 'true', multiValued: 'true')

schema.addFieldType(name: 'string', 'class': 'solr.StrField', sortMissingLast: 'true' )

schema.addDynamicField()

module.exports = schema