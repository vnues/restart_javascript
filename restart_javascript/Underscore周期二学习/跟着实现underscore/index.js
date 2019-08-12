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
  // value ---> iteratee
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
    if (!obj) return [];// 如果传入的对象为空返回一个空数组
    if (_.isArray(obj)) return slice.call(obj)
    // 对字符串的处理
    if (_.isString(obj)) {
      return obj.match(reStrSymbol)
    }
    // 类数组（数组也是类数组）的处理
    if (isArrayLike(obj)) return _.map(obj, _.identity)
    return _.values(obj)
  }

  // 真值检测函数 -- predicated
  // 通过真值检测函数（要么true 要么false）来区分组 所以就存在两个组
  // 需求：将 list 拆分为两个数组：第一个数组其元素都满足predicate迭代函数， 而第二个的所有元素均不能满足predicate迭代函数。 predicate 通过 iteratee 进行转换，以简化速记语法。
  // behavior(result, value, key);
  //   var group = function (behavior, partition)  partition的作用
  //   存在partition则为[[],[]] 也就是partition永远只有两组数组 这就是为啥result[pass]是个数组
  _.partition = group(function (result, value, pass) {
    // result[pass]是个数组
    result[pass ? 0 : 1].push(value)
  }, true)

  // 🤔：拿到对象的长度 返回list的长度。
  // 🤔：好奇类数组的定义以及规律
  _.size = function (obj) {
    if (obj == null) return 0
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  }
  /* ------------------------- 数组方面的方法----------------------- */

  // 进行复制
  _.mixin(_);
  // 如果underscore实现了原生的方法那就拓展该方法为目的 比如数组的方法可用于对象❗️❗️❗️
  // review实现完🈶必要记录成博文 map最后会返回是一个数组
})();
