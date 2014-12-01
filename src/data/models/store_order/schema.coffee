schemajs = require( 'schemajs' )
adHoc    = require( '../ad_hoc_item/schema' )

module.exports = schemajs.create({
  create_date:
    type: "number"
  items:
    type: "array"
    items:
      type: "object"
      schema:
        key:
          type: "string"
  ad_hoc_items:
    type: "array"
    items:
      type: "object"
      schema: adHoc.schema
  expected_arrival:
    type: "number"
  arrival:
    type: "number"
  tracking_number:
    type: "string"
  progressive_number:
    type: "string"
  trailer_number:
    type: "string"
  container_number:
    type: "string"
  capacity_type:
    type: "string"
    properties:
      regex: /^(20ft Container|40ft Container|45ft Container|48ft Trailer|53ft Trailer)$/g
  seal_number:
    type: "string"
  notes:
    type: "array"
    items:
      type: "object"
      schema:
        key:
          type: "string"
  facility:
    type: "object"
    schema:
      key:
        type: "string"
  agent:
    type: "object"
    schema:
      key:
        type: "string"
})