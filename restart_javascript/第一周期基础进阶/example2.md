## 函数

所谓"第一等公民"（first class），指的是函数与其他数据类型一样，处于平等地位，可以赋值给其他变量，也可以作为参数，传入另一个函数，或者作为别的函数的返回值。这些场景，我们应该见过很多。

```javascript
// 声明一个被迫历的 数据array
var array = [1, 2, 3, 4];
// map 方法 第一个参数为一个回调函数，该函数拥有三个参数
//  第一个参数表示array 数组中的每一项
//  第二个参数表示当前边历的索引值
//  第三个参数表示数纽本身
// 该 函数中的 this 指向map 方法的第二个 参数，若该参数不存在，则 this 指向丢失
var newArray = array.map(
  function(item, i, array) {
    // console.log(item, i, array, this); //可运行查看每一项 参数的具体位
    return item + 1;
  },
  { a: 1 }
);
```

map 函数是有返回值所以需要接收 好像不接收会被打印

```javascript
(function() {
  debugger;
  return 1;
})();
```

##高阶函数

```javascript
let array = [1, 2, 3, 4, 5, 6];
array.map((item, index, n, m) => {
  console.log(item);
  console.log(index);
  console.log(n);
  console.log(m);
});
let array = [1, 2, 3, 4, 5, 6];
array.map((item, index) => {
  console.log(item);
  console.log(index);
});
let array = [1, 2, 3, 4, 5, 6];
array.map(
  (item, index) => {
    //  箭头函数没有this值的
    console.log(item);
    console.log(index);
    console.log(this);
  },
  { a: 1 }
);

let array = [1, 2, 3, 4, 5, 6];
array.map(
  function(item, index) {
    debugger;
    console.log(item);
    console.log(index);
    console.log(this);
    return 1;
  },
  { a: 1 }
);
console.log(array);
```

## 实现 map 高阶函数

```javascript
// 实现的api
Array.prototype._map = function(fn, context) {
  // 接受两个参数 fn是传递过来的函数 context执 callback 函数时使用的this值
  let temp = []; //重新生成的数组
  if (typeof fn == "function") {
    var k = 0;
    var length = this.length; // 这里的this指向数组 调用这个方法的数组
    for (; k < length; k++) {
      // this 体现作用就是在这里了
      // 调用这个函数 然后传入参数
      temp.push(fn.call(context, this[k], k, this)); // fn.call更改this指向  执行函数fn
    }
  } else {
    console.error(`TypeError :${fn}is not a function`);
  }
  return temp;
};

let array = [1, 2, 3, 4];
// 提供的api
// 这个回调函数function(item) console.log(item);return item; } 它会接收一个item参数
// 这个回调函数 是个声明函数    函数是这样的形式·fuction(){....}才叫函数  fn()叫调用函数
// 弄清楚概念
const a = array._map(function(item) {
  console.log(item);
  return item;
});
const b = array._map(item => {
  console.log(item);
  return item;
});
console.log(b);
```

看到 call、apply 、bind 方法一定要知道就是调用这个参数 可能还会传入参数
call() 方法使用一个指定的 this 值和单独给出的一个或多个参数来调用一个函数。
call 就是调用参数并传入参数

所有 函数 为参数 函数，都可 以叫作高阶函数

高阶函数的使用思路正在于此，它其实是一个封装公共逻辑的过程
如果多个函数共用代码段很多 使用高阶函数去抽离吧 就上上述的\_map 函数 公用代码段挺多的
就像 react 的高阶组件一样

## 函数柯里化

在数学和计算机科学中，柯里化是一种将使用多个参数的一个函数转换成一系列使用一个参数的函数的技术。

curry 的这种用途可以理解为：参数复用。本质上是降低通用性，提高适用性。

console.log 的方法函数调用栈怪怪的 看起来

