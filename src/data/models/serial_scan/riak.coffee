RiakSchema = require('../lib/schema')

schema = new RiakSchema("serial_scan")

schema.addField(name: "serial_number", type: 'string', indexed: 'true', stored: 'true', multiValued: 'false')
schema.addField(name: "notes.key", type: 'string', indexed: 'true', stored: 'true', multiValued: 'true')

schema.addFieldType(name: 'string', 'class': 'solr.StrField', sortMissingLast: 'true' )

schema.addDynamicField()

module.exports = schema