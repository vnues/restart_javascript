我们总是用!inistial代表true来表示条件
所以在表达式判断时候得具有这个思想
!!!这个开发中也是经常用到


不用那么复杂, compose拿原生reduce一行代码就实现了， 
export default function compose(...funcs) {
return funcs.reduce((a, b) => (...args) => a(b(...args)))
}


https://www.jianshu.com/p/eda918cf738a


reduce函数的实现compose
compose(d, c, b, a)


从上面的例子可以看出，假设f、g、h分别表示三个函数，则compose(f,g,h)返回的函数完成类似(...args) => f(g(h(...args)))的功能。即从右到左组合多个函数，前面函数的返回值作为下一个函数的参数;pipe(f,g,h)返回的函数完成类似(...args) => h(g(f(...args)))的功能，即从左到右组合多个函数，前面函数的返回值作为下一个函数的参数；预计最先执行的函数可以接受任意个参数，后面的函数预计只接受一个参数。把compose放在前面讲是因为其更加体现了数学含义上的从右到左的操作


var index = dir > 0 ? 0 : length - 1;

判断是从头开始还是从尾开始




### underscore的去重

```javascript
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

    var result = [];// 返回去重后的数组（副本）
    var seen = [];// 用于存放已经最外层循环过的array成员的值便于下一次比较，或者用于存储computed值
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
```