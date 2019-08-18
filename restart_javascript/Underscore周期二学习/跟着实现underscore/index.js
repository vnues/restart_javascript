// https://www.liaoxuefeng.com/wiki/1022910821149312/1056305537410240
// 为啥review underscore 统一js函数式编程

/*
   underscore文档即是需求 发现underscore考虑范围是整个对象
*/

// 函数式编程 既要考虑调用这个函数需要哪些参数 也要知道回调函数它给我们返回哪些参数！！！

// 立即执行函数实现模块化，避免变量跑到全局去
// 理解执行函数会执行这个函数里面的代码
(function () {
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
  var _ = function (obj) {
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

  _.mixin = function (obj) {
    // 循环遍历
    _.each(_.functions(obj), function (name) {
      var func = (_[name] = obj[name]);
      // 将函数逐个复制到原型,那么为什么不直接 _.prototype[name]=func
      // 那是因为我们_(obj).each(fn) 这样子调用的each拿不到obj参数
      // each函数已经是封装好的 所以不能改动each 所以外层再套个函数
      // apply call改变this执行 执行函数 有参数就传参数 apply是要求数组参数 call是单个
      // 规则而已
      _.prototype[name] = function () {
        // 拿到这个obj obj是用_wrapped属性保存的
        var args = [this._wrapped];
        // args.push(arguments)
        push.apply(args, arguments);
        // 调用这个chainResult返回一个_实例化对象
        // 这个操作也只是针对于_是否是实例化对象
        return chainResult(this, func(this, args));
        // func(this, args);
        // func.apply(_, args);
      };
    });
  };

  // 拿到对象的所有函数属性名(包括原型链上的) 以数组形式return
  //for...in语句以任意顺序遍历一个对象自有的、继承的、可枚举的、非Symbol的属性。
  // 对于每个不同的属性，语句都会被执行
  _.functions = _.methods = function (obj) {
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

  _.isFunction = function (obj) {
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

  // 内置函数
  var nativeIsArray = Array.isArray,
    nativeKeys = Object.keys,
    nativeCreate = Object.create;
  // 用来保存内建迭代函数
  var builtinIteratee;
  // 内建迭代函数
  _.iteratee = builtinIteratee = function (value, context) {
    return cb(value, context, Infinity);
  };

  // 返回对象的属性值
  var shallowProperty = function (key) {
    return function (obj) {
      return obj === null ? void 0 : obj[key];
    };
  };

  //判断对象是否有该属性
  var has = function (obj, path) {
    return obj !== null && hasOwnProperty.call(obj, path);
  };

  // 拿到对象深度属性
  var deepGet = function (obj, path) {
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
  var isArrayLike = function (collection) {
    var length = getLength(collection);
    return (
      typeof length === "number" && length >= 0 && length <= MAX_ARRAY_INDEX
    );
  };

  _.keys = function (obj) {
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

  _.allKeys = function (obj) {
    if (nativeKeys) {
      return nativeKeys(obj);
    }
    var keys = [];
    for (var key in obj) {
      keys.push(key);
    }
    return keys;
  };

  _.identity = function (value) {
    return value;
  };

  // properties down the given `path`, specified as an array of keys or indexes.
  // property按照数据类型 返回对应的函数
  _.property = function (path) {
    // return代表else情况更觉得好
    // 非数组
    if (!_.isArray(path)) {
      return shallowProperty(path); // 非数组类型 返回value的key值
    }
    return function (obj) {
      // 接收一个obj对象参数
      return deepGet(obj, path);
    };
  };

  // 判断是否是Object类型
  _.isObject = function (obj) {
    var type = typeof obj;
    // function obj null 的typeof 结果都为Object
    // 如果是!!null==>false 如果非null !!obj则为true
    return type === "function" || (type === "object" && !!obj);
  };

  // 判断是否是数组
  _.isArray =
    // 这样写还是为了性能问题
    nativeIsArray ||
    function (obj) {
      return toString.call(obj) === "[object Array]";
    };

  // 所有的迭代函数都要经过它的包装
  // 并且还有这样的一个需求 iteratee不为函数 经过cb函数包装返回的是函数
  // 封装iteratee ==>cb回调函数
  // cb函数return出去的是一个函数 感觉用ts写法会更加清晰
  // 并且cb函数会提供用户自定封装iteratee的接口
  // _.iteratee一个是可以提供用户包装iteratee，cb是underore已经提供的包装iteratee
  // value是iteratee函数（也可能是别的数据类型）

  /* 
   cb函数有三种情况
   一：null：就返回该null
   二：Object：返回一个isMatch函数 _.isMatch(obj, attrs) attrs是否是obj的属性 
   三：function
   四：非Object类型

   实际上cb处理函数就行 其它的处理感觉没什么意义
  */
  // value ---> iteratee 把value当key传入过去
  var cb = function (value, context, argCount) {
    // 因为 _.iteratee = builtinIteratee 的缘故，_.iteratee !== builtinIteratee 值为 false，所以正常情况下 _.iteratee(value, context)` 并不会执行。
    // 但是如果我们在外部修改了 _.iteratee 函数，结果便会为 true，cb 函数直接返回 _.iteratee(value, context)。
    //这个意思其实是说用我们自定义的 _.iteratee 函数来处理 value 和 context
    // 假如用户有自己的自定义iteratee函数 就用用户自定义的
    // _.iteratee预留这个接口给用户就是替代underscore这个库cb函数的包装iteratee 让用户自己实现
    if (_.iteratee !== builtinIteratee) return _.iteratee(value, context); // 这个时候这里的_.iteratee是用户自定义的接口
    // 传入的iteratee为null 返回原value
    if (value === null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    // 如果iteratee传入的是对象 那么就判断被迭代者属性（对象也可能不是对象）的key和value的key是否匹配
    if (_.isObject(value) && !_.isArray(value)) return _.matcher(value); // 处理Object类型
    return _.property(value); // 处理非Object类型
  };

  // 优化回调函数  =====>首先认清楚什么是回调函数
  var optimizeCb = function (func, context, argCount) {
    // 为什么需要argCount 优化性能
    if (context === void 0) return func;
    // 传给回调函数三个参数
    switch (argCount === null ? 3 : argCount) {
      case 1:
        return function (value) {
          return func.call(context, value);
        };
      // The iteratee is passed three arguments: the value, then the index (or key) of the iteration,
      // and finally a reference to the entire list
      // 一般不会传2个参数给回调函数的
      case 3:
        return function (value, index, collection) {
          return func.call(context, value, index, collection);
        };
      case 4:
        //reducer(obj, optimizeCb(iteratee, context, 4), memo, initial)
        // accumulator是累加器 为什么是累加器？
        // 回调函数接收中 以reduce方法为例子 accumulator是
        return function (accumulator, value, index, collection) {
          return func.call(context, accumulator, value, index, collection);
        };
    }
    // 返回的是回调函数
    return function () {
      return func.apply(context, arguments);
    };
  };
  // defaults就是config配置项 要不要开启
  // 该方法可以拷贝多个对象
  var crateAssigner = function (keysFunc, defaults) {
    return function (obj) {
      var length = arguments.length;
      if (defaults) {
        obj = Object(obj);
      }
      if (length < 2 || obj === null) return obj;
      // 第一个是扩展对象  后面的对象是要被拷贝的
      // 从这里就知道是浅拷贝了 浅层次的拷贝一层
      // 实际即使不通过这个方法 简单的for...in...也行的
      // 核心就是for循环赋值 赋值操作就是拷贝值拷贝 !!!很重要 理解这点
      for (var index = 1; index < length; index++) {
        // 拷贝的对象资源
        var source = arguments[index],
          // 拿到键值
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

  // 只复制 obj 自身的属性 assign -->分配
  _.extendOwn = _.assign = crateAssigner(_.keys);

  // 包括原型链上的
  _.extend = createAssigner(_.allKeys);

  _.matcher = _.matches = function (attrs) {
    attrs = _.extendOwn({}, attrs);
    // 为什么返回函数因为所有的iteratte都要被处理成函数
    return function (obj) {
      return _.isMatch(obj, attrs);
    };
  };

  _.isMatch = function (object, attrs) {
    var keys = _.keys(attrs),
      length = keys.length;
    if (object == null) return !length;
    // 确保为object对象
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      // 如果指定的属性在指定的对象或其原型链中，则in 运算符返回true。
      if (attrs[key] !== obj[key] || !(key in obj)) {
        return false;
      }
    }
    return true;
  };
  /* 有这么一个需求 就是出现了过多的实参参数 没有形参变量表示 又不想用arguments[xxx]去获取   <=== rest就是处理这种场景的 */
  // 封装函数 包裹函数  加工函数 内部肯定得返回一个函数
  // rest参数实现
  // 我们现在需要实现一个需求:函数声明时候使用一个rest变量代表剩余参数
  // 类似es6 rest参数
  // ES6 引入 rest 参数（形式为...变量名），用于获取函数的多余参数，这样就不需要使用arguments对象了。
  // rest 参数搭配的变量是一个数组，该变量将多余的参数放入数组中
  // 我们默认使用传入的函数的最后一个参数储存剩余的参数
  // 确实抓住的是用变量表示剩余参数
  // 这里的实现是最后一个形参为剩余参数--->理解这个很重要
  // 从startIndex开始（包含startIndex这个位置的参数）算就是剩余参数
  // 这样算下来形参的长度应该是startIndex+1 ！！！
  // 一种特殊情况 实参少于形参（就会出现负值
  // 也就是经过restArguments函数的包装 我们最后一个形参可以表示剩余参数了
  var restArguments = function (func, startIndex) {
    // 默认startIndex为null也即是最后一个形参变量表示剩余参数
    // 这里不能===
    startIndex = startIndex == null ? func.length - 1 : startIndex;
    return function () {
      // 假设用户输入100000
      // 一种特殊情况 实参少于形参（就会出现负值）
      var length = Math.max(arguments.length - startIndex, 0),
        rest = Array(length),
        index = 0; // （var声明）这样的写法更加具体明确不会有坑（for循环中）
      // 生成rest变量
      for (; index < length; i++) {
        rest[index] = arguments[startIndex + index];
      }
      // 形参实参一一对应  其实总觉得一一对应才是有逻辑的 js太自由了
      // 优化性能
      switch (startIndex) {
        case 0:
          // 调用一一对应
          return func.call(this, rest);
        case 1:
          return func.call(this, arguments[0], rest);
        case 2:
          return func.call(this, arguments[0], arguments[1], rest);
      }
      // 调用func传入参数
      // restArguments就是把形参变量没有表示的实参参数扔带最后一个形参变量
      var args = Array(startIndex + 1);
      for (index = 0; index < startIndex; index++) {
        args[index] = arguments[index];
      }
      args[startIndex] = rest;
      // call性能比apply高一点 apply比call方便的是参数一团扔进去就行
      return func.apply(this, args);
    };
  };
  /*本来场景就是处理出现过余参数 */
  /* 再强调一遍restArguments函数的实现意义就是让最形参变量表示剩余（过余）参数 */
  /* 只考虑默认情况 最后一个形参变量表示剩余参数 */

  // 我们现在有这样一个新的需求：希望能这样调用[1,1,2,3,4].each(xxx).map(xxx)或者这样调用_([1,2,3]).each().map()
  // 也就是默认不开启链式调用 只有使用_.chain方法才会开启链式调用
  // 也就是通过_chain方法才能开启链式调用
  // 刚开始想默认开启链式调用 但是发现每个方法（如果通过函数式编程的话好像都要改写）但是我们的minixn已经把方法挂载到原型就行
  // 所以想要链式操作 还是得实例化一个_实例化对象 所以需要_.chain方法
  // 重点在于理解_这个函数（对象)返回实例化对象
  // 链式调用的核心就是调用这次函数执行在返回一个具有对应方法的对象
  _.chain = function (obj) {
    if (obj instanceof _) return obj;
    var instance = _(obj);
    instance._chain = true; // 控制开关
    return instance;
  };
  // intance是上个调用的方法的实例化对象_ 所以可以拿到_chain属性 这个obj是运行完方法返回的对象
  var chainResult = function (instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  /* ------------------------需求:collection方法就是作用于集合对象的-------------------------- */
  /*         接下来讲的都是聚合对象 作用对象是聚合对象                                           */
  // 我们这里规定：iteratee默认传入的参数是value, index, obj  ❗️ ❗️ ❗️
  // 这样才能在后期review代码不会被传入的参数影响
  // ❗️ ❗️ ❗️还有就是underscore对象属性的写法是a["b"]这种写法 ❗️ ❗️ ❗️s以后对象的属性就是这种写法 以后开发我觉得应该也这样才好❗️ ❗️ ❗️

  _.each = _.forEach = function (obj, iteratee, context) {
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
  // map内置对象匹配的功能 比如匹配循环的对象属性是否具有对应的key值
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

  // reduce函数有两种形式 一种是从右到左执行 一种是从左往右 所以需要一个dir确定 同时返回一个函数 那么来写一个公共函数来实现它吧
  var createReduce = function (dir) {
    var reducer = function (obj, iteratee, memo, initial) {
      var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        index = dir > 0 ? 0 : length - 1; // index最大 就是Obj从右开始
      // initial跟memo绑定的 如果没有传memo则initial为false
      // If no memo is passed to the initial invocation of , the iteratee is not invoked on the first element of the list.
      // 意思是如果没有传递memo iteratee不会在第一个元素调用
      // 如果没有传memo就要初始化一遍memo 是这个意思
      // 我们总是用!inistial代表true来表示条件
      // 所以在表达式判断时候得具有这个思想
      if (!initial) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        // 重点这一步
        // memo是运算后得到的值
        // 传了四个参数过去
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    };
    // 接收的参数
    return function (obj, iteratee, memo, context) {
      // 就是这步把 initial和memo绑定
      var initial = arguments.length >= 3;
      return reducer(obj, optimizeCb(iteratee, context, 4), memo, initial);
    };
  };

  // index+1
  _.reduce = _.foldl = createReduce(1);
  // index-1
  _.reduceRight = _.foldr = createReduce(-1);

  // 如果是组合函数的话 reduce接收两个参数 一个是迭代参数a 一个是累积参数b ==>可以这样子操作 a(b) 这样就实现组合了
  // reduce实现组合函数的核心就是实现好iteratee函数
  // 那么这个执行顺序是从右到左还是从左到右  应该是从左往右

  // ！！！predicate函数 可以理解返回值为布尔值 predicate函数就是检测判断函数
  _.find = function (obj, predicate, context) {
    var keyFinder = isArrayLike(obj) ? _.findIndex : _.findKey;
    var key = keyFinder(obj, predicate, context);
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // 声明一个生成函数 to create the findIndex and findLastIndex functions
  // 只返回一个
  var createPredicateIndexFinder = function (dir) {
    return function (array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        // predicate返回的是布尔值
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  };

  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

  // 找到对象的key值
  _.findKey = function (obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      if (predicate(obj[key], key, obj)) return key;
    }
    //
    return void 0;
  };
  /*
    筛选函数
  */
  // 返回全部 使用each循环 秒啊！！!
  // Looks through each value in the list, returning an array of all the values that pass a truth test (predicate). predicate is transformed through iteratee to facilitate shorthand syntaxes.
  _.filter = _.select = function (obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function (value, index, list) {
      if (predicate(valiue, index, list)) results.push(value);
    });
    return results;
  };

  // Looks through the list and returns the first value that matches all of the key-value pairs listed in properties.
  _.findWhere = function (obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // 判断属性是否有在obj数组内的对象的属性
  // Looks through each value in the list, returning an array of all the values that matches the key-value pairs listed in properties.
  // where函数与filter函数的区别是不用传iteratee函数
  _.where = function (obj, attrs) {
    // return结果
    // _.matcher(attrs)返回的是函数 也就是作为iteratee
    return _.filter(obj, _.matcher(attrs));
  };

  // Returns a negated version of the passed-in predicate.
  // 返回传入谓词的否定(函数)版本。
  // predicate是谓语函数
  _.negate = function (predicate) {
    return function () {
      return !predicate.apply(this, arguments);
    };
  };

  // filter返回结果的对立结果
  _.reject = function (obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Returns true if all of the values in the list pass the predicate truth test. Short-circuits and stops traversing the list if a false element is found. predicate is transformed through iteratee to facilitate shorthand syntaxes.
  // 传给回调函数obj子属性
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

  // Returns true if any of the values in the list pass the predicate truth test. Short-circuits and stops traversing the list if a true element is found. predicate is transformed through iteratee to facilitate shorthand syntaxes.
  // 满足一个就为true
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

  // 与_.keys方法对应的是_.values拿到对象的值
  _.values = function (obj) {
    var keys = _keys(obj),
      length = keys.length,
      values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // 判断obj对象是否具有一个属性值  实际就是用值去比较！！！
  // guard--守卫
  _.contains = _.includes = _.include = function (obj, item, formIndex, guard) {
    // guard存在说明fromIndex肯定也有 是否是number类型还得继续判断
    // 非类数组（数组也归为类数组）对象类型
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof formIndex != "number" || guard) formIndex = 0;
    return _.indexOf(obj, item, formIndex) >= 0;
  };
  // every some返回布尔值 reject filter返回valuo
  // 实现indexof

  // 在一个排好序的数组中找到 value 对应的位置，保证插入数组后，依然保持有序的状态。
  // 也就是现在有这么一个需求 就是有一个排好序的数组 我们有个值要插入 如何找到要插入的值
  // integer整数
  // 二分法的本质 就是起点和终点 中点都会慢慢靠一起
  // 还有你找到的那个是通过比较大于或者小于 比如我们现在确定 a<value<c（最后包围成这样）
  // 那我们可以确定这个value就是b了 比如[10,20,30,40,50] 找到38的位置是3 这个位置3是40（支持这种） 这就是跟findIndex最大的区别
  // 还有前提是有序数组
  // 这也是找到index的方法
  _.sortedIndex = function (array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0,
      high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iterateea(array[mid] < value)) low = mid + 1;
      else high = mid;
    }
    return low;
  };

  // indexOf方法也是查找index 跟findIndex和sortedIndex一样
  // 只不过indexOf方法融入了这两种查找方法
  // idx-->也是fromIndex 也是返回结果的index 这两个的表示
  // 看到这个参数命名别懵逼！！！
  var createIndexFinder = function (dir, predicateFind, sortedIndex) {
    // _.indexOf(array, value, [isSorted])  以后分析函数要添加对应的参数调用！！！
    return function (array, item, idx) {
      var i = 0,
        length = getLength(array);
      // idx如果存在并且是number类型
      if (typeof idx == "number") {
        if (dir > 0) {
          // i从哪里开始循环起
          // indexOf fromIndex
          i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
          // 从此位置开始逆向查找
          // 最后确实一段length 然后这个就是要循环的长度  为啥赋值length
          // 对啊 比如你从数组第二个开始 那么数组就是按原length-2来算
          // 这个跟i表示异曲同工
          // 为什么➕1
          // 这个fromIndex只是让我们从哪个位置开始寻找
          // 不管indexOf还是lastIndex查找位置（fromIndex为正或者为负）都是从左到右➡️ ！！！
          // lastIndex的fromIndex是从此位置的逆向方向查找 -->这样一想确实长度为idx+1
          // 如果fromIndex为负idx + length + 1
          // 比如[a,b,c,d]而且你有没有发现 逆向位置找到的length都是a<-c 这样就是初始位置开始了 所以只关注长度就行
          // 下标都是从原数组0开始的
          length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      }
      // 如果存在sortedIndex
      // 什么情况下会走else if  idx不是number的情况  这里好像不需要用到idx 还个体它重新赋值了
      // Returns the index at which value can be found in the array, or -1 if value is not present in the array.
      // If you're working with a large array, and you know that the array is already sorted,
      // pass true for isSorted to use a faster binary search ... or, pass a number as the third argument in order to look for the first matching value in the array after the given index.
      // 所以idx传的是true如果知道这个数组已经是有顺序的数组
      else if (sortedIndex && idx && length) {
        return array[idx] === item ? idx : -1;
      }
      // 判断NaN情况
      if (item !== item) {
        // function(array, predicate, context)
        // _.findIndex([1,2,3],fn) 传入的参数
        // 所以我们在看函数时候首先得弄清楚 传的是什么参数 通过参数来记住这个函数！！！
        // 重点在于理解这个slice.call(array, i, length)
        // 从idx开始找 所以就从这个数组去切然后找 它从这个数组找
        // 下标是这个数组 不是原来这个数组 所以要在原来的基础上加i  这就是为什么idx + i
        // fromIndex的意义就是slice数组 从这个新的数组开始找 但别忘记了加回fromIndex（前提如果你slice数组）（这也是为啥底下for循环不加的原因 因为根本没切）
        // 所以我们slice数组 得记住这个原则 ！！！脑子得有这种规律和意识
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
  _.isNaN = function (obj) {
    return _.isNumber(obj) && this.isNaN(obj);
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError, isMap, isWeakMap, isSet, isWeakSet.
  // each遍历 给_对象绑定方法
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
      // a.b <===> a["b"] //注意不是a[b] 这样表示的话b是变量
      _["is" + name] = function (obj) {
        return toString.call(obj) === "[object" + name + "]";
      };
    }
  );
  // 现在有这么一个需求
  // 在list的每个元素上执行methodName方法。 任何传递给invoke的额外参数，invoke都会在调用methodName方法的时候传递给它。
  /*
  _.invoke([[5,1,7],[3,4,1]],function(item){
      console.log(item)
      console.log(arguments)
  },[1,2])
  */
  // invoke调用
  // 这个函数方法出现的意义就是使用原生数组方法处理二维数组
  // 其中自己自定义的回调函数并没有什么效果
  // 因为自定义函数接收的参数还是我们自己外部给的
  _.invoke = restArguments(function (obj, path, args) {
    // 剩余参数rest是个数组
    // console.log(arguments);
    // console.log("args==============》", args);
    // console.log("arguments", arguments);
    // console.log("obj", obj);
    // console.log("path", path);
    var contextPath, func;
    // path传入的是自定义函数
    if (_.isFunction(path)) {
      func = path;
    }
    // path传入的是个数组
    else if (_.isArray(path)) {
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

  // 需求 需要提取一个聚合对象的属性值
  // pluck 提取
  //  _.property(key) --> return function
  // _.map(list, iteratee, [context])
  _.pluck = function (obj, key) {
    return _.map(obj, _.property(key));
  };

  // underscore考虑的范围是整个对象类型 （对象、数组）
  // 返回list中的最大值。如果传递iteratee参数，iteratee将作为list中每个值的排序依据。如果list为空，将返回-Infinity，所以你可能需要事先用isEmpty检查 list 。
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
  // min只是判断方向改变而已 其它基本一样
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

  // 需求：从 list中产生一个随机样本。传递一个数字表示从list中返回n个随机元素。否则将返回一个单一的随机项
  // n多少 返回的数组length就为多少
  // sample--样本（随机抽样）
  _.sample = function (obj, n, guard) {
    //  The internal `guard` argument allows it to work with `map`.
    //  n是没有传入的 只返回一个值
    if (n === null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj(_.random(obj.length - 1));
    }
    // 如果是个obj对象 拿到values数组
    // underscore是支持整个对象 所以可以数组的时候也要考虑对象
    var sample = isArrayLike(obj) ? _.clone(obj) : _.values(obj);
    var length = getLength(sample);
    // 这是边界处理值
    //[0,length] 0<=n<=length 转化成就是 Math.max(Math.min(n, length), 0)的写法
    n = Math.max(Math.min(m, length), 0);
    var last = length - 1;
    for (var index = 0; index < n; index++) {
      var rand = _.random(index, last);
      var temp = sample[index];
      sample[index] = sample[rand];
      sample[rand] = temp;
    }
    // 根据传入的n返回多少长度
    return sample.slice(0, n);
  };
  _.clone = function (obj) {
    if (!_.isObject) return obj;
    // slice方法有浅拷贝的功能
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // 实现一个乱序方法
  _.shuffle = function (obj) {
    return _.sample(obj, Infinity);
  };

  // 现在有这样一个需求：我们有对一个集合对象顺序排列 并且还可以支持属性值排序（对象的 ）====》就是参照这个属性值进行排序
  // 返回一个排序后的list拷贝副本。如果传递iteratee参数，iteratee将作为list中每个值的排序依据。迭代器也可以是字符串的属性的名称进行排序的(比如 length)。
  _.sortBy = function (obj, iteratee, context) {
    var index = 0;
    iteratee = cb(iteratee, context);
    return _.pluck(
      _.map(obj, function (value, key, list) {
        // map里的回调iteratee函数必须需要return
        // 键值为value
        // 新创建一个对象 把item扔进去value 再筛选value出来 这个value就是item
        // map是支持对象循环的
        // map最终出来的result还是以数组形式
        /*
        _.map({one: 1, two: 2, three: 3}, function(num, key){ return num * 3; });
        => [3, 6, 9]
        */
        return {
          value: value,
          index: index++,
          criteria: iteratee(value, key, list)
        };
      }).sort(function (left, right) {
        var a = left.criteria;
        var b = right.criteria;
        if (a !== b) {
          // 要根据的属性值比较
          if (a > b || a === void 0) return 1;
          if (a < b || a === void 0) return -1;
        }
        // 如果a===b的情况 根据index
        return left.index - right.index;
      }),
      "value"
    );
  };
  // 🤔思考题each map区别  都是循环遍历  循环过程需要做啥操作就在循环体实现 唯一不懂是map需要返回一个结果数组
  // 🤔需求：把一个集合分组为多个集合，通过 iterator 返回的结果(❗️❗️❗️)进行分组.
  var group = function (behavior, partition) {
    return function (obj, iteratee, context) {
      var result = partition ? [[], []] : {};
      iteratee = cb(iteratee, context);
      // value 子项
      _.each(obj, function (value, index) {
        // return "one"["length"] 可能有这种返回值 如果没有就返回undefined
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // 给定一个list，和 一个用来返回一个在列表中的每个元素键 的iterator 函数（或属性名），
  // 返回一个每一项索引的对象。和groupBy非常像，但是当你知道你的键是唯一的时候可以使用indexBy 。
  // 根据返回的key值进行排序
  _.indexBy = group(function (result, value, key) {
    // 核心操作  ---- ❗️❗️❗️确实简单啊  以前就是用这种方式实现去重的 键值对唯一
    result[key] = value;
  });

  // 把一个集合分组为多个集合，通过 iterator 返回的结果进行分组. 如果 iterator 是一个字符串而不是函数, 那么将使用 iterator 作为各元素的属性名来对比进行分组.
  // key不是唯一索引
  // 引用类型
  _.groupBy = group(function (result, value, key) {
    if (has(result, key)) result[key].push(value);
    // 怎么变为数组,就是这样的操作  result[key]的值是一个数组
    else result[key] = [value];
  });

  // indexBy groupBy countBy  中iteratee的（行为）作用就是返回Key值
  // 排序一个列表组成一个组，并且返回各组中的对象的数量的计数。类似groupBy，但是不是返回列表的值，而是返回在该组中值的数目。
  _.countBy = group(function (result, value, key) {
    if (has(obj, key)) result[key]++;
    else result[key] = 1;
  });

  // 正则表达式是匹配模式，要么匹配字符，要么匹配位置。请记住这句话。
  // 首先正则的作用·对象多数用于字符串 🤔需求：要么返回匹配得到的字符串，要么返回布尔值
  // 弄清楚字符串的几个匹配方法就行了
  /*
      如果 regexp 没有标志 g，那么 match() 方法就只能在 stringObject 中执行一次匹配。如果没有找到任何匹配的文本， 
      match() 将返回 null。否则，它将返回一个数组，其中存放了与它找到的匹配文本有关的信息。该数组的第 0 个元素存放的是匹配文本，而其余的元素存放的是与正则表达式的子表达式匹配的文本。
      除了这些常规的数组元素之外，返回的数组还含有两个对象属性。index 属性声明的是匹配文本的起始字符在 stringObject 中的位置，input 属性声明的是对 stringObject 的引用。

      如果 regexp 具有标志 g，则 match() 方法将执行全局检索，
      找到 stringObject 中的所有匹配子字符串。若没有找到任何匹配的子串，则返回 null。
      如果找到了一个或多个匹配子串，则返回一个数组。不过全局匹配返回的数组的内容与前者大不相同，它的数组元素中存放的是 stringObject 中所有的匹配子串，而且也没有 index 属性或 input 属性。
  */
  // 正则的[]表示一个集合 意思你匹配到这个位置 随便满足一个集合里的元素就行 是这样的作用
  /*
   这个正则按“|”分割，包含三个部分
   [^\ud800-\udfff][\ud800-\udbff][\udc00-\udfff][\ud800-\udfff]
   第一个表示不包含代理对代码点的所有字符
   第二个表示合法的代理对的所有字符
   第三个表示代理对的代码点（本身不是合法的Unicode字符）所以匹配的结果是分解为字符数组（如果是合法的字符一定会切分正确）。
  */
  // js文件中，有些变量的值可能会含有汉字，画面引入js以后，有可能会因为字符集的原因，把里面的汉字都变成乱码。后来发现网上的一些js里会把变量中的汉字都表示成”\u“开头的16进制编码，这样应该可以解决上面的问题
  // 按Unicode来处理字符
  // JS判断字符串长度（英文占1个字符，中文汉字占2个字符）
  var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
  // 需求🤔：将对象转化成数组
  _.toArray = function (obj) {
    if (!obj) return []; // 如果传入的对象为空返回一个空数组
    if (_.isArray(obj)) return slice.call(obj);
    // 对字符串的处理
    if (_.isString(obj)) {
      return obj.match(reStrSymbol);
    }
    // 类数组（数组也是类数组）的处理
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // 真值检测函数 -- predicated
  // 通过真值检测函数（要么true 要么false）来区分组 所以就存在两个组
  // 需求：将 list 拆分为两个数组：第一个数组其元素都满足predicate迭代函数， 而第二个的所有元素均不能满足predicate迭代函数。 predicate 通过 iteratee 进行转换，以简化速记语法。
  // behavior(result, value, key);
  //   var group = function (behavior, partition)  partition的作用
  //   存在partition则为[[],[]] 也就是partition永远只有两组数组 这就是为啥result[pass]是个数组
  _.partition = group(function (result, value, pass) {
    // result[pass]是个数组
    result[pass ? 0 : 1].push(value);
  }, true);

  // 🤔：拿到对象的长度 返回list的长度。
  // 🤔：好奇类数组的定义以及规律
  _.size = function (obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };
  /* -------------------------数组篇的方法----------------------- */
  /* -----------------------数组篇考虑的作用对象就是类数组了 不用考虑普通对象------------------------- */

  // 🤔underscore的guard的作用
  // 就是个令牌开启map  The **guard** check  allows it to work with `_.map`.
  // https://stackoverflow.com/questions/18639936/what-does-the-passed-parameter-guard-check-in-underscore-js-functions 看这里
  // map传入回调函数的参数最起码有三个 保证了guard为true
  /*
  
     var a = [ [1, 2, 3], [4, 5, 6] ];
     // put this array though _.map and _.first
     _.map(a, _.first); // [1, 4]
  
  */

  // 需求👀：Returns the first element of an array. Passing n will return the first n elements of the array.
  _.first = _.head = _.take = function (array, n, guard) {
    if (array == null || array.length < 1) return n == null ? void 0 : [];
    // guard的作用
    if (n == null || guard) return arr[0];
    // 如果返回全部
    return _.initial(array, array.length - n);
  };
  // 默认：返回数组中除了最后一个元素外的其他全部元素。 在arguments对象上特别有用。传递 n参数将从结果中排除从最后一个开始的n个元素（注：排除数组后面的 n 个元素）。
  // 跟first相反的
  _.initial = function (array, n, guard) {
    // 从0开始切
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
  // 返回一个除去所有false值的 array副本。 在javascript中, false, null, 0, "", undefined 和 NaN 都是false值.
  _.compact = function (array) {
    // _.filter(list, predicate, [context])
    // 遍历list中的每个值，返回包含所有通过predicate真值检测的元素值。（注：如果存在原生filter方法，则用原生的filter方法。）
    // _.filter最后返回一个数组
    return _.filter(array, Boolean);
  };
  /*************数组扁平化**************/
  // flatten 铺平
  // 将一个嵌套多层的数组 array（数组） (嵌套可以是任何层数)转换为只有一层的数组。 如果你传递 shallow参数，数组将只减少一维的嵌套。
  // _.flatten(array, [shallow])  shallow 浅 也就是做一层循环
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
      }
      // strict的作用？？？
      // 当strict为false时，只要是非数组对象，flatten都会直接添加到output数组中；如果strict为true，那么会无视input数组中的非类数组对象
      // 本来是限制是操作数组 但是开启非严格的形式 值value就可以容纳对象 --->我是这样🤔的
      else if (!strict) {
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

  // flatten函数 不是_.flatten函数
  // var flatten = function (input, shallow, strict, output)

  // Returns a copy of the array with all instances of the values removed.
  // _.without(array, *values)
  // 需求🤔：传入value删除数组的value,注意是单个值，可传多个
  // restArguments🤔就是个高阶函数
  // _.restArguments(function, [startIndex])
  _.without = restArguments(function (array, otherArrays) {
    return _.difference(array, otherArrays);
  });
  //  需求🤔：传入value删除数组的value,value是数组,可传多个
  // restArguments函数的作用无非就是让函数的最后一个参数变为rest参数（类似es6的rest）
  _.difference = restArguments(function (array, rest) {
    // 返回了铺平后的数组
    rest = flatten(rest, true, true); // 铺平数组 只循环一层 开启严格原则(非类数组对象不能传入)
    //  filter返回匹配的值 返回的是一个数组
    return _.filter(array, function (value) {
      return !_.contains(rest, value);
    });
  });
  // ⚠️函数一遇到return就执行结束

  // 🤔：怎么判断对象是相等
  // 返回 array去重后的副本, 使用 === 做相等测试 underscore做相等测试

  // 需求🤔：怎么实现数组去重

  // 新建结果集数组result，遍历待去重数组，将每个遍历值在result数组中遍历检查，将不存在当前result中的遍历值压入result中，最后输出result数组。
  // 对于对象的去重，我们知道{}==={}为false，所以使用===比较对象在实际场景中没有意义。
  // 🤔：underscore的去重原理就是判断有没有排序好的 和使用indexOf优化内部循环,❗️❗️❗️并不支持成员为对象的去重
  // 支持传入iteratte并且要求iteratte返回值通过返回的值判断有没有重复再去去重，返回原始数组的成员
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

  // 将 每个arrays中相应位置的值合并在一起。在合并分开保存的数据时很有用. 如果你用来处理矩阵嵌套数组时, _.zip.apply 可以做类似的效果。
  _.zip = restArguments(_.unzip);

  // 将 每个arrays中相应位置的值合并在一起。在合并分开保存的数据时很有用. 如果你用来处理矩阵嵌套数组时, _.zip.apply 可以做类似的效果。

  _.unzip = function (array) {
    // 作用对象是['moe', 'larry', 'curly'], [30, 40, 50], [true, false, false]这种的
    // 找到最大的成员数组长度
    //  _.max = function (obj, iteratee, context)
    // 只要“&&”前面是true，无论“&&”后面是true还是false，结果都将返“&&”后面的值;
    var length = (array && _.max(array, getLength).length) || 0;
    var result = Array(length);
    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // 需求🤔：如何将数组转化为对象
  // 反过来： 把list(任何可以迭代的对象)转换成一个数组，在转换 arguments 对象时非常有用。-- toArray
  // 将数组转换为对象。传递任何一个单独[key, value]对的列表，或者一个键的列表和一个值得列表。 如果存在重复键，最后一个值将被返回。
  /*
   场景是这样的，有些特殊：
     _.object(['moe', 'larry', 'curly'], [30, 40, 50]);
           => {moe: 30, larry: 40, curly: 50}

         _.object([['moe', 30], ['larry', 40], ['curly', 50]]);
         => {moe: 30, larry: 40, curly: 50}
  
  */
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

  // 最难最有价值的一部分
  /***********************与函数有关的函数（Function (uh, ahem) Functions*****************************************/

  // 🤔：什么是函数式编程：
  /*
   
   我们需要先知晓什么是函数式编程? 函数式编程是一种编程风格，它可以将函数作为参数传递，并返回没有副作用的函数
   
   而什么是偏函数应用(partial application), 通俗点理解,
   固定一个函数的一个或者多个参数，也就是将一个 n 元函数转换成一个 n - x 元函数；
   函数柯里化(curry)的理解，`可以概括为将一个多参数函数转换成多个单参数函数`，
   也就是将一个 n 元函数转换成 n 个一元函数。



  */

  // bind的实现
  // 绑定函数 function 到对象 object 上, 也就是无论何时调用函数, 函数里的 this 都指向这个 object. 任意可选参数 arguments 可以传递给函数 function , 可以填充函数所需要的参数, 这也被称为 partial application。对于没有结合上下文的partial application绑定，请使用partial。

  // 指定原型对象 创建新对象的函数Object.create方法

  // 声明一个空的构造函数
  // 一些顶级原型对象的基本属性 是永远会继承的 想甩开也甩不掉 也没必要甩开
  var Ctor = function () { };
  var baseCrete = function (prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    // 突然到这步有点懵逼 没反应过来
    // 突然想到prototype对象的属性可能没有用this去声明 也反过来这个this声明的属性可能就不是prototype的属性
    // 因为this是动态绑定的  ❗️❗️❗️还有就是只要你是挂载到原型上的属性 都会被继承 但是为啥怎么继承
    // 还得深究  跟new 构造函数 实例化对象继承构造函数属性不一样 new是通过操作this实现的
    // 原型怎么实现继承的不知道了 反正就是规定 我们的属性会继承来自原型对象 只要是原型上的属性
    // 比如prototype.a  不用管原型对象是否具有this啥啥啥的 这一点确实方便
    // 反过来思考下🤔什么是对象的属性 a.b就是  {name:"vnues",age:22}  name age就是对象属性  哎呀山路十八弯的感觉
    Ctor.prototype = prototype;
    var result = new Ctor();
    Ctor.prototype = null; // 手动回收资源
    return result;
  };

  // _.bind(...)执行bind函数
  // bind的实现我用apply去实现它
  // 怎么绑定参数上去
  // ❗️❗️❗️当前函数的 this 是在 数被调用执行的时候才确定
  // 正是由于这个原因，才导致一个函数内部的 hi 到底指向谁是非常灵活且不确定的

  // 决定是否把一个函数作为构造函数或者普通函数调用
  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments.

  /*
  
  
     sourceFunc --->func   var func = function(greeting){ return greeting + ': ' + this.name }
   // 觉得这样子处理这种特殊情况有意义吗 有意义
  // 这一步也是会并且将其构造函数this关联的属性绑定给实例化对象
    var result = sourceFunc.apply(self, args); // 调用sourceFunc函数  函数内部this指向self
    一般构造函数没有返回值所以都是走return else
    ❗️我认为构造函数中类似这种this.a不是构造函数的属性
    所以这种实例化对象与构造函数之间需要用名词表示吧  

    ：并且将其构造函数this关联的属性绑定给实例化对象

  */

  var executeBound = function (
    sourceFunc,
    boundFunc,
    context,
    callingContext,
    args
  ) {
    // 注意是双括号
    if (!(callingContext instanceof boundFunc)) {
      return sourceFunc.apply(context, args);
    }
    // 可以说是代替new操作了
    var self = baseCrete(sourceFunc.prototype); // 创建一个新对象 对象的原型指向sourceFunc.prototype 补充一点❗️❗️❗️ 你有能力指向了这个原型 说明就继承了这个属性 （脑海里得反映出这种双重思维）
    /*
         
       sourceFunc=function(){
           this.name="111"
           this.alert=function(){
              console.log(this.name)
           }
       }
      
    */
    // 怎么会返回result
    // 总感觉apply是有返回值的
    //     这一步也是会并且将其构造函数this关联的属性绑定给实例化对象

    var result = sourceFunc.apply(self, args);
    // 返回实例化对象
    if (_.isObject(result)) return result;
    return self; // 返回空对象
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
      
     func---> restArguments(function (callArgs) {
      return executeBound(func, bound, context, this, args.concat(callArgs));
    });
    
    也即是最后func长成这样子--> function(){return executeBound(func, bound, context, this, args.concat(callArgs))}

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
  // bind由于是偏函数 所以需要保存部分变量 需要用到去保存部分变量 这样这部分变量就不用再传入了
  // 还要考虑一个特殊场景 就是用bind绑定后返回的函数（注意这句话）来充当构造对象 这时候该怎么兼容
  // 因为bind绑定后返回的函数跟闭包肯定有关联 `❗️❗️❗️  有待考究
  // 也就是new操作会被影响   这就是为啥要写多层判断兼容
  // es5中bind也是做了这层兼容的
  // ❗️❗️❗️用bind绑定过后返回的函数跟普通的函数一样 new出来的实例不会奇怪】、
  // 具体看看别人的bind如何实现再来评价` es5中bind也是做了这层兼容的`
  // 首先要明白 他是怎么固定this指向的 用闭包 _.bind(...)=bound--->func
  // func()---> function(){return sourceFunc.apply(context, args);} 实际构造函数是这样 你说要不要兼容❗️❗️❗️
  // 是这样写的

  _.bind = restArguments(function (func, context, args) {
    if (!_.isFunction(func))
      throw new TypeError("Bind must be   on a function");
    var bound = restArguments(function (callArgs) {
      // sourceFunc,boundFunc,context,callingContext,args
      // args拼接这个callArgs参数
      // bind函数执行会形成一个闭包保存传进来的参数 args
      // 之后返回一个函数func
      // 这个this的应用场景函数this场景  非严格模式下 window是调用者 所以this指向window
      // new func()时候 this指向的boundFunc的构造实例的
      // _.bind(..)-->func -->就是bound ---> new bound()-->三个步骤
      /*
      function Animal() {
        console.log("发出声音")
       }
      let animal  = {};
      animal.__proto__ = Animal.prototype;
      Animal.call(animal) 
      这里构造函数内部的this就是执行这个实例化构造函数
      --->就是运行executeBound(func, bound, context, this, args.concat(callArgs))
     */

      // 因为这步 return executeBound(func, bound, context, this, args.concat(callArgs));是构造函数内部的代码 所以自然而然这块指向实例化对象
      return executeBound(func, bound, context, this, args.concat(callArgs));
    });
    console.log(bound);
    return bound;
  });

  // 偏函数有这么些情况 一是假如你有参数调用 多次传入相同的参数 这时候就是要使用偏函数啦
  /*
   首先写法一和写法效果一样  等价的 不同的是写法二可以保存变量 闭包的写法
    1.var alert =function(){
       alert("alert")
    }

   bound=function(){
        alert("alert")
   }
  2. var alert=function(){
      return bound()
   }
  
  */
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
  // 跟Bind一样都是偏函数 唯一不同就是this不改变
  _.partial = restArguments(function (func, boundArgs) {
    // 占位符
    var placeholder = _.partial.placeholder;
    var bound = function () {
      // 标记arguments参数是不是全的
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
      // 🤔🤔🤔：为什么需要考虑executeBound
      /*
        
      首先写法一和写法效果一样  等价的 不同的是写法二可以保存变量 闭包的写法
            1.var alert =function(){
              alert("alert")
            }

          bound=function(){
                alert("alert")
          }
          2. var alert=function(){
              return bound()
          }
      // 如果考虑到return影响new 我就是写法一就行啦
      // 🤔🤔🤔如果是写法一的会是什么样子
      // 最终还是会遇到 return sourceFunc.apply(context, args); 所以逃不过return命运
      // 一个构造函数内部有return就会影响到new
      // 讲Bind分析过程🤔🤔🤔为什么需要考虑executeBound我可能分析错了 不要全信啊！！！
      */
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  });
  // 声明占位符
  _.partial.placeholder = _;

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  // 把methodNames参数指定的一些方法绑定到object上，这些方法就会在对象的上下文环境中执行。
  // 绑定函数用作事件处理函数时非常便利，否则函数被调用时this一点用也没有。methodNames参数是必须的。
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

  // https://zhuanlan.zhihu.com/p/27642433

  // 需求🤔🤔🤔memoize 优化 实现一个记忆函数用于缓存
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
     尾递归又是什么哈哈哈❓❓❓尾调用的概念非常简单，一句话就能说清楚，就是指某个函数的最后一步是调用另一个函数。
     函数调用自身，称为递归。如果尾调用自身，就称为尾递归。
     // https://juejin.im/post/5ab9a3ab518825558154fe83
     所以使用memoize缓存
  */
  // ❓❓❓一个疑问怎么定义hasher
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

  // 高阶函数使用可能出现函数嵌套 嵌套显然不行 得使用组合的方式  这些都是函数式编程的范畴啦❗️❗️❗️
  // 序列化和存储有关

  // 进行复制
  _.mixin(_);
  // 如果underscore实现了原生的方法那就拓展该方法为目的 比如数组的方法可用于对象❗️❗️❗️
  // review实现完🈶必要记录成博文 map最后会返回是一个数组
})();
