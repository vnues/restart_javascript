Proxy 用于修改某些操作的默认行为，等同于在语言层面做出修改，所以属于一种“元编程”（meta programming），即对编程语言进行编程。

Proxy 可以理解成，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。Proxy 这个词的原意是代理，用在这里表示由它来“代理”某些操作，可以译为“代理器”。

数据监听变化 我们怎么知道 原来就是这个拦截器

我们或多或少都听过“数据绑定”这个词，“数据绑定”的关键在于监听数据的变化，可是对于这样一个对象：var obj = {value: 1}，我们该怎么知道 obj 发生了改变呢？
// https://juejin.im/post/5be4f7cfe51d453339084530 这篇很不错

当程序查询存取器属性的值时，JavaScript 调用 getter 方法。这个方法的返回值就是属性存取表达式的值。当程序设置一个存取器属性的值时，JavaScript 调用 setter 方法，将赋值表达式右侧的值当做参数传入 setter。从某种意义上讲，这个方法负责“设置”属性值。可以忽略 setter 方法的返回值。 setter🈶 返回值 return 意义不大 可以忽略

### Proxy

使用 defineProperty 只能重定义属性的读取（get）和设置（set）行为，到了 ES6，提供了 Proxy，可以重定义更多的行为，比如 in、delete、函数调用等更多行为。

所以估计 vue3.0 会用 Proxy 属性去重构

Object.defineProperty 是对属性进行操作 ----- 这样也就提供了拦截监听的方法

#### Reflect--->操作对象的

Reflect 是一个内置的对象，它提供拦截 JavaScript 操作的方法 全局对象 可以提升自己的逼格写法了

Proxy 是构造函数|对象 -->类

### string 和 String 的类型