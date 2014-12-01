pbc   = require( './pbc' )
Q     = require( 'q' )
child = require( 'child_process' )
env   = require( '../../../env' )
_     = require( 'lodash' )

class RiakSchema
  _name = ""
  _fields = []
  _fieldTypes = []
  _dynamicField = false
  constructor: (name) ->
    prefix = env.getRiakSchemaPrefix()
    if prefix and name.indexOf(prefix) is -1
      name = "#{prefix}#{name}"
    @_name = name
    @_fields = []
    @_fieldTypes = []
    @addFieldType(name: '_yz_str', 'class': 'solr.StrField', sortMissingLast: 'true')
    @addField(name: '_yz_id', type: '_yz_str', indexed: 'true', stored: 'true', multiValued: 'false', required: 'true', last: true)
    @addField(name: '_yz_ed', type: '_yz_str', indexed: 'true', stored: 'false', multiValued: 'false', last: true)
    @addField(name: '_yz_pn', type: '_yz_str', indexed: 'true', stored: 'false', multiValued: 'false', last: true)
    @addField(name: '_yz_fpn', type: '_yz_str', indexed: 'true', stored: 'false', multiValued: 'false', last: true)
    @addField(name: '_yz_vtag', type: '_yz_str', indexed: 'true', stored: 'false', multiValued: 'false', last: true)
    @addField(name: '_yz_rk', type: '_yz_str', indexed: 'true', stored: 'true', multiValued: 'false', last: true)
    @addField(name: '_yz_rt', type: '_yz_str', indexed: 'true', stored: 'true', multiValued: 'false', last: true)
    @addField(name: '_yz_rb', type: '_yz_str', indexed: 'true', stored: 'true', multiValued: 'false', last: true)
    @addField(name: '_yz_err', type: '_yz_str', indexed: 'true', stored: 'false', multiValued: 'false', last: true)
  addField: (field) ->
    @_fields.push(field)
  addFieldType: (type) ->
    @_fieldTypes.push(type)
  addDynamicField: ->
    @_dynamicField = true
    @addFieldType(name:'ignored', stored:'false', indexed:'false', multiValued:'true', 'class':'solr.StrField')
  getFields: ->
    return _.cloneDeep(@_fields)
  getFieldTypes: ->
    return _.cloneDeep(@_fieldTypes)
  $createXML: ->
    lines = []
    lines.push("<?xml version=\"1.0\" encoding=\"UTF-8\" ?>")
    lines.push("<schema name=\"#{@_name}\" version=\"1.5\">")
    lines.push("<fields>")

    addFields = (fields) ->
      for field in fields
        line = []
        line.push("<field")
        for key of field
          if not field.hasOwnProperty(key)
            continue
          if key is 'last'
            continue
          line.push("#{key}=\"#{field[key]}\"")
        line.push("/>")
        lines.push(line.join(" "))
    addFields(_.where(@_fields, (field) ->
      return field and not field.last
    ))
    addFields(_.where(@_fields, (field) ->
      return field and field.last
    ))

    if @_dynamicField
      lines.push("<dynamicField name=\"*\" type=\"ignored\" />")
    lines.push("</fields>")
    lines.push("<uniqueKey>_yz_id</uniqueKey>")
    lines.push("<types>")
    for type in @._fieldTypes
      line = []
      line.push("<fieldType")
      for key of type
        if not type.hasOwnProperty(key)
          continue
        line.push("#{key}=\"#{type[key]}\"")
      line.push("/>")
      lines.push(line.join(" "))
    lines.push("</types>")
    lines.push("</schema>")
    return lines.join('\n')
  $putSchema: ->
    deferred = Q.defer()
    xml = @$createXML()
    pbc.putSearchSchema({
      schema:
        name: @_name
        content: xml
    }, (err, reply) ->
      if err
        return deferred.reject(err)
      deferred.resolve(reply)
    )
    return deferred.promise
  $delIndex: ->
    deferred = Q.defer()
    pbc.delSearchIndex({
        name: @_name
      }, (err) ->
        if err
          return deferred.reject(err)
        deferred.resolve()
    )
    return deferred.promise
  $putIndex: ->
    deferred = Q.defer()
    pbc.putSearchIndex({
      index:
        name: @_name
        schema: @_name
    }, (err) ->
      if err
        return deferred.reject(err)
      deferred.resolve()
    )
    return deferred.promise
  $getIndex: ->
    deferred = Q.defer()
    pbc.getSearchIndex({
        name: @_name
      }, (err, reply) ->
        if err
          return deferred.reject(err)
        deferred.resolve(reply)
    )
    return deferred.promise
  isActive: ->
    deferred = Q.defer()
    args = [
      "bucket-type"
      "status"
      @_name
    ]
    admin = child.spawn(
      'riak-admin',
      args
    )
    data = ""
    admin.stdout.on('data', ( d ) ->
      data += d
    )
    admin.stderr.on('data', ( d ) ->
      console.log("stderr: " + d)
    )
    admin.on('close', ( code ) ->
      if code is 0
        return deferred.resolve(data.indexOf("is active") isnt -1)
      deferred.resolve(false)
    )
    return deferred.promise
  create: ->
    return @$create('create')
  update: ->
    return @$create('update')
  $create: ( type ) ->
    return @$riakAdmin(
      [
        'bucket-type'
        type
        @_name
        '{"props":{"search_index":"' + @_name + '","allow_mult":false}}'
      ]
    )
  activate: ->
    return @$riakAdmin(
      [
        'bucket-type'
        'activate'
        @_name
      ]
    )
  $riakAdmin: (args) ->
    deferred = Q.defer()
    admin = child.spawn(
      'riak-admin',
      args
    )
    admin.stdout.on('data', ( data ) ->
      console.log("stdout: " + data)
    )
    admin.stderr.on('data', ( data ) ->
      console.log("stderr: " + data)
    )
    admin.on('close', ( code ) ->
      if code is 0
        return deferred.resolve()
      deferred.reject(new Error("riak-admin #{JSON.stringify(args)} exited with code #{code}"))
    )
    return deferred.promise
  put: ->
    @$putSchema()
    .then(=>
      @$delIndex()
      .then(=>
        @$putIndex()
      )
    )

module.exports = RiakSchema