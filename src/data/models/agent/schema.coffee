schemajs = require( 'schemajs' )

module.exports = schemajs.create({
  name:
    type: "string+"
  type:
    type: "string"
    properties:
      regex: /^(Developer|Internal|Supplier|Facility|Consumer)$/g
  role:
    type: "string"
    properties:
      regex: /^(Admin|Standard|Limited)$/g
  username:
    type: "string+"
    required: true
  password:
    type: "string+"
  location:
    type: "object"
    schema:
      key:
        type: "string"
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
  facilities:
    type: "array"
    items:
      type: "object"
      schema:
        key:
          type: "string+"
})