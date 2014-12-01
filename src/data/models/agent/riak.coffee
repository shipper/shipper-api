RiakSchema = require('../lib/schema')

schema = new RiakSchema("agent")

schema.addField(name: "username", type: 'string', indexed: 'true', stored: 'true', multiValued: 'false', required: 'true' )
schema.addField(name: "role", type: 'string', indexed: 'true', stored: 'true', multiValued: 'false' )
schema.addField(name: "type", type: 'string', indexed: 'true', stored: 'true', multiValued: 'false' )
schema.addField(name: "location.key", type: 'string', indexed: 'true', stored: 'true', multiValued: 'false' )
schema.addField(name: "features.key", type: 'string', indexed: 'true', stored: 'true', multiValued: 'true' )
schema.addField(name: "facilities.key", type: 'string', indexed: 'true', stored: 'true', multiValued: 'true' )

schema.addFieldType(name: 'string' , 'class': 'solr.StrField', sortMissingLast: 'true' )

schema.addDynamicField()

module.exports = schema