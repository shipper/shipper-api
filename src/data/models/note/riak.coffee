RiakSchema = require('../lib/schema')

schema = new RiakSchema("note")

schema.addField(name: "agent.key", type: 'string', indexed: 'true', stored: 'true', multiValued: 'false')

schema.addFieldType(name: 'string', 'class': 'solr.StrField', sortMissingLast: 'true' )

schema.addDynamicField()

module.exports = schema