a.fn.call(b) // 改变 this 指向 实际可以这样认为 b.fn() 让 b 有这个方法 b 替代 a 这样
[].slice.call(arguments, 1);<====>写法跟 a.slice(2) 一样 call 后面第二个参数就是传入 slice 的参数 所以脑海得有这样的概念

slice() 方法提取一个字符串的一部分，并返回一新的字符串
concat() 方法将一个或多个字符串与原字符串连接合并，形成一个新的字符串并返回

```javascript
var curry = function(fn) {
  console.log("arguments", arguments);
  var args = [].slice.call(arguments, 1);
  console.log("args", args);
  return function() {
    var newArgs = args.concat([].slice.call(arguments));
    console.log("[].slice.call(arguments", [].slice.call(arguments));
    console.log(newArgs);
    console.log(this);
    return fn.apply(this, newArgs);
  };
};
function add(a, b) {
  return a + b;
}

var addCurry = curry(add, 1, 2);
addCurry(); // 3
//或者
var addCurry = curry(add, 1);
addCurry(2); // 3
```

arguments 能拿到函数的所有的参数值 -- 所以理解起来应该没有难度吧

## 第二版

```javascript
function sub_curry(fn) {
  console.log("sub_curry arguments", arguments);
  var args = [].slice.call(arguments, 1);
  return function() {
    console.log(arguments);
    console.log(args.concat([].slice.call(arguments)));
    return fn.apply(this, args.concat([].slice.call(arguments)));
  };
}

function curry(fn, length) {
  console.log(fn);
  console.log([fn]);
  console.log("fn.length", fn.length);
  length = length || fn.length;

  var slice = Array.prototype.slice;
  console.log("arguments", arguments);
  return function() {
    console.log("arguments", arguments);
    if (arguments.length < length) {
      console.log("[fn]", [fn]);
      var combined = [fn].concat(slice.call(arguments));
      return curry(sub_curry.apply(this, combined), length - arguments.length);
      // debug 执行发现有一步马上走这这里的是因为要return回去
    } else {
      return fn.apply(this, arguments);
    }
  };
}
var fn = curry(function(a, b, c, d) {
  return [a, b, c, d];
});
debugger;
console.log(fn);
// fn("a", "b", "c"); // ["a", "b", "c"]
fn("a", "b")("c")("d"); // ["a", "b", "c"]
// fn("a")("b")("c") // ["a", "b", "c"]
// fn("a")("b", "c") // ["a", "b", "c"]
```

```javascript
var f = 1;
if (!f) {
  var a = 10;
}
function fn() {
  var b = 20;
  c = 30;
}
fn();
console.log(a);
console.log(c);
console.log(b);
```

声明函数可以不用写参数 但是可以传无限个 8

// 每个函数都有一个 length 属性 （函数名.length）， 表示期望接收的函数的个数（而不是实际接收的参数个数）

它与 arguments 不同。 arguments.length length 属性指明函数的形参个数。(在声明函数的时候显示指明 假设你指定的是三个但传入 4 个结果还是 3 个)

```javascript
function a(a, b, c) {
  return [a, b, c];
}
fn("a", "b")("c")("d");
// 就是柯里化函数<=四个函数
```

function person(a,b,c){

}

console.log(person.length)

还是明确我用柯里化想解决什么问题

现在的其中一个我们想用 add(1,2,3)这样表示 add(1)(2)(3)
需要用到闭包去保存变量

了解 call apply 使用 这个就是相当于 a(d) <=====> a.call(b,d) 函数调用传入参数改变 this 指向 注意是参数传递 写法特殊一些 但是应该要意识到

## 关于 debug return 问题

- debug 的时候遇到 return function(){}这种形式 直接跳出函数没有执行函数内部的 不用去查看里面的变量啊啥的 会干扰你的判断的 而且没进去里面执行的 看了没什么意义 -- 这是技巧来的

- 如果 return 是个执行函数 回去里面执行再 return 回来原始位置 所以不用感到惊讶

