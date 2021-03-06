//     Underscore.js 1.9.1
//     http://underscorejs.org
//     (c) 2009-2018 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function () {
  // Baseline setup
  // --------------

  // Establish the root object, `window` (`self`) in the browser, `global`
  // on the server, or `this` in some virtual machines. We use `self`
  // instead of `window` for `WebWorker` support.
  // 根变量 window  global......
  var root =
    (typeof self == "object" && self.self === self && self) ||
    (typeof global == "object" && global.global === global && global) ||
    this ||
    {};
  // root 可能就是window或者global对象--->如果是存在window对象 或者global则为global对象 不存在就为{}

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype,
    ObjProto = Object.prototype;
  var SymbolProto = typeof Symbol !== "undefined" ? Symbol.prototype : null;

  // Create quick reference variables for speed access to core prototypes.
  var push = ArrayProto.push,
    slice = ArrayProto.slice,
    toString = ObjProto.toString,
    hasOwnProperty = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var nativeIsArray = Array.isArray,
    nativeKeys = Object.keys,
    nativeCreate = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function () { };

  // Create a safe reference to the Underscore object for use below.
  var _ = function (obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj); //return回去的是_函数的实例化对象 也就是说这样子_()调是实例化一个_对象并不是直接使用父对象_ 然后去调原型的方法
    // 总结，_([1, 2, 3]) 返回一个对象，为 {_wrapped: [1, 2, 3]}，该对象的原型指向 _.prototype
    this._wrapped = obj; // 注意函数执行顺序 执行走的这步是在return new _(obj)内执行的 所以是🈶return的 还是debug好用
    // 每次执行_()都会产生  this._wrapped = obj; {_wrapped: [1, 2, 3]}
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for their old module API. If we're in
  // the browser, add `_` as a global object.
  // (`nodeType` is checked to ensure that `module`
  // and `exports` are not HTML elements.)
  if (typeof exports != "undefined" && !exports.nodeType) {
    if (typeof module != "undefined" && !module.nodeType && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = "1.9.1";

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  // 也就是优化绑定上下文
  /*
  1 绑定this作用域
  2 尽量使用指定参数，而不是arguments
  */
  var optimizeCb = function (func, context, argCount) {
    if (context === void 0) return func;
    // 隐式转换 应该不传是undefined
    switch (argCount == null ? 3 : argCount) {
      case 1:
        return function (value) {
          return func.call(context, value);
        };
      // The 2-argument case is omitted because we’re not using it.
      case 3:
        return function (value, index, collection) {
          // 这里是函数的执行 不是函数 所以才会在外层包装一个
          return func.call(context, value, index, collection);
        };
      case 4:
        return function (accumulator, value, index, collection) {
          return func.call(context, accumulator, value, index, collection);
        };
    }
    return function () {
      return func.apply(context, arguments);
    };
  };

  var builtinIteratee;

  // An internal function to generate callbacks that can be applied to each
  // element in a collection, returning the desired result — either `identity`,
  // an arbitrary callback, a property matcher, or a property accessor.
  // cb-->callback  如果传入的不是函数 经过包装也会返回函数  An internal function to  callbacks that can be applied to each
  var cb = function (value, context, argCount) {
    // value正常的话传进来是function 非正常情况 字符串 数组 对象等
    /*
    
    因为 _.iteratee = builtinIteratee 的缘故，_.iteratee !== builtinIteratee 值为 false，所以正常情况下 _.iteratee(value, context)` 并不会执行。

    但是如果我们在外部修改了 _.iteratee 函数，结果便会为 true，cb 函数直接返回 _.iteratee(value, context)。

     这个意思其实是说用我们自定义的 _.iteratee 函数来处理 value 和 context
    
    */

    if (_.iteratee !== builtinIteratee) return _.iteratee(value, context);
    // undefined==null //true  如果value不传则为undefined
    if (value == null) return _.identity; // 也是返回一个函数
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    // typeof [] // object
    // 这里的isObject 检测 function array object 都为object
    // 但是我们归纳是对象是对象 数组就是数组
    if (_.isObject(value) && !_.isArray(value)) return _.matcher(value);
    // return的是个function
    return _.property(value);
  };

  // External wrapper for our callback generator. Users may customize
  // `_.iteratee` if they want additional predicate/iteratee shorthand styles.
  // This abstraction hides the internal-only argCount argument.
  // builtinIteratee 内建builtin

  _.iteratee = builtinIteratee = function (value, context) {
    return cb(value, context, Infinity);
  };

  // Some functions take a variable number of arguments, or a few expected
  // arguments at the beginning and then a variable number of values to operate
  // on. This helper accumulates all remaining arguments past the function’s
  // argument length (or an explicit `startIndex`), into an array that becomes
  // the last argument. Similar to ES6’s "rest parameter".
  // 这个做剩余参数处理的函数缺点就是剩余参数直接放进去一个数组，并不能一个一个对应上
  /*
   如果不使用 ... 拓展操作符，仅用 ES5 的内容，该怎么实现呢？

   我们可以写一个 restArgs 函数，传入一个函数，使用函数的最后一个参数储存剩下的函数参数，使用效果如下：

   想想这样写的好处就是...args  我们可以拿到args这个变量  而这个变量存着剩余的参数  数组存储

  */

  var restArguments = function (func, startIndex) {
    // 不会傻乎乎给用户规定的 默认就是rest是最后一个参数   而且rest是以数组存放剩余参数的
    startIndex = startIndex == null ? func.length - 1 : +startIndex;
    return function () {
      var length = Math.max(arguments.length - startIndex, 0),
        rest = Array(length),
        index = 0;
      for (; index < length; index++) {
        rest[index] = arguments[index + startIndex];
      }
      switch (startIndex) {
        case 0:
          return func.call(this, rest);
        case 1:
          return func.call(this, arguments[0], rest);
        case 2:
          return func.call(this, arguments[0], arguments[1], rest);
      }

      var args = Array(startIndex + 1);
      for (index = 0; index < startIndex; index++) {
        args[index] = arguments[index];
      }
      // rest是以数组看待
      args[startIndex] = rest;
      // console.log("args", args);
      // console.log("rest", rest);
      return func.apply(this, args);
    };
  };
  // internal---> 内部
  // An internal function for creating a new object that inherits from another.
  // Object.create()方法创建一个新对象，使用现有的对象来提供新创建的对象的__proto__
  // baseCreate实际就是Object.create()的兼容写法
  // 都是创建一个新对象 但是可以指定新对象的原型对象
  var baseCreate = function (prototype) {
    if (!_.isObject(prototype)) return {};
    // 如果支持Object.create方法
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor();
    Ctor.prototype = null;
    return result;
  };

  var shallowProperty = function (key) {
    return function (obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  var has = function (obj, path) {
    return obj != null && hasOwnProperty.call(obj, path);
  };

  // 深度拿到属性
  var deepGet = function (obj, path) {
    var length = path.length;
    for (var i = 0; i < length; i++) {
      // 写判断你有没有发现 return代表else
      if (obj == null) return void 0;
      obj = obj[path[i]];
    }
    return length ? obj : void 0;
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object.
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = shallowProperty("length");
  // collection集合
  // isArrayLike是个类数组检测
  // 兼容到类数组  这个对象像数组也是按照数组来处理
  /* 
    var obj = {
                0 : "a",
                1 : "第二",
                2 :    "1234",
                length : 3
             }
  */
  // javascript中常见的类数组有arguments对象和DOM方法的返回结果。
  // callee是Arguments类数组才有的属性  指向该本身的函数
  // 判断类数组只要判断length是数值就行  这一点的判断就很奇怪了   感觉判断不了
  // 也就是类数组对象 自然而然满足length对应下标元素个数 只要判断length就行  --->应该是这样理解的
  // https://juejin.im/post/5be561a6f265da613f2efb73
  // 类数组按照数组看待
  var isArrayLike = function (collection) {
    var length = getLength(collection);
    return (
      typeof length == "number" && length >= 0 && length <= MAX_ARRAY_INDEX
    );
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function (obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    // arguments也是数组(类数组)
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  // each、map等方法（内部迭代器模式）统一叫迭代函数，map中iteratee迭代者函数必须是return一个值,然后最后结果最后返回一个处理完后的数组
  _.map = _.collect = function (obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    // 如果为数组keys为undefined 都不会走赋值这步
    var keys = !isArrayLike(obj) && _.keys(obj),
      length = (keys || obj).length,
      results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      // 会传给iteratee函数三个值 iteratee是用户自定义的函数（方法）
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  var createReduce = function (dir) {
    // Wrap code that reassigns argument variables in a separate function than
    // the one that accesses `arguments.length` to avoid a perf hit. (#1991)
    var reducer = function (obj, iteratee, memo, initial) {
      var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        index = dir > 0 ? 0 : length - 1;
      if (!initial) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        // 重点这一步
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    };

    return function (obj, iteratee, memo, context) {
      var initial = arguments.length >= 3;
      return reducer(obj, optimizeCb(iteratee, context, 4), memo, initial);
    };
  };

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  // 1代表从左到右
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  // -1从右到左
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function (obj, predicate, context) {
    var keyFinder = isArrayLike(obj) ? _.findIndex : _.findKey;
    var key = keyFinder(obj, predicate, context);
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function (obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function (value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function (obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function (obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
      length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function (obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
      length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function (obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != "number" || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  // restArguments让回调函数的最后一个参数变量具有rest能力 ----- 可以简单的这样理解
  _.invoke = restArguments(function (obj, path, args) {
    // 剩余参数rest是个数组
    // console.log(arguments);
    // console.log("args==============》", args);
    // console.log("arguments", arguments);
    // console.log("obj", obj);
    // console.log("path", path);
    var contextPath, func;
    if (_.isFunction(path)) {
      func = path;
    } else if (_.isArray(path)) {
      contextPath = path.slice(0, -1);
      path = path[path.length - 1];
    }
    // 把context传入
    return _.map(obj, function (context) {
      var method = func;
      if (!method) {
        if (contextPath && contextPath.length) {
          context = deepGet(context, contextPath);
        }
        if (context == null) return void 0;
        // 数组的方法
        method = context[path];
      }
      return method == null ? method : method.apply(context, args);
    });
  });

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function (obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function (obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function (obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function (obj, iteratee, context) {
    var result = -Infinity,
      lastComputed = -Infinity,
      value,
      computed;
    // review源码的时候给每个判断做注释 就简单清晰多了 ！！！
    //如果没有传入的iteratee或者传入的是number
    if (
      iteratee == null ||
      (typeof iteratee == "number" && typeof obj[0] != "object" && obj != null)
    ) {
      // obj是个数组（前面已经判断数组属性值不是对象）
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value != null && value > result) {
          result = value;
        }
      }
    } else {
      // 如果传的iteratee是个对象 也会走这步
      iteratee = cb(iteratee, context);
      _.each(obj, function (v, index, list) {
        computed = iteratee(v, index, list);
        if (
          computed > lastComputed ||
          (computed === -Infinity && result === -Infinity)
        ) {
          result = v;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function (obj, iteratee, context) {
    var result = Infinity,
      lastComputed = Infinity,
      value,
      computed;
    if (
      iteratee == null ||
      (typeof iteratee == "number" && typeof obj[0] != "object" && obj != null)
    ) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value != null && value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function (v, index, list) {
        computed = iteratee(v, index, list);
        if (
          computed < lastComputed ||
          (computed === Infinity && result === Infinity)
        ) {
          result = v;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection.
  _.shuffle = function (obj) {
    return _.sample(obj, Infinity);
  };

  // Sample **n** random values from a collection using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  // 记得一个map集合是无序的也就是随机的
  /*
  
   算法的过程如下：
    需要随机置乱的n个元素的数组a
    从0到n开始循环，循环变量为i
    生成随机数K，K为0到n之间的随机数
    交换i位和K位的值
  */
  // https://juejin.im/post/59deda706fb9a045204b3625#heading-4
  // Fisher–Yates:原理很简单，就是遍历数组元素，然后将当前元素与以后随机位置的元素进行交换，从代码中也可以看出，这样乱序的就会更加彻底
  // 这是一种规律现象 按照数学的来理解
  /*
  var rand = _.random(index, last);
      var temp = sample[index];
      // 底下两步的操作 就是算法的核心
      sample[index] = sample[rand];
      sample[rand] = temp;
  */
  _.sample = function (obj, n, guard) {
    // n是没有传入的 只返回一个值
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    // 如果是个obj对象 拿到values数组
    var sample = isArrayLike(obj) ? _.clone(obj) : _.values(obj);
    var length = getLength(sample);
    n = Math.max(Math.min(n, length), 0);
    var last = length - 1;
    for (var index = 0; index < n; index++) {
      var rand = _.random(index, last);
      var temp = sample[index];
      sample[index] = sample[rand];
      sample[rand] = temp;
    }
    return sample.slice(0, n);
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function (obj, iteratee, context) {
    var index = 0;
    iteratee = cb(iteratee, context);
    // criteria条件
    return _.pluck(
      _.map(obj, function (value, key, list) {
        //  [{}...]
        // 键值为value
        // 新创建一个对象 把item扔进去value 再筛选value出来 这个value就是item
        // map是支持对象循环的
        return {
          value: value,
          index: index++,
          criteria: iteratee(value, key, list)
        };
      }).sort(function (left, right) {
        // 要根据的属性值比较
        var a = left.criteria;
        var b = right.criteria;
        if (a !== b) {
          if (a > b || a === void 0) return 1;
          if (a < b || b === void 0) return -1;
        }
        // 如果a===b的情况 根据index
        return left.index - right.index;
      }),
      "value"
    );
  };

  // An internal function used for aggregate "group by" operations.
  var group = function (behavior, partition) {
    // partition区分
    // 有partition则为[[],[]] 没有则为{}
    // 认清楚是函数引用 还是函数执行
    return function (obj, iteratee, context) {
      // _.groupBy(list, iteratee, [context])
      // iteratee默认传入的参数是value, index, obj
      // 并且这个iteratee需要返回值
      var result = partition ? [[], []] : {};
      iteratee = cb(iteratee, context);
      _.each(obj, function (value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function (result, value, key) {
    if (has(result, key)) result[key].push(value);
    else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function (result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function (result, value, key) {
    if (has(result, key)) result[key]++;
    else result[key] = 1;
  });

  var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
  // Safely create a real, live array from anything iterable.
  _.toArray = function (obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (_.isString(obj)) {
      // Keep surrogate pair characters together
      return obj.match(reStrSymbol);
    }
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function (obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = group(function (result, value, pass) {
    result[pass ? 0 : 1].push(value);
  }, true);

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function (array, n, guard) {
    if (array == null || array.length < 1) return n == null ? void 0 : [];
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function (array, n, guard) {
    return slice.call(
      array,
      0,
      Math.max(0, array.length - (n == null || guard ? 1 : n))
    );
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function (array, n, guard) {
    if (array == null || array.length < 1) return n == null ? void 0 : [];
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function (array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function (array) {
    return _.filter(array, Boolean);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function (input, shallow, strict, output) {
    // output 数组保存结果
    // 即 flatten 方法返回数据
    // idx 为 output 的累计数组下标
    output = output || [];
    var idx = output.length;
    for (var i = 0, length = getLength(input); i < length; i++) {
      // 数组篇考虑的作用对象就是类数组了 不用考虑普通对象
      // 所以这也是一来不用判断是否为数组的原因
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        // Flatten current level of array or arguments object.
        if (shallow) {
          var j = 0,
            len = value.length;
          // 就做一层循环
          while (j < len) output[idx++] = value[j++];
        } else {
          flatten(value, shallow, strict, output);
          idx = output.length;
        }
        // strict的作用
      } else if (!strict) {
        // 🤔：递归怎么写？
        // 核心步骤  递归写的时候你先把核心步骤要实现的写出来再来考虑递归
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function (array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = restArguments(function (array, otherArrays) {
    return _.difference(array, otherArrays);
  });

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // The faster algorithm will not work with an iteratee if the iteratee
  // is not a one-to-one function, so providing an iteratee will disable
  // the faster algorithm.
  // Aliased as `unique`.
  // 如果要处理对象元素, 传参 iterator 来获取要对比的属性.
  /*
    
     _.uniq([{name:"vnues",age:12},{name:"vnues",age:12}]);
     并不支持成员为对象的去重
  
  */
  _.uniq = _.unique = function (array, isSorted, iteratee, context) {
    // 如果没有排序
    // 就是用户第二个参数不一定直接传值为true
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted; //这个赋值就🈶意思了
      isSorted = false;
    }
    /*
     _.uniq([1,2,3,4,5],true);
     
     iteratee=true

     if (iteratee != null) iteratee = cb(iteratee, context);
     // key 是true
     return function (obj) {
      return obj == null ? void 0 : obj[key];
    };
    
    */
    if (iteratee != null) iteratee = cb(iteratee, context);

    var result = []; // 返回去重后的数组（副本）
    var seen = []; // 用于存放已经最外层循环过的array成员的值便于下一次比较，或者用于存储computed值
    // computed就是value
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
        computed = iteratee ? iteratee(value, i, array) : value;
      // 已经排好序 并且没有传入iteratee
      if (isSorted && !iteratee) {
        // 如果i=0时，或者seen（上一个值）不等于当前值，放入去重数组中
        if (!i || seen !== computed) result.push(value);
        // 已经排好序的 那么只要判断前后是否不一样就行
        // 此时seen存放是单个值而不是数组
        seen = computed; // 保存当前值，用于下一次比较
      }
      // else if这里判断的iteratee的意义是什么
      // 有传入iteratee必定传了isSorted 但是是真是假就不知道了
      // _.contains是对内层循环的简化
      // 这一步的判断含义是啥
      else if (iteratee) {
        // result不包含value的情况
        if (!_.contains(seen, computed)) {
          // 那这里为啥不是直接用result进行对比
          // 经过iteratee处理过后的值
          // [1,2,3,4,4,5,6]
          // 我们去重是想要经过iteratee返回后的值进行判断
          /*
          _.uniq([1,2,3,4,8,10],true,function(value){return value%2})

           这也解释了为啥使用seen
          */
          seen.push(computed);
          result.push(value); //返回原始值
        }
      }
      // result不包含value的情况
      else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = restArguments(function (arrays) {
    return _.uniq(flatten(arrays, true, true));
  });

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function (array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      var j;
      for (j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  //  _.difference([1, 2, 3, 4, 5], [5, 2, 10],1);  // (3) [1, 3, 4]
  _.difference = restArguments(function (array, rest) {
    rest = flatten(rest, true, true);
    // filter返回匹配的值 返回的是一个数组
    return _.filter(array, function (value) {
      return !_.contains(rest, value);
    });
  });

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices.
  _.unzip = function (array) {
    var length = (array && _.max(array, getLength).length) || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = restArguments(_.unzip);

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values. Passing by pairs is the reverse of _.pairs.
  _.object = function (list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Generator function to create the findIndex and findLastIndex functions.
  var createPredicateIndexFinder = function (dir) {
    return function (array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  };

  // Returns the first index on an array-like that passes a predicate test.
  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function (array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0,
      high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1;
      else high = mid;
    }
    return low;
  };

  // Generator function to create the indexOf and lastIndexOf functions.
  var createIndexFinder = function (dir, predicateFind, sortedIndex) {
    return function (array, item, idx) {
      var i = 0,
        length = getLength(array);
      if (typeof idx == "number") {
        if (dir > 0) {
          i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
          length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (
        idx = dir > 0 ? i : length - 1;
        idx >= 0 && idx < length;
        idx += dir
      ) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  };

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function (start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    if (!step) {
      step = stop < start ? -1 : 1;
    }

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++ , start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Chunk a single array into multiple arrays, each containing `count` or fewer
  // items.
  _.chunk = function (array, count) {
    if (count == null || count < 1) return [];
    var result = [];
    var i = 0,
      length = array.length;
    while (i < length) {
      result.push(slice.call(array, i, (i += count)));
    }
    return result;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments.
  // 决定是否把一个函数作为构造函数或者普通函数调用。 👆的翻译
  // func, bound, context, this, args.concat(callArgs)
  // executeBound是个调用函数
  /*
   sourceFunc --->func   var func = function(greeting){ return greeting + ': ' + this.name }
   // 觉得这样子处理这种特殊情况有意义吗
   // 我要的是像new操作返回的结果一样
  
  */
  var executeBound = function (
    sourceFunc,
    boundFunc,
    context,
    callingContext,
    args
  ) {
    // 如果callingContext不是boundFunc的一个实例，则把sourceFunc作为普通函数调用。
    // 搞清楚 boundFunc是谁
    // sourceFunc是谁
    if (!(callingContext instanceof boundFunc))
      return sourceFunc.apply(context, args); // 普通函数使用
    // baseCreate函数用于构造一个对象，继承指定的原型
    // 此处self就是继承了sourceFunc.prototype原型对象。
    var self = baseCreate(sourceFunc.prototype); // 创建一个新对象
    // 这一步也是会并且将其构造函数this关联的属性绑定给实例化对象
    var result = sourceFunc.apply(self, args); // 调用sourceFunc函数  函数内部this指向self
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  // _.bind=function(){...} <===最终形式
  // 执行bind会返回一个函数
  /*
     var func = function(greeting){ return greeting + ': ' + this.name };
          func = _.bind(func, {name: 'moe'}, 'hi');
          func();
  */
  // ❗️❗️❗️ 被绑定过context的函数(就是func)作为构造函数调用时的情况
  // 假如我们的函数func绑定了this为context 那么我们想要把func当做构造函数的时候是不是要考虑this指向
  // 如果executeBound没有判断这种情况 会发生什么 我们来尝试下
  /*
   
    首先
      var func = function(greeting){ return greeting + ': ' + this.name };
          func = _.bind(func, {name: 'moe'}, 'hi');

      func长什么样子
      
     func=_.bind(..)-->func -->就是bound
    
    那么执行 var fn1 = new func会发生什么?
    
    new 操作会干着三件事
      function Animal() {
        console.log("发出声音")
       }
      let animal  = {};
      animal.__proto__ = Animal.prototype;
      Animal.call(animal) // 这一步的操作是改变this指向，指向实例化对象 并且将其构造函数this关联的属性绑定给实例化对象
      
      func=function(){return executeBound(func, bound, context, this, args.concat(callArgs))}
      
      注意这个return 

      1.创建一个空对象，并且 this 变量引用该对象，同时还继承了该函数的原型。

      2.属性和方法被加入到 this 引用的对象中。 (前提构造函数是这样写的属性 this.a=.... 注意以前是这样想的会认为a是构造函数的属性 实际则不然 你可以说是属性 但不可以是说为a是构造函数的属性)

      3.新创建的对象由 this 所引用，并且最后隐式的返回 this.
      
       如果一个构造函数 return一个对象那么这个new 操作就没意义了（也不是没意义起码原型对象继承了） 本来是隐式返回this
       如果返回非对象类型 还是会继续隐式返回this的

       所以new操作完后还是最后走executeBound这步  所以要在executeBound内进行操作（实例化对象继承构造函数（的属性xxxx） 这句话不能这样说 而是属性和方法被加入到 this 引用的对象中 ）
       new
  */
  // _.bind = restArguments(function (func, context, args)...)
  // func= _.bind(...)（return bound就是闭包的引用了）===>return bound  func=bound new func()
  _.bind = restArguments(function (func, context, args) {
    if (!_.isFunction(func))
      throw new TypeError("Bind must be   on a function");
    var bound = restArguments(function (callArgs) {
      // sourceFunc,boundFunc,context,callingContext,args
      // args拼接这个callArgs参数
      // bind函数执行会形成一个闭包保存传进来的参数 args
      // 之后返回一个函数func
      // 这个this的应用场景函数this场景  非严格模式下 window是调用者 所以this指向window
      return executeBound(func, bound, context, this, args.concat(callArgs));
    });
    console.log(bound);
    return bound; // return存在闭包引用了
  });

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder by default, allowing any combination of arguments to be
  // pre-filled. Set `_.partial.placeholder` for a custom placeholder argument.
  /*
      var add = function(a, b,c,d,e) {
        return a + b+c+d+e;
      };
      add5 = _.partial(add, _,20,_,40);
      console.log(add5(10,30,50));  // 20
      // 可以确定参数的顺序就是_.partial(add, _,20,_,40);
      
  
  */
  // restArguments(function (func, boundArgs)) 执行restArguments返回一个函数 
  _.partial = restArguments(function (func, boundArgs) {
    // 占位符
    var placeholder = _.partial.placeholder;
    var bound = function () {
      var position = 0,
        length = boundArgs.length;
      var args = Array(length);
      // 顺序是按照boundArgs--> _,20,_,40
      // 然后调用bound有剩余的参数 通过position标记
      for (var i = 0; i < length; i++) {
        args[i] =
          boundArgs[i] === placeholder ? arguments[position++] : boundArgs[i];
      }

      // 最后这一步把剩余的参数push上去
      while (position < arguments.length) args.push(arguments[position++]);
      // 这样子传bound代表构造函数
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  });
  // 声明占位符
  _.partial.placeholder = _;

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = restArguments(function (obj, keys) {
    // 将一个嵌套多层的数组 array（数组） (嵌套可以是任何层数)转换为只有一层的数组。 如果你传递 shallow参数，数组将只减少一维的嵌套。
    // keys是个数组 因为restArguments的缘故
    // flatten是作用于类数组的
    keys = flatten(keys, false, false);
    var index = keys.length;
    if (index < 1) throw new Error("bindAll must be passed function names");
    while (index--) {
      var key = keys[index];
      obj[key] = _.bind(obj[key], obj);
    }
  });

  // Memoize an expensive function by storing its results.
  // Memoizes方法可以缓存某函数的计算结果。对于耗时较长的计算是很有帮助的
  // 函数可以将之前的操作结果缓存在某个对象中，当下次调用时，如果遇到相同的参数，就直接返回缓存中的数据，从而避免无谓的重复运算。这种优化被称作记忆。
  /*
    
  var fibonacci = _.memoize(function(n) {
     return n < 2 ? n: fibonacci(n - 1) + fibonacci(n - 2);
    });
    fibonacci(10)
     return n < 2 ? n: fibonacci(n - 1) + fibonacci(n - 2);
     它是这样子的递归写法 这样子就会造成每次重新计算 刚开始看还有点懵逼fibonacci(n - 1) + fibonacci(n - 2)
     ❗️❗️❗️这样子的写法会造成每次都会重新计算
     这也是要去理解斐波那契数列❗️❗️❗️
     尾递归又是什么哈哈哈❓❓❓
     所以使用memoize缓存
  */
  _.memoize = function (func, hasher) {
    var memoize = function (key) {
      var cache = memoize.cache;

      //  JSON.stringify来处理Key值效果一样
      // Memoizes方法可以缓存某函数的计算结果。对于耗时较长的计算是很有帮助的。
      // 如果传递了 hashFunction 参数，就用 hashFunction 的返回值作为key存储函数的计算结果。 
      // hashFunction 默认使用function的第一个参数作为key。memoized值的缓存 可作为 返回函数的cache属性。
      // 自定义key值
      var address = "" + (hasher ? hasher.apply(this, arguments) : key);
      if (!has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = restArguments(function (func, wait, args) {
    return setTimeout(function () {
      return func.apply(null, args);
    }, wait);
  });

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.

  // 首先要明白_.partial函数的使用形式跟含义
  // 在这里就是局部应用一个函数填充在任意个数的 参数
  // 这个函数就是_.delay delay参数是func, wait, args, _是占位func wait是1
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function (func, wait, options) {
    var timeout, context, args, result;
    var previous = 0;
    if (!options) options = {};

    var later = function () {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };

    var throttled = function () {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };

    throttled.cancel = function () {
      clearTimeout(timeout);
      previous = 0;
      timeout = context = args = null;
    };

    return throttled;
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function (func, wait, immediate) {
    var timeout, result;

    var later = function (context, args) {
      timeout = null;
      if (args) result = func.apply(context, args);
    };

    var debounced = restArguments(function (args) {
      if (timeout) clearTimeout(timeout);
      if (immediate) {
        var callNow = !timeout;
        timeout = setTimeout(later, wait);
        if (callNow) result = func.apply(this, args);
      } else {
        timeout = _.delay(later, wait, this, args);
      }

      return result;
    });

    debounced.cancel = function () {
      clearTimeout(timeout);
      timeout = null;
    };

    return debounced;
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function (func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function (predicate) {
    return function () {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  // 从➡️到⬅️ 从右到左
  // underscore的compose是处理这种情况的f(g(h()))
  // 就是把函数执行完后当做参数
  // 但是很多时候我是想让我这个A函数具备几种能力重新返回新的函数A  并且最后不会去执行我的函数A
  // f(g(h()))实际上这种写法在开发中常常用到 我们使用compose提升下代码可读性
  // 其实弄成这样也行的f(g(h)）最后判断A函数不执行就行啦  🤔不用考虑那么复杂的
  // 不对f()最后return function作为参数 效果一样的  来实验下
  /*
  
      // 从右到左传入参数
      // 登陆
      function login(user) {
        console.log("login " + user);
      }
      // 注册
      function resgister(user) {
        console.log("resgister " + user);
      }
      // 抽离出来的中间函数
      function wrapUser(Wrapfunc) {
        let Newfunc = () => {
         // let user = localStorage.getItem("user");
         let user ="vnues"
          Wrapfunc(user);
        };
        return Newfunc;
      }
      // 调用
     // debugger 最后的结果满足不了
      login =  _.compose(wrapUser,login)
      resgister = _.compose(wrapUser,resgister)
      login();
      resgister();

  */
  /* 
    // 所以说underscore的compose还是只适合f(g(h()))这种方式 执行后的函数结果当做参数继续传入
    // 调用形式 e(g(f(h))) 
    function compose(...args) {
      var arity = args.length - 1;
      var tag = false;
      if (typeof args[arity] === "function") {
        tag = true;
      }
      if (arity > 1) {
        var param = args.pop(args[arity]); // 先去除第一个函数A
        arity--;
        var newParam = args[arity].call(args[arity], param); // 执行完
        args.pop(args[arity]);// 拿出来
        args.push(newParam); // 把返回的结果push进去
        return compose(...args);
      } else if (arity === 1) {
        if (!tag) {
          return args[0].bind(null, args[1]);
        } else {
          return args[0].call(null, args[1]);
        }
      }
    }
    // 从右到左传入参数
    // 登陆
    function login(user, age) {
      console.log("login " + user, age);
    }
    // 注册
    function resgister(user) {
      console.log("resgister " + user);
    }
    // 抽离出来的中间函数
    function wrapUser(Wrapfunc) {
      let Newfunc = (age) => {
        // let user = localStorage.getItem("user");
        let user = "vnues";
        Wrapfunc(user, age);
      };
      return Newfunc;
    }
    function wrapConsole(func) {
      let Newfunc = () => {
        // let user = localStorage.getItem("user");
        let age = 22
        func(age);
      };
      return Newfunc;
    }
    // 调用
    // debugger 最后的结果满足不了
    debugger
    login = compose(
      wrapConsole,
      wrapUser,
      login
    );
  
    login();
    //  resgister();
    */
  _.compose = function () {
    var args = arguments;
    var start = args.length - 1;
    return function () {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result; // 不return一个function而是所有传入的函数都会执行？
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function (times, func) {
    return function () {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function (times, func) {
    var memo;
    return function () {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  _.restArguments = restArguments;

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{ toString: null }.propertyIsEnumerable("toString");
  var nonEnumerableProps = [
    "valueOf",
    "isPrototypeOf",
    "toString",
    "propertyIsEnumerable",
    "hasOwnProperty",
    "toLocaleString"
  ];

  var collectNonEnumProps = function (obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto =
      (_.isFunction(constructor) && constructor.prototype) || ObjProto;

    // Constructor is a special case.
    var prop = "constructor";
    if (has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  };

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`.
  _.keys = function (obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    // 用到了for...in.. for...in...会拿到原型链上的方法  hasOwnProperty不会拿到原型链上的
    for (var key in obj) if (has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function (obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function (obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object.
  // In contrast to _.map it returns an object.
  _.mapObject = function (obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = _.keys(obj),
      length = keys.length,
      results = {};
    for (var index = 0; index < length; index++) {
      var currentKey = keys[index];
      results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  // The opposite of _.object.
  _.pairs = function (obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function (obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`.
  // obj 这里接收的是个函数对象
  _.functions = _.methods = function (obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // An internal function for creating assigner functions.
  var createAssigner = function (keysFunc, defaults) {
    return function (obj) {
      var length = arguments.length;
      if (defaults) obj = Object(obj);
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
          keys = keysFunc(source),
          l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!defaults || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s).
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test.
  _.findKey = function (obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj),
      key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Internal pick helper function to determine if `obj` has key `key`.
  var keyInObj = function (value, key, obj) {
    return key in obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = restArguments(function (obj, keys) {
    var result = {},
      iteratee = keys[0];
    if (obj == null) return result;
    if (_.isFunction(iteratee)) {
      if (keys.length > 1) iteratee = optimizeCb(iteratee, keys[1]);
      keys = _.allKeys(obj);
    } else {
      iteratee = keyInObj;
      keys = flatten(keys, false, false);
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  });

  // Return a copy of the object without the blacklisted properties.
  _.omit = restArguments(function (obj, keys) {
    var iteratee = keys[0],
      context;
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
      if (keys.length > 1) context = keys[1];
    } else {
      keys = _.map(flatten(keys, false, false), String);
      iteratee = function (value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  });

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  _.create = function (prototype, props) {
    var result = baseCreate(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function (obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function (obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  // 一个是object 一个是对象
  _.isMatch = function (object, attrs) {
    var keys = _.keys(attrs),
      length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };

  // Internal recursive comparison function for `isEqual`.
  var eq, deepEq;
  eq = function (a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // `null` or `undefined` only equal to itself (strict comparison).
    if (a == null || b == null) return false;
    // `NaN`s are equivalent, but non-reflexive.
    if (a !== a) return b !== b;
    // Exhaust primitive checks
    var type = typeof a;
    if (type !== "function" && type !== "object" && typeof b != "object")
      return false;
    return deepEq(a, b, aStack, bStack);
  };

  // Internal recursive comparison function for `isEqual`.
  deepEq = function (a, b, aStack, bStack) {
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case "[object RegExp]":
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case "[object String]":
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return "" + a === "" + b;
      case "[object Number]":
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN.
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case "[object Date]":
      case "[object Boolean]":
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
      case "[object Symbol]":
        return SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b);
    }

    var areArrays = className === "[object Array]";
    if (!areArrays) {
      if (typeof a != "object" || typeof b != "object") return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor,
        bCtor = b.constructor;
      if (
        aCtor !== bCtor &&
        !(
          _.isFunction(aCtor) &&
          aCtor instanceof aCtor &&
          _.isFunction(bCtor) &&
          bCtor instanceof bCtor
        ) &&
        ("constructor" in a && "constructor" in b)
      ) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a),
        key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function (a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function (obj) {
    if (obj == null) return true;
    if (
      isArrayLike(obj) &&
      (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))
    )
      return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function (obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray =
    nativeIsArray ||
    function (obj) {
      return toString.call(obj) === "[object Array]";
    };

  // Is a given variable an object?
  _.isObject = function (obj) {
    var type = typeof obj;
    // 排除null !!obj
    return type === "function" || (type === "object" && !!obj);
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError, isMap, isWeakMap, isSet, isWeakSet.
  _.each(
    [
      "Arguments",
      "Function",
      "String",
      "Number",
      "Date",
      "RegExp",
      "Error",
      "Symbol",
      "Map",
      "WeakMap",
      "Set",
      "WeakSet"
    ],
    function (name) {
      _["is" + name] = function (obj) {
        return toString.call(obj) === "[object " + name + "]";
      };
    }
  );

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function (obj) {
      return has(obj, "callee");
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), Safari 8 (#1929), and PhantomJS (#2236).
  var nodelist = root.document && root.document.childNodes;
  if (
    typeof /./ != "function" &&
    typeof Int8Array != "object" &&
    typeof nodelist != "function"
  ) {
    _.isFunction = function (obj) {
      return typeof obj == "function" || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function (obj) {
    return !_.isSymbol(obj) && isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`?
  _.isNaN = function (obj) {
    return _.isNumber(obj) && isNaN(obj);
  };

  // Is a given value a boolean?
  _.isBoolean = function (obj) {
    return (
      obj === true || obj === false || toString.call(obj) === "[object Boolean]"
    );
  };

  // Is a given value equal to null?
  _.isNull = function (obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function (obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function (obj, path) {
    if (!_.isArray(path)) {
      return has(obj, path);
    }
    var length = path.length;
    for (var i = 0; i < length; i++) {
      var key = path[i];
      if (obj == null || !hasOwnProperty.call(obj, key)) {
        return false;
      }
      obj = obj[key];
    }
    return !!length;
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function () {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function (value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function (value) {
    return function () {
      return value;
    };
  };

  _.noop = function () { };

  // Creates a function that, when passed an object, will traverse that object’s
  // properties down the given `path`, specified as an array of keys or indexes.
  _.property = function (path) {
    // 非数组情况下
    if (!_.isArray(path)) {
      // shallowProperty(path)返回的是个function
      return shallowProperty(path);
    }
    // 数组情况下
    return function (obj) {
      return deepGet(obj, path);
    };
  };

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function (obj) {
    if (obj == null) {
      return function () { };
    }
    return function (path) {
      return !_.isArray(path) ? obj[path] : deepGet(obj, path);
    };
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  _.matcher = _.matches = function (attrs) {
    attrs = _.extendOwn({}, attrs);
    return function (obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function (n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function (min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now =
    Date.now ||
    function () {
      return new Date().getTime();
    };

  // List of HTML entities for escaping.
  var escapeMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "`": "&#x60;"
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function (map) {
    var escaper = function (match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped.
    var source = "(?:" + _.keys(map).join("|") + ")";
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, "g");
    return function (string) {
      string = string == null ? "" : "" + string;
      return testRegexp.test(string)
        ? string.replace(replaceRegexp, escaper)
        : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // Traverses the children of `obj` along `path`. If a child is a function, it
  // is invoked with its parent as context. Returns the value of the final
  // child, or `fallback` if any child is undefined.
  _.result = function (obj, path, fallback) {
    if (!_.isArray(path)) path = [path];
    var length = path.length;
    if (!length) {
      return _.isFunction(fallback) ? fallback.call(obj) : fallback;
    }
    for (var i = 0; i < length; i++) {
      var prop = obj == null ? void 0 : obj[path[i]];
      if (prop === void 0) {
        prop = fallback;
        i = length; // Ensure we don't continue iterating.
      }
      obj = _.isFunction(prop) ? prop.call(obj) : prop;
    }
    return obj;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function (prefix) {
    var id = ++idCounter + "";
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate: /<%([\s\S]+?)%>/g,
    interpolate: /<%=([\s\S]+?)%>/g,
    escape: /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'": "'",
    "\\": "\\",
    "\r": "r",
    "\n": "n",
    "\u2028": "u2028",
    "\u2029": "u2029"
  };

  var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function (match) {
    return "\\" + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function (text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp(
      [
        (settings.escape || noMatch).source,
        (settings.interpolate || noMatch).source,
        (settings.evaluate || noMatch).source
      ].join("|") + "|$",
      "g"
    );

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function (
      match,
      escape,
      interpolate,
      evaluate,
      offset
    ) {
      source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offset.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = "with(obj||{}){\n" + source + "}\n";

    source =
      "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source +
      "return __p;\n";

    var render;
    try {
      render = new Function(settings.variable || "obj", "_", source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function (data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || "obj";
    template.source = "function(" + argument + "){\n" + source + "}";

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function (obj) {
    var instance = _(obj);
    instance._chain = true; // 用于判断
    return instance; // 返回了带有obj属性的_实例对象
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var chainResult = function (instance, obj) {
    // 注意区别看好 _chain  _.chain
    // instance._chain是否true 是 返回_(obj).chain()===>
    // _(obj).chain()oop风格《====》_.chain(obj)
    // 返回了带有obj属性的_实例对象
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  // 向下划线对象添加自定义函数
  _.mixin = function (obj) {
    // 这个obj可能是_可能是其它对象
    _.each(_.functions(obj), function (name) {
      var func = (_[name] = obj[name]); // 因为这个操作 自定义的函数也可以挂载
      // 将方法挂载到_对象的原型上去 最重要的就是这步
      _.prototype[name] = function () {
        console.log(arguments[0]);
        console.log(arguments[1]);
        // this指向_而_有_wrapped属性 只有执行_()就会初始化一次_wrapped属性 感觉最后使用完后应该this._wrapped=null
        // 也不会影响到 反正每执行一次就初始化赋值一次
        var args = [this._wrapped];
        push.apply(args, arguments);
        // 想想如果将别的函数是怎么挂载的
        // return func.apply(_, args);  目的就是要实现这一步 将面向对象的风格
        // 最终解析成可执行函数
        // 最后执行形式  _.each([1,2,3],fn) 所以才把fn放在this._wrapped元素后面
        return chainResult(this, func.apply(_, args));
      };
    });
    return _;
  };
  // _是个函数

  // Add all of the Underscore functions to the wrapper object.
  // 进行挂载
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(
    ["pop", "push", "reverse", "shift", "sort", "splice", "unshift"],
    function (name) {
      var method = ArrayProto[name];
      _.prototype[name] = function () {
        var obj = this._wrapped;
        method.apply(obj, arguments);
        if ((name === "shift" || name === "splice") && obj.length === 0)
          delete obj[0];
        return chainResult(this, obj);
      };
    }
  );

  // Add all accessor Array functions to the wrapper.
  _.each(["concat", "join", "slice"], function (name) {
    var method = ArrayProto[name];
    _.prototype[name] = function () {
      return chainResult(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function () {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function () {
    return String(this._wrapped);
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define == "function" && define.amd) {
    define("underscore", [], function () {
      return _;
    });
  }
})();
