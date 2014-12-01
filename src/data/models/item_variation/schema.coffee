schemajs = require( 'schemajs' )

module.exports = schemajs.create({
  stock_keeping_unit:
    type: "string"
  description:
    type: "string"
  variations:
    type: "array"
    items:
      type: "object"
      schema:
        key:
          type: "string"
        value:
          type: "string"
})