## 函数写法 return 可能嵌套多层 自己把细节写出来就能看出来了 实际上闭包 return 函数引用问题就应该这么分析

````javascript
function sub_curry(fn) {
  var args = [].slice.call(arguments, 1);
  return function() {
    return fn.apply(this, args.concat([].slice.call(arguments)));
  };
}

function curry(fn, length) {
  length = length || fn.length;

  var slice = Array.prototype.slice;
  return function() {
    if (arguments.length < length) {
      var combined = [fn].concat(slice.call(arguments));
      return curry(sub_curry.apply(this, combined), length - arguments.length);
    } else {
      return fn.apply(this, arguments);
    }
  };
}
var fn1 = curry(function(a, b, c, d) {
  return [a, b, c, d];
});
debugger;
fn1("a", "b")("c")("d");

```html
fn("a","b")
curry(sub_curry.apply(this, combined), length - arguments.length)
执行curry函数 ==》fn函数(参数)为
 fn:function() {
    return fn.apply(this, args.concat([].slice.call(arguments)));
  }
curry函数返回 return function(){}也就是fn1
再执行fn1("c") 执行执行curry函数 ==》fn函数(参数)为
fn:function(){
    return( function(){
         return fn.apply(this, args.concat([].slice.call(arguments)));
    }).apply(this, args.concat([].slice.call(arguments)))
}
curry函数返回 return function(){}也就是fn1
再执行fn1("d")
执行fn.apply(this, arguments)
fn:
fn:function(){
    return( function(){
         return fn.apply(this, args.concat([].slice.call(arguments)));
    }).apply(this, args.concat([].slice.call(arguments)))
}
执行这个fn  实际就是执行两个闭包 然后闭包 闭包的存下意义就是保存变量
````

##再谈闭包
闭包你确实可以认为是函数 因为它本来就是个函数 我们的 fn 就是闭包但是闭包的存在意义就是保存函数的局部变量
闭包你可以认为是函数 来看个场景
A 函数调用执行一次 返回一个闭包 B A 函数再执行一次返回 c 注意根据上下文的知识点 函数执行都是新开一个上下文栈 如果存在闭包 该函数上下文栈的变量对象不会销毁，保留下来 ，你再执行一次函数 不会影响到这个变量对象 因为它再新开个执行上下文栈 ------->所以理解函数执行上下文栈真的很重要

通过闭包将参数集中起来计算
用闭包把传入参数保存起来，当传入参数的数量足够执行函数时，就开始执行业务逻辑函数

## 柯里化第二种写法

```javascript
function curry(fn, args) {
    var length = fn.length;

  // 存放参数
    args = args || [];

    return function() {
       // 第一个参数可能为函数
       // 拿到存放的参数去掉第一个
        var _args = args.slice(0),

            i;

        for (i = 0; i < arguments.length; i++) {


            _args.push(arguments[i];);

        }
        if (_args.length < length) {
            // 递归
            return curry.call(this, fn, _args);
        }
        else {
            return fn.apply(this, _args);
        }
    }
}


var fn = curry(function(a, b, c) {
    console.log([a, b, c]);
});
debugger
fn("a", "b")("c") // ["a", "b", "c"]

```

## 柯里化的作用

也就是说柯里化可以减少代码的重复性
当我们传入的参数有重复的 就可以用柯里化 柯里化----就是跟参数挂钩的 357

## 闭包和递归的配合

## 词法作用域

函数在哪里声明注定了函数的作用域链 函数的引用并不能改变其作用域链

嵌套用组合的思想方式 来实现 ---统计才让人好区分 嵌套太深烧脑





## 面向对象

建议大家根据我提供的思维方式，多多尝试封装一些组件。比如封装一个弹窗，封装一个循环轮播等。练得多了，面向对象就不再是问题了。这种思维方式，在未来任何时候都是能够用到的。

