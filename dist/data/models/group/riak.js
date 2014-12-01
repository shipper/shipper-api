var RiakSchema, schema;

RiakSchema = require('../lib/schema');

schema = new RiakSchema("group");

schema.addField({
  name: "location.key",
  type: 'string',
  indexed: 'true',
  stored: 'true',
  multiValued: 'false',
  required: 'true'
});

schema.addField({
  name: "name",
  type: 'string',
  indexed: 'true',
  stored: 'true',
  multiValued: 'false',
  required: 'true'
});

schema.addFieldType({
  name: 'string',
  'class': 'solr.StrField',
  sortMissingLast: 'true'
});

schema.addDynamicField();

module.exports = schema;
