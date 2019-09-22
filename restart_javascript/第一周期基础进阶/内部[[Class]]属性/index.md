###[[Class]]属性

每个类内部都有一个[[Class]]属性 而这个属性可以检查是属于什么类型 像构造函数都属于函数类型

### 作用域安全的构造函数

```javascript
function Polygon(sides) {
  if (this instanceof Polygon) {
    this.sides = sides;
    this.getArea = function() {
      return 0;
    };
  } else {
    return new Polygon(sides);
  }
}

function Rectangle(width, height) {
  //  name = "qe";   这种是函数运行正常执行 并不会被实例化对象继承
  console.log(this); // 前提进行new操作时候打印出来就是实例化的rect
  // window.a==....
  // 这样a的属性是不会被继承 又没有通过this绑定a属性 当然继承不了
  a = Polygon.call(this, 2); // Polygon.call意思是对Polygon的this操作 然后执行这个函数
  this.width = width;
  this.height = height;
  this.getArea = function() {
    return this.width * this.height;
  };
}

var rect = new Rectangle(5, 10); // 也就是new操作的时候构造函数的里面this指向实例对象 类class也是
console.log(rect.sides);
```

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

### Polygon.call

Polygon.call 意思是对 Polygon 函数里面的 this 进行操作
Polygon.call ()然后执行这个函数

`构造函数内部属性如果没有绑定 this 是不会被继承的 也就是继承实际就是通过 this 关键作用 如果直接 name="vnues"那就是相当于正常的函数执行 而且这样执行在非严格模式下还是相当于声明全局变量`

- 通过这个例子让我加强了 this 在 new 操作符的执行 其实就是可以死记就是当进行 new 操作时候，构造的函数的 this 就是实例化对象

- 这个例子让我更加明白 call apply 就是 a.call 这样使用就是改变 a 函数的 this ----->这样子理解

- 实例化函数继承构造函数自定义属性实际就是通过 this 绑定属性来实现的 理解这点很重要 可以通过这样在构造函数添加 name="vnues"这段代码进行比较理解

- 但是在 Class 这种添加 name="vnues"不一样的 一个是类 一个是构造函数
  Class 的用法和构造函数的用法区别开来

### 构造函数窃取

###作用域安全的构造函数 ---->让 this 正确指向为 obj 实例化对象
