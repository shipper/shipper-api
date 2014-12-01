var RiakSchema, schema;

RiakSchema = require('../lib/schema');

schema = new RiakSchema("consumer");

schema.addField({
  name: "contact.key",
  type: 'string',
  indexed: 'true',
  stored: 'true',
  multiValued: 'false'
});

schema.addField({
  name: "billing_location.key",
  type: 'string',
  indexed: 'true',
  stored: 'true',
  multiValued: 'false'
});

schema.addField({
  name: "shipping_location.key",
  type: 'string',
  indexed: 'true',
  stored: 'true',
  multiValued: 'false'
});

schema.addFieldType({
  name: 'string',
  'class': 'solr.StrField',
  sortMissingLast: 'true'
});

schema.addDynamicField();

module.exports = schema;
