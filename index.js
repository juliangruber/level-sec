
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

  this.db['by' + name] = Secondary(this.db, name, function(value) {
    var segs = [];
    props.forEach(function(prop) {
      segs.push(access(value, prop));
    });
    return segs.join('!');
  });
  return this;
};

