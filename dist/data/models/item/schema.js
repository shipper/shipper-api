var grouping, measurement, pallet, schemajs, variation;

schemajs = require('schemajs');

variation = require('../item_variation/schema');

grouping = require('../item_grouping/schema');

pallet = require('../item_pallet/schema');

measurement = require('../measurement/schema');

module.exports = schemajs.create({
  location: {
    type: "object",
    schema: {
      key: {
        type: "string"
      }
    }
  },
  stock_keeping_unit: {
    type: "string"
  },
  universal_product_code: {
    type: "string"
  },
  description: {
    type: "string"
  },
  description_extended: {
    type: "string"
  },
  lead_time: {
    type: "number"
  },
  safety_stock: {
    type: "number"
  },
  minimum_stock: {
    type: "number"
  },
  maximum_stock: {
    type: "number"
  },
  purchase_price: {
    type: "number"
  },
  sale_price: {
    type: "number"
  },
  measurement: {
    type: "object",
    schema: measurement.schema
  },
  pallet: {
    type: "object",
    schema: pallet.schema
  },
  grouping: {
    type: "object",
    schema: {
      key: {
        type: "string"
      }
    }
  },
  variations: {
    type: "array",
    items: {
      type: "object",
      schema: {
        key: {
          type: "string"
        },
        value: {
          type: "object",
          schema: variation.schema
        }
      }
    }
  }
});
