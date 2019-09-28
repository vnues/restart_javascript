## DOM 事件

> 实际上，只要我们曾经在 DOM 节点上面绑定过事件函数，那我们就曾经使用过发布—订阅
> 模式

```javascript
document.body.addEventListener(
  "click",
  function() {
    alert(2);
  },
  false
);
document.body.click(); // 模拟用户点击
```

这里的发布者就是 body,当 dom 节点被点击时候，body 节点就会向订阅者这发布这个消息
而订阅者可以有多个 然后按照文章所说的 订阅者就会通过回调函数去订阅消息
，购房者不知道房子什么时候开售，于是他在订阅消息后等
待售楼处发布消息。

注意，手动触发事件更好的做法是 IE 下用 fireEvent，标准浏览器下用 dispatchEvent 实现。❗️❗️❗️

### 如何自定义事件

> 除了 DOM 事件，我们还会经常实现一些自定义的事件，这种依靠自定义事件完成的发布—
> 订阅模式可以用于任何 JavaScript 代码中。

```javascript
var salesOffices = {}; // 定义售楼处
salesOffices.clientList = []; // 缓存列表，存放订阅者的回调函数
salesOffices.listen = function(fn) {
  // 增加订阅者
  this.clientList.push(fn); // 订阅的消息添加进缓存列表
};
// 一发布消息就去触发（也就是通知）回调函数（订阅者）
salesOffices.trigger = function() {
  // 发布消息
  for (var i = 0, fn; (fn = this.clientList[i++]); ) {
    fn.apply(this, arguments); // (2) // arguments 是发布消息时带上的参数
  }
};
```

### 增加消息 key 类型约束

但是这有一点不好的地方就是什么消息都会通知给订阅者 用 key 代表消息类型进行约束

```javascript
var salesOffices = {}; // 定义售楼处
salesOffices.clientList = {}; // 缓存列表，存放订阅者的回调函数
salesOffices.listen = function(key, fn) {
  if (!this.clientList[key]) {
    // 如果还没有订阅过此类消息，给该类消息创建一个缓存列表
    this.clientList[key] = [];
  }
  this.clientList[key].push(fn); // 订阅的消息添加进消息缓存列表
};
salesOffices.trigger = function() {
  // 发布消息
  // salesOffices.trigger( 'squareMeter88', 2000000 ) argument类数组
  // 区出key类型
  var key = Array.prototype.shift.call(arguments), // 取出消息类型
    fns = this.clientList[key]; // 取出该消息对应的回调函数集合
  // 增加这步逻辑判断
  if (!fns || fns.length === 0) {
    // 如果没有订阅该消息，则返回
    return false;
  }
  for (var i = 0, fn; (fn = fns[i++]); ) {
    fn.apply(this, arguments); // (2) // arguments 是发布消息时附送的参数
  }
};
salesOffices.listen("squareMeter88", function(price) {
  // 小明订阅 88 平方米房子的消息
  console.log("价格= " + price); // 输出： 2000000
});
salesOffices.listen("squareMeter110", function(price) {
  // 小红订阅 110 平方米房子的消息
  console.log("价格= " + price); // 输出： 3000000
});
salesOffices.trigger("squareMeter88", 2000000); // 发布 88 平方米房子的价格
salesOffices.trigger("squareMeter110", 3000000); // 发布 110 平方米房子的价格
```

### 发布－订阅模式的通用实现

有没有办法可以让所有对象都拥有发布—订阅功能呢？

```javascript
var event = {
  clientList: [],
  listen: function(key, fn) {
    if (!this.clientList[key]) {
      this.clientList[key] = [];
    }
    this.clientList[key].push(fn); // 订阅的消息添加进缓存列表
  },
  trigger: function() {
    var key = Array.prototype.shift.call(arguments), // (1);
      fns = this.clientList[key];
    if (!fns || fns.length === 0) {
      // 如果没有绑定对应的消息
      return false;
    }
    for (var i = 0, fn; (fn = fns[i++]); ) {
      fn.apply(this, arguments); // (2) // arguments 是 trigger 时带上的参数
    }
  }
};
```

再定义一个 installEvent 函数，这个函数可以给所有的对象都动态安装发布—订阅功能：

```javascript
var installEvent = function(obj) {
  for (var i in event) {
    obj[i] = event[i];
  }
};
```

原型对象的继承实际是拷贝 我们应该是需要那种拷贝的 所以要是给我做我会挂载到对象中 this.event=xxx 但是你这种实现是实现对象的属性拥有订阅-发布功能

而不是对象用于订阅-发布功能

再来测试一番，我们给售楼处对象 salesOffices 动态增加发布—订阅功能:

```javascript
var salesOffices = {};
installEvent(salesOffices);
salesOffices.listen("squareMeter88", function(price) {
  // 小明订阅消 console.log( '价格= ' + price );
});
salesOffices.listen("squareMeter100", function(price) {
  // 小红订阅 console.log( '价格= ' + price );
});
salesOffices.trigger("squareMeter88", 2000000); // 输出：2000000
salesOffices.trigger("squareMeter100", 3000000); // 输出：3000000
```

### 取消订阅的事件
> 有时候，我们也许需要取消订阅事件的功能。比如小明突然不想买房子了，为了避免继续接
收到售楼处推送过来的短信，小明需要取消之前订阅的事件。现在我们给 event 对象增加 remove
方法：
```javascript
event.remove = function(key, fn) {
  // 找到订阅类型 -->里面包含的回调函数
  var fns = this.clientList[key];
  if (!fns) {
    // 如果 key 对应的消息没有被人订阅，则直接返回
    return false;
  }
  if (!fn) {
    // 如果没有传入具体的回调函数，表示需要取消 key 对应消息的所有订阅
    fns && (fns.length = 0);
    // 这里应该要return吧
  } else {
    for (var l = fns.length - 1; l >= 0; l--) {
      // 通过splice去删除 会直接影响原数组
      // 反向遍历订阅的回调函数列表
      var _fn = fns[l];
      if (_fn === fn) {
        fns.splice(l, 1); // 删除订阅者的回调函数
      }
    }
  }
};
var salesOffices = {};
var installEvent = function(obj) {
  for (var i in event) {
    obj[i] = event[i];
  }
};
installEvent(salesOffices);
salesOffices.listen(
  "squareMeter88",
  (fn1 = function(price) {
    // 小明订阅消息
    console.log("价格= " + price);
  })
);
salesOffices.listen(
  "squareMeter88",
  (fn2 = function(price) {
    // 小红订阅消息
    console.log("价格= " + price);
  })
);
salesOffices.remove("squareMeter88", fn1); // 删除小明的订阅
salesOffices.trigger("squareMeter88", 2000000); // 输出：2000000
```


vue的发布和订阅就是自定义事件  自己实现的

### 发布-订阅的应用（网站登录）

> 就一个电商网站来说，我登录了支付模块可能需要刷新 购物车模块也是需要刷新 那么这刚好就是适合发布-订阅的应用 只要我们登录模块发布消息就行，其他模块只要订阅就行 内部处理我们不管 反正我们已经发布了 确实越说vue中的
发布-订阅思想就越浓厚


### 如何实现自定义事件

对象的自定义事件 上述已经实现


事件就是on emit off <----上述的listen trigger remove