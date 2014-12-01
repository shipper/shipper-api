schemajs = require( 'schemajs' )

module.exports = schemajs.create({
  contact:
    type: "object"
    schema:
      key:
        type: "string"
  billing_location:
    type: "object"
    schema:
      key:
        type: "string"
  shipping_location:
    type: "object"
    schema:
      key:
        type: "string"
  same_address:
    type: "boolean"
})