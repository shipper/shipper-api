schemajs    = require( 'schemajs' )
measurement = require( '../measurement/schema' )

module.exports = schemajs.create({
  items_per_tier:
    type: "number"
  tiers:
    type: "number"
  measurement:
    type: "object"
    schema: measurement.schema
})