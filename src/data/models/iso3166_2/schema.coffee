schemajs = require( 'schemajs' )

module.exports = schemajs.create({
  code:
    type: "string"
  subdivision_name:
    type: "string"
  subdivision_category:
    type: "string"
  language_code:
    type: "string"
  romanization_system:
    type: "string"
  parent_subdivsion:
    type: "string"
  iso3166_1:
    type: "object"
    schema:
      key:
        type: "string"
})