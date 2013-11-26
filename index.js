
/**
 * Module dependencies.
 */

var Secondary = require('level-secondary');
var access = require('deep-access');

/**
 * Expose `Index`.
 */

module.exports = Index;

/**
 * Index `db`.
 *
 * @param {LevelUp} db
 * @return {Index}
 */

function Index(db) {
  if (!(this instanceof Index)) return new Index(db);
  this.db = db;
  this.db.methods = this.db.methods || {};
}

/**
 * Index by `name` and `props`.
 *
 * @param {Object} name
 * @param {Array[Object]|Object} props
 * @return {Index}
 */

Index.prototype.by = function(name, props) {
  if (!Array.isArray(props)) props = [props];

  var sec = Secondary(this.db, name, function(value) {
    var segs = [];
    props.forEach(function(prop) {
      try {
        var seg = access(value, prop);
      } catch (e) {
        return;
      }
      segs.push(seg);
    });
    return segs.join('!');
  });
  
  this.db['by' + name] = sec;
  this.db.methods['by' + name] = {
    type: 'object',
    methods: sec.manifest.methods
  };
  return this;
};

