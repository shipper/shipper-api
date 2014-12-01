RiakSchema = require('../lib/schema')

schema = new RiakSchema("location")

schema.addField(name: "company_name", type: 'string', indexed: 'true', stored: 'true', multiValued: 'false')
schema.addField(name: "contact", type: 'string', indexed: 'true', stored: 'true', multiValued: 'false')
schema.addField(name: "address_1", type: 'string', indexed: 'true', stored: 'true', multiValued: 'false')
schema.addField(name: "postcode", type: 'string', indexed: 'true', stored: 'true', multiValued: 'false')
schema.addField(name: "postcode", type: 'string', indexed: 'true', stored: 'true', multiValued: 'false')
schema.addField(name: "postcode", type: 'string', indexed: 'true', stored: 'true', multiValued: 'false')
schema.addField(name: "postcode", type: 'string', indexed: 'true', stored: 'true', multiValued: 'false')
schema.addField(name: "postcode", type: 'string', indexed: 'true', stored: 'true', multiValued: 'false')

schema.addFieldType(name: 'string', 'class': 'solr.StrField', sortMissingLast: 'true' )

schema.addDynamicField()

module.exports = schema