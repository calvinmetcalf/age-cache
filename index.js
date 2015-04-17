'use strict';

var SAFE = {};

module.exports = Cache;

function Cache(maxAge, strict) {
  if (!(this instanceof Cache)) {
    return new Cache(maxAge, strict);
  }
  this.maxAge = maxAge;
  this.strict = !!strict;
  this.store = Object.create(null);
}

Cache.prototype.set = function cacheSet(key, value) {
  key = '$' + key;
  this.store[key] = new Item(value);
  return this;
};

Cache.prototype.has = function cacheHas(key, safe) {
  key = '$' + key;
  if (!(Object.prototype.hasOwnProperty.call(this.store, key))) {
    return false;
  }
  var entry = this.store[key];

  if ((Date.now() - entry.date) > this.maxAge) {
    if (safe === SAFE && entry.safe) {
      return true;
    }
    delete this.store[key];
    return false;
  }
  if (!safe) {
    entry.setSafe();
  }
  return true;
};

Cache.prototype.get = function cacheGet(key) {
  /*eslint consistent-return:0*/
  if (!this.has(key, SAFE)) {
    if (this.strict) {
      throw new Error('not found');
    }
    return;
  }
  key = '$' + key;
  return this.store[key].value;
};

Cache.prototype.delete = Cache.prototype.del = function cacheDel(key) {
  if (!this.has(key, SAFE)) {
    if (this.strict) {
      throw new Error('not found');
    }
    return false;
  }
  key = '$' + key;
  delete this.store[key];
  return true;
};

function Item(value) {
  this.value = value;
  this.date = Date.now();
  this.safe = false;
}

Item.prototype.setSafe = function () {
  if (this.safe) {
    return;
  }
  var self = this;
  this.safe = true;
  process.nextTick(function () {
    self.safe = false;
  });
};
