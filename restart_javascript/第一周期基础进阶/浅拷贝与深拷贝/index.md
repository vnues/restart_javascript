hasOwnProperty() 方法会返回一个布尔值，指示对象自身属性中是否具有指定的属性（也就是是否有指定的键）

所有继承了 Object 的对象都会继承到 hasOwnProperty 方法。这个方法可以用来检测一个对象是否含有特定的自身属性；和 in 运算符不同，该方法会忽略掉那些从原型链上继承到的属性。

不会去找原型链的对象属性

for ...in...循环加递归去实现浅拷贝 for...in...会循环拿到原型链可枚举的属性

```javascript
var deepCopy = function(obj) {
  if (typeof obj !== "object") return;
  var newObj = obj instanceof Array ? [] : {};
  for (var key in obj) {
    // 这段话的意思是Key值可能是原型链上的 而obj不一定具有
    // 所以明确就是原型链上的对象key值 hasOwnProperty去判断会认为不是它具有的
    if (obj.hasOwnProperty(key)) {
      newObj[key] = typeof obj[key] === "object" ? deepCopy(obj[key]) : obj[key];
    }
  }
  return newObj;
};
```

### for...in.. 与 for...of...

突然想到我们 json 是一种数据格式 也有 json 对象这么说法===>{"name":"vnues","age":"22"} 跟我们 js 的字面量对象区分开来

```javascript
let person = {
  name: "vnues",
  age: 22
};
console.log(person); // 当然有原型链上的属性 来遍历试试

for (key in person) {
  console.log(key);
}

// 当使用for...of循环遍历某种数据结构时，该循环会自动去寻找 Iterator 接口。 string类型能遍历
//  一种数据结构只要部署了 Iterator 接口，我们就称这种数据结构是“可遍历的”（iterable）。
// Array
// Map
// Set
// String ---->  string基本数据类型也可以用吗
// TypedArray
// 函数的 arguments 对象
// NodeList 对象
for (let key of person) {
  console.log(key);
}

for (let key in "vnues") {
  console.log(key);
}
let a = "123";
console.log(a instanceof String); // false
// 涉及到内置类String与字符串  字符串是 JavaScript 的一种基本的数据类型。
typeof a; // string
```

```javascript
Array.prototype.getLength = function() {
  return this.length;
};
var arr = ["a", "b", "c"];
arr.name = "June";
Object.defineProperty(arr, "age", {
  enumerable: true,
  value: 17,
  writable: true,
  configurable: true
});
for (var i in arr) {
  console.log(i); // 0,1,2,name,age,getLength
}
```

所以还是用 for..of..好 但是 需要的前提是 iterator 接口 所以普通 js 对象遍历不了

也就是如果以后用 for...in..循环遍历对象得这样写
#### 
```javascript
for(key in obj){
    // hasOwnProperty需要接收一个参数  注意习惯call方法  --->整体就是个函数调用   参数 参数 参数！！！
     if(Object.prototype.hasOwnProperty.call(obj,key)){
   
     }
}
```
