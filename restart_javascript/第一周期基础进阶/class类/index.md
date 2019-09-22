## class

ES6 的类，完全可以看作构造函数的另一种写法。

## constructor 方法

constructor 方法是类的默认方法，通过 new 命令生成对象实例时，自动调用该方法。一个类必须有 constructor 方法，如果没有显式定义，一个空的 constructor 方法会被默认添加。

上面代码中，定义了一个空的类 Point，JavaScript 引擎会自动为它添加一个空的 constructor 方法。

constructor 方法默认返回实例对象（即 this），完全可以指定返回另外一个对象。

类必须使用 new 调用，否则会报错。这是它跟普通构造函数的一个主要区别，后者不用 new 也可以执行。

### 对象的属性或者方法

与 ES5 一样，实例的属性除非显式定义在其本身（即定义在 this 对象上），否则都是定义在原型上（即定义在 class 上）。

```javascript
//定义类
class Point {
  // 但是属性这样写？
  name = "vnues";
  constructor(x, y) {
    this.x = x;
    this.y = y;
    // 只能写在这里
    this.alert = function() {
      console.log("call");
    };
  }
  // 这样写是挂载到原型上去
  toString() {
    return "(" + this.x + ", " + this.y + ")";
  }
  toCall() {
    console.log("call");
  }

  //  写在这里 这样写会报错
  //   this.alert=function(){
  //             console.log("call")

  //   }
}

var point = new Point(2, 3);

point.toString(); // (2, 3)

point.hasOwnProperty("x"); // true
point.hasOwnProperty("y"); // true
point.hasOwnProperty("toString"); // false
point.__proto__.hasOwnProperty("toString"); // true
```

## 取值函数（getter）和存值函数（setter）

与 ES5 一样，在“类”的内部可以使用 get 和 set 关键字，对某个属性设置存值函数和取值函数，拦截该属性的存取行为

```javascript
class MyClass {
  constructor() {
    // ...
  }
  get prop() {
    return "getter";
  }
  set prop(value) {
    console.log("setter: " + value);
  }
}

let inst = new MyClass();

inst.prop = 123;
// setter: 123

inst.prop;
// 'getter'
```

上面代码中，prop 属性有对应的存值函数和取值函数，因此赋值和读取行为都被自定义了。

存值函数和取值函数是设置在属性的 Descriptor 对象上的。

constructor 构造函数

属性不管怎么写还是 this.name 还是 name="vnues"都是挂载在类上
方法则不一样 不通过 this 显示声明就挂载到原型上

### constructor 的用处

constructor 属性是一个指针，指向创建此对象的函数

## super 关键字

> super 关键字用于访问和调用一个对象的父对象上的函数。

```javascript
super([arguments]);

// 调用 父对象/父类 的构造函数

// 调用 父对象/父类 上的方法

super.functionOnParent([arguments]);
```

super()代表调用父类的构造函数

> 在构造函数中使用时，super 关键字将单独出现，并且必须在使用 this 关键字之前使用。super 关键字也可以用来调用父对象上的函数。

## 属性名表达式

```javascript
// 方法二
obj["a" + "bc"] = 123;
```
