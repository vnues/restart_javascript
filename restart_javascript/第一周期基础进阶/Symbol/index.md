1. Symbol 函数前不能使用 new 命令，否则会报错。这是因为生成的 Symbol 是一个原始类型的值，不是对象。

为什么呢 都是函数 为什么不可以用 new?

```javascript
```

Symbol 函数可以接受一个字符串作为参数，表示对 Symbol 实例的描述，主要是为了在控制台显示，或者转为字符串时，比较容易区分

如果 Symbol 的参数是一个对象，就会调用该对象的 toString 方法，将其转为字符串，然后才生成一个 Symbol 值。

```javascript
function Person() {
  this.name = name;
}
console.log(Person.toString());
```

Symbol 跟属性操作符密切相关

Object 构造函数的方法 Object.defineProperty() 不会被继承 是 Object 的方法，Object.prototype...属性或者方法会被其他对象继承 突然注意到这句 构造函数也是 Function 的实例化对象 也是继承 Function 函数 是吗 是它的实例化对象 吗 不是单单引用它的原型 ？？ 稍会证明下

```javascript
function Person() {
  this.name = "vnues";
}
console.log(Person instanceof Function); // true
```

Function 构造函数 创建一个新的 Function 对象。 在 JavaScript 中, 每个函数实际上都是一个 Function 对象。 也就是构造实例 所以 不深究了 知道就行

所以提过的问题就是 内部已经实现 new 操作了吗？ 我觉得是 所以上述结论成立 来继续搞描述符相关的东西

Object.defineProperty() 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性， 并返回这个对象

Javascript 系列 复制也是一个大知识 涉及到深浅拷贝 不是一个 copy 函数就可以解决完的
我们总是遇到问题才会去翻知识 理解 这种的进步更大 那么前提来了 怎么让自己遇到这些问题 开发吧 还有面试题

## 属性操作符 对属性的描述 ---- 是否允许 crud

> 现在看来 对对个稍微抽象的概念理解起来没有那么有难度了

对象里目前存在的属性描述符有两种主要形式：数据描述符和存取描述符。数据描述符是一个具有值的属性，该值可能是可写的，也可能不是可写的。存取描述符是由 getter-setter 函数对描述的属性。描述符必须是这两种形式之一；不能同时是两者

Object.defineProperty()是修改对象属性的
