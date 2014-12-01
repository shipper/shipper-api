var RiakSchema, schema;

RiakSchema = require('../lib/schema');

schema = new RiakSchema("ad_hoc_item");

schema.addField({
  name: "grouping.key",
  type: 'string',
  indexed: 'true',
  stored: 'true',
  multiValued: 'false'
});

schema.addField({
  name: "stock_keeping_unit",
  type: 'string',
  indexed: 'true',
  stored: 'true',
  multiValued: 'false'
});

schema.addField({
  name: "universal_product_code",
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
