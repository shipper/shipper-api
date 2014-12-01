RiakSchema = require('../lib/schema')

schema = new RiakSchema("iso3166_2")

schema.addField(name: "iso3166_1.key", type: 'string', indexed: 'true', stored: 'true', multiValued: 'false', required: 'true' )
schema.addField(name: "code", type: 'string', indexed: 'true', stored: 'true', multiValued: 'false')
schema.addField(name: "subdivision_name", type: 'string', indexed: 'true', stored: 'true', multiValued: 'false')

schema.addFieldType(name: 'string', 'class': 'solr.StrField', sortMissingLast: 'true' )

schema.addDynamicField()

module.exports = schema