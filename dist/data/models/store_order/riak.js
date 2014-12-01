var RiakSchema, schema;

RiakSchema = require('../lib/schema');

schema = new RiakSchema("store_order");

schema.addField({
  name: "tracking_number",
  type: 'string',
  indexed: 'true',
  stored: 'true',
  multiValued: 'false'
});

schema.addField({
  name: "progressive_number",
  type: 'string',
  indexed: 'true',
  stored: 'true',
  multiValued: 'false'
});

schema.addField({
  name: "trailer_number",
  type: 'string',
  indexed: 'true',
  stored: 'true',
  multiValued: 'false'
});

schema.addField({
  name: "container_number",
  type: 'string',
  indexed: 'true',
  stored: 'true',
  multiValued: 'false'
});

schema.addField({
  name: "facility.key",
  type: 'string',
  indexed: 'true',
  stored: 'true',
  multiValued: 'false'
});

schema.addField({
  name: "agent.key",
  type: 'string',
  indexed: 'true',
  stored: 'true',
  multiValued: 'false'
});

schema.addField({
  name: "items.key",
  type: 'string',
  indexed: 'true',
  stored: 'true',
  multiValued: 'true'
});

schema.addField({
  name: "notes.key",
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
