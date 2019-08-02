> Object.create()方法创建一个新对象，使用现有的对象来提供新创建的对象的__proto__。 （请打开浏览器控制台以查看运行结果。）


```javascript

const person = {
  isHuman: false,
  printIntroduction: function () {
    console.log(`My name is ${this.name}. Am I human? ${this.isHuman}`);
  }
};

const me = Object.create(person);

me.name = "Matthew"; // "name" is a property set on "me", but not on "person"
me.isHuman = true; // inherited properties can be overwritten

me.printIntroduction();
// expected output: "My name is Matthew. Am I human? true"


function Person(){
   this.alert=function(){
      console.log("vnues")
   }
   Person.sound=function(){
      console.log("sound")
   }
}

let person = Object.create(Person)
console.log(person)
//person.alert()
console.log(person.alert)
console.log(person.__proto__)


function Animal(){
    this.alert=function(){
      console.log("vnues")
   }
}
console.log(Animal.prototype)
console.log(Animal.prototype.constructor)

```

### 什么是可枚举属性?


### 单继承

```javascript
// Shape - 父类(superclass)
function Shape() {
  this.x = 0;
  this.y = 0;
}

// 父类的方法
Shape.prototype.move = function(x, y) {
  this.x += x;
  this.y += y;
  console.info('Shape moved.');
};

// Rectangle - 子类(subclass)
function Rectangle() {
  Shape.call(this); // call super constructor.
}

// 子类续承父类
Rectangle.prototype = Object.create(Shape.prototype);
// Rectangle.prototype.constructor = Rectangle;

console.log(Rectangle.prototype.constructor)
Rectangle.prototype.constructor = Rectangle;
console.log(Rectangle.prototype.constructor)

var rect = new Rectangle();

console.log('Is rect an instance of Rectangle?',
  rect instanceof Rectangle); // true
console.log('Is rect an instance of Shape?',
  rect instanceof Shape); // true
rect.move(1, 1); // Outputs, 'Shape moved.'
```

```javascript
var nativeCreate = Object.create;

// ...

// Ctor: 亦即constructor的缩写，这个空的构造函数将在之后广泛用于对象创建,
// 这个做法是出于性能上的考虑，避免每次调用`baseCreate`都要创建空的构造函数
var Ctor = function () {};

// ....

/**
 * 创建一个对象，该对象继承自prototype
 * 并且保证该对象在其原型上挂载属性不会影响所继承的prototype
 * @param {object} prototype
 */
var baseCreate = function (prototype) {
  debugger
    if (!_.isObject(prototype)) return {};
    // 如果存在原生的创建方法（Object.create），则用原生的进行创建
    if (nativeCreate) return nativeCreate(prototype);
    // 利用Ctor这个空函数，临时设置对象原型
    Ctor.prototype = prototype;
    // 创建对象，result.__proto__ === prototype
    var result = new Ctor;
    // 还原Ctor原型
    // Ctor.prototype = null;
    return result;
};
```

 var deepGet = function(obj, path) {
    var length = path.length;
    for (var i = 0; i < length; i++) {
      // 写判断你有没有发现 return代表else 这种写法比if else这样拆分更好
      if (obj == null) return void 0;
      obj = obj[path[i]];
    }
    return length ? obj : void 0;
  };



 >  使用这个函数，可以避免深层次取值时，因为没有其中的一个属性，导致的报错。

深层次取值时候 可能会报错 



### 什么是面向对象风格



## map代替字面量对象  其它语言中没有像js那样提供字面量对象 都是用Map



有必要重刷一波es6