var schemajs;

schemajs = require('schemajs');

module.exports = schemajs.create({
  name: {
    type: "string"
  },
  location: {
    type: "object",
    key: {
      type: "string"
    }
  }
});
