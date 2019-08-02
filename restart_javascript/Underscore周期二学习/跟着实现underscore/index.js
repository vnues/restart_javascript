/*
   underscore即是需求
*/

// 立即执行函数实现模块化，避免变量跑到全局去
// 理解执行函数会执行这个函数里面的代码
(function() {
  // 定义root为全局对象
  // 判断全局对象 浏览器是window node环境是global web worker是self window.self===window
  // self对象在浏览器中也代表全局对象
  // 微信小程序 没有window global 而且严格模式下this也是undefined
  // typeof null--> object 所以还要再判断一次self还存在不
  var root =
    (typeof self === "object" && self.self === self && self) ||
    (typeof global === "object" && global.global === global && global) ||
    this ||
    {};

  // 声明_（函数）对象
  // 我们要支持两种形式 函数风格：_.each(obj,...) 面向对象风格_(obj).each(...)
  // 函数风格天然支持 我们来转换面向对象风格
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!this instanceof _) return new _(obj); // 返回一个实例化_函数对象 并且这个实例化对象里面有_wrapped属性
    // 我们有时候会遇到这种情况：在函数内部 我们想让this指向这个函数
    // 实现的方式就是通过new实例化对象  <-----所以这个思想很重要
    // （实际就是）操作this就那么常用的几种方法 call apply bind new
    this._wrapped = obj; // 用_wrapped保存obj
  };
  // 为了支持模块化，我们需要将 _ 在合适的环境中作为模块导出
  // 我们还想提供require支持 开发人员可以通过const _ = require('./index.js')
  // 如果你在node环境（webpack就是起的node服务）下可以用require 你可以试试非node环境下去加载
  // typeof -->返回的结果是字符串
  if (typeof exports !== "undefined" && exports.nodeType) {
    if (typeof module !== "undefined" && module.nodeType && module.exports) {
      exports = module.exports = _;
    }
    exports = _;
  } else {
    root._ = _;
  }
  // 版本号
  _.VERSION = "v1.9.1";

  // _构造函数的属性没有用`this绑定`(new实现继承实质就是操作this) 实例化对象是继承不了的
  //  所以得把这些属性方法拷贝到原型对象上去
  // 并且我们还想开发个接口就是可以添加自定义方法

  _.mixin = function(obj) {
    // 循环遍历
    _.each(_.functions(obj), function(name) {
      var func = (_[name] = obj[name]);
      // 将函数逐个复制到原型,那么为什么不直接 _.prototype[name]=func
      // 那是因为我们_(obj).each(fn) 这样子调用的each拿不到obj参数
      // each函数已经是封装好的 所以不能改动each 所以外层再套个函数
      // apply call改变this执行 执行函数 有参数就传参数 apply是要求数组参数 call是单个
      // 规则而已
      _.prototype[name] = function() {
        // 拿到这个obj obj是用_wrapped属性保存的
        var args = [this._wrapped];
        // args.push(arguments)
        push.apply(args, arguments);
        func(this, args);
        // func.apply(_, args);
      };
    });
  };

  // 拿到对象的所有函数属性名(包括原型链上的) 以数组形式return
  //for...in语句以任意顺序遍历一个对象自有的、继承的、可枚举的、非Symbol的属性。
  // 对于每个不同的属性，语句都会被执行
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) {
        names.push(key);
      }
    }
    // sort() 方法用就地算法对数组的元素进行排序，并返回数组。
    // 默认排序顺序是在将元素转换为字符串，然后比较它们的UTF-16代码单元值序列时构建的
    return names.sort();
  };

  _.isFunction = function(obj) {
    // 这样的写法真的简洁
    // || 判断真假后返回的值可以用||代替
    return typeof obj === "function" || false;
  };

  // 保存对象_ 防止可能被人为破坏
  var previousUnderscore = root._;

  // 原型引用
  var ArrayProto = Array.prototype,
    ObjProto = Object.prototype;
  var SymbolProto = typeof Symbol !== void 0 ? Symbol.prototype : null;

  // 内置方法引用
  var push = ArrayProto.push,
    slice = ArrayProto.slice,
    toString = ObjProto.toString,
    hasOwnProperty = ObjProto.hasOwnProperty;

  // 空的construtor对象
  var Ctor = function() {};

  // 内置函数
  var nativeIsArray = Array.isArray,
    nativeKeys = Object.keys,
    nativeCreate = Object.create;
  // 用来保存内建迭代函数
  var builtinIteratee;
  // 内建迭代函数
  _.iteratee = builtinIteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // 处理剩余参数函数
  var restArguments = function() {};

  // 创建基本对象
  var baseCreate = function() {};
  // 返回对象的属性值
  var shallowProperty = function(key) {
    return function(obj) {
      return obj === null ? void 0 : obj[key];
    };
  };

  //判断对象是否有该属性
  var has = function(obj, path) {
    return obj !== null && hasOwnProperty.call(obj, path);
  };

  // 拿到对象深度属性
  var deepGet = function(obj, path) {
    var length = path.length;
    for (var i = 0; i < length; i++) {
      if (obj == null) return void 0;
      obj = obj[path[i]];
    }
    return length ? obj : void 0;
  };

  //最大安全值
  // 另外这里的Math.pow(2,53)-1 严格来说也不是array like 对象的最大长度值，而是一个“最安全整数”
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1; //   按道理数组也是在这里的 等等 又不是 new Array(...)
  // 这个数表示js里面最大的安全数 并不是数组最大长度 而且我们也没去new Array 不要有代入感
  // https://www.zhihu.com/question/29010688

  // 类数组的长度
  var getLength = shallowProperty("length");

  // 判断是否是类数组
  var isArrayLike = function(collection) {
    var length = getLength(collection);
    return (
      typeof length === "number" && length >= 0 && length <= MAX_ARRAY_INDEX
    );
  };

  _.keys = function(obj) {
    if (nativeKeys) {
      return nativeKeys(obj);
    }
    var keys = [];
    for (var key in obj) {
      if (has(obj, key)) {
        keys.push(key);
      }
    }
    return keys;
  };
  _.identity = function(value) {
    return value;
  };

  // properties down the given `path`, specified as an array of keys or indexes.
  // property按照数据类型 返回对应的函数
  _.property = function(path) {
    // return代表else情况更觉得好
    // 非数组
    if (!_.isArray(path)) {
      return shallowProperty(path); // 非数组类型 返回value的key值
    }
    return function(obj) {
      // 接收一个obj对象参数
      return deepGet(obj, path);
    };
  };

  // 判断是否是Object类型
  _.isObject = function(obj) {
    var type = typeof obj;
    // function obj null 的typeof 结果都为Object
    return type === "function" || (type === "object" && !obj);
  };

  // 判断是否是数组
  _.isArray =
    // 这样写还是为了性能问题
    nativeIsArray ||
    function(obj) {
      return toString.call(obj) === "[object Array]";
    };

  // 所有的迭代函数都要经过它的包装
  // 并且还有这样的一个需求 iteratee不为函数 经过cb函数包装返回的是函数
  // 封装iteratee ==>cb回调函数
  // cb函数return出去的是一个函数 感觉用ts写法会更加清晰
  // 并且cb函数会提供用户自定封装iteratee的接口
  // _.iteratee一个是可以提供用户包装iteratee，cb是underore已经提供的包装iteratee
  var cb = function(value, context, argCount) {
    // 因为 _.iteratee = builtinIteratee 的缘故，_.iteratee !== builtinIteratee 值为 false，所以正常情况下 _.iteratee(value, context)` 并不会执行。
    // 但是如果我们在外部修改了 _.iteratee 函数，结果便会为 true，cb 函数直接返回 _.iteratee(value, context)。
    //这个意思其实是说用我们自定义的 _.iteratee 函数来处理 value 和 context
    // 假如用户有自己的自定义iteratee函数 就用用户自定义的
    // _.iteratee预留这个接口给用户就是替代underscore这个库cb函数的包装iteratee 让用户自己实现
    if (_.iteratee !== builtinIteratee) return _.iteratee(value, context); // 这个时候这里的_.iteratee是用户自定义的接口
    // 传入的iteratee为null 返回原value
    if (value === null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value) && !_.isArray(value)) return _.matcher(value); // 处理Object类型
    return _.property(value); // 处理非Object类型
  };

  // 优化回调函数  =====>首先认清楚什么是回调函数
  var optimizeCb = function(func, context, argCount) {
    // 为什么需要argCount 优化性能
    if (context === void 0) return func;
    // 传给回调函数三个参数
    switch (argCount === null ? 3 : argCount) {
      case 1:
        return function(value) {
          return func.call(context, value);
        };
      // The iteratee is passed three arguments: the value, then the index (or key) of the iteration,
      // and finally a reference to the entire list
      // 一般不会传2个参数给回调函数的
      case 3:
        return function(value, index, collection) {
          return func.call(context, value, index, collection);
        };
      case 4:
        return function(accumulator, value, index, collection) {
          return func.call(context, accumulator, value, index, collection);
        };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  /* ------------------------需求:collection方法就是作用于集合对象的-------------------------- */

  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var i, length;
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
  _.map = _.collect = function(obj, iteratee, context) {
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

  // 进行复制
  _.mixin(_);
})();
