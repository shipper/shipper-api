var adHoc, schemajs;

schemajs = require('schemajs');

adHoc = require('../ad_hoc_item/schema');

module.exports = schemajs.create({
  serial_number: {
    type: "string"
  },
  scan_date: {
    type: "number"
  },
  notes: {
    type: "array",
    items: {
      type: "object",
      schema: {
        key: "string"
      }
    }
  }
});
