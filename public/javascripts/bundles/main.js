(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
'use strict';
var $ = require('jquery');
$(function() {
  var React = require('react/addons');
  var Router = require('react-router');
  window.React = React;
  React.initializeTouchEvents(true);
  var Services = require('./services');
  Services.initialize(window.EX.const.apiAccessToken);
  var Stores = require('./stores');
  Stores.initialize();
  window._stores = Stores;
  var Routes = require('./routes.jsx');
  var router = Router.create({
    routes: Routes,
    location: Router.HistoryLocation,
    onError: function() {
      alert('unexpected error in Router');
    }
  });
  router.run(function(Handler) {
    React.render(React.createElement(Handler, null), document.body);
  });
});


//# sourceURL=/Users/hburrows/dev/heroku/react-flux-starter/public/javascripts/main.jsx
},{"./routes.jsx":28,"./services":30,"./stores":33,"jquery":"jquery","react-router":"react-router","react/addons":"react/addons"}],2:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;

function drainQueue() {
    if (draining) {
        return;
    }
    draining = true;
    var currentQueue;
    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        var i = -1;
        while (++i < len) {
            currentQueue[i]();
        }
        len = queue.length;
    }
    draining = false;
}
process.nextTick = function (fun) {
    queue.push(fun);
    if (!draining) {
        setTimeout(drainQueue, 0);
    }
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],3:[function(require,module,exports){
/**
 *  Copyright (c) 2014-2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  global.Immutable = factory()
}(this, function () { 'use strict';var SLICE$0 = Array.prototype.slice;

  function createClass(ctor, superClass) {
    if (superClass) {
      ctor.prototype = Object.create(superClass.prototype);
    }
    ctor.prototype.constructor = ctor;
  }

  // Used for setting prototype methods that IE8 chokes on.
  var DELETE = 'delete';

  // Constants describing the size of trie nodes.
  var SHIFT = 5; // Resulted in best performance after ______?
  var SIZE = 1 << SHIFT;
  var MASK = SIZE - 1;

  // A consistent shared value representing "not set" which equals nothing other
  // than itself, and nothing that could be provided externally.
  var NOT_SET = {};

  // Boolean references, Rough equivalent of `bool &`.
  var CHANGE_LENGTH = { value: false };
  var DID_ALTER = { value: false };

  function MakeRef(ref) {
    ref.value = false;
    return ref;
  }

  function SetRef(ref) {
    ref && (ref.value = true);
  }

  // A function which returns a value representing an "owner" for transient writes
  // to tries. The return value will only ever equal itself, and will not equal
  // the return of any subsequent call of this function.
  function OwnerID() {}

  // http://jsperf.com/copy-array-inline
  function arrCopy(arr, offset) {
    offset = offset || 0;
    var len = Math.max(0, arr.length - offset);
    var newArr = new Array(len);
    for (var ii = 0; ii < len; ii++) {
      newArr[ii] = arr[ii + offset];
    }
    return newArr;
  }

  function ensureSize(iter) {
    if (iter.size === undefined) {
      iter.size = iter.__iterate(returnTrue);
    }
    return iter.size;
  }

  function wrapIndex(iter, index) {
    return index >= 0 ? (+index) : ensureSize(iter) + (+index);
  }

  function returnTrue() {
    return true;
  }

  function wholeSlice(begin, end, size) {
    return (begin === 0 || (size !== undefined && begin <= -size)) &&
      (end === undefined || (size !== undefined && end >= size));
  }

  function resolveBegin(begin, size) {
    return resolveIndex(begin, size, 0);
  }

  function resolveEnd(end, size) {
    return resolveIndex(end, size, size);
  }

  function resolveIndex(index, size, defaultIndex) {
    return index === undefined ?
      defaultIndex :
      index < 0 ?
        Math.max(0, size + index) :
        size === undefined ?
          index :
          Math.min(size, index);
  }

  function Iterable(value) {
      return isIterable(value) ? value : Seq(value);
    }


  createClass(KeyedIterable, Iterable);
    function KeyedIterable(value) {
      return isKeyed(value) ? value : KeyedSeq(value);
    }


  createClass(IndexedIterable, Iterable);
    function IndexedIterable(value) {
      return isIndexed(value) ? value : IndexedSeq(value);
    }


  createClass(SetIterable, Iterable);
    function SetIterable(value) {
      return isIterable(value) && !isAssociative(value) ? value : SetSeq(value);
    }



  function isIterable(maybeIterable) {
    return !!(maybeIterable && maybeIterable[IS_ITERABLE_SENTINEL]);
  }

  function isKeyed(maybeKeyed) {
    return !!(maybeKeyed && maybeKeyed[IS_KEYED_SENTINEL]);
  }

  function isIndexed(maybeIndexed) {
    return !!(maybeIndexed && maybeIndexed[IS_INDEXED_SENTINEL]);
  }

  function isAssociative(maybeAssociative) {
    return isKeyed(maybeAssociative) || isIndexed(maybeAssociative);
  }

  function isOrdered(maybeOrdered) {
    return !!(maybeOrdered && maybeOrdered[IS_ORDERED_SENTINEL]);
  }

  Iterable.isIterable = isIterable;
  Iterable.isKeyed = isKeyed;
  Iterable.isIndexed = isIndexed;
  Iterable.isAssociative = isAssociative;
  Iterable.isOrdered = isOrdered;

  Iterable.Keyed = KeyedIterable;
  Iterable.Indexed = IndexedIterable;
  Iterable.Set = SetIterable;


  var IS_ITERABLE_SENTINEL = '@@__IMMUTABLE_ITERABLE__@@';
  var IS_KEYED_SENTINEL = '@@__IMMUTABLE_KEYED__@@';
  var IS_INDEXED_SENTINEL = '@@__IMMUTABLE_INDEXED__@@';
  var IS_ORDERED_SENTINEL = '@@__IMMUTABLE_ORDERED__@@';

  /* global Symbol */

  var ITERATE_KEYS = 0;
  var ITERATE_VALUES = 1;
  var ITERATE_ENTRIES = 2;

  var REAL_ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator';

  var ITERATOR_SYMBOL = REAL_ITERATOR_SYMBOL || FAUX_ITERATOR_SYMBOL;


  function src_Iterator__Iterator(next) {
      this.next = next;
    }

    src_Iterator__Iterator.prototype.toString = function() {
      return '[Iterator]';
    };


  src_Iterator__Iterator.KEYS = ITERATE_KEYS;
  src_Iterator__Iterator.VALUES = ITERATE_VALUES;
  src_Iterator__Iterator.ENTRIES = ITERATE_ENTRIES;

  src_Iterator__Iterator.prototype.inspect =
  src_Iterator__Iterator.prototype.toSource = function () { return this.toString(); }
  src_Iterator__Iterator.prototype[ITERATOR_SYMBOL] = function () {
    return this;
  };


  function iteratorValue(type, k, v, iteratorResult) {
    var value = type === 0 ? k : type === 1 ? v : [k, v];
    iteratorResult ? (iteratorResult.value = value) : (iteratorResult = {
      value: value, done: false
    });
    return iteratorResult;
  }

  function iteratorDone() {
    return { value: undefined, done: true };
  }

  function hasIterator(maybeIterable) {
    return !!getIteratorFn(maybeIterable);
  }

  function isIterator(maybeIterator) {
    return maybeIterator && typeof maybeIterator.next === 'function';
  }

  function getIterator(iterable) {
    var iteratorFn = getIteratorFn(iterable);
    return iteratorFn && iteratorFn.call(iterable);
  }

  function getIteratorFn(iterable) {
    var iteratorFn = iterable && (
      (REAL_ITERATOR_SYMBOL && iterable[REAL_ITERATOR_SYMBOL]) ||
      iterable[FAUX_ITERATOR_SYMBOL]
    );
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  function isArrayLike(value) {
    return value && typeof value.length === 'number';
  }

  createClass(Seq, Iterable);
    function Seq(value) {
      return value === null || value === undefined ? emptySequence() :
        isIterable(value) ? value.toSeq() : seqFromValue(value);
    }

    Seq.of = function(/*...values*/) {
      return Seq(arguments);
    };

    Seq.prototype.toSeq = function() {
      return this;
    };

    Seq.prototype.toString = function() {
      return this.__toString('Seq {', '}');
    };

    Seq.prototype.cacheResult = function() {
      if (!this._cache && this.__iterateUncached) {
        this._cache = this.entrySeq().toArray();
        this.size = this._cache.length;
      }
      return this;
    };

    // abstract __iterateUncached(fn, reverse)

    Seq.prototype.__iterate = function(fn, reverse) {
      return seqIterate(this, fn, reverse, true);
    };

    // abstract __iteratorUncached(type, reverse)

    Seq.prototype.__iterator = function(type, reverse) {
      return seqIterator(this, type, reverse, true);
    };



  createClass(KeyedSeq, Seq);
    function KeyedSeq(value) {
      return value === null || value === undefined ?
        emptySequence().toKeyedSeq() :
        isIterable(value) ?
          (isKeyed(value) ? value.toSeq() : value.fromEntrySeq()) :
          keyedSeqFromValue(value);
    }

    KeyedSeq.prototype.toKeyedSeq = function() {
      return this;
    };



  createClass(IndexedSeq, Seq);
    function IndexedSeq(value) {
      return value === null || value === undefined ? emptySequence() :
        !isIterable(value) ? indexedSeqFromValue(value) :
        isKeyed(value) ? value.entrySeq() : value.toIndexedSeq();
    }

    IndexedSeq.of = function(/*...values*/) {
      return IndexedSeq(arguments);
    };

    IndexedSeq.prototype.toIndexedSeq = function() {
      return this;
    };

    IndexedSeq.prototype.toString = function() {
      return this.__toString('Seq [', ']');
    };

    IndexedSeq.prototype.__iterate = function(fn, reverse) {
      return seqIterate(this, fn, reverse, false);
    };

    IndexedSeq.prototype.__iterator = function(type, reverse) {
      return seqIterator(this, type, reverse, false);
    };



  createClass(SetSeq, Seq);
    function SetSeq(value) {
      return (
        value === null || value === undefined ? emptySequence() :
        !isIterable(value) ? indexedSeqFromValue(value) :
        isKeyed(value) ? value.entrySeq() : value
      ).toSetSeq();
    }

    SetSeq.of = function(/*...values*/) {
      return SetSeq(arguments);
    };

    SetSeq.prototype.toSetSeq = function() {
      return this;
    };



  Seq.isSeq = isSeq;
  Seq.Keyed = KeyedSeq;
  Seq.Set = SetSeq;
  Seq.Indexed = IndexedSeq;

  var IS_SEQ_SENTINEL = '@@__IMMUTABLE_SEQ__@@';

  Seq.prototype[IS_SEQ_SENTINEL] = true;



  // #pragma Root Sequences

  createClass(ArraySeq, IndexedSeq);
    function ArraySeq(array) {
      this._array = array;
      this.size = array.length;
    }

    ArraySeq.prototype.get = function(index, notSetValue) {
      return this.has(index) ? this._array[wrapIndex(this, index)] : notSetValue;
    };

    ArraySeq.prototype.__iterate = function(fn, reverse) {
      var array = this._array;
      var maxIndex = array.length - 1;
      for (var ii = 0; ii <= maxIndex; ii++) {
        if (fn(array[reverse ? maxIndex - ii : ii], ii, this) === false) {
          return ii + 1;
        }
      }
      return ii;
    };

    ArraySeq.prototype.__iterator = function(type, reverse) {
      var array = this._array;
      var maxIndex = array.length - 1;
      var ii = 0;
      return new src_Iterator__Iterator(function() 
        {return ii > maxIndex ?
          iteratorDone() :
          iteratorValue(type, ii, array[reverse ? maxIndex - ii++ : ii++])}
      );
    };



  createClass(ObjectSeq, KeyedSeq);
    function ObjectSeq(object) {
      var keys = Object.keys(object);
      this._object = object;
      this._keys = keys;
      this.size = keys.length;
    }

    ObjectSeq.prototype.get = function(key, notSetValue) {
      if (notSetValue !== undefined && !this.has(key)) {
        return notSetValue;
      }
      return this._object[key];
    };

    ObjectSeq.prototype.has = function(key) {
      return this._object.hasOwnProperty(key);
    };

    ObjectSeq.prototype.__iterate = function(fn, reverse) {
      var object = this._object;
      var keys = this._keys;
      var maxIndex = keys.length - 1;
      for (var ii = 0; ii <= maxIndex; ii++) {
        var key = keys[reverse ? maxIndex - ii : ii];
        if (fn(object[key], key, this) === false) {
          return ii + 1;
        }
      }
      return ii;
    };

    ObjectSeq.prototype.__iterator = function(type, reverse) {
      var object = this._object;
      var keys = this._keys;
      var maxIndex = keys.length - 1;
      var ii = 0;
      return new src_Iterator__Iterator(function()  {
        var key = keys[reverse ? maxIndex - ii : ii];
        return ii++ > maxIndex ?
          iteratorDone() :
          iteratorValue(type, key, object[key]);
      });
    };

  ObjectSeq.prototype[IS_ORDERED_SENTINEL] = true;


  createClass(IterableSeq, IndexedSeq);
    function IterableSeq(iterable) {
      this._iterable = iterable;
      this.size = iterable.length || iterable.size;
    }

    IterableSeq.prototype.__iterateUncached = function(fn, reverse) {
      if (reverse) {
        return this.cacheResult().__iterate(fn, reverse);
      }
      var iterable = this._iterable;
      var iterator = getIterator(iterable);
      var iterations = 0;
      if (isIterator(iterator)) {
        var step;
        while (!(step = iterator.next()).done) {
          if (fn(step.value, iterations++, this) === false) {
            break;
          }
        }
      }
      return iterations;
    };

    IterableSeq.prototype.__iteratorUncached = function(type, reverse) {
      if (reverse) {
        return this.cacheResult().__iterator(type, reverse);
      }
      var iterable = this._iterable;
      var iterator = getIterator(iterable);
      if (!isIterator(iterator)) {
        return new src_Iterator__Iterator(iteratorDone);
      }
      var iterations = 0;
      return new src_Iterator__Iterator(function()  {
        var step = iterator.next();
        return step.done ? step : iteratorValue(type, iterations++, step.value);
      });
    };



  createClass(IteratorSeq, IndexedSeq);
    function IteratorSeq(iterator) {
      this._iterator = iterator;
      this._iteratorCache = [];
    }

    IteratorSeq.prototype.__iterateUncached = function(fn, reverse) {
      if (reverse) {
        return this.cacheResult().__iterate(fn, reverse);
      }
      var iterator = this._iterator;
      var cache = this._iteratorCache;
      var iterations = 0;
      while (iterations < cache.length) {
        if (fn(cache[iterations], iterations++, this) === false) {
          return iterations;
        }
      }
      var step;
      while (!(step = iterator.next()).done) {
        var val = step.value;
        cache[iterations] = val;
        if (fn(val, iterations++, this) === false) {
          break;
        }
      }
      return iterations;
    };

    IteratorSeq.prototype.__iteratorUncached = function(type, reverse) {
      if (reverse) {
        return this.cacheResult().__iterator(type, reverse);
      }
      var iterator = this._iterator;
      var cache = this._iteratorCache;
      var iterations = 0;
      return new src_Iterator__Iterator(function()  {
        if (iterations >= cache.length) {
          var step = iterator.next();
          if (step.done) {
            return step;
          }
          cache[iterations] = step.value;
        }
        return iteratorValue(type, iterations, cache[iterations++]);
      });
    };




  // # pragma Helper functions

  function isSeq(maybeSeq) {
    return !!(maybeSeq && maybeSeq[IS_SEQ_SENTINEL]);
  }

  var EMPTY_SEQ;

  function emptySequence() {
    return EMPTY_SEQ || (EMPTY_SEQ = new ArraySeq([]));
  }

  function keyedSeqFromValue(value) {
    var seq =
      Array.isArray(value) ? new ArraySeq(value).fromEntrySeq() :
      isIterator(value) ? new IteratorSeq(value).fromEntrySeq() :
      hasIterator(value) ? new IterableSeq(value).fromEntrySeq() :
      typeof value === 'object' ? new ObjectSeq(value) :
      undefined;
    if (!seq) {
      throw new TypeError(
        'Expected Array or iterable object of [k, v] entries, '+
        'or keyed object: ' + value
      );
    }
    return seq;
  }

  function indexedSeqFromValue(value) {
    var seq = maybeIndexedSeqFromValue(value);
    if (!seq) {
      throw new TypeError(
        'Expected Array or iterable object of values: ' + value
      );
    }
    return seq;
  }

  function seqFromValue(value) {
    var seq = maybeIndexedSeqFromValue(value) ||
      (typeof value === 'object' && new ObjectSeq(value));
    if (!seq) {
      throw new TypeError(
        'Expected Array or iterable object of values, or keyed object: ' + value
      );
    }
    return seq;
  }

  function maybeIndexedSeqFromValue(value) {
    return (
      isArrayLike(value) ? new ArraySeq(value) :
      isIterator(value) ? new IteratorSeq(value) :
      hasIterator(value) ? new IterableSeq(value) :
      undefined
    );
  }

  function seqIterate(seq, fn, reverse, useKeys) {
    var cache = seq._cache;
    if (cache) {
      var maxIndex = cache.length - 1;
      for (var ii = 0; ii <= maxIndex; ii++) {
        var entry = cache[reverse ? maxIndex - ii : ii];
        if (fn(entry[1], useKeys ? entry[0] : ii, seq) === false) {
          return ii + 1;
        }
      }
      return ii;
    }
    return seq.__iterateUncached(fn, reverse);
  }

  function seqIterator(seq, type, reverse, useKeys) {
    var cache = seq._cache;
    if (cache) {
      var maxIndex = cache.length - 1;
      var ii = 0;
      return new src_Iterator__Iterator(function()  {
        var entry = cache[reverse ? maxIndex - ii : ii];
        return ii++ > maxIndex ?
          iteratorDone() :
          iteratorValue(type, useKeys ? entry[0] : ii - 1, entry[1]);
      });
    }
    return seq.__iteratorUncached(type, reverse);
  }

  createClass(Collection, Iterable);
    function Collection() {
      throw TypeError('Abstract');
    }


  createClass(KeyedCollection, Collection);function KeyedCollection() {}

  createClass(IndexedCollection, Collection);function IndexedCollection() {}

  createClass(SetCollection, Collection);function SetCollection() {}


  Collection.Keyed = KeyedCollection;
  Collection.Indexed = IndexedCollection;
  Collection.Set = SetCollection;

  /**
   * An extension of the "same-value" algorithm as [described for use by ES6 Map
   * and Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map#Key_equality)
   *
   * NaN is considered the same as NaN, however -0 and 0 are considered the same
   * value, which is different from the algorithm described by
   * [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is).
   *
   * This is extended further to allow Objects to describe the values they
   * represent, by way of `valueOf` or `equals` (and `hashCode`).
   *
   * Note: because of this extension, the key equality of Immutable.Map and the
   * value equality of Immutable.Set will differ from ES6 Map and Set.
   *
   * ### Defining custom values
   *
   * The easiest way to describe the value an object represents is by implementing
   * `valueOf`. For example, `Date` represents a value by returning a unix
   * timestamp for `valueOf`:
   *
   *     var date1 = new Date(1234567890000); // Fri Feb 13 2009 ...
   *     var date2 = new Date(1234567890000);
   *     date1.valueOf(); // 1234567890000
   *     assert( date1 !== date2 );
   *     assert( Immutable.is( date1, date2 ) );
   *
   * Note: overriding `valueOf` may have other implications if you use this object
   * where JavaScript expects a primitive, such as implicit string coercion.
   *
   * For more complex types, especially collections, implementing `valueOf` may
   * not be performant. An alternative is to implement `equals` and `hashCode`.
   *
   * `equals` takes another object, presumably of similar type, and returns true
   * if the it is equal. Equality is symmetrical, so the same result should be
   * returned if this and the argument are flipped.
   *
   *     assert( a.equals(b) === b.equals(a) );
   *
   * `hashCode` returns a 32bit integer number representing the object which will
   * be used to determine how to store the value object in a Map or Set. You must
   * provide both or neither methods, one must not exist without the other.
   *
   * Also, an important relationship between these methods must be upheld: if two
   * values are equal, they *must* return the same hashCode. If the values are not
   * equal, they might have the same hashCode; this is called a hash collision,
   * and while undesirable for performance reasons, it is acceptable.
   *
   *     if (a.equals(b)) {
   *       assert( a.hashCode() === b.hashCode() );
   *     }
   *
   * All Immutable collections implement `equals` and `hashCode`.
   *
   */
  function is(valueA, valueB) {
    if (valueA === valueB || (valueA !== valueA && valueB !== valueB)) {
      return true;
    }
    if (!valueA || !valueB) {
      return false;
    }
    if (typeof valueA.valueOf === 'function' &&
        typeof valueB.valueOf === 'function') {
      valueA = valueA.valueOf();
      valueB = valueB.valueOf();
    }
    return typeof valueA.equals === 'function' &&
      typeof valueB.equals === 'function' ?
        valueA.equals(valueB) :
        valueA === valueB || (valueA !== valueA && valueB !== valueB);
  }

  function fromJS(json, converter) {
    return converter ?
      fromJSWith(converter, json, '', {'': json}) :
      fromJSDefault(json);
  }

  function fromJSWith(converter, json, key, parentJSON) {
    if (Array.isArray(json)) {
      return converter.call(parentJSON, key, IndexedSeq(json).map(function(v, k)  {return fromJSWith(converter, v, k, json)}));
    }
    if (isPlainObj(json)) {
      return converter.call(parentJSON, key, KeyedSeq(json).map(function(v, k)  {return fromJSWith(converter, v, k, json)}));
    }
    return json;
  }

  function fromJSDefault(json) {
    if (Array.isArray(json)) {
      return IndexedSeq(json).map(fromJSDefault).toList();
    }
    if (isPlainObj(json)) {
      return KeyedSeq(json).map(fromJSDefault).toMap();
    }
    return json;
  }

  function isPlainObj(value) {
    return value && (value.constructor === Object || value.constructor === undefined);
  }

  var src_Math__imul =
    typeof Math.imul === 'function' && Math.imul(0xffffffff, 2) === -2 ?
    Math.imul :
    function src_Math__imul(a, b) {
      a = a | 0; // int
      b = b | 0; // int
      var c = a & 0xffff;
      var d = b & 0xffff;
      // Shift by 0 fixes the sign on the high part.
      return (c * d) + ((((a >>> 16) * d + c * (b >>> 16)) << 16) >>> 0) | 0; // int
    };

  // v8 has an optimization for storing 31-bit signed numbers.
  // Values which have either 00 or 11 as the high order bits qualify.
  // This function drops the highest order bit in a signed number, maintaining
  // the sign bit.
  function smi(i32) {
    return ((i32 >>> 1) & 0x40000000) | (i32 & 0xBFFFFFFF);
  }

  function hash(o) {
    if (o === false || o === null || o === undefined) {
      return 0;
    }
    if (typeof o.valueOf === 'function') {
      o = o.valueOf();
      if (o === false || o === null || o === undefined) {
        return 0;
      }
    }
    if (o === true) {
      return 1;
    }
    var type = typeof o;
    if (type === 'number') {
      var h = o | 0;
      if (h !== o) {
        h ^= o * 0xFFFFFFFF;
      }
      while (o > 0xFFFFFFFF) {
        o /= 0xFFFFFFFF;
        h ^= o;
      }
      return smi(h);
    }
    if (type === 'string') {
      return o.length > STRING_HASH_CACHE_MIN_STRLEN ? cachedHashString(o) : hashString(o);
    }
    if (typeof o.hashCode === 'function') {
      return o.hashCode();
    }
    return hashJSObj(o);
  }

  function cachedHashString(string) {
    var hash = stringHashCache[string];
    if (hash === undefined) {
      hash = hashString(string);
      if (STRING_HASH_CACHE_SIZE === STRING_HASH_CACHE_MAX_SIZE) {
        STRING_HASH_CACHE_SIZE = 0;
        stringHashCache = {};
      }
      STRING_HASH_CACHE_SIZE++;
      stringHashCache[string] = hash;
    }
    return hash;
  }

  // http://jsperf.com/hashing-strings
  function hashString(string) {
    // This is the hash from JVM
    // The hash code for a string is computed as
    // s[0] * 31 ^ (n - 1) + s[1] * 31 ^ (n - 2) + ... + s[n - 1],
    // where s[i] is the ith character of the string and n is the length of
    // the string. We "mod" the result to make it between 0 (inclusive) and 2^31
    // (exclusive) by dropping high bits.
    var hash = 0;
    for (var ii = 0; ii < string.length; ii++) {
      hash = 31 * hash + string.charCodeAt(ii) | 0;
    }
    return smi(hash);
  }

  function hashJSObj(obj) {
    var hash = weakMap && weakMap.get(obj);
    if (hash) return hash;

    hash = obj[UID_HASH_KEY];
    if (hash) return hash;

    if (!canDefineProperty) {
      hash = obj.propertyIsEnumerable && obj.propertyIsEnumerable[UID_HASH_KEY];
      if (hash) return hash;

      hash = getIENodeHash(obj);
      if (hash) return hash;
    }

    if (Object.isExtensible && !Object.isExtensible(obj)) {
      throw new Error('Non-extensible objects are not allowed as keys.');
    }

    hash = ++objHashUID;
    if (objHashUID & 0x40000000) {
      objHashUID = 0;
    }

    if (weakMap) {
      weakMap.set(obj, hash);
    } else if (canDefineProperty) {
      Object.defineProperty(obj, UID_HASH_KEY, {
        'enumerable': false,
        'configurable': false,
        'writable': false,
        'value': hash
      });
    } else if (obj.propertyIsEnumerable &&
               obj.propertyIsEnumerable === obj.constructor.prototype.propertyIsEnumerable) {
      // Since we can't define a non-enumerable property on the object
      // we'll hijack one of the less-used non-enumerable properties to
      // save our hash on it. Since this is a function it will not show up in
      // `JSON.stringify` which is what we want.
      obj.propertyIsEnumerable = function() {
        return this.constructor.prototype.propertyIsEnumerable.apply(this, arguments);
      };
      obj.propertyIsEnumerable[UID_HASH_KEY] = hash;
    } else if (obj.nodeType) {
      // At this point we couldn't get the IE `uniqueID` to use as a hash
      // and we couldn't use a non-enumerable property to exploit the
      // dontEnum bug so we simply add the `UID_HASH_KEY` on the node
      // itself.
      obj[UID_HASH_KEY] = hash;
    } else {
      throw new Error('Unable to set a non-enumerable property on object.');
    }

    return hash;
  }

  // True if Object.defineProperty works as expected. IE8 fails this test.
  var canDefineProperty = (function() {
    try {
      Object.defineProperty({}, '@', {});
      return true;
    } catch (e) {
      return false;
    }
  }());

  // IE has a `uniqueID` property on DOM nodes. We can construct the hash from it
  // and avoid memory leaks from the IE cloneNode bug.
  function getIENodeHash(node) {
    if (node && node.nodeType > 0) {
      switch (node.nodeType) {
        case 1: // Element
          return node.uniqueID;
        case 9: // Document
          return node.documentElement && node.documentElement.uniqueID;
      }
    }
  }

  // If possible, use a WeakMap.
  var weakMap = typeof WeakMap === 'function' && new WeakMap();

  var objHashUID = 0;

  var UID_HASH_KEY = '__immutablehash__';
  if (typeof Symbol === 'function') {
    UID_HASH_KEY = Symbol(UID_HASH_KEY);
  }

  var STRING_HASH_CACHE_MIN_STRLEN = 16;
  var STRING_HASH_CACHE_MAX_SIZE = 255;
  var STRING_HASH_CACHE_SIZE = 0;
  var stringHashCache = {};

  function invariant(condition, error) {
    if (!condition) throw new Error(error);
  }

  function assertNotInfinite(size) {
    invariant(
      size !== Infinity,
      'Cannot perform this action with an infinite size.'
    );
  }

  createClass(ToKeyedSequence, KeyedSeq);
    function ToKeyedSequence(indexed, useKeys) {
      this._iter = indexed;
      this._useKeys = useKeys;
      this.size = indexed.size;
    }

    ToKeyedSequence.prototype.get = function(key, notSetValue) {
      return this._iter.get(key, notSetValue);
    };

    ToKeyedSequence.prototype.has = function(key) {
      return this._iter.has(key);
    };

    ToKeyedSequence.prototype.valueSeq = function() {
      return this._iter.valueSeq();
    };

    ToKeyedSequence.prototype.reverse = function() {var this$0 = this;
      var reversedSequence = reverseFactory(this, true);
      if (!this._useKeys) {
        reversedSequence.valueSeq = function()  {return this$0._iter.toSeq().reverse()};
      }
      return reversedSequence;
    };

    ToKeyedSequence.prototype.map = function(mapper, context) {var this$0 = this;
      var mappedSequence = mapFactory(this, mapper, context);
      if (!this._useKeys) {
        mappedSequence.valueSeq = function()  {return this$0._iter.toSeq().map(mapper, context)};
      }
      return mappedSequence;
    };

    ToKeyedSequence.prototype.__iterate = function(fn, reverse) {var this$0 = this;
      var ii;
      return this._iter.__iterate(
        this._useKeys ?
          function(v, k)  {return fn(v, k, this$0)} :
          ((ii = reverse ? resolveSize(this) : 0),
            function(v ) {return fn(v, reverse ? --ii : ii++, this$0)}),
        reverse
      );
    };

    ToKeyedSequence.prototype.__iterator = function(type, reverse) {
      if (this._useKeys) {
        return this._iter.__iterator(type, reverse);
      }
      var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
      var ii = reverse ? resolveSize(this) : 0;
      return new src_Iterator__Iterator(function()  {
        var step = iterator.next();
        return step.done ? step :
          iteratorValue(type, reverse ? --ii : ii++, step.value, step);
      });
    };

  ToKeyedSequence.prototype[IS_ORDERED_SENTINEL] = true;


  createClass(ToIndexedSequence, IndexedSeq);
    function ToIndexedSequence(iter) {
      this._iter = iter;
      this.size = iter.size;
    }

    ToIndexedSequence.prototype.contains = function(value) {
      return this._iter.contains(value);
    };

    ToIndexedSequence.prototype.__iterate = function(fn, reverse) {var this$0 = this;
      var iterations = 0;
      return this._iter.__iterate(function(v ) {return fn(v, iterations++, this$0)}, reverse);
    };

    ToIndexedSequence.prototype.__iterator = function(type, reverse) {
      var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
      var iterations = 0;
      return new src_Iterator__Iterator(function()  {
        var step = iterator.next();
        return step.done ? step :
          iteratorValue(type, iterations++, step.value, step)
      });
    };



  createClass(ToSetSequence, SetSeq);
    function ToSetSequence(iter) {
      this._iter = iter;
      this.size = iter.size;
    }

    ToSetSequence.prototype.has = function(key) {
      return this._iter.contains(key);
    };

    ToSetSequence.prototype.__iterate = function(fn, reverse) {var this$0 = this;
      return this._iter.__iterate(function(v ) {return fn(v, v, this$0)}, reverse);
    };

    ToSetSequence.prototype.__iterator = function(type, reverse) {
      var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
      return new src_Iterator__Iterator(function()  {
        var step = iterator.next();
        return step.done ? step :
          iteratorValue(type, step.value, step.value, step);
      });
    };



  createClass(FromEntriesSequence, KeyedSeq);
    function FromEntriesSequence(entries) {
      this._iter = entries;
      this.size = entries.size;
    }

    FromEntriesSequence.prototype.entrySeq = function() {
      return this._iter.toSeq();
    };

    FromEntriesSequence.prototype.__iterate = function(fn, reverse) {var this$0 = this;
      return this._iter.__iterate(function(entry ) {
        // Check if entry exists first so array access doesn't throw for holes
        // in the parent iteration.
        if (entry) {
          validateEntry(entry);
          return fn(entry[1], entry[0], this$0);
        }
      }, reverse);
    };

    FromEntriesSequence.prototype.__iterator = function(type, reverse) {
      var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
      return new src_Iterator__Iterator(function()  {
        while (true) {
          var step = iterator.next();
          if (step.done) {
            return step;
          }
          var entry = step.value;
          // Check if entry exists first so array access doesn't throw for holes
          // in the parent iteration.
          if (entry) {
            validateEntry(entry);
            return type === ITERATE_ENTRIES ? step :
              iteratorValue(type, entry[0], entry[1], step);
          }
        }
      });
    };


  ToIndexedSequence.prototype.cacheResult =
  ToKeyedSequence.prototype.cacheResult =
  ToSetSequence.prototype.cacheResult =
  FromEntriesSequence.prototype.cacheResult =
    cacheResultThrough;


  function flipFactory(iterable) {
    var flipSequence = makeSequence(iterable);
    flipSequence._iter = iterable;
    flipSequence.size = iterable.size;
    flipSequence.flip = function()  {return iterable};
    flipSequence.reverse = function () {
      var reversedSequence = iterable.reverse.apply(this); // super.reverse()
      reversedSequence.flip = function()  {return iterable.reverse()};
      return reversedSequence;
    };
    flipSequence.has = function(key ) {return iterable.contains(key)};
    flipSequence.contains = function(key ) {return iterable.has(key)};
    flipSequence.cacheResult = cacheResultThrough;
    flipSequence.__iterateUncached = function (fn, reverse) {var this$0 = this;
      return iterable.__iterate(function(v, k)  {return fn(k, v, this$0) !== false}, reverse);
    }
    flipSequence.__iteratorUncached = function(type, reverse) {
      if (type === ITERATE_ENTRIES) {
        var iterator = iterable.__iterator(type, reverse);
        return new src_Iterator__Iterator(function()  {
          var step = iterator.next();
          if (!step.done) {
            var k = step.value[0];
            step.value[0] = step.value[1];
            step.value[1] = k;
          }
          return step;
        });
      }
      return iterable.__iterator(
        type === ITERATE_VALUES ? ITERATE_KEYS : ITERATE_VALUES,
        reverse
      );
    }
    return flipSequence;
  }


  function mapFactory(iterable, mapper, context) {
    var mappedSequence = makeSequence(iterable);
    mappedSequence.size = iterable.size;
    mappedSequence.has = function(key ) {return iterable.has(key)};
    mappedSequence.get = function(key, notSetValue)  {
      var v = iterable.get(key, NOT_SET);
      return v === NOT_SET ?
        notSetValue :
        mapper.call(context, v, key, iterable);
    };
    mappedSequence.__iterateUncached = function (fn, reverse) {var this$0 = this;
      return iterable.__iterate(
        function(v, k, c)  {return fn(mapper.call(context, v, k, c), k, this$0) !== false},
        reverse
      );
    }
    mappedSequence.__iteratorUncached = function (type, reverse) {
      var iterator = iterable.__iterator(ITERATE_ENTRIES, reverse);
      return new src_Iterator__Iterator(function()  {
        var step = iterator.next();
        if (step.done) {
          return step;
        }
        var entry = step.value;
        var key = entry[0];
        return iteratorValue(
          type,
          key,
          mapper.call(context, entry[1], key, iterable),
          step
        );
      });
    }
    return mappedSequence;
  }


  function reverseFactory(iterable, useKeys) {
    var reversedSequence = makeSequence(iterable);
    reversedSequence._iter = iterable;
    reversedSequence.size = iterable.size;
    reversedSequence.reverse = function()  {return iterable};
    if (iterable.flip) {
      reversedSequence.flip = function () {
        var flipSequence = flipFactory(iterable);
        flipSequence.reverse = function()  {return iterable.flip()};
        return flipSequence;
      };
    }
    reversedSequence.get = function(key, notSetValue) 
      {return iterable.get(useKeys ? key : -1 - key, notSetValue)};
    reversedSequence.has = function(key )
      {return iterable.has(useKeys ? key : -1 - key)};
    reversedSequence.contains = function(value ) {return iterable.contains(value)};
    reversedSequence.cacheResult = cacheResultThrough;
    reversedSequence.__iterate = function (fn, reverse) {var this$0 = this;
      return iterable.__iterate(function(v, k)  {return fn(v, k, this$0)}, !reverse);
    };
    reversedSequence.__iterator =
      function(type, reverse)  {return iterable.__iterator(type, !reverse)};
    return reversedSequence;
  }


  function filterFactory(iterable, predicate, context, useKeys) {
    var filterSequence = makeSequence(iterable);
    if (useKeys) {
      filterSequence.has = function(key ) {
        var v = iterable.get(key, NOT_SET);
        return v !== NOT_SET && !!predicate.call(context, v, key, iterable);
      };
      filterSequence.get = function(key, notSetValue)  {
        var v = iterable.get(key, NOT_SET);
        return v !== NOT_SET && predicate.call(context, v, key, iterable) ?
          v : notSetValue;
      };
    }
    filterSequence.__iterateUncached = function (fn, reverse) {var this$0 = this;
      var iterations = 0;
      iterable.__iterate(function(v, k, c)  {
        if (predicate.call(context, v, k, c)) {
          iterations++;
          return fn(v, useKeys ? k : iterations - 1, this$0);
        }
      }, reverse);
      return iterations;
    };
    filterSequence.__iteratorUncached = function (type, reverse) {
      var iterator = iterable.__iterator(ITERATE_ENTRIES, reverse);
      var iterations = 0;
      return new src_Iterator__Iterator(function()  {
        while (true) {
          var step = iterator.next();
          if (step.done) {
            return step;
          }
          var entry = step.value;
          var key = entry[0];
          var value = entry[1];
          if (predicate.call(context, value, key, iterable)) {
            return iteratorValue(type, useKeys ? key : iterations++, value, step);
          }
        }
      });
    }
    return filterSequence;
  }


  function countByFactory(iterable, grouper, context) {
    var groups = src_Map__Map().asMutable();
    iterable.__iterate(function(v, k)  {
      groups.update(
        grouper.call(context, v, k, iterable),
        0,
        function(a ) {return a + 1}
      );
    });
    return groups.asImmutable();
  }


  function groupByFactory(iterable, grouper, context) {
    var isKeyedIter = isKeyed(iterable);
    var groups = (isOrdered(iterable) ? OrderedMap() : src_Map__Map()).asMutable();
    iterable.__iterate(function(v, k)  {
      groups.update(
        grouper.call(context, v, k, iterable),
        function(a ) {return (a = a || [], a.push(isKeyedIter ? [k, v] : v), a)}
      );
    });
    var coerce = iterableClass(iterable);
    return groups.map(function(arr ) {return reify(iterable, coerce(arr))});
  }


  function sliceFactory(iterable, begin, end, useKeys) {
    var originalSize = iterable.size;

    if (wholeSlice(begin, end, originalSize)) {
      return iterable;
    }

    var resolvedBegin = resolveBegin(begin, originalSize);
    var resolvedEnd = resolveEnd(end, originalSize);

    // begin or end will be NaN if they were provided as negative numbers and
    // this iterable's size is unknown. In that case, cache first so there is
    // a known size.
    if (resolvedBegin !== resolvedBegin || resolvedEnd !== resolvedEnd) {
      return sliceFactory(iterable.toSeq().cacheResult(), begin, end, useKeys);
    }

    var sliceSize = resolvedEnd - resolvedBegin;
    if (sliceSize < 0) {
      sliceSize = 0;
    }

    var sliceSeq = makeSequence(iterable);

    sliceSeq.size = sliceSize === 0 ? sliceSize : iterable.size && sliceSize || undefined;

    if (!useKeys && isSeq(iterable) && sliceSize >= 0) {
      sliceSeq.get = function (index, notSetValue) {
        index = wrapIndex(this, index);
        return index >= 0 && index < sliceSize ?
          iterable.get(index + resolvedBegin, notSetValue) :
          notSetValue;
      }
    }

    sliceSeq.__iterateUncached = function(fn, reverse) {var this$0 = this;
      if (sliceSize === 0) {
        return 0;
      }
      if (reverse) {
        return this.cacheResult().__iterate(fn, reverse);
      }
      var skipped = 0;
      var isSkipping = true;
      var iterations = 0;
      iterable.__iterate(function(v, k)  {
        if (!(isSkipping && (isSkipping = skipped++ < resolvedBegin))) {
          iterations++;
          return fn(v, useKeys ? k : iterations - 1, this$0) !== false &&
                 iterations !== sliceSize;
        }
      });
      return iterations;
    };

    sliceSeq.__iteratorUncached = function(type, reverse) {
      if (sliceSize && reverse) {
        return this.cacheResult().__iterator(type, reverse);
      }
      // Don't bother instantiating parent iterator if taking 0.
      var iterator = sliceSize && iterable.__iterator(type, reverse);
      var skipped = 0;
      var iterations = 0;
      return new src_Iterator__Iterator(function()  {
        while (skipped++ !== resolvedBegin) {
          iterator.next();
        }
        if (++iterations > sliceSize) {
          return iteratorDone();
        }
        var step = iterator.next();
        if (useKeys || type === ITERATE_VALUES) {
          return step;
        } else if (type === ITERATE_KEYS) {
          return iteratorValue(type, iterations - 1, undefined, step);
        } else {
          return iteratorValue(type, iterations - 1, step.value[1], step);
        }
      });
    }

    return sliceSeq;
  }


  function takeWhileFactory(iterable, predicate, context) {
    var takeSequence = makeSequence(iterable);
    takeSequence.__iterateUncached = function(fn, reverse) {var this$0 = this;
      if (reverse) {
        return this.cacheResult().__iterate(fn, reverse);
      }
      var iterations = 0;
      iterable.__iterate(function(v, k, c) 
        {return predicate.call(context, v, k, c) && ++iterations && fn(v, k, this$0)}
      );
      return iterations;
    };
    takeSequence.__iteratorUncached = function(type, reverse) {var this$0 = this;
      if (reverse) {
        return this.cacheResult().__iterator(type, reverse);
      }
      var iterator = iterable.__iterator(ITERATE_ENTRIES, reverse);
      var iterating = true;
      return new src_Iterator__Iterator(function()  {
        if (!iterating) {
          return iteratorDone();
        }
        var step = iterator.next();
        if (step.done) {
          return step;
        }
        var entry = step.value;
        var k = entry[0];
        var v = entry[1];
        if (!predicate.call(context, v, k, this$0)) {
          iterating = false;
          return iteratorDone();
        }
        return type === ITERATE_ENTRIES ? step :
          iteratorValue(type, k, v, step);
      });
    };
    return takeSequence;
  }


  function skipWhileFactory(iterable, predicate, context, useKeys) {
    var skipSequence = makeSequence(iterable);
    skipSequence.__iterateUncached = function (fn, reverse) {var this$0 = this;
      if (reverse) {
        return this.cacheResult().__iterate(fn, reverse);
      }
      var isSkipping = true;
      var iterations = 0;
      iterable.__iterate(function(v, k, c)  {
        if (!(isSkipping && (isSkipping = predicate.call(context, v, k, c)))) {
          iterations++;
          return fn(v, useKeys ? k : iterations - 1, this$0);
        }
      });
      return iterations;
    };
    skipSequence.__iteratorUncached = function(type, reverse) {var this$0 = this;
      if (reverse) {
        return this.cacheResult().__iterator(type, reverse);
      }
      var iterator = iterable.__iterator(ITERATE_ENTRIES, reverse);
      var skipping = true;
      var iterations = 0;
      return new src_Iterator__Iterator(function()  {
        var step, k, v;
        do {
          step = iterator.next();
          if (step.done) {
            if (useKeys || type === ITERATE_VALUES) {
              return step;
            } else if (type === ITERATE_KEYS) {
              return iteratorValue(type, iterations++, undefined, step);
            } else {
              return iteratorValue(type, iterations++, step.value[1], step);
            }
          }
          var entry = step.value;
          k = entry[0];
          v = entry[1];
          skipping && (skipping = predicate.call(context, v, k, this$0));
        } while (skipping);
        return type === ITERATE_ENTRIES ? step :
          iteratorValue(type, k, v, step);
      });
    };
    return skipSequence;
  }


  function concatFactory(iterable, values) {
    var isKeyedIterable = isKeyed(iterable);
    var iters = [iterable].concat(values).map(function(v ) {
      if (!isIterable(v)) {
        v = isKeyedIterable ?
          keyedSeqFromValue(v) :
          indexedSeqFromValue(Array.isArray(v) ? v : [v]);
      } else if (isKeyedIterable) {
        v = KeyedIterable(v);
      }
      return v;
    }).filter(function(v ) {return v.size !== 0});

    if (iters.length === 0) {
      return iterable;
    }

    if (iters.length === 1) {
      var singleton = iters[0];
      if (singleton === iterable ||
          isKeyedIterable && isKeyed(singleton) ||
          isIndexed(iterable) && isIndexed(singleton)) {
        return singleton;
      }
    }

    var concatSeq = new ArraySeq(iters);
    if (isKeyedIterable) {
      concatSeq = concatSeq.toKeyedSeq();
    } else if (!isIndexed(iterable)) {
      concatSeq = concatSeq.toSetSeq();
    }
    concatSeq = concatSeq.flatten(true);
    concatSeq.size = iters.reduce(
      function(sum, seq)  {
        if (sum !== undefined) {
          var size = seq.size;
          if (size !== undefined) {
            return sum + size;
          }
        }
      },
      0
    );
    return concatSeq;
  }


  function flattenFactory(iterable, depth, useKeys) {
    var flatSequence = makeSequence(iterable);
    flatSequence.__iterateUncached = function(fn, reverse) {
      var iterations = 0;
      var stopped = false;
      function flatDeep(iter, currentDepth) {var this$0 = this;
        iter.__iterate(function(v, k)  {
          if ((!depth || currentDepth < depth) && isIterable(v)) {
            flatDeep(v, currentDepth + 1);
          } else if (fn(v, useKeys ? k : iterations++, this$0) === false) {
            stopped = true;
          }
          return !stopped;
        }, reverse);
      }
      flatDeep(iterable, 0);
      return iterations;
    }
    flatSequence.__iteratorUncached = function(type, reverse) {
      var iterator = iterable.__iterator(type, reverse);
      var stack = [];
      var iterations = 0;
      return new src_Iterator__Iterator(function()  {
        while (iterator) {
          var step = iterator.next();
          if (step.done !== false) {
            iterator = stack.pop();
            continue;
          }
          var v = step.value;
          if (type === ITERATE_ENTRIES) {
            v = v[1];
          }
          if ((!depth || stack.length < depth) && isIterable(v)) {
            stack.push(iterator);
            iterator = v.__iterator(type, reverse);
          } else {
            return useKeys ? step : iteratorValue(type, iterations++, v, step);
          }
        }
        return iteratorDone();
      });
    }
    return flatSequence;
  }


  function flatMapFactory(iterable, mapper, context) {
    var coerce = iterableClass(iterable);
    return iterable.toSeq().map(
      function(v, k)  {return coerce(mapper.call(context, v, k, iterable))}
    ).flatten(true);
  }


  function interposeFactory(iterable, separator) {
    var interposedSequence = makeSequence(iterable);
    interposedSequence.size = iterable.size && iterable.size * 2 -1;
    interposedSequence.__iterateUncached = function(fn, reverse) {var this$0 = this;
      var iterations = 0;
      iterable.__iterate(function(v, k) 
        {return (!iterations || fn(separator, iterations++, this$0) !== false) &&
        fn(v, iterations++, this$0) !== false},
        reverse
      );
      return iterations;
    };
    interposedSequence.__iteratorUncached = function(type, reverse) {
      var iterator = iterable.__iterator(ITERATE_VALUES, reverse);
      var iterations = 0;
      var step;
      return new src_Iterator__Iterator(function()  {
        if (!step || iterations % 2) {
          step = iterator.next();
          if (step.done) {
            return step;
          }
        }
        return iterations % 2 ?
          iteratorValue(type, iterations++, separator) :
          iteratorValue(type, iterations++, step.value, step);
      });
    };
    return interposedSequence;
  }


  function sortFactory(iterable, comparator, mapper) {
    if (!comparator) {
      comparator = defaultComparator;
    }
    var isKeyedIterable = isKeyed(iterable);
    var index = 0;
    var entries = iterable.toSeq().map(
      function(v, k)  {return [k, v, index++, mapper ? mapper(v, k, iterable) : v]}
    ).toArray();
    entries.sort(function(a, b)  {return comparator(a[3], b[3]) || a[2] - b[2]}).forEach(
      isKeyedIterable ?
      function(v, i)  { entries[i].length = 2; } :
      function(v, i)  { entries[i] = v[1]; }
    );
    return isKeyedIterable ? KeyedSeq(entries) :
      isIndexed(iterable) ? IndexedSeq(entries) :
      SetSeq(entries);
  }


  function maxFactory(iterable, comparator, mapper) {
    if (!comparator) {
      comparator = defaultComparator;
    }
    if (mapper) {
      var entry = iterable.toSeq()
        .map(function(v, k)  {return [v, mapper(v, k, iterable)]})
        .reduce(function(a, b)  {return maxCompare(comparator, a[1], b[1]) ? b : a});
      return entry && entry[0];
    } else {
      return iterable.reduce(function(a, b)  {return maxCompare(comparator, a, b) ? b : a});
    }
  }

  function maxCompare(comparator, a, b) {
    var comp = comparator(b, a);
    // b is considered the new max if the comparator declares them equal, but
    // they are not equal and b is in fact a nullish value.
    return (comp === 0 && b !== a && (b === undefined || b === null || b !== b)) || comp > 0;
  }


  function zipWithFactory(keyIter, zipper, iters) {
    var zipSequence = makeSequence(keyIter);
    zipSequence.size = new ArraySeq(iters).map(function(i ) {return i.size}).min();
    // Note: this a generic base implementation of __iterate in terms of
    // __iterator which may be more generically useful in the future.
    zipSequence.__iterate = function(fn, reverse) {
      /* generic:
      var iterator = this.__iterator(ITERATE_ENTRIES, reverse);
      var step;
      var iterations = 0;
      while (!(step = iterator.next()).done) {
        iterations++;
        if (fn(step.value[1], step.value[0], this) === false) {
          break;
        }
      }
      return iterations;
      */
      // indexed:
      var iterator = this.__iterator(ITERATE_VALUES, reverse);
      var step;
      var iterations = 0;
      while (!(step = iterator.next()).done) {
        if (fn(step.value, iterations++, this) === false) {
          break;
        }
      }
      return iterations;
    };
    zipSequence.__iteratorUncached = function(type, reverse) {
      var iterators = iters.map(function(i )
        {return (i = Iterable(i), getIterator(reverse ? i.reverse() : i))}
      );
      var iterations = 0;
      var isDone = false;
      return new src_Iterator__Iterator(function()  {
        var steps;
        if (!isDone) {
          steps = iterators.map(function(i ) {return i.next()});
          isDone = steps.some(function(s ) {return s.done});
        }
        if (isDone) {
          return iteratorDone();
        }
        return iteratorValue(
          type,
          iterations++,
          zipper.apply(null, steps.map(function(s ) {return s.value}))
        );
      });
    };
    return zipSequence
  }


  // #pragma Helper Functions

  function reify(iter, seq) {
    return isSeq(iter) ? seq : iter.constructor(seq);
  }

  function validateEntry(entry) {
    if (entry !== Object(entry)) {
      throw new TypeError('Expected [K, V] tuple: ' + entry);
    }
  }

  function resolveSize(iter) {
    assertNotInfinite(iter.size);
    return ensureSize(iter);
  }

  function iterableClass(iterable) {
    return isKeyed(iterable) ? KeyedIterable :
      isIndexed(iterable) ? IndexedIterable :
      SetIterable;
  }

  function makeSequence(iterable) {
    return Object.create(
      (
        isKeyed(iterable) ? KeyedSeq :
        isIndexed(iterable) ? IndexedSeq :
        SetSeq
      ).prototype
    );
  }

  function cacheResultThrough() {
    if (this._iter.cacheResult) {
      this._iter.cacheResult();
      this.size = this._iter.size;
      return this;
    } else {
      return Seq.prototype.cacheResult.call(this);
    }
  }

  function defaultComparator(a, b) {
    return a > b ? 1 : a < b ? -1 : 0;
  }

  function forceIterator(keyPath) {
    var iter = getIterator(keyPath);
    if (!iter) {
      // Array might not be iterable in this environment, so we need a fallback
      // to our wrapped type.
      if (!isArrayLike(keyPath)) {
        throw new TypeError('Expected iterable or array-like: ' + keyPath);
      }
      iter = getIterator(Iterable(keyPath));
    }
    return iter;
  }

  createClass(src_Map__Map, KeyedCollection);

    // @pragma Construction

    function src_Map__Map(value) {
      return value === null || value === undefined ? emptyMap() :
        isMap(value) ? value :
        emptyMap().withMutations(function(map ) {
          var iter = KeyedIterable(value);
          assertNotInfinite(iter.size);
          iter.forEach(function(v, k)  {return map.set(k, v)});
        });
    }

    src_Map__Map.prototype.toString = function() {
      return this.__toString('Map {', '}');
    };

    // @pragma Access

    src_Map__Map.prototype.get = function(k, notSetValue) {
      return this._root ?
        this._root.get(0, undefined, k, notSetValue) :
        notSetValue;
    };

    // @pragma Modification

    src_Map__Map.prototype.set = function(k, v) {
      return updateMap(this, k, v);
    };

    src_Map__Map.prototype.setIn = function(keyPath, v) {
      return this.updateIn(keyPath, NOT_SET, function()  {return v});
    };

    src_Map__Map.prototype.remove = function(k) {
      return updateMap(this, k, NOT_SET);
    };

    src_Map__Map.prototype.deleteIn = function(keyPath) {
      return this.updateIn(keyPath, function()  {return NOT_SET});
    };

    src_Map__Map.prototype.update = function(k, notSetValue, updater) {
      return arguments.length === 1 ?
        k(this) :
        this.updateIn([k], notSetValue, updater);
    };

    src_Map__Map.prototype.updateIn = function(keyPath, notSetValue, updater) {
      if (!updater) {
        updater = notSetValue;
        notSetValue = undefined;
      }
      var updatedValue = updateInDeepMap(
        this,
        forceIterator(keyPath),
        notSetValue,
        updater
      );
      return updatedValue === NOT_SET ? undefined : updatedValue;
    };

    src_Map__Map.prototype.clear = function() {
      if (this.size === 0) {
        return this;
      }
      if (this.__ownerID) {
        this.size = 0;
        this._root = null;
        this.__hash = undefined;
        this.__altered = true;
        return this;
      }
      return emptyMap();
    };

    // @pragma Composition

    src_Map__Map.prototype.merge = function(/*...iters*/) {
      return mergeIntoMapWith(this, undefined, arguments);
    };

    src_Map__Map.prototype.mergeWith = function(merger) {var iters = SLICE$0.call(arguments, 1);
      return mergeIntoMapWith(this, merger, iters);
    };

    src_Map__Map.prototype.mergeIn = function(keyPath) {var iters = SLICE$0.call(arguments, 1);
      return this.updateIn(keyPath, emptyMap(), function(m ) {return m.merge.apply(m, iters)});
    };

    src_Map__Map.prototype.mergeDeep = function(/*...iters*/) {
      return mergeIntoMapWith(this, deepMerger(undefined), arguments);
    };

    src_Map__Map.prototype.mergeDeepWith = function(merger) {var iters = SLICE$0.call(arguments, 1);
      return mergeIntoMapWith(this, deepMerger(merger), iters);
    };

    src_Map__Map.prototype.mergeDeepIn = function(keyPath) {var iters = SLICE$0.call(arguments, 1);
      return this.updateIn(keyPath, emptyMap(), function(m ) {return m.mergeDeep.apply(m, iters)});
    };

    src_Map__Map.prototype.sort = function(comparator) {
      // Late binding
      return OrderedMap(sortFactory(this, comparator));
    };

    src_Map__Map.prototype.sortBy = function(mapper, comparator) {
      // Late binding
      return OrderedMap(sortFactory(this, comparator, mapper));
    };

    // @pragma Mutability

    src_Map__Map.prototype.withMutations = function(fn) {
      var mutable = this.asMutable();
      fn(mutable);
      return mutable.wasAltered() ? mutable.__ensureOwner(this.__ownerID) : this;
    };

    src_Map__Map.prototype.asMutable = function() {
      return this.__ownerID ? this : this.__ensureOwner(new OwnerID());
    };

    src_Map__Map.prototype.asImmutable = function() {
      return this.__ensureOwner();
    };

    src_Map__Map.prototype.wasAltered = function() {
      return this.__altered;
    };

    src_Map__Map.prototype.__iterator = function(type, reverse) {
      return new MapIterator(this, type, reverse);
    };

    src_Map__Map.prototype.__iterate = function(fn, reverse) {var this$0 = this;
      var iterations = 0;
      this._root && this._root.iterate(function(entry ) {
        iterations++;
        return fn(entry[1], entry[0], this$0);
      }, reverse);
      return iterations;
    };

    src_Map__Map.prototype.__ensureOwner = function(ownerID) {
      if (ownerID === this.__ownerID) {
        return this;
      }
      if (!ownerID) {
        this.__ownerID = ownerID;
        this.__altered = false;
        return this;
      }
      return makeMap(this.size, this._root, ownerID, this.__hash);
    };


  function isMap(maybeMap) {
    return !!(maybeMap && maybeMap[IS_MAP_SENTINEL]);
  }

  src_Map__Map.isMap = isMap;

  var IS_MAP_SENTINEL = '@@__IMMUTABLE_MAP__@@';

  var MapPrototype = src_Map__Map.prototype;
  MapPrototype[IS_MAP_SENTINEL] = true;
  MapPrototype[DELETE] = MapPrototype.remove;
  MapPrototype.removeIn = MapPrototype.deleteIn;


  // #pragma Trie Nodes



    function ArrayMapNode(ownerID, entries) {
      this.ownerID = ownerID;
      this.entries = entries;
    }

    ArrayMapNode.prototype.get = function(shift, keyHash, key, notSetValue) {
      var entries = this.entries;
      for (var ii = 0, len = entries.length; ii < len; ii++) {
        if (is(key, entries[ii][0])) {
          return entries[ii][1];
        }
      }
      return notSetValue;
    };

    ArrayMapNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
      var removed = value === NOT_SET;

      var entries = this.entries;
      var idx = 0;
      for (var len = entries.length; idx < len; idx++) {
        if (is(key, entries[idx][0])) {
          break;
        }
      }
      var exists = idx < len;

      if (exists ? entries[idx][1] === value : removed) {
        return this;
      }

      SetRef(didAlter);
      (removed || !exists) && SetRef(didChangeSize);

      if (removed && entries.length === 1) {
        return; // undefined
      }

      if (!exists && !removed && entries.length >= MAX_ARRAY_MAP_SIZE) {
        return createNodes(ownerID, entries, key, value);
      }

      var isEditable = ownerID && ownerID === this.ownerID;
      var newEntries = isEditable ? entries : arrCopy(entries);

      if (exists) {
        if (removed) {
          idx === len - 1 ? newEntries.pop() : (newEntries[idx] = newEntries.pop());
        } else {
          newEntries[idx] = [key, value];
        }
      } else {
        newEntries.push([key, value]);
      }

      if (isEditable) {
        this.entries = newEntries;
        return this;
      }

      return new ArrayMapNode(ownerID, newEntries);
    };




    function BitmapIndexedNode(ownerID, bitmap, nodes) {
      this.ownerID = ownerID;
      this.bitmap = bitmap;
      this.nodes = nodes;
    }

    BitmapIndexedNode.prototype.get = function(shift, keyHash, key, notSetValue) {
      if (keyHash === undefined) {
        keyHash = hash(key);
      }
      var bit = (1 << ((shift === 0 ? keyHash : keyHash >>> shift) & MASK));
      var bitmap = this.bitmap;
      return (bitmap & bit) === 0 ? notSetValue :
        this.nodes[popCount(bitmap & (bit - 1))].get(shift + SHIFT, keyHash, key, notSetValue);
    };

    BitmapIndexedNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
      if (keyHash === undefined) {
        keyHash = hash(key);
      }
      var keyHashFrag = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
      var bit = 1 << keyHashFrag;
      var bitmap = this.bitmap;
      var exists = (bitmap & bit) !== 0;

      if (!exists && value === NOT_SET) {
        return this;
      }

      var idx = popCount(bitmap & (bit - 1));
      var nodes = this.nodes;
      var node = exists ? nodes[idx] : undefined;
      var newNode = updateNode(node, ownerID, shift + SHIFT, keyHash, key, value, didChangeSize, didAlter);

      if (newNode === node) {
        return this;
      }

      if (!exists && newNode && nodes.length >= MAX_BITMAP_INDEXED_SIZE) {
        return expandNodes(ownerID, nodes, bitmap, keyHashFrag, newNode);
      }

      if (exists && !newNode && nodes.length === 2 && isLeafNode(nodes[idx ^ 1])) {
        return nodes[idx ^ 1];
      }

      if (exists && newNode && nodes.length === 1 && isLeafNode(newNode)) {
        return newNode;
      }

      var isEditable = ownerID && ownerID === this.ownerID;
      var newBitmap = exists ? newNode ? bitmap : bitmap ^ bit : bitmap | bit;
      var newNodes = exists ? newNode ?
        setIn(nodes, idx, newNode, isEditable) :
        spliceOut(nodes, idx, isEditable) :
        spliceIn(nodes, idx, newNode, isEditable);

      if (isEditable) {
        this.bitmap = newBitmap;
        this.nodes = newNodes;
        return this;
      }

      return new BitmapIndexedNode(ownerID, newBitmap, newNodes);
    };




    function HashArrayMapNode(ownerID, count, nodes) {
      this.ownerID = ownerID;
      this.count = count;
      this.nodes = nodes;
    }

    HashArrayMapNode.prototype.get = function(shift, keyHash, key, notSetValue) {
      if (keyHash === undefined) {
        keyHash = hash(key);
      }
      var idx = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
      var node = this.nodes[idx];
      return node ? node.get(shift + SHIFT, keyHash, key, notSetValue) : notSetValue;
    };

    HashArrayMapNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
      if (keyHash === undefined) {
        keyHash = hash(key);
      }
      var idx = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
      var removed = value === NOT_SET;
      var nodes = this.nodes;
      var node = nodes[idx];

      if (removed && !node) {
        return this;
      }

      var newNode = updateNode(node, ownerID, shift + SHIFT, keyHash, key, value, didChangeSize, didAlter);
      if (newNode === node) {
        return this;
      }

      var newCount = this.count;
      if (!node) {
        newCount++;
      } else if (!newNode) {
        newCount--;
        if (newCount < MIN_HASH_ARRAY_MAP_SIZE) {
          return packNodes(ownerID, nodes, newCount, idx);
        }
      }

      var isEditable = ownerID && ownerID === this.ownerID;
      var newNodes = setIn(nodes, idx, newNode, isEditable);

      if (isEditable) {
        this.count = newCount;
        this.nodes = newNodes;
        return this;
      }

      return new HashArrayMapNode(ownerID, newCount, newNodes);
    };




    function HashCollisionNode(ownerID, keyHash, entries) {
      this.ownerID = ownerID;
      this.keyHash = keyHash;
      this.entries = entries;
    }

    HashCollisionNode.prototype.get = function(shift, keyHash, key, notSetValue) {
      var entries = this.entries;
      for (var ii = 0, len = entries.length; ii < len; ii++) {
        if (is(key, entries[ii][0])) {
          return entries[ii][1];
        }
      }
      return notSetValue;
    };

    HashCollisionNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
      if (keyHash === undefined) {
        keyHash = hash(key);
      }

      var removed = value === NOT_SET;

      if (keyHash !== this.keyHash) {
        if (removed) {
          return this;
        }
        SetRef(didAlter);
        SetRef(didChangeSize);
        return mergeIntoNode(this, ownerID, shift, keyHash, [key, value]);
      }

      var entries = this.entries;
      var idx = 0;
      for (var len = entries.length; idx < len; idx++) {
        if (is(key, entries[idx][0])) {
          break;
        }
      }
      var exists = idx < len;

      if (exists ? entries[idx][1] === value : removed) {
        return this;
      }

      SetRef(didAlter);
      (removed || !exists) && SetRef(didChangeSize);

      if (removed && len === 2) {
        return new ValueNode(ownerID, this.keyHash, entries[idx ^ 1]);
      }

      var isEditable = ownerID && ownerID === this.ownerID;
      var newEntries = isEditable ? entries : arrCopy(entries);

      if (exists) {
        if (removed) {
          idx === len - 1 ? newEntries.pop() : (newEntries[idx] = newEntries.pop());
        } else {
          newEntries[idx] = [key, value];
        }
      } else {
        newEntries.push([key, value]);
      }

      if (isEditable) {
        this.entries = newEntries;
        return this;
      }

      return new HashCollisionNode(ownerID, this.keyHash, newEntries);
    };




    function ValueNode(ownerID, keyHash, entry) {
      this.ownerID = ownerID;
      this.keyHash = keyHash;
      this.entry = entry;
    }

    ValueNode.prototype.get = function(shift, keyHash, key, notSetValue) {
      return is(key, this.entry[0]) ? this.entry[1] : notSetValue;
    };

    ValueNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
      var removed = value === NOT_SET;
      var keyMatch = is(key, this.entry[0]);
      if (keyMatch ? value === this.entry[1] : removed) {
        return this;
      }

      SetRef(didAlter);

      if (removed) {
        SetRef(didChangeSize);
        return; // undefined
      }

      if (keyMatch) {
        if (ownerID && ownerID === this.ownerID) {
          this.entry[1] = value;
          return this;
        }
        return new ValueNode(ownerID, this.keyHash, [key, value]);
      }

      SetRef(didChangeSize);
      return mergeIntoNode(this, ownerID, shift, hash(key), [key, value]);
    };



  // #pragma Iterators

  ArrayMapNode.prototype.iterate =
  HashCollisionNode.prototype.iterate = function (fn, reverse) {
    var entries = this.entries;
    for (var ii = 0, maxIndex = entries.length - 1; ii <= maxIndex; ii++) {
      if (fn(entries[reverse ? maxIndex - ii : ii]) === false) {
        return false;
      }
    }
  }

  BitmapIndexedNode.prototype.iterate =
  HashArrayMapNode.prototype.iterate = function (fn, reverse) {
    var nodes = this.nodes;
    for (var ii = 0, maxIndex = nodes.length - 1; ii <= maxIndex; ii++) {
      var node = nodes[reverse ? maxIndex - ii : ii];
      if (node && node.iterate(fn, reverse) === false) {
        return false;
      }
    }
  }

  ValueNode.prototype.iterate = function (fn, reverse) {
    return fn(this.entry);
  }

  createClass(MapIterator, src_Iterator__Iterator);

    function MapIterator(map, type, reverse) {
      this._type = type;
      this._reverse = reverse;
      this._stack = map._root && mapIteratorFrame(map._root);
    }

    MapIterator.prototype.next = function() {
      var type = this._type;
      var stack = this._stack;
      while (stack) {
        var node = stack.node;
        var index = stack.index++;
        var maxIndex;
        if (node.entry) {
          if (index === 0) {
            return mapIteratorValue(type, node.entry);
          }
        } else if (node.entries) {
          maxIndex = node.entries.length - 1;
          if (index <= maxIndex) {
            return mapIteratorValue(type, node.entries[this._reverse ? maxIndex - index : index]);
          }
        } else {
          maxIndex = node.nodes.length - 1;
          if (index <= maxIndex) {
            var subNode = node.nodes[this._reverse ? maxIndex - index : index];
            if (subNode) {
              if (subNode.entry) {
                return mapIteratorValue(type, subNode.entry);
              }
              stack = this._stack = mapIteratorFrame(subNode, stack);
            }
            continue;
          }
        }
        stack = this._stack = this._stack.__prev;
      }
      return iteratorDone();
    };


  function mapIteratorValue(type, entry) {
    return iteratorValue(type, entry[0], entry[1]);
  }

  function mapIteratorFrame(node, prev) {
    return {
      node: node,
      index: 0,
      __prev: prev
    };
  }

  function makeMap(size, root, ownerID, hash) {
    var map = Object.create(MapPrototype);
    map.size = size;
    map._root = root;
    map.__ownerID = ownerID;
    map.__hash = hash;
    map.__altered = false;
    return map;
  }

  var EMPTY_MAP;
  function emptyMap() {
    return EMPTY_MAP || (EMPTY_MAP = makeMap(0));
  }

  function updateMap(map, k, v) {
    var newRoot;
    var newSize;
    if (!map._root) {
      if (v === NOT_SET) {
        return map;
      }
      newSize = 1;
      newRoot = new ArrayMapNode(map.__ownerID, [[k, v]]);
    } else {
      var didChangeSize = MakeRef(CHANGE_LENGTH);
      var didAlter = MakeRef(DID_ALTER);
      newRoot = updateNode(map._root, map.__ownerID, 0, undefined, k, v, didChangeSize, didAlter);
      if (!didAlter.value) {
        return map;
      }
      newSize = map.size + (didChangeSize.value ? v === NOT_SET ? -1 : 1 : 0);
    }
    if (map.__ownerID) {
      map.size = newSize;
      map._root = newRoot;
      map.__hash = undefined;
      map.__altered = true;
      return map;
    }
    return newRoot ? makeMap(newSize, newRoot) : emptyMap();
  }

  function updateNode(node, ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
    if (!node) {
      if (value === NOT_SET) {
        return node;
      }
      SetRef(didAlter);
      SetRef(didChangeSize);
      return new ValueNode(ownerID, keyHash, [key, value]);
    }
    return node.update(ownerID, shift, keyHash, key, value, didChangeSize, didAlter);
  }

  function isLeafNode(node) {
    return node.constructor === ValueNode || node.constructor === HashCollisionNode;
  }

  function mergeIntoNode(node, ownerID, shift, keyHash, entry) {
    if (node.keyHash === keyHash) {
      return new HashCollisionNode(ownerID, keyHash, [node.entry, entry]);
    }

    var idx1 = (shift === 0 ? node.keyHash : node.keyHash >>> shift) & MASK;
    var idx2 = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;

    var newNode;
    var nodes = idx1 === idx2 ?
      [mergeIntoNode(node, ownerID, shift + SHIFT, keyHash, entry)] :
      ((newNode = new ValueNode(ownerID, keyHash, entry)), idx1 < idx2 ? [node, newNode] : [newNode, node]);

    return new BitmapIndexedNode(ownerID, (1 << idx1) | (1 << idx2), nodes);
  }

  function createNodes(ownerID, entries, key, value) {
    if (!ownerID) {
      ownerID = new OwnerID();
    }
    var node = new ValueNode(ownerID, hash(key), [key, value]);
    for (var ii = 0; ii < entries.length; ii++) {
      var entry = entries[ii];
      node = node.update(ownerID, 0, undefined, entry[0], entry[1]);
    }
    return node;
  }

  function packNodes(ownerID, nodes, count, excluding) {
    var bitmap = 0;
    var packedII = 0;
    var packedNodes = new Array(count);
    for (var ii = 0, bit = 1, len = nodes.length; ii < len; ii++, bit <<= 1) {
      var node = nodes[ii];
      if (node !== undefined && ii !== excluding) {
        bitmap |= bit;
        packedNodes[packedII++] = node;
      }
    }
    return new BitmapIndexedNode(ownerID, bitmap, packedNodes);
  }

  function expandNodes(ownerID, nodes, bitmap, including, node) {
    var count = 0;
    var expandedNodes = new Array(SIZE);
    for (var ii = 0; bitmap !== 0; ii++, bitmap >>>= 1) {
      expandedNodes[ii] = bitmap & 1 ? nodes[count++] : undefined;
    }
    expandedNodes[including] = node;
    return new HashArrayMapNode(ownerID, count + 1, expandedNodes);
  }

  function mergeIntoMapWith(map, merger, iterables) {
    var iters = [];
    for (var ii = 0; ii < iterables.length; ii++) {
      var value = iterables[ii];
      var iter = KeyedIterable(value);
      if (!isIterable(value)) {
        iter = iter.map(function(v ) {return fromJS(v)});
      }
      iters.push(iter);
    }
    return mergeIntoCollectionWith(map, merger, iters);
  }

  function deepMerger(merger) {
    return function(existing, value) 
      {return existing && existing.mergeDeepWith && isIterable(value) ?
        existing.mergeDeepWith(merger, value) :
        merger ? merger(existing, value) : value};
  }

  function mergeIntoCollectionWith(collection, merger, iters) {
    iters = iters.filter(function(x ) {return x.size !== 0});
    if (iters.length === 0) {
      return collection;
    }
    if (collection.size === 0 && iters.length === 1) {
      return collection.constructor(iters[0]);
    }
    return collection.withMutations(function(collection ) {
      var mergeIntoMap = merger ?
        function(value, key)  {
          collection.update(key, NOT_SET, function(existing )
            {return existing === NOT_SET ? value : merger(existing, value)}
          );
        } :
        function(value, key)  {
          collection.set(key, value);
        }
      for (var ii = 0; ii < iters.length; ii++) {
        iters[ii].forEach(mergeIntoMap);
      }
    });
  }

  function updateInDeepMap(existing, keyPathIter, notSetValue, updater) {
    var isNotSet = existing === NOT_SET;
    var step = keyPathIter.next();
    if (step.done) {
      var existingValue = isNotSet ? notSetValue : existing;
      var newValue = updater(existingValue);
      return newValue === existingValue ? existing : newValue;
    }
    invariant(
      isNotSet || (existing && existing.set),
      'invalid keyPath'
    );
    var key = step.value;
    var nextExisting = isNotSet ? NOT_SET : existing.get(key, NOT_SET);
    var nextUpdated = updateInDeepMap(
      nextExisting,
      keyPathIter,
      notSetValue,
      updater
    );
    return nextUpdated === nextExisting ? existing :
      nextUpdated === NOT_SET ? existing.remove(key) :
      (isNotSet ? emptyMap() : existing).set(key, nextUpdated);
  }

  function popCount(x) {
    x = x - ((x >> 1) & 0x55555555);
    x = (x & 0x33333333) + ((x >> 2) & 0x33333333);
    x = (x + (x >> 4)) & 0x0f0f0f0f;
    x = x + (x >> 8);
    x = x + (x >> 16);
    return x & 0x7f;
  }

  function setIn(array, idx, val, canEdit) {
    var newArray = canEdit ? array : arrCopy(array);
    newArray[idx] = val;
    return newArray;
  }

  function spliceIn(array, idx, val, canEdit) {
    var newLen = array.length + 1;
    if (canEdit && idx + 1 === newLen) {
      array[idx] = val;
      return array;
    }
    var newArray = new Array(newLen);
    var after = 0;
    for (var ii = 0; ii < newLen; ii++) {
      if (ii === idx) {
        newArray[ii] = val;
        after = -1;
      } else {
        newArray[ii] = array[ii + after];
      }
    }
    return newArray;
  }

  function spliceOut(array, idx, canEdit) {
    var newLen = array.length - 1;
    if (canEdit && idx === newLen) {
      array.pop();
      return array;
    }
    var newArray = new Array(newLen);
    var after = 0;
    for (var ii = 0; ii < newLen; ii++) {
      if (ii === idx) {
        after = 1;
      }
      newArray[ii] = array[ii + after];
    }
    return newArray;
  }

  var MAX_ARRAY_MAP_SIZE = SIZE / 4;
  var MAX_BITMAP_INDEXED_SIZE = SIZE / 2;
  var MIN_HASH_ARRAY_MAP_SIZE = SIZE / 4;

  createClass(List, IndexedCollection);

    // @pragma Construction

    function List(value) {
      var empty = emptyList();
      if (value === null || value === undefined) {
        return empty;
      }
      if (isList(value)) {
        return value;
      }
      var iter = IndexedIterable(value);
      var size = iter.size;
      if (size === 0) {
        return empty;
      }
      assertNotInfinite(size);
      if (size > 0 && size < SIZE) {
        return makeList(0, size, SHIFT, null, new VNode(iter.toArray()));
      }
      return empty.withMutations(function(list ) {
        list.setSize(size);
        iter.forEach(function(v, i)  {return list.set(i, v)});
      });
    }

    List.of = function(/*...values*/) {
      return this(arguments);
    };

    List.prototype.toString = function() {
      return this.__toString('List [', ']');
    };

    // @pragma Access

    List.prototype.get = function(index, notSetValue) {
      index = wrapIndex(this, index);
      if (index < 0 || index >= this.size) {
        return notSetValue;
      }
      index += this._origin;
      var node = listNodeFor(this, index);
      return node && node.array[index & MASK];
    };

    // @pragma Modification

    List.prototype.set = function(index, value) {
      return updateList(this, index, value);
    };

    List.prototype.remove = function(index) {
      return !this.has(index) ? this :
        index === 0 ? this.shift() :
        index === this.size - 1 ? this.pop() :
        this.splice(index, 1);
    };

    List.prototype.clear = function() {
      if (this.size === 0) {
        return this;
      }
      if (this.__ownerID) {
        this.size = this._origin = this._capacity = 0;
        this._level = SHIFT;
        this._root = this._tail = null;
        this.__hash = undefined;
        this.__altered = true;
        return this;
      }
      return emptyList();
    };

    List.prototype.push = function(/*...values*/) {
      var values = arguments;
      var oldSize = this.size;
      return this.withMutations(function(list ) {
        setListBounds(list, 0, oldSize + values.length);
        for (var ii = 0; ii < values.length; ii++) {
          list.set(oldSize + ii, values[ii]);
        }
      });
    };

    List.prototype.pop = function() {
      return setListBounds(this, 0, -1);
    };

    List.prototype.unshift = function(/*...values*/) {
      var values = arguments;
      return this.withMutations(function(list ) {
        setListBounds(list, -values.length);
        for (var ii = 0; ii < values.length; ii++) {
          list.set(ii, values[ii]);
        }
      });
    };

    List.prototype.shift = function() {
      return setListBounds(this, 1);
    };

    // @pragma Composition

    List.prototype.merge = function(/*...iters*/) {
      return mergeIntoListWith(this, undefined, arguments);
    };

    List.prototype.mergeWith = function(merger) {var iters = SLICE$0.call(arguments, 1);
      return mergeIntoListWith(this, merger, iters);
    };

    List.prototype.mergeDeep = function(/*...iters*/) {
      return mergeIntoListWith(this, deepMerger(undefined), arguments);
    };

    List.prototype.mergeDeepWith = function(merger) {var iters = SLICE$0.call(arguments, 1);
      return mergeIntoListWith(this, deepMerger(merger), iters);
    };

    List.prototype.setSize = function(size) {
      return setListBounds(this, 0, size);
    };

    // @pragma Iteration

    List.prototype.slice = function(begin, end) {
      var size = this.size;
      if (wholeSlice(begin, end, size)) {
        return this;
      }
      return setListBounds(
        this,
        resolveBegin(begin, size),
        resolveEnd(end, size)
      );
    };

    List.prototype.__iterator = function(type, reverse) {
      var index = 0;
      var values = iterateList(this, reverse);
      return new src_Iterator__Iterator(function()  {
        var value = values();
        return value === DONE ?
          iteratorDone() :
          iteratorValue(type, index++, value);
      });
    };

    List.prototype.__iterate = function(fn, reverse) {
      var index = 0;
      var values = iterateList(this, reverse);
      var value;
      while ((value = values()) !== DONE) {
        if (fn(value, index++, this) === false) {
          break;
        }
      }
      return index;
    };

    List.prototype.__ensureOwner = function(ownerID) {
      if (ownerID === this.__ownerID) {
        return this;
      }
      if (!ownerID) {
        this.__ownerID = ownerID;
        return this;
      }
      return makeList(this._origin, this._capacity, this._level, this._root, this._tail, ownerID, this.__hash);
    };


  function isList(maybeList) {
    return !!(maybeList && maybeList[IS_LIST_SENTINEL]);
  }

  List.isList = isList;

  var IS_LIST_SENTINEL = '@@__IMMUTABLE_LIST__@@';

  var ListPrototype = List.prototype;
  ListPrototype[IS_LIST_SENTINEL] = true;
  ListPrototype[DELETE] = ListPrototype.remove;
  ListPrototype.setIn = MapPrototype.setIn;
  ListPrototype.deleteIn =
  ListPrototype.removeIn = MapPrototype.removeIn;
  ListPrototype.update = MapPrototype.update;
  ListPrototype.updateIn = MapPrototype.updateIn;
  ListPrototype.mergeIn = MapPrototype.mergeIn;
  ListPrototype.mergeDeepIn = MapPrototype.mergeDeepIn;
  ListPrototype.withMutations = MapPrototype.withMutations;
  ListPrototype.asMutable = MapPrototype.asMutable;
  ListPrototype.asImmutable = MapPrototype.asImmutable;
  ListPrototype.wasAltered = MapPrototype.wasAltered;



    function VNode(array, ownerID) {
      this.array = array;
      this.ownerID = ownerID;
    }

    // TODO: seems like these methods are very similar

    VNode.prototype.removeBefore = function(ownerID, level, index) {
      if (index === level ? 1 << level : 0 || this.array.length === 0) {
        return this;
      }
      var originIndex = (index >>> level) & MASK;
      if (originIndex >= this.array.length) {
        return new VNode([], ownerID);
      }
      var removingFirst = originIndex === 0;
      var newChild;
      if (level > 0) {
        var oldChild = this.array[originIndex];
        newChild = oldChild && oldChild.removeBefore(ownerID, level - SHIFT, index);
        if (newChild === oldChild && removingFirst) {
          return this;
        }
      }
      if (removingFirst && !newChild) {
        return this;
      }
      var editable = editableVNode(this, ownerID);
      if (!removingFirst) {
        for (var ii = 0; ii < originIndex; ii++) {
          editable.array[ii] = undefined;
        }
      }
      if (newChild) {
        editable.array[originIndex] = newChild;
      }
      return editable;
    };

    VNode.prototype.removeAfter = function(ownerID, level, index) {
      if (index === level ? 1 << level : 0 || this.array.length === 0) {
        return this;
      }
      var sizeIndex = ((index - 1) >>> level) & MASK;
      if (sizeIndex >= this.array.length) {
        return this;
      }
      var removingLast = sizeIndex === this.array.length - 1;
      var newChild;
      if (level > 0) {
        var oldChild = this.array[sizeIndex];
        newChild = oldChild && oldChild.removeAfter(ownerID, level - SHIFT, index);
        if (newChild === oldChild && removingLast) {
          return this;
        }
      }
      if (removingLast && !newChild) {
        return this;
      }
      var editable = editableVNode(this, ownerID);
      if (!removingLast) {
        editable.array.pop();
      }
      if (newChild) {
        editable.array[sizeIndex] = newChild;
      }
      return editable;
    };



  var DONE = {};

  function iterateList(list, reverse) {
    var left = list._origin;
    var right = list._capacity;
    var tailPos = getTailOffset(right);
    var tail = list._tail;

    return iterateNodeOrLeaf(list._root, list._level, 0);

    function iterateNodeOrLeaf(node, level, offset) {
      return level === 0 ?
        iterateLeaf(node, offset) :
        iterateNode(node, level, offset);
    }

    function iterateLeaf(node, offset) {
      var array = offset === tailPos ? tail && tail.array : node && node.array;
      var from = offset > left ? 0 : left - offset;
      var to = right - offset;
      if (to > SIZE) {
        to = SIZE;
      }
      return function()  {
        if (from === to) {
          return DONE;
        }
        var idx = reverse ? --to : from++;
        return array && array[idx];
      };
    }

    function iterateNode(node, level, offset) {
      var values;
      var array = node && node.array;
      var from = offset > left ? 0 : (left - offset) >> level;
      var to = ((right - offset) >> level) + 1;
      if (to > SIZE) {
        to = SIZE;
      }
      return function()  {
        do {
          if (values) {
            var value = values();
            if (value !== DONE) {
              return value;
            }
            values = null;
          }
          if (from === to) {
            return DONE;
          }
          var idx = reverse ? --to : from++;
          values = iterateNodeOrLeaf(
            array && array[idx], level - SHIFT, offset + (idx << level)
          );
        } while (true);
      };
    }
  }

  function makeList(origin, capacity, level, root, tail, ownerID, hash) {
    var list = Object.create(ListPrototype);
    list.size = capacity - origin;
    list._origin = origin;
    list._capacity = capacity;
    list._level = level;
    list._root = root;
    list._tail = tail;
    list.__ownerID = ownerID;
    list.__hash = hash;
    list.__altered = false;
    return list;
  }

  var EMPTY_LIST;
  function emptyList() {
    return EMPTY_LIST || (EMPTY_LIST = makeList(0, 0, SHIFT));
  }

  function updateList(list, index, value) {
    index = wrapIndex(list, index);

    if (index >= list.size || index < 0) {
      return list.withMutations(function(list ) {
        index < 0 ?
          setListBounds(list, index).set(0, value) :
          setListBounds(list, 0, index + 1).set(index, value)
      });
    }

    index += list._origin;

    var newTail = list._tail;
    var newRoot = list._root;
    var didAlter = MakeRef(DID_ALTER);
    if (index >= getTailOffset(list._capacity)) {
      newTail = updateVNode(newTail, list.__ownerID, 0, index, value, didAlter);
    } else {
      newRoot = updateVNode(newRoot, list.__ownerID, list._level, index, value, didAlter);
    }

    if (!didAlter.value) {
      return list;
    }

    if (list.__ownerID) {
      list._root = newRoot;
      list._tail = newTail;
      list.__hash = undefined;
      list.__altered = true;
      return list;
    }
    return makeList(list._origin, list._capacity, list._level, newRoot, newTail);
  }

  function updateVNode(node, ownerID, level, index, value, didAlter) {
    var idx = (index >>> level) & MASK;
    var nodeHas = node && idx < node.array.length;
    if (!nodeHas && value === undefined) {
      return node;
    }

    var newNode;

    if (level > 0) {
      var lowerNode = node && node.array[idx];
      var newLowerNode = updateVNode(lowerNode, ownerID, level - SHIFT, index, value, didAlter);
      if (newLowerNode === lowerNode) {
        return node;
      }
      newNode = editableVNode(node, ownerID);
      newNode.array[idx] = newLowerNode;
      return newNode;
    }

    if (nodeHas && node.array[idx] === value) {
      return node;
    }

    SetRef(didAlter);

    newNode = editableVNode(node, ownerID);
    if (value === undefined && idx === newNode.array.length - 1) {
      newNode.array.pop();
    } else {
      newNode.array[idx] = value;
    }
    return newNode;
  }

  function editableVNode(node, ownerID) {
    if (ownerID && node && ownerID === node.ownerID) {
      return node;
    }
    return new VNode(node ? node.array.slice() : [], ownerID);
  }

  function listNodeFor(list, rawIndex) {
    if (rawIndex >= getTailOffset(list._capacity)) {
      return list._tail;
    }
    if (rawIndex < 1 << (list._level + SHIFT)) {
      var node = list._root;
      var level = list._level;
      while (node && level > 0) {
        node = node.array[(rawIndex >>> level) & MASK];
        level -= SHIFT;
      }
      return node;
    }
  }

  function setListBounds(list, begin, end) {
    var owner = list.__ownerID || new OwnerID();
    var oldOrigin = list._origin;
    var oldCapacity = list._capacity;
    var newOrigin = oldOrigin + begin;
    var newCapacity = end === undefined ? oldCapacity : end < 0 ? oldCapacity + end : oldOrigin + end;
    if (newOrigin === oldOrigin && newCapacity === oldCapacity) {
      return list;
    }

    // If it's going to end after it starts, it's empty.
    if (newOrigin >= newCapacity) {
      return list.clear();
    }

    var newLevel = list._level;
    var newRoot = list._root;

    // New origin might require creating a higher root.
    var offsetShift = 0;
    while (newOrigin + offsetShift < 0) {
      newRoot = new VNode(newRoot && newRoot.array.length ? [undefined, newRoot] : [], owner);
      newLevel += SHIFT;
      offsetShift += 1 << newLevel;
    }
    if (offsetShift) {
      newOrigin += offsetShift;
      oldOrigin += offsetShift;
      newCapacity += offsetShift;
      oldCapacity += offsetShift;
    }

    var oldTailOffset = getTailOffset(oldCapacity);
    var newTailOffset = getTailOffset(newCapacity);

    // New size might require creating a higher root.
    while (newTailOffset >= 1 << (newLevel + SHIFT)) {
      newRoot = new VNode(newRoot && newRoot.array.length ? [newRoot] : [], owner);
      newLevel += SHIFT;
    }

    // Locate or create the new tail.
    var oldTail = list._tail;
    var newTail = newTailOffset < oldTailOffset ?
      listNodeFor(list, newCapacity - 1) :
      newTailOffset > oldTailOffset ? new VNode([], owner) : oldTail;

    // Merge Tail into tree.
    if (oldTail && newTailOffset > oldTailOffset && newOrigin < oldCapacity && oldTail.array.length) {
      newRoot = editableVNode(newRoot, owner);
      var node = newRoot;
      for (var level = newLevel; level > SHIFT; level -= SHIFT) {
        var idx = (oldTailOffset >>> level) & MASK;
        node = node.array[idx] = editableVNode(node.array[idx], owner);
      }
      node.array[(oldTailOffset >>> SHIFT) & MASK] = oldTail;
    }

    // If the size has been reduced, there's a chance the tail needs to be trimmed.
    if (newCapacity < oldCapacity) {
      newTail = newTail && newTail.removeAfter(owner, 0, newCapacity);
    }

    // If the new origin is within the tail, then we do not need a root.
    if (newOrigin >= newTailOffset) {
      newOrigin -= newTailOffset;
      newCapacity -= newTailOffset;
      newLevel = SHIFT;
      newRoot = null;
      newTail = newTail && newTail.removeBefore(owner, 0, newOrigin);

    // Otherwise, if the root has been trimmed, garbage collect.
    } else if (newOrigin > oldOrigin || newTailOffset < oldTailOffset) {
      offsetShift = 0;

      // Identify the new top root node of the subtree of the old root.
      while (newRoot) {
        var beginIndex = (newOrigin >>> newLevel) & MASK;
        if (beginIndex !== (newTailOffset >>> newLevel) & MASK) {
          break;
        }
        if (beginIndex) {
          offsetShift += (1 << newLevel) * beginIndex;
        }
        newLevel -= SHIFT;
        newRoot = newRoot.array[beginIndex];
      }

      // Trim the new sides of the new root.
      if (newRoot && newOrigin > oldOrigin) {
        newRoot = newRoot.removeBefore(owner, newLevel, newOrigin - offsetShift);
      }
      if (newRoot && newTailOffset < oldTailOffset) {
        newRoot = newRoot.removeAfter(owner, newLevel, newTailOffset - offsetShift);
      }
      if (offsetShift) {
        newOrigin -= offsetShift;
        newCapacity -= offsetShift;
      }
    }

    if (list.__ownerID) {
      list.size = newCapacity - newOrigin;
      list._origin = newOrigin;
      list._capacity = newCapacity;
      list._level = newLevel;
      list._root = newRoot;
      list._tail = newTail;
      list.__hash = undefined;
      list.__altered = true;
      return list;
    }
    return makeList(newOrigin, newCapacity, newLevel, newRoot, newTail);
  }

  function mergeIntoListWith(list, merger, iterables) {
    var iters = [];
    var maxSize = 0;
    for (var ii = 0; ii < iterables.length; ii++) {
      var value = iterables[ii];
      var iter = IndexedIterable(value);
      if (iter.size > maxSize) {
        maxSize = iter.size;
      }
      if (!isIterable(value)) {
        iter = iter.map(function(v ) {return fromJS(v)});
      }
      iters.push(iter);
    }
    if (maxSize > list.size) {
      list = list.setSize(maxSize);
    }
    return mergeIntoCollectionWith(list, merger, iters);
  }

  function getTailOffset(size) {
    return size < SIZE ? 0 : (((size - 1) >>> SHIFT) << SHIFT);
  }

  createClass(OrderedMap, src_Map__Map);

    // @pragma Construction

    function OrderedMap(value) {
      return value === null || value === undefined ? emptyOrderedMap() :
        isOrderedMap(value) ? value :
        emptyOrderedMap().withMutations(function(map ) {
          var iter = KeyedIterable(value);
          assertNotInfinite(iter.size);
          iter.forEach(function(v, k)  {return map.set(k, v)});
        });
    }

    OrderedMap.of = function(/*...values*/) {
      return this(arguments);
    };

    OrderedMap.prototype.toString = function() {
      return this.__toString('OrderedMap {', '}');
    };

    // @pragma Access

    OrderedMap.prototype.get = function(k, notSetValue) {
      var index = this._map.get(k);
      return index !== undefined ? this._list.get(index)[1] : notSetValue;
    };

    // @pragma Modification

    OrderedMap.prototype.clear = function() {
      if (this.size === 0) {
        return this;
      }
      if (this.__ownerID) {
        this.size = 0;
        this._map.clear();
        this._list.clear();
        return this;
      }
      return emptyOrderedMap();
    };

    OrderedMap.prototype.set = function(k, v) {
      return updateOrderedMap(this, k, v);
    };

    OrderedMap.prototype.remove = function(k) {
      return updateOrderedMap(this, k, NOT_SET);
    };

    OrderedMap.prototype.wasAltered = function() {
      return this._map.wasAltered() || this._list.wasAltered();
    };

    OrderedMap.prototype.__iterate = function(fn, reverse) {var this$0 = this;
      return this._list.__iterate(
        function(entry ) {return entry && fn(entry[1], entry[0], this$0)},
        reverse
      );
    };

    OrderedMap.prototype.__iterator = function(type, reverse) {
      return this._list.fromEntrySeq().__iterator(type, reverse);
    };

    OrderedMap.prototype.__ensureOwner = function(ownerID) {
      if (ownerID === this.__ownerID) {
        return this;
      }
      var newMap = this._map.__ensureOwner(ownerID);
      var newList = this._list.__ensureOwner(ownerID);
      if (!ownerID) {
        this.__ownerID = ownerID;
        this._map = newMap;
        this._list = newList;
        return this;
      }
      return makeOrderedMap(newMap, newList, ownerID, this.__hash);
    };


  function isOrderedMap(maybeOrderedMap) {
    return isMap(maybeOrderedMap) && isOrdered(maybeOrderedMap);
  }

  OrderedMap.isOrderedMap = isOrderedMap;

  OrderedMap.prototype[IS_ORDERED_SENTINEL] = true;
  OrderedMap.prototype[DELETE] = OrderedMap.prototype.remove;



  function makeOrderedMap(map, list, ownerID, hash) {
    var omap = Object.create(OrderedMap.prototype);
    omap.size = map ? map.size : 0;
    omap._map = map;
    omap._list = list;
    omap.__ownerID = ownerID;
    omap.__hash = hash;
    return omap;
  }

  var EMPTY_ORDERED_MAP;
  function emptyOrderedMap() {
    return EMPTY_ORDERED_MAP || (EMPTY_ORDERED_MAP = makeOrderedMap(emptyMap(), emptyList()));
  }

  function updateOrderedMap(omap, k, v) {
    var map = omap._map;
    var list = omap._list;
    var i = map.get(k);
    var has = i !== undefined;
    var newMap;
    var newList;
    if (v === NOT_SET) { // removed
      if (!has) {
        return omap;
      }
      if (list.size >= SIZE && list.size >= map.size * 2) {
        newList = list.filter(function(entry, idx)  {return entry !== undefined && i !== idx});
        newMap = newList.toKeyedSeq().map(function(entry ) {return entry[0]}).flip().toMap();
        if (omap.__ownerID) {
          newMap.__ownerID = newList.__ownerID = omap.__ownerID;
        }
      } else {
        newMap = map.remove(k);
        newList = i === list.size - 1 ? list.pop() : list.set(i, undefined);
      }
    } else {
      if (has) {
        if (v === list.get(i)[1]) {
          return omap;
        }
        newMap = map;
        newList = list.set(i, [k, v]);
      } else {
        newMap = map.set(k, list.size);
        newList = list.set(list.size, [k, v]);
      }
    }
    if (omap.__ownerID) {
      omap.size = newMap.size;
      omap._map = newMap;
      omap._list = newList;
      omap.__hash = undefined;
      return omap;
    }
    return makeOrderedMap(newMap, newList);
  }

  createClass(Stack, IndexedCollection);

    // @pragma Construction

    function Stack(value) {
      return value === null || value === undefined ? emptyStack() :
        isStack(value) ? value :
        emptyStack().unshiftAll(value);
    }

    Stack.of = function(/*...values*/) {
      return this(arguments);
    };

    Stack.prototype.toString = function() {
      return this.__toString('Stack [', ']');
    };

    // @pragma Access

    Stack.prototype.get = function(index, notSetValue) {
      var head = this._head;
      index = wrapIndex(this, index);
      while (head && index--) {
        head = head.next;
      }
      return head ? head.value : notSetValue;
    };

    Stack.prototype.peek = function() {
      return this._head && this._head.value;
    };

    // @pragma Modification

    Stack.prototype.push = function(/*...values*/) {
      if (arguments.length === 0) {
        return this;
      }
      var newSize = this.size + arguments.length;
      var head = this._head;
      for (var ii = arguments.length - 1; ii >= 0; ii--) {
        head = {
          value: arguments[ii],
          next: head
        };
      }
      if (this.__ownerID) {
        this.size = newSize;
        this._head = head;
        this.__hash = undefined;
        this.__altered = true;
        return this;
      }
      return makeStack(newSize, head);
    };

    Stack.prototype.pushAll = function(iter) {
      iter = IndexedIterable(iter);
      if (iter.size === 0) {
        return this;
      }
      assertNotInfinite(iter.size);
      var newSize = this.size;
      var head = this._head;
      iter.reverse().forEach(function(value ) {
        newSize++;
        head = {
          value: value,
          next: head
        };
      });
      if (this.__ownerID) {
        this.size = newSize;
        this._head = head;
        this.__hash = undefined;
        this.__altered = true;
        return this;
      }
      return makeStack(newSize, head);
    };

    Stack.prototype.pop = function() {
      return this.slice(1);
    };

    Stack.prototype.unshift = function(/*...values*/) {
      return this.push.apply(this, arguments);
    };

    Stack.prototype.unshiftAll = function(iter) {
      return this.pushAll(iter);
    };

    Stack.prototype.shift = function() {
      return this.pop.apply(this, arguments);
    };

    Stack.prototype.clear = function() {
      if (this.size === 0) {
        return this;
      }
      if (this.__ownerID) {
        this.size = 0;
        this._head = undefined;
        this.__hash = undefined;
        this.__altered = true;
        return this;
      }
      return emptyStack();
    };

    Stack.prototype.slice = function(begin, end) {
      if (wholeSlice(begin, end, this.size)) {
        return this;
      }
      var resolvedBegin = resolveBegin(begin, this.size);
      var resolvedEnd = resolveEnd(end, this.size);
      if (resolvedEnd !== this.size) {
        // super.slice(begin, end);
        return IndexedCollection.prototype.slice.call(this, begin, end);
      }
      var newSize = this.size - resolvedBegin;
      var head = this._head;
      while (resolvedBegin--) {
        head = head.next;
      }
      if (this.__ownerID) {
        this.size = newSize;
        this._head = head;
        this.__hash = undefined;
        this.__altered = true;
        return this;
      }
      return makeStack(newSize, head);
    };

    // @pragma Mutability

    Stack.prototype.__ensureOwner = function(ownerID) {
      if (ownerID === this.__ownerID) {
        return this;
      }
      if (!ownerID) {
        this.__ownerID = ownerID;
        this.__altered = false;
        return this;
      }
      return makeStack(this.size, this._head, ownerID, this.__hash);
    };

    // @pragma Iteration

    Stack.prototype.__iterate = function(fn, reverse) {
      if (reverse) {
        return this.reverse().__iterate(fn);
      }
      var iterations = 0;
      var node = this._head;
      while (node) {
        if (fn(node.value, iterations++, this) === false) {
          break;
        }
        node = node.next;
      }
      return iterations;
    };

    Stack.prototype.__iterator = function(type, reverse) {
      if (reverse) {
        return this.reverse().__iterator(type);
      }
      var iterations = 0;
      var node = this._head;
      return new src_Iterator__Iterator(function()  {
        if (node) {
          var value = node.value;
          node = node.next;
          return iteratorValue(type, iterations++, value);
        }
        return iteratorDone();
      });
    };


  function isStack(maybeStack) {
    return !!(maybeStack && maybeStack[IS_STACK_SENTINEL]);
  }

  Stack.isStack = isStack;

  var IS_STACK_SENTINEL = '@@__IMMUTABLE_STACK__@@';

  var StackPrototype = Stack.prototype;
  StackPrototype[IS_STACK_SENTINEL] = true;
  StackPrototype.withMutations = MapPrototype.withMutations;
  StackPrototype.asMutable = MapPrototype.asMutable;
  StackPrototype.asImmutable = MapPrototype.asImmutable;
  StackPrototype.wasAltered = MapPrototype.wasAltered;


  function makeStack(size, head, ownerID, hash) {
    var map = Object.create(StackPrototype);
    map.size = size;
    map._head = head;
    map.__ownerID = ownerID;
    map.__hash = hash;
    map.__altered = false;
    return map;
  }

  var EMPTY_STACK;
  function emptyStack() {
    return EMPTY_STACK || (EMPTY_STACK = makeStack(0));
  }

  createClass(src_Set__Set, SetCollection);

    // @pragma Construction

    function src_Set__Set(value) {
      return value === null || value === undefined ? emptySet() :
        isSet(value) ? value :
        emptySet().withMutations(function(set ) {
          var iter = SetIterable(value);
          assertNotInfinite(iter.size);
          iter.forEach(function(v ) {return set.add(v)});
        });
    }

    src_Set__Set.of = function(/*...values*/) {
      return this(arguments);
    };

    src_Set__Set.fromKeys = function(value) {
      return this(KeyedIterable(value).keySeq());
    };

    src_Set__Set.prototype.toString = function() {
      return this.__toString('Set {', '}');
    };

    // @pragma Access

    src_Set__Set.prototype.has = function(value) {
      return this._map.has(value);
    };

    // @pragma Modification

    src_Set__Set.prototype.add = function(value) {
      return updateSet(this, this._map.set(value, true));
    };

    src_Set__Set.prototype.remove = function(value) {
      return updateSet(this, this._map.remove(value));
    };

    src_Set__Set.prototype.clear = function() {
      return updateSet(this, this._map.clear());
    };

    // @pragma Composition

    src_Set__Set.prototype.union = function() {var iters = SLICE$0.call(arguments, 0);
      iters = iters.filter(function(x ) {return x.size !== 0});
      if (iters.length === 0) {
        return this;
      }
      if (this.size === 0 && iters.length === 1) {
        return this.constructor(iters[0]);
      }
      return this.withMutations(function(set ) {
        for (var ii = 0; ii < iters.length; ii++) {
          SetIterable(iters[ii]).forEach(function(value ) {return set.add(value)});
        }
      });
    };

    src_Set__Set.prototype.intersect = function() {var iters = SLICE$0.call(arguments, 0);
      if (iters.length === 0) {
        return this;
      }
      iters = iters.map(function(iter ) {return SetIterable(iter)});
      var originalSet = this;
      return this.withMutations(function(set ) {
        originalSet.forEach(function(value ) {
          if (!iters.every(function(iter ) {return iter.contains(value)})) {
            set.remove(value);
          }
        });
      });
    };

    src_Set__Set.prototype.subtract = function() {var iters = SLICE$0.call(arguments, 0);
      if (iters.length === 0) {
        return this;
      }
      iters = iters.map(function(iter ) {return SetIterable(iter)});
      var originalSet = this;
      return this.withMutations(function(set ) {
        originalSet.forEach(function(value ) {
          if (iters.some(function(iter ) {return iter.contains(value)})) {
            set.remove(value);
          }
        });
      });
    };

    src_Set__Set.prototype.merge = function() {
      return this.union.apply(this, arguments);
    };

    src_Set__Set.prototype.mergeWith = function(merger) {var iters = SLICE$0.call(arguments, 1);
      return this.union.apply(this, iters);
    };

    src_Set__Set.prototype.sort = function(comparator) {
      // Late binding
      return OrderedSet(sortFactory(this, comparator));
    };

    src_Set__Set.prototype.sortBy = function(mapper, comparator) {
      // Late binding
      return OrderedSet(sortFactory(this, comparator, mapper));
    };

    src_Set__Set.prototype.wasAltered = function() {
      return this._map.wasAltered();
    };

    src_Set__Set.prototype.__iterate = function(fn, reverse) {var this$0 = this;
      return this._map.__iterate(function(_, k)  {return fn(k, k, this$0)}, reverse);
    };

    src_Set__Set.prototype.__iterator = function(type, reverse) {
      return this._map.map(function(_, k)  {return k}).__iterator(type, reverse);
    };

    src_Set__Set.prototype.__ensureOwner = function(ownerID) {
      if (ownerID === this.__ownerID) {
        return this;
      }
      var newMap = this._map.__ensureOwner(ownerID);
      if (!ownerID) {
        this.__ownerID = ownerID;
        this._map = newMap;
        return this;
      }
      return this.__make(newMap, ownerID);
    };


  function isSet(maybeSet) {
    return !!(maybeSet && maybeSet[IS_SET_SENTINEL]);
  }

  src_Set__Set.isSet = isSet;

  var IS_SET_SENTINEL = '@@__IMMUTABLE_SET__@@';

  var SetPrototype = src_Set__Set.prototype;
  SetPrototype[IS_SET_SENTINEL] = true;
  SetPrototype[DELETE] = SetPrototype.remove;
  SetPrototype.mergeDeep = SetPrototype.merge;
  SetPrototype.mergeDeepWith = SetPrototype.mergeWith;
  SetPrototype.withMutations = MapPrototype.withMutations;
  SetPrototype.asMutable = MapPrototype.asMutable;
  SetPrototype.asImmutable = MapPrototype.asImmutable;

  SetPrototype.__empty = emptySet;
  SetPrototype.__make = makeSet;

  function updateSet(set, newMap) {
    if (set.__ownerID) {
      set.size = newMap.size;
      set._map = newMap;
      return set;
    }
    return newMap === set._map ? set :
      newMap.size === 0 ? set.__empty() :
      set.__make(newMap);
  }

  function makeSet(map, ownerID) {
    var set = Object.create(SetPrototype);
    set.size = map ? map.size : 0;
    set._map = map;
    set.__ownerID = ownerID;
    return set;
  }

  var EMPTY_SET;
  function emptySet() {
    return EMPTY_SET || (EMPTY_SET = makeSet(emptyMap()));
  }

  createClass(OrderedSet, src_Set__Set);

    // @pragma Construction

    function OrderedSet(value) {
      return value === null || value === undefined ? emptyOrderedSet() :
        isOrderedSet(value) ? value :
        emptyOrderedSet().withMutations(function(set ) {
          var iter = SetIterable(value);
          assertNotInfinite(iter.size);
          iter.forEach(function(v ) {return set.add(v)});
        });
    }

    OrderedSet.of = function(/*...values*/) {
      return this(arguments);
    };

    OrderedSet.fromKeys = function(value) {
      return this(KeyedIterable(value).keySeq());
    };

    OrderedSet.prototype.toString = function() {
      return this.__toString('OrderedSet {', '}');
    };


  function isOrderedSet(maybeOrderedSet) {
    return isSet(maybeOrderedSet) && isOrdered(maybeOrderedSet);
  }

  OrderedSet.isOrderedSet = isOrderedSet;

  var OrderedSetPrototype = OrderedSet.prototype;
  OrderedSetPrototype[IS_ORDERED_SENTINEL] = true;

  OrderedSetPrototype.__empty = emptyOrderedSet;
  OrderedSetPrototype.__make = makeOrderedSet;

  function makeOrderedSet(map, ownerID) {
    var set = Object.create(OrderedSetPrototype);
    set.size = map ? map.size : 0;
    set._map = map;
    set.__ownerID = ownerID;
    return set;
  }

  var EMPTY_ORDERED_SET;
  function emptyOrderedSet() {
    return EMPTY_ORDERED_SET || (EMPTY_ORDERED_SET = makeOrderedSet(emptyOrderedMap()));
  }

  createClass(Record, KeyedCollection);

    function Record(defaultValues, name) {
      var RecordType = function Record(values) {
        if (!(this instanceof RecordType)) {
          return new RecordType(values);
        }
        this._map = src_Map__Map(values);
      };

      var keys = Object.keys(defaultValues);

      var RecordTypePrototype = RecordType.prototype = Object.create(RecordPrototype);
      RecordTypePrototype.constructor = RecordType;
      name && (RecordTypePrototype._name = name);
      RecordTypePrototype._defaultValues = defaultValues;
      RecordTypePrototype._keys = keys;
      RecordTypePrototype.size = keys.length;

      try {
        keys.forEach(function(key ) {
          Object.defineProperty(RecordType.prototype, key, {
            get: function() {
              return this.get(key);
            },
            set: function(value) {
              invariant(this.__ownerID, 'Cannot set on an immutable record.');
              this.set(key, value);
            }
          });
        });
      } catch (error) {
        // Object.defineProperty failed. Probably IE8.
      }

      return RecordType;
    }

    Record.prototype.toString = function() {
      return this.__toString(recordName(this) + ' {', '}');
    };

    // @pragma Access

    Record.prototype.has = function(k) {
      return this._defaultValues.hasOwnProperty(k);
    };

    Record.prototype.get = function(k, notSetValue) {
      if (!this.has(k)) {
        return notSetValue;
      }
      var defaultVal = this._defaultValues[k];
      return this._map ? this._map.get(k, defaultVal) : defaultVal;
    };

    // @pragma Modification

    Record.prototype.clear = function() {
      if (this.__ownerID) {
        this._map && this._map.clear();
        return this;
      }
      var SuperRecord = Object.getPrototypeOf(this).constructor;
      return SuperRecord._empty || (SuperRecord._empty = makeRecord(this, emptyMap()));
    };

    Record.prototype.set = function(k, v) {
      if (!this.has(k)) {
        throw new Error('Cannot set unknown key "' + k + '" on ' + recordName(this));
      }
      var newMap = this._map && this._map.set(k, v);
      if (this.__ownerID || newMap === this._map) {
        return this;
      }
      return makeRecord(this, newMap);
    };

    Record.prototype.remove = function(k) {
      if (!this.has(k)) {
        return this;
      }
      var newMap = this._map && this._map.remove(k);
      if (this.__ownerID || newMap === this._map) {
        return this;
      }
      return makeRecord(this, newMap);
    };

    Record.prototype.wasAltered = function() {
      return this._map.wasAltered();
    };

    Record.prototype.__iterator = function(type, reverse) {var this$0 = this;
      return KeyedIterable(this._defaultValues).map(function(_, k)  {return this$0.get(k)}).__iterator(type, reverse);
    };

    Record.prototype.__iterate = function(fn, reverse) {var this$0 = this;
      return KeyedIterable(this._defaultValues).map(function(_, k)  {return this$0.get(k)}).__iterate(fn, reverse);
    };

    Record.prototype.__ensureOwner = function(ownerID) {
      if (ownerID === this.__ownerID) {
        return this;
      }
      var newMap = this._map && this._map.__ensureOwner(ownerID);
      if (!ownerID) {
        this.__ownerID = ownerID;
        this._map = newMap;
        return this;
      }
      return makeRecord(this, newMap, ownerID);
    };


  var RecordPrototype = Record.prototype;
  RecordPrototype[DELETE] = RecordPrototype.remove;
  RecordPrototype.deleteIn =
  RecordPrototype.removeIn = MapPrototype.removeIn;
  RecordPrototype.merge = MapPrototype.merge;
  RecordPrototype.mergeWith = MapPrototype.mergeWith;
  RecordPrototype.mergeIn = MapPrototype.mergeIn;
  RecordPrototype.mergeDeep = MapPrototype.mergeDeep;
  RecordPrototype.mergeDeepWith = MapPrototype.mergeDeepWith;
  RecordPrototype.mergeDeepIn = MapPrototype.mergeDeepIn;
  RecordPrototype.setIn = MapPrototype.setIn;
  RecordPrototype.update = MapPrototype.update;
  RecordPrototype.updateIn = MapPrototype.updateIn;
  RecordPrototype.withMutations = MapPrototype.withMutations;
  RecordPrototype.asMutable = MapPrototype.asMutable;
  RecordPrototype.asImmutable = MapPrototype.asImmutable;


  function makeRecord(likeRecord, map, ownerID) {
    var record = Object.create(Object.getPrototypeOf(likeRecord));
    record._map = map;
    record.__ownerID = ownerID;
    return record;
  }

  function recordName(record) {
    return record._name || record.constructor.name;
  }

  function deepEqual(a, b) {
    if (a === b) {
      return true;
    }

    if (
      !isIterable(b) ||
      a.size !== undefined && b.size !== undefined && a.size !== b.size ||
      a.__hash !== undefined && b.__hash !== undefined && a.__hash !== b.__hash ||
      isKeyed(a) !== isKeyed(b) ||
      isIndexed(a) !== isIndexed(b) ||
      isOrdered(a) !== isOrdered(b)
    ) {
      return false;
    }

    if (a.size === 0 && b.size === 0) {
      return true;
    }

    var notAssociative = !isAssociative(a);

    if (isOrdered(a)) {
      var entries = a.entries();
      return b.every(function(v, k)  {
        var entry = entries.next().value;
        return entry && is(entry[1], v) && (notAssociative || is(entry[0], k));
      }) && entries.next().done;
    }

    var flipped = false;

    if (a.size === undefined) {
      if (b.size === undefined) {
        a.cacheResult();
      } else {
        flipped = true;
        var _ = a;
        a = b;
        b = _;
      }
    }

    var allEqual = true;
    var bSize = b.__iterate(function(v, k)  {
      if (notAssociative ? !a.has(v) :
          flipped ? !is(v, a.get(k, NOT_SET)) : !is(a.get(k, NOT_SET), v)) {
        allEqual = false;
        return false;
      }
    });

    return allEqual && a.size === bSize;
  }

  createClass(Range, IndexedSeq);

    function Range(start, end, step) {
      if (!(this instanceof Range)) {
        return new Range(start, end, step);
      }
      invariant(step !== 0, 'Cannot step a Range by 0');
      start = start || 0;
      if (end === undefined) {
        end = Infinity;
      }
      step = step === undefined ? 1 : Math.abs(step);
      if (end < start) {
        step = -step;
      }
      this._start = start;
      this._end = end;
      this._step = step;
      this.size = Math.max(0, Math.ceil((end - start) / step - 1) + 1);
      if (this.size === 0) {
        if (EMPTY_RANGE) {
          return EMPTY_RANGE;
        }
        EMPTY_RANGE = this;
      }
    }

    Range.prototype.toString = function() {
      if (this.size === 0) {
        return 'Range []';
      }
      return 'Range [ ' +
        this._start + '...' + this._end +
        (this._step > 1 ? ' by ' + this._step : '') +
      ' ]';
    };

    Range.prototype.get = function(index, notSetValue) {
      return this.has(index) ?
        this._start + wrapIndex(this, index) * this._step :
        notSetValue;
    };

    Range.prototype.contains = function(searchValue) {
      var possibleIndex = (searchValue - this._start) / this._step;
      return possibleIndex >= 0 &&
        possibleIndex < this.size &&
        possibleIndex === Math.floor(possibleIndex);
    };

    Range.prototype.slice = function(begin, end) {
      if (wholeSlice(begin, end, this.size)) {
        return this;
      }
      begin = resolveBegin(begin, this.size);
      end = resolveEnd(end, this.size);
      if (end <= begin) {
        return new Range(0, 0);
      }
      return new Range(this.get(begin, this._end), this.get(end, this._end), this._step);
    };

    Range.prototype.indexOf = function(searchValue) {
      var offsetValue = searchValue - this._start;
      if (offsetValue % this._step === 0) {
        var index = offsetValue / this._step;
        if (index >= 0 && index < this.size) {
          return index
        }
      }
      return -1;
    };

    Range.prototype.lastIndexOf = function(searchValue) {
      return this.indexOf(searchValue);
    };

    Range.prototype.__iterate = function(fn, reverse) {
      var maxIndex = this.size - 1;
      var step = this._step;
      var value = reverse ? this._start + maxIndex * step : this._start;
      for (var ii = 0; ii <= maxIndex; ii++) {
        if (fn(value, ii, this) === false) {
          return ii + 1;
        }
        value += reverse ? -step : step;
      }
      return ii;
    };

    Range.prototype.__iterator = function(type, reverse) {
      var maxIndex = this.size - 1;
      var step = this._step;
      var value = reverse ? this._start + maxIndex * step : this._start;
      var ii = 0;
      return new src_Iterator__Iterator(function()  {
        var v = value;
        value += reverse ? -step : step;
        return ii > maxIndex ? iteratorDone() : iteratorValue(type, ii++, v);
      });
    };

    Range.prototype.equals = function(other) {
      return other instanceof Range ?
        this._start === other._start &&
        this._end === other._end &&
        this._step === other._step :
        deepEqual(this, other);
    };


  var EMPTY_RANGE;

  createClass(Repeat, IndexedSeq);

    function Repeat(value, times) {
      if (!(this instanceof Repeat)) {
        return new Repeat(value, times);
      }
      this._value = value;
      this.size = times === undefined ? Infinity : Math.max(0, times);
      if (this.size === 0) {
        if (EMPTY_REPEAT) {
          return EMPTY_REPEAT;
        }
        EMPTY_REPEAT = this;
      }
    }

    Repeat.prototype.toString = function() {
      if (this.size === 0) {
        return 'Repeat []';
      }
      return 'Repeat [ ' + this._value + ' ' + this.size + ' times ]';
    };

    Repeat.prototype.get = function(index, notSetValue) {
      return this.has(index) ? this._value : notSetValue;
    };

    Repeat.prototype.contains = function(searchValue) {
      return is(this._value, searchValue);
    };

    Repeat.prototype.slice = function(begin, end) {
      var size = this.size;
      return wholeSlice(begin, end, size) ? this :
        new Repeat(this._value, resolveEnd(end, size) - resolveBegin(begin, size));
    };

    Repeat.prototype.reverse = function() {
      return this;
    };

    Repeat.prototype.indexOf = function(searchValue) {
      if (is(this._value, searchValue)) {
        return 0;
      }
      return -1;
    };

    Repeat.prototype.lastIndexOf = function(searchValue) {
      if (is(this._value, searchValue)) {
        return this.size;
      }
      return -1;
    };

    Repeat.prototype.__iterate = function(fn, reverse) {
      for (var ii = 0; ii < this.size; ii++) {
        if (fn(this._value, ii, this) === false) {
          return ii + 1;
        }
      }
      return ii;
    };

    Repeat.prototype.__iterator = function(type, reverse) {var this$0 = this;
      var ii = 0;
      return new src_Iterator__Iterator(function() 
        {return ii < this$0.size ? iteratorValue(type, ii++, this$0._value) : iteratorDone()}
      );
    };

    Repeat.prototype.equals = function(other) {
      return other instanceof Repeat ?
        is(this._value, other._value) :
        deepEqual(other);
    };


  var EMPTY_REPEAT;

  /**
   * Contributes additional methods to a constructor
   */
  function mixin(ctor, methods) {
    var keyCopier = function(key ) { ctor.prototype[key] = methods[key]; };
    Object.keys(methods).forEach(keyCopier);
    Object.getOwnPropertySymbols &&
      Object.getOwnPropertySymbols(methods).forEach(keyCopier);
    return ctor;
  }

  Iterable.Iterator = src_Iterator__Iterator;

  mixin(Iterable, {

    // ### Conversion to other types

    toArray: function() {
      assertNotInfinite(this.size);
      var array = new Array(this.size || 0);
      this.valueSeq().__iterate(function(v, i)  { array[i] = v; });
      return array;
    },

    toIndexedSeq: function() {
      return new ToIndexedSequence(this);
    },

    toJS: function() {
      return this.toSeq().map(
        function(value ) {return value && typeof value.toJS === 'function' ? value.toJS() : value}
      ).__toJS();
    },

    toJSON: function() {
      return this.toSeq().map(
        function(value ) {return value && typeof value.toJSON === 'function' ? value.toJSON() : value}
      ).__toJS();
    },

    toKeyedSeq: function() {
      return new ToKeyedSequence(this, true);
    },

    toMap: function() {
      // Use Late Binding here to solve the circular dependency.
      return src_Map__Map(this.toKeyedSeq());
    },

    toObject: function() {
      assertNotInfinite(this.size);
      var object = {};
      this.__iterate(function(v, k)  { object[k] = v; });
      return object;
    },

    toOrderedMap: function() {
      // Use Late Binding here to solve the circular dependency.
      return OrderedMap(this.toKeyedSeq());
    },

    toOrderedSet: function() {
      // Use Late Binding here to solve the circular dependency.
      return OrderedSet(isKeyed(this) ? this.valueSeq() : this);
    },

    toSet: function() {
      // Use Late Binding here to solve the circular dependency.
      return src_Set__Set(isKeyed(this) ? this.valueSeq() : this);
    },

    toSetSeq: function() {
      return new ToSetSequence(this);
    },

    toSeq: function() {
      return isIndexed(this) ? this.toIndexedSeq() :
        isKeyed(this) ? this.toKeyedSeq() :
        this.toSetSeq();
    },

    toStack: function() {
      // Use Late Binding here to solve the circular dependency.
      return Stack(isKeyed(this) ? this.valueSeq() : this);
    },

    toList: function() {
      // Use Late Binding here to solve the circular dependency.
      return List(isKeyed(this) ? this.valueSeq() : this);
    },


    // ### Common JavaScript methods and properties

    toString: function() {
      return '[Iterable]';
    },

    __toString: function(head, tail) {
      if (this.size === 0) {
        return head + tail;
      }
      return head + ' ' + this.toSeq().map(this.__toStringMapper).join(', ') + ' ' + tail;
    },


    // ### ES6 Collection methods (ES6 Array and Map)

    concat: function() {var values = SLICE$0.call(arguments, 0);
      return reify(this, concatFactory(this, values));
    },

    contains: function(searchValue) {
      return this.some(function(value ) {return is(value, searchValue)});
    },

    entries: function() {
      return this.__iterator(ITERATE_ENTRIES);
    },

    every: function(predicate, context) {
      assertNotInfinite(this.size);
      var returnValue = true;
      this.__iterate(function(v, k, c)  {
        if (!predicate.call(context, v, k, c)) {
          returnValue = false;
          return false;
        }
      });
      return returnValue;
    },

    filter: function(predicate, context) {
      return reify(this, filterFactory(this, predicate, context, true));
    },

    find: function(predicate, context, notSetValue) {
      var entry = this.findEntry(predicate, context);
      return entry ? entry[1] : notSetValue;
    },

    findEntry: function(predicate, context) {
      var found;
      this.__iterate(function(v, k, c)  {
        if (predicate.call(context, v, k, c)) {
          found = [k, v];
          return false;
        }
      });
      return found;
    },

    findLastEntry: function(predicate, context) {
      return this.toSeq().reverse().findEntry(predicate, context);
    },

    forEach: function(sideEffect, context) {
      assertNotInfinite(this.size);
      return this.__iterate(context ? sideEffect.bind(context) : sideEffect);
    },

    join: function(separator) {
      assertNotInfinite(this.size);
      separator = separator !== undefined ? '' + separator : ',';
      var joined = '';
      var isFirst = true;
      this.__iterate(function(v ) {
        isFirst ? (isFirst = false) : (joined += separator);
        joined += v !== null && v !== undefined ? v.toString() : '';
      });
      return joined;
    },

    keys: function() {
      return this.__iterator(ITERATE_KEYS);
    },

    map: function(mapper, context) {
      return reify(this, mapFactory(this, mapper, context));
    },

    reduce: function(reducer, initialReduction, context) {
      assertNotInfinite(this.size);
      var reduction;
      var useFirst;
      if (arguments.length < 2) {
        useFirst = true;
      } else {
        reduction = initialReduction;
      }
      this.__iterate(function(v, k, c)  {
        if (useFirst) {
          useFirst = false;
          reduction = v;
        } else {
          reduction = reducer.call(context, reduction, v, k, c);
        }
      });
      return reduction;
    },

    reduceRight: function(reducer, initialReduction, context) {
      var reversed = this.toKeyedSeq().reverse();
      return reversed.reduce.apply(reversed, arguments);
    },

    reverse: function() {
      return reify(this, reverseFactory(this, true));
    },

    slice: function(begin, end) {
      return reify(this, sliceFactory(this, begin, end, true));
    },

    some: function(predicate, context) {
      return !this.every(not(predicate), context);
    },

    sort: function(comparator) {
      return reify(this, sortFactory(this, comparator));
    },

    values: function() {
      return this.__iterator(ITERATE_VALUES);
    },


    // ### More sequential methods

    butLast: function() {
      return this.slice(0, -1);
    },

    isEmpty: function() {
      return this.size !== undefined ? this.size === 0 : !this.some(function()  {return true});
    },

    count: function(predicate, context) {
      return ensureSize(
        predicate ? this.toSeq().filter(predicate, context) : this
      );
    },

    countBy: function(grouper, context) {
      return countByFactory(this, grouper, context);
    },

    equals: function(other) {
      return deepEqual(this, other);
    },

    entrySeq: function() {
      var iterable = this;
      if (iterable._cache) {
        // We cache as an entries array, so we can just return the cache!
        return new ArraySeq(iterable._cache);
      }
      var entriesSequence = iterable.toSeq().map(entryMapper).toIndexedSeq();
      entriesSequence.fromEntrySeq = function()  {return iterable.toSeq()};
      return entriesSequence;
    },

    filterNot: function(predicate, context) {
      return this.filter(not(predicate), context);
    },

    findLast: function(predicate, context, notSetValue) {
      return this.toKeyedSeq().reverse().find(predicate, context, notSetValue);
    },

    first: function() {
      return this.find(returnTrue);
    },

    flatMap: function(mapper, context) {
      return reify(this, flatMapFactory(this, mapper, context));
    },

    flatten: function(depth) {
      return reify(this, flattenFactory(this, depth, true));
    },

    fromEntrySeq: function() {
      return new FromEntriesSequence(this);
    },

    get: function(searchKey, notSetValue) {
      return this.find(function(_, key)  {return is(key, searchKey)}, undefined, notSetValue);
    },

    getIn: function(searchKeyPath, notSetValue) {
      var nested = this;
      // Note: in an ES6 environment, we would prefer:
      // for (var key of searchKeyPath) {
      var iter = forceIterator(searchKeyPath);
      var step;
      while (!(step = iter.next()).done) {
        var key = step.value;
        nested = nested && nested.get ? nested.get(key, NOT_SET) : NOT_SET;
        if (nested === NOT_SET) {
          return notSetValue;
        }
      }
      return nested;
    },

    groupBy: function(grouper, context) {
      return groupByFactory(this, grouper, context);
    },

    has: function(searchKey) {
      return this.get(searchKey, NOT_SET) !== NOT_SET;
    },

    hasIn: function(searchKeyPath) {
      return this.getIn(searchKeyPath, NOT_SET) !== NOT_SET;
    },

    isSubset: function(iter) {
      iter = typeof iter.contains === 'function' ? iter : Iterable(iter);
      return this.every(function(value ) {return iter.contains(value)});
    },

    isSuperset: function(iter) {
      return iter.isSubset(this);
    },

    keySeq: function() {
      return this.toSeq().map(keyMapper).toIndexedSeq();
    },

    last: function() {
      return this.toSeq().reverse().first();
    },

    max: function(comparator) {
      return maxFactory(this, comparator);
    },

    maxBy: function(mapper, comparator) {
      return maxFactory(this, comparator, mapper);
    },

    min: function(comparator) {
      return maxFactory(this, comparator ? neg(comparator) : defaultNegComparator);
    },

    minBy: function(mapper, comparator) {
      return maxFactory(this, comparator ? neg(comparator) : defaultNegComparator, mapper);
    },

    rest: function() {
      return this.slice(1);
    },

    skip: function(amount) {
      return this.slice(Math.max(0, amount));
    },

    skipLast: function(amount) {
      return reify(this, this.toSeq().reverse().skip(amount).reverse());
    },

    skipWhile: function(predicate, context) {
      return reify(this, skipWhileFactory(this, predicate, context, true));
    },

    skipUntil: function(predicate, context) {
      return this.skipWhile(not(predicate), context);
    },

    sortBy: function(mapper, comparator) {
      return reify(this, sortFactory(this, comparator, mapper));
    },

    take: function(amount) {
      return this.slice(0, Math.max(0, amount));
    },

    takeLast: function(amount) {
      return reify(this, this.toSeq().reverse().take(amount).reverse());
    },

    takeWhile: function(predicate, context) {
      return reify(this, takeWhileFactory(this, predicate, context));
    },

    takeUntil: function(predicate, context) {
      return this.takeWhile(not(predicate), context);
    },

    valueSeq: function() {
      return this.toIndexedSeq();
    },


    // ### Hashable Object

    hashCode: function() {
      return this.__hash || (this.__hash = hashIterable(this));
    },


    // ### Internal

    // abstract __iterate(fn, reverse)

    // abstract __iterator(type, reverse)
  });

  // var IS_ITERABLE_SENTINEL = '@@__IMMUTABLE_ITERABLE__@@';
  // var IS_KEYED_SENTINEL = '@@__IMMUTABLE_KEYED__@@';
  // var IS_INDEXED_SENTINEL = '@@__IMMUTABLE_INDEXED__@@';
  // var IS_ORDERED_SENTINEL = '@@__IMMUTABLE_ORDERED__@@';

  var IterablePrototype = Iterable.prototype;
  IterablePrototype[IS_ITERABLE_SENTINEL] = true;
  IterablePrototype[ITERATOR_SYMBOL] = IterablePrototype.values;
  IterablePrototype.__toJS = IterablePrototype.toArray;
  IterablePrototype.__toStringMapper = quoteString;
  IterablePrototype.inspect =
  IterablePrototype.toSource = function() { return this.toString(); };
  IterablePrototype.chain = IterablePrototype.flatMap;

  // Temporary warning about using length
  (function () {
    try {
      Object.defineProperty(IterablePrototype, 'length', {
        get: function () {
          if (!Iterable.noLengthWarning) {
            var stack;
            try {
              throw new Error();
            } catch (error) {
              stack = error.stack;
            }
            if (stack.indexOf('_wrapObject') === -1) {
              console && console.warn && console.warn(
                'iterable.length has been deprecated, '+
                'use iterable.size or iterable.count(). '+
                'This warning will become a silent error in a future version. ' +
                stack
              );
              return this.size;
            }
          }
        }
      });
    } catch (e) {}
  })();



  mixin(KeyedIterable, {

    // ### More sequential methods

    flip: function() {
      return reify(this, flipFactory(this));
    },

    findKey: function(predicate, context) {
      var entry = this.findEntry(predicate, context);
      return entry && entry[0];
    },

    findLastKey: function(predicate, context) {
      return this.toSeq().reverse().findKey(predicate, context);
    },

    keyOf: function(searchValue) {
      return this.findKey(function(value ) {return is(value, searchValue)});
    },

    lastKeyOf: function(searchValue) {
      return this.findLastKey(function(value ) {return is(value, searchValue)});
    },

    mapEntries: function(mapper, context) {var this$0 = this;
      var iterations = 0;
      return reify(this,
        this.toSeq().map(
          function(v, k)  {return mapper.call(context, [k, v], iterations++, this$0)}
        ).fromEntrySeq()
      );
    },

    mapKeys: function(mapper, context) {var this$0 = this;
      return reify(this,
        this.toSeq().flip().map(
          function(k, v)  {return mapper.call(context, k, v, this$0)}
        ).flip()
      );
    },

  });

  var KeyedIterablePrototype = KeyedIterable.prototype;
  KeyedIterablePrototype[IS_KEYED_SENTINEL] = true;
  KeyedIterablePrototype[ITERATOR_SYMBOL] = IterablePrototype.entries;
  KeyedIterablePrototype.__toJS = IterablePrototype.toObject;
  KeyedIterablePrototype.__toStringMapper = function(v, k)  {return k + ': ' + quoteString(v)};



  mixin(IndexedIterable, {

    // ### Conversion to other types

    toKeyedSeq: function() {
      return new ToKeyedSequence(this, false);
    },


    // ### ES6 Collection methods (ES6 Array and Map)

    filter: function(predicate, context) {
      return reify(this, filterFactory(this, predicate, context, false));
    },

    findIndex: function(predicate, context) {
      var entry = this.findEntry(predicate, context);
      return entry ? entry[0] : -1;
    },

    indexOf: function(searchValue) {
      var key = this.toKeyedSeq().keyOf(searchValue);
      return key === undefined ? -1 : key;
    },

    lastIndexOf: function(searchValue) {
      return this.toSeq().reverse().indexOf(searchValue);
    },

    reverse: function() {
      return reify(this, reverseFactory(this, false));
    },

    slice: function(begin, end) {
      return reify(this, sliceFactory(this, begin, end, false));
    },

    splice: function(index, removeNum /*, ...values*/) {
      var numArgs = arguments.length;
      removeNum = Math.max(removeNum | 0, 0);
      if (numArgs === 0 || (numArgs === 2 && !removeNum)) {
        return this;
      }
      index = resolveBegin(index, this.size);
      var spliced = this.slice(0, index);
      return reify(
        this,
        numArgs === 1 ?
          spliced :
          spliced.concat(arrCopy(arguments, 2), this.slice(index + removeNum))
      );
    },


    // ### More collection methods

    findLastIndex: function(predicate, context) {
      var key = this.toKeyedSeq().findLastKey(predicate, context);
      return key === undefined ? -1 : key;
    },

    first: function() {
      return this.get(0);
    },

    flatten: function(depth) {
      return reify(this, flattenFactory(this, depth, false));
    },

    get: function(index, notSetValue) {
      index = wrapIndex(this, index);
      return (index < 0 || (this.size === Infinity ||
          (this.size !== undefined && index > this.size))) ?
        notSetValue :
        this.find(function(_, key)  {return key === index}, undefined, notSetValue);
    },

    has: function(index) {
      index = wrapIndex(this, index);
      return index >= 0 && (this.size !== undefined ?
        this.size === Infinity || index < this.size :
        this.indexOf(index) !== -1
      );
    },

    interpose: function(separator) {
      return reify(this, interposeFactory(this, separator));
    },

    interleave: function(/*...iterables*/) {
      var iterables = [this].concat(arrCopy(arguments));
      var zipped = zipWithFactory(this.toSeq(), IndexedSeq.of, iterables);
      var interleaved = zipped.flatten(true);
      if (zipped.size) {
        interleaved.size = zipped.size * iterables.length;
      }
      return reify(this, interleaved);
    },

    last: function() {
      return this.get(-1);
    },

    skipWhile: function(predicate, context) {
      return reify(this, skipWhileFactory(this, predicate, context, false));
    },

    zip: function(/*, ...iterables */) {
      var iterables = [this].concat(arrCopy(arguments));
      return reify(this, zipWithFactory(this, defaultZipper, iterables));
    },

    zipWith: function(zipper/*, ...iterables */) {
      var iterables = arrCopy(arguments);
      iterables[0] = this;
      return reify(this, zipWithFactory(this, zipper, iterables));
    },

  });

  IndexedIterable.prototype[IS_INDEXED_SENTINEL] = true;
  IndexedIterable.prototype[IS_ORDERED_SENTINEL] = true;



  mixin(SetIterable, {

    // ### ES6 Collection methods (ES6 Array and Map)

    get: function(value, notSetValue) {
      return this.has(value) ? value : notSetValue;
    },

    contains: function(value) {
      return this.has(value);
    },


    // ### More sequential methods

    keySeq: function() {
      return this.valueSeq();
    },

  });

  SetIterable.prototype.has = IterablePrototype.contains;


  // Mixin subclasses

  mixin(KeyedSeq, KeyedIterable.prototype);
  mixin(IndexedSeq, IndexedIterable.prototype);
  mixin(SetSeq, SetIterable.prototype);

  mixin(KeyedCollection, KeyedIterable.prototype);
  mixin(IndexedCollection, IndexedIterable.prototype);
  mixin(SetCollection, SetIterable.prototype);


  // #pragma Helper functions

  function keyMapper(v, k) {
    return k;
  }

  function entryMapper(v, k) {
    return [k, v];
  }

  function not(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    }
  }

  function neg(predicate) {
    return function() {
      return -predicate.apply(this, arguments);
    }
  }

  function quoteString(value) {
    return typeof value === 'string' ? JSON.stringify(value) : value;
  }

  function defaultZipper() {
    return arrCopy(arguments);
  }

  function defaultNegComparator(a, b) {
    return a < b ? 1 : a > b ? -1 : 0;
  }

  function hashIterable(iterable) {
    if (iterable.size === Infinity) {
      return 0;
    }
    var ordered = isOrdered(iterable);
    var keyed = isKeyed(iterable);
    var h = ordered ? 1 : 0;
    var size = iterable.__iterate(
      keyed ?
        ordered ?
          function(v, k)  { h = 31 * h + hashMerge(hash(v), hash(k)) | 0; } :
          function(v, k)  { h = h + hashMerge(hash(v), hash(k)) | 0; } :
        ordered ?
          function(v ) { h = 31 * h + hash(v) | 0; } :
          function(v ) { h = h + hash(v) | 0; }
    );
    return murmurHashOfSize(size, h);
  }

  function murmurHashOfSize(size, h) {
    h = src_Math__imul(h, 0xCC9E2D51);
    h = src_Math__imul(h << 15 | h >>> -15, 0x1B873593);
    h = src_Math__imul(h << 13 | h >>> -13, 5);
    h = (h + 0xE6546B64 | 0) ^ size;
    h = src_Math__imul(h ^ h >>> 16, 0x85EBCA6B);
    h = src_Math__imul(h ^ h >>> 13, 0xC2B2AE35);
    h = smi(h ^ h >>> 16);
    return h;
  }

  function hashMerge(a, b) {
    return a ^ b + 0x9E3779B9 + (a << 6) + (a >> 2) | 0; // int
  }

  var Immutable = {

    Iterable: Iterable,

    Seq: Seq,
    Collection: Collection,
    Map: src_Map__Map,
    OrderedMap: OrderedMap,
    List: List,
    Stack: Stack,
    Set: src_Set__Set,
    OrderedSet: OrderedSet,

    Record: Record,
    Range: Range,
    Repeat: Repeat,

    is: is,
    fromJS: fromJS,

  };

  return Immutable;

}));
},{}],4:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule invariant
 */

"use strict";

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var invariant = function(condition, format, a, b, c, d, e, f) {
  if ("production" !== process.env.NODE_ENV) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment ' +
        'for the full error message and additional helpful warnings.'
      );
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(
        'Invariant Violation: ' +
        format.replace(/%s/g, function() { return args[argIndex++]; })
      );
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

module.exports = invariant;

}).call(this,require('_process'))

},{"_process":2}],5:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule keyMirror
 * @typechecks static-only
 */

"use strict";

var invariant = require("./invariant");

/**
 * Constructs an enumeration with keys equal to their value.
 *
 * For example:
 *
 *   var COLORS = keyMirror({blue: null, red: null});
 *   var myColor = COLORS.blue;
 *   var isColorValid = !!COLORS[myColor];
 *
 * The last line could not be performed if the values of the generated enum were
 * not equal to their keys.
 *
 *   Input:  {key1: val1, key2: val2}
 *   Output: {key1: key1, key2: key2}
 *
 * @param {object} obj
 * @return {object}
 */
var keyMirror = function(obj) {
  var ret = {};
  var key;
  ("production" !== process.env.NODE_ENV ? invariant(
    obj instanceof Object && !Array.isArray(obj),
    'keyMirror(...): Argument must be an object.'
  ) : invariant(obj instanceof Object && !Array.isArray(obj)));
  for (key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue;
    }
    ret[key] = key;
  }
  return ret;
};

module.exports = keyMirror;

}).call(this,require('_process'))

},{"./invariant":4,"_process":2}],6:[function(require,module,exports){
"use strict";
'use strict';
var _ = require('lodash');
var Dispatcher = require('../dispatcher');
var apiSubscriptionSrvc = require('../services/index').apiSubscriptions;
module.exports = (function() {
  var Actions = function Actions() {
    this._dispatcher = Dispatcher;
  };
  return ($traceurRuntime.createClass)(Actions, {
    _makePayload: function(action, syncState, data) {
      return {
        actionType: action,
        syncState: syncState,
        data: data
      };
    },
    _getPhysicalChannels: function(channels, methods) {
      return _.flatten(channels.map(function(channel) {
        return methods.map(function(method) {
          return method + ' ' + channel;
        });
      }));
    },
    _subscribe: function(channels, methods, handler, options) {
      if (_.isString(channels)) {
        channels = [channels];
      }
      if (!_.isArray(methods)) {
        throw new Error('methods argument must be array of HTTP methods');
      }
      _.each(this._getPhysicalChannels(channels, methods), function(channel) {
        apiSubscriptionSrvc.subscribe(channel, handler, options);
      });
    },
    _unsubscribe: function(channels, methods, handler) {
      if (_.isString(channels)) {
        channels = [channels];
      }
      if (!_.isArray(methods)) {
        throw new Error('methods argument must be array of HTTP methods');
      }
      _.each(this._getPhysicalChannels(channels, methods), function(channel) {
        apiSubscriptionSrvc.unsubscribe(channel, handler);
      });
    },
    _normalizeChannelName: function(channel) {
      return apiSubscriptionSrvc.normalizeChannelName(channel);
    },
    _checkDispatchArgs: function(action, syncState) {
      if (action === undefined) {
        throw new Error("action argument value of undefined passed to dispatchUserAction.  You're most likely referencing an invalid Action constant (constants/actions.js).");
      }
      if (syncState === undefined) {
        throw new Error("syncState argument value of undefined passed to dispatchUserAction.  You're most likely referencing an invalid State constant (constants/state.js).");
      }
    },
    dispatchServerAction: function(action, syncState, data) {
      this._checkDispatchArgs(action, syncState);
      try {
        this._dispatcher.handleServerAction(this._makePayload(action, syncState, data));
      } catch (err) {
        console.error(err.stack);
      }
    },
    dispatchViewAction: function(action, syncState, data) {
      this._checkDispatchArgs(action, syncState);
      try {
        this._dispatcher.handleViewAction(this._makePayload(action, syncState, data));
      } catch (err) {
        console.log(err.stack);
      }
    }
  }, {});
}());


//# sourceURL=/Users/hburrows/dev/heroku/react-flux-starter/public/javascripts/actions/base.js
},{"../dispatcher":25,"../services/index":30,"lodash":"lodash"}],7:[function(require,module,exports){
"use strict";
'use strict';
var _ = require('lodash');
var uuid = require('node-uuid');
var kActions = require('../constants/actions');
var kStates = require('../constants/states');
var ajax = require('../common/ajax');
var meteredGET = require('../common/metered-request').get;
var BaseAction = require('./base');
var CRUDBase = function CRUDBase(baseURL, actionObjectId) {
  $traceurRuntime.superConstructor($CRUDBase).call(this);
  this.baseURL = baseURL;
  this.actionObjectId = actionObjectId;
  _.bindAll(this, '_onPostEvent', '_onPutEvent', '_onDeleteEvent');
};
var $CRUDBase = CRUDBase;
($traceurRuntime.createClass)(CRUDBase, {
  _actionForMethod: function(method) {
    return kActions[this.actionObjectId + '_' + method];
  },
  getAll: function() {
    var $__0 = this;
    var action = this._actionForMethod('GETALL');
    meteredGET(this.baseURL, (function() {
      return $__0.dispatchServerAction(action, kStates.LOADING);
    }), (function(data) {
      return $__0.dispatchServerAction(action, kStates.SYNCED, data);
    }), (function(err) {
      return $__0.dispatchServerAction(action, kStates.ERRORED, err);
    }));
  },
  post: function(payload) {
    var action = this._actionForMethod('POST');
    payload.id = uuid.v1();
    ajax({
      url: this.baseURL,
      type: "POST",
      data: payload,
      accepts: {
        'json': "application/json",
        'text': 'text/plain'
      }
    }).then(function(data) {
      this.dispatchServerAction(action, kStates.SYNCED, data);
    }.bind(this)).catch(function(err) {
      this.dispatchServerAction(action, kStates.ERRORED, err);
    }.bind(this));
    this.dispatchServerAction(action, kStates.NEW, payload);
    return payload.id;
  },
  get: function(id) {
    var $__0 = this;
    var action = this._actionForMethod('GETONE');
    meteredGET((this.baseURL + "/" + id), (function() {
      return $__0.dispatchServerAction(action, kStates.LOADING, {id: id});
    }), (function(data) {
      return $__0.dispatchServerAction(action, kStates.SYNCED, data);
    }), (function(err) {
      return $__0.dispatchServerAction(action, kStates.ERRORED, err);
    }));
  },
  put: function(id, payload) {
    var action = this._actionForMethod('PUT');
    ajax({
      url: (this.baseURL + "/" + id),
      type: "PUT",
      data: payload,
      accepts: {
        'json': "application/json",
        'text': 'text/plain'
      }
    }).then(function(data) {
      this.dispatchServerAction(action, kStates.SYNCED, data);
    }.bind(this)).catch(function(err) {
      this.dispatchServerAction(action, kStates.ERRORED, err);
    }.bind(this));
    this.dispatchServerAction(action, kStates.SAVING, payload);
  },
  delete: function(id) {
    var action = this._actionForMethod('DELETE');
    ajax({
      url: (this.baseURL + "/" + id),
      type: "DELETE",
      accepts: {
        'json': "application/json",
        'text': 'text/plain'
      }
    }).then(function(data) {
      this.dispatchServerAction(action, kStates.SYNCED, data);
    }.bind(this)).catch(function(err) {
      this.dispatchServerAction(action, kStates.ERRORED, err);
    }.bind(this));
    this.dispatchServerAction(action, kStates.DELETING, {id: id});
  },
  _onPostEvent: function(event, channel, data) {
    this.dispatchServerAction(this._actionForMethod('POST'), kStates.SYNCED, {
      subscription: this._normalizeChannelName(channel),
      id: data.id,
      data: data
    });
  },
  _onPutEvent: function(event, channel, data) {
    this.dispatchServerAction(this._actionForMethod('PUT'), kStates.SYNCED, {
      subscription: this._normalizeChannelName(channel),
      id: data.id,
      data: data
    });
  },
  _onDeleteEvent: function(event, channel) {
    var re = new RegExp((this.baseURL + "/(.+)$")),
        id = re.exec(channel)[1];
    this.dispatchServerAction(this._actionForMethod('DELETE'), kStates.SYNCED, {
      subscription: this._normalizeChannelName(channel),
      id: id
    });
  },
  subscribeList: function() {
    this._subscribe(this.baseURL, ['POST'], this._onPostEvent);
  },
  unsubscribeList: function() {
    this._unsubscribe(this.baseURL, ['POST'], this._onPostEvent);
  },
  subscribeResources: function(ids) {
    var $__0 = this;
    if (!_.isArray(ids)) {
      ids = [ids];
    }
    var channels = _.map(ids, (function(id) {
      return ($__0.baseURL + "/" + id);
    }));
    this._subscribe(channels, ['PUT'], this._onPutEvent);
    this._subscribe(channels, ['DELETE'], this._onDeleteEvent);
  },
  unsubscribeResources: function(ids) {
    var $__0 = this;
    if (!_.isArray(ids)) {
      ids = [ids];
    }
    var channels = _.map(ids, (function(id) {
      return ($__0.baseURL + "/" + id);
    }));
    this._unsubscribe(channels, ['PUT'], this._onPutEvent);
    this._unsubscribe(channels, ['DELETE'], this._onDeleteEvent);
  }
}, {}, BaseAction);
module.exports = CRUDBase;


//# sourceURL=/Users/hburrows/dev/heroku/react-flux-starter/public/javascripts/actions/crud-base.js
},{"../common/ajax":11,"../common/metered-request":13,"../constants/actions":23,"../constants/states":24,"./base":6,"lodash":"lodash","node-uuid":"node-uuid"}],8:[function(require,module,exports){
"use strict";
'use strict';
var CRUDBase = require('./crud-base');
var ItemActions = function ItemActions() {
  $traceurRuntime.superConstructor($ItemActions).call(this, '/api/items', 'ITEM');
};
var $ItemActions = ItemActions;
($traceurRuntime.createClass)(ItemActions, {
  post: function(first, last) {
    var data = {
      first: first,
      last: last
    };
    return $traceurRuntime.superGet(this, $ItemActions.prototype, "post").call(this, data);
  },
  put: function(id, first, last) {
    var data = {
      id: id,
      first: first,
      last: last
    };
    $traceurRuntime.superGet(this, $ItemActions.prototype, "put").call(this, id, data);
  }
}, {}, CRUDBase);
module.exports = new ItemActions();


//# sourceURL=/Users/hburrows/dev/heroku/react-flux-starter/public/javascripts/actions/items.js
},{"./crud-base":7}],9:[function(require,module,exports){
(function (process){
"use strict";
'use strict';
var React = require('react/addons');
var Actions = require('./base');
var kActions = require('../constants/actions'),
    kStates = require('../constants/states');
var OverlaysActions = function OverlaysActions() {
  $traceurRuntime.superConstructor($OverlaysActions).apply(this, arguments);
};
var $OverlaysActions = OverlaysActions;
($traceurRuntime.createClass)(OverlaysActions, {
  push: function(component) {
    var that = this;
    return new Promise(function(resolve) {
      process.nextTick(function() {
        that.dispatchViewAction(kActions.OVERLAY_PUSH, kStates.SYNCED, {component: component});
        resolve();
      });
    });
  },
  pop: function() {
    this.dispatchViewAction(kActions.OVERLAY_POP, kStates.SYNCED, null);
  },
  alert: function(title, msg, ackCallback) {
    var alertOverlay = React.createFactory(require('../components/overlays/alert.jsx'));
    return this.push(alertOverlay({
      title: title,
      msg: msg,
      ackCallback: ackCallback
    }, null));
  },
  info: function(msg, title) {
    return this.alert(title || 'Info', msg);
  },
  error: function(msg, title) {
    return this.alert(title || 'Error', msg);
  },
  warn: function(msg, title) {
    return this.alert(title || 'Warning', msg);
  },
  confirm: function(title, msg, yesCallback, noCallback) {
    var confirmOverlay = React.createFactory(require('../components/overlays/confirm.jsx'));
    return this.push(confirmOverlay({
      title: title,
      msg: msg,
      yesCallback: yesCallback,
      noCallback: noCallback
    }, null));
  }
}, {}, Actions);
module.exports = new OverlaysActions();


//# sourceURL=/Users/hburrows/dev/heroku/react-flux-starter/public/javascripts/actions/overlays.js
}).call(this,require('_process'))

},{"../components/overlays/alert.jsx":17,"../components/overlays/confirm.jsx":18,"../constants/actions":23,"../constants/states":24,"./base":6,"_process":2,"react/addons":"react/addons"}],10:[function(require,module,exports){
"use strict";
'use strict';
var _ = require('lodash');
var kActions = require('../constants/actions');
var kStates = require('../constants/states');
var meteredGET = require('../common/metered-request').get;
var BaseAction = require('./base');
var ItemActions = function ItemActions() {
  $traceurRuntime.superConstructor($ItemActions).call(this);
  _.bindAll(this, '_onPut');
};
var $ItemActions = ItemActions;
($traceurRuntime.createClass)(ItemActions, {
  getTime: function() {
    var $__0 = this;
    meteredGET('/api/servertime', (function() {
      return $__0.dispatchServerAction(kActions.SERVERTIME_GET, kStates.LOADING);
    }), (function(data) {
      return $__0.dispatchServerAction(kActions.SERVERTIME_GET, kStates.SYNCED, data);
    }), (function(err) {
      return $__0.dispatchServerAction(kActions.SERVERTIME_GET, kStates.ERRORED, err);
    }));
  },
  _onPut: function(event, channel, data) {
    this.dispatchServerAction(kActions.SERVERTIME_PUT, kStates.SYNCED, data);
  },
  subscribe: function() {
    var channels = ['/api/servertime'];
    this._subscribe(channels, ['PUT'], this._onPut);
  },
  unsubscribe: function() {
    var channels = ['/api/servertime'];
    this._unsubscribe(channels, ['PUT'], this._onPut);
  }
}, {}, BaseAction);
module.exports = new ItemActions();


//# sourceURL=/Users/hburrows/dev/heroku/react-flux-starter/public/javascripts/actions/server-time.js
},{"../common/metered-request":13,"../constants/actions":23,"../constants/states":24,"./base":6,"lodash":"lodash"}],11:[function(require,module,exports){
"use strict";
'use strict';
var $ = require('jquery');
var HTTPError = require('./http-error');
module.exports = function(opts) {
  var promise = new Promise(function(resolve, reject) {
    $.ajax(opts).done(function(data) {
      resolve(data);
    }).fail(function(xhr, status, err) {
      var response;
      if (xhr.status === 0 && xhr.responseText === undefined) {
        response = {detail: 'Possible CORS error; check your browser console for further details'};
      } else {
        response = xhr.responseJSON;
      }
      reject(new HTTPError(opts.url, xhr, status, err, response));
    });
  });
  return promise;
};


//# sourceURL=/Users/hburrows/dev/heroku/react-flux-starter/public/javascripts/common/ajax.js
},{"./http-error":12,"jquery":"jquery"}],12:[function(require,module,exports){
"use strict";
'use strict';
var HTTPError = function HTTPError(url, xhr, status, err, response) {
  this.url = url;
  this.xhr = xhr;
  this.status = status;
  this.error = err;
  this.response = response;
};
($traceurRuntime.createClass)(HTTPError, {toString: function() {
    return (this.constructor.name + " (status=" + this.xhr.status + ", url=" + this.url + ")");
  }}, {}, Error);
module.exports = HTTPError;


//# sourceURL=/Users/hburrows/dev/heroku/react-flux-starter/public/javascripts/common/http-error.js
},{}],13:[function(require,module,exports){
(function (process){
"use strict";
'use strict';
var _ = require('lodash');
var ajax = require('./ajax');
var _inFlightRequests = {};
module.exports = {get: function(settings, startHdlr, resolveHdlr, rejectHdlr, apiOpts) {
    var url;
    var promise;
    if (_.isString(settings)) {
      url = settings;
      settings = {
        url: url,
        contentType: 'application/json',
        type: 'GET'
      };
    } else {
      url = settings.url;
      settings = _.extend({}, settings, {
        contentType: 'application/json',
        type: 'GET'
      });
    }
    if (!_.isString(url)) {
      throw new Error('metered-request::get - URL argument is not a string');
    }
    if (url in _inFlightRequests) {
      promise = _inFlightRequests[url];
      promise._isNew = false;
      return promise;
    }
    promise = new Promise(function(resolve, reject) {
      process.nextTick(function() {
        ajax(settings, apiOpts).then(function(data) {
          delete _inFlightRequests[url];
          resolveHdlr(data);
          resolve(data);
        }, function(err) {
          delete _inFlightRequests[url];
          rejectHdlr(err);
          reject(err);
        });
        startHdlr();
      });
    });
    promise.catch(function() {});
    promise._isNew = true;
    _inFlightRequests[url] = promise;
    return promise;
  }};


//# sourceURL=/Users/hburrows/dev/heroku/react-flux-starter/public/javascripts/common/metered-request.js
}).call(this,require('_process'))

},{"./ajax":11,"_process":2,"lodash":"lodash"}],14:[function(require,module,exports){
"use strict";
'use strict';
var $ = require('jquery');
window.jQuery = $;
require('bootstrap');
var React = require('react/addons');
var Router = require('react-router'),
    RouteHandler = Router.RouteHandler;
var NavBar = require('./nav-bar.jsx'),
    OverlayManager = require('./overlays/overlay-manager.jsx');
module.exports = React.createClass({
  displayName: "exports",
  mixins: [Router.State],
  render: function() {
    return (React.createElement("div", null, React.createElement(NavBar, null), React.createElement(RouteHandler, null), React.createElement(OverlayManager, null)));
  }
});


//# sourceURL=/Users/hburrows/dev/heroku/react-flux-starter/public/javascripts/components/app.jsx
},{"./nav-bar.jsx":16,"./overlays/overlay-manager.jsx":20,"bootstrap":"bootstrap","jquery":"jquery","react-router":"react-router","react/addons":"react/addons"}],15:[function(require,module,exports){
"use strict";
'use strict';
var _ = require('lodash');
var React = require('react/addons');
var Stores = require('../stores'),
    storeChangeMixin = require('../mixins/store-change');
var kStates = require('../constants/states');
var ItemActions = require('../actions/items');
var Overlays = require('../actions/overlays');
module.exports = React.createClass({
  displayName: "exports",
  mixins: [storeChangeMixin(Stores.ItemsStore), React.addons.PureRenderMixin],
  getInitialState: function() {
    return {
      items: Stores.ItemsStore.getAll(),
      selection: null
    };
  },
  storeChange: function() {
    this.setState({items: Stores.ItemsStore.getAll()});
  },
  render: function() {
    var $__0 = this;
    var content;
    if (!this.state.items) {
      content = React.createElement("div", null, "Loading...");
    } else {
      content = (React.createElement("table", {className: "table"}, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "First Name"), React.createElement("th", null, "Last Name"), React.createElement("th", null, "Id"))), React.createElement("tbody", null, _.map(this.state.items, (function(item) {
        return React.createElement("tr", {
          key: item.data.id,
          className: $__0.state.selection === item.data.id ? 'active' : '',
          style: {
            color: _.contains([kStates.NEW, kStates.SAVING, kStates.DELETING], item.state) ? '#ccc' : 'inherit',
            textDecoration: item.state === kStates.DELETING ? 'line-through' : 'none'
          },
          onClick: $__0._onClick.bind($__0, item.data.id)
        }, React.createElement("td", null, item.data.first), React.createElement("td", null, item.data.last), React.createElement("td", null, item.data.id));
      })))));
    }
    return (React.createElement("div", {className: "container-fluid"}, React.createElement("div", {className: "row"}, React.createElement("div", {className: "col-xs-12"}, React.createElement("header", null, React.createElement("h3", {style: {
        display: 'inline-block',
        marginTop: '0'
      }}, "Items"), React.createElement("button", {
      type: "button",
      className: "btn btn-default pull-right",
      disabled: !this.state.selection,
      onClick: this._onDelete
    }, React.createElement("span", {className: "glyphicon glyphicon-trash"})), React.createElement("button", {
      type: "button",
      className: "btn btn-default pull-right",
      disabled: !this.state.selection,
      onClick: this._onUpdate
    }, React.createElement("span", {className: "glyphicon glyphicon-pencil"})), React.createElement("button", {
      type: "button",
      className: "btn btn-default pull-right",
      onClick: this._onAdd
    }, React.createElement("span", {className: "glyphicon glyphicon-plus"})))), React.createElement("div", {className: "col-xs-12"}, content))));
  },
  _onClick: function(id) {
    this.setState({selection: id});
  },
  _onAdd: function() {
    var $__0 = this;
    var overlay = React.createFactory(require('./overlays/item-form.jsx'));
    Overlays.push(overlay({okCallback: (function(firstName, lastName) {
        var id = ItemActions.post(firstName, lastName);
        $__0.setState({selection: id});
        console.log(("create new item #" + id));
      })}, null));
  },
  _onUpdate: function() {
    var $__0 = this;
    var item = Stores.ItemsStore.get(this.state.selection);
    var overlay = React.createFactory(require('./overlays/item-form.jsx'));
    return Overlays.push(overlay({
      firstName: item.data.first,
      lastName: item.data.last,
      okCallback: (function(firstName, lastName) {
        return ItemActions.put($__0.state.selection, firstName, lastName);
      })
    }, null));
  },
  _onDelete: function() {
    ItemActions.delete(this.state.selection);
    this.setState({selection: null});
  }
});


//# sourceURL=/Users/hburrows/dev/heroku/react-flux-starter/public/javascripts/components/items.jsx
},{"../actions/items":8,"../actions/overlays":9,"../constants/states":24,"../mixins/store-change":27,"../stores":33,"./overlays/item-form.jsx":19,"lodash":"lodash","react/addons":"react/addons"}],16:[function(require,module,exports){
"use strict";
'use strict';
var React = require('react/addons');
var Router = require('react-router'),
    Link = Router.Link;
module.exports = React.createClass({
  displayName: "exports",
  mixins: [Router.State],
  render: function() {
    return (React.createElement("nav", {className: "navbar navbar-default"}, React.createElement("div", {className: "container-fluid"}, React.createElement("div", {className: "navbar-header"}, React.createElement("button", {
      type: "button",
      className: "navbar-toggle collapsed",
      "data-toggle": "collapse",
      "data-target": "#bs-example-navbar-collapse-1"
    }, React.createElement("span", {className: "sr-only"}, "Toggle navigation"), React.createElement("span", {className: "icon-bar"}), React.createElement("span", {className: "icon-bar"}), React.createElement("span", {className: "icon-bar"})), React.createElement(Link, {
      to: "root",
      className: "navbar-brand"
    }, window.EX.const.title)), React.createElement("div", {
      className: "collapse navbar-collapse",
      id: "bs-example-navbar-collapse-1"
    }, React.createElement("ul", {className: "nav navbar-nav"}, React.createElement("li", {className: this.isActive('items') ? "active" : ''}, React.createElement(Link, {to: "items"}, "Items")), React.createElement("li", {className: this.isActive('server-time') ? "active" : ''}, React.createElement(Link, {to: "server-time"}, "Server-Time")))))));
  }
});


//# sourceURL=/Users/hburrows/dev/heroku/react-flux-starter/public/javascripts/components/nav-bar.jsx
},{"react-router":"react-router","react/addons":"react/addons"}],17:[function(require,module,exports){
"use strict";
'use strict';
var _ = require('lodash');
var React = require('react/addons');
var OverlayMixin = require('../../mixins/overlay');
module.exports = React.createClass({
  displayName: "exports",
  mixins: [OverlayMixin],
  render: function() {
    var content;
    if (_.isString(this.props.msg)) {
      content = (React.createElement("p", null, this.props.msg));
    } else {
      content = this.props.msg;
    }
    return (React.createElement("div", {className: "modal fade"}, React.createElement("div", {className: "modal-dialog"}, React.createElement("div", {className: "modal-content"}, React.createElement("div", {className: "modal-header"}, React.createElement("button", {
      type: "button",
      className: "close",
      "data-dismiss": "modal"
    }, React.createElement("span", {"aria-hidden": "true"}, "×"), React.createElement("span", {className: "sr-only"}, "Close")), React.createElement("h4", {className: "modal-title"}, this.props.title || 'Alert')), React.createElement("div", {className: "modal-body"}, content), React.createElement("div", {className: "modal-footer"}, React.createElement("button", {
      type: "button",
      className: "btn btn-primary",
      onClick: this.handleOK
    }, "OK"))))));
  },
  handleModalHidden: function() {
    if (this.props.ackCallback) {
      this.props.ackCallback();
    }
  },
  handleOK: function() {
    this.hideModal();
  }
});


//# sourceURL=/Users/hburrows/dev/heroku/react-flux-starter/public/javascripts/components/overlays/alert.jsx
},{"../../mixins/overlay":26,"lodash":"lodash","react/addons":"react/addons"}],18:[function(require,module,exports){
"use strict";
'use strict';
var _ = require('lodash');
var React = require('react/addons');
var OverlayMixin = require('../../mixins/overlay');
module.exports = React.createClass({
  displayName: "exports",
  mixins: [OverlayMixin],
  render: function() {
    var content;
    if (_.isString(this.props.msg)) {
      content = (React.createElement("p", null, this.props.msg));
    } else {
      content = this.props.msg;
    }
    return (React.createElement("div", {className: "modal fade"}, React.createElement("div", {className: "modal-dialog"}, React.createElement("div", {className: "modal-content"}, React.createElement("div", {className: "modal-header"}, React.createElement("button", {
      type: "button",
      className: "close",
      "data-dismiss": "modal"
    }, React.createElement("span", {"aria-hidden": "true"}, "×"), React.createElement("span", {className: "sr-only"}, "Close")), React.createElement("h4", {className: "modal-title"}, this.props.title || 'Confirm')), React.createElement("div", {className: "modal-body"}, content), React.createElement("div", {className: "modal-footer"}, React.createElement("button", {
      type: "button",
      className: "btn btn-default",
      onClick: this._handleNo
    }, "No"), React.createElement("button", {
      type: "button",
      className: "btn btn-primary",
      onClick: this._handleYes
    }, "Yes"))))));
  },
  handleModalHidden: function() {
    if (this.confirmed) {
      if (this.props.yesCallback) {
        this.props.yesCallback();
      }
    } else {
      if (this.props.noCallback) {
        this.props.noCallback();
      }
    }
  },
  _handleYes: function() {
    this.confirmed = true;
    this.hideModal();
  },
  _handleNo: function() {
    this.hideModal();
  }
});


//# sourceURL=/Users/hburrows/dev/heroku/react-flux-starter/public/javascripts/components/overlays/confirm.jsx
},{"../../mixins/overlay":26,"lodash":"lodash","react/addons":"react/addons"}],19:[function(require,module,exports){
"use strict";
'use strict';
var React = require('react/addons');
var OverlayMixin = require('../../mixins/overlay');
module.exports = React.createClass({
  displayName: "exports",
  mixins: [OverlayMixin, React.addons.LinkedStateMixin],
  getInitialState: function() {
    return {
      firstName: this.props.firstName || '',
      lastName: this.props.lastName || ''
    };
  },
  render: function() {
    return (React.createElement("div", {className: "modal fade"}, React.createElement("div", {className: "modal-dialog"}, React.createElement("div", {className: "modal-content"}, React.createElement("div", {className: "modal-header"}, React.createElement("button", {
      type: "button",
      className: "close",
      "data-dismiss": "modal"
    }, React.createElement("span", {"aria-hidden": "true"}, "×"), React.createElement("span", {className: "sr-only"}, "Close")), React.createElement("h4", {className: "modal-title"}, "Add New Item")), React.createElement("div", {className: "modal-body"}, React.createElement("form", null, React.createElement("div", {className: "form-group"}, React.createElement("label", {htmlFor: "firstname"}, "First Name"), React.createElement("input", {
      ref: "firstName",
      type: "text",
      className: "form-control",
      id: "firstname",
      placeholder: "First name",
      valueLink: this.linkState('firstName')
    })), React.createElement("div", {className: "form-group"}, React.createElement("label", {htmlFor: "lastname"}, "Last Name"), React.createElement("input", {
      type: "text",
      className: "form-control",
      id: "lastname",
      placeholder: "Last name",
      valueLink: this.linkState('lastName')
    })))), React.createElement("div", {className: "modal-footer"}, React.createElement("button", {
      type: "button",
      className: "btn btn-default",
      onClick: this._handleCancel
    }, "Cancel"), React.createElement("button", {
      type: "button",
      className: "btn btn-primary",
      onClick: this._handleAdd
    }, "OK"))))));
  },
  handleModalShown: function() {
    this.refs.firstName.getDOMNode().focus();
  },
  handleModalHidden: function() {
    if (this.confirmed) {
      if (this.props.okCallback) {
        this.props.okCallback(this.state.firstName, this.state.lastName);
      }
    } else {
      if (this.props.cancelCallback) {
        this.props.cancelCallback();
      }
    }
  },
  _handleAdd: function() {
    this.confirmed = true;
    this.hideModal();
  },
  _handleCancel: function() {
    this.hideModal();
  }
});


//# sourceURL=/Users/hburrows/dev/heroku/react-flux-starter/public/javascripts/components/overlays/item-form.jsx
},{"../../mixins/overlay":26,"react/addons":"react/addons"}],20:[function(require,module,exports){
"use strict";
'use strict';
var React = require('react/addons');
var Stores = require('../../stores'),
    storeChangeMixin = require('../../mixins/store-change');
module.exports = React.createClass({
  displayName: "exports",
  mixins: [storeChangeMixin(Stores.OverlaysStore)],
  storeChange: function() {
    this.forceUpdate();
  },
  render: function() {
    var overlay = Stores.OverlaysStore.getTopOverlay();
    if (!overlay) {
      return null;
    }
    return overlay;
  }
});


//# sourceURL=/Users/hburrows/dev/heroku/react-flux-starter/public/javascripts/components/overlays/overlay-manager.jsx
},{"../../mixins/store-change":27,"../../stores":33,"react/addons":"react/addons"}],21:[function(require,module,exports){
"use strict";
'use strict';
var React = require('react/addons');
module.exports = React.createClass({
  displayName: "exports",
  render: function() {
    return (React.createElement("div", {className: "container-fluid"}, React.createElement("div", {className: "row"}, React.createElement("div", {className: "col-xs-12"}, "Route Not Found"))));
  }
});


//# sourceURL=/Users/hburrows/dev/heroku/react-flux-starter/public/javascripts/components/route-not-found.jsx
},{"react/addons":"react/addons"}],22:[function(require,module,exports){
"use strict";
'use strict';
var React = require('react/addons');
var Stores = require('../stores'),
    storeChangeMixin = require('../mixins/store-change');
var ServerTimeActions = require('../actions/server-time');
module.exports = React.createClass({
  displayName: "exports",
  mixins: [storeChangeMixin(Stores.ServerTimeStore), React.addons.PureRenderMixin],
  getInitialState: function() {
    return {time: Stores.ServerTimeStore.getServerTime()};
  },
  storeChange: function() {
    this.setState({time: Stores.ServerTimeStore.getServerTime()});
  },
  componentDidMount: function() {
    ServerTimeActions.subscribe();
  },
  componentWillUnmount: function() {
    ServerTimeActions.unsubscribe();
  },
  render: function() {
    var content;
    if (!this.state.time) {
      content = React.createElement("div", null, "Unknown");
    } else {
      content = React.createElement("div", null, this.state.time.data);
    }
    return (React.createElement("div", {className: "container-fluid"}, React.createElement("div", {className: "row"}, React.createElement("div", {className: "col-xs-12"}, React.createElement("h3", null, "Server Time")), React.createElement("div", {className: "col-xs-12"}, content))));
  }
});


//# sourceURL=/Users/hburrows/dev/heroku/react-flux-starter/public/javascripts/components/server-time.jsx
},{"../actions/server-time":10,"../mixins/store-change":27,"../stores":33,"react/addons":"react/addons"}],23:[function(require,module,exports){
"use strict";
'use strict';
var keyMirror = require('react/lib/keyMirror');
module.exports = keyMirror({
  ITEM_GETALL: null,
  ITEM_GETONE: null,
  ITEM_POST: null,
  ITEM_PUT: null,
  ITEM_DELETE: null,
  SERVERTIME_GET: null,
  SERVERTIME_PUT: null,
  OVERLAY_PUSH: null,
  OVERLAY_POP: null
});


//# sourceURL=/Users/hburrows/dev/heroku/react-flux-starter/public/javascripts/constants/actions.js
},{"react/lib/keyMirror":5}],24:[function(require,module,exports){
"use strict";
'use strict';
var keyMirror = require('react/lib/keyMirror');
module.exports = keyMirror({
  SYNCED: null,
  LOADING: null,
  NEW: null,
  SAVING: null,
  DELETING: null,
  ERRORED: null
});


//# sourceURL=/Users/hburrows/dev/heroku/react-flux-starter/public/javascripts/constants/states.js
},{"react/lib/keyMirror":5}],25:[function(require,module,exports){
"use strict";
'use strict';
var _ = require('lodash');
var Dispatcher = require('./vendor/flux/Dispatcher');
module.exports = _.extend(new Dispatcher(), {
  handleViewAction: function(action) {
    this.dispatch({
      source: 'VIEW_ACTION',
      action: action
    });
  },
  handleServerAction: function(action) {
    this.dispatch({
      source: 'SERVER_ACTION',
      action: action
    });
  }
});


//# sourceURL=/Users/hburrows/dev/heroku/react-flux-starter/public/javascripts/dispatcher.js
},{"./vendor/flux/Dispatcher":37,"lodash":"lodash"}],26:[function(require,module,exports){
"use strict";
'use strict';
var $ = require('jquery');
var Overlays = require('../actions/overlays');
module.exports = {
  componentDidMount: function() {
    var $node = $(this.getDOMNode());
    $node.on('shown.bs.modal', this._handleModalShown);
    $node.on('hidden.bs.modal', this._handleModalHidden);
    $(document).on('keyup', this._handleKeyUp);
    $node.modal({
      backdrop: 'static',
      keyboard: true
    });
  },
  componentWillUnmount: function() {
    var $node = $(this.getDOMNode());
    $node.off('hidden.bs.modal', this._handleModalHidden);
    $node.off('hidden.bs.modal', this._handleModalShown);
    $(document).off('keyup', this._handleKeyUp);
  },
  hideModal: function() {
    $(this.getDOMNode()).modal('hide');
  },
  _handleModalShown: function() {
    if (this.handleModalShown) {
      this.handleModalShown();
    }
  },
  _handleModalHidden: function() {
    if (this.handleModalHidden) {
      this.handleModalHidden();
    }
    Overlays.pop();
  },
  _handleKeyUp: function(e) {
    if (e.keyCode === 27) {
      this.hideModal();
    }
  }
};


//# sourceURL=/Users/hburrows/dev/heroku/react-flux-starter/public/javascripts/mixins/overlay.js
},{"../actions/overlays":9,"jquery":"jquery"}],27:[function(require,module,exports){
"use strict";
'use strict';
var _ = require('lodash');
var StoreChangeMixin = function() {
  var args = Array.prototype.slice.call(arguments);
  return {
    componentWillMount: function() {
      if (!_.isFunction(this.storeChange)) {
        throw new Error('StoreChangeMixin requires storeChange handler');
      }
      _.each(args, function(store) {
        store.addChangeListener(this.storeChange);
      }, this);
    },
    componentWillUnmount: function() {
      _.each(args, function(store) {
        store.removeChangeListener(this.storeChange);
      }, this);
    }
  };
};
StoreChangeMixin.componentWillMount = function() {
  throw new Error("StoreChangeMixin is a function that takes one or more " + "store names as parameters and returns the mixin, e.g.: " + "mixins[StoreChangeMixin(store1, store2)]");
};
module.exports = StoreChangeMixin;


//# sourceURL=/Users/hburrows/dev/heroku/react-flux-starter/public/javascripts/mixins/store-change.js
},{"lodash":"lodash"}],28:[function(require,module,exports){
"use strict";
'use strict';
var React = require('react/addons');
var Router = require('react-router'),
    Route = Router.Route,
    NotFoundRoute = Router.NotFoundRoute,
    DefaultRoute = Router.Route;
module.exports = (React.createElement(Route, {
  name: "root",
  path: "/",
  handler: require('./components/app.jsx')
}, React.createElement(DefaultRoute, {
  name: "items",
  path: "/",
  handler: require('./components/items.jsx')
}), React.createElement(Route, {
  name: "server-time",
  handler: require('./components/server-time.jsx')
}), React.createElement(NotFoundRoute, {handler: require('./components/route-not-found.jsx')})));


//# sourceURL=/Users/hburrows/dev/heroku/react-flux-starter/public/javascripts/routes.jsx
},{"./components/app.jsx":14,"./components/items.jsx":15,"./components/route-not-found.jsx":21,"./components/server-time.jsx":22,"react-router":"react-router","react/addons":"react/addons"}],29:[function(require,module,exports){
"use strict";
'use strict';
var EventEmitter = require("events").EventEmitter;
var _ = require('lodash');
var io = require('socket.io-client');
var httpVerbRe = /^(GET|PUT|POST|DELETE)\s/;
var SubscriptionService = function SubscriptionService(accessToken) {
  $traceurRuntime.superConstructor($SubscriptionService).call(this);
  this.accessToken = accessToken;
  var socket = this.socket = io({transports: ['websocket']});
  socket.on('connect', this.handleConnect.bind(this));
  socket.on('disconnect', this.handleDisconnect.bind(this));
  socket.on('reconnect', this.handleReconnect.bind(this));
  socket.on('set', this.handleSet.bind(this));
};
var $SubscriptionService = SubscriptionService;
($traceurRuntime.createClass)(SubscriptionService, {
  handleConnect: function() {
    this.socket.emit('auth', this.accessToken);
    this.emit('connect');
  },
  handleDisconnect: function() {
    this.emit('disconnect');
  },
  handleReconnect: function() {
    _.each(this._events, function(fn, channel) {
      if (httpVerbRe.test(channel)) {
        this.removeAllListeners(channel);
      }
    }, this);
    this.emit('reconnect');
  },
  handleSet: function(data) {
    this.emit(data.channel, 'set', data.channel, JSON.parse(data.data));
  },
  subscribe: function(channel, handler, options) {
    if (EventEmitter.listenerCount(this, channel) !== 0) {
      throw new Error('api-subscription: Cannot subscribe to channel "' + channel + '" more than once.');
    }
    options = _.extend({
      initialPayload: false,
      reconnectPayload: false
    }, options || {});
    handler._options = options;
    this.addListener(channel, handler);
    this.socket.emit('subscribe', channel, options.initialPayload);
    return this;
  },
  unsubscribe: function(channel, handler) {
    this.removeListener(channel, handler);
    if (EventEmitter.listenerCount(this, channel) === 0) {
      this.socket.emit('unsubscribe', channel);
    }
    return this;
  },
  normalizeChannelName: function(channel) {
    return channel.replace(/^(GET|PUT|POST|DELETE)\s/, '');
  },
  isConnected: function() {
    return this.socket.connected;
  },
  isDisconnected: function() {
    return this.socket.disconnected;
  }
}, {}, EventEmitter);
module.exports = function(accessToken) {
  return new SubscriptionService(accessToken);
};


//# sourceURL=/Users/hburrows/dev/heroku/react-flux-starter/public/javascripts/services/api-subscriptions.js
},{"events":"events","lodash":"lodash","socket.io-client":"socket.io-client"}],30:[function(require,module,exports){
"use strict";
'use strict';
var apiSubscriptionSrvc = require('./api-subscriptions');
exports.initialize = function(accessToken) {
  exports.apiSubscriptions = apiSubscriptionSrvc(accessToken);
};


//# sourceURL=/Users/hburrows/dev/heroku/react-flux-starter/public/javascripts/services/index.js
},{"./api-subscriptions":29}],31:[function(require,module,exports){
"use strict";
'use strict';
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var Immutable = require('immutable');
var CHANGE_EVENT = 'change';
var BaseStore = function BaseStore(dispatcher) {
  $traceurRuntime.superConstructor($BaseStore).call(this);
  this.dispatcher = dispatcher;
  this.inFlight = false;
  this.error = null;
  this._register();
  this.initialize();
};
var $BaseStore = BaseStore;
($traceurRuntime.createClass)(BaseStore, {
  initialize: function() {},
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },
  getState: function() {
    return undefined;
  },
  isInFlight: function() {
    return this.inFlight;
  },
  _getActions: function() {
    return {};
  },
  getStoreName: function() {
    return this.constructor.name;
  },
  makeStatefulEntry: function() {
    var state = arguments[0];
    var data = arguments[1];
    return {
      state: state,
      data: data
    };
  },
  updateStatefulEntry: function(entry, state, data) {
    _.extend(entry.data || (entry.data = {}), data);
    entry.state = state;
    return entry;
  },
  _register: function() {
    this.dispatchToken = this.dispatcher.register(_.bind(function(payload) {
      this._handleAction(payload.action.actionType, payload.action);
    }, this));
  },
  _handleAction: function(actionType, action) {
    var actions = this._getActions();
    if (actions.hasOwnProperty(actionType)) {
      var actionValue = actions[actionType];
      if (_.isString(actionValue)) {
        if (_.isFunction(this[actionValue])) {
          this[actionValue](action);
        } else {
          throw new Error(("Action handler defined in Store map is undefined or not a Function. Store: " + this.constructor.name + ", Action: " + actionType));
        }
      } else if (_.isFunction(actionValue)) {
        actionValue.call(this, action);
      }
    }
  },
  _makeStoreEntry: function() {
    return Immutable.fromJS({_meta: {state: undefined}});
  }
}, {}, EventEmitter);
module.exports = BaseStore;


//# sourceURL=/Users/hburrows/dev/heroku/react-flux-starter/public/javascripts/stores/base.js
},{"events":"events","immutable":3,"lodash":"lodash"}],32:[function(require,module,exports){
"use strict";
'use strict';
var _ = require('lodash');
var BaseStore = require('./base');
var kActions = require('../constants/actions'),
    kStates = require('../constants/states');
function _actionForMethod(actionObjectId, method) {
  return kActions[actionObjectId + '_' + method];
}
var CRUDStore = function CRUDStore(dispatcher, actions, actionObjectId) {
  $traceurRuntime.superConstructor($CRUDStore).call(this, dispatcher);
  this._resources = undefined;
  this._actions = actions;
  this._handlers = this._getActionHandlers(actionObjectId);
  actions.subscribeList();
};
var $CRUDStore = CRUDStore;
($traceurRuntime.createClass)(CRUDStore, {
  getAll: function() {
    return this._resources !== undefined ? _.map(this._resources, (function(resource) {
      return resource;
    })) : this._loadAll();
  },
  get: function(id) {
    return this._resources !== undefined ? (id in this._resources ? this._resources[id] : this._loadOne(id)) : this._loadAll();
  },
  _getActions: function() {
    return this._handlers;
  },
  _getActionHandlers: function(actionObjectId) {
    return _.zipObject([[_actionForMethod(actionObjectId, 'GETALL'), '_onGetAll'], [_actionForMethod(actionObjectId, 'GETONE'), '_onGetOne'], [_actionForMethod(actionObjectId, 'POST'), '_onPost'], [_actionForMethod(actionObjectId, 'PUT'), '_onPut'], [_actionForMethod(actionObjectId, 'DELETE'), '_onDelete']]);
  },
  _loadAll: function() {
    this._actions.getAll();
    return undefined;
  },
  _loadOne: function(id) {
    this._actions.get(id);
    return undefined;
  },
  _onGetAll: function(payload) {
    var $__0 = this;
    console.debug((this.getStoreName() + ":_onGetAll; state=" + payload.syncState));
    switch (payload.syncState) {
      case kStates.LOADING:
        this.inflight = true;
        break;
      case kStates.SYNCED:
        if (this._resources) {
          this._actions.unsubscribeResources(_.map(this._resources, (function(resource) {
            return resource.data.id;
          })));
        }
        var map = _.map(payload.data, (function(item) {
          return [item.id, $__0.makeStatefulEntry(payload.syncState, item)];
        }));
        this._resources = _.zipObject(map);
        this._actions.subscribeResources(_.map(this._resources, (function(resource) {
          return resource.data.id;
        })));
        this.inflight = false;
        break;
    }
    this.emitChange();
  },
  _onGetOne: function(payload) {
    console.debug((this.getStoreName() + ":_onGetAll; state=" + payload.syncState));
    var exists;
    switch (payload.syncState) {
      case kStates.LOADING:
        this.inflight = true;
        break;
      case kStates.SYNCED:
        this._resources = this._resources || {};
        exists = !!this._resources[payload.data.id];
        this._resources[payload.data.id] = this.makeStatefulEntry(payload.syncState, payload.data);
        if (!exists) {
          this._actions.subscribeResources(payload.data.id);
        }
        this.inflight = false;
        break;
    }
    this.emitChange();
  },
  _onPost: function(payload) {
    console.debug((this.getStoreName() + ":_onPost; state=" + payload.syncState));
    if (!this._resources) {
      this._resources = {};
    }
    this._resources[payload.data.id] = this.makeStatefulEntry(payload.syncState, payload.data);
    if (payload.syncState === kStates.SYNCED) {
      this._actions.subscribeResources(payload.data.id);
    }
    this.emitChange();
  },
  _onPut: function(payload) {
    console.debug((this.getStoreName() + ":_onPut; state=" + payload.syncState));
    if (!this._resources) {
      this._resources = {};
    }
    var existingEntry = this._resources[payload.data.id];
    if (!existingEntry) {
      return;
    }
    this._resources[payload.data.id] = this.updateStatefulEntry(existingEntry, payload.syncState, payload.data);
    this.emitChange();
  },
  _onDelete: function(payload) {
    console.debug((this.getStoreName() + ":_onDelete; state=" + payload.syncState));
    if (!this._resources) {
      this._resources = {};
    }
    var existingEntry = this._resources[payload.data.id];
    if (!existingEntry) {
      return;
    }
    if (existingEntry) {
      switch (payload.syncState) {
        case kStates.DELETING:
          existingEntry = this.updateStatefulEntry(existingEntry, payload.syncState);
          break;
        case kStates.SYNCED:
          this._actions.unsubscribeResources(payload.data.id);
          delete this._resources[payload.data.id];
          break;
      }
      this.emitChange();
    }
  }
}, {}, BaseStore);
module.exports = CRUDStore;


//# sourceURL=/Users/hburrows/dev/heroku/react-flux-starter/public/javascripts/stores/crud-base.js
},{"../constants/actions":23,"../constants/states":24,"./base":31,"lodash":"lodash"}],33:[function(require,module,exports){
"use strict";
'use strict';
var Dispatcher = require('../dispatcher');
var ItemsStore = require('./items'),
    ServerTimeStore = require('./server-time'),
    OverlaysStore = require('./overlays');
exports.initialize = function() {
  exports.ItemsStore = new ItemsStore(Dispatcher);
  exports.ServerTimeStore = new ServerTimeStore(Dispatcher);
  exports.OverlaysStore = new OverlaysStore(Dispatcher);
  return this;
};


//# sourceURL=/Users/hburrows/dev/heroku/react-flux-starter/public/javascripts/stores/index.js
},{"../dispatcher":25,"./items":34,"./overlays":35,"./server-time":36}],34:[function(require,module,exports){
"use strict";
'use strict';
var _ = require('lodash');
var CRUDBase = require('./crud-base');
var ItemActions = require('../actions/items');
var ItemsStore = function ItemsStore(dispatcher) {
  $traceurRuntime.superConstructor($ItemsStore).call(this, dispatcher, ItemActions, 'ITEM');
};
var $ItemsStore = ItemsStore;
($traceurRuntime.createClass)(ItemsStore, {getAll: function() {
    return _.sortBy($traceurRuntime.superGet(this, $ItemsStore.prototype, "getAll").call(this), (function(item) {
      return item.data.last + item.data.first;
    }));
  }}, {}, CRUDBase);
module.exports = ItemsStore;


//# sourceURL=/Users/hburrows/dev/heroku/react-flux-starter/public/javascripts/stores/items.js
},{"../actions/items":8,"./crud-base":32,"lodash":"lodash"}],35:[function(require,module,exports){
"use strict";
'use strict';
var _ = require('lodash');
var kActions = require('../constants/actions');
var BaseStore = require('./base');
var _handlers = _.zipObject([[kActions.OVERLAY_PUSH, '_onOverlayPush'], [kActions.OVERLAY_POP, '_onOverlayPop']]);
var OverlaysStore = function OverlaysStore() {
  $traceurRuntime.superConstructor($OverlaysStore).apply(this, arguments);
};
var $OverlaysStore = OverlaysStore;
($traceurRuntime.createClass)(OverlaysStore, {
  initialize: function() {
    this._overlays = [];
  },
  _getActions: function() {
    return _handlers;
  },
  getTopOverlay: function() {
    return this._overlays.length ? this._overlays[this._overlays.length - 1] : null;
  },
  _onOverlayPush: function(payload) {
    this._overlays.push(payload.data.component);
    this.emitChange();
  },
  _onOverlayPop: function() {
    this._overlays.pop();
    this.emitChange();
  }
}, {}, BaseStore);
module.exports = OverlaysStore;


//# sourceURL=/Users/hburrows/dev/heroku/react-flux-starter/public/javascripts/stores/overlays.js
},{"../constants/actions":23,"./base":31,"lodash":"lodash"}],36:[function(require,module,exports){
"use strict";
'use strict';
var _ = require('lodash');
var BaseStore = require('./base');
var kActions = require('../constants/actions'),
    ServerActions = require('../actions/server-time');
var _actions = _.zipObject([[kActions.SERVERTIME_GET, 'handleSet'], [kActions.SERVERTIME_PUT, 'handleSet']]);
var ServerTimeStore = function ServerTimeStore(dispatcher) {
  $traceurRuntime.superConstructor($ServerTimeStore).call(this, dispatcher);
  this._serverTime = undefined;
};
var $ServerTimeStore = ServerTimeStore;
($traceurRuntime.createClass)(ServerTimeStore, {
  _getActions: function() {
    return _actions;
  },
  _load: function() {
    ServerActions.getTime();
    return undefined;
  },
  _getTime: function() {
    return this._serverTime !== undefined ? this._serverTime : this._load();
  },
  getServerTime: function() {
    return this._getTime();
  },
  handleSet: function(payload) {
    console.debug((this.getStoreName() + ":handleSet state=" + payload.syncState));
    this._serverTime = this.makeStatefulEntry(payload.syncState, payload.data);
    this.emitChange();
  }
}, {}, BaseStore);
module.exports = ServerTimeStore;


//# sourceURL=/Users/hburrows/dev/heroku/react-flux-starter/public/javascripts/stores/server-time.js
},{"../actions/server-time":10,"../constants/actions":23,"./base":31,"lodash":"lodash"}],37:[function(require,module,exports){
"use strict";
var invariant = require('./invariant');
var _lastID = 1;
var _prefix = 'ID_';
function Dispatcher() {
  "use strict";
  this.$Dispatcher_callbacks = {};
  this.$Dispatcher_isPending = {};
  this.$Dispatcher_isHandled = {};
  this.$Dispatcher_isDispatching = false;
  this.$Dispatcher_pendingPayload = null;
}
Dispatcher.prototype.register = function(callback) {
  "use strict";
  var id = _prefix + _lastID++;
  this.$Dispatcher_callbacks[id] = callback;
  return id;
};
Dispatcher.prototype.unregister = function(id) {
  "use strict";
  invariant(this.$Dispatcher_callbacks[id], 'Dispatcher.unregister(...): `%s` does not map to a registered callback.', id);
  delete this.$Dispatcher_callbacks[id];
};
Dispatcher.prototype.waitFor = function(ids) {
  "use strict";
  invariant(this.$Dispatcher_isDispatching, 'Dispatcher.waitFor(...): Must be invoked while dispatching.');
  for (var ii = 0; ii < ids.length; ii++) {
    var id = ids[ii];
    if (this.$Dispatcher_isPending[id]) {
      invariant(this.$Dispatcher_isHandled[id], 'Dispatcher.waitFor(...): Circular dependency detected while ' + 'waiting for `%s`.', id);
      continue;
    }
    invariant(this.$Dispatcher_callbacks[id], 'Dispatcher.waitFor(...): `%s` does not map to a registered callback.', id);
    this.$Dispatcher_invokeCallback(id);
  }
};
Dispatcher.prototype.dispatch = function(payload) {
  "use strict";
  invariant(!this.$Dispatcher_isDispatching, 'Dispatch.dispatch(...): Cannot dispatch in the middle of a dispatch.');
  this.$Dispatcher_startDispatching(payload);
  try {
    for (var id in this.$Dispatcher_callbacks) {
      if (this.$Dispatcher_isPending[id]) {
        continue;
      }
      this.$Dispatcher_invokeCallback(id);
    }
  } finally {
    this.$Dispatcher_stopDispatching();
  }
};
Dispatcher.prototype.isDispatching = function() {
  "use strict";
  return this.$Dispatcher_isDispatching;
};
Dispatcher.prototype.$Dispatcher_invokeCallback = function(id) {
  "use strict";
  this.$Dispatcher_isPending[id] = true;
  this.$Dispatcher_callbacks[id](this.$Dispatcher_pendingPayload);
  this.$Dispatcher_isHandled[id] = true;
};
Dispatcher.prototype.$Dispatcher_startDispatching = function(payload) {
  "use strict";
  for (var id in this.$Dispatcher_callbacks) {
    this.$Dispatcher_isPending[id] = false;
    this.$Dispatcher_isHandled[id] = false;
  }
  this.$Dispatcher_pendingPayload = payload;
  this.$Dispatcher_isDispatching = true;
};
Dispatcher.prototype.$Dispatcher_stopDispatching = function() {
  "use strict";
  this.$Dispatcher_pendingPayload = null;
  this.$Dispatcher_isDispatching = false;
};
module.exports = Dispatcher;


//# sourceURL=/Users/hburrows/dev/heroku/react-flux-starter/public/javascripts/vendor/flux/Dispatcher.js
},{"./invariant":38}],38:[function(require,module,exports){
"use strict";
"use strict";
var invariant = function(condition, format, a, b, c, d, e, f) {
  if (false) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }
  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error('Invariant Violation: ' + format.replace(/%s/g, function() {
        return args[argIndex++];
      }));
    }
    error.framesToPop = 1;
    throw error;
  }
};
module.exports = invariant;


//# sourceURL=/Users/hburrows/dev/heroku/react-flux-starter/public/javascripts/vendor/flux/invariant.js
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvaGJ1cnJvd3MvZGV2L2hlcm9rdS9yZWFjdC1mbHV4LXN0YXJ0ZXIvcHVibGljL2phdmFzY3JpcHRzL21haW4uanN4Iiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9pbW11dGFibGUvZGlzdC9pbW11dGFibGUuanMiLCJub2RlX21vZHVsZXMvcmVhY3QvbGliL2ludmFyaWFudC5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC9saWIva2V5TWlycm9yLmpzIiwiL1VzZXJzL2hidXJyb3dzL2Rldi9oZXJva3UvcmVhY3QtZmx1eC1zdGFydGVyL3B1YmxpYy9qYXZhc2NyaXB0cy9hY3Rpb25zL2Jhc2UuanMiLCIvVXNlcnMvaGJ1cnJvd3MvZGV2L2hlcm9rdS9yZWFjdC1mbHV4LXN0YXJ0ZXIvcHVibGljL2phdmFzY3JpcHRzL2FjdGlvbnMvY3J1ZC1iYXNlLmpzIiwiL1VzZXJzL2hidXJyb3dzL2Rldi9oZXJva3UvcmVhY3QtZmx1eC1zdGFydGVyL3B1YmxpYy9qYXZhc2NyaXB0cy9hY3Rpb25zL2l0ZW1zLmpzIiwiL1VzZXJzL2hidXJyb3dzL2Rldi9oZXJva3UvcmVhY3QtZmx1eC1zdGFydGVyL3B1YmxpYy9qYXZhc2NyaXB0cy9hY3Rpb25zL292ZXJsYXlzLmpzIiwiL1VzZXJzL2hidXJyb3dzL2Rldi9oZXJva3UvcmVhY3QtZmx1eC1zdGFydGVyL3B1YmxpYy9qYXZhc2NyaXB0cy9hY3Rpb25zL3NlcnZlci10aW1lLmpzIiwiL1VzZXJzL2hidXJyb3dzL2Rldi9oZXJva3UvcmVhY3QtZmx1eC1zdGFydGVyL3B1YmxpYy9qYXZhc2NyaXB0cy9jb21tb24vYWpheC5qcyIsIi9Vc2Vycy9oYnVycm93cy9kZXYvaGVyb2t1L3JlYWN0LWZsdXgtc3RhcnRlci9wdWJsaWMvamF2YXNjcmlwdHMvY29tbW9uL2h0dHAtZXJyb3IuanMiLCIvVXNlcnMvaGJ1cnJvd3MvZGV2L2hlcm9rdS9yZWFjdC1mbHV4LXN0YXJ0ZXIvcHVibGljL2phdmFzY3JpcHRzL2NvbW1vbi9tZXRlcmVkLXJlcXVlc3QuanMiLCIvVXNlcnMvaGJ1cnJvd3MvZGV2L2hlcm9rdS9yZWFjdC1mbHV4LXN0YXJ0ZXIvcHVibGljL2phdmFzY3JpcHRzL2NvbXBvbmVudHMvYXBwLmpzeCIsIi9Vc2Vycy9oYnVycm93cy9kZXYvaGVyb2t1L3JlYWN0LWZsdXgtc3RhcnRlci9wdWJsaWMvamF2YXNjcmlwdHMvY29tcG9uZW50cy9pdGVtcy5qc3giLCIvVXNlcnMvaGJ1cnJvd3MvZGV2L2hlcm9rdS9yZWFjdC1mbHV4LXN0YXJ0ZXIvcHVibGljL2phdmFzY3JpcHRzL2NvbXBvbmVudHMvbmF2LWJhci5qc3giLCIvVXNlcnMvaGJ1cnJvd3MvZGV2L2hlcm9rdS9yZWFjdC1mbHV4LXN0YXJ0ZXIvcHVibGljL2phdmFzY3JpcHRzL2NvbXBvbmVudHMvb3ZlcmxheXMvYWxlcnQuanN4IiwiL1VzZXJzL2hidXJyb3dzL2Rldi9oZXJva3UvcmVhY3QtZmx1eC1zdGFydGVyL3B1YmxpYy9qYXZhc2NyaXB0cy9jb21wb25lbnRzL292ZXJsYXlzL2NvbmZpcm0uanN4IiwiL1VzZXJzL2hidXJyb3dzL2Rldi9oZXJva3UvcmVhY3QtZmx1eC1zdGFydGVyL3B1YmxpYy9qYXZhc2NyaXB0cy9jb21wb25lbnRzL292ZXJsYXlzL2l0ZW0tZm9ybS5qc3giLCIvVXNlcnMvaGJ1cnJvd3MvZGV2L2hlcm9rdS9yZWFjdC1mbHV4LXN0YXJ0ZXIvcHVibGljL2phdmFzY3JpcHRzL2NvbXBvbmVudHMvb3ZlcmxheXMvb3ZlcmxheS1tYW5hZ2VyLmpzeCIsIi9Vc2Vycy9oYnVycm93cy9kZXYvaGVyb2t1L3JlYWN0LWZsdXgtc3RhcnRlci9wdWJsaWMvamF2YXNjcmlwdHMvY29tcG9uZW50cy9yb3V0ZS1ub3QtZm91bmQuanN4IiwiL1VzZXJzL2hidXJyb3dzL2Rldi9oZXJva3UvcmVhY3QtZmx1eC1zdGFydGVyL3B1YmxpYy9qYXZhc2NyaXB0cy9jb21wb25lbnRzL3NlcnZlci10aW1lLmpzeCIsIi9Vc2Vycy9oYnVycm93cy9kZXYvaGVyb2t1L3JlYWN0LWZsdXgtc3RhcnRlci9wdWJsaWMvamF2YXNjcmlwdHMvY29uc3RhbnRzL2FjdGlvbnMuanMiLCIvVXNlcnMvaGJ1cnJvd3MvZGV2L2hlcm9rdS9yZWFjdC1mbHV4LXN0YXJ0ZXIvcHVibGljL2phdmFzY3JpcHRzL2NvbnN0YW50cy9zdGF0ZXMuanMiLCIvVXNlcnMvaGJ1cnJvd3MvZGV2L2hlcm9rdS9yZWFjdC1mbHV4LXN0YXJ0ZXIvcHVibGljL2phdmFzY3JpcHRzL2Rpc3BhdGNoZXIuanMiLCIvVXNlcnMvaGJ1cnJvd3MvZGV2L2hlcm9rdS9yZWFjdC1mbHV4LXN0YXJ0ZXIvcHVibGljL2phdmFzY3JpcHRzL21peGlucy9vdmVybGF5LmpzIiwiL1VzZXJzL2hidXJyb3dzL2Rldi9oZXJva3UvcmVhY3QtZmx1eC1zdGFydGVyL3B1YmxpYy9qYXZhc2NyaXB0cy9taXhpbnMvc3RvcmUtY2hhbmdlLmpzIiwiL1VzZXJzL2hidXJyb3dzL2Rldi9oZXJva3UvcmVhY3QtZmx1eC1zdGFydGVyL3B1YmxpYy9qYXZhc2NyaXB0cy9yb3V0ZXMuanN4IiwiL1VzZXJzL2hidXJyb3dzL2Rldi9oZXJva3UvcmVhY3QtZmx1eC1zdGFydGVyL3B1YmxpYy9qYXZhc2NyaXB0cy9zZXJ2aWNlcy9hcGktc3Vic2NyaXB0aW9ucy5qcyIsIi9Vc2Vycy9oYnVycm93cy9kZXYvaGVyb2t1L3JlYWN0LWZsdXgtc3RhcnRlci9wdWJsaWMvamF2YXNjcmlwdHMvc2VydmljZXMvaW5kZXguanMiLCIvVXNlcnMvaGJ1cnJvd3MvZGV2L2hlcm9rdS9yZWFjdC1mbHV4LXN0YXJ0ZXIvcHVibGljL2phdmFzY3JpcHRzL3N0b3Jlcy9iYXNlLmpzIiwiL1VzZXJzL2hidXJyb3dzL2Rldi9oZXJva3UvcmVhY3QtZmx1eC1zdGFydGVyL3B1YmxpYy9qYXZhc2NyaXB0cy9zdG9yZXMvY3J1ZC1iYXNlLmpzIiwiL1VzZXJzL2hidXJyb3dzL2Rldi9oZXJva3UvcmVhY3QtZmx1eC1zdGFydGVyL3B1YmxpYy9qYXZhc2NyaXB0cy9zdG9yZXMvaW5kZXguanMiLCIvVXNlcnMvaGJ1cnJvd3MvZGV2L2hlcm9rdS9yZWFjdC1mbHV4LXN0YXJ0ZXIvcHVibGljL2phdmFzY3JpcHRzL3N0b3Jlcy9pdGVtcy5qcyIsIi9Vc2Vycy9oYnVycm93cy9kZXYvaGVyb2t1L3JlYWN0LWZsdXgtc3RhcnRlci9wdWJsaWMvamF2YXNjcmlwdHMvc3RvcmVzL292ZXJsYXlzLmpzIiwiL1VzZXJzL2hidXJyb3dzL2Rldi9oZXJva3UvcmVhY3QtZmx1eC1zdGFydGVyL3B1YmxpYy9qYXZhc2NyaXB0cy9zdG9yZXMvc2VydmVyLXRpbWUuanMiLCIvVXNlcnMvaGJ1cnJvd3MvZGV2L2hlcm9rdS9yZWFjdC1mbHV4LXN0YXJ0ZXIvcHVibGljL2phdmFzY3JpcHRzL3ZlbmRvci9mbHV4L0Rpc3BhdGNoZXIuanMiLCIvVXNlcnMvaGJ1cnJvd3MvZGV2L2hlcm9rdS9yZWFjdC1mbHV4LXN0YXJ0ZXIvcHVibGljL2phdmFzY3JpcHRzL3ZlbmRvci9mbHV4L2ludmFyaWFudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQUEsV0FBVyxDQUFDO0FBRVosQUFBSSxFQUFBLENBQUEsQ0FBQSxFQUFJLENBQUEsT0FBTSxBQUFDLENBQUMsUUFBTyxDQUFDLENBQUM7QUFLekIsQUFBQyxDQUFDLFNBQVMsQUFBQyxDQUFFO0FBRVosQUFBSSxJQUFBLENBQUEsS0FBSSxFQUFJLENBQUEsT0FBTSxBQUFDLENBQUMsY0FBYSxDQUFDLENBQUM7QUFFbkMsQUFBSSxJQUFBLENBQUEsTUFBSyxFQUFJLENBQUEsT0FBTSxBQUFDLENBQUMsY0FBYSxDQUFDLENBQUM7QUFHcEMsT0FBSyxNQUFNLEVBQUksTUFBSSxDQUFDO0FBRXBCLE1BQUksc0JBQXNCLEFBQUMsQ0FBQyxJQUFHLENBQUMsQ0FBQztBQUdqQyxBQUFJLElBQUEsQ0FBQSxRQUFPLEVBQUksQ0FBQSxPQUFNLEFBQUMsQ0FBQyxZQUFXLENBQUMsQ0FBQztBQUNoQyxTQUFPLFdBQVcsQUFBQyxDQUFDLE1BQUssR0FBRyxNQUFNLGVBQWUsQ0FBQyxDQUFDO0FBR3ZELEFBQUksSUFBQSxDQUFBLE1BQUssRUFBSSxDQUFBLE9BQU0sQUFBQyxDQUFDLFVBQVMsQ0FBQyxDQUFDO0FBQ2hDLE9BQUssV0FBVyxBQUFDLEVBQUMsQ0FBQztBQUduQixPQUFLLFFBQVEsRUFBSSxPQUFLLENBQUM7QUFFdkIsQUFBSSxJQUFBLENBQUEsTUFBSyxFQUFJLENBQUEsT0FBTSxBQUFDLENBQUMsY0FBYSxDQUFDLENBQUM7QUFFcEMsQUFBSSxJQUFBLENBQUEsTUFBSyxFQUFJLENBQUEsTUFBSyxPQUFPLEFBQUMsQ0FBQztBQUN6QixTQUFLLENBQUcsT0FBSztBQUNiLFdBQU8sQ0FBRyxDQUFBLE1BQUssZ0JBQWdCO0FBQy9CLFVBQU0sQ0FBRyxVQUFTLEFBQUMsQ0FBRTtBQUNuQixVQUFJLEFBQUMsQ0FBQyw0QkFBMkIsQ0FBQyxDQUFDO0lBQ3JDO0FBQUEsRUFDRixDQUFDLENBQUM7QUFFRixPQUFLLElBQUksQUFBQyxDQUFDLFNBQVUsT0FBTSxDQUFHO0FBQzVCLFFBQUksT0FBTyxBQUFDLENBQUMsS0FBSSxjQUFjLEFBQUMsQ0FBQyxPQUFNLENBQUcsS0FBRyxDQUFDLENBQUcsQ0FBQSxRQUFPLEtBQUssQ0FBQyxDQUFDO0VBQ2pFLENBQUMsQ0FBQztBQUVKLENBQUMsQ0FBQztBQUUrMUY7Ozs7QUM3Q2oyRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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QSxDQUFBLENBQUcsQ0FBQSxDQUFBLENBQUcsQ0FBQSxDQUFBLENBQUcsQ0FBQSxDQUFBLENBQUcsQ0FBQSxDQUFBLENBQUc7QUFDNUQsS0FBSSxLQUFJLENBQUc7QUFDVCxPQUFJLE1BQUssSUFBTSxVQUFRLENBQUc7QUFDeEIsVUFBTSxJQUFJLE1BQUksQUFBQyxDQUFDLDhDQUE2QyxDQUFDLENBQUM7SUFDakU7QUFBQSxFQUNGO0FBQUEsQUFFQSxLQUFJLENBQUMsU0FBUSxDQUFHO0FBQ2QsQUFBSSxNQUFBLENBQUEsS0FBSSxDQUFDO0FBQ1QsT0FBSSxNQUFLLElBQU0sVUFBUSxDQUFHO0FBQ3hCLFVBQUksRUFBSSxJQUFJLE1BQUksQUFBQyxDQUNmLG9FQUFtRSxFQUNuRSw4REFBNEQsQ0FDOUQsQ0FBQztJQUNILEtBQU87QUFDTCxBQUFJLFFBQUEsQ0FBQSxJQUFHLEVBQUksRUFBQyxDQUFBLENBQUcsRUFBQSxDQUFHLEVBQUEsQ0FBRyxFQUFBLENBQUcsRUFBQSxDQUFHLEVBQUEsQ0FBQyxDQUFDO0FBQzdCLEFBQUksUUFBQSxDQUFBLFFBQU8sRUFBSSxFQUFBLENBQUM7QUFDaEIsVUFBSSxFQUFJLElBQUksTUFBSSxBQUFDLENBQ2YsdUJBQXNCLEVBQ3RCLENBQUEsTUFBSyxRQUFRLEFBQUMsQ0FBQyxLQUFJLENBQUcsVUFBUSxBQUFDLENBQUU7QUFBRSxhQUFPLENBQUEsSUFBRyxDQUFFLFFBQU8sRUFBRSxDQUFDLENBQUM7TUFBRSxDQUFDLENBQy9ELENBQUM7SUFDSDtBQUFBLEFBRUEsUUFBSSxZQUFZLEVBQUksRUFBQSxDQUFDO0FBQ3JCLFFBQU0sTUFBSSxDQUFDO0VBQ2I7QUFBQSxBQUNGLENBQUM7QUFFRCxLQUFLLFFBQVEsRUFBSSxVQUFRLENBQUM7QUFFMmhIIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxudmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcblxuLyoqXG4gKiBNYWluIGVudHJ5LXBvaW50XG4gKi9cbiQoZnVuY3Rpb24gKCkge1xuXG4gIHZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0L2FkZG9ucycpO1xuXG4gIHZhciBSb3V0ZXIgPSByZXF1aXJlKCdyZWFjdC1yb3V0ZXInKTtcblxuICAvLyBmb3IgZGV2ZWxvcGVyIHRvb2xzXG4gIHdpbmRvdy5SZWFjdCA9IFJlYWN0O1xuXG4gIFJlYWN0LmluaXRpYWxpemVUb3VjaEV2ZW50cyh0cnVlKTtcblxuICAvLyBzZXJ2aWNlcyBpbml0aWFsaXphdGlvblxuICB2YXIgU2VydmljZXMgPSByZXF1aXJlKCcuL3NlcnZpY2VzJyk7XG4gICAgICBTZXJ2aWNlcy5pbml0aWFsaXplKHdpbmRvdy5FWC5jb25zdC5hcGlBY2Nlc3NUb2tlbik7XG5cbiAgLy8gc3RvcmUgaW5pdGlhbGl6YXRpb24gLS0gbmVlZHMgdG8gYmUgZG9uZSBiZWZvcmUgYW55IGNvbXBvbmVudCByZWZlcmVuY2VzXG4gIHZhciBTdG9yZXMgPSByZXF1aXJlKCcuL3N0b3JlcycpO1xuICBTdG9yZXMuaW5pdGlhbGl6ZSgpO1xuXG4gIC8vIGZvciBkZWJ1Z2dpbmcgLSBhbGxvd3MgeW91IHRvIHF1ZXJ5IHRoZSBzdG9yZXMgZnJvbSB0aGUgYnJvd3NlciBjb25zb2xlXG4gIHdpbmRvdy5fc3RvcmVzID0gU3RvcmVzO1xuXG4gIHZhciBSb3V0ZXMgPSByZXF1aXJlKCcuL3JvdXRlcy5qc3gnKTtcblxuICB2YXIgcm91dGVyID0gUm91dGVyLmNyZWF0ZSh7XG4gICAgcm91dGVzOiBSb3V0ZXMsXG4gICAgbG9jYXRpb246IFJvdXRlci5IaXN0b3J5TG9jYXRpb24sXG4gICAgb25FcnJvcjogZnVuY3Rpb24gKCkge1xuICAgICAgYWxlcnQoJ3VuZXhwZWN0ZWQgZXJyb3IgaW4gUm91dGVyJyk7XG4gICAgfVxuICB9KTtcblxuICByb3V0ZXIucnVuKGZ1bmN0aW9uIChIYW5kbGVyKSB7XG4gICAgUmVhY3QucmVuZGVyKFJlYWN0LmNyZWF0ZUVsZW1lbnQoSGFuZGxlciwgbnVsbCksIGRvY3VtZW50LmJvZHkpO1xuICB9KTtcblxufSk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaUwxVnpaWEp6TDJoaWRYSnliM2R6TDJSbGRpOW9aWEp2YTNVdmNtVmhZM1F0Wm14MWVDMXpkR0Z5ZEdWeUwzQjFZbXhwWXk5cVlYWmhjMk55YVhCMGN5OXRZV2x1TG1wemVDSXNJbk52ZFhKalpYTWlPbHNpTDFWelpYSnpMMmhpZFhKeWIzZHpMMlJsZGk5b1pYSnZhM1V2Y21WaFkzUXRabXgxZUMxemRHRnlkR1Z5TDNCMVlteHBZeTlxWVhaaGMyTnlhWEIwY3k5dFlXbHVMbXB6ZUNKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pUVVGQlFTeFpRVUZaTEVOQlFVTTdPMEZCUldJc1NVRkJTU3hEUVVGRExFZEJRVWNzVDBGQlR5eERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRPenRCUVVVeFFqczdSMEZGUnp0QlFVTklMRU5CUVVNc1EwRkJReXhaUVVGWk96dEJRVVZrTEVWQlFVVXNTVUZCU1N4TFFVRkxMRWRCUVVjc1QwRkJUeXhEUVVGRExHTkJRV01zUTBGQlF5eERRVUZET3p0QlFVVjBReXhGUVVGRkxFbEJRVWtzVFVGQlRTeEhRVUZITEU5QlFVOHNRMEZCUXl4alFVRmpMRU5CUVVNc1EwRkJRenRCUVVOMlF6czdRVUZGUVN4RlFVRkZMRTFCUVUwc1EwRkJReXhMUVVGTExFZEJRVWNzUzBGQlN5eERRVUZET3p0QlFVVjJRaXhGUVVGRkxFdEJRVXNzUTBGQlF5eHhRa0ZCY1VJc1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF6dEJRVU53UXpzN1JVRkZSU3hKUVVGSkxGRkJRVkVzUjBGQlJ5eFBRVUZQTEVOQlFVTXNXVUZCV1N4RFFVRkRMRU5CUVVNN1FVRkRka01zVFVGQlRTeFJRVUZSTEVOQlFVTXNWVUZCVlN4RFFVRkRMRTFCUVUwc1EwRkJReXhGUVVGRkxFTkJRVU1zUzBGQlN5eERRVUZETEdOQlFXTXNRMEZCUXl4RFFVRkRPMEZCUXpGRU96dEZRVVZGTEVsQlFVa3NUVUZCVFN4SFFVRkhMRTlCUVU4c1EwRkJReXhWUVVGVkxFTkJRVU1zUTBGQlF6dEJRVU51UXl4RlFVRkZMRTFCUVUwc1EwRkJReXhWUVVGVkxFVkJRVVVzUTBGQlF6dEJRVU4wUWpzN1FVRkZRU3hGUVVGRkxFMUJRVTBzUTBGQlF5eFBRVUZQTEVkQlFVY3NUVUZCVFN4RFFVRkRPenRCUVVVeFFpeEZRVUZGTEVsQlFVa3NUVUZCVFN4SFFVRkhMRTlCUVU4c1EwRkJReXhqUVVGakxFTkJRVU1zUTBGQlF6czdSVUZGY2tNc1NVRkJTU3hOUVVGTkxFZEJRVWNzVFVGQlRTeERRVUZETEUxQlFVMHNRMEZCUXp0SlFVTjZRaXhOUVVGTkxFVkJRVVVzVFVGQlRUdEpRVU5rTEZGQlFWRXNSVUZCUlN4TlFVRk5MRU5CUVVNc1pVRkJaVHRKUVVOb1F5eFBRVUZQTEVWQlFVVXNXVUZCV1R0TlFVTnVRaXhMUVVGTExFTkJRVU1zTkVKQlFUUkNMRU5CUVVNc1EwRkJRenRMUVVOeVF6dEJRVU5NTEVkQlFVY3NRMEZCUXl4RFFVRkRPenRGUVVWSUxFMUJRVTBzUTBGQlF5eEhRVUZITEVOQlFVTXNWVUZCVlN4UFFVRlBMRVZCUVVVN1NVRkROVUlzUzBGQlN5eERRVUZETEUxQlFVMHNRMEZCUXl4dlFrRkJReXhQUVVGUExFVkJRVUVzU1VGQlJTeERRVUZCTEVWQlFVVXNVVUZCVVN4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRE8wRkJRelZETEVkQlFVY3NRMEZCUXl4RFFVRkRPenREUVVWS0xFTkJRVU1zUTBGQlF5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJaWQxYzJVZ2MzUnlhV04wSnp0Y2JseHVkbUZ5SUNRZ1BTQnlaWEYxYVhKbEtDZHFjWFZsY25rbktUdGNibHh1THlvcVhHNGdLaUJOWVdsdUlHVnVkSEo1TFhCdmFXNTBYRzRnS2k5Y2JpUW9ablZ1WTNScGIyNGdLQ2tnZTF4dVhHNGdJSFpoY2lCU1pXRmpkQ0E5SUhKbGNYVnBjbVVvSjNKbFlXTjBMMkZrWkc5dWN5Y3BPMXh1WEc0Z0lIWmhjaUJTYjNWMFpYSWdQU0J5WlhGMWFYSmxLQ2R5WldGamRDMXliM1YwWlhJbktUdGNibHh1SUNBdkx5Qm1iM0lnWkdWMlpXeHZjR1Z5SUhSdmIyeHpYRzRnSUhkcGJtUnZkeTVTWldGamRDQTlJRkpsWVdOME8xeHVYRzRnSUZKbFlXTjBMbWx1YVhScFlXeHBlbVZVYjNWamFFVjJaVzUwY3loMGNuVmxLVHRjYmx4dUlDQXZMeUJ6WlhKMmFXTmxjeUJwYm1sMGFXRnNhWHBoZEdsdmJseHVJQ0IyWVhJZ1UyVnlkbWxqWlhNZ1BTQnlaWEYxYVhKbEtDY3VMM05sY25acFkyVnpKeWs3WEc0Z0lDQWdJQ0JUWlhKMmFXTmxjeTVwYm1sMGFXRnNhWHBsS0hkcGJtUnZkeTVGV0M1amIyNXpkQzVoY0dsQlkyTmxjM05VYjJ0bGJpazdYRzVjYmlBZ0x5OGdjM1J2Y21VZ2FXNXBkR2xoYkdsNllYUnBiMjRnTFMwZ2JtVmxaSE1nZEc4Z1ltVWdaRzl1WlNCaVpXWnZjbVVnWVc1NUlHTnZiWEJ2Ym1WdWRDQnlaV1psY21WdVkyVnpYRzRnSUhaaGNpQlRkRzl5WlhNZ1BTQnlaWEYxYVhKbEtDY3VMM04wYjNKbGN5Y3BPMXh1SUNCVGRHOXlaWE11YVc1cGRHbGhiR2w2WlNncE8xeHVYRzRnSUM4dklHWnZjaUJrWldKMVoyZHBibWNnTFNCaGJHeHZkM01nZVc5MUlIUnZJSEYxWlhKNUlIUm9aU0J6ZEc5eVpYTWdabkp2YlNCMGFHVWdZbkp2ZDNObGNpQmpiMjV6YjJ4bFhHNGdJSGRwYm1SdmR5NWZjM1J2Y21WeklEMGdVM1J2Y21Wek8xeHVYRzRnSUhaaGNpQlNiM1YwWlhNZ1BTQnlaWEYxYVhKbEtDY3VMM0p2ZFhSbGN5NXFjM2duS1R0Y2JseHVJQ0IyWVhJZ2NtOTFkR1Z5SUQwZ1VtOTFkR1Z5TG1OeVpXRjBaU2g3WEc0Z0lDQWdjbTkxZEdWek9pQlNiM1YwWlhNc1hHNGdJQ0FnYkc5allYUnBiMjQ2SUZKdmRYUmxjaTVJYVhOMGIzSjVURzlqWVhScGIyNHNYRzRnSUNBZ2IyNUZjbkp2Y2pvZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lDQWdZV3hsY25Rb0ozVnVaWGh3WldOMFpXUWdaWEp5YjNJZ2FXNGdVbTkxZEdWeUp5azdYRzRnSUNBZ2ZWeHVJQ0I5S1R0Y2JseHVJQ0J5YjNWMFpYSXVjblZ1S0daMWJtTjBhVzl1SUNoSVlXNWtiR1Z5S1NCN1hHNGdJQ0FnVW1WaFkzUXVjbVZ1WkdWeUtEeElZVzVrYkdWeUx6NHNJR1J2WTNWdFpXNTBMbUp2WkhrcE8xeHVJQ0I5S1R0Y2JseHVmU2s3WEc0aVhYMD0iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IHRydWU7XG4gICAgdmFyIGN1cnJlbnRRdWV1ZTtcbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgdmFyIGkgPSAtMTtcbiAgICAgICAgd2hpbGUgKCsraSA8IGxlbikge1xuICAgICAgICAgICAgY3VycmVudFF1ZXVlW2ldKCk7XG4gICAgICAgIH1cbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xufVxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICBxdWV1ZS5wdXNoKGZ1bik7XG4gICAgaWYgKCFkcmFpbmluZykge1xuICAgICAgICBzZXRUaW1lb3V0KGRyYWluUXVldWUsIDApO1xuICAgIH1cbn07XG5cbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG4vLyBUT0RPKHNodHlsbWFuKVxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiLyoqXG4gKiAgQ29weXJpZ2h0IChjKSAyMDE0LTIwMTUsIEZhY2Vib29rLCBJbmMuXG4gKiAgQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiAgVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiAgTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiAgb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKi9cbihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpIDpcbiAgdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKGZhY3RvcnkpIDpcbiAgZ2xvYmFsLkltbXV0YWJsZSA9IGZhY3RvcnkoKVxufSh0aGlzLCBmdW5jdGlvbiAoKSB7ICd1c2Ugc3RyaWN0Jzt2YXIgU0xJQ0UkMCA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcblxuICBmdW5jdGlvbiBjcmVhdGVDbGFzcyhjdG9yLCBzdXBlckNsYXNzKSB7XG4gICAgaWYgKHN1cGVyQ2xhc3MpIHtcbiAgICAgIGN0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzLnByb3RvdHlwZSk7XG4gICAgfVxuICAgIGN0b3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gY3RvcjtcbiAgfVxuXG4gIC8vIFVzZWQgZm9yIHNldHRpbmcgcHJvdG90eXBlIG1ldGhvZHMgdGhhdCBJRTggY2hva2VzIG9uLlxuICB2YXIgREVMRVRFID0gJ2RlbGV0ZSc7XG5cbiAgLy8gQ29uc3RhbnRzIGRlc2NyaWJpbmcgdGhlIHNpemUgb2YgdHJpZSBub2Rlcy5cbiAgdmFyIFNISUZUID0gNTsgLy8gUmVzdWx0ZWQgaW4gYmVzdCBwZXJmb3JtYW5jZSBhZnRlciBfX19fX18/XG4gIHZhciBTSVpFID0gMSA8PCBTSElGVDtcbiAgdmFyIE1BU0sgPSBTSVpFIC0gMTtcblxuICAvLyBBIGNvbnNpc3RlbnQgc2hhcmVkIHZhbHVlIHJlcHJlc2VudGluZyBcIm5vdCBzZXRcIiB3aGljaCBlcXVhbHMgbm90aGluZyBvdGhlclxuICAvLyB0aGFuIGl0c2VsZiwgYW5kIG5vdGhpbmcgdGhhdCBjb3VsZCBiZSBwcm92aWRlZCBleHRlcm5hbGx5LlxuICB2YXIgTk9UX1NFVCA9IHt9O1xuXG4gIC8vIEJvb2xlYW4gcmVmZXJlbmNlcywgUm91Z2ggZXF1aXZhbGVudCBvZiBgYm9vbCAmYC5cbiAgdmFyIENIQU5HRV9MRU5HVEggPSB7IHZhbHVlOiBmYWxzZSB9O1xuICB2YXIgRElEX0FMVEVSID0geyB2YWx1ZTogZmFsc2UgfTtcblxuICBmdW5jdGlvbiBNYWtlUmVmKHJlZikge1xuICAgIHJlZi52YWx1ZSA9IGZhbHNlO1xuICAgIHJldHVybiByZWY7XG4gIH1cblxuICBmdW5jdGlvbiBTZXRSZWYocmVmKSB7XG4gICAgcmVmICYmIChyZWYudmFsdWUgPSB0cnVlKTtcbiAgfVxuXG4gIC8vIEEgZnVuY3Rpb24gd2hpY2ggcmV0dXJucyBhIHZhbHVlIHJlcHJlc2VudGluZyBhbiBcIm93bmVyXCIgZm9yIHRyYW5zaWVudCB3cml0ZXNcbiAgLy8gdG8gdHJpZXMuIFRoZSByZXR1cm4gdmFsdWUgd2lsbCBvbmx5IGV2ZXIgZXF1YWwgaXRzZWxmLCBhbmQgd2lsbCBub3QgZXF1YWxcbiAgLy8gdGhlIHJldHVybiBvZiBhbnkgc3Vic2VxdWVudCBjYWxsIG9mIHRoaXMgZnVuY3Rpb24uXG4gIGZ1bmN0aW9uIE93bmVySUQoKSB7fVxuXG4gIC8vIGh0dHA6Ly9qc3BlcmYuY29tL2NvcHktYXJyYXktaW5saW5lXG4gIGZ1bmN0aW9uIGFyckNvcHkoYXJyLCBvZmZzZXQpIHtcbiAgICBvZmZzZXQgPSBvZmZzZXQgfHwgMDtcbiAgICB2YXIgbGVuID0gTWF0aC5tYXgoMCwgYXJyLmxlbmd0aCAtIG9mZnNldCk7XG4gICAgdmFyIG5ld0FyciA9IG5ldyBBcnJheShsZW4pO1xuICAgIGZvciAodmFyIGlpID0gMDsgaWkgPCBsZW47IGlpKyspIHtcbiAgICAgIG5ld0FycltpaV0gPSBhcnJbaWkgKyBvZmZzZXRdO1xuICAgIH1cbiAgICByZXR1cm4gbmV3QXJyO1xuICB9XG5cbiAgZnVuY3Rpb24gZW5zdXJlU2l6ZShpdGVyKSB7XG4gICAgaWYgKGl0ZXIuc2l6ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBpdGVyLnNpemUgPSBpdGVyLl9faXRlcmF0ZShyZXR1cm5UcnVlKTtcbiAgICB9XG4gICAgcmV0dXJuIGl0ZXIuc2l6ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHdyYXBJbmRleChpdGVyLCBpbmRleCkge1xuICAgIHJldHVybiBpbmRleCA+PSAwID8gKCtpbmRleCkgOiBlbnN1cmVTaXplKGl0ZXIpICsgKCtpbmRleCk7XG4gIH1cblxuICBmdW5jdGlvbiByZXR1cm5UcnVlKCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgZnVuY3Rpb24gd2hvbGVTbGljZShiZWdpbiwgZW5kLCBzaXplKSB7XG4gICAgcmV0dXJuIChiZWdpbiA9PT0gMCB8fCAoc2l6ZSAhPT0gdW5kZWZpbmVkICYmIGJlZ2luIDw9IC1zaXplKSkgJiZcbiAgICAgIChlbmQgPT09IHVuZGVmaW5lZCB8fCAoc2l6ZSAhPT0gdW5kZWZpbmVkICYmIGVuZCA+PSBzaXplKSk7XG4gIH1cblxuICBmdW5jdGlvbiByZXNvbHZlQmVnaW4oYmVnaW4sIHNpemUpIHtcbiAgICByZXR1cm4gcmVzb2x2ZUluZGV4KGJlZ2luLCBzaXplLCAwKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc29sdmVFbmQoZW5kLCBzaXplKSB7XG4gICAgcmV0dXJuIHJlc29sdmVJbmRleChlbmQsIHNpemUsIHNpemUpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzb2x2ZUluZGV4KGluZGV4LCBzaXplLCBkZWZhdWx0SW5kZXgpIHtcbiAgICByZXR1cm4gaW5kZXggPT09IHVuZGVmaW5lZCA/XG4gICAgICBkZWZhdWx0SW5kZXggOlxuICAgICAgaW5kZXggPCAwID9cbiAgICAgICAgTWF0aC5tYXgoMCwgc2l6ZSArIGluZGV4KSA6XG4gICAgICAgIHNpemUgPT09IHVuZGVmaW5lZCA/XG4gICAgICAgICAgaW5kZXggOlxuICAgICAgICAgIE1hdGgubWluKHNpemUsIGluZGV4KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIEl0ZXJhYmxlKHZhbHVlKSB7XG4gICAgICByZXR1cm4gaXNJdGVyYWJsZSh2YWx1ZSkgPyB2YWx1ZSA6IFNlcSh2YWx1ZSk7XG4gICAgfVxuXG5cbiAgY3JlYXRlQ2xhc3MoS2V5ZWRJdGVyYWJsZSwgSXRlcmFibGUpO1xuICAgIGZ1bmN0aW9uIEtleWVkSXRlcmFibGUodmFsdWUpIHtcbiAgICAgIHJldHVybiBpc0tleWVkKHZhbHVlKSA/IHZhbHVlIDogS2V5ZWRTZXEodmFsdWUpO1xuICAgIH1cblxuXG4gIGNyZWF0ZUNsYXNzKEluZGV4ZWRJdGVyYWJsZSwgSXRlcmFibGUpO1xuICAgIGZ1bmN0aW9uIEluZGV4ZWRJdGVyYWJsZSh2YWx1ZSkge1xuICAgICAgcmV0dXJuIGlzSW5kZXhlZCh2YWx1ZSkgPyB2YWx1ZSA6IEluZGV4ZWRTZXEodmFsdWUpO1xuICAgIH1cblxuXG4gIGNyZWF0ZUNsYXNzKFNldEl0ZXJhYmxlLCBJdGVyYWJsZSk7XG4gICAgZnVuY3Rpb24gU2V0SXRlcmFibGUodmFsdWUpIHtcbiAgICAgIHJldHVybiBpc0l0ZXJhYmxlKHZhbHVlKSAmJiAhaXNBc3NvY2lhdGl2ZSh2YWx1ZSkgPyB2YWx1ZSA6IFNldFNlcSh2YWx1ZSk7XG4gICAgfVxuXG5cblxuICBmdW5jdGlvbiBpc0l0ZXJhYmxlKG1heWJlSXRlcmFibGUpIHtcbiAgICByZXR1cm4gISEobWF5YmVJdGVyYWJsZSAmJiBtYXliZUl0ZXJhYmxlW0lTX0lURVJBQkxFX1NFTlRJTkVMXSk7XG4gIH1cblxuICBmdW5jdGlvbiBpc0tleWVkKG1heWJlS2V5ZWQpIHtcbiAgICByZXR1cm4gISEobWF5YmVLZXllZCAmJiBtYXliZUtleWVkW0lTX0tFWUVEX1NFTlRJTkVMXSk7XG4gIH1cblxuICBmdW5jdGlvbiBpc0luZGV4ZWQobWF5YmVJbmRleGVkKSB7XG4gICAgcmV0dXJuICEhKG1heWJlSW5kZXhlZCAmJiBtYXliZUluZGV4ZWRbSVNfSU5ERVhFRF9TRU5USU5FTF0pO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNBc3NvY2lhdGl2ZShtYXliZUFzc29jaWF0aXZlKSB7XG4gICAgcmV0dXJuIGlzS2V5ZWQobWF5YmVBc3NvY2lhdGl2ZSkgfHwgaXNJbmRleGVkKG1heWJlQXNzb2NpYXRpdmUpO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNPcmRlcmVkKG1heWJlT3JkZXJlZCkge1xuICAgIHJldHVybiAhIShtYXliZU9yZGVyZWQgJiYgbWF5YmVPcmRlcmVkW0lTX09SREVSRURfU0VOVElORUxdKTtcbiAgfVxuXG4gIEl0ZXJhYmxlLmlzSXRlcmFibGUgPSBpc0l0ZXJhYmxlO1xuICBJdGVyYWJsZS5pc0tleWVkID0gaXNLZXllZDtcbiAgSXRlcmFibGUuaXNJbmRleGVkID0gaXNJbmRleGVkO1xuICBJdGVyYWJsZS5pc0Fzc29jaWF0aXZlID0gaXNBc3NvY2lhdGl2ZTtcbiAgSXRlcmFibGUuaXNPcmRlcmVkID0gaXNPcmRlcmVkO1xuXG4gIEl0ZXJhYmxlLktleWVkID0gS2V5ZWRJdGVyYWJsZTtcbiAgSXRlcmFibGUuSW5kZXhlZCA9IEluZGV4ZWRJdGVyYWJsZTtcbiAgSXRlcmFibGUuU2V0ID0gU2V0SXRlcmFibGU7XG5cblxuICB2YXIgSVNfSVRFUkFCTEVfU0VOVElORUwgPSAnQEBfX0lNTVVUQUJMRV9JVEVSQUJMRV9fQEAnO1xuICB2YXIgSVNfS0VZRURfU0VOVElORUwgPSAnQEBfX0lNTVVUQUJMRV9LRVlFRF9fQEAnO1xuICB2YXIgSVNfSU5ERVhFRF9TRU5USU5FTCA9ICdAQF9fSU1NVVRBQkxFX0lOREVYRURfX0BAJztcbiAgdmFyIElTX09SREVSRURfU0VOVElORUwgPSAnQEBfX0lNTVVUQUJMRV9PUkRFUkVEX19AQCc7XG5cbiAgLyogZ2xvYmFsIFN5bWJvbCAqL1xuXG4gIHZhciBJVEVSQVRFX0tFWVMgPSAwO1xuICB2YXIgSVRFUkFURV9WQUxVRVMgPSAxO1xuICB2YXIgSVRFUkFURV9FTlRSSUVTID0gMjtcblxuICB2YXIgUkVBTF9JVEVSQVRPUl9TWU1CT0wgPSB0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIFN5bWJvbC5pdGVyYXRvcjtcbiAgdmFyIEZBVVhfSVRFUkFUT1JfU1lNQk9MID0gJ0BAaXRlcmF0b3InO1xuXG4gIHZhciBJVEVSQVRPUl9TWU1CT0wgPSBSRUFMX0lURVJBVE9SX1NZTUJPTCB8fCBGQVVYX0lURVJBVE9SX1NZTUJPTDtcblxuXG4gIGZ1bmN0aW9uIHNyY19JdGVyYXRvcl9fSXRlcmF0b3IobmV4dCkge1xuICAgICAgdGhpcy5uZXh0ID0gbmV4dDtcbiAgICB9XG5cbiAgICBzcmNfSXRlcmF0b3JfX0l0ZXJhdG9yLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICdbSXRlcmF0b3JdJztcbiAgICB9O1xuXG5cbiAgc3JjX0l0ZXJhdG9yX19JdGVyYXRvci5LRVlTID0gSVRFUkFURV9LRVlTO1xuICBzcmNfSXRlcmF0b3JfX0l0ZXJhdG9yLlZBTFVFUyA9IElURVJBVEVfVkFMVUVTO1xuICBzcmNfSXRlcmF0b3JfX0l0ZXJhdG9yLkVOVFJJRVMgPSBJVEVSQVRFX0VOVFJJRVM7XG5cbiAgc3JjX0l0ZXJhdG9yX19JdGVyYXRvci5wcm90b3R5cGUuaW5zcGVjdCA9XG4gIHNyY19JdGVyYXRvcl9fSXRlcmF0b3IucHJvdG90eXBlLnRvU291cmNlID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcy50b1N0cmluZygpOyB9XG4gIHNyY19JdGVyYXRvcl9fSXRlcmF0b3IucHJvdG90eXBlW0lURVJBVE9SX1NZTUJPTF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cblxuICBmdW5jdGlvbiBpdGVyYXRvclZhbHVlKHR5cGUsIGssIHYsIGl0ZXJhdG9yUmVzdWx0KSB7XG4gICAgdmFyIHZhbHVlID0gdHlwZSA9PT0gMCA/IGsgOiB0eXBlID09PSAxID8gdiA6IFtrLCB2XTtcbiAgICBpdGVyYXRvclJlc3VsdCA/IChpdGVyYXRvclJlc3VsdC52YWx1ZSA9IHZhbHVlKSA6IChpdGVyYXRvclJlc3VsdCA9IHtcbiAgICAgIHZhbHVlOiB2YWx1ZSwgZG9uZTogZmFsc2VcbiAgICB9KTtcbiAgICByZXR1cm4gaXRlcmF0b3JSZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiBpdGVyYXRvckRvbmUoKSB7XG4gICAgcmV0dXJuIHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9O1xuICB9XG5cbiAgZnVuY3Rpb24gaGFzSXRlcmF0b3IobWF5YmVJdGVyYWJsZSkge1xuICAgIHJldHVybiAhIWdldEl0ZXJhdG9yRm4obWF5YmVJdGVyYWJsZSk7XG4gIH1cblxuICBmdW5jdGlvbiBpc0l0ZXJhdG9yKG1heWJlSXRlcmF0b3IpIHtcbiAgICByZXR1cm4gbWF5YmVJdGVyYXRvciAmJiB0eXBlb2YgbWF5YmVJdGVyYXRvci5uZXh0ID09PSAnZnVuY3Rpb24nO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0SXRlcmF0b3IoaXRlcmFibGUpIHtcbiAgICB2YXIgaXRlcmF0b3JGbiA9IGdldEl0ZXJhdG9yRm4oaXRlcmFibGUpO1xuICAgIHJldHVybiBpdGVyYXRvckZuICYmIGl0ZXJhdG9yRm4uY2FsbChpdGVyYWJsZSk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRJdGVyYXRvckZuKGl0ZXJhYmxlKSB7XG4gICAgdmFyIGl0ZXJhdG9yRm4gPSBpdGVyYWJsZSAmJiAoXG4gICAgICAoUkVBTF9JVEVSQVRPUl9TWU1CT0wgJiYgaXRlcmFibGVbUkVBTF9JVEVSQVRPUl9TWU1CT0xdKSB8fFxuICAgICAgaXRlcmFibGVbRkFVWF9JVEVSQVRPUl9TWU1CT0xdXG4gICAgKTtcbiAgICBpZiAodHlwZW9mIGl0ZXJhdG9yRm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiBpdGVyYXRvckZuO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGlzQXJyYXlMaWtlKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlICYmIHR5cGVvZiB2YWx1ZS5sZW5ndGggPT09ICdudW1iZXInO1xuICB9XG5cbiAgY3JlYXRlQ2xhc3MoU2VxLCBJdGVyYWJsZSk7XG4gICAgZnVuY3Rpb24gU2VxKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCA/IGVtcHR5U2VxdWVuY2UoKSA6XG4gICAgICAgIGlzSXRlcmFibGUodmFsdWUpID8gdmFsdWUudG9TZXEoKSA6IHNlcUZyb21WYWx1ZSh2YWx1ZSk7XG4gICAgfVxuXG4gICAgU2VxLm9mID0gZnVuY3Rpb24oLyouLi52YWx1ZXMqLykge1xuICAgICAgcmV0dXJuIFNlcShhcmd1bWVudHMpO1xuICAgIH07XG5cbiAgICBTZXEucHJvdG90eXBlLnRvU2VxID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgU2VxLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX190b1N0cmluZygnU2VxIHsnLCAnfScpO1xuICAgIH07XG5cbiAgICBTZXEucHJvdG90eXBlLmNhY2hlUmVzdWx0ID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoIXRoaXMuX2NhY2hlICYmIHRoaXMuX19pdGVyYXRlVW5jYWNoZWQpIHtcbiAgICAgICAgdGhpcy5fY2FjaGUgPSB0aGlzLmVudHJ5U2VxKCkudG9BcnJheSgpO1xuICAgICAgICB0aGlzLnNpemUgPSB0aGlzLl9jYWNoZS5sZW5ndGg7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLy8gYWJzdHJhY3QgX19pdGVyYXRlVW5jYWNoZWQoZm4sIHJldmVyc2UpXG5cbiAgICBTZXEucHJvdG90eXBlLl9faXRlcmF0ZSA9IGZ1bmN0aW9uKGZuLCByZXZlcnNlKSB7XG4gICAgICByZXR1cm4gc2VxSXRlcmF0ZSh0aGlzLCBmbiwgcmV2ZXJzZSwgdHJ1ZSk7XG4gICAgfTtcblxuICAgIC8vIGFic3RyYWN0IF9faXRlcmF0b3JVbmNhY2hlZCh0eXBlLCByZXZlcnNlKVxuXG4gICAgU2VxLnByb3RvdHlwZS5fX2l0ZXJhdG9yID0gZnVuY3Rpb24odHlwZSwgcmV2ZXJzZSkge1xuICAgICAgcmV0dXJuIHNlcUl0ZXJhdG9yKHRoaXMsIHR5cGUsIHJldmVyc2UsIHRydWUpO1xuICAgIH07XG5cblxuXG4gIGNyZWF0ZUNsYXNzKEtleWVkU2VxLCBTZXEpO1xuICAgIGZ1bmN0aW9uIEtleWVkU2VxKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCA/XG4gICAgICAgIGVtcHR5U2VxdWVuY2UoKS50b0tleWVkU2VxKCkgOlxuICAgICAgICBpc0l0ZXJhYmxlKHZhbHVlKSA/XG4gICAgICAgICAgKGlzS2V5ZWQodmFsdWUpID8gdmFsdWUudG9TZXEoKSA6IHZhbHVlLmZyb21FbnRyeVNlcSgpKSA6XG4gICAgICAgICAga2V5ZWRTZXFGcm9tVmFsdWUodmFsdWUpO1xuICAgIH1cblxuICAgIEtleWVkU2VxLnByb3RvdHlwZS50b0tleWVkU2VxID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG5cblxuICBjcmVhdGVDbGFzcyhJbmRleGVkU2VxLCBTZXEpO1xuICAgIGZ1bmN0aW9uIEluZGV4ZWRTZXEodmFsdWUpIHtcbiAgICAgIHJldHVybiB2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gZW1wdHlTZXF1ZW5jZSgpIDpcbiAgICAgICAgIWlzSXRlcmFibGUodmFsdWUpID8gaW5kZXhlZFNlcUZyb21WYWx1ZSh2YWx1ZSkgOlxuICAgICAgICBpc0tleWVkKHZhbHVlKSA/IHZhbHVlLmVudHJ5U2VxKCkgOiB2YWx1ZS50b0luZGV4ZWRTZXEoKTtcbiAgICB9XG5cbiAgICBJbmRleGVkU2VxLm9mID0gZnVuY3Rpb24oLyouLi52YWx1ZXMqLykge1xuICAgICAgcmV0dXJuIEluZGV4ZWRTZXEoYXJndW1lbnRzKTtcbiAgICB9O1xuXG4gICAgSW5kZXhlZFNlcS5wcm90b3R5cGUudG9JbmRleGVkU2VxID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgSW5kZXhlZFNlcS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9fdG9TdHJpbmcoJ1NlcSBbJywgJ10nKTtcbiAgICB9O1xuXG4gICAgSW5kZXhlZFNlcS5wcm90b3R5cGUuX19pdGVyYXRlID0gZnVuY3Rpb24oZm4sIHJldmVyc2UpIHtcbiAgICAgIHJldHVybiBzZXFJdGVyYXRlKHRoaXMsIGZuLCByZXZlcnNlLCBmYWxzZSk7XG4gICAgfTtcblxuICAgIEluZGV4ZWRTZXEucHJvdG90eXBlLl9faXRlcmF0b3IgPSBmdW5jdGlvbih0eXBlLCByZXZlcnNlKSB7XG4gICAgICByZXR1cm4gc2VxSXRlcmF0b3IodGhpcywgdHlwZSwgcmV2ZXJzZSwgZmFsc2UpO1xuICAgIH07XG5cblxuXG4gIGNyZWF0ZUNsYXNzKFNldFNlcSwgU2VxKTtcbiAgICBmdW5jdGlvbiBTZXRTZXEodmFsdWUpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQgPyBlbXB0eVNlcXVlbmNlKCkgOlxuICAgICAgICAhaXNJdGVyYWJsZSh2YWx1ZSkgPyBpbmRleGVkU2VxRnJvbVZhbHVlKHZhbHVlKSA6XG4gICAgICAgIGlzS2V5ZWQodmFsdWUpID8gdmFsdWUuZW50cnlTZXEoKSA6IHZhbHVlXG4gICAgICApLnRvU2V0U2VxKCk7XG4gICAgfVxuXG4gICAgU2V0U2VxLm9mID0gZnVuY3Rpb24oLyouLi52YWx1ZXMqLykge1xuICAgICAgcmV0dXJuIFNldFNlcShhcmd1bWVudHMpO1xuICAgIH07XG5cbiAgICBTZXRTZXEucHJvdG90eXBlLnRvU2V0U2VxID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG5cblxuICBTZXEuaXNTZXEgPSBpc1NlcTtcbiAgU2VxLktleWVkID0gS2V5ZWRTZXE7XG4gIFNlcS5TZXQgPSBTZXRTZXE7XG4gIFNlcS5JbmRleGVkID0gSW5kZXhlZFNlcTtcblxuICB2YXIgSVNfU0VRX1NFTlRJTkVMID0gJ0BAX19JTU1VVEFCTEVfU0VRX19AQCc7XG5cbiAgU2VxLnByb3RvdHlwZVtJU19TRVFfU0VOVElORUxdID0gdHJ1ZTtcblxuXG5cbiAgLy8gI3ByYWdtYSBSb290IFNlcXVlbmNlc1xuXG4gIGNyZWF0ZUNsYXNzKEFycmF5U2VxLCBJbmRleGVkU2VxKTtcbiAgICBmdW5jdGlvbiBBcnJheVNlcShhcnJheSkge1xuICAgICAgdGhpcy5fYXJyYXkgPSBhcnJheTtcbiAgICAgIHRoaXMuc2l6ZSA9IGFycmF5Lmxlbmd0aDtcbiAgICB9XG5cbiAgICBBcnJheVNlcS5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oaW5kZXgsIG5vdFNldFZhbHVlKSB7XG4gICAgICByZXR1cm4gdGhpcy5oYXMoaW5kZXgpID8gdGhpcy5fYXJyYXlbd3JhcEluZGV4KHRoaXMsIGluZGV4KV0gOiBub3RTZXRWYWx1ZTtcbiAgICB9O1xuXG4gICAgQXJyYXlTZXEucHJvdG90eXBlLl9faXRlcmF0ZSA9IGZ1bmN0aW9uKGZuLCByZXZlcnNlKSB7XG4gICAgICB2YXIgYXJyYXkgPSB0aGlzLl9hcnJheTtcbiAgICAgIHZhciBtYXhJbmRleCA9IGFycmF5Lmxlbmd0aCAtIDE7XG4gICAgICBmb3IgKHZhciBpaSA9IDA7IGlpIDw9IG1heEluZGV4OyBpaSsrKSB7XG4gICAgICAgIGlmIChmbihhcnJheVtyZXZlcnNlID8gbWF4SW5kZXggLSBpaSA6IGlpXSwgaWksIHRoaXMpID09PSBmYWxzZSkge1xuICAgICAgICAgIHJldHVybiBpaSArIDE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBpaTtcbiAgICB9O1xuXG4gICAgQXJyYXlTZXEucHJvdG90eXBlLl9faXRlcmF0b3IgPSBmdW5jdGlvbih0eXBlLCByZXZlcnNlKSB7XG4gICAgICB2YXIgYXJyYXkgPSB0aGlzLl9hcnJheTtcbiAgICAgIHZhciBtYXhJbmRleCA9IGFycmF5Lmxlbmd0aCAtIDE7XG4gICAgICB2YXIgaWkgPSAwO1xuICAgICAgcmV0dXJuIG5ldyBzcmNfSXRlcmF0b3JfX0l0ZXJhdG9yKGZ1bmN0aW9uKCkgXG4gICAgICAgIHtyZXR1cm4gaWkgPiBtYXhJbmRleCA/XG4gICAgICAgICAgaXRlcmF0b3JEb25lKCkgOlxuICAgICAgICAgIGl0ZXJhdG9yVmFsdWUodHlwZSwgaWksIGFycmF5W3JldmVyc2UgPyBtYXhJbmRleCAtIGlpKysgOiBpaSsrXSl9XG4gICAgICApO1xuICAgIH07XG5cblxuXG4gIGNyZWF0ZUNsYXNzKE9iamVjdFNlcSwgS2V5ZWRTZXEpO1xuICAgIGZ1bmN0aW9uIE9iamVjdFNlcShvYmplY3QpIHtcbiAgICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMob2JqZWN0KTtcbiAgICAgIHRoaXMuX29iamVjdCA9IG9iamVjdDtcbiAgICAgIHRoaXMuX2tleXMgPSBrZXlzO1xuICAgICAgdGhpcy5zaXplID0ga2V5cy5sZW5ndGg7XG4gICAgfVxuXG4gICAgT2JqZWN0U2VxLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbihrZXksIG5vdFNldFZhbHVlKSB7XG4gICAgICBpZiAobm90U2V0VmFsdWUgIT09IHVuZGVmaW5lZCAmJiAhdGhpcy5oYXMoa2V5KSkge1xuICAgICAgICByZXR1cm4gbm90U2V0VmFsdWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5fb2JqZWN0W2tleV07XG4gICAgfTtcblxuICAgIE9iamVjdFNlcS5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gdGhpcy5fb2JqZWN0Lmhhc093blByb3BlcnR5KGtleSk7XG4gICAgfTtcblxuICAgIE9iamVjdFNlcS5wcm90b3R5cGUuX19pdGVyYXRlID0gZnVuY3Rpb24oZm4sIHJldmVyc2UpIHtcbiAgICAgIHZhciBvYmplY3QgPSB0aGlzLl9vYmplY3Q7XG4gICAgICB2YXIga2V5cyA9IHRoaXMuX2tleXM7XG4gICAgICB2YXIgbWF4SW5kZXggPSBrZXlzLmxlbmd0aCAtIDE7XG4gICAgICBmb3IgKHZhciBpaSA9IDA7IGlpIDw9IG1heEluZGV4OyBpaSsrKSB7XG4gICAgICAgIHZhciBrZXkgPSBrZXlzW3JldmVyc2UgPyBtYXhJbmRleCAtIGlpIDogaWldO1xuICAgICAgICBpZiAoZm4ob2JqZWN0W2tleV0sIGtleSwgdGhpcykgPT09IGZhbHNlKSB7XG4gICAgICAgICAgcmV0dXJuIGlpICsgMTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGlpO1xuICAgIH07XG5cbiAgICBPYmplY3RTZXEucHJvdG90eXBlLl9faXRlcmF0b3IgPSBmdW5jdGlvbih0eXBlLCByZXZlcnNlKSB7XG4gICAgICB2YXIgb2JqZWN0ID0gdGhpcy5fb2JqZWN0O1xuICAgICAgdmFyIGtleXMgPSB0aGlzLl9rZXlzO1xuICAgICAgdmFyIG1heEluZGV4ID0ga2V5cy5sZW5ndGggLSAxO1xuICAgICAgdmFyIGlpID0gMDtcbiAgICAgIHJldHVybiBuZXcgc3JjX0l0ZXJhdG9yX19JdGVyYXRvcihmdW5jdGlvbigpICB7XG4gICAgICAgIHZhciBrZXkgPSBrZXlzW3JldmVyc2UgPyBtYXhJbmRleCAtIGlpIDogaWldO1xuICAgICAgICByZXR1cm4gaWkrKyA+IG1heEluZGV4ID9cbiAgICAgICAgICBpdGVyYXRvckRvbmUoKSA6XG4gICAgICAgICAgaXRlcmF0b3JWYWx1ZSh0eXBlLCBrZXksIG9iamVjdFtrZXldKTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgT2JqZWN0U2VxLnByb3RvdHlwZVtJU19PUkRFUkVEX1NFTlRJTkVMXSA9IHRydWU7XG5cblxuICBjcmVhdGVDbGFzcyhJdGVyYWJsZVNlcSwgSW5kZXhlZFNlcSk7XG4gICAgZnVuY3Rpb24gSXRlcmFibGVTZXEoaXRlcmFibGUpIHtcbiAgICAgIHRoaXMuX2l0ZXJhYmxlID0gaXRlcmFibGU7XG4gICAgICB0aGlzLnNpemUgPSBpdGVyYWJsZS5sZW5ndGggfHwgaXRlcmFibGUuc2l6ZTtcbiAgICB9XG5cbiAgICBJdGVyYWJsZVNlcS5wcm90b3R5cGUuX19pdGVyYXRlVW5jYWNoZWQgPSBmdW5jdGlvbihmbiwgcmV2ZXJzZSkge1xuICAgICAgaWYgKHJldmVyc2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FjaGVSZXN1bHQoKS5fX2l0ZXJhdGUoZm4sIHJldmVyc2UpO1xuICAgICAgfVxuICAgICAgdmFyIGl0ZXJhYmxlID0gdGhpcy5faXRlcmFibGU7XG4gICAgICB2YXIgaXRlcmF0b3IgPSBnZXRJdGVyYXRvcihpdGVyYWJsZSk7XG4gICAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gICAgICBpZiAoaXNJdGVyYXRvcihpdGVyYXRvcikpIHtcbiAgICAgICAgdmFyIHN0ZXA7XG4gICAgICAgIHdoaWxlICghKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmUpIHtcbiAgICAgICAgICBpZiAoZm4oc3RlcC52YWx1ZSwgaXRlcmF0aW9ucysrLCB0aGlzKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGl0ZXJhdGlvbnM7XG4gICAgfTtcblxuICAgIEl0ZXJhYmxlU2VxLnByb3RvdHlwZS5fX2l0ZXJhdG9yVW5jYWNoZWQgPSBmdW5jdGlvbih0eXBlLCByZXZlcnNlKSB7XG4gICAgICBpZiAocmV2ZXJzZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5jYWNoZVJlc3VsdCgpLl9faXRlcmF0b3IodHlwZSwgcmV2ZXJzZSk7XG4gICAgICB9XG4gICAgICB2YXIgaXRlcmFibGUgPSB0aGlzLl9pdGVyYWJsZTtcbiAgICAgIHZhciBpdGVyYXRvciA9IGdldEl0ZXJhdG9yKGl0ZXJhYmxlKTtcbiAgICAgIGlmICghaXNJdGVyYXRvcihpdGVyYXRvcikpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBzcmNfSXRlcmF0b3JfX0l0ZXJhdG9yKGl0ZXJhdG9yRG9uZSk7XG4gICAgICB9XG4gICAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gICAgICByZXR1cm4gbmV3IHNyY19JdGVyYXRvcl9fSXRlcmF0b3IoZnVuY3Rpb24oKSAge1xuICAgICAgICB2YXIgc3RlcCA9IGl0ZXJhdG9yLm5leHQoKTtcbiAgICAgICAgcmV0dXJuIHN0ZXAuZG9uZSA/IHN0ZXAgOiBpdGVyYXRvclZhbHVlKHR5cGUsIGl0ZXJhdGlvbnMrKywgc3RlcC52YWx1ZSk7XG4gICAgICB9KTtcbiAgICB9O1xuXG5cblxuICBjcmVhdGVDbGFzcyhJdGVyYXRvclNlcSwgSW5kZXhlZFNlcSk7XG4gICAgZnVuY3Rpb24gSXRlcmF0b3JTZXEoaXRlcmF0b3IpIHtcbiAgICAgIHRoaXMuX2l0ZXJhdG9yID0gaXRlcmF0b3I7XG4gICAgICB0aGlzLl9pdGVyYXRvckNhY2hlID0gW107XG4gICAgfVxuXG4gICAgSXRlcmF0b3JTZXEucHJvdG90eXBlLl9faXRlcmF0ZVVuY2FjaGVkID0gZnVuY3Rpb24oZm4sIHJldmVyc2UpIHtcbiAgICAgIGlmIChyZXZlcnNlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhY2hlUmVzdWx0KCkuX19pdGVyYXRlKGZuLCByZXZlcnNlKTtcbiAgICAgIH1cbiAgICAgIHZhciBpdGVyYXRvciA9IHRoaXMuX2l0ZXJhdG9yO1xuICAgICAgdmFyIGNhY2hlID0gdGhpcy5faXRlcmF0b3JDYWNoZTtcbiAgICAgIHZhciBpdGVyYXRpb25zID0gMDtcbiAgICAgIHdoaWxlIChpdGVyYXRpb25zIDwgY2FjaGUubGVuZ3RoKSB7XG4gICAgICAgIGlmIChmbihjYWNoZVtpdGVyYXRpb25zXSwgaXRlcmF0aW9ucysrLCB0aGlzKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICByZXR1cm4gaXRlcmF0aW9ucztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdmFyIHN0ZXA7XG4gICAgICB3aGlsZSAoIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lKSB7XG4gICAgICAgIHZhciB2YWwgPSBzdGVwLnZhbHVlO1xuICAgICAgICBjYWNoZVtpdGVyYXRpb25zXSA9IHZhbDtcbiAgICAgICAgaWYgKGZuKHZhbCwgaXRlcmF0aW9ucysrLCB0aGlzKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGl0ZXJhdGlvbnM7XG4gICAgfTtcblxuICAgIEl0ZXJhdG9yU2VxLnByb3RvdHlwZS5fX2l0ZXJhdG9yVW5jYWNoZWQgPSBmdW5jdGlvbih0eXBlLCByZXZlcnNlKSB7XG4gICAgICBpZiAocmV2ZXJzZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5jYWNoZVJlc3VsdCgpLl9faXRlcmF0b3IodHlwZSwgcmV2ZXJzZSk7XG4gICAgICB9XG4gICAgICB2YXIgaXRlcmF0b3IgPSB0aGlzLl9pdGVyYXRvcjtcbiAgICAgIHZhciBjYWNoZSA9IHRoaXMuX2l0ZXJhdG9yQ2FjaGU7XG4gICAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gICAgICByZXR1cm4gbmV3IHNyY19JdGVyYXRvcl9fSXRlcmF0b3IoZnVuY3Rpb24oKSAge1xuICAgICAgICBpZiAoaXRlcmF0aW9ucyA+PSBjYWNoZS5sZW5ndGgpIHtcbiAgICAgICAgICB2YXIgc3RlcCA9IGl0ZXJhdG9yLm5leHQoKTtcbiAgICAgICAgICBpZiAoc3RlcC5kb25lKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RlcDtcbiAgICAgICAgICB9XG4gICAgICAgICAgY2FjaGVbaXRlcmF0aW9uc10gPSBzdGVwLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpdGVyYXRvclZhbHVlKHR5cGUsIGl0ZXJhdGlvbnMsIGNhY2hlW2l0ZXJhdGlvbnMrK10pO1xuICAgICAgfSk7XG4gICAgfTtcblxuXG5cblxuICAvLyAjIHByYWdtYSBIZWxwZXIgZnVuY3Rpb25zXG5cbiAgZnVuY3Rpb24gaXNTZXEobWF5YmVTZXEpIHtcbiAgICByZXR1cm4gISEobWF5YmVTZXEgJiYgbWF5YmVTZXFbSVNfU0VRX1NFTlRJTkVMXSk7XG4gIH1cblxuICB2YXIgRU1QVFlfU0VRO1xuXG4gIGZ1bmN0aW9uIGVtcHR5U2VxdWVuY2UoKSB7XG4gICAgcmV0dXJuIEVNUFRZX1NFUSB8fCAoRU1QVFlfU0VRID0gbmV3IEFycmF5U2VxKFtdKSk7XG4gIH1cblxuICBmdW5jdGlvbiBrZXllZFNlcUZyb21WYWx1ZSh2YWx1ZSkge1xuICAgIHZhciBzZXEgPVxuICAgICAgQXJyYXkuaXNBcnJheSh2YWx1ZSkgPyBuZXcgQXJyYXlTZXEodmFsdWUpLmZyb21FbnRyeVNlcSgpIDpcbiAgICAgIGlzSXRlcmF0b3IodmFsdWUpID8gbmV3IEl0ZXJhdG9yU2VxKHZhbHVlKS5mcm9tRW50cnlTZXEoKSA6XG4gICAgICBoYXNJdGVyYXRvcih2YWx1ZSkgPyBuZXcgSXRlcmFibGVTZXEodmFsdWUpLmZyb21FbnRyeVNlcSgpIDpcbiAgICAgIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgPyBuZXcgT2JqZWN0U2VxKHZhbHVlKSA6XG4gICAgICB1bmRlZmluZWQ7XG4gICAgaWYgKCFzZXEpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICAgICdFeHBlY3RlZCBBcnJheSBvciBpdGVyYWJsZSBvYmplY3Qgb2YgW2ssIHZdIGVudHJpZXMsICcrXG4gICAgICAgICdvciBrZXllZCBvYmplY3Q6ICcgKyB2YWx1ZVxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIHNlcTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGluZGV4ZWRTZXFGcm9tVmFsdWUodmFsdWUpIHtcbiAgICB2YXIgc2VxID0gbWF5YmVJbmRleGVkU2VxRnJvbVZhbHVlKHZhbHVlKTtcbiAgICBpZiAoIXNlcSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICAgJ0V4cGVjdGVkIEFycmF5IG9yIGl0ZXJhYmxlIG9iamVjdCBvZiB2YWx1ZXM6ICcgKyB2YWx1ZVxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIHNlcTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNlcUZyb21WYWx1ZSh2YWx1ZSkge1xuICAgIHZhciBzZXEgPSBtYXliZUluZGV4ZWRTZXFGcm9tVmFsdWUodmFsdWUpIHx8XG4gICAgICAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiBuZXcgT2JqZWN0U2VxKHZhbHVlKSk7XG4gICAgaWYgKCFzZXEpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICAgICdFeHBlY3RlZCBBcnJheSBvciBpdGVyYWJsZSBvYmplY3Qgb2YgdmFsdWVzLCBvciBrZXllZCBvYmplY3Q6ICcgKyB2YWx1ZVxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIHNlcTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1heWJlSW5kZXhlZFNlcUZyb21WYWx1ZSh2YWx1ZSkge1xuICAgIHJldHVybiAoXG4gICAgICBpc0FycmF5TGlrZSh2YWx1ZSkgPyBuZXcgQXJyYXlTZXEodmFsdWUpIDpcbiAgICAgIGlzSXRlcmF0b3IodmFsdWUpID8gbmV3IEl0ZXJhdG9yU2VxKHZhbHVlKSA6XG4gICAgICBoYXNJdGVyYXRvcih2YWx1ZSkgPyBuZXcgSXRlcmFibGVTZXEodmFsdWUpIDpcbiAgICAgIHVuZGVmaW5lZFxuICAgICk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXFJdGVyYXRlKHNlcSwgZm4sIHJldmVyc2UsIHVzZUtleXMpIHtcbiAgICB2YXIgY2FjaGUgPSBzZXEuX2NhY2hlO1xuICAgIGlmIChjYWNoZSkge1xuICAgICAgdmFyIG1heEluZGV4ID0gY2FjaGUubGVuZ3RoIC0gMTtcbiAgICAgIGZvciAodmFyIGlpID0gMDsgaWkgPD0gbWF4SW5kZXg7IGlpKyspIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gY2FjaGVbcmV2ZXJzZSA/IG1heEluZGV4IC0gaWkgOiBpaV07XG4gICAgICAgIGlmIChmbihlbnRyeVsxXSwgdXNlS2V5cyA/IGVudHJ5WzBdIDogaWksIHNlcSkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgcmV0dXJuIGlpICsgMTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGlpO1xuICAgIH1cbiAgICByZXR1cm4gc2VxLl9faXRlcmF0ZVVuY2FjaGVkKGZuLCByZXZlcnNlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNlcUl0ZXJhdG9yKHNlcSwgdHlwZSwgcmV2ZXJzZSwgdXNlS2V5cykge1xuICAgIHZhciBjYWNoZSA9IHNlcS5fY2FjaGU7XG4gICAgaWYgKGNhY2hlKSB7XG4gICAgICB2YXIgbWF4SW5kZXggPSBjYWNoZS5sZW5ndGggLSAxO1xuICAgICAgdmFyIGlpID0gMDtcbiAgICAgIHJldHVybiBuZXcgc3JjX0l0ZXJhdG9yX19JdGVyYXRvcihmdW5jdGlvbigpICB7XG4gICAgICAgIHZhciBlbnRyeSA9IGNhY2hlW3JldmVyc2UgPyBtYXhJbmRleCAtIGlpIDogaWldO1xuICAgICAgICByZXR1cm4gaWkrKyA+IG1heEluZGV4ID9cbiAgICAgICAgICBpdGVyYXRvckRvbmUoKSA6XG4gICAgICAgICAgaXRlcmF0b3JWYWx1ZSh0eXBlLCB1c2VLZXlzID8gZW50cnlbMF0gOiBpaSAtIDEsIGVudHJ5WzFdKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gc2VxLl9faXRlcmF0b3JVbmNhY2hlZCh0eXBlLCByZXZlcnNlKTtcbiAgfVxuXG4gIGNyZWF0ZUNsYXNzKENvbGxlY3Rpb24sIEl0ZXJhYmxlKTtcbiAgICBmdW5jdGlvbiBDb2xsZWN0aW9uKCkge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCdBYnN0cmFjdCcpO1xuICAgIH1cblxuXG4gIGNyZWF0ZUNsYXNzKEtleWVkQ29sbGVjdGlvbiwgQ29sbGVjdGlvbik7ZnVuY3Rpb24gS2V5ZWRDb2xsZWN0aW9uKCkge31cblxuICBjcmVhdGVDbGFzcyhJbmRleGVkQ29sbGVjdGlvbiwgQ29sbGVjdGlvbik7ZnVuY3Rpb24gSW5kZXhlZENvbGxlY3Rpb24oKSB7fVxuXG4gIGNyZWF0ZUNsYXNzKFNldENvbGxlY3Rpb24sIENvbGxlY3Rpb24pO2Z1bmN0aW9uIFNldENvbGxlY3Rpb24oKSB7fVxuXG5cbiAgQ29sbGVjdGlvbi5LZXllZCA9IEtleWVkQ29sbGVjdGlvbjtcbiAgQ29sbGVjdGlvbi5JbmRleGVkID0gSW5kZXhlZENvbGxlY3Rpb247XG4gIENvbGxlY3Rpb24uU2V0ID0gU2V0Q29sbGVjdGlvbjtcblxuICAvKipcbiAgICogQW4gZXh0ZW5zaW9uIG9mIHRoZSBcInNhbWUtdmFsdWVcIiBhbGdvcml0aG0gYXMgW2Rlc2NyaWJlZCBmb3IgdXNlIGJ5IEVTNiBNYXBcbiAgICogYW5kIFNldF0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvTWFwI0tleV9lcXVhbGl0eSlcbiAgICpcbiAgICogTmFOIGlzIGNvbnNpZGVyZWQgdGhlIHNhbWUgYXMgTmFOLCBob3dldmVyIC0wIGFuZCAwIGFyZSBjb25zaWRlcmVkIHRoZSBzYW1lXG4gICAqIHZhbHVlLCB3aGljaCBpcyBkaWZmZXJlbnQgZnJvbSB0aGUgYWxnb3JpdGhtIGRlc2NyaWJlZCBieVxuICAgKiBbYE9iamVjdC5pc2BdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL09iamVjdC9pcykuXG4gICAqXG4gICAqIFRoaXMgaXMgZXh0ZW5kZWQgZnVydGhlciB0byBhbGxvdyBPYmplY3RzIHRvIGRlc2NyaWJlIHRoZSB2YWx1ZXMgdGhleVxuICAgKiByZXByZXNlbnQsIGJ5IHdheSBvZiBgdmFsdWVPZmAgb3IgYGVxdWFsc2AgKGFuZCBgaGFzaENvZGVgKS5cbiAgICpcbiAgICogTm90ZTogYmVjYXVzZSBvZiB0aGlzIGV4dGVuc2lvbiwgdGhlIGtleSBlcXVhbGl0eSBvZiBJbW11dGFibGUuTWFwIGFuZCB0aGVcbiAgICogdmFsdWUgZXF1YWxpdHkgb2YgSW1tdXRhYmxlLlNldCB3aWxsIGRpZmZlciBmcm9tIEVTNiBNYXAgYW5kIFNldC5cbiAgICpcbiAgICogIyMjIERlZmluaW5nIGN1c3RvbSB2YWx1ZXNcbiAgICpcbiAgICogVGhlIGVhc2llc3Qgd2F5IHRvIGRlc2NyaWJlIHRoZSB2YWx1ZSBhbiBvYmplY3QgcmVwcmVzZW50cyBpcyBieSBpbXBsZW1lbnRpbmdcbiAgICogYHZhbHVlT2ZgLiBGb3IgZXhhbXBsZSwgYERhdGVgIHJlcHJlc2VudHMgYSB2YWx1ZSBieSByZXR1cm5pbmcgYSB1bml4XG4gICAqIHRpbWVzdGFtcCBmb3IgYHZhbHVlT2ZgOlxuICAgKlxuICAgKiAgICAgdmFyIGRhdGUxID0gbmV3IERhdGUoMTIzNDU2Nzg5MDAwMCk7IC8vIEZyaSBGZWIgMTMgMjAwOSAuLi5cbiAgICogICAgIHZhciBkYXRlMiA9IG5ldyBEYXRlKDEyMzQ1Njc4OTAwMDApO1xuICAgKiAgICAgZGF0ZTEudmFsdWVPZigpOyAvLyAxMjM0NTY3ODkwMDAwXG4gICAqICAgICBhc3NlcnQoIGRhdGUxICE9PSBkYXRlMiApO1xuICAgKiAgICAgYXNzZXJ0KCBJbW11dGFibGUuaXMoIGRhdGUxLCBkYXRlMiApICk7XG4gICAqXG4gICAqIE5vdGU6IG92ZXJyaWRpbmcgYHZhbHVlT2ZgIG1heSBoYXZlIG90aGVyIGltcGxpY2F0aW9ucyBpZiB5b3UgdXNlIHRoaXMgb2JqZWN0XG4gICAqIHdoZXJlIEphdmFTY3JpcHQgZXhwZWN0cyBhIHByaW1pdGl2ZSwgc3VjaCBhcyBpbXBsaWNpdCBzdHJpbmcgY29lcmNpb24uXG4gICAqXG4gICAqIEZvciBtb3JlIGNvbXBsZXggdHlwZXMsIGVzcGVjaWFsbHkgY29sbGVjdGlvbnMsIGltcGxlbWVudGluZyBgdmFsdWVPZmAgbWF5XG4gICAqIG5vdCBiZSBwZXJmb3JtYW50LiBBbiBhbHRlcm5hdGl2ZSBpcyB0byBpbXBsZW1lbnQgYGVxdWFsc2AgYW5kIGBoYXNoQ29kZWAuXG4gICAqXG4gICAqIGBlcXVhbHNgIHRha2VzIGFub3RoZXIgb2JqZWN0LCBwcmVzdW1hYmx5IG9mIHNpbWlsYXIgdHlwZSwgYW5kIHJldHVybnMgdHJ1ZVxuICAgKiBpZiB0aGUgaXQgaXMgZXF1YWwuIEVxdWFsaXR5IGlzIHN5bW1ldHJpY2FsLCBzbyB0aGUgc2FtZSByZXN1bHQgc2hvdWxkIGJlXG4gICAqIHJldHVybmVkIGlmIHRoaXMgYW5kIHRoZSBhcmd1bWVudCBhcmUgZmxpcHBlZC5cbiAgICpcbiAgICogICAgIGFzc2VydCggYS5lcXVhbHMoYikgPT09IGIuZXF1YWxzKGEpICk7XG4gICAqXG4gICAqIGBoYXNoQ29kZWAgcmV0dXJucyBhIDMyYml0IGludGVnZXIgbnVtYmVyIHJlcHJlc2VudGluZyB0aGUgb2JqZWN0IHdoaWNoIHdpbGxcbiAgICogYmUgdXNlZCB0byBkZXRlcm1pbmUgaG93IHRvIHN0b3JlIHRoZSB2YWx1ZSBvYmplY3QgaW4gYSBNYXAgb3IgU2V0LiBZb3UgbXVzdFxuICAgKiBwcm92aWRlIGJvdGggb3IgbmVpdGhlciBtZXRob2RzLCBvbmUgbXVzdCBub3QgZXhpc3Qgd2l0aG91dCB0aGUgb3RoZXIuXG4gICAqXG4gICAqIEFsc28sIGFuIGltcG9ydGFudCByZWxhdGlvbnNoaXAgYmV0d2VlbiB0aGVzZSBtZXRob2RzIG11c3QgYmUgdXBoZWxkOiBpZiB0d29cbiAgICogdmFsdWVzIGFyZSBlcXVhbCwgdGhleSAqbXVzdCogcmV0dXJuIHRoZSBzYW1lIGhhc2hDb2RlLiBJZiB0aGUgdmFsdWVzIGFyZSBub3RcbiAgICogZXF1YWwsIHRoZXkgbWlnaHQgaGF2ZSB0aGUgc2FtZSBoYXNoQ29kZTsgdGhpcyBpcyBjYWxsZWQgYSBoYXNoIGNvbGxpc2lvbixcbiAgICogYW5kIHdoaWxlIHVuZGVzaXJhYmxlIGZvciBwZXJmb3JtYW5jZSByZWFzb25zLCBpdCBpcyBhY2NlcHRhYmxlLlxuICAgKlxuICAgKiAgICAgaWYgKGEuZXF1YWxzKGIpKSB7XG4gICAqICAgICAgIGFzc2VydCggYS5oYXNoQ29kZSgpID09PSBiLmhhc2hDb2RlKCkgKTtcbiAgICogICAgIH1cbiAgICpcbiAgICogQWxsIEltbXV0YWJsZSBjb2xsZWN0aW9ucyBpbXBsZW1lbnQgYGVxdWFsc2AgYW5kIGBoYXNoQ29kZWAuXG4gICAqXG4gICAqL1xuICBmdW5jdGlvbiBpcyh2YWx1ZUEsIHZhbHVlQikge1xuICAgIGlmICh2YWx1ZUEgPT09IHZhbHVlQiB8fCAodmFsdWVBICE9PSB2YWx1ZUEgJiYgdmFsdWVCICE9PSB2YWx1ZUIpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKCF2YWx1ZUEgfHwgIXZhbHVlQikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHZhbHVlQS52YWx1ZU9mID09PSAnZnVuY3Rpb24nICYmXG4gICAgICAgIHR5cGVvZiB2YWx1ZUIudmFsdWVPZiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdmFsdWVBID0gdmFsdWVBLnZhbHVlT2YoKTtcbiAgICAgIHZhbHVlQiA9IHZhbHVlQi52YWx1ZU9mKCk7XG4gICAgfVxuICAgIHJldHVybiB0eXBlb2YgdmFsdWVBLmVxdWFscyA9PT0gJ2Z1bmN0aW9uJyAmJlxuICAgICAgdHlwZW9mIHZhbHVlQi5lcXVhbHMgPT09ICdmdW5jdGlvbicgP1xuICAgICAgICB2YWx1ZUEuZXF1YWxzKHZhbHVlQikgOlxuICAgICAgICB2YWx1ZUEgPT09IHZhbHVlQiB8fCAodmFsdWVBICE9PSB2YWx1ZUEgJiYgdmFsdWVCICE9PSB2YWx1ZUIpO1xuICB9XG5cbiAgZnVuY3Rpb24gZnJvbUpTKGpzb24sIGNvbnZlcnRlcikge1xuICAgIHJldHVybiBjb252ZXJ0ZXIgP1xuICAgICAgZnJvbUpTV2l0aChjb252ZXJ0ZXIsIGpzb24sICcnLCB7Jyc6IGpzb259KSA6XG4gICAgICBmcm9tSlNEZWZhdWx0KGpzb24pO1xuICB9XG5cbiAgZnVuY3Rpb24gZnJvbUpTV2l0aChjb252ZXJ0ZXIsIGpzb24sIGtleSwgcGFyZW50SlNPTikge1xuICAgIGlmIChBcnJheS5pc0FycmF5KGpzb24pKSB7XG4gICAgICByZXR1cm4gY29udmVydGVyLmNhbGwocGFyZW50SlNPTiwga2V5LCBJbmRleGVkU2VxKGpzb24pLm1hcChmdW5jdGlvbih2LCBrKSAge3JldHVybiBmcm9tSlNXaXRoKGNvbnZlcnRlciwgdiwgaywganNvbil9KSk7XG4gICAgfVxuICAgIGlmIChpc1BsYWluT2JqKGpzb24pKSB7XG4gICAgICByZXR1cm4gY29udmVydGVyLmNhbGwocGFyZW50SlNPTiwga2V5LCBLZXllZFNlcShqc29uKS5tYXAoZnVuY3Rpb24odiwgaykgIHtyZXR1cm4gZnJvbUpTV2l0aChjb252ZXJ0ZXIsIHYsIGssIGpzb24pfSkpO1xuICAgIH1cbiAgICByZXR1cm4ganNvbjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZyb21KU0RlZmF1bHQoanNvbikge1xuICAgIGlmIChBcnJheS5pc0FycmF5KGpzb24pKSB7XG4gICAgICByZXR1cm4gSW5kZXhlZFNlcShqc29uKS5tYXAoZnJvbUpTRGVmYXVsdCkudG9MaXN0KCk7XG4gICAgfVxuICAgIGlmIChpc1BsYWluT2JqKGpzb24pKSB7XG4gICAgICByZXR1cm4gS2V5ZWRTZXEoanNvbikubWFwKGZyb21KU0RlZmF1bHQpLnRvTWFwKCk7XG4gICAgfVxuICAgIHJldHVybiBqc29uO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNQbGFpbk9iaih2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSAmJiAodmFsdWUuY29uc3RydWN0b3IgPT09IE9iamVjdCB8fCB2YWx1ZS5jb25zdHJ1Y3RvciA9PT0gdW5kZWZpbmVkKTtcbiAgfVxuXG4gIHZhciBzcmNfTWF0aF9faW11bCA9XG4gICAgdHlwZW9mIE1hdGguaW11bCA9PT0gJ2Z1bmN0aW9uJyAmJiBNYXRoLmltdWwoMHhmZmZmZmZmZiwgMikgPT09IC0yID9cbiAgICBNYXRoLmltdWwgOlxuICAgIGZ1bmN0aW9uIHNyY19NYXRoX19pbXVsKGEsIGIpIHtcbiAgICAgIGEgPSBhIHwgMDsgLy8gaW50XG4gICAgICBiID0gYiB8IDA7IC8vIGludFxuICAgICAgdmFyIGMgPSBhICYgMHhmZmZmO1xuICAgICAgdmFyIGQgPSBiICYgMHhmZmZmO1xuICAgICAgLy8gU2hpZnQgYnkgMCBmaXhlcyB0aGUgc2lnbiBvbiB0aGUgaGlnaCBwYXJ0LlxuICAgICAgcmV0dXJuIChjICogZCkgKyAoKCgoYSA+Pj4gMTYpICogZCArIGMgKiAoYiA+Pj4gMTYpKSA8PCAxNikgPj4+IDApIHwgMDsgLy8gaW50XG4gICAgfTtcblxuICAvLyB2OCBoYXMgYW4gb3B0aW1pemF0aW9uIGZvciBzdG9yaW5nIDMxLWJpdCBzaWduZWQgbnVtYmVycy5cbiAgLy8gVmFsdWVzIHdoaWNoIGhhdmUgZWl0aGVyIDAwIG9yIDExIGFzIHRoZSBoaWdoIG9yZGVyIGJpdHMgcXVhbGlmeS5cbiAgLy8gVGhpcyBmdW5jdGlvbiBkcm9wcyB0aGUgaGlnaGVzdCBvcmRlciBiaXQgaW4gYSBzaWduZWQgbnVtYmVyLCBtYWludGFpbmluZ1xuICAvLyB0aGUgc2lnbiBiaXQuXG4gIGZ1bmN0aW9uIHNtaShpMzIpIHtcbiAgICByZXR1cm4gKChpMzIgPj4+IDEpICYgMHg0MDAwMDAwMCkgfCAoaTMyICYgMHhCRkZGRkZGRik7XG4gIH1cblxuICBmdW5jdGlvbiBoYXNoKG8pIHtcbiAgICBpZiAobyA9PT0gZmFsc2UgfHwgbyA9PT0gbnVsbCB8fCBvID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIG8udmFsdWVPZiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgbyA9IG8udmFsdWVPZigpO1xuICAgICAgaWYgKG8gPT09IGZhbHNlIHx8IG8gPT09IG51bGwgfHwgbyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiAwO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAobyA9PT0gdHJ1ZSkge1xuICAgICAgcmV0dXJuIDE7XG4gICAgfVxuICAgIHZhciB0eXBlID0gdHlwZW9mIG87XG4gICAgaWYgKHR5cGUgPT09ICdudW1iZXInKSB7XG4gICAgICB2YXIgaCA9IG8gfCAwO1xuICAgICAgaWYgKGggIT09IG8pIHtcbiAgICAgICAgaCBePSBvICogMHhGRkZGRkZGRjtcbiAgICAgIH1cbiAgICAgIHdoaWxlIChvID4gMHhGRkZGRkZGRikge1xuICAgICAgICBvIC89IDB4RkZGRkZGRkY7XG4gICAgICAgIGggXj0gbztcbiAgICAgIH1cbiAgICAgIHJldHVybiBzbWkoaCk7XG4gICAgfVxuICAgIGlmICh0eXBlID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIG8ubGVuZ3RoID4gU1RSSU5HX0hBU0hfQ0FDSEVfTUlOX1NUUkxFTiA/IGNhY2hlZEhhc2hTdHJpbmcobykgOiBoYXNoU3RyaW5nKG8pO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIG8uaGFzaENvZGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiBvLmhhc2hDb2RlKCk7XG4gICAgfVxuICAgIHJldHVybiBoYXNoSlNPYmoobyk7XG4gIH1cblxuICBmdW5jdGlvbiBjYWNoZWRIYXNoU3RyaW5nKHN0cmluZykge1xuICAgIHZhciBoYXNoID0gc3RyaW5nSGFzaENhY2hlW3N0cmluZ107XG4gICAgaWYgKGhhc2ggPT09IHVuZGVmaW5lZCkge1xuICAgICAgaGFzaCA9IGhhc2hTdHJpbmcoc3RyaW5nKTtcbiAgICAgIGlmIChTVFJJTkdfSEFTSF9DQUNIRV9TSVpFID09PSBTVFJJTkdfSEFTSF9DQUNIRV9NQVhfU0laRSkge1xuICAgICAgICBTVFJJTkdfSEFTSF9DQUNIRV9TSVpFID0gMDtcbiAgICAgICAgc3RyaW5nSGFzaENhY2hlID0ge307XG4gICAgICB9XG4gICAgICBTVFJJTkdfSEFTSF9DQUNIRV9TSVpFKys7XG4gICAgICBzdHJpbmdIYXNoQ2FjaGVbc3RyaW5nXSA9IGhhc2g7XG4gICAgfVxuICAgIHJldHVybiBoYXNoO1xuICB9XG5cbiAgLy8gaHR0cDovL2pzcGVyZi5jb20vaGFzaGluZy1zdHJpbmdzXG4gIGZ1bmN0aW9uIGhhc2hTdHJpbmcoc3RyaW5nKSB7XG4gICAgLy8gVGhpcyBpcyB0aGUgaGFzaCBmcm9tIEpWTVxuICAgIC8vIFRoZSBoYXNoIGNvZGUgZm9yIGEgc3RyaW5nIGlzIGNvbXB1dGVkIGFzXG4gICAgLy8gc1swXSAqIDMxIF4gKG4gLSAxKSArIHNbMV0gKiAzMSBeIChuIC0gMikgKyAuLi4gKyBzW24gLSAxXSxcbiAgICAvLyB3aGVyZSBzW2ldIGlzIHRoZSBpdGggY2hhcmFjdGVyIG9mIHRoZSBzdHJpbmcgYW5kIG4gaXMgdGhlIGxlbmd0aCBvZlxuICAgIC8vIHRoZSBzdHJpbmcuIFdlIFwibW9kXCIgdGhlIHJlc3VsdCB0byBtYWtlIGl0IGJldHdlZW4gMCAoaW5jbHVzaXZlKSBhbmQgMl4zMVxuICAgIC8vIChleGNsdXNpdmUpIGJ5IGRyb3BwaW5nIGhpZ2ggYml0cy5cbiAgICB2YXIgaGFzaCA9IDA7XG4gICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IHN0cmluZy5sZW5ndGg7IGlpKyspIHtcbiAgICAgIGhhc2ggPSAzMSAqIGhhc2ggKyBzdHJpbmcuY2hhckNvZGVBdChpaSkgfCAwO1xuICAgIH1cbiAgICByZXR1cm4gc21pKGhhc2gpO1xuICB9XG5cbiAgZnVuY3Rpb24gaGFzaEpTT2JqKG9iaikge1xuICAgIHZhciBoYXNoID0gd2Vha01hcCAmJiB3ZWFrTWFwLmdldChvYmopO1xuICAgIGlmIChoYXNoKSByZXR1cm4gaGFzaDtcblxuICAgIGhhc2ggPSBvYmpbVUlEX0hBU0hfS0VZXTtcbiAgICBpZiAoaGFzaCkgcmV0dXJuIGhhc2g7XG5cbiAgICBpZiAoIWNhbkRlZmluZVByb3BlcnR5KSB7XG4gICAgICBoYXNoID0gb2JqLnByb3BlcnR5SXNFbnVtZXJhYmxlICYmIG9iai5wcm9wZXJ0eUlzRW51bWVyYWJsZVtVSURfSEFTSF9LRVldO1xuICAgICAgaWYgKGhhc2gpIHJldHVybiBoYXNoO1xuXG4gICAgICBoYXNoID0gZ2V0SUVOb2RlSGFzaChvYmopO1xuICAgICAgaWYgKGhhc2gpIHJldHVybiBoYXNoO1xuICAgIH1cblxuICAgIGlmIChPYmplY3QuaXNFeHRlbnNpYmxlICYmICFPYmplY3QuaXNFeHRlbnNpYmxlKG9iaikpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTm9uLWV4dGVuc2libGUgb2JqZWN0cyBhcmUgbm90IGFsbG93ZWQgYXMga2V5cy4nKTtcbiAgICB9XG5cbiAgICBoYXNoID0gKytvYmpIYXNoVUlEO1xuICAgIGlmIChvYmpIYXNoVUlEICYgMHg0MDAwMDAwMCkge1xuICAgICAgb2JqSGFzaFVJRCA9IDA7XG4gICAgfVxuXG4gICAgaWYgKHdlYWtNYXApIHtcbiAgICAgIHdlYWtNYXAuc2V0KG9iaiwgaGFzaCk7XG4gICAgfSBlbHNlIGlmIChjYW5EZWZpbmVQcm9wZXJ0eSkge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwgVUlEX0hBU0hfS0VZLCB7XG4gICAgICAgICdlbnVtZXJhYmxlJzogZmFsc2UsXG4gICAgICAgICdjb25maWd1cmFibGUnOiBmYWxzZSxcbiAgICAgICAgJ3dyaXRhYmxlJzogZmFsc2UsXG4gICAgICAgICd2YWx1ZSc6IGhhc2hcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAob2JqLnByb3BlcnR5SXNFbnVtZXJhYmxlICYmXG4gICAgICAgICAgICAgICBvYmoucHJvcGVydHlJc0VudW1lcmFibGUgPT09IG9iai5jb25zdHJ1Y3Rvci5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUpIHtcbiAgICAgIC8vIFNpbmNlIHdlIGNhbid0IGRlZmluZSBhIG5vbi1lbnVtZXJhYmxlIHByb3BlcnR5IG9uIHRoZSBvYmplY3RcbiAgICAgIC8vIHdlJ2xsIGhpamFjayBvbmUgb2YgdGhlIGxlc3MtdXNlZCBub24tZW51bWVyYWJsZSBwcm9wZXJ0aWVzIHRvXG4gICAgICAvLyBzYXZlIG91ciBoYXNoIG9uIGl0LiBTaW5jZSB0aGlzIGlzIGEgZnVuY3Rpb24gaXQgd2lsbCBub3Qgc2hvdyB1cCBpblxuICAgICAgLy8gYEpTT04uc3RyaW5naWZ5YCB3aGljaCBpcyB3aGF0IHdlIHdhbnQuXG4gICAgICBvYmoucHJvcGVydHlJc0VudW1lcmFibGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9O1xuICAgICAgb2JqLnByb3BlcnR5SXNFbnVtZXJhYmxlW1VJRF9IQVNIX0tFWV0gPSBoYXNoO1xuICAgIH0gZWxzZSBpZiAob2JqLm5vZGVUeXBlKSB7XG4gICAgICAvLyBBdCB0aGlzIHBvaW50IHdlIGNvdWxkbid0IGdldCB0aGUgSUUgYHVuaXF1ZUlEYCB0byB1c2UgYXMgYSBoYXNoXG4gICAgICAvLyBhbmQgd2UgY291bGRuJ3QgdXNlIGEgbm9uLWVudW1lcmFibGUgcHJvcGVydHkgdG8gZXhwbG9pdCB0aGVcbiAgICAgIC8vIGRvbnRFbnVtIGJ1ZyBzbyB3ZSBzaW1wbHkgYWRkIHRoZSBgVUlEX0hBU0hfS0VZYCBvbiB0aGUgbm9kZVxuICAgICAgLy8gaXRzZWxmLlxuICAgICAgb2JqW1VJRF9IQVNIX0tFWV0gPSBoYXNoO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byBzZXQgYSBub24tZW51bWVyYWJsZSBwcm9wZXJ0eSBvbiBvYmplY3QuJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGhhc2g7XG4gIH1cblxuICAvLyBUcnVlIGlmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSB3b3JrcyBhcyBleHBlY3RlZC4gSUU4IGZhaWxzIHRoaXMgdGVzdC5cbiAgdmFyIGNhbkRlZmluZVByb3BlcnR5ID0gKGZ1bmN0aW9uKCkge1xuICAgIHRyeSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sICdAJywge30pO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfSgpKTtcblxuICAvLyBJRSBoYXMgYSBgdW5pcXVlSURgIHByb3BlcnR5IG9uIERPTSBub2Rlcy4gV2UgY2FuIGNvbnN0cnVjdCB0aGUgaGFzaCBmcm9tIGl0XG4gIC8vIGFuZCBhdm9pZCBtZW1vcnkgbGVha3MgZnJvbSB0aGUgSUUgY2xvbmVOb2RlIGJ1Zy5cbiAgZnVuY3Rpb24gZ2V0SUVOb2RlSGFzaChub2RlKSB7XG4gICAgaWYgKG5vZGUgJiYgbm9kZS5ub2RlVHlwZSA+IDApIHtcbiAgICAgIHN3aXRjaCAobm9kZS5ub2RlVHlwZSkge1xuICAgICAgICBjYXNlIDE6IC8vIEVsZW1lbnRcbiAgICAgICAgICByZXR1cm4gbm9kZS51bmlxdWVJRDtcbiAgICAgICAgY2FzZSA5OiAvLyBEb2N1bWVudFxuICAgICAgICAgIHJldHVybiBub2RlLmRvY3VtZW50RWxlbWVudCAmJiBub2RlLmRvY3VtZW50RWxlbWVudC51bmlxdWVJRDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBJZiBwb3NzaWJsZSwgdXNlIGEgV2Vha01hcC5cbiAgdmFyIHdlYWtNYXAgPSB0eXBlb2YgV2Vha01hcCA9PT0gJ2Z1bmN0aW9uJyAmJiBuZXcgV2Vha01hcCgpO1xuXG4gIHZhciBvYmpIYXNoVUlEID0gMDtcblxuICB2YXIgVUlEX0hBU0hfS0VZID0gJ19faW1tdXRhYmxlaGFzaF9fJztcbiAgaWYgKHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicpIHtcbiAgICBVSURfSEFTSF9LRVkgPSBTeW1ib2woVUlEX0hBU0hfS0VZKTtcbiAgfVxuXG4gIHZhciBTVFJJTkdfSEFTSF9DQUNIRV9NSU5fU1RSTEVOID0gMTY7XG4gIHZhciBTVFJJTkdfSEFTSF9DQUNIRV9NQVhfU0laRSA9IDI1NTtcbiAgdmFyIFNUUklOR19IQVNIX0NBQ0hFX1NJWkUgPSAwO1xuICB2YXIgc3RyaW5nSGFzaENhY2hlID0ge307XG5cbiAgZnVuY3Rpb24gaW52YXJpYW50KGNvbmRpdGlvbiwgZXJyb3IpIHtcbiAgICBpZiAoIWNvbmRpdGlvbikgdGhyb3cgbmV3IEVycm9yKGVycm9yKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFzc2VydE5vdEluZmluaXRlKHNpemUpIHtcbiAgICBpbnZhcmlhbnQoXG4gICAgICBzaXplICE9PSBJbmZpbml0eSxcbiAgICAgICdDYW5ub3QgcGVyZm9ybSB0aGlzIGFjdGlvbiB3aXRoIGFuIGluZmluaXRlIHNpemUuJ1xuICAgICk7XG4gIH1cblxuICBjcmVhdGVDbGFzcyhUb0tleWVkU2VxdWVuY2UsIEtleWVkU2VxKTtcbiAgICBmdW5jdGlvbiBUb0tleWVkU2VxdWVuY2UoaW5kZXhlZCwgdXNlS2V5cykge1xuICAgICAgdGhpcy5faXRlciA9IGluZGV4ZWQ7XG4gICAgICB0aGlzLl91c2VLZXlzID0gdXNlS2V5cztcbiAgICAgIHRoaXMuc2l6ZSA9IGluZGV4ZWQuc2l6ZTtcbiAgICB9XG5cbiAgICBUb0tleWVkU2VxdWVuY2UucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKGtleSwgbm90U2V0VmFsdWUpIHtcbiAgICAgIHJldHVybiB0aGlzLl9pdGVyLmdldChrZXksIG5vdFNldFZhbHVlKTtcbiAgICB9O1xuXG4gICAgVG9LZXllZFNlcXVlbmNlLnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiB0aGlzLl9pdGVyLmhhcyhrZXkpO1xuICAgIH07XG5cbiAgICBUb0tleWVkU2VxdWVuY2UucHJvdG90eXBlLnZhbHVlU2VxID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5faXRlci52YWx1ZVNlcSgpO1xuICAgIH07XG5cbiAgICBUb0tleWVkU2VxdWVuY2UucHJvdG90eXBlLnJldmVyc2UgPSBmdW5jdGlvbigpIHt2YXIgdGhpcyQwID0gdGhpcztcbiAgICAgIHZhciByZXZlcnNlZFNlcXVlbmNlID0gcmV2ZXJzZUZhY3RvcnkodGhpcywgdHJ1ZSk7XG4gICAgICBpZiAoIXRoaXMuX3VzZUtleXMpIHtcbiAgICAgICAgcmV2ZXJzZWRTZXF1ZW5jZS52YWx1ZVNlcSA9IGZ1bmN0aW9uKCkgIHtyZXR1cm4gdGhpcyQwLl9pdGVyLnRvU2VxKCkucmV2ZXJzZSgpfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXZlcnNlZFNlcXVlbmNlO1xuICAgIH07XG5cbiAgICBUb0tleWVkU2VxdWVuY2UucHJvdG90eXBlLm1hcCA9IGZ1bmN0aW9uKG1hcHBlciwgY29udGV4dCkge3ZhciB0aGlzJDAgPSB0aGlzO1xuICAgICAgdmFyIG1hcHBlZFNlcXVlbmNlID0gbWFwRmFjdG9yeSh0aGlzLCBtYXBwZXIsIGNvbnRleHQpO1xuICAgICAgaWYgKCF0aGlzLl91c2VLZXlzKSB7XG4gICAgICAgIG1hcHBlZFNlcXVlbmNlLnZhbHVlU2VxID0gZnVuY3Rpb24oKSAge3JldHVybiB0aGlzJDAuX2l0ZXIudG9TZXEoKS5tYXAobWFwcGVyLCBjb250ZXh0KX07XG4gICAgICB9XG4gICAgICByZXR1cm4gbWFwcGVkU2VxdWVuY2U7XG4gICAgfTtcblxuICAgIFRvS2V5ZWRTZXF1ZW5jZS5wcm90b3R5cGUuX19pdGVyYXRlID0gZnVuY3Rpb24oZm4sIHJldmVyc2UpIHt2YXIgdGhpcyQwID0gdGhpcztcbiAgICAgIHZhciBpaTtcbiAgICAgIHJldHVybiB0aGlzLl9pdGVyLl9faXRlcmF0ZShcbiAgICAgICAgdGhpcy5fdXNlS2V5cyA/XG4gICAgICAgICAgZnVuY3Rpb24odiwgaykgIHtyZXR1cm4gZm4odiwgaywgdGhpcyQwKX0gOlxuICAgICAgICAgICgoaWkgPSByZXZlcnNlID8gcmVzb2x2ZVNpemUodGhpcykgOiAwKSxcbiAgICAgICAgICAgIGZ1bmN0aW9uKHYgKSB7cmV0dXJuIGZuKHYsIHJldmVyc2UgPyAtLWlpIDogaWkrKywgdGhpcyQwKX0pLFxuICAgICAgICByZXZlcnNlXG4gICAgICApO1xuICAgIH07XG5cbiAgICBUb0tleWVkU2VxdWVuY2UucHJvdG90eXBlLl9faXRlcmF0b3IgPSBmdW5jdGlvbih0eXBlLCByZXZlcnNlKSB7XG4gICAgICBpZiAodGhpcy5fdXNlS2V5cykge1xuICAgICAgICByZXR1cm4gdGhpcy5faXRlci5fX2l0ZXJhdG9yKHR5cGUsIHJldmVyc2UpO1xuICAgICAgfVxuICAgICAgdmFyIGl0ZXJhdG9yID0gdGhpcy5faXRlci5fX2l0ZXJhdG9yKElURVJBVEVfVkFMVUVTLCByZXZlcnNlKTtcbiAgICAgIHZhciBpaSA9IHJldmVyc2UgPyByZXNvbHZlU2l6ZSh0aGlzKSA6IDA7XG4gICAgICByZXR1cm4gbmV3IHNyY19JdGVyYXRvcl9fSXRlcmF0b3IoZnVuY3Rpb24oKSAge1xuICAgICAgICB2YXIgc3RlcCA9IGl0ZXJhdG9yLm5leHQoKTtcbiAgICAgICAgcmV0dXJuIHN0ZXAuZG9uZSA/IHN0ZXAgOlxuICAgICAgICAgIGl0ZXJhdG9yVmFsdWUodHlwZSwgcmV2ZXJzZSA/IC0taWkgOiBpaSsrLCBzdGVwLnZhbHVlLCBzdGVwKTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgVG9LZXllZFNlcXVlbmNlLnByb3RvdHlwZVtJU19PUkRFUkVEX1NFTlRJTkVMXSA9IHRydWU7XG5cblxuICBjcmVhdGVDbGFzcyhUb0luZGV4ZWRTZXF1ZW5jZSwgSW5kZXhlZFNlcSk7XG4gICAgZnVuY3Rpb24gVG9JbmRleGVkU2VxdWVuY2UoaXRlcikge1xuICAgICAgdGhpcy5faXRlciA9IGl0ZXI7XG4gICAgICB0aGlzLnNpemUgPSBpdGVyLnNpemU7XG4gICAgfVxuXG4gICAgVG9JbmRleGVkU2VxdWVuY2UucHJvdG90eXBlLmNvbnRhaW5zID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJldHVybiB0aGlzLl9pdGVyLmNvbnRhaW5zKHZhbHVlKTtcbiAgICB9O1xuXG4gICAgVG9JbmRleGVkU2VxdWVuY2UucHJvdG90eXBlLl9faXRlcmF0ZSA9IGZ1bmN0aW9uKGZuLCByZXZlcnNlKSB7dmFyIHRoaXMkMCA9IHRoaXM7XG4gICAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gICAgICByZXR1cm4gdGhpcy5faXRlci5fX2l0ZXJhdGUoZnVuY3Rpb24odiApIHtyZXR1cm4gZm4odiwgaXRlcmF0aW9ucysrLCB0aGlzJDApfSwgcmV2ZXJzZSk7XG4gICAgfTtcblxuICAgIFRvSW5kZXhlZFNlcXVlbmNlLnByb3RvdHlwZS5fX2l0ZXJhdG9yID0gZnVuY3Rpb24odHlwZSwgcmV2ZXJzZSkge1xuICAgICAgdmFyIGl0ZXJhdG9yID0gdGhpcy5faXRlci5fX2l0ZXJhdG9yKElURVJBVEVfVkFMVUVTLCByZXZlcnNlKTtcbiAgICAgIHZhciBpdGVyYXRpb25zID0gMDtcbiAgICAgIHJldHVybiBuZXcgc3JjX0l0ZXJhdG9yX19JdGVyYXRvcihmdW5jdGlvbigpICB7XG4gICAgICAgIHZhciBzdGVwID0gaXRlcmF0b3IubmV4dCgpO1xuICAgICAgICByZXR1cm4gc3RlcC5kb25lID8gc3RlcCA6XG4gICAgICAgICAgaXRlcmF0b3JWYWx1ZSh0eXBlLCBpdGVyYXRpb25zKyssIHN0ZXAudmFsdWUsIHN0ZXApXG4gICAgICB9KTtcbiAgICB9O1xuXG5cblxuICBjcmVhdGVDbGFzcyhUb1NldFNlcXVlbmNlLCBTZXRTZXEpO1xuICAgIGZ1bmN0aW9uIFRvU2V0U2VxdWVuY2UoaXRlcikge1xuICAgICAgdGhpcy5faXRlciA9IGl0ZXI7XG4gICAgICB0aGlzLnNpemUgPSBpdGVyLnNpemU7XG4gICAgfVxuXG4gICAgVG9TZXRTZXF1ZW5jZS5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gdGhpcy5faXRlci5jb250YWlucyhrZXkpO1xuICAgIH07XG5cbiAgICBUb1NldFNlcXVlbmNlLnByb3RvdHlwZS5fX2l0ZXJhdGUgPSBmdW5jdGlvbihmbiwgcmV2ZXJzZSkge3ZhciB0aGlzJDAgPSB0aGlzO1xuICAgICAgcmV0dXJuIHRoaXMuX2l0ZXIuX19pdGVyYXRlKGZ1bmN0aW9uKHYgKSB7cmV0dXJuIGZuKHYsIHYsIHRoaXMkMCl9LCByZXZlcnNlKTtcbiAgICB9O1xuXG4gICAgVG9TZXRTZXF1ZW5jZS5wcm90b3R5cGUuX19pdGVyYXRvciA9IGZ1bmN0aW9uKHR5cGUsIHJldmVyc2UpIHtcbiAgICAgIHZhciBpdGVyYXRvciA9IHRoaXMuX2l0ZXIuX19pdGVyYXRvcihJVEVSQVRFX1ZBTFVFUywgcmV2ZXJzZSk7XG4gICAgICByZXR1cm4gbmV3IHNyY19JdGVyYXRvcl9fSXRlcmF0b3IoZnVuY3Rpb24oKSAge1xuICAgICAgICB2YXIgc3RlcCA9IGl0ZXJhdG9yLm5leHQoKTtcbiAgICAgICAgcmV0dXJuIHN0ZXAuZG9uZSA/IHN0ZXAgOlxuICAgICAgICAgIGl0ZXJhdG9yVmFsdWUodHlwZSwgc3RlcC52YWx1ZSwgc3RlcC52YWx1ZSwgc3RlcCk7XG4gICAgICB9KTtcbiAgICB9O1xuXG5cblxuICBjcmVhdGVDbGFzcyhGcm9tRW50cmllc1NlcXVlbmNlLCBLZXllZFNlcSk7XG4gICAgZnVuY3Rpb24gRnJvbUVudHJpZXNTZXF1ZW5jZShlbnRyaWVzKSB7XG4gICAgICB0aGlzLl9pdGVyID0gZW50cmllcztcbiAgICAgIHRoaXMuc2l6ZSA9IGVudHJpZXMuc2l6ZTtcbiAgICB9XG5cbiAgICBGcm9tRW50cmllc1NlcXVlbmNlLnByb3RvdHlwZS5lbnRyeVNlcSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2l0ZXIudG9TZXEoKTtcbiAgICB9O1xuXG4gICAgRnJvbUVudHJpZXNTZXF1ZW5jZS5wcm90b3R5cGUuX19pdGVyYXRlID0gZnVuY3Rpb24oZm4sIHJldmVyc2UpIHt2YXIgdGhpcyQwID0gdGhpcztcbiAgICAgIHJldHVybiB0aGlzLl9pdGVyLl9faXRlcmF0ZShmdW5jdGlvbihlbnRyeSApIHtcbiAgICAgICAgLy8gQ2hlY2sgaWYgZW50cnkgZXhpc3RzIGZpcnN0IHNvIGFycmF5IGFjY2VzcyBkb2Vzbid0IHRocm93IGZvciBob2xlc1xuICAgICAgICAvLyBpbiB0aGUgcGFyZW50IGl0ZXJhdGlvbi5cbiAgICAgICAgaWYgKGVudHJ5KSB7XG4gICAgICAgICAgdmFsaWRhdGVFbnRyeShlbnRyeSk7XG4gICAgICAgICAgcmV0dXJuIGZuKGVudHJ5WzFdLCBlbnRyeVswXSwgdGhpcyQwKTtcbiAgICAgICAgfVxuICAgICAgfSwgcmV2ZXJzZSk7XG4gICAgfTtcblxuICAgIEZyb21FbnRyaWVzU2VxdWVuY2UucHJvdG90eXBlLl9faXRlcmF0b3IgPSBmdW5jdGlvbih0eXBlLCByZXZlcnNlKSB7XG4gICAgICB2YXIgaXRlcmF0b3IgPSB0aGlzLl9pdGVyLl9faXRlcmF0b3IoSVRFUkFURV9WQUxVRVMsIHJldmVyc2UpO1xuICAgICAgcmV0dXJuIG5ldyBzcmNfSXRlcmF0b3JfX0l0ZXJhdG9yKGZ1bmN0aW9uKCkgIHtcbiAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICB2YXIgc3RlcCA9IGl0ZXJhdG9yLm5leHQoKTtcbiAgICAgICAgICBpZiAoc3RlcC5kb25lKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RlcDtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIGVudHJ5ID0gc3RlcC52YWx1ZTtcbiAgICAgICAgICAvLyBDaGVjayBpZiBlbnRyeSBleGlzdHMgZmlyc3Qgc28gYXJyYXkgYWNjZXNzIGRvZXNuJ3QgdGhyb3cgZm9yIGhvbGVzXG4gICAgICAgICAgLy8gaW4gdGhlIHBhcmVudCBpdGVyYXRpb24uXG4gICAgICAgICAgaWYgKGVudHJ5KSB7XG4gICAgICAgICAgICB2YWxpZGF0ZUVudHJ5KGVudHJ5KTtcbiAgICAgICAgICAgIHJldHVybiB0eXBlID09PSBJVEVSQVRFX0VOVFJJRVMgPyBzdGVwIDpcbiAgICAgICAgICAgICAgaXRlcmF0b3JWYWx1ZSh0eXBlLCBlbnRyeVswXSwgZW50cnlbMV0sIHN0ZXApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfTtcblxuXG4gIFRvSW5kZXhlZFNlcXVlbmNlLnByb3RvdHlwZS5jYWNoZVJlc3VsdCA9XG4gIFRvS2V5ZWRTZXF1ZW5jZS5wcm90b3R5cGUuY2FjaGVSZXN1bHQgPVxuICBUb1NldFNlcXVlbmNlLnByb3RvdHlwZS5jYWNoZVJlc3VsdCA9XG4gIEZyb21FbnRyaWVzU2VxdWVuY2UucHJvdG90eXBlLmNhY2hlUmVzdWx0ID1cbiAgICBjYWNoZVJlc3VsdFRocm91Z2g7XG5cblxuICBmdW5jdGlvbiBmbGlwRmFjdG9yeShpdGVyYWJsZSkge1xuICAgIHZhciBmbGlwU2VxdWVuY2UgPSBtYWtlU2VxdWVuY2UoaXRlcmFibGUpO1xuICAgIGZsaXBTZXF1ZW5jZS5faXRlciA9IGl0ZXJhYmxlO1xuICAgIGZsaXBTZXF1ZW5jZS5zaXplID0gaXRlcmFibGUuc2l6ZTtcbiAgICBmbGlwU2VxdWVuY2UuZmxpcCA9IGZ1bmN0aW9uKCkgIHtyZXR1cm4gaXRlcmFibGV9O1xuICAgIGZsaXBTZXF1ZW5jZS5yZXZlcnNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHJldmVyc2VkU2VxdWVuY2UgPSBpdGVyYWJsZS5yZXZlcnNlLmFwcGx5KHRoaXMpOyAvLyBzdXBlci5yZXZlcnNlKClcbiAgICAgIHJldmVyc2VkU2VxdWVuY2UuZmxpcCA9IGZ1bmN0aW9uKCkgIHtyZXR1cm4gaXRlcmFibGUucmV2ZXJzZSgpfTtcbiAgICAgIHJldHVybiByZXZlcnNlZFNlcXVlbmNlO1xuICAgIH07XG4gICAgZmxpcFNlcXVlbmNlLmhhcyA9IGZ1bmN0aW9uKGtleSApIHtyZXR1cm4gaXRlcmFibGUuY29udGFpbnMoa2V5KX07XG4gICAgZmxpcFNlcXVlbmNlLmNvbnRhaW5zID0gZnVuY3Rpb24oa2V5ICkge3JldHVybiBpdGVyYWJsZS5oYXMoa2V5KX07XG4gICAgZmxpcFNlcXVlbmNlLmNhY2hlUmVzdWx0ID0gY2FjaGVSZXN1bHRUaHJvdWdoO1xuICAgIGZsaXBTZXF1ZW5jZS5fX2l0ZXJhdGVVbmNhY2hlZCA9IGZ1bmN0aW9uIChmbiwgcmV2ZXJzZSkge3ZhciB0aGlzJDAgPSB0aGlzO1xuICAgICAgcmV0dXJuIGl0ZXJhYmxlLl9faXRlcmF0ZShmdW5jdGlvbih2LCBrKSAge3JldHVybiBmbihrLCB2LCB0aGlzJDApICE9PSBmYWxzZX0sIHJldmVyc2UpO1xuICAgIH1cbiAgICBmbGlwU2VxdWVuY2UuX19pdGVyYXRvclVuY2FjaGVkID0gZnVuY3Rpb24odHlwZSwgcmV2ZXJzZSkge1xuICAgICAgaWYgKHR5cGUgPT09IElURVJBVEVfRU5UUklFUykge1xuICAgICAgICB2YXIgaXRlcmF0b3IgPSBpdGVyYWJsZS5fX2l0ZXJhdG9yKHR5cGUsIHJldmVyc2UpO1xuICAgICAgICByZXR1cm4gbmV3IHNyY19JdGVyYXRvcl9fSXRlcmF0b3IoZnVuY3Rpb24oKSAge1xuICAgICAgICAgIHZhciBzdGVwID0gaXRlcmF0b3IubmV4dCgpO1xuICAgICAgICAgIGlmICghc3RlcC5kb25lKSB7XG4gICAgICAgICAgICB2YXIgayA9IHN0ZXAudmFsdWVbMF07XG4gICAgICAgICAgICBzdGVwLnZhbHVlWzBdID0gc3RlcC52YWx1ZVsxXTtcbiAgICAgICAgICAgIHN0ZXAudmFsdWVbMV0gPSBrO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gc3RlcDtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gaXRlcmFibGUuX19pdGVyYXRvcihcbiAgICAgICAgdHlwZSA9PT0gSVRFUkFURV9WQUxVRVMgPyBJVEVSQVRFX0tFWVMgOiBJVEVSQVRFX1ZBTFVFUyxcbiAgICAgICAgcmV2ZXJzZVxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIGZsaXBTZXF1ZW5jZTtcbiAgfVxuXG5cbiAgZnVuY3Rpb24gbWFwRmFjdG9yeShpdGVyYWJsZSwgbWFwcGVyLCBjb250ZXh0KSB7XG4gICAgdmFyIG1hcHBlZFNlcXVlbmNlID0gbWFrZVNlcXVlbmNlKGl0ZXJhYmxlKTtcbiAgICBtYXBwZWRTZXF1ZW5jZS5zaXplID0gaXRlcmFibGUuc2l6ZTtcbiAgICBtYXBwZWRTZXF1ZW5jZS5oYXMgPSBmdW5jdGlvbihrZXkgKSB7cmV0dXJuIGl0ZXJhYmxlLmhhcyhrZXkpfTtcbiAgICBtYXBwZWRTZXF1ZW5jZS5nZXQgPSBmdW5jdGlvbihrZXksIG5vdFNldFZhbHVlKSAge1xuICAgICAgdmFyIHYgPSBpdGVyYWJsZS5nZXQoa2V5LCBOT1RfU0VUKTtcbiAgICAgIHJldHVybiB2ID09PSBOT1RfU0VUID9cbiAgICAgICAgbm90U2V0VmFsdWUgOlxuICAgICAgICBtYXBwZXIuY2FsbChjb250ZXh0LCB2LCBrZXksIGl0ZXJhYmxlKTtcbiAgICB9O1xuICAgIG1hcHBlZFNlcXVlbmNlLl9faXRlcmF0ZVVuY2FjaGVkID0gZnVuY3Rpb24gKGZuLCByZXZlcnNlKSB7dmFyIHRoaXMkMCA9IHRoaXM7XG4gICAgICByZXR1cm4gaXRlcmFibGUuX19pdGVyYXRlKFxuICAgICAgICBmdW5jdGlvbih2LCBrLCBjKSAge3JldHVybiBmbihtYXBwZXIuY2FsbChjb250ZXh0LCB2LCBrLCBjKSwgaywgdGhpcyQwKSAhPT0gZmFsc2V9LFxuICAgICAgICByZXZlcnNlXG4gICAgICApO1xuICAgIH1cbiAgICBtYXBwZWRTZXF1ZW5jZS5fX2l0ZXJhdG9yVW5jYWNoZWQgPSBmdW5jdGlvbiAodHlwZSwgcmV2ZXJzZSkge1xuICAgICAgdmFyIGl0ZXJhdG9yID0gaXRlcmFibGUuX19pdGVyYXRvcihJVEVSQVRFX0VOVFJJRVMsIHJldmVyc2UpO1xuICAgICAgcmV0dXJuIG5ldyBzcmNfSXRlcmF0b3JfX0l0ZXJhdG9yKGZ1bmN0aW9uKCkgIHtcbiAgICAgICAgdmFyIHN0ZXAgPSBpdGVyYXRvci5uZXh0KCk7XG4gICAgICAgIGlmIChzdGVwLmRvbmUpIHtcbiAgICAgICAgICByZXR1cm4gc3RlcDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZW50cnkgPSBzdGVwLnZhbHVlO1xuICAgICAgICB2YXIga2V5ID0gZW50cnlbMF07XG4gICAgICAgIHJldHVybiBpdGVyYXRvclZhbHVlKFxuICAgICAgICAgIHR5cGUsXG4gICAgICAgICAga2V5LFxuICAgICAgICAgIG1hcHBlci5jYWxsKGNvbnRleHQsIGVudHJ5WzFdLCBrZXksIGl0ZXJhYmxlKSxcbiAgICAgICAgICBzdGVwXG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIG1hcHBlZFNlcXVlbmNlO1xuICB9XG5cblxuICBmdW5jdGlvbiByZXZlcnNlRmFjdG9yeShpdGVyYWJsZSwgdXNlS2V5cykge1xuICAgIHZhciByZXZlcnNlZFNlcXVlbmNlID0gbWFrZVNlcXVlbmNlKGl0ZXJhYmxlKTtcbiAgICByZXZlcnNlZFNlcXVlbmNlLl9pdGVyID0gaXRlcmFibGU7XG4gICAgcmV2ZXJzZWRTZXF1ZW5jZS5zaXplID0gaXRlcmFibGUuc2l6ZTtcbiAgICByZXZlcnNlZFNlcXVlbmNlLnJldmVyc2UgPSBmdW5jdGlvbigpICB7cmV0dXJuIGl0ZXJhYmxlfTtcbiAgICBpZiAoaXRlcmFibGUuZmxpcCkge1xuICAgICAgcmV2ZXJzZWRTZXF1ZW5jZS5mbGlwID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZmxpcFNlcXVlbmNlID0gZmxpcEZhY3RvcnkoaXRlcmFibGUpO1xuICAgICAgICBmbGlwU2VxdWVuY2UucmV2ZXJzZSA9IGZ1bmN0aW9uKCkgIHtyZXR1cm4gaXRlcmFibGUuZmxpcCgpfTtcbiAgICAgICAgcmV0dXJuIGZsaXBTZXF1ZW5jZTtcbiAgICAgIH07XG4gICAgfVxuICAgIHJldmVyc2VkU2VxdWVuY2UuZ2V0ID0gZnVuY3Rpb24oa2V5LCBub3RTZXRWYWx1ZSkgXG4gICAgICB7cmV0dXJuIGl0ZXJhYmxlLmdldCh1c2VLZXlzID8ga2V5IDogLTEgLSBrZXksIG5vdFNldFZhbHVlKX07XG4gICAgcmV2ZXJzZWRTZXF1ZW5jZS5oYXMgPSBmdW5jdGlvbihrZXkgKVxuICAgICAge3JldHVybiBpdGVyYWJsZS5oYXModXNlS2V5cyA/IGtleSA6IC0xIC0ga2V5KX07XG4gICAgcmV2ZXJzZWRTZXF1ZW5jZS5jb250YWlucyA9IGZ1bmN0aW9uKHZhbHVlICkge3JldHVybiBpdGVyYWJsZS5jb250YWlucyh2YWx1ZSl9O1xuICAgIHJldmVyc2VkU2VxdWVuY2UuY2FjaGVSZXN1bHQgPSBjYWNoZVJlc3VsdFRocm91Z2g7XG4gICAgcmV2ZXJzZWRTZXF1ZW5jZS5fX2l0ZXJhdGUgPSBmdW5jdGlvbiAoZm4sIHJldmVyc2UpIHt2YXIgdGhpcyQwID0gdGhpcztcbiAgICAgIHJldHVybiBpdGVyYWJsZS5fX2l0ZXJhdGUoZnVuY3Rpb24odiwgaykgIHtyZXR1cm4gZm4odiwgaywgdGhpcyQwKX0sICFyZXZlcnNlKTtcbiAgICB9O1xuICAgIHJldmVyc2VkU2VxdWVuY2UuX19pdGVyYXRvciA9XG4gICAgICBmdW5jdGlvbih0eXBlLCByZXZlcnNlKSAge3JldHVybiBpdGVyYWJsZS5fX2l0ZXJhdG9yKHR5cGUsICFyZXZlcnNlKX07XG4gICAgcmV0dXJuIHJldmVyc2VkU2VxdWVuY2U7XG4gIH1cblxuXG4gIGZ1bmN0aW9uIGZpbHRlckZhY3RvcnkoaXRlcmFibGUsIHByZWRpY2F0ZSwgY29udGV4dCwgdXNlS2V5cykge1xuICAgIHZhciBmaWx0ZXJTZXF1ZW5jZSA9IG1ha2VTZXF1ZW5jZShpdGVyYWJsZSk7XG4gICAgaWYgKHVzZUtleXMpIHtcbiAgICAgIGZpbHRlclNlcXVlbmNlLmhhcyA9IGZ1bmN0aW9uKGtleSApIHtcbiAgICAgICAgdmFyIHYgPSBpdGVyYWJsZS5nZXQoa2V5LCBOT1RfU0VUKTtcbiAgICAgICAgcmV0dXJuIHYgIT09IE5PVF9TRVQgJiYgISFwcmVkaWNhdGUuY2FsbChjb250ZXh0LCB2LCBrZXksIGl0ZXJhYmxlKTtcbiAgICAgIH07XG4gICAgICBmaWx0ZXJTZXF1ZW5jZS5nZXQgPSBmdW5jdGlvbihrZXksIG5vdFNldFZhbHVlKSAge1xuICAgICAgICB2YXIgdiA9IGl0ZXJhYmxlLmdldChrZXksIE5PVF9TRVQpO1xuICAgICAgICByZXR1cm4gdiAhPT0gTk9UX1NFVCAmJiBwcmVkaWNhdGUuY2FsbChjb250ZXh0LCB2LCBrZXksIGl0ZXJhYmxlKSA/XG4gICAgICAgICAgdiA6IG5vdFNldFZhbHVlO1xuICAgICAgfTtcbiAgICB9XG4gICAgZmlsdGVyU2VxdWVuY2UuX19pdGVyYXRlVW5jYWNoZWQgPSBmdW5jdGlvbiAoZm4sIHJldmVyc2UpIHt2YXIgdGhpcyQwID0gdGhpcztcbiAgICAgIHZhciBpdGVyYXRpb25zID0gMDtcbiAgICAgIGl0ZXJhYmxlLl9faXRlcmF0ZShmdW5jdGlvbih2LCBrLCBjKSAge1xuICAgICAgICBpZiAocHJlZGljYXRlLmNhbGwoY29udGV4dCwgdiwgaywgYykpIHtcbiAgICAgICAgICBpdGVyYXRpb25zKys7XG4gICAgICAgICAgcmV0dXJuIGZuKHYsIHVzZUtleXMgPyBrIDogaXRlcmF0aW9ucyAtIDEsIHRoaXMkMCk7XG4gICAgICAgIH1cbiAgICAgIH0sIHJldmVyc2UpO1xuICAgICAgcmV0dXJuIGl0ZXJhdGlvbnM7XG4gICAgfTtcbiAgICBmaWx0ZXJTZXF1ZW5jZS5fX2l0ZXJhdG9yVW5jYWNoZWQgPSBmdW5jdGlvbiAodHlwZSwgcmV2ZXJzZSkge1xuICAgICAgdmFyIGl0ZXJhdG9yID0gaXRlcmFibGUuX19pdGVyYXRvcihJVEVSQVRFX0VOVFJJRVMsIHJldmVyc2UpO1xuICAgICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgICAgcmV0dXJuIG5ldyBzcmNfSXRlcmF0b3JfX0l0ZXJhdG9yKGZ1bmN0aW9uKCkgIHtcbiAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICB2YXIgc3RlcCA9IGl0ZXJhdG9yLm5leHQoKTtcbiAgICAgICAgICBpZiAoc3RlcC5kb25lKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RlcDtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIGVudHJ5ID0gc3RlcC52YWx1ZTtcbiAgICAgICAgICB2YXIga2V5ID0gZW50cnlbMF07XG4gICAgICAgICAgdmFyIHZhbHVlID0gZW50cnlbMV07XG4gICAgICAgICAgaWYgKHByZWRpY2F0ZS5jYWxsKGNvbnRleHQsIHZhbHVlLCBrZXksIGl0ZXJhYmxlKSkge1xuICAgICAgICAgICAgcmV0dXJuIGl0ZXJhdG9yVmFsdWUodHlwZSwgdXNlS2V5cyA/IGtleSA6IGl0ZXJhdGlvbnMrKywgdmFsdWUsIHN0ZXApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBmaWx0ZXJTZXF1ZW5jZTtcbiAgfVxuXG5cbiAgZnVuY3Rpb24gY291bnRCeUZhY3RvcnkoaXRlcmFibGUsIGdyb3VwZXIsIGNvbnRleHQpIHtcbiAgICB2YXIgZ3JvdXBzID0gc3JjX01hcF9fTWFwKCkuYXNNdXRhYmxlKCk7XG4gICAgaXRlcmFibGUuX19pdGVyYXRlKGZ1bmN0aW9uKHYsIGspICB7XG4gICAgICBncm91cHMudXBkYXRlKFxuICAgICAgICBncm91cGVyLmNhbGwoY29udGV4dCwgdiwgaywgaXRlcmFibGUpLFxuICAgICAgICAwLFxuICAgICAgICBmdW5jdGlvbihhICkge3JldHVybiBhICsgMX1cbiAgICAgICk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGdyb3Vwcy5hc0ltbXV0YWJsZSgpO1xuICB9XG5cblxuICBmdW5jdGlvbiBncm91cEJ5RmFjdG9yeShpdGVyYWJsZSwgZ3JvdXBlciwgY29udGV4dCkge1xuICAgIHZhciBpc0tleWVkSXRlciA9IGlzS2V5ZWQoaXRlcmFibGUpO1xuICAgIHZhciBncm91cHMgPSAoaXNPcmRlcmVkKGl0ZXJhYmxlKSA/IE9yZGVyZWRNYXAoKSA6IHNyY19NYXBfX01hcCgpKS5hc011dGFibGUoKTtcbiAgICBpdGVyYWJsZS5fX2l0ZXJhdGUoZnVuY3Rpb24odiwgaykgIHtcbiAgICAgIGdyb3Vwcy51cGRhdGUoXG4gICAgICAgIGdyb3VwZXIuY2FsbChjb250ZXh0LCB2LCBrLCBpdGVyYWJsZSksXG4gICAgICAgIGZ1bmN0aW9uKGEgKSB7cmV0dXJuIChhID0gYSB8fCBbXSwgYS5wdXNoKGlzS2V5ZWRJdGVyID8gW2ssIHZdIDogdiksIGEpfVxuICAgICAgKTtcbiAgICB9KTtcbiAgICB2YXIgY29lcmNlID0gaXRlcmFibGVDbGFzcyhpdGVyYWJsZSk7XG4gICAgcmV0dXJuIGdyb3Vwcy5tYXAoZnVuY3Rpb24oYXJyICkge3JldHVybiByZWlmeShpdGVyYWJsZSwgY29lcmNlKGFycikpfSk7XG4gIH1cblxuXG4gIGZ1bmN0aW9uIHNsaWNlRmFjdG9yeShpdGVyYWJsZSwgYmVnaW4sIGVuZCwgdXNlS2V5cykge1xuICAgIHZhciBvcmlnaW5hbFNpemUgPSBpdGVyYWJsZS5zaXplO1xuXG4gICAgaWYgKHdob2xlU2xpY2UoYmVnaW4sIGVuZCwgb3JpZ2luYWxTaXplKSkge1xuICAgICAgcmV0dXJuIGl0ZXJhYmxlO1xuICAgIH1cblxuICAgIHZhciByZXNvbHZlZEJlZ2luID0gcmVzb2x2ZUJlZ2luKGJlZ2luLCBvcmlnaW5hbFNpemUpO1xuICAgIHZhciByZXNvbHZlZEVuZCA9IHJlc29sdmVFbmQoZW5kLCBvcmlnaW5hbFNpemUpO1xuXG4gICAgLy8gYmVnaW4gb3IgZW5kIHdpbGwgYmUgTmFOIGlmIHRoZXkgd2VyZSBwcm92aWRlZCBhcyBuZWdhdGl2ZSBudW1iZXJzIGFuZFxuICAgIC8vIHRoaXMgaXRlcmFibGUncyBzaXplIGlzIHVua25vd24uIEluIHRoYXQgY2FzZSwgY2FjaGUgZmlyc3Qgc28gdGhlcmUgaXNcbiAgICAvLyBhIGtub3duIHNpemUuXG4gICAgaWYgKHJlc29sdmVkQmVnaW4gIT09IHJlc29sdmVkQmVnaW4gfHwgcmVzb2x2ZWRFbmQgIT09IHJlc29sdmVkRW5kKSB7XG4gICAgICByZXR1cm4gc2xpY2VGYWN0b3J5KGl0ZXJhYmxlLnRvU2VxKCkuY2FjaGVSZXN1bHQoKSwgYmVnaW4sIGVuZCwgdXNlS2V5cyk7XG4gICAgfVxuXG4gICAgdmFyIHNsaWNlU2l6ZSA9IHJlc29sdmVkRW5kIC0gcmVzb2x2ZWRCZWdpbjtcbiAgICBpZiAoc2xpY2VTaXplIDwgMCkge1xuICAgICAgc2xpY2VTaXplID0gMDtcbiAgICB9XG5cbiAgICB2YXIgc2xpY2VTZXEgPSBtYWtlU2VxdWVuY2UoaXRlcmFibGUpO1xuXG4gICAgc2xpY2VTZXEuc2l6ZSA9IHNsaWNlU2l6ZSA9PT0gMCA/IHNsaWNlU2l6ZSA6IGl0ZXJhYmxlLnNpemUgJiYgc2xpY2VTaXplIHx8IHVuZGVmaW5lZDtcblxuICAgIGlmICghdXNlS2V5cyAmJiBpc1NlcShpdGVyYWJsZSkgJiYgc2xpY2VTaXplID49IDApIHtcbiAgICAgIHNsaWNlU2VxLmdldCA9IGZ1bmN0aW9uIChpbmRleCwgbm90U2V0VmFsdWUpIHtcbiAgICAgICAgaW5kZXggPSB3cmFwSW5kZXgodGhpcywgaW5kZXgpO1xuICAgICAgICByZXR1cm4gaW5kZXggPj0gMCAmJiBpbmRleCA8IHNsaWNlU2l6ZSA/XG4gICAgICAgICAgaXRlcmFibGUuZ2V0KGluZGV4ICsgcmVzb2x2ZWRCZWdpbiwgbm90U2V0VmFsdWUpIDpcbiAgICAgICAgICBub3RTZXRWYWx1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzbGljZVNlcS5fX2l0ZXJhdGVVbmNhY2hlZCA9IGZ1bmN0aW9uKGZuLCByZXZlcnNlKSB7dmFyIHRoaXMkMCA9IHRoaXM7XG4gICAgICBpZiAoc2xpY2VTaXplID09PSAwKSB7XG4gICAgICAgIHJldHVybiAwO1xuICAgICAgfVxuICAgICAgaWYgKHJldmVyc2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FjaGVSZXN1bHQoKS5fX2l0ZXJhdGUoZm4sIHJldmVyc2UpO1xuICAgICAgfVxuICAgICAgdmFyIHNraXBwZWQgPSAwO1xuICAgICAgdmFyIGlzU2tpcHBpbmcgPSB0cnVlO1xuICAgICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgICAgaXRlcmFibGUuX19pdGVyYXRlKGZ1bmN0aW9uKHYsIGspICB7XG4gICAgICAgIGlmICghKGlzU2tpcHBpbmcgJiYgKGlzU2tpcHBpbmcgPSBza2lwcGVkKysgPCByZXNvbHZlZEJlZ2luKSkpIHtcbiAgICAgICAgICBpdGVyYXRpb25zKys7XG4gICAgICAgICAgcmV0dXJuIGZuKHYsIHVzZUtleXMgPyBrIDogaXRlcmF0aW9ucyAtIDEsIHRoaXMkMCkgIT09IGZhbHNlICYmXG4gICAgICAgICAgICAgICAgIGl0ZXJhdGlvbnMgIT09IHNsaWNlU2l6ZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gaXRlcmF0aW9ucztcbiAgICB9O1xuXG4gICAgc2xpY2VTZXEuX19pdGVyYXRvclVuY2FjaGVkID0gZnVuY3Rpb24odHlwZSwgcmV2ZXJzZSkge1xuICAgICAgaWYgKHNsaWNlU2l6ZSAmJiByZXZlcnNlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhY2hlUmVzdWx0KCkuX19pdGVyYXRvcih0eXBlLCByZXZlcnNlKTtcbiAgICAgIH1cbiAgICAgIC8vIERvbid0IGJvdGhlciBpbnN0YW50aWF0aW5nIHBhcmVudCBpdGVyYXRvciBpZiB0YWtpbmcgMC5cbiAgICAgIHZhciBpdGVyYXRvciA9IHNsaWNlU2l6ZSAmJiBpdGVyYWJsZS5fX2l0ZXJhdG9yKHR5cGUsIHJldmVyc2UpO1xuICAgICAgdmFyIHNraXBwZWQgPSAwO1xuICAgICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgICAgcmV0dXJuIG5ldyBzcmNfSXRlcmF0b3JfX0l0ZXJhdG9yKGZ1bmN0aW9uKCkgIHtcbiAgICAgICAgd2hpbGUgKHNraXBwZWQrKyAhPT0gcmVzb2x2ZWRCZWdpbikge1xuICAgICAgICAgIGl0ZXJhdG9yLm5leHQoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoKytpdGVyYXRpb25zID4gc2xpY2VTaXplKSB7XG4gICAgICAgICAgcmV0dXJuIGl0ZXJhdG9yRG9uZSgpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBzdGVwID0gaXRlcmF0b3IubmV4dCgpO1xuICAgICAgICBpZiAodXNlS2V5cyB8fCB0eXBlID09PSBJVEVSQVRFX1ZBTFVFUykge1xuICAgICAgICAgIHJldHVybiBzdGVwO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09IElURVJBVEVfS0VZUykge1xuICAgICAgICAgIHJldHVybiBpdGVyYXRvclZhbHVlKHR5cGUsIGl0ZXJhdGlvbnMgLSAxLCB1bmRlZmluZWQsIHN0ZXApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBpdGVyYXRvclZhbHVlKHR5cGUsIGl0ZXJhdGlvbnMgLSAxLCBzdGVwLnZhbHVlWzFdLCBzdGVwKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNsaWNlU2VxO1xuICB9XG5cblxuICBmdW5jdGlvbiB0YWtlV2hpbGVGYWN0b3J5KGl0ZXJhYmxlLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICB2YXIgdGFrZVNlcXVlbmNlID0gbWFrZVNlcXVlbmNlKGl0ZXJhYmxlKTtcbiAgICB0YWtlU2VxdWVuY2UuX19pdGVyYXRlVW5jYWNoZWQgPSBmdW5jdGlvbihmbiwgcmV2ZXJzZSkge3ZhciB0aGlzJDAgPSB0aGlzO1xuICAgICAgaWYgKHJldmVyc2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FjaGVSZXN1bHQoKS5fX2l0ZXJhdGUoZm4sIHJldmVyc2UpO1xuICAgICAgfVxuICAgICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgICAgaXRlcmFibGUuX19pdGVyYXRlKGZ1bmN0aW9uKHYsIGssIGMpIFxuICAgICAgICB7cmV0dXJuIHByZWRpY2F0ZS5jYWxsKGNvbnRleHQsIHYsIGssIGMpICYmICsraXRlcmF0aW9ucyAmJiBmbih2LCBrLCB0aGlzJDApfVxuICAgICAgKTtcbiAgICAgIHJldHVybiBpdGVyYXRpb25zO1xuICAgIH07XG4gICAgdGFrZVNlcXVlbmNlLl9faXRlcmF0b3JVbmNhY2hlZCA9IGZ1bmN0aW9uKHR5cGUsIHJldmVyc2UpIHt2YXIgdGhpcyQwID0gdGhpcztcbiAgICAgIGlmIChyZXZlcnNlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhY2hlUmVzdWx0KCkuX19pdGVyYXRvcih0eXBlLCByZXZlcnNlKTtcbiAgICAgIH1cbiAgICAgIHZhciBpdGVyYXRvciA9IGl0ZXJhYmxlLl9faXRlcmF0b3IoSVRFUkFURV9FTlRSSUVTLCByZXZlcnNlKTtcbiAgICAgIHZhciBpdGVyYXRpbmcgPSB0cnVlO1xuICAgICAgcmV0dXJuIG5ldyBzcmNfSXRlcmF0b3JfX0l0ZXJhdG9yKGZ1bmN0aW9uKCkgIHtcbiAgICAgICAgaWYgKCFpdGVyYXRpbmcpIHtcbiAgICAgICAgICByZXR1cm4gaXRlcmF0b3JEb25lKCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHN0ZXAgPSBpdGVyYXRvci5uZXh0KCk7XG4gICAgICAgIGlmIChzdGVwLmRvbmUpIHtcbiAgICAgICAgICByZXR1cm4gc3RlcDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZW50cnkgPSBzdGVwLnZhbHVlO1xuICAgICAgICB2YXIgayA9IGVudHJ5WzBdO1xuICAgICAgICB2YXIgdiA9IGVudHJ5WzFdO1xuICAgICAgICBpZiAoIXByZWRpY2F0ZS5jYWxsKGNvbnRleHQsIHYsIGssIHRoaXMkMCkpIHtcbiAgICAgICAgICBpdGVyYXRpbmcgPSBmYWxzZTtcbiAgICAgICAgICByZXR1cm4gaXRlcmF0b3JEb25lKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHR5cGUgPT09IElURVJBVEVfRU5UUklFUyA/IHN0ZXAgOlxuICAgICAgICAgIGl0ZXJhdG9yVmFsdWUodHlwZSwgaywgdiwgc3RlcCk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHJldHVybiB0YWtlU2VxdWVuY2U7XG4gIH1cblxuXG4gIGZ1bmN0aW9uIHNraXBXaGlsZUZhY3RvcnkoaXRlcmFibGUsIHByZWRpY2F0ZSwgY29udGV4dCwgdXNlS2V5cykge1xuICAgIHZhciBza2lwU2VxdWVuY2UgPSBtYWtlU2VxdWVuY2UoaXRlcmFibGUpO1xuICAgIHNraXBTZXF1ZW5jZS5fX2l0ZXJhdGVVbmNhY2hlZCA9IGZ1bmN0aW9uIChmbiwgcmV2ZXJzZSkge3ZhciB0aGlzJDAgPSB0aGlzO1xuICAgICAgaWYgKHJldmVyc2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FjaGVSZXN1bHQoKS5fX2l0ZXJhdGUoZm4sIHJldmVyc2UpO1xuICAgICAgfVxuICAgICAgdmFyIGlzU2tpcHBpbmcgPSB0cnVlO1xuICAgICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgICAgaXRlcmFibGUuX19pdGVyYXRlKGZ1bmN0aW9uKHYsIGssIGMpICB7XG4gICAgICAgIGlmICghKGlzU2tpcHBpbmcgJiYgKGlzU2tpcHBpbmcgPSBwcmVkaWNhdGUuY2FsbChjb250ZXh0LCB2LCBrLCBjKSkpKSB7XG4gICAgICAgICAgaXRlcmF0aW9ucysrO1xuICAgICAgICAgIHJldHVybiBmbih2LCB1c2VLZXlzID8gayA6IGl0ZXJhdGlvbnMgLSAxLCB0aGlzJDApO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBpdGVyYXRpb25zO1xuICAgIH07XG4gICAgc2tpcFNlcXVlbmNlLl9faXRlcmF0b3JVbmNhY2hlZCA9IGZ1bmN0aW9uKHR5cGUsIHJldmVyc2UpIHt2YXIgdGhpcyQwID0gdGhpcztcbiAgICAgIGlmIChyZXZlcnNlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhY2hlUmVzdWx0KCkuX19pdGVyYXRvcih0eXBlLCByZXZlcnNlKTtcbiAgICAgIH1cbiAgICAgIHZhciBpdGVyYXRvciA9IGl0ZXJhYmxlLl9faXRlcmF0b3IoSVRFUkFURV9FTlRSSUVTLCByZXZlcnNlKTtcbiAgICAgIHZhciBza2lwcGluZyA9IHRydWU7XG4gICAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gICAgICByZXR1cm4gbmV3IHNyY19JdGVyYXRvcl9fSXRlcmF0b3IoZnVuY3Rpb24oKSAge1xuICAgICAgICB2YXIgc3RlcCwgaywgdjtcbiAgICAgICAgZG8ge1xuICAgICAgICAgIHN0ZXAgPSBpdGVyYXRvci5uZXh0KCk7XG4gICAgICAgICAgaWYgKHN0ZXAuZG9uZSkge1xuICAgICAgICAgICAgaWYgKHVzZUtleXMgfHwgdHlwZSA9PT0gSVRFUkFURV9WQUxVRVMpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHN0ZXA7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09IElURVJBVEVfS0VZUykge1xuICAgICAgICAgICAgICByZXR1cm4gaXRlcmF0b3JWYWx1ZSh0eXBlLCBpdGVyYXRpb25zKyssIHVuZGVmaW5lZCwgc3RlcCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4gaXRlcmF0b3JWYWx1ZSh0eXBlLCBpdGVyYXRpb25zKyssIHN0ZXAudmFsdWVbMV0sIHN0ZXApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgZW50cnkgPSBzdGVwLnZhbHVlO1xuICAgICAgICAgIGsgPSBlbnRyeVswXTtcbiAgICAgICAgICB2ID0gZW50cnlbMV07XG4gICAgICAgICAgc2tpcHBpbmcgJiYgKHNraXBwaW5nID0gcHJlZGljYXRlLmNhbGwoY29udGV4dCwgdiwgaywgdGhpcyQwKSk7XG4gICAgICAgIH0gd2hpbGUgKHNraXBwaW5nKTtcbiAgICAgICAgcmV0dXJuIHR5cGUgPT09IElURVJBVEVfRU5UUklFUyA/IHN0ZXAgOlxuICAgICAgICAgIGl0ZXJhdG9yVmFsdWUodHlwZSwgaywgdiwgc3RlcCk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHJldHVybiBza2lwU2VxdWVuY2U7XG4gIH1cblxuXG4gIGZ1bmN0aW9uIGNvbmNhdEZhY3RvcnkoaXRlcmFibGUsIHZhbHVlcykge1xuICAgIHZhciBpc0tleWVkSXRlcmFibGUgPSBpc0tleWVkKGl0ZXJhYmxlKTtcbiAgICB2YXIgaXRlcnMgPSBbaXRlcmFibGVdLmNvbmNhdCh2YWx1ZXMpLm1hcChmdW5jdGlvbih2ICkge1xuICAgICAgaWYgKCFpc0l0ZXJhYmxlKHYpKSB7XG4gICAgICAgIHYgPSBpc0tleWVkSXRlcmFibGUgP1xuICAgICAgICAgIGtleWVkU2VxRnJvbVZhbHVlKHYpIDpcbiAgICAgICAgICBpbmRleGVkU2VxRnJvbVZhbHVlKEFycmF5LmlzQXJyYXkodikgPyB2IDogW3ZdKTtcbiAgICAgIH0gZWxzZSBpZiAoaXNLZXllZEl0ZXJhYmxlKSB7XG4gICAgICAgIHYgPSBLZXllZEl0ZXJhYmxlKHYpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHY7XG4gICAgfSkuZmlsdGVyKGZ1bmN0aW9uKHYgKSB7cmV0dXJuIHYuc2l6ZSAhPT0gMH0pO1xuXG4gICAgaWYgKGl0ZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIGl0ZXJhYmxlO1xuICAgIH1cblxuICAgIGlmIChpdGVycy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHZhciBzaW5nbGV0b24gPSBpdGVyc1swXTtcbiAgICAgIGlmIChzaW5nbGV0b24gPT09IGl0ZXJhYmxlIHx8XG4gICAgICAgICAgaXNLZXllZEl0ZXJhYmxlICYmIGlzS2V5ZWQoc2luZ2xldG9uKSB8fFxuICAgICAgICAgIGlzSW5kZXhlZChpdGVyYWJsZSkgJiYgaXNJbmRleGVkKHNpbmdsZXRvbikpIHtcbiAgICAgICAgcmV0dXJuIHNpbmdsZXRvbjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgY29uY2F0U2VxID0gbmV3IEFycmF5U2VxKGl0ZXJzKTtcbiAgICBpZiAoaXNLZXllZEl0ZXJhYmxlKSB7XG4gICAgICBjb25jYXRTZXEgPSBjb25jYXRTZXEudG9LZXllZFNlcSgpO1xuICAgIH0gZWxzZSBpZiAoIWlzSW5kZXhlZChpdGVyYWJsZSkpIHtcbiAgICAgIGNvbmNhdFNlcSA9IGNvbmNhdFNlcS50b1NldFNlcSgpO1xuICAgIH1cbiAgICBjb25jYXRTZXEgPSBjb25jYXRTZXEuZmxhdHRlbih0cnVlKTtcbiAgICBjb25jYXRTZXEuc2l6ZSA9IGl0ZXJzLnJlZHVjZShcbiAgICAgIGZ1bmN0aW9uKHN1bSwgc2VxKSAge1xuICAgICAgICBpZiAoc3VtICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB2YXIgc2l6ZSA9IHNlcS5zaXplO1xuICAgICAgICAgIGlmIChzaXplICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBzdW0gKyBzaXplO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIDBcbiAgICApO1xuICAgIHJldHVybiBjb25jYXRTZXE7XG4gIH1cblxuXG4gIGZ1bmN0aW9uIGZsYXR0ZW5GYWN0b3J5KGl0ZXJhYmxlLCBkZXB0aCwgdXNlS2V5cykge1xuICAgIHZhciBmbGF0U2VxdWVuY2UgPSBtYWtlU2VxdWVuY2UoaXRlcmFibGUpO1xuICAgIGZsYXRTZXF1ZW5jZS5fX2l0ZXJhdGVVbmNhY2hlZCA9IGZ1bmN0aW9uKGZuLCByZXZlcnNlKSB7XG4gICAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gICAgICB2YXIgc3RvcHBlZCA9IGZhbHNlO1xuICAgICAgZnVuY3Rpb24gZmxhdERlZXAoaXRlciwgY3VycmVudERlcHRoKSB7dmFyIHRoaXMkMCA9IHRoaXM7XG4gICAgICAgIGl0ZXIuX19pdGVyYXRlKGZ1bmN0aW9uKHYsIGspICB7XG4gICAgICAgICAgaWYgKCghZGVwdGggfHwgY3VycmVudERlcHRoIDwgZGVwdGgpICYmIGlzSXRlcmFibGUodikpIHtcbiAgICAgICAgICAgIGZsYXREZWVwKHYsIGN1cnJlbnREZXB0aCArIDEpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZm4odiwgdXNlS2V5cyA/IGsgOiBpdGVyYXRpb25zKyssIHRoaXMkMCkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBzdG9wcGVkID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuICFzdG9wcGVkO1xuICAgICAgICB9LCByZXZlcnNlKTtcbiAgICAgIH1cbiAgICAgIGZsYXREZWVwKGl0ZXJhYmxlLCAwKTtcbiAgICAgIHJldHVybiBpdGVyYXRpb25zO1xuICAgIH1cbiAgICBmbGF0U2VxdWVuY2UuX19pdGVyYXRvclVuY2FjaGVkID0gZnVuY3Rpb24odHlwZSwgcmV2ZXJzZSkge1xuICAgICAgdmFyIGl0ZXJhdG9yID0gaXRlcmFibGUuX19pdGVyYXRvcih0eXBlLCByZXZlcnNlKTtcbiAgICAgIHZhciBzdGFjayA9IFtdO1xuICAgICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgICAgcmV0dXJuIG5ldyBzcmNfSXRlcmF0b3JfX0l0ZXJhdG9yKGZ1bmN0aW9uKCkgIHtcbiAgICAgICAgd2hpbGUgKGl0ZXJhdG9yKSB7XG4gICAgICAgICAgdmFyIHN0ZXAgPSBpdGVyYXRvci5uZXh0KCk7XG4gICAgICAgICAgaWYgKHN0ZXAuZG9uZSAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGl0ZXJhdG9yID0gc3RhY2sucG9wKCk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIHYgPSBzdGVwLnZhbHVlO1xuICAgICAgICAgIGlmICh0eXBlID09PSBJVEVSQVRFX0VOVFJJRVMpIHtcbiAgICAgICAgICAgIHYgPSB2WzFdO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoKCFkZXB0aCB8fCBzdGFjay5sZW5ndGggPCBkZXB0aCkgJiYgaXNJdGVyYWJsZSh2KSkge1xuICAgICAgICAgICAgc3RhY2sucHVzaChpdGVyYXRvcik7XG4gICAgICAgICAgICBpdGVyYXRvciA9IHYuX19pdGVyYXRvcih0eXBlLCByZXZlcnNlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHVzZUtleXMgPyBzdGVwIDogaXRlcmF0b3JWYWx1ZSh0eXBlLCBpdGVyYXRpb25zKyssIHYsIHN0ZXApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaXRlcmF0b3JEb25lKCk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGZsYXRTZXF1ZW5jZTtcbiAgfVxuXG5cbiAgZnVuY3Rpb24gZmxhdE1hcEZhY3RvcnkoaXRlcmFibGUsIG1hcHBlciwgY29udGV4dCkge1xuICAgIHZhciBjb2VyY2UgPSBpdGVyYWJsZUNsYXNzKGl0ZXJhYmxlKTtcbiAgICByZXR1cm4gaXRlcmFibGUudG9TZXEoKS5tYXAoXG4gICAgICBmdW5jdGlvbih2LCBrKSAge3JldHVybiBjb2VyY2UobWFwcGVyLmNhbGwoY29udGV4dCwgdiwgaywgaXRlcmFibGUpKX1cbiAgICApLmZsYXR0ZW4odHJ1ZSk7XG4gIH1cblxuXG4gIGZ1bmN0aW9uIGludGVycG9zZUZhY3RvcnkoaXRlcmFibGUsIHNlcGFyYXRvcikge1xuICAgIHZhciBpbnRlcnBvc2VkU2VxdWVuY2UgPSBtYWtlU2VxdWVuY2UoaXRlcmFibGUpO1xuICAgIGludGVycG9zZWRTZXF1ZW5jZS5zaXplID0gaXRlcmFibGUuc2l6ZSAmJiBpdGVyYWJsZS5zaXplICogMiAtMTtcbiAgICBpbnRlcnBvc2VkU2VxdWVuY2UuX19pdGVyYXRlVW5jYWNoZWQgPSBmdW5jdGlvbihmbiwgcmV2ZXJzZSkge3ZhciB0aGlzJDAgPSB0aGlzO1xuICAgICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgICAgaXRlcmFibGUuX19pdGVyYXRlKGZ1bmN0aW9uKHYsIGspIFxuICAgICAgICB7cmV0dXJuICghaXRlcmF0aW9ucyB8fCBmbihzZXBhcmF0b3IsIGl0ZXJhdGlvbnMrKywgdGhpcyQwKSAhPT0gZmFsc2UpICYmXG4gICAgICAgIGZuKHYsIGl0ZXJhdGlvbnMrKywgdGhpcyQwKSAhPT0gZmFsc2V9LFxuICAgICAgICByZXZlcnNlXG4gICAgICApO1xuICAgICAgcmV0dXJuIGl0ZXJhdGlvbnM7XG4gICAgfTtcbiAgICBpbnRlcnBvc2VkU2VxdWVuY2UuX19pdGVyYXRvclVuY2FjaGVkID0gZnVuY3Rpb24odHlwZSwgcmV2ZXJzZSkge1xuICAgICAgdmFyIGl0ZXJhdG9yID0gaXRlcmFibGUuX19pdGVyYXRvcihJVEVSQVRFX1ZBTFVFUywgcmV2ZXJzZSk7XG4gICAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gICAgICB2YXIgc3RlcDtcbiAgICAgIHJldHVybiBuZXcgc3JjX0l0ZXJhdG9yX19JdGVyYXRvcihmdW5jdGlvbigpICB7XG4gICAgICAgIGlmICghc3RlcCB8fCBpdGVyYXRpb25zICUgMikge1xuICAgICAgICAgIHN0ZXAgPSBpdGVyYXRvci5uZXh0KCk7XG4gICAgICAgICAgaWYgKHN0ZXAuZG9uZSkge1xuICAgICAgICAgICAgcmV0dXJuIHN0ZXA7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpdGVyYXRpb25zICUgMiA/XG4gICAgICAgICAgaXRlcmF0b3JWYWx1ZSh0eXBlLCBpdGVyYXRpb25zKyssIHNlcGFyYXRvcikgOlxuICAgICAgICAgIGl0ZXJhdG9yVmFsdWUodHlwZSwgaXRlcmF0aW9ucysrLCBzdGVwLnZhbHVlLCBzdGVwKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgcmV0dXJuIGludGVycG9zZWRTZXF1ZW5jZTtcbiAgfVxuXG5cbiAgZnVuY3Rpb24gc29ydEZhY3RvcnkoaXRlcmFibGUsIGNvbXBhcmF0b3IsIG1hcHBlcikge1xuICAgIGlmICghY29tcGFyYXRvcikge1xuICAgICAgY29tcGFyYXRvciA9IGRlZmF1bHRDb21wYXJhdG9yO1xuICAgIH1cbiAgICB2YXIgaXNLZXllZEl0ZXJhYmxlID0gaXNLZXllZChpdGVyYWJsZSk7XG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICB2YXIgZW50cmllcyA9IGl0ZXJhYmxlLnRvU2VxKCkubWFwKFxuICAgICAgZnVuY3Rpb24odiwgaykgIHtyZXR1cm4gW2ssIHYsIGluZGV4KyssIG1hcHBlciA/IG1hcHBlcih2LCBrLCBpdGVyYWJsZSkgOiB2XX1cbiAgICApLnRvQXJyYXkoKTtcbiAgICBlbnRyaWVzLnNvcnQoZnVuY3Rpb24oYSwgYikgIHtyZXR1cm4gY29tcGFyYXRvcihhWzNdLCBiWzNdKSB8fCBhWzJdIC0gYlsyXX0pLmZvckVhY2goXG4gICAgICBpc0tleWVkSXRlcmFibGUgP1xuICAgICAgZnVuY3Rpb24odiwgaSkgIHsgZW50cmllc1tpXS5sZW5ndGggPSAyOyB9IDpcbiAgICAgIGZ1bmN0aW9uKHYsIGkpICB7IGVudHJpZXNbaV0gPSB2WzFdOyB9XG4gICAgKTtcbiAgICByZXR1cm4gaXNLZXllZEl0ZXJhYmxlID8gS2V5ZWRTZXEoZW50cmllcykgOlxuICAgICAgaXNJbmRleGVkKGl0ZXJhYmxlKSA/IEluZGV4ZWRTZXEoZW50cmllcykgOlxuICAgICAgU2V0U2VxKGVudHJpZXMpO1xuICB9XG5cblxuICBmdW5jdGlvbiBtYXhGYWN0b3J5KGl0ZXJhYmxlLCBjb21wYXJhdG9yLCBtYXBwZXIpIHtcbiAgICBpZiAoIWNvbXBhcmF0b3IpIHtcbiAgICAgIGNvbXBhcmF0b3IgPSBkZWZhdWx0Q29tcGFyYXRvcjtcbiAgICB9XG4gICAgaWYgKG1hcHBlcikge1xuICAgICAgdmFyIGVudHJ5ID0gaXRlcmFibGUudG9TZXEoKVxuICAgICAgICAubWFwKGZ1bmN0aW9uKHYsIGspICB7cmV0dXJuIFt2LCBtYXBwZXIodiwgaywgaXRlcmFibGUpXX0pXG4gICAgICAgIC5yZWR1Y2UoZnVuY3Rpb24oYSwgYikgIHtyZXR1cm4gbWF4Q29tcGFyZShjb21wYXJhdG9yLCBhWzFdLCBiWzFdKSA/IGIgOiBhfSk7XG4gICAgICByZXR1cm4gZW50cnkgJiYgZW50cnlbMF07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBpdGVyYWJsZS5yZWR1Y2UoZnVuY3Rpb24oYSwgYikgIHtyZXR1cm4gbWF4Q29tcGFyZShjb21wYXJhdG9yLCBhLCBiKSA/IGIgOiBhfSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gbWF4Q29tcGFyZShjb21wYXJhdG9yLCBhLCBiKSB7XG4gICAgdmFyIGNvbXAgPSBjb21wYXJhdG9yKGIsIGEpO1xuICAgIC8vIGIgaXMgY29uc2lkZXJlZCB0aGUgbmV3IG1heCBpZiB0aGUgY29tcGFyYXRvciBkZWNsYXJlcyB0aGVtIGVxdWFsLCBidXRcbiAgICAvLyB0aGV5IGFyZSBub3QgZXF1YWwgYW5kIGIgaXMgaW4gZmFjdCBhIG51bGxpc2ggdmFsdWUuXG4gICAgcmV0dXJuIChjb21wID09PSAwICYmIGIgIT09IGEgJiYgKGIgPT09IHVuZGVmaW5lZCB8fCBiID09PSBudWxsIHx8IGIgIT09IGIpKSB8fCBjb21wID4gMDtcbiAgfVxuXG5cbiAgZnVuY3Rpb24gemlwV2l0aEZhY3Rvcnkoa2V5SXRlciwgemlwcGVyLCBpdGVycykge1xuICAgIHZhciB6aXBTZXF1ZW5jZSA9IG1ha2VTZXF1ZW5jZShrZXlJdGVyKTtcbiAgICB6aXBTZXF1ZW5jZS5zaXplID0gbmV3IEFycmF5U2VxKGl0ZXJzKS5tYXAoZnVuY3Rpb24oaSApIHtyZXR1cm4gaS5zaXplfSkubWluKCk7XG4gICAgLy8gTm90ZTogdGhpcyBhIGdlbmVyaWMgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBfX2l0ZXJhdGUgaW4gdGVybXMgb2ZcbiAgICAvLyBfX2l0ZXJhdG9yIHdoaWNoIG1heSBiZSBtb3JlIGdlbmVyaWNhbGx5IHVzZWZ1bCBpbiB0aGUgZnV0dXJlLlxuICAgIHppcFNlcXVlbmNlLl9faXRlcmF0ZSA9IGZ1bmN0aW9uKGZuLCByZXZlcnNlKSB7XG4gICAgICAvKiBnZW5lcmljOlxuICAgICAgdmFyIGl0ZXJhdG9yID0gdGhpcy5fX2l0ZXJhdG9yKElURVJBVEVfRU5UUklFUywgcmV2ZXJzZSk7XG4gICAgICB2YXIgc3RlcDtcbiAgICAgIHZhciBpdGVyYXRpb25zID0gMDtcbiAgICAgIHdoaWxlICghKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmUpIHtcbiAgICAgICAgaXRlcmF0aW9ucysrO1xuICAgICAgICBpZiAoZm4oc3RlcC52YWx1ZVsxXSwgc3RlcC52YWx1ZVswXSwgdGhpcykgPT09IGZhbHNlKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBpdGVyYXRpb25zO1xuICAgICAgKi9cbiAgICAgIC8vIGluZGV4ZWQ6XG4gICAgICB2YXIgaXRlcmF0b3IgPSB0aGlzLl9faXRlcmF0b3IoSVRFUkFURV9WQUxVRVMsIHJldmVyc2UpO1xuICAgICAgdmFyIHN0ZXA7XG4gICAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gICAgICB3aGlsZSAoIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lKSB7XG4gICAgICAgIGlmIChmbihzdGVwLnZhbHVlLCBpdGVyYXRpb25zKyssIHRoaXMpID09PSBmYWxzZSkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gaXRlcmF0aW9ucztcbiAgICB9O1xuICAgIHppcFNlcXVlbmNlLl9faXRlcmF0b3JVbmNhY2hlZCA9IGZ1bmN0aW9uKHR5cGUsIHJldmVyc2UpIHtcbiAgICAgIHZhciBpdGVyYXRvcnMgPSBpdGVycy5tYXAoZnVuY3Rpb24oaSApXG4gICAgICAgIHtyZXR1cm4gKGkgPSBJdGVyYWJsZShpKSwgZ2V0SXRlcmF0b3IocmV2ZXJzZSA/IGkucmV2ZXJzZSgpIDogaSkpfVxuICAgICAgKTtcbiAgICAgIHZhciBpdGVyYXRpb25zID0gMDtcbiAgICAgIHZhciBpc0RvbmUgPSBmYWxzZTtcbiAgICAgIHJldHVybiBuZXcgc3JjX0l0ZXJhdG9yX19JdGVyYXRvcihmdW5jdGlvbigpICB7XG4gICAgICAgIHZhciBzdGVwcztcbiAgICAgICAgaWYgKCFpc0RvbmUpIHtcbiAgICAgICAgICBzdGVwcyA9IGl0ZXJhdG9ycy5tYXAoZnVuY3Rpb24oaSApIHtyZXR1cm4gaS5uZXh0KCl9KTtcbiAgICAgICAgICBpc0RvbmUgPSBzdGVwcy5zb21lKGZ1bmN0aW9uKHMgKSB7cmV0dXJuIHMuZG9uZX0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc0RvbmUpIHtcbiAgICAgICAgICByZXR1cm4gaXRlcmF0b3JEb25lKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGl0ZXJhdG9yVmFsdWUoXG4gICAgICAgICAgdHlwZSxcbiAgICAgICAgICBpdGVyYXRpb25zKyssXG4gICAgICAgICAgemlwcGVyLmFwcGx5KG51bGwsIHN0ZXBzLm1hcChmdW5jdGlvbihzICkge3JldHVybiBzLnZhbHVlfSkpXG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHJldHVybiB6aXBTZXF1ZW5jZVxuICB9XG5cblxuICAvLyAjcHJhZ21hIEhlbHBlciBGdW5jdGlvbnNcblxuICBmdW5jdGlvbiByZWlmeShpdGVyLCBzZXEpIHtcbiAgICByZXR1cm4gaXNTZXEoaXRlcikgPyBzZXEgOiBpdGVyLmNvbnN0cnVjdG9yKHNlcSk7XG4gIH1cblxuICBmdW5jdGlvbiB2YWxpZGF0ZUVudHJ5KGVudHJ5KSB7XG4gICAgaWYgKGVudHJ5ICE9PSBPYmplY3QoZW50cnkpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdFeHBlY3RlZCBbSywgVl0gdHVwbGU6ICcgKyBlbnRyeSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcmVzb2x2ZVNpemUoaXRlcikge1xuICAgIGFzc2VydE5vdEluZmluaXRlKGl0ZXIuc2l6ZSk7XG4gICAgcmV0dXJuIGVuc3VyZVNpemUoaXRlcik7XG4gIH1cblxuICBmdW5jdGlvbiBpdGVyYWJsZUNsYXNzKGl0ZXJhYmxlKSB7XG4gICAgcmV0dXJuIGlzS2V5ZWQoaXRlcmFibGUpID8gS2V5ZWRJdGVyYWJsZSA6XG4gICAgICBpc0luZGV4ZWQoaXRlcmFibGUpID8gSW5kZXhlZEl0ZXJhYmxlIDpcbiAgICAgIFNldEl0ZXJhYmxlO1xuICB9XG5cbiAgZnVuY3Rpb24gbWFrZVNlcXVlbmNlKGl0ZXJhYmxlKSB7XG4gICAgcmV0dXJuIE9iamVjdC5jcmVhdGUoXG4gICAgICAoXG4gICAgICAgIGlzS2V5ZWQoaXRlcmFibGUpID8gS2V5ZWRTZXEgOlxuICAgICAgICBpc0luZGV4ZWQoaXRlcmFibGUpID8gSW5kZXhlZFNlcSA6XG4gICAgICAgIFNldFNlcVxuICAgICAgKS5wcm90b3R5cGVcbiAgICApO1xuICB9XG5cbiAgZnVuY3Rpb24gY2FjaGVSZXN1bHRUaHJvdWdoKCkge1xuICAgIGlmICh0aGlzLl9pdGVyLmNhY2hlUmVzdWx0KSB7XG4gICAgICB0aGlzLl9pdGVyLmNhY2hlUmVzdWx0KCk7XG4gICAgICB0aGlzLnNpemUgPSB0aGlzLl9pdGVyLnNpemU7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFNlcS5wcm90b3R5cGUuY2FjaGVSZXN1bHQuY2FsbCh0aGlzKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBkZWZhdWx0Q29tcGFyYXRvcihhLCBiKSB7XG4gICAgcmV0dXJuIGEgPiBiID8gMSA6IGEgPCBiID8gLTEgOiAwO1xuICB9XG5cbiAgZnVuY3Rpb24gZm9yY2VJdGVyYXRvcihrZXlQYXRoKSB7XG4gICAgdmFyIGl0ZXIgPSBnZXRJdGVyYXRvcihrZXlQYXRoKTtcbiAgICBpZiAoIWl0ZXIpIHtcbiAgICAgIC8vIEFycmF5IG1pZ2h0IG5vdCBiZSBpdGVyYWJsZSBpbiB0aGlzIGVudmlyb25tZW50LCBzbyB3ZSBuZWVkIGEgZmFsbGJhY2tcbiAgICAgIC8vIHRvIG91ciB3cmFwcGVkIHR5cGUuXG4gICAgICBpZiAoIWlzQXJyYXlMaWtlKGtleVBhdGgpKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIGl0ZXJhYmxlIG9yIGFycmF5LWxpa2U6ICcgKyBrZXlQYXRoKTtcbiAgICAgIH1cbiAgICAgIGl0ZXIgPSBnZXRJdGVyYXRvcihJdGVyYWJsZShrZXlQYXRoKSk7XG4gICAgfVxuICAgIHJldHVybiBpdGVyO1xuICB9XG5cbiAgY3JlYXRlQ2xhc3Moc3JjX01hcF9fTWFwLCBLZXllZENvbGxlY3Rpb24pO1xuXG4gICAgLy8gQHByYWdtYSBDb25zdHJ1Y3Rpb25cblxuICAgIGZ1bmN0aW9uIHNyY19NYXBfX01hcCh2YWx1ZSkge1xuICAgICAgcmV0dXJuIHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQgPyBlbXB0eU1hcCgpIDpcbiAgICAgICAgaXNNYXAodmFsdWUpID8gdmFsdWUgOlxuICAgICAgICBlbXB0eU1hcCgpLndpdGhNdXRhdGlvbnMoZnVuY3Rpb24obWFwICkge1xuICAgICAgICAgIHZhciBpdGVyID0gS2V5ZWRJdGVyYWJsZSh2YWx1ZSk7XG4gICAgICAgICAgYXNzZXJ0Tm90SW5maW5pdGUoaXRlci5zaXplKTtcbiAgICAgICAgICBpdGVyLmZvckVhY2goZnVuY3Rpb24odiwgaykgIHtyZXR1cm4gbWFwLnNldChrLCB2KX0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBzcmNfTWFwX19NYXAucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fX3RvU3RyaW5nKCdNYXAgeycsICd9Jyk7XG4gICAgfTtcblxuICAgIC8vIEBwcmFnbWEgQWNjZXNzXG5cbiAgICBzcmNfTWFwX19NYXAucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKGssIG5vdFNldFZhbHVlKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcm9vdCA/XG4gICAgICAgIHRoaXMuX3Jvb3QuZ2V0KDAsIHVuZGVmaW5lZCwgaywgbm90U2V0VmFsdWUpIDpcbiAgICAgICAgbm90U2V0VmFsdWU7XG4gICAgfTtcblxuICAgIC8vIEBwcmFnbWEgTW9kaWZpY2F0aW9uXG5cbiAgICBzcmNfTWFwX19NYXAucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKGssIHYpIHtcbiAgICAgIHJldHVybiB1cGRhdGVNYXAodGhpcywgaywgdik7XG4gICAgfTtcblxuICAgIHNyY19NYXBfX01hcC5wcm90b3R5cGUuc2V0SW4gPSBmdW5jdGlvbihrZXlQYXRoLCB2KSB7XG4gICAgICByZXR1cm4gdGhpcy51cGRhdGVJbihrZXlQYXRoLCBOT1RfU0VULCBmdW5jdGlvbigpICB7cmV0dXJuIHZ9KTtcbiAgICB9O1xuXG4gICAgc3JjX01hcF9fTWFwLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbihrKSB7XG4gICAgICByZXR1cm4gdXBkYXRlTWFwKHRoaXMsIGssIE5PVF9TRVQpO1xuICAgIH07XG5cbiAgICBzcmNfTWFwX19NYXAucHJvdG90eXBlLmRlbGV0ZUluID0gZnVuY3Rpb24oa2V5UGF0aCkge1xuICAgICAgcmV0dXJuIHRoaXMudXBkYXRlSW4oa2V5UGF0aCwgZnVuY3Rpb24oKSAge3JldHVybiBOT1RfU0VUfSk7XG4gICAgfTtcblxuICAgIHNyY19NYXBfX01hcC5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oaywgbm90U2V0VmFsdWUsIHVwZGF0ZXIpIHtcbiAgICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID09PSAxID9cbiAgICAgICAgayh0aGlzKSA6XG4gICAgICAgIHRoaXMudXBkYXRlSW4oW2tdLCBub3RTZXRWYWx1ZSwgdXBkYXRlcik7XG4gICAgfTtcblxuICAgIHNyY19NYXBfX01hcC5wcm90b3R5cGUudXBkYXRlSW4gPSBmdW5jdGlvbihrZXlQYXRoLCBub3RTZXRWYWx1ZSwgdXBkYXRlcikge1xuICAgICAgaWYgKCF1cGRhdGVyKSB7XG4gICAgICAgIHVwZGF0ZXIgPSBub3RTZXRWYWx1ZTtcbiAgICAgICAgbm90U2V0VmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgICB2YXIgdXBkYXRlZFZhbHVlID0gdXBkYXRlSW5EZWVwTWFwKFxuICAgICAgICB0aGlzLFxuICAgICAgICBmb3JjZUl0ZXJhdG9yKGtleVBhdGgpLFxuICAgICAgICBub3RTZXRWYWx1ZSxcbiAgICAgICAgdXBkYXRlclxuICAgICAgKTtcbiAgICAgIHJldHVybiB1cGRhdGVkVmFsdWUgPT09IE5PVF9TRVQgPyB1bmRlZmluZWQgOiB1cGRhdGVkVmFsdWU7XG4gICAgfTtcblxuICAgIHNyY19NYXBfX01hcC5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLnNpemUgPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5fX293bmVySUQpIHtcbiAgICAgICAgdGhpcy5zaXplID0gMDtcbiAgICAgICAgdGhpcy5fcm9vdCA9IG51bGw7XG4gICAgICAgIHRoaXMuX19oYXNoID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLl9fYWx0ZXJlZCA9IHRydWU7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGVtcHR5TWFwKCk7XG4gICAgfTtcblxuICAgIC8vIEBwcmFnbWEgQ29tcG9zaXRpb25cblxuICAgIHNyY19NYXBfX01hcC5wcm90b3R5cGUubWVyZ2UgPSBmdW5jdGlvbigvKi4uLml0ZXJzKi8pIHtcbiAgICAgIHJldHVybiBtZXJnZUludG9NYXBXaXRoKHRoaXMsIHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcbiAgICB9O1xuXG4gICAgc3JjX01hcF9fTWFwLnByb3RvdHlwZS5tZXJnZVdpdGggPSBmdW5jdGlvbihtZXJnZXIpIHt2YXIgaXRlcnMgPSBTTElDRSQwLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgIHJldHVybiBtZXJnZUludG9NYXBXaXRoKHRoaXMsIG1lcmdlciwgaXRlcnMpO1xuICAgIH07XG5cbiAgICBzcmNfTWFwX19NYXAucHJvdG90eXBlLm1lcmdlSW4gPSBmdW5jdGlvbihrZXlQYXRoKSB7dmFyIGl0ZXJzID0gU0xJQ0UkMC5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICByZXR1cm4gdGhpcy51cGRhdGVJbihrZXlQYXRoLCBlbXB0eU1hcCgpLCBmdW5jdGlvbihtICkge3JldHVybiBtLm1lcmdlLmFwcGx5KG0sIGl0ZXJzKX0pO1xuICAgIH07XG5cbiAgICBzcmNfTWFwX19NYXAucHJvdG90eXBlLm1lcmdlRGVlcCA9IGZ1bmN0aW9uKC8qLi4uaXRlcnMqLykge1xuICAgICAgcmV0dXJuIG1lcmdlSW50b01hcFdpdGgodGhpcywgZGVlcE1lcmdlcih1bmRlZmluZWQpLCBhcmd1bWVudHMpO1xuICAgIH07XG5cbiAgICBzcmNfTWFwX19NYXAucHJvdG90eXBlLm1lcmdlRGVlcFdpdGggPSBmdW5jdGlvbihtZXJnZXIpIHt2YXIgaXRlcnMgPSBTTElDRSQwLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgIHJldHVybiBtZXJnZUludG9NYXBXaXRoKHRoaXMsIGRlZXBNZXJnZXIobWVyZ2VyKSwgaXRlcnMpO1xuICAgIH07XG5cbiAgICBzcmNfTWFwX19NYXAucHJvdG90eXBlLm1lcmdlRGVlcEluID0gZnVuY3Rpb24oa2V5UGF0aCkge3ZhciBpdGVycyA9IFNMSUNFJDAuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgcmV0dXJuIHRoaXMudXBkYXRlSW4oa2V5UGF0aCwgZW1wdHlNYXAoKSwgZnVuY3Rpb24obSApIHtyZXR1cm4gbS5tZXJnZURlZXAuYXBwbHkobSwgaXRlcnMpfSk7XG4gICAgfTtcblxuICAgIHNyY19NYXBfX01hcC5wcm90b3R5cGUuc29ydCA9IGZ1bmN0aW9uKGNvbXBhcmF0b3IpIHtcbiAgICAgIC8vIExhdGUgYmluZGluZ1xuICAgICAgcmV0dXJuIE9yZGVyZWRNYXAoc29ydEZhY3RvcnkodGhpcywgY29tcGFyYXRvcikpO1xuICAgIH07XG5cbiAgICBzcmNfTWFwX19NYXAucHJvdG90eXBlLnNvcnRCeSA9IGZ1bmN0aW9uKG1hcHBlciwgY29tcGFyYXRvcikge1xuICAgICAgLy8gTGF0ZSBiaW5kaW5nXG4gICAgICByZXR1cm4gT3JkZXJlZE1hcChzb3J0RmFjdG9yeSh0aGlzLCBjb21wYXJhdG9yLCBtYXBwZXIpKTtcbiAgICB9O1xuXG4gICAgLy8gQHByYWdtYSBNdXRhYmlsaXR5XG5cbiAgICBzcmNfTWFwX19NYXAucHJvdG90eXBlLndpdGhNdXRhdGlvbnMgPSBmdW5jdGlvbihmbikge1xuICAgICAgdmFyIG11dGFibGUgPSB0aGlzLmFzTXV0YWJsZSgpO1xuICAgICAgZm4obXV0YWJsZSk7XG4gICAgICByZXR1cm4gbXV0YWJsZS53YXNBbHRlcmVkKCkgPyBtdXRhYmxlLl9fZW5zdXJlT3duZXIodGhpcy5fX293bmVySUQpIDogdGhpcztcbiAgICB9O1xuXG4gICAgc3JjX01hcF9fTWFwLnByb3RvdHlwZS5hc011dGFibGUgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9fb3duZXJJRCA/IHRoaXMgOiB0aGlzLl9fZW5zdXJlT3duZXIobmV3IE93bmVySUQoKSk7XG4gICAgfTtcblxuICAgIHNyY19NYXBfX01hcC5wcm90b3R5cGUuYXNJbW11dGFibGUgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9fZW5zdXJlT3duZXIoKTtcbiAgICB9O1xuXG4gICAgc3JjX01hcF9fTWFwLnByb3RvdHlwZS53YXNBbHRlcmVkID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fX2FsdGVyZWQ7XG4gICAgfTtcblxuICAgIHNyY19NYXBfX01hcC5wcm90b3R5cGUuX19pdGVyYXRvciA9IGZ1bmN0aW9uKHR5cGUsIHJldmVyc2UpIHtcbiAgICAgIHJldHVybiBuZXcgTWFwSXRlcmF0b3IodGhpcywgdHlwZSwgcmV2ZXJzZSk7XG4gICAgfTtcblxuICAgIHNyY19NYXBfX01hcC5wcm90b3R5cGUuX19pdGVyYXRlID0gZnVuY3Rpb24oZm4sIHJldmVyc2UpIHt2YXIgdGhpcyQwID0gdGhpcztcbiAgICAgIHZhciBpdGVyYXRpb25zID0gMDtcbiAgICAgIHRoaXMuX3Jvb3QgJiYgdGhpcy5fcm9vdC5pdGVyYXRlKGZ1bmN0aW9uKGVudHJ5ICkge1xuICAgICAgICBpdGVyYXRpb25zKys7XG4gICAgICAgIHJldHVybiBmbihlbnRyeVsxXSwgZW50cnlbMF0sIHRoaXMkMCk7XG4gICAgICB9LCByZXZlcnNlKTtcbiAgICAgIHJldHVybiBpdGVyYXRpb25zO1xuICAgIH07XG5cbiAgICBzcmNfTWFwX19NYXAucHJvdG90eXBlLl9fZW5zdXJlT3duZXIgPSBmdW5jdGlvbihvd25lcklEKSB7XG4gICAgICBpZiAob3duZXJJRCA9PT0gdGhpcy5fX293bmVySUQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICBpZiAoIW93bmVySUQpIHtcbiAgICAgICAgdGhpcy5fX293bmVySUQgPSBvd25lcklEO1xuICAgICAgICB0aGlzLl9fYWx0ZXJlZCA9IGZhbHNlO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICAgIHJldHVybiBtYWtlTWFwKHRoaXMuc2l6ZSwgdGhpcy5fcm9vdCwgb3duZXJJRCwgdGhpcy5fX2hhc2gpO1xuICAgIH07XG5cblxuICBmdW5jdGlvbiBpc01hcChtYXliZU1hcCkge1xuICAgIHJldHVybiAhIShtYXliZU1hcCAmJiBtYXliZU1hcFtJU19NQVBfU0VOVElORUxdKTtcbiAgfVxuXG4gIHNyY19NYXBfX01hcC5pc01hcCA9IGlzTWFwO1xuXG4gIHZhciBJU19NQVBfU0VOVElORUwgPSAnQEBfX0lNTVVUQUJMRV9NQVBfX0BAJztcblxuICB2YXIgTWFwUHJvdG90eXBlID0gc3JjX01hcF9fTWFwLnByb3RvdHlwZTtcbiAgTWFwUHJvdG90eXBlW0lTX01BUF9TRU5USU5FTF0gPSB0cnVlO1xuICBNYXBQcm90b3R5cGVbREVMRVRFXSA9IE1hcFByb3RvdHlwZS5yZW1vdmU7XG4gIE1hcFByb3RvdHlwZS5yZW1vdmVJbiA9IE1hcFByb3RvdHlwZS5kZWxldGVJbjtcblxuXG4gIC8vICNwcmFnbWEgVHJpZSBOb2Rlc1xuXG5cblxuICAgIGZ1bmN0aW9uIEFycmF5TWFwTm9kZShvd25lcklELCBlbnRyaWVzKSB7XG4gICAgICB0aGlzLm93bmVySUQgPSBvd25lcklEO1xuICAgICAgdGhpcy5lbnRyaWVzID0gZW50cmllcztcbiAgICB9XG5cbiAgICBBcnJheU1hcE5vZGUucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKHNoaWZ0LCBrZXlIYXNoLCBrZXksIG5vdFNldFZhbHVlKSB7XG4gICAgICB2YXIgZW50cmllcyA9IHRoaXMuZW50cmllcztcbiAgICAgIGZvciAodmFyIGlpID0gMCwgbGVuID0gZW50cmllcy5sZW5ndGg7IGlpIDwgbGVuOyBpaSsrKSB7XG4gICAgICAgIGlmIChpcyhrZXksIGVudHJpZXNbaWldWzBdKSkge1xuICAgICAgICAgIHJldHVybiBlbnRyaWVzW2lpXVsxXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG5vdFNldFZhbHVlO1xuICAgIH07XG5cbiAgICBBcnJheU1hcE5vZGUucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKG93bmVySUQsIHNoaWZ0LCBrZXlIYXNoLCBrZXksIHZhbHVlLCBkaWRDaGFuZ2VTaXplLCBkaWRBbHRlcikge1xuICAgICAgdmFyIHJlbW92ZWQgPSB2YWx1ZSA9PT0gTk9UX1NFVDtcblxuICAgICAgdmFyIGVudHJpZXMgPSB0aGlzLmVudHJpZXM7XG4gICAgICB2YXIgaWR4ID0gMDtcbiAgICAgIGZvciAodmFyIGxlbiA9IGVudHJpZXMubGVuZ3RoOyBpZHggPCBsZW47IGlkeCsrKSB7XG4gICAgICAgIGlmIChpcyhrZXksIGVudHJpZXNbaWR4XVswXSkpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdmFyIGV4aXN0cyA9IGlkeCA8IGxlbjtcblxuICAgICAgaWYgKGV4aXN0cyA/IGVudHJpZXNbaWR4XVsxXSA9PT0gdmFsdWUgOiByZW1vdmVkKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuXG4gICAgICBTZXRSZWYoZGlkQWx0ZXIpO1xuICAgICAgKHJlbW92ZWQgfHwgIWV4aXN0cykgJiYgU2V0UmVmKGRpZENoYW5nZVNpemUpO1xuXG4gICAgICBpZiAocmVtb3ZlZCAmJiBlbnRyaWVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICByZXR1cm47IC8vIHVuZGVmaW5lZFxuICAgICAgfVxuXG4gICAgICBpZiAoIWV4aXN0cyAmJiAhcmVtb3ZlZCAmJiBlbnRyaWVzLmxlbmd0aCA+PSBNQVhfQVJSQVlfTUFQX1NJWkUpIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZU5vZGVzKG93bmVySUQsIGVudHJpZXMsIGtleSwgdmFsdWUpO1xuICAgICAgfVxuXG4gICAgICB2YXIgaXNFZGl0YWJsZSA9IG93bmVySUQgJiYgb3duZXJJRCA9PT0gdGhpcy5vd25lcklEO1xuICAgICAgdmFyIG5ld0VudHJpZXMgPSBpc0VkaXRhYmxlID8gZW50cmllcyA6IGFyckNvcHkoZW50cmllcyk7XG5cbiAgICAgIGlmIChleGlzdHMpIHtcbiAgICAgICAgaWYgKHJlbW92ZWQpIHtcbiAgICAgICAgICBpZHggPT09IGxlbiAtIDEgPyBuZXdFbnRyaWVzLnBvcCgpIDogKG5ld0VudHJpZXNbaWR4XSA9IG5ld0VudHJpZXMucG9wKCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5ld0VudHJpZXNbaWR4XSA9IFtrZXksIHZhbHVlXTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV3RW50cmllcy5wdXNoKFtrZXksIHZhbHVlXSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChpc0VkaXRhYmxlKSB7XG4gICAgICAgIHRoaXMuZW50cmllcyA9IG5ld0VudHJpZXM7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3IEFycmF5TWFwTm9kZShvd25lcklELCBuZXdFbnRyaWVzKTtcbiAgICB9O1xuXG5cblxuXG4gICAgZnVuY3Rpb24gQml0bWFwSW5kZXhlZE5vZGUob3duZXJJRCwgYml0bWFwLCBub2Rlcykge1xuICAgICAgdGhpcy5vd25lcklEID0gb3duZXJJRDtcbiAgICAgIHRoaXMuYml0bWFwID0gYml0bWFwO1xuICAgICAgdGhpcy5ub2RlcyA9IG5vZGVzO1xuICAgIH1cblxuICAgIEJpdG1hcEluZGV4ZWROb2RlLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbihzaGlmdCwga2V5SGFzaCwga2V5LCBub3RTZXRWYWx1ZSkge1xuICAgICAgaWYgKGtleUhhc2ggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBrZXlIYXNoID0gaGFzaChrZXkpO1xuICAgICAgfVxuICAgICAgdmFyIGJpdCA9ICgxIDw8ICgoc2hpZnQgPT09IDAgPyBrZXlIYXNoIDoga2V5SGFzaCA+Pj4gc2hpZnQpICYgTUFTSykpO1xuICAgICAgdmFyIGJpdG1hcCA9IHRoaXMuYml0bWFwO1xuICAgICAgcmV0dXJuIChiaXRtYXAgJiBiaXQpID09PSAwID8gbm90U2V0VmFsdWUgOlxuICAgICAgICB0aGlzLm5vZGVzW3BvcENvdW50KGJpdG1hcCAmIChiaXQgLSAxKSldLmdldChzaGlmdCArIFNISUZULCBrZXlIYXNoLCBrZXksIG5vdFNldFZhbHVlKTtcbiAgICB9O1xuXG4gICAgQml0bWFwSW5kZXhlZE5vZGUucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKG93bmVySUQsIHNoaWZ0LCBrZXlIYXNoLCBrZXksIHZhbHVlLCBkaWRDaGFuZ2VTaXplLCBkaWRBbHRlcikge1xuICAgICAgaWYgKGtleUhhc2ggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBrZXlIYXNoID0gaGFzaChrZXkpO1xuICAgICAgfVxuICAgICAgdmFyIGtleUhhc2hGcmFnID0gKHNoaWZ0ID09PSAwID8ga2V5SGFzaCA6IGtleUhhc2ggPj4+IHNoaWZ0KSAmIE1BU0s7XG4gICAgICB2YXIgYml0ID0gMSA8PCBrZXlIYXNoRnJhZztcbiAgICAgIHZhciBiaXRtYXAgPSB0aGlzLmJpdG1hcDtcbiAgICAgIHZhciBleGlzdHMgPSAoYml0bWFwICYgYml0KSAhPT0gMDtcblxuICAgICAgaWYgKCFleGlzdHMgJiYgdmFsdWUgPT09IE5PVF9TRVQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG5cbiAgICAgIHZhciBpZHggPSBwb3BDb3VudChiaXRtYXAgJiAoYml0IC0gMSkpO1xuICAgICAgdmFyIG5vZGVzID0gdGhpcy5ub2RlcztcbiAgICAgIHZhciBub2RlID0gZXhpc3RzID8gbm9kZXNbaWR4XSA6IHVuZGVmaW5lZDtcbiAgICAgIHZhciBuZXdOb2RlID0gdXBkYXRlTm9kZShub2RlLCBvd25lcklELCBzaGlmdCArIFNISUZULCBrZXlIYXNoLCBrZXksIHZhbHVlLCBkaWRDaGFuZ2VTaXplLCBkaWRBbHRlcik7XG5cbiAgICAgIGlmIChuZXdOb2RlID09PSBub2RlKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWV4aXN0cyAmJiBuZXdOb2RlICYmIG5vZGVzLmxlbmd0aCA+PSBNQVhfQklUTUFQX0lOREVYRURfU0laRSkge1xuICAgICAgICByZXR1cm4gZXhwYW5kTm9kZXMob3duZXJJRCwgbm9kZXMsIGJpdG1hcCwga2V5SGFzaEZyYWcsIG5ld05vZGUpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZXhpc3RzICYmICFuZXdOb2RlICYmIG5vZGVzLmxlbmd0aCA9PT0gMiAmJiBpc0xlYWZOb2RlKG5vZGVzW2lkeCBeIDFdKSkge1xuICAgICAgICByZXR1cm4gbm9kZXNbaWR4IF4gMV07XG4gICAgICB9XG5cbiAgICAgIGlmIChleGlzdHMgJiYgbmV3Tm9kZSAmJiBub2Rlcy5sZW5ndGggPT09IDEgJiYgaXNMZWFmTm9kZShuZXdOb2RlKSkge1xuICAgICAgICByZXR1cm4gbmV3Tm9kZTtcbiAgICAgIH1cblxuICAgICAgdmFyIGlzRWRpdGFibGUgPSBvd25lcklEICYmIG93bmVySUQgPT09IHRoaXMub3duZXJJRDtcbiAgICAgIHZhciBuZXdCaXRtYXAgPSBleGlzdHMgPyBuZXdOb2RlID8gYml0bWFwIDogYml0bWFwIF4gYml0IDogYml0bWFwIHwgYml0O1xuICAgICAgdmFyIG5ld05vZGVzID0gZXhpc3RzID8gbmV3Tm9kZSA/XG4gICAgICAgIHNldEluKG5vZGVzLCBpZHgsIG5ld05vZGUsIGlzRWRpdGFibGUpIDpcbiAgICAgICAgc3BsaWNlT3V0KG5vZGVzLCBpZHgsIGlzRWRpdGFibGUpIDpcbiAgICAgICAgc3BsaWNlSW4obm9kZXMsIGlkeCwgbmV3Tm9kZSwgaXNFZGl0YWJsZSk7XG5cbiAgICAgIGlmIChpc0VkaXRhYmxlKSB7XG4gICAgICAgIHRoaXMuYml0bWFwID0gbmV3Qml0bWFwO1xuICAgICAgICB0aGlzLm5vZGVzID0gbmV3Tm9kZXM7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3IEJpdG1hcEluZGV4ZWROb2RlKG93bmVySUQsIG5ld0JpdG1hcCwgbmV3Tm9kZXMpO1xuICAgIH07XG5cblxuXG5cbiAgICBmdW5jdGlvbiBIYXNoQXJyYXlNYXBOb2RlKG93bmVySUQsIGNvdW50LCBub2Rlcykge1xuICAgICAgdGhpcy5vd25lcklEID0gb3duZXJJRDtcbiAgICAgIHRoaXMuY291bnQgPSBjb3VudDtcbiAgICAgIHRoaXMubm9kZXMgPSBub2RlcztcbiAgICB9XG5cbiAgICBIYXNoQXJyYXlNYXBOb2RlLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbihzaGlmdCwga2V5SGFzaCwga2V5LCBub3RTZXRWYWx1ZSkge1xuICAgICAgaWYgKGtleUhhc2ggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBrZXlIYXNoID0gaGFzaChrZXkpO1xuICAgICAgfVxuICAgICAgdmFyIGlkeCA9IChzaGlmdCA9PT0gMCA/IGtleUhhc2ggOiBrZXlIYXNoID4+PiBzaGlmdCkgJiBNQVNLO1xuICAgICAgdmFyIG5vZGUgPSB0aGlzLm5vZGVzW2lkeF07XG4gICAgICByZXR1cm4gbm9kZSA/IG5vZGUuZ2V0KHNoaWZ0ICsgU0hJRlQsIGtleUhhc2gsIGtleSwgbm90U2V0VmFsdWUpIDogbm90U2V0VmFsdWU7XG4gICAgfTtcblxuICAgIEhhc2hBcnJheU1hcE5vZGUucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKG93bmVySUQsIHNoaWZ0LCBrZXlIYXNoLCBrZXksIHZhbHVlLCBkaWRDaGFuZ2VTaXplLCBkaWRBbHRlcikge1xuICAgICAgaWYgKGtleUhhc2ggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBrZXlIYXNoID0gaGFzaChrZXkpO1xuICAgICAgfVxuICAgICAgdmFyIGlkeCA9IChzaGlmdCA9PT0gMCA/IGtleUhhc2ggOiBrZXlIYXNoID4+PiBzaGlmdCkgJiBNQVNLO1xuICAgICAgdmFyIHJlbW92ZWQgPSB2YWx1ZSA9PT0gTk9UX1NFVDtcbiAgICAgIHZhciBub2RlcyA9IHRoaXMubm9kZXM7XG4gICAgICB2YXIgbm9kZSA9IG5vZGVzW2lkeF07XG5cbiAgICAgIGlmIChyZW1vdmVkICYmICFub2RlKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuXG4gICAgICB2YXIgbmV3Tm9kZSA9IHVwZGF0ZU5vZGUobm9kZSwgb3duZXJJRCwgc2hpZnQgKyBTSElGVCwga2V5SGFzaCwga2V5LCB2YWx1ZSwgZGlkQ2hhbmdlU2l6ZSwgZGlkQWx0ZXIpO1xuICAgICAgaWYgKG5ld05vZGUgPT09IG5vZGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG5cbiAgICAgIHZhciBuZXdDb3VudCA9IHRoaXMuY291bnQ7XG4gICAgICBpZiAoIW5vZGUpIHtcbiAgICAgICAgbmV3Q291bnQrKztcbiAgICAgIH0gZWxzZSBpZiAoIW5ld05vZGUpIHtcbiAgICAgICAgbmV3Q291bnQtLTtcbiAgICAgICAgaWYgKG5ld0NvdW50IDwgTUlOX0hBU0hfQVJSQVlfTUFQX1NJWkUpIHtcbiAgICAgICAgICByZXR1cm4gcGFja05vZGVzKG93bmVySUQsIG5vZGVzLCBuZXdDb3VudCwgaWR4KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgaXNFZGl0YWJsZSA9IG93bmVySUQgJiYgb3duZXJJRCA9PT0gdGhpcy5vd25lcklEO1xuICAgICAgdmFyIG5ld05vZGVzID0gc2V0SW4obm9kZXMsIGlkeCwgbmV3Tm9kZSwgaXNFZGl0YWJsZSk7XG5cbiAgICAgIGlmIChpc0VkaXRhYmxlKSB7XG4gICAgICAgIHRoaXMuY291bnQgPSBuZXdDb3VudDtcbiAgICAgICAgdGhpcy5ub2RlcyA9IG5ld05vZGVzO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBIYXNoQXJyYXlNYXBOb2RlKG93bmVySUQsIG5ld0NvdW50LCBuZXdOb2Rlcyk7XG4gICAgfTtcblxuXG5cblxuICAgIGZ1bmN0aW9uIEhhc2hDb2xsaXNpb25Ob2RlKG93bmVySUQsIGtleUhhc2gsIGVudHJpZXMpIHtcbiAgICAgIHRoaXMub3duZXJJRCA9IG93bmVySUQ7XG4gICAgICB0aGlzLmtleUhhc2ggPSBrZXlIYXNoO1xuICAgICAgdGhpcy5lbnRyaWVzID0gZW50cmllcztcbiAgICB9XG5cbiAgICBIYXNoQ29sbGlzaW9uTm9kZS5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oc2hpZnQsIGtleUhhc2gsIGtleSwgbm90U2V0VmFsdWUpIHtcbiAgICAgIHZhciBlbnRyaWVzID0gdGhpcy5lbnRyaWVzO1xuICAgICAgZm9yICh2YXIgaWkgPSAwLCBsZW4gPSBlbnRyaWVzLmxlbmd0aDsgaWkgPCBsZW47IGlpKyspIHtcbiAgICAgICAgaWYgKGlzKGtleSwgZW50cmllc1tpaV1bMF0pKSB7XG4gICAgICAgICAgcmV0dXJuIGVudHJpZXNbaWldWzFdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbm90U2V0VmFsdWU7XG4gICAgfTtcblxuICAgIEhhc2hDb2xsaXNpb25Ob2RlLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbihvd25lcklELCBzaGlmdCwga2V5SGFzaCwga2V5LCB2YWx1ZSwgZGlkQ2hhbmdlU2l6ZSwgZGlkQWx0ZXIpIHtcbiAgICAgIGlmIChrZXlIYXNoID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAga2V5SGFzaCA9IGhhc2goa2V5KTtcbiAgICAgIH1cblxuICAgICAgdmFyIHJlbW92ZWQgPSB2YWx1ZSA9PT0gTk9UX1NFVDtcblxuICAgICAgaWYgKGtleUhhc2ggIT09IHRoaXMua2V5SGFzaCkge1xuICAgICAgICBpZiAocmVtb3ZlZCkge1xuICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIFNldFJlZihkaWRBbHRlcik7XG4gICAgICAgIFNldFJlZihkaWRDaGFuZ2VTaXplKTtcbiAgICAgICAgcmV0dXJuIG1lcmdlSW50b05vZGUodGhpcywgb3duZXJJRCwgc2hpZnQsIGtleUhhc2gsIFtrZXksIHZhbHVlXSk7XG4gICAgICB9XG5cbiAgICAgIHZhciBlbnRyaWVzID0gdGhpcy5lbnRyaWVzO1xuICAgICAgdmFyIGlkeCA9IDA7XG4gICAgICBmb3IgKHZhciBsZW4gPSBlbnRyaWVzLmxlbmd0aDsgaWR4IDwgbGVuOyBpZHgrKykge1xuICAgICAgICBpZiAoaXMoa2V5LCBlbnRyaWVzW2lkeF1bMF0pKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHZhciBleGlzdHMgPSBpZHggPCBsZW47XG5cbiAgICAgIGlmIChleGlzdHMgPyBlbnRyaWVzW2lkeF1bMV0gPT09IHZhbHVlIDogcmVtb3ZlZCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cblxuICAgICAgU2V0UmVmKGRpZEFsdGVyKTtcbiAgICAgIChyZW1vdmVkIHx8ICFleGlzdHMpICYmIFNldFJlZihkaWRDaGFuZ2VTaXplKTtcblxuICAgICAgaWYgKHJlbW92ZWQgJiYgbGVuID09PSAyKSB7XG4gICAgICAgIHJldHVybiBuZXcgVmFsdWVOb2RlKG93bmVySUQsIHRoaXMua2V5SGFzaCwgZW50cmllc1tpZHggXiAxXSk7XG4gICAgICB9XG5cbiAgICAgIHZhciBpc0VkaXRhYmxlID0gb3duZXJJRCAmJiBvd25lcklEID09PSB0aGlzLm93bmVySUQ7XG4gICAgICB2YXIgbmV3RW50cmllcyA9IGlzRWRpdGFibGUgPyBlbnRyaWVzIDogYXJyQ29weShlbnRyaWVzKTtcblxuICAgICAgaWYgKGV4aXN0cykge1xuICAgICAgICBpZiAocmVtb3ZlZCkge1xuICAgICAgICAgIGlkeCA9PT0gbGVuIC0gMSA/IG5ld0VudHJpZXMucG9wKCkgOiAobmV3RW50cmllc1tpZHhdID0gbmV3RW50cmllcy5wb3AoKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmV3RW50cmllc1tpZHhdID0gW2tleSwgdmFsdWVdO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXdFbnRyaWVzLnB1c2goW2tleSwgdmFsdWVdKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGlzRWRpdGFibGUpIHtcbiAgICAgICAgdGhpcy5lbnRyaWVzID0gbmV3RW50cmllcztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXcgSGFzaENvbGxpc2lvbk5vZGUob3duZXJJRCwgdGhpcy5rZXlIYXNoLCBuZXdFbnRyaWVzKTtcbiAgICB9O1xuXG5cblxuXG4gICAgZnVuY3Rpb24gVmFsdWVOb2RlKG93bmVySUQsIGtleUhhc2gsIGVudHJ5KSB7XG4gICAgICB0aGlzLm93bmVySUQgPSBvd25lcklEO1xuICAgICAgdGhpcy5rZXlIYXNoID0ga2V5SGFzaDtcbiAgICAgIHRoaXMuZW50cnkgPSBlbnRyeTtcbiAgICB9XG5cbiAgICBWYWx1ZU5vZGUucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKHNoaWZ0LCBrZXlIYXNoLCBrZXksIG5vdFNldFZhbHVlKSB7XG4gICAgICByZXR1cm4gaXMoa2V5LCB0aGlzLmVudHJ5WzBdKSA/IHRoaXMuZW50cnlbMV0gOiBub3RTZXRWYWx1ZTtcbiAgICB9O1xuXG4gICAgVmFsdWVOb2RlLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbihvd25lcklELCBzaGlmdCwga2V5SGFzaCwga2V5LCB2YWx1ZSwgZGlkQ2hhbmdlU2l6ZSwgZGlkQWx0ZXIpIHtcbiAgICAgIHZhciByZW1vdmVkID0gdmFsdWUgPT09IE5PVF9TRVQ7XG4gICAgICB2YXIga2V5TWF0Y2ggPSBpcyhrZXksIHRoaXMuZW50cnlbMF0pO1xuICAgICAgaWYgKGtleU1hdGNoID8gdmFsdWUgPT09IHRoaXMuZW50cnlbMV0gOiByZW1vdmVkKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuXG4gICAgICBTZXRSZWYoZGlkQWx0ZXIpO1xuXG4gICAgICBpZiAocmVtb3ZlZCkge1xuICAgICAgICBTZXRSZWYoZGlkQ2hhbmdlU2l6ZSk7XG4gICAgICAgIHJldHVybjsgLy8gdW5kZWZpbmVkXG4gICAgICB9XG5cbiAgICAgIGlmIChrZXlNYXRjaCkge1xuICAgICAgICBpZiAob3duZXJJRCAmJiBvd25lcklEID09PSB0aGlzLm93bmVySUQpIHtcbiAgICAgICAgICB0aGlzLmVudHJ5WzFdID0gdmFsdWU7XG4gICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBWYWx1ZU5vZGUob3duZXJJRCwgdGhpcy5rZXlIYXNoLCBba2V5LCB2YWx1ZV0pO1xuICAgICAgfVxuXG4gICAgICBTZXRSZWYoZGlkQ2hhbmdlU2l6ZSk7XG4gICAgICByZXR1cm4gbWVyZ2VJbnRvTm9kZSh0aGlzLCBvd25lcklELCBzaGlmdCwgaGFzaChrZXkpLCBba2V5LCB2YWx1ZV0pO1xuICAgIH07XG5cblxuXG4gIC8vICNwcmFnbWEgSXRlcmF0b3JzXG5cbiAgQXJyYXlNYXBOb2RlLnByb3RvdHlwZS5pdGVyYXRlID1cbiAgSGFzaENvbGxpc2lvbk5vZGUucHJvdG90eXBlLml0ZXJhdGUgPSBmdW5jdGlvbiAoZm4sIHJldmVyc2UpIHtcbiAgICB2YXIgZW50cmllcyA9IHRoaXMuZW50cmllcztcbiAgICBmb3IgKHZhciBpaSA9IDAsIG1heEluZGV4ID0gZW50cmllcy5sZW5ndGggLSAxOyBpaSA8PSBtYXhJbmRleDsgaWkrKykge1xuICAgICAgaWYgKGZuKGVudHJpZXNbcmV2ZXJzZSA/IG1heEluZGV4IC0gaWkgOiBpaV0pID09PSBmYWxzZSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgQml0bWFwSW5kZXhlZE5vZGUucHJvdG90eXBlLml0ZXJhdGUgPVxuICBIYXNoQXJyYXlNYXBOb2RlLnByb3RvdHlwZS5pdGVyYXRlID0gZnVuY3Rpb24gKGZuLCByZXZlcnNlKSB7XG4gICAgdmFyIG5vZGVzID0gdGhpcy5ub2RlcztcbiAgICBmb3IgKHZhciBpaSA9IDAsIG1heEluZGV4ID0gbm9kZXMubGVuZ3RoIC0gMTsgaWkgPD0gbWF4SW5kZXg7IGlpKyspIHtcbiAgICAgIHZhciBub2RlID0gbm9kZXNbcmV2ZXJzZSA/IG1heEluZGV4IC0gaWkgOiBpaV07XG4gICAgICBpZiAobm9kZSAmJiBub2RlLml0ZXJhdGUoZm4sIHJldmVyc2UpID09PSBmYWxzZSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgVmFsdWVOb2RlLnByb3RvdHlwZS5pdGVyYXRlID0gZnVuY3Rpb24gKGZuLCByZXZlcnNlKSB7XG4gICAgcmV0dXJuIGZuKHRoaXMuZW50cnkpO1xuICB9XG5cbiAgY3JlYXRlQ2xhc3MoTWFwSXRlcmF0b3IsIHNyY19JdGVyYXRvcl9fSXRlcmF0b3IpO1xuXG4gICAgZnVuY3Rpb24gTWFwSXRlcmF0b3IobWFwLCB0eXBlLCByZXZlcnNlKSB7XG4gICAgICB0aGlzLl90eXBlID0gdHlwZTtcbiAgICAgIHRoaXMuX3JldmVyc2UgPSByZXZlcnNlO1xuICAgICAgdGhpcy5fc3RhY2sgPSBtYXAuX3Jvb3QgJiYgbWFwSXRlcmF0b3JGcmFtZShtYXAuX3Jvb3QpO1xuICAgIH1cblxuICAgIE1hcEl0ZXJhdG9yLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgdHlwZSA9IHRoaXMuX3R5cGU7XG4gICAgICB2YXIgc3RhY2sgPSB0aGlzLl9zdGFjaztcbiAgICAgIHdoaWxlIChzdGFjaykge1xuICAgICAgICB2YXIgbm9kZSA9IHN0YWNrLm5vZGU7XG4gICAgICAgIHZhciBpbmRleCA9IHN0YWNrLmluZGV4Kys7XG4gICAgICAgIHZhciBtYXhJbmRleDtcbiAgICAgICAgaWYgKG5vZGUuZW50cnkpIHtcbiAgICAgICAgICBpZiAoaW5kZXggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBtYXBJdGVyYXRvclZhbHVlKHR5cGUsIG5vZGUuZW50cnkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChub2RlLmVudHJpZXMpIHtcbiAgICAgICAgICBtYXhJbmRleCA9IG5vZGUuZW50cmllcy5sZW5ndGggLSAxO1xuICAgICAgICAgIGlmIChpbmRleCA8PSBtYXhJbmRleCkge1xuICAgICAgICAgICAgcmV0dXJuIG1hcEl0ZXJhdG9yVmFsdWUodHlwZSwgbm9kZS5lbnRyaWVzW3RoaXMuX3JldmVyc2UgPyBtYXhJbmRleCAtIGluZGV4IDogaW5kZXhdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbWF4SW5kZXggPSBub2RlLm5vZGVzLmxlbmd0aCAtIDE7XG4gICAgICAgICAgaWYgKGluZGV4IDw9IG1heEluZGV4KSB7XG4gICAgICAgICAgICB2YXIgc3ViTm9kZSA9IG5vZGUubm9kZXNbdGhpcy5fcmV2ZXJzZSA/IG1heEluZGV4IC0gaW5kZXggOiBpbmRleF07XG4gICAgICAgICAgICBpZiAoc3ViTm9kZSkge1xuICAgICAgICAgICAgICBpZiAoc3ViTm9kZS5lbnRyeSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBtYXBJdGVyYXRvclZhbHVlKHR5cGUsIHN1Yk5vZGUuZW50cnkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHN0YWNrID0gdGhpcy5fc3RhY2sgPSBtYXBJdGVyYXRvckZyYW1lKHN1Yk5vZGUsIHN0YWNrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzdGFjayA9IHRoaXMuX3N0YWNrID0gdGhpcy5fc3RhY2suX19wcmV2O1xuICAgICAgfVxuICAgICAgcmV0dXJuIGl0ZXJhdG9yRG9uZSgpO1xuICAgIH07XG5cblxuICBmdW5jdGlvbiBtYXBJdGVyYXRvclZhbHVlKHR5cGUsIGVudHJ5KSB7XG4gICAgcmV0dXJuIGl0ZXJhdG9yVmFsdWUodHlwZSwgZW50cnlbMF0sIGVudHJ5WzFdKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1hcEl0ZXJhdG9yRnJhbWUobm9kZSwgcHJldikge1xuICAgIHJldHVybiB7XG4gICAgICBub2RlOiBub2RlLFxuICAgICAgaW5kZXg6IDAsXG4gICAgICBfX3ByZXY6IHByZXZcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gbWFrZU1hcChzaXplLCByb290LCBvd25lcklELCBoYXNoKSB7XG4gICAgdmFyIG1hcCA9IE9iamVjdC5jcmVhdGUoTWFwUHJvdG90eXBlKTtcbiAgICBtYXAuc2l6ZSA9IHNpemU7XG4gICAgbWFwLl9yb290ID0gcm9vdDtcbiAgICBtYXAuX19vd25lcklEID0gb3duZXJJRDtcbiAgICBtYXAuX19oYXNoID0gaGFzaDtcbiAgICBtYXAuX19hbHRlcmVkID0gZmFsc2U7XG4gICAgcmV0dXJuIG1hcDtcbiAgfVxuXG4gIHZhciBFTVBUWV9NQVA7XG4gIGZ1bmN0aW9uIGVtcHR5TWFwKCkge1xuICAgIHJldHVybiBFTVBUWV9NQVAgfHwgKEVNUFRZX01BUCA9IG1ha2VNYXAoMCkpO1xuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlTWFwKG1hcCwgaywgdikge1xuICAgIHZhciBuZXdSb290O1xuICAgIHZhciBuZXdTaXplO1xuICAgIGlmICghbWFwLl9yb290KSB7XG4gICAgICBpZiAodiA9PT0gTk9UX1NFVCkge1xuICAgICAgICByZXR1cm4gbWFwO1xuICAgICAgfVxuICAgICAgbmV3U2l6ZSA9IDE7XG4gICAgICBuZXdSb290ID0gbmV3IEFycmF5TWFwTm9kZShtYXAuX19vd25lcklELCBbW2ssIHZdXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBkaWRDaGFuZ2VTaXplID0gTWFrZVJlZihDSEFOR0VfTEVOR1RIKTtcbiAgICAgIHZhciBkaWRBbHRlciA9IE1ha2VSZWYoRElEX0FMVEVSKTtcbiAgICAgIG5ld1Jvb3QgPSB1cGRhdGVOb2RlKG1hcC5fcm9vdCwgbWFwLl9fb3duZXJJRCwgMCwgdW5kZWZpbmVkLCBrLCB2LCBkaWRDaGFuZ2VTaXplLCBkaWRBbHRlcik7XG4gICAgICBpZiAoIWRpZEFsdGVyLnZhbHVlKSB7XG4gICAgICAgIHJldHVybiBtYXA7XG4gICAgICB9XG4gICAgICBuZXdTaXplID0gbWFwLnNpemUgKyAoZGlkQ2hhbmdlU2l6ZS52YWx1ZSA/IHYgPT09IE5PVF9TRVQgPyAtMSA6IDEgOiAwKTtcbiAgICB9XG4gICAgaWYgKG1hcC5fX293bmVySUQpIHtcbiAgICAgIG1hcC5zaXplID0gbmV3U2l6ZTtcbiAgICAgIG1hcC5fcm9vdCA9IG5ld1Jvb3Q7XG4gICAgICBtYXAuX19oYXNoID0gdW5kZWZpbmVkO1xuICAgICAgbWFwLl9fYWx0ZXJlZCA9IHRydWU7XG4gICAgICByZXR1cm4gbWFwO1xuICAgIH1cbiAgICByZXR1cm4gbmV3Um9vdCA/IG1ha2VNYXAobmV3U2l6ZSwgbmV3Um9vdCkgOiBlbXB0eU1hcCgpO1xuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlTm9kZShub2RlLCBvd25lcklELCBzaGlmdCwga2V5SGFzaCwga2V5LCB2YWx1ZSwgZGlkQ2hhbmdlU2l6ZSwgZGlkQWx0ZXIpIHtcbiAgICBpZiAoIW5vZGUpIHtcbiAgICAgIGlmICh2YWx1ZSA9PT0gTk9UX1NFVCkge1xuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICAgIH1cbiAgICAgIFNldFJlZihkaWRBbHRlcik7XG4gICAgICBTZXRSZWYoZGlkQ2hhbmdlU2l6ZSk7XG4gICAgICByZXR1cm4gbmV3IFZhbHVlTm9kZShvd25lcklELCBrZXlIYXNoLCBba2V5LCB2YWx1ZV0pO1xuICAgIH1cbiAgICByZXR1cm4gbm9kZS51cGRhdGUob3duZXJJRCwgc2hpZnQsIGtleUhhc2gsIGtleSwgdmFsdWUsIGRpZENoYW5nZVNpemUsIGRpZEFsdGVyKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzTGVhZk5vZGUobm9kZSkge1xuICAgIHJldHVybiBub2RlLmNvbnN0cnVjdG9yID09PSBWYWx1ZU5vZGUgfHwgbm9kZS5jb25zdHJ1Y3RvciA9PT0gSGFzaENvbGxpc2lvbk5vZGU7XG4gIH1cblxuICBmdW5jdGlvbiBtZXJnZUludG9Ob2RlKG5vZGUsIG93bmVySUQsIHNoaWZ0LCBrZXlIYXNoLCBlbnRyeSkge1xuICAgIGlmIChub2RlLmtleUhhc2ggPT09IGtleUhhc2gpIHtcbiAgICAgIHJldHVybiBuZXcgSGFzaENvbGxpc2lvbk5vZGUob3duZXJJRCwga2V5SGFzaCwgW25vZGUuZW50cnksIGVudHJ5XSk7XG4gICAgfVxuXG4gICAgdmFyIGlkeDEgPSAoc2hpZnQgPT09IDAgPyBub2RlLmtleUhhc2ggOiBub2RlLmtleUhhc2ggPj4+IHNoaWZ0KSAmIE1BU0s7XG4gICAgdmFyIGlkeDIgPSAoc2hpZnQgPT09IDAgPyBrZXlIYXNoIDoga2V5SGFzaCA+Pj4gc2hpZnQpICYgTUFTSztcblxuICAgIHZhciBuZXdOb2RlO1xuICAgIHZhciBub2RlcyA9IGlkeDEgPT09IGlkeDIgP1xuICAgICAgW21lcmdlSW50b05vZGUobm9kZSwgb3duZXJJRCwgc2hpZnQgKyBTSElGVCwga2V5SGFzaCwgZW50cnkpXSA6XG4gICAgICAoKG5ld05vZGUgPSBuZXcgVmFsdWVOb2RlKG93bmVySUQsIGtleUhhc2gsIGVudHJ5KSksIGlkeDEgPCBpZHgyID8gW25vZGUsIG5ld05vZGVdIDogW25ld05vZGUsIG5vZGVdKTtcblxuICAgIHJldHVybiBuZXcgQml0bWFwSW5kZXhlZE5vZGUob3duZXJJRCwgKDEgPDwgaWR4MSkgfCAoMSA8PCBpZHgyKSwgbm9kZXMpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlTm9kZXMob3duZXJJRCwgZW50cmllcywga2V5LCB2YWx1ZSkge1xuICAgIGlmICghb3duZXJJRCkge1xuICAgICAgb3duZXJJRCA9IG5ldyBPd25lcklEKCk7XG4gICAgfVxuICAgIHZhciBub2RlID0gbmV3IFZhbHVlTm9kZShvd25lcklELCBoYXNoKGtleSksIFtrZXksIHZhbHVlXSk7XG4gICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IGVudHJpZXMubGVuZ3RoOyBpaSsrKSB7XG4gICAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2lpXTtcbiAgICAgIG5vZGUgPSBub2RlLnVwZGF0ZShvd25lcklELCAwLCB1bmRlZmluZWQsIGVudHJ5WzBdLCBlbnRyeVsxXSk7XG4gICAgfVxuICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgZnVuY3Rpb24gcGFja05vZGVzKG93bmVySUQsIG5vZGVzLCBjb3VudCwgZXhjbHVkaW5nKSB7XG4gICAgdmFyIGJpdG1hcCA9IDA7XG4gICAgdmFyIHBhY2tlZElJID0gMDtcbiAgICB2YXIgcGFja2VkTm9kZXMgPSBuZXcgQXJyYXkoY291bnQpO1xuICAgIGZvciAodmFyIGlpID0gMCwgYml0ID0gMSwgbGVuID0gbm9kZXMubGVuZ3RoOyBpaSA8IGxlbjsgaWkrKywgYml0IDw8PSAxKSB7XG4gICAgICB2YXIgbm9kZSA9IG5vZGVzW2lpXTtcbiAgICAgIGlmIChub2RlICE9PSB1bmRlZmluZWQgJiYgaWkgIT09IGV4Y2x1ZGluZykge1xuICAgICAgICBiaXRtYXAgfD0gYml0O1xuICAgICAgICBwYWNrZWROb2Rlc1twYWNrZWRJSSsrXSA9IG5vZGU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuZXcgQml0bWFwSW5kZXhlZE5vZGUob3duZXJJRCwgYml0bWFwLCBwYWNrZWROb2Rlcyk7XG4gIH1cblxuICBmdW5jdGlvbiBleHBhbmROb2Rlcyhvd25lcklELCBub2RlcywgYml0bWFwLCBpbmNsdWRpbmcsIG5vZGUpIHtcbiAgICB2YXIgY291bnQgPSAwO1xuICAgIHZhciBleHBhbmRlZE5vZGVzID0gbmV3IEFycmF5KFNJWkUpO1xuICAgIGZvciAodmFyIGlpID0gMDsgYml0bWFwICE9PSAwOyBpaSsrLCBiaXRtYXAgPj4+PSAxKSB7XG4gICAgICBleHBhbmRlZE5vZGVzW2lpXSA9IGJpdG1hcCAmIDEgPyBub2Rlc1tjb3VudCsrXSA6IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgZXhwYW5kZWROb2Rlc1tpbmNsdWRpbmddID0gbm9kZTtcbiAgICByZXR1cm4gbmV3IEhhc2hBcnJheU1hcE5vZGUob3duZXJJRCwgY291bnQgKyAxLCBleHBhbmRlZE5vZGVzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1lcmdlSW50b01hcFdpdGgobWFwLCBtZXJnZXIsIGl0ZXJhYmxlcykge1xuICAgIHZhciBpdGVycyA9IFtdO1xuICAgIGZvciAodmFyIGlpID0gMDsgaWkgPCBpdGVyYWJsZXMubGVuZ3RoOyBpaSsrKSB7XG4gICAgICB2YXIgdmFsdWUgPSBpdGVyYWJsZXNbaWldO1xuICAgICAgdmFyIGl0ZXIgPSBLZXllZEl0ZXJhYmxlKHZhbHVlKTtcbiAgICAgIGlmICghaXNJdGVyYWJsZSh2YWx1ZSkpIHtcbiAgICAgICAgaXRlciA9IGl0ZXIubWFwKGZ1bmN0aW9uKHYgKSB7cmV0dXJuIGZyb21KUyh2KX0pO1xuICAgICAgfVxuICAgICAgaXRlcnMucHVzaChpdGVyKTtcbiAgICB9XG4gICAgcmV0dXJuIG1lcmdlSW50b0NvbGxlY3Rpb25XaXRoKG1hcCwgbWVyZ2VyLCBpdGVycyk7XG4gIH1cblxuICBmdW5jdGlvbiBkZWVwTWVyZ2VyKG1lcmdlcikge1xuICAgIHJldHVybiBmdW5jdGlvbihleGlzdGluZywgdmFsdWUpIFxuICAgICAge3JldHVybiBleGlzdGluZyAmJiBleGlzdGluZy5tZXJnZURlZXBXaXRoICYmIGlzSXRlcmFibGUodmFsdWUpID9cbiAgICAgICAgZXhpc3RpbmcubWVyZ2VEZWVwV2l0aChtZXJnZXIsIHZhbHVlKSA6XG4gICAgICAgIG1lcmdlciA/IG1lcmdlcihleGlzdGluZywgdmFsdWUpIDogdmFsdWV9O1xuICB9XG5cbiAgZnVuY3Rpb24gbWVyZ2VJbnRvQ29sbGVjdGlvbldpdGgoY29sbGVjdGlvbiwgbWVyZ2VyLCBpdGVycykge1xuICAgIGl0ZXJzID0gaXRlcnMuZmlsdGVyKGZ1bmN0aW9uKHggKSB7cmV0dXJuIHguc2l6ZSAhPT0gMH0pO1xuICAgIGlmIChpdGVycy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBjb2xsZWN0aW9uO1xuICAgIH1cbiAgICBpZiAoY29sbGVjdGlvbi5zaXplID09PSAwICYmIGl0ZXJzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb24uY29uc3RydWN0b3IoaXRlcnNbMF0pO1xuICAgIH1cbiAgICByZXR1cm4gY29sbGVjdGlvbi53aXRoTXV0YXRpb25zKGZ1bmN0aW9uKGNvbGxlY3Rpb24gKSB7XG4gICAgICB2YXIgbWVyZ2VJbnRvTWFwID0gbWVyZ2VyID9cbiAgICAgICAgZnVuY3Rpb24odmFsdWUsIGtleSkgIHtcbiAgICAgICAgICBjb2xsZWN0aW9uLnVwZGF0ZShrZXksIE5PVF9TRVQsIGZ1bmN0aW9uKGV4aXN0aW5nIClcbiAgICAgICAgICAgIHtyZXR1cm4gZXhpc3RpbmcgPT09IE5PVF9TRVQgPyB2YWx1ZSA6IG1lcmdlcihleGlzdGluZywgdmFsdWUpfVxuICAgICAgICAgICk7XG4gICAgICAgIH0gOlxuICAgICAgICBmdW5jdGlvbih2YWx1ZSwga2V5KSAge1xuICAgICAgICAgIGNvbGxlY3Rpb24uc2V0KGtleSwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICBmb3IgKHZhciBpaSA9IDA7IGlpIDwgaXRlcnMubGVuZ3RoOyBpaSsrKSB7XG4gICAgICAgIGl0ZXJzW2lpXS5mb3JFYWNoKG1lcmdlSW50b01hcCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVJbkRlZXBNYXAoZXhpc3RpbmcsIGtleVBhdGhJdGVyLCBub3RTZXRWYWx1ZSwgdXBkYXRlcikge1xuICAgIHZhciBpc05vdFNldCA9IGV4aXN0aW5nID09PSBOT1RfU0VUO1xuICAgIHZhciBzdGVwID0ga2V5UGF0aEl0ZXIubmV4dCgpO1xuICAgIGlmIChzdGVwLmRvbmUpIHtcbiAgICAgIHZhciBleGlzdGluZ1ZhbHVlID0gaXNOb3RTZXQgPyBub3RTZXRWYWx1ZSA6IGV4aXN0aW5nO1xuICAgICAgdmFyIG5ld1ZhbHVlID0gdXBkYXRlcihleGlzdGluZ1ZhbHVlKTtcbiAgICAgIHJldHVybiBuZXdWYWx1ZSA9PT0gZXhpc3RpbmdWYWx1ZSA/IGV4aXN0aW5nIDogbmV3VmFsdWU7XG4gICAgfVxuICAgIGludmFyaWFudChcbiAgICAgIGlzTm90U2V0IHx8IChleGlzdGluZyAmJiBleGlzdGluZy5zZXQpLFxuICAgICAgJ2ludmFsaWQga2V5UGF0aCdcbiAgICApO1xuICAgIHZhciBrZXkgPSBzdGVwLnZhbHVlO1xuICAgIHZhciBuZXh0RXhpc3RpbmcgPSBpc05vdFNldCA/IE5PVF9TRVQgOiBleGlzdGluZy5nZXQoa2V5LCBOT1RfU0VUKTtcbiAgICB2YXIgbmV4dFVwZGF0ZWQgPSB1cGRhdGVJbkRlZXBNYXAoXG4gICAgICBuZXh0RXhpc3RpbmcsXG4gICAgICBrZXlQYXRoSXRlcixcbiAgICAgIG5vdFNldFZhbHVlLFxuICAgICAgdXBkYXRlclxuICAgICk7XG4gICAgcmV0dXJuIG5leHRVcGRhdGVkID09PSBuZXh0RXhpc3RpbmcgPyBleGlzdGluZyA6XG4gICAgICBuZXh0VXBkYXRlZCA9PT0gTk9UX1NFVCA/IGV4aXN0aW5nLnJlbW92ZShrZXkpIDpcbiAgICAgIChpc05vdFNldCA/IGVtcHR5TWFwKCkgOiBleGlzdGluZykuc2V0KGtleSwgbmV4dFVwZGF0ZWQpO1xuICB9XG5cbiAgZnVuY3Rpb24gcG9wQ291bnQoeCkge1xuICAgIHggPSB4IC0gKCh4ID4+IDEpICYgMHg1NTU1NTU1NSk7XG4gICAgeCA9ICh4ICYgMHgzMzMzMzMzMykgKyAoKHggPj4gMikgJiAweDMzMzMzMzMzKTtcbiAgICB4ID0gKHggKyAoeCA+PiA0KSkgJiAweDBmMGYwZjBmO1xuICAgIHggPSB4ICsgKHggPj4gOCk7XG4gICAgeCA9IHggKyAoeCA+PiAxNik7XG4gICAgcmV0dXJuIHggJiAweDdmO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0SW4oYXJyYXksIGlkeCwgdmFsLCBjYW5FZGl0KSB7XG4gICAgdmFyIG5ld0FycmF5ID0gY2FuRWRpdCA/IGFycmF5IDogYXJyQ29weShhcnJheSk7XG4gICAgbmV3QXJyYXlbaWR4XSA9IHZhbDtcbiAgICByZXR1cm4gbmV3QXJyYXk7XG4gIH1cblxuICBmdW5jdGlvbiBzcGxpY2VJbihhcnJheSwgaWR4LCB2YWwsIGNhbkVkaXQpIHtcbiAgICB2YXIgbmV3TGVuID0gYXJyYXkubGVuZ3RoICsgMTtcbiAgICBpZiAoY2FuRWRpdCAmJiBpZHggKyAxID09PSBuZXdMZW4pIHtcbiAgICAgIGFycmF5W2lkeF0gPSB2YWw7XG4gICAgICByZXR1cm4gYXJyYXk7XG4gICAgfVxuICAgIHZhciBuZXdBcnJheSA9IG5ldyBBcnJheShuZXdMZW4pO1xuICAgIHZhciBhZnRlciA9IDA7XG4gICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IG5ld0xlbjsgaWkrKykge1xuICAgICAgaWYgKGlpID09PSBpZHgpIHtcbiAgICAgICAgbmV3QXJyYXlbaWldID0gdmFsO1xuICAgICAgICBhZnRlciA9IC0xO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV3QXJyYXlbaWldID0gYXJyYXlbaWkgKyBhZnRlcl07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuZXdBcnJheTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNwbGljZU91dChhcnJheSwgaWR4LCBjYW5FZGl0KSB7XG4gICAgdmFyIG5ld0xlbiA9IGFycmF5Lmxlbmd0aCAtIDE7XG4gICAgaWYgKGNhbkVkaXQgJiYgaWR4ID09PSBuZXdMZW4pIHtcbiAgICAgIGFycmF5LnBvcCgpO1xuICAgICAgcmV0dXJuIGFycmF5O1xuICAgIH1cbiAgICB2YXIgbmV3QXJyYXkgPSBuZXcgQXJyYXkobmV3TGVuKTtcbiAgICB2YXIgYWZ0ZXIgPSAwO1xuICAgIGZvciAodmFyIGlpID0gMDsgaWkgPCBuZXdMZW47IGlpKyspIHtcbiAgICAgIGlmIChpaSA9PT0gaWR4KSB7XG4gICAgICAgIGFmdGVyID0gMTtcbiAgICAgIH1cbiAgICAgIG5ld0FycmF5W2lpXSA9IGFycmF5W2lpICsgYWZ0ZXJdO1xuICAgIH1cbiAgICByZXR1cm4gbmV3QXJyYXk7XG4gIH1cblxuICB2YXIgTUFYX0FSUkFZX01BUF9TSVpFID0gU0laRSAvIDQ7XG4gIHZhciBNQVhfQklUTUFQX0lOREVYRURfU0laRSA9IFNJWkUgLyAyO1xuICB2YXIgTUlOX0hBU0hfQVJSQVlfTUFQX1NJWkUgPSBTSVpFIC8gNDtcblxuICBjcmVhdGVDbGFzcyhMaXN0LCBJbmRleGVkQ29sbGVjdGlvbik7XG5cbiAgICAvLyBAcHJhZ21hIENvbnN0cnVjdGlvblxuXG4gICAgZnVuY3Rpb24gTGlzdCh2YWx1ZSkge1xuICAgICAgdmFyIGVtcHR5ID0gZW1wdHlMaXN0KCk7XG4gICAgICBpZiAodmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gZW1wdHk7XG4gICAgICB9XG4gICAgICBpZiAoaXNMaXN0KHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICB9XG4gICAgICB2YXIgaXRlciA9IEluZGV4ZWRJdGVyYWJsZSh2YWx1ZSk7XG4gICAgICB2YXIgc2l6ZSA9IGl0ZXIuc2l6ZTtcbiAgICAgIGlmIChzaXplID09PSAwKSB7XG4gICAgICAgIHJldHVybiBlbXB0eTtcbiAgICAgIH1cbiAgICAgIGFzc2VydE5vdEluZmluaXRlKHNpemUpO1xuICAgICAgaWYgKHNpemUgPiAwICYmIHNpemUgPCBTSVpFKSB7XG4gICAgICAgIHJldHVybiBtYWtlTGlzdCgwLCBzaXplLCBTSElGVCwgbnVsbCwgbmV3IFZOb2RlKGl0ZXIudG9BcnJheSgpKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZW1wdHkud2l0aE11dGF0aW9ucyhmdW5jdGlvbihsaXN0ICkge1xuICAgICAgICBsaXN0LnNldFNpemUoc2l6ZSk7XG4gICAgICAgIGl0ZXIuZm9yRWFjaChmdW5jdGlvbih2LCBpKSAge3JldHVybiBsaXN0LnNldChpLCB2KX0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgTGlzdC5vZiA9IGZ1bmN0aW9uKC8qLi4udmFsdWVzKi8pIHtcbiAgICAgIHJldHVybiB0aGlzKGFyZ3VtZW50cyk7XG4gICAgfTtcblxuICAgIExpc3QucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fX3RvU3RyaW5nKCdMaXN0IFsnLCAnXScpO1xuICAgIH07XG5cbiAgICAvLyBAcHJhZ21hIEFjY2Vzc1xuXG4gICAgTGlzdC5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oaW5kZXgsIG5vdFNldFZhbHVlKSB7XG4gICAgICBpbmRleCA9IHdyYXBJbmRleCh0aGlzLCBpbmRleCk7XG4gICAgICBpZiAoaW5kZXggPCAwIHx8IGluZGV4ID49IHRoaXMuc2l6ZSkge1xuICAgICAgICByZXR1cm4gbm90U2V0VmFsdWU7XG4gICAgICB9XG4gICAgICBpbmRleCArPSB0aGlzLl9vcmlnaW47XG4gICAgICB2YXIgbm9kZSA9IGxpc3ROb2RlRm9yKHRoaXMsIGluZGV4KTtcbiAgICAgIHJldHVybiBub2RlICYmIG5vZGUuYXJyYXlbaW5kZXggJiBNQVNLXTtcbiAgICB9O1xuXG4gICAgLy8gQHByYWdtYSBNb2RpZmljYXRpb25cblxuICAgIExpc3QucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKGluZGV4LCB2YWx1ZSkge1xuICAgICAgcmV0dXJuIHVwZGF0ZUxpc3QodGhpcywgaW5kZXgsIHZhbHVlKTtcbiAgICB9O1xuXG4gICAgTGlzdC5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgIHJldHVybiAhdGhpcy5oYXMoaW5kZXgpID8gdGhpcyA6XG4gICAgICAgIGluZGV4ID09PSAwID8gdGhpcy5zaGlmdCgpIDpcbiAgICAgICAgaW5kZXggPT09IHRoaXMuc2l6ZSAtIDEgPyB0aGlzLnBvcCgpIDpcbiAgICAgICAgdGhpcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH07XG5cbiAgICBMaXN0LnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHRoaXMuc2l6ZSA9PT0gMCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLl9fb3duZXJJRCkge1xuICAgICAgICB0aGlzLnNpemUgPSB0aGlzLl9vcmlnaW4gPSB0aGlzLl9jYXBhY2l0eSA9IDA7XG4gICAgICAgIHRoaXMuX2xldmVsID0gU0hJRlQ7XG4gICAgICAgIHRoaXMuX3Jvb3QgPSB0aGlzLl90YWlsID0gbnVsbDtcbiAgICAgICAgdGhpcy5fX2hhc2ggPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuX19hbHRlcmVkID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICByZXR1cm4gZW1wdHlMaXN0KCk7XG4gICAgfTtcblxuICAgIExpc3QucHJvdG90eXBlLnB1c2ggPSBmdW5jdGlvbigvKi4uLnZhbHVlcyovKSB7XG4gICAgICB2YXIgdmFsdWVzID0gYXJndW1lbnRzO1xuICAgICAgdmFyIG9sZFNpemUgPSB0aGlzLnNpemU7XG4gICAgICByZXR1cm4gdGhpcy53aXRoTXV0YXRpb25zKGZ1bmN0aW9uKGxpc3QgKSB7XG4gICAgICAgIHNldExpc3RCb3VuZHMobGlzdCwgMCwgb2xkU2l6ZSArIHZhbHVlcy5sZW5ndGgpO1xuICAgICAgICBmb3IgKHZhciBpaSA9IDA7IGlpIDwgdmFsdWVzLmxlbmd0aDsgaWkrKykge1xuICAgICAgICAgIGxpc3Quc2V0KG9sZFNpemUgKyBpaSwgdmFsdWVzW2lpXSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBMaXN0LnByb3RvdHlwZS5wb3AgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBzZXRMaXN0Qm91bmRzKHRoaXMsIDAsIC0xKTtcbiAgICB9O1xuXG4gICAgTGlzdC5wcm90b3R5cGUudW5zaGlmdCA9IGZ1bmN0aW9uKC8qLi4udmFsdWVzKi8pIHtcbiAgICAgIHZhciB2YWx1ZXMgPSBhcmd1bWVudHM7XG4gICAgICByZXR1cm4gdGhpcy53aXRoTXV0YXRpb25zKGZ1bmN0aW9uKGxpc3QgKSB7XG4gICAgICAgIHNldExpc3RCb3VuZHMobGlzdCwgLXZhbHVlcy5sZW5ndGgpO1xuICAgICAgICBmb3IgKHZhciBpaSA9IDA7IGlpIDwgdmFsdWVzLmxlbmd0aDsgaWkrKykge1xuICAgICAgICAgIGxpc3Quc2V0KGlpLCB2YWx1ZXNbaWldKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIExpc3QucHJvdG90eXBlLnNoaWZ0ID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gc2V0TGlzdEJvdW5kcyh0aGlzLCAxKTtcbiAgICB9O1xuXG4gICAgLy8gQHByYWdtYSBDb21wb3NpdGlvblxuXG4gICAgTGlzdC5wcm90b3R5cGUubWVyZ2UgPSBmdW5jdGlvbigvKi4uLml0ZXJzKi8pIHtcbiAgICAgIHJldHVybiBtZXJnZUludG9MaXN0V2l0aCh0aGlzLCB1bmRlZmluZWQsIGFyZ3VtZW50cyk7XG4gICAgfTtcblxuICAgIExpc3QucHJvdG90eXBlLm1lcmdlV2l0aCA9IGZ1bmN0aW9uKG1lcmdlcikge3ZhciBpdGVycyA9IFNMSUNFJDAuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgcmV0dXJuIG1lcmdlSW50b0xpc3RXaXRoKHRoaXMsIG1lcmdlciwgaXRlcnMpO1xuICAgIH07XG5cbiAgICBMaXN0LnByb3RvdHlwZS5tZXJnZURlZXAgPSBmdW5jdGlvbigvKi4uLml0ZXJzKi8pIHtcbiAgICAgIHJldHVybiBtZXJnZUludG9MaXN0V2l0aCh0aGlzLCBkZWVwTWVyZ2VyKHVuZGVmaW5lZCksIGFyZ3VtZW50cyk7XG4gICAgfTtcblxuICAgIExpc3QucHJvdG90eXBlLm1lcmdlRGVlcFdpdGggPSBmdW5jdGlvbihtZXJnZXIpIHt2YXIgaXRlcnMgPSBTTElDRSQwLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgIHJldHVybiBtZXJnZUludG9MaXN0V2l0aCh0aGlzLCBkZWVwTWVyZ2VyKG1lcmdlciksIGl0ZXJzKTtcbiAgICB9O1xuXG4gICAgTGlzdC5wcm90b3R5cGUuc2V0U2l6ZSA9IGZ1bmN0aW9uKHNpemUpIHtcbiAgICAgIHJldHVybiBzZXRMaXN0Qm91bmRzKHRoaXMsIDAsIHNpemUpO1xuICAgIH07XG5cbiAgICAvLyBAcHJhZ21hIEl0ZXJhdGlvblxuXG4gICAgTGlzdC5wcm90b3R5cGUuc2xpY2UgPSBmdW5jdGlvbihiZWdpbiwgZW5kKSB7XG4gICAgICB2YXIgc2l6ZSA9IHRoaXMuc2l6ZTtcbiAgICAgIGlmICh3aG9sZVNsaWNlKGJlZ2luLCBlbmQsIHNpemUpKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNldExpc3RCb3VuZHMoXG4gICAgICAgIHRoaXMsXG4gICAgICAgIHJlc29sdmVCZWdpbihiZWdpbiwgc2l6ZSksXG4gICAgICAgIHJlc29sdmVFbmQoZW5kLCBzaXplKVxuICAgICAgKTtcbiAgICB9O1xuXG4gICAgTGlzdC5wcm90b3R5cGUuX19pdGVyYXRvciA9IGZ1bmN0aW9uKHR5cGUsIHJldmVyc2UpIHtcbiAgICAgIHZhciBpbmRleCA9IDA7XG4gICAgICB2YXIgdmFsdWVzID0gaXRlcmF0ZUxpc3QodGhpcywgcmV2ZXJzZSk7XG4gICAgICByZXR1cm4gbmV3IHNyY19JdGVyYXRvcl9fSXRlcmF0b3IoZnVuY3Rpb24oKSAge1xuICAgICAgICB2YXIgdmFsdWUgPSB2YWx1ZXMoKTtcbiAgICAgICAgcmV0dXJuIHZhbHVlID09PSBET05FID9cbiAgICAgICAgICBpdGVyYXRvckRvbmUoKSA6XG4gICAgICAgICAgaXRlcmF0b3JWYWx1ZSh0eXBlLCBpbmRleCsrLCB2YWx1ZSk7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgTGlzdC5wcm90b3R5cGUuX19pdGVyYXRlID0gZnVuY3Rpb24oZm4sIHJldmVyc2UpIHtcbiAgICAgIHZhciBpbmRleCA9IDA7XG4gICAgICB2YXIgdmFsdWVzID0gaXRlcmF0ZUxpc3QodGhpcywgcmV2ZXJzZSk7XG4gICAgICB2YXIgdmFsdWU7XG4gICAgICB3aGlsZSAoKHZhbHVlID0gdmFsdWVzKCkpICE9PSBET05FKSB7XG4gICAgICAgIGlmIChmbih2YWx1ZSwgaW5kZXgrKywgdGhpcykgPT09IGZhbHNlKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBpbmRleDtcbiAgICB9O1xuXG4gICAgTGlzdC5wcm90b3R5cGUuX19lbnN1cmVPd25lciA9IGZ1bmN0aW9uKG93bmVySUQpIHtcbiAgICAgIGlmIChvd25lcklEID09PSB0aGlzLl9fb3duZXJJRCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICAgIGlmICghb3duZXJJRCkge1xuICAgICAgICB0aGlzLl9fb3duZXJJRCA9IG93bmVySUQ7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG1ha2VMaXN0KHRoaXMuX29yaWdpbiwgdGhpcy5fY2FwYWNpdHksIHRoaXMuX2xldmVsLCB0aGlzLl9yb290LCB0aGlzLl90YWlsLCBvd25lcklELCB0aGlzLl9faGFzaCk7XG4gICAgfTtcblxuXG4gIGZ1bmN0aW9uIGlzTGlzdChtYXliZUxpc3QpIHtcbiAgICByZXR1cm4gISEobWF5YmVMaXN0ICYmIG1heWJlTGlzdFtJU19MSVNUX1NFTlRJTkVMXSk7XG4gIH1cblxuICBMaXN0LmlzTGlzdCA9IGlzTGlzdDtcblxuICB2YXIgSVNfTElTVF9TRU5USU5FTCA9ICdAQF9fSU1NVVRBQkxFX0xJU1RfX0BAJztcblxuICB2YXIgTGlzdFByb3RvdHlwZSA9IExpc3QucHJvdG90eXBlO1xuICBMaXN0UHJvdG90eXBlW0lTX0xJU1RfU0VOVElORUxdID0gdHJ1ZTtcbiAgTGlzdFByb3RvdHlwZVtERUxFVEVdID0gTGlzdFByb3RvdHlwZS5yZW1vdmU7XG4gIExpc3RQcm90b3R5cGUuc2V0SW4gPSBNYXBQcm90b3R5cGUuc2V0SW47XG4gIExpc3RQcm90b3R5cGUuZGVsZXRlSW4gPVxuICBMaXN0UHJvdG90eXBlLnJlbW92ZUluID0gTWFwUHJvdG90eXBlLnJlbW92ZUluO1xuICBMaXN0UHJvdG90eXBlLnVwZGF0ZSA9IE1hcFByb3RvdHlwZS51cGRhdGU7XG4gIExpc3RQcm90b3R5cGUudXBkYXRlSW4gPSBNYXBQcm90b3R5cGUudXBkYXRlSW47XG4gIExpc3RQcm90b3R5cGUubWVyZ2VJbiA9IE1hcFByb3RvdHlwZS5tZXJnZUluO1xuICBMaXN0UHJvdG90eXBlLm1lcmdlRGVlcEluID0gTWFwUHJvdG90eXBlLm1lcmdlRGVlcEluO1xuICBMaXN0UHJvdG90eXBlLndpdGhNdXRhdGlvbnMgPSBNYXBQcm90b3R5cGUud2l0aE11dGF0aW9ucztcbiAgTGlzdFByb3RvdHlwZS5hc011dGFibGUgPSBNYXBQcm90b3R5cGUuYXNNdXRhYmxlO1xuICBMaXN0UHJvdG90eXBlLmFzSW1tdXRhYmxlID0gTWFwUHJvdG90eXBlLmFzSW1tdXRhYmxlO1xuICBMaXN0UHJvdG90eXBlLndhc0FsdGVyZWQgPSBNYXBQcm90b3R5cGUud2FzQWx0ZXJlZDtcblxuXG5cbiAgICBmdW5jdGlvbiBWTm9kZShhcnJheSwgb3duZXJJRCkge1xuICAgICAgdGhpcy5hcnJheSA9IGFycmF5O1xuICAgICAgdGhpcy5vd25lcklEID0gb3duZXJJRDtcbiAgICB9XG5cbiAgICAvLyBUT0RPOiBzZWVtcyBsaWtlIHRoZXNlIG1ldGhvZHMgYXJlIHZlcnkgc2ltaWxhclxuXG4gICAgVk5vZGUucHJvdG90eXBlLnJlbW92ZUJlZm9yZSA9IGZ1bmN0aW9uKG93bmVySUQsIGxldmVsLCBpbmRleCkge1xuICAgICAgaWYgKGluZGV4ID09PSBsZXZlbCA/IDEgPDwgbGV2ZWwgOiAwIHx8IHRoaXMuYXJyYXkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgdmFyIG9yaWdpbkluZGV4ID0gKGluZGV4ID4+PiBsZXZlbCkgJiBNQVNLO1xuICAgICAgaWYgKG9yaWdpbkluZGV4ID49IHRoaXMuYXJyYXkubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBuZXcgVk5vZGUoW10sIG93bmVySUQpO1xuICAgICAgfVxuICAgICAgdmFyIHJlbW92aW5nRmlyc3QgPSBvcmlnaW5JbmRleCA9PT0gMDtcbiAgICAgIHZhciBuZXdDaGlsZDtcbiAgICAgIGlmIChsZXZlbCA+IDApIHtcbiAgICAgICAgdmFyIG9sZENoaWxkID0gdGhpcy5hcnJheVtvcmlnaW5JbmRleF07XG4gICAgICAgIG5ld0NoaWxkID0gb2xkQ2hpbGQgJiYgb2xkQ2hpbGQucmVtb3ZlQmVmb3JlKG93bmVySUQsIGxldmVsIC0gU0hJRlQsIGluZGV4KTtcbiAgICAgICAgaWYgKG5ld0NoaWxkID09PSBvbGRDaGlsZCAmJiByZW1vdmluZ0ZpcnN0KSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChyZW1vdmluZ0ZpcnN0ICYmICFuZXdDaGlsZCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICAgIHZhciBlZGl0YWJsZSA9IGVkaXRhYmxlVk5vZGUodGhpcywgb3duZXJJRCk7XG4gICAgICBpZiAoIXJlbW92aW5nRmlyc3QpIHtcbiAgICAgICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IG9yaWdpbkluZGV4OyBpaSsrKSB7XG4gICAgICAgICAgZWRpdGFibGUuYXJyYXlbaWldID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAobmV3Q2hpbGQpIHtcbiAgICAgICAgZWRpdGFibGUuYXJyYXlbb3JpZ2luSW5kZXhdID0gbmV3Q2hpbGQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gZWRpdGFibGU7XG4gICAgfTtcblxuICAgIFZOb2RlLnByb3RvdHlwZS5yZW1vdmVBZnRlciA9IGZ1bmN0aW9uKG93bmVySUQsIGxldmVsLCBpbmRleCkge1xuICAgICAgaWYgKGluZGV4ID09PSBsZXZlbCA/IDEgPDwgbGV2ZWwgOiAwIHx8IHRoaXMuYXJyYXkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgdmFyIHNpemVJbmRleCA9ICgoaW5kZXggLSAxKSA+Pj4gbGV2ZWwpICYgTUFTSztcbiAgICAgIGlmIChzaXplSW5kZXggPj0gdGhpcy5hcnJheS5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICB2YXIgcmVtb3ZpbmdMYXN0ID0gc2l6ZUluZGV4ID09PSB0aGlzLmFycmF5Lmxlbmd0aCAtIDE7XG4gICAgICB2YXIgbmV3Q2hpbGQ7XG4gICAgICBpZiAobGV2ZWwgPiAwKSB7XG4gICAgICAgIHZhciBvbGRDaGlsZCA9IHRoaXMuYXJyYXlbc2l6ZUluZGV4XTtcbiAgICAgICAgbmV3Q2hpbGQgPSBvbGRDaGlsZCAmJiBvbGRDaGlsZC5yZW1vdmVBZnRlcihvd25lcklELCBsZXZlbCAtIFNISUZULCBpbmRleCk7XG4gICAgICAgIGlmIChuZXdDaGlsZCA9PT0gb2xkQ2hpbGQgJiYgcmVtb3ZpbmdMYXN0KSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChyZW1vdmluZ0xhc3QgJiYgIW5ld0NoaWxkKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgdmFyIGVkaXRhYmxlID0gZWRpdGFibGVWTm9kZSh0aGlzLCBvd25lcklEKTtcbiAgICAgIGlmICghcmVtb3ZpbmdMYXN0KSB7XG4gICAgICAgIGVkaXRhYmxlLmFycmF5LnBvcCgpO1xuICAgICAgfVxuICAgICAgaWYgKG5ld0NoaWxkKSB7XG4gICAgICAgIGVkaXRhYmxlLmFycmF5W3NpemVJbmRleF0gPSBuZXdDaGlsZDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBlZGl0YWJsZTtcbiAgICB9O1xuXG5cblxuICB2YXIgRE9ORSA9IHt9O1xuXG4gIGZ1bmN0aW9uIGl0ZXJhdGVMaXN0KGxpc3QsIHJldmVyc2UpIHtcbiAgICB2YXIgbGVmdCA9IGxpc3QuX29yaWdpbjtcbiAgICB2YXIgcmlnaHQgPSBsaXN0Ll9jYXBhY2l0eTtcbiAgICB2YXIgdGFpbFBvcyA9IGdldFRhaWxPZmZzZXQocmlnaHQpO1xuICAgIHZhciB0YWlsID0gbGlzdC5fdGFpbDtcblxuICAgIHJldHVybiBpdGVyYXRlTm9kZU9yTGVhZihsaXN0Ll9yb290LCBsaXN0Ll9sZXZlbCwgMCk7XG5cbiAgICBmdW5jdGlvbiBpdGVyYXRlTm9kZU9yTGVhZihub2RlLCBsZXZlbCwgb2Zmc2V0KSB7XG4gICAgICByZXR1cm4gbGV2ZWwgPT09IDAgP1xuICAgICAgICBpdGVyYXRlTGVhZihub2RlLCBvZmZzZXQpIDpcbiAgICAgICAgaXRlcmF0ZU5vZGUobm9kZSwgbGV2ZWwsIG9mZnNldCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXRlcmF0ZUxlYWYobm9kZSwgb2Zmc2V0KSB7XG4gICAgICB2YXIgYXJyYXkgPSBvZmZzZXQgPT09IHRhaWxQb3MgPyB0YWlsICYmIHRhaWwuYXJyYXkgOiBub2RlICYmIG5vZGUuYXJyYXk7XG4gICAgICB2YXIgZnJvbSA9IG9mZnNldCA+IGxlZnQgPyAwIDogbGVmdCAtIG9mZnNldDtcbiAgICAgIHZhciB0byA9IHJpZ2h0IC0gb2Zmc2V0O1xuICAgICAgaWYgKHRvID4gU0laRSkge1xuICAgICAgICB0byA9IFNJWkU7XG4gICAgICB9XG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSAge1xuICAgICAgICBpZiAoZnJvbSA9PT0gdG8pIHtcbiAgICAgICAgICByZXR1cm4gRE9ORTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgaWR4ID0gcmV2ZXJzZSA/IC0tdG8gOiBmcm9tKys7XG4gICAgICAgIHJldHVybiBhcnJheSAmJiBhcnJheVtpZHhdO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpdGVyYXRlTm9kZShub2RlLCBsZXZlbCwgb2Zmc2V0KSB7XG4gICAgICB2YXIgdmFsdWVzO1xuICAgICAgdmFyIGFycmF5ID0gbm9kZSAmJiBub2RlLmFycmF5O1xuICAgICAgdmFyIGZyb20gPSBvZmZzZXQgPiBsZWZ0ID8gMCA6IChsZWZ0IC0gb2Zmc2V0KSA+PiBsZXZlbDtcbiAgICAgIHZhciB0byA9ICgocmlnaHQgLSBvZmZzZXQpID4+IGxldmVsKSArIDE7XG4gICAgICBpZiAodG8gPiBTSVpFKSB7XG4gICAgICAgIHRvID0gU0laRTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmdW5jdGlvbigpICB7XG4gICAgICAgIGRvIHtcbiAgICAgICAgICBpZiAodmFsdWVzKSB7XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSB2YWx1ZXMoKTtcbiAgICAgICAgICAgIGlmICh2YWx1ZSAhPT0gRE9ORSkge1xuICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YWx1ZXMgPSBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZnJvbSA9PT0gdG8pIHtcbiAgICAgICAgICAgIHJldHVybiBET05FO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgaWR4ID0gcmV2ZXJzZSA/IC0tdG8gOiBmcm9tKys7XG4gICAgICAgICAgdmFsdWVzID0gaXRlcmF0ZU5vZGVPckxlYWYoXG4gICAgICAgICAgICBhcnJheSAmJiBhcnJheVtpZHhdLCBsZXZlbCAtIFNISUZULCBvZmZzZXQgKyAoaWR4IDw8IGxldmVsKVxuICAgICAgICAgICk7XG4gICAgICAgIH0gd2hpbGUgKHRydWUpO1xuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBtYWtlTGlzdChvcmlnaW4sIGNhcGFjaXR5LCBsZXZlbCwgcm9vdCwgdGFpbCwgb3duZXJJRCwgaGFzaCkge1xuICAgIHZhciBsaXN0ID0gT2JqZWN0LmNyZWF0ZShMaXN0UHJvdG90eXBlKTtcbiAgICBsaXN0LnNpemUgPSBjYXBhY2l0eSAtIG9yaWdpbjtcbiAgICBsaXN0Ll9vcmlnaW4gPSBvcmlnaW47XG4gICAgbGlzdC5fY2FwYWNpdHkgPSBjYXBhY2l0eTtcbiAgICBsaXN0Ll9sZXZlbCA9IGxldmVsO1xuICAgIGxpc3QuX3Jvb3QgPSByb290O1xuICAgIGxpc3QuX3RhaWwgPSB0YWlsO1xuICAgIGxpc3QuX19vd25lcklEID0gb3duZXJJRDtcbiAgICBsaXN0Ll9faGFzaCA9IGhhc2g7XG4gICAgbGlzdC5fX2FsdGVyZWQgPSBmYWxzZTtcbiAgICByZXR1cm4gbGlzdDtcbiAgfVxuXG4gIHZhciBFTVBUWV9MSVNUO1xuICBmdW5jdGlvbiBlbXB0eUxpc3QoKSB7XG4gICAgcmV0dXJuIEVNUFRZX0xJU1QgfHwgKEVNUFRZX0xJU1QgPSBtYWtlTGlzdCgwLCAwLCBTSElGVCkpO1xuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlTGlzdChsaXN0LCBpbmRleCwgdmFsdWUpIHtcbiAgICBpbmRleCA9IHdyYXBJbmRleChsaXN0LCBpbmRleCk7XG5cbiAgICBpZiAoaW5kZXggPj0gbGlzdC5zaXplIHx8IGluZGV4IDwgMCkge1xuICAgICAgcmV0dXJuIGxpc3Qud2l0aE11dGF0aW9ucyhmdW5jdGlvbihsaXN0ICkge1xuICAgICAgICBpbmRleCA8IDAgP1xuICAgICAgICAgIHNldExpc3RCb3VuZHMobGlzdCwgaW5kZXgpLnNldCgwLCB2YWx1ZSkgOlxuICAgICAgICAgIHNldExpc3RCb3VuZHMobGlzdCwgMCwgaW5kZXggKyAxKS5zZXQoaW5kZXgsIHZhbHVlKVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaW5kZXggKz0gbGlzdC5fb3JpZ2luO1xuXG4gICAgdmFyIG5ld1RhaWwgPSBsaXN0Ll90YWlsO1xuICAgIHZhciBuZXdSb290ID0gbGlzdC5fcm9vdDtcbiAgICB2YXIgZGlkQWx0ZXIgPSBNYWtlUmVmKERJRF9BTFRFUik7XG4gICAgaWYgKGluZGV4ID49IGdldFRhaWxPZmZzZXQobGlzdC5fY2FwYWNpdHkpKSB7XG4gICAgICBuZXdUYWlsID0gdXBkYXRlVk5vZGUobmV3VGFpbCwgbGlzdC5fX293bmVySUQsIDAsIGluZGV4LCB2YWx1ZSwgZGlkQWx0ZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXdSb290ID0gdXBkYXRlVk5vZGUobmV3Um9vdCwgbGlzdC5fX293bmVySUQsIGxpc3QuX2xldmVsLCBpbmRleCwgdmFsdWUsIGRpZEFsdGVyKTtcbiAgICB9XG5cbiAgICBpZiAoIWRpZEFsdGVyLnZhbHVlKSB7XG4gICAgICByZXR1cm4gbGlzdDtcbiAgICB9XG5cbiAgICBpZiAobGlzdC5fX293bmVySUQpIHtcbiAgICAgIGxpc3QuX3Jvb3QgPSBuZXdSb290O1xuICAgICAgbGlzdC5fdGFpbCA9IG5ld1RhaWw7XG4gICAgICBsaXN0Ll9faGFzaCA9IHVuZGVmaW5lZDtcbiAgICAgIGxpc3QuX19hbHRlcmVkID0gdHJ1ZTtcbiAgICAgIHJldHVybiBsaXN0O1xuICAgIH1cbiAgICByZXR1cm4gbWFrZUxpc3QobGlzdC5fb3JpZ2luLCBsaXN0Ll9jYXBhY2l0eSwgbGlzdC5fbGV2ZWwsIG5ld1Jvb3QsIG5ld1RhaWwpO1xuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlVk5vZGUobm9kZSwgb3duZXJJRCwgbGV2ZWwsIGluZGV4LCB2YWx1ZSwgZGlkQWx0ZXIpIHtcbiAgICB2YXIgaWR4ID0gKGluZGV4ID4+PiBsZXZlbCkgJiBNQVNLO1xuICAgIHZhciBub2RlSGFzID0gbm9kZSAmJiBpZHggPCBub2RlLmFycmF5Lmxlbmd0aDtcbiAgICBpZiAoIW5vZGVIYXMgJiYgdmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuXG4gICAgdmFyIG5ld05vZGU7XG5cbiAgICBpZiAobGV2ZWwgPiAwKSB7XG4gICAgICB2YXIgbG93ZXJOb2RlID0gbm9kZSAmJiBub2RlLmFycmF5W2lkeF07XG4gICAgICB2YXIgbmV3TG93ZXJOb2RlID0gdXBkYXRlVk5vZGUobG93ZXJOb2RlLCBvd25lcklELCBsZXZlbCAtIFNISUZULCBpbmRleCwgdmFsdWUsIGRpZEFsdGVyKTtcbiAgICAgIGlmIChuZXdMb3dlck5vZGUgPT09IGxvd2VyTm9kZSkge1xuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICAgIH1cbiAgICAgIG5ld05vZGUgPSBlZGl0YWJsZVZOb2RlKG5vZGUsIG93bmVySUQpO1xuICAgICAgbmV3Tm9kZS5hcnJheVtpZHhdID0gbmV3TG93ZXJOb2RlO1xuICAgICAgcmV0dXJuIG5ld05vZGU7XG4gICAgfVxuXG4gICAgaWYgKG5vZGVIYXMgJiYgbm9kZS5hcnJheVtpZHhdID09PSB2YWx1ZSkge1xuICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuXG4gICAgU2V0UmVmKGRpZEFsdGVyKTtcblxuICAgIG5ld05vZGUgPSBlZGl0YWJsZVZOb2RlKG5vZGUsIG93bmVySUQpO1xuICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkICYmIGlkeCA9PT0gbmV3Tm9kZS5hcnJheS5sZW5ndGggLSAxKSB7XG4gICAgICBuZXdOb2RlLmFycmF5LnBvcCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXdOb2RlLmFycmF5W2lkeF0gPSB2YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIG5ld05vZGU7XG4gIH1cblxuICBmdW5jdGlvbiBlZGl0YWJsZVZOb2RlKG5vZGUsIG93bmVySUQpIHtcbiAgICBpZiAob3duZXJJRCAmJiBub2RlICYmIG93bmVySUQgPT09IG5vZGUub3duZXJJRCkge1xuICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuICAgIHJldHVybiBuZXcgVk5vZGUobm9kZSA/IG5vZGUuYXJyYXkuc2xpY2UoKSA6IFtdLCBvd25lcklEKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGxpc3ROb2RlRm9yKGxpc3QsIHJhd0luZGV4KSB7XG4gICAgaWYgKHJhd0luZGV4ID49IGdldFRhaWxPZmZzZXQobGlzdC5fY2FwYWNpdHkpKSB7XG4gICAgICByZXR1cm4gbGlzdC5fdGFpbDtcbiAgICB9XG4gICAgaWYgKHJhd0luZGV4IDwgMSA8PCAobGlzdC5fbGV2ZWwgKyBTSElGVCkpIHtcbiAgICAgIHZhciBub2RlID0gbGlzdC5fcm9vdDtcbiAgICAgIHZhciBsZXZlbCA9IGxpc3QuX2xldmVsO1xuICAgICAgd2hpbGUgKG5vZGUgJiYgbGV2ZWwgPiAwKSB7XG4gICAgICAgIG5vZGUgPSBub2RlLmFycmF5WyhyYXdJbmRleCA+Pj4gbGV2ZWwpICYgTUFTS107XG4gICAgICAgIGxldmVsIC09IFNISUZUO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc2V0TGlzdEJvdW5kcyhsaXN0LCBiZWdpbiwgZW5kKSB7XG4gICAgdmFyIG93bmVyID0gbGlzdC5fX293bmVySUQgfHwgbmV3IE93bmVySUQoKTtcbiAgICB2YXIgb2xkT3JpZ2luID0gbGlzdC5fb3JpZ2luO1xuICAgIHZhciBvbGRDYXBhY2l0eSA9IGxpc3QuX2NhcGFjaXR5O1xuICAgIHZhciBuZXdPcmlnaW4gPSBvbGRPcmlnaW4gKyBiZWdpbjtcbiAgICB2YXIgbmV3Q2FwYWNpdHkgPSBlbmQgPT09IHVuZGVmaW5lZCA/IG9sZENhcGFjaXR5IDogZW5kIDwgMCA/IG9sZENhcGFjaXR5ICsgZW5kIDogb2xkT3JpZ2luICsgZW5kO1xuICAgIGlmIChuZXdPcmlnaW4gPT09IG9sZE9yaWdpbiAmJiBuZXdDYXBhY2l0eSA9PT0gb2xkQ2FwYWNpdHkpIHtcbiAgICAgIHJldHVybiBsaXN0O1xuICAgIH1cblxuICAgIC8vIElmIGl0J3MgZ29pbmcgdG8gZW5kIGFmdGVyIGl0IHN0YXJ0cywgaXQncyBlbXB0eS5cbiAgICBpZiAobmV3T3JpZ2luID49IG5ld0NhcGFjaXR5KSB7XG4gICAgICByZXR1cm4gbGlzdC5jbGVhcigpO1xuICAgIH1cblxuICAgIHZhciBuZXdMZXZlbCA9IGxpc3QuX2xldmVsO1xuICAgIHZhciBuZXdSb290ID0gbGlzdC5fcm9vdDtcblxuICAgIC8vIE5ldyBvcmlnaW4gbWlnaHQgcmVxdWlyZSBjcmVhdGluZyBhIGhpZ2hlciByb290LlxuICAgIHZhciBvZmZzZXRTaGlmdCA9IDA7XG4gICAgd2hpbGUgKG5ld09yaWdpbiArIG9mZnNldFNoaWZ0IDwgMCkge1xuICAgICAgbmV3Um9vdCA9IG5ldyBWTm9kZShuZXdSb290ICYmIG5ld1Jvb3QuYXJyYXkubGVuZ3RoID8gW3VuZGVmaW5lZCwgbmV3Um9vdF0gOiBbXSwgb3duZXIpO1xuICAgICAgbmV3TGV2ZWwgKz0gU0hJRlQ7XG4gICAgICBvZmZzZXRTaGlmdCArPSAxIDw8IG5ld0xldmVsO1xuICAgIH1cbiAgICBpZiAob2Zmc2V0U2hpZnQpIHtcbiAgICAgIG5ld09yaWdpbiArPSBvZmZzZXRTaGlmdDtcbiAgICAgIG9sZE9yaWdpbiArPSBvZmZzZXRTaGlmdDtcbiAgICAgIG5ld0NhcGFjaXR5ICs9IG9mZnNldFNoaWZ0O1xuICAgICAgb2xkQ2FwYWNpdHkgKz0gb2Zmc2V0U2hpZnQ7XG4gICAgfVxuXG4gICAgdmFyIG9sZFRhaWxPZmZzZXQgPSBnZXRUYWlsT2Zmc2V0KG9sZENhcGFjaXR5KTtcbiAgICB2YXIgbmV3VGFpbE9mZnNldCA9IGdldFRhaWxPZmZzZXQobmV3Q2FwYWNpdHkpO1xuXG4gICAgLy8gTmV3IHNpemUgbWlnaHQgcmVxdWlyZSBjcmVhdGluZyBhIGhpZ2hlciByb290LlxuICAgIHdoaWxlIChuZXdUYWlsT2Zmc2V0ID49IDEgPDwgKG5ld0xldmVsICsgU0hJRlQpKSB7XG4gICAgICBuZXdSb290ID0gbmV3IFZOb2RlKG5ld1Jvb3QgJiYgbmV3Um9vdC5hcnJheS5sZW5ndGggPyBbbmV3Um9vdF0gOiBbXSwgb3duZXIpO1xuICAgICAgbmV3TGV2ZWwgKz0gU0hJRlQ7XG4gICAgfVxuXG4gICAgLy8gTG9jYXRlIG9yIGNyZWF0ZSB0aGUgbmV3IHRhaWwuXG4gICAgdmFyIG9sZFRhaWwgPSBsaXN0Ll90YWlsO1xuICAgIHZhciBuZXdUYWlsID0gbmV3VGFpbE9mZnNldCA8IG9sZFRhaWxPZmZzZXQgP1xuICAgICAgbGlzdE5vZGVGb3IobGlzdCwgbmV3Q2FwYWNpdHkgLSAxKSA6XG4gICAgICBuZXdUYWlsT2Zmc2V0ID4gb2xkVGFpbE9mZnNldCA/IG5ldyBWTm9kZShbXSwgb3duZXIpIDogb2xkVGFpbDtcblxuICAgIC8vIE1lcmdlIFRhaWwgaW50byB0cmVlLlxuICAgIGlmIChvbGRUYWlsICYmIG5ld1RhaWxPZmZzZXQgPiBvbGRUYWlsT2Zmc2V0ICYmIG5ld09yaWdpbiA8IG9sZENhcGFjaXR5ICYmIG9sZFRhaWwuYXJyYXkubGVuZ3RoKSB7XG4gICAgICBuZXdSb290ID0gZWRpdGFibGVWTm9kZShuZXdSb290LCBvd25lcik7XG4gICAgICB2YXIgbm9kZSA9IG5ld1Jvb3Q7XG4gICAgICBmb3IgKHZhciBsZXZlbCA9IG5ld0xldmVsOyBsZXZlbCA+IFNISUZUOyBsZXZlbCAtPSBTSElGVCkge1xuICAgICAgICB2YXIgaWR4ID0gKG9sZFRhaWxPZmZzZXQgPj4+IGxldmVsKSAmIE1BU0s7XG4gICAgICAgIG5vZGUgPSBub2RlLmFycmF5W2lkeF0gPSBlZGl0YWJsZVZOb2RlKG5vZGUuYXJyYXlbaWR4XSwgb3duZXIpO1xuICAgICAgfVxuICAgICAgbm9kZS5hcnJheVsob2xkVGFpbE9mZnNldCA+Pj4gU0hJRlQpICYgTUFTS10gPSBvbGRUYWlsO1xuICAgIH1cblxuICAgIC8vIElmIHRoZSBzaXplIGhhcyBiZWVuIHJlZHVjZWQsIHRoZXJlJ3MgYSBjaGFuY2UgdGhlIHRhaWwgbmVlZHMgdG8gYmUgdHJpbW1lZC5cbiAgICBpZiAobmV3Q2FwYWNpdHkgPCBvbGRDYXBhY2l0eSkge1xuICAgICAgbmV3VGFpbCA9IG5ld1RhaWwgJiYgbmV3VGFpbC5yZW1vdmVBZnRlcihvd25lciwgMCwgbmV3Q2FwYWNpdHkpO1xuICAgIH1cblxuICAgIC8vIElmIHRoZSBuZXcgb3JpZ2luIGlzIHdpdGhpbiB0aGUgdGFpbCwgdGhlbiB3ZSBkbyBub3QgbmVlZCBhIHJvb3QuXG4gICAgaWYgKG5ld09yaWdpbiA+PSBuZXdUYWlsT2Zmc2V0KSB7XG4gICAgICBuZXdPcmlnaW4gLT0gbmV3VGFpbE9mZnNldDtcbiAgICAgIG5ld0NhcGFjaXR5IC09IG5ld1RhaWxPZmZzZXQ7XG4gICAgICBuZXdMZXZlbCA9IFNISUZUO1xuICAgICAgbmV3Um9vdCA9IG51bGw7XG4gICAgICBuZXdUYWlsID0gbmV3VGFpbCAmJiBuZXdUYWlsLnJlbW92ZUJlZm9yZShvd25lciwgMCwgbmV3T3JpZ2luKTtcblxuICAgIC8vIE90aGVyd2lzZSwgaWYgdGhlIHJvb3QgaGFzIGJlZW4gdHJpbW1lZCwgZ2FyYmFnZSBjb2xsZWN0LlxuICAgIH0gZWxzZSBpZiAobmV3T3JpZ2luID4gb2xkT3JpZ2luIHx8IG5ld1RhaWxPZmZzZXQgPCBvbGRUYWlsT2Zmc2V0KSB7XG4gICAgICBvZmZzZXRTaGlmdCA9IDA7XG5cbiAgICAgIC8vIElkZW50aWZ5IHRoZSBuZXcgdG9wIHJvb3Qgbm9kZSBvZiB0aGUgc3VidHJlZSBvZiB0aGUgb2xkIHJvb3QuXG4gICAgICB3aGlsZSAobmV3Um9vdCkge1xuICAgICAgICB2YXIgYmVnaW5JbmRleCA9IChuZXdPcmlnaW4gPj4+IG5ld0xldmVsKSAmIE1BU0s7XG4gICAgICAgIGlmIChiZWdpbkluZGV4ICE9PSAobmV3VGFpbE9mZnNldCA+Pj4gbmV3TGV2ZWwpICYgTUFTSykge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGlmIChiZWdpbkluZGV4KSB7XG4gICAgICAgICAgb2Zmc2V0U2hpZnQgKz0gKDEgPDwgbmV3TGV2ZWwpICogYmVnaW5JbmRleDtcbiAgICAgICAgfVxuICAgICAgICBuZXdMZXZlbCAtPSBTSElGVDtcbiAgICAgICAgbmV3Um9vdCA9IG5ld1Jvb3QuYXJyYXlbYmVnaW5JbmRleF07XG4gICAgICB9XG5cbiAgICAgIC8vIFRyaW0gdGhlIG5ldyBzaWRlcyBvZiB0aGUgbmV3IHJvb3QuXG4gICAgICBpZiAobmV3Um9vdCAmJiBuZXdPcmlnaW4gPiBvbGRPcmlnaW4pIHtcbiAgICAgICAgbmV3Um9vdCA9IG5ld1Jvb3QucmVtb3ZlQmVmb3JlKG93bmVyLCBuZXdMZXZlbCwgbmV3T3JpZ2luIC0gb2Zmc2V0U2hpZnQpO1xuICAgICAgfVxuICAgICAgaWYgKG5ld1Jvb3QgJiYgbmV3VGFpbE9mZnNldCA8IG9sZFRhaWxPZmZzZXQpIHtcbiAgICAgICAgbmV3Um9vdCA9IG5ld1Jvb3QucmVtb3ZlQWZ0ZXIob3duZXIsIG5ld0xldmVsLCBuZXdUYWlsT2Zmc2V0IC0gb2Zmc2V0U2hpZnQpO1xuICAgICAgfVxuICAgICAgaWYgKG9mZnNldFNoaWZ0KSB7XG4gICAgICAgIG5ld09yaWdpbiAtPSBvZmZzZXRTaGlmdDtcbiAgICAgICAgbmV3Q2FwYWNpdHkgLT0gb2Zmc2V0U2hpZnQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGxpc3QuX19vd25lcklEKSB7XG4gICAgICBsaXN0LnNpemUgPSBuZXdDYXBhY2l0eSAtIG5ld09yaWdpbjtcbiAgICAgIGxpc3QuX29yaWdpbiA9IG5ld09yaWdpbjtcbiAgICAgIGxpc3QuX2NhcGFjaXR5ID0gbmV3Q2FwYWNpdHk7XG4gICAgICBsaXN0Ll9sZXZlbCA9IG5ld0xldmVsO1xuICAgICAgbGlzdC5fcm9vdCA9IG5ld1Jvb3Q7XG4gICAgICBsaXN0Ll90YWlsID0gbmV3VGFpbDtcbiAgICAgIGxpc3QuX19oYXNoID0gdW5kZWZpbmVkO1xuICAgICAgbGlzdC5fX2FsdGVyZWQgPSB0cnVlO1xuICAgICAgcmV0dXJuIGxpc3Q7XG4gICAgfVxuICAgIHJldHVybiBtYWtlTGlzdChuZXdPcmlnaW4sIG5ld0NhcGFjaXR5LCBuZXdMZXZlbCwgbmV3Um9vdCwgbmV3VGFpbCk7XG4gIH1cblxuICBmdW5jdGlvbiBtZXJnZUludG9MaXN0V2l0aChsaXN0LCBtZXJnZXIsIGl0ZXJhYmxlcykge1xuICAgIHZhciBpdGVycyA9IFtdO1xuICAgIHZhciBtYXhTaXplID0gMDtcbiAgICBmb3IgKHZhciBpaSA9IDA7IGlpIDwgaXRlcmFibGVzLmxlbmd0aDsgaWkrKykge1xuICAgICAgdmFyIHZhbHVlID0gaXRlcmFibGVzW2lpXTtcbiAgICAgIHZhciBpdGVyID0gSW5kZXhlZEl0ZXJhYmxlKHZhbHVlKTtcbiAgICAgIGlmIChpdGVyLnNpemUgPiBtYXhTaXplKSB7XG4gICAgICAgIG1heFNpemUgPSBpdGVyLnNpemU7XG4gICAgICB9XG4gICAgICBpZiAoIWlzSXRlcmFibGUodmFsdWUpKSB7XG4gICAgICAgIGl0ZXIgPSBpdGVyLm1hcChmdW5jdGlvbih2ICkge3JldHVybiBmcm9tSlModil9KTtcbiAgICAgIH1cbiAgICAgIGl0ZXJzLnB1c2goaXRlcik7XG4gICAgfVxuICAgIGlmIChtYXhTaXplID4gbGlzdC5zaXplKSB7XG4gICAgICBsaXN0ID0gbGlzdC5zZXRTaXplKG1heFNpemUpO1xuICAgIH1cbiAgICByZXR1cm4gbWVyZ2VJbnRvQ29sbGVjdGlvbldpdGgobGlzdCwgbWVyZ2VyLCBpdGVycyk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRUYWlsT2Zmc2V0KHNpemUpIHtcbiAgICByZXR1cm4gc2l6ZSA8IFNJWkUgPyAwIDogKCgoc2l6ZSAtIDEpID4+PiBTSElGVCkgPDwgU0hJRlQpO1xuICB9XG5cbiAgY3JlYXRlQ2xhc3MoT3JkZXJlZE1hcCwgc3JjX01hcF9fTWFwKTtcblxuICAgIC8vIEBwcmFnbWEgQ29uc3RydWN0aW9uXG5cbiAgICBmdW5jdGlvbiBPcmRlcmVkTWFwKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCA/IGVtcHR5T3JkZXJlZE1hcCgpIDpcbiAgICAgICAgaXNPcmRlcmVkTWFwKHZhbHVlKSA/IHZhbHVlIDpcbiAgICAgICAgZW1wdHlPcmRlcmVkTWFwKCkud2l0aE11dGF0aW9ucyhmdW5jdGlvbihtYXAgKSB7XG4gICAgICAgICAgdmFyIGl0ZXIgPSBLZXllZEl0ZXJhYmxlKHZhbHVlKTtcbiAgICAgICAgICBhc3NlcnROb3RJbmZpbml0ZShpdGVyLnNpemUpO1xuICAgICAgICAgIGl0ZXIuZm9yRWFjaChmdW5jdGlvbih2LCBrKSAge3JldHVybiBtYXAuc2V0KGssIHYpfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIE9yZGVyZWRNYXAub2YgPSBmdW5jdGlvbigvKi4uLnZhbHVlcyovKSB7XG4gICAgICByZXR1cm4gdGhpcyhhcmd1bWVudHMpO1xuICAgIH07XG5cbiAgICBPcmRlcmVkTWFwLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX190b1N0cmluZygnT3JkZXJlZE1hcCB7JywgJ30nKTtcbiAgICB9O1xuXG4gICAgLy8gQHByYWdtYSBBY2Nlc3NcblxuICAgIE9yZGVyZWRNYXAucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKGssIG5vdFNldFZhbHVlKSB7XG4gICAgICB2YXIgaW5kZXggPSB0aGlzLl9tYXAuZ2V0KGspO1xuICAgICAgcmV0dXJuIGluZGV4ICE9PSB1bmRlZmluZWQgPyB0aGlzLl9saXN0LmdldChpbmRleClbMV0gOiBub3RTZXRWYWx1ZTtcbiAgICB9O1xuXG4gICAgLy8gQHByYWdtYSBNb2RpZmljYXRpb25cblxuICAgIE9yZGVyZWRNYXAucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy5zaXplID09PSAwKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuX19vd25lcklEKSB7XG4gICAgICAgIHRoaXMuc2l6ZSA9IDA7XG4gICAgICAgIHRoaXMuX21hcC5jbGVhcigpO1xuICAgICAgICB0aGlzLl9saXN0LmNsZWFyKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGVtcHR5T3JkZXJlZE1hcCgpO1xuICAgIH07XG5cbiAgICBPcmRlcmVkTWFwLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbihrLCB2KSB7XG4gICAgICByZXR1cm4gdXBkYXRlT3JkZXJlZE1hcCh0aGlzLCBrLCB2KTtcbiAgICB9O1xuXG4gICAgT3JkZXJlZE1hcC5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24oaykge1xuICAgICAgcmV0dXJuIHVwZGF0ZU9yZGVyZWRNYXAodGhpcywgaywgTk9UX1NFVCk7XG4gICAgfTtcblxuICAgIE9yZGVyZWRNYXAucHJvdG90eXBlLndhc0FsdGVyZWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9tYXAud2FzQWx0ZXJlZCgpIHx8IHRoaXMuX2xpc3Qud2FzQWx0ZXJlZCgpO1xuICAgIH07XG5cbiAgICBPcmRlcmVkTWFwLnByb3RvdHlwZS5fX2l0ZXJhdGUgPSBmdW5jdGlvbihmbiwgcmV2ZXJzZSkge3ZhciB0aGlzJDAgPSB0aGlzO1xuICAgICAgcmV0dXJuIHRoaXMuX2xpc3QuX19pdGVyYXRlKFxuICAgICAgICBmdW5jdGlvbihlbnRyeSApIHtyZXR1cm4gZW50cnkgJiYgZm4oZW50cnlbMV0sIGVudHJ5WzBdLCB0aGlzJDApfSxcbiAgICAgICAgcmV2ZXJzZVxuICAgICAgKTtcbiAgICB9O1xuXG4gICAgT3JkZXJlZE1hcC5wcm90b3R5cGUuX19pdGVyYXRvciA9IGZ1bmN0aW9uKHR5cGUsIHJldmVyc2UpIHtcbiAgICAgIHJldHVybiB0aGlzLl9saXN0LmZyb21FbnRyeVNlcSgpLl9faXRlcmF0b3IodHlwZSwgcmV2ZXJzZSk7XG4gICAgfTtcblxuICAgIE9yZGVyZWRNYXAucHJvdG90eXBlLl9fZW5zdXJlT3duZXIgPSBmdW5jdGlvbihvd25lcklEKSB7XG4gICAgICBpZiAob3duZXJJRCA9PT0gdGhpcy5fX293bmVySUQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICB2YXIgbmV3TWFwID0gdGhpcy5fbWFwLl9fZW5zdXJlT3duZXIob3duZXJJRCk7XG4gICAgICB2YXIgbmV3TGlzdCA9IHRoaXMuX2xpc3QuX19lbnN1cmVPd25lcihvd25lcklEKTtcbiAgICAgIGlmICghb3duZXJJRCkge1xuICAgICAgICB0aGlzLl9fb3duZXJJRCA9IG93bmVySUQ7XG4gICAgICAgIHRoaXMuX21hcCA9IG5ld01hcDtcbiAgICAgICAgdGhpcy5fbGlzdCA9IG5ld0xpc3Q7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG1ha2VPcmRlcmVkTWFwKG5ld01hcCwgbmV3TGlzdCwgb3duZXJJRCwgdGhpcy5fX2hhc2gpO1xuICAgIH07XG5cblxuICBmdW5jdGlvbiBpc09yZGVyZWRNYXAobWF5YmVPcmRlcmVkTWFwKSB7XG4gICAgcmV0dXJuIGlzTWFwKG1heWJlT3JkZXJlZE1hcCkgJiYgaXNPcmRlcmVkKG1heWJlT3JkZXJlZE1hcCk7XG4gIH1cblxuICBPcmRlcmVkTWFwLmlzT3JkZXJlZE1hcCA9IGlzT3JkZXJlZE1hcDtcblxuICBPcmRlcmVkTWFwLnByb3RvdHlwZVtJU19PUkRFUkVEX1NFTlRJTkVMXSA9IHRydWU7XG4gIE9yZGVyZWRNYXAucHJvdG90eXBlW0RFTEVURV0gPSBPcmRlcmVkTWFwLnByb3RvdHlwZS5yZW1vdmU7XG5cblxuXG4gIGZ1bmN0aW9uIG1ha2VPcmRlcmVkTWFwKG1hcCwgbGlzdCwgb3duZXJJRCwgaGFzaCkge1xuICAgIHZhciBvbWFwID0gT2JqZWN0LmNyZWF0ZShPcmRlcmVkTWFwLnByb3RvdHlwZSk7XG4gICAgb21hcC5zaXplID0gbWFwID8gbWFwLnNpemUgOiAwO1xuICAgIG9tYXAuX21hcCA9IG1hcDtcbiAgICBvbWFwLl9saXN0ID0gbGlzdDtcbiAgICBvbWFwLl9fb3duZXJJRCA9IG93bmVySUQ7XG4gICAgb21hcC5fX2hhc2ggPSBoYXNoO1xuICAgIHJldHVybiBvbWFwO1xuICB9XG5cbiAgdmFyIEVNUFRZX09SREVSRURfTUFQO1xuICBmdW5jdGlvbiBlbXB0eU9yZGVyZWRNYXAoKSB7XG4gICAgcmV0dXJuIEVNUFRZX09SREVSRURfTUFQIHx8IChFTVBUWV9PUkRFUkVEX01BUCA9IG1ha2VPcmRlcmVkTWFwKGVtcHR5TWFwKCksIGVtcHR5TGlzdCgpKSk7XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVPcmRlcmVkTWFwKG9tYXAsIGssIHYpIHtcbiAgICB2YXIgbWFwID0gb21hcC5fbWFwO1xuICAgIHZhciBsaXN0ID0gb21hcC5fbGlzdDtcbiAgICB2YXIgaSA9IG1hcC5nZXQoayk7XG4gICAgdmFyIGhhcyA9IGkgIT09IHVuZGVmaW5lZDtcbiAgICB2YXIgbmV3TWFwO1xuICAgIHZhciBuZXdMaXN0O1xuICAgIGlmICh2ID09PSBOT1RfU0VUKSB7IC8vIHJlbW92ZWRcbiAgICAgIGlmICghaGFzKSB7XG4gICAgICAgIHJldHVybiBvbWFwO1xuICAgICAgfVxuICAgICAgaWYgKGxpc3Quc2l6ZSA+PSBTSVpFICYmIGxpc3Quc2l6ZSA+PSBtYXAuc2l6ZSAqIDIpIHtcbiAgICAgICAgbmV3TGlzdCA9IGxpc3QuZmlsdGVyKGZ1bmN0aW9uKGVudHJ5LCBpZHgpICB7cmV0dXJuIGVudHJ5ICE9PSB1bmRlZmluZWQgJiYgaSAhPT0gaWR4fSk7XG4gICAgICAgIG5ld01hcCA9IG5ld0xpc3QudG9LZXllZFNlcSgpLm1hcChmdW5jdGlvbihlbnRyeSApIHtyZXR1cm4gZW50cnlbMF19KS5mbGlwKCkudG9NYXAoKTtcbiAgICAgICAgaWYgKG9tYXAuX19vd25lcklEKSB7XG4gICAgICAgICAgbmV3TWFwLl9fb3duZXJJRCA9IG5ld0xpc3QuX19vd25lcklEID0gb21hcC5fX293bmVySUQ7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5ld01hcCA9IG1hcC5yZW1vdmUoayk7XG4gICAgICAgIG5ld0xpc3QgPSBpID09PSBsaXN0LnNpemUgLSAxID8gbGlzdC5wb3AoKSA6IGxpc3Quc2V0KGksIHVuZGVmaW5lZCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChoYXMpIHtcbiAgICAgICAgaWYgKHYgPT09IGxpc3QuZ2V0KGkpWzFdKSB7XG4gICAgICAgICAgcmV0dXJuIG9tYXA7XG4gICAgICAgIH1cbiAgICAgICAgbmV3TWFwID0gbWFwO1xuICAgICAgICBuZXdMaXN0ID0gbGlzdC5zZXQoaSwgW2ssIHZdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5ld01hcCA9IG1hcC5zZXQoaywgbGlzdC5zaXplKTtcbiAgICAgICAgbmV3TGlzdCA9IGxpc3Quc2V0KGxpc3Quc2l6ZSwgW2ssIHZdKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKG9tYXAuX19vd25lcklEKSB7XG4gICAgICBvbWFwLnNpemUgPSBuZXdNYXAuc2l6ZTtcbiAgICAgIG9tYXAuX21hcCA9IG5ld01hcDtcbiAgICAgIG9tYXAuX2xpc3QgPSBuZXdMaXN0O1xuICAgICAgb21hcC5fX2hhc2ggPSB1bmRlZmluZWQ7XG4gICAgICByZXR1cm4gb21hcDtcbiAgICB9XG4gICAgcmV0dXJuIG1ha2VPcmRlcmVkTWFwKG5ld01hcCwgbmV3TGlzdCk7XG4gIH1cblxuICBjcmVhdGVDbGFzcyhTdGFjaywgSW5kZXhlZENvbGxlY3Rpb24pO1xuXG4gICAgLy8gQHByYWdtYSBDb25zdHJ1Y3Rpb25cblxuICAgIGZ1bmN0aW9uIFN0YWNrKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCA/IGVtcHR5U3RhY2soKSA6XG4gICAgICAgIGlzU3RhY2sodmFsdWUpID8gdmFsdWUgOlxuICAgICAgICBlbXB0eVN0YWNrKCkudW5zaGlmdEFsbCh2YWx1ZSk7XG4gICAgfVxuXG4gICAgU3RhY2sub2YgPSBmdW5jdGlvbigvKi4uLnZhbHVlcyovKSB7XG4gICAgICByZXR1cm4gdGhpcyhhcmd1bWVudHMpO1xuICAgIH07XG5cbiAgICBTdGFjay5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9fdG9TdHJpbmcoJ1N0YWNrIFsnLCAnXScpO1xuICAgIH07XG5cbiAgICAvLyBAcHJhZ21hIEFjY2Vzc1xuXG4gICAgU3RhY2sucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKGluZGV4LCBub3RTZXRWYWx1ZSkge1xuICAgICAgdmFyIGhlYWQgPSB0aGlzLl9oZWFkO1xuICAgICAgaW5kZXggPSB3cmFwSW5kZXgodGhpcywgaW5kZXgpO1xuICAgICAgd2hpbGUgKGhlYWQgJiYgaW5kZXgtLSkge1xuICAgICAgICBoZWFkID0gaGVhZC5uZXh0O1xuICAgICAgfVxuICAgICAgcmV0dXJuIGhlYWQgPyBoZWFkLnZhbHVlIDogbm90U2V0VmFsdWU7XG4gICAgfTtcblxuICAgIFN0YWNrLnByb3RvdHlwZS5wZWVrID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5faGVhZCAmJiB0aGlzLl9oZWFkLnZhbHVlO1xuICAgIH07XG5cbiAgICAvLyBAcHJhZ21hIE1vZGlmaWNhdGlvblxuXG4gICAgU3RhY2sucHJvdG90eXBlLnB1c2ggPSBmdW5jdGlvbigvKi4uLnZhbHVlcyovKSB7XG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICAgIHZhciBuZXdTaXplID0gdGhpcy5zaXplICsgYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgIHZhciBoZWFkID0gdGhpcy5faGVhZDtcbiAgICAgIGZvciAodmFyIGlpID0gYXJndW1lbnRzLmxlbmd0aCAtIDE7IGlpID49IDA7IGlpLS0pIHtcbiAgICAgICAgaGVhZCA9IHtcbiAgICAgICAgICB2YWx1ZTogYXJndW1lbnRzW2lpXSxcbiAgICAgICAgICBuZXh0OiBoZWFkXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5fX293bmVySUQpIHtcbiAgICAgICAgdGhpcy5zaXplID0gbmV3U2l6ZTtcbiAgICAgICAgdGhpcy5faGVhZCA9IGhlYWQ7XG4gICAgICAgIHRoaXMuX19oYXNoID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLl9fYWx0ZXJlZCA9IHRydWU7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG1ha2VTdGFjayhuZXdTaXplLCBoZWFkKTtcbiAgICB9O1xuXG4gICAgU3RhY2sucHJvdG90eXBlLnB1c2hBbGwgPSBmdW5jdGlvbihpdGVyKSB7XG4gICAgICBpdGVyID0gSW5kZXhlZEl0ZXJhYmxlKGl0ZXIpO1xuICAgICAgaWYgKGl0ZXIuc2l6ZSA9PT0gMCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICAgIGFzc2VydE5vdEluZmluaXRlKGl0ZXIuc2l6ZSk7XG4gICAgICB2YXIgbmV3U2l6ZSA9IHRoaXMuc2l6ZTtcbiAgICAgIHZhciBoZWFkID0gdGhpcy5faGVhZDtcbiAgICAgIGl0ZXIucmV2ZXJzZSgpLmZvckVhY2goZnVuY3Rpb24odmFsdWUgKSB7XG4gICAgICAgIG5ld1NpemUrKztcbiAgICAgICAgaGVhZCA9IHtcbiAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgbmV4dDogaGVhZFxuICAgICAgICB9O1xuICAgICAgfSk7XG4gICAgICBpZiAodGhpcy5fX293bmVySUQpIHtcbiAgICAgICAgdGhpcy5zaXplID0gbmV3U2l6ZTtcbiAgICAgICAgdGhpcy5faGVhZCA9IGhlYWQ7XG4gICAgICAgIHRoaXMuX19oYXNoID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLl9fYWx0ZXJlZCA9IHRydWU7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG1ha2VTdGFjayhuZXdTaXplLCBoZWFkKTtcbiAgICB9O1xuXG4gICAgU3RhY2sucHJvdG90eXBlLnBvcCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuc2xpY2UoMSk7XG4gICAgfTtcblxuICAgIFN0YWNrLnByb3RvdHlwZS51bnNoaWZ0ID0gZnVuY3Rpb24oLyouLi52YWx1ZXMqLykge1xuICAgICAgcmV0dXJuIHRoaXMucHVzaC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG5cbiAgICBTdGFjay5wcm90b3R5cGUudW5zaGlmdEFsbCA9IGZ1bmN0aW9uKGl0ZXIpIHtcbiAgICAgIHJldHVybiB0aGlzLnB1c2hBbGwoaXRlcik7XG4gICAgfTtcblxuICAgIFN0YWNrLnByb3RvdHlwZS5zaGlmdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMucG9wLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcblxuICAgIFN0YWNrLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHRoaXMuc2l6ZSA9PT0gMCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLl9fb3duZXJJRCkge1xuICAgICAgICB0aGlzLnNpemUgPSAwO1xuICAgICAgICB0aGlzLl9oZWFkID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLl9faGFzaCA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5fX2FsdGVyZWQgPSB0cnVlO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICAgIHJldHVybiBlbXB0eVN0YWNrKCk7XG4gICAgfTtcblxuICAgIFN0YWNrLnByb3RvdHlwZS5zbGljZSA9IGZ1bmN0aW9uKGJlZ2luLCBlbmQpIHtcbiAgICAgIGlmICh3aG9sZVNsaWNlKGJlZ2luLCBlbmQsIHRoaXMuc2l6ZSkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICB2YXIgcmVzb2x2ZWRCZWdpbiA9IHJlc29sdmVCZWdpbihiZWdpbiwgdGhpcy5zaXplKTtcbiAgICAgIHZhciByZXNvbHZlZEVuZCA9IHJlc29sdmVFbmQoZW5kLCB0aGlzLnNpemUpO1xuICAgICAgaWYgKHJlc29sdmVkRW5kICE9PSB0aGlzLnNpemUpIHtcbiAgICAgICAgLy8gc3VwZXIuc2xpY2UoYmVnaW4sIGVuZCk7XG4gICAgICAgIHJldHVybiBJbmRleGVkQ29sbGVjdGlvbi5wcm90b3R5cGUuc2xpY2UuY2FsbCh0aGlzLCBiZWdpbiwgZW5kKTtcbiAgICAgIH1cbiAgICAgIHZhciBuZXdTaXplID0gdGhpcy5zaXplIC0gcmVzb2x2ZWRCZWdpbjtcbiAgICAgIHZhciBoZWFkID0gdGhpcy5faGVhZDtcbiAgICAgIHdoaWxlIChyZXNvbHZlZEJlZ2luLS0pIHtcbiAgICAgICAgaGVhZCA9IGhlYWQubmV4dDtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLl9fb3duZXJJRCkge1xuICAgICAgICB0aGlzLnNpemUgPSBuZXdTaXplO1xuICAgICAgICB0aGlzLl9oZWFkID0gaGVhZDtcbiAgICAgICAgdGhpcy5fX2hhc2ggPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuX19hbHRlcmVkID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICByZXR1cm4gbWFrZVN0YWNrKG5ld1NpemUsIGhlYWQpO1xuICAgIH07XG5cbiAgICAvLyBAcHJhZ21hIE11dGFiaWxpdHlcblxuICAgIFN0YWNrLnByb3RvdHlwZS5fX2Vuc3VyZU93bmVyID0gZnVuY3Rpb24ob3duZXJJRCkge1xuICAgICAgaWYgKG93bmVySUQgPT09IHRoaXMuX19vd25lcklEKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgaWYgKCFvd25lcklEKSB7XG4gICAgICAgIHRoaXMuX19vd25lcklEID0gb3duZXJJRDtcbiAgICAgICAgdGhpcy5fX2FsdGVyZWQgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICByZXR1cm4gbWFrZVN0YWNrKHRoaXMuc2l6ZSwgdGhpcy5faGVhZCwgb3duZXJJRCwgdGhpcy5fX2hhc2gpO1xuICAgIH07XG5cbiAgICAvLyBAcHJhZ21hIEl0ZXJhdGlvblxuXG4gICAgU3RhY2sucHJvdG90eXBlLl9faXRlcmF0ZSA9IGZ1bmN0aW9uKGZuLCByZXZlcnNlKSB7XG4gICAgICBpZiAocmV2ZXJzZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXZlcnNlKCkuX19pdGVyYXRlKGZuKTtcbiAgICAgIH1cbiAgICAgIHZhciBpdGVyYXRpb25zID0gMDtcbiAgICAgIHZhciBub2RlID0gdGhpcy5faGVhZDtcbiAgICAgIHdoaWxlIChub2RlKSB7XG4gICAgICAgIGlmIChmbihub2RlLnZhbHVlLCBpdGVyYXRpb25zKyssIHRoaXMpID09PSBmYWxzZSkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIG5vZGUgPSBub2RlLm5leHQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gaXRlcmF0aW9ucztcbiAgICB9O1xuXG4gICAgU3RhY2sucHJvdG90eXBlLl9faXRlcmF0b3IgPSBmdW5jdGlvbih0eXBlLCByZXZlcnNlKSB7XG4gICAgICBpZiAocmV2ZXJzZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXZlcnNlKCkuX19pdGVyYXRvcih0eXBlKTtcbiAgICAgIH1cbiAgICAgIHZhciBpdGVyYXRpb25zID0gMDtcbiAgICAgIHZhciBub2RlID0gdGhpcy5faGVhZDtcbiAgICAgIHJldHVybiBuZXcgc3JjX0l0ZXJhdG9yX19JdGVyYXRvcihmdW5jdGlvbigpICB7XG4gICAgICAgIGlmIChub2RlKSB7XG4gICAgICAgICAgdmFyIHZhbHVlID0gbm9kZS52YWx1ZTtcbiAgICAgICAgICBub2RlID0gbm9kZS5uZXh0O1xuICAgICAgICAgIHJldHVybiBpdGVyYXRvclZhbHVlKHR5cGUsIGl0ZXJhdGlvbnMrKywgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpdGVyYXRvckRvbmUoKTtcbiAgICAgIH0pO1xuICAgIH07XG5cblxuICBmdW5jdGlvbiBpc1N0YWNrKG1heWJlU3RhY2spIHtcbiAgICByZXR1cm4gISEobWF5YmVTdGFjayAmJiBtYXliZVN0YWNrW0lTX1NUQUNLX1NFTlRJTkVMXSk7XG4gIH1cblxuICBTdGFjay5pc1N0YWNrID0gaXNTdGFjaztcblxuICB2YXIgSVNfU1RBQ0tfU0VOVElORUwgPSAnQEBfX0lNTVVUQUJMRV9TVEFDS19fQEAnO1xuXG4gIHZhciBTdGFja1Byb3RvdHlwZSA9IFN0YWNrLnByb3RvdHlwZTtcbiAgU3RhY2tQcm90b3R5cGVbSVNfU1RBQ0tfU0VOVElORUxdID0gdHJ1ZTtcbiAgU3RhY2tQcm90b3R5cGUud2l0aE11dGF0aW9ucyA9IE1hcFByb3RvdHlwZS53aXRoTXV0YXRpb25zO1xuICBTdGFja1Byb3RvdHlwZS5hc011dGFibGUgPSBNYXBQcm90b3R5cGUuYXNNdXRhYmxlO1xuICBTdGFja1Byb3RvdHlwZS5hc0ltbXV0YWJsZSA9IE1hcFByb3RvdHlwZS5hc0ltbXV0YWJsZTtcbiAgU3RhY2tQcm90b3R5cGUud2FzQWx0ZXJlZCA9IE1hcFByb3RvdHlwZS53YXNBbHRlcmVkO1xuXG5cbiAgZnVuY3Rpb24gbWFrZVN0YWNrKHNpemUsIGhlYWQsIG93bmVySUQsIGhhc2gpIHtcbiAgICB2YXIgbWFwID0gT2JqZWN0LmNyZWF0ZShTdGFja1Byb3RvdHlwZSk7XG4gICAgbWFwLnNpemUgPSBzaXplO1xuICAgIG1hcC5faGVhZCA9IGhlYWQ7XG4gICAgbWFwLl9fb3duZXJJRCA9IG93bmVySUQ7XG4gICAgbWFwLl9faGFzaCA9IGhhc2g7XG4gICAgbWFwLl9fYWx0ZXJlZCA9IGZhbHNlO1xuICAgIHJldHVybiBtYXA7XG4gIH1cblxuICB2YXIgRU1QVFlfU1RBQ0s7XG4gIGZ1bmN0aW9uIGVtcHR5U3RhY2soKSB7XG4gICAgcmV0dXJuIEVNUFRZX1NUQUNLIHx8IChFTVBUWV9TVEFDSyA9IG1ha2VTdGFjaygwKSk7XG4gIH1cblxuICBjcmVhdGVDbGFzcyhzcmNfU2V0X19TZXQsIFNldENvbGxlY3Rpb24pO1xuXG4gICAgLy8gQHByYWdtYSBDb25zdHJ1Y3Rpb25cblxuICAgIGZ1bmN0aW9uIHNyY19TZXRfX1NldCh2YWx1ZSkge1xuICAgICAgcmV0dXJuIHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQgPyBlbXB0eVNldCgpIDpcbiAgICAgICAgaXNTZXQodmFsdWUpID8gdmFsdWUgOlxuICAgICAgICBlbXB0eVNldCgpLndpdGhNdXRhdGlvbnMoZnVuY3Rpb24oc2V0ICkge1xuICAgICAgICAgIHZhciBpdGVyID0gU2V0SXRlcmFibGUodmFsdWUpO1xuICAgICAgICAgIGFzc2VydE5vdEluZmluaXRlKGl0ZXIuc2l6ZSk7XG4gICAgICAgICAgaXRlci5mb3JFYWNoKGZ1bmN0aW9uKHYgKSB7cmV0dXJuIHNldC5hZGQodil9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgc3JjX1NldF9fU2V0Lm9mID0gZnVuY3Rpb24oLyouLi52YWx1ZXMqLykge1xuICAgICAgcmV0dXJuIHRoaXMoYXJndW1lbnRzKTtcbiAgICB9O1xuXG4gICAgc3JjX1NldF9fU2V0LmZyb21LZXlzID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJldHVybiB0aGlzKEtleWVkSXRlcmFibGUodmFsdWUpLmtleVNlcSgpKTtcbiAgICB9O1xuXG4gICAgc3JjX1NldF9fU2V0LnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX190b1N0cmluZygnU2V0IHsnLCAnfScpO1xuICAgIH07XG5cbiAgICAvLyBAcHJhZ21hIEFjY2Vzc1xuXG4gICAgc3JjX1NldF9fU2V0LnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIHRoaXMuX21hcC5oYXModmFsdWUpO1xuICAgIH07XG5cbiAgICAvLyBAcHJhZ21hIE1vZGlmaWNhdGlvblxuXG4gICAgc3JjX1NldF9fU2V0LnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIHVwZGF0ZVNldCh0aGlzLCB0aGlzLl9tYXAuc2V0KHZhbHVlLCB0cnVlKSk7XG4gICAgfTtcblxuICAgIHNyY19TZXRfX1NldC5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJldHVybiB1cGRhdGVTZXQodGhpcywgdGhpcy5fbWFwLnJlbW92ZSh2YWx1ZSkpO1xuICAgIH07XG5cbiAgICBzcmNfU2V0X19TZXQucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdXBkYXRlU2V0KHRoaXMsIHRoaXMuX21hcC5jbGVhcigpKTtcbiAgICB9O1xuXG4gICAgLy8gQHByYWdtYSBDb21wb3NpdGlvblxuXG4gICAgc3JjX1NldF9fU2V0LnByb3RvdHlwZS51bmlvbiA9IGZ1bmN0aW9uKCkge3ZhciBpdGVycyA9IFNMSUNFJDAuY2FsbChhcmd1bWVudHMsIDApO1xuICAgICAgaXRlcnMgPSBpdGVycy5maWx0ZXIoZnVuY3Rpb24oeCApIHtyZXR1cm4geC5zaXplICE9PSAwfSk7XG4gICAgICBpZiAoaXRlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuc2l6ZSA9PT0gMCAmJiBpdGVycy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IoaXRlcnNbMF0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMud2l0aE11dGF0aW9ucyhmdW5jdGlvbihzZXQgKSB7XG4gICAgICAgIGZvciAodmFyIGlpID0gMDsgaWkgPCBpdGVycy5sZW5ndGg7IGlpKyspIHtcbiAgICAgICAgICBTZXRJdGVyYWJsZShpdGVyc1tpaV0pLmZvckVhY2goZnVuY3Rpb24odmFsdWUgKSB7cmV0dXJuIHNldC5hZGQodmFsdWUpfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBzcmNfU2V0X19TZXQucHJvdG90eXBlLmludGVyc2VjdCA9IGZ1bmN0aW9uKCkge3ZhciBpdGVycyA9IFNMSUNFJDAuY2FsbChhcmd1bWVudHMsIDApO1xuICAgICAgaWYgKGl0ZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICAgIGl0ZXJzID0gaXRlcnMubWFwKGZ1bmN0aW9uKGl0ZXIgKSB7cmV0dXJuIFNldEl0ZXJhYmxlKGl0ZXIpfSk7XG4gICAgICB2YXIgb3JpZ2luYWxTZXQgPSB0aGlzO1xuICAgICAgcmV0dXJuIHRoaXMud2l0aE11dGF0aW9ucyhmdW5jdGlvbihzZXQgKSB7XG4gICAgICAgIG9yaWdpbmFsU2V0LmZvckVhY2goZnVuY3Rpb24odmFsdWUgKSB7XG4gICAgICAgICAgaWYgKCFpdGVycy5ldmVyeShmdW5jdGlvbihpdGVyICkge3JldHVybiBpdGVyLmNvbnRhaW5zKHZhbHVlKX0pKSB7XG4gICAgICAgICAgICBzZXQucmVtb3ZlKHZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIHNyY19TZXRfX1NldC5wcm90b3R5cGUuc3VidHJhY3QgPSBmdW5jdGlvbigpIHt2YXIgaXRlcnMgPSBTTElDRSQwLmNhbGwoYXJndW1lbnRzLCAwKTtcbiAgICAgIGlmIChpdGVycy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICBpdGVycyA9IGl0ZXJzLm1hcChmdW5jdGlvbihpdGVyICkge3JldHVybiBTZXRJdGVyYWJsZShpdGVyKX0pO1xuICAgICAgdmFyIG9yaWdpbmFsU2V0ID0gdGhpcztcbiAgICAgIHJldHVybiB0aGlzLndpdGhNdXRhdGlvbnMoZnVuY3Rpb24oc2V0ICkge1xuICAgICAgICBvcmlnaW5hbFNldC5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlICkge1xuICAgICAgICAgIGlmIChpdGVycy5zb21lKGZ1bmN0aW9uKGl0ZXIgKSB7cmV0dXJuIGl0ZXIuY29udGFpbnModmFsdWUpfSkpIHtcbiAgICAgICAgICAgIHNldC5yZW1vdmUodmFsdWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgc3JjX1NldF9fU2V0LnByb3RvdHlwZS5tZXJnZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMudW5pb24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xuXG4gICAgc3JjX1NldF9fU2V0LnByb3RvdHlwZS5tZXJnZVdpdGggPSBmdW5jdGlvbihtZXJnZXIpIHt2YXIgaXRlcnMgPSBTTElDRSQwLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgIHJldHVybiB0aGlzLnVuaW9uLmFwcGx5KHRoaXMsIGl0ZXJzKTtcbiAgICB9O1xuXG4gICAgc3JjX1NldF9fU2V0LnByb3RvdHlwZS5zb3J0ID0gZnVuY3Rpb24oY29tcGFyYXRvcikge1xuICAgICAgLy8gTGF0ZSBiaW5kaW5nXG4gICAgICByZXR1cm4gT3JkZXJlZFNldChzb3J0RmFjdG9yeSh0aGlzLCBjb21wYXJhdG9yKSk7XG4gICAgfTtcblxuICAgIHNyY19TZXRfX1NldC5wcm90b3R5cGUuc29ydEJ5ID0gZnVuY3Rpb24obWFwcGVyLCBjb21wYXJhdG9yKSB7XG4gICAgICAvLyBMYXRlIGJpbmRpbmdcbiAgICAgIHJldHVybiBPcmRlcmVkU2V0KHNvcnRGYWN0b3J5KHRoaXMsIGNvbXBhcmF0b3IsIG1hcHBlcikpO1xuICAgIH07XG5cbiAgICBzcmNfU2V0X19TZXQucHJvdG90eXBlLndhc0FsdGVyZWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9tYXAud2FzQWx0ZXJlZCgpO1xuICAgIH07XG5cbiAgICBzcmNfU2V0X19TZXQucHJvdG90eXBlLl9faXRlcmF0ZSA9IGZ1bmN0aW9uKGZuLCByZXZlcnNlKSB7dmFyIHRoaXMkMCA9IHRoaXM7XG4gICAgICByZXR1cm4gdGhpcy5fbWFwLl9faXRlcmF0ZShmdW5jdGlvbihfLCBrKSAge3JldHVybiBmbihrLCBrLCB0aGlzJDApfSwgcmV2ZXJzZSk7XG4gICAgfTtcblxuICAgIHNyY19TZXRfX1NldC5wcm90b3R5cGUuX19pdGVyYXRvciA9IGZ1bmN0aW9uKHR5cGUsIHJldmVyc2UpIHtcbiAgICAgIHJldHVybiB0aGlzLl9tYXAubWFwKGZ1bmN0aW9uKF8sIGspICB7cmV0dXJuIGt9KS5fX2l0ZXJhdG9yKHR5cGUsIHJldmVyc2UpO1xuICAgIH07XG5cbiAgICBzcmNfU2V0X19TZXQucHJvdG90eXBlLl9fZW5zdXJlT3duZXIgPSBmdW5jdGlvbihvd25lcklEKSB7XG4gICAgICBpZiAob3duZXJJRCA9PT0gdGhpcy5fX293bmVySUQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICB2YXIgbmV3TWFwID0gdGhpcy5fbWFwLl9fZW5zdXJlT3duZXIob3duZXJJRCk7XG4gICAgICBpZiAoIW93bmVySUQpIHtcbiAgICAgICAgdGhpcy5fX293bmVySUQgPSBvd25lcklEO1xuICAgICAgICB0aGlzLl9tYXAgPSBuZXdNYXA7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuX19tYWtlKG5ld01hcCwgb3duZXJJRCk7XG4gICAgfTtcblxuXG4gIGZ1bmN0aW9uIGlzU2V0KG1heWJlU2V0KSB7XG4gICAgcmV0dXJuICEhKG1heWJlU2V0ICYmIG1heWJlU2V0W0lTX1NFVF9TRU5USU5FTF0pO1xuICB9XG5cbiAgc3JjX1NldF9fU2V0LmlzU2V0ID0gaXNTZXQ7XG5cbiAgdmFyIElTX1NFVF9TRU5USU5FTCA9ICdAQF9fSU1NVVRBQkxFX1NFVF9fQEAnO1xuXG4gIHZhciBTZXRQcm90b3R5cGUgPSBzcmNfU2V0X19TZXQucHJvdG90eXBlO1xuICBTZXRQcm90b3R5cGVbSVNfU0VUX1NFTlRJTkVMXSA9IHRydWU7XG4gIFNldFByb3RvdHlwZVtERUxFVEVdID0gU2V0UHJvdG90eXBlLnJlbW92ZTtcbiAgU2V0UHJvdG90eXBlLm1lcmdlRGVlcCA9IFNldFByb3RvdHlwZS5tZXJnZTtcbiAgU2V0UHJvdG90eXBlLm1lcmdlRGVlcFdpdGggPSBTZXRQcm90b3R5cGUubWVyZ2VXaXRoO1xuICBTZXRQcm90b3R5cGUud2l0aE11dGF0aW9ucyA9IE1hcFByb3RvdHlwZS53aXRoTXV0YXRpb25zO1xuICBTZXRQcm90b3R5cGUuYXNNdXRhYmxlID0gTWFwUHJvdG90eXBlLmFzTXV0YWJsZTtcbiAgU2V0UHJvdG90eXBlLmFzSW1tdXRhYmxlID0gTWFwUHJvdG90eXBlLmFzSW1tdXRhYmxlO1xuXG4gIFNldFByb3RvdHlwZS5fX2VtcHR5ID0gZW1wdHlTZXQ7XG4gIFNldFByb3RvdHlwZS5fX21ha2UgPSBtYWtlU2V0O1xuXG4gIGZ1bmN0aW9uIHVwZGF0ZVNldChzZXQsIG5ld01hcCkge1xuICAgIGlmIChzZXQuX19vd25lcklEKSB7XG4gICAgICBzZXQuc2l6ZSA9IG5ld01hcC5zaXplO1xuICAgICAgc2V0Ll9tYXAgPSBuZXdNYXA7XG4gICAgICByZXR1cm4gc2V0O1xuICAgIH1cbiAgICByZXR1cm4gbmV3TWFwID09PSBzZXQuX21hcCA/IHNldCA6XG4gICAgICBuZXdNYXAuc2l6ZSA9PT0gMCA/IHNldC5fX2VtcHR5KCkgOlxuICAgICAgc2V0Ll9fbWFrZShuZXdNYXApO1xuICB9XG5cbiAgZnVuY3Rpb24gbWFrZVNldChtYXAsIG93bmVySUQpIHtcbiAgICB2YXIgc2V0ID0gT2JqZWN0LmNyZWF0ZShTZXRQcm90b3R5cGUpO1xuICAgIHNldC5zaXplID0gbWFwID8gbWFwLnNpemUgOiAwO1xuICAgIHNldC5fbWFwID0gbWFwO1xuICAgIHNldC5fX293bmVySUQgPSBvd25lcklEO1xuICAgIHJldHVybiBzZXQ7XG4gIH1cblxuICB2YXIgRU1QVFlfU0VUO1xuICBmdW5jdGlvbiBlbXB0eVNldCgpIHtcbiAgICByZXR1cm4gRU1QVFlfU0VUIHx8IChFTVBUWV9TRVQgPSBtYWtlU2V0KGVtcHR5TWFwKCkpKTtcbiAgfVxuXG4gIGNyZWF0ZUNsYXNzKE9yZGVyZWRTZXQsIHNyY19TZXRfX1NldCk7XG5cbiAgICAvLyBAcHJhZ21hIENvbnN0cnVjdGlvblxuXG4gICAgZnVuY3Rpb24gT3JkZXJlZFNldCh2YWx1ZSkge1xuICAgICAgcmV0dXJuIHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQgPyBlbXB0eU9yZGVyZWRTZXQoKSA6XG4gICAgICAgIGlzT3JkZXJlZFNldCh2YWx1ZSkgPyB2YWx1ZSA6XG4gICAgICAgIGVtcHR5T3JkZXJlZFNldCgpLndpdGhNdXRhdGlvbnMoZnVuY3Rpb24oc2V0ICkge1xuICAgICAgICAgIHZhciBpdGVyID0gU2V0SXRlcmFibGUodmFsdWUpO1xuICAgICAgICAgIGFzc2VydE5vdEluZmluaXRlKGl0ZXIuc2l6ZSk7XG4gICAgICAgICAgaXRlci5mb3JFYWNoKGZ1bmN0aW9uKHYgKSB7cmV0dXJuIHNldC5hZGQodil9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgT3JkZXJlZFNldC5vZiA9IGZ1bmN0aW9uKC8qLi4udmFsdWVzKi8pIHtcbiAgICAgIHJldHVybiB0aGlzKGFyZ3VtZW50cyk7XG4gICAgfTtcblxuICAgIE9yZGVyZWRTZXQuZnJvbUtleXMgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIHRoaXMoS2V5ZWRJdGVyYWJsZSh2YWx1ZSkua2V5U2VxKCkpO1xuICAgIH07XG5cbiAgICBPcmRlcmVkU2V0LnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX190b1N0cmluZygnT3JkZXJlZFNldCB7JywgJ30nKTtcbiAgICB9O1xuXG5cbiAgZnVuY3Rpb24gaXNPcmRlcmVkU2V0KG1heWJlT3JkZXJlZFNldCkge1xuICAgIHJldHVybiBpc1NldChtYXliZU9yZGVyZWRTZXQpICYmIGlzT3JkZXJlZChtYXliZU9yZGVyZWRTZXQpO1xuICB9XG5cbiAgT3JkZXJlZFNldC5pc09yZGVyZWRTZXQgPSBpc09yZGVyZWRTZXQ7XG5cbiAgdmFyIE9yZGVyZWRTZXRQcm90b3R5cGUgPSBPcmRlcmVkU2V0LnByb3RvdHlwZTtcbiAgT3JkZXJlZFNldFByb3RvdHlwZVtJU19PUkRFUkVEX1NFTlRJTkVMXSA9IHRydWU7XG5cbiAgT3JkZXJlZFNldFByb3RvdHlwZS5fX2VtcHR5ID0gZW1wdHlPcmRlcmVkU2V0O1xuICBPcmRlcmVkU2V0UHJvdG90eXBlLl9fbWFrZSA9IG1ha2VPcmRlcmVkU2V0O1xuXG4gIGZ1bmN0aW9uIG1ha2VPcmRlcmVkU2V0KG1hcCwgb3duZXJJRCkge1xuICAgIHZhciBzZXQgPSBPYmplY3QuY3JlYXRlKE9yZGVyZWRTZXRQcm90b3R5cGUpO1xuICAgIHNldC5zaXplID0gbWFwID8gbWFwLnNpemUgOiAwO1xuICAgIHNldC5fbWFwID0gbWFwO1xuICAgIHNldC5fX293bmVySUQgPSBvd25lcklEO1xuICAgIHJldHVybiBzZXQ7XG4gIH1cblxuICB2YXIgRU1QVFlfT1JERVJFRF9TRVQ7XG4gIGZ1bmN0aW9uIGVtcHR5T3JkZXJlZFNldCgpIHtcbiAgICByZXR1cm4gRU1QVFlfT1JERVJFRF9TRVQgfHwgKEVNUFRZX09SREVSRURfU0VUID0gbWFrZU9yZGVyZWRTZXQoZW1wdHlPcmRlcmVkTWFwKCkpKTtcbiAgfVxuXG4gIGNyZWF0ZUNsYXNzKFJlY29yZCwgS2V5ZWRDb2xsZWN0aW9uKTtcblxuICAgIGZ1bmN0aW9uIFJlY29yZChkZWZhdWx0VmFsdWVzLCBuYW1lKSB7XG4gICAgICB2YXIgUmVjb3JkVHlwZSA9IGZ1bmN0aW9uIFJlY29yZCh2YWx1ZXMpIHtcbiAgICAgICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFJlY29yZFR5cGUpKSB7XG4gICAgICAgICAgcmV0dXJuIG5ldyBSZWNvcmRUeXBlKHZhbHVlcyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fbWFwID0gc3JjX01hcF9fTWFwKHZhbHVlcyk7XG4gICAgICB9O1xuXG4gICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGRlZmF1bHRWYWx1ZXMpO1xuXG4gICAgICB2YXIgUmVjb3JkVHlwZVByb3RvdHlwZSA9IFJlY29yZFR5cGUucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShSZWNvcmRQcm90b3R5cGUpO1xuICAgICAgUmVjb3JkVHlwZVByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFJlY29yZFR5cGU7XG4gICAgICBuYW1lICYmIChSZWNvcmRUeXBlUHJvdG90eXBlLl9uYW1lID0gbmFtZSk7XG4gICAgICBSZWNvcmRUeXBlUHJvdG90eXBlLl9kZWZhdWx0VmFsdWVzID0gZGVmYXVsdFZhbHVlcztcbiAgICAgIFJlY29yZFR5cGVQcm90b3R5cGUuX2tleXMgPSBrZXlzO1xuICAgICAgUmVjb3JkVHlwZVByb3RvdHlwZS5zaXplID0ga2V5cy5sZW5ndGg7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbihrZXkgKSB7XG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFJlY29yZFR5cGUucHJvdG90eXBlLCBrZXksIHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldChrZXkpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgICAgaW52YXJpYW50KHRoaXMuX19vd25lcklELCAnQ2Fubm90IHNldCBvbiBhbiBpbW11dGFibGUgcmVjb3JkLicpO1xuICAgICAgICAgICAgICB0aGlzLnNldChrZXksIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAvLyBPYmplY3QuZGVmaW5lUHJvcGVydHkgZmFpbGVkLiBQcm9iYWJseSBJRTguXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBSZWNvcmRUeXBlO1xuICAgIH1cblxuICAgIFJlY29yZC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9fdG9TdHJpbmcocmVjb3JkTmFtZSh0aGlzKSArICcgeycsICd9Jyk7XG4gICAgfTtcblxuICAgIC8vIEBwcmFnbWEgQWNjZXNzXG5cbiAgICBSZWNvcmQucHJvdG90eXBlLmhhcyA9IGZ1bmN0aW9uKGspIHtcbiAgICAgIHJldHVybiB0aGlzLl9kZWZhdWx0VmFsdWVzLmhhc093blByb3BlcnR5KGspO1xuICAgIH07XG5cbiAgICBSZWNvcmQucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKGssIG5vdFNldFZhbHVlKSB7XG4gICAgICBpZiAoIXRoaXMuaGFzKGspKSB7XG4gICAgICAgIHJldHVybiBub3RTZXRWYWx1ZTtcbiAgICAgIH1cbiAgICAgIHZhciBkZWZhdWx0VmFsID0gdGhpcy5fZGVmYXVsdFZhbHVlc1trXTtcbiAgICAgIHJldHVybiB0aGlzLl9tYXAgPyB0aGlzLl9tYXAuZ2V0KGssIGRlZmF1bHRWYWwpIDogZGVmYXVsdFZhbDtcbiAgICB9O1xuXG4gICAgLy8gQHByYWdtYSBNb2RpZmljYXRpb25cblxuICAgIFJlY29yZC5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLl9fb3duZXJJRCkge1xuICAgICAgICB0aGlzLl9tYXAgJiYgdGhpcy5fbWFwLmNsZWFyKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgdmFyIFN1cGVyUmVjb3JkID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHRoaXMpLmNvbnN0cnVjdG9yO1xuICAgICAgcmV0dXJuIFN1cGVyUmVjb3JkLl9lbXB0eSB8fCAoU3VwZXJSZWNvcmQuX2VtcHR5ID0gbWFrZVJlY29yZCh0aGlzLCBlbXB0eU1hcCgpKSk7XG4gICAgfTtcblxuICAgIFJlY29yZC5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24oaywgdikge1xuICAgICAgaWYgKCF0aGlzLmhhcyhrKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBzZXQgdW5rbm93biBrZXkgXCInICsgayArICdcIiBvbiAnICsgcmVjb3JkTmFtZSh0aGlzKSk7XG4gICAgICB9XG4gICAgICB2YXIgbmV3TWFwID0gdGhpcy5fbWFwICYmIHRoaXMuX21hcC5zZXQoaywgdik7XG4gICAgICBpZiAodGhpcy5fX293bmVySUQgfHwgbmV3TWFwID09PSB0aGlzLl9tYXApIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICByZXR1cm4gbWFrZVJlY29yZCh0aGlzLCBuZXdNYXApO1xuICAgIH07XG5cbiAgICBSZWNvcmQucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uKGspIHtcbiAgICAgIGlmICghdGhpcy5oYXMoaykpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICB2YXIgbmV3TWFwID0gdGhpcy5fbWFwICYmIHRoaXMuX21hcC5yZW1vdmUoayk7XG4gICAgICBpZiAodGhpcy5fX293bmVySUQgfHwgbmV3TWFwID09PSB0aGlzLl9tYXApIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICByZXR1cm4gbWFrZVJlY29yZCh0aGlzLCBuZXdNYXApO1xuICAgIH07XG5cbiAgICBSZWNvcmQucHJvdG90eXBlLndhc0FsdGVyZWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9tYXAud2FzQWx0ZXJlZCgpO1xuICAgIH07XG5cbiAgICBSZWNvcmQucHJvdG90eXBlLl9faXRlcmF0b3IgPSBmdW5jdGlvbih0eXBlLCByZXZlcnNlKSB7dmFyIHRoaXMkMCA9IHRoaXM7XG4gICAgICByZXR1cm4gS2V5ZWRJdGVyYWJsZSh0aGlzLl9kZWZhdWx0VmFsdWVzKS5tYXAoZnVuY3Rpb24oXywgaykgIHtyZXR1cm4gdGhpcyQwLmdldChrKX0pLl9faXRlcmF0b3IodHlwZSwgcmV2ZXJzZSk7XG4gICAgfTtcblxuICAgIFJlY29yZC5wcm90b3R5cGUuX19pdGVyYXRlID0gZnVuY3Rpb24oZm4sIHJldmVyc2UpIHt2YXIgdGhpcyQwID0gdGhpcztcbiAgICAgIHJldHVybiBLZXllZEl0ZXJhYmxlKHRoaXMuX2RlZmF1bHRWYWx1ZXMpLm1hcChmdW5jdGlvbihfLCBrKSAge3JldHVybiB0aGlzJDAuZ2V0KGspfSkuX19pdGVyYXRlKGZuLCByZXZlcnNlKTtcbiAgICB9O1xuXG4gICAgUmVjb3JkLnByb3RvdHlwZS5fX2Vuc3VyZU93bmVyID0gZnVuY3Rpb24ob3duZXJJRCkge1xuICAgICAgaWYgKG93bmVySUQgPT09IHRoaXMuX19vd25lcklEKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgdmFyIG5ld01hcCA9IHRoaXMuX21hcCAmJiB0aGlzLl9tYXAuX19lbnN1cmVPd25lcihvd25lcklEKTtcbiAgICAgIGlmICghb3duZXJJRCkge1xuICAgICAgICB0aGlzLl9fb3duZXJJRCA9IG93bmVySUQ7XG4gICAgICAgIHRoaXMuX21hcCA9IG5ld01hcDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICByZXR1cm4gbWFrZVJlY29yZCh0aGlzLCBuZXdNYXAsIG93bmVySUQpO1xuICAgIH07XG5cblxuICB2YXIgUmVjb3JkUHJvdG90eXBlID0gUmVjb3JkLnByb3RvdHlwZTtcbiAgUmVjb3JkUHJvdG90eXBlW0RFTEVURV0gPSBSZWNvcmRQcm90b3R5cGUucmVtb3ZlO1xuICBSZWNvcmRQcm90b3R5cGUuZGVsZXRlSW4gPVxuICBSZWNvcmRQcm90b3R5cGUucmVtb3ZlSW4gPSBNYXBQcm90b3R5cGUucmVtb3ZlSW47XG4gIFJlY29yZFByb3RvdHlwZS5tZXJnZSA9IE1hcFByb3RvdHlwZS5tZXJnZTtcbiAgUmVjb3JkUHJvdG90eXBlLm1lcmdlV2l0aCA9IE1hcFByb3RvdHlwZS5tZXJnZVdpdGg7XG4gIFJlY29yZFByb3RvdHlwZS5tZXJnZUluID0gTWFwUHJvdG90eXBlLm1lcmdlSW47XG4gIFJlY29yZFByb3RvdHlwZS5tZXJnZURlZXAgPSBNYXBQcm90b3R5cGUubWVyZ2VEZWVwO1xuICBSZWNvcmRQcm90b3R5cGUubWVyZ2VEZWVwV2l0aCA9IE1hcFByb3RvdHlwZS5tZXJnZURlZXBXaXRoO1xuICBSZWNvcmRQcm90b3R5cGUubWVyZ2VEZWVwSW4gPSBNYXBQcm90b3R5cGUubWVyZ2VEZWVwSW47XG4gIFJlY29yZFByb3RvdHlwZS5zZXRJbiA9IE1hcFByb3RvdHlwZS5zZXRJbjtcbiAgUmVjb3JkUHJvdG90eXBlLnVwZGF0ZSA9IE1hcFByb3RvdHlwZS51cGRhdGU7XG4gIFJlY29yZFByb3RvdHlwZS51cGRhdGVJbiA9IE1hcFByb3RvdHlwZS51cGRhdGVJbjtcbiAgUmVjb3JkUHJvdG90eXBlLndpdGhNdXRhdGlvbnMgPSBNYXBQcm90b3R5cGUud2l0aE11dGF0aW9ucztcbiAgUmVjb3JkUHJvdG90eXBlLmFzTXV0YWJsZSA9IE1hcFByb3RvdHlwZS5hc011dGFibGU7XG4gIFJlY29yZFByb3RvdHlwZS5hc0ltbXV0YWJsZSA9IE1hcFByb3RvdHlwZS5hc0ltbXV0YWJsZTtcblxuXG4gIGZ1bmN0aW9uIG1ha2VSZWNvcmQobGlrZVJlY29yZCwgbWFwLCBvd25lcklEKSB7XG4gICAgdmFyIHJlY29yZCA9IE9iamVjdC5jcmVhdGUoT2JqZWN0LmdldFByb3RvdHlwZU9mKGxpa2VSZWNvcmQpKTtcbiAgICByZWNvcmQuX21hcCA9IG1hcDtcbiAgICByZWNvcmQuX19vd25lcklEID0gb3duZXJJRDtcbiAgICByZXR1cm4gcmVjb3JkO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVjb3JkTmFtZShyZWNvcmQpIHtcbiAgICByZXR1cm4gcmVjb3JkLl9uYW1lIHx8IHJlY29yZC5jb25zdHJ1Y3Rvci5uYW1lO1xuICB9XG5cbiAgZnVuY3Rpb24gZGVlcEVxdWFsKGEsIGIpIHtcbiAgICBpZiAoYSA9PT0gYikge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgIWlzSXRlcmFibGUoYikgfHxcbiAgICAgIGEuc2l6ZSAhPT0gdW5kZWZpbmVkICYmIGIuc2l6ZSAhPT0gdW5kZWZpbmVkICYmIGEuc2l6ZSAhPT0gYi5zaXplIHx8XG4gICAgICBhLl9faGFzaCAhPT0gdW5kZWZpbmVkICYmIGIuX19oYXNoICE9PSB1bmRlZmluZWQgJiYgYS5fX2hhc2ggIT09IGIuX19oYXNoIHx8XG4gICAgICBpc0tleWVkKGEpICE9PSBpc0tleWVkKGIpIHx8XG4gICAgICBpc0luZGV4ZWQoYSkgIT09IGlzSW5kZXhlZChiKSB8fFxuICAgICAgaXNPcmRlcmVkKGEpICE9PSBpc09yZGVyZWQoYilcbiAgICApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoYS5zaXplID09PSAwICYmIGIuc2l6ZSA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgdmFyIG5vdEFzc29jaWF0aXZlID0gIWlzQXNzb2NpYXRpdmUoYSk7XG5cbiAgICBpZiAoaXNPcmRlcmVkKGEpKSB7XG4gICAgICB2YXIgZW50cmllcyA9IGEuZW50cmllcygpO1xuICAgICAgcmV0dXJuIGIuZXZlcnkoZnVuY3Rpb24odiwgaykgIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gZW50cmllcy5uZXh0KCkudmFsdWU7XG4gICAgICAgIHJldHVybiBlbnRyeSAmJiBpcyhlbnRyeVsxXSwgdikgJiYgKG5vdEFzc29jaWF0aXZlIHx8IGlzKGVudHJ5WzBdLCBrKSk7XG4gICAgICB9KSAmJiBlbnRyaWVzLm5leHQoKS5kb25lO1xuICAgIH1cblxuICAgIHZhciBmbGlwcGVkID0gZmFsc2U7XG5cbiAgICBpZiAoYS5zaXplID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmIChiLnNpemUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBhLmNhY2hlUmVzdWx0KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmbGlwcGVkID0gdHJ1ZTtcbiAgICAgICAgdmFyIF8gPSBhO1xuICAgICAgICBhID0gYjtcbiAgICAgICAgYiA9IF87XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGFsbEVxdWFsID0gdHJ1ZTtcbiAgICB2YXIgYlNpemUgPSBiLl9faXRlcmF0ZShmdW5jdGlvbih2LCBrKSAge1xuICAgICAgaWYgKG5vdEFzc29jaWF0aXZlID8gIWEuaGFzKHYpIDpcbiAgICAgICAgICBmbGlwcGVkID8gIWlzKHYsIGEuZ2V0KGssIE5PVF9TRVQpKSA6ICFpcyhhLmdldChrLCBOT1RfU0VUKSwgdikpIHtcbiAgICAgICAgYWxsRXF1YWwgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGFsbEVxdWFsICYmIGEuc2l6ZSA9PT0gYlNpemU7XG4gIH1cblxuICBjcmVhdGVDbGFzcyhSYW5nZSwgSW5kZXhlZFNlcSk7XG5cbiAgICBmdW5jdGlvbiBSYW5nZShzdGFydCwgZW5kLCBzdGVwKSB7XG4gICAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgUmFuZ2UpKSB7XG4gICAgICAgIHJldHVybiBuZXcgUmFuZ2Uoc3RhcnQsIGVuZCwgc3RlcCk7XG4gICAgICB9XG4gICAgICBpbnZhcmlhbnQoc3RlcCAhPT0gMCwgJ0Nhbm5vdCBzdGVwIGEgUmFuZ2UgYnkgMCcpO1xuICAgICAgc3RhcnQgPSBzdGFydCB8fCAwO1xuICAgICAgaWYgKGVuZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGVuZCA9IEluZmluaXR5O1xuICAgICAgfVxuICAgICAgc3RlcCA9IHN0ZXAgPT09IHVuZGVmaW5lZCA/IDEgOiBNYXRoLmFicyhzdGVwKTtcbiAgICAgIGlmIChlbmQgPCBzdGFydCkge1xuICAgICAgICBzdGVwID0gLXN0ZXA7XG4gICAgICB9XG4gICAgICB0aGlzLl9zdGFydCA9IHN0YXJ0O1xuICAgICAgdGhpcy5fZW5kID0gZW5kO1xuICAgICAgdGhpcy5fc3RlcCA9IHN0ZXA7XG4gICAgICB0aGlzLnNpemUgPSBNYXRoLm1heCgwLCBNYXRoLmNlaWwoKGVuZCAtIHN0YXJ0KSAvIHN0ZXAgLSAxKSArIDEpO1xuICAgICAgaWYgKHRoaXMuc2l6ZSA9PT0gMCkge1xuICAgICAgICBpZiAoRU1QVFlfUkFOR0UpIHtcbiAgICAgICAgICByZXR1cm4gRU1QVFlfUkFOR0U7XG4gICAgICAgIH1cbiAgICAgICAgRU1QVFlfUkFOR0UgPSB0aGlzO1xuICAgICAgfVxuICAgIH1cblxuICAgIFJhbmdlLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHRoaXMuc2l6ZSA9PT0gMCkge1xuICAgICAgICByZXR1cm4gJ1JhbmdlIFtdJztcbiAgICAgIH1cbiAgICAgIHJldHVybiAnUmFuZ2UgWyAnICtcbiAgICAgICAgdGhpcy5fc3RhcnQgKyAnLi4uJyArIHRoaXMuX2VuZCArXG4gICAgICAgICh0aGlzLl9zdGVwID4gMSA/ICcgYnkgJyArIHRoaXMuX3N0ZXAgOiAnJykgK1xuICAgICAgJyBdJztcbiAgICB9O1xuXG4gICAgUmFuZ2UucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKGluZGV4LCBub3RTZXRWYWx1ZSkge1xuICAgICAgcmV0dXJuIHRoaXMuaGFzKGluZGV4KSA/XG4gICAgICAgIHRoaXMuX3N0YXJ0ICsgd3JhcEluZGV4KHRoaXMsIGluZGV4KSAqIHRoaXMuX3N0ZXAgOlxuICAgICAgICBub3RTZXRWYWx1ZTtcbiAgICB9O1xuXG4gICAgUmFuZ2UucHJvdG90eXBlLmNvbnRhaW5zID0gZnVuY3Rpb24oc2VhcmNoVmFsdWUpIHtcbiAgICAgIHZhciBwb3NzaWJsZUluZGV4ID0gKHNlYXJjaFZhbHVlIC0gdGhpcy5fc3RhcnQpIC8gdGhpcy5fc3RlcDtcbiAgICAgIHJldHVybiBwb3NzaWJsZUluZGV4ID49IDAgJiZcbiAgICAgICAgcG9zc2libGVJbmRleCA8IHRoaXMuc2l6ZSAmJlxuICAgICAgICBwb3NzaWJsZUluZGV4ID09PSBNYXRoLmZsb29yKHBvc3NpYmxlSW5kZXgpO1xuICAgIH07XG5cbiAgICBSYW5nZS5wcm90b3R5cGUuc2xpY2UgPSBmdW5jdGlvbihiZWdpbiwgZW5kKSB7XG4gICAgICBpZiAod2hvbGVTbGljZShiZWdpbiwgZW5kLCB0aGlzLnNpemUpKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgYmVnaW4gPSByZXNvbHZlQmVnaW4oYmVnaW4sIHRoaXMuc2l6ZSk7XG4gICAgICBlbmQgPSByZXNvbHZlRW5kKGVuZCwgdGhpcy5zaXplKTtcbiAgICAgIGlmIChlbmQgPD0gYmVnaW4pIHtcbiAgICAgICAgcmV0dXJuIG5ldyBSYW5nZSgwLCAwKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXcgUmFuZ2UodGhpcy5nZXQoYmVnaW4sIHRoaXMuX2VuZCksIHRoaXMuZ2V0KGVuZCwgdGhpcy5fZW5kKSwgdGhpcy5fc3RlcCk7XG4gICAgfTtcblxuICAgIFJhbmdlLnByb3RvdHlwZS5pbmRleE9mID0gZnVuY3Rpb24oc2VhcmNoVmFsdWUpIHtcbiAgICAgIHZhciBvZmZzZXRWYWx1ZSA9IHNlYXJjaFZhbHVlIC0gdGhpcy5fc3RhcnQ7XG4gICAgICBpZiAob2Zmc2V0VmFsdWUgJSB0aGlzLl9zdGVwID09PSAwKSB7XG4gICAgICAgIHZhciBpbmRleCA9IG9mZnNldFZhbHVlIC8gdGhpcy5fc3RlcDtcbiAgICAgICAgaWYgKGluZGV4ID49IDAgJiYgaW5kZXggPCB0aGlzLnNpemUpIHtcbiAgICAgICAgICByZXR1cm4gaW5kZXhcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIC0xO1xuICAgIH07XG5cbiAgICBSYW5nZS5wcm90b3R5cGUubGFzdEluZGV4T2YgPSBmdW5jdGlvbihzZWFyY2hWYWx1ZSkge1xuICAgICAgcmV0dXJuIHRoaXMuaW5kZXhPZihzZWFyY2hWYWx1ZSk7XG4gICAgfTtcblxuICAgIFJhbmdlLnByb3RvdHlwZS5fX2l0ZXJhdGUgPSBmdW5jdGlvbihmbiwgcmV2ZXJzZSkge1xuICAgICAgdmFyIG1heEluZGV4ID0gdGhpcy5zaXplIC0gMTtcbiAgICAgIHZhciBzdGVwID0gdGhpcy5fc3RlcDtcbiAgICAgIHZhciB2YWx1ZSA9IHJldmVyc2UgPyB0aGlzLl9zdGFydCArIG1heEluZGV4ICogc3RlcCA6IHRoaXMuX3N0YXJ0O1xuICAgICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8PSBtYXhJbmRleDsgaWkrKykge1xuICAgICAgICBpZiAoZm4odmFsdWUsIGlpLCB0aGlzKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICByZXR1cm4gaWkgKyAxO1xuICAgICAgICB9XG4gICAgICAgIHZhbHVlICs9IHJldmVyc2UgPyAtc3RlcCA6IHN0ZXA7XG4gICAgICB9XG4gICAgICByZXR1cm4gaWk7XG4gICAgfTtcblxuICAgIFJhbmdlLnByb3RvdHlwZS5fX2l0ZXJhdG9yID0gZnVuY3Rpb24odHlwZSwgcmV2ZXJzZSkge1xuICAgICAgdmFyIG1heEluZGV4ID0gdGhpcy5zaXplIC0gMTtcbiAgICAgIHZhciBzdGVwID0gdGhpcy5fc3RlcDtcbiAgICAgIHZhciB2YWx1ZSA9IHJldmVyc2UgPyB0aGlzLl9zdGFydCArIG1heEluZGV4ICogc3RlcCA6IHRoaXMuX3N0YXJ0O1xuICAgICAgdmFyIGlpID0gMDtcbiAgICAgIHJldHVybiBuZXcgc3JjX0l0ZXJhdG9yX19JdGVyYXRvcihmdW5jdGlvbigpICB7XG4gICAgICAgIHZhciB2ID0gdmFsdWU7XG4gICAgICAgIHZhbHVlICs9IHJldmVyc2UgPyAtc3RlcCA6IHN0ZXA7XG4gICAgICAgIHJldHVybiBpaSA+IG1heEluZGV4ID8gaXRlcmF0b3JEb25lKCkgOiBpdGVyYXRvclZhbHVlKHR5cGUsIGlpKyssIHYpO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIFJhbmdlLnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbihvdGhlcikge1xuICAgICAgcmV0dXJuIG90aGVyIGluc3RhbmNlb2YgUmFuZ2UgP1xuICAgICAgICB0aGlzLl9zdGFydCA9PT0gb3RoZXIuX3N0YXJ0ICYmXG4gICAgICAgIHRoaXMuX2VuZCA9PT0gb3RoZXIuX2VuZCAmJlxuICAgICAgICB0aGlzLl9zdGVwID09PSBvdGhlci5fc3RlcCA6XG4gICAgICAgIGRlZXBFcXVhbCh0aGlzLCBvdGhlcik7XG4gICAgfTtcblxuXG4gIHZhciBFTVBUWV9SQU5HRTtcblxuICBjcmVhdGVDbGFzcyhSZXBlYXQsIEluZGV4ZWRTZXEpO1xuXG4gICAgZnVuY3Rpb24gUmVwZWF0KHZhbHVlLCB0aW1lcykge1xuICAgICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFJlcGVhdCkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBSZXBlYXQodmFsdWUsIHRpbWVzKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XG4gICAgICB0aGlzLnNpemUgPSB0aW1lcyA9PT0gdW5kZWZpbmVkID8gSW5maW5pdHkgOiBNYXRoLm1heCgwLCB0aW1lcyk7XG4gICAgICBpZiAodGhpcy5zaXplID09PSAwKSB7XG4gICAgICAgIGlmIChFTVBUWV9SRVBFQVQpIHtcbiAgICAgICAgICByZXR1cm4gRU1QVFlfUkVQRUFUO1xuICAgICAgICB9XG4gICAgICAgIEVNUFRZX1JFUEVBVCA9IHRoaXM7XG4gICAgICB9XG4gICAgfVxuXG4gICAgUmVwZWF0LnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHRoaXMuc2l6ZSA9PT0gMCkge1xuICAgICAgICByZXR1cm4gJ1JlcGVhdCBbXSc7XG4gICAgICB9XG4gICAgICByZXR1cm4gJ1JlcGVhdCBbICcgKyB0aGlzLl92YWx1ZSArICcgJyArIHRoaXMuc2l6ZSArICcgdGltZXMgXSc7XG4gICAgfTtcblxuICAgIFJlcGVhdC5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oaW5kZXgsIG5vdFNldFZhbHVlKSB7XG4gICAgICByZXR1cm4gdGhpcy5oYXMoaW5kZXgpID8gdGhpcy5fdmFsdWUgOiBub3RTZXRWYWx1ZTtcbiAgICB9O1xuXG4gICAgUmVwZWF0LnByb3RvdHlwZS5jb250YWlucyA9IGZ1bmN0aW9uKHNlYXJjaFZhbHVlKSB7XG4gICAgICByZXR1cm4gaXModGhpcy5fdmFsdWUsIHNlYXJjaFZhbHVlKTtcbiAgICB9O1xuXG4gICAgUmVwZWF0LnByb3RvdHlwZS5zbGljZSA9IGZ1bmN0aW9uKGJlZ2luLCBlbmQpIHtcbiAgICAgIHZhciBzaXplID0gdGhpcy5zaXplO1xuICAgICAgcmV0dXJuIHdob2xlU2xpY2UoYmVnaW4sIGVuZCwgc2l6ZSkgPyB0aGlzIDpcbiAgICAgICAgbmV3IFJlcGVhdCh0aGlzLl92YWx1ZSwgcmVzb2x2ZUVuZChlbmQsIHNpemUpIC0gcmVzb2x2ZUJlZ2luKGJlZ2luLCBzaXplKSk7XG4gICAgfTtcblxuICAgIFJlcGVhdC5wcm90b3R5cGUucmV2ZXJzZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIFJlcGVhdC5wcm90b3R5cGUuaW5kZXhPZiA9IGZ1bmN0aW9uKHNlYXJjaFZhbHVlKSB7XG4gICAgICBpZiAoaXModGhpcy5fdmFsdWUsIHNlYXJjaFZhbHVlKSkge1xuICAgICAgICByZXR1cm4gMDtcbiAgICAgIH1cbiAgICAgIHJldHVybiAtMTtcbiAgICB9O1xuXG4gICAgUmVwZWF0LnByb3RvdHlwZS5sYXN0SW5kZXhPZiA9IGZ1bmN0aW9uKHNlYXJjaFZhbHVlKSB7XG4gICAgICBpZiAoaXModGhpcy5fdmFsdWUsIHNlYXJjaFZhbHVlKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5zaXplO1xuICAgICAgfVxuICAgICAgcmV0dXJuIC0xO1xuICAgIH07XG5cbiAgICBSZXBlYXQucHJvdG90eXBlLl9faXRlcmF0ZSA9IGZ1bmN0aW9uKGZuLCByZXZlcnNlKSB7XG4gICAgICBmb3IgKHZhciBpaSA9IDA7IGlpIDwgdGhpcy5zaXplOyBpaSsrKSB7XG4gICAgICAgIGlmIChmbih0aGlzLl92YWx1ZSwgaWksIHRoaXMpID09PSBmYWxzZSkge1xuICAgICAgICAgIHJldHVybiBpaSArIDE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBpaTtcbiAgICB9O1xuXG4gICAgUmVwZWF0LnByb3RvdHlwZS5fX2l0ZXJhdG9yID0gZnVuY3Rpb24odHlwZSwgcmV2ZXJzZSkge3ZhciB0aGlzJDAgPSB0aGlzO1xuICAgICAgdmFyIGlpID0gMDtcbiAgICAgIHJldHVybiBuZXcgc3JjX0l0ZXJhdG9yX19JdGVyYXRvcihmdW5jdGlvbigpIFxuICAgICAgICB7cmV0dXJuIGlpIDwgdGhpcyQwLnNpemUgPyBpdGVyYXRvclZhbHVlKHR5cGUsIGlpKyssIHRoaXMkMC5fdmFsdWUpIDogaXRlcmF0b3JEb25lKCl9XG4gICAgICApO1xuICAgIH07XG5cbiAgICBSZXBlYXQucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uKG90aGVyKSB7XG4gICAgICByZXR1cm4gb3RoZXIgaW5zdGFuY2VvZiBSZXBlYXQgP1xuICAgICAgICBpcyh0aGlzLl92YWx1ZSwgb3RoZXIuX3ZhbHVlKSA6XG4gICAgICAgIGRlZXBFcXVhbChvdGhlcik7XG4gICAgfTtcblxuXG4gIHZhciBFTVBUWV9SRVBFQVQ7XG5cbiAgLyoqXG4gICAqIENvbnRyaWJ1dGVzIGFkZGl0aW9uYWwgbWV0aG9kcyB0byBhIGNvbnN0cnVjdG9yXG4gICAqL1xuICBmdW5jdGlvbiBtaXhpbihjdG9yLCBtZXRob2RzKSB7XG4gICAgdmFyIGtleUNvcGllciA9IGZ1bmN0aW9uKGtleSApIHsgY3Rvci5wcm90b3R5cGVba2V5XSA9IG1ldGhvZHNba2V5XTsgfTtcbiAgICBPYmplY3Qua2V5cyhtZXRob2RzKS5mb3JFYWNoKGtleUNvcGllcik7XG4gICAgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyAmJlxuICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhtZXRob2RzKS5mb3JFYWNoKGtleUNvcGllcik7XG4gICAgcmV0dXJuIGN0b3I7XG4gIH1cblxuICBJdGVyYWJsZS5JdGVyYXRvciA9IHNyY19JdGVyYXRvcl9fSXRlcmF0b3I7XG5cbiAgbWl4aW4oSXRlcmFibGUsIHtcblxuICAgIC8vICMjIyBDb252ZXJzaW9uIHRvIG90aGVyIHR5cGVzXG5cbiAgICB0b0FycmF5OiBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydE5vdEluZmluaXRlKHRoaXMuc2l6ZSk7XG4gICAgICB2YXIgYXJyYXkgPSBuZXcgQXJyYXkodGhpcy5zaXplIHx8IDApO1xuICAgICAgdGhpcy52YWx1ZVNlcSgpLl9faXRlcmF0ZShmdW5jdGlvbih2LCBpKSAgeyBhcnJheVtpXSA9IHY7IH0pO1xuICAgICAgcmV0dXJuIGFycmF5O1xuICAgIH0sXG5cbiAgICB0b0luZGV4ZWRTZXE6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIG5ldyBUb0luZGV4ZWRTZXF1ZW5jZSh0aGlzKTtcbiAgICB9LFxuXG4gICAgdG9KUzogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy50b1NlcSgpLm1hcChcbiAgICAgICAgZnVuY3Rpb24odmFsdWUgKSB7cmV0dXJuIHZhbHVlICYmIHR5cGVvZiB2YWx1ZS50b0pTID09PSAnZnVuY3Rpb24nID8gdmFsdWUudG9KUygpIDogdmFsdWV9XG4gICAgICApLl9fdG9KUygpO1xuICAgIH0sXG5cbiAgICB0b0pTT046IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMudG9TZXEoKS5tYXAoXG4gICAgICAgIGZ1bmN0aW9uKHZhbHVlICkge3JldHVybiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUudG9KU09OID09PSAnZnVuY3Rpb24nID8gdmFsdWUudG9KU09OKCkgOiB2YWx1ZX1cbiAgICAgICkuX190b0pTKCk7XG4gICAgfSxcblxuICAgIHRvS2V5ZWRTZXE6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIG5ldyBUb0tleWVkU2VxdWVuY2UodGhpcywgdHJ1ZSk7XG4gICAgfSxcblxuICAgIHRvTWFwOiBmdW5jdGlvbigpIHtcbiAgICAgIC8vIFVzZSBMYXRlIEJpbmRpbmcgaGVyZSB0byBzb2x2ZSB0aGUgY2lyY3VsYXIgZGVwZW5kZW5jeS5cbiAgICAgIHJldHVybiBzcmNfTWFwX19NYXAodGhpcy50b0tleWVkU2VxKCkpO1xuICAgIH0sXG5cbiAgICB0b09iamVjdDogZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnROb3RJbmZpbml0ZSh0aGlzLnNpemUpO1xuICAgICAgdmFyIG9iamVjdCA9IHt9O1xuICAgICAgdGhpcy5fX2l0ZXJhdGUoZnVuY3Rpb24odiwgaykgIHsgb2JqZWN0W2tdID0gdjsgfSk7XG4gICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH0sXG5cbiAgICB0b09yZGVyZWRNYXA6IGZ1bmN0aW9uKCkge1xuICAgICAgLy8gVXNlIExhdGUgQmluZGluZyBoZXJlIHRvIHNvbHZlIHRoZSBjaXJjdWxhciBkZXBlbmRlbmN5LlxuICAgICAgcmV0dXJuIE9yZGVyZWRNYXAodGhpcy50b0tleWVkU2VxKCkpO1xuICAgIH0sXG5cbiAgICB0b09yZGVyZWRTZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgLy8gVXNlIExhdGUgQmluZGluZyBoZXJlIHRvIHNvbHZlIHRoZSBjaXJjdWxhciBkZXBlbmRlbmN5LlxuICAgICAgcmV0dXJuIE9yZGVyZWRTZXQoaXNLZXllZCh0aGlzKSA/IHRoaXMudmFsdWVTZXEoKSA6IHRoaXMpO1xuICAgIH0sXG5cbiAgICB0b1NldDogZnVuY3Rpb24oKSB7XG4gICAgICAvLyBVc2UgTGF0ZSBCaW5kaW5nIGhlcmUgdG8gc29sdmUgdGhlIGNpcmN1bGFyIGRlcGVuZGVuY3kuXG4gICAgICByZXR1cm4gc3JjX1NldF9fU2V0KGlzS2V5ZWQodGhpcykgPyB0aGlzLnZhbHVlU2VxKCkgOiB0aGlzKTtcbiAgICB9LFxuXG4gICAgdG9TZXRTZXE6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIG5ldyBUb1NldFNlcXVlbmNlKHRoaXMpO1xuICAgIH0sXG5cbiAgICB0b1NlcTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gaXNJbmRleGVkKHRoaXMpID8gdGhpcy50b0luZGV4ZWRTZXEoKSA6XG4gICAgICAgIGlzS2V5ZWQodGhpcykgPyB0aGlzLnRvS2V5ZWRTZXEoKSA6XG4gICAgICAgIHRoaXMudG9TZXRTZXEoKTtcbiAgICB9LFxuXG4gICAgdG9TdGFjazogZnVuY3Rpb24oKSB7XG4gICAgICAvLyBVc2UgTGF0ZSBCaW5kaW5nIGhlcmUgdG8gc29sdmUgdGhlIGNpcmN1bGFyIGRlcGVuZGVuY3kuXG4gICAgICByZXR1cm4gU3RhY2soaXNLZXllZCh0aGlzKSA/IHRoaXMudmFsdWVTZXEoKSA6IHRoaXMpO1xuICAgIH0sXG5cbiAgICB0b0xpc3Q6IGZ1bmN0aW9uKCkge1xuICAgICAgLy8gVXNlIExhdGUgQmluZGluZyBoZXJlIHRvIHNvbHZlIHRoZSBjaXJjdWxhciBkZXBlbmRlbmN5LlxuICAgICAgcmV0dXJuIExpc3QoaXNLZXllZCh0aGlzKSA/IHRoaXMudmFsdWVTZXEoKSA6IHRoaXMpO1xuICAgIH0sXG5cblxuICAgIC8vICMjIyBDb21tb24gSmF2YVNjcmlwdCBtZXRob2RzIGFuZCBwcm9wZXJ0aWVzXG5cbiAgICB0b1N0cmluZzogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gJ1tJdGVyYWJsZV0nO1xuICAgIH0sXG5cbiAgICBfX3RvU3RyaW5nOiBmdW5jdGlvbihoZWFkLCB0YWlsKSB7XG4gICAgICBpZiAodGhpcy5zaXplID09PSAwKSB7XG4gICAgICAgIHJldHVybiBoZWFkICsgdGFpbDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBoZWFkICsgJyAnICsgdGhpcy50b1NlcSgpLm1hcCh0aGlzLl9fdG9TdHJpbmdNYXBwZXIpLmpvaW4oJywgJykgKyAnICcgKyB0YWlsO1xuICAgIH0sXG5cblxuICAgIC8vICMjIyBFUzYgQ29sbGVjdGlvbiBtZXRob2RzIChFUzYgQXJyYXkgYW5kIE1hcClcblxuICAgIGNvbmNhdDogZnVuY3Rpb24oKSB7dmFyIHZhbHVlcyA9IFNMSUNFJDAuY2FsbChhcmd1bWVudHMsIDApO1xuICAgICAgcmV0dXJuIHJlaWZ5KHRoaXMsIGNvbmNhdEZhY3RvcnkodGhpcywgdmFsdWVzKSk7XG4gICAgfSxcblxuICAgIGNvbnRhaW5zOiBmdW5jdGlvbihzZWFyY2hWYWx1ZSkge1xuICAgICAgcmV0dXJuIHRoaXMuc29tZShmdW5jdGlvbih2YWx1ZSApIHtyZXR1cm4gaXModmFsdWUsIHNlYXJjaFZhbHVlKX0pO1xuICAgIH0sXG5cbiAgICBlbnRyaWVzOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9faXRlcmF0b3IoSVRFUkFURV9FTlRSSUVTKTtcbiAgICB9LFxuXG4gICAgZXZlcnk6IGZ1bmN0aW9uKHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgICAgYXNzZXJ0Tm90SW5maW5pdGUodGhpcy5zaXplKTtcbiAgICAgIHZhciByZXR1cm5WYWx1ZSA9IHRydWU7XG4gICAgICB0aGlzLl9faXRlcmF0ZShmdW5jdGlvbih2LCBrLCBjKSAge1xuICAgICAgICBpZiAoIXByZWRpY2F0ZS5jYWxsKGNvbnRleHQsIHYsIGssIGMpKSB7XG4gICAgICAgICAgcmV0dXJuVmFsdWUgPSBmYWxzZTtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJldHVyblZhbHVlO1xuICAgIH0sXG5cbiAgICBmaWx0ZXI6IGZ1bmN0aW9uKHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgICAgcmV0dXJuIHJlaWZ5KHRoaXMsIGZpbHRlckZhY3RvcnkodGhpcywgcHJlZGljYXRlLCBjb250ZXh0LCB0cnVlKSk7XG4gICAgfSxcblxuICAgIGZpbmQ6IGZ1bmN0aW9uKHByZWRpY2F0ZSwgY29udGV4dCwgbm90U2V0VmFsdWUpIHtcbiAgICAgIHZhciBlbnRyeSA9IHRoaXMuZmluZEVudHJ5KHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgICByZXR1cm4gZW50cnkgPyBlbnRyeVsxXSA6IG5vdFNldFZhbHVlO1xuICAgIH0sXG5cbiAgICBmaW5kRW50cnk6IGZ1bmN0aW9uKHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgICAgdmFyIGZvdW5kO1xuICAgICAgdGhpcy5fX2l0ZXJhdGUoZnVuY3Rpb24odiwgaywgYykgIHtcbiAgICAgICAgaWYgKHByZWRpY2F0ZS5jYWxsKGNvbnRleHQsIHYsIGssIGMpKSB7XG4gICAgICAgICAgZm91bmQgPSBbaywgdl07XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBmb3VuZDtcbiAgICB9LFxuXG4gICAgZmluZExhc3RFbnRyeTogZnVuY3Rpb24ocHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgICByZXR1cm4gdGhpcy50b1NlcSgpLnJldmVyc2UoKS5maW5kRW50cnkocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICB9LFxuXG4gICAgZm9yRWFjaDogZnVuY3Rpb24oc2lkZUVmZmVjdCwgY29udGV4dCkge1xuICAgICAgYXNzZXJ0Tm90SW5maW5pdGUodGhpcy5zaXplKTtcbiAgICAgIHJldHVybiB0aGlzLl9faXRlcmF0ZShjb250ZXh0ID8gc2lkZUVmZmVjdC5iaW5kKGNvbnRleHQpIDogc2lkZUVmZmVjdCk7XG4gICAgfSxcblxuICAgIGpvaW46IGZ1bmN0aW9uKHNlcGFyYXRvcikge1xuICAgICAgYXNzZXJ0Tm90SW5maW5pdGUodGhpcy5zaXplKTtcbiAgICAgIHNlcGFyYXRvciA9IHNlcGFyYXRvciAhPT0gdW5kZWZpbmVkID8gJycgKyBzZXBhcmF0b3IgOiAnLCc7XG4gICAgICB2YXIgam9pbmVkID0gJyc7XG4gICAgICB2YXIgaXNGaXJzdCA9IHRydWU7XG4gICAgICB0aGlzLl9faXRlcmF0ZShmdW5jdGlvbih2ICkge1xuICAgICAgICBpc0ZpcnN0ID8gKGlzRmlyc3QgPSBmYWxzZSkgOiAoam9pbmVkICs9IHNlcGFyYXRvcik7XG4gICAgICAgIGpvaW5lZCArPSB2ICE9PSBudWxsICYmIHYgIT09IHVuZGVmaW5lZCA/IHYudG9TdHJpbmcoKSA6ICcnO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gam9pbmVkO1xuICAgIH0sXG5cbiAgICBrZXlzOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9faXRlcmF0b3IoSVRFUkFURV9LRVlTKTtcbiAgICB9LFxuXG4gICAgbWFwOiBmdW5jdGlvbihtYXBwZXIsIGNvbnRleHQpIHtcbiAgICAgIHJldHVybiByZWlmeSh0aGlzLCBtYXBGYWN0b3J5KHRoaXMsIG1hcHBlciwgY29udGV4dCkpO1xuICAgIH0sXG5cbiAgICByZWR1Y2U6IGZ1bmN0aW9uKHJlZHVjZXIsIGluaXRpYWxSZWR1Y3Rpb24sIGNvbnRleHQpIHtcbiAgICAgIGFzc2VydE5vdEluZmluaXRlKHRoaXMuc2l6ZSk7XG4gICAgICB2YXIgcmVkdWN0aW9uO1xuICAgICAgdmFyIHVzZUZpcnN0O1xuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XG4gICAgICAgIHVzZUZpcnN0ID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlZHVjdGlvbiA9IGluaXRpYWxSZWR1Y3Rpb247XG4gICAgICB9XG4gICAgICB0aGlzLl9faXRlcmF0ZShmdW5jdGlvbih2LCBrLCBjKSAge1xuICAgICAgICBpZiAodXNlRmlyc3QpIHtcbiAgICAgICAgICB1c2VGaXJzdCA9IGZhbHNlO1xuICAgICAgICAgIHJlZHVjdGlvbiA9IHY7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVkdWN0aW9uID0gcmVkdWNlci5jYWxsKGNvbnRleHQsIHJlZHVjdGlvbiwgdiwgaywgYyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlZHVjdGlvbjtcbiAgICB9LFxuXG4gICAgcmVkdWNlUmlnaHQ6IGZ1bmN0aW9uKHJlZHVjZXIsIGluaXRpYWxSZWR1Y3Rpb24sIGNvbnRleHQpIHtcbiAgICAgIHZhciByZXZlcnNlZCA9IHRoaXMudG9LZXllZFNlcSgpLnJldmVyc2UoKTtcbiAgICAgIHJldHVybiByZXZlcnNlZC5yZWR1Y2UuYXBwbHkocmV2ZXJzZWQsIGFyZ3VtZW50cyk7XG4gICAgfSxcblxuICAgIHJldmVyc2U6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHJlaWZ5KHRoaXMsIHJldmVyc2VGYWN0b3J5KHRoaXMsIHRydWUpKTtcbiAgICB9LFxuXG4gICAgc2xpY2U6IGZ1bmN0aW9uKGJlZ2luLCBlbmQpIHtcbiAgICAgIHJldHVybiByZWlmeSh0aGlzLCBzbGljZUZhY3RvcnkodGhpcywgYmVnaW4sIGVuZCwgdHJ1ZSkpO1xuICAgIH0sXG5cbiAgICBzb21lOiBmdW5jdGlvbihwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICAgIHJldHVybiAhdGhpcy5ldmVyeShub3QocHJlZGljYXRlKSwgY29udGV4dCk7XG4gICAgfSxcblxuICAgIHNvcnQ6IGZ1bmN0aW9uKGNvbXBhcmF0b3IpIHtcbiAgICAgIHJldHVybiByZWlmeSh0aGlzLCBzb3J0RmFjdG9yeSh0aGlzLCBjb21wYXJhdG9yKSk7XG4gICAgfSxcblxuICAgIHZhbHVlczogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fX2l0ZXJhdG9yKElURVJBVEVfVkFMVUVTKTtcbiAgICB9LFxuXG5cbiAgICAvLyAjIyMgTW9yZSBzZXF1ZW50aWFsIG1ldGhvZHNcblxuICAgIGJ1dExhc3Q6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuc2xpY2UoMCwgLTEpO1xuICAgIH0sXG5cbiAgICBpc0VtcHR5OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnNpemUgIT09IHVuZGVmaW5lZCA/IHRoaXMuc2l6ZSA9PT0gMCA6ICF0aGlzLnNvbWUoZnVuY3Rpb24oKSAge3JldHVybiB0cnVlfSk7XG4gICAgfSxcblxuICAgIGNvdW50OiBmdW5jdGlvbihwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICAgIHJldHVybiBlbnN1cmVTaXplKFxuICAgICAgICBwcmVkaWNhdGUgPyB0aGlzLnRvU2VxKCkuZmlsdGVyKHByZWRpY2F0ZSwgY29udGV4dCkgOiB0aGlzXG4gICAgICApO1xuICAgIH0sXG5cbiAgICBjb3VudEJ5OiBmdW5jdGlvbihncm91cGVyLCBjb250ZXh0KSB7XG4gICAgICByZXR1cm4gY291bnRCeUZhY3RvcnkodGhpcywgZ3JvdXBlciwgY29udGV4dCk7XG4gICAgfSxcblxuICAgIGVxdWFsczogZnVuY3Rpb24ob3RoZXIpIHtcbiAgICAgIHJldHVybiBkZWVwRXF1YWwodGhpcywgb3RoZXIpO1xuICAgIH0sXG5cbiAgICBlbnRyeVNlcTogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgaXRlcmFibGUgPSB0aGlzO1xuICAgICAgaWYgKGl0ZXJhYmxlLl9jYWNoZSkge1xuICAgICAgICAvLyBXZSBjYWNoZSBhcyBhbiBlbnRyaWVzIGFycmF5LCBzbyB3ZSBjYW4ganVzdCByZXR1cm4gdGhlIGNhY2hlIVxuICAgICAgICByZXR1cm4gbmV3IEFycmF5U2VxKGl0ZXJhYmxlLl9jYWNoZSk7XG4gICAgICB9XG4gICAgICB2YXIgZW50cmllc1NlcXVlbmNlID0gaXRlcmFibGUudG9TZXEoKS5tYXAoZW50cnlNYXBwZXIpLnRvSW5kZXhlZFNlcSgpO1xuICAgICAgZW50cmllc1NlcXVlbmNlLmZyb21FbnRyeVNlcSA9IGZ1bmN0aW9uKCkgIHtyZXR1cm4gaXRlcmFibGUudG9TZXEoKX07XG4gICAgICByZXR1cm4gZW50cmllc1NlcXVlbmNlO1xuICAgIH0sXG5cbiAgICBmaWx0ZXJOb3Q6IGZ1bmN0aW9uKHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgICAgcmV0dXJuIHRoaXMuZmlsdGVyKG5vdChwcmVkaWNhdGUpLCBjb250ZXh0KTtcbiAgICB9LFxuXG4gICAgZmluZExhc3Q6IGZ1bmN0aW9uKHByZWRpY2F0ZSwgY29udGV4dCwgbm90U2V0VmFsdWUpIHtcbiAgICAgIHJldHVybiB0aGlzLnRvS2V5ZWRTZXEoKS5yZXZlcnNlKCkuZmluZChwcmVkaWNhdGUsIGNvbnRleHQsIG5vdFNldFZhbHVlKTtcbiAgICB9LFxuXG4gICAgZmlyc3Q6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZmluZChyZXR1cm5UcnVlKTtcbiAgICB9LFxuXG4gICAgZmxhdE1hcDogZnVuY3Rpb24obWFwcGVyLCBjb250ZXh0KSB7XG4gICAgICByZXR1cm4gcmVpZnkodGhpcywgZmxhdE1hcEZhY3RvcnkodGhpcywgbWFwcGVyLCBjb250ZXh0KSk7XG4gICAgfSxcblxuICAgIGZsYXR0ZW46IGZ1bmN0aW9uKGRlcHRoKSB7XG4gICAgICByZXR1cm4gcmVpZnkodGhpcywgZmxhdHRlbkZhY3RvcnkodGhpcywgZGVwdGgsIHRydWUpKTtcbiAgICB9LFxuXG4gICAgZnJvbUVudHJ5U2VxOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBuZXcgRnJvbUVudHJpZXNTZXF1ZW5jZSh0aGlzKTtcbiAgICB9LFxuXG4gICAgZ2V0OiBmdW5jdGlvbihzZWFyY2hLZXksIG5vdFNldFZhbHVlKSB7XG4gICAgICByZXR1cm4gdGhpcy5maW5kKGZ1bmN0aW9uKF8sIGtleSkgIHtyZXR1cm4gaXMoa2V5LCBzZWFyY2hLZXkpfSwgdW5kZWZpbmVkLCBub3RTZXRWYWx1ZSk7XG4gICAgfSxcblxuICAgIGdldEluOiBmdW5jdGlvbihzZWFyY2hLZXlQYXRoLCBub3RTZXRWYWx1ZSkge1xuICAgICAgdmFyIG5lc3RlZCA9IHRoaXM7XG4gICAgICAvLyBOb3RlOiBpbiBhbiBFUzYgZW52aXJvbm1lbnQsIHdlIHdvdWxkIHByZWZlcjpcbiAgICAgIC8vIGZvciAodmFyIGtleSBvZiBzZWFyY2hLZXlQYXRoKSB7XG4gICAgICB2YXIgaXRlciA9IGZvcmNlSXRlcmF0b3Ioc2VhcmNoS2V5UGF0aCk7XG4gICAgICB2YXIgc3RlcDtcbiAgICAgIHdoaWxlICghKHN0ZXAgPSBpdGVyLm5leHQoKSkuZG9uZSkge1xuICAgICAgICB2YXIga2V5ID0gc3RlcC52YWx1ZTtcbiAgICAgICAgbmVzdGVkID0gbmVzdGVkICYmIG5lc3RlZC5nZXQgPyBuZXN0ZWQuZ2V0KGtleSwgTk9UX1NFVCkgOiBOT1RfU0VUO1xuICAgICAgICBpZiAobmVzdGVkID09PSBOT1RfU0VUKSB7XG4gICAgICAgICAgcmV0dXJuIG5vdFNldFZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbmVzdGVkO1xuICAgIH0sXG5cbiAgICBncm91cEJ5OiBmdW5jdGlvbihncm91cGVyLCBjb250ZXh0KSB7XG4gICAgICByZXR1cm4gZ3JvdXBCeUZhY3RvcnkodGhpcywgZ3JvdXBlciwgY29udGV4dCk7XG4gICAgfSxcblxuICAgIGhhczogZnVuY3Rpb24oc2VhcmNoS2V5KSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXQoc2VhcmNoS2V5LCBOT1RfU0VUKSAhPT0gTk9UX1NFVDtcbiAgICB9LFxuXG4gICAgaGFzSW46IGZ1bmN0aW9uKHNlYXJjaEtleVBhdGgpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldEluKHNlYXJjaEtleVBhdGgsIE5PVF9TRVQpICE9PSBOT1RfU0VUO1xuICAgIH0sXG5cbiAgICBpc1N1YnNldDogZnVuY3Rpb24oaXRlcikge1xuICAgICAgaXRlciA9IHR5cGVvZiBpdGVyLmNvbnRhaW5zID09PSAnZnVuY3Rpb24nID8gaXRlciA6IEl0ZXJhYmxlKGl0ZXIpO1xuICAgICAgcmV0dXJuIHRoaXMuZXZlcnkoZnVuY3Rpb24odmFsdWUgKSB7cmV0dXJuIGl0ZXIuY29udGFpbnModmFsdWUpfSk7XG4gICAgfSxcblxuICAgIGlzU3VwZXJzZXQ6IGZ1bmN0aW9uKGl0ZXIpIHtcbiAgICAgIHJldHVybiBpdGVyLmlzU3Vic2V0KHRoaXMpO1xuICAgIH0sXG5cbiAgICBrZXlTZXE6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMudG9TZXEoKS5tYXAoa2V5TWFwcGVyKS50b0luZGV4ZWRTZXEoKTtcbiAgICB9LFxuXG4gICAgbGFzdDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy50b1NlcSgpLnJldmVyc2UoKS5maXJzdCgpO1xuICAgIH0sXG5cbiAgICBtYXg6IGZ1bmN0aW9uKGNvbXBhcmF0b3IpIHtcbiAgICAgIHJldHVybiBtYXhGYWN0b3J5KHRoaXMsIGNvbXBhcmF0b3IpO1xuICAgIH0sXG5cbiAgICBtYXhCeTogZnVuY3Rpb24obWFwcGVyLCBjb21wYXJhdG9yKSB7XG4gICAgICByZXR1cm4gbWF4RmFjdG9yeSh0aGlzLCBjb21wYXJhdG9yLCBtYXBwZXIpO1xuICAgIH0sXG5cbiAgICBtaW46IGZ1bmN0aW9uKGNvbXBhcmF0b3IpIHtcbiAgICAgIHJldHVybiBtYXhGYWN0b3J5KHRoaXMsIGNvbXBhcmF0b3IgPyBuZWcoY29tcGFyYXRvcikgOiBkZWZhdWx0TmVnQ29tcGFyYXRvcik7XG4gICAgfSxcblxuICAgIG1pbkJ5OiBmdW5jdGlvbihtYXBwZXIsIGNvbXBhcmF0b3IpIHtcbiAgICAgIHJldHVybiBtYXhGYWN0b3J5KHRoaXMsIGNvbXBhcmF0b3IgPyBuZWcoY29tcGFyYXRvcikgOiBkZWZhdWx0TmVnQ29tcGFyYXRvciwgbWFwcGVyKTtcbiAgICB9LFxuXG4gICAgcmVzdDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5zbGljZSgxKTtcbiAgICB9LFxuXG4gICAgc2tpcDogZnVuY3Rpb24oYW1vdW50KSB7XG4gICAgICByZXR1cm4gdGhpcy5zbGljZShNYXRoLm1heCgwLCBhbW91bnQpKTtcbiAgICB9LFxuXG4gICAgc2tpcExhc3Q6IGZ1bmN0aW9uKGFtb3VudCkge1xuICAgICAgcmV0dXJuIHJlaWZ5KHRoaXMsIHRoaXMudG9TZXEoKS5yZXZlcnNlKCkuc2tpcChhbW91bnQpLnJldmVyc2UoKSk7XG4gICAgfSxcblxuICAgIHNraXBXaGlsZTogZnVuY3Rpb24ocHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgICByZXR1cm4gcmVpZnkodGhpcywgc2tpcFdoaWxlRmFjdG9yeSh0aGlzLCBwcmVkaWNhdGUsIGNvbnRleHQsIHRydWUpKTtcbiAgICB9LFxuXG4gICAgc2tpcFVudGlsOiBmdW5jdGlvbihwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICAgIHJldHVybiB0aGlzLnNraXBXaGlsZShub3QocHJlZGljYXRlKSwgY29udGV4dCk7XG4gICAgfSxcblxuICAgIHNvcnRCeTogZnVuY3Rpb24obWFwcGVyLCBjb21wYXJhdG9yKSB7XG4gICAgICByZXR1cm4gcmVpZnkodGhpcywgc29ydEZhY3RvcnkodGhpcywgY29tcGFyYXRvciwgbWFwcGVyKSk7XG4gICAgfSxcblxuICAgIHRha2U6IGZ1bmN0aW9uKGFtb3VudCkge1xuICAgICAgcmV0dXJuIHRoaXMuc2xpY2UoMCwgTWF0aC5tYXgoMCwgYW1vdW50KSk7XG4gICAgfSxcblxuICAgIHRha2VMYXN0OiBmdW5jdGlvbihhbW91bnQpIHtcbiAgICAgIHJldHVybiByZWlmeSh0aGlzLCB0aGlzLnRvU2VxKCkucmV2ZXJzZSgpLnRha2UoYW1vdW50KS5yZXZlcnNlKCkpO1xuICAgIH0sXG5cbiAgICB0YWtlV2hpbGU6IGZ1bmN0aW9uKHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgICAgcmV0dXJuIHJlaWZ5KHRoaXMsIHRha2VXaGlsZUZhY3RvcnkodGhpcywgcHJlZGljYXRlLCBjb250ZXh0KSk7XG4gICAgfSxcblxuICAgIHRha2VVbnRpbDogZnVuY3Rpb24ocHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgICByZXR1cm4gdGhpcy50YWtlV2hpbGUobm90KHByZWRpY2F0ZSksIGNvbnRleHQpO1xuICAgIH0sXG5cbiAgICB2YWx1ZVNlcTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy50b0luZGV4ZWRTZXEoKTtcbiAgICB9LFxuXG5cbiAgICAvLyAjIyMgSGFzaGFibGUgT2JqZWN0XG5cbiAgICBoYXNoQ29kZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fX2hhc2ggfHwgKHRoaXMuX19oYXNoID0gaGFzaEl0ZXJhYmxlKHRoaXMpKTtcbiAgICB9LFxuXG5cbiAgICAvLyAjIyMgSW50ZXJuYWxcblxuICAgIC8vIGFic3RyYWN0IF9faXRlcmF0ZShmbiwgcmV2ZXJzZSlcblxuICAgIC8vIGFic3RyYWN0IF9faXRlcmF0b3IodHlwZSwgcmV2ZXJzZSlcbiAgfSk7XG5cbiAgLy8gdmFyIElTX0lURVJBQkxFX1NFTlRJTkVMID0gJ0BAX19JTU1VVEFCTEVfSVRFUkFCTEVfX0BAJztcbiAgLy8gdmFyIElTX0tFWUVEX1NFTlRJTkVMID0gJ0BAX19JTU1VVEFCTEVfS0VZRURfX0BAJztcbiAgLy8gdmFyIElTX0lOREVYRURfU0VOVElORUwgPSAnQEBfX0lNTVVUQUJMRV9JTkRFWEVEX19AQCc7XG4gIC8vIHZhciBJU19PUkRFUkVEX1NFTlRJTkVMID0gJ0BAX19JTU1VVEFCTEVfT1JERVJFRF9fQEAnO1xuXG4gIHZhciBJdGVyYWJsZVByb3RvdHlwZSA9IEl0ZXJhYmxlLnByb3RvdHlwZTtcbiAgSXRlcmFibGVQcm90b3R5cGVbSVNfSVRFUkFCTEVfU0VOVElORUxdID0gdHJ1ZTtcbiAgSXRlcmFibGVQcm90b3R5cGVbSVRFUkFUT1JfU1lNQk9MXSA9IEl0ZXJhYmxlUHJvdG90eXBlLnZhbHVlcztcbiAgSXRlcmFibGVQcm90b3R5cGUuX190b0pTID0gSXRlcmFibGVQcm90b3R5cGUudG9BcnJheTtcbiAgSXRlcmFibGVQcm90b3R5cGUuX190b1N0cmluZ01hcHBlciA9IHF1b3RlU3RyaW5nO1xuICBJdGVyYWJsZVByb3RvdHlwZS5pbnNwZWN0ID1cbiAgSXRlcmFibGVQcm90b3R5cGUudG9Tb3VyY2UgPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMudG9TdHJpbmcoKTsgfTtcbiAgSXRlcmFibGVQcm90b3R5cGUuY2hhaW4gPSBJdGVyYWJsZVByb3RvdHlwZS5mbGF0TWFwO1xuXG4gIC8vIFRlbXBvcmFyeSB3YXJuaW5nIGFib3V0IHVzaW5nIGxlbmd0aFxuICAoZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoSXRlcmFibGVQcm90b3R5cGUsICdsZW5ndGgnLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmICghSXRlcmFibGUubm9MZW5ndGhXYXJuaW5nKSB7XG4gICAgICAgICAgICB2YXIgc3RhY2s7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgIHN0YWNrID0gZXJyb3Iuc3RhY2s7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc3RhY2suaW5kZXhPZignX3dyYXBPYmplY3QnKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgY29uc29sZSAmJiBjb25zb2xlLndhcm4gJiYgY29uc29sZS53YXJuKFxuICAgICAgICAgICAgICAgICdpdGVyYWJsZS5sZW5ndGggaGFzIGJlZW4gZGVwcmVjYXRlZCwgJytcbiAgICAgICAgICAgICAgICAndXNlIGl0ZXJhYmxlLnNpemUgb3IgaXRlcmFibGUuY291bnQoKS4gJytcbiAgICAgICAgICAgICAgICAnVGhpcyB3YXJuaW5nIHdpbGwgYmVjb21lIGEgc2lsZW50IGVycm9yIGluIGEgZnV0dXJlIHZlcnNpb24uICcgK1xuICAgICAgICAgICAgICAgIHN0YWNrXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLnNpemU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlKSB7fVxuICB9KSgpO1xuXG5cblxuICBtaXhpbihLZXllZEl0ZXJhYmxlLCB7XG5cbiAgICAvLyAjIyMgTW9yZSBzZXF1ZW50aWFsIG1ldGhvZHNcblxuICAgIGZsaXA6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHJlaWZ5KHRoaXMsIGZsaXBGYWN0b3J5KHRoaXMpKTtcbiAgICB9LFxuXG4gICAgZmluZEtleTogZnVuY3Rpb24ocHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgICB2YXIgZW50cnkgPSB0aGlzLmZpbmRFbnRyeShwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgICAgcmV0dXJuIGVudHJ5ICYmIGVudHJ5WzBdO1xuICAgIH0sXG5cbiAgICBmaW5kTGFzdEtleTogZnVuY3Rpb24ocHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgICByZXR1cm4gdGhpcy50b1NlcSgpLnJldmVyc2UoKS5maW5kS2V5KHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgfSxcblxuICAgIGtleU9mOiBmdW5jdGlvbihzZWFyY2hWYWx1ZSkge1xuICAgICAgcmV0dXJuIHRoaXMuZmluZEtleShmdW5jdGlvbih2YWx1ZSApIHtyZXR1cm4gaXModmFsdWUsIHNlYXJjaFZhbHVlKX0pO1xuICAgIH0sXG5cbiAgICBsYXN0S2V5T2Y6IGZ1bmN0aW9uKHNlYXJjaFZhbHVlKSB7XG4gICAgICByZXR1cm4gdGhpcy5maW5kTGFzdEtleShmdW5jdGlvbih2YWx1ZSApIHtyZXR1cm4gaXModmFsdWUsIHNlYXJjaFZhbHVlKX0pO1xuICAgIH0sXG5cbiAgICBtYXBFbnRyaWVzOiBmdW5jdGlvbihtYXBwZXIsIGNvbnRleHQpIHt2YXIgdGhpcyQwID0gdGhpcztcbiAgICAgIHZhciBpdGVyYXRpb25zID0gMDtcbiAgICAgIHJldHVybiByZWlmeSh0aGlzLFxuICAgICAgICB0aGlzLnRvU2VxKCkubWFwKFxuICAgICAgICAgIGZ1bmN0aW9uKHYsIGspICB7cmV0dXJuIG1hcHBlci5jYWxsKGNvbnRleHQsIFtrLCB2XSwgaXRlcmF0aW9ucysrLCB0aGlzJDApfVxuICAgICAgICApLmZyb21FbnRyeVNlcSgpXG4gICAgICApO1xuICAgIH0sXG5cbiAgICBtYXBLZXlzOiBmdW5jdGlvbihtYXBwZXIsIGNvbnRleHQpIHt2YXIgdGhpcyQwID0gdGhpcztcbiAgICAgIHJldHVybiByZWlmeSh0aGlzLFxuICAgICAgICB0aGlzLnRvU2VxKCkuZmxpcCgpLm1hcChcbiAgICAgICAgICBmdW5jdGlvbihrLCB2KSAge3JldHVybiBtYXBwZXIuY2FsbChjb250ZXh0LCBrLCB2LCB0aGlzJDApfVxuICAgICAgICApLmZsaXAoKVxuICAgICAgKTtcbiAgICB9LFxuXG4gIH0pO1xuXG4gIHZhciBLZXllZEl0ZXJhYmxlUHJvdG90eXBlID0gS2V5ZWRJdGVyYWJsZS5wcm90b3R5cGU7XG4gIEtleWVkSXRlcmFibGVQcm90b3R5cGVbSVNfS0VZRURfU0VOVElORUxdID0gdHJ1ZTtcbiAgS2V5ZWRJdGVyYWJsZVByb3RvdHlwZVtJVEVSQVRPUl9TWU1CT0xdID0gSXRlcmFibGVQcm90b3R5cGUuZW50cmllcztcbiAgS2V5ZWRJdGVyYWJsZVByb3RvdHlwZS5fX3RvSlMgPSBJdGVyYWJsZVByb3RvdHlwZS50b09iamVjdDtcbiAgS2V5ZWRJdGVyYWJsZVByb3RvdHlwZS5fX3RvU3RyaW5nTWFwcGVyID0gZnVuY3Rpb24odiwgaykgIHtyZXR1cm4gayArICc6ICcgKyBxdW90ZVN0cmluZyh2KX07XG5cblxuXG4gIG1peGluKEluZGV4ZWRJdGVyYWJsZSwge1xuXG4gICAgLy8gIyMjIENvbnZlcnNpb24gdG8gb3RoZXIgdHlwZXNcblxuICAgIHRvS2V5ZWRTZXE6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIG5ldyBUb0tleWVkU2VxdWVuY2UodGhpcywgZmFsc2UpO1xuICAgIH0sXG5cblxuICAgIC8vICMjIyBFUzYgQ29sbGVjdGlvbiBtZXRob2RzIChFUzYgQXJyYXkgYW5kIE1hcClcblxuICAgIGZpbHRlcjogZnVuY3Rpb24ocHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgICByZXR1cm4gcmVpZnkodGhpcywgZmlsdGVyRmFjdG9yeSh0aGlzLCBwcmVkaWNhdGUsIGNvbnRleHQsIGZhbHNlKSk7XG4gICAgfSxcblxuICAgIGZpbmRJbmRleDogZnVuY3Rpb24ocHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgICB2YXIgZW50cnkgPSB0aGlzLmZpbmRFbnRyeShwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgICAgcmV0dXJuIGVudHJ5ID8gZW50cnlbMF0gOiAtMTtcbiAgICB9LFxuXG4gICAgaW5kZXhPZjogZnVuY3Rpb24oc2VhcmNoVmFsdWUpIHtcbiAgICAgIHZhciBrZXkgPSB0aGlzLnRvS2V5ZWRTZXEoKS5rZXlPZihzZWFyY2hWYWx1ZSk7XG4gICAgICByZXR1cm4ga2V5ID09PSB1bmRlZmluZWQgPyAtMSA6IGtleTtcbiAgICB9LFxuXG4gICAgbGFzdEluZGV4T2Y6IGZ1bmN0aW9uKHNlYXJjaFZhbHVlKSB7XG4gICAgICByZXR1cm4gdGhpcy50b1NlcSgpLnJldmVyc2UoKS5pbmRleE9mKHNlYXJjaFZhbHVlKTtcbiAgICB9LFxuXG4gICAgcmV2ZXJzZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gcmVpZnkodGhpcywgcmV2ZXJzZUZhY3RvcnkodGhpcywgZmFsc2UpKTtcbiAgICB9LFxuXG4gICAgc2xpY2U6IGZ1bmN0aW9uKGJlZ2luLCBlbmQpIHtcbiAgICAgIHJldHVybiByZWlmeSh0aGlzLCBzbGljZUZhY3RvcnkodGhpcywgYmVnaW4sIGVuZCwgZmFsc2UpKTtcbiAgICB9LFxuXG4gICAgc3BsaWNlOiBmdW5jdGlvbihpbmRleCwgcmVtb3ZlTnVtIC8qLCAuLi52YWx1ZXMqLykge1xuICAgICAgdmFyIG51bUFyZ3MgPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgICAgcmVtb3ZlTnVtID0gTWF0aC5tYXgocmVtb3ZlTnVtIHwgMCwgMCk7XG4gICAgICBpZiAobnVtQXJncyA9PT0gMCB8fCAobnVtQXJncyA9PT0gMiAmJiAhcmVtb3ZlTnVtKSkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICAgIGluZGV4ID0gcmVzb2x2ZUJlZ2luKGluZGV4LCB0aGlzLnNpemUpO1xuICAgICAgdmFyIHNwbGljZWQgPSB0aGlzLnNsaWNlKDAsIGluZGV4KTtcbiAgICAgIHJldHVybiByZWlmeShcbiAgICAgICAgdGhpcyxcbiAgICAgICAgbnVtQXJncyA9PT0gMSA/XG4gICAgICAgICAgc3BsaWNlZCA6XG4gICAgICAgICAgc3BsaWNlZC5jb25jYXQoYXJyQ29weShhcmd1bWVudHMsIDIpLCB0aGlzLnNsaWNlKGluZGV4ICsgcmVtb3ZlTnVtKSlcbiAgICAgICk7XG4gICAgfSxcblxuXG4gICAgLy8gIyMjIE1vcmUgY29sbGVjdGlvbiBtZXRob2RzXG5cbiAgICBmaW5kTGFzdEluZGV4OiBmdW5jdGlvbihwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICAgIHZhciBrZXkgPSB0aGlzLnRvS2V5ZWRTZXEoKS5maW5kTGFzdEtleShwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgICAgcmV0dXJuIGtleSA9PT0gdW5kZWZpbmVkID8gLTEgOiBrZXk7XG4gICAgfSxcblxuICAgIGZpcnN0OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldCgwKTtcbiAgICB9LFxuXG4gICAgZmxhdHRlbjogZnVuY3Rpb24oZGVwdGgpIHtcbiAgICAgIHJldHVybiByZWlmeSh0aGlzLCBmbGF0dGVuRmFjdG9yeSh0aGlzLCBkZXB0aCwgZmFsc2UpKTtcbiAgICB9LFxuXG4gICAgZ2V0OiBmdW5jdGlvbihpbmRleCwgbm90U2V0VmFsdWUpIHtcbiAgICAgIGluZGV4ID0gd3JhcEluZGV4KHRoaXMsIGluZGV4KTtcbiAgICAgIHJldHVybiAoaW5kZXggPCAwIHx8ICh0aGlzLnNpemUgPT09IEluZmluaXR5IHx8XG4gICAgICAgICAgKHRoaXMuc2l6ZSAhPT0gdW5kZWZpbmVkICYmIGluZGV4ID4gdGhpcy5zaXplKSkpID9cbiAgICAgICAgbm90U2V0VmFsdWUgOlxuICAgICAgICB0aGlzLmZpbmQoZnVuY3Rpb24oXywga2V5KSAge3JldHVybiBrZXkgPT09IGluZGV4fSwgdW5kZWZpbmVkLCBub3RTZXRWYWx1ZSk7XG4gICAgfSxcblxuICAgIGhhczogZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgIGluZGV4ID0gd3JhcEluZGV4KHRoaXMsIGluZGV4KTtcbiAgICAgIHJldHVybiBpbmRleCA+PSAwICYmICh0aGlzLnNpemUgIT09IHVuZGVmaW5lZCA/XG4gICAgICAgIHRoaXMuc2l6ZSA9PT0gSW5maW5pdHkgfHwgaW5kZXggPCB0aGlzLnNpemUgOlxuICAgICAgICB0aGlzLmluZGV4T2YoaW5kZXgpICE9PSAtMVxuICAgICAgKTtcbiAgICB9LFxuXG4gICAgaW50ZXJwb3NlOiBmdW5jdGlvbihzZXBhcmF0b3IpIHtcbiAgICAgIHJldHVybiByZWlmeSh0aGlzLCBpbnRlcnBvc2VGYWN0b3J5KHRoaXMsIHNlcGFyYXRvcikpO1xuICAgIH0sXG5cbiAgICBpbnRlcmxlYXZlOiBmdW5jdGlvbigvKi4uLml0ZXJhYmxlcyovKSB7XG4gICAgICB2YXIgaXRlcmFibGVzID0gW3RoaXNdLmNvbmNhdChhcnJDb3B5KGFyZ3VtZW50cykpO1xuICAgICAgdmFyIHppcHBlZCA9IHppcFdpdGhGYWN0b3J5KHRoaXMudG9TZXEoKSwgSW5kZXhlZFNlcS5vZiwgaXRlcmFibGVzKTtcbiAgICAgIHZhciBpbnRlcmxlYXZlZCA9IHppcHBlZC5mbGF0dGVuKHRydWUpO1xuICAgICAgaWYgKHppcHBlZC5zaXplKSB7XG4gICAgICAgIGludGVybGVhdmVkLnNpemUgPSB6aXBwZWQuc2l6ZSAqIGl0ZXJhYmxlcy5sZW5ndGg7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVpZnkodGhpcywgaW50ZXJsZWF2ZWQpO1xuICAgIH0sXG5cbiAgICBsYXN0OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldCgtMSk7XG4gICAgfSxcblxuICAgIHNraXBXaGlsZTogZnVuY3Rpb24ocHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgICByZXR1cm4gcmVpZnkodGhpcywgc2tpcFdoaWxlRmFjdG9yeSh0aGlzLCBwcmVkaWNhdGUsIGNvbnRleHQsIGZhbHNlKSk7XG4gICAgfSxcblxuICAgIHppcDogZnVuY3Rpb24oLyosIC4uLml0ZXJhYmxlcyAqLykge1xuICAgICAgdmFyIGl0ZXJhYmxlcyA9IFt0aGlzXS5jb25jYXQoYXJyQ29weShhcmd1bWVudHMpKTtcbiAgICAgIHJldHVybiByZWlmeSh0aGlzLCB6aXBXaXRoRmFjdG9yeSh0aGlzLCBkZWZhdWx0WmlwcGVyLCBpdGVyYWJsZXMpKTtcbiAgICB9LFxuXG4gICAgemlwV2l0aDogZnVuY3Rpb24oemlwcGVyLyosIC4uLml0ZXJhYmxlcyAqLykge1xuICAgICAgdmFyIGl0ZXJhYmxlcyA9IGFyckNvcHkoYXJndW1lbnRzKTtcbiAgICAgIGl0ZXJhYmxlc1swXSA9IHRoaXM7XG4gICAgICByZXR1cm4gcmVpZnkodGhpcywgemlwV2l0aEZhY3RvcnkodGhpcywgemlwcGVyLCBpdGVyYWJsZXMpKTtcbiAgICB9LFxuXG4gIH0pO1xuXG4gIEluZGV4ZWRJdGVyYWJsZS5wcm90b3R5cGVbSVNfSU5ERVhFRF9TRU5USU5FTF0gPSB0cnVlO1xuICBJbmRleGVkSXRlcmFibGUucHJvdG90eXBlW0lTX09SREVSRURfU0VOVElORUxdID0gdHJ1ZTtcblxuXG5cbiAgbWl4aW4oU2V0SXRlcmFibGUsIHtcblxuICAgIC8vICMjIyBFUzYgQ29sbGVjdGlvbiBtZXRob2RzIChFUzYgQXJyYXkgYW5kIE1hcClcblxuICAgIGdldDogZnVuY3Rpb24odmFsdWUsIG5vdFNldFZhbHVlKSB7XG4gICAgICByZXR1cm4gdGhpcy5oYXModmFsdWUpID8gdmFsdWUgOiBub3RTZXRWYWx1ZTtcbiAgICB9LFxuXG4gICAgY29udGFpbnM6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdGhpcy5oYXModmFsdWUpO1xuICAgIH0sXG5cblxuICAgIC8vICMjIyBNb3JlIHNlcXVlbnRpYWwgbWV0aG9kc1xuXG4gICAga2V5U2VxOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnZhbHVlU2VxKCk7XG4gICAgfSxcblxuICB9KTtcblxuICBTZXRJdGVyYWJsZS5wcm90b3R5cGUuaGFzID0gSXRlcmFibGVQcm90b3R5cGUuY29udGFpbnM7XG5cblxuICAvLyBNaXhpbiBzdWJjbGFzc2VzXG5cbiAgbWl4aW4oS2V5ZWRTZXEsIEtleWVkSXRlcmFibGUucHJvdG90eXBlKTtcbiAgbWl4aW4oSW5kZXhlZFNlcSwgSW5kZXhlZEl0ZXJhYmxlLnByb3RvdHlwZSk7XG4gIG1peGluKFNldFNlcSwgU2V0SXRlcmFibGUucHJvdG90eXBlKTtcblxuICBtaXhpbihLZXllZENvbGxlY3Rpb24sIEtleWVkSXRlcmFibGUucHJvdG90eXBlKTtcbiAgbWl4aW4oSW5kZXhlZENvbGxlY3Rpb24sIEluZGV4ZWRJdGVyYWJsZS5wcm90b3R5cGUpO1xuICBtaXhpbihTZXRDb2xsZWN0aW9uLCBTZXRJdGVyYWJsZS5wcm90b3R5cGUpO1xuXG5cbiAgLy8gI3ByYWdtYSBIZWxwZXIgZnVuY3Rpb25zXG5cbiAgZnVuY3Rpb24ga2V5TWFwcGVyKHYsIGspIHtcbiAgICByZXR1cm4gaztcbiAgfVxuXG4gIGZ1bmN0aW9uIGVudHJ5TWFwcGVyKHYsIGspIHtcbiAgICByZXR1cm4gW2ssIHZdO1xuICB9XG5cbiAgZnVuY3Rpb24gbm90KHByZWRpY2F0ZSkge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAhcHJlZGljYXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gbmVnKHByZWRpY2F0ZSkge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAtcHJlZGljYXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcXVvdGVTdHJpbmcodmFsdWUpIHtcbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyA/IEpTT04uc3RyaW5naWZ5KHZhbHVlKSA6IHZhbHVlO1xuICB9XG5cbiAgZnVuY3Rpb24gZGVmYXVsdFppcHBlcigpIHtcbiAgICByZXR1cm4gYXJyQ29weShhcmd1bWVudHMpO1xuICB9XG5cbiAgZnVuY3Rpb24gZGVmYXVsdE5lZ0NvbXBhcmF0b3IoYSwgYikge1xuICAgIHJldHVybiBhIDwgYiA/IDEgOiBhID4gYiA/IC0xIDogMDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhc2hJdGVyYWJsZShpdGVyYWJsZSkge1xuICAgIGlmIChpdGVyYWJsZS5zaXplID09PSBJbmZpbml0eSkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICAgIHZhciBvcmRlcmVkID0gaXNPcmRlcmVkKGl0ZXJhYmxlKTtcbiAgICB2YXIga2V5ZWQgPSBpc0tleWVkKGl0ZXJhYmxlKTtcbiAgICB2YXIgaCA9IG9yZGVyZWQgPyAxIDogMDtcbiAgICB2YXIgc2l6ZSA9IGl0ZXJhYmxlLl9faXRlcmF0ZShcbiAgICAgIGtleWVkID9cbiAgICAgICAgb3JkZXJlZCA/XG4gICAgICAgICAgZnVuY3Rpb24odiwgaykgIHsgaCA9IDMxICogaCArIGhhc2hNZXJnZShoYXNoKHYpLCBoYXNoKGspKSB8IDA7IH0gOlxuICAgICAgICAgIGZ1bmN0aW9uKHYsIGspICB7IGggPSBoICsgaGFzaE1lcmdlKGhhc2godiksIGhhc2goaykpIHwgMDsgfSA6XG4gICAgICAgIG9yZGVyZWQgP1xuICAgICAgICAgIGZ1bmN0aW9uKHYgKSB7IGggPSAzMSAqIGggKyBoYXNoKHYpIHwgMDsgfSA6XG4gICAgICAgICAgZnVuY3Rpb24odiApIHsgaCA9IGggKyBoYXNoKHYpIHwgMDsgfVxuICAgICk7XG4gICAgcmV0dXJuIG11cm11ckhhc2hPZlNpemUoc2l6ZSwgaCk7XG4gIH1cblxuICBmdW5jdGlvbiBtdXJtdXJIYXNoT2ZTaXplKHNpemUsIGgpIHtcbiAgICBoID0gc3JjX01hdGhfX2ltdWwoaCwgMHhDQzlFMkQ1MSk7XG4gICAgaCA9IHNyY19NYXRoX19pbXVsKGggPDwgMTUgfCBoID4+PiAtMTUsIDB4MUI4NzM1OTMpO1xuICAgIGggPSBzcmNfTWF0aF9faW11bChoIDw8IDEzIHwgaCA+Pj4gLTEzLCA1KTtcbiAgICBoID0gKGggKyAweEU2NTQ2QjY0IHwgMCkgXiBzaXplO1xuICAgIGggPSBzcmNfTWF0aF9faW11bChoIF4gaCA+Pj4gMTYsIDB4ODVFQkNBNkIpO1xuICAgIGggPSBzcmNfTWF0aF9faW11bChoIF4gaCA+Pj4gMTMsIDB4QzJCMkFFMzUpO1xuICAgIGggPSBzbWkoaCBeIGggPj4+IDE2KTtcbiAgICByZXR1cm4gaDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhc2hNZXJnZShhLCBiKSB7XG4gICAgcmV0dXJuIGEgXiBiICsgMHg5RTM3NzlCOSArIChhIDw8IDYpICsgKGEgPj4gMikgfCAwOyAvLyBpbnRcbiAgfVxuXG4gIHZhciBJbW11dGFibGUgPSB7XG5cbiAgICBJdGVyYWJsZTogSXRlcmFibGUsXG5cbiAgICBTZXE6IFNlcSxcbiAgICBDb2xsZWN0aW9uOiBDb2xsZWN0aW9uLFxuICAgIE1hcDogc3JjX01hcF9fTWFwLFxuICAgIE9yZGVyZWRNYXA6IE9yZGVyZWRNYXAsXG4gICAgTGlzdDogTGlzdCxcbiAgICBTdGFjazogU3RhY2ssXG4gICAgU2V0OiBzcmNfU2V0X19TZXQsXG4gICAgT3JkZXJlZFNldDogT3JkZXJlZFNldCxcblxuICAgIFJlY29yZDogUmVjb3JkLFxuICAgIFJhbmdlOiBSYW5nZSxcbiAgICBSZXBlYXQ6IFJlcGVhdCxcblxuICAgIGlzOiBpcyxcbiAgICBmcm9tSlM6IGZyb21KUyxcblxuICB9O1xuXG4gIHJldHVybiBJbW11dGFibGU7XG5cbn0pKTsiLCIvKipcbiAqIENvcHlyaWdodCAyMDEzLTIwMTQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgaW52YXJpYW50XG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogVXNlIGludmFyaWFudCgpIHRvIGFzc2VydCBzdGF0ZSB3aGljaCB5b3VyIHByb2dyYW0gYXNzdW1lcyB0byBiZSB0cnVlLlxuICpcbiAqIFByb3ZpZGUgc3ByaW50Zi1zdHlsZSBmb3JtYXQgKG9ubHkgJXMgaXMgc3VwcG9ydGVkKSBhbmQgYXJndW1lbnRzXG4gKiB0byBwcm92aWRlIGluZm9ybWF0aW9uIGFib3V0IHdoYXQgYnJva2UgYW5kIHdoYXQgeW91IHdlcmVcbiAqIGV4cGVjdGluZy5cbiAqXG4gKiBUaGUgaW52YXJpYW50IG1lc3NhZ2Ugd2lsbCBiZSBzdHJpcHBlZCBpbiBwcm9kdWN0aW9uLCBidXQgdGhlIGludmFyaWFudFxuICogd2lsbCByZW1haW4gdG8gZW5zdXJlIGxvZ2ljIGRvZXMgbm90IGRpZmZlciBpbiBwcm9kdWN0aW9uLlxuICovXG5cbnZhciBpbnZhcmlhbnQgPSBmdW5jdGlvbihjb25kaXRpb24sIGZvcm1hdCwgYSwgYiwgYywgZCwgZSwgZikge1xuICBpZiAoXCJwcm9kdWN0aW9uXCIgIT09IHByb2Nlc3MuZW52Lk5PREVfRU5WKSB7XG4gICAgaWYgKGZvcm1hdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFyaWFudCByZXF1aXJlcyBhbiBlcnJvciBtZXNzYWdlIGFyZ3VtZW50Jyk7XG4gICAgfVxuICB9XG5cbiAgaWYgKCFjb25kaXRpb24pIHtcbiAgICB2YXIgZXJyb3I7XG4gICAgaWYgKGZvcm1hdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBlcnJvciA9IG5ldyBFcnJvcihcbiAgICAgICAgJ01pbmlmaWVkIGV4Y2VwdGlvbiBvY2N1cnJlZDsgdXNlIHRoZSBub24tbWluaWZpZWQgZGV2IGVudmlyb25tZW50ICcgK1xuICAgICAgICAnZm9yIHRoZSBmdWxsIGVycm9yIG1lc3NhZ2UgYW5kIGFkZGl0aW9uYWwgaGVscGZ1bCB3YXJuaW5ncy4nXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgYXJncyA9IFthLCBiLCBjLCBkLCBlLCBmXTtcbiAgICAgIHZhciBhcmdJbmRleCA9IDA7XG4gICAgICBlcnJvciA9IG5ldyBFcnJvcihcbiAgICAgICAgJ0ludmFyaWFudCBWaW9sYXRpb246ICcgK1xuICAgICAgICBmb3JtYXQucmVwbGFjZSgvJXMvZywgZnVuY3Rpb24oKSB7IHJldHVybiBhcmdzW2FyZ0luZGV4KytdOyB9KVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBlcnJvci5mcmFtZXNUb1BvcCA9IDE7IC8vIHdlIGRvbid0IGNhcmUgYWJvdXQgaW52YXJpYW50J3Mgb3duIGZyYW1lXG4gICAgdGhyb3cgZXJyb3I7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gaW52YXJpYW50O1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy0yMDE0LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIGtleU1pcnJvclxuICogQHR5cGVjaGVja3Mgc3RhdGljLW9ubHlcbiAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGludmFyaWFudCA9IHJlcXVpcmUoXCIuL2ludmFyaWFudFwiKTtcblxuLyoqXG4gKiBDb25zdHJ1Y3RzIGFuIGVudW1lcmF0aW9uIHdpdGgga2V5cyBlcXVhbCB0byB0aGVpciB2YWx1ZS5cbiAqXG4gKiBGb3IgZXhhbXBsZTpcbiAqXG4gKiAgIHZhciBDT0xPUlMgPSBrZXlNaXJyb3Ioe2JsdWU6IG51bGwsIHJlZDogbnVsbH0pO1xuICogICB2YXIgbXlDb2xvciA9IENPTE9SUy5ibHVlO1xuICogICB2YXIgaXNDb2xvclZhbGlkID0gISFDT0xPUlNbbXlDb2xvcl07XG4gKlxuICogVGhlIGxhc3QgbGluZSBjb3VsZCBub3QgYmUgcGVyZm9ybWVkIGlmIHRoZSB2YWx1ZXMgb2YgdGhlIGdlbmVyYXRlZCBlbnVtIHdlcmVcbiAqIG5vdCBlcXVhbCB0byB0aGVpciBrZXlzLlxuICpcbiAqICAgSW5wdXQ6ICB7a2V5MTogdmFsMSwga2V5MjogdmFsMn1cbiAqICAgT3V0cHV0OiB7a2V5MToga2V5MSwga2V5Mjoga2V5Mn1cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtvYmplY3R9XG4gKi9cbnZhciBrZXlNaXJyb3IgPSBmdW5jdGlvbihvYmopIHtcbiAgdmFyIHJldCA9IHt9O1xuICB2YXIga2V5O1xuICAoXCJwcm9kdWN0aW9uXCIgIT09IHByb2Nlc3MuZW52Lk5PREVfRU5WID8gaW52YXJpYW50KFxuICAgIG9iaiBpbnN0YW5jZW9mIE9iamVjdCAmJiAhQXJyYXkuaXNBcnJheShvYmopLFxuICAgICdrZXlNaXJyb3IoLi4uKTogQXJndW1lbnQgbXVzdCBiZSBhbiBvYmplY3QuJ1xuICApIDogaW52YXJpYW50KG9iaiBpbnN0YW5jZW9mIE9iamVjdCAmJiAhQXJyYXkuaXNBcnJheShvYmopKSk7XG4gIGZvciAoa2V5IGluIG9iaikge1xuICAgIGlmICghb2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICByZXRba2V5XSA9IGtleTtcbiAgfVxuICByZXR1cm4gcmV0O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBrZXlNaXJyb3I7XG4iLCIvKiogQG1vZHVsZSBhY3Rpb25zL2Jhc2UgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xudmFyIERpc3BhdGNoZXIgPSByZXF1aXJlKCcuLi9kaXNwYXRjaGVyJyk7XG5cbnZhciBhcGlTdWJzY3JpcHRpb25TcnZjID0gcmVxdWlyZSgnLi4vc2VydmljZXMvaW5kZXgnKS5hcGlTdWJzY3JpcHRpb25zO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgQWN0aW9ucyB7XG5cbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHRoaXMuX2Rpc3BhdGNoZXIgPSBEaXNwYXRjaGVyO1xuICB9XG5cbiAgLyoqXG4gICAgKiBTdGFuZGFyZCBEaXNwYXRjaGVyIHBheWxvYWRcbiAgICAqXG4gICAgKiBAcHJvcGVydHkge2ludGVnZXJ9IGFjdGlvblR5cGUgLSBhY3Rpb24gdHlwZSBmcm9tIGNvbnN0YW50cy9hY3Rpb25zXG4gICAgKiBAcHJvcGVydHkge2ludGVnZXJ9IHN5bmNTdGF0ZSAtIHN5bmMgc3RhdGUgd2l0aCBzZXJ2ZXIgZnJvbSBjb250YW50cy9zdGF0ZXNcbiAgICAqIEBwcm9wZXJ0eSB7b2JqZWN0fSBkYXRhIC0gcGF5bG9hZCBkYXRhICh0byBiZSBpbnRlcnByZXRlZCBiYXNlZCBvbiBhY3Rpb25UeXBlICYgc3RhdGUpXG4gICAgKlxuICAgICovXG4gIF9tYWtlUGF5bG9hZCAoYWN0aW9uLCBzeW5jU3RhdGUsIGRhdGEpIHtcbiAgICByZXR1cm4ge1xuICAgICAgYWN0aW9uVHlwZTogYWN0aW9uLFxuICAgICAgc3luY1N0YXRlOiBzeW5jU3RhdGUsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZSBsaXN0IG9mIHBoeXNpY2FsIGNoYW5uZWxzXG4gICAqIEBtZXRob2QgX2dldFBoeXNpY2FsQ2hhbm5lbHNcbiAgICogQHBhcmFtIHthcnJheX0gY2hhbm5lbHNcbiAgICogQHBhcmFtIHthcnJheX0gbWV0aG9kc1xuICAgKi9cbiAgX2dldFBoeXNpY2FsQ2hhbm5lbHMgKGNoYW5uZWxzLCBtZXRob2RzKSB7XG4gICAgcmV0dXJuIF8uZmxhdHRlbihjaGFubmVscy5tYXAoZnVuY3Rpb24gKGNoYW5uZWwpIHtcbiAgICAgIHJldHVybiBtZXRob2RzLm1hcChmdW5jdGlvbiAobWV0aG9kKSB7XG4gICAgICAgIHJldHVybiBtZXRob2QgKyAnICcgKyBjaGFubmVsO1xuICAgICAgfSk7XG4gICAgfSkpO1xuICB9XG5cbiAgLyoqIFN1YnNjcmliZSB0byBjaGFubmVsLlxuICAgICogQG1ldGhvZCBfc3Vic2NyaWJlXG4gICAgKiBAcGFyYW0ge3N0cmluZ3xhcnJheX0gY2hhbm5lbHMgLSBTdHJpbmcgb3IgYXJyYXkgb2YgY2hhbm5lbCBuYW1lcy5cbiAgICAqIEBwYXJhbSB7YXJyYXl9IG1ldGhvZHNcbiAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGhhbmRsZXIgLSBIYW5kbGVyIHRvIGJlIGNhbGxlZCB3aGVuIGV2ZW50IG9uIGNoYW5uZWwgb2NjdXJzXG4gICAgKi9cbiAgX3N1YnNjcmliZSAoY2hhbm5lbHMsIG1ldGhvZHMsIGhhbmRsZXIsIG9wdGlvbnMpIHtcblxuICAgIGlmIChfLmlzU3RyaW5nKGNoYW5uZWxzKSkge1xuICAgICAgY2hhbm5lbHMgPSBbY2hhbm5lbHNdO1xuICAgIH1cblxuICAgIGlmICghXy5pc0FycmF5KG1ldGhvZHMpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ21ldGhvZHMgYXJndW1lbnQgbXVzdCBiZSBhcnJheSBvZiBIVFRQIG1ldGhvZHMnKTtcbiAgICB9XG5cbiAgICBfLmVhY2godGhpcy5fZ2V0UGh5c2ljYWxDaGFubmVscyhjaGFubmVscywgbWV0aG9kcyksIGZ1bmN0aW9uIChjaGFubmVsKSB7XG4gICAgICBhcGlTdWJzY3JpcHRpb25TcnZjLnN1YnNjcmliZShjaGFubmVsLCBoYW5kbGVyLCBvcHRpb25zKTtcbiAgICB9KTtcblxuICB9XG5cbiAgLyoqIFVuc3Vic2NyaWJlIGZyb20gY2hhbm5lbC5cbiAgICAqIEBtZXRob2QgX3Vuc3Vic2NyaWJlXG4gICAgKiBAcGFyYW0ge3N0cmluZ3xhcnJheX0gY2hhbm5lbHMgLSBTdHJpbmcgb3IgYXJyYXkgb2YgY2hhbm5lbCBuYW1lcy5cbiAgICAqIEBwYXJhbSB7YXJyYXl9IG1ldGhvZHNcbiAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGhhbmRsZXIgLSBIYW5kbGVyIHRvIGJlIGNhbGxlZCB3aGVuIGV2ZW50IG9uIGNoYW5uZWwgb2NjdXJzXG4gICAgKi9cbiAgX3Vuc3Vic2NyaWJlIChjaGFubmVscywgbWV0aG9kcywgaGFuZGxlcikge1xuXG4gICAgaWYgKF8uaXNTdHJpbmcoY2hhbm5lbHMpKSB7XG4gICAgICBjaGFubmVscyA9IFtjaGFubmVsc107XG4gICAgfVxuXG4gICAgaWYgKCFfLmlzQXJyYXkobWV0aG9kcykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignbWV0aG9kcyBhcmd1bWVudCBtdXN0IGJlIGFycmF5IG9mIEhUVFAgbWV0aG9kcycpO1xuICAgIH1cblxuICAgIF8uZWFjaCh0aGlzLl9nZXRQaHlzaWNhbENoYW5uZWxzKGNoYW5uZWxzLCBtZXRob2RzKSwgZnVuY3Rpb24gKGNoYW5uZWwpIHtcbiAgICAgIGFwaVN1YnNjcmlwdGlvblNydmMudW5zdWJzY3JpYmUoY2hhbm5lbCwgaGFuZGxlcik7XG4gICAgfSk7XG5cbiAgfVxuXG4gIC8qKiBDbGVhbiBsZWFkaW5nIEhUVFAgdmVyYnMgZnJvbSBhIGNoYW5uZWwgbmFtZS5cbiAgICogQG1ldGhvZCBfbm9ybWFsaXplQ2hhbm5lbE5hbWVcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNoYW5uZWxcbiAgICovXG4gIF9ub3JtYWxpemVDaGFubmVsTmFtZShjaGFubmVsKXtcbiAgICByZXR1cm4gYXBpU3Vic2NyaXB0aW9uU3J2Yy5ub3JtYWxpemVDaGFubmVsTmFtZShjaGFubmVsKTtcbiAgfVxuXG4gIF9jaGVja0Rpc3BhdGNoQXJncyAoYWN0aW9uLCBzeW5jU3RhdGUpIHtcbiAgICBpZiAoYWN0aW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgYWN0aW9uIGFyZ3VtZW50IHZhbHVlIG9mIHVuZGVmaW5lZCBwYXNzZWQgdG8gZGlzcGF0Y2hVc2VyQWN0aW9uLiAgWW91J3JlIG1vc3QgbGlrZWx5IHJlZmVyZW5jaW5nIGFuIGludmFsaWQgQWN0aW9uIGNvbnN0YW50IChjb25zdGFudHMvYWN0aW9ucy5qcykuYCk7XG4gICAgfVxuICAgIGlmIChzeW5jU3RhdGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBzeW5jU3RhdGUgYXJndW1lbnQgdmFsdWUgb2YgdW5kZWZpbmVkIHBhc3NlZCB0byBkaXNwYXRjaFVzZXJBY3Rpb24uICBZb3UncmUgbW9zdCBsaWtlbHkgcmVmZXJlbmNpbmcgYW4gaW52YWxpZCBTdGF0ZSBjb25zdGFudCAoY29uc3RhbnRzL3N0YXRlLmpzKS5gKTtcbiAgICB9XG4gIH1cbiAgXG4gIC8qKiBEaXNwYXRjaCBzZXJ2ZXIgYWN0aW9uLlxuICAgKiBAbWV0aG9kIGRpc3BhdGNoU2VydmVyQWN0aW9uXG4gICAqIEBwYXJhbSB7aW50ZWdlcn0gYWN0aW9uVHlwZSAtIGFjdGlvbiB0eXBlIGZyb20gY29uc3RhbnRzL2FjdGlvbnNcbiAgICogQHBhcmFtIHtpbnRlZ2VyfSBzeW5jU3RhdGUgLSBzeW5jIHN0YXRlIHdpdGggc2VydmVyOyBvbmUgb2YgU1lOQ0VELCBSRVFVRVNULCBFUlJPUkVEIGZyb20gY29udGFudHMvc3RhdGVzXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBkYXRhIC0gcGF5bG9hZCBkYXRhICh0byBiZSBpbnRlcnByZXRlZCBiYXNlZCBvbiBhY3Rpb25UeXBlICYgc3RhdGUpXG4gICAqL1xuICBkaXNwYXRjaFNlcnZlckFjdGlvbiAoYWN0aW9uLCBzeW5jU3RhdGUsIGRhdGEpIHtcbiAgICB0aGlzLl9jaGVja0Rpc3BhdGNoQXJncyhhY3Rpb24sIHN5bmNTdGF0ZSk7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuX2Rpc3BhdGNoZXIuaGFuZGxlU2VydmVyQWN0aW9uKHRoaXMuX21ha2VQYXlsb2FkKGFjdGlvbiwgc3luY1N0YXRlLCBkYXRhKSk7XG4gICAgfVxuICAgIGNhdGNoIChlcnIpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyLnN0YWNrKTtcbiAgICB9XG4gIH1cblxuICAvKiogRGlzcGF0Y2ggdXNlciBhY3Rpb24uXG4gICAqIEBtZXRob2QgZGlzcGF0Y2hVc2VyQWN0aW9uXG4gICAqIEBwYXJhbSB7aW50ZWdlcn0gYWN0aW9uVHlwZSAtIGFjdGlvbiB0eXBlIGZyb20gY29uc3RhbnRzL2FjdGlvbnNcbiAgICogQHBhcmFtIHtpbnRlZ2VyfSBzeW5jU3RhdGUgLSBzeW5jIHN0YXRlIHdpdGggc2VydmVyOyBvbmUgb2YgU1lOQ0VELCBSRVFVRVNULCBFUlJPUkVEIGZyb20gY29udGFudHMvc3RhdGVzXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBkYXRhIC0gcGF5bG9hZCBkYXRhICh0byBiZSBpbnRlcnByZXRlZCBiYXNlZCBvbiBhY3Rpb25UeXBlICYgc3RhdGUpXG4gICAqL1xuICBkaXNwYXRjaFZpZXdBY3Rpb24gKGFjdGlvbiwgc3luY1N0YXRlLCBkYXRhKSB7XG4gICAgdGhpcy5fY2hlY2tEaXNwYXRjaEFyZ3MoYWN0aW9uLCBzeW5jU3RhdGUpO1xuICAgIHRyeSB7XG4gICAgICB0aGlzLl9kaXNwYXRjaGVyLmhhbmRsZVZpZXdBY3Rpb24odGhpcy5fbWFrZVBheWxvYWQoYWN0aW9uLCBzeW5jU3RhdGUsIGRhdGEpKTtcbiAgICB9XG4gICAgY2F0Y2ggKGVycikge1xuICAgICAgY29uc29sZS5sb2coZXJyLnN0YWNrKTtcbiAgICB9XG4gIH1cblxufTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pTDFWelpYSnpMMmhpZFhKeWIzZHpMMlJsZGk5b1pYSnZhM1V2Y21WaFkzUXRabXgxZUMxemRHRnlkR1Z5TDNCMVlteHBZeTlxWVhaaGMyTnlhWEIwY3k5aFkzUnBiMjV6TDJKaGMyVXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5b1luVnljbTkzY3k5a1pYWXZhR1Z5YjJ0MUwzSmxZV04wTFdac2RYZ3RjM1JoY25SbGNpOXdkV0pzYVdNdmFtRjJZWE5qY21sd2RITXZZV04wYVc5dWN5OWlZWE5sTG1weklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lKQlFVRkJMREpDUVVFeVFqczdRVUZGTTBJc1dVRkJXU3hEUVVGRE96dEJRVVZpTEVsQlFVa3NRMEZCUXl4SFFVRkhMRTlCUVU4c1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGQlF6dEJRVU14UWl4SlFVRkpMRlZCUVZVc1IwRkJSeXhQUVVGUExFTkJRVU1zWlVGQlpTeERRVUZETEVOQlFVTTdPMEZCUlRGRExFbEJRVWtzYlVKQlFXMUNMRWRCUVVjc1QwRkJUeXhEUVVGRExHMUNRVUZ0UWl4RFFVRkRMRU5CUVVNc1owSkJRV2RDTEVOQlFVTTdRVUZEZUVVN08wRkJSVUVzVFVGQlRTeERRVUZETEU5QlFVOHNSMEZCUnl4TlFVRk5MRTlCUVU4c1EwRkJRenM3UlVGRk4wSXNWMEZCVnl4SlFVRkpPMGxCUTJJc1NVRkJTU3hEUVVGRExGZEJRVmNzUjBGQlJ5eFZRVUZWTEVOQlFVTTdRVUZEYkVNc1IwRkJSenRCUVVOSU8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wVkJSVVVzV1VGQldTd3lRa0ZCTWtJN1NVRkRja01zVDBGQlR6dE5RVU5NTEZWQlFWVXNSVUZCUlN4TlFVRk5PMDFCUTJ4Q0xGTkJRVk1zUlVGQlJTeFRRVUZUTzAxQlEzQkNMRWxCUVVrc1JVRkJSU3hKUVVGSk8wdEJRMWdzUTBGQlF6dEJRVU5PTEVkQlFVYzdRVUZEU0R0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBWQlJVVXNiMEpCUVc5Q0xIRkNRVUZ4UWp0SlFVTjJReXhQUVVGUExFTkJRVU1zUTBGQlF5eFBRVUZQTEVOQlFVTXNVVUZCVVN4RFFVRkRMRWRCUVVjc1EwRkJReXhWUVVGVkxFOUJRVThzUlVGQlJUdE5RVU12UXl4UFFVRlBMRTlCUVU4c1EwRkJReXhIUVVGSExFTkJRVU1zVlVGQlZTeE5RVUZOTEVWQlFVVTdVVUZEYmtNc1QwRkJUeXhOUVVGTkxFZEJRVWNzUjBGQlJ5eEhRVUZITEU5QlFVOHNRMEZCUXp0UFFVTXZRaXhEUVVGRExFTkJRVU03UzBGRFNpeERRVUZETEVOQlFVTXNRMEZCUXp0QlFVTlNMRWRCUVVjN1FVRkRTRHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFc1JVRkJSU3hWUVVGVkxIVkRRVUYxUXpzN1NVRkZMME1zU1VGQlNTeERRVUZETEVOQlFVTXNVVUZCVVN4RFFVRkRMRkZCUVZFc1EwRkJReXhGUVVGRk8wMUJRM2hDTEZGQlFWRXNSMEZCUnl4RFFVRkRMRkZCUVZFc1EwRkJReXhEUVVGRE8wRkJRelZDTEV0QlFVczdPMGxCUlVRc1NVRkJTU3hEUVVGRExFTkJRVU1zUTBGQlF5eFBRVUZQTEVOQlFVTXNUMEZCVHl4RFFVRkRMRVZCUVVVN1RVRkRka0lzVFVGQlRTeEpRVUZKTEV0QlFVc3NRMEZCUXl4blJFRkJaMFFzUTBGQlF5eERRVUZETzBGQlEzaEZMRXRCUVVzN08wbEJSVVFzUTBGQlF5eERRVUZETEVsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc2IwSkJRVzlDTEVOQlFVTXNVVUZCVVN4RlFVRkZMRTlCUVU4c1EwRkJReXhGUVVGRkxGVkJRVlVzVDBGQlR5eEZRVUZGTzAxQlEzUkZMRzFDUVVGdFFpeERRVUZETEZOQlFWTXNRMEZCUXl4UFFVRlBMRVZCUVVVc1QwRkJUeXhGUVVGRkxFOUJRVThzUTBGQlF5eERRVUZETzBGQlF5OUVMRXRCUVVzc1EwRkJReXhEUVVGRE96dEJRVVZRTEVkQlFVYzdRVUZEU0R0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRXNSVUZCUlN4WlFVRlpMRGhDUVVFNFFqczdTVUZGZUVNc1NVRkJTU3hEUVVGRExFTkJRVU1zVVVGQlVTeERRVUZETEZGQlFWRXNRMEZCUXl4RlFVRkZPMDFCUTNoQ0xGRkJRVkVzUjBGQlJ5eERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRPMEZCUXpWQ0xFdEJRVXM3TzBsQlJVUXNTVUZCU1N4RFFVRkRMRU5CUVVNc1EwRkJReXhQUVVGUExFTkJRVU1zVDBGQlR5eERRVUZETEVWQlFVVTdUVUZEZGtJc1RVRkJUU3hKUVVGSkxFdEJRVXNzUTBGQlF5eG5SRUZCWjBRc1EwRkJReXhEUVVGRE8wRkJRM2hGTEV0QlFVczdPMGxCUlVRc1EwRkJReXhEUVVGRExFbEJRVWtzUTBGQlF5eEpRVUZKTEVOQlFVTXNiMEpCUVc5Q0xFTkJRVU1zVVVGQlVTeEZRVUZGTEU5QlFVOHNRMEZCUXl4RlFVRkZMRlZCUVZVc1QwRkJUeXhGUVVGRk8wMUJRM1JGTEcxQ1FVRnRRaXhEUVVGRExGZEJRVmNzUTBGQlF5eFBRVUZQTEVWQlFVVXNUMEZCVHl4RFFVRkRMRU5CUVVNN1FVRkRlRVFzUzBGQlN5eERRVUZETEVOQlFVTTdPMEZCUlZBc1IwRkJSenRCUVVOSU8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0RlFVVkZMSEZDUVVGeFFpeFRRVUZUTzBsQlF6VkNMRTlCUVU4c2JVSkJRVzFDTEVOQlFVTXNiMEpCUVc5Q0xFTkJRVU1zVDBGQlR5eERRVUZETEVOQlFVTTdRVUZETjBRc1IwRkJSenM3UlVGRlJDeHJRa0ZCYTBJc2NVSkJRWEZDTzBsQlEzSkRMRWxCUVVrc1RVRkJUU3hMUVVGTExGTkJRVk1zUlVGQlJUdE5RVU40UWl4TlFVRk5MRWxCUVVrc1MwRkJTeXhEUVVGRExIRktRVUZ4U2l4RFFVRkRMRU5CUVVNN1MwRkRlRXM3U1VGRFJDeEpRVUZKTEZOQlFWTXNTMEZCU3l4VFFVRlRMRVZCUVVVN1RVRkRNMElzVFVGQlRTeEpRVUZKTEV0QlFVc3NRMEZCUXl4eFNrRkJjVW9zUTBGQlF5eERRVUZETzB0QlEzaExPMEZCUTB3c1IwRkJSenRCUVVOSU8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1JVRkZSU3h2UWtGQmIwSXNNa0pCUVRKQ08wbEJRemRETEVsQlFVa3NRMEZCUXl4clFrRkJhMElzUTBGQlF5eE5RVUZOTEVWQlFVVXNVMEZCVXl4RFFVRkRMRU5CUVVNN1NVRkRNME1zU1VGQlNUdE5RVU5HTEVsQlFVa3NRMEZCUXl4WFFVRlhMRU5CUVVNc2EwSkJRV3RDTEVOQlFVTXNTVUZCU1N4RFFVRkRMRmxCUVZrc1EwRkJReXhOUVVGTkxFVkJRVVVzVTBGQlV5eEZRVUZGTEVsQlFVa3NRMEZCUXl4RFFVRkRMRU5CUVVNN1MwRkRha1k3U1VGRFJDeFBRVUZQTEVkQlFVY3NSVUZCUlR0TlFVTldMRTlCUVU4c1EwRkJReXhMUVVGTExFTkJRVU1zUjBGQlJ5eERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRPMHRCUXpGQ08wRkJRMHdzUjBGQlJ6dEJRVU5JTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UlVGRlJTeHJRa0ZCYTBJc01rSkJRVEpDTzBsQlF6TkRMRWxCUVVrc1EwRkJReXhyUWtGQmEwSXNRMEZCUXl4TlFVRk5MRVZCUVVVc1UwRkJVeXhEUVVGRExFTkJRVU03U1VGRE0wTXNTVUZCU1R0TlFVTkdMRWxCUVVrc1EwRkJReXhYUVVGWExFTkJRVU1zWjBKQlFXZENMRU5CUVVNc1NVRkJTU3hEUVVGRExGbEJRVmtzUTBGQlF5eE5RVUZOTEVWQlFVVXNVMEZCVXl4RlFVRkZMRWxCUVVrc1EwRkJReXhEUVVGRExFTkJRVU03UzBGREwwVTdTVUZEUkN4UFFVRlBMRWRCUVVjc1JVRkJSVHROUVVOV0xFOUJRVThzUTBGQlF5eEhRVUZITEVOQlFVTXNSMEZCUnl4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRE8wdEJRM2hDTzBGQlEwd3NSMEZCUnpzN1EwRkZSaXhEUVVGRElpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lMeW9xSUVCdGIyUjFiR1VnWVdOMGFXOXVjeTlpWVhObElDb3ZYRzVjYmlkMWMyVWdjM1J5YVdOMEp6dGNibHh1ZG1GeUlGOGdQU0J5WlhGMWFYSmxLQ2RzYjJSaGMyZ25LVHRjYm5aaGNpQkVhWE53WVhSamFHVnlJRDBnY21WeGRXbHlaU2duTGk0dlpHbHpjR0YwWTJobGNpY3BPMXh1WEc1MllYSWdZWEJwVTNWaWMyTnlhWEIwYVc5dVUzSjJZeUE5SUhKbGNYVnBjbVVvSnk0dUwzTmxjblpwWTJWekwybHVaR1Y0SnlrdVlYQnBVM1ZpYzJOeWFYQjBhVzl1Y3p0Y2JseHVYRzV0YjJSMWJHVXVaWGh3YjNKMGN5QTlJR05zWVhOeklFRmpkR2x2Ym5NZ2UxeHVYRzRnSUdOdmJuTjBjblZqZEc5eUlDZ3BJSHRjYmlBZ0lDQjBhR2x6TGw5a2FYTndZWFJqYUdWeUlEMGdSR2x6Y0dGMFkyaGxjanRjYmlBZ2ZWeHVYRzRnSUM4cUtseHVJQ0FnSUNvZ1UzUmhibVJoY21RZ1JHbHpjR0YwWTJobGNpQndZWGxzYjJGa1hHNGdJQ0FnS2x4dUlDQWdJQ29nUUhCeWIzQmxjblI1SUh0cGJuUmxaMlZ5ZlNCaFkzUnBiMjVVZVhCbElDMGdZV04wYVc5dUlIUjVjR1VnWm5KdmJTQmpiMjV6ZEdGdWRITXZZV04wYVc5dWMxeHVJQ0FnSUNvZ1FIQnliM0JsY25SNUlIdHBiblJsWjJWeWZTQnplVzVqVTNSaGRHVWdMU0J6ZVc1aklITjBZWFJsSUhkcGRHZ2djMlZ5ZG1WeUlHWnliMjBnWTI5dWRHRnVkSE12YzNSaGRHVnpYRzRnSUNBZ0tpQkFjSEp2Y0dWeWRIa2dlMjlpYW1WamRIMGdaR0YwWVNBdElIQmhlV3h2WVdRZ1pHRjBZU0FvZEc4Z1ltVWdhVzUwWlhKd2NtVjBaV1FnWW1GelpXUWdiMjRnWVdOMGFXOXVWSGx3WlNBbUlITjBZWFJsS1Z4dUlDQWdJQ3BjYmlBZ0lDQXFMMXh1SUNCZmJXRnJaVkJoZVd4dllXUWdLR0ZqZEdsdmJpd2djM2x1WTFOMFlYUmxMQ0JrWVhSaEtTQjdYRzRnSUNBZ2NtVjBkWEp1SUh0Y2JpQWdJQ0FnSUdGamRHbHZibFI1Y0dVNklHRmpkR2x2Yml4Y2JpQWdJQ0FnSUhONWJtTlRkR0YwWlRvZ2MzbHVZMU4wWVhSbExGeHVJQ0FnSUNBZ1pHRjBZVG9nWkdGMFlWeHVJQ0FnSUgwN1hHNGdJSDFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dSMlZ1WlhKaGRHVWdiR2x6ZENCdlppQndhSGx6YVdOaGJDQmphR0Z1Ym1Wc2MxeHVJQ0FnS2lCQWJXVjBhRzlrSUY5blpYUlFhSGx6YVdOaGJFTm9ZVzV1Wld4elhHNGdJQ0FxSUVCd1lYSmhiU0I3WVhKeVlYbDlJR05vWVc1dVpXeHpYRzRnSUNBcUlFQndZWEpoYlNCN1lYSnlZWGw5SUcxbGRHaHZaSE5jYmlBZ0lDb3ZYRzRnSUY5blpYUlFhSGx6YVdOaGJFTm9ZVzV1Wld4eklDaGphR0Z1Ym1Wc2N5d2diV1YwYUc5a2N5a2dlMXh1SUNBZ0lISmxkSFZ5YmlCZkxtWnNZWFIwWlc0b1kyaGhibTVsYkhNdWJXRndLR1oxYm1OMGFXOXVJQ2hqYUdGdWJtVnNLU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdiV1YwYUc5a2N5NXRZWEFvWm5WdVkzUnBiMjRnS0cxbGRHaHZaQ2tnZTF4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnYldWMGFHOWtJQ3NnSnlBbklDc2dZMmhoYm01bGJEdGNiaUFnSUNBZ0lIMHBPMXh1SUNBZ0lIMHBLVHRjYmlBZ2ZWeHVYRzRnSUM4cUtpQlRkV0p6WTNKcFltVWdkRzhnWTJoaGJtNWxiQzVjYmlBZ0lDQXFJRUJ0WlhSb2IyUWdYM04xWW5OamNtbGlaVnh1SUNBZ0lDb2dRSEJoY21GdElIdHpkSEpwYm1kOFlYSnlZWGw5SUdOb1lXNXVaV3h6SUMwZ1UzUnlhVzVuSUc5eUlHRnljbUY1SUc5bUlHTm9ZVzV1Wld3Z2JtRnRaWE11WEc0Z0lDQWdLaUJBY0dGeVlXMGdlMkZ5Y21GNWZTQnRaWFJvYjJSelhHNGdJQ0FnS2lCQWNHRnlZVzBnZTJaMWJtTjBhVzl1ZlNCb1lXNWtiR1Z5SUMwZ1NHRnVaR3hsY2lCMGJ5QmlaU0JqWVd4c1pXUWdkMmhsYmlCbGRtVnVkQ0J2YmlCamFHRnVibVZzSUc5alkzVnljMXh1SUNBZ0lDb3ZYRzRnSUY5emRXSnpZM0pwWW1VZ0tHTm9ZVzV1Wld4ekxDQnRaWFJvYjJSekxDQm9ZVzVrYkdWeUxDQnZjSFJwYjI1ektTQjdYRzVjYmlBZ0lDQnBaaUFvWHk1cGMxTjBjbWx1WnloamFHRnVibVZzY3lrcElIdGNiaUFnSUNBZ0lHTm9ZVzV1Wld4eklEMGdXMk5vWVc1dVpXeHpYVHRjYmlBZ0lDQjlYRzVjYmlBZ0lDQnBaaUFvSVY4dWFYTkJjbkpoZVNodFpYUm9iMlJ6S1NrZ2UxeHVJQ0FnSUNBZ2RHaHliM2NnYm1WM0lFVnljbTl5S0NkdFpYUm9iMlJ6SUdGeVozVnRaVzUwSUcxMWMzUWdZbVVnWVhKeVlYa2diMllnU0ZSVVVDQnRaWFJvYjJSekp5azdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ1h5NWxZV05vS0hSb2FYTXVYMmRsZEZCb2VYTnBZMkZzUTJoaGJtNWxiSE1vWTJoaGJtNWxiSE1zSUcxbGRHaHZaSE1wTENCbWRXNWpkR2x2YmlBb1kyaGhibTVsYkNrZ2UxeHVJQ0FnSUNBZ1lYQnBVM1ZpYzJOeWFYQjBhVzl1VTNKMll5NXpkV0p6WTNKcFltVW9ZMmhoYm01bGJDd2dhR0Z1Wkd4bGNpd2diM0IwYVc5dWN5azdYRzRnSUNBZ2ZTazdYRzVjYmlBZ2ZWeHVYRzRnSUM4cUtpQlZibk4xWW5OamNtbGlaU0JtY205dElHTm9ZVzV1Wld3dVhHNGdJQ0FnS2lCQWJXVjBhRzlrSUY5MWJuTjFZbk5qY21saVpWeHVJQ0FnSUNvZ1FIQmhjbUZ0SUh0emRISnBibWQ4WVhKeVlYbDlJR05vWVc1dVpXeHpJQzBnVTNSeWFXNW5JRzl5SUdGeWNtRjVJRzltSUdOb1lXNXVaV3dnYm1GdFpYTXVYRzRnSUNBZ0tpQkFjR0Z5WVcwZ2UyRnljbUY1ZlNCdFpYUm9iMlJ6WEc0Z0lDQWdLaUJBY0dGeVlXMGdlMloxYm1OMGFXOXVmU0JvWVc1a2JHVnlJQzBnU0dGdVpHeGxjaUIwYnlCaVpTQmpZV3hzWldRZ2QyaGxiaUJsZG1WdWRDQnZiaUJqYUdGdWJtVnNJRzlqWTNWeWMxeHVJQ0FnSUNvdlhHNGdJRjkxYm5OMVluTmpjbWxpWlNBb1kyaGhibTVsYkhNc0lHMWxkR2h2WkhNc0lHaGhibVJzWlhJcElIdGNibHh1SUNBZ0lHbG1JQ2hmTG1selUzUnlhVzVuS0dOb1lXNXVaV3h6S1NrZ2UxeHVJQ0FnSUNBZ1kyaGhibTVsYkhNZ1BTQmJZMmhoYm01bGJITmRPMXh1SUNBZ0lIMWNibHh1SUNBZ0lHbG1JQ2doWHk1cGMwRnljbUY1S0cxbGRHaHZaSE1wS1NCN1hHNGdJQ0FnSUNCMGFISnZkeUJ1WlhjZ1JYSnliM0lvSjIxbGRHaHZaSE1nWVhKbmRXMWxiblFnYlhWemRDQmlaU0JoY25KaGVTQnZaaUJJVkZSUUlHMWxkR2h2WkhNbktUdGNiaUFnSUNCOVhHNWNiaUFnSUNCZkxtVmhZMmdvZEdocGN5NWZaMlYwVUdoNWMybGpZV3hEYUdGdWJtVnNjeWhqYUdGdWJtVnNjeXdnYldWMGFHOWtjeWtzSUdaMWJtTjBhVzl1SUNoamFHRnVibVZzS1NCN1hHNGdJQ0FnSUNCaGNHbFRkV0p6WTNKcGNIUnBiMjVUY25aakxuVnVjM1ZpYzJOeWFXSmxLR05vWVc1dVpXd3NJR2hoYm1Sc1pYSXBPMXh1SUNBZ0lIMHBPMXh1WEc0Z0lIMWNibHh1SUNBdktpb2dRMnhsWVc0Z2JHVmhaR2x1WnlCSVZGUlFJSFpsY21KeklHWnliMjBnWVNCamFHRnVibVZzSUc1aGJXVXVYRzRnSUNBcUlFQnRaWFJvYjJRZ1gyNXZjbTFoYkdsNlpVTm9ZVzV1Wld4T1lXMWxYRzRnSUNBcUlFQndZWEpoYlNCN2MzUnlhVzVuZlNCamFHRnVibVZzWEc0Z0lDQXFMMXh1SUNCZmJtOXliV0ZzYVhwbFEyaGhibTVsYkU1aGJXVW9ZMmhoYm01bGJDbDdYRzRnSUNBZ2NtVjBkWEp1SUdGd2FWTjFZbk5qY21sd2RHbHZibE55ZG1NdWJtOXliV0ZzYVhwbFEyaGhibTVsYkU1aGJXVW9ZMmhoYm01bGJDazdYRzRnSUgxY2JseHVJQ0JmWTJobFkydEVhWE53WVhSamFFRnlaM01nS0dGamRHbHZiaXdnYzNsdVkxTjBZWFJsS1NCN1hHNGdJQ0FnYVdZZ0tHRmpkR2x2YmlBOVBUMGdkVzVrWldacGJtVmtLU0I3WEc0Z0lDQWdJQ0IwYUhKdmR5QnVaWGNnUlhKeWIzSW9ZR0ZqZEdsdmJpQmhjbWQxYldWdWRDQjJZV3gxWlNCdlppQjFibVJsWm1sdVpXUWdjR0Z6YzJWa0lIUnZJR1JwYzNCaGRHTm9WWE5sY2tGamRHbHZiaTRnSUZsdmRTZHlaU0J0YjNOMElHeHBhMlZzZVNCeVpXWmxjbVZ1WTJsdVp5QmhiaUJwYm5aaGJHbGtJRUZqZEdsdmJpQmpiMjV6ZEdGdWRDQW9ZMjl1YzNSaGJuUnpMMkZqZEdsdmJuTXVhbk1wTG1BcE8xeHVJQ0FnSUgxY2JpQWdJQ0JwWmlBb2MzbHVZMU4wWVhSbElEMDlQU0IxYm1SbFptbHVaV1FwSUh0Y2JpQWdJQ0FnSUhSb2NtOTNJRzVsZHlCRmNuSnZjaWhnYzNsdVkxTjBZWFJsSUdGeVozVnRaVzUwSUhaaGJIVmxJRzltSUhWdVpHVm1hVzVsWkNCd1lYTnpaV1FnZEc4Z1pHbHpjR0YwWTJoVmMyVnlRV04wYVc5dUxpQWdXVzkxSjNKbElHMXZjM1FnYkdsclpXeDVJSEpsWm1WeVpXNWphVzVuSUdGdUlHbHVkbUZzYVdRZ1UzUmhkR1VnWTI5dWMzUmhiblFnS0dOdmJuTjBZVzUwY3k5emRHRjBaUzVxY3lrdVlDazdYRzRnSUNBZ2ZWeHVJQ0I5WEc0Z0lGeHVJQ0F2S2lvZ1JHbHpjR0YwWTJnZ2MyVnlkbVZ5SUdGamRHbHZiaTVjYmlBZ0lDb2dRRzFsZEdodlpDQmthWE53WVhSamFGTmxjblpsY2tGamRHbHZibHh1SUNBZ0tpQkFjR0Z5WVcwZ2UybHVkR1ZuWlhKOUlHRmpkR2x2YmxSNWNHVWdMU0JoWTNScGIyNGdkSGx3WlNCbWNtOXRJR052Ym5OMFlXNTBjeTloWTNScGIyNXpYRzRnSUNBcUlFQndZWEpoYlNCN2FXNTBaV2RsY24wZ2MzbHVZMU4wWVhSbElDMGdjM2x1WXlCemRHRjBaU0IzYVhSb0lITmxjblpsY2pzZ2IyNWxJRzltSUZOWlRrTkZSQ3dnVWtWUlZVVlRWQ3dnUlZKU1QxSkZSQ0JtY205dElHTnZiblJoYm5SekwzTjBZWFJsYzF4dUlDQWdLaUJBY0dGeVlXMGdlMjlpYW1WamRIMGdaR0YwWVNBdElIQmhlV3h2WVdRZ1pHRjBZU0FvZEc4Z1ltVWdhVzUwWlhKd2NtVjBaV1FnWW1GelpXUWdiMjRnWVdOMGFXOXVWSGx3WlNBbUlITjBZWFJsS1Z4dUlDQWdLaTljYmlBZ1pHbHpjR0YwWTJoVFpYSjJaWEpCWTNScGIyNGdLR0ZqZEdsdmJpd2djM2x1WTFOMFlYUmxMQ0JrWVhSaEtTQjdYRzRnSUNBZ2RHaHBjeTVmWTJobFkydEVhWE53WVhSamFFRnlaM01vWVdOMGFXOXVMQ0J6ZVc1alUzUmhkR1VwTzF4dUlDQWdJSFJ5ZVNCN1hHNGdJQ0FnSUNCMGFHbHpMbDlrYVhOd1lYUmphR1Z5TG1oaGJtUnNaVk5sY25abGNrRmpkR2x2YmloMGFHbHpMbDl0WVd0bFVHRjViRzloWkNoaFkzUnBiMjRzSUhONWJtTlRkR0YwWlN3Z1pHRjBZU2twTzF4dUlDQWdJSDFjYmlBZ0lDQmpZWFJqYUNBb1pYSnlLU0I3WEc0Z0lDQWdJQ0JqYjI1emIyeGxMbVZ5Y205eUtHVnljaTV6ZEdGamF5azdYRzRnSUNBZ2ZWeHVJQ0I5WEc1Y2JpQWdMeW9xSUVScGMzQmhkR05vSUhWelpYSWdZV04wYVc5dUxseHVJQ0FnS2lCQWJXVjBhRzlrSUdScGMzQmhkR05vVlhObGNrRmpkR2x2Ymx4dUlDQWdLaUJBY0dGeVlXMGdlMmx1ZEdWblpYSjlJR0ZqZEdsdmJsUjVjR1VnTFNCaFkzUnBiMjRnZEhsd1pTQm1jbTl0SUdOdmJuTjBZVzUwY3k5aFkzUnBiMjV6WEc0Z0lDQXFJRUJ3WVhKaGJTQjdhVzUwWldkbGNuMGdjM2x1WTFOMFlYUmxJQzBnYzNsdVl5QnpkR0YwWlNCM2FYUm9JSE5sY25abGNqc2diMjVsSUc5bUlGTlpUa05GUkN3Z1VrVlJWVVZUVkN3Z1JWSlNUMUpGUkNCbWNtOXRJR052Ym5SaGJuUnpMM04wWVhSbGMxeHVJQ0FnS2lCQWNHRnlZVzBnZTI5aWFtVmpkSDBnWkdGMFlTQXRJSEJoZVd4dllXUWdaR0YwWVNBb2RHOGdZbVVnYVc1MFpYSndjbVYwWldRZ1ltRnpaV1FnYjI0Z1lXTjBhVzl1Vkhsd1pTQW1JSE4wWVhSbEtWeHVJQ0FnS2k5Y2JpQWdaR2x6Y0dGMFkyaFdhV1YzUVdOMGFXOXVJQ2hoWTNScGIyNHNJSE41Ym1OVGRHRjBaU3dnWkdGMFlTa2dlMXh1SUNBZ0lIUm9hWE11WDJOb1pXTnJSR2x6Y0dGMFkyaEJjbWR6S0dGamRHbHZiaXdnYzNsdVkxTjBZWFJsS1R0Y2JpQWdJQ0IwY25rZ2UxeHVJQ0FnSUNBZ2RHaHBjeTVmWkdsemNHRjBZMmhsY2k1b1lXNWtiR1ZXYVdWM1FXTjBhVzl1S0hSb2FYTXVYMjFoYTJWUVlYbHNiMkZrS0dGamRHbHZiaXdnYzNsdVkxTjBZWFJsTENCa1lYUmhLU2s3WEc0Z0lDQWdmVnh1SUNBZ0lHTmhkR05vSUNobGNuSXBJSHRjYmlBZ0lDQWdJR052Ym5OdmJHVXViRzluS0dWeWNpNXpkR0ZqYXlrN1hHNGdJQ0FnZlZ4dUlDQjlYRzVjYm4wN1hHNGlYWDA9IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xuXG52YXIgdXVpZCA9IHJlcXVpcmUoJ25vZGUtdXVpZCcpO1xuXG52YXIga0FjdGlvbnMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvYWN0aW9ucycpO1xudmFyIGtTdGF0ZXMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvc3RhdGVzJyk7XG5cbnZhciBhamF4ID0gcmVxdWlyZSgnLi4vY29tbW9uL2FqYXgnKTtcbnZhciBtZXRlcmVkR0VUID0gcmVxdWlyZSgnLi4vY29tbW9uL21ldGVyZWQtcmVxdWVzdCcpLmdldDtcblxudmFyIEJhc2VBY3Rpb24gPSByZXF1aXJlKCcuL2Jhc2UnKTtcblxuY2xhc3MgQ1JVREJhc2UgZXh0ZW5kcyBCYXNlQWN0aW9uIHtcblxuICBjb25zdHJ1Y3RvciAoYmFzZVVSTCwgYWN0aW9uT2JqZWN0SWQpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuYmFzZVVSTCA9IGJhc2VVUkw7XG4gICAgdGhpcy5hY3Rpb25PYmplY3RJZCA9IGFjdGlvbk9iamVjdElkO1xuXG4gICAgLy8gZXhwbGljaXRseSBiaW5kIGhhbmRsZXJzIGZvciB3ZWIgc29ja2V0IGV2ZW50c1xuICAgIF8uYmluZEFsbCh0aGlzLCAnX29uUG9zdEV2ZW50JywgJ19vblB1dEV2ZW50JywgJ19vbkRlbGV0ZUV2ZW50Jyk7XG4gIH1cblxuICBfYWN0aW9uRm9yTWV0aG9kKG1ldGhvZCkge1xuICAgIHJldHVybiBrQWN0aW9uc1t0aGlzLmFjdGlvbk9iamVjdElkICsgJ18nICsgbWV0aG9kXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHRVQgbGlzdCBvZiByZXNvdXJjZXNcbiAgICogQG1ldGhvZFxuICAgKi9cbiAgIGdldEFsbCgpIHtcbiAgICAgdmFyIGFjdGlvbiA9IHRoaXMuX2FjdGlvbkZvck1ldGhvZCgnR0VUQUxMJyk7XG4gICAgIG1ldGVyZWRHRVQoXG4gICAgICAgdGhpcy5iYXNlVVJMLFxuICAgICAgICgpID0+IHRoaXMuZGlzcGF0Y2hTZXJ2ZXJBY3Rpb24oYWN0aW9uLCBrU3RhdGVzLkxPQURJTkcpLFxuICAgICAgIGRhdGEgPT4gdGhpcy5kaXNwYXRjaFNlcnZlckFjdGlvbihhY3Rpb24sIGtTdGF0ZXMuU1lOQ0VELCBkYXRhKSxcbiAgICAgICBlcnIgPT4gdGhpcy5kaXNwYXRjaFNlcnZlckFjdGlvbihhY3Rpb24sIGtTdGF0ZXMuRVJST1JFRCwgZXJyKVxuICAgICApO1xuICAgfVxuXG4gICAvKipcbiAgICAqIFBPU1QgKGNyZWF0ZSkgbmV3IHJlc291cmNlXG4gICAgKiBAbWV0aG9kXG4gICAgKiBAcmV0dXJucyBjbGllbnQgZ2VuZXJhdGVkIFVVSUQgb2YgdGhlIG5ldyByZXNvdXJjZVxuICAgICovXG4gICBwb3N0KHBheWxvYWQpIHtcblxuICAgICB2YXIgYWN0aW9uID0gdGhpcy5fYWN0aW9uRm9yTWV0aG9kKCdQT1NUJyk7XG5cbiAgICAgcGF5bG9hZC5pZCA9IHV1aWQudjEoKTtcblxuICAgICBhamF4KHtcbiAgICAgICB1cmw6IHRoaXMuYmFzZVVSTCxcbiAgICAgICB0eXBlOiBcIlBPU1RcIixcbiAgICAgICBkYXRhOiBwYXlsb2FkLFxuICAgICAgIGFjY2VwdHM6IHtcbiAgICAgICAgICdqc29uJzogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgICAndGV4dCc6ICd0ZXh0L3BsYWluJ1xuICAgICAgIH1cbiAgICAgfSlcbiAgICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICB0aGlzLmRpc3BhdGNoU2VydmVyQWN0aW9uKGFjdGlvbiwga1N0YXRlcy5TWU5DRUQsIGRhdGEpO1xuICAgICB9LmJpbmQodGhpcykpXG4gICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgdGhpcy5kaXNwYXRjaFNlcnZlckFjdGlvbihhY3Rpb24sIGtTdGF0ZXMuRVJST1JFRCwgZXJyKTtcbiAgICAgfS5iaW5kKHRoaXMpKTtcblxuICAgICB0aGlzLmRpc3BhdGNoU2VydmVyQWN0aW9uKGFjdGlvbiwga1N0YXRlcy5ORVcsIHBheWxvYWQpO1xuXG4gICAgIHJldHVybiBwYXlsb2FkLmlkO1xuICAgfVxuXG4gICAvKipcbiAgICAqIEdFVCBhIHNpbmdsZSByZXNvdXJjZVxuICAgICogQG1ldGhvZFxuICAgICovXG4gICBnZXQoaWQpIHtcbiAgICAgdmFyIGFjdGlvbiA9IHRoaXMuX2FjdGlvbkZvck1ldGhvZCgnR0VUT05FJyk7XG4gICAgIG1ldGVyZWRHRVQoXG4gICAgICAgYCR7dGhpcy5iYXNlVVJMfS8ke2lkfWAsXG4gICAgICAgKCkgPT4gdGhpcy5kaXNwYXRjaFNlcnZlckFjdGlvbihhY3Rpb24sIGtTdGF0ZXMuTE9BRElORywge2lkOiBpZH0pLFxuICAgICAgIGRhdGEgPT4gdGhpcy5kaXNwYXRjaFNlcnZlckFjdGlvbihhY3Rpb24sIGtTdGF0ZXMuU1lOQ0VELCBkYXRhKSxcbiAgICAgICBlcnIgPT4gdGhpcy5kaXNwYXRjaFNlcnZlckFjdGlvbihhY3Rpb24sIGtTdGF0ZXMuRVJST1JFRCwgZXJyKVxuICAgICApO1xuICAgfVxuXG4gICAvKipcbiAgICAqIFBVVCAodXBkYXRlKSBhIHJlc291cmNlXG4gICAgKiBAbWV0aG9kXG4gICAgKi9cbiAgIHB1dChpZCwgcGF5bG9hZCkge1xuICAgICB2YXIgYWN0aW9uID0gdGhpcy5fYWN0aW9uRm9yTWV0aG9kKCdQVVQnKTtcbiAgICAgYWpheCh7XG4gICAgICAgdXJsOiBgJHt0aGlzLmJhc2VVUkx9LyR7aWR9YCxcbiAgICAgICB0eXBlOiBcIlBVVFwiLFxuICAgICAgIGRhdGE6IHBheWxvYWQsXG4gICAgICAgYWNjZXB0czoge1xuICAgICAgICAgJ2pzb24nOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAgICAgICd0ZXh0JzogJ3RleHQvcGxhaW4nXG4gICAgICAgfVxuICAgICB9KVxuICAgICAudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgIHRoaXMuZGlzcGF0Y2hTZXJ2ZXJBY3Rpb24oYWN0aW9uLCBrU3RhdGVzLlNZTkNFRCwgZGF0YSk7XG4gICAgIH0uYmluZCh0aGlzKSlcbiAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICB0aGlzLmRpc3BhdGNoU2VydmVyQWN0aW9uKGFjdGlvbiwga1N0YXRlcy5FUlJPUkVELCBlcnIpO1xuICAgICB9LmJpbmQodGhpcykpO1xuXG4gICAgIHRoaXMuZGlzcGF0Y2hTZXJ2ZXJBY3Rpb24oYWN0aW9uLCBrU3RhdGVzLlNBVklORywgcGF5bG9hZCk7XG4gICB9XG5cbiAgIC8qKlxuICAgICogREVMRVRFIGEgcmVzb3VyY2VcbiAgICAqIEBtZXRob2RcbiAgICAqL1xuICAgZGVsZXRlKGlkKSB7XG4gICAgIHZhciBhY3Rpb24gPSB0aGlzLl9hY3Rpb25Gb3JNZXRob2QoJ0RFTEVURScpO1xuICAgICBhamF4KHtcbiAgICAgICB1cmw6IGAke3RoaXMuYmFzZVVSTH0vJHtpZH1gLFxuICAgICAgIHR5cGU6IFwiREVMRVRFXCIsXG4gICAgICAgYWNjZXB0czoge1xuICAgICAgICAgJ2pzb24nOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAgICAgICd0ZXh0JzogJ3RleHQvcGxhaW4nXG4gICAgICAgfVxuICAgICB9KVxuICAgICAudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgIHRoaXMuZGlzcGF0Y2hTZXJ2ZXJBY3Rpb24oYWN0aW9uLCBrU3RhdGVzLlNZTkNFRCwgZGF0YSk7XG4gICAgIH0uYmluZCh0aGlzKSlcbiAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICB0aGlzLmRpc3BhdGNoU2VydmVyQWN0aW9uKGFjdGlvbiwga1N0YXRlcy5FUlJPUkVELCBlcnIpO1xuICAgICB9LmJpbmQodGhpcykpO1xuXG4gICAgIHRoaXMuZGlzcGF0Y2hTZXJ2ZXJBY3Rpb24oYWN0aW9uLCBrU3RhdGVzLkRFTEVUSU5HLCB7aWQ6IGlkfSk7XG5cbiAgIH1cblxuXG4gICAvKipcbiAgICAqXG4gICAgKiAgU3Vic2NyaXB0aW9uIG1ldGhvZHNcbiAgICAqXG4gICAgKi9cbiAgX29uUG9zdEV2ZW50KGV2ZW50LCBjaGFubmVsLCBkYXRhKSB7XG4gICAgdGhpcy5kaXNwYXRjaFNlcnZlckFjdGlvbih0aGlzLl9hY3Rpb25Gb3JNZXRob2QoJ1BPU1QnKSwga1N0YXRlcy5TWU5DRUQsIHtcbiAgICAgIHN1YnNjcmlwdGlvbjogdGhpcy5fbm9ybWFsaXplQ2hhbm5lbE5hbWUoY2hhbm5lbCksXG4gICAgICBpZDogZGF0YS5pZCxcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9KTtcbiAgfVxuXG4gIF9vblB1dEV2ZW50KGV2ZW50LCBjaGFubmVsLCBkYXRhKSB7XG4gICAgdGhpcy5kaXNwYXRjaFNlcnZlckFjdGlvbih0aGlzLl9hY3Rpb25Gb3JNZXRob2QoJ1BVVCcpLCBrU3RhdGVzLlNZTkNFRCwge1xuICAgICAgc3Vic2NyaXB0aW9uOiB0aGlzLl9ub3JtYWxpemVDaGFubmVsTmFtZShjaGFubmVsKSxcbiAgICAgIGlkOiBkYXRhLmlkLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH0pO1xuICB9XG5cbiAgX29uRGVsZXRlRXZlbnQoZXZlbnQsIGNoYW5uZWwpIHtcbiAgICB2YXIgcmUgPSBuZXcgUmVnRXhwKGAke3RoaXMuYmFzZVVSTH0vKC4rKSRgKSwgIC8vIHJlIGZvciBleHRyYWNpbmcgcmVzb3VyY2UgaWQgZnJvbSBjaGFubmVsXG4gICAgICAgIGlkID0gcmUuZXhlYyhjaGFubmVsKVsxXTtcblxuICAgIHRoaXMuZGlzcGF0Y2hTZXJ2ZXJBY3Rpb24odGhpcy5fYWN0aW9uRm9yTWV0aG9kKCdERUxFVEUnKSwga1N0YXRlcy5TWU5DRUQsIHtcbiAgICAgIHN1YnNjcmlwdGlvbjogdGhpcy5fbm9ybWFsaXplQ2hhbm5lbE5hbWUoY2hhbm5lbCksXG4gICAgICBpZDogaWRcbiAgICB9KTtcbiAgfVxuXG4gIHN1YnNjcmliZUxpc3QgKCkge1xuICAgIHRoaXMuX3N1YnNjcmliZSh0aGlzLmJhc2VVUkwsIFsnUE9TVCddLCB0aGlzLl9vblBvc3RFdmVudCk7XG4gIH1cblxuICB1bnN1YnNjcmliZUxpc3QgKCkge1xuICAgIHRoaXMuX3Vuc3Vic2NyaWJlKHRoaXMuYmFzZVVSTCwgWydQT1NUJ10sIHRoaXMuX29uUG9zdEV2ZW50KTtcbiAgfVxuXG4gIHN1YnNjcmliZVJlc291cmNlcyhpZHMpIHtcbiAgICBpZiAoIV8uaXNBcnJheShpZHMpKSB7XG4gICAgICBpZHMgPSBbaWRzXTtcbiAgICB9XG5cbiAgICB2YXIgY2hhbm5lbHMgPSBfLm1hcChpZHMsIGlkID0+IGAke3RoaXMuYmFzZVVSTH0vJHtpZH1gKTtcbiAgICB0aGlzLl9zdWJzY3JpYmUoY2hhbm5lbHMsIFsnUFVUJ10sIHRoaXMuX29uUHV0RXZlbnQpO1xuICAgIHRoaXMuX3N1YnNjcmliZShjaGFubmVscywgWydERUxFVEUnXSwgdGhpcy5fb25EZWxldGVFdmVudCk7XG4gIH1cblxuICB1bnN1YnNjcmliZVJlc291cmNlcyhpZHMpIHtcbiAgICBpZiAoIV8uaXNBcnJheShpZHMpKSB7XG4gICAgICBpZHMgPSBbaWRzXTtcbiAgICB9XG5cbiAgICB2YXIgY2hhbm5lbHMgPSBfLm1hcChpZHMsIGlkID0+IGAke3RoaXMuYmFzZVVSTH0vJHtpZH1gKTtcbiAgICB0aGlzLl91bnN1YnNjcmliZShjaGFubmVscywgWydQVVQnXSwgdGhpcy5fb25QdXRFdmVudCk7XG4gICAgdGhpcy5fdW5zdWJzY3JpYmUoY2hhbm5lbHMsIFsnREVMRVRFJ10sIHRoaXMuX29uRGVsZXRlRXZlbnQpO1xuICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDUlVEQmFzZTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pTDFWelpYSnpMMmhpZFhKeWIzZHpMMlJsZGk5b1pYSnZhM1V2Y21WaFkzUXRabXgxZUMxemRHRnlkR1Z5TDNCMVlteHBZeTlxWVhaaGMyTnlhWEIwY3k5aFkzUnBiMjV6TDJOeWRXUXRZbUZ6WlM1cWN5SXNJbk52ZFhKalpYTWlPbHNpTDFWelpYSnpMMmhpZFhKeWIzZHpMMlJsZGk5b1pYSnZhM1V2Y21WaFkzUXRabXgxZUMxemRHRnlkR1Z5TDNCMVlteHBZeTlxWVhaaGMyTnlhWEIwY3k5aFkzUnBiMjV6TDJOeWRXUXRZbUZ6WlM1cWN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaVFVRkJRU3haUVVGWkxFTkJRVU03TzBGQlJXSXNTVUZCU1N4RFFVRkRMRWRCUVVjc1QwRkJUeXhEUVVGRExGRkJRVkVzUTBGQlF5eERRVUZET3p0QlFVVXhRaXhKUVVGSkxFbEJRVWtzUjBGQlJ5eFBRVUZQTEVOQlFVTXNWMEZCVnl4RFFVRkRMRU5CUVVNN08wRkJSV2hETEVsQlFVa3NVVUZCVVN4SFFVRkhMRTlCUVU4c1EwRkJReXh6UWtGQmMwSXNRMEZCUXl4RFFVRkRPMEZCUXk5RExFbEJRVWtzVDBGQlR5eEhRVUZITEU5QlFVOHNRMEZCUXl4eFFrRkJjVUlzUTBGQlF5eERRVUZET3p0QlFVVTNReXhKUVVGSkxFbEJRVWtzUjBGQlJ5eFBRVUZQTEVOQlFVTXNaMEpCUVdkQ0xFTkJRVU1zUTBGQlF6dEJRVU55UXl4SlFVRkpMRlZCUVZVc1IwRkJSeXhQUVVGUExFTkJRVU1zTWtKQlFUSkNMRU5CUVVNc1EwRkJReXhIUVVGSExFTkJRVU03TzBGQlJURkVMRWxCUVVrc1ZVRkJWU3hIUVVGSExFOUJRVThzUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZCUXpzN1FVRkZia01zVFVGQlRTeFJRVUZSTEZOQlFWTXNWVUZCVlN4RFFVRkRPenRGUVVWb1F5eFhRVUZYTERKQ1FVRXlRanRKUVVOd1F5eExRVUZMTEVWQlFVVXNRMEZCUXp0SlFVTlNMRWxCUVVrc1EwRkJReXhQUVVGUExFZEJRVWNzVDBGQlR5eERRVUZETzBGQlF6TkNMRWxCUVVrc1NVRkJTU3hEUVVGRExHTkJRV01zUjBGQlJ5eGpRVUZqTEVOQlFVTTdRVUZEZWtNN08wbEJSVWtzUTBGQlF5eERRVUZETEU5QlFVOHNRMEZCUXl4SlFVRkpMRVZCUVVVc1kwRkJZeXhGUVVGRkxHRkJRV0VzUlVGQlJTeG5Ra0ZCWjBJc1EwRkJReXhEUVVGRE8wRkJRM0pGTEVkQlFVYzdPMFZCUlVRc1owSkJRV2RDTEZOQlFWTTdTVUZEZGtJc1QwRkJUeXhSUVVGUkxFTkJRVU1zU1VGQlNTeERRVUZETEdOQlFXTXNSMEZCUnl4SFFVRkhMRWRCUVVjc1RVRkJUU3hEUVVGRExFTkJRVU03UVVGRGVFUXNSMEZCUnp0QlFVTklPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEhRVVZITEUxQlFVMHNSMEZCUnp0TFFVTlFMRWxCUVVrc1RVRkJUU3hIUVVGSExFbEJRVWtzUTBGQlF5eG5Ra0ZCWjBJc1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGQlF6dExRVU0zUXl4VlFVRlZPMDlCUTFJc1NVRkJTU3hEUVVGRExFOUJRVTg3VDBGRFdpeE5RVUZOTEVsQlFVa3NRMEZCUXl4dlFrRkJiMElzUTBGQlF5eE5RVUZOTEVWQlFVVXNUMEZCVHl4RFFVRkRMRTlCUVU4c1EwRkJRenRQUVVONFJDeEpRVUZKTEVsQlFVa3NTVUZCU1N4RFFVRkRMRzlDUVVGdlFpeERRVUZETEUxQlFVMHNSVUZCUlN4UFFVRlBMRU5CUVVNc1RVRkJUU3hGUVVGRkxFbEJRVWtzUTBGQlF6dFBRVU12UkN4SFFVRkhMRWxCUVVrc1NVRkJTU3hEUVVGRExHOUNRVUZ2UWl4RFFVRkRMRTFCUVUwc1JVRkJSU3hQUVVGUExFTkJRVU1zVDBGQlR5eEZRVUZGTEVkQlFVY3NRMEZCUXp0TlFVTXZSQ3hEUVVGRE8wRkJRMUFzU1VGQlNUdEJRVU5LTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUVzUjBGQlJ5eEpRVUZKTEZWQlFWVTdPMEZCUldwQ0xFdEJRVXNzU1VGQlNTeE5RVUZOTEVkQlFVY3NTVUZCU1N4RFFVRkRMR2RDUVVGblFpeERRVUZETEUxQlFVMHNRMEZCUXl4RFFVRkRPenRCUVVWb1JDeExRVUZMTEU5QlFVOHNRMEZCUXl4RlFVRkZMRWRCUVVjc1NVRkJTU3hEUVVGRExFVkJRVVVzUlVGQlJTeERRVUZET3p0TFFVVjJRaXhKUVVGSkxFTkJRVU03VDBGRFNDeEhRVUZITEVWQlFVVXNTVUZCU1N4RFFVRkRMRTlCUVU4N1QwRkRha0lzU1VGQlNTeEZRVUZGTEUxQlFVMDdUMEZEV2l4SlFVRkpMRVZCUVVVc1QwRkJUenRQUVVOaUxFOUJRVThzUlVGQlJUdFRRVU5RTEUxQlFVMHNSVUZCUlN4clFrRkJhMEk3VTBGRE1VSXNUVUZCVFN4RlFVRkZMRmxCUVZrN1VVRkRja0k3VFVGRFJpeERRVUZETzAxQlEwUXNTVUZCU1N4RFFVRkRMRlZCUVZVc1NVRkJTU3hGUVVGRk8wOUJRM0JDTEVsQlFVa3NRMEZCUXl4dlFrRkJiMElzUTBGQlF5eE5RVUZOTEVWQlFVVXNUMEZCVHl4RFFVRkRMRTFCUVUwc1JVRkJSU3hKUVVGSkxFTkJRVU1zUTBGQlF6dE5RVU42UkN4RFFVRkRMRWxCUVVrc1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF6dE5RVU5hTEV0QlFVc3NRMEZCUXl4VlFVRlZMRWRCUVVjc1JVRkJSVHRQUVVOd1FpeEpRVUZKTEVOQlFVTXNiMEpCUVc5Q0xFTkJRVU1zVFVGQlRTeEZRVUZGTEU5QlFVOHNRMEZCUXl4UFFVRlBMRVZCUVVVc1IwRkJSeXhEUVVGRExFTkJRVU03UVVGREwwUXNUVUZCVFN4RFFVRkRMRWxCUVVrc1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF5eERRVUZET3p0QlFVVnVRaXhMUVVGTExFbEJRVWtzUTBGQlF5eHZRa0ZCYjBJc1EwRkJReXhOUVVGTkxFVkJRVVVzVDBGQlR5eERRVUZETEVkQlFVY3NSVUZCUlN4UFFVRlBMRU5CUVVNc1EwRkJRenM3UzBGRmVFUXNUMEZCVHl4UFFVRlBMRU5CUVVNc1JVRkJSU3hEUVVGRE8wRkJRM1pDTEVsQlFVazdRVUZEU2p0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UjBGRlJ5eEhRVUZITEV0QlFVczdTMEZEVGl4SlFVRkpMRTFCUVUwc1IwRkJSeXhKUVVGSkxFTkJRVU1zWjBKQlFXZENMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU03UzBGRE4wTXNWVUZCVlR0UFFVTlNMRWRCUVVjc1NVRkJTU3hEUVVGRExFOUJRVThzU1VGQlNTeEZRVUZGTEVWQlFVVTdUMEZEZGtJc1RVRkJUU3hKUVVGSkxFTkJRVU1zYjBKQlFXOUNMRU5CUVVNc1RVRkJUU3hGUVVGRkxFOUJRVThzUTBGQlF5eFBRVUZQTEVWQlFVVXNRMEZCUXl4RlFVRkZMRVZCUVVVc1JVRkJSU3hEUVVGRExFTkJRVU03VDBGRGJFVXNTVUZCU1N4SlFVRkpMRWxCUVVrc1EwRkJReXh2UWtGQmIwSXNRMEZCUXl4TlFVRk5MRVZCUVVVc1QwRkJUeXhEUVVGRExFMUJRVTBzUlVGQlJTeEpRVUZKTEVOQlFVTTdUMEZETDBRc1IwRkJSeXhKUVVGSkxFbEJRVWtzUTBGQlF5eHZRa0ZCYjBJc1EwRkJReXhOUVVGTkxFVkJRVVVzVDBGQlR5eERRVUZETEU5QlFVOHNSVUZCUlN4SFFVRkhMRU5CUVVNN1RVRkRMMFFzUTBGQlF6dEJRVU5RTEVsQlFVazdRVUZEU2p0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UjBGRlJ5eEhRVUZITEdOQlFXTTdTMEZEWml4SlFVRkpMRTFCUVUwc1IwRkJSeXhKUVVGSkxFTkJRVU1zWjBKQlFXZENMRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU03UzBGRE1VTXNTVUZCU1N4RFFVRkRPMDlCUTBnc1IwRkJSeXhGUVVGRkxFZEJRVWNzU1VGQlNTeERRVUZETEU5QlFVOHNTVUZCU1N4RlFVRkZMRVZCUVVVN1QwRkROVUlzU1VGQlNTeEZRVUZGTEV0QlFVczdUMEZEV0N4SlFVRkpMRVZCUVVVc1QwRkJUenRQUVVOaUxFOUJRVThzUlVGQlJUdFRRVU5RTEUxQlFVMHNSVUZCUlN4clFrRkJhMEk3VTBGRE1VSXNUVUZCVFN4RlFVRkZMRmxCUVZrN1VVRkRja0k3VFVGRFJpeERRVUZETzAxQlEwUXNTVUZCU1N4RFFVRkRMRlZCUVZVc1NVRkJTU3hGUVVGRk8wOUJRM0JDTEVsQlFVa3NRMEZCUXl4dlFrRkJiMElzUTBGQlF5eE5RVUZOTEVWQlFVVXNUMEZCVHl4RFFVRkRMRTFCUVUwc1JVRkJSU3hKUVVGSkxFTkJRVU1zUTBGQlF6dE5RVU42UkN4RFFVRkRMRWxCUVVrc1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF6dE5RVU5hTEV0QlFVc3NRMEZCUXl4VlFVRlZMRWRCUVVjc1JVRkJSVHRQUVVOd1FpeEpRVUZKTEVOQlFVTXNiMEpCUVc5Q0xFTkJRVU1zVFVGQlRTeEZRVUZGTEU5QlFVOHNRMEZCUXl4UFFVRlBMRVZCUVVVc1IwRkJSeXhEUVVGRExFTkJRVU03UVVGREwwUXNUVUZCVFN4RFFVRkRMRWxCUVVrc1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF5eERRVUZET3p0TFFVVmtMRWxCUVVrc1EwRkJReXh2UWtGQmIwSXNRMEZCUXl4TlFVRk5MRVZCUVVVc1QwRkJUeXhEUVVGRExFMUJRVTBzUlVGQlJTeFBRVUZQTEVOQlFVTXNRMEZCUXp0QlFVTm9SU3hKUVVGSk8wRkJRMG83UVVGRFFUdEJRVU5CTzBGQlEwRTdPMGRCUlVjc1RVRkJUU3hMUVVGTE8wdEJRMVFzU1VGQlNTeE5RVUZOTEVkQlFVY3NTVUZCU1N4RFFVRkRMR2RDUVVGblFpeERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRPMHRCUXpkRExFbEJRVWtzUTBGQlF6dFBRVU5JTEVkQlFVY3NSVUZCUlN4SFFVRkhMRWxCUVVrc1EwRkJReXhQUVVGUExFbEJRVWtzUlVGQlJTeEZRVUZGTzA5QlF6VkNMRWxCUVVrc1JVRkJSU3hSUVVGUk8wOUJRMlFzVDBGQlR5eEZRVUZGTzFOQlExQXNUVUZCVFN4RlFVRkZMR3RDUVVGclFqdFRRVU14UWl4TlFVRk5MRVZCUVVVc1dVRkJXVHRSUVVOeVFqdE5RVU5HTEVOQlFVTTdUVUZEUkN4SlFVRkpMRU5CUVVNc1ZVRkJWU3hKUVVGSkxFVkJRVVU3VDBGRGNFSXNTVUZCU1N4RFFVRkRMRzlDUVVGdlFpeERRVUZETEUxQlFVMHNSVUZCUlN4UFFVRlBMRU5CUVVNc1RVRkJUU3hGUVVGRkxFbEJRVWtzUTBGQlF5eERRVUZETzAxQlEzcEVMRU5CUVVNc1NVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF5eERRVUZETzAxQlExb3NTMEZCU3l4RFFVRkRMRlZCUVZVc1IwRkJSeXhGUVVGRk8wOUJRM0JDTEVsQlFVa3NRMEZCUXl4dlFrRkJiMElzUTBGQlF5eE5RVUZOTEVWQlFVVXNUMEZCVHl4RFFVRkRMRTlCUVU4c1JVRkJSU3hIUVVGSExFTkJRVU1zUTBGQlF6dEJRVU12UkN4TlFVRk5MRU5CUVVNc1NVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF5eERRVUZETEVOQlFVTTdPMEZCUlc1Q0xFdEJRVXNzU1VGQlNTeERRVUZETEc5Q1FVRnZRaXhEUVVGRExFMUJRVTBzUlVGQlJTeFBRVUZQTEVOQlFVTXNVVUZCVVN4RlFVRkZMRU5CUVVNc1JVRkJSU3hGUVVGRkxFVkJRVVVzUTBGQlF5eERRVUZETEVOQlFVTTdPMEZCUlc1RkxFbEJRVWs3UVVGRFNqdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wVkJSVVVzV1VGQldTeDFRa0ZCZFVJN1NVRkRha01zU1VGQlNTeERRVUZETEc5Q1FVRnZRaXhEUVVGRExFbEJRVWtzUTBGQlF5eG5Ra0ZCWjBJc1EwRkJReXhOUVVGTkxFTkJRVU1zUlVGQlJTeFBRVUZQTEVOQlFVTXNUVUZCVFN4RlFVRkZPMDFCUTNaRkxGbEJRVmtzUlVGQlJTeEpRVUZKTEVOQlFVTXNjVUpCUVhGQ0xFTkJRVU1zVDBGQlR5eERRVUZETzAxQlEycEVMRVZCUVVVc1JVRkJSU3hKUVVGSkxFTkJRVU1zUlVGQlJUdE5RVU5ZTEVsQlFVa3NSVUZCUlN4SlFVRkpPMHRCUTFnc1EwRkJReXhEUVVGRE8wRkJRMUFzUjBGQlJ6czdSVUZGUkN4WFFVRlhMSFZDUVVGMVFqdEpRVU5vUXl4SlFVRkpMRU5CUVVNc2IwSkJRVzlDTEVOQlFVTXNTVUZCU1N4RFFVRkRMR2RDUVVGblFpeERRVUZETEV0QlFVc3NRMEZCUXl4RlFVRkZMRTlCUVU4c1EwRkJReXhOUVVGTkxFVkJRVVU3VFVGRGRFVXNXVUZCV1N4RlFVRkZMRWxCUVVrc1EwRkJReXh4UWtGQmNVSXNRMEZCUXl4UFFVRlBMRU5CUVVNN1RVRkRha1FzUlVGQlJTeEZRVUZGTEVsQlFVa3NRMEZCUXl4RlFVRkZPMDFCUTFnc1NVRkJTU3hGUVVGRkxFbEJRVWs3UzBGRFdDeERRVUZETEVOQlFVTTdRVUZEVUN4SFFVRkhPenRGUVVWRUxHTkJRV01zYVVKQlFXbENPMGxCUXpkQ0xFbEJRVWtzUlVGQlJTeEhRVUZITEVsQlFVa3NUVUZCVFN4RFFVRkRMRWRCUVVjc1NVRkJTU3hEUVVGRExFOUJRVThzVVVGQlVTeERRVUZETzBGQlEyaEVMRkZCUVZFc1JVRkJSU3hIUVVGSExFVkJRVVVzUTBGQlF5eEpRVUZKTEVOQlFVTXNUMEZCVHl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03TzBsQlJUZENMRWxCUVVrc1EwRkJReXh2UWtGQmIwSXNRMEZCUXl4SlFVRkpMRU5CUVVNc1owSkJRV2RDTEVOQlFVTXNVVUZCVVN4RFFVRkRMRVZCUVVVc1QwRkJUeXhEUVVGRExFMUJRVTBzUlVGQlJUdE5RVU42UlN4WlFVRlpMRVZCUVVVc1NVRkJTU3hEUVVGRExIRkNRVUZ4UWl4RFFVRkRMRTlCUVU4c1EwRkJRenROUVVOcVJDeEZRVUZGTEVWQlFVVXNSVUZCUlR0TFFVTlFMRU5CUVVNc1EwRkJRenRCUVVOUUxFZEJRVWM3TzBWQlJVUXNZVUZCWVN4SlFVRkpPMGxCUTJZc1NVRkJTU3hEUVVGRExGVkJRVlVzUTBGQlF5eEpRVUZKTEVOQlFVTXNUMEZCVHl4RlFVRkZMRU5CUVVNc1RVRkJUU3hEUVVGRExFVkJRVVVzU1VGQlNTeERRVUZETEZsQlFWa3NRMEZCUXl4RFFVRkRPMEZCUXk5RUxFZEJRVWM3TzBWQlJVUXNaVUZCWlN4SlFVRkpPMGxCUTJwQ0xFbEJRVWtzUTBGQlF5eFpRVUZaTEVOQlFVTXNTVUZCU1N4RFFVRkRMRTlCUVU4c1JVRkJSU3hEUVVGRExFMUJRVTBzUTBGQlF5eEZRVUZGTEVsQlFVa3NRMEZCUXl4WlFVRlpMRU5CUVVNc1EwRkJRenRCUVVOcVJTeEhRVUZIT3p0RlFVVkVMR3RDUVVGclFpeE5RVUZOTzBsQlEzUkNMRWxCUVVrc1EwRkJReXhEUVVGRExFTkJRVU1zVDBGQlR5eERRVUZETEVkQlFVY3NRMEZCUXl4RlFVRkZPMDFCUTI1Q0xFZEJRVWNzUjBGQlJ5eERRVUZETEVkQlFVY3NRMEZCUXl4RFFVRkRPMEZCUTJ4Q0xFdEJRVXM3TzBsQlJVUXNTVUZCU1N4UlFVRlJMRWRCUVVjc1EwRkJReXhEUVVGRExFZEJRVWNzUTBGQlF5eEhRVUZITEVWQlFVVXNSVUZCUlN4SlFVRkpMRWRCUVVjc1NVRkJTU3hEUVVGRExFOUJRVThzU1VGQlNTeEZRVUZGTEVWQlFVVXNRMEZCUXl4RFFVRkRPMGxCUTNwRUxFbEJRVWtzUTBGQlF5eFZRVUZWTEVOQlFVTXNVVUZCVVN4RlFVRkZMRU5CUVVNc1MwRkJTeXhEUVVGRExFVkJRVVVzU1VGQlNTeERRVUZETEZkQlFWY3NRMEZCUXl4RFFVRkRPMGxCUTNKRUxFbEJRVWtzUTBGQlF5eFZRVUZWTEVOQlFVTXNVVUZCVVN4RlFVRkZMRU5CUVVNc1VVRkJVU3hEUVVGRExFVkJRVVVzU1VGQlNTeERRVUZETEdOQlFXTXNRMEZCUXl4RFFVRkRPMEZCUXk5RUxFZEJRVWM3TzBWQlJVUXNiMEpCUVc5Q0xFMUJRVTA3U1VGRGVFSXNTVUZCU1N4RFFVRkRMRU5CUVVNc1EwRkJReXhQUVVGUExFTkJRVU1zUjBGQlJ5eERRVUZETEVWQlFVVTdUVUZEYmtJc1IwRkJSeXhIUVVGSExFTkJRVU1zUjBGQlJ5eERRVUZETEVOQlFVTTdRVUZEYkVJc1MwRkJTenM3U1VGRlJDeEpRVUZKTEZGQlFWRXNSMEZCUnl4RFFVRkRMRU5CUVVNc1IwRkJSeXhEUVVGRExFZEJRVWNzUlVGQlJTeEZRVUZGTEVsQlFVa3NSMEZCUnl4SlFVRkpMRU5CUVVNc1QwRkJUeXhKUVVGSkxFVkJRVVVzUlVGQlJTeERRVUZETEVOQlFVTTdTVUZEZWtRc1NVRkJTU3hEUVVGRExGbEJRVmtzUTBGQlF5eFJRVUZSTEVWQlFVVXNRMEZCUXl4TFFVRkxMRU5CUVVNc1JVRkJSU3hKUVVGSkxFTkJRVU1zVjBGQlZ5eERRVUZETEVOQlFVTTdTVUZEZGtRc1NVRkJTU3hEUVVGRExGbEJRVmtzUTBGQlF5eFJRVUZSTEVWQlFVVXNRMEZCUXl4UlFVRlJMRU5CUVVNc1JVRkJSU3hKUVVGSkxFTkJRVU1zWTBGQll5eERRVUZETEVOQlFVTTdRVUZEYWtVc1IwRkJSenM3UVVGRlNDeERRVUZET3p0QlFVVkVMRTFCUVUwc1EwRkJReXhQUVVGUExFZEJRVWNzVVVGQlVTeERRVUZESWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaUozVnpaU0J6ZEhKcFkzUW5PMXh1WEc1MllYSWdYeUE5SUhKbGNYVnBjbVVvSjJ4dlpHRnphQ2NwTzF4dVhHNTJZWElnZFhWcFpDQTlJSEpsY1hWcGNtVW9KMjV2WkdVdGRYVnBaQ2NwTzF4dVhHNTJZWElnYTBGamRHbHZibk1nUFNCeVpYRjFhWEpsS0NjdUxpOWpiMjV6ZEdGdWRITXZZV04wYVc5dWN5Y3BPMXh1ZG1GeUlHdFRkR0YwWlhNZ1BTQnlaWEYxYVhKbEtDY3VMaTlqYjI1emRHRnVkSE12YzNSaGRHVnpKeWs3WEc1Y2JuWmhjaUJoYW1GNElEMGdjbVZ4ZFdseVpTZ25MaTR2WTI5dGJXOXVMMkZxWVhnbktUdGNiblpoY2lCdFpYUmxjbVZrUjBWVUlEMGdjbVZ4ZFdseVpTZ25MaTR2WTI5dGJXOXVMMjFsZEdWeVpXUXRjbVZ4ZFdWemRDY3BMbWRsZER0Y2JseHVkbUZ5SUVKaGMyVkJZM1JwYjI0Z1BTQnlaWEYxYVhKbEtDY3VMMkpoYzJVbktUdGNibHh1WTJ4aGMzTWdRMUpWUkVKaGMyVWdaWGgwWlc1a2N5QkNZWE5sUVdOMGFXOXVJSHRjYmx4dUlDQmpiMjV6ZEhKMVkzUnZjaUFvWW1GelpWVlNUQ3dnWVdOMGFXOXVUMkpxWldOMFNXUXBJSHRjYmlBZ0lDQnpkWEJsY2lncE8xeHVJQ0FnSUhSb2FYTXVZbUZ6WlZWU1RDQTlJR0poYzJWVlVrdzdYRzRnSUNBZ2RHaHBjeTVoWTNScGIyNVBZbXBsWTNSSlpDQTlJR0ZqZEdsdmJrOWlhbVZqZEVsa08xeHVYRzRnSUNBZ0x5OGdaWGh3YkdsamFYUnNlU0JpYVc1a0lHaGhibVJzWlhKeklHWnZjaUIzWldJZ2MyOWphMlYwSUdWMlpXNTBjMXh1SUNBZ0lGOHVZbWx1WkVGc2JDaDBhR2x6TENBblgyOXVVRzl6ZEVWMlpXNTBKeXdnSjE5dmJsQjFkRVYyWlc1MEp5d2dKMTl2YmtSbGJHVjBaVVYyWlc1MEp5azdYRzRnSUgxY2JseHVJQ0JmWVdOMGFXOXVSbTl5VFdWMGFHOWtLRzFsZEdodlpDa2dlMXh1SUNBZ0lISmxkSFZ5YmlCclFXTjBhVzl1YzF0MGFHbHpMbUZqZEdsdmJrOWlhbVZqZEVsa0lDc2dKMThuSUNzZ2JXVjBhRzlrWFR0Y2JpQWdmVnh1WEc0Z0lDOHFLbHh1SUNBZ0tpQkhSVlFnYkdsemRDQnZaaUJ5WlhOdmRYSmpaWE5jYmlBZ0lDb2dRRzFsZEdodlpGeHVJQ0FnS2k5Y2JpQWdJR2RsZEVGc2JDZ3BJSHRjYmlBZ0lDQWdkbUZ5SUdGamRHbHZiaUE5SUhSb2FYTXVYMkZqZEdsdmJrWnZjazFsZEdodlpDZ25SMFZVUVV4TUp5azdYRzRnSUNBZ0lHMWxkR1Z5WldSSFJWUW9YRzRnSUNBZ0lDQWdkR2hwY3k1aVlYTmxWVkpNTEZ4dUlDQWdJQ0FnSUNncElEMCtJSFJvYVhNdVpHbHpjR0YwWTJoVFpYSjJaWEpCWTNScGIyNG9ZV04wYVc5dUxDQnJVM1JoZEdWekxreFBRVVJKVGtjcExGeHVJQ0FnSUNBZ0lHUmhkR0VnUFQ0Z2RHaHBjeTVrYVhOd1lYUmphRk5sY25abGNrRmpkR2x2YmloaFkzUnBiMjRzSUd0VGRHRjBaWE11VTFsT1EwVkVMQ0JrWVhSaEtTeGNiaUFnSUNBZ0lDQmxjbklnUFQ0Z2RHaHBjeTVrYVhOd1lYUmphRk5sY25abGNrRmpkR2x2YmloaFkzUnBiMjRzSUd0VGRHRjBaWE11UlZKU1QxSkZSQ3dnWlhKeUtWeHVJQ0FnSUNBcE8xeHVJQ0FnZlZ4dVhHNGdJQ0F2S2lwY2JpQWdJQ0FxSUZCUFUxUWdLR055WldGMFpTa2dibVYzSUhKbGMyOTFjbU5sWEc0Z0lDQWdLaUJBYldWMGFHOWtYRzRnSUNBZ0tpQkFjbVYwZFhKdWN5QmpiR2xsYm5RZ1oyVnVaWEpoZEdWa0lGVlZTVVFnYjJZZ2RHaGxJRzVsZHlCeVpYTnZkWEpqWlZ4dUlDQWdJQ292WEc0Z0lDQndiM04wS0hCaGVXeHZZV1FwSUh0Y2JseHVJQ0FnSUNCMllYSWdZV04wYVc5dUlEMGdkR2hwY3k1ZllXTjBhVzl1Um05eVRXVjBhRzlrS0NkUVQxTlVKeWs3WEc1Y2JpQWdJQ0FnY0dGNWJHOWhaQzVwWkNBOUlIVjFhV1F1ZGpFb0tUdGNibHh1SUNBZ0lDQmhhbUY0S0h0Y2JpQWdJQ0FnSUNCMWNtdzZJSFJvYVhNdVltRnpaVlZTVEN4Y2JpQWdJQ0FnSUNCMGVYQmxPaUJjSWxCUFUxUmNJaXhjYmlBZ0lDQWdJQ0JrWVhSaE9pQndZWGxzYjJGa0xGeHVJQ0FnSUNBZ0lHRmpZMlZ3ZEhNNklIdGNiaUFnSUNBZ0lDQWdJQ2RxYzI5dUp6b2dYQ0poY0hCc2FXTmhkR2x2Ymk5cWMyOXVYQ0lzWEc0Z0lDQWdJQ0FnSUNBbmRHVjRkQ2M2SUNkMFpYaDBMM0JzWVdsdUoxeHVJQ0FnSUNBZ0lIMWNiaUFnSUNBZ2ZTbGNiaUFnSUNBZ0xuUm9aVzRvWm5WdVkzUnBiMjRnS0dSaGRHRXBJSHRjYmlBZ0lDQWdJQ0IwYUdsekxtUnBjM0JoZEdOb1UyVnlkbVZ5UVdOMGFXOXVLR0ZqZEdsdmJpd2dhMU4wWVhSbGN5NVRXVTVEUlVRc0lHUmhkR0VwTzF4dUlDQWdJQ0I5TG1KcGJtUW9kR2hwY3lrcFhHNGdJQ0FnSUM1allYUmphQ2htZFc1amRHbHZiaUFvWlhKeUtTQjdYRzRnSUNBZ0lDQWdkR2hwY3k1a2FYTndZWFJqYUZObGNuWmxja0ZqZEdsdmJpaGhZM1JwYjI0c0lHdFRkR0YwWlhNdVJWSlNUMUpGUkN3Z1pYSnlLVHRjYmlBZ0lDQWdmUzVpYVc1a0tIUm9hWE1wS1R0Y2JseHVJQ0FnSUNCMGFHbHpMbVJwYzNCaGRHTm9VMlZ5ZG1WeVFXTjBhVzl1S0dGamRHbHZiaXdnYTFOMFlYUmxjeTVPUlZjc0lIQmhlV3h2WVdRcE8xeHVYRzRnSUNBZ0lISmxkSFZ5YmlCd1lYbHNiMkZrTG1sa08xeHVJQ0FnZlZ4dVhHNGdJQ0F2S2lwY2JpQWdJQ0FxSUVkRlZDQmhJSE5wYm1kc1pTQnlaWE52ZFhKalpWeHVJQ0FnSUNvZ1FHMWxkR2h2WkZ4dUlDQWdJQ292WEc0Z0lDQm5aWFFvYVdRcElIdGNiaUFnSUNBZ2RtRnlJR0ZqZEdsdmJpQTlJSFJvYVhNdVgyRmpkR2x2YmtadmNrMWxkR2h2WkNnblIwVlVUMDVGSnlrN1hHNGdJQ0FnSUcxbGRHVnlaV1JIUlZRb1hHNGdJQ0FnSUNBZ1lDUjdkR2hwY3k1aVlYTmxWVkpNZlM4a2UybGtmV0FzWEc0Z0lDQWdJQ0FnS0NrZ1BUNGdkR2hwY3k1a2FYTndZWFJqYUZObGNuWmxja0ZqZEdsdmJpaGhZM1JwYjI0c0lHdFRkR0YwWlhNdVRFOUJSRWxPUnl3Z2UybGtPaUJwWkgwcExGeHVJQ0FnSUNBZ0lHUmhkR0VnUFQ0Z2RHaHBjeTVrYVhOd1lYUmphRk5sY25abGNrRmpkR2x2YmloaFkzUnBiMjRzSUd0VGRHRjBaWE11VTFsT1EwVkVMQ0JrWVhSaEtTeGNiaUFnSUNBZ0lDQmxjbklnUFQ0Z2RHaHBjeTVrYVhOd1lYUmphRk5sY25abGNrRmpkR2x2YmloaFkzUnBiMjRzSUd0VGRHRjBaWE11UlZKU1QxSkZSQ3dnWlhKeUtWeHVJQ0FnSUNBcE8xeHVJQ0FnZlZ4dVhHNGdJQ0F2S2lwY2JpQWdJQ0FxSUZCVlZDQW9kWEJrWVhSbEtTQmhJSEpsYzI5MWNtTmxYRzRnSUNBZ0tpQkFiV1YwYUc5a1hHNGdJQ0FnS2k5Y2JpQWdJSEIxZENocFpDd2djR0Y1Ykc5aFpDa2dlMXh1SUNBZ0lDQjJZWElnWVdOMGFXOXVJRDBnZEdocGN5NWZZV04wYVc5dVJtOXlUV1YwYUc5a0tDZFFWVlFuS1R0Y2JpQWdJQ0FnWVdwaGVDaDdYRzRnSUNBZ0lDQWdkWEpzT2lCZ0pIdDBhR2x6TG1KaGMyVlZVa3g5THlSN2FXUjlZQ3hjYmlBZ0lDQWdJQ0IwZVhCbE9pQmNJbEJWVkZ3aUxGeHVJQ0FnSUNBZ0lHUmhkR0U2SUhCaGVXeHZZV1FzWEc0Z0lDQWdJQ0FnWVdOalpYQjBjem9nZTF4dUlDQWdJQ0FnSUNBZ0oycHpiMjRuT2lCY0ltRndjR3hwWTJGMGFXOXVMMnB6YjI1Y0lpeGNiaUFnSUNBZ0lDQWdJQ2QwWlhoMEp6b2dKM1JsZUhRdmNHeGhhVzRuWEc0Z0lDQWdJQ0FnZlZ4dUlDQWdJQ0I5S1Z4dUlDQWdJQ0F1ZEdobGJpaG1kVzVqZEdsdmJpQW9aR0YwWVNrZ2UxeHVJQ0FnSUNBZ0lIUm9hWE11WkdsemNHRjBZMmhUWlhKMlpYSkJZM1JwYjI0b1lXTjBhVzl1TENCclUzUmhkR1Z6TGxOWlRrTkZSQ3dnWkdGMFlTazdYRzRnSUNBZ0lIMHVZbWx1WkNoMGFHbHpLU2xjYmlBZ0lDQWdMbU5oZEdOb0tHWjFibU4wYVc5dUlDaGxjbklwSUh0Y2JpQWdJQ0FnSUNCMGFHbHpMbVJwYzNCaGRHTm9VMlZ5ZG1WeVFXTjBhVzl1S0dGamRHbHZiaXdnYTFOMFlYUmxjeTVGVWxKUFVrVkVMQ0JsY25JcE8xeHVJQ0FnSUNCOUxtSnBibVFvZEdocGN5a3BPMXh1WEc0Z0lDQWdJSFJvYVhNdVpHbHpjR0YwWTJoVFpYSjJaWEpCWTNScGIyNG9ZV04wYVc5dUxDQnJVM1JoZEdWekxsTkJWa2xPUnl3Z2NHRjViRzloWkNrN1hHNGdJQ0I5WEc1Y2JpQWdJQzhxS2x4dUlDQWdJQ29nUkVWTVJWUkZJR0VnY21WemIzVnlZMlZjYmlBZ0lDQXFJRUJ0WlhSb2IyUmNiaUFnSUNBcUwxeHVJQ0FnWkdWc1pYUmxLR2xrS1NCN1hHNGdJQ0FnSUhaaGNpQmhZM1JwYjI0Z1BTQjBhR2x6TGw5aFkzUnBiMjVHYjNKTlpYUm9iMlFvSjBSRlRFVlVSU2NwTzF4dUlDQWdJQ0JoYW1GNEtIdGNiaUFnSUNBZ0lDQjFjbXc2SUdBa2UzUm9hWE11WW1GelpWVlNUSDB2Skh0cFpIMWdMRnh1SUNBZ0lDQWdJSFI1Y0dVNklGd2lSRVZNUlZSRlhDSXNYRzRnSUNBZ0lDQWdZV05qWlhCMGN6b2dlMXh1SUNBZ0lDQWdJQ0FnSjJwemIyNG5PaUJjSW1Gd2NHeHBZMkYwYVc5dUwycHpiMjVjSWl4Y2JpQWdJQ0FnSUNBZ0lDZDBaWGgwSnpvZ0ozUmxlSFF2Y0d4aGFXNG5YRzRnSUNBZ0lDQWdmVnh1SUNBZ0lDQjlLVnh1SUNBZ0lDQXVkR2hsYmlobWRXNWpkR2x2YmlBb1pHRjBZU2tnZTF4dUlDQWdJQ0FnSUhSb2FYTXVaR2x6Y0dGMFkyaFRaWEoyWlhKQlkzUnBiMjRvWVdOMGFXOXVMQ0JyVTNSaGRHVnpMbE5aVGtORlJDd2daR0YwWVNrN1hHNGdJQ0FnSUgwdVltbHVaQ2gwYUdsektTbGNiaUFnSUNBZ0xtTmhkR05vS0daMWJtTjBhVzl1SUNobGNuSXBJSHRjYmlBZ0lDQWdJQ0IwYUdsekxtUnBjM0JoZEdOb1UyVnlkbVZ5UVdOMGFXOXVLR0ZqZEdsdmJpd2dhMU4wWVhSbGN5NUZVbEpQVWtWRUxDQmxjbklwTzF4dUlDQWdJQ0I5TG1KcGJtUW9kR2hwY3lrcE8xeHVYRzRnSUNBZ0lIUm9hWE11WkdsemNHRjBZMmhUWlhKMlpYSkJZM1JwYjI0b1lXTjBhVzl1TENCclUzUmhkR1Z6TGtSRlRFVlVTVTVITENCN2FXUTZJR2xrZlNrN1hHNWNiaUFnSUgxY2JseHVYRzRnSUNBdktpcGNiaUFnSUNBcVhHNGdJQ0FnS2lBZ1UzVmljMk55YVhCMGFXOXVJRzFsZEdodlpITmNiaUFnSUNBcVhHNGdJQ0FnS2k5Y2JpQWdYMjl1VUc5emRFVjJaVzUwS0dWMlpXNTBMQ0JqYUdGdWJtVnNMQ0JrWVhSaEtTQjdYRzRnSUNBZ2RHaHBjeTVrYVhOd1lYUmphRk5sY25abGNrRmpkR2x2YmloMGFHbHpMbDloWTNScGIyNUdiM0pOWlhSb2IyUW9KMUJQVTFRbktTd2dhMU4wWVhSbGN5NVRXVTVEUlVRc0lIdGNiaUFnSUNBZ0lITjFZbk5qY21sd2RHbHZiam9nZEdocGN5NWZibTl5YldGc2FYcGxRMmhoYm01bGJFNWhiV1VvWTJoaGJtNWxiQ2tzWEc0Z0lDQWdJQ0JwWkRvZ1pHRjBZUzVwWkN4Y2JpQWdJQ0FnSUdSaGRHRTZJR1JoZEdGY2JpQWdJQ0I5S1R0Y2JpQWdmVnh1WEc0Z0lGOXZibEIxZEVWMlpXNTBLR1YyWlc1MExDQmphR0Z1Ym1Wc0xDQmtZWFJoS1NCN1hHNGdJQ0FnZEdocGN5NWthWE53WVhSamFGTmxjblpsY2tGamRHbHZiaWgwYUdsekxsOWhZM1JwYjI1R2IzSk5aWFJvYjJRb0oxQlZWQ2NwTENCclUzUmhkR1Z6TGxOWlRrTkZSQ3dnZTF4dUlDQWdJQ0FnYzNWaWMyTnlhWEIwYVc5dU9pQjBhR2x6TGw5dWIzSnRZV3hwZW1WRGFHRnVibVZzVG1GdFpTaGphR0Z1Ym1Wc0tTeGNiaUFnSUNBZ0lHbGtPaUJrWVhSaExtbGtMRnh1SUNBZ0lDQWdaR0YwWVRvZ1pHRjBZVnh1SUNBZ0lIMHBPMXh1SUNCOVhHNWNiaUFnWDI5dVJHVnNaWFJsUlhabGJuUW9aWFpsYm5Rc0lHTm9ZVzV1Wld3cElIdGNiaUFnSUNCMllYSWdjbVVnUFNCdVpYY2dVbVZuUlhod0tHQWtlM1JvYVhNdVltRnpaVlZTVEgwdktDNHJLU1JnS1N3Z0lDOHZJSEpsSUdadmNpQmxlSFJ5WVdOcGJtY2djbVZ6YjNWeVkyVWdhV1FnWm5KdmJTQmphR0Z1Ym1Wc1hHNGdJQ0FnSUNBZ0lHbGtJRDBnY21VdVpYaGxZeWhqYUdGdWJtVnNLVnN4WFR0Y2JseHVJQ0FnSUhSb2FYTXVaR2x6Y0dGMFkyaFRaWEoyWlhKQlkzUnBiMjRvZEdocGN5NWZZV04wYVc5dVJtOXlUV1YwYUc5a0tDZEVSVXhGVkVVbktTd2dhMU4wWVhSbGN5NVRXVTVEUlVRc0lIdGNiaUFnSUNBZ0lITjFZbk5qY21sd2RHbHZiam9nZEdocGN5NWZibTl5YldGc2FYcGxRMmhoYm01bGJFNWhiV1VvWTJoaGJtNWxiQ2tzWEc0Z0lDQWdJQ0JwWkRvZ2FXUmNiaUFnSUNCOUtUdGNiaUFnZlZ4dVhHNGdJSE4xWW5OamNtbGlaVXhwYzNRZ0tDa2dlMXh1SUNBZ0lIUm9hWE11WDNOMVluTmpjbWxpWlNoMGFHbHpMbUpoYzJWVlVrd3NJRnNuVUU5VFZDZGRMQ0IwYUdsekxsOXZibEJ2YzNSRmRtVnVkQ2s3WEc0Z0lIMWNibHh1SUNCMWJuTjFZbk5qY21saVpVeHBjM1FnS0NrZ2UxeHVJQ0FnSUhSb2FYTXVYM1Z1YzNWaWMyTnlhV0psS0hSb2FYTXVZbUZ6WlZWU1RDd2dXeWRRVDFOVUoxMHNJSFJvYVhNdVgyOXVVRzl6ZEVWMlpXNTBLVHRjYmlBZ2ZWeHVYRzRnSUhOMVluTmpjbWxpWlZKbGMyOTFjbU5sY3locFpITXBJSHRjYmlBZ0lDQnBaaUFvSVY4dWFYTkJjbkpoZVNocFpITXBLU0I3WEc0Z0lDQWdJQ0JwWkhNZ1BTQmJhV1J6WFR0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0IyWVhJZ1kyaGhibTVsYkhNZ1BTQmZMbTFoY0NocFpITXNJR2xrSUQwK0lHQWtlM1JvYVhNdVltRnpaVlZTVEgwdkpIdHBaSDFnS1R0Y2JpQWdJQ0IwYUdsekxsOXpkV0p6WTNKcFltVW9ZMmhoYm01bGJITXNJRnNuVUZWVUoxMHNJSFJvYVhNdVgyOXVVSFYwUlhabGJuUXBPMXh1SUNBZ0lIUm9hWE11WDNOMVluTmpjbWxpWlNoamFHRnVibVZzY3l3Z1d5ZEVSVXhGVkVVblhTd2dkR2hwY3k1ZmIyNUVaV3hsZEdWRmRtVnVkQ2s3WEc0Z0lIMWNibHh1SUNCMWJuTjFZbk5qY21saVpWSmxjMjkxY21ObGN5aHBaSE1wSUh0Y2JpQWdJQ0JwWmlBb0lWOHVhWE5CY25KaGVTaHBaSE1wS1NCN1hHNGdJQ0FnSUNCcFpITWdQU0JiYVdSelhUdGNiaUFnSUNCOVhHNWNiaUFnSUNCMllYSWdZMmhoYm01bGJITWdQU0JmTG0xaGNDaHBaSE1zSUdsa0lEMCtJR0FrZTNSb2FYTXVZbUZ6WlZWU1RIMHZKSHRwWkgxZ0tUdGNiaUFnSUNCMGFHbHpMbDkxYm5OMVluTmpjbWxpWlNoamFHRnVibVZzY3l3Z1d5ZFFWVlFuWFN3Z2RHaHBjeTVmYjI1UWRYUkZkbVZ1ZENrN1hHNGdJQ0FnZEdocGN5NWZkVzV6ZFdKelkzSnBZbVVvWTJoaGJtNWxiSE1zSUZzblJFVk1SVlJGSjEwc0lIUm9hWE11WDI5dVJHVnNaWFJsUlhabGJuUXBPMXh1SUNCOVhHNWNibjFjYmx4dWJXOWtkV3hsTG1WNGNHOXlkSE1nUFNCRFVsVkVRbUZ6WlR0Y2JpSmRmUT09IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgQ1JVREJhc2UgPSByZXF1aXJlKCcuL2NydWQtYmFzZScpO1xuXG4vKipcbiAqIEJhc2ljIENSVUQgYWN0aW9ucyBmb3IgYSBSRVNUZnVsIEpTT04gXCJyZXNvdXJjZVwiLiAgT3ZlcnJpZGluZyBcInBvc3RcIiBhbmQgXCJwdXRcIlxuICogdG8gY3JlYXRlIEpTT04gcGF5bG9hZCB0aGF0IHRoZSBlbmRwb2ludCBleHBlY3RzLlxuICovXG5cbmNsYXNzIEl0ZW1BY3Rpb25zIGV4dGVuZHMgQ1JVREJhc2Uge1xuXG4gIC8vIHNwZWNpZnkgdGhlIGJhc2VVUkwgYW5kIGFjdGlvbiBvYmplY3QgaWRlbnRpZmllciBmb3IgZGlzcGF0Y2hlc1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcignL2FwaS9pdGVtcycsICdJVEVNJyk7XG4gIH1cblxuICAvLyBkZWZpbmUgXCJjcmVhdGVcIiBqc29uIHBheWxvYWQgYXBwcm9wcmlhdGUgZm9yIHJlc291cmNlXG4gIHBvc3QgKGZpcnN0LCBsYXN0KSB7XG4gICAgdmFyIGRhdGEgPSB7XG4gICAgICBmaXJzdDogZmlyc3QsXG4gICAgICBsYXN0OiBsYXN0XG4gICAgfTtcbiAgICByZXR1cm4gc3VwZXIucG9zdChkYXRhKTtcbiAgfVxuXG4gIC8vIGRlZmluZSBcInVwZGF0ZVwiIGpzb24gcGF5bG9hZCBhcHByb3ByaWF0ZSBmb3IgcmVzb3VyY2VcbiAgcHV0IChpZCwgZmlyc3QsIGxhc3QpIHtcbiAgICB2YXIgZGF0YSA9IHtcbiAgICAgIGlkOiBpZCxcbiAgICAgIGZpcnN0OiBmaXJzdCxcbiAgICAgIGxhc3Q6IGxhc3RcbiAgICB9O1xuICAgIHN1cGVyLnB1dChpZCwgZGF0YSk7XG4gIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBJdGVtQWN0aW9ucygpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lMMVZ6WlhKekwyaGlkWEp5YjNkekwyUmxkaTlvWlhKdmEzVXZjbVZoWTNRdFpteDFlQzF6ZEdGeWRHVnlMM0IxWW14cFl5OXFZWFpoYzJOeWFYQjBjeTloWTNScGIyNXpMMmwwWlcxekxtcHpJaXdpYzI5MWNtTmxjeUk2V3lJdlZYTmxjbk12YUdKMWNuSnZkM012WkdWMkwyaGxjbTlyZFM5eVpXRmpkQzFtYkhWNExYTjBZWEowWlhJdmNIVmliR2xqTDJwaGRtRnpZM0pwY0hSekwyRmpkR2x2Ym5NdmFYUmxiWE11YW5NaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWtGQlFVRXNXVUZCV1N4RFFVRkRPenRCUVVWaUxFbEJRVWtzVVVGQlVTeEhRVUZITEU5QlFVOHNRMEZCUXl4aFFVRmhMRU5CUVVNc1EwRkJRenM3UVVGRmRFTTdRVUZEUVRzN1FVRkZRU3hIUVVGSE96dEJRVVZJTEUxQlFVMHNWMEZCVnl4VFFVRlRMRkZCUVZFc1EwRkJRenRCUVVOdVF6czdSVUZGUlN4WFFVRlhMRWRCUVVjN1NVRkRXaXhMUVVGTExFTkJRVU1zV1VGQldTeEZRVUZGTEUxQlFVMHNRMEZCUXl4RFFVRkRPMEZCUTJoRExFZEJRVWM3UVVGRFNEczdSVUZGUlN4SlFVRkpMR1ZCUVdVN1NVRkRha0lzU1VGQlNTeEpRVUZKTEVkQlFVYzdUVUZEVkN4TFFVRkxMRVZCUVVVc1MwRkJTenROUVVOYUxFbEJRVWtzUlVGQlJTeEpRVUZKTzB0QlExZ3NRMEZCUXp0SlFVTkdMRTlCUVU4c1MwRkJTeXhEUVVGRExFbEJRVWtzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXp0QlFVTTFRaXhIUVVGSE8wRkJRMGc3TzBWQlJVVXNSMEZCUnl4dFFrRkJiVUk3U1VGRGNFSXNTVUZCU1N4SlFVRkpMRWRCUVVjN1RVRkRWQ3hGUVVGRkxFVkJRVVVzUlVGQlJUdE5RVU5PTEV0QlFVc3NSVUZCUlN4TFFVRkxPMDFCUTFvc1NVRkJTU3hGUVVGRkxFbEJRVWs3UzBGRFdDeERRVUZETzBsQlEwWXNTMEZCU3l4RFFVRkRMRWRCUVVjc1EwRkJReXhGUVVGRkxFVkJRVVVzU1VGQlNTeERRVUZETEVOQlFVTTdRVUZEZUVJc1IwRkJSenM3UVVGRlNDeERRVUZET3p0QlFVVkVMRTFCUVUwc1EwRkJReXhQUVVGUExFZEJRVWNzU1VGQlNTeFhRVUZYTEVWQlFVVXNRMEZCUXlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklpZDFjMlVnYzNSeWFXTjBKenRjYmx4dWRtRnlJRU5TVlVSQ1lYTmxJRDBnY21WeGRXbHlaU2duTGk5amNuVmtMV0poYzJVbktUdGNibHh1THlvcVhHNGdLaUJDWVhOcFl5QkRVbFZFSUdGamRHbHZibk1nWm05eUlHRWdVa1ZUVkdaMWJDQktVMDlPSUZ3aWNtVnpiM1Z5WTJWY0lpNGdJRTkyWlhKeWFXUnBibWNnWENKd2IzTjBYQ0lnWVc1a0lGd2ljSFYwWENKY2JpQXFJSFJ2SUdOeVpXRjBaU0JLVTA5T0lIQmhlV3h2WVdRZ2RHaGhkQ0IwYUdVZ1pXNWtjRzlwYm5RZ1pYaHdaV04wY3k1Y2JpQXFMMXh1WEc1amJHRnpjeUJKZEdWdFFXTjBhVzl1Y3lCbGVIUmxibVJ6SUVOU1ZVUkNZWE5sSUh0Y2JseHVJQ0F2THlCemNHVmphV1o1SUhSb1pTQmlZWE5sVlZKTUlHRnVaQ0JoWTNScGIyNGdiMkpxWldOMElHbGtaVzUwYVdacFpYSWdabTl5SUdScGMzQmhkR05vWlhOY2JpQWdZMjl1YzNSeWRXTjBiM0lvS1NCN1hHNGdJQ0FnYzNWd1pYSW9KeTloY0drdmFYUmxiWE1uTENBblNWUkZUU2NwTzF4dUlDQjlYRzVjYmlBZ0x5OGdaR1ZtYVc1bElGd2lZM0psWVhSbFhDSWdhbk52YmlCd1lYbHNiMkZrSUdGd2NISnZjSEpwWVhSbElHWnZjaUJ5WlhOdmRYSmpaVnh1SUNCd2IzTjBJQ2htYVhKemRDd2diR0Z6ZENrZ2UxeHVJQ0FnSUhaaGNpQmtZWFJoSUQwZ2UxeHVJQ0FnSUNBZ1ptbHljM1E2SUdacGNuTjBMRnh1SUNBZ0lDQWdiR0Z6ZERvZ2JHRnpkRnh1SUNBZ0lIMDdYRzRnSUNBZ2NtVjBkWEp1SUhOMWNHVnlMbkJ2YzNRb1pHRjBZU2s3WEc0Z0lIMWNibHh1SUNBdkx5QmtaV1pwYm1VZ1hDSjFjR1JoZEdWY0lpQnFjMjl1SUhCaGVXeHZZV1FnWVhCd2NtOXdjbWxoZEdVZ1ptOXlJSEpsYzI5MWNtTmxYRzRnSUhCMWRDQW9hV1FzSUdacGNuTjBMQ0JzWVhOMEtTQjdYRzRnSUNBZ2RtRnlJR1JoZEdFZ1BTQjdYRzRnSUNBZ0lDQnBaRG9nYVdRc1hHNGdJQ0FnSUNCbWFYSnpkRG9nWm1seWMzUXNYRzRnSUNBZ0lDQnNZWE4wT2lCc1lYTjBYRzRnSUNBZ2ZUdGNiaUFnSUNCemRYQmxjaTV3ZFhRb2FXUXNJR1JoZEdFcE8xeHVJQ0I5WEc1Y2JuMWNibHh1Ylc5a2RXeGxMbVY0Y0c5eWRITWdQU0J1WlhjZ1NYUmxiVUZqZEdsdmJuTW9LVHRjYmlKZGZRPT0iLCIvKiogQG1vZHVsZSBhY3Rpb25zL3N0YXR1cyAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0L2FkZG9ucycpO1xuXG52YXIgQWN0aW9ucyA9IHJlcXVpcmUoJy4vYmFzZScpO1xuXG52YXIga0FjdGlvbnMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvYWN0aW9ucycpLFxuICAgIGtTdGF0ZXMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvc3RhdGVzJyk7XG5cbi8qKlxuICogT3ZlcmxheXMgYXJlIGJhc2ljIG1vZGFscyBvciBwb3B1cHMuICBWYXJpb3VzIGFsZXJ0cyBhbmQgY29uZmlybXMgYXJlIHByZWRlZmluZWQuXG4gKi9cblxuY2xhc3MgT3ZlcmxheXNBY3Rpb25zIGV4dGVuZHMgQWN0aW9ucyB7XG5cbiAgLyoqXG4gICAqIHB1c2ggbmV3IG92ZXJsYXkgY29tcG9uZW50IG9udG8gT3ZlcmxheSBzdGFja1xuICAgKiBAbWV0aG9kIHB1c2hcbiAgICovXG4gIHB1c2goY29tcG9uZW50KSB7XG4gICAgLy9jb25zb2xlLmRlYnVnKCdPdmVybGF5c0FjdGlvbnMucHVzaCcpO1xuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcbiAgICAgIHByb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGF0LmRpc3BhdGNoVmlld0FjdGlvbihrQWN0aW9ucy5PVkVSTEFZX1BVU0gsIGtTdGF0ZXMuU1lOQ0VELCB7Y29tcG9uZW50OiBjb21wb25lbnR9KTtcbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogcG9wIHRvcCBvdmVybGF5IGZyb20gT3ZlcmxheSBzdGFja1xuICAgKiBAbWV0aG9kIHBvcFxuICAgKi9cbiAgcG9wKCkge1xuICAgIC8vY29uc29sZS5kZWJ1ZygnT3ZlcmxheXNBY3Rpb25zLnBvcCcpO1xuICAgIHRoaXMuZGlzcGF0Y2hWaWV3QWN0aW9uKGtBY3Rpb25zLk9WRVJMQVlfUE9QLCBrU3RhdGVzLlNZTkNFRCwgbnVsbCk7XG4gIH1cblxuICAvKipcbiAgICogZGlzcGxheSBhIHNpbXBsZSAnYWxlcnQnIG1vZGFsXG4gICAqIEBtZXRob2QgYWxlcnRcbiAgICovXG4gIGFsZXJ0KHRpdGxlLCBtc2csIGFja0NhbGxiYWNrKSB7XG4gICAgdmFyIGFsZXJ0T3ZlcmxheSA9IFJlYWN0LmNyZWF0ZUZhY3RvcnkocmVxdWlyZSgnLi4vY29tcG9uZW50cy9vdmVybGF5cy9hbGVydC5qc3gnKSk7XG4gICAgcmV0dXJuIHRoaXMucHVzaChhbGVydE92ZXJsYXkoe1xuICAgICAgdGl0bGU6IHRpdGxlLFxuICAgICAgbXNnOiBtc2csXG4gICAgICBhY2tDYWxsYmFjazogYWNrQ2FsbGJhY2tcbiAgICB9LCBudWxsKSk7XG4gIH1cblxuICAvKipcbiAgICogZGlzcGxheSBhIHNpbXBsZSBtb2RhbCB3aXRoIGFuIGluZm9ybWF0aW9uYWwgbWVzc2FnZVxuICAgKiBAbWV0aG9kIGluZm9cbiAgICovXG4gIGluZm8obXNnLCB0aXRsZSkge1xuICAgIHJldHVybiB0aGlzLmFsZXJ0KHRpdGxlIHx8ICdJbmZvJywgbXNnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBkaXNwbGF5IGEgc2ltcGxlIG1vZGFsIHdpdGggYW4gZXJyb3IgbWVzc2FnZVxuICAgKiBAbWV0aG9kIGVycm9yXG4gICAqL1xuICBlcnJvcihtc2csIHRpdGxlKSB7XG4gICAgcmV0dXJuIHRoaXMuYWxlcnQodGl0bGUgfHwgJ0Vycm9yJywgbXNnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBkaXNwbGF5IGEgc2ltcGxlIG1vZGFsIHdpdGggYSB3YXJuaW5nIG1lc3NhZ2VcbiAgICogQG1ldGhvZCB3YXJuXG4gICAqL1xuICB3YXJuKG1zZywgdGl0bGUpIHtcbiAgICByZXR1cm4gdGhpcy5hbGVydCh0aXRsZSB8fCAnV2FybmluZycsIG1zZyk7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBkaXNwbGF5IGEgc2ltcGxlICdjb25maXJtJyBtb2RhbCB3aXRoIHllcy9ubyByZXNwb25zZXNcbiAgICogQG1ldGhvZCBjb25maXJtXG4gICAqL1xuICBjb25maXJtKHRpdGxlLCBtc2csIHllc0NhbGxiYWNrLCBub0NhbGxiYWNrKSB7XG4gICAgdmFyIGNvbmZpcm1PdmVybGF5ID0gUmVhY3QuY3JlYXRlRmFjdG9yeShyZXF1aXJlKCcuLi9jb21wb25lbnRzL292ZXJsYXlzL2NvbmZpcm0uanN4JykpO1xuICAgIHJldHVybiB0aGlzLnB1c2goY29uZmlybU92ZXJsYXkoe1xuICAgICAgdGl0bGU6IHRpdGxlLFxuICAgICAgbXNnOiBtc2csXG4gICAgICB5ZXNDYWxsYmFjazogeWVzQ2FsbGJhY2ssXG4gICAgICBub0NhbGxiYWNrOiBub0NhbGxiYWNrXG4gICAgfSwgbnVsbCkpO1xuICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgT3ZlcmxheXNBY3Rpb25zKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaUwxVnpaWEp6TDJoaWRYSnliM2R6TDJSbGRpOW9aWEp2YTNVdmNtVmhZM1F0Wm14MWVDMXpkR0Z5ZEdWeUwzQjFZbXhwWXk5cVlYWmhjMk55YVhCMGN5OWhZM1JwYjI1ekwyOTJaWEpzWVhsekxtcHpJaXdpYzI5MWNtTmxjeUk2V3lJdlZYTmxjbk12YUdKMWNuSnZkM012WkdWMkwyaGxjbTlyZFM5eVpXRmpkQzFtYkhWNExYTjBZWEowWlhJdmNIVmliR2xqTDJwaGRtRnpZM0pwY0hSekwyRmpkR2x2Ym5NdmIzWmxjbXhoZVhNdWFuTWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklrRkJRVUVzTmtKQlFUWkNPenRCUVVVM1FpeFpRVUZaTEVOQlFVTTdPMEZCUldJc1NVRkJTU3hMUVVGTExFZEJRVWNzVDBGQlR5eERRVUZETEdOQlFXTXNRMEZCUXl4RFFVRkRPenRCUVVWd1F5eEpRVUZKTEU5QlFVOHNSMEZCUnl4UFFVRlBMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU03TzBGQlJXaERMRWxCUVVrc1VVRkJVU3hIUVVGSExFOUJRVThzUTBGQlF5eHpRa0ZCYzBJc1EwRkJRenRCUVVNNVF5eEpRVUZKTEU5QlFVOHNSMEZCUnl4UFFVRlBMRU5CUVVNc2NVSkJRWEZDTEVOQlFVTXNRMEZCUXpzN1FVRkZOME03TzBGQlJVRXNSMEZCUnpzN1FVRkZTQ3hOUVVGTkxHVkJRV1VzVTBGQlV5eFBRVUZQTEVOQlFVTTdRVUZEZEVNN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRXNSVUZCUlN4SlFVRkpMRmxCUVZrN08wbEJSV1FzU1VGQlNTeEpRVUZKTEVkQlFVY3NTVUZCU1N4RFFVRkRPMGxCUTJoQ0xFOUJRVThzU1VGQlNTeFBRVUZQTEVOQlFVTXNWVUZCVlN4UFFVRlBMRVZCUVVVN1RVRkRjRU1zVDBGQlR5eERRVUZETEZGQlFWRXNRMEZCUXl4WlFVRlpPMUZCUXpOQ0xFbEJRVWtzUTBGQlF5eHJRa0ZCYTBJc1EwRkJReXhSUVVGUkxFTkJRVU1zV1VGQldTeEZRVUZGTEU5QlFVOHNRMEZCUXl4TlFVRk5MRVZCUVVVc1EwRkJReXhUUVVGVExFVkJRVVVzVTBGQlV5eERRVUZETEVOQlFVTXNRMEZCUXp0UlFVTjJSaXhQUVVGUExFVkJRVVVzUTBGQlF6dFBRVU5ZTEVOQlFVTXNRMEZCUXp0TFFVTktMRU5CUVVNc1EwRkJRenRCUVVOUUxFZEJRVWM3UVVGRFNEdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRU3hGUVVGRkxFZEJRVWNzUjBGQlJ6czdTVUZGU2l4SlFVRkpMRU5CUVVNc2EwSkJRV3RDTEVOQlFVTXNVVUZCVVN4RFFVRkRMRmRCUVZjc1JVRkJSU3hQUVVGUExFTkJRVU1zVFVGQlRTeEZRVUZGTEVsQlFVa3NRMEZCUXl4RFFVRkRPMEZCUTNoRkxFZEJRVWM3UVVGRFNEdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1JVRkZSU3hMUVVGTExEQkNRVUV3UWp0SlFVTTNRaXhKUVVGSkxGbEJRVmtzUjBGQlJ5eExRVUZMTEVOQlFVTXNZVUZCWVN4RFFVRkRMRTlCUVU4c1EwRkJReXhyUTBGQmEwTXNRMEZCUXl4RFFVRkRMRU5CUVVNN1NVRkRjRVlzVDBGQlR5eEpRVUZKTEVOQlFVTXNTVUZCU1N4RFFVRkRMRmxCUVZrc1EwRkJRenROUVVNMVFpeExRVUZMTEVWQlFVVXNTMEZCU3p0TlFVTmFMRWRCUVVjc1JVRkJSU3hIUVVGSE8wMUJRMUlzVjBGQlZ5eEZRVUZGTEZkQlFWYzdTMEZEZWtJc1JVRkJSU3hKUVVGSkxFTkJRVU1zUTBGQlF5eERRVUZETzBGQlEyUXNSMEZCUnp0QlFVTklPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEZRVVZGTEVsQlFVa3NZVUZCWVR0SlFVTm1MRTlCUVU4c1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eExRVUZMTEVsQlFVa3NUVUZCVFN4RlFVRkZMRWRCUVVjc1EwRkJReXhEUVVGRE8wRkJRelZETEVkQlFVYzdRVUZEU0R0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UlVGRlJTeExRVUZMTEdGQlFXRTdTVUZEYUVJc1QwRkJUeXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEV0QlFVc3NTVUZCU1N4UFFVRlBMRVZCUVVVc1IwRkJSeXhEUVVGRExFTkJRVU03UVVGRE4wTXNSMEZCUnp0QlFVTklPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEZRVVZGTEVsQlFVa3NZVUZCWVR0SlFVTm1MRTlCUVU4c1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eExRVUZMTEVsQlFVa3NVMEZCVXl4RlFVRkZMRWRCUVVjc1EwRkJReXhEUVVGRE8wRkJReTlETEVkQlFVYzdRVUZEU0R0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEZRVVZGTEU5QlFVOHNjME5CUVhORE8wbEJRek5ETEVsQlFVa3NZMEZCWXl4SFFVRkhMRXRCUVVzc1EwRkJReXhoUVVGaExFTkJRVU1zVDBGQlR5eERRVUZETEc5RFFVRnZReXhEUVVGRExFTkJRVU1zUTBGQlF6dEpRVU40Uml4UFFVRlBMRWxCUVVrc1EwRkJReXhKUVVGSkxFTkJRVU1zWTBGQll5eERRVUZETzAxQlF6bENMRXRCUVVzc1JVRkJSU3hMUVVGTE8wMUJRMW9zUjBGQlJ5eEZRVUZGTEVkQlFVYzdUVUZEVWl4WFFVRlhMRVZCUVVVc1YwRkJWenROUVVONFFpeFZRVUZWTEVWQlFVVXNWVUZCVlR0TFFVTjJRaXhGUVVGRkxFbEJRVWtzUTBGQlF5eERRVUZETEVOQlFVTTdRVUZEWkN4SFFVRkhPenRCUVVWSUxFTkJRVU03TzBGQlJVUXNUVUZCVFN4RFFVRkRMRTlCUVU4c1IwRkJSeXhKUVVGSkxHVkJRV1VzUlVGQlJTeERRVUZESWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaUx5b3FJRUJ0YjJSMWJHVWdZV04wYVc5dWN5OXpkR0YwZFhNZ0tpOWNibHh1SjNWelpTQnpkSEpwWTNRbk8xeHVYRzUyWVhJZ1VtVmhZM1FnUFNCeVpYRjFhWEpsS0NkeVpXRmpkQzloWkdSdmJuTW5LVHRjYmx4dWRtRnlJRUZqZEdsdmJuTWdQU0J5WlhGMWFYSmxLQ2N1TDJKaGMyVW5LVHRjYmx4dWRtRnlJR3RCWTNScGIyNXpJRDBnY21WeGRXbHlaU2duTGk0dlkyOXVjM1JoYm5SekwyRmpkR2x2Ym5NbktTeGNiaUFnSUNCclUzUmhkR1Z6SUQwZ2NtVnhkV2x5WlNnbkxpNHZZMjl1YzNSaGJuUnpMM04wWVhSbGN5Y3BPMXh1WEc0dktpcGNiaUFxSUU5MlpYSnNZWGx6SUdGeVpTQmlZWE5wWXlCdGIyUmhiSE1nYjNJZ2NHOXdkWEJ6TGlBZ1ZtRnlhVzkxY3lCaGJHVnlkSE1nWVc1a0lHTnZibVpwY20xeklHRnlaU0J3Y21Wa1pXWnBibVZrTGx4dUlDb3ZYRzVjYm1Oc1lYTnpJRTkyWlhKc1lYbHpRV04wYVc5dWN5QmxlSFJsYm1SeklFRmpkR2x2Ym5NZ2UxeHVYRzRnSUM4cUtseHVJQ0FnS2lCd2RYTm9JRzVsZHlCdmRtVnliR0Y1SUdOdmJYQnZibVZ1ZENCdmJuUnZJRTkyWlhKc1lYa2djM1JoWTJ0Y2JpQWdJQ29nUUcxbGRHaHZaQ0J3ZFhOb1hHNGdJQ0FxTDF4dUlDQndkWE5vS0dOdmJYQnZibVZ1ZENrZ2UxeHVJQ0FnSUM4dlkyOXVjMjlzWlM1a1pXSjFaeWduVDNabGNteGhlWE5CWTNScGIyNXpMbkIxYzJnbktUdGNiaUFnSUNCMllYSWdkR2hoZENBOUlIUm9hWE03WEc0Z0lDQWdjbVYwZFhKdUlHNWxkeUJRY205dGFYTmxLR1oxYm1OMGFXOXVJQ2h5WlhOdmJIWmxLU0I3WEc0Z0lDQWdJQ0J3Y205alpYTnpMbTVsZUhSVWFXTnJLR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0FnSUNBZ2RHaGhkQzVrYVhOd1lYUmphRlpwWlhkQlkzUnBiMjRvYTBGamRHbHZibk11VDFaRlVreEJXVjlRVlZOSUxDQnJVM1JoZEdWekxsTlpUa05GUkN3Z2UyTnZiWEJ2Ym1WdWREb2dZMjl0Y0c5dVpXNTBmU2s3WEc0Z0lDQWdJQ0FnSUhKbGMyOXNkbVVvS1R0Y2JpQWdJQ0FnSUgwcE8xeHVJQ0FnSUgwcE8xeHVJQ0I5WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJSEJ2Y0NCMGIzQWdiM1psY214aGVTQm1jbTl0SUU5MlpYSnNZWGtnYzNSaFkydGNiaUFnSUNvZ1FHMWxkR2h2WkNCd2IzQmNiaUFnSUNvdlhHNGdJSEJ2Y0NncElIdGNiaUFnSUNBdkwyTnZibk52YkdVdVpHVmlkV2NvSjA5MlpYSnNZWGx6UVdOMGFXOXVjeTV3YjNBbktUdGNiaUFnSUNCMGFHbHpMbVJwYzNCaGRHTm9WbWxsZDBGamRHbHZiaWhyUVdOMGFXOXVjeTVQVmtWU1RFRlpYMUJQVUN3Z2ExTjBZWFJsY3k1VFdVNURSVVFzSUc1MWJHd3BPMXh1SUNCOVhHNWNiaUFnTHlvcVhHNGdJQ0FxSUdScGMzQnNZWGtnWVNCemFXMXdiR1VnSjJGc1pYSjBKeUJ0YjJSaGJGeHVJQ0FnS2lCQWJXVjBhRzlrSUdGc1pYSjBYRzRnSUNBcUwxeHVJQ0JoYkdWeWRDaDBhWFJzWlN3Z2JYTm5MQ0JoWTJ0RFlXeHNZbUZqYXlrZ2UxeHVJQ0FnSUhaaGNpQmhiR1Z5ZEU5MlpYSnNZWGtnUFNCU1pXRmpkQzVqY21WaGRHVkdZV04wYjNKNUtISmxjWFZwY21Vb0p5NHVMMk52YlhCdmJtVnVkSE12YjNabGNteGhlWE12WVd4bGNuUXVhbk40SnlrcE8xeHVJQ0FnSUhKbGRIVnliaUIwYUdsekxuQjFjMmdvWVd4bGNuUlBkbVZ5YkdGNUtIdGNiaUFnSUNBZ0lIUnBkR3hsT2lCMGFYUnNaU3hjYmlBZ0lDQWdJRzF6WnpvZ2JYTm5MRnh1SUNBZ0lDQWdZV05yUTJGc2JHSmhZMnM2SUdGamEwTmhiR3hpWVdOclhHNGdJQ0FnZlN3Z2JuVnNiQ2twTzF4dUlDQjlYRzVjYmlBZ0x5b3FYRzRnSUNBcUlHUnBjM0JzWVhrZ1lTQnphVzF3YkdVZ2JXOWtZV3dnZDJsMGFDQmhiaUJwYm1admNtMWhkR2x2Ym1Gc0lHMWxjM05oWjJWY2JpQWdJQ29nUUcxbGRHaHZaQ0JwYm1adlhHNGdJQ0FxTDF4dUlDQnBibVp2S0cxelp5d2dkR2wwYkdVcElIdGNiaUFnSUNCeVpYUjFjbTRnZEdocGN5NWhiR1Z5ZENoMGFYUnNaU0I4ZkNBblNXNW1ieWNzSUcxelp5azdYRzRnSUgxY2JseHVJQ0F2S2lwY2JpQWdJQ29nWkdsemNHeGhlU0JoSUhOcGJYQnNaU0J0YjJSaGJDQjNhWFJvSUdGdUlHVnljbTl5SUcxbGMzTmhaMlZjYmlBZ0lDb2dRRzFsZEdodlpDQmxjbkp2Y2x4dUlDQWdLaTljYmlBZ1pYSnliM0lvYlhObkxDQjBhWFJzWlNrZ2UxeHVJQ0FnSUhKbGRIVnliaUIwYUdsekxtRnNaWEowS0hScGRHeGxJSHg4SUNkRmNuSnZjaWNzSUcxelp5azdYRzRnSUgxY2JseHVJQ0F2S2lwY2JpQWdJQ29nWkdsemNHeGhlU0JoSUhOcGJYQnNaU0J0YjJSaGJDQjNhWFJvSUdFZ2QyRnlibWx1WnlCdFpYTnpZV2RsWEc0Z0lDQXFJRUJ0WlhSb2IyUWdkMkZ5Ymx4dUlDQWdLaTljYmlBZ2QyRnliaWh0YzJjc0lIUnBkR3hsS1NCN1hHNGdJQ0FnY21WMGRYSnVJSFJvYVhNdVlXeGxjblFvZEdsMGJHVWdmSHdnSjFkaGNtNXBibWNuTENCdGMyY3BPMXh1SUNCOVhHNWNibHh1SUNBdktpcGNiaUFnSUNvZ1pHbHpjR3hoZVNCaElITnBiWEJzWlNBblkyOXVabWx5YlNjZ2JXOWtZV3dnZDJsMGFDQjVaWE12Ym04Z2NtVnpjRzl1YzJWelhHNGdJQ0FxSUVCdFpYUm9iMlFnWTI5dVptbHliVnh1SUNBZ0tpOWNiaUFnWTI5dVptbHliU2gwYVhSc1pTd2diWE5uTENCNVpYTkRZV3hzWW1GamF5d2dibTlEWVd4c1ltRmpheWtnZTF4dUlDQWdJSFpoY2lCamIyNW1hWEp0VDNabGNteGhlU0E5SUZKbFlXTjBMbU55WldGMFpVWmhZM1J2Y25rb2NtVnhkV2x5WlNnbkxpNHZZMjl0Y0c5dVpXNTBjeTl2ZG1WeWJHRjVjeTlqYjI1bWFYSnRMbXB6ZUNjcEtUdGNiaUFnSUNCeVpYUjFjbTRnZEdocGN5NXdkWE5vS0dOdmJtWnBjbTFQZG1WeWJHRjVLSHRjYmlBZ0lDQWdJSFJwZEd4bE9pQjBhWFJzWlN4Y2JpQWdJQ0FnSUcxelp6b2diWE5uTEZ4dUlDQWdJQ0FnZVdWelEyRnNiR0poWTJzNklIbGxjME5oYkd4aVlXTnJMRnh1SUNBZ0lDQWdibTlEWVd4c1ltRmphem9nYm05RFlXeHNZbUZqYTF4dUlDQWdJSDBzSUc1MWJHd3BLVHRjYmlBZ2ZWeHVYRzU5WEc1Y2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ2JtVjNJRTkyWlhKc1lYbHpRV04wYVc5dWN5Z3BPMXh1SWwxOSIsIid1c2Ugc3RyaWN0JztcblxudmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcblxudmFyIGtBY3Rpb25zID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2FjdGlvbnMnKTtcbnZhciBrU3RhdGVzID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL3N0YXRlcycpO1xuXG52YXIgbWV0ZXJlZEdFVCA9IHJlcXVpcmUoJy4uL2NvbW1vbi9tZXRlcmVkLXJlcXVlc3QnKS5nZXQ7XG5cbnZhciBCYXNlQWN0aW9uID0gcmVxdWlyZSgnLi9iYXNlJyk7XG5cbmNsYXNzIEl0ZW1BY3Rpb25zIGV4dGVuZHMgQmFzZUFjdGlvbiB7XG5cbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICAvLyBleHBsaWNpdGx5IGJpbmQgaGFuZGxlcnMgZm9yIHdlYiBzb2NrZXQgZXZlbnRzXG4gICAgXy5iaW5kQWxsKHRoaXMsICdfb25QdXQnKTtcbiAgfVxuXG4gIC8vIEdFVCB0aGUgdGltZSBvbiB0aGUgc2VydmVyXG4gIGdldFRpbWUoKSB7XG4gICAgbWV0ZXJlZEdFVChcbiAgICAgICcvYXBpL3NlcnZlcnRpbWUnLFxuICAgICAgKCkgPT4gdGhpcy5kaXNwYXRjaFNlcnZlckFjdGlvbihrQWN0aW9ucy5TRVJWRVJUSU1FX0dFVCwga1N0YXRlcy5MT0FESU5HKSxcbiAgICAgIGRhdGEgPT4gdGhpcy5kaXNwYXRjaFNlcnZlckFjdGlvbihrQWN0aW9ucy5TRVJWRVJUSU1FX0dFVCwga1N0YXRlcy5TWU5DRUQsIGRhdGEpLFxuICAgICAgZXJyID0+IHRoaXMuZGlzcGF0Y2hTZXJ2ZXJBY3Rpb24oa0FjdGlvbnMuU0VSVkVSVElNRV9HRVQsIGtTdGF0ZXMuRVJST1JFRCwgZXJyKVxuICAgICk7XG4gIH1cblxuXG4gLyoqXG4gICpcbiAgKiBTZXJ2ZXItdGltZSByZWFsLXRpbWUgc3Vic2NyaXB0aW9uIG1ldGhvZHNcbiAgKlxuICAqL1xuICBfb25QdXQgKGV2ZW50LCBjaGFubmVsLCBkYXRhKSB7XG4gICAgdGhpcy5kaXNwYXRjaFNlcnZlckFjdGlvbihrQWN0aW9ucy5TRVJWRVJUSU1FX1BVVCwga1N0YXRlcy5TWU5DRUQsIGRhdGEpO1xuICB9XG5cbiAgc3Vic2NyaWJlKCkge1xuICAgIHZhciBjaGFubmVscyA9IFsnL2FwaS9zZXJ2ZXJ0aW1lJ107XG4gICAgdGhpcy5fc3Vic2NyaWJlKGNoYW5uZWxzLCBbJ1BVVCddLCB0aGlzLl9vblB1dCk7XG4gIH1cblxuICB1bnN1YnNjcmliZSgpIHtcbiAgICB2YXIgY2hhbm5lbHMgPSBbJy9hcGkvc2VydmVydGltZSddO1xuICAgIHRoaXMuX3Vuc3Vic2NyaWJlKGNoYW5uZWxzLCBbJ1BVVCddLCB0aGlzLl9vblB1dCk7XG4gIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBJdGVtQWN0aW9ucygpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lMMVZ6WlhKekwyaGlkWEp5YjNkekwyUmxkaTlvWlhKdmEzVXZjbVZoWTNRdFpteDFlQzF6ZEdGeWRHVnlMM0IxWW14cFl5OXFZWFpoYzJOeWFYQjBjeTloWTNScGIyNXpMM05sY25abGNpMTBhVzFsTG1weklpd2ljMjkxY21ObGN5STZXeUl2VlhObGNuTXZhR0oxY25KdmQzTXZaR1YyTDJobGNtOXJkUzl5WldGamRDMW1iSFY0TFhOMFlYSjBaWEl2Y0hWaWJHbGpMMnBoZG1GelkzSnBjSFJ6TDJGamRHbHZibk12YzJWeWRtVnlMWFJwYldVdWFuTWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklrRkJRVUVzV1VGQldTeERRVUZET3p0QlFVVmlMRWxCUVVrc1EwRkJReXhIUVVGSExFOUJRVThzUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZCUXpzN1FVRkZNVUlzU1VGQlNTeFJRVUZSTEVkQlFVY3NUMEZCVHl4RFFVRkRMSE5DUVVGelFpeERRVUZETEVOQlFVTTdRVUZETDBNc1NVRkJTU3hQUVVGUExFZEJRVWNzVDBGQlR5eERRVUZETEhGQ1FVRnhRaXhEUVVGRExFTkJRVU03TzBGQlJUZERMRWxCUVVrc1ZVRkJWU3hIUVVGSExFOUJRVThzUTBGQlF5d3lRa0ZCTWtJc1EwRkJReXhEUVVGRExFZEJRVWNzUTBGQlF6czdRVUZGTVVRc1NVRkJTU3hWUVVGVkxFZEJRVWNzVDBGQlR5eERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRPenRCUVVWdVF5eE5RVUZOTEZkQlFWY3NVMEZCVXl4VlFVRlZMRU5CUVVNN08wVkJSVzVETEZkQlFWY3NTVUZCU1R0QlFVTnFRaXhKUVVGSkxFdEJRVXNzUlVGQlJTeERRVUZETzBGQlExbzdPMGxCUlVrc1EwRkJReXhEUVVGRExFOUJRVThzUTBGQlF5eEpRVUZKTEVWQlFVVXNVVUZCVVN4RFFVRkRMRU5CUVVNN1FVRkRPVUlzUjBGQlJ6dEJRVU5JT3p0RlFVVkZMRTlCUVU4c1IwRkJSenRKUVVOU0xGVkJRVlU3VFVGRFVpeHBRa0ZCYVVJN1RVRkRha0lzVFVGQlRTeEpRVUZKTEVOQlFVTXNiMEpCUVc5Q0xFTkJRVU1zVVVGQlVTeERRVUZETEdOQlFXTXNSVUZCUlN4UFFVRlBMRU5CUVVNc1QwRkJUeXhEUVVGRE8wMUJRM3BGTEVsQlFVa3NTVUZCU1N4SlFVRkpMRU5CUVVNc2IwSkJRVzlDTEVOQlFVTXNVVUZCVVN4RFFVRkRMR05CUVdNc1JVRkJSU3hQUVVGUExFTkJRVU1zVFVGQlRTeEZRVUZGTEVsQlFVa3NRMEZCUXp0TlFVTm9SaXhIUVVGSExFbEJRVWtzU1VGQlNTeERRVUZETEc5Q1FVRnZRaXhEUVVGRExGRkJRVkVzUTBGQlF5eGpRVUZqTEVWQlFVVXNUMEZCVHl4RFFVRkRMRTlCUVU4c1JVRkJSU3hIUVVGSExFTkJRVU03UzBGRGFFWXNRMEZCUXp0QlFVTk9MRWRCUVVjN1FVRkRTRHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMFZCUlVVc1RVRkJUU3gzUWtGQmQwSTdTVUZETlVJc1NVRkJTU3hEUVVGRExHOUNRVUZ2UWl4RFFVRkRMRkZCUVZFc1EwRkJReXhqUVVGakxFVkJRVVVzVDBGQlR5eERRVUZETEUxQlFVMHNSVUZCUlN4SlFVRkpMRU5CUVVNc1EwRkJRenRCUVVNM1JTeEhRVUZIT3p0RlFVVkVMRk5CUVZNc1IwRkJSenRKUVVOV0xFbEJRVWtzVVVGQlVTeEhRVUZITEVOQlFVTXNhVUpCUVdsQ0xFTkJRVU1zUTBGQlF6dEpRVU51UXl4SlFVRkpMRU5CUVVNc1ZVRkJWU3hEUVVGRExGRkJRVkVzUlVGQlJTeERRVUZETEV0QlFVc3NRMEZCUXl4RlFVRkZMRWxCUVVrc1EwRkJReXhOUVVGTkxFTkJRVU1zUTBGQlF6dEJRVU53UkN4SFFVRkhPenRGUVVWRUxGZEJRVmNzUjBGQlJ6dEpRVU5hTEVsQlFVa3NVVUZCVVN4SFFVRkhMRU5CUVVNc2FVSkJRV2xDTEVOQlFVTXNRMEZCUXp0SlFVTnVReXhKUVVGSkxFTkJRVU1zV1VGQldTeERRVUZETEZGQlFWRXNSVUZCUlN4RFFVRkRMRXRCUVVzc1EwRkJReXhGUVVGRkxFbEJRVWtzUTBGQlF5eE5RVUZOTEVOQlFVTXNRMEZCUXp0QlFVTjBSQ3hIUVVGSE96dEJRVVZJTEVOQlFVTTdPMEZCUlVRc1RVRkJUU3hEUVVGRExFOUJRVThzUjBGQlJ5eEpRVUZKTEZkQlFWY3NSVUZCUlN4RFFVRkRJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpSjNWelpTQnpkSEpwWTNRbk8xeHVYRzUyWVhJZ1h5QTlJSEpsY1hWcGNtVW9KMnh2WkdGemFDY3BPMXh1WEc1MllYSWdhMEZqZEdsdmJuTWdQU0J5WlhGMWFYSmxLQ2N1TGk5amIyNXpkR0Z1ZEhNdllXTjBhVzl1Y3ljcE8xeHVkbUZ5SUd0VGRHRjBaWE1nUFNCeVpYRjFhWEpsS0NjdUxpOWpiMjV6ZEdGdWRITXZjM1JoZEdWekp5azdYRzVjYm5aaGNpQnRaWFJsY21Wa1IwVlVJRDBnY21WeGRXbHlaU2duTGk0dlkyOXRiVzl1TDIxbGRHVnlaV1F0Y21WeGRXVnpkQ2NwTG1kbGREdGNibHh1ZG1GeUlFSmhjMlZCWTNScGIyNGdQU0J5WlhGMWFYSmxLQ2N1TDJKaGMyVW5LVHRjYmx4dVkyeGhjM01nU1hSbGJVRmpkR2x2Ym5NZ1pYaDBaVzVrY3lCQ1lYTmxRV04wYVc5dUlIdGNibHh1SUNCamIyNXpkSEoxWTNSdmNpQW9LU0I3WEc0Z0lDQWdjM1Z3WlhJb0tUdGNibHh1SUNBZ0lDOHZJR1Y0Y0d4cFkybDBiSGtnWW1sdVpDQm9ZVzVrYkdWeWN5Qm1iM0lnZDJWaUlITnZZMnRsZENCbGRtVnVkSE5jYmlBZ0lDQmZMbUpwYm1SQmJHd29kR2hwY3l3Z0oxOXZibEIxZENjcE8xeHVJQ0I5WEc1Y2JpQWdMeThnUjBWVUlIUm9aU0IwYVcxbElHOXVJSFJvWlNCelpYSjJaWEpjYmlBZ1oyVjBWR2x0WlNncElIdGNiaUFnSUNCdFpYUmxjbVZrUjBWVUtGeHVJQ0FnSUNBZ0p5OWhjR2t2YzJWeWRtVnlkR2x0WlNjc1hHNGdJQ0FnSUNBb0tTQTlQaUIwYUdsekxtUnBjM0JoZEdOb1UyVnlkbVZ5UVdOMGFXOXVLR3RCWTNScGIyNXpMbE5GVWxaRlVsUkpUVVZmUjBWVUxDQnJVM1JoZEdWekxreFBRVVJKVGtjcExGeHVJQ0FnSUNBZ1pHRjBZU0E5UGlCMGFHbHpMbVJwYzNCaGRHTm9VMlZ5ZG1WeVFXTjBhVzl1S0d0QlkzUnBiMjV6TGxORlVsWkZVbFJKVFVWZlIwVlVMQ0JyVTNSaGRHVnpMbE5aVGtORlJDd2daR0YwWVNrc1hHNGdJQ0FnSUNCbGNuSWdQVDRnZEdocGN5NWthWE53WVhSamFGTmxjblpsY2tGamRHbHZiaWhyUVdOMGFXOXVjeTVUUlZKV1JWSlVTVTFGWDBkRlZDd2dhMU4wWVhSbGN5NUZVbEpQVWtWRUxDQmxjbklwWEc0Z0lDQWdLVHRjYmlBZ2ZWeHVYRzVjYmlBdktpcGNiaUFnS2x4dUlDQXFJRk5sY25abGNpMTBhVzFsSUhKbFlXd3RkR2x0WlNCemRXSnpZM0pwY0hScGIyNGdiV1YwYUc5a2MxeHVJQ0FxWEc0Z0lDb3ZYRzRnSUY5dmJsQjFkQ0FvWlhabGJuUXNJR05vWVc1dVpXd3NJR1JoZEdFcElIdGNiaUFnSUNCMGFHbHpMbVJwYzNCaGRHTm9VMlZ5ZG1WeVFXTjBhVzl1S0d0QlkzUnBiMjV6TGxORlVsWkZVbFJKVFVWZlVGVlVMQ0JyVTNSaGRHVnpMbE5aVGtORlJDd2daR0YwWVNrN1hHNGdJSDFjYmx4dUlDQnpkV0p6WTNKcFltVW9LU0I3WEc0Z0lDQWdkbUZ5SUdOb1lXNXVaV3h6SUQwZ1d5Y3ZZWEJwTDNObGNuWmxjblJwYldVblhUdGNiaUFnSUNCMGFHbHpMbDl6ZFdKelkzSnBZbVVvWTJoaGJtNWxiSE1zSUZzblVGVlVKMTBzSUhSb2FYTXVYMjl1VUhWMEtUdGNiaUFnZlZ4dVhHNGdJSFZ1YzNWaWMyTnlhV0psS0NrZ2UxeHVJQ0FnSUhaaGNpQmphR0Z1Ym1Wc2N5QTlJRnNuTDJGd2FTOXpaWEoyWlhKMGFXMWxKMTA3WEc0Z0lDQWdkR2hwY3k1ZmRXNXpkV0p6WTNKcFltVW9ZMmhoYm01bGJITXNJRnNuVUZWVUoxMHNJSFJvYVhNdVgyOXVVSFYwS1R0Y2JpQWdmVnh1WEc1OVhHNWNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdibVYzSUVsMFpXMUJZM1JwYjI1ektDazdYRzRpWFgwPSIsIi8qKlxuICogIFdyYXBwZXIgZm9yICQuYWpheCgpIHRoYXQgcmV0dXJucyBFUzYgcHJvbWlzZXMgaW5zdGVhZFxuICogIG9mIGpRdWVyeSBwcm9taXNlcy5cbiAqICBAbW9kdWxlIGNvbW1vbi9hamF4XG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuXG52YXIgSFRUUEVycm9yID0gcmVxdWlyZSgnLi9odHRwLWVycm9yJyk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvcHRzKSB7XG4gIHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgJC5hamF4KG9wdHMpXG4gICAgLmRvbmUoZnVuY3Rpb24oZGF0YSkge1xuICAgICAgcmVzb2x2ZShkYXRhKTtcbiAgICB9KVxuICAgIC5mYWlsKGZ1bmN0aW9uKHhociwgc3RhdHVzLCBlcnIpIHtcbiAgICAgIHZhciByZXNwb25zZTtcbiAgICAgIGlmICh4aHIuc3RhdHVzID09PSAwICYmIHhoci5yZXNwb25zZVRleHQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXNwb25zZSA9IHtkZXRhaWw6J1Bvc3NpYmxlIENPUlMgZXJyb3I7IGNoZWNrIHlvdXIgYnJvd3NlciBjb25zb2xlIGZvciBmdXJ0aGVyIGRldGFpbHMnfTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICByZXNwb25zZSA9IHhoci5yZXNwb25zZUpTT047XG4gICAgICB9XG5cbiAgICAgIHJlamVjdChuZXcgSFRUUEVycm9yKG9wdHMudXJsLCB4aHIsIHN0YXR1cywgZXJyLCByZXNwb25zZSkpO1xuICAgIH0pO1xuICB9KTtcblxuICByZXR1cm4gcHJvbWlzZTtcbn07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaUwxVnpaWEp6TDJoaWRYSnliM2R6TDJSbGRpOW9aWEp2YTNVdmNtVmhZM1F0Wm14MWVDMXpkR0Z5ZEdWeUwzQjFZbXhwWXk5cVlYWmhjMk55YVhCMGN5OWpiMjF0YjI0dllXcGhlQzVxY3lJc0luTnZkWEpqWlhNaU9sc2lMMVZ6WlhKekwyaGlkWEp5YjNkekwyUmxkaTlvWlhKdmEzVXZjbVZoWTNRdFpteDFlQzF6ZEdGeWRHVnlMM0IxWW14cFl5OXFZWFpoYzJOeWFYQjBjeTlqYjIxdGIyNHZZV3BoZUM1cWN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaVFVRkJRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRXNSMEZCUnpzN1FVRkZTQ3haUVVGWkxFTkJRVU03TzBGQlJXSXNTVUZCU1N4RFFVRkRMRWRCUVVjc1QwRkJUeXhEUVVGRExGRkJRVkVzUTBGQlF5eERRVUZET3p0QlFVVXhRaXhKUVVGSkxGTkJRVk1zUjBGQlJ5eFBRVUZQTEVOQlFVTXNZMEZCWXl4RFFVRkRMRU5CUVVNN1FVRkRlRU03TzBGQlJVRXNUVUZCVFN4RFFVRkRMRTlCUVU4c1IwRkJSeXhUUVVGVExFbEJRVWtzUlVGQlJUdEZRVU01UWl4SlFVRkpMRTlCUVU4c1IwRkJSeXhKUVVGSkxFOUJRVThzUTBGQlF5eFRRVUZUTEU5QlFVOHNSVUZCUlN4TlFVRk5MRVZCUVVVN1NVRkRiRVFzUTBGQlF5eERRVUZETEVsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNN1MwRkRXQ3hKUVVGSkxFTkJRVU1zVTBGQlV5eEpRVUZKTEVWQlFVVTdUVUZEYmtJc1QwRkJUeXhEUVVGRExFbEJRVWtzUTBGQlF5eERRVUZETzB0QlEyWXNRMEZCUXp0TFFVTkVMRWxCUVVrc1EwRkJReXhUUVVGVExFZEJRVWNzUlVGQlJTeE5RVUZOTEVWQlFVVXNSMEZCUnl4RlFVRkZPMDFCUXk5Q0xFbEJRVWtzVVVGQlVTeERRVUZETzAxQlEySXNTVUZCU1N4SFFVRkhMRU5CUVVNc1RVRkJUU3hMUVVGTExFTkJRVU1zU1VGQlNTeEhRVUZITEVOQlFVTXNXVUZCV1N4TFFVRkxMRk5CUVZNc1JVRkJSVHRSUVVOMFJDeFJRVUZSTEVkQlFVY3NRMEZCUXl4TlFVRk5MRU5CUVVNc2NVVkJRWEZGTEVOQlFVTXNRMEZCUXp0UFFVTXpSanRYUVVOSk8xRkJRMGdzVVVGQlVTeEhRVUZITEVkQlFVY3NRMEZCUXl4WlFVRlpMRU5CUVVNN1FVRkRjRU1zVDBGQlR6czdUVUZGUkN4TlFVRk5MRU5CUVVNc1NVRkJTU3hUUVVGVExFTkJRVU1zU1VGQlNTeERRVUZETEVkQlFVY3NSVUZCUlN4SFFVRkhMRVZCUVVVc1RVRkJUU3hGUVVGRkxFZEJRVWNzUlVGQlJTeFJRVUZSTEVOQlFVTXNRMEZCUXl4RFFVRkRPMHRCUXpkRUxFTkJRVU1zUTBGQlF6dEJRVU5RTEVkQlFVY3NRMEZCUXl4RFFVRkRPenRGUVVWSUxFOUJRVThzVDBGQlR5eERRVUZETzBOQlEyaENMRU5CUVVNaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SXZLaXBjYmlBcUlDQlhjbUZ3Y0dWeUlHWnZjaUFrTG1GcVlYZ29LU0IwYUdGMElISmxkSFZ5Ym5NZ1JWTTJJSEJ5YjIxcGMyVnpJR2x1YzNSbFlXUmNiaUFxSUNCdlppQnFVWFZsY25rZ2NISnZiV2x6WlhNdVhHNGdLaUFnUUcxdlpIVnNaU0JqYjIxdGIyNHZZV3BoZUZ4dUlDb3ZYRzVjYmlkMWMyVWdjM1J5YVdOMEp6dGNibHh1ZG1GeUlDUWdQU0J5WlhGMWFYSmxLQ2RxY1hWbGNua25LVHRjYmx4dWRtRnlJRWhVVkZCRmNuSnZjaUE5SUhKbGNYVnBjbVVvSnk0dmFIUjBjQzFsY25KdmNpY3BPMXh1WEc1Y2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ1puVnVZM1JwYjI0b2IzQjBjeWtnZTF4dUlDQjJZWElnY0hKdmJXbHpaU0E5SUc1bGR5QlFjbTl0YVhObEtHWjFibU4wYVc5dUtISmxjMjlzZG1Vc0lISmxhbVZqZENrZ2UxeHVJQ0FnSUNRdVlXcGhlQ2h2Y0hSektWeHVJQ0FnSUM1a2IyNWxLR1oxYm1OMGFXOXVLR1JoZEdFcElIdGNiaUFnSUNBZ0lISmxjMjlzZG1Vb1pHRjBZU2s3WEc0Z0lDQWdmU2xjYmlBZ0lDQXVabUZwYkNobWRXNWpkR2x2YmloNGFISXNJSE4wWVhSMWN5d2daWEp5S1NCN1hHNGdJQ0FnSUNCMllYSWdjbVZ6Y0c5dWMyVTdYRzRnSUNBZ0lDQnBaaUFvZUdoeUxuTjBZWFIxY3lBOVBUMGdNQ0FtSmlCNGFISXVjbVZ6Y0c5dWMyVlVaWGgwSUQwOVBTQjFibVJsWm1sdVpXUXBJSHRjYmlBZ0lDQWdJQ0FnY21WemNHOXVjMlVnUFNCN1pHVjBZV2xzT2lkUWIzTnphV0pzWlNCRFQxSlRJR1Z5Y205eU95QmphR1ZqYXlCNWIzVnlJR0p5YjNkelpYSWdZMjl1YzI5c1pTQm1iM0lnWm5WeWRHaGxjaUJrWlhSaGFXeHpKMzA3WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdJQ0JsYkhObElIdGNiaUFnSUNBZ0lDQWdjbVZ6Y0c5dWMyVWdQU0I0YUhJdWNtVnpjRzl1YzJWS1UwOU9PMXh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0J5WldwbFkzUW9ibVYzSUVoVVZGQkZjbkp2Y2lodmNIUnpMblZ5YkN3Z2VHaHlMQ0J6ZEdGMGRYTXNJR1Z5Y2l3Z2NtVnpjRzl1YzJVcEtUdGNiaUFnSUNCOUtUdGNiaUFnZlNrN1hHNWNiaUFnY21WMGRYSnVJSEJ5YjIxcGMyVTdYRzU5TzF4dUlsMTkiLCIndXNlIHN0cmljdCc7XG5cbmNsYXNzIEhUVFBFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IodXJsLCB4aHIsIHN0YXR1cywgZXJyLCByZXNwb25zZSkge1xuICAgIHRoaXMudXJsID0gdXJsO1xuICAgIHRoaXMueGhyID0geGhyO1xuICAgIHRoaXMuc3RhdHVzID0gc3RhdHVzO1xuICAgIHRoaXMuZXJyb3IgPSBlcnI7XG4gICAgdGhpcy5yZXNwb25zZSA9IHJlc3BvbnNlO1xuICB9XG5cbiAgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIGAke3RoaXMuY29uc3RydWN0b3IubmFtZX0gKHN0YXR1cz0ke3RoaXMueGhyLnN0YXR1c30sIHVybD0ke3RoaXMudXJsfSlgO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gSFRUUEVycm9yO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lMMVZ6WlhKekwyaGlkWEp5YjNkekwyUmxkaTlvWlhKdmEzVXZjbVZoWTNRdFpteDFlQzF6ZEdGeWRHVnlMM0IxWW14cFl5OXFZWFpoYzJOeWFYQjBjeTlqYjIxdGIyNHZhSFIwY0MxbGNuSnZjaTVxY3lJc0luTnZkWEpqWlhNaU9sc2lMMVZ6WlhKekwyaGlkWEp5YjNkekwyUmxkaTlvWlhKdmEzVXZjbVZoWTNRdFpteDFlQzF6ZEdGeWRHVnlMM0IxWW14cFl5OXFZWFpoYzJOeWFYQjBjeTlqYjIxdGIyNHZhSFIwY0MxbGNuSnZjaTVxY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pUVVGQlFTeFpRVUZaTEVOQlFVTTdPMEZCUldJc1RVRkJUU3hUUVVGVExGTkJRVk1zUzBGQlN5eERRVUZETzBWQlF6VkNMRmRCUVZjc2EwTkJRV3RETzBsQlF6TkRMRWxCUVVrc1EwRkJReXhIUVVGSExFZEJRVWNzUjBGQlJ5eERRVUZETzBsQlEyWXNTVUZCU1N4RFFVRkRMRWRCUVVjc1IwRkJSeXhIUVVGSExFTkJRVU03U1VGRFppeEpRVUZKTEVOQlFVTXNUVUZCVFN4SFFVRkhMRTFCUVUwc1EwRkJRenRKUVVOeVFpeEpRVUZKTEVOQlFVTXNTMEZCU3l4SFFVRkhMRWRCUVVjc1EwRkJRenRKUVVOcVFpeEpRVUZKTEVOQlFVTXNVVUZCVVN4SFFVRkhMRkZCUVZFc1EwRkJRenRCUVVNM1FpeEhRVUZIT3p0RlFVVkVMRkZCUVZFc1IwRkJSenRKUVVOVUxFOUJRVThzUjBGQlJ5eEpRVUZKTEVOQlFVTXNWMEZCVnl4RFFVRkRMRWxCUVVrc1dVRkJXU3hKUVVGSkxFTkJRVU1zUjBGQlJ5eERRVUZETEUxQlFVMHNVMEZCVXl4SlFVRkpMRU5CUVVNc1IwRkJSeXhIUVVGSExFTkJRVU03UjBGRGFFWTdRVUZEU0N4RFFVRkRPenRCUVVWRUxFMUJRVTBzUTBGQlF5eFBRVUZQTEVkQlFVY3NVMEZCVXl4RFFVRkRJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpSjNWelpTQnpkSEpwWTNRbk8xeHVYRzVqYkdGemN5QklWRlJRUlhKeWIzSWdaWGgwWlc1a2N5QkZjbkp2Y2lCN1hHNGdJR052Ym5OMGNuVmpkRzl5S0hWeWJDd2dlR2h5TENCemRHRjBkWE1zSUdWeWNpd2djbVZ6Y0c5dWMyVXBJSHRjYmlBZ0lDQjBhR2x6TG5WeWJDQTlJSFZ5YkR0Y2JpQWdJQ0IwYUdsekxuaG9jaUE5SUhob2NqdGNiaUFnSUNCMGFHbHpMbk4wWVhSMWN5QTlJSE4wWVhSMWN6dGNiaUFnSUNCMGFHbHpMbVZ5Y205eUlEMGdaWEp5TzF4dUlDQWdJSFJvYVhNdWNtVnpjRzl1YzJVZ1BTQnlaWE53YjI1elpUdGNiaUFnZlZ4dVhHNGdJSFJ2VTNSeWFXNW5LQ2tnZTF4dUlDQWdJSEpsZEhWeWJpQmdKSHQwYUdsekxtTnZibk4wY25WamRHOXlMbTVoYldWOUlDaHpkR0YwZFhNOUpIdDBhR2x6TG5ob2NpNXpkR0YwZFhOOUxDQjFjbXc5Skh0MGFHbHpMblZ5YkgwcFlEdGNiaUFnZlZ4dWZWeHVYRzV0YjJSMWJHVXVaWGh3YjNKMGN5QTlJRWhVVkZCRmNuSnZjanRjYmlKZGZRPT0iLCIvKiogQG1vZHVsZSBjb21tb24vbWV0ZXJlZC1yZXF1ZXN0ICovXG5cbid1c2Ugc3RyaWN0JztcblxuXG4vKlxuKlxuKiBBbGxvd3Mgb25seSAxIHJlcXVlc3QgZm9yIGEgbWV0aG9kL3VybCB0byBvY2N1ciBhdCBhIHRpbWUuICBSZXF1ZXN0cyBmb3IgdGhlIHNhbWUgcmVzb3VyY2VcbiogYXJlIGZvbGRlZCBpbnRvIHRoZSBvdXRzdGFuZGluZyByZXF1ZXN0IGJ5IHJldHVybmluZyBpdHMgUHJvbWlzZS5cbipcbiovXG5cbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG52YXIgYWpheCA9IHJlcXVpcmUoJy4vYWpheCcpO1xuXG4vLyBEaWN0aW9uYXJ5IHRoYXQgaG9sZHMgaW4tZmxpZ2h0IHJlcXVlc3RzLiAgTWFwcyByZXF1ZXN0IHVybCB0byBwcm9taXNlLlxudmFyIF9pbkZsaWdodFJlcXVlc3RzID0ge307XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIC8qKiBHRVQgSlNPTiByZXNvdXJjZSBmcm9tIEFQSSBlbmRwb2ludC5cbiAgICogIElmIHJlcXVlc3QgaXMgYWxyZWFkeSBwZW5kaW5nLCB3aWxsIHJldHVybiB0aGUgZXhpc3RpbmcgcHJvbWlzZS5cbiAgICogIEBtZXRob2QgZ2V0XG4gICAqICBAcGFyYW0ge3N0cmluZyBvciBvYmplY3R9IHVybCB8IHNldHRpbmdzIC0gZWl0aGVyOlxuICAgKiAgICAgIGEgc3RyaW5nIGNvbnRhaW5pbmcgdGhlIFVSTCB0byB3aGljaCB0aGUgcmVxdWVzdCBpcyBzZW50IG9yXG4gICAqICAgICAgYSBzZXQgb2Yga2V5L3ZhbHVlIHBhaXJzIHRoYXQgY29uZmlndXJlIHRoZSBBamF4IHJlcXVlc3RcbiAgICogIEByZXR1cm5zIHtQcm9taXNlfVxuICAgKi9cbiAgZ2V0OiBmdW5jdGlvbiAoc2V0dGluZ3MsIHN0YXJ0SGRsciwgcmVzb2x2ZUhkbHIsIHJlamVjdEhkbHIsIGFwaU9wdHMpIHtcbiAgICB2YXIgdXJsO1xuICAgIHZhciBwcm9taXNlO1xuXG4gICAgaWYgKF8uaXNTdHJpbmcoc2V0dGluZ3MpKSB7XG4gICAgICB1cmwgPSBzZXR0aW5ncztcbiAgICAgIHNldHRpbmdzID0ge1xuICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgY29udGVudFR5cGUgOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgIHR5cGUgOiAnR0VUJ1xuICAgICAgfTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB1cmwgPSBzZXR0aW5ncy51cmw7XG4gICAgICBzZXR0aW5ncyA9IF8uZXh0ZW5kKHt9LCBzZXR0aW5ncywge1xuICAgICAgICBjb250ZW50VHlwZSA6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgdHlwZSA6ICdHRVQnXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoIV8uaXNTdHJpbmcodXJsKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdtZXRlcmVkLXJlcXVlc3Q6OmdldCAtIFVSTCBhcmd1bWVudCBpcyBub3QgYSBzdHJpbmcnKTtcbiAgICB9XG5cbiAgICAvLyByZXF1ZXN0IGFscmVhZHkgaW4gZmxpZ2h0LCByZXR1cm4gaXRzIHByb21pc2VcbiAgICBpZiAodXJsIGluIF9pbkZsaWdodFJlcXVlc3RzKSB7XG4gICAgICAvL2NvbnNvbGUuZGVidWcoJ1JldHVybmluZyBwZW5kaW5nIG1ldGVyZWQgcmVxdWVzdCBmb3I6ICcgKyB1cmwpO1xuICAgICAgcHJvbWlzZSA9IF9pbkZsaWdodFJlcXVlc3RzW3VybF07XG4gICAgICBwcm9taXNlLl9pc05ldyA9IGZhbHNlO1xuICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfVxuXG4gICAgLy9jb25zb2xlLmRlYnVnKCdDcmVhdGluZyBuZXcgbWV0ZXJlZCByZXF1ZXN0IGZvcjogJyArIHVybCk7XG5cbiAgICAvLyBjcmVhdGUgYSBuZXcgcHJvbWlzZSB0byByZXByZXNlbnQgdGhlIEdFVC4gIEdFVHMgYXJlIGFsd2F5c1xuICAgIC8vIGluaXRpYXRlZCBpbiB0aGUgbmV4dFRpY2sgdG8gcHJldmVudCBkaXNwYXRjaGVzIGR1cmluZyBkaXNwYXRjaGVzXG4gICAgLy9cbiAgICBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuXG4gICAgICBwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uICgpIHtcblxuICAgICAgICBhamF4KHNldHRpbmdzLCBhcGlPcHRzKVxuICAgICAgICAudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgIGRlbGV0ZSBfaW5GbGlnaHRSZXF1ZXN0c1t1cmxdO1xuICAgICAgICAgIHJlc29sdmVIZGxyKGRhdGEpO1xuICAgICAgICAgIHJlc29sdmUoZGF0YSk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICBkZWxldGUgX2luRmxpZ2h0UmVxdWVzdHNbdXJsXTtcbiAgICAgICAgICByZWplY3RIZGxyKGVycik7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHN0YXJ0SGRscigpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBwcm9taXNlLmNhdGNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIG5vLW9wIGNhdGNoIGhhbmRsZXIgdG8gcHJldmVudCBcInVuaGFuZGxlZCBwcm9taXNlIHJlamVjdGlvblwiIGNvbnNvbGUgbWVzc2FnZXNcbiAgICB9KTtcblxuICAgIC8vIEFkZCBhIGN1c3RvbSBwcm9wZXJ0eSB0byBhc3NlcnQgdGhhdCBhIEFKQVggcmVxdWVzdFxuICAgIC8vIHdhcyBtYWtlIGFuZCBhIFByb21pc2UgY3JlYXRlZCBhcyBwYXJ0IG9mIHRoaXMgY2FsbC5cbiAgICAvLyBUaGlzIGlzIHVzZWQgYXMgYSBoaW50IHRvIGNhbGxlcnMgdG8gY3JlYXRlIHJlc29sdmUvcmVqZWN0XG4gICAgLy8gaGFuZGxlcnMgb3Igbm90IChpLmUuIGRvbid0IGFkZCBtb3JlIHJlc29sdmUvcmVqZWN0IGhhbmRsZXJzXG4gICAgLy8gaWYgdGhlIFByb21pc2UgaXMgZm9yIGEgcGVuZGluZyByZXF1ZXN0KVxuICAgIHByb21pc2UuX2lzTmV3ID0gdHJ1ZTtcblxuICAgIC8vIHJlY29yZCByZXF1ZXN0XG4gICAgX2luRmxpZ2h0UmVxdWVzdHNbdXJsXSA9IHByb21pc2U7XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG59O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lMMVZ6WlhKekwyaGlkWEp5YjNkekwyUmxkaTlvWlhKdmEzVXZjbVZoWTNRdFpteDFlQzF6ZEdGeWRHVnlMM0IxWW14cFl5OXFZWFpoYzJOeWFYQjBjeTlqYjIxdGIyNHZiV1YwWlhKbFpDMXlaWEYxWlhOMExtcHpJaXdpYzI5MWNtTmxjeUk2V3lJdlZYTmxjbk12YUdKMWNuSnZkM012WkdWMkwyaGxjbTlyZFM5eVpXRmpkQzFtYkhWNExYTjBZWEowWlhJdmNIVmliR2xqTDJwaGRtRnpZM0pwY0hSekwyTnZiVzF2Ymk5dFpYUmxjbVZrTFhKbGNYVmxjM1F1YW5NaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWtGQlFVRXNjVU5CUVhGRE96dEJRVVZ5UXl4WlFVRlpMRU5CUVVNN1FVRkRZanM3UVVGRlFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRU3hGUVVGRk96dEJRVVZHTEVsQlFVa3NRMEZCUXl4SFFVRkhMRTlCUVU4c1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGQlF6dEJRVU14UWl4SlFVRkpMRWxCUVVrc1IwRkJSeXhQUVVGUExFTkJRVU1zVVVGQlVTeERRVUZETEVOQlFVTTdPMEZCUlRkQ0xEQkZRVUV3UlR0QlFVTXhSU3hKUVVGSkxHbENRVUZwUWl4SFFVRkhMRVZCUVVVc1EwRkJRenM3UVVGRk0wSXNUVUZCVFN4RFFVRkRMRTlCUVU4c1IwRkJSenRCUVVOcVFqdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEZRVVZGTEVkQlFVY3NSVUZCUlN4VlFVRlZMRkZCUVZFc1JVRkJSU3hUUVVGVExFVkJRVVVzVjBGQlZ5eEZRVUZGTEZWQlFWVXNSVUZCUlN4UFFVRlBMRVZCUVVVN1NVRkRjRVVzU1VGQlNTeEhRVUZITEVOQlFVTTdRVUZEV2l4SlFVRkpMRWxCUVVrc1QwRkJUeXhEUVVGRE96dEpRVVZhTEVsQlFVa3NRMEZCUXl4RFFVRkRMRkZCUVZFc1EwRkJReXhSUVVGUkxFTkJRVU1zUlVGQlJUdE5RVU40UWl4SFFVRkhMRWRCUVVjc1VVRkJVU3hEUVVGRE8wMUJRMllzVVVGQlVTeEhRVUZITzFGQlExUXNSMEZCUnl4RlFVRkZMRWRCUVVjN1VVRkRVaXhYUVVGWExFZEJRVWNzYTBKQlFXdENPMUZCUTJoRExFbEJRVWtzUjBGQlJ5eExRVUZMTzA5QlEySXNRMEZCUXp0TFFVTklPMU5CUTBrN1RVRkRTQ3hIUVVGSExFZEJRVWNzVVVGQlVTeERRVUZETEVkQlFVY3NRMEZCUXp0TlFVTnVRaXhSUVVGUkxFZEJRVWNzUTBGQlF5eERRVUZETEUxQlFVMHNRMEZCUXl4RlFVRkZMRVZCUVVVc1VVRkJVU3hGUVVGRk8xRkJRMmhETEZkQlFWY3NSMEZCUnl4clFrRkJhMEk3VVVGRGFFTXNTVUZCU1N4SFFVRkhMRXRCUVVzN1QwRkRZaXhEUVVGRExFTkJRVU03UVVGRFZDeExRVUZMT3p0SlFVVkVMRWxCUVVrc1EwRkJReXhEUVVGRExFTkJRVU1zVVVGQlVTeERRVUZETEVkQlFVY3NRMEZCUXl4RlFVRkZPMDFCUTNCQ0xFMUJRVTBzU1VGQlNTeExRVUZMTEVOQlFVTXNjVVJCUVhGRUxFTkJRVU1zUTBGQlF6dEJRVU0zUlN4TFFVRkxPMEZCUTB3N08wRkJSVUVzU1VGQlNTeEpRVUZKTEVkQlFVY3NTVUZCU1N4cFFrRkJhVUlzUlVGQlJUczdUVUZGTlVJc1QwRkJUeXhIUVVGSExHbENRVUZwUWl4RFFVRkRMRWRCUVVjc1EwRkJReXhEUVVGRE8wMUJRMnBETEU5QlFVOHNRMEZCUXl4TlFVRk5MRWRCUVVjc1MwRkJTeXhEUVVGRE8wMUJRM1pDTEU5QlFVOHNUMEZCVHl4RFFVRkRPMEZCUTNKQ0xFdEJRVXM3UVVGRFREdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQkxFbEJRVWtzVDBGQlR5eEhRVUZITEVsQlFVa3NUMEZCVHl4RFFVRkRMRlZCUVZVc1QwRkJUeXhGUVVGRkxFMUJRVTBzUlVGQlJUczdRVUZGY2tRc1RVRkJUU3hQUVVGUExFTkJRVU1zVVVGQlVTeERRVUZETEZsQlFWazdPMUZCUlROQ0xFbEJRVWtzUTBGQlF5eFJRVUZSTEVWQlFVVXNUMEZCVHl4RFFVRkRPMU5CUTNSQ0xFbEJRVWtzUTBGQlF5eFZRVUZWTEVsQlFVa3NSVUZCUlR0VlFVTndRaXhQUVVGUExHbENRVUZwUWl4RFFVRkRMRWRCUVVjc1EwRkJReXhEUVVGRE8xVkJRemxDTEZkQlFWY3NRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJRenRWUVVOc1FpeFBRVUZQTEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNN1UwRkRaaXhGUVVGRkxGVkJRVlVzUjBGQlJ5eEZRVUZGTzFWQlEyaENMRTlCUVU4c2FVSkJRV2xDTEVOQlFVTXNSMEZCUnl4RFFVRkRMRU5CUVVNN1ZVRkRPVUlzVlVGQlZTeERRVUZETEVkQlFVY3NRMEZCUXl4RFFVRkRPMVZCUTJoQ0xFMUJRVTBzUTBGQlF5eEhRVUZITEVOQlFVTXNRMEZCUXp0QlFVTjBRaXhUUVVGVExFTkJRVU1zUTBGQlF6czdVVUZGU0N4VFFVRlRMRVZCUVVVc1EwRkJRenRQUVVOaUxFTkJRVU1zUTBGQlF6dEJRVU5VTEV0QlFVc3NRMEZCUXl4RFFVRkRPenRCUVVWUUxFbEJRVWtzVDBGQlR5eERRVUZETEV0QlFVc3NRMEZCUXl4WlFVRlpPenRCUVVVNVFpeExRVUZMTEVOQlFVTXNRMEZCUXp0QlFVTlFPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRXNTVUZCU1N4UFFVRlBMRU5CUVVNc1RVRkJUU3hIUVVGSExFbEJRVWtzUTBGQlF6dEJRVU14UWpzN1FVRkZRU3hKUVVGSkxHbENRVUZwUWl4RFFVRkRMRWRCUVVjc1EwRkJReXhIUVVGSExFOUJRVThzUTBGQlF6czdTVUZGYWtNc1QwRkJUeXhQUVVGUExFTkJRVU03UVVGRGJrSXNSMEZCUnpzN1EwRkZSaXhEUVVGRElpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lMeW9xSUVCdGIyUjFiR1VnWTI5dGJXOXVMMjFsZEdWeVpXUXRjbVZ4ZFdWemRDQXFMMXh1WEc0bmRYTmxJSE4wY21samRDYzdYRzVjYmx4dUx5cGNiaXBjYmlvZ1FXeHNiM2R6SUc5dWJIa2dNU0J5WlhGMVpYTjBJR1p2Y2lCaElHMWxkR2h2WkM5MWNtd2dkRzhnYjJOamRYSWdZWFFnWVNCMGFXMWxMaUFnVW1WeGRXVnpkSE1nWm05eUlIUm9aU0J6WVcxbElISmxjMjkxY21ObFhHNHFJR0Z5WlNCbWIyeGtaV1FnYVc1MGJ5QjBhR1VnYjNWMGMzUmhibVJwYm1jZ2NtVnhkV1Z6ZENCaWVTQnlaWFIxY201cGJtY2dhWFJ6SUZCeWIyMXBjMlV1WEc0cVhHNHFMMXh1WEc1MllYSWdYeUE5SUhKbGNYVnBjbVVvSjJ4dlpHRnphQ2NwTzF4dWRtRnlJR0ZxWVhnZ1BTQnlaWEYxYVhKbEtDY3VMMkZxWVhnbktUdGNibHh1THk4Z1JHbGpkR2x2Ym1GeWVTQjBhR0YwSUdodmJHUnpJR2x1TFdac2FXZG9kQ0J5WlhGMVpYTjBjeTRnSUUxaGNITWdjbVZ4ZFdWemRDQjFjbXdnZEc4Z2NISnZiV2x6WlM1Y2JuWmhjaUJmYVc1R2JHbG5hSFJTWlhGMVpYTjBjeUE5SUh0OU8xeHVYRzV0YjJSMWJHVXVaWGh3YjNKMGN5QTlJSHRjYmx4dUlDQXZLaW9nUjBWVUlFcFRUMDRnY21WemIzVnlZMlVnWm5KdmJTQkJVRWtnWlc1a2NHOXBiblF1WEc0Z0lDQXFJQ0JKWmlCeVpYRjFaWE4wSUdseklHRnNjbVZoWkhrZ2NHVnVaR2x1Wnl3Z2QybHNiQ0J5WlhSMWNtNGdkR2hsSUdWNGFYTjBhVzVuSUhCeWIyMXBjMlV1WEc0Z0lDQXFJQ0JBYldWMGFHOWtJR2RsZEZ4dUlDQWdLaUFnUUhCaGNtRnRJSHR6ZEhKcGJtY2diM0lnYjJKcVpXTjBmU0IxY213Z2ZDQnpaWFIwYVc1bmN5QXRJR1ZwZEdobGNqcGNiaUFnSUNvZ0lDQWdJQ0JoSUhOMGNtbHVaeUJqYjI1MFlXbHVhVzVuSUhSb1pTQlZVa3dnZEc4Z2QyaHBZMmdnZEdobElISmxjWFZsYzNRZ2FYTWdjMlZ1ZENCdmNseHVJQ0FnS2lBZ0lDQWdJR0VnYzJWMElHOW1JR3RsZVM5MllXeDFaU0J3WVdseWN5QjBhR0YwSUdOdmJtWnBaM1Z5WlNCMGFHVWdRV3BoZUNCeVpYRjFaWE4wWEc0Z0lDQXFJQ0JBY21WMGRYSnVjeUI3VUhKdmJXbHpaWDFjYmlBZ0lDb3ZYRzRnSUdkbGREb2dablZ1WTNScGIyNGdLSE5sZEhScGJtZHpMQ0J6ZEdGeWRFaGtiSElzSUhKbGMyOXNkbVZJWkd4eUxDQnlaV3BsWTNSSVpHeHlMQ0JoY0dsUGNIUnpLU0I3WEc0Z0lDQWdkbUZ5SUhWeWJEdGNiaUFnSUNCMllYSWdjSEp2YldselpUdGNibHh1SUNBZ0lHbG1JQ2hmTG1selUzUnlhVzVuS0hObGRIUnBibWR6S1NrZ2UxeHVJQ0FnSUNBZ2RYSnNJRDBnYzJWMGRHbHVaM003WEc0Z0lDQWdJQ0J6WlhSMGFXNW5jeUE5SUh0Y2JpQWdJQ0FnSUNBZ2RYSnNPaUIxY213c1hHNGdJQ0FnSUNBZ0lHTnZiblJsYm5SVWVYQmxJRG9nSjJGd2NHeHBZMkYwYVc5dUwycHpiMjRuTEZ4dUlDQWdJQ0FnSUNCMGVYQmxJRG9nSjBkRlZDZGNiaUFnSUNBZ0lIMDdYRzRnSUNBZ2ZWeHVJQ0FnSUdWc2MyVWdlMXh1SUNBZ0lDQWdkWEpzSUQwZ2MyVjBkR2x1WjNNdWRYSnNPMXh1SUNBZ0lDQWdjMlYwZEdsdVozTWdQU0JmTG1WNGRHVnVaQ2g3ZlN3Z2MyVjBkR2x1WjNNc0lIdGNiaUFnSUNBZ0lDQWdZMjl1ZEdWdWRGUjVjR1VnT2lBbllYQndiR2xqWVhScGIyNHZhbk52Ymljc1hHNGdJQ0FnSUNBZ0lIUjVjR1VnT2lBblIwVlVKMXh1SUNBZ0lDQWdmU2s3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdhV1lnS0NGZkxtbHpVM1J5YVc1bktIVnliQ2twSUh0Y2JpQWdJQ0FnSUhSb2NtOTNJRzVsZHlCRmNuSnZjaWduYldWMFpYSmxaQzF5WlhGMVpYTjBPanBuWlhRZ0xTQlZVa3dnWVhKbmRXMWxiblFnYVhNZ2JtOTBJR0VnYzNSeWFXNW5KeWs3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdMeThnY21WeGRXVnpkQ0JoYkhKbFlXUjVJR2x1SUdac2FXZG9kQ3dnY21WMGRYSnVJR2wwY3lCd2NtOXRhWE5sWEc0Z0lDQWdhV1lnS0hWeWJDQnBiaUJmYVc1R2JHbG5hSFJTWlhGMVpYTjBjeWtnZTF4dUlDQWdJQ0FnTHk5amIyNXpiMnhsTG1SbFluVm5LQ2RTWlhSMWNtNXBibWNnY0dWdVpHbHVaeUJ0WlhSbGNtVmtJSEpsY1hWbGMzUWdabTl5T2lBbklDc2dkWEpzS1R0Y2JpQWdJQ0FnSUhCeWIyMXBjMlVnUFNCZmFXNUdiR2xuYUhSU1pYRjFaWE4wYzF0MWNteGRPMXh1SUNBZ0lDQWdjSEp2YldselpTNWZhWE5PWlhjZ1BTQm1ZV3h6WlR0Y2JpQWdJQ0FnSUhKbGRIVnliaUJ3Y205dGFYTmxPMXh1SUNBZ0lIMWNibHh1SUNBZ0lDOHZZMjl1YzI5c1pTNWtaV0oxWnlnblEzSmxZWFJwYm1jZ2JtVjNJRzFsZEdWeVpXUWdjbVZ4ZFdWemRDQm1iM0k2SUNjZ0t5QjFjbXdwTzF4dVhHNGdJQ0FnTHk4Z1kzSmxZWFJsSUdFZ2JtVjNJSEJ5YjIxcGMyVWdkRzhnY21Wd2NtVnpaVzUwSUhSb1pTQkhSVlF1SUNCSFJWUnpJR0Z5WlNCaGJIZGhlWE5jYmlBZ0lDQXZMeUJwYm1sMGFXRjBaV1FnYVc0Z2RHaGxJRzVsZUhSVWFXTnJJSFJ2SUhCeVpYWmxiblFnWkdsemNHRjBZMmhsY3lCa2RYSnBibWNnWkdsemNHRjBZMmhsYzF4dUlDQWdJQzh2WEc0Z0lDQWdjSEp2YldselpTQTlJRzVsZHlCUWNtOXRhWE5sS0daMWJtTjBhVzl1SUNoeVpYTnZiSFpsTENCeVpXcGxZM1FwSUh0Y2JseHVJQ0FnSUNBZ2NISnZZMlZ6Y3k1dVpYaDBWR2xqYXlobWRXNWpkR2x2YmlBb0tTQjdYRzVjYmlBZ0lDQWdJQ0FnWVdwaGVDaHpaWFIwYVc1bmN5d2dZWEJwVDNCMGN5bGNiaUFnSUNBZ0lDQWdMblJvWlc0b1puVnVZM1JwYjI0Z0tHUmhkR0VwSUh0Y2JpQWdJQ0FnSUNBZ0lDQmtaV3hsZEdVZ1gybHVSbXhwWjJoMFVtVnhkV1Z6ZEhOYmRYSnNYVHRjYmlBZ0lDQWdJQ0FnSUNCeVpYTnZiSFpsU0dSc2NpaGtZWFJoS1R0Y2JpQWdJQ0FnSUNBZ0lDQnlaWE52YkhabEtHUmhkR0VwTzF4dUlDQWdJQ0FnSUNCOUxDQm1kVzVqZEdsdmJpQW9aWEp5S1NCN1hHNGdJQ0FnSUNBZ0lDQWdaR1ZzWlhSbElGOXBia1pzYVdkb2RGSmxjWFZsYzNSelczVnliRjA3WEc0Z0lDQWdJQ0FnSUNBZ2NtVnFaV04wU0dSc2NpaGxjbklwTzF4dUlDQWdJQ0FnSUNBZ0lISmxhbVZqZENobGNuSXBPMXh1SUNBZ0lDQWdJQ0I5S1R0Y2JseHVJQ0FnSUNBZ0lDQnpkR0Z5ZEVoa2JISW9LVHRjYmlBZ0lDQWdJSDBwTzF4dUlDQWdJSDBwTzF4dVhHNGdJQ0FnY0hKdmJXbHpaUzVqWVhSamFDaG1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdJQ0F2THlCdWJ5MXZjQ0JqWVhSamFDQm9ZVzVrYkdWeUlIUnZJSEJ5WlhabGJuUWdYQ0oxYm1oaGJtUnNaV1FnY0hKdmJXbHpaU0J5WldwbFkzUnBiMjVjSWlCamIyNXpiMnhsSUcxbGMzTmhaMlZ6WEc0Z0lDQWdmU2s3WEc1Y2JpQWdJQ0F2THlCQlpHUWdZU0JqZFhOMGIyMGdjSEp2Y0dWeWRIa2dkRzhnWVhOelpYSjBJSFJvWVhRZ1lTQkJTa0ZZSUhKbGNYVmxjM1JjYmlBZ0lDQXZMeUIzWVhNZ2JXRnJaU0JoYm1RZ1lTQlFjbTl0YVhObElHTnlaV0YwWldRZ1lYTWdjR0Z5ZENCdlppQjBhR2x6SUdOaGJHd3VYRzRnSUNBZ0x5OGdWR2hwY3lCcGN5QjFjMlZrSUdGeklHRWdhR2x1ZENCMGJ5QmpZV3hzWlhKeklIUnZJR055WldGMFpTQnlaWE52YkhabEwzSmxhbVZqZEZ4dUlDQWdJQzh2SUdoaGJtUnNaWEp6SUc5eUlHNXZkQ0FvYVM1bExpQmtiMjRuZENCaFpHUWdiVzl5WlNCeVpYTnZiSFpsTDNKbGFtVmpkQ0JvWVc1a2JHVnljMXh1SUNBZ0lDOHZJR2xtSUhSb1pTQlFjbTl0YVhObElHbHpJR1p2Y2lCaElIQmxibVJwYm1jZ2NtVnhkV1Z6ZENsY2JpQWdJQ0J3Y205dGFYTmxMbDlwYzA1bGR5QTlJSFJ5ZFdVN1hHNWNiaUFnSUNBdkx5QnlaV052Y21RZ2NtVnhkV1Z6ZEZ4dUlDQWdJRjlwYmtac2FXZG9kRkpsY1hWbGMzUnpXM1Z5YkYwZ1BTQndjbTl0YVhObE8xeHVYRzRnSUNBZ2NtVjBkWEp1SUhCeWIyMXBjMlU3WEc0Z0lIMWNibHh1ZlR0Y2JpSmRmUT09IiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyBib290c3RyYXAgaW5pdGlhbGl6YXRpb25cbnZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG53aW5kb3cualF1ZXJ5ID0gJDtcbnJlcXVpcmUoJ2Jvb3RzdHJhcCcpO1xuXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdC9hZGRvbnMnKTtcblxudmFyIFJvdXRlciA9IHJlcXVpcmUoJ3JlYWN0LXJvdXRlcicpLFxuICAgIFJvdXRlSGFuZGxlciA9IFJvdXRlci5Sb3V0ZUhhbmRsZXI7XG5cbnZhciBOYXZCYXIgPSByZXF1aXJlKCcuL25hdi1iYXIuanN4JyksXG4gICAgT3ZlcmxheU1hbmFnZXIgPSByZXF1aXJlKCcuL292ZXJsYXlzL292ZXJsYXktbWFuYWdlci5qc3gnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiZXhwb3J0c1wiLFxuXG4gIG1peGluczogW1JvdXRlci5TdGF0ZV0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTmF2QmFyLCBudWxsKSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm91dGVIYW5kbGVyLCBudWxsKSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoT3ZlcmxheU1hbmFnZXIsIG51bGwpXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaUwxVnpaWEp6TDJoaWRYSnliM2R6TDJSbGRpOW9aWEp2YTNVdmNtVmhZM1F0Wm14MWVDMXpkR0Z5ZEdWeUwzQjFZbXhwWXk5cVlYWmhjMk55YVhCMGN5OWpiMjF3YjI1bGJuUnpMMkZ3Y0M1cWMzZ2lMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlvWW5WeWNtOTNjeTlrWlhZdmFHVnliMnQxTDNKbFlXTjBMV1pzZFhndGMzUmhjblJsY2k5d2RXSnNhV012YW1GMllYTmpjbWx3ZEhNdlkyOXRjRzl1Wlc1MGN5OWhjSEF1YW5ONElsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lKQlFVRkJMRmxCUVZrc1EwRkJRenM3UVVGRllpd3lRa0ZCTWtJN1FVRkRNMElzU1VGQlNTeERRVUZETEVkQlFVY3NUMEZCVHl4RFFVRkRMRkZCUVZFc1EwRkJReXhEUVVGRE8wRkJRekZDTEUxQlFVMHNRMEZCUXl4TlFVRk5MRWRCUVVjc1EwRkJReXhEUVVGRE8wRkJRMnhDTEU5QlFVOHNRMEZCUXl4WFFVRlhMRU5CUVVNc1EwRkJRenM3UVVGRmNrSXNTVUZCU1N4TFFVRkxMRWRCUVVjc1QwRkJUeXhEUVVGRExHTkJRV01zUTBGQlF5eERRVUZET3p0QlFVVndReXhKUVVGSkxFMUJRVTBzUjBGQlJ5eFBRVUZQTEVOQlFVTXNZMEZCWXl4RFFVRkRPMEZCUTNCRExFbEJRVWtzV1VGQldTeEhRVUZITEUxQlFVMHNRMEZCUXl4WlFVRlpMRU5CUVVNN08wRkJSWFpETEVsQlFVa3NUVUZCVFN4SFFVRkhMRTlCUVU4c1EwRkJReXhsUVVGbExFTkJRVU03UVVGRGNrTXNTVUZCU1N4alFVRmpMRWRCUVVjc1QwRkJUeXhEUVVGRExHZERRVUZuUXl4RFFVRkRMRU5CUVVNN08wRkJSUzlFTEc5RFFVRnZReXgxUWtGQlFUczdRVUZGY0VNc1JVRkJSU3hOUVVGTkxFVkJRVVVzUTBGQlF5eE5RVUZOTEVOQlFVTXNTMEZCU3l4RFFVRkRPenRGUVVWMFFpeE5RVUZOTEVWQlFVVXNXVUZCV1R0SlFVTnNRanROUVVORkxHOUNRVUZCTEV0QlFVa3NSVUZCUVN4SlFVRkRMRVZCUVVFN1VVRkRTQ3h2UWtGQlF5eE5RVUZOTEVWQlFVRXNTVUZCUVN4RFFVRkhMRU5CUVVFc1JVRkJRVHRSUVVOV0xHOUNRVUZETEZsQlFWa3NSVUZCUVN4SlFVRkJMRU5CUVVjc1EwRkJRU3hGUVVGQk8xRkJRMmhDTEc5Q1FVRkRMR05CUVdNc1JVRkJRU3hKUVVGQkxFTkJRVWNzUTBGQlFUdE5RVU5rTEVOQlFVRTdUVUZEVGp0SFFVTklPME5CUTBZc1EwRkJReXhEUVVGRElpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lKM1Z6WlNCemRISnBZM1FuTzF4dVhHNHZMeUJpYjI5MGMzUnlZWEFnYVc1cGRHbGhiR2w2WVhScGIyNWNiblpoY2lBa0lEMGdjbVZ4ZFdseVpTZ25hbkYxWlhKNUp5azdYRzUzYVc1a2IzY3VhbEYxWlhKNUlEMGdKRHRjYm5KbGNYVnBjbVVvSjJKdmIzUnpkSEpoY0NjcE8xeHVYRzUyWVhJZ1VtVmhZM1FnUFNCeVpYRjFhWEpsS0NkeVpXRmpkQzloWkdSdmJuTW5LVHRjYmx4dWRtRnlJRkp2ZFhSbGNpQTlJSEpsY1hWcGNtVW9KM0psWVdOMExYSnZkWFJsY2ljcExGeHVJQ0FnSUZKdmRYUmxTR0Z1Wkd4bGNpQTlJRkp2ZFhSbGNpNVNiM1YwWlVoaGJtUnNaWEk3WEc1Y2JuWmhjaUJPWVhaQ1lYSWdQU0J5WlhGMWFYSmxLQ2N1TDI1aGRpMWlZWEl1YW5ONEp5a3NYRzRnSUNBZ1QzWmxjbXhoZVUxaGJtRm5aWElnUFNCeVpYRjFhWEpsS0NjdUwyOTJaWEpzWVhsekwyOTJaWEpzWVhrdGJXRnVZV2RsY2k1cWMzZ25LVHRjYmx4dWJXOWtkV3hsTG1WNGNHOXlkSE1nUFNCU1pXRmpkQzVqY21WaGRHVkRiR0Z6Y3loN1hHNWNiaUFnYldsNGFXNXpPaUJiVW05MWRHVnlMbE4wWVhSbFhTeGNibHh1SUNCeVpXNWtaWEk2SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCeVpYUjFjbTRnS0Z4dUlDQWdJQ0FnUEdScGRqNWNiaUFnSUNBZ0lDQWdQRTVoZGtKaGNpQXZQbHh1SUNBZ0lDQWdJQ0E4VW05MWRHVklZVzVrYkdWeUlDOCtYRzRnSUNBZ0lDQWdJRHhQZG1WeWJHRjVUV0Z1WVdkbGNpQXZQbHh1SUNBZ0lDQWdQQzlrYVhZK1hHNGdJQ0FnS1R0Y2JpQWdmVnh1ZlNrN1hHNGlYWDA9IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xuXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdC9hZGRvbnMnKTtcblxudmFyIFN0b3JlcyA9IHJlcXVpcmUoJy4uL3N0b3JlcycpLFxuICAgIHN0b3JlQ2hhbmdlTWl4aW4gPSByZXF1aXJlKCcuLi9taXhpbnMvc3RvcmUtY2hhbmdlJyk7XG5cbnZhciBrU3RhdGVzID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL3N0YXRlcycpO1xuXG52YXIgSXRlbUFjdGlvbnMgPSByZXF1aXJlKCcuLi9hY3Rpb25zL2l0ZW1zJyk7XG5cbnZhciBPdmVybGF5cyA9IHJlcXVpcmUoJy4uL2FjdGlvbnMvb3ZlcmxheXMnKTtcblxuLyoqXG4gKiBTaW1wbGUgZXhhbXBsZSBvZiBhIGJhc2ljIENSVUQgaW50ZXJmYWNlLiAgTGlzdCBpdGVtcyBhbmQgc3VwcG9ydHNcbiAqIGNyZWF0ZSwgZWRpdCwgZGVsZXRlIG9mIGl0ZW1zIGluIGxpc3QuXG4gKlxuICogVXNlcyB0aGUgQ1JVRCBiYXNlZCBJdGVtIFN0b3JlIGFuZCBBY3Rpb25zLiAgTGlzdGVucyB0byBjaGFuZ2VzIHRvIHRoZVxuICogSXRlbSBzdG9yZS4gIFVzZXMgUmVhY3RzIFB1cmVSZW5kZXJNaXhpbiB0byBvbmx5IHJlbmRlciB3aGVuIHN0YXRlIG9yXG4gKiBwcm9wcyBoYXZlIGNoYW5nZWQgKHdvdWxkIHdvcmsgZXZlbiBiZXR0ZXIgaWYgdXNpbmcgSW1tdXRhYmxlIEpTKVxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcImV4cG9ydHNcIixcblxuICBtaXhpbnM6IFtzdG9yZUNoYW5nZU1peGluKFN0b3Jlcy5JdGVtc1N0b3JlKSwgUmVhY3QuYWRkb25zLlB1cmVSZW5kZXJNaXhpbl0sXG5cbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGl0ZW1zOiBTdG9yZXMuSXRlbXNTdG9yZS5nZXRBbGwoKSxcbiAgICAgIHNlbGVjdGlvbjogbnVsbFxuICAgIH07XG4gIH0sXG5cbiAgc3RvcmVDaGFuZ2U6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtpdGVtczogU3RvcmVzLkl0ZW1zU3RvcmUuZ2V0QWxsKCl9KTtcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcblxuICAgIHZhciBjb250ZW50O1xuXG4gICAgaWYgKCF0aGlzLnN0YXRlLml0ZW1zKSB7XG4gICAgICBjb250ZW50ID0gUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLCBcIkxvYWRpbmcuLi5cIik7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgY29udGVudCA9IChcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRhYmxlXCIsIHtjbGFzc05hbWU6IFwidGFibGVcIn0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aGVhZFwiLCBudWxsLCBcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0clwiLCBudWxsLCBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwgbnVsbCwgXCJGaXJzdCBOYW1lXCIpLCBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwgbnVsbCwgXCJMYXN0IE5hbWVcIiksIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCBudWxsLCBcIklkXCIpKVxuICAgICAgICAgICApLCBcbiAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRib2R5XCIsIG51bGwsIFxuICAgICAgICAgICAgIF8ubWFwKHRoaXMuc3RhdGUuaXRlbXMsIGl0ZW0gPT5cbiAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0clwiLCB7a2V5OiBpdGVtLmRhdGEuaWQsIFxuICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogdGhpcy5zdGF0ZS5zZWxlY3Rpb24gPT09IGl0ZW0uZGF0YS5pZCA/ICdhY3RpdmUnIDogJycsIFxuICAgICAgICAgICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICBjb2xvcjogXy5jb250YWlucyhba1N0YXRlcy5ORVcsIGtTdGF0ZXMuU0FWSU5HLCBrU3RhdGVzLkRFTEVUSU5HXSwgaXRlbS5zdGF0ZSkgPyAnI2NjYycgOiAnaW5oZXJpdCcsXG4gICAgICAgICAgICAgICAgICAgICB0ZXh0RGVjb3JhdGlvbjogaXRlbS5zdGF0ZSA9PT0ga1N0YXRlcy5ERUxFVElORyA/ICdsaW5lLXRocm91Z2gnIDogJ25vbmUnfSwgXG4gICAgICAgICAgICAgICAgICAgb25DbGljazogdGhpcy5fb25DbGljay5iaW5kKHRoaXMsIGl0ZW0uZGF0YS5pZCl9LCBcbiAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIGl0ZW0uZGF0YS5maXJzdCksIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCBpdGVtLmRhdGEubGFzdCksIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCBpdGVtLmRhdGEuaWQpXG4gICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgKVxuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImNvbnRhaW5lci1mbHVpZFwifSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJyb3dcIn0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJjb2wteHMtMTJcIn0sIFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImhlYWRlclwiLCBudWxsLCBcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImgzXCIsIHtzdHlsZToge2Rpc3BsYXk6J2lubGluZS1ibG9jaycsbWFyZ2luVG9wOicwJ319LCBcIkl0ZW1zXCIpLCBcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiLCB7dHlwZTogXCJidXR0b25cIiwgY2xhc3NOYW1lOiBcImJ0biBidG4tZGVmYXVsdCBwdWxsLXJpZ2h0XCIsIGRpc2FibGVkOiAhdGhpcy5zdGF0ZS5zZWxlY3Rpb24sIG9uQ2xpY2s6IHRoaXMuX29uRGVsZXRlfSwgXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwge2NsYXNzTmFtZTogXCJnbHlwaGljb24gZ2x5cGhpY29uLXRyYXNoXCJ9KVxuICAgICAgICAgICAgICApLCBcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiLCB7dHlwZTogXCJidXR0b25cIiwgY2xhc3NOYW1lOiBcImJ0biBidG4tZGVmYXVsdCBwdWxsLXJpZ2h0XCIsIGRpc2FibGVkOiAhdGhpcy5zdGF0ZS5zZWxlY3Rpb24sIG9uQ2xpY2s6IHRoaXMuX29uVXBkYXRlfSwgXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwge2NsYXNzTmFtZTogXCJnbHlwaGljb24gZ2x5cGhpY29uLXBlbmNpbFwifSlcbiAgICAgICAgICAgICAgKSwgXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIiwge3R5cGU6IFwiYnV0dG9uXCIsIGNsYXNzTmFtZTogXCJidG4gYnRuLWRlZmF1bHQgcHVsbC1yaWdodFwiLCBvbkNsaWNrOiB0aGlzLl9vbkFkZH0sIFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtjbGFzc05hbWU6IFwiZ2x5cGhpY29uIGdseXBoaWNvbi1wbHVzXCJ9KVxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICApXG4gICAgICAgICAgKSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImNvbC14cy0xMlwifSwgXG4gICAgICAgICAgICBjb250ZW50XG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcbiAgfSxcblxuICBfb25DbGljazogZnVuY3Rpb24gKGlkKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7c2VsZWN0aW9uOiBpZH0pO1xuICB9LFxuXG4gIF9vbkFkZDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBvdmVybGF5ID0gUmVhY3QuY3JlYXRlRmFjdG9yeShyZXF1aXJlKCcuL292ZXJsYXlzL2l0ZW0tZm9ybS5qc3gnKSk7XG4gICAgT3ZlcmxheXMucHVzaChvdmVybGF5KHtcbiAgICAgIG9rQ2FsbGJhY2s6IChmaXJzdE5hbWUsIGxhc3ROYW1lKSA9PiB7XG4gICAgICAgIHZhciBpZCA9IEl0ZW1BY3Rpb25zLnBvc3QoZmlyc3ROYW1lLCBsYXN0TmFtZSk7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe3NlbGVjdGlvbjogaWR9KTtcbiAgICAgICAgY29uc29sZS5sb2coYGNyZWF0ZSBuZXcgaXRlbSAjJHtpZH1gKTtcbiAgICAgIH1cbiAgICB9LCBudWxsKSk7XG4gIH0sXG5cbiAgX29uVXBkYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGl0ZW0gPSBTdG9yZXMuSXRlbXNTdG9yZS5nZXQodGhpcy5zdGF0ZS5zZWxlY3Rpb24pO1xuICAgIHZhciBvdmVybGF5ID0gUmVhY3QuY3JlYXRlRmFjdG9yeShyZXF1aXJlKCcuL292ZXJsYXlzL2l0ZW0tZm9ybS5qc3gnKSk7XG4gICAgcmV0dXJuIE92ZXJsYXlzLnB1c2gob3ZlcmxheSh7XG4gICAgICBmaXJzdE5hbWU6IGl0ZW0uZGF0YS5maXJzdCxcbiAgICAgIGxhc3ROYW1lOiBpdGVtLmRhdGEubGFzdCxcbiAgICAgIG9rQ2FsbGJhY2s6IChmaXJzdE5hbWUsIGxhc3ROYW1lKSA9PiBJdGVtQWN0aW9ucy5wdXQodGhpcy5zdGF0ZS5zZWxlY3Rpb24sIGZpcnN0TmFtZSwgbGFzdE5hbWUpXG4gICAgfSwgbnVsbCkpO1xuICB9LFxuXG4gIF9vbkRlbGV0ZTogZnVuY3Rpb24gKCkge1xuICAgIEl0ZW1BY3Rpb25zLmRlbGV0ZSh0aGlzLnN0YXRlLnNlbGVjdGlvbik7XG4gICAgdGhpcy5zZXRTdGF0ZSh7c2VsZWN0aW9uOiBudWxsfSk7XG4gIH1cblxufSk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaUwxVnpaWEp6TDJoaWRYSnliM2R6TDJSbGRpOW9aWEp2YTNVdmNtVmhZM1F0Wm14MWVDMXpkR0Z5ZEdWeUwzQjFZbXhwWXk5cVlYWmhjMk55YVhCMGN5OWpiMjF3YjI1bGJuUnpMMmwwWlcxekxtcHplQ0lzSW5OdmRYSmpaWE1pT2xzaUwxVnpaWEp6TDJoaWRYSnliM2R6TDJSbGRpOW9aWEp2YTNVdmNtVmhZM1F0Wm14MWVDMXpkR0Z5ZEdWeUwzQjFZbXhwWXk5cVlYWmhjMk55YVhCMGN5OWpiMjF3YjI1bGJuUnpMMmwwWlcxekxtcHplQ0pkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lRVUZCUVN4WlFVRlpMRU5CUVVNN08wRkJSV0lzU1VGQlNTeERRVUZETEVkQlFVY3NUMEZCVHl4RFFVRkRMRkZCUVZFc1EwRkJReXhEUVVGRE96dEJRVVV4UWl4SlFVRkpMRXRCUVVzc1IwRkJSeXhQUVVGUExFTkJRVU1zWTBGQll5eERRVUZETEVOQlFVTTdPMEZCUlhCRExFbEJRVWtzVFVGQlRTeEhRVUZITEU5QlFVOHNRMEZCUXl4WFFVRlhMRU5CUVVNN1FVRkRha01zU1VGQlNTeG5Ra0ZCWjBJc1IwRkJSeXhQUVVGUExFTkJRVU1zZDBKQlFYZENMRU5CUVVNc1EwRkJRenM3UVVGRmVrUXNTVUZCU1N4UFFVRlBMRWRCUVVjc1QwRkJUeXhEUVVGRExIRkNRVUZ4UWl4RFFVRkRMRU5CUVVNN08wRkJSVGRETEVsQlFVa3NWMEZCVnl4SFFVRkhMRTlCUVU4c1EwRkJReXhyUWtGQmEwSXNRMEZCUXl4RFFVRkRPenRCUVVVNVF5eEpRVUZKTEZGQlFWRXNSMEZCUnl4UFFVRlBMRU5CUVVNc2NVSkJRWEZDTEVOQlFVTXNRMEZCUXpzN1FVRkZPVU03UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQkxFZEJRVWM3TzBGQlJVZ3NiME5CUVc5RExIVkNRVUZCT3p0QlFVVndReXhGUVVGRkxFMUJRVTBzUlVGQlJTeERRVUZETEdkQ1FVRm5RaXhEUVVGRExFMUJRVTBzUTBGQlF5eFZRVUZWTEVOQlFVTXNSVUZCUlN4TFFVRkxMRU5CUVVNc1RVRkJUU3hEUVVGRExHVkJRV1VzUTBGQlF6czdSVUZGTTBVc1pVRkJaU3hGUVVGRkxGbEJRVms3U1VGRE0wSXNUMEZCVHp0TlFVTk1MRXRCUVVzc1JVRkJSU3hOUVVGTkxFTkJRVU1zVlVGQlZTeERRVUZETEUxQlFVMHNSVUZCUlR0TlFVTnFReXhUUVVGVExFVkJRVVVzU1VGQlNUdExRVU5vUWl4RFFVRkRPMEZCUTA0c1IwRkJSenM3UlVGRlJDeFhRVUZYTEVWQlFVVXNXVUZCV1R0SlFVTjJRaXhKUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETEVOQlFVTXNTMEZCU3l4RlFVRkZMRTFCUVUwc1EwRkJReXhWUVVGVkxFTkJRVU1zVFVGQlRTeEZRVUZGTEVOQlFVTXNRMEZCUXl4RFFVRkRPMEZCUTNaRUxFZEJRVWM3TzBGQlJVZ3NSVUZCUlN4TlFVRk5MRVZCUVVVc1dVRkJXVHM3UVVGRmRFSXNTVUZCU1N4SlFVRkpMRTlCUVU4c1EwRkJRenM3U1VGRldpeEpRVUZKTEVOQlFVTXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhMUVVGTExFVkJRVVU3VFVGRGNrSXNUMEZCVHl4SFFVRkhMRzlDUVVGQkxFdEJRVWtzUlVGQlFTeEpRVUZETEVWQlFVRXNXVUZCWjBJc1EwRkJRU3hEUVVGRE8wdEJRMnBETzFOQlEwazdUVUZEU0N4UFFVRlBPMUZCUTB3c2IwSkJRVUVzVDBGQlRTeEZRVUZCTEVOQlFVRXNRMEZCUXl4VFFVRkJMRVZCUVZNc1EwRkJReXhQUVVGUkxFTkJRVUVzUlVGQlFUdFZRVU4yUWl4dlFrRkJRU3hQUVVGTkxFVkJRVUVzU1VGQlF5eEZRVUZCTzFsQlEwd3NiMEpCUVVFc1NVRkJSeXhGUVVGQkxFbEJRVU1zUlVGQlFTeHZRa0ZCUVN4SlFVRkhMRVZCUVVFc1NVRkJReXhGUVVGQkxGbEJRV1VzUTBGQlFTeEZRVUZCTEc5Q1FVRkJMRWxCUVVjc1JVRkJRU3hKUVVGRExFVkJRVUVzVjBGQll5eERRVUZCTEVWQlFVRXNiMEpCUVVFc1NVRkJSeXhGUVVGQkxFbEJRVU1zUlVGQlFTeEpRVUZQTEVOQlFVc3NRMEZCUVR0WFFVTnNSQ3hEUVVGQkxFVkJRVUU3VjBGRFVpeHZRa0ZCUVN4UFFVRk5MRVZCUVVFc1NVRkJReXhGUVVGQk8yRkJRMG9zUTBGQlF5eERRVUZETEVkQlFVY3NRMEZCUXl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFdEJRVXNzUlVGQlJTeEpRVUZKTzJWQlF6TkNMRzlDUVVGQkxFbEJRVWNzUlVGQlFTeERRVUZCTEVOQlFVTXNSMEZCUVN4RlFVRkhMRU5CUVVVc1NVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF5eEZRVUZGTEVWQlFVTTdiVUpCUTJ4Q0xGTkJRVUVzUlVGQlV5eERRVUZGTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1UwRkJVeXhMUVVGTExFbEJRVWtzUTBGQlF5eEpRVUZKTEVOQlFVTXNSVUZCUlN4SFFVRkhMRkZCUVZFc1IwRkJSeXhGUVVGRkxFVkJRVU03YlVKQlEycEZMRXRCUVVFc1JVRkJTeXhEUVVGRk8zRkNRVU5NTEV0QlFVc3NSVUZCUlN4RFFVRkRMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU1zVDBGQlR5eERRVUZETEVkQlFVY3NSVUZCUlN4UFFVRlBMRU5CUVVNc1RVRkJUU3hGUVVGRkxFOUJRVThzUTBGQlF5eFJRVUZSTEVOQlFVTXNSVUZCUlN4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFZEJRVWNzVFVGQlRTeEhRVUZITEZOQlFWTTdjVUpCUTI1SExHTkJRV01zUlVGQlJTeEpRVUZKTEVOQlFVTXNTMEZCU3l4TFFVRkxMRTlCUVU4c1EwRkJReXhSUVVGUkxFZEJRVWNzWTBGQll5eEhRVUZITEUxQlFVMHNRMEZCUXl4RlFVRkRPMjFDUVVNM1JTeFBRVUZCTEVWQlFVOHNRMEZCUlN4SlFVRkpMRU5CUVVNc1VVRkJVU3hEUVVGRExFbEJRVWtzUTBGQlF5eEpRVUZKTEVWQlFVVXNTVUZCU1N4RFFVRkRMRWxCUVVrc1EwRkJReXhGUVVGRkxFTkJRVVVzUTBGQlJTeERRVUZCTEVWQlFVRTdhVUpCUTNCRUxHOUNRVUZCTEVsQlFVY3NSVUZCUVN4SlFVRkRMRVZCUVVNc1NVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF5eExRVUZYTEVOQlFVRXNSVUZCUVN4dlFrRkJRU3hKUVVGSExFVkJRVUVzU1VGQlF5eEZRVUZETEVsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJWU3hEUVVGQkxFVkJRVUVzYjBKQlFVRXNTVUZCUnl4RlFVRkJMRWxCUVVNc1JVRkJReXhKUVVGSkxFTkJRVU1zU1VGQlNTeERRVUZETEVWQlFWRXNRMEZCUVR0bFFVTjJSU3hEUVVGQk8yTkJRMHc3VlVGRFJ5eERRVUZCTzFGQlEwWXNRMEZCUVR0UFFVTlVMRU5CUVVNN1FVRkRVaXhMUVVGTE96dEpRVVZFTzAxQlEwVXNiMEpCUVVFc1MwRkJTU3hGUVVGQkxFTkJRVUVzUTBGQlF5eFRRVUZCTEVWQlFWTXNRMEZCUXl4cFFrRkJhMElzUTBGQlFTeEZRVUZCTzFGQlF5OUNMRzlDUVVGQkxFdEJRVWtzUlVGQlFTeERRVUZCTEVOQlFVTXNVMEZCUVN4RlFVRlRMRU5CUVVNc1MwRkJUU3hEUVVGQkxFVkJRVUU3VlVGRGJrSXNiMEpCUVVFc1MwRkJTU3hGUVVGQkxFTkJRVUVzUTBGQlF5eFRRVUZCTEVWQlFWTXNRMEZCUXl4WFFVRlpMRU5CUVVFc1JVRkJRVHRaUVVONlFpeHZRa0ZCUVN4UlFVRlBMRVZCUVVFc1NVRkJReXhGUVVGQk8yTkJRMDRzYjBKQlFVRXNTVUZCUnl4RlFVRkJMRU5CUVVFc1EwRkJReXhMUVVGQkxFVkJRVXNzUTBGQlJTeERRVUZETEU5QlFVOHNRMEZCUXl4alFVRmpMRU5CUVVNc1UwRkJVeXhEUVVGRExFZEJRVWNzUTBGQlJ5eERRVUZCTEVWQlFVRXNUMEZCVlN4RFFVRkJMRVZCUVVFN1kwRkROMFFzYjBKQlFVRXNVVUZCVHl4RlFVRkJMRU5CUVVFc1EwRkJReXhKUVVGQkxFVkJRVWtzUTBGQlF5eFJRVUZCTEVWQlFWRXNRMEZCUXl4VFFVRkJMRVZCUVZNc1EwRkJReXcwUWtGQlFTeEZRVUUwUWl4RFFVRkRMRkZCUVVFc1JVRkJVU3hEUVVGRkxFTkJRVU1zU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4VFFVRlRMRVZCUVVNc1EwRkJReXhQUVVGQkxFVkJRVThzUTBGQlJTeEpRVUZKTEVOQlFVTXNVMEZCVnl4RFFVRkJMRVZCUVVFN1owSkJRM0pJTEc5Q1FVRkJMRTFCUVVzc1JVRkJRU3hEUVVGQkxFTkJRVU1zVTBGQlFTeEZRVUZUTEVOQlFVTXNNa0pCUVRSQ0xFTkJRVThzUTBGQlFUdGpRVU0xUXl4RFFVRkJMRVZCUVVFN1kwRkRWQ3h2UWtGQlFTeFJRVUZQTEVWQlFVRXNRMEZCUVN4RFFVRkRMRWxCUVVFc1JVRkJTU3hEUVVGRExGRkJRVUVzUlVGQlVTeERRVUZETEZOQlFVRXNSVUZCVXl4RFFVRkRMRFJDUVVGQkxFVkJRVFJDTEVOQlFVTXNVVUZCUVN4RlFVRlJMRU5CUVVVc1EwRkJReXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEZOQlFWTXNSVUZCUXl4RFFVRkRMRTlCUVVFc1JVRkJUeXhEUVVGRkxFbEJRVWtzUTBGQlF5eFRRVUZYTEVOQlFVRXNSVUZCUVR0blFrRkRja2dzYjBKQlFVRXNUVUZCU3l4RlFVRkJMRU5CUVVFc1EwRkJReXhUUVVGQkxFVkJRVk1zUTBGQlF5dzBRa0ZCTmtJc1EwRkJUeXhEUVVGQk8yTkJRemRETEVOQlFVRXNSVUZCUVR0alFVTlVMRzlDUVVGQkxGRkJRVThzUlVGQlFTeERRVUZCTEVOQlFVTXNTVUZCUVN4RlFVRkpMRU5CUVVNc1VVRkJRU3hGUVVGUkxFTkJRVU1zVTBGQlFTeEZRVUZUTEVOQlFVTXNORUpCUVVFc1JVRkJORUlzUTBGQlF5eFBRVUZCTEVWQlFVOHNRMEZCUlN4SlFVRkpMRU5CUVVNc1RVRkJVU3hEUVVGQkxFVkJRVUU3WjBKQlEycEdMRzlDUVVGQkxFMUJRVXNzUlVGQlFTeERRVUZCTEVOQlFVTXNVMEZCUVN4RlFVRlRMRU5CUVVNc01FSkJRVEpDTEVOQlFVOHNRMEZCUVR0alFVTXpReXhEUVVGQk8xbEJRMFlzUTBGQlFUdFZRVU5NTEVOQlFVRXNSVUZCUVR0VlFVTk9MRzlDUVVGQkxFdEJRVWtzUlVGQlFTeERRVUZCTEVOQlFVTXNVMEZCUVN4RlFVRlRMRU5CUVVNc1YwRkJXU3hEUVVGQkxFVkJRVUU3V1VGRGVFSXNUMEZCVVR0VlFVTk1MRU5CUVVFN1VVRkRSaXhEUVVGQk8wMUJRMFlzUTBGQlFUdE5RVU5PTzBGQlEwNHNSMEZCUnpzN1JVRkZSQ3hSUVVGUkxFVkJRVVVzVlVGQlZTeEZRVUZGTEVWQlFVVTdTVUZEZEVJc1NVRkJTU3hEUVVGRExGRkJRVkVzUTBGQlF5eERRVUZETEZOQlFWTXNSVUZCUlN4RlFVRkZMRU5CUVVNc1EwRkJReXhEUVVGRE8wRkJRMjVETEVkQlFVYzdPMFZCUlVRc1RVRkJUU3hGUVVGRkxGbEJRVms3U1VGRGJFSXNTVUZCU1N4UFFVRlBMRWRCUVVjc1MwRkJTeXhEUVVGRExHRkJRV0VzUTBGQlF5eFBRVUZQTEVOQlFVTXNNRUpCUVRCQ0xFTkJRVU1zUTBGQlF5eERRVUZETzBsQlEzWkZMRkZCUVZFc1EwRkJReXhKUVVGSkxFTkJRVU1zVDBGQlR5eERRVUZETzAxQlEzQkNMRlZCUVZVc1JVRkJSU3hEUVVGRExGTkJRVk1zUlVGQlJTeFJRVUZSTEV0QlFVczdVVUZEYmtNc1NVRkJTU3hGUVVGRkxFZEJRVWNzVjBGQlZ5eERRVUZETEVsQlFVa3NRMEZCUXl4VFFVRlRMRVZCUVVVc1VVRkJVU3hEUVVGRExFTkJRVU03VVVGREwwTXNTVUZCU1N4RFFVRkRMRkZCUVZFc1EwRkJReXhEUVVGRExGTkJRVk1zUlVGQlJTeEZRVUZGTEVOQlFVTXNRMEZCUXl4RFFVRkRPMUZCUXk5Q0xFOUJRVThzUTBGQlF5eEhRVUZITEVOQlFVTXNiMEpCUVc5Q0xFVkJRVVVzUlVGQlJTeERRVUZETEVOQlFVTTdUMEZEZGtNN1MwRkRSaXhGUVVGRkxFbEJRVWtzUTBGQlF5eERRVUZETEVOQlFVTTdRVUZEWkN4SFFVRkhPenRGUVVWRUxGTkJRVk1zUlVGQlJTeFpRVUZaTzBsQlEzSkNMRWxCUVVrc1NVRkJTU3hIUVVGSExFMUJRVTBzUTBGQlF5eFZRVUZWTEVOQlFVTXNSMEZCUnl4RFFVRkRMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVTBGQlV5eERRVUZETEVOQlFVTTdTVUZEZGtRc1NVRkJTU3hQUVVGUExFZEJRVWNzUzBGQlN5eERRVUZETEdGQlFXRXNRMEZCUXl4UFFVRlBMRU5CUVVNc01FSkJRVEJDTEVOQlFVTXNRMEZCUXl4RFFVRkRPMGxCUTNaRkxFOUJRVThzVVVGQlVTeERRVUZETEVsQlFVa3NRMEZCUXl4UFFVRlBMRU5CUVVNN1RVRkRNMElzVTBGQlV5eEZRVUZGTEVsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1MwRkJTenROUVVNeFFpeFJRVUZSTEVWQlFVVXNTVUZCU1N4RFFVRkRMRWxCUVVrc1EwRkJReXhKUVVGSk8wMUJRM2hDTEZWQlFWVXNSVUZCUlN4RFFVRkRMRk5CUVZNc1JVRkJSU3hSUVVGUkxFdEJRVXNzVjBGQlZ5eERRVUZETEVkQlFVY3NRMEZCUXl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExGTkJRVk1zUlVGQlJTeFRRVUZUTEVWQlFVVXNVVUZCVVN4RFFVRkRPMHRCUTJoSExFVkJRVVVzU1VGQlNTeERRVUZETEVOQlFVTXNRMEZCUXp0QlFVTmtMRWRCUVVjN08wVkJSVVFzVTBGQlV5eEZRVUZGTEZsQlFWazdTVUZEY2tJc1YwRkJWeXhEUVVGRExFMUJRVTBzUTBGQlF5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRk5CUVZNc1EwRkJReXhEUVVGRE8wbEJRM3BETEVsQlFVa3NRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJReXhUUVVGVExFVkJRVVVzU1VGQlNTeERRVUZETEVOQlFVTXNRMEZCUXp0QlFVTnlReXhIUVVGSE96dERRVVZHTEVOQlFVTXNRMEZCUXlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklpZDFjMlVnYzNSeWFXTjBKenRjYmx4dWRtRnlJRjhnUFNCeVpYRjFhWEpsS0Nkc2IyUmhjMmduS1R0Y2JseHVkbUZ5SUZKbFlXTjBJRDBnY21WeGRXbHlaU2duY21WaFkzUXZZV1JrYjI1ekp5azdYRzVjYm5aaGNpQlRkRzl5WlhNZ1BTQnlaWEYxYVhKbEtDY3VMaTl6ZEc5eVpYTW5LU3hjYmlBZ0lDQnpkRzl5WlVOb1lXNW5aVTFwZUdsdUlEMGdjbVZ4ZFdseVpTZ25MaTR2YldsNGFXNXpMM04wYjNKbExXTm9ZVzVuWlNjcE8xeHVYRzUyWVhJZ2ExTjBZWFJsY3lBOUlISmxjWFZwY21Vb0p5NHVMMk52Ym5OMFlXNTBjeTl6ZEdGMFpYTW5LVHRjYmx4dWRtRnlJRWwwWlcxQlkzUnBiMjV6SUQwZ2NtVnhkV2x5WlNnbkxpNHZZV04wYVc5dWN5OXBkR1Z0Y3ljcE8xeHVYRzUyWVhJZ1QzWmxjbXhoZVhNZ1BTQnlaWEYxYVhKbEtDY3VMaTloWTNScGIyNXpMMjkyWlhKc1lYbHpKeWs3WEc1Y2JpOHFLbHh1SUNvZ1UybHRjR3hsSUdWNFlXMXdiR1VnYjJZZ1lTQmlZWE5wWXlCRFVsVkVJR2x1ZEdWeVptRmpaUzRnSUV4cGMzUWdhWFJsYlhNZ1lXNWtJSE4xY0hCdmNuUnpYRzRnS2lCamNtVmhkR1VzSUdWa2FYUXNJR1JsYkdWMFpTQnZaaUJwZEdWdGN5QnBiaUJzYVhOMExseHVJQ3BjYmlBcUlGVnpaWE1nZEdobElFTlNWVVFnWW1GelpXUWdTWFJsYlNCVGRHOXlaU0JoYm1RZ1FXTjBhVzl1Y3k0Z0lFeHBjM1JsYm5NZ2RHOGdZMmhoYm1kbGN5QjBieUIwYUdWY2JpQXFJRWwwWlcwZ2MzUnZjbVV1SUNCVmMyVnpJRkpsWVdOMGN5QlFkWEpsVW1WdVpHVnlUV2w0YVc0Z2RHOGdiMjVzZVNCeVpXNWtaWElnZDJobGJpQnpkR0YwWlNCdmNseHVJQ29nY0hKdmNITWdhR0YyWlNCamFHRnVaMlZrSUNoM2IzVnNaQ0IzYjNKcklHVjJaVzRnWW1WMGRHVnlJR2xtSUhWemFXNW5JRWx0YlhWMFlXSnNaU0JLVXlsY2JpQXFMMXh1WEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUZKbFlXTjBMbU55WldGMFpVTnNZWE56S0h0Y2JseHVJQ0J0YVhocGJuTTZJRnR6ZEc5eVpVTm9ZVzVuWlUxcGVHbHVLRk4wYjNKbGN5NUpkR1Z0YzFOMGIzSmxLU3dnVW1WaFkzUXVZV1JrYjI1ekxsQjFjbVZTWlc1a1pYSk5hWGhwYmwwc1hHNWNiaUFnWjJWMFNXNXBkR2xoYkZOMFlYUmxPaUJtZFc1amRHbHZiaUFvS1NCN1hHNGdJQ0FnY21WMGRYSnVJSHRjYmlBZ0lDQWdJR2wwWlcxek9pQlRkRzl5WlhNdVNYUmxiWE5UZEc5eVpTNW5aWFJCYkd3b0tTeGNiaUFnSUNBZ0lITmxiR1ZqZEdsdmJqb2diblZzYkZ4dUlDQWdJSDA3WEc0Z0lIMHNYRzVjYmlBZ2MzUnZjbVZEYUdGdVoyVTZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0IwYUdsekxuTmxkRk4wWVhSbEtIdHBkR1Z0Y3pvZ1UzUnZjbVZ6TGtsMFpXMXpVM1J2Y21VdVoyVjBRV3hzS0NsOUtUdGNiaUFnZlN4Y2JseHVJQ0J5Wlc1a1pYSTZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JseHVJQ0FnSUhaaGNpQmpiMjUwWlc1ME8xeHVYRzRnSUNBZ2FXWWdLQ0YwYUdsekxuTjBZWFJsTG1sMFpXMXpLU0I3WEc0Z0lDQWdJQ0JqYjI1MFpXNTBJRDBnUEdScGRqNU1iMkZrYVc1bkxpNHVQQzlrYVhZK08xeHVJQ0FnSUgxY2JpQWdJQ0JsYkhObElIdGNiaUFnSUNBZ0lHTnZiblJsYm5RZ1BTQW9YRzRnSUNBZ0lDQWdJRHgwWVdKc1pTQmpiR0Z6YzA1aGJXVTlYQ0owWVdKc1pWd2lQbHh1SUNBZ0lDQWdJQ0FnSUR4MGFHVmhaRDVjYmlBZ0lDQWdJQ0FnSUNBZ0lEeDBjajQ4ZEdnK1JtbHljM1FnVG1GdFpUd3ZkR2crUEhSb1BreGhjM1FnVG1GdFpUd3ZkR2crUEhSb1BrbGtQQzkwYUQ0OEwzUnlQbHh1SUNBZ0lDQWdJQ0FnSUNBOEwzUm9aV0ZrUGx4dUlDQWdJQ0FnSUNBZ0lDQThkR0p2WkhrK1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnZTE4dWJXRndLSFJvYVhNdWMzUmhkR1V1YVhSbGJYTXNJR2wwWlcwZ1BUNWNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lEeDBjaUJyWlhrOWUybDBaVzB1WkdGMFlTNXBaSDFjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCamJHRnpjMDVoYldVOWUzUm9hWE11YzNSaGRHVXVjMlZzWldOMGFXOXVJRDA5UFNCcGRHVnRMbVJoZEdFdWFXUWdQeUFuWVdOMGFYWmxKeUE2SUNjbmZWeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSE4wZVd4bFBYdDdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCamIyeHZjam9nWHk1amIyNTBZV2x1Y3loYmExTjBZWFJsY3k1T1JWY3NJR3RUZEdGMFpYTXVVMEZXU1U1SExDQnJVM1JoZEdWekxrUkZURVZVU1U1SFhTd2dhWFJsYlM1emRHRjBaU2tnUHlBbkkyTmpZeWNnT2lBbmFXNW9aWEpwZENjc1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0IwWlhoMFJHVmpiM0poZEdsdmJqb2dhWFJsYlM1emRHRjBaU0E5UFQwZ2ExTjBZWFJsY3k1RVJVeEZWRWxPUnlBL0lDZHNhVzVsTFhSb2NtOTFaMmduSURvZ0oyNXZibVVuZlgxY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQnZia05zYVdOclBYdDBhR2x6TGw5dmJrTnNhV05yTG1KcGJtUW9kR2hwY3l3Z2FYUmxiUzVrWVhSaExtbGtLWDBnUGx4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOGRHUStlMmwwWlcwdVpHRjBZUzVtYVhKemRIMDhMM1JrUGp4MFpENTdhWFJsYlM1a1lYUmhMbXhoYzNSOVBDOTBaRDQ4ZEdRK2UybDBaVzB1WkdGMFlTNXBaSDA4TDNSa1BseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BDOTBjajVjYmlBZ0lDQWdJQ0FnSUNBZ0lDQXBmVnh1SUNBZ0lDQWdJQ0FnSUR3dmRHSnZaSGsrWEc0Z0lDQWdJQ0FnSUR3dmRHRmliR1UrWEc0Z0lDQWdJQ0FwTzF4dUlDQWdJSDFjYmx4dUlDQWdJSEpsZEhWeWJpQW9YRzRnSUNBZ0lDQThaR2wySUdOc1lYTnpUbUZ0WlQxY0ltTnZiblJoYVc1bGNpMW1iSFZwWkZ3aVBseHVJQ0FnSUNBZ0lDQThaR2wySUdOc1lYTnpUbUZ0WlQxY0luSnZkMXdpUGx4dUlDQWdJQ0FnSUNBZ0lEeGthWFlnWTJ4aGMzTk9ZVzFsUFZ3aVkyOXNMWGh6TFRFeVhDSStYRzRnSUNBZ0lDQWdJQ0FnSUNBOGFHVmhaR1Z5UGx4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0E4YURNZ2MzUjViR1U5ZTN0a2FYTndiR0Y1T2lkcGJteHBibVV0WW14dlkyc25MRzFoY21kcGJsUnZjRG9uTUNkOWZUNUpkR1Z0Y3p3dmFETStYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lEeGlkWFIwYjI0Z2RIbHdaVDFjSW1KMWRIUnZibHdpSUdOc1lYTnpUbUZ0WlQxY0ltSjBiaUJpZEc0dFpHVm1ZWFZzZENCd2RXeHNMWEpwWjJoMFhDSWdaR2x6WVdKc1pXUTlleUYwYUdsekxuTjBZWFJsTG5ObGJHVmpkR2x2Ym4wZ2IyNURiR2xqYXoxN2RHaHBjeTVmYjI1RVpXeGxkR1Y5UGx4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4emNHRnVJR05zWVhOelRtRnRaVDFjSW1kc2VYQm9hV052YmlCbmJIbHdhR2xqYjI0dGRISmhjMmhjSWo0OEwzTndZVzQrWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJRHd2WW5WMGRHOXVQbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQThZblYwZEc5dUlIUjVjR1U5WENKaWRYUjBiMjVjSWlCamJHRnpjMDVoYldVOVhDSmlkRzRnWW5SdUxXUmxabUYxYkhRZ2NIVnNiQzF5YVdkb2RGd2lJR1JwYzJGaWJHVmtQWHNoZEdocGN5NXpkR0YwWlM1elpXeGxZM1JwYjI1OUlHOXVRMnhwWTJzOWUzUm9hWE11WDI5dVZYQmtZWFJsZlQ1Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOGMzQmhiaUJqYkdGemMwNWhiV1U5WENKbmJIbHdhR2xqYjI0Z1oyeDVjR2hwWTI5dUxYQmxibU5wYkZ3aVBqd3ZjM0JoYmo1Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnUEM5aWRYUjBiMjQrWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJRHhpZFhSMGIyNGdkSGx3WlQxY0ltSjFkSFJ2Ymx3aUlHTnNZWE56VG1GdFpUMWNJbUowYmlCaWRHNHRaR1ZtWVhWc2RDQndkV3hzTFhKcFoyaDBYQ0lnYjI1RGJHbGphejE3ZEdocGN5NWZiMjVCWkdSOVBseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeHpjR0Z1SUdOc1lYTnpUbUZ0WlQxY0ltZHNlWEJvYVdOdmJpQm5iSGx3YUdsamIyNHRjR3gxYzF3aVBqd3ZjM0JoYmo1Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnUEM5aWRYUjBiMjQrWEc0Z0lDQWdJQ0FnSUNBZ0lDQThMMmhsWVdSbGNqNWNiaUFnSUNBZ0lDQWdJQ0E4TDJScGRqNWNiaUFnSUNBZ0lDQWdJQ0E4WkdsMklHTnNZWE56VG1GdFpUMWNJbU52YkMxNGN5MHhNbHdpUGx4dUlDQWdJQ0FnSUNBZ0lDQWdlMk52Ym5SbGJuUjlYRzRnSUNBZ0lDQWdJQ0FnUEM5a2FYWStYRzRnSUNBZ0lDQWdJRHd2WkdsMlBseHVJQ0FnSUNBZ1BDOWthWFkrWEc0Z0lDQWdLVHRjYmlBZ2ZTeGNibHh1SUNCZmIyNURiR2xqYXpvZ1puVnVZM1JwYjI0Z0tHbGtLU0I3WEc0Z0lDQWdkR2hwY3k1elpYUlRkR0YwWlNoN2MyVnNaV04wYVc5dU9pQnBaSDBwTzF4dUlDQjlMRnh1WEc0Z0lGOXZia0ZrWkRvZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lIWmhjaUJ2ZG1WeWJHRjVJRDBnVW1WaFkzUXVZM0psWVhSbFJtRmpkRzl5ZVNoeVpYRjFhWEpsS0NjdUwyOTJaWEpzWVhsekwybDBaVzB0Wm05eWJTNXFjM2duS1NrN1hHNGdJQ0FnVDNabGNteGhlWE11Y0hWemFDaHZkbVZ5YkdGNUtIdGNiaUFnSUNBZ0lHOXJRMkZzYkdKaFkyczZJQ2htYVhKemRFNWhiV1VzSUd4aGMzUk9ZVzFsS1NBOVBpQjdYRzRnSUNBZ0lDQWdJSFpoY2lCcFpDQTlJRWwwWlcxQlkzUnBiMjV6TG5CdmMzUW9abWx5YzNST1lXMWxMQ0JzWVhOMFRtRnRaU2s3WEc0Z0lDQWdJQ0FnSUhSb2FYTXVjMlYwVTNSaGRHVW9lM05sYkdWamRHbHZiam9nYVdSOUtUdGNiaUFnSUNBZ0lDQWdZMjl1YzI5c1pTNXNiMmNvWUdOeVpXRjBaU0J1WlhjZ2FYUmxiU0FqSkh0cFpIMWdLVHRjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlMQ0J1ZFd4c0tTazdYRzRnSUgwc1hHNWNiaUFnWDI5dVZYQmtZWFJsT2lCbWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ2RtRnlJR2wwWlcwZ1BTQlRkRzl5WlhNdVNYUmxiWE5UZEc5eVpTNW5aWFFvZEdocGN5NXpkR0YwWlM1elpXeGxZM1JwYjI0cE8xeHVJQ0FnSUhaaGNpQnZkbVZ5YkdGNUlEMGdVbVZoWTNRdVkzSmxZWFJsUm1GamRHOXllU2h5WlhGMWFYSmxLQ2N1TDI5MlpYSnNZWGx6TDJsMFpXMHRabTl5YlM1cWMzZ25LU2s3WEc0Z0lDQWdjbVYwZFhKdUlFOTJaWEpzWVhsekxuQjFjMmdvYjNabGNteGhlU2g3WEc0Z0lDQWdJQ0JtYVhKemRFNWhiV1U2SUdsMFpXMHVaR0YwWVM1bWFYSnpkQ3hjYmlBZ0lDQWdJR3hoYzNST1lXMWxPaUJwZEdWdExtUmhkR0V1YkdGemRDeGNiaUFnSUNBZ0lHOXJRMkZzYkdKaFkyczZJQ2htYVhKemRFNWhiV1VzSUd4aGMzUk9ZVzFsS1NBOVBpQkpkR1Z0UVdOMGFXOXVjeTV3ZFhRb2RHaHBjeTV6ZEdGMFpTNXpaV3hsWTNScGIyNHNJR1pwY25OMFRtRnRaU3dnYkdGemRFNWhiV1VwWEc0Z0lDQWdmU3dnYm5Wc2JDa3BPMXh1SUNCOUxGeHVYRzRnSUY5dmJrUmxiR1YwWlRvZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lFbDBaVzFCWTNScGIyNXpMbVJsYkdWMFpTaDBhR2x6TG5OMFlYUmxMbk5sYkdWamRHbHZiaWs3WEc0Z0lDQWdkR2hwY3k1elpYUlRkR0YwWlNoN2MyVnNaV04wYVc5dU9pQnVkV3hzZlNrN1hHNGdJSDFjYmx4dWZTazdYRzRpWFgwPSIsIid1c2Ugc3RyaWN0JztcblxudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QvYWRkb25zJyk7XG5cbnZhciBSb3V0ZXIgPSByZXF1aXJlKCdyZWFjdC1yb3V0ZXInKSxcbiAgICBMaW5rID0gUm91dGVyLkxpbms7XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcImV4cG9ydHNcIixcbiAgbWl4aW5zOiBbUm91dGVyLlN0YXRlXSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJuYXZcIiwge2NsYXNzTmFtZTogXCJuYXZiYXIgbmF2YmFyLWRlZmF1bHRcIn0sIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiY29udGFpbmVyLWZsdWlkXCJ9LCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwibmF2YmFyLWhlYWRlclwifSwgXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIsIHt0eXBlOiBcImJ1dHRvblwiLCBjbGFzc05hbWU6IFwibmF2YmFyLXRvZ2dsZSBjb2xsYXBzZWRcIiwgXCJkYXRhLXRvZ2dsZVwiOiBcImNvbGxhcHNlXCIsIFwiZGF0YS10YXJnZXRcIjogXCIjYnMtZXhhbXBsZS1uYXZiYXItY29sbGFwc2UtMVwifSwgXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtjbGFzc05hbWU6IFwic3Itb25seVwifSwgXCJUb2dnbGUgbmF2aWdhdGlvblwiKSwgXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtjbGFzc05hbWU6IFwiaWNvbi1iYXJcIn0pLCBcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwge2NsYXNzTmFtZTogXCJpY29uLWJhclwifSksIFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7Y2xhc3NOYW1lOiBcImljb24tYmFyXCJ9KVxuICAgICAgICAgICAgKSwgXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KExpbmssIHt0bzogXCJyb290XCIsIGNsYXNzTmFtZTogXCJuYXZiYXItYnJhbmRcIn0sIHdpbmRvdy5FWC5jb25zdC50aXRsZSlcbiAgICAgICAgICApLCBcblxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJjb2xsYXBzZSBuYXZiYXItY29sbGFwc2VcIiwgaWQ6IFwiYnMtZXhhbXBsZS1uYXZiYXItY29sbGFwc2UtMVwifSwgXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidWxcIiwge2NsYXNzTmFtZTogXCJuYXYgbmF2YmFyLW5hdlwifSwgXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCB7Y2xhc3NOYW1lOiB0aGlzLmlzQWN0aXZlKCdpdGVtcycpID8gXCJhY3RpdmVcIiA6ICcnfSwgUmVhY3QuY3JlYXRlRWxlbWVudChMaW5rLCB7dG86IFwiaXRlbXNcIn0sIFwiSXRlbXNcIikpLCBcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImxpXCIsIHtjbGFzc05hbWU6IHRoaXMuaXNBY3RpdmUoJ3NlcnZlci10aW1lJykgPyBcImFjdGl2ZVwiIDogJyd9LCBSZWFjdC5jcmVhdGVFbGVtZW50KExpbmssIHt0bzogXCJzZXJ2ZXItdGltZVwifSwgXCJTZXJ2ZXItVGltZVwiKSlcbiAgICAgICAgICAgIClcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pTDFWelpYSnpMMmhpZFhKeWIzZHpMMlJsZGk5b1pYSnZhM1V2Y21WaFkzUXRabXgxZUMxemRHRnlkR1Z5TDNCMVlteHBZeTlxWVhaaGMyTnlhWEIwY3k5amIyMXdiMjVsYm5SekwyNWhkaTFpWVhJdWFuTjRJaXdpYzI5MWNtTmxjeUk2V3lJdlZYTmxjbk12YUdKMWNuSnZkM012WkdWMkwyaGxjbTlyZFM5eVpXRmpkQzFtYkhWNExYTjBZWEowWlhJdmNIVmliR2xqTDJwaGRtRnpZM0pwY0hSekwyTnZiWEJ2Ym1WdWRITXZibUYyTFdKaGNpNXFjM2dpWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJa0ZCUVVFc1dVRkJXU3hEUVVGRE96dEJRVVZpTEVsQlFVa3NTMEZCU3l4SFFVRkhMRTlCUVU4c1EwRkJReXhqUVVGakxFTkJRVU1zUTBGQlF6czdRVUZGY0VNc1NVRkJTU3hOUVVGTkxFZEJRVWNzVDBGQlR5eERRVUZETEdOQlFXTXNRMEZCUXp0QlFVTndReXhKUVVGSkxFbEJRVWtzUjBGQlJ5eE5RVUZOTEVOQlFVTXNTVUZCU1N4RFFVRkRPenRCUVVWMlFpeHZRMEZCYjBNc2RVSkJRVUU3UlVGRGJFTXNUVUZCVFN4RlFVRkZMRU5CUVVNc1RVRkJUU3hEUVVGRExFdEJRVXNzUTBGQlF6dEZRVU4wUWl4TlFVRk5MRVZCUVVVc1dVRkJXVHRKUVVOc1FqdE5RVU5GTEc5Q1FVRkJMRXRCUVVrc1JVRkJRU3hEUVVGQkxFTkJRVU1zVTBGQlFTeEZRVUZUTEVOQlFVTXNkVUpCUVhkQ0xFTkJRVUVzUlVGQlFUdFJRVU55UXl4dlFrRkJRU3hMUVVGSkxFVkJRVUVzUTBGQlFTeERRVUZETEZOQlFVRXNSVUZCVXl4RFFVRkRMR2xDUVVGclFpeERRVUZCTEVWQlFVRTdWVUZETDBJc2IwSkJRVUVzUzBGQlNTeEZRVUZCTEVOQlFVRXNRMEZCUXl4VFFVRkJMRVZCUVZNc1EwRkJReXhsUVVGblFpeERRVUZCTEVWQlFVRTdXVUZETjBJc2IwSkJRVUVzVVVGQlR5eEZRVUZCTEVOQlFVRXNRMEZCUXl4SlFVRkJMRVZCUVVrc1EwRkJReXhSUVVGQkxFVkJRVkVzUTBGQlF5eFRRVUZCTEVWQlFWTXNRMEZCUXl4NVFrRkJRU3hGUVVGNVFpeERRVUZETEdGQlFVRXNSVUZCVnl4RFFVRkRMRlZCUVVFc1JVRkJWU3hEUVVGRExHRkJRVUVzUlVGQlZ5eERRVUZETEN0Q1FVRm5ReXhEUVVGQkxFVkJRVUU3WTBGRE0wZ3NiMEpCUVVFc1RVRkJTeXhGUVVGQkxFTkJRVUVzUTBGQlF5eFRRVUZCTEVWQlFWTXNRMEZCUXl4VFFVRlZMRU5CUVVFc1JVRkJRU3h0UWtGQmQwSXNRMEZCUVN4RlFVRkJPMk5CUTJ4RUxHOUNRVUZCTEUxQlFVc3NSVUZCUVN4RFFVRkJMRU5CUVVNc1UwRkJRU3hGUVVGVExFTkJRVU1zVlVGQlZ5eERRVUZQTEVOQlFVRXNSVUZCUVR0alFVTnNReXh2UWtGQlFTeE5RVUZMTEVWQlFVRXNRMEZCUVN4RFFVRkRMRk5CUVVFc1JVRkJVeXhEUVVGRExGVkJRVmNzUTBGQlR5eERRVUZCTEVWQlFVRTdZMEZEYkVNc2IwSkJRVUVzVFVGQlN5eEZRVUZCTEVOQlFVRXNRMEZCUXl4VFFVRkJMRVZCUVZNc1EwRkJReXhWUVVGWExFTkJRVThzUTBGQlFUdFpRVU16UWl4RFFVRkJMRVZCUVVFN1dVRkRWQ3h2UWtGQlF5eEpRVUZKTEVWQlFVRXNRMEZCUVN4RFFVRkRMRVZCUVVFc1JVRkJSU3hEUVVGRExFMUJRVUVzUlVGQlRTeERRVUZETEZOQlFVRXNSVUZCVXl4RFFVRkRMR05CUVdNc1EwRkJSU3hEUVVGQkxFVkJRVU1zVFVGQlRTeERRVUZETEVWQlFVVXNRMEZCUXl4TFFVRkxMRU5CUVVNc1MwRkJZU3hEUVVGQk8wRkJRM0JHTEZWQlFXZENMRU5CUVVFc1JVRkJRVHM3VlVGRlRpeHZRa0ZCUVN4TFFVRkpMRVZCUVVFc1EwRkJRU3hEUVVGRExGTkJRVUVzUlVGQlV5eERRVUZETERCQ1FVRkJMRVZCUVRCQ0xFTkJRVU1zUlVGQlFTeEZRVUZGTEVOQlFVTXNPRUpCUVN0Q0xFTkJRVUVzUlVGQlFUdFpRVU14UlN4dlFrRkJRU3hKUVVGSExFVkJRVUVzUTBGQlFTeERRVUZETEZOQlFVRXNSVUZCVXl4RFFVRkRMR2RDUVVGcFFpeERRVUZCTEVWQlFVRTdZMEZETjBJc2IwSkJRVUVzU1VGQlJ5eEZRVUZCTEVOQlFVRXNRMEZCUXl4VFFVRkJMRVZCUVZNc1EwRkJSU3hKUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETEU5QlFVOHNRMEZCUXl4SFFVRkhMRkZCUVZFc1IwRkJSeXhGUVVGSkxFTkJRVUVzUlVGQlFTeHZRa0ZCUXl4SlFVRkpMRVZCUVVFc1EwRkJRU3hEUVVGRExFVkJRVUVzUlVGQlJTeERRVUZETEU5QlFWRXNRMEZCUVN4RlFVRkJMRTlCUVZrc1EwRkJTeXhEUVVGQkxFVkJRVUU3WTBGRGVrWXNiMEpCUVVFc1NVRkJSeXhGUVVGQkxFTkJRVUVzUTBGQlF5eFRRVUZCTEVWQlFWTXNRMEZCUlN4SlFVRkpMRU5CUVVNc1VVRkJVU3hEUVVGRExHRkJRV0VzUTBGQlF5eEhRVUZITEZGQlFWRXNSMEZCUnl4RlFVRkpMRU5CUVVFc1JVRkJRU3h2UWtGQlF5eEpRVUZKTEVWQlFVRXNRMEZCUVN4RFFVRkRMRVZCUVVFc1JVRkJSU3hEUVVGRExHRkJRV01zUTBGQlFTeEZRVUZCTEdGQlFXdENMRU5CUVVzc1EwRkJRVHRaUVVONFJ5eERRVUZCTzFWQlEwUXNRMEZCUVR0UlFVTkdMRU5CUVVFN1RVRkRSaXhEUVVGQk8wMUJRMDQ3UjBGRFNEdERRVU5HTEVOQlFVTXNRMEZCUXlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklpZDFjMlVnYzNSeWFXTjBKenRjYmx4dWRtRnlJRkpsWVdOMElEMGdjbVZ4ZFdseVpTZ25jbVZoWTNRdllXUmtiMjV6SnlrN1hHNWNiblpoY2lCU2IzVjBaWElnUFNCeVpYRjFhWEpsS0NkeVpXRmpkQzF5YjNWMFpYSW5LU3hjYmlBZ0lDQk1hVzVySUQwZ1VtOTFkR1Z5TGt4cGJtczdYRzVjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnVW1WaFkzUXVZM0psWVhSbFEyeGhjM01vZTF4dUlDQnRhWGhwYm5NNklGdFNiM1YwWlhJdVUzUmhkR1ZkTEZ4dUlDQnlaVzVrWlhJNklHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQnlaWFIxY200Z0tGeHVJQ0FnSUNBZ1BHNWhkaUJqYkdGemMwNWhiV1U5WENKdVlYWmlZWElnYm1GMlltRnlMV1JsWm1GMWJIUmNJajVjYmlBZ0lDQWdJQ0FnUEdScGRpQmpiR0Z6YzA1aGJXVTlYQ0pqYjI1MFlXbHVaWEl0Wm14MWFXUmNJajVjYmlBZ0lDQWdJQ0FnSUNBOFpHbDJJR05zWVhOelRtRnRaVDFjSW01aGRtSmhjaTFvWldGa1pYSmNJajVjYmlBZ0lDQWdJQ0FnSUNBZ0lEeGlkWFIwYjI0Z2RIbHdaVDFjSW1KMWRIUnZibHdpSUdOc1lYTnpUbUZ0WlQxY0ltNWhkbUpoY2kxMGIyZG5iR1VnWTI5c2JHRndjMlZrWENJZ1pHRjBZUzEwYjJkbmJHVTlYQ0pqYjJ4c1lYQnpaVndpSUdSaGRHRXRkR0Z5WjJWMFBWd2lJMkp6TFdWNFlXMXdiR1V0Ym1GMlltRnlMV052Ykd4aGNITmxMVEZjSWo1Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnUEhOd1lXNGdZMnhoYzNOT1lXMWxQVndpYzNJdGIyNXNlVndpUGxSdloyZHNaU0J1WVhacFoyRjBhVzl1UEM5emNHRnVQbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQThjM0JoYmlCamJHRnpjMDVoYldVOVhDSnBZMjl1TFdKaGNsd2lQand2YzNCaGJqNWNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ1BITndZVzRnWTJ4aGMzTk9ZVzFsUFZ3aWFXTnZiaTFpWVhKY0lqNDhMM053WVc0K1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUR4emNHRnVJR05zWVhOelRtRnRaVDFjSW1samIyNHRZbUZ5WENJK1BDOXpjR0Z1UGx4dUlDQWdJQ0FnSUNBZ0lDQWdQQzlpZFhSMGIyNCtYRzRnSUNBZ0lDQWdJQ0FnSUNBOFRHbHVheUIwYnoxY0luSnZiM1JjSWlCamJHRnpjMDVoYldVOVhDSnVZWFppWVhJdFluSmhibVJjSWlBK2UzZHBibVJ2ZHk1RldDNWpiMjV6ZEM1MGFYUnNaWDA4TDB4cGJtcytYRzRnSUNBZ0lDQWdJQ0FnUEM5a2FYWStYRzVjYmlBZ0lDQWdJQ0FnSUNBOFpHbDJJR05zWVhOelRtRnRaVDFjSW1OdmJHeGhjSE5sSUc1aGRtSmhjaTFqYjJ4c1lYQnpaVndpSUdsa1BWd2lZbk10WlhoaGJYQnNaUzF1WVhaaVlYSXRZMjlzYkdGd2MyVXRNVndpUGx4dUlDQWdJQ0FnSUNBZ0lDQWdQSFZzSUdOc1lYTnpUbUZ0WlQxY0ltNWhkaUJ1WVhaaVlYSXRibUYyWENJK1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUR4c2FTQmpiR0Z6YzA1aGJXVTllM1JvYVhNdWFYTkJZM1JwZG1Vb0oybDBaVzF6SnlrZ1B5QmNJbUZqZEdsMlpWd2lJRG9nSnlkOVBqeE1hVzVySUhSdlBWd2lhWFJsYlhOY0lqNUpkR1Z0Y3p3dlRHbHVhejQ4TDJ4cFBseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBOGJHa2dZMnhoYzNOT1lXMWxQWHQwYUdsekxtbHpRV04wYVhabEtDZHpaWEoyWlhJdGRHbHRaU2NwSUQ4Z1hDSmhZM1JwZG1WY0lpQTZJQ2NuZlQ0OFRHbHVheUIwYnoxY0luTmxjblpsY2kxMGFXMWxYQ0krVTJWeWRtVnlMVlJwYldVOEwweHBibXMrUEM5c2FUNWNiaUFnSUNBZ0lDQWdJQ0FnSUR3dmRXdytYRzRnSUNBZ0lDQWdJQ0FnUEM5a2FYWStYRzRnSUNBZ0lDQWdJRHd2WkdsMlBseHVJQ0FnSUNBZ1BDOXVZWFkrWEc0Z0lDQWdLVHRjYmlBZ2ZWeHVmU2s3WEc0aVhYMD0iLCIndXNlIHN0cmljdCc7XG5cbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG5cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0L2FkZG9ucycpO1xudmFyIE92ZXJsYXlNaXhpbiA9IHJlcXVpcmUoJy4uLy4uL21peGlucy9vdmVybGF5Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcImV4cG9ydHNcIixcblxuICBtaXhpbnM6IFtPdmVybGF5TWl4aW5dLFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBjb250ZW50O1xuXG4gICAgaWYgKF8uaXNTdHJpbmcodGhpcy5wcm9wcy5tc2cpKSB7XG4gICAgICAvLyBzaW1wbGUgc3RyaW5nIG1lc3NhZ2VcbiAgICAgIGNvbnRlbnQgPSAoXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIG51bGwsIHRoaXMucHJvcHMubXNnKVxuICAgICAgKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAvLyBtZXNzYWdlIGlzIGFuIGVsZW1lbnRcbiAgICAgIGNvbnRlbnQgPSB0aGlzLnByb3BzLm1zZztcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcIm1vZGFsIGZhZGVcIn0sIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwibW9kYWwtZGlhbG9nXCJ9LCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwibW9kYWwtY29udGVudFwifSwgXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwibW9kYWwtaGVhZGVyXCJ9LCBcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiLCB7dHlwZTogXCJidXR0b25cIiwgY2xhc3NOYW1lOiBcImNsb3NlXCIsIFwiZGF0YS1kaXNtaXNzXCI6IFwibW9kYWxcIn0sIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtcImFyaWEtaGlkZGVuXCI6IFwidHJ1ZVwifSwgXCLDl1wiKSwgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwge2NsYXNzTmFtZTogXCJzci1vbmx5XCJ9LCBcIkNsb3NlXCIpKSwgXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoNFwiLCB7Y2xhc3NOYW1lOiBcIm1vZGFsLXRpdGxlXCJ9LCB0aGlzLnByb3BzLnRpdGxlIHx8ICdBbGVydCcpXG4gICAgICAgICAgICApLCBcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJtb2RhbC1ib2R5XCJ9LCBcbiAgICAgICAgICAgICAgY29udGVudFxuICAgICAgICAgICAgKSwgXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwibW9kYWwtZm9vdGVyXCJ9LCBcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiLCB7dHlwZTogXCJidXR0b25cIiwgY2xhc3NOYW1lOiBcImJ0biBidG4tcHJpbWFyeVwiLCBvbkNsaWNrOiB0aGlzLmhhbmRsZU9LfSwgXCJPS1wiKVxuICAgICAgICAgICAgKVxuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH0sXG5cblxuICBoYW5kbGVNb2RhbEhpZGRlbjogZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuYWNrQ2FsbGJhY2spIHtcbiAgICAgIHRoaXMucHJvcHMuYWNrQ2FsbGJhY2soKTtcbiAgICB9XG4gIH0sXG5cbiAgaGFuZGxlT0s6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmhpZGVNb2RhbCgpO1xuICB9XG5cbn0pO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lMMVZ6WlhKekwyaGlkWEp5YjNkekwyUmxkaTlvWlhKdmEzVXZjbVZoWTNRdFpteDFlQzF6ZEdGeWRHVnlMM0IxWW14cFl5OXFZWFpoYzJOeWFYQjBjeTlqYjIxd2IyNWxiblJ6TDI5MlpYSnNZWGx6TDJGc1pYSjBMbXB6ZUNJc0luTnZkWEpqWlhNaU9sc2lMMVZ6WlhKekwyaGlkWEp5YjNkekwyUmxkaTlvWlhKdmEzVXZjbVZoWTNRdFpteDFlQzF6ZEdGeWRHVnlMM0IxWW14cFl5OXFZWFpoYzJOeWFYQjBjeTlqYjIxd2IyNWxiblJ6TDI5MlpYSnNZWGx6TDJGc1pYSjBMbXB6ZUNKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pUVVGQlFTeFpRVUZaTEVOQlFVTTdPMEZCUldJc1NVRkJTU3hEUVVGRExFZEJRVWNzVDBGQlR5eERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRPenRCUVVVeFFpeEpRVUZKTEV0QlFVc3NSMEZCUnl4UFFVRlBMRU5CUVVNc1kwRkJZeXhEUVVGRExFTkJRVU03UVVGRGNFTXNTVUZCU1N4WlFVRlpMRWRCUVVjc1QwRkJUeXhEUVVGRExITkNRVUZ6UWl4RFFVRkRMRU5CUVVNN08wRkJSVzVFTEc5RFFVRnZReXgxUWtGQlFUczdRVUZGY0VNc1JVRkJSU3hOUVVGTkxFVkJRVVVzUTBGQlF5eFpRVUZaTEVOQlFVTTdPMFZCUlhSQ0xFMUJRVTBzUlVGQlJTeFpRVUZaTzBGQlEzUkNMRWxCUVVrc1NVRkJTU3hQUVVGUExFTkJRVU03TzBGQlJXaENMRWxCUVVrc1NVRkJTU3hEUVVGRExFTkJRVU1zVVVGQlVTeERRVUZETEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1IwRkJSeXhEUVVGRExFVkJRVVU3TzAxQlJUbENMRTlCUVU4N1VVRkRUQ3h2UWtGQlFTeEhRVUZGTEVWQlFVRXNTVUZCUXl4RlFVRkRMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zUjBGQlVTeERRVUZCTzA5QlEzaENMRU5CUVVNN1MwRkRTRHRCUVVOTUxGTkJRVk03TzAxQlJVZ3NUMEZCVHl4SFFVRkhMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zUjBGQlJ5eERRVUZETzBGQlF5OUNMRXRCUVVzN08wbEJSVVE3VFVGRFJTeHZRa0ZCUVN4TFFVRkpMRVZCUVVFc1EwRkJRU3hEUVVGRExGTkJRVUVzUlVGQlV5eERRVUZETEZsQlFXRXNRMEZCUVN4RlFVRkJPMUZCUXpGQ0xHOUNRVUZCTEV0QlFVa3NSVUZCUVN4RFFVRkJMRU5CUVVNc1UwRkJRU3hGUVVGVExFTkJRVU1zWTBGQlpTeERRVUZCTEVWQlFVRTdWVUZETlVJc2IwSkJRVUVzUzBGQlNTeEZRVUZCTEVOQlFVRXNRMEZCUXl4VFFVRkJMRVZCUVZNc1EwRkJReXhsUVVGblFpeERRVUZCTEVWQlFVRTdXVUZETjBJc2IwSkJRVUVzUzBGQlNTeEZRVUZCTEVOQlFVRXNRMEZCUXl4VFFVRkJMRVZCUVZNc1EwRkJReXhqUVVGbExFTkJRVUVzUlVGQlFUdGpRVU0xUWl4dlFrRkJRU3hSUVVGUExFVkJRVUVzUTBGQlFTeERRVUZETEVsQlFVRXNSVUZCU1N4RFFVRkRMRkZCUVVFc1JVRkJVU3hEUVVGRExGTkJRVUVzUlVGQlV5eERRVUZETEU5QlFVRXNSVUZCVHl4RFFVRkRMR05CUVVFc1JVRkJXU3hEUVVGRExFOUJRVkVzUTBGQlFTeEZRVUZCTEc5Q1FVRkJMRTFCUVVzc1JVRkJRU3hEUVVGQkxFTkJRVU1zWVVGQlFTeEZRVUZYTEVOQlFVTXNUVUZCVHl4RFFVRkJMRVZCUVVFc1IwRkJZeXhEUVVGQkxFVkJRVUVzYjBKQlFVRXNUVUZCU3l4RlFVRkJMRU5CUVVFc1EwRkJReXhUUVVGQkxFVkJRVk1zUTBGQlF5eFRRVUZWTEVOQlFVRXNSVUZCUVN4UFFVRlpMRU5CUVZNc1EwRkJRU3hGUVVGQk8yTkJRMjVLTEc5Q1FVRkJMRWxCUVVjc1JVRkJRU3hEUVVGQkxFTkJRVU1zVTBGQlFTeEZRVUZUTEVOQlFVTXNZVUZCWXl4RFFVRkJMRVZCUVVNc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eExRVUZMTEVsQlFVa3NUMEZCWVN4RFFVRkJPMWxCUXpGRUxFTkJRVUVzUlVGQlFUdFpRVU5PTEc5Q1FVRkJMRXRCUVVrc1JVRkJRU3hEUVVGQkxFTkJRVU1zVTBGQlFTeEZRVUZUTEVOQlFVTXNXVUZCWVN4RFFVRkJMRVZCUVVFN1kwRkRla0lzVDBGQlVUdFpRVU5NTEVOQlFVRXNSVUZCUVR0WlFVTk9MRzlDUVVGQkxFdEJRVWtzUlVGQlFTeERRVUZCTEVOQlFVTXNVMEZCUVN4RlFVRlRMRU5CUVVNc1kwRkJaU3hEUVVGQkxFVkJRVUU3WTBGRE5VSXNiMEpCUVVFc1VVRkJUeXhGUVVGQkxFTkJRVUVzUTBGQlF5eEpRVUZCTEVWQlFVa3NRMEZCUXl4UlFVRkJMRVZCUVZFc1EwRkJReXhUUVVGQkxFVkJRVk1zUTBGQlF5eHBRa0ZCUVN4RlFVRnBRaXhEUVVGRExFOUJRVUVzUlVGQlR5eERRVUZGTEVsQlFVa3NRMEZCUXl4UlFVRlZMRU5CUVVFc1JVRkJRU3hKUVVGWExFTkJRVUU3V1VGRGFrWXNRMEZCUVR0VlFVTkdMRU5CUVVFN1VVRkRSaXhEUVVGQk8wMUJRMFlzUTBGQlFUdE5RVU5PTzBGQlEwNHNSMEZCUnp0QlFVTklPenRGUVVWRkxHbENRVUZwUWl4RlFVRkZMRmRCUVZjN1NVRkROVUlzU1VGQlNTeEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRmRCUVZjc1JVRkJSVHROUVVNeFFpeEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRmRCUVZjc1JVRkJSU3hEUVVGRE8wdEJRekZDTzBGQlEwd3NSMEZCUnpzN1JVRkZSQ3hSUVVGUkxFVkJRVVVzV1VGQldUdEpRVU53UWl4SlFVRkpMRU5CUVVNc1UwRkJVeXhGUVVGRkxFTkJRVU03UVVGRGNrSXNSMEZCUnpzN1EwRkZSaXhEUVVGRExFTkJRVU1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lJbmRYTmxJSE4wY21samRDYzdYRzVjYm5aaGNpQmZJRDBnY21WeGRXbHlaU2duYkc5a1lYTm9KeWs3WEc1Y2JuWmhjaUJTWldGamRDQTlJSEpsY1hWcGNtVW9KM0psWVdOMEwyRmtaRzl1Y3ljcE8xeHVkbUZ5SUU5MlpYSnNZWGxOYVhocGJpQTlJSEpsY1hWcGNtVW9KeTR1THk0dUwyMXBlR2x1Y3k5dmRtVnliR0Y1SnlrN1hHNWNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdVbVZoWTNRdVkzSmxZWFJsUTJ4aGMzTW9lMXh1WEc0Z0lHMXBlR2x1Y3pvZ1cwOTJaWEpzWVhsTmFYaHBibDBzWEc1Y2JpQWdjbVZ1WkdWeU9pQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdkbUZ5SUdOdmJuUmxiblE3WEc1Y2JpQWdJQ0JwWmlBb1h5NXBjMU4wY21sdVp5aDBhR2x6TG5CeWIzQnpMbTF6WnlrcElIdGNiaUFnSUNBZ0lDOHZJSE5wYlhCc1pTQnpkSEpwYm1jZ2JXVnpjMkZuWlZ4dUlDQWdJQ0FnWTI5dWRHVnVkQ0E5SUNoY2JpQWdJQ0FnSUNBZ1BIQStlM1JvYVhNdWNISnZjSE11YlhObmZUd3ZjRDVjYmlBZ0lDQWdJQ2s3WEc0Z0lDQWdmVnh1SUNBZ0lHVnNjMlVnZTF4dUlDQWdJQ0FnTHk4Z2JXVnpjMkZuWlNCcGN5QmhiaUJsYkdWdFpXNTBYRzRnSUNBZ0lDQmpiMjUwWlc1MElEMGdkR2hwY3k1d2NtOXdjeTV0YzJjN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnY21WMGRYSnVJQ2hjYmlBZ0lDQWdJRHhrYVhZZ1kyeGhjM05PWVcxbFBWd2liVzlrWVd3Z1ptRmtaVndpUGx4dUlDQWdJQ0FnSUNBOFpHbDJJR05zWVhOelRtRnRaVDFjSW0xdlpHRnNMV1JwWVd4dloxd2lQbHh1SUNBZ0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNOT1lXMWxQVndpYlc5a1lXd3RZMjl1ZEdWdWRGd2lQbHh1SUNBZ0lDQWdJQ0FnSUNBZ1BHUnBkaUJqYkdGemMwNWhiV1U5WENKdGIyUmhiQzFvWldGa1pYSmNJajVjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdQR0oxZEhSdmJpQjBlWEJsUFZ3aVluVjBkRzl1WENJZ1kyeGhjM05PWVcxbFBWd2lZMnh2YzJWY0lpQmtZWFJoTFdScGMyMXBjM005WENKdGIyUmhiRndpUGp4emNHRnVJR0Z5YVdFdGFHbGtaR1Z1UFZ3aWRISjFaVndpUGlaMGFXMWxjenM4TDNOd1lXNCtQSE53WVc0Z1kyeGhjM05PWVcxbFBWd2ljM0l0YjI1c2VWd2lQa05zYjNObFBDOXpjR0Z1UGp3dlluVjBkRzl1UGx4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0E4YURRZ1kyeGhjM05PWVcxbFBWd2liVzlrWVd3dGRHbDBiR1ZjSWo1N2RHaHBjeTV3Y205d2N5NTBhWFJzWlNCOGZDQW5RV3hsY25RbmZUd3ZhRFErWEc0Z0lDQWdJQ0FnSUNBZ0lDQThMMlJwZGo1Y2JpQWdJQ0FnSUNBZ0lDQWdJRHhrYVhZZ1kyeGhjM05PWVcxbFBWd2liVzlrWVd3dFltOWtlVndpUGx4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0I3WTI5dWRHVnVkSDFjYmlBZ0lDQWdJQ0FnSUNBZ0lEd3ZaR2wyUGx4dUlDQWdJQ0FnSUNBZ0lDQWdQR1JwZGlCamJHRnpjMDVoYldVOVhDSnRiMlJoYkMxbWIyOTBaWEpjSWo1Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnUEdKMWRIUnZiaUIwZVhCbFBWd2lZblYwZEc5dVhDSWdZMnhoYzNOT1lXMWxQVndpWW5SdUlHSjBiaTF3Y21sdFlYSjVYQ0lnYjI1RGJHbGphejE3ZEdocGN5NW9ZVzVrYkdWUFMzMCtUMHM4TDJKMWRIUnZiajVjYmlBZ0lDQWdJQ0FnSUNBZ0lEd3ZaR2wyUGx4dUlDQWdJQ0FnSUNBZ0lEd3ZaR2wyUGx4dUlDQWdJQ0FnSUNBOEwyUnBkajVjYmlBZ0lDQWdJRHd2WkdsMlBseHVJQ0FnSUNrN1hHNGdJSDBzWEc1Y2JseHVJQ0JvWVc1a2JHVk5iMlJoYkVocFpHUmxiam9nWm5WdVkzUnBiMjRvS1NCN1hHNGdJQ0FnYVdZZ0tIUm9hWE11Y0hKdmNITXVZV05yUTJGc2JHSmhZMnNwSUh0Y2JpQWdJQ0FnSUhSb2FYTXVjSEp2Y0hNdVlXTnJRMkZzYkdKaFkyc29LVHRjYmlBZ0lDQjlYRzRnSUgwc1hHNWNiaUFnYUdGdVpHeGxUMHM2SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCMGFHbHpMbWhwWkdWTmIyUmhiQ2dwTzF4dUlDQjlYRzVjYm4wcE8xeHVJbDE5IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xuXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdC9hZGRvbnMnKTtcblxudmFyIE92ZXJsYXlNaXhpbiA9IHJlcXVpcmUoJy4uLy4uL21peGlucy9vdmVybGF5Jyk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiZXhwb3J0c1wiLFxuXG4gIG1peGluczogW092ZXJsYXlNaXhpbl0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNvbnRlbnQ7XG5cbiAgICBpZiAoXy5pc1N0cmluZyh0aGlzLnByb3BzLm1zZykpIHtcbiAgICAgIC8vIHNpbXBsZSBzdHJpbmcgbWVzc2FnZVxuICAgICAgY29udGVudCA9IChcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInBcIiwgbnVsbCwgdGhpcy5wcm9wcy5tc2cpXG4gICAgICApO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIC8vIG1lc3NhZ2UgaXMgYW4gZWxlbWVudFxuICAgICAgY29udGVudCA9IHRoaXMucHJvcHMubXNnO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwibW9kYWwgZmFkZVwifSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJtb2RhbC1kaWFsb2dcIn0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJtb2RhbC1jb250ZW50XCJ9LCBcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJtb2RhbC1oZWFkZXJcIn0sIFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIsIHt0eXBlOiBcImJ1dHRvblwiLCBjbGFzc05hbWU6IFwiY2xvc2VcIiwgXCJkYXRhLWRpc21pc3NcIjogXCJtb2RhbFwifSwgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwge1wiYXJpYS1oaWRkZW5cIjogXCJ0cnVlXCJ9LCBcIsOXXCIpLCBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7Y2xhc3NOYW1lOiBcInNyLW9ubHlcIn0sIFwiQ2xvc2VcIikpLCBcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImg0XCIsIHtjbGFzc05hbWU6IFwibW9kYWwtdGl0bGVcIn0sIHRoaXMucHJvcHMudGl0bGUgfHwgJ0NvbmZpcm0nKVxuICAgICAgICAgICAgKSwgXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwibW9kYWwtYm9keVwifSwgXG4gICAgICAgICAgICAgIGNvbnRlbnRcbiAgICAgICAgICAgICksIFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcIm1vZGFsLWZvb3RlclwifSwgXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIiwge3R5cGU6IFwiYnV0dG9uXCIsIGNsYXNzTmFtZTogXCJidG4gYnRuLWRlZmF1bHRcIiwgb25DbGljazogdGhpcy5faGFuZGxlTm99LCBcIk5vXCIpLCBcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiLCB7dHlwZTogXCJidXR0b25cIiwgY2xhc3NOYW1lOiBcImJ0biBidG4tcHJpbWFyeVwiLCBvbkNsaWNrOiB0aGlzLl9oYW5kbGVZZXN9LCBcIlllc1wiKVxuICAgICAgICAgICAgKVxuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH0sXG5cbiAgaGFuZGxlTW9kYWxIaWRkZW46IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLmNvbmZpcm1lZCkge1xuICAgICAgaWYgKHRoaXMucHJvcHMueWVzQ2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5wcm9wcy55ZXNDYWxsYmFjaygpO1xuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGlmICh0aGlzLnByb3BzLm5vQ2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5wcm9wcy5ub0NhbGxiYWNrKCk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIF9oYW5kbGVZZXM6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmNvbmZpcm1lZCA9IHRydWU7XG4gICAgdGhpcy5oaWRlTW9kYWwoKTtcbiAgfSxcblxuICBfaGFuZGxlTm86IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmhpZGVNb2RhbCgpO1xuICB9XG5cbn0pO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lMMVZ6WlhKekwyaGlkWEp5YjNkekwyUmxkaTlvWlhKdmEzVXZjbVZoWTNRdFpteDFlQzF6ZEdGeWRHVnlMM0IxWW14cFl5OXFZWFpoYzJOeWFYQjBjeTlqYjIxd2IyNWxiblJ6TDI5MlpYSnNZWGx6TDJOdmJtWnBjbTB1YW5ONElpd2ljMjkxY21ObGN5STZXeUl2VlhObGNuTXZhR0oxY25KdmQzTXZaR1YyTDJobGNtOXJkUzl5WldGamRDMW1iSFY0TFhOMFlYSjBaWEl2Y0hWaWJHbGpMMnBoZG1GelkzSnBjSFJ6TDJOdmJYQnZibVZ1ZEhNdmIzWmxjbXhoZVhNdlkyOXVabWx5YlM1cWMzZ2lYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklrRkJRVUVzV1VGQldTeERRVUZET3p0QlFVVmlMRWxCUVVrc1EwRkJReXhIUVVGSExFOUJRVThzUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZCUXpzN1FVRkZNVUlzU1VGQlNTeExRVUZMTEVkQlFVY3NUMEZCVHl4RFFVRkRMR05CUVdNc1EwRkJReXhEUVVGRE96dEJRVVZ3UXl4SlFVRkpMRmxCUVZrc1IwRkJSeXhQUVVGUExFTkJRVU1zYzBKQlFYTkNMRU5CUVVNc1EwRkJRenRCUVVOdVJEczdRVUZGUVN4dlEwRkJiME1zZFVKQlFVRTdPMEZCUlhCRExFVkJRVVVzVFVGQlRTeEZRVUZGTEVOQlFVTXNXVUZCV1N4RFFVRkRPenRGUVVWMFFpeE5RVUZOTEVWQlFVVXNXVUZCV1R0QlFVTjBRaXhKUVVGSkxFbEJRVWtzVDBGQlR5eERRVUZET3p0QlFVVm9RaXhKUVVGSkxFbEJRVWtzUTBGQlF5eERRVUZETEZGQlFWRXNRMEZCUXl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFZEJRVWNzUTBGQlF5eEZRVUZGT3p0TlFVVTVRaXhQUVVGUE8xRkJRMHdzYjBKQlFVRXNSMEZCUlN4RlFVRkJMRWxCUVVNc1JVRkJReXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEVkQlFWRXNRMEZCUVR0UFFVTjRRaXhEUVVGRE8wdEJRMGc3UVVGRFRDeFRRVUZUT3p0TlFVVklMRTlCUVU4c1IwRkJSeXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEVkQlFVY3NRMEZCUXp0QlFVTXZRaXhMUVVGTE96dEpRVVZFTzAxQlEwVXNiMEpCUVVFc1MwRkJTU3hGUVVGQkxFTkJRVUVzUTBGQlF5eFRRVUZCTEVWQlFWTXNRMEZCUXl4WlFVRmhMRU5CUVVFc1JVRkJRVHRSUVVNeFFpeHZRa0ZCUVN4TFFVRkpMRVZCUVVFc1EwRkJRU3hEUVVGRExGTkJRVUVzUlVGQlV5eERRVUZETEdOQlFXVXNRMEZCUVN4RlFVRkJPMVZCUXpWQ0xHOUNRVUZCTEV0QlFVa3NSVUZCUVN4RFFVRkJMRU5CUVVNc1UwRkJRU3hGUVVGVExFTkJRVU1zWlVGQlowSXNRMEZCUVN4RlFVRkJPMWxCUXpkQ0xHOUNRVUZCTEV0QlFVa3NSVUZCUVN4RFFVRkJMRU5CUVVNc1UwRkJRU3hGUVVGVExFTkJRVU1zWTBGQlpTeERRVUZCTEVWQlFVRTdZMEZETlVJc2IwSkJRVUVzVVVGQlR5eEZRVUZCTEVOQlFVRXNRMEZCUXl4SlFVRkJMRVZCUVVrc1EwRkJReXhSUVVGQkxFVkJRVkVzUTBGQlF5eFRRVUZCTEVWQlFWTXNRMEZCUXl4UFFVRkJMRVZCUVU4c1EwRkJReXhqUVVGQkxFVkJRVmtzUTBGQlF5eFBRVUZSTEVOQlFVRXNSVUZCUVN4dlFrRkJRU3hOUVVGTExFVkJRVUVzUTBGQlFTeERRVUZETEdGQlFVRXNSVUZCVnl4RFFVRkRMRTFCUVU4c1EwRkJRU3hGUVVGQkxFZEJRV01zUTBGQlFTeEZRVUZCTEc5Q1FVRkJMRTFCUVVzc1JVRkJRU3hEUVVGQkxFTkJRVU1zVTBGQlFTeEZRVUZUTEVOQlFVTXNVMEZCVlN4RFFVRkJMRVZCUVVFc1QwRkJXU3hEUVVGVExFTkJRVUVzUlVGQlFUdGpRVU51U2l4dlFrRkJRU3hKUVVGSExFVkJRVUVzUTBGQlFTeERRVUZETEZOQlFVRXNSVUZCVXl4RFFVRkRMR0ZCUVdNc1EwRkJRU3hGUVVGRExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNTMEZCU3l4SlFVRkpMRk5CUVdVc1EwRkJRVHRaUVVNMVJDeERRVUZCTEVWQlFVRTdXVUZEVGl4dlFrRkJRU3hMUVVGSkxFVkJRVUVzUTBGQlFTeERRVUZETEZOQlFVRXNSVUZCVXl4RFFVRkRMRmxCUVdFc1EwRkJRU3hGUVVGQk8yTkJRM3BDTEU5QlFWRTdXVUZEVEN4RFFVRkJMRVZCUVVFN1dVRkRUaXh2UWtGQlFTeExRVUZKTEVWQlFVRXNRMEZCUVN4RFFVRkRMRk5CUVVFc1JVRkJVeXhEUVVGRExHTkJRV1VzUTBGQlFTeEZRVUZCTzJOQlF6VkNMRzlDUVVGQkxGRkJRVThzUlVGQlFTeERRVUZCTEVOQlFVTXNTVUZCUVN4RlFVRkpMRU5CUVVNc1VVRkJRU3hGUVVGUkxFTkJRVU1zVTBGQlFTeEZRVUZUTEVOQlFVTXNhVUpCUVVFc1JVRkJhVUlzUTBGQlF5eFBRVUZCTEVWQlFVOHNRMEZCUlN4SlFVRkpMRU5CUVVNc1UwRkJWeXhEUVVGQkxFVkJRVUVzU1VGQlZ5eERRVUZCTEVWQlFVRTdZMEZEZEVZc2IwSkJRVUVzVVVGQlR5eEZRVUZCTEVOQlFVRXNRMEZCUXl4SlFVRkJMRVZCUVVrc1EwRkJReXhSUVVGQkxFVkJRVkVzUTBGQlF5eFRRVUZCTEVWQlFWTXNRMEZCUXl4cFFrRkJRU3hGUVVGcFFpeERRVUZETEU5QlFVRXNSVUZCVHl4RFFVRkZMRWxCUVVrc1EwRkJReXhWUVVGWkxFTkJRVUVzUlVGQlFTeExRVUZaTEVOQlFVRTdXVUZEY0VZc1EwRkJRVHRWUVVOR0xFTkJRVUU3VVVGRFJpeERRVUZCTzAxQlEwWXNRMEZCUVR0TlFVTk9PMEZCUTA0c1IwRkJSenM3UlVGRlJDeHBRa0ZCYVVJc1JVRkJSU3hYUVVGWE8wbEJRelZDTEVsQlFVa3NTVUZCU1N4RFFVRkRMRk5CUVZNc1JVRkJSVHROUVVOc1FpeEpRVUZKTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1YwRkJWeXhGUVVGRk8xRkJRekZDTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1YwRkJWeXhGUVVGRkxFTkJRVU03VDBGRE1VSTdTMEZEUmp0VFFVTkpPMDFCUTBnc1NVRkJTU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEZWQlFWVXNSVUZCUlR0UlFVTjZRaXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEZWQlFWVXNSVUZCUlN4RFFVRkRPMDlCUTNwQ08wdEJRMFk3UVVGRFRDeEhRVUZIT3p0RlFVVkVMRlZCUVZVc1JVRkJSU3haUVVGWk8wbEJRM1JDTEVsQlFVa3NRMEZCUXl4VFFVRlRMRWRCUVVjc1NVRkJTU3hEUVVGRE8wbEJRM1JDTEVsQlFVa3NRMEZCUXl4VFFVRlRMRVZCUVVVc1EwRkJRenRCUVVOeVFpeEhRVUZIT3p0RlFVVkVMRk5CUVZNc1JVRkJSU3haUVVGWk8wbEJRM0pDTEVsQlFVa3NRMEZCUXl4VFFVRlRMRVZCUVVVc1EwRkJRenRCUVVOeVFpeEhRVUZIT3p0RFFVVkdMRU5CUVVNc1EwRkJReUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSWlkMWMyVWdjM1J5YVdOMEp6dGNibHh1ZG1GeUlGOGdQU0J5WlhGMWFYSmxLQ2RzYjJSaGMyZ25LVHRjYmx4dWRtRnlJRkpsWVdOMElEMGdjbVZ4ZFdseVpTZ25jbVZoWTNRdllXUmtiMjV6SnlrN1hHNWNiblpoY2lCUGRtVnliR0Y1VFdsNGFXNGdQU0J5WlhGMWFYSmxLQ2N1TGk4dUxpOXRhWGhwYm5NdmIzWmxjbXhoZVNjcE8xeHVYRzVjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnVW1WaFkzUXVZM0psWVhSbFEyeGhjM01vZTF4dVhHNGdJRzFwZUdsdWN6b2dXMDkyWlhKc1lYbE5hWGhwYmwwc1hHNWNiaUFnY21WdVpHVnlPaUJtZFc1amRHbHZiaUFvS1NCN1hHNGdJQ0FnZG1GeUlHTnZiblJsYm5RN1hHNWNiaUFnSUNCcFppQW9YeTVwYzFOMGNtbHVaeWgwYUdsekxuQnliM0J6TG0xelp5a3BJSHRjYmlBZ0lDQWdJQzh2SUhOcGJYQnNaU0J6ZEhKcGJtY2diV1Z6YzJGblpWeHVJQ0FnSUNBZ1kyOXVkR1Z1ZENBOUlDaGNiaUFnSUNBZ0lDQWdQSEErZTNSb2FYTXVjSEp2Y0hNdWJYTm5mVHd2Y0Q1Y2JpQWdJQ0FnSUNrN1hHNGdJQ0FnZlZ4dUlDQWdJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ0x5OGdiV1Z6YzJGblpTQnBjeUJoYmlCbGJHVnRaVzUwWEc0Z0lDQWdJQ0JqYjI1MFpXNTBJRDBnZEdocGN5NXdjbTl3Y3k1dGMyYzdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2NtVjBkWEp1SUNoY2JpQWdJQ0FnSUR4a2FYWWdZMnhoYzNOT1lXMWxQVndpYlc5a1lXd2dabUZrWlZ3aVBseHVJQ0FnSUNBZ0lDQThaR2wySUdOc1lYTnpUbUZ0WlQxY0ltMXZaR0ZzTFdScFlXeHZaMXdpUGx4dUlDQWdJQ0FnSUNBZ0lEeGthWFlnWTJ4aGMzTk9ZVzFsUFZ3aWJXOWtZV3d0WTI5dWRHVnVkRndpUGx4dUlDQWdJQ0FnSUNBZ0lDQWdQR1JwZGlCamJHRnpjMDVoYldVOVhDSnRiMlJoYkMxb1pXRmtaWEpjSWo1Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnUEdKMWRIUnZiaUIwZVhCbFBWd2lZblYwZEc5dVhDSWdZMnhoYzNOT1lXMWxQVndpWTJ4dmMyVmNJaUJrWVhSaExXUnBjMjFwYzNNOVhDSnRiMlJoYkZ3aVBqeHpjR0Z1SUdGeWFXRXRhR2xrWkdWdVBWd2lkSEoxWlZ3aVBpWjBhVzFsY3pzOEwzTndZVzQrUEhOd1lXNGdZMnhoYzNOT1lXMWxQVndpYzNJdGIyNXNlVndpUGtOc2IzTmxQQzl6Y0dGdVBqd3ZZblYwZEc5dVBseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBOGFEUWdZMnhoYzNOT1lXMWxQVndpYlc5a1lXd3RkR2wwYkdWY0lqNTdkR2hwY3k1d2NtOXdjeTUwYVhSc1pTQjhmQ0FuUTI5dVptbHliU2Q5UEM5b05ENWNiaUFnSUNBZ0lDQWdJQ0FnSUR3dlpHbDJQbHh1SUNBZ0lDQWdJQ0FnSUNBZ1BHUnBkaUJqYkdGemMwNWhiV1U5WENKdGIyUmhiQzFpYjJSNVhDSStYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lIdGpiMjUwWlc1MGZWeHVJQ0FnSUNBZ0lDQWdJQ0FnUEM5a2FYWStYRzRnSUNBZ0lDQWdJQ0FnSUNBOFpHbDJJR05zWVhOelRtRnRaVDFjSW0xdlpHRnNMV1p2YjNSbGNsd2lQbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQThZblYwZEc5dUlIUjVjR1U5WENKaWRYUjBiMjVjSWlCamJHRnpjMDVoYldVOVhDSmlkRzRnWW5SdUxXUmxabUYxYkhSY0lpQnZia05zYVdOclBYdDBhR2x6TGw5b1lXNWtiR1ZPYjMwK1RtODhMMkoxZEhSdmJqNWNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ1BHSjFkSFJ2YmlCMGVYQmxQVndpWW5WMGRHOXVYQ0lnWTJ4aGMzTk9ZVzFsUFZ3aVluUnVJR0owYmkxd2NtbHRZWEo1WENJZ2IyNURiR2xqYXoxN2RHaHBjeTVmYUdGdVpHeGxXV1Z6ZlQ1WlpYTThMMkoxZEhSdmJqNWNiaUFnSUNBZ0lDQWdJQ0FnSUR3dlpHbDJQbHh1SUNBZ0lDQWdJQ0FnSUR3dlpHbDJQbHh1SUNBZ0lDQWdJQ0E4TDJScGRqNWNiaUFnSUNBZ0lEd3ZaR2wyUGx4dUlDQWdJQ2s3WEc0Z0lIMHNYRzVjYmlBZ2FHRnVaR3hsVFc5a1lXeElhV1JrWlc0NklHWjFibU4wYVc5dUtDa2dlMXh1SUNBZ0lHbG1JQ2gwYUdsekxtTnZibVpwY20xbFpDa2dlMXh1SUNBZ0lDQWdhV1lnS0hSb2FYTXVjSEp2Y0hNdWVXVnpRMkZzYkdKaFkyc3BJSHRjYmlBZ0lDQWdJQ0FnZEdocGN5NXdjbTl3Y3k1NVpYTkRZV3hzWW1GamF5Z3BPMXh1SUNBZ0lDQWdmVnh1SUNBZ0lIMWNiaUFnSUNCbGJITmxJSHRjYmlBZ0lDQWdJR2xtSUNoMGFHbHpMbkJ5YjNCekxtNXZRMkZzYkdKaFkyc3BJSHRjYmlBZ0lDQWdJQ0FnZEdocGN5NXdjbTl3Y3k1dWIwTmhiR3hpWVdOcktDazdYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZWeHVJQ0I5TEZ4dVhHNGdJRjlvWVc1a2JHVlpaWE02SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCMGFHbHpMbU52Ym1acGNtMWxaQ0E5SUhSeWRXVTdYRzRnSUNBZ2RHaHBjeTVvYVdSbFRXOWtZV3dvS1R0Y2JpQWdmU3hjYmx4dUlDQmZhR0Z1Wkd4bFRtODZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0IwYUdsekxtaHBaR1ZOYjJSaGJDZ3BPMXh1SUNCOVhHNWNibjBwTzF4dUlsMTkiLCIndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0L2FkZG9ucycpO1xuXG52YXIgT3ZlcmxheU1peGluID0gcmVxdWlyZSgnLi4vLi4vbWl4aW5zL292ZXJsYXknKTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJleHBvcnRzXCIsXG5cbiAgbWl4aW5zOiBbT3ZlcmxheU1peGluLCBSZWFjdC5hZGRvbnMuTGlua2VkU3RhdGVNaXhpbl0sXG5cbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGZpcnN0TmFtZTogdGhpcy5wcm9wcy5maXJzdE5hbWUgfHwgJycsXG4gICAgICBsYXN0TmFtZTogdGhpcy5wcm9wcy5sYXN0TmFtZSB8fCAnJ1xuICAgIH07XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJtb2RhbCBmYWRlXCJ9LCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcIm1vZGFsLWRpYWxvZ1wifSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcIm1vZGFsLWNvbnRlbnRcIn0sIFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcIm1vZGFsLWhlYWRlclwifSwgXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIiwge3R5cGU6IFwiYnV0dG9uXCIsIGNsYXNzTmFtZTogXCJjbG9zZVwiLCBcImRhdGEtZGlzbWlzc1wiOiBcIm1vZGFsXCJ9LCBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7XCJhcmlhLWhpZGRlblwiOiBcInRydWVcIn0sIFwiw5dcIiksIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtjbGFzc05hbWU6IFwic3Itb25seVwifSwgXCJDbG9zZVwiKSksIFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaDRcIiwge2NsYXNzTmFtZTogXCJtb2RhbC10aXRsZVwifSwgXCJBZGQgTmV3IEl0ZW1cIilcbiAgICAgICAgICAgICksIFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcIm1vZGFsLWJvZHlcIn0sIFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZm9ybVwiLCBudWxsLCBcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiZm9ybS1ncm91cFwifSwgXG4gICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIiwge2h0bWxGb3I6IFwiZmlyc3RuYW1lXCJ9LCBcIkZpcnN0IE5hbWVcIiksIFxuICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHtyZWY6IFwiZmlyc3ROYW1lXCIsIHR5cGU6IFwidGV4dFwiLCBjbGFzc05hbWU6IFwiZm9ybS1jb250cm9sXCIsIGlkOiBcImZpcnN0bmFtZVwiLCBwbGFjZWhvbGRlcjogXCJGaXJzdCBuYW1lXCIsIHZhbHVlTGluazogdGhpcy5saW5rU3RhdGUoJ2ZpcnN0TmFtZScpfSlcbiAgICAgICAgICAgICAgICApLCBcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiZm9ybS1ncm91cFwifSwgXG4gICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIiwge2h0bWxGb3I6IFwibGFzdG5hbWVcIn0sIFwiTGFzdCBOYW1lXCIpLCBcbiAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCB7dHlwZTogXCJ0ZXh0XCIsIGNsYXNzTmFtZTogXCJmb3JtLWNvbnRyb2xcIiwgaWQ6IFwibGFzdG5hbWVcIiwgcGxhY2Vob2xkZXI6IFwiTGFzdCBuYW1lXCIsIHZhbHVlTGluazogdGhpcy5saW5rU3RhdGUoJ2xhc3ROYW1lJyl9KVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKSwgXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwibW9kYWwtZm9vdGVyXCJ9LCBcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiLCB7dHlwZTogXCJidXR0b25cIiwgY2xhc3NOYW1lOiBcImJ0biBidG4tZGVmYXVsdFwiLCBvbkNsaWNrOiB0aGlzLl9oYW5kbGVDYW5jZWx9LCBcIkNhbmNlbFwiKSwgXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIiwge3R5cGU6IFwiYnV0dG9uXCIsIGNsYXNzTmFtZTogXCJidG4gYnRuLXByaW1hcnlcIiwgb25DbGljazogdGhpcy5faGFuZGxlQWRkfSwgXCJPS1wiKVxuICAgICAgICAgICAgKVxuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH0sXG5cbiAgLy8gdXNlcyBCb290c3RyYXAgbW9kYWwnc1xuICBoYW5kbGVNb2RhbFNob3duOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnJlZnMuZmlyc3ROYW1lLmdldERPTU5vZGUoKS5mb2N1cygpO1xuICB9LFxuXG4gIGhhbmRsZU1vZGFsSGlkZGVuOiBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5jb25maXJtZWQpIHtcbiAgICAgIGlmICh0aGlzLnByb3BzLm9rQ2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5wcm9wcy5va0NhbGxiYWNrKHRoaXMuc3RhdGUuZmlyc3ROYW1lLCB0aGlzLnN0YXRlLmxhc3ROYW1lKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBpZiAodGhpcy5wcm9wcy5jYW5jZWxDYWxsYmFjaykge1xuICAgICAgICB0aGlzLnByb3BzLmNhbmNlbENhbGxiYWNrKCk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIF9oYW5kbGVBZGQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmNvbmZpcm1lZCA9IHRydWU7XG4gICAgdGhpcy5oaWRlTW9kYWwoKTtcbiAgfSxcblxuICBfaGFuZGxlQ2FuY2VsOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5oaWRlTW9kYWwoKTtcbiAgfVxuXG59KTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pTDFWelpYSnpMMmhpZFhKeWIzZHpMMlJsZGk5b1pYSnZhM1V2Y21WaFkzUXRabXgxZUMxemRHRnlkR1Z5TDNCMVlteHBZeTlxWVhaaGMyTnlhWEIwY3k5amIyMXdiMjVsYm5SekwyOTJaWEpzWVhsekwybDBaVzB0Wm05eWJTNXFjM2dpTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5b1luVnljbTkzY3k5a1pYWXZhR1Z5YjJ0MUwzSmxZV04wTFdac2RYZ3RjM1JoY25SbGNpOXdkV0pzYVdNdmFtRjJZWE5qY21sd2RITXZZMjl0Y0c5dVpXNTBjeTl2ZG1WeWJHRjVjeTlwZEdWdExXWnZjbTB1YW5ONElsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lKQlFVRkJMRmxCUVZrc1EwRkJRenM3UVVGRllpeEpRVUZKTEV0QlFVc3NSMEZCUnl4UFFVRlBMRU5CUVVNc1kwRkJZeXhEUVVGRExFTkJRVU03TzBGQlJYQkRMRWxCUVVrc1dVRkJXU3hIUVVGSExFOUJRVThzUTBGQlF5eHpRa0ZCYzBJc1EwRkJReXhEUVVGRE8wRkJRMjVFT3p0QlFVVkJMRzlEUVVGdlF5eDFRa0ZCUVRzN1FVRkZjRU1zUlVGQlJTeE5RVUZOTEVWQlFVVXNRMEZCUXl4WlFVRlpMRVZCUVVVc1MwRkJTeXhEUVVGRExFMUJRVTBzUTBGQlF5eG5Ra0ZCWjBJc1EwRkJRenM3UlVGRmNrUXNaVUZCWlN4RlFVRkZMRmxCUVZrN1NVRkRNMElzVDBGQlR6dE5RVU5NTEZOQlFWTXNSVUZCUlN4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExGTkJRVk1zU1VGQlNTeEZRVUZGTzAxQlEzSkRMRkZCUVZFc1JVRkJSU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEZGQlFWRXNTVUZCU1N4RlFVRkZPMHRCUTNCRExFTkJRVU03UVVGRFRpeEhRVUZIT3p0RlFVVkVMRTFCUVUwc1JVRkJSU3haUVVGWk8wbEJRMnhDTzAxQlEwVXNiMEpCUVVFc1MwRkJTU3hGUVVGQkxFTkJRVUVzUTBGQlF5eFRRVUZCTEVWQlFWTXNRMEZCUXl4WlFVRmhMRU5CUVVFc1JVRkJRVHRSUVVNeFFpeHZRa0ZCUVN4TFFVRkpMRVZCUVVFc1EwRkJRU3hEUVVGRExGTkJRVUVzUlVGQlV5eERRVUZETEdOQlFXVXNRMEZCUVN4RlFVRkJPMVZCUXpWQ0xHOUNRVUZCTEV0QlFVa3NSVUZCUVN4RFFVRkJMRU5CUVVNc1UwRkJRU3hGUVVGVExFTkJRVU1zWlVGQlowSXNRMEZCUVN4RlFVRkJPMWxCUXpkQ0xHOUNRVUZCTEV0QlFVa3NSVUZCUVN4RFFVRkJMRU5CUVVNc1UwRkJRU3hGUVVGVExFTkJRVU1zWTBGQlpTeERRVUZCTEVWQlFVRTdZMEZETlVJc2IwSkJRVUVzVVVGQlR5eEZRVUZCTEVOQlFVRXNRMEZCUXl4SlFVRkJMRVZCUVVrc1EwRkJReXhSUVVGQkxFVkJRVkVzUTBGQlF5eFRRVUZCTEVWQlFWTXNRMEZCUXl4UFFVRkJMRVZCUVU4c1EwRkJReXhqUVVGQkxFVkJRVmtzUTBGQlF5eFBRVUZSTEVOQlFVRXNSVUZCUVN4dlFrRkJRU3hOUVVGTExFVkJRVUVzUTBGQlFTeERRVUZETEdGQlFVRXNSVUZCVnl4RFFVRkRMRTFCUVU4c1EwRkJRU3hGUVVGQkxFZEJRV01zUTBGQlFTeEZRVUZCTEc5Q1FVRkJMRTFCUVVzc1JVRkJRU3hEUVVGQkxFTkJRVU1zVTBGQlFTeEZRVUZUTEVOQlFVTXNVMEZCVlN4RFFVRkJMRVZCUVVFc1QwRkJXU3hEUVVGVExFTkJRVUVzUlVGQlFUdGpRVU51U2l4dlFrRkJRU3hKUVVGSExFVkJRVUVzUTBGQlFTeERRVUZETEZOQlFVRXNSVUZCVXl4RFFVRkRMR0ZCUVdNc1EwRkJRU3hGUVVGQkxHTkJRV2xDTEVOQlFVRTdXVUZEZWtNc1EwRkJRU3hGUVVGQk8xbEJRMDRzYjBKQlFVRXNTMEZCU1N4RlFVRkJMRU5CUVVFc1EwRkJReXhUUVVGQkxFVkJRVk1zUTBGQlF5eFpRVUZoTEVOQlFVRXNSVUZCUVR0alFVTXhRaXh2UWtGQlFTeE5RVUZMTEVWQlFVRXNTVUZCUXl4RlFVRkJPMmRDUVVOS0xHOUNRVUZCTEV0QlFVa3NSVUZCUVN4RFFVRkJMRU5CUVVNc1UwRkJRU3hGUVVGVExFTkJRVU1zV1VGQllTeERRVUZCTEVWQlFVRTdhMEpCUXpGQ0xHOUNRVUZCTEU5QlFVMHNSVUZCUVN4RFFVRkJMRU5CUVVNc1QwRkJRU3hGUVVGUExFTkJRVU1zVjBGQldTeERRVUZCTEVWQlFVRXNXVUZCYTBJc1EwRkJRU3hGUVVGQk8ydENRVU0zUXl4dlFrRkJRU3hQUVVGTkxFVkJRVUVzUTBGQlFTeERRVUZETEVkQlFVRXNSVUZCUnl4RFFVRkRMRmRCUVVFc1JVRkJWeXhEUVVGRExFbEJRVUVzUlVGQlNTeERRVUZETEUxQlFVRXNSVUZCVFN4RFFVRkRMRk5CUVVFc1JVRkJVeXhEUVVGRExHTkJRVUVzUlVGQll5eERRVUZETEVWQlFVRXNSVUZCUlN4RFFVRkRMRmRCUVVFc1JVRkJWeXhEUVVGRExGZEJRVUVzUlVGQlZ5eERRVUZETEZsQlFVRXNSVUZCV1N4RFFVRkRMRk5CUVVFc1JVRkJVeXhEUVVGRkxFbEJRVWtzUTBGQlF5eFRRVUZUTEVOQlFVTXNWMEZCVnl4RFFVRkZMRU5CUVVFc1EwRkJSeXhEUVVGQk8yZENRVU14U1N4RFFVRkJMRVZCUVVFN1owSkJRMDRzYjBKQlFVRXNTMEZCU1N4RlFVRkJMRU5CUVVFc1EwRkJReXhUUVVGQkxFVkJRVk1zUTBGQlF5eFpRVUZoTEVOQlFVRXNSVUZCUVR0clFrRkRNVUlzYjBKQlFVRXNUMEZCVFN4RlFVRkJMRU5CUVVFc1EwRkJReXhQUVVGQkxFVkJRVThzUTBGQlF5eFZRVUZYTEVOQlFVRXNSVUZCUVN4WFFVRnBRaXhEUVVGQkxFVkJRVUU3YTBKQlF6TkRMRzlDUVVGQkxFOUJRVTBzUlVGQlFTeERRVUZCTEVOQlFVTXNTVUZCUVN4RlFVRkpMRU5CUVVNc1RVRkJRU3hGUVVGTkxFTkJRVU1zVTBGQlFTeEZRVUZUTEVOQlFVTXNZMEZCUVN4RlFVRmpMRU5CUVVNc1JVRkJRU3hGUVVGRkxFTkJRVU1zVlVGQlFTeEZRVUZWTEVOQlFVTXNWMEZCUVN4RlFVRlhMRU5CUVVNc1YwRkJRU3hGUVVGWExFTkJRVU1zVTBGQlFTeEZRVUZUTEVOQlFVVXNTVUZCU1N4RFFVRkRMRk5CUVZNc1EwRkJReXhWUVVGVkxFTkJRVVVzUTBGQlFTeERRVUZITEVOQlFVRTdaMEpCUTNaSUxFTkJRVUU3WTBGRFJDeERRVUZCTzFsQlEwZ3NRMEZCUVN4RlFVRkJPMWxCUTA0c2IwSkJRVUVzUzBGQlNTeEZRVUZCTEVOQlFVRXNRMEZCUXl4VFFVRkJMRVZCUVZNc1EwRkJReXhqUVVGbExFTkJRVUVzUlVGQlFUdGpRVU0xUWl4dlFrRkJRU3hSUVVGUExFVkJRVUVzUTBGQlFTeERRVUZETEVsQlFVRXNSVUZCU1N4RFFVRkRMRkZCUVVFc1JVRkJVU3hEUVVGRExGTkJRVUVzUlVGQlV5eERRVUZETEdsQ1FVRkJMRVZCUVdsQ0xFTkJRVU1zVDBGQlFTeEZRVUZQTEVOQlFVVXNTVUZCU1N4RFFVRkRMR0ZCUVdVc1EwRkJRU3hGUVVGQkxGRkJRV1VzUTBGQlFTeEZRVUZCTzJOQlF6bEdMRzlDUVVGQkxGRkJRVThzUlVGQlFTeERRVUZCTEVOQlFVTXNTVUZCUVN4RlFVRkpMRU5CUVVNc1VVRkJRU3hGUVVGUkxFTkJRVU1zVTBGQlFTeEZRVUZUTEVOQlFVTXNhVUpCUVVFc1JVRkJhVUlzUTBGQlF5eFBRVUZCTEVWQlFVOHNRMEZCUlN4SlFVRkpMRU5CUVVNc1ZVRkJXU3hEUVVGQkxFVkJRVUVzU1VGQlZ5eERRVUZCTzFsQlEyNUdMRU5CUVVFN1ZVRkRSaXhEUVVGQk8xRkJRMFlzUTBGQlFUdE5RVU5HTEVOQlFVRTdUVUZEVGp0QlFVTk9MRWRCUVVjN1FVRkRTRHM3UlVGRlJTeG5Ra0ZCWjBJc1JVRkJSU3hYUVVGWE8wbEJRek5DTEVsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1UwRkJVeXhEUVVGRExGVkJRVlVzUlVGQlJTeERRVUZETEV0QlFVc3NSVUZCUlN4RFFVRkRPMEZCUXpkRExFZEJRVWM3TzBWQlJVUXNhVUpCUVdsQ0xFVkJRVVVzVjBGQlZ6dEpRVU0xUWl4SlFVRkpMRWxCUVVrc1EwRkJReXhUUVVGVExFVkJRVVU3VFVGRGJFSXNTVUZCU1N4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExGVkJRVlVzUlVGQlJUdFJRVU42UWl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExGVkJRVlVzUTBGQlF5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRk5CUVZNc1JVRkJSU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRPMDlCUTJ4Rk8wdEJRMFk3VTBGRFNUdE5RVU5JTEVsQlFVa3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhqUVVGakxFVkJRVVU3VVVGRE4wSXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhqUVVGakxFVkJRVVVzUTBGQlF6dFBRVU0zUWp0TFFVTkdPMEZCUTB3c1IwRkJSenM3UlVGRlJDeFZRVUZWTEVWQlFVVXNXVUZCV1R0SlFVTjBRaXhKUVVGSkxFTkJRVU1zVTBGQlV5eEhRVUZITEVsQlFVa3NRMEZCUXp0SlFVTjBRaXhKUVVGSkxFTkJRVU1zVTBGQlV5eEZRVUZGTEVOQlFVTTdRVUZEY2tJc1IwRkJSenM3UlVGRlJDeGhRVUZoTEVWQlFVVXNXVUZCV1R0SlFVTjZRaXhKUVVGSkxFTkJRVU1zVTBGQlV5eEZRVUZGTEVOQlFVTTdRVUZEY2tJc1IwRkJSenM3UTBGRlJpeERRVUZETEVOQlFVTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUluZFhObElITjBjbWxqZENjN1hHNWNiblpoY2lCU1pXRmpkQ0E5SUhKbGNYVnBjbVVvSjNKbFlXTjBMMkZrWkc5dWN5Y3BPMXh1WEc1MllYSWdUM1psY214aGVVMXBlR2x1SUQwZ2NtVnhkV2x5WlNnbkxpNHZMaTR2YldsNGFXNXpMMjkyWlhKc1lYa25LVHRjYmx4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlGSmxZV04wTG1OeVpXRjBaVU5zWVhOektIdGNibHh1SUNCdGFYaHBibk02SUZ0UGRtVnliR0Y1VFdsNGFXNHNJRkpsWVdOMExtRmtaRzl1Y3k1TWFXNXJaV1JUZEdGMFpVMXBlR2x1WFN4Y2JseHVJQ0JuWlhSSmJtbDBhV0ZzVTNSaGRHVTZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdlMXh1SUNBZ0lDQWdabWx5YzNST1lXMWxPaUIwYUdsekxuQnliM0J6TG1acGNuTjBUbUZ0WlNCOGZDQW5KeXhjYmlBZ0lDQWdJR3hoYzNST1lXMWxPaUIwYUdsekxuQnliM0J6TG14aGMzUk9ZVzFsSUh4OElDY25YRzRnSUNBZ2ZUdGNiaUFnZlN4Y2JseHVJQ0J5Wlc1a1pYSTZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdLRnh1SUNBZ0lDQWdQR1JwZGlCamJHRnpjMDVoYldVOVhDSnRiMlJoYkNCbVlXUmxYQ0krWEc0Z0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNOT1lXMWxQVndpYlc5a1lXd3RaR2xoYkc5blhDSStYRzRnSUNBZ0lDQWdJQ0FnUEdScGRpQmpiR0Z6YzA1aGJXVTlYQ0p0YjJSaGJDMWpiMjUwWlc1MFhDSStYRzRnSUNBZ0lDQWdJQ0FnSUNBOFpHbDJJR05zWVhOelRtRnRaVDFjSW0xdlpHRnNMV2hsWVdSbGNsd2lQbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQThZblYwZEc5dUlIUjVjR1U5WENKaWRYUjBiMjVjSWlCamJHRnpjMDVoYldVOVhDSmpiRzl6WlZ3aUlHUmhkR0V0WkdsemJXbHpjejFjSW0xdlpHRnNYQ0krUEhOd1lXNGdZWEpwWVMxb2FXUmtaVzQ5WENKMGNuVmxYQ0krSm5ScGJXVnpPend2YzNCaGJqNDhjM0JoYmlCamJHRnpjMDVoYldVOVhDSnpjaTF2Ym14NVhDSStRMnh2YzJVOEwzTndZVzQrUEM5aWRYUjBiMjQrWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJRHhvTkNCamJHRnpjMDVoYldVOVhDSnRiMlJoYkMxMGFYUnNaVndpUGtGa1pDQk9aWGNnU1hSbGJUd3ZhRFErWEc0Z0lDQWdJQ0FnSUNBZ0lDQThMMlJwZGo1Y2JpQWdJQ0FnSUNBZ0lDQWdJRHhrYVhZZ1kyeGhjM05PWVcxbFBWd2liVzlrWVd3dFltOWtlVndpUGx4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0E4Wm05eWJUNWNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThaR2wySUdOc1lYTnpUbUZ0WlQxY0ltWnZjbTB0WjNKdmRYQmNJajVjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4c1lXSmxiQ0JvZEcxc1JtOXlQVndpWm1seWMzUnVZVzFsWENJK1JtbHljM1FnVG1GdFpUd3ZiR0ZpWld3K1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThhVzV3ZFhRZ2NtVm1QVndpWm1seWMzUk9ZVzFsWENJZ2RIbHdaVDFjSW5SbGVIUmNJaUJqYkdGemMwNWhiV1U5WENKbWIzSnRMV052Ym5SeWIyeGNJaUJwWkQxY0ltWnBjbk4wYm1GdFpWd2lJSEJzWVdObGFHOXNaR1Z5UFZ3aVJtbHljM1FnYm1GdFpWd2lJSFpoYkhWbFRHbHVhejE3ZEdocGN5NXNhVzVyVTNSaGRHVW9KMlpwY25OMFRtRnRaU2NwZlNBdlBseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEd3ZaR2wyUGx4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNOT1lXMWxQVndpWm05eWJTMW5jbTkxY0Z3aVBseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQR3hoWW1Wc0lHaDBiV3hHYjNJOVhDSnNZWE4wYm1GdFpWd2lQa3hoYzNRZ1RtRnRaVHd2YkdGaVpXdytYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4YVc1d2RYUWdkSGx3WlQxY0luUmxlSFJjSWlCamJHRnpjMDVoYldVOVhDSm1iM0p0TFdOdmJuUnliMnhjSWlCcFpEMWNJbXhoYzNSdVlXMWxYQ0lnY0d4aFkyVm9iMnhrWlhJOVhDSk1ZWE4wSUc1aGJXVmNJaUIyWVd4MVpVeHBibXM5ZTNSb2FYTXViR2x1YTFOMFlYUmxLQ2RzWVhOMFRtRnRaU2NwZlNBdlBseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEd3ZaR2wyUGx4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0E4TDJadmNtMCtYRzRnSUNBZ0lDQWdJQ0FnSUNBOEwyUnBkajVjYmlBZ0lDQWdJQ0FnSUNBZ0lEeGthWFlnWTJ4aGMzTk9ZVzFsUFZ3aWJXOWtZV3d0Wm05dmRHVnlYQ0krWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJRHhpZFhSMGIyNGdkSGx3WlQxY0ltSjFkSFJ2Ymx3aUlHTnNZWE56VG1GdFpUMWNJbUowYmlCaWRHNHRaR1ZtWVhWc2RGd2lJRzl1UTJ4cFkyczllM1JvYVhNdVgyaGhibVJzWlVOaGJtTmxiSDArUTJGdVkyVnNQQzlpZFhSMGIyNCtYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lEeGlkWFIwYjI0Z2RIbHdaVDFjSW1KMWRIUnZibHdpSUdOc1lYTnpUbUZ0WlQxY0ltSjBiaUJpZEc0dGNISnBiV0Z5ZVZ3aUlHOXVRMnhwWTJzOWUzUm9hWE11WDJoaGJtUnNaVUZrWkgwK1QwczhMMkoxZEhSdmJqNWNiaUFnSUNBZ0lDQWdJQ0FnSUR3dlpHbDJQbHh1SUNBZ0lDQWdJQ0FnSUR3dlpHbDJQbHh1SUNBZ0lDQWdJQ0E4TDJScGRqNWNiaUFnSUNBZ0lEd3ZaR2wyUGx4dUlDQWdJQ2s3WEc0Z0lIMHNYRzVjYmlBZ0x5OGdkWE5sY3lCQ2IyOTBjM1J5WVhBZ2JXOWtZV3duYzF4dUlDQm9ZVzVrYkdWTmIyUmhiRk5vYjNkdU9pQm1kVzVqZEdsdmJpZ3BJSHRjYmlBZ0lDQjBhR2x6TG5KbFpuTXVabWx5YzNST1lXMWxMbWRsZEVSUFRVNXZaR1VvS1M1bWIyTjFjeWdwTzF4dUlDQjlMRnh1WEc0Z0lHaGhibVJzWlUxdlpHRnNTR2xrWkdWdU9pQm1kVzVqZEdsdmJpZ3BJSHRjYmlBZ0lDQnBaaUFvZEdocGN5NWpiMjVtYVhKdFpXUXBJSHRjYmlBZ0lDQWdJR2xtSUNoMGFHbHpMbkJ5YjNCekxtOXJRMkZzYkdKaFkyc3BJSHRjYmlBZ0lDQWdJQ0FnZEdocGN5NXdjbTl3Y3k1dmEwTmhiR3hpWVdOcktIUm9hWE11YzNSaGRHVXVabWx5YzNST1lXMWxMQ0IwYUdsekxuTjBZWFJsTG14aGMzUk9ZVzFsS1R0Y2JpQWdJQ0FnSUgxY2JpQWdJQ0I5WEc0Z0lDQWdaV3h6WlNCN1hHNGdJQ0FnSUNCcFppQW9kR2hwY3k1d2NtOXdjeTVqWVc1alpXeERZV3hzWW1GamF5a2dlMXh1SUNBZ0lDQWdJQ0IwYUdsekxuQnliM0J6TG1OaGJtTmxiRU5oYkd4aVlXTnJLQ2s3WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdmVnh1SUNCOUxGeHVYRzRnSUY5b1lXNWtiR1ZCWkdRNklHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQjBhR2x6TG1OdmJtWnBjbTFsWkNBOUlIUnlkV1U3WEc0Z0lDQWdkR2hwY3k1b2FXUmxUVzlrWVd3b0tUdGNiaUFnZlN4Y2JseHVJQ0JmYUdGdVpHeGxRMkZ1WTJWc09pQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdkR2hwY3k1b2FXUmxUVzlrWVd3b0tUdGNiaUFnZlZ4dVhHNTlLVHRjYmlKZGZRPT0iLCIndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0L2FkZG9ucycpO1xuXG52YXIgU3RvcmVzID0gcmVxdWlyZSgnLi4vLi4vc3RvcmVzJyksXG4gICAgc3RvcmVDaGFuZ2VNaXhpbiA9IHJlcXVpcmUoJy4uLy4uL21peGlucy9zdG9yZS1jaGFuZ2UnKTtcblxuLyoqXG4gKiBCYXNpYyBtYW5hZ2VyIGZvciBkaXNwbGF5aW5nIG92ZXJsYXlzXG4gKlxuICogT25seSAxIG92ZXJsYXkgYXQgYSB0aW1lIGNhbiBiZSBkaXNwbGF5ZWQuXG4gKlxuICogT3ZlcmxheXMgYXJlIHJlc3BvbnNpYmxlIGZvciB0aGVpciBvd24gcG9wcGluZ1xuICpcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJleHBvcnRzXCIsXG5cbiAgbWl4aW5zOiBbc3RvcmVDaGFuZ2VNaXhpbihTdG9yZXMuT3ZlcmxheXNTdG9yZSldLFxuXG4gIHN0b3JlQ2hhbmdlOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mb3JjZVVwZGF0ZSgpO1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBvdmVybGF5ID0gU3RvcmVzLk92ZXJsYXlzU3RvcmUuZ2V0VG9wT3ZlcmxheSgpO1xuICAgIGlmICghb3ZlcmxheSkgeyByZXR1cm4gbnVsbDsgfVxuICAgIHJldHVybiBvdmVybGF5O1xuICB9XG5cbn0pO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lMMVZ6WlhKekwyaGlkWEp5YjNkekwyUmxkaTlvWlhKdmEzVXZjbVZoWTNRdFpteDFlQzF6ZEdGeWRHVnlMM0IxWW14cFl5OXFZWFpoYzJOeWFYQjBjeTlqYjIxd2IyNWxiblJ6TDI5MlpYSnNZWGx6TDI5MlpYSnNZWGt0YldGdVlXZGxjaTVxYzNnaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OW9ZblZ5Y205M2N5OWtaWFl2YUdWeWIydDFMM0psWVdOMExXWnNkWGd0YzNSaGNuUmxjaTl3ZFdKc2FXTXZhbUYyWVhOamNtbHdkSE12WTI5dGNHOXVaVzUwY3k5dmRtVnliR0Y1Y3k5dmRtVnliR0Y1TFcxaGJtRm5aWEl1YW5ONElsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lKQlFVRkJMRmxCUVZrc1EwRkJRenM3UVVGRllpeEpRVUZKTEV0QlFVc3NSMEZCUnl4UFFVRlBMRU5CUVVNc1kwRkJZeXhEUVVGRExFTkJRVU03TzBGQlJYQkRMRWxCUVVrc1RVRkJUU3hIUVVGSExFOUJRVThzUTBGQlF5eGpRVUZqTEVOQlFVTTdRVUZEY0VNc1NVRkJTU3huUWtGQlowSXNSMEZCUnl4UFFVRlBMRU5CUVVNc01rSkJRVEpDTEVOQlFVTXNRMEZCUXpzN1FVRkZOVVE3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQkxFZEJRVWM3TzBGQlJVZ3NiME5CUVc5RExIVkNRVUZCT3p0QlFVVndReXhGUVVGRkxFMUJRVTBzUlVGQlJTeERRVUZETEdkQ1FVRm5RaXhEUVVGRExFMUJRVTBzUTBGQlF5eGhRVUZoTEVOQlFVTXNRMEZCUXpzN1JVRkZhRVFzVjBGQlZ5eEZRVUZGTEZsQlFWazdTVUZEZGtJc1NVRkJTU3hEUVVGRExGZEJRVmNzUlVGQlJTeERRVUZETzBGQlEzWkNMRWRCUVVjN08wVkJSVVFzVFVGQlRTeEZRVUZGTEZsQlFWazdTVUZEYkVJc1NVRkJTU3hQUVVGUExFZEJRVWNzVFVGQlRTeERRVUZETEdGQlFXRXNRMEZCUXl4aFFVRmhMRVZCUVVVc1EwRkJRenRKUVVOdVJDeEpRVUZKTEVOQlFVTXNUMEZCVHl4RlFVRkZMRVZCUVVVc1QwRkJUeXhKUVVGSkxFTkJRVU1zUlVGQlJUdEpRVU01UWl4UFFVRlBMRTlCUVU4c1EwRkJRenRCUVVOdVFpeEhRVUZIT3p0RFFVVkdMRU5CUVVNc1EwRkJReUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSWlkMWMyVWdjM1J5YVdOMEp6dGNibHh1ZG1GeUlGSmxZV04wSUQwZ2NtVnhkV2x5WlNnbmNtVmhZM1F2WVdSa2IyNXpKeWs3WEc1Y2JuWmhjaUJUZEc5eVpYTWdQU0J5WlhGMWFYSmxLQ2N1TGk4dUxpOXpkRzl5WlhNbktTeGNiaUFnSUNCemRHOXlaVU5vWVc1blpVMXBlR2x1SUQwZ2NtVnhkV2x5WlNnbkxpNHZMaTR2YldsNGFXNXpMM04wYjNKbExXTm9ZVzVuWlNjcE8xeHVYRzR2S2lwY2JpQXFJRUpoYzJsaklHMWhibUZuWlhJZ1ptOXlJR1JwYzNCc1lYbHBibWNnYjNabGNteGhlWE5jYmlBcVhHNGdLaUJQYm14NUlERWdiM1psY214aGVTQmhkQ0JoSUhScGJXVWdZMkZ1SUdKbElHUnBjM0JzWVhsbFpDNWNiaUFxWEc0Z0tpQlBkbVZ5YkdGNWN5QmhjbVVnY21WemNHOXVjMmxpYkdVZ1ptOXlJSFJvWldseUlHOTNiaUJ3YjNCd2FXNW5YRzRnS2x4dUlDb3ZYRzVjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnVW1WaFkzUXVZM0psWVhSbFEyeGhjM01vZTF4dVhHNGdJRzFwZUdsdWN6b2dXM04wYjNKbFEyaGhibWRsVFdsNGFXNG9VM1J2Y21WekxrOTJaWEpzWVhselUzUnZjbVVwWFN4Y2JseHVJQ0J6ZEc5eVpVTm9ZVzVuWlRvZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lIUm9hWE11Wm05eVkyVlZjR1JoZEdVb0tUdGNiaUFnZlN4Y2JseHVJQ0J5Wlc1a1pYSTZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0IyWVhJZ2IzWmxjbXhoZVNBOUlGTjBiM0psY3k1UGRtVnliR0Y1YzFOMGIzSmxMbWRsZEZSdmNFOTJaWEpzWVhrb0tUdGNiaUFnSUNCcFppQW9JVzkyWlhKc1lYa3BJSHNnY21WMGRYSnVJRzUxYkd3N0lIMWNiaUFnSUNCeVpYUjFjbTRnYjNabGNteGhlVHRjYmlBZ2ZWeHVYRzU5S1R0Y2JpSmRmUT09IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdC9hZGRvbnMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiZXhwb3J0c1wiLFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImNvbnRhaW5lci1mbHVpZFwifSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJyb3dcIn0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJjb2wteHMtMTJcIn0sIFxuICAgICAgICAgICAgXCJSb3V0ZSBOb3QgRm91bmRcIlxuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lMMVZ6WlhKekwyaGlkWEp5YjNkekwyUmxkaTlvWlhKdmEzVXZjbVZoWTNRdFpteDFlQzF6ZEdGeWRHVnlMM0IxWW14cFl5OXFZWFpoYzJOeWFYQjBjeTlqYjIxd2IyNWxiblJ6TDNKdmRYUmxMVzV2ZEMxbWIzVnVaQzVxYzNnaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OW9ZblZ5Y205M2N5OWtaWFl2YUdWeWIydDFMM0psWVdOMExXWnNkWGd0YzNSaGNuUmxjaTl3ZFdKc2FXTXZhbUYyWVhOamNtbHdkSE12WTI5dGNHOXVaVzUwY3k5eWIzVjBaUzF1YjNRdFptOTFibVF1YW5ONElsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lKQlFVRkJMRmxCUVZrc1EwRkJRenM3UVVGRllpeEpRVUZKTEV0QlFVc3NSMEZCUnl4UFFVRlBMRU5CUVVNc1kwRkJZeXhEUVVGRExFTkJRVU03TzBGQlJYQkRMRzlEUVVGdlF5eDFRa0ZCUVR0RlFVTnNReXhOUVVGTkxFVkJRVVVzV1VGQldUdEpRVU5zUWp0TlFVTkZMRzlDUVVGQkxFdEJRVWtzUlVGQlFTeERRVUZCTEVOQlFVTXNVMEZCUVN4RlFVRlRMRU5CUVVNc2FVSkJRV3RDTEVOQlFVRXNSVUZCUVR0UlFVTXZRaXh2UWtGQlFTeExRVUZKTEVWQlFVRXNRMEZCUVN4RFFVRkRMRk5CUVVFc1JVRkJVeXhEUVVGRExFdEJRVTBzUTBGQlFTeEZRVUZCTzFWQlEyNUNMRzlDUVVGQkxFdEJRVWtzUlVGQlFTeERRVUZCTEVOQlFVTXNVMEZCUVN4RlFVRlRMRU5CUVVNc1YwRkJXU3hEUVVGQkxFVkJRVUU3UVVGQlFTeFpRVUZCTEdsQ1FVRkJPMEZCUVVFc1ZVRkZja0lzUTBGQlFUdFJRVU5HTEVOQlFVRTdUVUZEUml4RFFVRkJPMDFCUTA0N1IwRkRTRHREUVVOR0xFTkJRVU1zUTBGQlF5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJaWQxYzJVZ2MzUnlhV04wSnp0Y2JseHVkbUZ5SUZKbFlXTjBJRDBnY21WeGRXbHlaU2duY21WaFkzUXZZV1JrYjI1ekp5azdYRzVjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnVW1WaFkzUXVZM0psWVhSbFEyeGhjM01vZTF4dUlDQnlaVzVrWlhJNklHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQnlaWFIxY200Z0tGeHVJQ0FnSUNBZ1BHUnBkaUJqYkdGemMwNWhiV1U5WENKamIyNTBZV2x1WlhJdFpteDFhV1JjSWo1Y2JpQWdJQ0FnSUNBZ1BHUnBkaUJqYkdGemMwNWhiV1U5WENKeWIzZGNJajVjYmlBZ0lDQWdJQ0FnSUNBOFpHbDJJR05zWVhOelRtRnRaVDFjSW1OdmJDMTRjeTB4TWx3aVBseHVJQ0FnSUNBZ0lDQWdJQ0FnVW05MWRHVWdUbTkwSUVadmRXNWtYRzRnSUNBZ0lDQWdJQ0FnUEM5a2FYWStYRzRnSUNBZ0lDQWdJRHd2WkdsMlBseHVJQ0FnSUNBZ1BDOWthWFkrWEc0Z0lDQWdLVHRjYmlBZ2ZWeHVmU2s3WEc0aVhYMD0iLCIndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0L2FkZG9ucycpO1xuXG52YXIgU3RvcmVzID0gcmVxdWlyZSgnLi4vc3RvcmVzJyksXG4gICAgc3RvcmVDaGFuZ2VNaXhpbiA9IHJlcXVpcmUoJy4uL21peGlucy9zdG9yZS1jaGFuZ2UnKTtcblxudmFyIFNlcnZlclRpbWVBY3Rpb25zID0gcmVxdWlyZSgnLi4vYWN0aW9ucy9zZXJ2ZXItdGltZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJleHBvcnRzXCIsXG5cbiAgbWl4aW5zOiBbc3RvcmVDaGFuZ2VNaXhpbihTdG9yZXMuU2VydmVyVGltZVN0b3JlKSwgUmVhY3QuYWRkb25zLlB1cmVSZW5kZXJNaXhpbl0sXG5cbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRpbWU6IFN0b3Jlcy5TZXJ2ZXJUaW1lU3RvcmUuZ2V0U2VydmVyVGltZSgpXG4gICAgfTtcbiAgfSxcblxuICBzdG9yZUNoYW5nZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe3RpbWU6IFN0b3Jlcy5TZXJ2ZXJUaW1lU3RvcmUuZ2V0U2VydmVyVGltZSgpfSk7XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgIFNlcnZlclRpbWVBY3Rpb25zLnN1YnNjcmliZSgpO1xuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbigpIHtcbiAgICBTZXJ2ZXJUaW1lQWN0aW9ucy51bnN1YnNjcmliZSgpO1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBjb250ZW50O1xuXG4gICAgaWYgKCF0aGlzLnN0YXRlLnRpbWUpIHtcbiAgICAgIGNvbnRlbnQgPSBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIFwiVW5rbm93blwiKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBjb250ZW50ID0gUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLCB0aGlzLnN0YXRlLnRpbWUuZGF0YSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJjb250YWluZXItZmx1aWRcIn0sIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwicm93XCJ9LCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiY29sLXhzLTEyXCJ9LCBcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoM1wiLCBudWxsLCBcIlNlcnZlciBUaW1lXCIpXG4gICAgICAgICAgKSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImNvbC14cy0xMlwifSwgXG4gICAgICAgICAgICBjb250ZW50XG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcblxuICB9XG59KTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pTDFWelpYSnpMMmhpZFhKeWIzZHpMMlJsZGk5b1pYSnZhM1V2Y21WaFkzUXRabXgxZUMxemRHRnlkR1Z5TDNCMVlteHBZeTlxWVhaaGMyTnlhWEIwY3k5amIyMXdiMjVsYm5SekwzTmxjblpsY2kxMGFXMWxMbXB6ZUNJc0luTnZkWEpqWlhNaU9sc2lMMVZ6WlhKekwyaGlkWEp5YjNkekwyUmxkaTlvWlhKdmEzVXZjbVZoWTNRdFpteDFlQzF6ZEdGeWRHVnlMM0IxWW14cFl5OXFZWFpoYzJOeWFYQjBjeTlqYjIxd2IyNWxiblJ6TDNObGNuWmxjaTEwYVcxbExtcHplQ0pkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lRVUZCUVN4WlFVRlpMRU5CUVVNN08wRkJSV0lzU1VGQlNTeExRVUZMTEVkQlFVY3NUMEZCVHl4RFFVRkRMR05CUVdNc1EwRkJReXhEUVVGRE96dEJRVVZ3UXl4SlFVRkpMRTFCUVUwc1IwRkJSeXhQUVVGUExFTkJRVU1zVjBGQlZ5eERRVUZETzBGQlEycERMRWxCUVVrc1owSkJRV2RDTEVkQlFVY3NUMEZCVHl4RFFVRkRMSGRDUVVGM1FpeERRVUZETEVOQlFVTTdPMEZCUlhwRUxFbEJRVWtzYVVKQlFXbENMRWRCUVVjc1QwRkJUeXhEUVVGRExIZENRVUYzUWl4RFFVRkRMRU5CUVVNN08wRkJSVEZFTEc5RFFVRnZReXgxUWtGQlFUczdRVUZGY0VNc1JVRkJSU3hOUVVGTkxFVkJRVVVzUTBGQlF5eG5Ra0ZCWjBJc1EwRkJReXhOUVVGTkxFTkJRVU1zWlVGQlpTeERRVUZETEVWQlFVVXNTMEZCU3l4RFFVRkRMRTFCUVUwc1EwRkJReXhsUVVGbExFTkJRVU03TzBWQlJXaEdMR1ZCUVdVc1JVRkJSU3haUVVGWk8wbEJRek5DTEU5QlFVODdUVUZEVEN4SlFVRkpMRVZCUVVVc1RVRkJUU3hEUVVGRExHVkJRV1VzUTBGQlF5eGhRVUZoTEVWQlFVVTdTMEZETjBNc1EwRkJRenRCUVVOT0xFZEJRVWM3TzBWQlJVUXNWMEZCVnl4RlFVRkZMRmxCUVZrN1NVRkRka0lzU1VGQlNTeERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRMRWxCUVVrc1JVRkJSU3hOUVVGTkxFTkJRVU1zWlVGQlpTeERRVUZETEdGQlFXRXNSVUZCUlN4RFFVRkRMRU5CUVVNc1EwRkJRenRCUVVOc1JTeEhRVUZIT3p0RlFVVkVMR2xDUVVGcFFpeEZRVUZGTEZkQlFWYzdTVUZETlVJc2FVSkJRV2xDTEVOQlFVTXNVMEZCVXl4RlFVRkZMRU5CUVVNN1FVRkRiRU1zUjBGQlJ6czdSVUZGUkN4dlFrRkJiMElzUlVGQlJTeFhRVUZYTzBsQlF5OUNMR2xDUVVGcFFpeERRVUZETEZkQlFWY3NSVUZCUlN4RFFVRkRPMEZCUTNCRExFZEJRVWM3TzBWQlJVUXNUVUZCVFN4RlFVRkZMRmxCUVZrN1FVRkRkRUlzU1VGQlNTeEpRVUZKTEU5QlFVOHNRMEZCUXpzN1NVRkZXaXhKUVVGSkxFTkJRVU1zU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4SlFVRkpMRVZCUVVVN1RVRkRjRUlzVDBGQlR5eEhRVUZITEc5Q1FVRkJMRXRCUVVrc1JVRkJRU3hKUVVGRExFVkJRVUVzVTBGQllTeERRVUZCTEVOQlFVTTdTMEZET1VJN1UwRkRTVHROUVVOSUxFOUJRVThzUjBGQlJ5eHZRa0ZCUVN4TFFVRkpMRVZCUVVFc1NVRkJReXhGUVVGRExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNTVUZCU1N4RFFVRkRMRWxCUVZjc1EwRkJRU3hEUVVGRE8wRkJRMnhFTEV0QlFVczdPMGxCUlVRN1RVRkRSU3h2UWtGQlFTeExRVUZKTEVWQlFVRXNRMEZCUVN4RFFVRkRMRk5CUVVFc1JVRkJVeXhEUVVGRExHbENRVUZyUWl4RFFVRkJMRVZCUVVFN1VVRkRMMElzYjBKQlFVRXNTMEZCU1N4RlFVRkJMRU5CUVVFc1EwRkJReXhUUVVGQkxFVkJRVk1zUTBGQlF5eExRVUZOTEVOQlFVRXNSVUZCUVR0VlFVTnVRaXh2UWtGQlFTeExRVUZKTEVWQlFVRXNRMEZCUVN4RFFVRkRMRk5CUVVFc1JVRkJVeXhEUVVGRExGZEJRVmtzUTBGQlFTeEZRVUZCTzFsQlEzcENMRzlDUVVGQkxFbEJRVWNzUlVGQlFTeEpRVUZETEVWQlFVRXNZVUZCWjBJc1EwRkJRVHRWUVVOb1FpeERRVUZCTEVWQlFVRTdWVUZEVGl4dlFrRkJRU3hMUVVGSkxFVkJRVUVzUTBGQlFTeERRVUZETEZOQlFVRXNSVUZCVXl4RFFVRkRMRmRCUVZrc1EwRkJRU3hGUVVGQk8xbEJRM2hDTEU5QlFWRTdWVUZEVEN4RFFVRkJPMUZCUTBZc1EwRkJRVHROUVVOR0xFTkJRVUU3UVVGRFdpeE5RVUZOT3p0SFFVVklPME5CUTBZc1EwRkJReXhEUVVGRElpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lKM1Z6WlNCemRISnBZM1FuTzF4dVhHNTJZWElnVW1WaFkzUWdQU0J5WlhGMWFYSmxLQ2R5WldGamRDOWhaR1J2Ym5NbktUdGNibHh1ZG1GeUlGTjBiM0psY3lBOUlISmxjWFZwY21Vb0p5NHVMM04wYjNKbGN5Y3BMRnh1SUNBZ0lITjBiM0psUTJoaGJtZGxUV2w0YVc0Z1BTQnlaWEYxYVhKbEtDY3VMaTl0YVhocGJuTXZjM1J2Y21VdFkyaGhibWRsSnlrN1hHNWNiblpoY2lCVFpYSjJaWEpVYVcxbFFXTjBhVzl1Y3lBOUlISmxjWFZwY21Vb0p5NHVMMkZqZEdsdmJuTXZjMlZ5ZG1WeUxYUnBiV1VuS1R0Y2JseHViVzlrZFd4bExtVjRjRzl5ZEhNZ1BTQlNaV0ZqZEM1amNtVmhkR1ZEYkdGemN5aDdYRzVjYmlBZ2JXbDRhVzV6T2lCYmMzUnZjbVZEYUdGdVoyVk5hWGhwYmloVGRHOXlaWE11VTJWeWRtVnlWR2x0WlZOMGIzSmxLU3dnVW1WaFkzUXVZV1JrYjI1ekxsQjFjbVZTWlc1a1pYSk5hWGhwYmwwc1hHNWNiaUFnWjJWMFNXNXBkR2xoYkZOMFlYUmxPaUJtZFc1amRHbHZiaUFvS1NCN1hHNGdJQ0FnY21WMGRYSnVJSHRjYmlBZ0lDQWdJSFJwYldVNklGTjBiM0psY3k1VFpYSjJaWEpVYVcxbFUzUnZjbVV1WjJWMFUyVnlkbVZ5VkdsdFpTZ3BYRzRnSUNBZ2ZUdGNiaUFnZlN4Y2JseHVJQ0J6ZEc5eVpVTm9ZVzVuWlRvZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lIUm9hWE11YzJWMFUzUmhkR1VvZTNScGJXVTZJRk4wYjNKbGN5NVRaWEoyWlhKVWFXMWxVM1J2Y21VdVoyVjBVMlZ5ZG1WeVZHbHRaU2dwZlNrN1hHNGdJSDBzWEc1Y2JpQWdZMjl0Y0c5dVpXNTBSR2xrVFc5MWJuUTZJR1oxYm1OMGFXOXVLQ2tnZTF4dUlDQWdJRk5sY25abGNsUnBiV1ZCWTNScGIyNXpMbk4xWW5OamNtbGlaU2dwTzF4dUlDQjlMRnh1WEc0Z0lHTnZiWEJ2Ym1WdWRGZHBiR3hWYm0xdmRXNTBPaUJtZFc1amRHbHZiaWdwSUh0Y2JpQWdJQ0JUWlhKMlpYSlVhVzFsUVdOMGFXOXVjeTUxYm5OMVluTmpjbWxpWlNncE8xeHVJQ0I5TEZ4dVhHNGdJSEpsYm1SbGNqb2dablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJSFpoY2lCamIyNTBaVzUwTzF4dVhHNGdJQ0FnYVdZZ0tDRjBhR2x6TG5OMFlYUmxMblJwYldVcElIdGNiaUFnSUNBZ0lHTnZiblJsYm5RZ1BTQThaR2wyUGxWdWEyNXZkMjQ4TDJScGRqNDdYRzRnSUNBZ2ZWeHVJQ0FnSUdWc2MyVWdlMXh1SUNBZ0lDQWdZMjl1ZEdWdWRDQTlJRHhrYVhZK2UzUm9hWE11YzNSaGRHVXVkR2x0WlM1a1lYUmhmVHd2WkdsMlBqdGNiaUFnSUNCOVhHNWNiaUFnSUNCeVpYUjFjbTRnS0Z4dUlDQWdJQ0FnUEdScGRpQmpiR0Z6YzA1aGJXVTlYQ0pqYjI1MFlXbHVaWEl0Wm14MWFXUmNJajVjYmlBZ0lDQWdJQ0FnUEdScGRpQmpiR0Z6YzA1aGJXVTlYQ0p5YjNkY0lqNWNiaUFnSUNBZ0lDQWdJQ0E4WkdsMklHTnNZWE56VG1GdFpUMWNJbU52YkMxNGN5MHhNbHdpUGx4dUlDQWdJQ0FnSUNBZ0lDQWdQR2d6UGxObGNuWmxjaUJVYVcxbFBDOW9NejVjYmlBZ0lDQWdJQ0FnSUNBOEwyUnBkajVjYmlBZ0lDQWdJQ0FnSUNBOFpHbDJJR05zWVhOelRtRnRaVDFjSW1OdmJDMTRjeTB4TWx3aVBseHVJQ0FnSUNBZ0lDQWdJQ0FnZTJOdmJuUmxiblI5WEc0Z0lDQWdJQ0FnSUNBZ1BDOWthWFkrWEc0Z0lDQWdJQ0FnSUR3dlpHbDJQbHh1SUNBZ0lDQWdQQzlrYVhZK1hHNGdJQ0FnS1R0Y2JseHVJQ0I5WEc1OUtUdGNiaUpkZlE9PSIsIid1c2Ugc3RyaWN0JztcblxudmFyIGtleU1pcnJvciA9IHJlcXVpcmUoJ3JlYWN0L2xpYi9rZXlNaXJyb3InKTtcblxuLyoqXG4gKiBBY3Rpb24gdHlwZSBjb25zdGFudHMuIFNob3VsZCBmb2xsb3cgdGhlIGZvcm1hdDpcbiAqIDxPQkpFQ1QgQUxJQVM+XzxWRVJCPlxuICpcbiAqIEZvciBleGFtcGxlLCBhbiBhY3Rpb24gZm9yIGZldGNoaW5nIGEgc3BlY2lmaWMgXCJJdGVtXCIgb2JqZWN0OlxuICogSVRFTV9HRVRcbiAqXG4gKiBJZiB5b3UncmUgdXNpbmcgdGhlIENSVUQgQWN0aW9uIGFuZCBTdG9yZSBiYXNlIGNsYXNzZXMgdGhlIHZlcmJzIG11c3QgYmUgdGhlIGZvbGxvd2luZzpcbiAqIEdFVEFMTCAgICAgICAgICAgICAgICAgICA8LSBSZXRyaWV2aW5nIGEgbGlzdCBvZiBvYmplY3RzLiAoZS5nLiBHRVQgL2l0ZW1zKVxuICogR0VUT05FICAgICAgICAgICAgICAgICAgIDwtIEdldCBhIHNpbmdsZSBvYmplY3QgKGUuZy4gR0VUIC9pdGVtcy86aWQpXG4gKiBQT1NUICAgICAgICAgICAgICAgICAgICAgPC0gQ3JlYXRpbmcgYW4gb2JqZWN0LiAoZS5nLiBQT1NUIC9pdGVtcylcbiAqIFBVVCAgICAgICAgICAgICAgICAgICAgICA8LSBVcGRhdGUgYW4gZXhpc3Rpbmcgb2JqZWN0LiAoZS5nLiBQVVQgL2l0ZW1zLzppZClcbiAqIERFTEVURSAgICAgICAgICAgICAgICAgICA8LSBEZWxldGluZyBhbiBvYmplY3QuIChlLmcuIERFTEVURSAvaXRlbXMvOmlkKVxuICpcbiAqIFNvbWUgYWN0aW9ucyB0eXBlcyBtYXkgbm90IGhhdmUgYSByZWNlaXZlciwgd2hpY2ggaXMgT0suIFRoZSByZXN1bHQgb2YgUE9TVCwgUFVULCBhbmQgREVMRVRFIGFjdGlvbnNcbiAqIG1heSBlbnRlciBiYWNrIGludG8gdGhlIHN5c3RlbSB0aHJvdWdoIHN1YnNjcmlwdGlvbnMgcmF0aGVyIHRoYW4gaW4gcmVzcG9uc2UgdG8gQVBJIHJlcXVlc3RzLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0ga2V5TWlycm9yKHtcblxuICAvLyBpdGVtIGFjdGlvbnNcbiAgSVRFTV9HRVRBTEw6IG51bGwsXG4gIElURU1fR0VUT05FOiBudWxsLFxuICBJVEVNX1BPU1Q6IG51bGwsXG4gIElURU1fUFVUOiBudWxsLFxuICBJVEVNX0RFTEVURTogbnVsbCxcblxuICAvLyBzZXJ2ZXJ0aW1lIGFjdGlvbnNcbiAgU0VSVkVSVElNRV9HRVQ6IG51bGwsXG4gIFNFUlZFUlRJTUVfUFVUOiBudWxsLFxuXG4gIC8vIG92ZXJsYXkgYWN0aW9uc1xuICBPVkVSTEFZX1BVU0g6IG51bGwsXG4gIE9WRVJMQVlfUE9QOiBudWxsLFxuXG59KTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pTDFWelpYSnpMMmhpZFhKeWIzZHpMMlJsZGk5b1pYSnZhM1V2Y21WaFkzUXRabXgxZUMxemRHRnlkR1Z5TDNCMVlteHBZeTlxWVhaaGMyTnlhWEIwY3k5amIyNXpkR0Z1ZEhNdllXTjBhVzl1Y3k1cWN5SXNJbk52ZFhKalpYTWlPbHNpTDFWelpYSnpMMmhpZFhKeWIzZHpMMlJsZGk5b1pYSnZhM1V2Y21WaFkzUXRabXgxZUMxemRHRnlkR1Z5TDNCMVlteHBZeTlxWVhaaGMyTnlhWEIwY3k5amIyNXpkR0Z1ZEhNdllXTjBhVzl1Y3k1cWN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaVFVRkJRU3haUVVGWkxFTkJRVU03TzBGQlJXSXNTVUZCU1N4VFFVRlRMRWRCUVVjc1QwRkJUeXhEUVVGRExIRkNRVUZ4UWl4RFFVRkRMRU5CUVVNN08wRkJSUzlETzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFTeEhRVUZIT3p0QlFVVklMRTFCUVUwc1EwRkJReXhQUVVGUExFZEJRVWNzVTBGQlV5eERRVUZETzBGQlF6TkNPenRGUVVWRkxGZEJRVmNzUlVGQlJTeEpRVUZKTzBWQlEycENMRmRCUVZjc1JVRkJSU3hKUVVGSk8wVkJRMnBDTEZOQlFWTXNSVUZCUlN4SlFVRkpPMFZCUTJZc1VVRkJVU3hGUVVGRkxFbEJRVWs3UVVGRGFFSXNSVUZCUlN4WFFVRlhMRVZCUVVVc1NVRkJTVHRCUVVOdVFqczdSVUZGUlN4alFVRmpMRVZCUVVVc1NVRkJTVHRCUVVOMFFpeEZRVUZGTEdOQlFXTXNSVUZCUlN4SlFVRkpPMEZCUTNSQ096dEZRVVZGTEZsQlFWa3NSVUZCUlN4SlFVRkpPMEZCUTNCQ0xFVkJRVVVzVjBGQlZ5eEZRVUZGTEVsQlFVazdPME5CUld4Q0xFTkJRVU1zUTBGQlF5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJaWQxYzJVZ2MzUnlhV04wSnp0Y2JseHVkbUZ5SUd0bGVVMXBjbkp2Y2lBOUlISmxjWFZwY21Vb0ozSmxZV04wTDJ4cFlpOXJaWGxOYVhKeWIzSW5LVHRjYmx4dUx5b3FYRzRnS2lCQlkzUnBiMjRnZEhsd1pTQmpiMjV6ZEdGdWRITXVJRk5vYjNWc1pDQm1iMnhzYjNjZ2RHaGxJR1p2Y20xaGREcGNiaUFxSUR4UFFrcEZRMVFnUVV4SlFWTStYenhXUlZKQ1BseHVJQ3BjYmlBcUlFWnZjaUJsZUdGdGNHeGxMQ0JoYmlCaFkzUnBiMjRnWm05eUlHWmxkR05vYVc1bklHRWdjM0JsWTJsbWFXTWdYQ0pKZEdWdFhDSWdiMkpxWldOME9seHVJQ29nU1ZSRlRWOUhSVlJjYmlBcVhHNGdLaUJKWmlCNWIzVW5jbVVnZFhOcGJtY2dkR2hsSUVOU1ZVUWdRV04wYVc5dUlHRnVaQ0JUZEc5eVpTQmlZWE5sSUdOc1lYTnpaWE1nZEdobElIWmxjbUp6SUcxMWMzUWdZbVVnZEdobElHWnZiR3h2ZDJsdVp6cGNiaUFxSUVkRlZFRk1UQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4TFNCU1pYUnlhV1YyYVc1bklHRWdiR2x6ZENCdlppQnZZbXBsWTNSekxpQW9aUzVuTGlCSFJWUWdMMmwwWlcxektWeHVJQ29nUjBWVVQwNUZJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHd0SUVkbGRDQmhJSE5wYm1kc1pTQnZZbXBsWTNRZ0tHVXVaeTRnUjBWVUlDOXBkR1Z0Y3k4NmFXUXBYRzRnS2lCUVQxTlVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEMwZ1EzSmxZWFJwYm1jZ1lXNGdiMkpxWldOMExpQW9aUzVuTGlCUVQxTlVJQzlwZEdWdGN5bGNiaUFxSUZCVlZDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4TFNCVmNHUmhkR1VnWVc0Z1pYaHBjM1JwYm1jZ2IySnFaV04wTGlBb1pTNW5MaUJRVlZRZ0wybDBaVzF6THpwcFpDbGNiaUFxSUVSRlRFVlVSU0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4TFNCRVpXeGxkR2x1WnlCaGJpQnZZbXBsWTNRdUlDaGxMbWN1SUVSRlRFVlVSU0F2YVhSbGJYTXZPbWxrS1Z4dUlDcGNiaUFxSUZOdmJXVWdZV04wYVc5dWN5QjBlWEJsY3lCdFlYa2dibTkwSUdoaGRtVWdZU0J5WldObGFYWmxjaXdnZDJocFkyZ2dhWE1nVDBzdUlGUm9aU0J5WlhOMWJIUWdiMllnVUU5VFZDd2dVRlZVTENCaGJtUWdSRVZNUlZSRklHRmpkR2x2Ym5OY2JpQXFJRzFoZVNCbGJuUmxjaUJpWVdOcklHbHVkRzhnZEdobElITjVjM1JsYlNCMGFISnZkV2RvSUhOMVluTmpjbWx3ZEdsdmJuTWdjbUYwYUdWeUlIUm9ZVzRnYVc0Z2NtVnpjRzl1YzJVZ2RHOGdRVkJKSUhKbGNYVmxjM1J6TGx4dUlDb3ZYRzVjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnYTJWNVRXbHljbTl5S0h0Y2JseHVJQ0F2THlCcGRHVnRJR0ZqZEdsdmJuTmNiaUFnU1ZSRlRWOUhSVlJCVEV3NklHNTFiR3dzWEc0Z0lFbFVSVTFmUjBWVVQwNUZPaUJ1ZFd4c0xGeHVJQ0JKVkVWTlgxQlBVMVE2SUc1MWJHd3NYRzRnSUVsVVJVMWZVRlZVT2lCdWRXeHNMRnh1SUNCSlZFVk5YMFJGVEVWVVJUb2diblZzYkN4Y2JseHVJQ0F2THlCelpYSjJaWEowYVcxbElHRmpkR2x2Ym5OY2JpQWdVMFZTVmtWU1ZFbE5SVjlIUlZRNklHNTFiR3dzWEc0Z0lGTkZVbFpGVWxSSlRVVmZVRlZVT2lCdWRXeHNMRnh1WEc0Z0lDOHZJRzkyWlhKc1lYa2dZV04wYVc5dWMxeHVJQ0JQVmtWU1RFRlpYMUJWVTBnNklHNTFiR3dzWEc0Z0lFOVdSVkpNUVZsZlVFOVFPaUJ1ZFd4c0xGeHVYRzU5S1R0Y2JpSmRmUT09IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIga2V5TWlycm9yID0gcmVxdWlyZSgncmVhY3QvbGliL2tleU1pcnJvcicpO1xuXG4vKipcbiAgKiBTdG9yZSBlbnRpdGllcyBuZWVkIHRoZSBjb25jZXB0IG9mIFwibmV3XCIsIFwiZGlydHlcIiwgXCJkZWxldGVkXCIgKGkuZS4gaXNOZXcsIGlzRGlydHksIGlzRGVsZXRlKSB3aGljaFxuICAqIHdoZW4gY29tYmluZWQgd2l0aCBzdGF0ZSAoc3luY2VkLCByZXF1ZXN0LCBlcnJvcmVkKSBwcm92aWRlcyBjb21wb25lbnRzIGdvb2QgZGV0YWlsIG9uIGhvdyB0b1xuICAqIHJlbmRlclxuICAqXG4gICovXG5cbm1vZHVsZS5leHBvcnRzID0ga2V5TWlycm9yKHtcblxuICAvKiBlbnRpdHkgc3RhdGVzICovXG4gIFNZTkNFRDogbnVsbCwgICAgIC8vIGVudGl0eSBpcyBpbiBzeW5jIHdpdGggYmFja2VuZFxuICBMT0FESU5HOiBudWxsLCAgICAvLyBlbnRpdHkgaXMgaW4tcHJvY2VzcyBvZiBiZWluZyBmZXRjaGVkIGZyb20gYmFja2VuZCAoaW1wbGllcyBHRVQpXG4gIE5FVzogbnVsbCwgICAgICAgIC8vIGVudGl0eSBpcyBuZXcgYW5kIGluLXByb2Nlc3Mgb2Ygc3luY2luZyB3aXRoIGJhY2tlbmRcbiAgU0FWSU5HOiBudWxsLCAgICAgLy8gZW50aXR5IGlzIGRpcnR5IGFuZCBpbi1wcm9jZXNzIG9mIHN5bmNpbmcgd2l0aCBiYWNrZW5kXG4gIERFTEVUSU5HOiBudWxsLCAgIC8vIGVudGl0eSBoYXMgYmVlbiBkZWxldGVkIGFuZCBpbi1wcm9jZXNzIG9mIHN5bmNpbmcgd2l0aCBiYWNrZW5kXG4gIEVSUk9SRUQ6IG51bGwgICAgIC8vIGVudGl0eSBpcyBpbiBhbiBlcnJvciBzdGF0ZSBhbmQgcG90ZW50aWFsbHkgb3V0LW9mLXN5bmMgd2l0aCBzZXJ2ZXJcblxufSk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaUwxVnpaWEp6TDJoaWRYSnliM2R6TDJSbGRpOW9aWEp2YTNVdmNtVmhZM1F0Wm14MWVDMXpkR0Z5ZEdWeUwzQjFZbXhwWXk5cVlYWmhjMk55YVhCMGN5OWpiMjV6ZEdGdWRITXZjM1JoZEdWekxtcHpJaXdpYzI5MWNtTmxjeUk2V3lJdlZYTmxjbk12YUdKMWNuSnZkM012WkdWMkwyaGxjbTlyZFM5eVpXRmpkQzFtYkhWNExYTjBZWEowWlhJdmNIVmliR2xqTDJwaGRtRnpZM0pwY0hSekwyTnZibk4wWVc1MGN5OXpkR0YwWlhNdWFuTWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklrRkJRVUVzV1VGQldTeERRVUZET3p0QlFVVmlMRWxCUVVrc1UwRkJVeXhIUVVGSExFOUJRVThzUTBGQlF5eHhRa0ZCY1VJc1EwRkJReXhEUVVGRE96dEJRVVV2UXp0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFTeEpRVUZKT3p0QlFVVktMRTFCUVUwc1EwRkJReXhQUVVGUExFZEJRVWNzVTBGQlV5eERRVUZETzBGQlF6TkNPenRGUVVWRkxFMUJRVTBzUlVGQlJTeEpRVUZKTzBWQlExb3NUMEZCVHl4RlFVRkZMRWxCUVVrN1JVRkRZaXhIUVVGSExFVkJRVVVzU1VGQlNUdEZRVU5VTEUxQlFVMHNSVUZCUlN4SlFVRkpPMFZCUTFvc1VVRkJVU3hGUVVGRkxFbEJRVWs3UVVGRGFFSXNSVUZCUlN4UFFVRlBMRVZCUVVVc1NVRkJTVHM3UTBGRlpDeERRVUZETEVOQlFVTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUluZFhObElITjBjbWxqZENjN1hHNWNiblpoY2lCclpYbE5hWEp5YjNJZ1BTQnlaWEYxYVhKbEtDZHlaV0ZqZEM5c2FXSXZhMlY1VFdseWNtOXlKeWs3WEc1Y2JpOHFLbHh1SUNBcUlGTjBiM0psSUdWdWRHbDBhV1Z6SUc1bFpXUWdkR2hsSUdOdmJtTmxjSFFnYjJZZ1hDSnVaWGRjSWl3Z1hDSmthWEowZVZ3aUxDQmNJbVJsYkdWMFpXUmNJaUFvYVM1bExpQnBjMDVsZHl3Z2FYTkVhWEowZVN3Z2FYTkVaV3hsZEdVcElIZG9hV05vWEc0Z0lDb2dkMmhsYmlCamIyMWlhVzVsWkNCM2FYUm9JSE4wWVhSbElDaHplVzVqWldRc0lISmxjWFZsYzNRc0lHVnljbTl5WldRcElIQnliM1pwWkdWeklHTnZiWEJ2Ym1WdWRITWdaMjl2WkNCa1pYUmhhV3dnYjI0Z2FHOTNJSFJ2WEc0Z0lDb2djbVZ1WkdWeVhHNGdJQ3BjYmlBZ0tpOWNibHh1Ylc5a2RXeGxMbVY0Y0c5eWRITWdQU0JyWlhsTmFYSnliM0lvZTF4dVhHNGdJQzhxSUdWdWRHbDBlU0J6ZEdGMFpYTWdLaTljYmlBZ1UxbE9RMFZFT2lCdWRXeHNMQ0FnSUNBZ0x5OGdaVzUwYVhSNUlHbHpJR2x1SUhONWJtTWdkMmwwYUNCaVlXTnJaVzVrWEc0Z0lFeFBRVVJKVGtjNklHNTFiR3dzSUNBZ0lDOHZJR1Z1ZEdsMGVTQnBjeUJwYmkxd2NtOWpaWE56SUc5bUlHSmxhVzVuSUdabGRHTm9aV1FnWm5KdmJTQmlZV05yWlc1a0lDaHBiWEJzYVdWeklFZEZWQ2xjYmlBZ1RrVlhPaUJ1ZFd4c0xDQWdJQ0FnSUNBZ0x5OGdaVzUwYVhSNUlHbHpJRzVsZHlCaGJtUWdhVzR0Y0hKdlkyVnpjeUJ2WmlCemVXNWphVzVuSUhkcGRHZ2dZbUZqYTJWdVpGeHVJQ0JUUVZaSlRrYzZJRzUxYkd3c0lDQWdJQ0F2THlCbGJuUnBkSGtnYVhNZ1pHbHlkSGtnWVc1a0lHbHVMWEJ5YjJObGMzTWdiMllnYzNsdVkybHVaeUIzYVhSb0lHSmhZMnRsYm1SY2JpQWdSRVZNUlZSSlRrYzZJRzUxYkd3c0lDQWdMeThnWlc1MGFYUjVJR2hoY3lCaVpXVnVJR1JsYkdWMFpXUWdZVzVrSUdsdUxYQnliMk5sYzNNZ2IyWWdjM2x1WTJsdVp5QjNhWFJvSUdKaFkydGxibVJjYmlBZ1JWSlNUMUpGUkRvZ2JuVnNiQ0FnSUNBZ0x5OGdaVzUwYVhSNUlHbHpJR2x1SUdGdUlHVnljbTl5SUhOMFlYUmxJR0Z1WkNCd2IzUmxiblJwWVd4c2VTQnZkWFF0YjJZdGMzbHVZeUIzYVhSb0lITmxjblpsY2x4dVhHNTlLVHRjYmlKZGZRPT0iLCIndXNlIHN0cmljdCc7XG5cbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG52YXIgRGlzcGF0Y2hlciA9IHJlcXVpcmUoJy4vdmVuZG9yL2ZsdXgvRGlzcGF0Y2hlcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IF8uZXh0ZW5kKG5ldyBEaXNwYXRjaGVyKCksIHtcblxuICAvKipcbiAgICogQSBicmlkZ2UgZnVuY3Rpb24gYmV0d2VlbiB0aGUgdmlld3MgYW5kIHRoZSBkaXNwYXRjaGVyLCBtYXJraW5nIHRoZSBhY3Rpb25cbiAgICogYXMgYSB2aWV3IGFjdGlvbi5cbiAgICogQHBhcmFtICB7b2JqZWN0fSBhY3Rpb24gVGhlIGRhdGEgY29taW5nIGZyb20gdGhlIHZpZXcuXG4gICAqL1xuICBoYW5kbGVWaWV3QWN0aW9uOiBmdW5jdGlvbihhY3Rpb24pIHtcbiAgICB0aGlzLmRpc3BhdGNoKHtcbiAgICAgIHNvdXJjZTogJ1ZJRVdfQUNUSU9OJyxcbiAgICAgIGFjdGlvbjogYWN0aW9uXG4gICAgfSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEEgYnJpZGdlIGZ1bmN0aW9uIGJldHdlZW4gdGhlIHNlcnZlciBhbmQgdGhlIGRpc3BhdGNoZXIsIG1hcmtpbmcgdGhlIGFjdGlvblxuICAgKiBhcyBhIHNlcnZlciBhY3Rpb24uXG4gICAqIEBwYXJhbSAge29iamVjdH0gYWN0aW9uIFRoZSBkYXRhIGNvbWluZyBmcm9tIHRoZSB2aWV3LlxuICAgKi9cbiAgaGFuZGxlU2VydmVyQWN0aW9uOiBmdW5jdGlvbihhY3Rpb24pIHtcbiAgICB0aGlzLmRpc3BhdGNoKHtcbiAgICAgIHNvdXJjZTogJ1NFUlZFUl9BQ1RJT04nLFxuICAgICAgYWN0aW9uOiBhY3Rpb25cbiAgICB9KTtcbiAgfVxuXG59KTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pTDFWelpYSnpMMmhpZFhKeWIzZHpMMlJsZGk5b1pYSnZhM1V2Y21WaFkzUXRabXgxZUMxemRHRnlkR1Z5TDNCMVlteHBZeTlxWVhaaGMyTnlhWEIwY3k5a2FYTndZWFJqYUdWeUxtcHpJaXdpYzI5MWNtTmxjeUk2V3lJdlZYTmxjbk12YUdKMWNuSnZkM012WkdWMkwyaGxjbTlyZFM5eVpXRmpkQzFtYkhWNExYTjBZWEowWlhJdmNIVmliR2xqTDJwaGRtRnpZM0pwY0hSekwyUnBjM0JoZEdOb1pYSXVhbk1pWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJa0ZCUVVFc1dVRkJXU3hEUVVGRE96dEJRVVZpTEVsQlFVa3NRMEZCUXl4SFFVRkhMRTlCUVU4c1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGQlF6dEJRVU14UWl4SlFVRkpMRlZCUVZVc1IwRkJSeXhQUVVGUExFTkJRVU1zTUVKQlFUQkNMRU5CUVVNc1EwRkJRenM3UVVGRmNrUXNUVUZCVFN4RFFVRkRMRTlCUVU4c1IwRkJSeXhEUVVGRExFTkJRVU1zVFVGQlRTeERRVUZETEVsQlFVa3NWVUZCVlN4RlFVRkZMRVZCUVVVN1FVRkROVU03UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1JVRkZSU3huUWtGQlowSXNSVUZCUlN4VFFVRlRMRTFCUVUwc1JVRkJSVHRKUVVOcVF5eEpRVUZKTEVOQlFVTXNVVUZCVVN4RFFVRkRPMDFCUTFvc1RVRkJUU3hGUVVGRkxHRkJRV0U3VFVGRGNrSXNUVUZCVFN4RlFVRkZMRTFCUVUwN1MwRkRaaXhEUVVGRExFTkJRVU03UVVGRFVDeEhRVUZITzBGQlEwZzdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UlVGRlJTeHJRa0ZCYTBJc1JVRkJSU3hUUVVGVExFMUJRVTBzUlVGQlJUdEpRVU51UXl4SlFVRkpMRU5CUVVNc1VVRkJVU3hEUVVGRE8wMUJRMW9zVFVGQlRTeEZRVUZGTEdWQlFXVTdUVUZEZGtJc1RVRkJUU3hGUVVGRkxFMUJRVTA3UzBGRFppeERRVUZETEVOQlFVTTdRVUZEVUN4SFFVRkhPenREUVVWR0xFTkJRVU1zUTBGQlF5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJaWQxYzJVZ2MzUnlhV04wSnp0Y2JseHVkbUZ5SUY4Z1BTQnlaWEYxYVhKbEtDZHNiMlJoYzJnbktUdGNiblpoY2lCRWFYTndZWFJqYUdWeUlEMGdjbVZ4ZFdseVpTZ25MaTkyWlc1a2IzSXZabXgxZUM5RWFYTndZWFJqYUdWeUp5azdYRzVjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnWHk1bGVIUmxibVFvYm1WM0lFUnBjM0JoZEdOb1pYSW9LU3dnZTF4dVhHNGdJQzhxS2x4dUlDQWdLaUJCSUdKeWFXUm5aU0JtZFc1amRHbHZiaUJpWlhSM1pXVnVJSFJvWlNCMmFXVjNjeUJoYm1RZ2RHaGxJR1JwYzNCaGRHTm9aWElzSUcxaGNtdHBibWNnZEdobElHRmpkR2x2Ymx4dUlDQWdLaUJoY3lCaElIWnBaWGNnWVdOMGFXOXVMbHh1SUNBZ0tpQkFjR0Z5WVcwZ0lIdHZZbXBsWTNSOUlHRmpkR2x2YmlCVWFHVWdaR0YwWVNCamIyMXBibWNnWm5KdmJTQjBhR1VnZG1sbGR5NWNiaUFnSUNvdlhHNGdJR2hoYm1Sc1pWWnBaWGRCWTNScGIyNDZJR1oxYm1OMGFXOXVLR0ZqZEdsdmJpa2dlMXh1SUNBZ0lIUm9hWE11WkdsemNHRjBZMmdvZTF4dUlDQWdJQ0FnYzI5MWNtTmxPaUFuVmtsRlYxOUJRMVJKVDA0bkxGeHVJQ0FnSUNBZ1lXTjBhVzl1T2lCaFkzUnBiMjVjYmlBZ0lDQjlLVHRjYmlBZ2ZTeGNibHh1SUNBdktpcGNiaUFnSUNvZ1FTQmljbWxrWjJVZ1puVnVZM1JwYjI0Z1ltVjBkMlZsYmlCMGFHVWdjMlZ5ZG1WeUlHRnVaQ0IwYUdVZ1pHbHpjR0YwWTJobGNpd2diV0Z5YTJsdVp5QjBhR1VnWVdOMGFXOXVYRzRnSUNBcUlHRnpJR0VnYzJWeWRtVnlJR0ZqZEdsdmJpNWNiaUFnSUNvZ1FIQmhjbUZ0SUNCN2IySnFaV04wZlNCaFkzUnBiMjRnVkdobElHUmhkR0VnWTI5dGFXNW5JR1p5YjIwZ2RHaGxJSFpwWlhjdVhHNGdJQ0FxTDF4dUlDQm9ZVzVrYkdWVFpYSjJaWEpCWTNScGIyNDZJR1oxYm1OMGFXOXVLR0ZqZEdsdmJpa2dlMXh1SUNBZ0lIUm9hWE11WkdsemNHRjBZMmdvZTF4dUlDQWdJQ0FnYzI5MWNtTmxPaUFuVTBWU1ZrVlNYMEZEVkVsUFRpY3NYRzRnSUNBZ0lDQmhZM1JwYjI0NklHRmpkR2x2Ymx4dUlDQWdJSDBwTzF4dUlDQjlYRzVjYm4wcE8xeHVJbDE5IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuXG52YXIgT3ZlcmxheXMgPSByZXF1aXJlKCcuLi9hY3Rpb25zL292ZXJsYXlzJyk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgIHZhciAkbm9kZSA9ICQodGhpcy5nZXRET01Ob2RlKCkpO1xuXG4gICAgJG5vZGUub24oJ3Nob3duLmJzLm1vZGFsJywgdGhpcy5faGFuZGxlTW9kYWxTaG93bik7XG4gICAgJG5vZGUub24oJ2hpZGRlbi5icy5tb2RhbCcsIHRoaXMuX2hhbmRsZU1vZGFsSGlkZGVuKTtcbiAgICAkKGRvY3VtZW50KS5vbigna2V5dXAnLCB0aGlzLl9oYW5kbGVLZXlVcCk7XG5cbiAgICAkbm9kZS5tb2RhbCh7YmFja2Ryb3A6ICdzdGF0aWMnLCBrZXlib2FyZDogdHJ1ZX0pO1xuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbigpIHtcbiAgICB2YXIgJG5vZGUgPSAkKHRoaXMuZ2V0RE9NTm9kZSgpKTtcbiAgICAkbm9kZS5vZmYoJ2hpZGRlbi5icy5tb2RhbCcsIHRoaXMuX2hhbmRsZU1vZGFsSGlkZGVuKTtcbiAgICAkbm9kZS5vZmYoJ2hpZGRlbi5icy5tb2RhbCcsIHRoaXMuX2hhbmRsZU1vZGFsU2hvd24pO1xuICAgICQoZG9jdW1lbnQpLm9mZigna2V5dXAnLCB0aGlzLl9oYW5kbGVLZXlVcCk7XG4gIH0sXG5cbiAgaGlkZU1vZGFsOiBmdW5jdGlvbiAoKSB7XG4gICAgJCh0aGlzLmdldERPTU5vZGUoKSkubW9kYWwoJ2hpZGUnKTtcbiAgfSxcblxuICBfaGFuZGxlTW9kYWxTaG93bjogZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLmhhbmRsZU1vZGFsU2hvd24pIHtcbiAgICAgIHRoaXMuaGFuZGxlTW9kYWxTaG93bigpO1xuICAgIH1cbiAgfSxcblxuICBfaGFuZGxlTW9kYWxIaWRkZW46IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLmhhbmRsZU1vZGFsSGlkZGVuKSB7XG4gICAgICB0aGlzLmhhbmRsZU1vZGFsSGlkZGVuKCk7XG4gICAgfVxuICAgIE92ZXJsYXlzLnBvcCgpO1xuICB9LFxuXG4gIF9oYW5kbGVLZXlVcDogZnVuY3Rpb24gKGUpIHtcbiAgICBpZiAoZS5rZXlDb2RlID09PSAyNykge1xuICAgICAgdGhpcy5oaWRlTW9kYWwoKTtcbiAgICB9XG4gIH1cbn07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaUwxVnpaWEp6TDJoaWRYSnliM2R6TDJSbGRpOW9aWEp2YTNVdmNtVmhZM1F0Wm14MWVDMXpkR0Z5ZEdWeUwzQjFZbXhwWXk5cVlYWmhjMk55YVhCMGN5OXRhWGhwYm5NdmIzWmxjbXhoZVM1cWN5SXNJbk52ZFhKalpYTWlPbHNpTDFWelpYSnpMMmhpZFhKeWIzZHpMMlJsZGk5b1pYSnZhM1V2Y21WaFkzUXRabXgxZUMxemRHRnlkR1Z5TDNCMVlteHBZeTlxWVhaaGMyTnlhWEIwY3k5dGFYaHBibk12YjNabGNteGhlUzVxY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pUVVGQlFTeFpRVUZaTEVOQlFVTTdPMEZCUldJc1NVRkJTU3hEUVVGRExFZEJRVWNzVDBGQlR5eERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRPenRCUVVVeFFpeEpRVUZKTEZGQlFWRXNSMEZCUnl4UFFVRlBMRU5CUVVNc2NVSkJRWEZDTEVOQlFVTXNRMEZCUXp0QlFVTTVRenM3UVVGRlFTeE5RVUZOTEVOQlFVTXNUMEZCVHl4SFFVRkhPenRGUVVWbUxHbENRVUZwUWl4RlFVRkZMRmRCUVZjN1FVRkRhRU1zU1VGQlNTeEpRVUZKTEV0QlFVc3NSMEZCUnl4RFFVRkRMRU5CUVVNc1NVRkJTU3hEUVVGRExGVkJRVlVzUlVGQlJTeERRVUZETEVOQlFVTTdPMGxCUldwRExFdEJRVXNzUTBGQlF5eEZRVUZGTEVOQlFVTXNaMEpCUVdkQ0xFVkJRVVVzU1VGQlNTeERRVUZETEdsQ1FVRnBRaXhEUVVGRExFTkJRVU03U1VGRGJrUXNTMEZCU3l4RFFVRkRMRVZCUVVVc1EwRkJReXhwUWtGQmFVSXNSVUZCUlN4SlFVRkpMRU5CUVVNc2EwSkJRV3RDTEVOQlFVTXNRMEZCUXp0QlFVTjZSQ3hKUVVGSkxFTkJRVU1zUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZCUXl4RlFVRkZMRU5CUVVNc1QwRkJUeXhGUVVGRkxFbEJRVWtzUTBGQlF5eFpRVUZaTEVOQlFVTXNRMEZCUXpzN1NVRkZNME1zUzBGQlN5eERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRMRkZCUVZFc1JVRkJSU3hSUVVGUkxFVkJRVVVzVVVGQlVTeEZRVUZGTEVsQlFVa3NRMEZCUXl4RFFVRkRMRU5CUVVNN1FVRkRkRVFzUjBGQlJ6czdSVUZGUkN4dlFrRkJiMElzUlVGQlJTeFhRVUZYTzBsQlF5OUNMRWxCUVVrc1MwRkJTeXhIUVVGSExFTkJRVU1zUTBGQlF5eEpRVUZKTEVOQlFVTXNWVUZCVlN4RlFVRkZMRU5CUVVNc1EwRkJRenRKUVVOcVF5eExRVUZMTEVOQlFVTXNSMEZCUnl4RFFVRkRMR2xDUVVGcFFpeEZRVUZGTEVsQlFVa3NRMEZCUXl4clFrRkJhMElzUTBGQlF5eERRVUZETzBsQlEzUkVMRXRCUVVzc1EwRkJReXhIUVVGSExFTkJRVU1zYVVKQlFXbENMRVZCUVVVc1NVRkJTU3hEUVVGRExHbENRVUZwUWl4RFFVRkRMRU5CUVVNN1NVRkRja1FzUTBGQlF5eERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRMRWRCUVVjc1EwRkJReXhQUVVGUExFVkJRVVVzU1VGQlNTeERRVUZETEZsQlFWa3NRMEZCUXl4RFFVRkRPMEZCUTJoRUxFZEJRVWM3TzBWQlJVUXNVMEZCVXl4RlFVRkZMRmxCUVZrN1NVRkRja0lzUTBGQlF5eERRVUZETEVsQlFVa3NRMEZCUXl4VlFVRlZMRVZCUVVVc1EwRkJReXhEUVVGRExFdEJRVXNzUTBGQlF5eE5RVUZOTEVOQlFVTXNRMEZCUXp0QlFVTjJReXhIUVVGSE96dEZRVVZFTEdsQ1FVRnBRaXhGUVVGRkxGbEJRVms3U1VGRE4wSXNTVUZCU1N4SlFVRkpMRU5CUVVNc1owSkJRV2RDTEVWQlFVVTdUVUZEZWtJc1NVRkJTU3hEUVVGRExHZENRVUZuUWl4RlFVRkZMRU5CUVVNN1MwRkRla0k3UVVGRFRDeEhRVUZIT3p0RlFVVkVMR3RDUVVGclFpeEZRVUZGTEZkQlFWYzdTVUZETjBJc1NVRkJTU3hKUVVGSkxFTkJRVU1zYVVKQlFXbENMRVZCUVVVN1RVRkRNVUlzU1VGQlNTeERRVUZETEdsQ1FVRnBRaXhGUVVGRkxFTkJRVU03UzBGRE1VSTdTVUZEUkN4UlFVRlJMRU5CUVVNc1IwRkJSeXhGUVVGRkxFTkJRVU03UVVGRGJrSXNSMEZCUnpzN1JVRkZSQ3haUVVGWkxFVkJRVVVzVlVGQlZTeERRVUZETEVWQlFVVTdTVUZEZWtJc1NVRkJTU3hEUVVGRExFTkJRVU1zVDBGQlR5eExRVUZMTEVWQlFVVXNSVUZCUlR0TlFVTndRaXhKUVVGSkxFTkJRVU1zVTBGQlV5eEZRVUZGTEVOQlFVTTdTMEZEYkVJN1IwRkRSanREUVVOR0xFTkJRVU1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lJbmRYTmxJSE4wY21samRDYzdYRzVjYm5aaGNpQWtJRDBnY21WeGRXbHlaU2duYW5GMVpYSjVKeWs3WEc1Y2JuWmhjaUJQZG1WeWJHRjVjeUE5SUhKbGNYVnBjbVVvSnk0dUwyRmpkR2x2Ym5NdmIzWmxjbXhoZVhNbktUdGNibHh1WEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUh0Y2JseHVJQ0JqYjIxd2IyNWxiblJFYVdSTmIzVnVkRG9nWm5WdVkzUnBiMjRvS1NCN1hHNGdJQ0FnZG1GeUlDUnViMlJsSUQwZ0pDaDBhR2x6TG1kbGRFUlBUVTV2WkdVb0tTazdYRzVjYmlBZ0lDQWtibTlrWlM1dmJpZ25jMmh2ZDI0dVluTXViVzlrWVd3bkxDQjBhR2x6TGw5b1lXNWtiR1ZOYjJSaGJGTm9iM2R1S1R0Y2JpQWdJQ0FrYm05a1pTNXZiaWduYUdsa1pHVnVMbUp6TG0xdlpHRnNKeXdnZEdocGN5NWZhR0Z1Wkd4bFRXOWtZV3hJYVdSa1pXNHBPMXh1SUNBZ0lDUW9aRzlqZFcxbGJuUXBMbTl1S0NkclpYbDFjQ2NzSUhSb2FYTXVYMmhoYm1Sc1pVdGxlVlZ3S1R0Y2JseHVJQ0FnSUNSdWIyUmxMbTF2WkdGc0tIdGlZV05yWkhKdmNEb2dKM04wWVhScFl5Y3NJR3RsZVdKdllYSmtPaUIwY25WbGZTazdYRzRnSUgwc1hHNWNiaUFnWTI5dGNHOXVaVzUwVjJsc2JGVnViVzkxYm5RNklHWjFibU4wYVc5dUtDa2dlMXh1SUNBZ0lIWmhjaUFrYm05a1pTQTlJQ1FvZEdocGN5NW5aWFJFVDAxT2IyUmxLQ2twTzF4dUlDQWdJQ1J1YjJSbExtOW1aaWduYUdsa1pHVnVMbUp6TG0xdlpHRnNKeXdnZEdocGN5NWZhR0Z1Wkd4bFRXOWtZV3hJYVdSa1pXNHBPMXh1SUNBZ0lDUnViMlJsTG05bVppZ25hR2xrWkdWdUxtSnpMbTF2WkdGc0p5d2dkR2hwY3k1ZmFHRnVaR3hsVFc5a1lXeFRhRzkzYmlrN1hHNGdJQ0FnSkNoa2IyTjFiV1Z1ZENrdWIyWm1LQ2RyWlhsMWNDY3NJSFJvYVhNdVgyaGhibVJzWlV0bGVWVndLVHRjYmlBZ2ZTeGNibHh1SUNCb2FXUmxUVzlrWVd3NklHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQWtLSFJvYVhNdVoyVjBSRTlOVG05a1pTZ3BLUzV0YjJSaGJDZ25hR2xrWlNjcE8xeHVJQ0I5TEZ4dVhHNGdJRjlvWVc1a2JHVk5iMlJoYkZOb2IzZHVPaUJtZFc1amRHbHZiaUFvS1NCN1hHNGdJQ0FnYVdZZ0tIUm9hWE11YUdGdVpHeGxUVzlrWVd4VGFHOTNiaWtnZTF4dUlDQWdJQ0FnZEdocGN5NW9ZVzVrYkdWTmIyUmhiRk5vYjNkdUtDazdYRzRnSUNBZ2ZWeHVJQ0I5TEZ4dVhHNGdJRjlvWVc1a2JHVk5iMlJoYkVocFpHUmxiam9nWm5WdVkzUnBiMjRvS1NCN1hHNGdJQ0FnYVdZZ0tIUm9hWE11YUdGdVpHeGxUVzlrWVd4SWFXUmtaVzRwSUh0Y2JpQWdJQ0FnSUhSb2FYTXVhR0Z1Wkd4bFRXOWtZV3hJYVdSa1pXNG9LVHRjYmlBZ0lDQjlYRzRnSUNBZ1QzWmxjbXhoZVhNdWNHOXdLQ2s3WEc0Z0lIMHNYRzVjYmlBZ1gyaGhibVJzWlV0bGVWVndPaUJtZFc1amRHbHZiaUFvWlNrZ2UxeHVJQ0FnSUdsbUlDaGxMbXRsZVVOdlpHVWdQVDA5SURJM0tTQjdYRzRnSUNBZ0lDQjBhR2x6TG1ocFpHVk5iMlJoYkNncE8xeHVJQ0FnSUgxY2JpQWdmVnh1ZlR0Y2JpSmRmUT09IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xuXG52YXIgU3RvcmVDaGFuZ2VNaXhpbiA9IGZ1bmN0aW9uKCkge1xuICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG5cbiAgcmV0dXJuIHtcblxuICAgIGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoIV8uaXNGdW5jdGlvbih0aGlzLnN0b3JlQ2hhbmdlKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1N0b3JlQ2hhbmdlTWl4aW4gcmVxdWlyZXMgc3RvcmVDaGFuZ2UgaGFuZGxlcicpO1xuICAgICAgfVxuXG4gICAgICBfLmVhY2goYXJncywgZnVuY3Rpb24oc3RvcmUpIHtcbiAgICAgICAgc3RvcmUuYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy5zdG9yZUNoYW5nZSk7XG4gICAgICB9LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgXy5lYWNoKGFyZ3MsIGZ1bmN0aW9uKHN0b3JlKSB7XG4gICAgICAgIHN0b3JlLnJlbW92ZUNoYW5nZUxpc3RlbmVyKHRoaXMuc3RvcmVDaGFuZ2UpO1xuICAgICAgfSwgdGhpcyk7XG4gICAgfVxuXG4gIH07XG59O1xuXG5TdG9yZUNoYW5nZU1peGluLmNvbXBvbmVudFdpbGxNb3VudCA9IGZ1bmN0aW9uKCkge1xuICB0aHJvdyBuZXcgRXJyb3IoXCJTdG9yZUNoYW5nZU1peGluIGlzIGEgZnVuY3Rpb24gdGhhdCB0YWtlcyBvbmUgb3IgbW9yZSBcIiArXG4gICAgXCJzdG9yZSBuYW1lcyBhcyBwYXJhbWV0ZXJzIGFuZCByZXR1cm5zIHRoZSBtaXhpbiwgZS5nLjogXCIgK1xuICAgIFwibWl4aW5zW1N0b3JlQ2hhbmdlTWl4aW4oc3RvcmUxLCBzdG9yZTIpXVwiKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU3RvcmVDaGFuZ2VNaXhpbjtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pTDFWelpYSnpMMmhpZFhKeWIzZHpMMlJsZGk5b1pYSnZhM1V2Y21WaFkzUXRabXgxZUMxemRHRnlkR1Z5TDNCMVlteHBZeTlxWVhaaGMyTnlhWEIwY3k5dGFYaHBibk12YzNSdmNtVXRZMmhoYm1kbExtcHpJaXdpYzI5MWNtTmxjeUk2V3lJdlZYTmxjbk12YUdKMWNuSnZkM012WkdWMkwyaGxjbTlyZFM5eVpXRmpkQzFtYkhWNExYTjBZWEowWlhJdmNIVmliR2xqTDJwaGRtRnpZM0pwY0hSekwyMXBlR2x1Y3k5emRHOXlaUzFqYUdGdVoyVXVhbk1pWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJa0ZCUVVFc1dVRkJXU3hEUVVGRE96dEJRVVZpTEVsQlFVa3NRMEZCUXl4SFFVRkhMRTlCUVU4c1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGQlF6czdRVUZGTVVJc1NVRkJTU3huUWtGQlowSXNSMEZCUnl4WFFVRlhPMEZCUTJ4RExFVkJRVVVzU1VGQlNTeEpRVUZKTEVkQlFVY3NTMEZCU3l4RFFVRkRMRk5CUVZNc1EwRkJReXhMUVVGTExFTkJRVU1zU1VGQlNTeERRVUZETEZOQlFWTXNRMEZCUXl4RFFVRkRPenRCUVVWdVJDeEZRVUZGTEU5QlFVODdPMGxCUlV3c2EwSkJRV3RDTEVWQlFVVXNWMEZCVnp0TlFVTTNRaXhKUVVGSkxFTkJRVU1zUTBGQlF5eERRVUZETEZWQlFWVXNRMEZCUXl4SlFVRkpMRU5CUVVNc1YwRkJWeXhEUVVGRExFVkJRVVU3VVVGRGJrTXNUVUZCVFN4SlFVRkpMRXRCUVVzc1EwRkJReXdyUTBGQkswTXNRMEZCUXl4RFFVRkRPMEZCUTNwRkxFOUJRVTg3TzAxQlJVUXNRMEZCUXl4RFFVRkRMRWxCUVVrc1EwRkJReXhKUVVGSkxFVkJRVVVzVTBGQlV5eExRVUZMTEVWQlFVVTdVVUZETTBJc1MwRkJTeXhEUVVGRExHbENRVUZwUWl4RFFVRkRMRWxCUVVrc1EwRkJReXhYUVVGWExFTkJRVU1zUTBGQlF6dFBRVU16UXl4RlFVRkZMRWxCUVVrc1EwRkJReXhEUVVGRE8wRkJRMllzUzBGQlN6czdTVUZGUkN4dlFrRkJiMElzUlVGQlJTeFhRVUZYTzAxQlF5OUNMRU5CUVVNc1EwRkJReXhKUVVGSkxFTkJRVU1zU1VGQlNTeEZRVUZGTEZOQlFWTXNTMEZCU3l4RlFVRkZPMUZCUXpOQ0xFdEJRVXNzUTBGQlF5eHZRa0ZCYjBJc1EwRkJReXhKUVVGSkxFTkJRVU1zVjBGQlZ5eERRVUZETEVOQlFVTTdUMEZET1VNc1JVRkJSU3hKUVVGSkxFTkJRVU1zUTBGQlF6dEJRVU5tTEV0QlFVczdPMGRCUlVZc1EwRkJRenRCUVVOS0xFTkJRVU1zUTBGQlF6czdRVUZGUml4blFrRkJaMElzUTBGQlF5eHJRa0ZCYTBJc1IwRkJSeXhYUVVGWE8wVkJReTlETEUxQlFVMHNTVUZCU1N4TFFVRkxMRU5CUVVNc2QwUkJRWGRFTzBsQlEzUkZMSGxFUVVGNVJEdEpRVU42UkN3d1EwRkJNRU1zUTBGQlF5eERRVUZETzBGQlEyaEVMRU5CUVVNc1EwRkJRenM3UVVGRlJpeE5RVUZOTEVOQlFVTXNUMEZCVHl4SFFVRkhMR2RDUVVGblFpeERRVUZESWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaUozVnpaU0J6ZEhKcFkzUW5PMXh1WEc1MllYSWdYeUE5SUhKbGNYVnBjbVVvSjJ4dlpHRnphQ2NwTzF4dVhHNTJZWElnVTNSdmNtVkRhR0Z1WjJWTmFYaHBiaUE5SUdaMWJtTjBhVzl1S0NrZ2UxeHVJQ0IyWVhJZ1lYSm5jeUE5SUVGeWNtRjVMbkJ5YjNSdmRIbHdaUzV6YkdsalpTNWpZV3hzS0dGeVozVnRaVzUwY3lrN1hHNWNiaUFnY21WMGRYSnVJSHRjYmx4dUlDQWdJR052YlhCdmJtVnVkRmRwYkd4TmIzVnVkRG9nWm5WdVkzUnBiMjRvS1NCN1hHNGdJQ0FnSUNCcFppQW9JVjh1YVhOR2RXNWpkR2x2YmloMGFHbHpMbk4wYjNKbFEyaGhibWRsS1NrZ2UxeHVJQ0FnSUNBZ0lDQjBhSEp2ZHlCdVpYY2dSWEp5YjNJb0oxTjBiM0psUTJoaGJtZGxUV2w0YVc0Z2NtVnhkV2x5WlhNZ2MzUnZjbVZEYUdGdVoyVWdhR0Z1Wkd4bGNpY3BPMXh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0JmTG1WaFkyZ29ZWEpuY3l3Z1puVnVZM1JwYjI0b2MzUnZjbVVwSUh0Y2JpQWdJQ0FnSUNBZ2MzUnZjbVV1WVdSa1EyaGhibWRsVEdsemRHVnVaWElvZEdocGN5NXpkRzl5WlVOb1lXNW5aU2s3WEc0Z0lDQWdJQ0I5TENCMGFHbHpLVHRjYmlBZ0lDQjlMRnh1WEc0Z0lDQWdZMjl0Y0c5dVpXNTBWMmxzYkZWdWJXOTFiblE2SUdaMWJtTjBhVzl1S0NrZ2UxeHVJQ0FnSUNBZ1h5NWxZV05vS0dGeVozTXNJR1oxYm1OMGFXOXVLSE4wYjNKbEtTQjdYRzRnSUNBZ0lDQWdJSE4wYjNKbExuSmxiVzkyWlVOb1lXNW5aVXhwYzNSbGJtVnlLSFJvYVhNdWMzUnZjbVZEYUdGdVoyVXBPMXh1SUNBZ0lDQWdmU3dnZEdocGN5azdYRzRnSUNBZ2ZWeHVYRzRnSUgwN1hHNTlPMXh1WEc1VGRHOXlaVU5vWVc1blpVMXBlR2x1TG1OdmJYQnZibVZ1ZEZkcGJHeE5iM1Z1ZENBOUlHWjFibU4wYVc5dUtDa2dlMXh1SUNCMGFISnZkeUJ1WlhjZ1JYSnliM0lvWENKVGRHOXlaVU5vWVc1blpVMXBlR2x1SUdseklHRWdablZ1WTNScGIyNGdkR2hoZENCMFlXdGxjeUJ2Ym1VZ2IzSWdiVzl5WlNCY0lpQXJYRzRnSUNBZ1hDSnpkRzl5WlNCdVlXMWxjeUJoY3lCd1lYSmhiV1YwWlhKeklHRnVaQ0J5WlhSMWNtNXpJSFJvWlNCdGFYaHBiaXdnWlM1bkxqb2dYQ0lnSzF4dUlDQWdJRndpYldsNGFXNXpXMU4wYjNKbFEyaGhibWRsVFdsNGFXNG9jM1J2Y21VeExDQnpkRzl5WlRJcFhWd2lLVHRjYm4wN1hHNWNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdVM1J2Y21WRGFHRnVaMlZOYVhocGJqdGNiaUpkZlE9PSIsIid1c2Ugc3RyaWN0JztcblxudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QvYWRkb25zJyk7XG5cbnZhciBSb3V0ZXIgPSByZXF1aXJlKCdyZWFjdC1yb3V0ZXInKSxcbiAgICBSb3V0ZSA9IFJvdXRlci5Sb3V0ZSxcbiAgICBOb3RGb3VuZFJvdXRlID0gUm91dGVyLk5vdEZvdW5kUm91dGUsXG4gICAgRGVmYXVsdFJvdXRlID0gUm91dGVyLlJvdXRlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChcblxuICBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdXRlLCB7bmFtZTogXCJyb290XCIsIHBhdGg6IFwiL1wiLCBoYW5kbGVyOiByZXF1aXJlKCcuL2NvbXBvbmVudHMvYXBwLmpzeCcpfSwgXG5cbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KERlZmF1bHRSb3V0ZSwge25hbWU6IFwiaXRlbXNcIiwgcGF0aDogXCIvXCIsIGhhbmRsZXI6IHJlcXVpcmUoJy4vY29tcG9uZW50cy9pdGVtcy5qc3gnKX0pLCBcblxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm91dGUsIHtuYW1lOiBcInNlcnZlci10aW1lXCIsIGhhbmRsZXI6IHJlcXVpcmUoJy4vY29tcG9uZW50cy9zZXJ2ZXItdGltZS5qc3gnKX0pLCBcblxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTm90Rm91bmRSb3V0ZSwge2hhbmRsZXI6IHJlcXVpcmUoJy4vY29tcG9uZW50cy9yb3V0ZS1ub3QtZm91bmQuanN4Jyl9KVxuXG4gIClcbik7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaUwxVnpaWEp6TDJoaWRYSnliM2R6TDJSbGRpOW9aWEp2YTNVdmNtVmhZM1F0Wm14MWVDMXpkR0Z5ZEdWeUwzQjFZbXhwWXk5cVlYWmhjMk55YVhCMGN5OXliM1YwWlhNdWFuTjRJaXdpYzI5MWNtTmxjeUk2V3lJdlZYTmxjbk12YUdKMWNuSnZkM012WkdWMkwyaGxjbTlyZFM5eVpXRmpkQzFtYkhWNExYTjBZWEowWlhJdmNIVmliR2xqTDJwaGRtRnpZM0pwY0hSekwzSnZkWFJsY3k1cWMzZ2lYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklrRkJRVUVzV1VGQldTeERRVUZET3p0QlFVVmlMRWxCUVVrc1MwRkJTeXhIUVVGSExFOUJRVThzUTBGQlF5eGpRVUZqTEVOQlFVTXNRMEZCUXpzN1FVRkZjRU1zU1VGQlNTeE5RVUZOTEVkQlFVY3NUMEZCVHl4RFFVRkRMR05CUVdNc1EwRkJRenRKUVVOb1F5eExRVUZMTEVkQlFVY3NUVUZCVFN4RFFVRkRMRXRCUVVzN1NVRkRjRUlzWVVGQllTeEhRVUZITEUxQlFVMHNRMEZCUXl4aFFVRmhPMEZCUTNoRExFbEJRVWtzV1VGQldTeEhRVUZITEUxQlFVMHNRMEZCUXl4TFFVRkxMRU5CUVVNN08wRkJSV2hETEUxQlFVMHNRMEZCUXl4UFFVRlBPenRCUVVWa0xFVkJRVVVzYjBKQlFVTXNTMEZCU3l4RlFVRkJMRU5CUVVFc1EwRkJReXhKUVVGQkxFVkJRVWtzUTBGQlF5eE5RVUZCTEVWQlFVMHNRMEZCUXl4SlFVRkJMRVZCUVVrc1EwRkJReXhIUVVGQkxFVkJRVWNzUTBGQlF5eFBRVUZCTEVWQlFVOHNRMEZCUlN4UFFVRlBMRU5CUVVNc2MwSkJRWE5DTEVOQlFVY3NRMEZCUVN4RlFVRkJPenRCUVVWNFJTeEpRVUZKTEc5Q1FVRkRMRmxCUVZrc1JVRkJRU3hEUVVGQkxFTkJRVU1zU1VGQlFTeEZRVUZKTEVOQlFVTXNUMEZCUVN4RlFVRlBMRU5CUVVNc1NVRkJRU3hGUVVGSkxFTkJRVU1zUjBGQlFTeEZRVUZITEVOQlFVTXNUMEZCUVN4RlFVRlBMRU5CUVVVc1QwRkJUeXhEUVVGRExIZENRVUYzUWl4RFFVRkZMRU5CUVVFc1EwRkJSeXhEUVVGQkxFVkJRVUU3TzBGQlJYUkdMRWxCUVVrc2IwSkJRVU1zUzBGQlN5eEZRVUZCTEVOQlFVRXNRMEZCUXl4SlFVRkJMRVZCUVVrc1EwRkJReXhoUVVGQkxFVkJRV0VzUTBGQlF5eFBRVUZCTEVWQlFVOHNRMEZCUlN4UFFVRlBMRU5CUVVNc09FSkJRVGhDTEVOQlFVVXNRMEZCUVN4RFFVRkhMRU5CUVVFc1JVRkJRVHM3UVVGRmJFWXNTVUZCU1N4dlFrRkJReXhoUVVGaExFVkJRVUVzUTBGQlFTeERRVUZETEU5QlFVRXNSVUZCVHl4RFFVRkZMRTlCUVU4c1EwRkJReXhyUTBGQmEwTXNRMEZCUlN4RFFVRkJMRU5CUVVjc1EwRkJRVHM3UlVGRmFrVXNRMEZCUVR0RFFVTlVMRU5CUVVNaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SW5kWE5sSUhOMGNtbGpkQ2M3WEc1Y2JuWmhjaUJTWldGamRDQTlJSEpsY1hWcGNtVW9KM0psWVdOMEwyRmtaRzl1Y3ljcE8xeHVYRzUyWVhJZ1VtOTFkR1Z5SUQwZ2NtVnhkV2x5WlNnbmNtVmhZM1F0Y205MWRHVnlKeWtzWEc0Z0lDQWdVbTkxZEdVZ1BTQlNiM1YwWlhJdVVtOTFkR1VzWEc0Z0lDQWdUbTkwUm05MWJtUlNiM1YwWlNBOUlGSnZkWFJsY2k1T2IzUkdiM1Z1WkZKdmRYUmxMRnh1SUNBZ0lFUmxabUYxYkhSU2IzVjBaU0E5SUZKdmRYUmxjaTVTYjNWMFpUdGNibHh1Ylc5a2RXeGxMbVY0Y0c5eWRITWdQU0FvWEc1Y2JpQWdQRkp2ZFhSbElHNWhiV1U5WENKeWIyOTBYQ0lnY0dGMGFEMWNJaTljSWlCb1lXNWtiR1Z5UFh0eVpYRjFhWEpsS0NjdUwyTnZiWEJ2Ym1WdWRITXZZWEJ3TG1wemVDY3BmVDVjYmx4dUlDQWdJRHhFWldaaGRXeDBVbTkxZEdVZ2JtRnRaVDFjSW1sMFpXMXpYQ0lnY0dGMGFEMWNJaTljSWlCb1lXNWtiR1Z5UFh0eVpYRjFhWEpsS0NjdUwyTnZiWEJ2Ym1WdWRITXZhWFJsYlhNdWFuTjRKeWw5SUM4K1hHNWNiaUFnSUNBOFVtOTFkR1VnYm1GdFpUMWNJbk5sY25abGNpMTBhVzFsWENJZ2FHRnVaR3hsY2oxN2NtVnhkV2x5WlNnbkxpOWpiMjF3YjI1bGJuUnpMM05sY25abGNpMTBhVzFsTG1wemVDY3BmU0F2UGx4dVhHNGdJQ0FnUEU1dmRFWnZkVzVrVW05MWRHVWdhR0Z1Wkd4bGNqMTdjbVZ4ZFdseVpTZ25MaTlqYjIxd2IyNWxiblJ6TDNKdmRYUmxMVzV2ZEMxbWIzVnVaQzVxYzNnbktYMGdMejVjYmx4dUlDQThMMUp2ZFhSbFBseHVLVHRjYmlKZGZRPT0iLCIndXNlIHN0cmljdCc7XG5cbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKFwiZXZlbnRzXCIpLkV2ZW50RW1pdHRlcjtcblxudmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcbnZhciBpbyA9IHJlcXVpcmUoJ3NvY2tldC5pby1jbGllbnQnKTtcblxudmFyIGh0dHBWZXJiUmUgPSAvXihHRVR8UFVUfFBPU1R8REVMRVRFKVxccy87XG5cblxuY2xhc3MgU3Vic2NyaXB0aW9uU2VydmljZSBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIGNvbnN0cnVjdG9yKGFjY2Vzc1Rva2VuKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuYWNjZXNzVG9rZW4gPSBhY2Nlc3NUb2tlbjtcblxuICAgIHZhciBzb2NrZXQgPSB0aGlzLnNvY2tldCA9IGlvKHt0cmFuc3BvcnRzOlsnd2Vic29ja2V0J119KTtcblxuICAgIC8vIGF0dGFjaCBoYW5kbGVyc1xuICAgIHNvY2tldC5vbignY29ubmVjdCcsIHRoaXMuaGFuZGxlQ29ubmVjdC5iaW5kKHRoaXMpKTtcbiAgICBzb2NrZXQub24oJ2Rpc2Nvbm5lY3QnLCB0aGlzLmhhbmRsZURpc2Nvbm5lY3QuYmluZCh0aGlzKSk7XG4gICAgc29ja2V0Lm9uKCdyZWNvbm5lY3QnLCB0aGlzLmhhbmRsZVJlY29ubmVjdC5iaW5kKHRoaXMpKTtcbiAgICBzb2NrZXQub24oJ3NldCcsIHRoaXMuaGFuZGxlU2V0LmJpbmQodGhpcykpO1xuXG4gICAgLy9jb25zb2xlLmxvZyhzb2NrZXQpO1xuICB9XG5cbiAgaGFuZGxlQ29ubmVjdCgpe1xuICAgIHRoaXMuc29ja2V0LmVtaXQoJ2F1dGgnLCB0aGlzLmFjY2Vzc1Rva2VuKTtcbiAgICB0aGlzLmVtaXQoJ2Nvbm5lY3QnKTtcbiAgfVxuXG4gIGhhbmRsZURpc2Nvbm5lY3QoKXtcbiAgICB0aGlzLmVtaXQoJ2Rpc2Nvbm5lY3QnKTtcbiAgfVxuXG4gIGhhbmRsZVJlY29ubmVjdCgpe1xuICAgIC8vY29uc29sZS5kZWJ1ZygncmVjb25uZWN0OyBhdHRlbXB0czogJyArIGF0dGVtcHRzKTtcbiAgICBfLmVhY2godGhpcy5fZXZlbnRzLCBmdW5jdGlvbihmbiwgY2hhbm5lbCl7XG4gICAgICAvLyBvbiByZWNvbm5lY3QgcmVtb3ZlIGFsbCBBUEkgY2hhbm5lbCBsaXN0ZW5lcnNcbiAgICAgIGlmIChodHRwVmVyYlJlLnRlc3QoY2hhbm5lbCkpIHtcbiAgICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoY2hhbm5lbCk7XG4gICAgICB9XG4gICAgfSwgdGhpcyk7XG4gICAgdGhpcy5lbWl0KCdyZWNvbm5lY3QnKTtcbiAgfVxuXG4gIGhhbmRsZVNldChkYXRhKXtcbiAgICB0aGlzLmVtaXQoZGF0YS5jaGFubmVsLCAnc2V0JywgZGF0YS5jaGFubmVsLCBKU09OLnBhcnNlKGRhdGEuZGF0YSkpO1xuICB9XG5cbiAgc3Vic2NyaWJlKGNoYW5uZWwsIGhhbmRsZXIsIG9wdGlvbnMpe1xuICAgIC8vY29uc29sZS5sb2coJ3N1YnNjcmliZScsIGFyZ3VtZW50cyk7XG5cbiAgICAvLyBvbmx5IG9uZSBzdWJzY3JpcHRpb24gcGVyIGNoYW5uZWxcbiAgICBpZiAoRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQodGhpcywgY2hhbm5lbCkgIT09IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignYXBpLXN1YnNjcmlwdGlvbjogQ2Fubm90IHN1YnNjcmliZSB0byBjaGFubmVsIFwiJyArIGNoYW5uZWwgKyAnXCIgbW9yZSB0aGFuIG9uY2UuJyk7XG4gICAgfVxuXG4gICAgb3B0aW9ucyA9IF8uZXh0ZW5kKHtcbiAgICAgIGluaXRpYWxQYXlsb2FkOiBmYWxzZSxcbiAgICAgIC8vIGRlcHJlY2F0ZWRcbiAgICAgIHJlY29ubmVjdFBheWxvYWQ6IGZhbHNlXG4gICAgfSwgb3B0aW9ucyB8fCB7fSk7XG5cbiAgICBoYW5kbGVyLl9vcHRpb25zID0gb3B0aW9ucztcblxuICAgIHRoaXMuYWRkTGlzdGVuZXIoY2hhbm5lbCwgaGFuZGxlcik7XG4gICAgdGhpcy5zb2NrZXQuZW1pdCgnc3Vic2NyaWJlJywgY2hhbm5lbCwgb3B0aW9ucy5pbml0aWFsUGF5bG9hZCk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHVuc3Vic2NyaWJlKGNoYW5uZWwsIGhhbmRsZXIpe1xuICAgIC8vY29uc29sZS5sb2coJ3Vuc3Vic2NyaWJlJywgYXJndW1lbnRzKTtcblxuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoY2hhbm5lbCwgaGFuZGxlcik7XG5cbiAgICAvLyBpZiB0aGVyZSdzIG5vIG1vcmUgaGFuZGxlcnMgZm9yIHRoaXMgY2hhbm5lbCwgdW5zdWJzY3JpYmUgZnJvbSBpdCBjb21wbGV0ZWx5XG4gICAgaWYgKEV2ZW50RW1pdHRlci5saXN0ZW5lckNvdW50KHRoaXMsIGNoYW5uZWwpID09PSAwKSB7XG4gICAgICB0aGlzLnNvY2tldC5lbWl0KCd1bnN1YnNjcmliZScsIGNoYW5uZWwpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIG5vcm1hbGl6ZUNoYW5uZWxOYW1lKGNoYW5uZWwpe1xuICAgIHJldHVybiBjaGFubmVsLnJlcGxhY2UoL14oR0VUfFBVVHxQT1NUfERFTEVURSlcXHMvLCAnJyk7XG4gIH1cblxuICBpc0Nvbm5lY3RlZCgpe1xuICAgIHJldHVybiB0aGlzLnNvY2tldC5jb25uZWN0ZWQ7XG4gIH1cblxuICBpc0Rpc2Nvbm5lY3RlZCgpe1xuICAgIHJldHVybiB0aGlzLnNvY2tldC5kaXNjb25uZWN0ZWQ7XG4gIH1cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChhY2Nlc3NUb2tlbikge1xuICByZXR1cm4gbmV3IFN1YnNjcmlwdGlvblNlcnZpY2UoYWNjZXNzVG9rZW4pO1xufTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pTDFWelpYSnpMMmhpZFhKeWIzZHpMMlJsZGk5b1pYSnZhM1V2Y21WaFkzUXRabXgxZUMxemRHRnlkR1Z5TDNCMVlteHBZeTlxWVhaaGMyTnlhWEIwY3k5elpYSjJhV05sY3k5aGNHa3RjM1ZpYzJOeWFYQjBhVzl1Y3k1cWN5SXNJbk52ZFhKalpYTWlPbHNpTDFWelpYSnpMMmhpZFhKeWIzZHpMMlJsZGk5b1pYSnZhM1V2Y21WaFkzUXRabXgxZUMxemRHRnlkR1Z5TDNCMVlteHBZeTlxWVhaaGMyTnlhWEIwY3k5elpYSjJhV05sY3k5aGNHa3RjM1ZpYzJOeWFYQjBhVzl1Y3k1cWN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaVFVRkJRU3haUVVGWkxFTkJRVU03TzBGQlJXSXNTVUZCU1N4WlFVRlpMRWRCUVVjc1QwRkJUeXhEUVVGRExGRkJRVkVzUTBGQlF5eERRVUZETEZsQlFWa3NRMEZCUXpzN1FVRkZiRVFzU1VGQlNTeERRVUZETEVkQlFVY3NUMEZCVHl4RFFVRkRMRkZCUVZFc1EwRkJReXhEUVVGRE8wRkJRekZDTEVsQlFVa3NSVUZCUlN4SFFVRkhMRTlCUVU4c1EwRkJReXhyUWtGQmEwSXNRMEZCUXl4RFFVRkRPenRCUVVWeVF5eEpRVUZKTEZWQlFWVXNSMEZCUnl3d1FrRkJNRUlzUTBGQlF6dEJRVU0xUXpzN1FVRkZRU3hOUVVGTkxHMUNRVUZ0UWl4VFFVRlRMRmxCUVZrc1EwRkJRenRGUVVNM1F5eFhRVUZYTEdOQlFXTTdRVUZETTBJc1NVRkJTU3hMUVVGTExFVkJRVVVzUTBGQlF6czdRVUZGV2l4SlFVRkpMRWxCUVVrc1EwRkJReXhYUVVGWExFZEJRVWNzVjBGQlZ5eERRVUZET3p0QlFVVnVReXhKUVVGSkxFbEJRVWtzVFVGQlRTeEhRVUZITEVsQlFVa3NRMEZCUXl4TlFVRk5MRWRCUVVjc1JVRkJSU3hEUVVGRExFTkJRVU1zVlVGQlZTeERRVUZETEVOQlFVTXNWMEZCVnl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8wRkJRemxFT3p0SlFVVkpMRTFCUVUwc1EwRkJReXhGUVVGRkxFTkJRVU1zVTBGQlV5eEZRVUZGTEVsQlFVa3NRMEZCUXl4aFFVRmhMRU5CUVVNc1NVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF5eERRVUZETEVOQlFVTTdTVUZEY0VRc1RVRkJUU3hEUVVGRExFVkJRVVVzUTBGQlF5eFpRVUZaTEVWQlFVVXNTVUZCU1N4RFFVRkRMR2RDUVVGblFpeERRVUZETEVsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJReXhEUVVGRE8wbEJRekZFTEUxQlFVMHNRMEZCUXl4RlFVRkZMRU5CUVVNc1YwRkJWeXhGUVVGRkxFbEJRVWtzUTBGQlF5eGxRVUZsTEVOQlFVTXNTVUZCU1N4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRExFTkJRVU03UVVGRE5VUXNTVUZCU1N4TlFVRk5MRU5CUVVNc1JVRkJSU3hEUVVGRExFdEJRVXNzUlVGQlJTeEpRVUZKTEVOQlFVTXNVMEZCVXl4RFFVRkRMRWxCUVVrc1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF5eERRVUZETzBGQlEyaEVPenRCUVVWQkxFZEJRVWM3TzBWQlJVUXNZVUZCWVN4RlFVRkZPMGxCUTJJc1NVRkJTU3hEUVVGRExFMUJRVTBzUTBGQlF5eEpRVUZKTEVOQlFVTXNUVUZCVFN4RlFVRkZMRWxCUVVrc1EwRkJReXhYUVVGWExFTkJRVU1zUTBGQlF6dEpRVU16UXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hEUVVGRExGTkJRVk1zUTBGQlF5eERRVUZETzBGQlEzcENMRWRCUVVjN08wVkJSVVFzWjBKQlFXZENMRVZCUVVVN1NVRkRhRUlzU1VGQlNTeERRVUZETEVsQlFVa3NRMEZCUXl4WlFVRlpMRU5CUVVNc1EwRkJRenRCUVVNMVFpeEhRVUZIT3p0QlFVVklMRVZCUVVVc1pVRkJaU3hGUVVGRk96dEJRVVZ1UWl4SlFVRkpMRU5CUVVNc1EwRkJReXhKUVVGSkxFTkJRVU1zU1VGQlNTeERRVUZETEU5QlFVOHNSVUZCUlN4VFFVRlRMRVZCUVVVc1JVRkJSU3hQUVVGUExFTkJRVU03TzAxQlJYaERMRWxCUVVrc1ZVRkJWU3hEUVVGRExFbEJRVWtzUTBGQlF5eFBRVUZQTEVOQlFVTXNSVUZCUlR0UlFVTTFRaXhKUVVGSkxFTkJRVU1zYTBKQlFXdENMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU03VDBGRGJFTTdTMEZEUml4RlFVRkZMRWxCUVVrc1EwRkJReXhEUVVGRE8wbEJRMVFzU1VGQlNTeERRVUZETEVsQlFVa3NRMEZCUXl4WFFVRlhMRU5CUVVNc1EwRkJRenRCUVVNelFpeEhRVUZIT3p0RlFVVkVMRk5CUVZNc1RVRkJUVHRKUVVOaUxFbEJRVWtzUTBGQlF5eEpRVUZKTEVOQlFVTXNTVUZCU1N4RFFVRkRMRTlCUVU4c1JVRkJSU3hMUVVGTExFVkJRVVVzU1VGQlNTeERRVUZETEU5QlFVOHNSVUZCUlN4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFbEJRVWtzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXl4RFFVRkRPMEZCUTNoRkxFZEJRVWM3TzBGQlJVZ3NSVUZCUlN4VFFVRlRMREpDUVVFeVFqdEJRVU4wUXp0QlFVTkJPenRKUVVWSkxFbEJRVWtzV1VGQldTeERRVUZETEdGQlFXRXNRMEZCUXl4SlFVRkpMRVZCUVVVc1QwRkJUeXhEUVVGRExFdEJRVXNzUTBGQlF5eEZRVUZGTzAxQlEyNUVMRTFCUVUwc1NVRkJTU3hMUVVGTExFTkJRVU1zYVVSQlFXbEVMRWRCUVVjc1QwRkJUeXhIUVVGSExHMUNRVUZ0UWl4RFFVRkRMRU5CUVVNN1FVRkRla2NzUzBGQlN6czdTVUZGUkN4UFFVRlBMRWRCUVVjc1EwRkJReXhEUVVGRExFMUJRVTBzUTBGQlF6dEJRVU4yUWl4TlFVRk5MR05CUVdNc1JVRkJSU3hMUVVGTE96dE5RVVZ5UWl4blFrRkJaMElzUlVGQlJTeExRVUZMTzBGQlF6ZENMRXRCUVVzc1JVRkJSU3hQUVVGUExFbEJRVWtzUlVGQlJTeERRVUZETEVOQlFVTTdPMEZCUlhSQ0xFbEJRVWtzVDBGQlR5eERRVUZETEZGQlFWRXNSMEZCUnl4UFFVRlBMRU5CUVVNN08wbEJSVE5DTEVsQlFVa3NRMEZCUXl4WFFVRlhMRU5CUVVNc1QwRkJUeXhGUVVGRkxFOUJRVThzUTBGQlF5eERRVUZETzBGQlEzWkRMRWxCUVVrc1NVRkJTU3hEUVVGRExFMUJRVTBzUTBGQlF5eEpRVUZKTEVOQlFVTXNWMEZCVnl4RlFVRkZMRTlCUVU4c1JVRkJSU3hQUVVGUExFTkJRVU1zWTBGQll5eERRVUZETEVOQlFVTTdPMGxCUlM5RUxFOUJRVThzU1VGQlNTeERRVUZETzBGQlEyaENMRWRCUVVjN08wRkJSVWdzUlVGQlJTeFhRVUZYTEd0Q1FVRnJRanRCUVVNdlFqczdRVUZGUVN4SlFVRkpMRWxCUVVrc1EwRkJReXhqUVVGakxFTkJRVU1zVDBGQlR5eEZRVUZGTEU5QlFVOHNRMEZCUXl4RFFVRkRPMEZCUXpGRE96dEpRVVZKTEVsQlFVa3NXVUZCV1N4RFFVRkRMR0ZCUVdFc1EwRkJReXhKUVVGSkxFVkJRVVVzVDBGQlR5eERRVUZETEV0QlFVc3NRMEZCUXl4RlFVRkZPMDFCUTI1RUxFbEJRVWtzUTBGQlF5eE5RVUZOTEVOQlFVTXNTVUZCU1N4RFFVRkRMR0ZCUVdFc1JVRkJSU3hQUVVGUExFTkJRVU1zUTBGQlF6dExRVU14UXp0SlFVTkVMRTlCUVU4c1NVRkJTU3hEUVVGRE8wRkJRMmhDTEVkQlFVYzdPMFZCUlVRc2IwSkJRVzlDTEZOQlFWTTdTVUZETTBJc1QwRkJUeXhQUVVGUExFTkJRVU1zVDBGQlR5eERRVUZETERCQ1FVRXdRaXhGUVVGRkxFVkJRVVVzUTBGQlF5eERRVUZETzBGQlF6TkVMRWRCUVVjN08wVkJSVVFzVjBGQlZ5eEZRVUZGTzBsQlExZ3NUMEZCVHl4SlFVRkpMRU5CUVVNc1RVRkJUU3hEUVVGRExGTkJRVk1zUTBGQlF6dEJRVU5xUXl4SFFVRkhPenRGUVVWRUxHTkJRV01zUlVGQlJUdEpRVU5rTEU5QlFVOHNTVUZCU1N4RFFVRkRMRTFCUVUwc1EwRkJReXhaUVVGWkxFTkJRVU03UjBGRGFrTTdRVUZEU0N4RFFVRkRPMEZCUTBRN08wRkJSVUVzVFVGQlRTeERRVUZETEU5QlFVOHNSMEZCUnl4VlFVRlZMRmRCUVZjc1JVRkJSVHRGUVVOMFF5eFBRVUZQTEVsQlFVa3NiVUpCUVcxQ0xFTkJRVU1zVjBGQlZ5eERRVUZETEVOQlFVTTdRMEZETjBNc1EwRkJReUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSWlkMWMyVWdjM1J5YVdOMEp6dGNibHh1ZG1GeUlFVjJaVzUwUlcxcGRIUmxjaUE5SUhKbGNYVnBjbVVvWENKbGRtVnVkSE5jSWlrdVJYWmxiblJGYldsMGRHVnlPMXh1WEc1MllYSWdYeUE5SUhKbGNYVnBjbVVvSjJ4dlpHRnphQ2NwTzF4dWRtRnlJR2x2SUQwZ2NtVnhkV2x5WlNnbmMyOWphMlYwTG1sdkxXTnNhV1Z1ZENjcE8xeHVYRzUyWVhJZ2FIUjBjRlpsY21KU1pTQTlJQzllS0VkRlZIeFFWVlI4VUU5VFZIeEVSVXhGVkVVcFhGeHpMenRjYmx4dVhHNWpiR0Z6Y3lCVGRXSnpZM0pwY0hScGIyNVRaWEoyYVdObElHVjRkR1Z1WkhNZ1JYWmxiblJGYldsMGRHVnlJSHRjYmlBZ1kyOXVjM1J5ZFdOMGIzSW9ZV05qWlhOelZHOXJaVzRwSUh0Y2JpQWdJQ0J6ZFhCbGNpZ3BPMXh1WEc0Z0lDQWdkR2hwY3k1aFkyTmxjM05VYjJ0bGJpQTlJR0ZqWTJWemMxUnZhMlZ1TzF4dVhHNGdJQ0FnZG1GeUlITnZZMnRsZENBOUlIUm9hWE11YzI5amEyVjBJRDBnYVc4b2UzUnlZVzV6Y0c5eWRITTZXeWQzWldKemIyTnJaWFFuWFgwcE8xeHVYRzRnSUNBZ0x5OGdZWFIwWVdOb0lHaGhibVJzWlhKelhHNGdJQ0FnYzI5amEyVjBMbTl1S0NkamIyNXVaV04wSnl3Z2RHaHBjeTVvWVc1a2JHVkRiMjV1WldOMExtSnBibVFvZEdocGN5a3BPMXh1SUNBZ0lITnZZMnRsZEM1dmJpZ25aR2x6WTI5dWJtVmpkQ2NzSUhSb2FYTXVhR0Z1Wkd4bFJHbHpZMjl1Ym1WamRDNWlhVzVrS0hSb2FYTXBLVHRjYmlBZ0lDQnpiMk5yWlhRdWIyNG9KM0psWTI5dWJtVmpkQ2NzSUhSb2FYTXVhR0Z1Wkd4bFVtVmpiMjV1WldOMExtSnBibVFvZEdocGN5a3BPMXh1SUNBZ0lITnZZMnRsZEM1dmJpZ25jMlYwSnl3Z2RHaHBjeTVvWVc1a2JHVlRaWFF1WW1sdVpDaDBhR2x6S1NrN1hHNWNiaUFnSUNBdkwyTnZibk52YkdVdWJHOW5LSE52WTJ0bGRDazdYRzRnSUgxY2JseHVJQ0JvWVc1a2JHVkRiMjV1WldOMEtDbDdYRzRnSUNBZ2RHaHBjeTV6YjJOclpYUXVaVzFwZENnbllYVjBhQ2NzSUhSb2FYTXVZV05qWlhOelZHOXJaVzRwTzF4dUlDQWdJSFJvYVhNdVpXMXBkQ2duWTI5dWJtVmpkQ2NwTzF4dUlDQjlYRzVjYmlBZ2FHRnVaR3hsUkdselkyOXVibVZqZENncGUxeHVJQ0FnSUhSb2FYTXVaVzFwZENnblpHbHpZMjl1Ym1WamRDY3BPMXh1SUNCOVhHNWNiaUFnYUdGdVpHeGxVbVZqYjI1dVpXTjBLQ2w3WEc0Z0lDQWdMeTlqYjI1emIyeGxMbVJsWW5WbktDZHlaV052Ym01bFkzUTdJR0YwZEdWdGNIUnpPaUFuSUNzZ1lYUjBaVzF3ZEhNcE8xeHVJQ0FnSUY4dVpXRmphQ2gwYUdsekxsOWxkbVZ1ZEhNc0lHWjFibU4wYVc5dUtHWnVMQ0JqYUdGdWJtVnNLWHRjYmlBZ0lDQWdJQzh2SUc5dUlISmxZMjl1Ym1WamRDQnlaVzF2ZG1VZ1lXeHNJRUZRU1NCamFHRnVibVZzSUd4cGMzUmxibVZ5YzF4dUlDQWdJQ0FnYVdZZ0tHaDBkSEJXWlhKaVVtVXVkR1Z6ZENoamFHRnVibVZzS1NrZ2UxeHVJQ0FnSUNBZ0lDQjBhR2x6TG5KbGJXOTJaVUZzYkV4cGMzUmxibVZ5Y3loamFHRnVibVZzS1R0Y2JpQWdJQ0FnSUgxY2JpQWdJQ0I5TENCMGFHbHpLVHRjYmlBZ0lDQjBhR2x6TG1WdGFYUW9KM0psWTI5dWJtVmpkQ2NwTzF4dUlDQjlYRzVjYmlBZ2FHRnVaR3hsVTJWMEtHUmhkR0VwZTF4dUlDQWdJSFJvYVhNdVpXMXBkQ2hrWVhSaExtTm9ZVzV1Wld3c0lDZHpaWFFuTENCa1lYUmhMbU5vWVc1dVpXd3NJRXBUVDA0dWNHRnljMlVvWkdGMFlTNWtZWFJoS1NrN1hHNGdJSDFjYmx4dUlDQnpkV0p6WTNKcFltVW9ZMmhoYm01bGJDd2dhR0Z1Wkd4bGNpd2diM0IwYVc5dWN5bDdYRzRnSUNBZ0x5OWpiMjV6YjJ4bExteHZaeWduYzNWaWMyTnlhV0psSnl3Z1lYSm5kVzFsYm5SektUdGNibHh1SUNBZ0lDOHZJRzl1YkhrZ2IyNWxJSE4xWW5OamNtbHdkR2x2YmlCd1pYSWdZMmhoYm01bGJGeHVJQ0FnSUdsbUlDaEZkbVZ1ZEVWdGFYUjBaWEl1YkdsemRHVnVaWEpEYjNWdWRDaDBhR2x6TENCamFHRnVibVZzS1NBaFBUMGdNQ2tnZTF4dUlDQWdJQ0FnZEdoeWIzY2dibVYzSUVWeWNtOXlLQ2RoY0drdGMzVmljMk55YVhCMGFXOXVPaUJEWVc1dWIzUWdjM1ZpYzJOeWFXSmxJSFJ2SUdOb1lXNXVaV3dnWENJbklDc2dZMmhoYm01bGJDQXJJQ2RjSWlCdGIzSmxJSFJvWVc0Z2IyNWpaUzRuS1R0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0J2Y0hScGIyNXpJRDBnWHk1bGVIUmxibVFvZTF4dUlDQWdJQ0FnYVc1cGRHbGhiRkJoZVd4dllXUTZJR1poYkhObExGeHVJQ0FnSUNBZ0x5OGdaR1Z3Y21WallYUmxaRnh1SUNBZ0lDQWdjbVZqYjI1dVpXTjBVR0Y1Ykc5aFpEb2dabUZzYzJWY2JpQWdJQ0I5TENCdmNIUnBiMjV6SUh4OElIdDlLVHRjYmx4dUlDQWdJR2hoYm1Sc1pYSXVYMjl3ZEdsdmJuTWdQU0J2Y0hScGIyNXpPMXh1WEc0Z0lDQWdkR2hwY3k1aFpHUk1hWE4wWlc1bGNpaGphR0Z1Ym1Wc0xDQm9ZVzVrYkdWeUtUdGNiaUFnSUNCMGFHbHpMbk52WTJ0bGRDNWxiV2wwS0NkemRXSnpZM0pwWW1VbkxDQmphR0Z1Ym1Wc0xDQnZjSFJwYjI1ekxtbHVhWFJwWVd4UVlYbHNiMkZrS1R0Y2JseHVJQ0FnSUhKbGRIVnliaUIwYUdsek8xeHVJQ0I5WEc1Y2JpQWdkVzV6ZFdKelkzSnBZbVVvWTJoaGJtNWxiQ3dnYUdGdVpHeGxjaWw3WEc0Z0lDQWdMeTlqYjI1emIyeGxMbXh2WnlnbmRXNXpkV0p6WTNKcFltVW5MQ0JoY21kMWJXVnVkSE1wTzF4dVhHNGdJQ0FnZEdocGN5NXlaVzF2ZG1WTWFYTjBaVzVsY2loamFHRnVibVZzTENCb1lXNWtiR1Z5S1R0Y2JseHVJQ0FnSUM4dklHbG1JSFJvWlhKbEozTWdibThnYlc5eVpTQm9ZVzVrYkdWeWN5Qm1iM0lnZEdocGN5QmphR0Z1Ym1Wc0xDQjFibk4xWW5OamNtbGlaU0JtY205dElHbDBJR052YlhCc1pYUmxiSGxjYmlBZ0lDQnBaaUFvUlhabGJuUkZiV2wwZEdWeUxteHBjM1JsYm1WeVEyOTFiblFvZEdocGN5d2dZMmhoYm01bGJDa2dQVDA5SURBcElIdGNiaUFnSUNBZ0lIUm9hWE11YzI5amEyVjBMbVZ0YVhRb0ozVnVjM1ZpYzJOeWFXSmxKeXdnWTJoaGJtNWxiQ2s3WEc0Z0lDQWdmVnh1SUNBZ0lISmxkSFZ5YmlCMGFHbHpPMXh1SUNCOVhHNWNiaUFnYm05eWJXRnNhWHBsUTJoaGJtNWxiRTVoYldVb1kyaGhibTVsYkNsN1hHNGdJQ0FnY21WMGRYSnVJR05vWVc1dVpXd3VjbVZ3YkdGalpTZ3ZYaWhIUlZSOFVGVlVmRkJQVTFSOFJFVk1SVlJGS1Z4Y2N5OHNJQ2NuS1R0Y2JpQWdmVnh1WEc0Z0lHbHpRMjl1Ym1WamRHVmtLQ2w3WEc0Z0lDQWdjbVYwZFhKdUlIUm9hWE11YzI5amEyVjBMbU52Ym01bFkzUmxaRHRjYmlBZ2ZWeHVYRzRnSUdselJHbHpZMjl1Ym1WamRHVmtLQ2w3WEc0Z0lDQWdjbVYwZFhKdUlIUm9hWE11YzI5amEyVjBMbVJwYzJOdmJtNWxZM1JsWkR0Y2JpQWdmVnh1ZlZ4dVhHNWNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdablZ1WTNScGIyNGdLR0ZqWTJWemMxUnZhMlZ1S1NCN1hHNGdJSEpsZEhWeWJpQnVaWGNnVTNWaWMyTnlhWEIwYVc5dVUyVnlkbWxqWlNoaFkyTmxjM05VYjJ0bGJpazdYRzU5TzF4dUlsMTkiLCIndXNlIHN0cmljdCc7XG5cbnZhciBhcGlTdWJzY3JpcHRpb25TcnZjID0gcmVxdWlyZSgnLi9hcGktc3Vic2NyaXB0aW9ucycpO1xuXG5leHBvcnRzLmluaXRpYWxpemUgPSBmdW5jdGlvbiAoYWNjZXNzVG9rZW4pIHtcbiAgZXhwb3J0cy5hcGlTdWJzY3JpcHRpb25zID0gYXBpU3Vic2NyaXB0aW9uU3J2YyhhY2Nlc3NUb2tlbik7XG59O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lMMVZ6WlhKekwyaGlkWEp5YjNkekwyUmxkaTlvWlhKdmEzVXZjbVZoWTNRdFpteDFlQzF6ZEdGeWRHVnlMM0IxWW14cFl5OXFZWFpoYzJOeWFYQjBjeTl6WlhKMmFXTmxjeTlwYm1SbGVDNXFjeUlzSW5OdmRYSmpaWE1pT2xzaUwxVnpaWEp6TDJoaWRYSnliM2R6TDJSbGRpOW9aWEp2YTNVdmNtVmhZM1F0Wm14MWVDMXpkR0Z5ZEdWeUwzQjFZbXhwWXk5cVlYWmhjMk55YVhCMGN5OXpaWEoyYVdObGN5OXBibVJsZUM1cWN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaVFVRkJRU3haUVVGWkxFTkJRVU03TzBGQlJXSXNTVUZCU1N4dFFrRkJiVUlzUjBGQlJ5eFBRVUZQTEVOQlFVTXNjVUpCUVhGQ0xFTkJRVU1zUTBGQlF6czdRVUZGZWtRc1QwRkJUeXhEUVVGRExGVkJRVlVzUjBGQlJ5eFZRVUZWTEZkQlFWY3NSVUZCUlR0RlFVTXhReXhQUVVGUExFTkJRVU1zWjBKQlFXZENMRWRCUVVjc2JVSkJRVzFDTEVOQlFVTXNWMEZCVnl4RFFVRkRMRU5CUVVNN1EwRkROMFFzUTBGQlF5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJaWQxYzJVZ2MzUnlhV04wSnp0Y2JseHVkbUZ5SUdGd2FWTjFZbk5qY21sd2RHbHZibE55ZG1NZ1BTQnlaWEYxYVhKbEtDY3VMMkZ3YVMxemRXSnpZM0pwY0hScGIyNXpKeWs3WEc1Y2JtVjRjRzl5ZEhNdWFXNXBkR2xoYkdsNlpTQTlJR1oxYm1OMGFXOXVJQ2hoWTJObGMzTlViMnRsYmlrZ2UxeHVJQ0JsZUhCdmNuUnpMbUZ3YVZOMVluTmpjbWx3ZEdsdmJuTWdQU0JoY0dsVGRXSnpZM0pwY0hScGIyNVRjblpqS0dGalkyVnpjMVJ2YTJWdUtUdGNibjA3WEc0aVhYMD0iLCIndXNlIHN0cmljdCc7XG5cbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXI7XG5cbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG52YXIgSW1tdXRhYmxlID0gcmVxdWlyZSgnaW1tdXRhYmxlJyk7XG5cbmNvbnN0IENIQU5HRV9FVkVOVCA9ICdjaGFuZ2UnO1xuXG5jbGFzcyBCYXNlU3RvcmUgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICBjb25zdHJ1Y3RvcihkaXNwYXRjaGVyKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmRpc3BhdGNoZXIgPSBkaXNwYXRjaGVyO1xuICAgIHRoaXMuaW5GbGlnaHQgPSBmYWxzZTtcbiAgICB0aGlzLmVycm9yID0gbnVsbDtcbiAgICB0aGlzLl9yZWdpc3RlcigpO1xuICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgaW5pdGlhbGl6ZSgpIHt9XG5cbiAgYWRkQ2hhbmdlTGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICB0aGlzLm9uKENIQU5HRV9FVkVOVCwgY2FsbGJhY2spO1xuICB9XG5cbiAgcmVtb3ZlQ2hhbmdlTGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKENIQU5HRV9FVkVOVCwgY2FsbGJhY2spO1xuICB9XG5cbiAgZW1pdENoYW5nZSgpIHtcbiAgICB0aGlzLmVtaXQoQ0hBTkdFX0VWRU5UKTtcbiAgfVxuXG4gIGdldFN0YXRlKCkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBpc0luRmxpZ2h0KCkge1xuICAgIHJldHVybiB0aGlzLmluRmxpZ2h0O1xuICB9XG5cbiAgX2dldEFjdGlvbnMoKXtcbiAgICByZXR1cm4ge307XG4gIH1cblxuICBnZXRTdG9yZU5hbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IubmFtZTtcbiAgfVxuXG4gIC8vIGZvciBjcmVhdGluZyBhIHN0YW5kYXJkIHN0b3JlIGVudHJ5IHRoYXQgY2FwdHVyZXMgdGhlIGVudGl0aWVzIHN0YXRlXG4gIG1ha2VTdGF0ZWZ1bEVudHJ5KHN0YXRlPXVuZGVmaW5lZCwgZGF0YT11bmRlZmluZWQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc3RhdGU6IHN0YXRlLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH07XG4gIH1cblxuICB1cGRhdGVTdGF0ZWZ1bEVudHJ5KGVudHJ5LCBzdGF0ZSwgZGF0YSkge1xuICAgIF8uZXh0ZW5kKGVudHJ5LmRhdGEgfHwgKGVudHJ5LmRhdGEgPSB7fSksIGRhdGEpO1xuICAgIGVudHJ5LnN0YXRlID0gc3RhdGU7XG4gICAgcmV0dXJuIGVudHJ5O1xuICB9XG5cbiAgX3JlZ2lzdGVyKCkge1xuICAgIHRoaXMuZGlzcGF0Y2hUb2tlbiA9IHRoaXMuZGlzcGF0Y2hlci5yZWdpc3RlcihfLmJpbmQoZnVuY3Rpb24gKHBheWxvYWQpIHtcbiAgICAgIHRoaXMuX2hhbmRsZUFjdGlvbihwYXlsb2FkLmFjdGlvbi5hY3Rpb25UeXBlLCBwYXlsb2FkLmFjdGlvbik7XG4gICAgfSwgdGhpcykpO1xuICB9XG5cbiAgX2hhbmRsZUFjdGlvbihhY3Rpb25UeXBlLCBhY3Rpb24pe1xuICAgIC8vIFByb3h5IGFjdGlvblR5cGUgdG8gdGhlIGluc3RhbmNlIG1ldGhvZCBkZWZpbmVkIGluIGFjdGlvbnNbYWN0aW9uVHlwZV0sXG4gICAgLy8gb3Igb3B0aW9uYWxseSBpZiB0aGUgdmFsdWUgaXMgYSBmdW5jdGlvbiwgaW52b2tlIGl0IGluc3RlYWQuXG4gICAgdmFyIGFjdGlvbnMgPSB0aGlzLl9nZXRBY3Rpb25zKCk7XG4gICAgaWYgKGFjdGlvbnMuaGFzT3duUHJvcGVydHkoYWN0aW9uVHlwZSkpIHtcbiAgICAgIHZhciBhY3Rpb25WYWx1ZSA9IGFjdGlvbnNbYWN0aW9uVHlwZV07XG4gICAgICBpZiAoXy5pc1N0cmluZyhhY3Rpb25WYWx1ZSkpIHtcbiAgICAgICAgaWYgKF8uaXNGdW5jdGlvbih0aGlzW2FjdGlvblZhbHVlXSkpIHtcbiAgICAgICAgICB0aGlzW2FjdGlvblZhbHVlXShhY3Rpb24pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQWN0aW9uIGhhbmRsZXIgZGVmaW5lZCBpbiBTdG9yZSBtYXAgaXMgdW5kZWZpbmVkIG9yIG5vdCBhIEZ1bmN0aW9uLiBTdG9yZTogJHt0aGlzLmNvbnN0cnVjdG9yLm5hbWV9LCBBY3Rpb246ICR7YWN0aW9uVHlwZX1gKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSBpZiAoXy5pc0Z1bmN0aW9uKGFjdGlvblZhbHVlKSkge1xuICAgICAgICBhY3Rpb25WYWx1ZS5jYWxsKHRoaXMsIGFjdGlvbik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgX21ha2VTdG9yZUVudHJ5KCkge1xuICAgIHJldHVybiBJbW11dGFibGUuZnJvbUpTKHtcbiAgICAgIF9tZXRhOiB7XG4gICAgICAgIHN0YXRlOiB1bmRlZmluZWRcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gQmFzZVN0b3JlO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lMMVZ6WlhKekwyaGlkWEp5YjNkekwyUmxkaTlvWlhKdmEzVXZjbVZoWTNRdFpteDFlQzF6ZEdGeWRHVnlMM0IxWW14cFl5OXFZWFpoYzJOeWFYQjBjeTl6ZEc5eVpYTXZZbUZ6WlM1cWN5SXNJbk52ZFhKalpYTWlPbHNpTDFWelpYSnpMMmhpZFhKeWIzZHpMMlJsZGk5b1pYSnZhM1V2Y21WaFkzUXRabXgxZUMxemRHRnlkR1Z5TDNCMVlteHBZeTlxWVhaaGMyTnlhWEIwY3k5emRHOXlaWE12WW1GelpTNXFjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lRVUZCUVN4WlFVRlpMRU5CUVVNN08wRkJSV0lzU1VGQlNTeFpRVUZaTEVkQlFVY3NUMEZCVHl4RFFVRkRMRkZCUVZFc1EwRkJReXhEUVVGRExGbEJRVmtzUTBGQlF6czdRVUZGYkVRc1NVRkJTU3hEUVVGRExFZEJRVWNzVDBGQlR5eERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRPMEZCUXpGQ0xFbEJRVWtzVTBGQlV5eEhRVUZITEU5QlFVOHNRMEZCUXl4WFFVRlhMRU5CUVVNc1EwRkJRenM3UVVGRmNrTXNUVUZCVFN4WlFVRlpMRWRCUVVjc1VVRkJVU3hEUVVGRE96dEJRVVU1UWl4TlFVRk5MRk5CUVZNc1UwRkJVeXhaUVVGWkxFTkJRVU03UlVGRGJrTXNWMEZCVnl4aFFVRmhPMGxCUTNSQ0xFdEJRVXNzUlVGQlJTeERRVUZETzBsQlExSXNTVUZCU1N4RFFVRkRMRlZCUVZVc1IwRkJSeXhWUVVGVkxFTkJRVU03U1VGRE4wSXNTVUZCU1N4RFFVRkRMRkZCUVZFc1IwRkJSeXhMUVVGTExFTkJRVU03U1VGRGRFSXNTVUZCU1N4RFFVRkRMRXRCUVVzc1IwRkJSeXhKUVVGSkxFTkJRVU03U1VGRGJFSXNTVUZCU1N4RFFVRkRMRk5CUVZNc1JVRkJSU3hEUVVGRE8wbEJRMnBDTEVsQlFVa3NRMEZCUXl4VlFVRlZMRVZCUVVVc1EwRkJRenRCUVVOMFFpeEhRVUZIT3p0QlFVVklMRVZCUVVVc1ZVRkJWU3hIUVVGSExFVkJRVVU3TzBWQlJXWXNhVUpCUVdsQ0xGZEJRVmM3U1VGRE1VSXNTVUZCU1N4RFFVRkRMRVZCUVVVc1EwRkJReXhaUVVGWkxFVkJRVVVzVVVGQlVTeERRVUZETEVOQlFVTTdRVUZEY0VNc1IwRkJSenM3UlVGRlJDeHZRa0ZCYjBJc1YwRkJWenRKUVVNM1FpeEpRVUZKTEVOQlFVTXNZMEZCWXl4RFFVRkRMRmxCUVZrc1JVRkJSU3hSUVVGUkxFTkJRVU1zUTBGQlF6dEJRVU5vUkN4SFFVRkhPenRGUVVWRUxGVkJRVlVzUjBGQlJ6dEpRVU5ZTEVsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1dVRkJXU3hEUVVGRExFTkJRVU03UVVGRE5VSXNSMEZCUnpzN1JVRkZSQ3hSUVVGUkxFZEJRVWM3U1VGRFZDeFBRVUZQTEZOQlFWTXNRMEZCUXp0QlFVTnlRaXhIUVVGSE96dEZRVVZFTEZWQlFWVXNSMEZCUnp0SlFVTllMRTlCUVU4c1NVRkJTU3hEUVVGRExGRkJRVkVzUTBGQlF6dEJRVU42UWl4SFFVRkhPenRGUVVWRUxGZEJRVmNzUlVGQlJUdEpRVU5ZTEU5QlFVOHNSVUZCUlN4RFFVRkRPMEZCUTJRc1IwRkJSenM3UlVGRlJDeFpRVUZaTEVkQlFVYzdTVUZEWWl4UFFVRlBMRWxCUVVrc1EwRkJReXhYUVVGWExFTkJRVU1zU1VGQlNTeERRVUZETzBGQlEycERMRWRCUVVjN1FVRkRTRHM3UlVGRlJTeHBRa0ZCYVVJc2EwTkJRV3RETzBsQlEycEVMRTlCUVU4N1RVRkRUQ3hMUVVGTExFVkJRVVVzUzBGQlN6dE5RVU5hTEVsQlFVa3NSVUZCUlN4SlFVRkpPMHRCUTFnc1EwRkJRenRCUVVOT0xFZEJRVWM3TzBWQlJVUXNiVUpCUVcxQ0xIRkNRVUZ4UWp0SlFVTjBReXhEUVVGRExFTkJRVU1zVFVGQlRTeERRVUZETEV0QlFVc3NRMEZCUXl4SlFVRkpMRXRCUVVzc1MwRkJTeXhEUVVGRExFbEJRVWtzUjBGQlJ5eEZRVUZGTEVOQlFVTXNSVUZCUlN4SlFVRkpMRU5CUVVNc1EwRkJRenRKUVVOb1JDeExRVUZMTEVOQlFVTXNTMEZCU3l4SFFVRkhMRXRCUVVzc1EwRkJRenRKUVVOd1FpeFBRVUZQTEV0QlFVc3NRMEZCUXp0QlFVTnFRaXhIUVVGSE96dEZRVVZFTEZOQlFWTXNSMEZCUnp0SlFVTldMRWxCUVVrc1EwRkJReXhoUVVGaExFZEJRVWNzU1VGQlNTeERRVUZETEZWQlFWVXNRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJReXhEUVVGRExFbEJRVWtzUTBGQlF5eFZRVUZWTEU5QlFVOHNSVUZCUlR0TlFVTjBSU3hKUVVGSkxFTkJRVU1zWVVGQllTeERRVUZETEU5QlFVOHNRMEZCUXl4TlFVRk5MRU5CUVVNc1ZVRkJWU3hGUVVGRkxFOUJRVThzUTBGQlF5eE5RVUZOTEVOQlFVTXNRMEZCUXp0TFFVTXZSQ3hGUVVGRkxFbEJRVWtzUTBGQlF5eERRVUZETEVOQlFVTTdRVUZEWkN4SFFVRkhPenRCUVVWSUxFVkJRVVVzWVVGQllTeHZRa0ZCYjBJN1FVRkRia003TzBsQlJVa3NTVUZCU1N4UFFVRlBMRWRCUVVjc1NVRkJTU3hEUVVGRExGZEJRVmNzUlVGQlJTeERRVUZETzBsQlEycERMRWxCUVVrc1QwRkJUeXhEUVVGRExHTkJRV01zUTBGQlF5eFZRVUZWTEVOQlFVTXNSVUZCUlR0TlFVTjBReXhKUVVGSkxGZEJRVmNzUjBGQlJ5eFBRVUZQTEVOQlFVTXNWVUZCVlN4RFFVRkRMRU5CUVVNN1RVRkRkRU1zU1VGQlNTeERRVUZETEVOQlFVTXNVVUZCVVN4RFFVRkRMRmRCUVZjc1EwRkJReXhGUVVGRk8xRkJRek5DTEVsQlFVa3NRMEZCUXl4RFFVRkRMRlZCUVZVc1EwRkJReXhKUVVGSkxFTkJRVU1zVjBGQlZ5eERRVUZETEVOQlFVTXNSVUZCUlR0VlFVTnVReXhKUVVGSkxFTkJRVU1zVjBGQlZ5eERRVUZETEVOQlFVTXNUVUZCVFN4RFFVRkRMRU5CUVVNN1UwRkRNMEk3WVVGRFNUdFZRVU5JTEUxQlFVMHNTVUZCU1N4TFFVRkxMRU5CUVVNc09FVkJRVGhGTEVsQlFVa3NRMEZCUXl4WFFVRlhMRU5CUVVNc1NVRkJTU3hoUVVGaExGVkJRVlVzUlVGQlJTeERRVUZETEVOQlFVTTdVMEZETDBrN1QwRkRSanRYUVVOSkxFbEJRVWtzUTBGQlF5eERRVUZETEZWQlFWVXNRMEZCUXl4WFFVRlhMRU5CUVVNc1JVRkJSVHRSUVVOc1F5eFhRVUZYTEVOQlFVTXNTVUZCU1N4RFFVRkRMRWxCUVVrc1JVRkJSU3hOUVVGTkxFTkJRVU1zUTBGQlF6dFBRVU5vUXp0TFFVTkdPMEZCUTB3c1IwRkJSenM3UlVGRlJDeGxRVUZsTEVkQlFVYzdTVUZEYUVJc1QwRkJUeXhUUVVGVExFTkJRVU1zVFVGQlRTeERRVUZETzAxQlEzUkNMRXRCUVVzc1JVRkJSVHRSUVVOTUxFdEJRVXNzUlVGQlJTeFRRVUZUTzA5QlEycENPMHRCUTBZc1EwRkJReXhEUVVGRE8wRkJRMUFzUjBGQlJ6czdRVUZGU0N4RFFVRkRPenRCUVVWRUxFMUJRVTBzUTBGQlF5eFBRVUZQTEVkQlFVY3NVMEZCVXl4RFFVRkRJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpSjNWelpTQnpkSEpwWTNRbk8xeHVYRzUyWVhJZ1JYWmxiblJGYldsMGRHVnlJRDBnY21WeGRXbHlaU2duWlhabGJuUnpKeWt1UlhabGJuUkZiV2wwZEdWeU8xeHVYRzUyWVhJZ1h5QTlJSEpsY1hWcGNtVW9KMnh2WkdGemFDY3BPMXh1ZG1GeUlFbHRiWFYwWVdKc1pTQTlJSEpsY1hWcGNtVW9KMmx0YlhWMFlXSnNaU2NwTzF4dVhHNWpiMjV6ZENCRFNFRk9SMFZmUlZaRlRsUWdQU0FuWTJoaGJtZGxKenRjYmx4dVkyeGhjM01nUW1GelpWTjBiM0psSUdWNGRHVnVaSE1nUlhabGJuUkZiV2wwZEdWeUlIdGNiaUFnWTI5dWMzUnlkV04wYjNJb1pHbHpjR0YwWTJobGNpa2dlMXh1SUNBZ0lITjFjR1Z5S0NrN1hHNGdJQ0FnZEdocGN5NWthWE53WVhSamFHVnlJRDBnWkdsemNHRjBZMmhsY2p0Y2JpQWdJQ0IwYUdsekxtbHVSbXhwWjJoMElEMGdabUZzYzJVN1hHNGdJQ0FnZEdocGN5NWxjbkp2Y2lBOUlHNTFiR3c3WEc0Z0lDQWdkR2hwY3k1ZmNtVm5hWE4wWlhJb0tUdGNiaUFnSUNCMGFHbHpMbWx1YVhScFlXeHBlbVVvS1R0Y2JpQWdmVnh1WEc0Z0lHbHVhWFJwWVd4cGVtVW9LU0I3ZlZ4dVhHNGdJR0ZrWkVOb1lXNW5aVXhwYzNSbGJtVnlLR05oYkd4aVlXTnJLU0I3WEc0Z0lDQWdkR2hwY3k1dmJpaERTRUZPUjBWZlJWWkZUbFFzSUdOaGJHeGlZV05yS1R0Y2JpQWdmVnh1WEc0Z0lISmxiVzkyWlVOb1lXNW5aVXhwYzNSbGJtVnlLR05oYkd4aVlXTnJLU0I3WEc0Z0lDQWdkR2hwY3k1eVpXMXZkbVZNYVhOMFpXNWxjaWhEU0VGT1IwVmZSVlpGVGxRc0lHTmhiR3hpWVdOcktUdGNiaUFnZlZ4dVhHNGdJR1Z0YVhSRGFHRnVaMlVvS1NCN1hHNGdJQ0FnZEdocGN5NWxiV2wwS0VOSVFVNUhSVjlGVmtWT1ZDazdYRzRnSUgxY2JseHVJQ0JuWlhSVGRHRjBaU2dwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdkVzVrWldacGJtVmtPMXh1SUNCOVhHNWNiaUFnYVhOSmJrWnNhV2RvZENncElIdGNiaUFnSUNCeVpYUjFjbTRnZEdocGN5NXBia1pzYVdkb2REdGNiaUFnZlZ4dVhHNGdJRjluWlhSQlkzUnBiMjV6S0NsN1hHNGdJQ0FnY21WMGRYSnVJSHQ5TzF4dUlDQjlYRzVjYmlBZ1oyVjBVM1J2Y21WT1lXMWxLQ2tnZTF4dUlDQWdJSEpsZEhWeWJpQjBhR2x6TG1OdmJuTjBjblZqZEc5eUxtNWhiV1U3WEc0Z0lIMWNibHh1SUNBdkx5Qm1iM0lnWTNKbFlYUnBibWNnWVNCemRHRnVaR0Z5WkNCemRHOXlaU0JsYm5SeWVTQjBhR0YwSUdOaGNIUjFjbVZ6SUhSb1pTQmxiblJwZEdsbGN5QnpkR0YwWlZ4dUlDQnRZV3RsVTNSaGRHVm1kV3hGYm5SeWVTaHpkR0YwWlQxMWJtUmxabWx1WldRc0lHUmhkR0U5ZFc1a1pXWnBibVZrS1NCN1hHNGdJQ0FnY21WMGRYSnVJSHRjYmlBZ0lDQWdJSE4wWVhSbE9pQnpkR0YwWlN4Y2JpQWdJQ0FnSUdSaGRHRTZJR1JoZEdGY2JpQWdJQ0I5TzF4dUlDQjlYRzVjYmlBZ2RYQmtZWFJsVTNSaGRHVm1kV3hGYm5SeWVTaGxiblJ5ZVN3Z2MzUmhkR1VzSUdSaGRHRXBJSHRjYmlBZ0lDQmZMbVY0ZEdWdVpDaGxiblJ5ZVM1a1lYUmhJSHg4SUNobGJuUnllUzVrWVhSaElEMGdlMzBwTENCa1lYUmhLVHRjYmlBZ0lDQmxiblJ5ZVM1emRHRjBaU0E5SUhOMFlYUmxPMXh1SUNBZ0lISmxkSFZ5YmlCbGJuUnllVHRjYmlBZ2ZWeHVYRzRnSUY5eVpXZHBjM1JsY2lncElIdGNiaUFnSUNCMGFHbHpMbVJwYzNCaGRHTm9WRzlyWlc0Z1BTQjBhR2x6TG1ScGMzQmhkR05vWlhJdWNtVm5hWE4wWlhJb1h5NWlhVzVrS0daMWJtTjBhVzl1SUNod1lYbHNiMkZrS1NCN1hHNGdJQ0FnSUNCMGFHbHpMbDlvWVc1a2JHVkJZM1JwYjI0b2NHRjViRzloWkM1aFkzUnBiMjR1WVdOMGFXOXVWSGx3WlN3Z2NHRjViRzloWkM1aFkzUnBiMjRwTzF4dUlDQWdJSDBzSUhSb2FYTXBLVHRjYmlBZ2ZWeHVYRzRnSUY5b1lXNWtiR1ZCWTNScGIyNG9ZV04wYVc5dVZIbHdaU3dnWVdOMGFXOXVLWHRjYmlBZ0lDQXZMeUJRY205NGVTQmhZM1JwYjI1VWVYQmxJSFJ2SUhSb1pTQnBibk4wWVc1alpTQnRaWFJvYjJRZ1pHVm1hVzVsWkNCcGJpQmhZM1JwYjI1elcyRmpkR2x2YmxSNWNHVmRMRnh1SUNBZ0lDOHZJRzl5SUc5d2RHbHZibUZzYkhrZ2FXWWdkR2hsSUhaaGJIVmxJR2x6SUdFZ1puVnVZM1JwYjI0c0lHbHVkbTlyWlNCcGRDQnBibk4wWldGa0xseHVJQ0FnSUhaaGNpQmhZM1JwYjI1eklEMGdkR2hwY3k1ZloyVjBRV04wYVc5dWN5Z3BPMXh1SUNBZ0lHbG1JQ2hoWTNScGIyNXpMbWhoYzA5M2JsQnliM0JsY25SNUtHRmpkR2x2YmxSNWNHVXBLU0I3WEc0Z0lDQWdJQ0IyWVhJZ1lXTjBhVzl1Vm1Gc2RXVWdQU0JoWTNScGIyNXpXMkZqZEdsdmJsUjVjR1ZkTzF4dUlDQWdJQ0FnYVdZZ0tGOHVhWE5UZEhKcGJtY29ZV04wYVc5dVZtRnNkV1VwS1NCN1hHNGdJQ0FnSUNBZ0lHbG1JQ2hmTG1selJuVnVZM1JwYjI0b2RHaHBjMXRoWTNScGIyNVdZV3gxWlYwcEtTQjdYRzRnSUNBZ0lDQWdJQ0FnZEdocGMxdGhZM1JwYjI1V1lXeDFaVjBvWVdOMGFXOXVLVHRjYmlBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnSUNCbGJITmxJSHRjYmlBZ0lDQWdJQ0FnSUNCMGFISnZkeUJ1WlhjZ1JYSnliM0lvWUVGamRHbHZiaUJvWVc1a2JHVnlJR1JsWm1sdVpXUWdhVzRnVTNSdmNtVWdiV0Z3SUdseklIVnVaR1ZtYVc1bFpDQnZjaUJ1YjNRZ1lTQkdkVzVqZEdsdmJpNGdVM1J2Y21VNklDUjdkR2hwY3k1amIyNXpkSEoxWTNSdmNpNXVZVzFsZlN3Z1FXTjBhVzl1T2lBa2UyRmpkR2x2YmxSNWNHVjlZQ2s3WEc0Z0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUgxY2JpQWdJQ0FnSUdWc2MyVWdhV1lnS0Y4dWFYTkdkVzVqZEdsdmJpaGhZM1JwYjI1V1lXeDFaU2twSUh0Y2JpQWdJQ0FnSUNBZ1lXTjBhVzl1Vm1Gc2RXVXVZMkZzYkNoMGFHbHpMQ0JoWTNScGIyNHBPMXh1SUNBZ0lDQWdmVnh1SUNBZ0lIMWNiaUFnZlZ4dVhHNGdJRjl0WVd0bFUzUnZjbVZGYm5SeWVTZ3BJSHRjYmlBZ0lDQnlaWFIxY200Z1NXMXRkWFJoWW14bExtWnliMjFLVXloN1hHNGdJQ0FnSUNCZmJXVjBZVG9nZTF4dUlDQWdJQ0FnSUNCemRHRjBaVG9nZFc1a1pXWnBibVZrWEc0Z0lDQWdJQ0I5WEc0Z0lDQWdmU2s3WEc0Z0lIMWNibHh1ZlZ4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlFSmhjMlZUZEc5eVpUdGNiaUpkZlE9PSIsIid1c2Ugc3RyaWN0JztcblxudmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcblxudmFyIEJhc2VTdG9yZSA9IHJlcXVpcmUoJy4vYmFzZScpO1xuXG52YXIga0FjdGlvbnMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvYWN0aW9ucycpLFxuICAgIGtTdGF0ZXMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvc3RhdGVzJyk7XG5cblxuZnVuY3Rpb24gX2FjdGlvbkZvck1ldGhvZChhY3Rpb25PYmplY3RJZCwgbWV0aG9kKSB7XG4gIHJldHVybiBrQWN0aW9uc1thY3Rpb25PYmplY3RJZCArICdfJyArIG1ldGhvZF07XG59XG5cbmNsYXNzIENSVURTdG9yZSBleHRlbmRzIEJhc2VTdG9yZSB7XG5cbiAgY29uc3RydWN0b3IoZGlzcGF0Y2hlciwgYWN0aW9ucywgYWN0aW9uT2JqZWN0SWQpIHtcbiAgICBzdXBlcihkaXNwYXRjaGVyKTtcblxuICAgIHRoaXMuX3Jlc291cmNlcyA9IHVuZGVmaW5lZDtcblxuICAgIHRoaXMuX2FjdGlvbnMgPSBhY3Rpb25zO1xuICAgIHRoaXMuX2hhbmRsZXJzID0gdGhpcy5fZ2V0QWN0aW9uSGFuZGxlcnMoYWN0aW9uT2JqZWN0SWQpO1xuXG4gICAgLy8gc3Vic2NyaWJlIHRoZSBzdG9yZSB0byB0aGUgJ2dldEFsbCcgbGlzdCBlbmRwb2ludFxuICAgIGFjdGlvbnMuc3Vic2NyaWJlTGlzdCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhcnJheSBvZiBhbGwgcmVzb3VyY2VzXG4gICAqL1xuICBnZXRBbGwoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3Jlc291cmNlcyAhPT0gdW5kZWZpbmVkID8gXy5tYXAodGhpcy5fcmVzb3VyY2VzLCByZXNvdXJjZSA9PiByZXNvdXJjZSkgOiB0aGlzLl9sb2FkQWxsKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHNpbmdsZSByZXNvdXJjZVxuICAgKi9cbiAgZ2V0KGlkKSB7XG4gICAgcmV0dXJuIHRoaXMuX3Jlc291cmNlcyAhPT0gdW5kZWZpbmVkID8gKGlkIGluIHRoaXMuX3Jlc291cmNlcyA/IHRoaXMuX3Jlc291cmNlc1tpZF0gOiB0aGlzLl9sb2FkT25lKGlkKSkgOiB0aGlzLl9sb2FkQWxsKCk7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBTdXBwb3J0IGZvciBkZWZpbmluZyBhbmQgZ2V0dGluZyBhY3Rpb24gaGFuZGxlciBtYXBcbiAgICovXG4gIF9nZXRBY3Rpb25zKCkge1xuICAgIHJldHVybiB0aGlzLl9oYW5kbGVycztcbiAgfVxuXG4gIF9nZXRBY3Rpb25IYW5kbGVycyhhY3Rpb25PYmplY3RJZCkge1xuICAgIHJldHVybiBfLnppcE9iamVjdChbXG4gICAgICBbX2FjdGlvbkZvck1ldGhvZChhY3Rpb25PYmplY3RJZCwgJ0dFVEFMTCcpLCAnX29uR2V0QWxsJ10sXG4gICAgICBbX2FjdGlvbkZvck1ldGhvZChhY3Rpb25PYmplY3RJZCwgJ0dFVE9ORScpLCAnX29uR2V0T25lJ10sXG4gICAgICBbX2FjdGlvbkZvck1ldGhvZChhY3Rpb25PYmplY3RJZCwgJ1BPU1QnKSwgJ19vblBvc3QnXSxcbiAgICAgIFtfYWN0aW9uRm9yTWV0aG9kKGFjdGlvbk9iamVjdElkLCAnUFVUJyksICdfb25QdXQnXSxcbiAgICAgIFtfYWN0aW9uRm9yTWV0aG9kKGFjdGlvbk9iamVjdElkLCAnREVMRVRFJyksICdfb25EZWxldGUnXVxuICAgIF0pO1xuICB9XG5cblxuICAvKipcbiAgICogVXRpbGl0eSBtZXRob2RzXG4gICAqL1xuICBfbG9hZEFsbCgpIHtcbiAgICB0aGlzLl9hY3Rpb25zLmdldEFsbCgpO1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBfbG9hZE9uZShpZCkge1xuICAgIHRoaXMuX2FjdGlvbnMuZ2V0KGlkKTtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEFjdGlvbiBIYW5kbGVyc1xuICAgKlxuICAgKi9cbiAgX29uR2V0QWxsKHBheWxvYWQpIHtcbiAgICBjb25zb2xlLmRlYnVnKGAke3RoaXMuZ2V0U3RvcmVOYW1lKCl9Ol9vbkdldEFsbDsgc3RhdGU9JHtwYXlsb2FkLnN5bmNTdGF0ZX1gKTtcblxuICAgIHN3aXRjaChwYXlsb2FkLnN5bmNTdGF0ZSkge1xuICAgICAgY2FzZSBrU3RhdGVzLkxPQURJTkc6XG4gICAgICAgIHRoaXMuaW5mbGlnaHQgPSB0cnVlO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2Uga1N0YXRlcy5TWU5DRUQ6XG5cbiAgICAgICAgLy8gdW5zdWJzY3JpYmUgZnJvbSByZXNvdXJjZSB3ZWJzb2NrZXQgZXZlbnRzIGlmIHdlIGFscmVhZHkgaGF2ZSByZXNvdXJjZXNcbiAgICAgICAgaWYgKHRoaXMuX3Jlc291cmNlcykge1xuICAgICAgICAgIHRoaXMuX2FjdGlvbnMudW5zdWJzY3JpYmVSZXNvdXJjZXMoXy5tYXAodGhpcy5fcmVzb3VyY2VzLCByZXNvdXJjZSA9PiByZXNvdXJjZS5kYXRhLmlkKSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzdWJzY3JpYmUgdG8gcmVzb3VyY2Ugd2Vic29ja2V0IGV2ZW50c1xuICAgICAgICB2YXIgbWFwID0gXy5tYXAocGF5bG9hZC5kYXRhLCBpdGVtID0+IFtpdGVtLmlkLCB0aGlzLm1ha2VTdGF0ZWZ1bEVudHJ5KHBheWxvYWQuc3luY1N0YXRlLCBpdGVtKV0pO1xuICAgICAgICB0aGlzLl9yZXNvdXJjZXMgPSBfLnppcE9iamVjdChtYXApO1xuXG4gICAgICAgIHRoaXMuX2FjdGlvbnMuc3Vic2NyaWJlUmVzb3VyY2VzKF8ubWFwKHRoaXMuX3Jlc291cmNlcywgcmVzb3VyY2UgPT4gcmVzb3VyY2UuZGF0YS5pZCkpO1xuXG4gICAgICAgIHRoaXMuaW5mbGlnaHQgPSBmYWxzZTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgdGhpcy5lbWl0Q2hhbmdlKCk7XG4gIH1cblxuICBfb25HZXRPbmUocGF5bG9hZCkge1xuICAgIGNvbnNvbGUuZGVidWcoYCR7dGhpcy5nZXRTdG9yZU5hbWUoKX06X29uR2V0QWxsOyBzdGF0ZT0ke3BheWxvYWQuc3luY1N0YXRlfWApO1xuXG4gICAgdmFyIGV4aXN0cztcblxuICAgIHN3aXRjaChwYXlsb2FkLnN5bmNTdGF0ZSkge1xuICAgICAgY2FzZSBrU3RhdGVzLkxPQURJTkc6XG4gICAgICAgIHRoaXMuaW5mbGlnaHQgPSB0cnVlO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2Uga1N0YXRlcy5TWU5DRUQ6XG4gICAgICAgIHRoaXMuX3Jlc291cmNlcyA9IHRoaXMuX3Jlc291cmNlcyB8fCB7fTtcbiAgICAgICAgZXhpc3RzID0gISF0aGlzLl9yZXNvdXJjZXNbcGF5bG9hZC5kYXRhLmlkXTtcbiAgICAgICAgdGhpcy5fcmVzb3VyY2VzW3BheWxvYWQuZGF0YS5pZF0gPSB0aGlzLm1ha2VTdGF0ZWZ1bEVudHJ5KHBheWxvYWQuc3luY1N0YXRlLCBwYXlsb2FkLmRhdGEpO1xuICAgICAgICAvLyBvbmx5IHN1YnNjcmliZSB0byByZXNvdXJjZSB3ZWJzb2NrZXQgZXZlbnRzIGlmIHRoZSByZXNvdXJjZSBpcyBuZXdcbiAgICAgICAgaWYgKCFleGlzdHMpIHtcbiAgICAgICAgICB0aGlzLl9hY3Rpb25zLnN1YnNjcmliZVJlc291cmNlcyhwYXlsb2FkLmRhdGEuaWQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaW5mbGlnaHQgPSBmYWxzZTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgdGhpcy5lbWl0Q2hhbmdlKCk7XG5cbiAgfVxuXG4gIF9vblBvc3QocGF5bG9hZCkge1xuICAgIGNvbnNvbGUuZGVidWcoYCR7dGhpcy5nZXRTdG9yZU5hbWUoKX06X29uUG9zdDsgc3RhdGU9JHtwYXlsb2FkLnN5bmNTdGF0ZX1gKTtcblxuICAgIGlmICghdGhpcy5fcmVzb3VyY2VzKSB7IHRoaXMuX3Jlc291cmNlcyA9IHt9OyB9XG5cbiAgICB0aGlzLl9yZXNvdXJjZXNbcGF5bG9hZC5kYXRhLmlkXSA9IHRoaXMubWFrZVN0YXRlZnVsRW50cnkocGF5bG9hZC5zeW5jU3RhdGUsIHBheWxvYWQuZGF0YSk7XG5cbiAgICAvLyBzdWJzY3JpYmUgdG8gcmVzb3VyY2Ugb25seSBvbiBTWU5DXG4gICAgaWYgKHBheWxvYWQuc3luY1N0YXRlID09PSBrU3RhdGVzLlNZTkNFRCkge1xuICAgICAgdGhpcy5fYWN0aW9ucy5zdWJzY3JpYmVSZXNvdXJjZXMocGF5bG9hZC5kYXRhLmlkKTtcbiAgICB9XG5cbiAgICB0aGlzLmVtaXRDaGFuZ2UoKTtcbiAgfVxuXG4gIF9vblB1dChwYXlsb2FkKSB7XG4gICAgY29uc29sZS5kZWJ1ZyhgJHt0aGlzLmdldFN0b3JlTmFtZSgpfTpfb25QdXQ7IHN0YXRlPSR7cGF5bG9hZC5zeW5jU3RhdGV9YCk7XG5cbiAgICBpZiAoIXRoaXMuX3Jlc291cmNlcykgeyB0aGlzLl9yZXNvdXJjZXMgPSB7fTsgfVxuXG4gICAgdmFyIGV4aXN0aW5nRW50cnkgPSB0aGlzLl9yZXNvdXJjZXNbcGF5bG9hZC5kYXRhLmlkXTtcblxuICAgIC8vIGNhbiBvbmx5IHVwZGF0ZSBhbiBlbnRyeSB3ZSBrbm93IGFib3V0ID8/P1xuICAgIGlmICghZXhpc3RpbmdFbnRyeSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX3Jlc291cmNlc1twYXlsb2FkLmRhdGEuaWRdID0gdGhpcy51cGRhdGVTdGF0ZWZ1bEVudHJ5KGV4aXN0aW5nRW50cnksIHBheWxvYWQuc3luY1N0YXRlLCBwYXlsb2FkLmRhdGEpO1xuXG4gICAgdGhpcy5lbWl0Q2hhbmdlKCk7XG4gIH1cblxuICBfb25EZWxldGUocGF5bG9hZCkge1xuICAgIGNvbnNvbGUuZGVidWcoYCR7dGhpcy5nZXRTdG9yZU5hbWUoKX06X29uRGVsZXRlOyBzdGF0ZT0ke3BheWxvYWQuc3luY1N0YXRlfWApO1xuXG4gICAgaWYgKCF0aGlzLl9yZXNvdXJjZXMpIHsgdGhpcy5fcmVzb3VyY2VzID0ge307IH1cblxuICAgIHZhciBleGlzdGluZ0VudHJ5ID0gdGhpcy5fcmVzb3VyY2VzW3BheWxvYWQuZGF0YS5pZF07XG5cbiAgICAvLyBjYW4gb25seSBkZWxldGUgYW4gZW50cnkgd2Uga25vdyBhYm91dFxuICAgIGlmICghZXhpc3RpbmdFbnRyeSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChleGlzdGluZ0VudHJ5KSB7XG4gICAgICBzd2l0Y2gocGF5bG9hZC5zeW5jU3RhdGUpIHtcbiAgICAgICAgY2FzZSBrU3RhdGVzLkRFTEVUSU5HOlxuICAgICAgICAgIGV4aXN0aW5nRW50cnkgPSB0aGlzLnVwZGF0ZVN0YXRlZnVsRW50cnkoZXhpc3RpbmdFbnRyeSwgcGF5bG9hZC5zeW5jU3RhdGUpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIGtTdGF0ZXMuU1lOQ0VEOlxuICAgICAgICAgIC8vIHVuc3Vic2NyaWJlIGZyb20gcmVzb3VyY2VcbiAgICAgICAgICB0aGlzLl9hY3Rpb25zLnVuc3Vic2NyaWJlUmVzb3VyY2VzKHBheWxvYWQuZGF0YS5pZCk7XG4gICAgICAgICAgZGVsZXRlIHRoaXMuX3Jlc291cmNlc1twYXlsb2FkLmRhdGEuaWRdO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmVtaXRDaGFuZ2UoKTtcbiAgICB9XG4gIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENSVURTdG9yZTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pTDFWelpYSnpMMmhpZFhKeWIzZHpMMlJsZGk5b1pYSnZhM1V2Y21WaFkzUXRabXgxZUMxemRHRnlkR1Z5TDNCMVlteHBZeTlxWVhaaGMyTnlhWEIwY3k5emRHOXlaWE12WTNKMVpDMWlZWE5sTG1weklpd2ljMjkxY21ObGN5STZXeUl2VlhObGNuTXZhR0oxY25KdmQzTXZaR1YyTDJobGNtOXJkUzl5WldGamRDMW1iSFY0TFhOMFlYSjBaWEl2Y0hWaWJHbGpMMnBoZG1GelkzSnBjSFJ6TDNOMGIzSmxjeTlqY25Wa0xXSmhjMlV1YW5NaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWtGQlFVRXNXVUZCV1N4RFFVRkRPenRCUVVWaUxFbEJRVWtzUTBGQlF5eEhRVUZITEU5QlFVOHNRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJRenM3UVVGRk1VSXNTVUZCU1N4VFFVRlRMRWRCUVVjc1QwRkJUeXhEUVVGRExGRkJRVkVzUTBGQlF5eERRVUZET3p0QlFVVnNReXhKUVVGSkxGRkJRVkVzUjBGQlJ5eFBRVUZQTEVOQlFVTXNjMEpCUVhOQ0xFTkJRVU03UVVGRE9VTXNTVUZCU1N4UFFVRlBMRWRCUVVjc1QwRkJUeXhEUVVGRExIRkNRVUZ4UWl4RFFVRkRMRU5CUVVNN1FVRkROME03TzBGQlJVRXNVMEZCVXl4blFrRkJaMElzUTBGQlF5eGpRVUZqTEVWQlFVVXNUVUZCVFN4RlFVRkZPMFZCUTJoRUxFOUJRVThzVVVGQlVTeERRVUZETEdOQlFXTXNSMEZCUnl4SFFVRkhMRWRCUVVjc1RVRkJUU3hEUVVGRExFTkJRVU03UVVGRGFrUXNRMEZCUXpzN1FVRkZSQ3hOUVVGTkxGTkJRVk1zVTBGQlV5eFRRVUZUTEVOQlFVTTdPMFZCUldoRExGZEJRVmNzYzBOQlFYTkRPMEZCUTI1RUxFbEJRVWtzUzBGQlN5eERRVUZETEZWQlFWVXNRMEZCUXl4RFFVRkRPenRCUVVWMFFpeEpRVUZKTEVsQlFVa3NRMEZCUXl4VlFVRlZMRWRCUVVjc1UwRkJVeXhEUVVGRE96dEpRVVUxUWl4SlFVRkpMRU5CUVVNc1VVRkJVU3hIUVVGSExFOUJRVThzUTBGQlF6dEJRVU0xUWl4SlFVRkpMRWxCUVVrc1EwRkJReXhUUVVGVExFZEJRVWNzU1VGQlNTeERRVUZETEd0Q1FVRnJRaXhEUVVGRExHTkJRV01zUTBGQlF5eERRVUZETzBGQlF6ZEVPenRKUVVWSkxFOUJRVThzUTBGQlF5eGhRVUZoTEVWQlFVVXNRMEZCUXp0QlFVTTFRaXhIUVVGSE8wRkJRMGc3UVVGRFFUdEJRVU5CT3p0RlFVVkZMRTFCUVUwc1IwRkJSenRKUVVOUUxFOUJRVThzU1VGQlNTeERRVUZETEZWQlFWVXNTMEZCU3l4VFFVRlRMRWRCUVVjc1EwRkJReXhEUVVGRExFZEJRVWNzUTBGQlF5eEpRVUZKTEVOQlFVTXNWVUZCVlN4RlFVRkZMRkZCUVZFc1NVRkJTU3hSUVVGUkxFTkJRVU1zUjBGQlJ5eEpRVUZKTEVOQlFVTXNVVUZCVVN4RlFVRkZMRU5CUVVNN1FVRkRNVWNzUjBGQlJ6dEJRVU5JTzBGQlEwRTdRVUZEUVRzN1JVRkZSU3hIUVVGSExFdEJRVXM3U1VGRFRpeFBRVUZQTEVsQlFVa3NRMEZCUXl4VlFVRlZMRXRCUVVzc1UwRkJVeXhKUVVGSkxFVkJRVVVzU1VGQlNTeEpRVUZKTEVOQlFVTXNWVUZCVlN4SFFVRkhMRWxCUVVrc1EwRkJReXhWUVVGVkxFTkJRVU1zUlVGQlJTeERRVUZETEVkQlFVY3NTVUZCU1N4RFFVRkRMRkZCUVZFc1EwRkJReXhGUVVGRkxFTkJRVU1zU1VGQlNTeEpRVUZKTEVOQlFVTXNVVUZCVVN4RlFVRkZMRU5CUVVNN1FVRkRMMGdzUjBGQlJ6dEJRVU5JTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRGUVVWRkxGZEJRVmNzUjBGQlJ6dEpRVU5hTEU5QlFVOHNTVUZCU1N4RFFVRkRMRk5CUVZNc1EwRkJRenRCUVVNeFFpeEhRVUZIT3p0RlFVVkVMR3RDUVVGclFpeHBRa0ZCYVVJN1NVRkRha01zVDBGQlR5eERRVUZETEVOQlFVTXNVMEZCVXl4RFFVRkRPMDFCUTJwQ0xFTkJRVU1zWjBKQlFXZENMRU5CUVVNc1kwRkJZeXhGUVVGRkxGRkJRVkVzUTBGQlF5eEZRVUZGTEZkQlFWY3NRMEZCUXp0TlFVTjZSQ3hEUVVGRExHZENRVUZuUWl4RFFVRkRMR05CUVdNc1JVRkJSU3hSUVVGUkxFTkJRVU1zUlVGQlJTeFhRVUZYTEVOQlFVTTdUVUZEZWtRc1EwRkJReXhuUWtGQlowSXNRMEZCUXl4alFVRmpMRVZCUVVVc1RVRkJUU3hEUVVGRExFVkJRVVVzVTBGQlV5eERRVUZETzAxQlEzSkVMRU5CUVVNc1owSkJRV2RDTEVOQlFVTXNZMEZCWXl4RlFVRkZMRXRCUVVzc1EwRkJReXhGUVVGRkxGRkJRVkVzUTBGQlF6dE5RVU51UkN4RFFVRkRMR2RDUVVGblFpeERRVUZETEdOQlFXTXNSVUZCUlN4UlFVRlJMRU5CUVVNc1JVRkJSU3hYUVVGWExFTkJRVU03UzBGRE1VUXNRMEZCUXl4RFFVRkRPMEZCUTFBc1IwRkJSenRCUVVOSU8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0RlFVVkZMRkZCUVZFc1IwRkJSenRKUVVOVUxFbEJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVTXNUVUZCVFN4RlFVRkZMRU5CUVVNN1NVRkRka0lzVDBGQlR5eFRRVUZUTEVOQlFVTTdRVUZEY2tJc1IwRkJSenM3UlVGRlJDeFJRVUZSTEV0QlFVczdTVUZEV0N4SlFVRkpMRU5CUVVNc1VVRkJVU3hEUVVGRExFZEJRVWNzUTBGQlF5eEZRVUZGTEVOQlFVTXNRMEZCUXp0SlFVTjBRaXhQUVVGUExGTkJRVk1zUTBGQlF6dEJRVU55UWl4SFFVRkhPMEZCUTBnN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdSVUZGUlN4VFFVRlRMRlZCUVZVN1FVRkRja0lzU1VGQlNTeFBRVUZQTEVOQlFVTXNTMEZCU3l4RFFVRkRMRWRCUVVjc1NVRkJTU3hEUVVGRExGbEJRVmtzUlVGQlJTeHhRa0ZCY1VJc1QwRkJUeXhEUVVGRExGTkJRVk1zUlVGQlJTeERRVUZETEVOQlFVTTdPMGxCUlRsRkxFOUJRVThzVDBGQlR5eERRVUZETEZOQlFWTTdUVUZEZEVJc1MwRkJTeXhQUVVGUExFTkJRVU1zVDBGQlR6dFJRVU5zUWl4SlFVRkpMRU5CUVVNc1VVRkJVU3hIUVVGSExFbEJRVWtzUTBGQlF6dFJRVU55UWl4TlFVRk5PMEZCUTJRc1RVRkJUU3hMUVVGTExFOUJRVThzUTBGQlF5eE5RVUZOTzBGQlEzcENPenRSUVVWUkxFbEJRVWtzU1VGQlNTeERRVUZETEZWQlFWVXNSVUZCUlR0VlFVTnVRaXhKUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETEc5Q1FVRnZRaXhEUVVGRExFTkJRVU1zUTBGQlF5eEhRVUZITEVOQlFVTXNTVUZCU1N4RFFVRkRMRlZCUVZVc1JVRkJSU3hSUVVGUkxFbEJRVWtzVVVGQlVTeERRVUZETEVsQlFVa3NRMEZCUXl4RlFVRkZMRU5CUVVNc1EwRkJReXhEUVVGRE8wRkJRMjVITEZOQlFWTTdRVUZEVkRzN1VVRkZVU3hKUVVGSkxFZEJRVWNzUjBGQlJ5eERRVUZETEVOQlFVTXNSMEZCUnl4RFFVRkRMRTlCUVU4c1EwRkJReXhKUVVGSkxFVkJRVVVzU1VGQlNTeEpRVUZKTEVOQlFVTXNTVUZCU1N4RFFVRkRMRVZCUVVVc1JVRkJSU3hKUVVGSkxFTkJRVU1zYVVKQlFXbENMRU5CUVVNc1QwRkJUeXhEUVVGRExGTkJRVk1zUlVGQlJTeEpRVUZKTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN1FVRkRNVWNzVVVGQlVTeEpRVUZKTEVOQlFVTXNWVUZCVlN4SFFVRkhMRU5CUVVNc1EwRkJReXhUUVVGVExFTkJRVU1zUjBGQlJ5eERRVUZETEVOQlFVTTdPMEZCUlRORExGRkJRVkVzU1VGQlNTeERRVUZETEZGQlFWRXNRMEZCUXl4clFrRkJhMElzUTBGQlF5eERRVUZETEVOQlFVTXNSMEZCUnl4RFFVRkRMRWxCUVVrc1EwRkJReXhWUVVGVkxFVkJRVVVzVVVGQlVTeEpRVUZKTEZGQlFWRXNRMEZCUXl4SlFVRkpMRU5CUVVNc1JVRkJSU3hEUVVGRExFTkJRVU1zUTBGQlF6czdVVUZGZGtZc1NVRkJTU3hEUVVGRExGRkJRVkVzUjBGQlJ5eExRVUZMTEVOQlFVTTdVVUZEZEVJc1RVRkJUVHRCUVVOa0xFdEJRVXM3TzBsQlJVUXNTVUZCU1N4RFFVRkRMRlZCUVZVc1JVRkJSU3hEUVVGRE8wRkJRM1JDTEVkQlFVYzdPMFZCUlVRc1UwRkJVeXhWUVVGVk8wRkJRM0pDTEVsQlFVa3NUMEZCVHl4RFFVRkRMRXRCUVVzc1EwRkJReXhIUVVGSExFbEJRVWtzUTBGQlF5eFpRVUZaTEVWQlFVVXNjVUpCUVhGQ0xFOUJRVThzUTBGQlF5eFRRVUZUTEVWQlFVVXNRMEZCUXl4RFFVRkRPenRCUVVWc1JpeEpRVUZKTEVsQlFVa3NUVUZCVFN4RFFVRkRPenRKUVVWWUxFOUJRVThzVDBGQlR5eERRVUZETEZOQlFWTTdUVUZEZEVJc1MwRkJTeXhQUVVGUExFTkJRVU1zVDBGQlR6dFJRVU5zUWl4SlFVRkpMRU5CUVVNc1VVRkJVU3hIUVVGSExFbEJRVWtzUTBGQlF6dFJRVU55UWl4TlFVRk5PMDFCUTFJc1MwRkJTeXhQUVVGUExFTkJRVU1zVFVGQlRUdFJRVU5xUWl4SlFVRkpMRU5CUVVNc1ZVRkJWU3hIUVVGSExFbEJRVWtzUTBGQlF5eFZRVUZWTEVsQlFVa3NSVUZCUlN4RFFVRkRPMUZCUTNoRExFMUJRVTBzUjBGQlJ5eERRVUZETEVOQlFVTXNTVUZCU1N4RFFVRkRMRlZCUVZVc1EwRkJReXhQUVVGUExFTkJRVU1zU1VGQlNTeERRVUZETEVWQlFVVXNRMEZCUXl4RFFVRkRPMEZCUTNCRUxGRkJRVkVzU1VGQlNTeERRVUZETEZWQlFWVXNRMEZCUXl4UFFVRlBMRU5CUVVNc1NVRkJTU3hEUVVGRExFVkJRVVVzUTBGQlF5eEhRVUZITEVsQlFVa3NRMEZCUXl4cFFrRkJhVUlzUTBGQlF5eFBRVUZQTEVOQlFVTXNVMEZCVXl4RlFVRkZMRTlCUVU4c1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF6czdVVUZGTTBZc1NVRkJTU3hEUVVGRExFMUJRVTBzUlVGQlJUdFZRVU5ZTEVsQlFVa3NRMEZCUXl4UlFVRlJMRU5CUVVNc2EwSkJRV3RDTEVOQlFVTXNUMEZCVHl4RFFVRkRMRWxCUVVrc1EwRkJReXhGUVVGRkxFTkJRVU1zUTBGQlF6dFRRVU51UkR0UlFVTkVMRWxCUVVrc1EwRkJReXhSUVVGUkxFZEJRVWNzUzBGQlN5eERRVUZETzFGQlEzUkNMRTFCUVUwN1FVRkRaQ3hMUVVGTE96dEJRVVZNTEVsQlFVa3NTVUZCU1N4RFFVRkRMRlZCUVZVc1JVRkJSU3hEUVVGRE96dEJRVVYwUWl4SFFVRkhPenRGUVVWRUxFOUJRVThzVlVGQlZUdEJRVU51UWl4SlFVRkpMRTlCUVU4c1EwRkJReXhMUVVGTExFTkJRVU1zUjBGQlJ5eEpRVUZKTEVOQlFVTXNXVUZCV1N4RlFVRkZMRzFDUVVGdFFpeFBRVUZQTEVOQlFVTXNVMEZCVXl4RlFVRkZMRU5CUVVNc1EwRkJRenM3UVVGRmFFWXNTVUZCU1N4SlFVRkpMRU5CUVVNc1NVRkJTU3hEUVVGRExGVkJRVlVzUlVGQlJTeEZRVUZGTEVsQlFVa3NRMEZCUXl4VlFVRlZMRWRCUVVjc1JVRkJSU3hEUVVGRExFVkJRVVU3TzBGQlJXNUVMRWxCUVVrc1NVRkJTU3hEUVVGRExGVkJRVlVzUTBGQlF5eFBRVUZQTEVOQlFVTXNTVUZCU1N4RFFVRkRMRVZCUVVVc1EwRkJReXhIUVVGSExFbEJRVWtzUTBGQlF5eHBRa0ZCYVVJc1EwRkJReXhQUVVGUExFTkJRVU1zVTBGQlV5eEZRVUZGTEU5QlFVOHNRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJRenRCUVVNdlJqczdTVUZGU1N4SlFVRkpMRTlCUVU4c1EwRkJReXhUUVVGVExFdEJRVXNzVDBGQlR5eERRVUZETEUxQlFVMHNSVUZCUlR0TlFVTjRReXhKUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETEd0Q1FVRnJRaXhEUVVGRExFOUJRVThzUTBGQlF5eEpRVUZKTEVOQlFVTXNSVUZCUlN4RFFVRkRMRU5CUVVNN1FVRkRlRVFzUzBGQlN6czdTVUZGUkN4SlFVRkpMRU5CUVVNc1ZVRkJWU3hGUVVGRkxFTkJRVU03UVVGRGRFSXNSMEZCUnpzN1JVRkZSQ3hOUVVGTkxGVkJRVlU3UVVGRGJFSXNTVUZCU1N4UFFVRlBMRU5CUVVNc1MwRkJTeXhEUVVGRExFZEJRVWNzU1VGQlNTeERRVUZETEZsQlFWa3NSVUZCUlN4clFrRkJhMElzVDBGQlR5eERRVUZETEZOQlFWTXNSVUZCUlN4RFFVRkRMRU5CUVVNN08wRkJSUzlGTEVsQlFVa3NTVUZCU1N4RFFVRkRMRWxCUVVrc1EwRkJReXhWUVVGVkxFVkJRVVVzUlVGQlJTeEpRVUZKTEVOQlFVTXNWVUZCVlN4SFFVRkhMRVZCUVVVc1EwRkJReXhGUVVGRk96dEJRVVZ1UkN4SlFVRkpMRWxCUVVrc1lVRkJZU3hIUVVGSExFbEJRVWtzUTBGQlF5eFZRVUZWTEVOQlFVTXNUMEZCVHl4RFFVRkRMRWxCUVVrc1EwRkJReXhGUVVGRkxFTkJRVU1zUTBGQlF6dEJRVU42UkRzN1NVRkZTU3hKUVVGSkxFTkJRVU1zWVVGQllTeEZRVUZGTzAxQlEyeENMRTlCUVU4N1FVRkRZaXhMUVVGTE96dEJRVVZNTEVsQlFVa3NTVUZCU1N4RFFVRkRMRlZCUVZVc1EwRkJReXhQUVVGUExFTkJRVU1zU1VGQlNTeERRVUZETEVWQlFVVXNRMEZCUXl4SFFVRkhMRWxCUVVrc1EwRkJReXh0UWtGQmJVSXNRMEZCUXl4aFFVRmhMRVZCUVVVc1QwRkJUeXhEUVVGRExGTkJRVk1zUlVGQlJTeFBRVUZQTEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNN08wbEJSVFZITEVsQlFVa3NRMEZCUXl4VlFVRlZMRVZCUVVVc1EwRkJRenRCUVVOMFFpeEhRVUZIT3p0RlFVVkVMRk5CUVZNc1ZVRkJWVHRCUVVOeVFpeEpRVUZKTEU5QlFVOHNRMEZCUXl4TFFVRkxMRU5CUVVNc1IwRkJSeXhKUVVGSkxFTkJRVU1zV1VGQldTeEZRVUZGTEhGQ1FVRnhRaXhQUVVGUExFTkJRVU1zVTBGQlV5eEZRVUZGTEVOQlFVTXNRMEZCUXpzN1FVRkZiRVlzU1VGQlNTeEpRVUZKTEVOQlFVTXNTVUZCU1N4RFFVRkRMRlZCUVZVc1JVRkJSU3hGUVVGRkxFbEJRVWtzUTBGQlF5eFZRVUZWTEVkQlFVY3NSVUZCUlN4RFFVRkRMRVZCUVVVN08wRkJSVzVFTEVsQlFVa3NTVUZCU1N4aFFVRmhMRWRCUVVjc1NVRkJTU3hEUVVGRExGVkJRVlVzUTBGQlF5eFBRVUZQTEVOQlFVTXNTVUZCU1N4RFFVRkRMRVZCUVVVc1EwRkJReXhEUVVGRE8wRkJRM3BFT3p0SlFVVkpMRWxCUVVrc1EwRkJReXhoUVVGaExFVkJRVVU3VFVGRGJFSXNUMEZCVHp0QlFVTmlMRXRCUVVzN08wbEJSVVFzU1VGQlNTeGhRVUZoTEVWQlFVVTdUVUZEYWtJc1QwRkJUeXhQUVVGUExFTkJRVU1zVTBGQlV6dFJRVU4wUWl4TFFVRkxMRTlCUVU4c1EwRkJReXhSUVVGUk8xVkJRMjVDTEdGQlFXRXNSMEZCUnl4SlFVRkpMRU5CUVVNc2JVSkJRVzFDTEVOQlFVTXNZVUZCWVN4RlFVRkZMRTlCUVU4c1EwRkJReXhUUVVGVExFTkJRVU1zUTBGQlF6dFZRVU16UlN4TlFVRk5PMEZCUTJoQ0xGRkJRVkVzUzBGQlN5eFBRVUZQTEVOQlFVTXNUVUZCVFRzN1ZVRkZha0lzU1VGQlNTeERRVUZETEZGQlFWRXNRMEZCUXl4dlFrRkJiMElzUTBGQlF5eFBRVUZQTEVOQlFVTXNTVUZCU1N4RFFVRkRMRVZCUVVVc1EwRkJReXhEUVVGRE8xVkJRM0JFTEU5QlFVOHNTVUZCU1N4RFFVRkRMRlZCUVZVc1EwRkJReXhQUVVGUExFTkJRVU1zU1VGQlNTeERRVUZETEVWQlFVVXNRMEZCUXl4RFFVRkRPMVZCUTNoRExFMUJRVTA3UVVGRGFFSXNUMEZCVHpzN1RVRkZSQ3hKUVVGSkxFTkJRVU1zVlVGQlZTeEZRVUZGTEVOQlFVTTdTMEZEYmtJN1FVRkRUQ3hIUVVGSE96dEJRVVZJTEVOQlFVTTdPMEZCUlVRc1RVRkJUU3hEUVVGRExFOUJRVThzUjBGQlJ5eFRRVUZUTEVOQlFVTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUluZFhObElITjBjbWxqZENjN1hHNWNiblpoY2lCZklEMGdjbVZ4ZFdseVpTZ25iRzlrWVhOb0p5azdYRzVjYm5aaGNpQkNZWE5sVTNSdmNtVWdQU0J5WlhGMWFYSmxLQ2N1TDJKaGMyVW5LVHRjYmx4dWRtRnlJR3RCWTNScGIyNXpJRDBnY21WeGRXbHlaU2duTGk0dlkyOXVjM1JoYm5SekwyRmpkR2x2Ym5NbktTeGNiaUFnSUNCclUzUmhkR1Z6SUQwZ2NtVnhkV2x5WlNnbkxpNHZZMjl1YzNSaGJuUnpMM04wWVhSbGN5Y3BPMXh1WEc1Y2JtWjFibU4wYVc5dUlGOWhZM1JwYjI1R2IzSk5aWFJvYjJRb1lXTjBhVzl1VDJKcVpXTjBTV1FzSUcxbGRHaHZaQ2tnZTF4dUlDQnlaWFIxY200Z2EwRmpkR2x2Ym5OYllXTjBhVzl1VDJKcVpXTjBTV1FnS3lBblh5Y2dLeUJ0WlhSb2IyUmRPMXh1ZlZ4dVhHNWpiR0Z6Y3lCRFVsVkVVM1J2Y21VZ1pYaDBaVzVrY3lCQ1lYTmxVM1J2Y21VZ2UxeHVYRzRnSUdOdmJuTjBjblZqZEc5eUtHUnBjM0JoZEdOb1pYSXNJR0ZqZEdsdmJuTXNJR0ZqZEdsdmJrOWlhbVZqZEVsa0tTQjdYRzRnSUNBZ2MzVndaWElvWkdsemNHRjBZMmhsY2lrN1hHNWNiaUFnSUNCMGFHbHpMbDl5WlhOdmRYSmpaWE1nUFNCMWJtUmxabWx1WldRN1hHNWNiaUFnSUNCMGFHbHpMbDloWTNScGIyNXpJRDBnWVdOMGFXOXVjenRjYmlBZ0lDQjBhR2x6TGw5b1lXNWtiR1Z5Y3lBOUlIUm9hWE11WDJkbGRFRmpkR2x2YmtoaGJtUnNaWEp6S0dGamRHbHZiazlpYW1WamRFbGtLVHRjYmx4dUlDQWdJQzh2SUhOMVluTmpjbWxpWlNCMGFHVWdjM1J2Y21VZ2RHOGdkR2hsSUNkblpYUkJiR3duSUd4cGMzUWdaVzVrY0c5cGJuUmNiaUFnSUNCaFkzUnBiMjV6TG5OMVluTmpjbWxpWlV4cGMzUW9LVHRjYmlBZ2ZWeHVYRzRnSUM4cUtseHVJQ0FnS2lCSFpYUWdZWEp5WVhrZ2IyWWdZV3hzSUhKbGMyOTFjbU5sYzF4dUlDQWdLaTljYmlBZ1oyVjBRV3hzS0NrZ2UxeHVJQ0FnSUhKbGRIVnliaUIwYUdsekxsOXlaWE52ZFhKalpYTWdJVDA5SUhWdVpHVm1hVzVsWkNBL0lGOHViV0Z3S0hSb2FYTXVYM0psYzI5MWNtTmxjeXdnY21WemIzVnlZMlVnUFQ0Z2NtVnpiM1Z5WTJVcElEb2dkR2hwY3k1ZmJHOWhaRUZzYkNncE8xeHVJQ0I5WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJRWRsZENCemFXNW5iR1VnY21WemIzVnlZMlZjYmlBZ0lDb3ZYRzRnSUdkbGRDaHBaQ2tnZTF4dUlDQWdJSEpsZEhWeWJpQjBhR2x6TGw5eVpYTnZkWEpqWlhNZ0lUMDlJSFZ1WkdWbWFXNWxaQ0EvSUNocFpDQnBiaUIwYUdsekxsOXlaWE52ZFhKalpYTWdQeUIwYUdsekxsOXlaWE52ZFhKalpYTmJhV1JkSURvZ2RHaHBjeTVmYkc5aFpFOXVaU2hwWkNrcElEb2dkR2hwY3k1ZmJHOWhaRUZzYkNncE8xeHVJQ0I5WEc1Y2JseHVJQ0F2S2lwY2JpQWdJQ29nVTNWd2NHOXlkQ0JtYjNJZ1pHVm1hVzVwYm1jZ1lXNWtJR2RsZEhScGJtY2dZV04wYVc5dUlHaGhibVJzWlhJZ2JXRndYRzRnSUNBcUwxeHVJQ0JmWjJWMFFXTjBhVzl1Y3lncElIdGNiaUFnSUNCeVpYUjFjbTRnZEdocGN5NWZhR0Z1Wkd4bGNuTTdYRzRnSUgxY2JseHVJQ0JmWjJWMFFXTjBhVzl1U0dGdVpHeGxjbk1vWVdOMGFXOXVUMkpxWldOMFNXUXBJSHRjYmlBZ0lDQnlaWFIxY200Z1h5NTZhWEJQWW1wbFkzUW9XMXh1SUNBZ0lDQWdXMTloWTNScGIyNUdiM0pOWlhSb2IyUW9ZV04wYVc5dVQySnFaV04wU1dRc0lDZEhSVlJCVEV3bktTd2dKMTl2YmtkbGRFRnNiQ2RkTEZ4dUlDQWdJQ0FnVzE5aFkzUnBiMjVHYjNKTlpYUm9iMlFvWVdOMGFXOXVUMkpxWldOMFNXUXNJQ2RIUlZSUFRrVW5LU3dnSjE5dmJrZGxkRTl1WlNkZExGeHVJQ0FnSUNBZ1cxOWhZM1JwYjI1R2IzSk5aWFJvYjJRb1lXTjBhVzl1VDJKcVpXTjBTV1FzSUNkUVQxTlVKeWtzSUNkZmIyNVFiM04wSjEwc1hHNGdJQ0FnSUNCYlgyRmpkR2x2YmtadmNrMWxkR2h2WkNoaFkzUnBiMjVQWW1wbFkzUkpaQ3dnSjFCVlZDY3BMQ0FuWDI5dVVIVjBKMTBzWEc0Z0lDQWdJQ0JiWDJGamRHbHZia1p2Y2sxbGRHaHZaQ2hoWTNScGIyNVBZbXBsWTNSSlpDd2dKMFJGVEVWVVJTY3BMQ0FuWDI5dVJHVnNaWFJsSjExY2JpQWdJQ0JkS1R0Y2JpQWdmVnh1WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJRlYwYVd4cGRIa2diV1YwYUc5a2MxeHVJQ0FnS2k5Y2JpQWdYMnh2WVdSQmJHd29LU0I3WEc0Z0lDQWdkR2hwY3k1ZllXTjBhVzl1Y3k1blpYUkJiR3dvS1R0Y2JpQWdJQ0J5WlhSMWNtNGdkVzVrWldacGJtVmtPMXh1SUNCOVhHNWNiaUFnWDJ4dllXUlBibVVvYVdRcElIdGNiaUFnSUNCMGFHbHpMbDloWTNScGIyNXpMbWRsZENocFpDazdYRzRnSUNBZ2NtVjBkWEp1SUhWdVpHVm1hVzVsWkR0Y2JpQWdmVnh1WEc0Z0lDOHFLbHh1SUNBZ0tseHVJQ0FnS2lCQlkzUnBiMjRnU0dGdVpHeGxjbk5jYmlBZ0lDcGNiaUFnSUNvdlhHNGdJRjl2YmtkbGRFRnNiQ2h3WVhsc2IyRmtLU0I3WEc0Z0lDQWdZMjl1YzI5c1pTNWtaV0oxWnloZ0pIdDBhR2x6TG1kbGRGTjBiM0psVG1GdFpTZ3BmVHBmYjI1SFpYUkJiR3c3SUhOMFlYUmxQU1I3Y0dGNWJHOWhaQzV6ZVc1alUzUmhkR1Y5WUNrN1hHNWNiaUFnSUNCemQybDBZMmdvY0dGNWJHOWhaQzV6ZVc1alUzUmhkR1VwSUh0Y2JpQWdJQ0FnSUdOaGMyVWdhMU4wWVhSbGN5NU1UMEZFU1U1SE9seHVJQ0FnSUNBZ0lDQjBhR2x6TG1sdVpteHBaMmgwSUQwZ2RISjFaVHRjYmlBZ0lDQWdJQ0FnWW5KbFlXczdYRzRnSUNBZ0lDQmpZWE5sSUd0VGRHRjBaWE11VTFsT1EwVkVPbHh1WEc0Z0lDQWdJQ0FnSUM4dklIVnVjM1ZpYzJOeWFXSmxJR1p5YjIwZ2NtVnpiM1Z5WTJVZ2QyVmljMjlqYTJWMElHVjJaVzUwY3lCcFppQjNaU0JoYkhKbFlXUjVJR2hoZG1VZ2NtVnpiM1Z5WTJWelhHNGdJQ0FnSUNBZ0lHbG1JQ2gwYUdsekxsOXlaWE52ZFhKalpYTXBJSHRjYmlBZ0lDQWdJQ0FnSUNCMGFHbHpMbDloWTNScGIyNXpMblZ1YzNWaWMyTnlhV0psVW1WemIzVnlZMlZ6S0Y4dWJXRndLSFJvYVhNdVgzSmxjMjkxY21ObGN5d2djbVZ6YjNWeVkyVWdQVDRnY21WemIzVnlZMlV1WkdGMFlTNXBaQ2twTzF4dUlDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdMeThnYzNWaWMyTnlhV0psSUhSdklISmxjMjkxY21ObElIZGxZbk52WTJ0bGRDQmxkbVZ1ZEhOY2JpQWdJQ0FnSUNBZ2RtRnlJRzFoY0NBOUlGOHViV0Z3S0hCaGVXeHZZV1F1WkdGMFlTd2dhWFJsYlNBOVBpQmJhWFJsYlM1cFpDd2dkR2hwY3k1dFlXdGxVM1JoZEdWbWRXeEZiblJ5ZVNod1lYbHNiMkZrTG5ONWJtTlRkR0YwWlN3Z2FYUmxiU2xkS1R0Y2JpQWdJQ0FnSUNBZ2RHaHBjeTVmY21WemIzVnlZMlZ6SUQwZ1h5NTZhWEJQWW1wbFkzUW9iV0Z3S1R0Y2JseHVJQ0FnSUNBZ0lDQjBhR2x6TGw5aFkzUnBiMjV6TG5OMVluTmpjbWxpWlZKbGMyOTFjbU5sY3loZkxtMWhjQ2gwYUdsekxsOXlaWE52ZFhKalpYTXNJSEpsYzI5MWNtTmxJRDArSUhKbGMyOTFjbU5sTG1SaGRHRXVhV1FwS1R0Y2JseHVJQ0FnSUNBZ0lDQjBhR2x6TG1sdVpteHBaMmgwSUQwZ1ptRnNjMlU3WEc0Z0lDQWdJQ0FnSUdKeVpXRnJPMXh1SUNBZ0lIMWNibHh1SUNBZ0lIUm9hWE11WlcxcGRFTm9ZVzVuWlNncE8xeHVJQ0I5WEc1Y2JpQWdYMjl1UjJWMFQyNWxLSEJoZVd4dllXUXBJSHRjYmlBZ0lDQmpiMjV6YjJ4bExtUmxZblZuS0dBa2UzUm9hWE11WjJWMFUzUnZjbVZPWVcxbEtDbDlPbDl2YmtkbGRFRnNiRHNnYzNSaGRHVTlKSHR3WVhsc2IyRmtMbk41Ym1OVGRHRjBaWDFnS1R0Y2JseHVJQ0FnSUhaaGNpQmxlR2x6ZEhNN1hHNWNiaUFnSUNCemQybDBZMmdvY0dGNWJHOWhaQzV6ZVc1alUzUmhkR1VwSUh0Y2JpQWdJQ0FnSUdOaGMyVWdhMU4wWVhSbGN5NU1UMEZFU1U1SE9seHVJQ0FnSUNBZ0lDQjBhR2x6TG1sdVpteHBaMmgwSUQwZ2RISjFaVHRjYmlBZ0lDQWdJQ0FnWW5KbFlXczdYRzRnSUNBZ0lDQmpZWE5sSUd0VGRHRjBaWE11VTFsT1EwVkVPbHh1SUNBZ0lDQWdJQ0IwYUdsekxsOXlaWE52ZFhKalpYTWdQU0IwYUdsekxsOXlaWE52ZFhKalpYTWdmSHdnZTMwN1hHNGdJQ0FnSUNBZ0lHVjRhWE4wY3lBOUlDRWhkR2hwY3k1ZmNtVnpiM1Z5WTJWelczQmhlV3h2WVdRdVpHRjBZUzVwWkYwN1hHNGdJQ0FnSUNBZ0lIUm9hWE11WDNKbGMyOTFjbU5sYzF0d1lYbHNiMkZrTG1SaGRHRXVhV1JkSUQwZ2RHaHBjeTV0WVd0bFUzUmhkR1ZtZFd4RmJuUnllU2h3WVhsc2IyRmtMbk41Ym1OVGRHRjBaU3dnY0dGNWJHOWhaQzVrWVhSaEtUdGNiaUFnSUNBZ0lDQWdMeThnYjI1c2VTQnpkV0p6WTNKcFltVWdkRzhnY21WemIzVnlZMlVnZDJWaWMyOWphMlYwSUdWMlpXNTBjeUJwWmlCMGFHVWdjbVZ6YjNWeVkyVWdhWE1nYm1WM1hHNGdJQ0FnSUNBZ0lHbG1JQ2doWlhocGMzUnpLU0I3WEc0Z0lDQWdJQ0FnSUNBZ2RHaHBjeTVmWVdOMGFXOXVjeTV6ZFdKelkzSnBZbVZTWlhOdmRYSmpaWE1vY0dGNWJHOWhaQzVrWVhSaExtbGtLVHRjYmlBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnSUNCMGFHbHpMbWx1Wm14cFoyaDBJRDBnWm1Gc2MyVTdYRzRnSUNBZ0lDQWdJR0p5WldGck8xeHVJQ0FnSUgxY2JseHVJQ0FnSUhSb2FYTXVaVzFwZEVOb1lXNW5aU2dwTzF4dVhHNGdJSDFjYmx4dUlDQmZiMjVRYjNOMEtIQmhlV3h2WVdRcElIdGNiaUFnSUNCamIyNXpiMnhsTG1SbFluVm5LR0FrZTNSb2FYTXVaMlYwVTNSdmNtVk9ZVzFsS0NsOU9sOXZibEJ2YzNRN0lITjBZWFJsUFNSN2NHRjViRzloWkM1emVXNWpVM1JoZEdWOVlDazdYRzVjYmlBZ0lDQnBaaUFvSVhSb2FYTXVYM0psYzI5MWNtTmxjeWtnZXlCMGFHbHpMbDl5WlhOdmRYSmpaWE1nUFNCN2ZUc2dmVnh1WEc0Z0lDQWdkR2hwY3k1ZmNtVnpiM1Z5WTJWelczQmhlV3h2WVdRdVpHRjBZUzVwWkYwZ1BTQjBhR2x6TG0xaGEyVlRkR0YwWldaMWJFVnVkSEo1S0hCaGVXeHZZV1F1YzNsdVkxTjBZWFJsTENCd1lYbHNiMkZrTG1SaGRHRXBPMXh1WEc0Z0lDQWdMeThnYzNWaWMyTnlhV0psSUhSdklISmxjMjkxY21ObElHOXViSGtnYjI0Z1UxbE9RMXh1SUNBZ0lHbG1JQ2h3WVhsc2IyRmtMbk41Ym1OVGRHRjBaU0E5UFQwZ2ExTjBZWFJsY3k1VFdVNURSVVFwSUh0Y2JpQWdJQ0FnSUhSb2FYTXVYMkZqZEdsdmJuTXVjM1ZpYzJOeWFXSmxVbVZ6YjNWeVkyVnpLSEJoZVd4dllXUXVaR0YwWVM1cFpDazdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2RHaHBjeTVsYldsMFEyaGhibWRsS0NrN1hHNGdJSDFjYmx4dUlDQmZiMjVRZFhRb2NHRjViRzloWkNrZ2UxeHVJQ0FnSUdOdmJuTnZiR1V1WkdWaWRXY29ZQ1I3ZEdocGN5NW5aWFJUZEc5eVpVNWhiV1VvS1gwNlgyOXVVSFYwT3lCemRHRjBaVDBrZTNCaGVXeHZZV1F1YzNsdVkxTjBZWFJsZldBcE8xeHVYRzRnSUNBZ2FXWWdLQ0YwYUdsekxsOXlaWE52ZFhKalpYTXBJSHNnZEdocGN5NWZjbVZ6YjNWeVkyVnpJRDBnZTMwN0lIMWNibHh1SUNBZ0lIWmhjaUJsZUdsemRHbHVaMFZ1ZEhKNUlEMGdkR2hwY3k1ZmNtVnpiM1Z5WTJWelczQmhlV3h2WVdRdVpHRjBZUzVwWkYwN1hHNWNiaUFnSUNBdkx5QmpZVzRnYjI1c2VTQjFjR1JoZEdVZ1lXNGdaVzUwY25rZ2QyVWdhMjV2ZHlCaFltOTFkQ0EvUHo5Y2JpQWdJQ0JwWmlBb0lXVjRhWE4wYVc1blJXNTBjbmtwSUh0Y2JpQWdJQ0FnSUhKbGRIVnlianRjYmlBZ0lDQjlYRzVjYmlBZ0lDQjBhR2x6TGw5eVpYTnZkWEpqWlhOYmNHRjViRzloWkM1a1lYUmhMbWxrWFNBOUlIUm9hWE11ZFhCa1lYUmxVM1JoZEdWbWRXeEZiblJ5ZVNobGVHbHpkR2x1WjBWdWRISjVMQ0J3WVhsc2IyRmtMbk41Ym1OVGRHRjBaU3dnY0dGNWJHOWhaQzVrWVhSaEtUdGNibHh1SUNBZ0lIUm9hWE11WlcxcGRFTm9ZVzVuWlNncE8xeHVJQ0I5WEc1Y2JpQWdYMjl1UkdWc1pYUmxLSEJoZVd4dllXUXBJSHRjYmlBZ0lDQmpiMjV6YjJ4bExtUmxZblZuS0dBa2UzUm9hWE11WjJWMFUzUnZjbVZPWVcxbEtDbDlPbDl2YmtSbGJHVjBaVHNnYzNSaGRHVTlKSHR3WVhsc2IyRmtMbk41Ym1OVGRHRjBaWDFnS1R0Y2JseHVJQ0FnSUdsbUlDZ2hkR2hwY3k1ZmNtVnpiM1Z5WTJWektTQjdJSFJvYVhNdVgzSmxjMjkxY21ObGN5QTlJSHQ5T3lCOVhHNWNiaUFnSUNCMllYSWdaWGhwYzNScGJtZEZiblJ5ZVNBOUlIUm9hWE11WDNKbGMyOTFjbU5sYzF0d1lYbHNiMkZrTG1SaGRHRXVhV1JkTzF4dVhHNGdJQ0FnTHk4Z1kyRnVJRzl1YkhrZ1pHVnNaWFJsSUdGdUlHVnVkSEo1SUhkbElHdHViM2NnWVdKdmRYUmNiaUFnSUNCcFppQW9JV1Y0YVhOMGFXNW5SVzUwY25rcElIdGNiaUFnSUNBZ0lISmxkSFZ5Ymp0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0JwWmlBb1pYaHBjM1JwYm1kRmJuUnllU2tnZTF4dUlDQWdJQ0FnYzNkcGRHTm9LSEJoZVd4dllXUXVjM2x1WTFOMFlYUmxLU0I3WEc0Z0lDQWdJQ0FnSUdOaGMyVWdhMU4wWVhSbGN5NUVSVXhGVkVsT1J6cGNiaUFnSUNBZ0lDQWdJQ0JsZUdsemRHbHVaMFZ1ZEhKNUlEMGdkR2hwY3k1MWNHUmhkR1ZUZEdGMFpXWjFiRVZ1ZEhKNUtHVjRhWE4wYVc1blJXNTBjbmtzSUhCaGVXeHZZV1F1YzNsdVkxTjBZWFJsS1R0Y2JpQWdJQ0FnSUNBZ0lDQmljbVZoYXp0Y2JpQWdJQ0FnSUNBZ1kyRnpaU0JyVTNSaGRHVnpMbE5aVGtORlJEcGNiaUFnSUNBZ0lDQWdJQ0F2THlCMWJuTjFZbk5qY21saVpTQm1jbTl0SUhKbGMyOTFjbU5sWEc0Z0lDQWdJQ0FnSUNBZ2RHaHBjeTVmWVdOMGFXOXVjeTUxYm5OMVluTmpjbWxpWlZKbGMyOTFjbU5sY3lod1lYbHNiMkZrTG1SaGRHRXVhV1FwTzF4dUlDQWdJQ0FnSUNBZ0lHUmxiR1YwWlNCMGFHbHpMbDl5WlhOdmRYSmpaWE5iY0dGNWJHOWhaQzVrWVhSaExtbGtYVHRjYmlBZ0lDQWdJQ0FnSUNCaWNtVmhhenRjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnZEdocGN5NWxiV2wwUTJoaGJtZGxLQ2s3WEc0Z0lDQWdmVnh1SUNCOVhHNWNibjFjYmx4dWJXOWtkV3hsTG1WNGNHOXlkSE1nUFNCRFVsVkVVM1J2Y21VN1hHNGlYWDA9IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgRGlzcGF0Y2hlciA9IHJlcXVpcmUoJy4uL2Rpc3BhdGNoZXInKTtcblxudmFyIEl0ZW1zU3RvcmUgPSByZXF1aXJlKCcuL2l0ZW1zJyksXG4gICAgU2VydmVyVGltZVN0b3JlID0gcmVxdWlyZSgnLi9zZXJ2ZXItdGltZScpLFxuICAgIE92ZXJsYXlzU3RvcmUgPSByZXF1aXJlKCcuL292ZXJsYXlzJyk7XG5cbmV4cG9ydHMuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uICgpIHtcblxuICBleHBvcnRzLkl0ZW1zU3RvcmUgPSBuZXcgSXRlbXNTdG9yZShEaXNwYXRjaGVyKTtcbiAgZXhwb3J0cy5TZXJ2ZXJUaW1lU3RvcmUgPSBuZXcgU2VydmVyVGltZVN0b3JlKERpc3BhdGNoZXIpO1xuXG4gIGV4cG9ydHMuT3ZlcmxheXNTdG9yZSA9IG5ldyBPdmVybGF5c1N0b3JlKERpc3BhdGNoZXIpO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pTDFWelpYSnpMMmhpZFhKeWIzZHpMMlJsZGk5b1pYSnZhM1V2Y21WaFkzUXRabXgxZUMxemRHRnlkR1Z5TDNCMVlteHBZeTlxWVhaaGMyTnlhWEIwY3k5emRHOXlaWE12YVc1a1pYZ3Vhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5b1luVnljbTkzY3k5a1pYWXZhR1Z5YjJ0MUwzSmxZV04wTFdac2RYZ3RjM1JoY25SbGNpOXdkV0pzYVdNdmFtRjJZWE5qY21sd2RITXZjM1J2Y21WekwybHVaR1Y0TG1weklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lKQlFVRkJMRmxCUVZrc1EwRkJRenM3UVVGRllpeEpRVUZKTEZWQlFWVXNSMEZCUnl4UFFVRlBMRU5CUVVNc1pVRkJaU3hEUVVGRExFTkJRVU03TzBGQlJURkRMRWxCUVVrc1ZVRkJWU3hIUVVGSExFOUJRVThzUTBGQlF5eFRRVUZUTEVOQlFVTTdTVUZETDBJc1pVRkJaU3hIUVVGSExFOUJRVThzUTBGQlF5eGxRVUZsTEVOQlFVTTdRVUZET1VNc1NVRkJTU3hoUVVGaExFZEJRVWNzVDBGQlR5eERRVUZETEZsQlFWa3NRMEZCUXl4RFFVRkRPenRCUVVVeFF5eFBRVUZQTEVOQlFVTXNWVUZCVlN4SFFVRkhMRmxCUVZrN08wVkJSUzlDTEU5QlFVOHNRMEZCUXl4VlFVRlZMRWRCUVVjc1NVRkJTU3hWUVVGVkxFTkJRVU1zVlVGQlZTeERRVUZETEVOQlFVTTdRVUZEYkVRc1JVRkJSU3hQUVVGUExFTkJRVU1zWlVGQlpTeEhRVUZITEVsQlFVa3NaVUZCWlN4RFFVRkRMRlZCUVZVc1EwRkJReXhEUVVGRE96dEJRVVUxUkN4RlFVRkZMRTlCUVU4c1EwRkJReXhoUVVGaExFZEJRVWNzU1VGQlNTeGhRVUZoTEVOQlFVTXNWVUZCVlN4RFFVRkRMRU5CUVVNN08wVkJSWFJFTEU5QlFVOHNTVUZCU1N4RFFVRkRPME5CUTJJc1EwRkJReUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSWlkMWMyVWdjM1J5YVdOMEp6dGNibHh1ZG1GeUlFUnBjM0JoZEdOb1pYSWdQU0J5WlhGMWFYSmxLQ2N1TGk5a2FYTndZWFJqYUdWeUp5azdYRzVjYm5aaGNpQkpkR1Z0YzFOMGIzSmxJRDBnY21WeGRXbHlaU2duTGk5cGRHVnRjeWNwTEZ4dUlDQWdJRk5sY25abGNsUnBiV1ZUZEc5eVpTQTlJSEpsY1hWcGNtVW9KeTR2YzJWeWRtVnlMWFJwYldVbktTeGNiaUFnSUNCUGRtVnliR0Y1YzFOMGIzSmxJRDBnY21WeGRXbHlaU2duTGk5dmRtVnliR0Y1Y3ljcE8xeHVYRzVsZUhCdmNuUnpMbWx1YVhScFlXeHBlbVVnUFNCbWRXNWpkR2x2YmlBb0tTQjdYRzVjYmlBZ1pYaHdiM0owY3k1SmRHVnRjMU4wYjNKbElEMGdibVYzSUVsMFpXMXpVM1J2Y21Vb1JHbHpjR0YwWTJobGNpazdYRzRnSUdWNGNHOXlkSE11VTJWeWRtVnlWR2x0WlZOMGIzSmxJRDBnYm1WM0lGTmxjblpsY2xScGJXVlRkRzl5WlNoRWFYTndZWFJqYUdWeUtUdGNibHh1SUNCbGVIQnZjblJ6TGs5MlpYSnNZWGx6VTNSdmNtVWdQU0J1WlhjZ1QzWmxjbXhoZVhOVGRHOXlaU2hFYVhOd1lYUmphR1Z5S1R0Y2JseHVJQ0J5WlhSMWNtNGdkR2hwY3p0Y2JuMDdYRzRpWFgwPSIsIid1c2Ugc3RyaWN0JztcblxudmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcblxudmFyIENSVURCYXNlID0gcmVxdWlyZSgnLi9jcnVkLWJhc2UnKTtcblxudmFyIEl0ZW1BY3Rpb25zID0gcmVxdWlyZSgnLi4vYWN0aW9ucy9pdGVtcycpO1xuXG4vKipcbiAqIEJhc2ljIENSVUQgc3RvcmUgZm9yIGEgUkVTVGZ1bCBKU09OIFwicmVzb3VyY2VcIi4gIE92ZXJyaWRpbmcgXCJnZXRBbGxcIiB0byBhZGRcbiAqIHNvcnQgb3JkZXIgdG8gcmVzb3VyY2VzIGxpc3RzLlxuICovXG5jbGFzcyBJdGVtc1N0b3JlIGV4dGVuZHMgQ1JVREJhc2Uge1xuXG4gIC8vIHNwZWNpZnkgdGhlIGFjdGlvbiBpbnN0YW5jZSBhbmQgYWN0aW9uIG9iamVjdCBpZGVudGlmaWVyIChhbmQgZGlzcGF0Y2hlcilcbiAgY29uc3RydWN0b3IoZGlzcGF0Y2hlcikge1xuICAgIHN1cGVyKGRpc3BhdGNoZXIsIEl0ZW1BY3Rpb25zLCAnSVRFTScpO1xuICB9XG5cbiAgZ2V0QWxsKCkge1xuICAgIHJldHVybiBfLnNvcnRCeShzdXBlci5nZXRBbGwoKSwgaXRlbSA9PiBpdGVtLmRhdGEubGFzdCArIGl0ZW0uZGF0YS5maXJzdCk7XG4gIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEl0ZW1zU3RvcmU7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaUwxVnpaWEp6TDJoaWRYSnliM2R6TDJSbGRpOW9aWEp2YTNVdmNtVmhZM1F0Wm14MWVDMXpkR0Z5ZEdWeUwzQjFZbXhwWXk5cVlYWmhjMk55YVhCMGN5OXpkRzl5WlhNdmFYUmxiWE11YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OW9ZblZ5Y205M2N5OWtaWFl2YUdWeWIydDFMM0psWVdOMExXWnNkWGd0YzNSaGNuUmxjaTl3ZFdKc2FXTXZhbUYyWVhOamNtbHdkSE12YzNSdmNtVnpMMmwwWlcxekxtcHpJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSkJRVUZCTEZsQlFWa3NRMEZCUXpzN1FVRkZZaXhKUVVGSkxFTkJRVU1zUjBGQlJ5eFBRVUZQTEVOQlFVTXNVVUZCVVN4RFFVRkRMRU5CUVVNN08wRkJSVEZDTEVsQlFVa3NVVUZCVVN4SFFVRkhMRTlCUVU4c1EwRkJReXhoUVVGaExFTkJRVU1zUTBGQlF6czdRVUZGZEVNc1NVRkJTU3hYUVVGWExFZEJRVWNzVDBGQlR5eERRVUZETEd0Q1FVRnJRaXhEUVVGRExFTkJRVU03TzBGQlJUbERPMEZCUTBFN08wZEJSVWM3UVVGRFNDeE5RVUZOTEZWQlFWVXNVMEZCVXl4UlFVRlJMRU5CUVVNN1FVRkRiRU03TzBWQlJVVXNWMEZCVnl4aFFVRmhPMGxCUTNSQ0xFdEJRVXNzUTBGQlF5eFZRVUZWTEVWQlFVVXNWMEZCVnl4RlFVRkZMRTFCUVUwc1EwRkJReXhEUVVGRE8wRkJRek5ETEVkQlFVYzdPMFZCUlVRc1RVRkJUU3hIUVVGSE8wbEJRMUFzVDBGQlR5eERRVUZETEVOQlFVTXNUVUZCVFN4RFFVRkRMRXRCUVVzc1EwRkJReXhOUVVGTkxFVkJRVVVzUlVGQlJTeEpRVUZKTEVsQlFVa3NTVUZCU1N4RFFVRkRMRWxCUVVrc1EwRkJReXhKUVVGSkxFZEJRVWNzU1VGQlNTeERRVUZETEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJRenRCUVVNNVJTeEhRVUZIT3p0QlFVVklMRU5CUVVNN08wRkJSVVFzVFVGQlRTeERRVUZETEU5QlFVOHNSMEZCUnl4VlFVRlZMRU5CUVVNaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SW5kWE5sSUhOMGNtbGpkQ2M3WEc1Y2JuWmhjaUJmSUQwZ2NtVnhkV2x5WlNnbmJHOWtZWE5vSnlrN1hHNWNiblpoY2lCRFVsVkVRbUZ6WlNBOUlISmxjWFZwY21Vb0p5NHZZM0oxWkMxaVlYTmxKeWs3WEc1Y2JuWmhjaUJKZEdWdFFXTjBhVzl1Y3lBOUlISmxjWFZwY21Vb0p5NHVMMkZqZEdsdmJuTXZhWFJsYlhNbktUdGNibHh1THlvcVhHNGdLaUJDWVhOcFl5QkRVbFZFSUhOMGIzSmxJR1p2Y2lCaElGSkZVMVJtZFd3Z1NsTlBUaUJjSW5KbGMyOTFjbU5sWENJdUlDQlBkbVZ5Y21sa2FXNW5JRndpWjJWMFFXeHNYQ0lnZEc4Z1lXUmtYRzRnS2lCemIzSjBJRzl5WkdWeUlIUnZJSEpsYzI5MWNtTmxjeUJzYVhOMGN5NWNiaUFxTDF4dVkyeGhjM01nU1hSbGJYTlRkRzl5WlNCbGVIUmxibVJ6SUVOU1ZVUkNZWE5sSUh0Y2JseHVJQ0F2THlCemNHVmphV1o1SUhSb1pTQmhZM1JwYjI0Z2FXNXpkR0Z1WTJVZ1lXNWtJR0ZqZEdsdmJpQnZZbXBsWTNRZ2FXUmxiblJwWm1sbGNpQW9ZVzVrSUdScGMzQmhkR05vWlhJcFhHNGdJR052Ym5OMGNuVmpkRzl5S0dScGMzQmhkR05vWlhJcElIdGNiaUFnSUNCemRYQmxjaWhrYVhOd1lYUmphR1Z5TENCSmRHVnRRV04wYVc5dWN5d2dKMGxVUlUwbktUdGNiaUFnZlZ4dVhHNGdJR2RsZEVGc2JDZ3BJSHRjYmlBZ0lDQnlaWFIxY200Z1h5NXpiM0owUW5rb2MzVndaWEl1WjJWMFFXeHNLQ2tzSUdsMFpXMGdQVDRnYVhSbGJTNWtZWFJoTG14aGMzUWdLeUJwZEdWdExtUmhkR0V1Wm1seWMzUXBPMXh1SUNCOVhHNWNibjFjYmx4dWJXOWtkV3hsTG1WNGNHOXlkSE1nUFNCSmRHVnRjMU4wYjNKbE8xeHVJbDE5IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xuXG52YXIga0FjdGlvbnMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvYWN0aW9ucycpO1xuXG52YXIgQmFzZVN0b3JlID0gcmVxdWlyZSgnLi9iYXNlJyk7XG5cbnZhciBfaGFuZGxlcnMgPSBfLnppcE9iamVjdChbXG4gIFtrQWN0aW9ucy5PVkVSTEFZX1BVU0gsICdfb25PdmVybGF5UHVzaCddLFxuICBba0FjdGlvbnMuT1ZFUkxBWV9QT1AsICdfb25PdmVybGF5UG9wJ11cbl0pO1xuXG5cbmNsYXNzIE92ZXJsYXlzU3RvcmUgZXh0ZW5kcyBCYXNlU3RvcmUge1xuXG4gIGluaXRpYWxpemUoKSB7XG4gICAgdGhpcy5fb3ZlcmxheXMgPSBbXTtcbiAgfVxuXG4gIF9nZXRBY3Rpb25zKCl7XG4gICAgcmV0dXJuIF9oYW5kbGVycztcbiAgfVxuXG4gIGdldFRvcE92ZXJsYXkoKSB7XG4gICAgcmV0dXJuIHRoaXMuX292ZXJsYXlzLmxlbmd0aCA/IHRoaXMuX292ZXJsYXlzW3RoaXMuX292ZXJsYXlzLmxlbmd0aCAtIDFdIDogbnVsbDtcbiAgfVxuXG4gIC8vIGFjdGlvbiBoYW5kbGVyc1xuICBfb25PdmVybGF5UHVzaChwYXlsb2FkKSB7XG4gICAgdGhpcy5fb3ZlcmxheXMucHVzaChwYXlsb2FkLmRhdGEuY29tcG9uZW50KTtcbiAgICB0aGlzLmVtaXRDaGFuZ2UoKTtcbiAgfVxuXG4gIF9vbk92ZXJsYXlQb3AoKSB7XG4gICAgdGhpcy5fb3ZlcmxheXMucG9wKCk7XG4gICAgdGhpcy5lbWl0Q2hhbmdlKCk7XG4gIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE92ZXJsYXlzU3RvcmU7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaUwxVnpaWEp6TDJoaWRYSnliM2R6TDJSbGRpOW9aWEp2YTNVdmNtVmhZM1F0Wm14MWVDMXpkR0Z5ZEdWeUwzQjFZbXhwWXk5cVlYWmhjMk55YVhCMGN5OXpkRzl5WlhNdmIzWmxjbXhoZVhNdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlvWW5WeWNtOTNjeTlrWlhZdmFHVnliMnQxTDNKbFlXTjBMV1pzZFhndGMzUmhjblJsY2k5d2RXSnNhV012YW1GMllYTmpjbWx3ZEhNdmMzUnZjbVZ6TDI5MlpYSnNZWGx6TG1weklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lKQlFVRkJMRmxCUVZrc1EwRkJRenM3UVVGRllpeEpRVUZKTEVOQlFVTXNSMEZCUnl4UFFVRlBMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU03TzBGQlJURkNMRWxCUVVrc1VVRkJVU3hIUVVGSExFOUJRVThzUTBGQlF5eHpRa0ZCYzBJc1EwRkJReXhEUVVGRE96dEJRVVV2UXl4SlFVRkpMRk5CUVZNc1IwRkJSeXhQUVVGUExFTkJRVU1zVVVGQlVTeERRVUZETEVOQlFVTTdPMEZCUld4RExFbEJRVWtzVTBGQlV5eEhRVUZITEVOQlFVTXNRMEZCUXl4VFFVRlRMRU5CUVVNN1JVRkRNVUlzUTBGQlF5eFJRVUZSTEVOQlFVTXNXVUZCV1N4RlFVRkZMR2RDUVVGblFpeERRVUZETzBWQlEzcERMRU5CUVVNc1VVRkJVU3hEUVVGRExGZEJRVmNzUlVGQlJTeGxRVUZsTEVOQlFVTTdRVUZEZWtNc1EwRkJReXhEUVVGRExFTkJRVU03UVVGRFNEczdRVUZGUVN4TlFVRk5MR0ZCUVdFc1UwRkJVeXhUUVVGVExFTkJRVU03TzBWQlJYQkRMRlZCUVZVc1IwRkJSenRKUVVOWUxFbEJRVWtzUTBGQlF5eFRRVUZUTEVkQlFVY3NSVUZCUlN4RFFVRkRPMEZCUTNoQ0xFZEJRVWM3TzBWQlJVUXNWMEZCVnl4RlFVRkZPMGxCUTFnc1QwRkJUeXhUUVVGVExFTkJRVU03UVVGRGNrSXNSMEZCUnpzN1JVRkZSQ3hoUVVGaExFZEJRVWM3U1VGRFpDeFBRVUZQTEVsQlFVa3NRMEZCUXl4VFFVRlRMRU5CUVVNc1RVRkJUU3hIUVVGSExFbEJRVWtzUTBGQlF5eFRRVUZUTEVOQlFVTXNTVUZCU1N4RFFVRkRMRk5CUVZNc1EwRkJReXhOUVVGTkxFZEJRVWNzUTBGQlF5eERRVUZETEVkQlFVY3NTVUZCU1N4RFFVRkRPMEZCUTNCR0xFZEJRVWM3UVVGRFNEczdSVUZGUlN4alFVRmpMRlZCUVZVN1NVRkRkRUlzU1VGQlNTeERRVUZETEZOQlFWTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1QwRkJUeXhEUVVGRExFbEJRVWtzUTBGQlF5eFRRVUZUTEVOQlFVTXNRMEZCUXp0SlFVTTFReXhKUVVGSkxFTkJRVU1zVlVGQlZTeEZRVUZGTEVOQlFVTTdRVUZEZEVJc1IwRkJSenM3UlVGRlJDeGhRVUZoTEVkQlFVYzdTVUZEWkN4SlFVRkpMRU5CUVVNc1UwRkJVeXhEUVVGRExFZEJRVWNzUlVGQlJTeERRVUZETzBsQlEzSkNMRWxCUVVrc1EwRkJReXhWUVVGVkxFVkJRVVVzUTBGQlF6dEJRVU4wUWl4SFFVRkhPenRCUVVWSUxFTkJRVU03TzBGQlJVUXNUVUZCVFN4RFFVRkRMRTlCUVU4c1IwRkJSeXhoUVVGaExFTkJRVU1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lJbmRYTmxJSE4wY21samRDYzdYRzVjYm5aaGNpQmZJRDBnY21WeGRXbHlaU2duYkc5a1lYTm9KeWs3WEc1Y2JuWmhjaUJyUVdOMGFXOXVjeUE5SUhKbGNYVnBjbVVvSnk0dUwyTnZibk4wWVc1MGN5OWhZM1JwYjI1ekp5azdYRzVjYm5aaGNpQkNZWE5sVTNSdmNtVWdQU0J5WlhGMWFYSmxLQ2N1TDJKaGMyVW5LVHRjYmx4dWRtRnlJRjlvWVc1a2JHVnljeUE5SUY4dWVtbHdUMkpxWldOMEtGdGNiaUFnVzJ0QlkzUnBiMjV6TGs5V1JWSk1RVmxmVUZWVFNDd2dKMTl2Yms5MlpYSnNZWGxRZFhOb0oxMHNYRzRnSUZ0clFXTjBhVzl1Y3k1UFZrVlNURUZaWDFCUFVDd2dKMTl2Yms5MlpYSnNZWGxRYjNBblhWeHVYU2s3WEc1Y2JseHVZMnhoYzNNZ1QzWmxjbXhoZVhOVGRHOXlaU0JsZUhSbGJtUnpJRUpoYzJWVGRHOXlaU0I3WEc1Y2JpQWdhVzVwZEdsaGJHbDZaU2dwSUh0Y2JpQWdJQ0IwYUdsekxsOXZkbVZ5YkdGNWN5QTlJRnRkTzF4dUlDQjlYRzVjYmlBZ1gyZGxkRUZqZEdsdmJuTW9LWHRjYmlBZ0lDQnlaWFIxY200Z1gyaGhibVJzWlhKek8xeHVJQ0I5WEc1Y2JpQWdaMlYwVkc5d1QzWmxjbXhoZVNncElIdGNiaUFnSUNCeVpYUjFjbTRnZEdocGN5NWZiM1psY214aGVYTXViR1Z1WjNSb0lEOGdkR2hwY3k1ZmIzWmxjbXhoZVhOYmRHaHBjeTVmYjNabGNteGhlWE11YkdWdVozUm9JQzBnTVYwZ09pQnVkV3hzTzF4dUlDQjlYRzVjYmlBZ0x5OGdZV04wYVc5dUlHaGhibVJzWlhKelhHNGdJRjl2Yms5MlpYSnNZWGxRZFhOb0tIQmhlV3h2WVdRcElIdGNiaUFnSUNCMGFHbHpMbDl2ZG1WeWJHRjVjeTV3ZFhOb0tIQmhlV3h2WVdRdVpHRjBZUzVqYjIxd2IyNWxiblFwTzF4dUlDQWdJSFJvYVhNdVpXMXBkRU5vWVc1blpTZ3BPMXh1SUNCOVhHNWNiaUFnWDI5dVQzWmxjbXhoZVZCdmNDZ3BJSHRjYmlBZ0lDQjBhR2x6TGw5dmRtVnliR0Y1Y3k1d2IzQW9LVHRjYmlBZ0lDQjBhR2x6TG1WdGFYUkRhR0Z1WjJVb0tUdGNiaUFnZlZ4dVhHNTlYRzVjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnVDNabGNteGhlWE5UZEc5eVpUdGNiaUpkZlE9PSIsIid1c2Ugc3RyaWN0JztcblxudmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcblxudmFyIEJhc2VTdG9yZSA9IHJlcXVpcmUoJy4vYmFzZScpO1xuXG52YXIga0FjdGlvbnMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvYWN0aW9ucycpLFxuICAgIFNlcnZlckFjdGlvbnMgPSByZXF1aXJlKCcuLi9hY3Rpb25zL3NlcnZlci10aW1lJyk7XG5cbnZhciBfYWN0aW9ucyA9IF8uemlwT2JqZWN0KFtcbiAgW2tBY3Rpb25zLlNFUlZFUlRJTUVfR0VULCAnaGFuZGxlU2V0J10sXG4gIFtrQWN0aW9ucy5TRVJWRVJUSU1FX1BVVCwgJ2hhbmRsZVNldCddXG5dKTtcblxuY2xhc3MgU2VydmVyVGltZVN0b3JlIGV4dGVuZHMgQmFzZVN0b3JlIHtcblxuICBjb25zdHJ1Y3RvcihkaXNwYXRjaGVyKSB7XG4gICAgc3VwZXIoZGlzcGF0Y2hlcik7XG4gICAgdGhpcy5fc2VydmVyVGltZSA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIF9nZXRBY3Rpb25zKCkge1xuICAgIHJldHVybiBfYWN0aW9ucztcbiAgfVxuXG4gIF9sb2FkKCkge1xuICAgIFNlcnZlckFjdGlvbnMuZ2V0VGltZSgpO1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBfZ2V0VGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fc2VydmVyVGltZSAhPT0gdW5kZWZpbmVkID8gdGhpcy5fc2VydmVyVGltZSA6IHRoaXMuX2xvYWQoKTtcbiAgfVxuXG4gIGdldFNlcnZlclRpbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2dldFRpbWUoKTtcbiAgfVxuXG5cbiAgLypcbiAgKlxuICAqIEFjdGlvbiBIYW5kbGVyc1xuICAqXG4gICovXG5cbiAgaGFuZGxlU2V0KHBheWxvYWQpIHtcbiAgICBjb25zb2xlLmRlYnVnKGAke3RoaXMuZ2V0U3RvcmVOYW1lKCl9OmhhbmRsZVNldCBzdGF0ZT0ke3BheWxvYWQuc3luY1N0YXRlfWApO1xuICAgIHRoaXMuX3NlcnZlclRpbWUgPSB0aGlzLm1ha2VTdGF0ZWZ1bEVudHJ5KHBheWxvYWQuc3luY1N0YXRlLCBwYXlsb2FkLmRhdGEpO1xuICAgIHRoaXMuZW1pdENoYW5nZSgpO1xuICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTZXJ2ZXJUaW1lU3RvcmU7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaUwxVnpaWEp6TDJoaWRYSnliM2R6TDJSbGRpOW9aWEp2YTNVdmNtVmhZM1F0Wm14MWVDMXpkR0Z5ZEdWeUwzQjFZbXhwWXk5cVlYWmhjMk55YVhCMGN5OXpkRzl5WlhNdmMyVnlkbVZ5TFhScGJXVXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5b1luVnljbTkzY3k5a1pYWXZhR1Z5YjJ0MUwzSmxZV04wTFdac2RYZ3RjM1JoY25SbGNpOXdkV0pzYVdNdmFtRjJZWE5qY21sd2RITXZjM1J2Y21WekwzTmxjblpsY2kxMGFXMWxMbXB6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUpCUVVGQkxGbEJRVmtzUTBGQlF6czdRVUZGWWl4SlFVRkpMRU5CUVVNc1IwRkJSeXhQUVVGUExFTkJRVU1zVVVGQlVTeERRVUZETEVOQlFVTTdPMEZCUlRGQ0xFbEJRVWtzVTBGQlV5eEhRVUZITEU5QlFVOHNRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJRenM3UVVGRmJFTXNTVUZCU1N4UlFVRlJMRWRCUVVjc1QwRkJUeXhEUVVGRExITkNRVUZ6UWl4RFFVRkRPMEZCUXpsRExFbEJRVWtzWVVGQllTeEhRVUZITEU5QlFVOHNRMEZCUXl4M1FrRkJkMElzUTBGQlF5eERRVUZET3p0QlFVVjBSQ3hKUVVGSkxGRkJRVkVzUjBGQlJ5eERRVUZETEVOQlFVTXNVMEZCVXl4RFFVRkRPMFZCUTNwQ0xFTkJRVU1zVVVGQlVTeERRVUZETEdOQlFXTXNSVUZCUlN4WFFVRlhMRU5CUVVNN1JVRkRkRU1zUTBGQlF5eFJRVUZSTEVOQlFVTXNZMEZCWXl4RlFVRkZMRmRCUVZjc1EwRkJRenRCUVVONFF5eERRVUZETEVOQlFVTXNRMEZCUXpzN1FVRkZTQ3hOUVVGTkxHVkJRV1VzVTBGQlV5eFRRVUZUTEVOQlFVTTdPMFZCUlhSRExGZEJRVmNzWVVGQllUdEpRVU4wUWl4TFFVRkxMRU5CUVVNc1ZVRkJWU3hEUVVGRExFTkJRVU03U1VGRGJFSXNTVUZCU1N4RFFVRkRMRmRCUVZjc1IwRkJSeXhUUVVGVExFTkJRVU03UVVGRGFrTXNSMEZCUnpzN1JVRkZSQ3hYUVVGWExFZEJRVWM3U1VGRFdpeFBRVUZQTEZGQlFWRXNRMEZCUXp0QlFVTndRaXhIUVVGSE96dEZRVVZFTEV0QlFVc3NSMEZCUnp0SlFVTk9MR0ZCUVdFc1EwRkJReXhQUVVGUExFVkJRVVVzUTBGQlF6dEpRVU40UWl4UFFVRlBMRk5CUVZNc1EwRkJRenRCUVVOeVFpeEhRVUZIT3p0RlFVVkVMRkZCUVZFc1IwRkJSenRKUVVOVUxFOUJRVThzU1VGQlNTeERRVUZETEZkQlFWY3NTMEZCU3l4VFFVRlRMRWRCUVVjc1NVRkJTU3hEUVVGRExGZEJRVmNzUjBGQlJ5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RlFVRkZMRU5CUVVNN1FVRkROVVVzUjBGQlJ6czdSVUZGUkN4aFFVRmhMRWRCUVVjN1NVRkRaQ3hQUVVGUExFbEJRVWtzUTBGQlF5eFJRVUZSTEVWQlFVVXNRMEZCUXp0QlFVTXpRaXhIUVVGSE8wRkJRMGc3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wVkJSVVVzVTBGQlV5eFZRVUZWTzBsQlEycENMRTlCUVU4c1EwRkJReXhMUVVGTExFTkJRVU1zUjBGQlJ5eEpRVUZKTEVOQlFVTXNXVUZCV1N4RlFVRkZMRzlDUVVGdlFpeFBRVUZQTEVOQlFVTXNVMEZCVXl4RlFVRkZMRU5CUVVNc1EwRkJRenRKUVVNM1JTeEpRVUZKTEVOQlFVTXNWMEZCVnl4SFFVRkhMRWxCUVVrc1EwRkJReXhwUWtGQmFVSXNRMEZCUXl4UFFVRlBMRU5CUVVNc1UwRkJVeXhGUVVGRkxFOUJRVThzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXp0SlFVTXpSU3hKUVVGSkxFTkJRVU1zVlVGQlZTeEZRVUZGTEVOQlFVTTdRVUZEZEVJc1IwRkJSenM3UVVGRlNDeERRVUZET3p0QlFVVkVMRTFCUVUwc1EwRkJReXhQUVVGUExFZEJRVWNzWlVGQlpTeERRVUZESWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaUozVnpaU0J6ZEhKcFkzUW5PMXh1WEc1MllYSWdYeUE5SUhKbGNYVnBjbVVvSjJ4dlpHRnphQ2NwTzF4dVhHNTJZWElnUW1GelpWTjBiM0psSUQwZ2NtVnhkV2x5WlNnbkxpOWlZWE5sSnlrN1hHNWNiblpoY2lCclFXTjBhVzl1Y3lBOUlISmxjWFZwY21Vb0p5NHVMMk52Ym5OMFlXNTBjeTloWTNScGIyNXpKeWtzWEc0Z0lDQWdVMlZ5ZG1WeVFXTjBhVzl1Y3lBOUlISmxjWFZwY21Vb0p5NHVMMkZqZEdsdmJuTXZjMlZ5ZG1WeUxYUnBiV1VuS1R0Y2JseHVkbUZ5SUY5aFkzUnBiMjV6SUQwZ1h5NTZhWEJQWW1wbFkzUW9XMXh1SUNCYmEwRmpkR2x2Ym5NdVUwVlNWa1ZTVkVsTlJWOUhSVlFzSUNkb1lXNWtiR1ZUWlhRblhTeGNiaUFnVzJ0QlkzUnBiMjV6TGxORlVsWkZVbFJKVFVWZlVGVlVMQ0FuYUdGdVpHeGxVMlYwSjExY2JsMHBPMXh1WEc1amJHRnpjeUJUWlhKMlpYSlVhVzFsVTNSdmNtVWdaWGgwWlc1a2N5QkNZWE5sVTNSdmNtVWdlMXh1WEc0Z0lHTnZibk4wY25WamRHOXlLR1JwYzNCaGRHTm9aWElwSUh0Y2JpQWdJQ0J6ZFhCbGNpaGthWE53WVhSamFHVnlLVHRjYmlBZ0lDQjBhR2x6TGw5elpYSjJaWEpVYVcxbElEMGdkVzVrWldacGJtVmtPMXh1SUNCOVhHNWNiaUFnWDJkbGRFRmpkR2x2Ym5Nb0tTQjdYRzRnSUNBZ2NtVjBkWEp1SUY5aFkzUnBiMjV6TzF4dUlDQjlYRzVjYmlBZ1gyeHZZV1FvS1NCN1hHNGdJQ0FnVTJWeWRtVnlRV04wYVc5dWN5NW5aWFJVYVcxbEtDazdYRzRnSUNBZ2NtVjBkWEp1SUhWdVpHVm1hVzVsWkR0Y2JpQWdmVnh1WEc0Z0lGOW5aWFJVYVcxbEtDa2dlMXh1SUNBZ0lISmxkSFZ5YmlCMGFHbHpMbDl6WlhKMlpYSlVhVzFsSUNFOVBTQjFibVJsWm1sdVpXUWdQeUIwYUdsekxsOXpaWEoyWlhKVWFXMWxJRG9nZEdocGN5NWZiRzloWkNncE8xeHVJQ0I5WEc1Y2JpQWdaMlYwVTJWeWRtVnlWR2x0WlNncElIdGNiaUFnSUNCeVpYUjFjbTRnZEdocGN5NWZaMlYwVkdsdFpTZ3BPMXh1SUNCOVhHNWNibHh1SUNBdktseHVJQ0FxWEc0Z0lDb2dRV04wYVc5dUlFaGhibVJzWlhKelhHNGdJQ3BjYmlBZ0tpOWNibHh1SUNCb1lXNWtiR1ZUWlhRb2NHRjViRzloWkNrZ2UxeHVJQ0FnSUdOdmJuTnZiR1V1WkdWaWRXY29ZQ1I3ZEdocGN5NW5aWFJUZEc5eVpVNWhiV1VvS1gwNmFHRnVaR3hsVTJWMElITjBZWFJsUFNSN2NHRjViRzloWkM1emVXNWpVM1JoZEdWOVlDazdYRzRnSUNBZ2RHaHBjeTVmYzJWeWRtVnlWR2x0WlNBOUlIUm9hWE11YldGclpWTjBZWFJsWm5Wc1JXNTBjbmtvY0dGNWJHOWhaQzV6ZVc1alUzUmhkR1VzSUhCaGVXeHZZV1F1WkdGMFlTazdYRzRnSUNBZ2RHaHBjeTVsYldsMFEyaGhibWRsS0NrN1hHNGdJSDFjYmx4dWZWeHVYRzV0YjJSMWJHVXVaWGh3YjNKMGN5QTlJRk5sY25abGNsUnBiV1ZUZEc5eVpUdGNiaUpkZlE9PSIsIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgRGlzcGF0Y2hlclxuICogQHR5cGVjaGVja3NcbiAqL1xuXG52YXIgaW52YXJpYW50ID0gcmVxdWlyZSgnLi9pbnZhcmlhbnQnKTtcblxudmFyIF9sYXN0SUQgPSAxO1xudmFyIF9wcmVmaXggPSAnSURfJztcblxuLyoqXG4gKiBEaXNwYXRjaGVyIGlzIHVzZWQgdG8gYnJvYWRjYXN0IHBheWxvYWRzIHRvIHJlZ2lzdGVyZWQgY2FsbGJhY2tzLiBUaGlzIGlzXG4gKiBkaWZmZXJlbnQgZnJvbSBnZW5lcmljIHB1Yi1zdWIgc3lzdGVtcyBpbiB0d28gd2F5czpcbiAqXG4gKiAgIDEpIENhbGxiYWNrcyBhcmUgbm90IHN1YnNjcmliZWQgdG8gcGFydGljdWxhciBldmVudHMuIEV2ZXJ5IHBheWxvYWQgaXNcbiAqICAgICAgZGlzcGF0Y2hlZCB0byBldmVyeSByZWdpc3RlcmVkIGNhbGxiYWNrLlxuICogICAyKSBDYWxsYmFja3MgY2FuIGJlIGRlZmVycmVkIGluIHdob2xlIG9yIHBhcnQgdW50aWwgb3RoZXIgY2FsbGJhY2tzIGhhdmVcbiAqICAgICAgYmVlbiBleGVjdXRlZC5cbiAqXG4gKiBGb3IgZXhhbXBsZSwgY29uc2lkZXIgdGhpcyBoeXBvdGhldGljYWwgZmxpZ2h0IGRlc3RpbmF0aW9uIGZvcm0sIHdoaWNoXG4gKiBzZWxlY3RzIGEgZGVmYXVsdCBjaXR5IHdoZW4gYSBjb3VudHJ5IGlzIHNlbGVjdGVkOlxuICpcbiAqICAgdmFyIGZsaWdodERpc3BhdGNoZXIgPSBuZXcgRGlzcGF0Y2hlcigpO1xuICpcbiAqICAgLy8gS2VlcHMgdHJhY2sgb2Ygd2hpY2ggY291bnRyeSBpcyBzZWxlY3RlZFxuICogICB2YXIgQ291bnRyeVN0b3JlID0ge2NvdW50cnk6IG51bGx9O1xuICpcbiAqICAgLy8gS2VlcHMgdHJhY2sgb2Ygd2hpY2ggY2l0eSBpcyBzZWxlY3RlZFxuICogICB2YXIgQ2l0eVN0b3JlID0ge2NpdHk6IG51bGx9O1xuICpcbiAqICAgLy8gS2VlcHMgdHJhY2sgb2YgdGhlIGJhc2UgZmxpZ2h0IHByaWNlIG9mIHRoZSBzZWxlY3RlZCBjaXR5XG4gKiAgIHZhciBGbGlnaHRQcmljZVN0b3JlID0ge3ByaWNlOiBudWxsfVxuICpcbiAqIFdoZW4gYSB1c2VyIGNoYW5nZXMgdGhlIHNlbGVjdGVkIGNpdHksIHdlIGRpc3BhdGNoIHRoZSBwYXlsb2FkOlxuICpcbiAqICAgZmxpZ2h0RGlzcGF0Y2hlci5kaXNwYXRjaCh7XG4gKiAgICAgYWN0aW9uVHlwZTogJ2NpdHktdXBkYXRlJyxcbiAqICAgICBzZWxlY3RlZENpdHk6ICdwYXJpcydcbiAqICAgfSk7XG4gKlxuICogVGhpcyBwYXlsb2FkIGlzIGRpZ2VzdGVkIGJ5IGBDaXR5U3RvcmVgOlxuICpcbiAqICAgZmxpZ2h0RGlzcGF0Y2hlci5yZWdpc3RlcihmdW5jdGlvbihwYXlsb2FkKSkge1xuICogICAgIGlmIChwYXlsb2FkLmFjdGlvblR5cGUgPT09ICdjaXR5LXVwZGF0ZScpIHtcbiAqICAgICAgIENpdHlTdG9yZS5jaXR5ID0gcGF5bG9hZC5zZWxlY3RlZENpdHk7XG4gKiAgICAgfVxuICogICB9KTtcbiAqXG4gKiBXaGVuIHRoZSB1c2VyIHNlbGVjdHMgYSBjb3VudHJ5LCB3ZSBkaXNwYXRjaCB0aGUgcGF5bG9hZDpcbiAqXG4gKiAgIGZsaWdodERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuICogICAgIGFjdGlvblR5cGU6ICdjb3VudHJ5LXVwZGF0ZScsXG4gKiAgICAgc2VsZWN0ZWRDb3VudHJ5OiAnYXVzdHJhbGlhJ1xuICogICB9KTtcbiAqXG4gKiBUaGlzIHBheWxvYWQgaXMgZGlnZXN0ZWQgYnkgYm90aCBzdG9yZXM6XG4gKlxuICogICAgQ291bnRyeVN0b3JlLmRpc3BhdGNoVG9rZW4gPSBmbGlnaHREaXNwYXRjaGVyLnJlZ2lzdGVyKGZ1bmN0aW9uKHBheWxvYWQpIHtcbiAqICAgICBpZiAocGF5bG9hZC5hY3Rpb25UeXBlID09PSAnY291bnRyeS11cGRhdGUnKSB7XG4gKiAgICAgICBDb3VudHJ5U3RvcmUuY291bnRyeSA9IHBheWxvYWQuc2VsZWN0ZWRDb3VudHJ5O1xuICogICAgIH1cbiAqICAgfSk7XG4gKlxuICogV2hlbiB0aGUgY2FsbGJhY2sgdG8gdXBkYXRlIGBDb3VudHJ5U3RvcmVgIGlzIHJlZ2lzdGVyZWQsIHdlIHNhdmUgYSByZWZlcmVuY2VcbiAqIHRvIHRoZSByZXR1cm5lZCB0b2tlbi4gVXNpbmcgdGhpcyB0b2tlbiB3aXRoIGB3YWl0Rm9yKClgLCB3ZSBjYW4gZ3VhcmFudGVlXG4gKiB0aGF0IGBDb3VudHJ5U3RvcmVgIGlzIHVwZGF0ZWQgYmVmb3JlIHRoZSBjYWxsYmFjayB0aGF0IHVwZGF0ZXMgYENpdHlTdG9yZWBcbiAqIG5lZWRzIHRvIHF1ZXJ5IGl0cyBkYXRhLlxuICpcbiAqICAgQ2l0eVN0b3JlLmRpc3BhdGNoVG9rZW4gPSBmbGlnaHREaXNwYXRjaGVyLnJlZ2lzdGVyKGZ1bmN0aW9uKHBheWxvYWQpIHtcbiAqICAgICBpZiAocGF5bG9hZC5hY3Rpb25UeXBlID09PSAnY291bnRyeS11cGRhdGUnKSB7XG4gKiAgICAgICAvLyBgQ291bnRyeVN0b3JlLmNvdW50cnlgIG1heSBub3QgYmUgdXBkYXRlZC5cbiAqICAgICAgIGZsaWdodERpc3BhdGNoZXIud2FpdEZvcihbQ291bnRyeVN0b3JlLmRpc3BhdGNoVG9rZW5dKTtcbiAqICAgICAgIC8vIGBDb3VudHJ5U3RvcmUuY291bnRyeWAgaXMgbm93IGd1YXJhbnRlZWQgdG8gYmUgdXBkYXRlZC5cbiAqXG4gKiAgICAgICAvLyBTZWxlY3QgdGhlIGRlZmF1bHQgY2l0eSBmb3IgdGhlIG5ldyBjb3VudHJ5XG4gKiAgICAgICBDaXR5U3RvcmUuY2l0eSA9IGdldERlZmF1bHRDaXR5Rm9yQ291bnRyeShDb3VudHJ5U3RvcmUuY291bnRyeSk7XG4gKiAgICAgfVxuICogICB9KTtcbiAqXG4gKiBUaGUgdXNhZ2Ugb2YgYHdhaXRGb3IoKWAgY2FuIGJlIGNoYWluZWQsIGZvciBleGFtcGxlOlxuICpcbiAqICAgRmxpZ2h0UHJpY2VTdG9yZS5kaXNwYXRjaFRva2VuID1cbiAqICAgICBmbGlnaHREaXNwYXRjaGVyLnJlZ2lzdGVyKGZ1bmN0aW9uKHBheWxvYWQpKSB7XG4gKiAgICAgICBzd2l0Y2ggKHBheWxvYWQuYWN0aW9uVHlwZSkge1xuICogICAgICAgICBjYXNlICdjb3VudHJ5LXVwZGF0ZSc6XG4gKiAgICAgICAgICAgZmxpZ2h0RGlzcGF0Y2hlci53YWl0Rm9yKFtDaXR5U3RvcmUuZGlzcGF0Y2hUb2tlbl0pO1xuICogICAgICAgICAgIEZsaWdodFByaWNlU3RvcmUucHJpY2UgPVxuICogICAgICAgICAgICAgZ2V0RmxpZ2h0UHJpY2VTdG9yZShDb3VudHJ5U3RvcmUuY291bnRyeSwgQ2l0eVN0b3JlLmNpdHkpO1xuICogICAgICAgICAgIGJyZWFrO1xuICpcbiAqICAgICAgICAgY2FzZSAnY2l0eS11cGRhdGUnOlxuICogICAgICAgICAgIEZsaWdodFByaWNlU3RvcmUucHJpY2UgPVxuICogICAgICAgICAgICAgRmxpZ2h0UHJpY2VTdG9yZShDb3VudHJ5U3RvcmUuY291bnRyeSwgQ2l0eVN0b3JlLmNpdHkpO1xuICogICAgICAgICAgIGJyZWFrO1xuICogICAgIH1cbiAqICAgfSk7XG4gKlxuICogVGhlIGBjb3VudHJ5LXVwZGF0ZWAgcGF5bG9hZCB3aWxsIGJlIGd1YXJhbnRlZWQgdG8gaW52b2tlIHRoZSBzdG9yZXMnXG4gKiByZWdpc3RlcmVkIGNhbGxiYWNrcyBpbiBvcmRlcjogYENvdW50cnlTdG9yZWAsIGBDaXR5U3RvcmVgLCB0aGVuXG4gKiBgRmxpZ2h0UHJpY2VTdG9yZWAuXG4gKi9cblxuICBmdW5jdGlvbiBEaXNwYXRjaGVyKCkge1widXNlIHN0cmljdFwiO1xuICAgIHRoaXMuJERpc3BhdGNoZXJfY2FsbGJhY2tzID0ge307XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9pc1BlbmRpbmcgPSB7fTtcbiAgICB0aGlzLiREaXNwYXRjaGVyX2lzSGFuZGxlZCA9IHt9O1xuICAgIHRoaXMuJERpc3BhdGNoZXJfaXNEaXNwYXRjaGluZyA9IGZhbHNlO1xuICAgIHRoaXMuJERpc3BhdGNoZXJfcGVuZGluZ1BheWxvYWQgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIGNhbGxiYWNrIHRvIGJlIGludm9rZWQgd2l0aCBldmVyeSBkaXNwYXRjaGVkIHBheWxvYWQuIFJldHVybnNcbiAgICogYSB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHdpdGggYHdhaXRGb3IoKWAuXG4gICAqXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIERpc3BhdGNoZXIucHJvdG90eXBlLnJlZ2lzdGVyPWZ1bmN0aW9uKGNhbGxiYWNrKSB7XCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIGlkID0gX3ByZWZpeCArIF9sYXN0SUQrKztcbiAgICB0aGlzLiREaXNwYXRjaGVyX2NhbGxiYWNrc1tpZF0gPSBjYWxsYmFjaztcbiAgICByZXR1cm4gaWQ7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYSBjYWxsYmFjayBiYXNlZCBvbiBpdHMgdG9rZW4uXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZFxuICAgKi9cbiAgRGlzcGF0Y2hlci5wcm90b3R5cGUudW5yZWdpc3Rlcj1mdW5jdGlvbihpZCkge1widXNlIHN0cmljdFwiO1xuICAgIGludmFyaWFudChcbiAgICAgIHRoaXMuJERpc3BhdGNoZXJfY2FsbGJhY2tzW2lkXSxcbiAgICAgICdEaXNwYXRjaGVyLnVucmVnaXN0ZXIoLi4uKTogYCVzYCBkb2VzIG5vdCBtYXAgdG8gYSByZWdpc3RlcmVkIGNhbGxiYWNrLicsXG4gICAgICBpZFxuICAgICk7XG4gICAgZGVsZXRlIHRoaXMuJERpc3BhdGNoZXJfY2FsbGJhY2tzW2lkXTtcbiAgfTtcblxuICAvKipcbiAgICogV2FpdHMgZm9yIHRoZSBjYWxsYmFja3Mgc3BlY2lmaWVkIHRvIGJlIGludm9rZWQgYmVmb3JlIGNvbnRpbnVpbmcgZXhlY3V0aW9uXG4gICAqIG9mIHRoZSBjdXJyZW50IGNhbGxiYWNrLiBUaGlzIG1ldGhvZCBzaG91bGQgb25seSBiZSB1c2VkIGJ5IGEgY2FsbGJhY2sgaW5cbiAgICogcmVzcG9uc2UgdG8gYSBkaXNwYXRjaGVkIHBheWxvYWQuXG4gICAqXG4gICAqIEBwYXJhbSB7YXJyYXk8c3RyaW5nPn0gaWRzXG4gICAqL1xuICBEaXNwYXRjaGVyLnByb3RvdHlwZS53YWl0Rm9yPWZ1bmN0aW9uKGlkcykge1widXNlIHN0cmljdFwiO1xuICAgIGludmFyaWFudChcbiAgICAgIHRoaXMuJERpc3BhdGNoZXJfaXNEaXNwYXRjaGluZyxcbiAgICAgICdEaXNwYXRjaGVyLndhaXRGb3IoLi4uKTogTXVzdCBiZSBpbnZva2VkIHdoaWxlIGRpc3BhdGNoaW5nLidcbiAgICApO1xuICAgIGZvciAodmFyIGlpID0gMDsgaWkgPCBpZHMubGVuZ3RoOyBpaSsrKSB7XG4gICAgICB2YXIgaWQgPSBpZHNbaWldO1xuICAgICAgaWYgKHRoaXMuJERpc3BhdGNoZXJfaXNQZW5kaW5nW2lkXSkge1xuICAgICAgICBpbnZhcmlhbnQoXG4gICAgICAgICAgdGhpcy4kRGlzcGF0Y2hlcl9pc0hhbmRsZWRbaWRdLFxuICAgICAgICAgICdEaXNwYXRjaGVyLndhaXRGb3IoLi4uKTogQ2lyY3VsYXIgZGVwZW5kZW5jeSBkZXRlY3RlZCB3aGlsZSAnICtcbiAgICAgICAgICAnd2FpdGluZyBmb3IgYCVzYC4nLFxuICAgICAgICAgIGlkXG4gICAgICAgICk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaW52YXJpYW50KFxuICAgICAgICB0aGlzLiREaXNwYXRjaGVyX2NhbGxiYWNrc1tpZF0sXG4gICAgICAgICdEaXNwYXRjaGVyLndhaXRGb3IoLi4uKTogYCVzYCBkb2VzIG5vdCBtYXAgdG8gYSByZWdpc3RlcmVkIGNhbGxiYWNrLicsXG4gICAgICAgIGlkXG4gICAgICApO1xuICAgICAgdGhpcy4kRGlzcGF0Y2hlcl9pbnZva2VDYWxsYmFjayhpZCk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBEaXNwYXRjaGVzIGEgcGF5bG9hZCB0byBhbGwgcmVnaXN0ZXJlZCBjYWxsYmFja3MuXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBwYXlsb2FkXG4gICAqL1xuICBEaXNwYXRjaGVyLnByb3RvdHlwZS5kaXNwYXRjaD1mdW5jdGlvbihwYXlsb2FkKSB7XCJ1c2Ugc3RyaWN0XCI7XG4gICAgaW52YXJpYW50KFxuICAgICAgIXRoaXMuJERpc3BhdGNoZXJfaXNEaXNwYXRjaGluZyxcbiAgICAgICdEaXNwYXRjaC5kaXNwYXRjaCguLi4pOiBDYW5ub3QgZGlzcGF0Y2ggaW4gdGhlIG1pZGRsZSBvZiBhIGRpc3BhdGNoLidcbiAgICApO1xuICAgIHRoaXMuJERpc3BhdGNoZXJfc3RhcnREaXNwYXRjaGluZyhwYXlsb2FkKTtcbiAgICB0cnkge1xuICAgICAgZm9yICh2YXIgaWQgaW4gdGhpcy4kRGlzcGF0Y2hlcl9jYWxsYmFja3MpIHtcbiAgICAgICAgaWYgKHRoaXMuJERpc3BhdGNoZXJfaXNQZW5kaW5nW2lkXSkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuJERpc3BhdGNoZXJfaW52b2tlQ2FsbGJhY2soaWQpO1xuICAgICAgfVxuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzLiREaXNwYXRjaGVyX3N0b3BEaXNwYXRjaGluZygpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogSXMgdGhpcyBEaXNwYXRjaGVyIGN1cnJlbnRseSBkaXNwYXRjaGluZy5cbiAgICpcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIERpc3BhdGNoZXIucHJvdG90eXBlLmlzRGlzcGF0Y2hpbmc9ZnVuY3Rpb24oKSB7XCJ1c2Ugc3RyaWN0XCI7XG4gICAgcmV0dXJuIHRoaXMuJERpc3BhdGNoZXJfaXNEaXNwYXRjaGluZztcbiAgfTtcblxuICAvKipcbiAgICogQ2FsbCB0aGUgY2FsbGJhY2sgc3RvcmVkIHdpdGggdGhlIGdpdmVuIGlkLiBBbHNvIGRvIHNvbWUgaW50ZXJuYWxcbiAgICogYm9va2tlZXBpbmcuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZFxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIERpc3BhdGNoZXIucHJvdG90eXBlLiREaXNwYXRjaGVyX2ludm9rZUNhbGxiYWNrPWZ1bmN0aW9uKGlkKSB7XCJ1c2Ugc3RyaWN0XCI7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9pc1BlbmRpbmdbaWRdID0gdHJ1ZTtcbiAgICB0aGlzLiREaXNwYXRjaGVyX2NhbGxiYWNrc1tpZF0odGhpcy4kRGlzcGF0Y2hlcl9wZW5kaW5nUGF5bG9hZCk7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9pc0hhbmRsZWRbaWRdID0gdHJ1ZTtcbiAgfTtcblxuICAvKipcbiAgICogU2V0IHVwIGJvb2trZWVwaW5nIG5lZWRlZCB3aGVuIGRpc3BhdGNoaW5nLlxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gcGF5bG9hZFxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIERpc3BhdGNoZXIucHJvdG90eXBlLiREaXNwYXRjaGVyX3N0YXJ0RGlzcGF0Y2hpbmc9ZnVuY3Rpb24ocGF5bG9hZCkge1widXNlIHN0cmljdFwiO1xuICAgIGZvciAodmFyIGlkIGluIHRoaXMuJERpc3BhdGNoZXJfY2FsbGJhY2tzKSB7XG4gICAgICB0aGlzLiREaXNwYXRjaGVyX2lzUGVuZGluZ1tpZF0gPSBmYWxzZTtcbiAgICAgIHRoaXMuJERpc3BhdGNoZXJfaXNIYW5kbGVkW2lkXSA9IGZhbHNlO1xuICAgIH1cbiAgICB0aGlzLiREaXNwYXRjaGVyX3BlbmRpbmdQYXlsb2FkID0gcGF5bG9hZDtcbiAgICB0aGlzLiREaXNwYXRjaGVyX2lzRGlzcGF0Y2hpbmcgPSB0cnVlO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDbGVhciBib29ra2VlcGluZyB1c2VkIGZvciBkaXNwYXRjaGluZy5cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBEaXNwYXRjaGVyLnByb3RvdHlwZS4kRGlzcGF0Y2hlcl9zdG9wRGlzcGF0Y2hpbmc9ZnVuY3Rpb24oKSB7XCJ1c2Ugc3RyaWN0XCI7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9wZW5kaW5nUGF5bG9hZCA9IG51bGw7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9pc0Rpc3BhdGNoaW5nID0gZmFsc2U7XG4gIH07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBEaXNwYXRjaGVyO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lMMVZ6WlhKekwyaGlkWEp5YjNkekwyUmxkaTlvWlhKdmEzVXZjbVZoWTNRdFpteDFlQzF6ZEdGeWRHVnlMM0IxWW14cFl5OXFZWFpoYzJOeWFYQjBjeTkyWlc1a2IzSXZabXgxZUM5RWFYTndZWFJqYUdWeUxtcHpJaXdpYzI5MWNtTmxjeUk2V3lJdlZYTmxjbk12YUdKMWNuSnZkM012WkdWMkwyaGxjbTlyZFM5eVpXRmpkQzFtYkhWNExYTjBZWEowWlhJdmNIVmliR2xqTDJwaGRtRnpZM0pwY0hSekwzWmxibVJ2Y2k5bWJIVjRMMFJwYzNCaGRHTm9aWEl1YW5NaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWtGQlFVRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJMRWRCUVVjN08wRkJSVWdzU1VGQlNTeFRRVUZUTEVkQlFVY3NUMEZCVHl4RFFVRkRMR0ZCUVdFc1EwRkJReXhEUVVGRE96dEJRVVYyUXl4SlFVRkpMRTlCUVU4c1IwRkJSeXhEUVVGRExFTkJRVU03UVVGRGFFSXNTVUZCU1N4UFFVRlBMRWRCUVVjc1MwRkJTeXhEUVVGRE96dEJRVVZ3UWp0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJMRWRCUVVjN08wVkJSVVFzVTBGQlV5eFZRVUZWTEVkQlFVY3NRMEZCUXl4WlFVRlpMRU5CUVVNN1NVRkRiRU1zU1VGQlNTeERRVUZETEhGQ1FVRnhRaXhIUVVGSExFVkJRVVVzUTBGQlF6dEpRVU5vUXl4SlFVRkpMRU5CUVVNc2NVSkJRWEZDTEVkQlFVY3NSVUZCUlN4RFFVRkRPMGxCUTJoRExFbEJRVWtzUTBGQlF5eHhRa0ZCY1VJc1IwRkJSeXhGUVVGRkxFTkJRVU03U1VGRGFFTXNTVUZCU1N4RFFVRkRMSGxDUVVGNVFpeEhRVUZITEV0QlFVc3NRMEZCUXp0SlFVTjJReXhKUVVGSkxFTkJRVU1zTUVKQlFUQkNMRWRCUVVjc1NVRkJTU3hEUVVGRE8wRkJRek5ETEVkQlFVYzdPMEZCUlVnc1JVRkJSVHRCUVVOR08wRkJRMEU3UVVGRFFUdEJRVU5CT3p0TFFVVkxPMFZCUTBnc1ZVRkJWU3hEUVVGRExGTkJRVk1zUTBGQlF5eFJRVUZSTEVOQlFVTXNVMEZCVXl4UlFVRlJMRVZCUVVVc1EwRkJReXhaUVVGWkxFTkJRVU03U1VGRE4wUXNTVUZCU1N4RlFVRkZMRWRCUVVjc1QwRkJUeXhIUVVGSExFOUJRVThzUlVGQlJTeERRVUZETzBsQlF6ZENMRWxCUVVrc1EwRkJReXh4UWtGQmNVSXNRMEZCUXl4RlFVRkZMRU5CUVVNc1IwRkJSeXhSUVVGUkxFTkJRVU03U1VGRE1VTXNUMEZCVHl4RlFVRkZMRU5CUVVNN1FVRkRaQ3hIUVVGSExFTkJRVU03TzBGQlJVb3NSVUZCUlR0QlFVTkdPMEZCUTBFN08wdEJSVXM3UlVGRFNDeFZRVUZWTEVOQlFVTXNVMEZCVXl4RFFVRkRMRlZCUVZVc1EwRkJReXhUUVVGVExFVkJRVVVzUlVGQlJTeERRVUZETEZsQlFWa3NRMEZCUXp0SlFVTjZSQ3hUUVVGVE8wMUJRMUFzU1VGQlNTeERRVUZETEhGQ1FVRnhRaXhEUVVGRExFVkJRVVVzUTBGQlF6dE5RVU01UWl4NVJVRkJlVVU3VFVGRGVrVXNSVUZCUlR0TFFVTklMRU5CUVVNN1NVRkRSaXhQUVVGUExFbEJRVWtzUTBGQlF5eHhRa0ZCY1VJc1EwRkJReXhGUVVGRkxFTkJRVU1zUTBGQlF6dEJRVU14UXl4SFFVRkhMRU5CUVVNN08wRkJSVW9zUlVGQlJUdEJRVU5HTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRMUVVWTE8wVkJRMGdzVlVGQlZTeERRVUZETEZOQlFWTXNRMEZCUXl4UFFVRlBMRU5CUVVNc1UwRkJVeXhIUVVGSExFVkJRVVVzUTBGQlF5eFpRVUZaTEVOQlFVTTdTVUZEZGtRc1UwRkJVenROUVVOUUxFbEJRVWtzUTBGQlF5eDVRa0ZCZVVJN1RVRkRPVUlzTmtSQlFUWkVPMHRCUXpsRUxFTkJRVU03U1VGRFJpeExRVUZMTEVsQlFVa3NSVUZCUlN4SFFVRkhMRU5CUVVNc1JVRkJSU3hGUVVGRkxFZEJRVWNzUjBGQlJ5eERRVUZETEUxQlFVMHNSVUZCUlN4RlFVRkZMRVZCUVVVc1JVRkJSVHROUVVOMFF5eEpRVUZKTEVWQlFVVXNSMEZCUnl4SFFVRkhMRU5CUVVNc1JVRkJSU3hEUVVGRExFTkJRVU03VFVGRGFrSXNTVUZCU1N4SlFVRkpMRU5CUVVNc2NVSkJRWEZDTEVOQlFVTXNSVUZCUlN4RFFVRkRMRVZCUVVVN1VVRkRiRU1zVTBGQlV6dFZRVU5RTEVsQlFVa3NRMEZCUXl4eFFrRkJjVUlzUTBGQlF5eEZRVUZGTEVOQlFVTTdWVUZET1VJc09FUkJRVGhFTzFWQlF6bEVMRzFDUVVGdFFqdFZRVU51UWl4RlFVRkZPMU5CUTBnc1EwRkJRenRSUVVOR0xGTkJRVk03VDBGRFZqdE5RVU5FTEZOQlFWTTdVVUZEVUN4SlFVRkpMRU5CUVVNc2NVSkJRWEZDTEVOQlFVTXNSVUZCUlN4RFFVRkRPMUZCUXpsQ0xITkZRVUZ6UlR0UlFVTjBSU3hGUVVGRk8wOUJRMGdzUTBGQlF6dE5RVU5HTEVsQlFVa3NRMEZCUXl3d1FrRkJNRUlzUTBGQlF5eEZRVUZGTEVOQlFVTXNRMEZCUXp0TFFVTnlRenRCUVVOTUxFZEJRVWNzUTBGQlF6czdRVUZGU2l4RlFVRkZPMEZCUTBZN1FVRkRRVHM3UzBGRlN6dEZRVU5JTEZWQlFWVXNRMEZCUXl4VFFVRlRMRU5CUVVNc1VVRkJVU3hEUVVGRExGTkJRVk1zVDBGQlR5eEZRVUZGTEVOQlFVTXNXVUZCV1N4RFFVRkRPMGxCUXpWRUxGTkJRVk03VFVGRFVDeERRVUZETEVsQlFVa3NRMEZCUXl4NVFrRkJlVUk3VFVGREwwSXNjMFZCUVhORk8wdEJRM1pGTEVOQlFVTTdTVUZEUml4SlFVRkpMRU5CUVVNc05FSkJRVFJDTEVOQlFVTXNUMEZCVHl4RFFVRkRMRU5CUVVNN1NVRkRNME1zU1VGQlNUdE5RVU5HTEV0QlFVc3NTVUZCU1N4RlFVRkZMRWxCUVVrc1NVRkJTU3hEUVVGRExIRkNRVUZ4UWl4RlFVRkZPMUZCUTNwRExFbEJRVWtzU1VGQlNTeERRVUZETEhGQ1FVRnhRaXhEUVVGRExFVkJRVVVzUTBGQlF5eEZRVUZGTzFWQlEyeERMRk5CUVZNN1UwRkRWanRSUVVORUxFbEJRVWtzUTBGQlF5d3dRa0ZCTUVJc1EwRkJReXhGUVVGRkxFTkJRVU1zUTBGQlF6dFBRVU55UXp0TFFVTkdMRk5CUVZNN1RVRkRVaXhKUVVGSkxFTkJRVU1zTWtKQlFUSkNMRVZCUVVVc1EwRkJRenRMUVVOd1F6dEJRVU5NTEVkQlFVY3NRMEZCUXpzN1FVRkZTaXhGUVVGRk8wRkJRMFk3UVVGRFFUczdTMEZGU3p0RlFVTklMRlZCUVZVc1EwRkJReXhUUVVGVExFTkJRVU1zWVVGQllTeERRVUZETEZkQlFWY3NRMEZCUXl4WlFVRlpMRU5CUVVNN1NVRkRNVVFzVDBGQlR5eEpRVUZKTEVOQlFVTXNlVUpCUVhsQ0xFTkJRVU03UVVGRE1VTXNSMEZCUnl4RFFVRkRPenRCUVVWS0xFVkJRVVU3UVVGRFJqdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1MwRkZTenRGUVVOSUxGVkJRVlVzUTBGQlF5eFRRVUZUTEVOQlFVTXNNRUpCUVRCQ0xFTkJRVU1zVTBGQlV5eEZRVUZGTEVWQlFVVXNRMEZCUXl4WlFVRlpMRU5CUVVNN1NVRkRla1VzU1VGQlNTeERRVUZETEhGQ1FVRnhRaXhEUVVGRExFVkJRVVVzUTBGQlF5eEhRVUZITEVsQlFVa3NRMEZCUXp0SlFVTjBReXhKUVVGSkxFTkJRVU1zY1VKQlFYRkNMRU5CUVVNc1JVRkJSU3hEUVVGRExFTkJRVU1zU1VGQlNTeERRVUZETERCQ1FVRXdRaXhEUVVGRExFTkJRVU03U1VGRGFFVXNTVUZCU1N4RFFVRkRMSEZDUVVGeFFpeERRVUZETEVWQlFVVXNRMEZCUXl4SFFVRkhMRWxCUVVrc1EwRkJRenRCUVVNeFF5eEhRVUZITEVOQlFVTTdPMEZCUlVvc1JVRkJSVHRCUVVOR08wRkJRMEU3UVVGRFFUczdTMEZGU3p0RlFVTklMRlZCUVZVc1EwRkJReXhUUVVGVExFTkJRVU1zTkVKQlFUUkNMRU5CUVVNc1UwRkJVeXhQUVVGUExFVkJRVVVzUTBGQlF5eFpRVUZaTEVOQlFVTTdTVUZEYUVZc1MwRkJTeXhKUVVGSkxFVkJRVVVzU1VGQlNTeEpRVUZKTEVOQlFVTXNjVUpCUVhGQ0xFVkJRVVU3VFVGRGVrTXNTVUZCU1N4RFFVRkRMSEZDUVVGeFFpeERRVUZETEVWQlFVVXNRMEZCUXl4SFFVRkhMRXRCUVVzc1EwRkJRenROUVVOMlF5eEpRVUZKTEVOQlFVTXNjVUpCUVhGQ0xFTkJRVU1zUlVGQlJTeERRVUZETEVkQlFVY3NTMEZCU3l4RFFVRkRPMHRCUTNoRE8wbEJRMFFzU1VGQlNTeERRVUZETERCQ1FVRXdRaXhIUVVGSExFOUJRVThzUTBGQlF6dEpRVU14UXl4SlFVRkpMRU5CUVVNc2VVSkJRWGxDTEVkQlFVY3NTVUZCU1N4RFFVRkRPMEZCUXpGRExFZEJRVWNzUTBGQlF6czdRVUZGU2l4RlFVRkZPMEZCUTBZN1FVRkRRVHM3UzBGRlN6dEZRVU5JTEZWQlFWVXNRMEZCUXl4VFFVRlRMRU5CUVVNc01rSkJRVEpDTEVOQlFVTXNWMEZCVnl4RFFVRkRMRmxCUVZrc1EwRkJRenRKUVVONFJTeEpRVUZKTEVOQlFVTXNNRUpCUVRCQ0xFZEJRVWNzU1VGQlNTeERRVUZETzBsQlEzWkRMRWxCUVVrc1EwRkJReXg1UWtGQmVVSXNSMEZCUnl4TFFVRkxMRU5CUVVNN1FVRkRNME1zUjBGQlJ5eERRVUZETzBGQlEwbzdPMEZCUlVFc1RVRkJUU3hEUVVGRExFOUJRVThzUjBGQlJ5eFZRVUZWTEVOQlFVTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUl2S2x4dUlDb2dRMjl3ZVhKcFoyaDBJQ2hqS1NBeU1ERTBMQ0JHWVdObFltOXZheXdnU1c1akxseHVJQ29nUVd4c0lISnBaMmgwY3lCeVpYTmxjblpsWkM1Y2JpQXFYRzRnS2lCVWFHbHpJSE52ZFhKalpTQmpiMlJsSUdseklHeHBZMlZ1YzJWa0lIVnVaR1Z5SUhSb1pTQkNVMFF0YzNSNWJHVWdiR2xqWlc1elpTQm1iM1Z1WkNCcGJpQjBhR1ZjYmlBcUlFeEpRMFZPVTBVZ1ptbHNaU0JwYmlCMGFHVWdjbTl2ZENCa2FYSmxZM1J2Y25rZ2IyWWdkR2hwY3lCemIzVnlZMlVnZEhKbFpTNGdRVzRnWVdSa2FYUnBiMjVoYkNCbmNtRnVkRnh1SUNvZ2IyWWdjR0YwWlc1MElISnBaMmgwY3lCallXNGdZbVVnWm05MWJtUWdhVzRnZEdobElGQkJWRVZPVkZNZ1ptbHNaU0JwYmlCMGFHVWdjMkZ0WlNCa2FYSmxZM1J2Y25rdVhHNGdLbHh1SUNvZ1FIQnliM1pwWkdWelRXOWtkV3hsSUVScGMzQmhkR05vWlhKY2JpQXFJRUIwZVhCbFkyaGxZMnR6WEc0Z0tpOWNibHh1ZG1GeUlHbHVkbUZ5YVdGdWRDQTlJSEpsY1hWcGNtVW9KeTR2YVc1MllYSnBZVzUwSnlrN1hHNWNiblpoY2lCZmJHRnpkRWxFSUQwZ01UdGNiblpoY2lCZmNISmxabWw0SUQwZ0owbEVYeWM3WEc1Y2JpOHFLbHh1SUNvZ1JHbHpjR0YwWTJobGNpQnBjeUIxYzJWa0lIUnZJR0p5YjJGa1kyRnpkQ0J3WVhsc2IyRmtjeUIwYnlCeVpXZHBjM1JsY21Wa0lHTmhiR3hpWVdOcmN5NGdWR2hwY3lCcGMxeHVJQ29nWkdsbVptVnlaVzUwSUdaeWIyMGdaMlZ1WlhKcFl5QndkV0l0YzNWaUlITjVjM1JsYlhNZ2FXNGdkSGR2SUhkaGVYTTZYRzRnS2x4dUlDb2dJQ0F4S1NCRFlXeHNZbUZqYTNNZ1lYSmxJRzV2ZENCemRXSnpZM0pwWW1Wa0lIUnZJSEJoY25ScFkzVnNZWElnWlhabGJuUnpMaUJGZG1WeWVTQndZWGxzYjJGa0lHbHpYRzRnS2lBZ0lDQWdJR1JwYzNCaGRHTm9aV1FnZEc4Z1pYWmxjbmtnY21WbmFYTjBaWEpsWkNCallXeHNZbUZqYXk1Y2JpQXFJQ0FnTWlrZ1EyRnNiR0poWTJ0eklHTmhiaUJpWlNCa1pXWmxjbkpsWkNCcGJpQjNhRzlzWlNCdmNpQndZWEowSUhWdWRHbHNJRzkwYUdWeUlHTmhiR3hpWVdOcmN5Qm9ZWFpsWEc0Z0tpQWdJQ0FnSUdKbFpXNGdaWGhsWTNWMFpXUXVYRzRnS2x4dUlDb2dSbTl5SUdWNFlXMXdiR1VzSUdOdmJuTnBaR1Z5SUhSb2FYTWdhSGx3YjNSb1pYUnBZMkZzSUdac2FXZG9kQ0JrWlhOMGFXNWhkR2x2YmlCbWIzSnRMQ0IzYUdsamFGeHVJQ29nYzJWc1pXTjBjeUJoSUdSbFptRjFiSFFnWTJsMGVTQjNhR1Z1SUdFZ1kyOTFiblJ5ZVNCcGN5QnpaV3hsWTNSbFpEcGNiaUFxWEc0Z0tpQWdJSFpoY2lCbWJHbG5hSFJFYVhOd1lYUmphR1Z5SUQwZ2JtVjNJRVJwYzNCaGRHTm9aWElvS1R0Y2JpQXFYRzRnS2lBZ0lDOHZJRXRsWlhCeklIUnlZV05ySUc5bUlIZG9hV05vSUdOdmRXNTBjbmtnYVhNZ2MyVnNaV04wWldSY2JpQXFJQ0FnZG1GeUlFTnZkVzUwY25sVGRHOXlaU0E5SUh0amIzVnVkSEo1T2lCdWRXeHNmVHRjYmlBcVhHNGdLaUFnSUM4dklFdGxaWEJ6SUhSeVlXTnJJRzltSUhkb2FXTm9JR05wZEhrZ2FYTWdjMlZzWldOMFpXUmNiaUFxSUNBZ2RtRnlJRU5wZEhsVGRHOXlaU0E5SUh0amFYUjVPaUJ1ZFd4c2ZUdGNiaUFxWEc0Z0tpQWdJQzh2SUV0bFpYQnpJSFJ5WVdOcklHOW1JSFJvWlNCaVlYTmxJR1pzYVdkb2RDQndjbWxqWlNCdlppQjBhR1VnYzJWc1pXTjBaV1FnWTJsMGVWeHVJQ29nSUNCMllYSWdSbXhwWjJoMFVISnBZMlZUZEc5eVpTQTlJSHR3Y21salpUb2diblZzYkgxY2JpQXFYRzRnS2lCWGFHVnVJR0VnZFhObGNpQmphR0Z1WjJWeklIUm9aU0J6Wld4bFkzUmxaQ0JqYVhSNUxDQjNaU0JrYVhOd1lYUmphQ0IwYUdVZ2NHRjViRzloWkRwY2JpQXFYRzRnS2lBZ0lHWnNhV2RvZEVScGMzQmhkR05vWlhJdVpHbHpjR0YwWTJnb2UxeHVJQ29nSUNBZ0lHRmpkR2x2YmxSNWNHVTZJQ2RqYVhSNUxYVndaR0YwWlNjc1hHNGdLaUFnSUNBZ2MyVnNaV04wWldSRGFYUjVPaUFuY0dGeWFYTW5YRzRnS2lBZ0lIMHBPMXh1SUNwY2JpQXFJRlJvYVhNZ2NHRjViRzloWkNCcGN5QmthV2RsYzNSbFpDQmllU0JnUTJsMGVWTjBiM0psWURwY2JpQXFYRzRnS2lBZ0lHWnNhV2RvZEVScGMzQmhkR05vWlhJdWNtVm5hWE4wWlhJb1puVnVZM1JwYjI0b2NHRjViRzloWkNrcElIdGNiaUFxSUNBZ0lDQnBaaUFvY0dGNWJHOWhaQzVoWTNScGIyNVVlWEJsSUQwOVBTQW5ZMmwwZVMxMWNHUmhkR1VuS1NCN1hHNGdLaUFnSUNBZ0lDQkRhWFI1VTNSdmNtVXVZMmwwZVNBOUlIQmhlV3h2WVdRdWMyVnNaV04wWldSRGFYUjVPMXh1SUNvZ0lDQWdJSDFjYmlBcUlDQWdmU2s3WEc0Z0tseHVJQ29nVjJobGJpQjBhR1VnZFhObGNpQnpaV3hsWTNSeklHRWdZMjkxYm5SeWVTd2dkMlVnWkdsemNHRjBZMmdnZEdobElIQmhlV3h2WVdRNlhHNGdLbHh1SUNvZ0lDQm1iR2xuYUhSRWFYTndZWFJqYUdWeUxtUnBjM0JoZEdOb0tIdGNiaUFxSUNBZ0lDQmhZM1JwYjI1VWVYQmxPaUFuWTI5MWJuUnllUzExY0dSaGRHVW5MRnh1SUNvZ0lDQWdJSE5sYkdWamRHVmtRMjkxYm5SeWVUb2dKMkYxYzNSeVlXeHBZU2RjYmlBcUlDQWdmU2s3WEc0Z0tseHVJQ29nVkdocGN5QndZWGxzYjJGa0lHbHpJR1JwWjJWemRHVmtJR0o1SUdKdmRHZ2djM1J2Y21Wek9seHVJQ3BjYmlBcUlDQWdJRU52ZFc1MGNubFRkRzl5WlM1a2FYTndZWFJqYUZSdmEyVnVJRDBnWm14cFoyaDBSR2x6Y0dGMFkyaGxjaTV5WldkcGMzUmxjaWhtZFc1amRHbHZiaWh3WVhsc2IyRmtLU0I3WEc0Z0tpQWdJQ0FnYVdZZ0tIQmhlV3h2WVdRdVlXTjBhVzl1Vkhsd1pTQTlQVDBnSjJOdmRXNTBjbmt0ZFhCa1lYUmxKeWtnZTF4dUlDb2dJQ0FnSUNBZ1EyOTFiblJ5ZVZOMGIzSmxMbU52ZFc1MGNua2dQU0J3WVhsc2IyRmtMbk5sYkdWamRHVmtRMjkxYm5SeWVUdGNiaUFxSUNBZ0lDQjlYRzRnS2lBZ0lIMHBPMXh1SUNwY2JpQXFJRmRvWlc0Z2RHaGxJR05oYkd4aVlXTnJJSFJ2SUhWd1pHRjBaU0JnUTI5MWJuUnllVk4wYjNKbFlDQnBjeUJ5WldkcGMzUmxjbVZrTENCM1pTQnpZWFpsSUdFZ2NtVm1aWEpsYm1ObFhHNGdLaUIwYnlCMGFHVWdjbVYwZFhKdVpXUWdkRzlyWlc0dUlGVnphVzVuSUhSb2FYTWdkRzlyWlc0Z2QybDBhQ0JnZDJGcGRFWnZjaWdwWUN3Z2QyVWdZMkZ1SUdkMVlYSmhiblJsWlZ4dUlDb2dkR2hoZENCZ1EyOTFiblJ5ZVZOMGIzSmxZQ0JwY3lCMWNHUmhkR1ZrSUdKbFptOXlaU0IwYUdVZ1kyRnNiR0poWTJzZ2RHaGhkQ0IxY0dSaGRHVnpJR0JEYVhSNVUzUnZjbVZnWEc0Z0tpQnVaV1ZrY3lCMGJ5QnhkV1Z5ZVNCcGRITWdaR0YwWVM1Y2JpQXFYRzRnS2lBZ0lFTnBkSGxUZEc5eVpTNWthWE53WVhSamFGUnZhMlZ1SUQwZ1pteHBaMmgwUkdsemNHRjBZMmhsY2k1eVpXZHBjM1JsY2lobWRXNWpkR2x2Ymlod1lYbHNiMkZrS1NCN1hHNGdLaUFnSUNBZ2FXWWdLSEJoZVd4dllXUXVZV04wYVc5dVZIbHdaU0E5UFQwZ0oyTnZkVzUwY25rdGRYQmtZWFJsSnlrZ2UxeHVJQ29nSUNBZ0lDQWdMeThnWUVOdmRXNTBjbmxUZEc5eVpTNWpiM1Z1ZEhKNVlDQnRZWGtnYm05MElHSmxJSFZ3WkdGMFpXUXVYRzRnS2lBZ0lDQWdJQ0JtYkdsbmFIUkVhWE53WVhSamFHVnlMbmRoYVhSR2IzSW9XME52ZFc1MGNubFRkRzl5WlM1a2FYTndZWFJqYUZSdmEyVnVYU2s3WEc0Z0tpQWdJQ0FnSUNBdkx5QmdRMjkxYm5SeWVWTjBiM0psTG1OdmRXNTBjbmxnSUdseklHNXZkeUJuZFdGeVlXNTBaV1ZrSUhSdklHSmxJSFZ3WkdGMFpXUXVYRzRnS2x4dUlDb2dJQ0FnSUNBZ0x5OGdVMlZzWldOMElIUm9aU0JrWldaaGRXeDBJR05wZEhrZ1ptOXlJSFJvWlNCdVpYY2dZMjkxYm5SeWVWeHVJQ29nSUNBZ0lDQWdRMmwwZVZOMGIzSmxMbU5wZEhrZ1BTQm5aWFJFWldaaGRXeDBRMmwwZVVadmNrTnZkVzUwY25rb1EyOTFiblJ5ZVZOMGIzSmxMbU52ZFc1MGNua3BPMXh1SUNvZ0lDQWdJSDFjYmlBcUlDQWdmU2s3WEc0Z0tseHVJQ29nVkdobElIVnpZV2RsSUc5bUlHQjNZV2wwUm05eUtDbGdJR05oYmlCaVpTQmphR0ZwYm1Wa0xDQm1iM0lnWlhoaGJYQnNaVHBjYmlBcVhHNGdLaUFnSUVac2FXZG9kRkJ5YVdObFUzUnZjbVV1WkdsemNHRjBZMmhVYjJ0bGJpQTlYRzRnS2lBZ0lDQWdabXhwWjJoMFJHbHpjR0YwWTJobGNpNXlaV2RwYzNSbGNpaG1kVzVqZEdsdmJpaHdZWGxzYjJGa0tTa2dlMXh1SUNvZ0lDQWdJQ0FnYzNkcGRHTm9JQ2h3WVhsc2IyRmtMbUZqZEdsdmJsUjVjR1VwSUh0Y2JpQXFJQ0FnSUNBZ0lDQWdZMkZ6WlNBblkyOTFiblJ5ZVMxMWNHUmhkR1VuT2x4dUlDb2dJQ0FnSUNBZ0lDQWdJR1pzYVdkb2RFUnBjM0JoZEdOb1pYSXVkMkZwZEVadmNpaGJRMmwwZVZOMGIzSmxMbVJwYzNCaGRHTm9WRzlyWlc1ZEtUdGNiaUFxSUNBZ0lDQWdJQ0FnSUNCR2JHbG5hSFJRY21salpWTjBiM0psTG5CeWFXTmxJRDFjYmlBcUlDQWdJQ0FnSUNBZ0lDQWdJR2RsZEVac2FXZG9kRkJ5YVdObFUzUnZjbVVvUTI5MWJuUnllVk4wYjNKbExtTnZkVzUwY25rc0lFTnBkSGxUZEc5eVpTNWphWFI1S1R0Y2JpQXFJQ0FnSUNBZ0lDQWdJQ0JpY21WaGF6dGNiaUFxWEc0Z0tpQWdJQ0FnSUNBZ0lHTmhjMlVnSjJOcGRIa3RkWEJrWVhSbEp6cGNiaUFxSUNBZ0lDQWdJQ0FnSUNCR2JHbG5hSFJRY21salpWTjBiM0psTG5CeWFXTmxJRDFjYmlBcUlDQWdJQ0FnSUNBZ0lDQWdJRVpzYVdkb2RGQnlhV05sVTNSdmNtVW9RMjkxYm5SeWVWTjBiM0psTG1OdmRXNTBjbmtzSUVOcGRIbFRkRzl5WlM1amFYUjVLVHRjYmlBcUlDQWdJQ0FnSUNBZ0lDQmljbVZoYXp0Y2JpQXFJQ0FnSUNCOVhHNGdLaUFnSUgwcE8xeHVJQ3BjYmlBcUlGUm9aU0JnWTI5MWJuUnllUzExY0dSaGRHVmdJSEJoZVd4dllXUWdkMmxzYkNCaVpTQm5kV0Z5WVc1MFpXVmtJSFJ2SUdsdWRtOXJaU0IwYUdVZ2MzUnZjbVZ6SjF4dUlDb2djbVZuYVhOMFpYSmxaQ0JqWVd4c1ltRmphM01nYVc0Z2IzSmtaWEk2SUdCRGIzVnVkSEo1VTNSdmNtVmdMQ0JnUTJsMGVWTjBiM0psWUN3Z2RHaGxibHh1SUNvZ1lFWnNhV2RvZEZCeWFXTmxVM1J2Y21WZ0xseHVJQ292WEc1Y2JpQWdablZ1WTNScGIyNGdSR2x6Y0dGMFkyaGxjaWdwSUh0Y0luVnpaU0J6ZEhKcFkzUmNJanRjYmlBZ0lDQjBhR2x6TGlSRWFYTndZWFJqYUdWeVgyTmhiR3hpWVdOcmN5QTlJSHQ5TzF4dUlDQWdJSFJvYVhNdUpFUnBjM0JoZEdOb1pYSmZhWE5RWlc1a2FXNW5JRDBnZTMwN1hHNGdJQ0FnZEdocGN5NGtSR2x6Y0dGMFkyaGxjbDlwYzBoaGJtUnNaV1FnUFNCN2ZUdGNiaUFnSUNCMGFHbHpMaVJFYVhOd1lYUmphR1Z5WDJselJHbHpjR0YwWTJocGJtY2dQU0JtWVd4elpUdGNiaUFnSUNCMGFHbHpMaVJFYVhOd1lYUmphR1Z5WDNCbGJtUnBibWRRWVhsc2IyRmtJRDBnYm5Wc2JEdGNiaUFnZlZ4dVhHNGdJQzhxS2x4dUlDQWdLaUJTWldkcGMzUmxjbk1nWVNCallXeHNZbUZqYXlCMGJ5QmlaU0JwYm5admEyVmtJSGRwZEdnZ1pYWmxjbmtnWkdsemNHRjBZMmhsWkNCd1lYbHNiMkZrTGlCU1pYUjFjbTV6WEc0Z0lDQXFJR0VnZEc5clpXNGdkR2hoZENCallXNGdZbVVnZFhObFpDQjNhWFJvSUdCM1lXbDBSbTl5S0NsZ0xseHVJQ0FnS2x4dUlDQWdLaUJBY0dGeVlXMGdlMloxYm1OMGFXOXVmU0JqWVd4c1ltRmphMXh1SUNBZ0tpQkFjbVYwZFhKdUlIdHpkSEpwYm1kOVhHNGdJQ0FxTDF4dUlDQkVhWE53WVhSamFHVnlMbkJ5YjNSdmRIbHdaUzV5WldkcGMzUmxjajFtZFc1amRHbHZiaWhqWVd4c1ltRmpheWtnZTF3aWRYTmxJSE4wY21samRGd2lPMXh1SUNBZ0lIWmhjaUJwWkNBOUlGOXdjbVZtYVhnZ0t5QmZiR0Z6ZEVsRUt5czdYRzRnSUNBZ2RHaHBjeTRrUkdsemNHRjBZMmhsY2w5allXeHNZbUZqYTNOYmFXUmRJRDBnWTJGc2JHSmhZMnM3WEc0Z0lDQWdjbVYwZFhKdUlHbGtPMXh1SUNCOU8xeHVYRzRnSUM4cUtseHVJQ0FnS2lCU1pXMXZkbVZ6SUdFZ1kyRnNiR0poWTJzZ1ltRnpaV1FnYjI0Z2FYUnpJSFJ2YTJWdUxseHVJQ0FnS2x4dUlDQWdLaUJBY0dGeVlXMGdlM04wY21sdVozMGdhV1JjYmlBZ0lDb3ZYRzRnSUVScGMzQmhkR05vWlhJdWNISnZkRzkwZVhCbExuVnVjbVZuYVhOMFpYSTlablZ1WTNScGIyNG9hV1FwSUh0Y0luVnpaU0J6ZEhKcFkzUmNJanRjYmlBZ0lDQnBiblpoY21saGJuUW9YRzRnSUNBZ0lDQjBhR2x6TGlSRWFYTndZWFJqYUdWeVgyTmhiR3hpWVdOcmMxdHBaRjBzWEc0Z0lDQWdJQ0FuUkdsemNHRjBZMmhsY2k1MWJuSmxaMmx6ZEdWeUtDNHVMaWs2SUdBbGMyQWdaRzlsY3lCdWIzUWdiV0Z3SUhSdklHRWdjbVZuYVhOMFpYSmxaQ0JqWVd4c1ltRmpheTRuTEZ4dUlDQWdJQ0FnYVdSY2JpQWdJQ0FwTzF4dUlDQWdJR1JsYkdWMFpTQjBhR2x6TGlSRWFYTndZWFJqYUdWeVgyTmhiR3hpWVdOcmMxdHBaRjA3WEc0Z0lIMDdYRzVjYmlBZ0x5b3FYRzRnSUNBcUlGZGhhWFJ6SUdadmNpQjBhR1VnWTJGc2JHSmhZMnR6SUhOd1pXTnBabWxsWkNCMGJ5QmlaU0JwYm5admEyVmtJR0psWm05eVpTQmpiMjUwYVc1MWFXNW5JR1Y0WldOMWRHbHZibHh1SUNBZ0tpQnZaaUIwYUdVZ1kzVnljbVZ1ZENCallXeHNZbUZqYXk0Z1ZHaHBjeUJ0WlhSb2IyUWdjMmh2ZFd4a0lHOXViSGtnWW1VZ2RYTmxaQ0JpZVNCaElHTmhiR3hpWVdOcklHbHVYRzRnSUNBcUlISmxjM0J2Ym5ObElIUnZJR0VnWkdsemNHRjBZMmhsWkNCd1lYbHNiMkZrTGx4dUlDQWdLbHh1SUNBZ0tpQkFjR0Z5WVcwZ2UyRnljbUY1UEhOMGNtbHVaejU5SUdsa2MxeHVJQ0FnS2k5Y2JpQWdSR2x6Y0dGMFkyaGxjaTV3Y205MGIzUjVjR1V1ZDJGcGRFWnZjajFtZFc1amRHbHZiaWhwWkhNcElIdGNJblZ6WlNCemRISnBZM1JjSWp0Y2JpQWdJQ0JwYm5aaGNtbGhiblFvWEc0Z0lDQWdJQ0IwYUdsekxpUkVhWE53WVhSamFHVnlYMmx6UkdsemNHRjBZMmhwYm1jc1hHNGdJQ0FnSUNBblJHbHpjR0YwWTJobGNpNTNZV2wwUm05eUtDNHVMaWs2SUUxMWMzUWdZbVVnYVc1MmIydGxaQ0IzYUdsc1pTQmthWE53WVhSamFHbHVaeTRuWEc0Z0lDQWdLVHRjYmlBZ0lDQm1iM0lnS0haaGNpQnBhU0E5SURBN0lHbHBJRHdnYVdSekxteGxibWQwYURzZ2FXa3JLeWtnZTF4dUlDQWdJQ0FnZG1GeUlHbGtJRDBnYVdSelcybHBYVHRjYmlBZ0lDQWdJR2xtSUNoMGFHbHpMaVJFYVhOd1lYUmphR1Z5WDJselVHVnVaR2x1WjF0cFpGMHBJSHRjYmlBZ0lDQWdJQ0FnYVc1MllYSnBZVzUwS0Z4dUlDQWdJQ0FnSUNBZ0lIUm9hWE11SkVScGMzQmhkR05vWlhKZmFYTklZVzVrYkdWa1cybGtYU3hjYmlBZ0lDQWdJQ0FnSUNBblJHbHpjR0YwWTJobGNpNTNZV2wwUm05eUtDNHVMaWs2SUVOcGNtTjFiR0Z5SUdSbGNHVnVaR1Z1WTNrZ1pHVjBaV04wWldRZ2QyaHBiR1VnSnlBclhHNGdJQ0FnSUNBZ0lDQWdKM2RoYVhScGJtY2dabTl5SUdBbGMyQXVKeXhjYmlBZ0lDQWdJQ0FnSUNCcFpGeHVJQ0FnSUNBZ0lDQXBPMXh1SUNBZ0lDQWdJQ0JqYjI1MGFXNTFaVHRjYmlBZ0lDQWdJSDFjYmlBZ0lDQWdJR2x1ZG1GeWFXRnVkQ2hjYmlBZ0lDQWdJQ0FnZEdocGN5NGtSR2x6Y0dGMFkyaGxjbDlqWVd4c1ltRmphM05iYVdSZExGeHVJQ0FnSUNBZ0lDQW5SR2x6Y0dGMFkyaGxjaTUzWVdsMFJtOXlLQzR1TGlrNklHQWxjMkFnWkc5bGN5QnViM1FnYldGd0lIUnZJR0VnY21WbmFYTjBaWEpsWkNCallXeHNZbUZqYXk0bkxGeHVJQ0FnSUNBZ0lDQnBaRnh1SUNBZ0lDQWdLVHRjYmlBZ0lDQWdJSFJvYVhNdUpFUnBjM0JoZEdOb1pYSmZhVzUyYjJ0bFEyRnNiR0poWTJzb2FXUXBPMXh1SUNBZ0lIMWNiaUFnZlR0Y2JseHVJQ0F2S2lwY2JpQWdJQ29nUkdsemNHRjBZMmhsY3lCaElIQmhlV3h2WVdRZ2RHOGdZV3hzSUhKbFoybHpkR1Z5WldRZ1kyRnNiR0poWTJ0ekxseHVJQ0FnS2x4dUlDQWdLaUJBY0dGeVlXMGdlMjlpYW1WamRIMGdjR0Y1Ykc5aFpGeHVJQ0FnS2k5Y2JpQWdSR2x6Y0dGMFkyaGxjaTV3Y205MGIzUjVjR1V1WkdsemNHRjBZMmc5Wm5WdVkzUnBiMjRvY0dGNWJHOWhaQ2tnZTF3aWRYTmxJSE4wY21samRGd2lPMXh1SUNBZ0lHbHVkbUZ5YVdGdWRDaGNiaUFnSUNBZ0lDRjBhR2x6TGlSRWFYTndZWFJqYUdWeVgybHpSR2x6Y0dGMFkyaHBibWNzWEc0Z0lDQWdJQ0FuUkdsemNHRjBZMmd1WkdsemNHRjBZMmdvTGk0dUtUb2dRMkZ1Ym05MElHUnBjM0JoZEdOb0lHbHVJSFJvWlNCdGFXUmtiR1VnYjJZZ1lTQmthWE53WVhSamFDNG5YRzRnSUNBZ0tUdGNiaUFnSUNCMGFHbHpMaVJFYVhOd1lYUmphR1Z5WDNOMFlYSjBSR2x6Y0dGMFkyaHBibWNvY0dGNWJHOWhaQ2s3WEc0Z0lDQWdkSEo1SUh0Y2JpQWdJQ0FnSUdadmNpQW9kbUZ5SUdsa0lHbHVJSFJvYVhNdUpFUnBjM0JoZEdOb1pYSmZZMkZzYkdKaFkydHpLU0I3WEc0Z0lDQWdJQ0FnSUdsbUlDaDBhR2x6TGlSRWFYTndZWFJqYUdWeVgybHpVR1Z1WkdsdVoxdHBaRjBwSUh0Y2JpQWdJQ0FnSUNBZ0lDQmpiMjUwYVc1MVpUdGNiaUFnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdJQ0IwYUdsekxpUkVhWE53WVhSamFHVnlYMmx1ZG05clpVTmhiR3hpWVdOcktHbGtLVHRjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlJR1pwYm1Gc2JIa2dlMXh1SUNBZ0lDQWdkR2hwY3k0a1JHbHpjR0YwWTJobGNsOXpkRzl3UkdsemNHRjBZMmhwYm1jb0tUdGNiaUFnSUNCOVhHNGdJSDA3WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJRWx6SUhSb2FYTWdSR2x6Y0dGMFkyaGxjaUJqZFhKeVpXNTBiSGtnWkdsemNHRjBZMmhwYm1jdVhHNGdJQ0FxWEc0Z0lDQXFJRUJ5WlhSMWNtNGdlMkp2YjJ4bFlXNTlYRzRnSUNBcUwxeHVJQ0JFYVhOd1lYUmphR1Z5TG5CeWIzUnZkSGx3WlM1cGMwUnBjM0JoZEdOb2FXNW5QV1oxYm1OMGFXOXVLQ2tnZTF3aWRYTmxJSE4wY21samRGd2lPMXh1SUNBZ0lISmxkSFZ5YmlCMGFHbHpMaVJFYVhOd1lYUmphR1Z5WDJselJHbHpjR0YwWTJocGJtYzdYRzRnSUgwN1hHNWNiaUFnTHlvcVhHNGdJQ0FxSUVOaGJHd2dkR2hsSUdOaGJHeGlZV05ySUhOMGIzSmxaQ0IzYVhSb0lIUm9aU0JuYVhabGJpQnBaQzRnUVd4emJ5QmtieUJ6YjIxbElHbHVkR1Z5Ym1Gc1hHNGdJQ0FxSUdKdmIydHJaV1Z3YVc1bkxseHVJQ0FnS2x4dUlDQWdLaUJBY0dGeVlXMGdlM04wY21sdVozMGdhV1JjYmlBZ0lDb2dRR2x1ZEdWeWJtRnNYRzRnSUNBcUwxeHVJQ0JFYVhOd1lYUmphR1Z5TG5CeWIzUnZkSGx3WlM0a1JHbHpjR0YwWTJobGNsOXBiblp2YTJWRFlXeHNZbUZqYXoxbWRXNWpkR2x2YmlocFpDa2dlMXdpZFhObElITjBjbWxqZEZ3aU8xeHVJQ0FnSUhSb2FYTXVKRVJwYzNCaGRHTm9aWEpmYVhOUVpXNWthVzVuVzJsa1hTQTlJSFJ5ZFdVN1hHNGdJQ0FnZEdocGN5NGtSR2x6Y0dGMFkyaGxjbDlqWVd4c1ltRmphM05iYVdSZEtIUm9hWE11SkVScGMzQmhkR05vWlhKZmNHVnVaR2x1WjFCaGVXeHZZV1FwTzF4dUlDQWdJSFJvYVhNdUpFUnBjM0JoZEdOb1pYSmZhWE5JWVc1a2JHVmtXMmxrWFNBOUlIUnlkV1U3WEc0Z0lIMDdYRzVjYmlBZ0x5b3FYRzRnSUNBcUlGTmxkQ0IxY0NCaWIyOXJhMlZsY0dsdVp5QnVaV1ZrWldRZ2QyaGxiaUJrYVhOd1lYUmphR2x1Wnk1Y2JpQWdJQ3BjYmlBZ0lDb2dRSEJoY21GdElIdHZZbXBsWTNSOUlIQmhlV3h2WVdSY2JpQWdJQ29nUUdsdWRHVnlibUZzWEc0Z0lDQXFMMXh1SUNCRWFYTndZWFJqYUdWeUxuQnliM1J2ZEhsd1pTNGtSR2x6Y0dGMFkyaGxjbDl6ZEdGeWRFUnBjM0JoZEdOb2FXNW5QV1oxYm1OMGFXOXVLSEJoZVd4dllXUXBJSHRjSW5WelpTQnpkSEpwWTNSY0lqdGNiaUFnSUNCbWIzSWdLSFpoY2lCcFpDQnBiaUIwYUdsekxpUkVhWE53WVhSamFHVnlYMk5oYkd4aVlXTnJjeWtnZTF4dUlDQWdJQ0FnZEdocGN5NGtSR2x6Y0dGMFkyaGxjbDlwYzFCbGJtUnBibWRiYVdSZElEMGdabUZzYzJVN1hHNGdJQ0FnSUNCMGFHbHpMaVJFYVhOd1lYUmphR1Z5WDJselNHRnVaR3hsWkZ0cFpGMGdQU0JtWVd4elpUdGNiaUFnSUNCOVhHNGdJQ0FnZEdocGN5NGtSR2x6Y0dGMFkyaGxjbDl3Wlc1a2FXNW5VR0Y1Ykc5aFpDQTlJSEJoZVd4dllXUTdYRzRnSUNBZ2RHaHBjeTRrUkdsemNHRjBZMmhsY2w5cGMwUnBjM0JoZEdOb2FXNW5JRDBnZEhKMVpUdGNiaUFnZlR0Y2JseHVJQ0F2S2lwY2JpQWdJQ29nUTJ4bFlYSWdZbTl2YTJ0bFpYQnBibWNnZFhObFpDQm1iM0lnWkdsemNHRjBZMmhwYm1jdVhHNGdJQ0FxWEc0Z0lDQXFJRUJwYm5SbGNtNWhiRnh1SUNBZ0tpOWNiaUFnUkdsemNHRjBZMmhsY2k1d2NtOTBiM1I1Y0dVdUpFUnBjM0JoZEdOb1pYSmZjM1J2Y0VScGMzQmhkR05vYVc1blBXWjFibU4wYVc5dUtDa2dlMXdpZFhObElITjBjbWxqZEZ3aU8xeHVJQ0FnSUhSb2FYTXVKRVJwYzNCaGRHTm9aWEpmY0dWdVpHbHVaMUJoZVd4dllXUWdQU0J1ZFd4c08xeHVJQ0FnSUhSb2FYTXVKRVJwYzNCaGRHTm9aWEpmYVhORWFYTndZWFJqYUdsdVp5QTlJR1poYkhObE8xeHVJQ0I5TzF4dVhHNWNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdSR2x6Y0dGMFkyaGxjanRjYmlKZGZRPT0iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBpbnZhcmlhbnRcbiAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKiBVc2UgaW52YXJpYW50KCkgdG8gYXNzZXJ0IHN0YXRlIHdoaWNoIHlvdXIgcHJvZ3JhbSBhc3N1bWVzIHRvIGJlIHRydWUuXG4gKlxuICogUHJvdmlkZSBzcHJpbnRmLXN0eWxlIGZvcm1hdCAob25seSAlcyBpcyBzdXBwb3J0ZWQpIGFuZCBhcmd1bWVudHNcbiAqIHRvIHByb3ZpZGUgaW5mb3JtYXRpb24gYWJvdXQgd2hhdCBicm9rZSBhbmQgd2hhdCB5b3Ugd2VyZVxuICogZXhwZWN0aW5nLlxuICpcbiAqIFRoZSBpbnZhcmlhbnQgbWVzc2FnZSB3aWxsIGJlIHN0cmlwcGVkIGluIHByb2R1Y3Rpb24sIGJ1dCB0aGUgaW52YXJpYW50XG4gKiB3aWxsIHJlbWFpbiB0byBlbnN1cmUgbG9naWMgZG9lcyBub3QgZGlmZmVyIGluIHByb2R1Y3Rpb24uXG4gKi9cblxudmFyIGludmFyaWFudCA9IGZ1bmN0aW9uKGNvbmRpdGlvbiwgZm9ybWF0LCBhLCBiLCBjLCBkLCBlLCBmKSB7XG4gIGlmIChmYWxzZSkge1xuICAgIGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhcmlhbnQgcmVxdWlyZXMgYW4gZXJyb3IgbWVzc2FnZSBhcmd1bWVudCcpO1xuICAgIH1cbiAgfVxuXG4gIGlmICghY29uZGl0aW9uKSB7XG4gICAgdmFyIGVycm9yO1xuICAgIGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoXG4gICAgICAgICdNaW5pZmllZCBleGNlcHRpb24gb2NjdXJyZWQ7IHVzZSB0aGUgbm9uLW1pbmlmaWVkIGRldiBlbnZpcm9ubWVudCAnICtcbiAgICAgICAgJ2ZvciB0aGUgZnVsbCBlcnJvciBtZXNzYWdlIGFuZCBhZGRpdGlvbmFsIGhlbHBmdWwgd2FybmluZ3MuJ1xuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGFyZ3MgPSBbYSwgYiwgYywgZCwgZSwgZl07XG4gICAgICB2YXIgYXJnSW5kZXggPSAwO1xuICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoXG4gICAgICAgICdJbnZhcmlhbnQgVmlvbGF0aW9uOiAnICtcbiAgICAgICAgZm9ybWF0LnJlcGxhY2UoLyVzL2csIGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJnc1thcmdJbmRleCsrXTsgfSlcbiAgICAgICk7XG4gICAgfVxuXG4gICAgZXJyb3IuZnJhbWVzVG9Qb3AgPSAxOyAvLyB3ZSBkb24ndCBjYXJlIGFib3V0IGludmFyaWFudCdzIG93biBmcmFtZVxuICAgIHRocm93IGVycm9yO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGludmFyaWFudDtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pTDFWelpYSnpMMmhpZFhKeWIzZHpMMlJsZGk5b1pYSnZhM1V2Y21WaFkzUXRabXgxZUMxemRHRnlkR1Z5TDNCMVlteHBZeTlxWVhaaGMyTnlhWEIwY3k5MlpXNWtiM0l2Wm14MWVDOXBiblpoY21saGJuUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5b1luVnljbTkzY3k5a1pYWXZhR1Z5YjJ0MUwzSmxZV04wTFdac2RYZ3RjM1JoY25SbGNpOXdkV0pzYVdNdmFtRjJZWE5qY21sd2RITXZkbVZ1Wkc5eUwyWnNkWGd2YVc1MllYSnBZVzUwTG1weklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lKQlFVRkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFc1IwRkJSenM3UVVGRlNDeFpRVUZaTEVOQlFVTTdPMEZCUldJN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRU3hIUVVGSE96dEJRVVZJTEVsQlFVa3NVMEZCVXl4SFFVRkhMRk5CUVZNc1UwRkJVeXhGUVVGRkxFMUJRVTBzUlVGQlJTeERRVUZETEVWQlFVVXNRMEZCUXl4RlFVRkZMRU5CUVVNc1JVRkJSU3hEUVVGRExFVkJRVVVzUTBGQlF5eEZRVUZGTEVOQlFVTXNSVUZCUlR0RlFVTTFSQ3hKUVVGSkxFdEJRVXNzUlVGQlJUdEpRVU5VTEVsQlFVa3NUVUZCVFN4TFFVRkxMRk5CUVZNc1JVRkJSVHROUVVONFFpeE5RVUZOTEVsQlFVa3NTMEZCU3l4RFFVRkRMRGhEUVVFNFF5eERRVUZETEVOQlFVTTdTMEZEYWtVN1FVRkRUQ3hIUVVGSE96dEZRVVZFTEVsQlFVa3NRMEZCUXl4VFFVRlRMRVZCUVVVN1NVRkRaQ3hKUVVGSkxFdEJRVXNzUTBGQlF6dEpRVU5XTEVsQlFVa3NUVUZCVFN4TFFVRkxMRk5CUVZNc1JVRkJSVHROUVVONFFpeExRVUZMTEVkQlFVY3NTVUZCU1N4TFFVRkxPMUZCUTJZc2IwVkJRVzlGTzFGQlEzQkZMRFpFUVVFMlJEdFBRVU01UkN4RFFVRkRPMHRCUTBnc1RVRkJUVHROUVVOTUxFbEJRVWtzU1VGQlNTeEhRVUZITEVOQlFVTXNRMEZCUXl4RlFVRkZMRU5CUVVNc1JVRkJSU3hEUVVGRExFVkJRVVVzUTBGQlF5eEZRVUZGTEVOQlFVTXNSVUZCUlN4RFFVRkRMRU5CUVVNc1EwRkJRenROUVVNNVFpeEpRVUZKTEZGQlFWRXNSMEZCUnl4RFFVRkRMRU5CUVVNN1RVRkRha0lzUzBGQlN5eEhRVUZITEVsQlFVa3NTMEZCU3p0UlFVTm1MSFZDUVVGMVFqdFJRVU4yUWl4TlFVRk5MRU5CUVVNc1QwRkJUeXhEUVVGRExFdEJRVXNzUlVGQlJTeFhRVUZYTEVWQlFVVXNUMEZCVHl4SlFVRkpMRU5CUVVNc1VVRkJVU3hGUVVGRkxFTkJRVU1zUTBGQlF5eEZRVUZGTEVOQlFVTTdUMEZETDBRc1EwRkJRenRCUVVOU0xFdEJRVXM3TzBsQlJVUXNTMEZCU3l4RFFVRkRMRmRCUVZjc1IwRkJSeXhEUVVGRExFTkJRVU03U1VGRGRFSXNUVUZCVFN4TFFVRkxMRU5CUVVNN1IwRkRZanRCUVVOSUxFTkJRVU1zUTBGQlF6czdRVUZGUml4TlFVRk5MRU5CUVVNc1QwRkJUeXhIUVVGSExGTkJRVk1zUTBGQlF5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJaThxS2x4dUlDb2dRMjl3ZVhKcFoyaDBJQ2hqS1NBeU1ERTBMQ0JHWVdObFltOXZheXdnU1c1akxseHVJQ29nUVd4c0lISnBaMmgwY3lCeVpYTmxjblpsWkM1Y2JpQXFYRzRnS2lCVWFHbHpJSE52ZFhKalpTQmpiMlJsSUdseklHeHBZMlZ1YzJWa0lIVnVaR1Z5SUhSb1pTQkNVMFF0YzNSNWJHVWdiR2xqWlc1elpTQm1iM1Z1WkNCcGJpQjBhR1ZjYmlBcUlFeEpRMFZPVTBVZ1ptbHNaU0JwYmlCMGFHVWdjbTl2ZENCa2FYSmxZM1J2Y25rZ2IyWWdkR2hwY3lCemIzVnlZMlVnZEhKbFpTNGdRVzRnWVdSa2FYUnBiMjVoYkNCbmNtRnVkRnh1SUNvZ2IyWWdjR0YwWlc1MElISnBaMmgwY3lCallXNGdZbVVnWm05MWJtUWdhVzRnZEdobElGQkJWRVZPVkZNZ1ptbHNaU0JwYmlCMGFHVWdjMkZ0WlNCa2FYSmxZM1J2Y25rdVhHNGdLbHh1SUNvZ1FIQnliM1pwWkdWelRXOWtkV3hsSUdsdWRtRnlhV0Z1ZEZ4dUlDb3ZYRzVjYmx3aWRYTmxJSE4wY21samRGd2lPMXh1WEc0dktpcGNiaUFxSUZWelpTQnBiblpoY21saGJuUW9LU0IwYnlCaGMzTmxjblFnYzNSaGRHVWdkMmhwWTJnZ2VXOTFjaUJ3Y205bmNtRnRJR0Z6YzNWdFpYTWdkRzhnWW1VZ2RISjFaUzVjYmlBcVhHNGdLaUJRY205MmFXUmxJSE53Y21sdWRHWXRjM1I1YkdVZ1ptOXliV0YwSUNodmJteDVJQ1Z6SUdseklITjFjSEJ2Y25SbFpDa2dZVzVrSUdGeVozVnRaVzUwYzF4dUlDb2dkRzhnY0hKdmRtbGtaU0JwYm1admNtMWhkR2x2YmlCaFltOTFkQ0IzYUdGMElHSnliMnRsSUdGdVpDQjNhR0YwSUhsdmRTQjNaWEpsWEc0Z0tpQmxlSEJsWTNScGJtY3VYRzRnS2x4dUlDb2dWR2hsSUdsdWRtRnlhV0Z1ZENCdFpYTnpZV2RsSUhkcGJHd2dZbVVnYzNSeWFYQndaV1FnYVc0Z2NISnZaSFZqZEdsdmJpd2dZblYwSUhSb1pTQnBiblpoY21saGJuUmNiaUFxSUhkcGJHd2djbVZ0WVdsdUlIUnZJR1Z1YzNWeVpTQnNiMmRwWXlCa2IyVnpJRzV2ZENCa2FXWm1aWElnYVc0Z2NISnZaSFZqZEdsdmJpNWNiaUFxTDF4dVhHNTJZWElnYVc1MllYSnBZVzUwSUQwZ1puVnVZM1JwYjI0b1kyOXVaR2wwYVc5dUxDQm1iM0p0WVhRc0lHRXNJR0lzSUdNc0lHUXNJR1VzSUdZcElIdGNiaUFnYVdZZ0tHWmhiSE5sS1NCN1hHNGdJQ0FnYVdZZ0tHWnZjbTFoZENBOVBUMGdkVzVrWldacGJtVmtLU0I3WEc0Z0lDQWdJQ0IwYUhKdmR5QnVaWGNnUlhKeWIzSW9KMmx1ZG1GeWFXRnVkQ0J5WlhGMWFYSmxjeUJoYmlCbGNuSnZjaUJ0WlhOellXZGxJR0Z5WjNWdFpXNTBKeWs3WEc0Z0lDQWdmVnh1SUNCOVhHNWNiaUFnYVdZZ0tDRmpiMjVrYVhScGIyNHBJSHRjYmlBZ0lDQjJZWElnWlhKeWIzSTdYRzRnSUNBZ2FXWWdLR1p2Y20xaGRDQTlQVDBnZFc1a1pXWnBibVZrS1NCN1hHNGdJQ0FnSUNCbGNuSnZjaUE5SUc1bGR5QkZjbkp2Y2loY2JpQWdJQ0FnSUNBZ0owMXBibWxtYVdWa0lHVjRZMlZ3ZEdsdmJpQnZZMk4xY25KbFpEc2dkWE5sSUhSb1pTQnViMjR0YldsdWFXWnBaV1FnWkdWMklHVnVkbWx5YjI1dFpXNTBJQ2NnSzF4dUlDQWdJQ0FnSUNBblptOXlJSFJvWlNCbWRXeHNJR1Z5Y205eUlHMWxjM05oWjJVZ1lXNWtJR0ZrWkdsMGFXOXVZV3dnYUdWc2NHWjFiQ0IzWVhKdWFXNW5jeTRuWEc0Z0lDQWdJQ0FwTzF4dUlDQWdJSDBnWld4elpTQjdYRzRnSUNBZ0lDQjJZWElnWVhKbmN5QTlJRnRoTENCaUxDQmpMQ0JrTENCbExDQm1YVHRjYmlBZ0lDQWdJSFpoY2lCaGNtZEpibVJsZUNBOUlEQTdYRzRnSUNBZ0lDQmxjbkp2Y2lBOUlHNWxkeUJGY25KdmNpaGNiaUFnSUNBZ0lDQWdKMGx1ZG1GeWFXRnVkQ0JXYVc5c1lYUnBiMjQ2SUNjZ0sxeHVJQ0FnSUNBZ0lDQm1iM0p0WVhRdWNtVndiR0ZqWlNndkpYTXZaeXdnWm5WdVkzUnBiMjRvS1NCN0lISmxkSFZ5YmlCaGNtZHpXMkZ5WjBsdVpHVjRLeXRkT3lCOUtWeHVJQ0FnSUNBZ0tUdGNiaUFnSUNCOVhHNWNiaUFnSUNCbGNuSnZjaTVtY21GdFpYTlViMUJ2Y0NBOUlERTdJQzh2SUhkbElHUnZiaWQwSUdOaGNtVWdZV0p2ZFhRZ2FXNTJZWEpwWVc1MEozTWdiM2R1SUdaeVlXMWxYRzRnSUNBZ2RHaHliM2NnWlhKeWIzSTdYRzRnSUgxY2JuMDdYRzVjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnYVc1MllYSnBZVzUwTzF4dUlsMTkiXX0=
