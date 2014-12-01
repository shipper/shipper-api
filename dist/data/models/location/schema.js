var schemajs;

schemajs = require('schemajs');

module.exports = schemajs.create({
  company_name: {
    type: "string"
  },
  contact: {
    type: "object",
    schema: {
      key: {
        type: "string"
      }
    }
  },
  address_1: {
    type: "string+",
    required: true
  },
  address_2: {
    type: "string"
  },
  address_3: {
    type: "string"
  },
  postcode: {
    type: "int"
  },
  suburb: {
    type: "string"
  },
  region: {
    type: "string"
  },
  verified: {
    type: "boolean"
  },
  latitude: {
    type: "number"
  },
  longitude: {
    type: "number"
  },
  iso3166_1: {
    type: "object",
    schema: {
      key: {
        type: "string"
      }
    }
  },
  iso3166_2: {
    type: "object",
    schema: {
      key: {
        type: "string"
      }
    }
  }
});
