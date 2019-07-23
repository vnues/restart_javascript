早上想起来有疑惑就论证了一下
想起怎么去引用构造函数里面的方法
相当于 执行一个函数 Constructor.apply(obj, arguments) 为 obj 添加属性 这样的操作

apply 还是一样 你要习惯这种写法 就是调用函数同时改变 this 指向而已 所以说明构造函数会执行一遍 假设你有在里面调用函数就会出现打印的结果
也就是 new 操作 会执行一次构造函数这个过程得了解

我们单单只是执行一次构造函数而已 问题突然来了 为什么要执行这次构造函数

真正要做到的事 是让 obj 对象去继承属性和方法 也就是让 obj 拥有这些属性和方法

因为 new 的结果是一个新对象

首先，我们要知道，创建一个用户自定义对象需要两步：

通过编写函数来定义对象类型。
通过 new 来创建对象实例。

new 运算符创建一个用户定义的对象类型的实例或具有构造函数的内置对象的实例。new 关键字会进行如下的操作：

创建一个空的简单 JavaScript 对象（即{}）；
链接该对象（即设置该对象的构造函数）到另一个对象 ；
将步骤 1 新创建的对象作为 this 的上下文 ；
如果该函数没有返回对象，则返回 this。

```javascript
function Otaku(name, age) {
  this.name = name;
  this.age = age;

  this.habit = "Games";
}

function objectFactory() {
  // var obj = new Object(),
  // 等价于
  let obj = {}; // 其实有个问题 因为我们本身就是去实现new操作符 还要用它 这不是有问题吗

  Constructor = [].shift.call(arguments);

  obj.__proto__ = Constructor.prototype;
  // 继承原型属性  你可能会问到 此时obj的原型可能Constructor.prototype执行的一样 但是此时如果加上Constructor.prototype.a=function(){}呢？对吧

  // Constructor.apply(obj, arguments); 这一步不加会打印出Otaku {} 不符合我们的预期
  // 首先注意Constructor是个函数 我们去执行它 也就是去执行它里面的代码，也就是
  // Constructor.apply(obj, arguments)
  // 我们执行了Constructor函数==>  this.name = name; this指向obj（obj是对象） 相当于 obj.name=name    一目了然  实际就是往对象添加属性的操作   Constructor.apply(obj, arguments)这个操作   实现方式是函数去执行这些表达式  至此new操作完美结束

  return obj;
}

let person = objectFactory(Otaku, "vnues", 12);

console.log(person);
```

又可以出沉淀自己的技术文章了 实际博文可以跟 MDN 的一样

## new 总结

所以我们在 new 总结的遗漏了这个总结：也就是 new 操作的时候构造函数的里面 this 指向实例对象 ------>类 class 也是

只要发生 new 操作 我们本能就应该想到这个 this 就是指向实例

我们自己实现一个 new 操作也是 就是用 obj 代表 this 所以脑海得记住
构造函数在 new 实例的时候 this 指向实例化对象 ---！！！很重要

```javascript
function objectFactory() {
  // var obj = new Object(),
  // 等价于
  let obj = {}; // 其实有个问题 因为我们本身就是去实现new操作符 还要用它 这不是有问题吗

  Constructor = [].shift.call(arguments);

  obj.__proto__ = Constructor.prototype;
  // 继承原型属性  你可能会问到 此时obj的原型可能Constructor.prototype执行的一样 但是此时如果加上Constructor.prototype.a=function(){}呢？对吧

  // Constructor.apply(obj, arguments); 这一步不加会打印出Otaku {} 不符合我们的预期
  // 首先注意Constructor是个函数 我们去执行它 也就是去执行它里面的代码，也就是
  // Constructor.apply(obj, arguments)
  // 我们执行了Constructor函数==>  this.name = name; this指向obj（obj是对象） 相当于 obj.name=name    一目了然  实际就是往对象添加属性的操作   Constructor.apply(obj, arguments)这个操作   实现方式是函数去执行这些表达式  至此new操作完美结束

  return obj;
}

let person = objectFactory(Otaku, "vnues", 12);

console.log(person);
```

Constructor = [].shift.call(arguments);
这一步就是把构造函数的 this 指向到实例对象 所以反过来我们在进行 new 操作的时候就应该想到构造函数的 this 指向就是构造实例 这样看 this 指向的时候就不会懵逼了

还有 this 指向本来就是动态的 具体看什么操作！！！

引申出对 this 这种缥缈不定的属性有 new apply call bind 可以操作
所以反过来就是想操作 this 的时候就应该想到 new apply call bind
