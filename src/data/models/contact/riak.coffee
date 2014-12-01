RiakSchema = require('../lib/schema')

schema = new RiakSchema("contact")

schema.addField(name: "name", type: 'string', indexed: 'true', stored: 'true', multiValued: 'false', required: 'true' )
schema.addField(name: "phone", type: 'string', indexed: 'true', stored: 'true', multiValued: 'false', required: 'true' )
schema.addField(name: "email", type: 'string', indexed: 'true', stored: 'true', multiValued: 'false', required: 'true' )

schema.addDynamicField()

module.exports = schema