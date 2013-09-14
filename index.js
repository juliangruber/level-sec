
/**
 * Module dependencies.
 */

var Secondary = require('level-secondary');

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
 * Index by `name` and optionally `fn`.
 *
 * @param {Object} name
 * @param {Function=} fn
 * @return {Index}
 */

Index.prototype.by = function(name, fn) {
  var prop = 'by' + name[0].toUpperCase() + name.slice(1);
  this.db[prop] = Secondary(this.db, name, fn);
  return this;
};

