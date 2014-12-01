
Q       = require( 'q' )
_       = require( 'lodash' )
uuid    = require( 'node-uuid' )
pbc     = require( './pbc' )
env     = require( '../../../env' )

addPrefix = ( value ) ->
  if not value
    return value
  prefix = env.getRiakSchemaPrefix()
  if value.indexOf(prefix) isnt -1
    return value
  return "#{prefix}#{value}"

self =
  define: ( type, bucket, schema, riakSchema ) ->
    type ?= "default"

    unless _.isString(bucket)
      throw new TypeError("Bucket is not a string")

    unless _.isString(type)
      throw new TypeError("Type is not a string")

    unless _.isObject(schema) and _.isFunction(schema.validate)
      throw new TypeError("Schema is not a 'schema'")

    bucket = "#{bucket}"
    type = "#{type}"

    if type isnt 'default'
      type = addPrefix(type)

    bucket = addPrefix(bucket)

    class DataModel

      # STATIC

      @$createFromReply: ( key, reply, instance = null ) ->
        content = reply.content[ 0 ]
        result = instance || new DataModel()
        result.$key = key
        result.$value = content.value
        result.$vclock = reply.vclock
        result.$vtag = content.vtag
        result.$contentType = content.content_type
        return result

      @create: ( value = {}, contentType = "application/json" ) ->
        result = new DataModel()
        result.$key = uuid.v4()
        result.$value = value
        result.$contentType = contentType
        return result

      @fetch: ( key ) ->
        deferred = Q.defer()
        pbc.get({
            type: DataModel.$type
            bucket: DataModel.$bucket
            key: key
          }, ( err, reply ) ->
            if err
              return deferred.reject( err )
            deferred.resolve(
              DataModel.$createFromReply(
                key, reply
              )
            )
        )
        return deferred.promise

      @fetchByKeys: ( keys ) ->
        Q.all(
          _.map(keys, ( key ) ->
            return DataModel.fetch(key)
          )
        )

      @fetchBySecondary = ( index, key, first = false ) ->
        deferred = Q.defer()
        pbc.getIndex({
            type: DataModel.$type
            bucket: DataModel.$bucket
            index: index
            qtype: 0
            key: key
          }, ( err, reply ) ->
            if err
              return deferred.reject( err )
            method = "fetchByKeys"
            keys = reply.keys or []
            if not keys.length and first
              return deferred.reject(new Error("NotFound"))
            if first
              method = "fetch"
              keys = keys[0]
            DataModel[method](keys)
            .then(deferred.resolve)
            .fail(deferred.reject)
        )
        return deferred.promise

      @fetchKeys: ->
        deferred = Q.defer()
        pbc.getKeys({
            bucket: DataModel.$bucket
            type: DataModel.$type
          }, ( err, reply ) ->
            if err
              return deferred.reject( err )
            deferred.resolve(
              reply.keys or []
            )
        )
        return deferred.promise

      @fetchAll: ->
        deferred = Q.defer()
        DataModel.fetchKeys()
        .then((keys) ->
          DataModel.fetchByKeys(keys)
          .then(deferred.resolve)
        ).fail(deferred.reject)
        return deferred.promise

      @search: ( options = {} ) ->
        deferred = Q.defer()
        if options not instanceof Object
          options = {
            q: options
          }
        options.index = DataModel.$bucket
        pbc.search(
          options,
          (err, reply) ->
            if err
              return deferred.reject( err )
            if _.isEmpty( reply ) or reply.num_found is 0 or _.isEmpty(reply.docs)
              return deferred.reject( "Not found" )
            get = ( document ) ->
              fields = document.fields
              # _yz_rk is key
              keys = _.where(fields, { key: '_yz_rk' })
              if not keys or not keys.length
                return
              pair = keys[0]
              if not pair or not pair.value
                return
              return DataModel.fetch( pair.value )
            promises = []
            for document in reply.docs
              promise = get(document)
              if not promise
                continue
              if options.first
                promise
                .then(
                  deferred.resolve
                )
                .fail(
                  deferred.reject
                )
                return
              promises.push(promise)
            Q.all(
              promises
            )
            .then(
              deferred.resolve
            )
            .fail(
              deferred.reject
            )
        )
        return deferred.promise
      @remove: ( key ) ->
        deferred = Q.defer()
        pbc.del({
          type: DataModel.$type
          bucket: DataModel.$bucket
          key: key
        }, ( err ) ->
          if err
            return deferred.reject( err )
          deferred.resolve( )
        )
        return deferred.promise
      @serialize: ( contentType, value ) ->
        switch contentType
          when "application/json"
            return JSON.stringify( value )
          else
            return new Buffer( value ).toString()

      @$hasRiakSchema: ->
        return !!DataModel.$riakSchema

      @$getRiakSchema: ->
        return DataModel.$riakSchema

      @beforeSave: ( model ) ->

      @afterSave: ( model ) ->

      @_flatten: ( value )->
        if value not instanceof Object
          return [{
            key: ""
            value: value
          }]

        values = []

        if _.isArray(value)
          i = 0
          while i < value.length
            flattened = @_flatten(value[i])
            for flat in flattened
              values.push(flat)
            i++
        else
          for key of value
            if not value.hasOwnProperty(key)
              continue
            flattened = DataModel._flatten(value[key])
            for flat in flattened
              flatKey = key
              if flat.key
                flatKey += ".#{flat.key}"
              values.push({
                key: flatKey
                value: flat.value
              })
        return values

      # INSTANCE

      $key: null
      $value: null
      $contentType: "application/json"
      $vclock: null
      $vtag: null

      constructor: ( ) ->

      getKey: ->
        return @$key

      getValue: ->
        return _.cloneDeep(@$value)

      setValue: ( value ) ->
        @$value = _.cloneDeep(value)
        return

      save: ->
        deferred = Q.defer()

        if DataModel.beforeSave instanceof Function
          DataModel.beforeSave(@)

        params = @_getParams()

        pbc.put( params, ( err, reply ) =>
          if err
            return deferred.reject( err )
          model = DataModel.$createFromReply( this.$key, reply, @ )

          if DataModel.afterSave instanceof Function
            DataModel.afterSave(model)

          deferred.resolve(
            model
          )
        )

        return deferred.promise
      remove: ->
        return DataModel.remove( @$key )

      getContentType: ->
        return @$contentType

      _getIndexes: ->
        indexes = []

        schema = DataModel.$getRiakSchema()

        if not schema
          return indexes

        fields = schema.getFields()
        types = {}
        flattened = DataModel._flatten(@getValue())

        _.each(schema.getFieldTypes(), (type) ->
          types[type.name] = type["class"]
        )

        for field in fields
          if field.type is "_yz_str"
            continue

          key = field.name

          # TODO http://lucene.apache.org/solr/4_6_0/solr-core/org/apache/solr/schema/PrimitiveFieldType.html

          switch types[field.type]
            when "solr.StrField"
              key += "_bin"
            when "solr.IntField"
              key += "_int"
            when "solr.BoolField"
              key += "_bool"
            else
              key += "_bin"

          multiValued = false
          if typeof field.multiValued is "string"
            multiValued = JSON.parse(field.multiValued)
          else
            multiValued = !!field.multiValued

          thisKey = _.where(flattened, (flat) ->
            return flat.key is field.name
          )

          for flat in thisKey
            indexes.push({
              key: key
              value: flat.value
            })

        return indexes

      _getParams: ->
        return {
          type: DataModel.$type
          bucket: DataModel.$bucket
          key: @$key
          vclock: @$vclock or undefined
          return_body: yes
          content:
            value: DataModel.serialize( @getContentType(), @$value )
            content_type: @getContentType()
            vtag: @$vtag or undefined
            indexes: @_getIndexes()
        }

    DataModel.$type = type
    DataModel.$bucket = bucket
    DataModel.$schema = schema
    DataModel.$riakSchema = riakSchema

    return DataModel


module.exports = self