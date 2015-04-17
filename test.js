'use strict';
var Cache = require('./');
var test = require('tape');

test('basic get set delete', function (t) {
  t.plan(6);
  var cache = new Cache(1000);
  var bar = {};
  cache.set('foo', bar);
  t.ok(cache.has('foo'), 'has it');
  t.ok(cache.get('foo') === bar, 'same thing');
  t.ok(cache.delete('foo'), 'deletes it');
  t.notOk(cache.has('foo'), 'doesn\'t have it');
  t.notOk(cache.get('foo'), 'can\'t get it');
  t.notOk(cache.delete('foo'), 'can\'t delete it');
});

test('strict get set delete', function (t) {
  t.plan(6);
  var cache = new Cache(1000, true);
  var bar = {};
  cache.set('foo', bar);
  t.ok(cache.has('foo'), 'has it');
  t.ok(cache.get('foo') === bar, 'same thing');
  t.ok(cache.delete('foo'), 'deletes it');
  t.notOk(cache.has('foo'), 'doesn\'t have it');
  t.throws(cache.get.bind(cache, 'foo'), 'can\'t get it');
  t.throws(cache.delete.bind(cache, 'foo'), 'can\'t delete it');
});

test('basic get set timeout', function (t) {
  t.plan(5);
  var cache = new Cache(50);
  var bar = {};
  cache.set('foo', bar);
  t.ok(cache.has('foo'), 'has it');
  t.ok(cache.get('foo') === bar, 'same thing');
  setTimeout(function () {
    t.notOk(cache.has('foo'), 'doesn\'t have it');
    t.notOk(cache.get('foo'), 'can\'t get it');
    t.notOk(cache.delete('foo'), 'can\'t delete it');
  }, 51);
});

test('strict get set timeout', function (t) {
  t.plan(5);
  var cache = new Cache(50, true);
  var bar = {};
  cache.set('foo', bar);
  t.ok(cache.has('foo'), 'has it');
  t.ok(cache.get('foo') === bar, 'same thing');
  setTimeout(function () {
    t.notOk(cache.has('foo'), 'doesn\'t have it');
    t.throws(cache.get.bind(cache, 'foo'), 'can\'t get it');
    t.throws(cache.delete.bind(cache, 'foo'), 'can\'t delete it');
  }, 51);
});

test('timeouts', function outerTimeout (t) {
  var i = 0;

  while (++i <= 100) {
    timeouts(i, t);
    timeouts2(i, t);
  }
});
function timeouts (j, t) {
  t.test('round ' + j, function innerTimeout(t) {
    t.plan(1);
    var cache = new Cache(3);
    var key = 'round ' + j;
    cache.set(key, 'bar');
    var i = 0;
    while(true) {
      if (!cache.has(key)) {
        break;
      }
      i++;
      cache.set(i, {});
      if (!cache.get(key)) {
        throw new Error('wtf?');
      }
      cache.has(i);// depotimize it so it runs slower
      cache.get(i);// depotimize it so it runs slower
    }
    t.ok(true, 'deopt: made it through round ' + j + ' in ' + i + ' loops');
  });
}
function timeouts2 (j, t) {
  t.test('round ' + j, function innerTimeout(t) {
    t.plan(1);
    var cache = new Cache(3);
    var key = 'round ' + j;
    cache.set(key, 'bar');
    var i = 0;
    while(true) {
      if (!cache.has(key)) {
        break;
      }
      i++;
      if (!cache.get(key)) {
        throw new Error('wtf?');
      }
    }
    t.ok(true, 'opt: made it through round ' + j + ' in ' + i + ' loops');
  });
}
