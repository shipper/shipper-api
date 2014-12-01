schemajs = require( 'schemajs' )

module.exports = schemajs.create({
  items:
    type: "array"
    items:
      type: "string"
      schema:
        key: "string"
  location:
    type: "object"
    schema:
      key: "string"
})