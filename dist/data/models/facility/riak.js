var RiakSchema, schema;

RiakSchema = require('../lib/schema');

schema = new RiakSchema("facility");

schema.addField({
  name: "name",
  type: 'string',
  indexed: 'true',
  stored: 'true',
  multiValued: 'false',
  required: 'true'
});

schema.addField({
  name: "location.key",
  type: 'string',
  indexed: 'true',
  stored: 'true',
  multiValued: 'false',
  required: 'true'
});

schema.addField({
  name: "group.key",
  type: 'string',
  indexed: 'true',
  stored: 'true',
  multiValued: 'false',
  required: 'true'
});

schema.addField({
  name: "features.key",
  type: 'string',
  indexed: 'true',
  stored: 'true',
  multiValued: 'true'
});

schema.addFieldType({
  name: 'string',
  'class': 'solr.StrField',
  sortMissingLast: 'true'
});

schema.addDynamicField();

module.exports = schema;
