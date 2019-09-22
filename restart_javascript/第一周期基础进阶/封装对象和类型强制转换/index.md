通过构造函数实例出来的常量变成了对象，其实就是手动创建其封装对象，封装对象上存在对应的数据类型方法。我们在使用常量的方式直接访问属性和方法时，javascript 会自动为你包装一个封装对象,相当于上面我们手动包装在操作属性或方法完成之后 JavaScript 也会释放当前封装对象

一般情况下，我们不需要直接使用封装对象，最好是让 JavaScript 引擎自动选择什么时候应该使用封装对象，换句话说，就是应该优先考虑使用'abc'和 42 这样的原始类型值，而非 new String(‘abc’)和 new Number(42)

通过构造函数实例出来的常量变成了对象，其实就是手动创建其封装对象，封装对象上存在对应的数据类型方法。我们在使用常量的方式直接访问属性和方法时，javascript 会自动为你包装一个封装对象,相当于上面我们手动包装在操作属性或方法完成之后 JavaScript 也会释放当前封装对象

```javascript
var test = "abc";
test.len = 123; // 引用test.len赋值完后 马上销毁了对象变回基本数据类型
var t = test.len; // 为什么不报错
console.log(t);
```

基本数据类型 a ------>基本数据类型不存在属性，但是你一旦使用 a.len 或者 a.b 这样去访问属性，就会转化为对象 去找 而且它引用完就马上销毁了

举例子 🌰：

```javascript
var num = 123;
//1
num.toString(); // "123"

//2
num + ""; //"123"var num = 123;
//1
num.toString(); // "123"

//2
num + ""; //"123"
```

第一个，num.toString()时，把 num 常量通过内部[[class]]生成临时的封装对象，再调用对象 toString 方法，返回转换完成的字符串.

### 强制类型转换

> 封装对象与类型转换有很大关联，我们只有弄懂封装对象的概念，才能更好的理解类型转换，还有之后的相等比较与恒等比较。

#### 本质

### 隐式强制类型转换

### toString

> 规范的 9.8 节中定义了抽象操作 ToString，它负责处理非字符串到字符串的强制类型转换。
> var obj = {};
> obj.toString() //"[object Object]"

> (字面量)普通对象除非自定义，否则它会返回对象内部的[[Class]]属性.

数组的 toString 自己肯定改写了

```javascript
/*
原生具备 Iterator 接口的数据结构如下。

Array
Map
Set
String
TypedArray
函数的 arguments 对象
NodeList 对象
*/
let name = "vnues";
for (key of name) {
  //  console.log(key)
  console.log(name[key]);
}
console.log(typeof name);
```

### 属性都用[[]]包起来表示 [[Class]]

### 内部属性 [[Class]]

> 所有 typeof 返回值为 "object" 的对象（如数组）都包含一个内部属性 [[Class]]（我们可
> 以把它看作一个内部的分类，而非传统的面向对象意义上的类）。这个属性无法直接访问，
> 一般通过 Object.prototype.toString(..) 来查看

为什么通过 Object.prototype.toString ==>打印出来的是这个样子 [Object object]这个格式 是因为访问了内部属性 Class 的属性值 返回的格式才这样
数组的内部 [[Class]] 属性值是 "Array"，

所以通过这方法 toSting 可以访问内部属性的属性值 然后其他对象可能重写了这个方法 所以我们还是用 Object 对象的 toString 方法

### 强制类型转换

JavaScript 中的强制类型转换总是返回标量基本类型值（参见第 2 章），如字
符串、数字和布尔值，不会返回对象和函数

#### ToNumber

#### ToString

#### ToBoolean

显示转换的写法：和前面讲过的 + 类似，一元运算符 ! 显式地将值强制类型转换为布尔值。但是它同时还将
真值反转为假值（或者将假值反转为真值）。所以显式强制类型转换为布尔值最常用的方
66 ｜ 第 4 章
法是 !!，因为第二个 ! 会将结果反转回原值：

❗️❗️❗️ 建议使用 Boolean(a) 和 !!a 来进行显式强制类型转换

从内部属性[[Class]]--->到封装对象--->类型强制转换

解决我那个 for...of...的问题啦 真的是碰巧遇到这个概念

for..of...遍历也会触发对象封装的包装操作

还是先 review vue 源代码吧哈哈哈哈哈

博客得总结 书籍放在那里 不懂就查 有时间就去读下 因为痛点我们有时候都没遇到过

你不知道的 javascript 读者真难 不过写文章可以摘抄 慢慢来吧一步一步执行
