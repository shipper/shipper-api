var RiakSchema, schema;

RiakSchema = require('../lib/schema');

schema = new RiakSchema("iso3166_1");

schema.addField({
  name: "alpha2",
  type: 'string',
  indexed: 'true',
  stored: 'true',
  multiValued: 'false',
  required: 'true'
});

schema.addField({
  name: "alpha3",
  type: 'string',
  indexed: 'true',
  stored: 'true',
  multiValued: 'false',
  required: 'true'
});

schema.addField({
  name: "numeric",
  type: 'string',
  indexed: 'true',
  stored: 'true',
  multiValued: 'false',
  required: 'true'
});

schema.addField({
  name: "country_name",
  type: 'string',
  indexed: 'true',
  stored: 'true',
  multiValued: 'false',
  required: 'true'
});

schema.addField({
  name: "short_name",
  type: 'string',
  indexed: 'true',
  stored: 'true',
  multiValued: 'false'
});

schema.addField({
  name: "full_name",
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
