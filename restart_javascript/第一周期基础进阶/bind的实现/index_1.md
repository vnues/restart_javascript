# 函数式编程之bind函数实现


### 前言

> 我们在开发中总会碰到`this`绑定问题，常常用到的就是bind绑定this或者箭头函数来处理，那么我们自己实现bind函数



### 定义

> MDN是这样定义的：bind()方法创建一个新的函数，在bind()被调用时，这个新函数的this被bind的第一个参数指定，其余的参数将作为新函数的参数供调用时使用。


举个例子🌰：

```javascript
let module = {
  x: 42,
  getX: function() {
    return this.x;
  }
}
let unboundGetX = module.getX;
console.log(unboundGetX());
// expected output: undefined

let boundGetX = unboundGetX.bind(module);
console.log(boundGetX());
// expected output: 42

```

bind最难的就是如何处理返回的参数是构造函数的情况  所以还是从基础一步一步抓起吧

嗯还是从基础再开始梳理一遍 发现了难度


