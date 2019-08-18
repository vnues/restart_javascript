
 https://juejin.im/post/5cf476e7e51d4556db6949ba
### 什么是函数记忆

函数可以将之前的操作结果缓存在某个对象中，当下次调用时，如果遇到相同的参数，就直接返回缓存中的数据，从而避免无谓的重复运算。这种优化被称作记忆


函数可以将之前的操作结果缓存在某个对象中，当下次调用时，如果遇到相同的参数，就直接返回缓存中的数据，从而避免无谓的重复运算。这种优化被称作记忆。


```javascript
  
  function add(a, b) {
    return a + b;
}

// 假设 memoize 可以实现函数记忆
let memoizeAdd = memoize(add);

memoizeAdd(1, 2) // 3
memoizeAdd(1, 2) // 相同的参数，第二次调用时，从缓存中取出数据，而非重新计算一次

```

记忆只是一种编程技巧，本质上是牺牲算法的空间复杂度以换取更优的时间复杂度，在客户端 Javascript 中代码的执行时间复杂度往往成为瓶颈，因此在大多数情况下，这种牺牲空间换取时间的做法是非常可取的


###  适用场景

比如说，我们想要一个递归函数来计算 Fibonacci 数列。 一个 Fibonacci 数字是之前两个 Fibonacci 数字之和。 最前面的两个数组是 0 和 1。

```javascript
  
  let count = 0; //用于记录函数调用次数
let fibonacci = function(n){
    count ++ ; // 每次调用函数将 count + 1
    return n < 2 ? n : fibonacci(n-1) + fibonacci(n - 2);
}

for(let i = 0; i < 10; i++){
    console.log(`i=${i}:`,fibonacci(i))
}

console.log('总次数:',count)

// i=0:0
// i=1:1
// i=2:1
// i=3:2
// i=4:3
// i=5:5
// i=6:8
// i=7:13
// i=8:21
// i=9:34

// 总次数: 276


```

上面的代码本身是没什么问题的，但它做了很多无谓的工作。我们在 for 循环中共调用了 10 次 fibonacci 函数，但实际上 fibonacci 函数被调用了 276 次，它自身调用了 266 次去计算可能已被刚刚计算过的值。如果我们让该函数具备记忆功能，就可以显著地减少运算量。


比如6*8 8*6

接下来我们来思考如何实现一个通用函数( memoize )来帮助我们构造带记忆功能的函数。

原理上很简单，只是将函数的参数和对应的结果一并缓存至闭包中，待调用时判断参数对应的数据是否存在，存在就直接返回缓存的数据结果。


函数记忆：
让函数记住处理过的参数和处理结果
函数记忆的作用：
为避免重复运算
什么时候使用函数记忆:
函数可能反复计算相同的数据时
如何实现:
使用闭包保存住曾经计算过的参数和处理结果


// !!!这特么什么是复杂度 一定要接触到这种

所以我们看看 underscore 的 memoize 函数是如何实现的
```javascript
  
 // 第二版 (来自 underscore 的实现)
var memoize = function(func, hasher) {
    var memoize = function(key) {
        var cache = memoize.cache;
        var address = '' + (hasher ? hasher.apply(this, arguments) : key);
        if (!cache[address]) {
            cache[address] = func.apply(this, arguments);
        }
        return cache[address];
    };
    memoize.cache = {};
    return memoize;
};
  
```
从这个实现可以看出，underscore 默认使用 function 的第一个参数作为 key，所以如果直接使用


```javascript
   
   var add = function(a, b, c) {
  return a + b + c
}

var memoizedAdd = memoize(add)

memoizedAdd(1, 2, 3) // 6
memoizedAdd(1, 2, 4) // 6

```

肯定是有问题的，如果要支持多参数，我们就需要传入 hasher 函数，自定义存储的 key 值。所以我们考虑使用 JSON.stringify：

```javascript
   
   var memoizedAdd = memoize(add, function(){
    var args = Array.prototype.slice.call(arguments)
    return JSON.stringify(args)
})

console.log(memoizedAdd(1, 2, 3)) // 6
console.log(memoizedAdd(1, 2, 4)) // 7

```
如果使用 JSON.stringify，参数是对象的问题也可以得到解决，因为存储的是对象序列化后的字符串。

如果使用 JSON.stringify，参数是对象的问题也可以得到解决，因为存储的是对象序列化后的字符串。

因为第一版使用了 join 方法，我们很容易想到当参数是对象的时候，就会自动调用 toString 方法转换成 [Object object]，再拼接字符串作为 key 值。我们写个 demo 验证一下这个问题：

```javascript
  

var propValue = function(obj){
    return obj.value
}

var memoizedAdd = memoize(propValue)

console.log(memoizedAdd({value: 1})) // 1
console.log(memoizedAdd({value: 2})) // 1

console.log({value: 2}+'') // [object Object]



原来是这样

console.log({value: 1}+'') // [object Object]

```
用到JSON....就要考虑这个是作用于对象的