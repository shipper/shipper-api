var Q, addPrefix, env, pbc, self, uuid, _;

Q = require('q');

_ = require('lodash');

uuid = require('node-uuid');

pbc = require('./pbc');

env = require('../../../env');

addPrefix = function(value) {
  var prefix;
  if (!value) {
    return value;
  }
  prefix = env.getRiakSchemaPrefix();
  if (value.indexOf(prefix) !== -1) {
    return value;
  }
  return "" + prefix + value;
};

self = {
  define: function(type, bucket, schema, riakSchema) {
    var DataModel;
    if (type == null) {
      type = "default";
    }
    if (!_.isString(bucket)) {
      throw new TypeError("Bucket is not a string");
    }
    if (!_.isString(type)) {
      throw new TypeError("Type is not a string");
    }
    if (!(_.isObject(schema) && _.isFunction(schema.validate))) {
      throw new TypeError("Schema is not a 'schema'");
    }
    bucket = "" + bucket;
    type = "" + type;
    if (type !== 'default') {
      type = addPrefix(type);
    }
    bucket = addPrefix(bucket);
    DataModel = (function() {
      DataModel.$createFromReply = function(key, reply, instance) {
        var content, result;
        if (instance == null) {
          instance = null;
        }
        content = reply.content[0];
        result = instance || new DataModel();
        result.$key = key;
        result.$value = content.value;
        result.$vclock = reply.vclock;
        result.$vtag = content.vtag;
        result.$contentType = content.content_type;
        return result;
      };

      DataModel.create = function(value, contentType) {
        var result;
        if (value == null) {
          value = {};
        }
        if (contentType == null) {
          contentType = "application/json";
        }
        result = new DataModel();
        result.$key = uuid.v4();
        result.$value = value;
        result.$contentType = contentType;
        return result;
      };

      DataModel.fetch = function(key) {
        var deferred;
        deferred = Q.defer();
        pbc.get({
          type: DataModel.$type,
          bucket: DataModel.$bucket,
          key: key
        }, function(err, reply) {
          if (err) {
            return deferred.reject(err);
          }
          return deferred.resolve(DataModel.$createFromReply(key, reply));
        });
        return deferred.promise;
      };

      DataModel.fetchByKeys = function(keys) {
        return Q.all(_.map(keys, function(key) {
          return DataModel.fetch(key);
        }));
      };

      DataModel.fetchBySecondary = function(index, key, first) {
        var deferred;
        if (first == null) {
          first = false;
        }
        deferred = Q.defer();
        pbc.getIndex({
          type: DataModel.$type,
          bucket: DataModel.$bucket,
          index: index,
          qtype: 0,
          key: key
        }, function(err, reply) {
          var keys, method;
          if (err) {
            return deferred.reject(err);
          }
          method = "fetchByKeys";
          keys = reply.keys || [];
          if (!keys.length && first) {
            return deferred.reject(new Error("NotFound"));
          }
          if (first) {
            method = "fetch";
            keys = keys[0];
          }
          return DataModel[method](keys).then(deferred.resolve).fail(deferred.reject);
        });
        return deferred.promise;
      };

      DataModel.fetchKeys = function() {
        var deferred;
        deferred = Q.defer();
        pbc.getKeys({
          bucket: DataModel.$bucket,
          type: DataModel.$type
        }, function(err, reply) {
          if (err) {
            return deferred.reject(err);
          }
          return deferred.resolve(reply.keys || []);
        });
        return deferred.promise;
      };

      DataModel.fetchAll = function() {
        var deferred;
        deferred = Q.defer();
        DataModel.fetchKeys().then(function(keys) {
          return DataModel.fetchByKeys(keys).then(deferred.resolve);
        }).fail(deferred.reject);
        return deferred.promise;
      };

      DataModel.search = function(options) {
        var deferred;
        if (options == null) {
          options = {};
        }
        deferred = Q.defer();
        if (!(options instanceof Object)) {
          options = {
            q: options
          };
        }
        options.index = DataModel.$bucket;
        pbc.search(options, function(err, reply) {
          var document, get, promise, promises, _i, _len, _ref;
          if (err) {
            return deferred.reject(err);
          }
          if (_.isEmpty(reply) || reply.num_found === 0 || _.isEmpty(reply.docs)) {
            return deferred.reject("Not found");
          }
          get = function(document) {
            var fields, keys, pair;
            fields = document.fields;
            keys = _.where(fields, {
              key: '_yz_rk'
            });
            if (!keys || !keys.length) {
              return;
            }
            pair = keys[0];
            if (!pair || !pair.value) {
              return;
            }
            return DataModel.fetch(pair.value);
          };
          promises = [];
          _ref = reply.docs;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            document = _ref[_i];
            promise = get(document);
            if (!promise) {
              continue;
            }
            if (options.first) {
              promise.then(deferred.resolve).fail(deferred.reject);
              return;
            }
            promises.push(promise);
          }
          return Q.all(promises).then(deferred.resolve).fail(deferred.reject);
        });
        return deferred.promise;
      };

      DataModel.remove = function(key) {
        var deferred;
        deferred = Q.defer();
        pbc.del({
          type: DataModel.$type,
          bucket: DataModel.$bucket,
          key: key
        }, function(err) {
          if (err) {
            return deferred.reject(err);
          }
          return deferred.resolve();
        });
        return deferred.promise;
      };

      DataModel.serialize = function(contentType, value) {
        switch (contentType) {
          case "application/json":
            return JSON.stringify(value);
          default:
            return new Buffer(value).toString();
        }
      };

      DataModel.$hasRiakSchema = function() {
        return !!DataModel.$riakSchema;
      };

      DataModel.$getRiakSchema = function() {
        return DataModel.$riakSchema;
      };

      DataModel.beforeSave = function(model) {};

      DataModel.afterSave = function(model) {};

      DataModel._flatten = function(value) {
        var flat, flatKey, flattened, i, key, values, _i, _j, _len, _len1;
        if (!(value instanceof Object)) {
          return [
            {
              key: "",
              value: value
            }
          ];
        }
        values = [];
        if (_.isArray(value)) {
          i = 0;
          while (i < value.length) {
            flattened = this._flatten(value[i]);
            for (_i = 0, _len = flattened.length; _i < _len; _i++) {
              flat = flattened[_i];
              values.push(flat);
            }
            i++;
          }
        } else {
          for (key in value) {
            if (!value.hasOwnProperty(key)) {
              continue;
            }
            flattened = DataModel._flatten(value[key]);
            for (_j = 0, _len1 = flattened.length; _j < _len1; _j++) {
              flat = flattened[_j];
              flatKey = key;
              if (flat.key) {
                flatKey += "." + flat.key;
              }
              values.push({
                key: flatKey,
                value: flat.value
              });
            }
          }
        }
        return values;
      };

      DataModel.prototype.$key = null;

      DataModel.prototype.$value = null;

      DataModel.prototype.$contentType = "application/json";

      DataModel.prototype.$vclock = null;

      DataModel.prototype.$vtag = null;

      function DataModel() {}

      DataModel.prototype.getKey = function() {
        return this.$key;
      };

      DataModel.prototype.getValue = function() {
        return _.cloneDeep(this.$value);
      };

      DataModel.prototype.setValue = function(value) {
        this.$value = _.cloneDeep(value);
      };

      DataModel.prototype.save = function() {
        var deferred, params;
        deferred = Q.defer();
        if (DataModel.beforeSave instanceof Function) {
          DataModel.beforeSave(this);
        }
        params = this._getParams();
        pbc.put(params, (function(_this) {
          return function(err, reply) {
            var model;
            if (err) {
              return deferred.reject(err);
            }
            model = DataModel.$createFromReply(_this.$key, reply, _this);
            if (DataModel.afterSave instanceof Function) {
              DataModel.afterSave(model);
            }
            return deferred.resolve(model);
          };
        })(this));
        return deferred.promise;
      };

      DataModel.prototype.remove = function() {
        return DataModel.remove(this.$key);
      };

      DataModel.prototype.getContentType = function() {
        return this.$contentType;
      };

      DataModel.prototype._getIndexes = function() {
        var field, fields, flat, flattened, indexes, key, multiValued, thisKey, types, _i, _j, _len, _len1;
        indexes = [];
        schema = DataModel.$getRiakSchema();
        if (!schema) {
          return indexes;
        }
        fields = schema.getFields();
        types = {};
        flattened = DataModel._flatten(this.getValue());
        _.each(schema.getFieldTypes(), function(type) {
          return types[type.name] = type["class"];
        });
        for (_i = 0, _len = fields.length; _i < _len; _i++) {
          field = fields[_i];
          if (field.type === "_yz_str") {
            continue;
          }
          key = field.name;
          switch (types[field.type]) {
            case "solr.StrField":
              key += "_bin";
              break;
            case "solr.IntField":
              key += "_int";
              break;
            case "solr.BoolField":
              key += "_bool";
              break;
            default:
              key += "_bin";
          }
          multiValued = false;
          if (typeof field.multiValued === "string") {
            multiValued = JSON.parse(field.multiValued);
          } else {
            multiValued = !!field.multiValued;
          }
          thisKey = _.where(flattened, function(flat) {
            return flat.key === field.name;
          });
          for (_j = 0, _len1 = thisKey.length; _j < _len1; _j++) {
            flat = thisKey[_j];
            indexes.push({
              key: key,
              value: flat.value
            });
          }
        }
        return indexes;
      };

      DataModel.prototype._getParams = function() {
        return {
          type: DataModel.$type,
          bucket: DataModel.$bucket,
          key: this.$key,
          vclock: this.$vclock || void 0,
          return_body: true,
          content: {
            value: DataModel.serialize(this.getContentType(), this.$value),
            content_type: this.getContentType(),
            vtag: this.$vtag || void 0,
            indexes: this._getIndexes()
          }
        };
      };

      return DataModel;

    })();
    DataModel.$type = type;
    DataModel.$bucket = bucket;
    DataModel.$schema = schema;
    DataModel.$riakSchema = riakSchema;
    return DataModel;
  }
};

module.exports = self;
