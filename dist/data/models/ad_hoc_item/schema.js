var grouping, measurement, schemajs;

schemajs = require('schemajs');

grouping = require('../item_grouping/schema');

measurement = require('../measurement/schema');

module.exports = schemajs.create({
  stock_keeping_unit: {
    type: "string"
  },
  universal_product_code: {
    type: "string"
  },
  description: {
    type: "string"
  },
  purchase_price: {
    type: "number"
  },
  sale_price: {
    type: "number"
  },
  grouping: {
    type: "object",
    schema: {
      key: {
        type: "string"
      }
    }
  },
  measurement: {
    type: "object",
    schema: measurement.schema
  }
});
