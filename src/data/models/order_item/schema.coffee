schemajs = require( 'schemajs' )
adHoc    = require( '../ad_hoc_item/schema' )

module.exports = schemajs.create({
  item:
    type: "object"
    schema:
      key:
        type: "string"
  ad_hoc_item:
    type: "object"
    schema: adHoc.schema
  serial_scans:
    type: "array"
    items:
      type: "object"
      schema:
        key: "string"
  reference:
    type: "string"
  purchase_number:
    type: "string"
  notes:
    type: "array"
    items:
      schema:
        key: "string"
})