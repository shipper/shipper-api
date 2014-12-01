var Q, RiakSchema, child, env, pbc, _;

pbc = require('./pbc');

Q = require('q');

child = require('child_process');

env = require('../../../env');

_ = require('lodash');

RiakSchema = (function() {
  var _dynamicField, _fieldTypes, _fields, _name;

  _name = "";

  _fields = [];

  _fieldTypes = [];

  _dynamicField = false;

  function RiakSchema(name) {
    var prefix;
    prefix = env.getRiakSchemaPrefix();
    if (prefix && name.indexOf(prefix) === -1) {
      name = "" + prefix + name;
    }
    this._name = name;
    this._fields = [];
    this._fieldTypes = [];
    this.addFieldType({
      name: '_yz_str',
      'class': 'solr.StrField',
      sortMissingLast: 'true'
    });
    this.addField({
      name: '_yz_id',
      type: '_yz_str',
      indexed: 'true',
      stored: 'true',
      multiValued: 'false',
      required: 'true',
      last: true
    });
    this.addField({
      name: '_yz_ed',
      type: '_yz_str',
      indexed: 'true',
      stored: 'false',
      multiValued: 'false',
      last: true
    });
    this.addField({
      name: '_yz_pn',
      type: '_yz_str',
      indexed: 'true',
      stored: 'false',
      multiValued: 'false',
      last: true
    });
    this.addField({
      name: '_yz_fpn',
      type: '_yz_str',
      indexed: 'true',
      stored: 'false',
      multiValued: 'false',
      last: true
    });
    this.addField({
      name: '_yz_vtag',
      type: '_yz_str',
      indexed: 'true',
      stored: 'false',
      multiValued: 'false',
      last: true
    });
    this.addField({
      name: '_yz_rk',
      type: '_yz_str',
      indexed: 'true',
      stored: 'true',
      multiValued: 'false',
      last: true
    });
    this.addField({
      name: '_yz_rt',
      type: '_yz_str',
      indexed: 'true',
      stored: 'true',
      multiValued: 'false',
      last: true
    });
    this.addField({
      name: '_yz_rb',
      type: '_yz_str',
      indexed: 'true',
      stored: 'true',
      multiValued: 'false',
      last: true
    });
    this.addField({
      name: '_yz_err',
      type: '_yz_str',
      indexed: 'true',
      stored: 'false',
      multiValued: 'false',
      last: true
    });
  }

  RiakSchema.prototype.addField = function(field) {
    return this._fields.push(field);
  };

  RiakSchema.prototype.addFieldType = function(type) {
    return this._fieldTypes.push(type);
  };

  RiakSchema.prototype.addDynamicField = function() {
    this._dynamicField = true;
    return this.addFieldType({
      name: 'ignored',
      stored: 'false',
      indexed: 'false',
      multiValued: 'true',
      'class': 'solr.StrField'
    });
  };

  RiakSchema.prototype.getFields = function() {
    return _.cloneDeep(this._fields);
  };

  RiakSchema.prototype.getFieldTypes = function() {
    return _.cloneDeep(this._fieldTypes);
  };

  RiakSchema.prototype.$createXML = function() {
    var addFields, key, line, lines, type, _i, _len, _ref;
    lines = [];
    lines.push("<?xml version=\"1.0\" encoding=\"UTF-8\" ?>");
    lines.push("<schema name=\"" + this._name + "\" version=\"1.5\">");
    lines.push("<fields>");
    addFields = function(fields) {
      var field, key, line, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = fields.length; _i < _len; _i++) {
        field = fields[_i];
        line = [];
        line.push("<field");
        for (key in field) {
          if (!field.hasOwnProperty(key)) {
            continue;
          }
          if (key === 'last') {
            continue;
          }
          line.push("" + key + "=\"" + field[key] + "\"");
        }
        line.push("/>");
        _results.push(lines.push(line.join(" ")));
      }
      return _results;
    };
    addFields(_.where(this._fields, function(field) {
      return field && !field.last;
    }));
    addFields(_.where(this._fields, function(field) {
      return field && field.last;
    }));
    if (this._dynamicField) {
      lines.push("<dynamicField name=\"*\" type=\"ignored\" />");
    }
    lines.push("</fields>");
    lines.push("<uniqueKey>_yz_id</uniqueKey>");
    lines.push("<types>");
    _ref = this._fieldTypes;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      type = _ref[_i];
      line = [];
      line.push("<fieldType");
      for (key in type) {
        if (!type.hasOwnProperty(key)) {
          continue;
        }
        line.push("" + key + "=\"" + type[key] + "\"");
      }
      line.push("/>");
      lines.push(line.join(" "));
    }
    lines.push("</types>");
    lines.push("</schema>");
    return lines.join('\n');
  };

  RiakSchema.prototype.$putSchema = function() {
    var deferred, xml;
    deferred = Q.defer();
    xml = this.$createXML();
    pbc.putSearchSchema({
      schema: {
        name: this._name,
        content: xml
      }
    }, function(err, reply) {
      if (err) {
        return deferred.reject(err);
      }
      return deferred.resolve(reply);
    });
    return deferred.promise;
  };

  RiakSchema.prototype.$delIndex = function() {
    var deferred;
    deferred = Q.defer();
    pbc.delSearchIndex({
      name: this._name
    }, function(err) {
      if (err) {
        return deferred.reject(err);
      }
      return deferred.resolve();
    });
    return deferred.promise;
  };

  RiakSchema.prototype.$putIndex = function() {
    var deferred;
    deferred = Q.defer();
    pbc.putSearchIndex({
      index: {
        name: this._name,
        schema: this._name
      }
    }, function(err) {
      if (err) {
        return deferred.reject(err);
      }
      return deferred.resolve();
    });
    return deferred.promise;
  };

  RiakSchema.prototype.$getIndex = function() {
    var deferred;
    deferred = Q.defer();
    pbc.getSearchIndex({
      name: this._name
    }, function(err, reply) {
      if (err) {
        return deferred.reject(err);
      }
      return deferred.resolve(reply);
    });
    return deferred.promise;
  };

  RiakSchema.prototype.isActive = function() {
    var admin, args, data, deferred;
    deferred = Q.defer();
    args = ["bucket-type", "status", this._name];
    admin = child.spawn('riak-admin', args);
    data = "";
    admin.stdout.on('data', function(d) {
      return data += d;
    });
    admin.stderr.on('data', function(d) {
      return console.log("stderr: " + d);
    });
    admin.on('close', function(code) {
      if (code === 0) {
        return deferred.resolve(data.indexOf("is active") !== -1);
      }
      return deferred.resolve(false);
    });
    return deferred.promise;
  };

  RiakSchema.prototype.create = function() {
    return this.$create('create');
  };

  RiakSchema.prototype.update = function() {
    return this.$create('update');
  };

  RiakSchema.prototype.$create = function(type) {
    return this.$riakAdmin(['bucket-type', type, this._name, '{"props":{"search_index":"' + this._name + '","allow_mult":false}}']);
  };

  RiakSchema.prototype.activate = function() {
    return this.$riakAdmin(['bucket-type', 'activate', this._name]);
  };

  RiakSchema.prototype.$riakAdmin = function(args) {
    var admin, deferred;
    deferred = Q.defer();
    admin = child.spawn('riak-admin', args);
    admin.stdout.on('data', function(data) {
      return console.log("stdout: " + data);
    });
    admin.stderr.on('data', function(data) {
      return console.log("stderr: " + data);
    });
    admin.on('close', function(code) {
      if (code === 0) {
        return deferred.resolve();
      }
      return deferred.reject(new Error("riak-admin " + (JSON.stringify(args)) + " exited with code " + code));
    });
    return deferred.promise;
  };

  RiakSchema.prototype.put = function() {
    return this.$putSchema().then((function(_this) {
      return function() {
        return _this.$delIndex().then(function() {
          return _this.$putIndex();
        });
      };
    })(this));
  };

  return RiakSchema;

})();

module.exports = RiakSchema;
