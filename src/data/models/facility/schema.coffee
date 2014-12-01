schemajs = require( 'schemajs' )

module.exports = schemajs.create({
  name:
    type: "string"
  location:
    type: "object"
    schema:
      key: "string"
  features:
    type: "array"
    items:
      type: "object"
      schema:
        key:
          type: "string+"
          properties:
          # +Feature means include
          # -Feature means exclude
            regex: /^([+-].+)$/g
  group:
    type: "object"
    schema:
      key:
        type: "string"
  contact:
    type: "object"
    key:
      type: "string"
})