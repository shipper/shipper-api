schemajs = require( 'schemajs' )

module.exports = schemajs.create({
  agent:
    type: "object"
    schema:
      key:
        type: "string"
  note:
    type: "string"
  limit_type:
    type: "string"
  limit_role:
    type: "string"
  create_date:
    type:"number"
})