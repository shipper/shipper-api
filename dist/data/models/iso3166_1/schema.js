var schemajs;

schemajs = require('schemajs');

module.exports = schemajs.create({
  alpha2: {
    type: "string"
  },
  alpha3: {
    type: "string"
  },
  numeric: {
    type: "number"
  },
  country_name: {
    type: "string"
  },
  short_name: {
    type: "string"
  },
  full_name: {
    type: "string"
  },
  remarks: {
    type: "string"
  },
  independent: {
    type: "string"
  }
});
