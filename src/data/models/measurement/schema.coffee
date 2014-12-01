schemajs = require( 'schemajs' )

module.exports = schemajs.create({
  length:
    type: "number"
  width:
    type: "number"
  height:
    type: "number"
  weight:
    type: "number"
  imperial:
    type: "boolean"
})