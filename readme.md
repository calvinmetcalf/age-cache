# Age Cache

A simple string map with a time to live.  Similar to the maxAge setting in
[lru-cache](https://www.npmjs.com/package/lru-cache) except getting a key does
not update it's time to live.  Keys are not proactivly removed but only on calls
to get or has.

# API

## new Cache(ttl, [strict = false])

Constructor, takes 2 arguments

- ttl: time to live in milliseconds, mandatory
- strict: whether it should be in strict mode which causes gets and deletes of
non existent keys to throw, default is false.

## cache.set(key, value)

Set the key to the specified value overwriting it if it already exists

## cache.get(key)

Return the value with the specified key, if the key is not found then it will
return undefined or in strict mode throw an error. The key will be deleted if it
has expired.

## cache.has(key, [plusOne])

Returns true if the key exists, false otherwise, if the key is expired it will be
deleted and this method will return false. If the second value is truthy then
it will return true if the time since the key was created is less then or equal
to the maxAge, normally it will only return true if the value is less (but not
equal).  You shouldn't need to use this, but we internally use it to decrease
the likelihood of a key expiring between checking it and getting it.

## cache.delete(key)

Remove the key from the cache.  If the key exists returns true, if it does it
returns false or, in strict mode, throws an error.

# Usage

```js
var Cache = require('age-cache');

var cache = new Cache(1000); // one second

cache.set('foo', 'bar');

cache.get('foo'); // bar

cache.has('foo'); // true

cache.has('bar'); // false

setTimeout(function () {
  cache.get('foo'); // undefined

  cache.has('foo'); // false
}, 1001)
```
