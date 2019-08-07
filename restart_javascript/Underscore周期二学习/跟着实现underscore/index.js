/*
   underscore即是需求
*/

// 函数式编程 既要考虑调用这个函数需要哪些参数 也要知道回调函数它给我们返回哪些参数！！！

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
    // 如果是!!null==>false 如果非null !!obj则为true
    return type === "function" || (type === "object" && !!obj);
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
  // value是iteratee函数（也可能是别的数据类型）
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
    // 如果iteratee传入的是对象 那么就判断被迭代者属性（对象也可能不是对象）的key和value的key是否匹配
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
        //reducer(obj, optimizeCb(iteratee, context, 4), memo, initial)
        // accumulator是累加器 为什么是累加器？
        // 回调函数接收中 以reduce方法为例子 accumulator是
        return function(accumulator, value, index, collection) {
          return func.call(context, accumulator, value, index, collection);
        };
    }
    // 返回的是回调函数
    return function() {
      return func.apply(context, arguments);
    };
  };
  // defaults就是config配置项 要不要开启
  // 该方法可以拷贝多个对象
  var crateAssigner = function(keysFunc, defaults) {
    return function(obj) {
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

  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    // 为什么返回函数因为所有的iteratte都要被处理成函数
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  _.isMatch = function(object, attrs) {
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
  var restArguments = function(func, startIndex) {
    // 默认startIndex为null也即是最后一个形参变量表示剩余参数
    // 这里不能===
    startIndex = startIndex == null ? func.length - 1 : startIndex;
    return function() {
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
  _.chain = function(obj) {
    if (obj instanceof _) return obj;
    var instance = _(obj);
    instance._chain = true; // 控制开关
    return instance;
  };
  // intance是上个调用的方法的实例化对象_ 所以可以拿到_chain属性 这个obj是运行完方法返回的对象
  var chainResult = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
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
  // map内置对象匹配的功能 比如匹配循环的对象属性是否具有对应的key值
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

  // reduce函数有两种形式 一种是从右到左执行 一种是从左往右 所以需要一个dir确定 同时返回一个函数 那么来写一个公共函数来实现它吧
  var createReduce = function(dir) {
    var reducer = function(obj, iteratee, memo, initial) {
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
    return function(obj, iteratee, memo, context) {
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
  _.find = function(obj, predicate, context) {
    var keyFinder = isArrayLike(obj) ? _.findIndex : _.findKey;
    var key = keyFinder(obj, predicate, context);
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // 声明一个生成函数 to create the findIndex and findLastIndex functions
  // 只返回一个
  var createPredicateIndexFinder = function(dir) {
    return function(array, predicate, context) {
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
  _.findKey = function(obj, predicate, context) {
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
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(valiue, index, list)) results.push(value);
    });
    return results;
  };

  // Looks through the list and returns the first value that matches all of the key-value pairs listed in properties.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // 判断属性是否有在obj数组内的对象的属性
  // Looks through each value in the list, returning an array of all the values that matches the key-value pairs listed in properties.
  // where函数与filter函数的区别是不用传iteratee函数
  _.where = function(obj, attrs) {
    // return结果
    // _.matcher(attrs)返回的是函数 也就是作为iteratee
    return _.filter(obj, _.matcher(attrs));
  };

  // Returns a negated version of the passed-in predicate.
  // 返回传入谓词的否定(函数)版本。
  // predicate是谓语函数
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // filter返回结果的对立结果
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Returns true if all of the values in the list pass the predicate truth test. Short-circuits and stops traversing the list if a false element is found. predicate is transformed through iteratee to facilitate shorthand syntaxes.
  // 传给回调函数obj子属性
  _.every = _.all = function(obj, predicate, context) {
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
  _.some = _.any = function(obj, predicate, context) {
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
  _.values = function(obj) {
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
  _.contains = _.includes = _.include = function(obj, item, formIndex, guard) {
    // guard存在说明fromIndex肯定也有 是否是number类型还得继续判断
    // 非类数组（数组也归为类数组）对象类型
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof formIndex != "number" || guard) formIndex = 0;
    return _.indexOf(obj, item, formIndex) >= 0;
  };

  // 实现indexof

  // 进行复制
  _.mixin(_);
})();
