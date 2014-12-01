var measurement, schemajs;

schemajs = require('schemajs');

measurement = require('../measurement/schema');

module.exports = schemajs.create({
  name: {
    type: "string"
  },
  items: {
    type: "number"
  },
  measurement: {
    type: "object",
    schema: measurement.schema
  }
});
